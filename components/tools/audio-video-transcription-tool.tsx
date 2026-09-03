'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, ShieldCheck, X } from 'lucide-react';
import { FileUploadDropzone } from '@/components/shared/file-upload-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { TranscriptionExportMenu } from '@/components/tools/transcription-export-menu';
import { TranscriptionMediaPreview } from '@/components/tools/transcription-media-preview';
import { TranscriptionProgressView } from '@/components/tools/transcription-progress';
import { TranscriptSegments } from '@/components/tools/transcript-segments';
import { useTranscription } from '@/hooks/use-transcription';
import { TOOL_ID, trackEvent } from '@/lib/analytics';
import { type AppLocale } from '@/lib/i18n/config';
import { formatBytes } from '@/lib/file-size';
import { LANGUAGE_OPTION_LABELS, SUPPORTED_LANGUAGE_CODES } from '@/lib/transcription/languages';
import { formatClockTime } from '@/lib/transcription/timestamps';
import type {
  TranscriptionErrorType,
  TranscriptionLanguageOption,
  TranscriptionQuality,
  TranscriptionTask,
} from '@/lib/transcription/transcription-types';
import type { TranscriptExportFormat } from '@/lib/transcription/exporters';

type AudioVideoTranscriptionToolProps = Readonly<{
  locale?: AppLocale;
}>;

type ToolUi = {
  privacyNote: string;
  filesLabel: string;
  filesHint: string;
  fileInfo: (type: string, size: string, duration: string) => string;
  qualityLabel: string;
  qualityFast: string;
  qualityBalanced: string;
  qualityHigh: string;
  languageLabel: string;
  taskLabel: string;
  taskTranscribe: string;
  taskTranslate: string;
  startButton: string;
  cancelButton: string;
  removeFileButton: string;
  webgpuOn: string;
  webgpuOff: string;
  detectedLanguage: (language: string) => string;
  textTab: string;
  segmentsTab: string;
  cancelledNote: string;
  errorRetry: string;
};

const uiByLocale: Record<AppLocale, ToolUi> = {
  'pt-br': {
    privacyNote:
      'Seu arquivo e processado localmente no seu dispositivo e nao e enviado aos nossos servidores. Apenas os arquivos do modelo de IA sao baixados (uma vez, com cache) para rodar a transcricao no navegador.',
    filesLabel: 'Audio ou video para transcrever',
    filesHint: 'Aceita MP3, WAV, M4A, AAC, OGG, OPUS, FLAC, MP4, MOV, WEBM, MKV e outros formatos.',
    fileInfo: (type, size, duration) => `${type} - ${size} - ${duration}`,
    qualityLabel: 'Qualidade',
    qualityFast: 'Rapido',
    qualityBalanced: 'Equilibrado (recomendado)',
    qualityHigh: 'Alta qualidade',
    languageLabel: 'Idioma do audio',
    taskLabel: 'Modo',
    taskTranscribe: 'Transcrever',
    taskTranslate: 'Traduzir para ingles',
    startButton: 'Transcrever',
    cancelButton: 'Cancelar',
    removeFileButton: 'Remover arquivo',
    webgpuOn: 'Aceleracao por GPU (WebGPU) disponivel neste dispositivo.',
    webgpuOff:
      'WebGPU indisponivel neste navegador/dispositivo. Usando processamento por CPU (mais lento).',
    detectedLanguage: (language) => `Idioma: ${language}`,
    textTab: 'Texto',
    segmentsTab: 'Segmentos',
    cancelledNote: 'Transcricao cancelada.',
    errorRetry: 'Tentar novamente',
  },
  en: {
    privacyNote:
      'Your file is processed locally on your device and is never uploaded to our servers. Only the AI model files are downloaded (once, then cached) to run transcription in the browser.',
    filesLabel: 'Audio or video to transcribe',
    filesHint: 'Accepts MP3, WAV, M4A, AAC, OGG, OPUS, FLAC, MP4, MOV, WEBM, MKV and more.',
    fileInfo: (type, size, duration) => `${type} - ${size} - ${duration}`,
    qualityLabel: 'Quality',
    qualityFast: 'Fast',
    qualityBalanced: 'Balanced (recommended)',
    qualityHigh: 'High quality',
    languageLabel: 'Audio language',
    taskLabel: 'Mode',
    taskTranscribe: 'Transcribe',
    taskTranslate: 'Translate to English',
    startButton: 'Transcribe',
    cancelButton: 'Cancel',
    removeFileButton: 'Remove file',
    webgpuOn: 'GPU acceleration (WebGPU) available on this device.',
    webgpuOff: 'WebGPU unavailable on this browser/device. Using CPU processing (slower).',
    detectedLanguage: (language) => `Language: ${language}`,
    textTab: 'Text',
    segmentsTab: 'Segments',
    cancelledNote: 'Transcription cancelled.',
    errorRetry: 'Try again',
  },
  es: {
    privacyNote:
      'Tu archivo se procesa localmente en tu dispositivo y no se envia a nuestros servidores. Solo los archivos del modelo de IA se descargan (una vez, con cache) para ejecutar la transcripcion en el navegador.',
    filesLabel: 'Audio o video para transcribir',
    filesHint: 'Acepta MP3, WAV, M4A, AAC, OGG, OPUS, FLAC, MP4, MOV, WEBM, MKV y mas.',
    fileInfo: (type, size, duration) => `${type} - ${size} - ${duration}`,
    qualityLabel: 'Calidad',
    qualityFast: 'Rapido',
    qualityBalanced: 'Equilibrado (recomendado)',
    qualityHigh: 'Alta calidad',
    languageLabel: 'Idioma del audio',
    taskLabel: 'Modo',
    taskTranscribe: 'Transcribir',
    taskTranslate: 'Traducir al ingles',
    startButton: 'Transcribir',
    cancelButton: 'Cancelar',
    removeFileButton: 'Quitar archivo',
    webgpuOn: 'Aceleracion por GPU (WebGPU) disponible en este dispositivo.',
    webgpuOff: 'WebGPU no disponible en este navegador/dispositivo. Usando procesamiento por CPU (mas lento).',
    detectedLanguage: (language) => `Idioma: ${language}`,
    textTab: 'Texto',
    segmentsTab: 'Segmentos',
    cancelledNote: 'Transcripcion cancelada.',
    errorRetry: 'Intentar de nuevo',
  },
  zh: {
    privacyNote:
      'Your file is processed locally on your device and is never uploaded to our servers. Only the AI model files are downloaded (once, then cached) to run transcription in the browser.',
    filesLabel: 'Audio or video to transcribe',
    filesHint: 'Accepts MP3, WAV, M4A, AAC, OGG, OPUS, FLAC, MP4, MOV, WEBM, MKV and more.',
    fileInfo: (type, size, duration) => `${type} - ${size} - ${duration}`,
    qualityLabel: 'Quality',
    qualityFast: 'Fast',
    qualityBalanced: 'Balanced (recommended)',
    qualityHigh: 'High quality',
    languageLabel: 'Audio language',
    taskLabel: 'Mode',
    taskTranscribe: 'Transcribe',
    taskTranslate: 'Translate to English',
    startButton: 'Transcribe',
    cancelButton: 'Cancel',
    removeFileButton: 'Remove file',
    webgpuOn: 'GPU acceleration (WebGPU) available on this device.',
    webgpuOff: 'WebGPU unavailable on this browser/device. Using CPU processing (slower).',
    detectedLanguage: (language) => `Language: ${language}`,
    textTab: 'Text',
    segmentsTab: 'Segments',
    cancelledNote: 'Transcription cancelled.',
    errorRetry: 'Try again',
  },
};

const ERROR_MESSAGES: Record<AppLocale, Partial<Record<TranscriptionErrorType, string>> & { default: string }> = {
  'pt-br': {
    default: 'Nao foi possivel concluir a transcricao. Tente novamente.',
    no_audio_track: 'Nao encontramos uma faixa de audio valida neste arquivo.',
    unsupported_format: 'Este formato de arquivo nao e suportado.',
    corrupted_file: 'O arquivo parece estar corrompido ou ilegivel.',
    decode_failed: 'Nao foi possivel decodificar o audio deste arquivo.',
    empty_file: 'O arquivo esta vazio.',
    zero_duration: 'O arquivo nao possui duracao de audio valida.',
    file_too_long: 'Este arquivo e muito longo para processar localmente no navegador.',
    webgpu_unavailable: 'A aceleracao por GPU falhou; tentando modo compativel (CPU).',
    model_load_failed: 'Nao foi possivel carregar o modelo de transcricao.',
    out_of_memory: 'O dispositivo ficou sem memoria disponivel para concluir a transcricao.',
    worker_error: 'O processo de transcricao falhou inesperadamente.',
  },
  en: {
    default: 'We could not finish the transcription. Please try again.',
    no_audio_track: 'We could not find a valid audio track in this file.',
    unsupported_format: 'This file format is not supported.',
    corrupted_file: 'The file appears to be corrupted or unreadable.',
    decode_failed: 'We could not decode the audio in this file.',
    empty_file: 'The file is empty.',
    zero_duration: 'The file does not have a valid audio duration.',
    file_too_long: 'This file is too long to process locally in the browser.',
    webgpu_unavailable: 'GPU acceleration failed; falling back to CPU mode.',
    model_load_failed: 'We could not load the transcription model.',
    out_of_memory: 'The device ran out of available memory to finish the transcription.',
    worker_error: 'The transcription process failed unexpectedly.',
  },
  es: {
    default: 'No fue posible completar la transcripcion. Intenta de nuevo.',
    no_audio_track: 'No encontramos una pista de audio valida en este archivo.',
    unsupported_format: 'Este formato de archivo no es compatible.',
    corrupted_file: 'El archivo parece estar corrupto o ilegible.',
    decode_failed: 'No fue posible decodificar el audio de este archivo.',
    empty_file: 'El archivo esta vacio.',
    zero_duration: 'El archivo no tiene una duracion de audio valida.',
    file_too_long: 'Este archivo es demasiado largo para procesar localmente en el navegador.',
    webgpu_unavailable: 'La aceleracion por GPU fallo; usando modo compatible (CPU).',
    model_load_failed: 'No fue posible cargar el modelo de transcripcion.',
    out_of_memory: 'El dispositivo se quedo sin memoria disponible para completar la transcripcion.',
    worker_error: 'El proceso de transcripcion fallo inesperadamente.',
  },
  zh: {
    default: 'We could not finish the transcription. Please try again.',
    no_audio_track: 'We could not find a valid audio track in this file.',
    unsupported_format: 'This file format is not supported.',
    corrupted_file: 'The file appears to be corrupted or unreadable.',
    decode_failed: 'We could not decode the audio in this file.',
    empty_file: 'The file is empty.',
    zero_duration: 'The file does not have a valid audio duration.',
    file_too_long: 'This file is too long to process locally in the browser.',
    webgpu_unavailable: 'GPU acceleration failed; falling back to CPU mode.',
    model_load_failed: 'We could not load the transcription model.',
    out_of_memory: 'The device ran out of available memory to finish the transcription.',
    worker_error: 'The transcription process failed unexpectedly.',
  },
};

const getErrorMessage = (locale: AppLocale, errorType: TranscriptionErrorType): string =>
  ERROR_MESSAGES[locale][errorType] ?? ERROR_MESSAGES[locale].default;

const acceptedMediaTypes =
  'audio/*,video/*,.mp3,.wav,.m4a,.aac,.ogg,.opus,.flac,.webm,.mp4,.mov,.mkv,.m4v,.avi';

const getFileTypeLabel = (file: File): string => {
  const subtype = file.type.split('/')[1];
  if (subtype) {
    return subtype.toUpperCase();
  }

  const extension = file.name.split('.').pop();
  return extension ? extension.toUpperCase() : 'FILE';
};

export function AudioVideoTranscriptionTool({ locale = 'pt-br' }: AudioVideoTranscriptionToolProps) {
  const ui = uiByLocale[locale];
  const languageLabels = LANGUAGE_OPTION_LABELS[locale];
  const t = useTranscription();
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const [resultTab, setResultTab] = useState<'text' | 'segments'>('text');
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (t.status === 'completed' && t.result) {
      trackEvent('tool_completed', {
        tool: TOOL_ID.audioVideoTranscription,
        locale,
        segments_count: t.result.segments.length,
        used_device: t.usedDevice ?? undefined,
      });
      hasStartedRef.current = false;
    }
  }, [locale, t.result, t.status, t.usedDevice]);

  useEffect(() => {
    if (t.status === 'error' && t.error) {
      trackEvent('tool_error', {
        tool: TOOL_ID.audioVideoTranscription,
        locale,
        error_type: t.error.errorType,
      });
      hasStartedRef.current = false;
    }
  }, [locale, t.error, t.status]);

  const handleFilesSelected = (files: File[]) => {
    const nextFile = files[0];
    if (!nextFile) {
      return;
    }

    t.selectFile(nextFile);
    trackEvent('file_uploaded', {
      tool: TOOL_ID.audioVideoTranscription,
      locale,
      file_type: getFileTypeLabel(nextFile),
    });
  };

  const handleStart = () => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      trackEvent('tool_started', {
        tool: TOOL_ID.audioVideoTranscription,
        locale,
        quality: t.quality,
        language: t.language,
        task: t.task,
      });
    }

    void t.start();
  };

  const handleSeek = (seconds: number) => {
    const media = mediaRef.current;
    if (media) {
      media.currentTime = seconds;
      void media.play().catch(() => undefined);
    }
  };

  const isBusy = t.status === 'extracting-audio' || t.status === 'loading-model' || t.status === 'transcribing';
  const canStart = t.status === 'ready' || t.status === 'error' || t.status === 'cancelled';

  return (
    <Card className="space-y-5">
      <header className="rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 to-indigo-50 p-4">
        <div className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
          <p className="text-sm text-slate-700">{ui.privacyNote}</p>
        </div>
      </header>

      {!t.file ? (
        <FileUploadDropzone
          locale={locale}
          label={ui.filesLabel}
          helperText={ui.filesHint}
          accept={acceptedMediaTypes}
          maxSize={2 * 1024 * 1024 * 1024}
          onFilesSelected={handleFilesSelected}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">{t.file.name}</p>
              <p className="text-xs text-slate-600">
                {ui.fileInfo(
                  getFileTypeLabel(t.file),
                  formatBytes(t.file.size),
                  t.durationInSeconds ? formatClockTime(t.durationInSeconds) : '--',
                )}
              </p>
            </div>
            <Button variant="ghost" onClick={t.clearFile} disabled={isBusy}>
              <X className="mr-1.5 h-4 w-4" />
              {ui.removeFileButton}
            </Button>
          </div>

          {t.mediaUrl && t.mediaKind ? (
            <TranscriptionMediaPreview
              ref={mediaRef}
              mediaUrl={t.mediaUrl}
              mediaKind={t.mediaKind}
              onTimeUpdate={setCurrentTime}
            />
          ) : null}

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-700">{ui.qualityLabel}</span>
              <Select
                value={t.quality}
                disabled={isBusy}
                onChange={(event) => t.setQuality(event.target.value as TranscriptionQuality)}
              >
                <option value="fast">{ui.qualityFast}</option>
                <option value="balanced">{ui.qualityBalanced}</option>
                <option value="high">{ui.qualityHigh}</option>
              </Select>
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-700">{ui.languageLabel}</span>
              <Select
                value={t.language}
                disabled={isBusy}
                onChange={(event) => t.setLanguage(event.target.value as TranscriptionLanguageOption)}
              >
                <option value="auto">{languageLabels.auto}</option>
                {SUPPORTED_LANGUAGE_CODES.map((code) => (
                  <option key={code} value={code}>
                    {languageLabels[code]}
                  </option>
                ))}
              </Select>
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-700">{ui.taskLabel}</span>
              <Select
                value={t.task}
                disabled={isBusy}
                onChange={(event) => t.setTask(event.target.value as TranscriptionTask)}
              >
                <option value="transcribe">{ui.taskTranscribe}</option>
                <option value="translate">{ui.taskTranslate}</option>
              </Select>
            </label>
          </div>

          {t.deviceCapabilities ? (
            <p className="text-xs text-slate-500">
              {t.deviceCapabilities.webgpuAvailable ? ui.webgpuOn : ui.webgpuOff}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            {isBusy ? (
              <Button variant="secondary" onClick={t.cancel}>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                {ui.cancelButton}
              </Button>
            ) : (
              <Button variant="primary" onClick={handleStart} disabled={!canStart}>
                {ui.startButton}
              </Button>
            )}
          </div>

          <TranscriptionProgressView
            status={t.status}
            progress={t.progress}
            modelFromCache={t.modelFromCache}
            locale={locale}
          />

          {t.status === 'cancelled' ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              {ui.cancelledNote}
            </p>
          ) : null}

          {t.status === 'error' && t.error ? (
            <div className="space-y-2 rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-800">{getErrorMessage(locale, t.error.errorType)}</p>
              <Button variant="secondary" onClick={handleStart}>
                {ui.errorRetry}
              </Button>
            </div>
          ) : null}

          {t.status === 'completed' && t.result ? (
            <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
              {t.result.language ? (
                <p className="text-xs font-semibold text-emerald-800">
                  {ui.detectedLanguage(languageLabels[t.result.language as TranscriptionLanguageOption] ?? t.result.language)}
                </p>
              ) : null}

              <div className="flex gap-2 border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => setResultTab('text')}
                  className={`px-3 py-2 text-sm font-semibold ${resultTab === 'text' ? 'border-b-2 border-brand-600 text-brand-700' : 'text-slate-500'}`}
                >
                  {ui.textTab}
                </button>
                <button
                  type="button"
                  onClick={() => setResultTab('segments')}
                  className={`px-3 py-2 text-sm font-semibold ${resultTab === 'segments' ? 'border-b-2 border-brand-600 text-brand-700' : 'text-slate-500'}`}
                >
                  {ui.segmentsTab}
                </button>
              </div>

              {resultTab === 'text' ? (
                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-800">{t.result.text}</p>
              ) : (
                <TranscriptSegments
                  segments={t.result.segments}
                  currentTime={currentTime}
                  onSeek={mediaRef.current ? handleSeek : undefined}
                  locale={locale}
                />
              )}

              <TranscriptionExportMenu
                result={t.result}
                locale={locale}
                onCopy={(kind) =>
                  trackEvent('result_copied', { tool: TOOL_ID.audioVideoTranscription, locale, format: kind })
                }
                onDownload={(format: TranscriptExportFormat) =>
                  trackEvent('result_downloaded', { tool: TOOL_ID.audioVideoTranscription, locale, format })
                }
              />
            </div>
          ) : null}
        </div>
      )}
    </Card>
  );
}
