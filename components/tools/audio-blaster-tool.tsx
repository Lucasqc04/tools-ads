'use client';

import { useEffect, useRef, useState } from 'react';
import { AudioLines, Download, Loader2, Mic, Radio, Sparkles, Square, Volume2, Waves } from 'lucide-react';
import { FileUploadDropzone } from '@/components/shared/file-upload-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { trackEvent, TOOL_ID } from '@/lib/analytics';
import {
  AudioBlasterError,
  MAX_AUDIO_BLASTER_DURATION_SECONDS,
  MAX_AUDIO_BLASTER_FILE_SIZE_BYTES,
  encodeProcessedAudioAsWav,
  processAudioForDistortion,
  type AudioDistortionMode,
  type AudioBlasterOptions,
} from '@/lib/audio-blaster';
import { downloadBlob } from '@/lib/download';
import { formatBytes } from '@/lib/file-size';
import type { AppLocale } from '@/lib/i18n/config';

type AudioBlasterToolProps = Readonly<{ locale?: AppLocale }>;
type Settings = Omit<AudioBlasterOptions, 'onProgress'>;

const copy = {
  'pt-br': {
    title: 'Estourador de áudio',
    intro: 'Distorça um áudio de propósito com clipping, drive, efeito de rádio ou textura 8-bit.',
    upload: 'Escolher áudio',
    uploadHint: 'MP3, WAV, M4A, OGG e WebM. Até 100 MB e 4 minutos.',
    recordAudio: 'Gravar áudio pelo microfone',
    recordAgain: 'Gravar outro áudio',
    recording: 'Gravando pelo microfone',
    stopRecording: 'Parar gravação',
    recordingHint: 'A gravação fica neste navegador e pode durar até 4 minutos.',
    recorderUnsupported: 'Este navegador não oferece suporte à gravação de áudio.',
    microphonePermission: 'Permita o acesso ao microfone para iniciar a gravação.',
    recordingFailed: 'Não foi possível concluir a gravação. Tente novamente.',
    original: 'Áudio original',
    settings: 'Efeito',
    presets: 'Comece por um preset',
    classic: 'Estouro clássico',
    radioPreset: 'Rádio ruim',
    bitPreset: '8-bit',
    foldPreset: 'Overdrive meme',
    mode: 'Tipo de distorção',
    hard: 'Clipping seco',
    soft: 'Saturação suave',
    foldback: 'Foldback',
    bitcrush: 'Bitcrush',
    radio: 'Rádio / megafone',
    gain: 'Ganho',
    drive: 'Intensidade do drive',
    mix: 'Mistura do efeito',
    bitDepth: 'Resolução',
    sampleHold: 'Redução de amostras',
    process: 'Aplicar efeito',
    processing: 'Criando a distorção…',
    preview: 'Ouvir resultado',
    export: 'Exportar como',
    download: 'Baixar áudio',
    outputFormat: 'Formato de saída',
    bitrate: 'Qualidade MP3',
    local: 'O áudio é decodificado e processado neste navegador. Seus arquivos não são enviados ao site.',
    noFile: 'Adicione um áudio para começar. Depois ajuste os controles ou escolha um preset.',
    fileSize: 'Tamanho',
    duration: 'Duração',
    progress: (value: number) => `Processamento ${Math.round(value * 100)}%`,
    fileTooLarge: 'O limite é 100 MB por arquivo.',
    tooLong: 'O áudio precisa ter até 4 minutos para o processamento local.',
    unsupported: 'Este formato não pôde ser decodificado neste navegador. Tente MP3 ou WAV.',
    genericError: 'Não foi possível processar este áudio.',
    mp3Error: 'Não foi possível codificar o MP3. Tente exportar em WAV.',
    processingNote: 'A prévia é gerada em WAV. A conversão para MP3 carrega o codificador local na primeira vez.',
    db: 'dB',
    bits: 'bits',
    times: '×',
  },
  en: {
    title: 'Audio blaster',
    intro: 'Intentionally distort audio with clipping, drive, radio tone, or an 8-bit texture.',
    upload: 'Choose audio',
    uploadHint: 'MP3, WAV, M4A, OGG, and WebM. Up to 100 MB and 4 minutes.',
    recordAudio: 'Record audio with microphone',
    recordAgain: 'Record another audio',
    recording: 'Recording from microphone',
    stopRecording: 'Stop recording',
    recordingHint: 'The recording stays in this browser and can last up to 4 minutes.',
    recorderUnsupported: 'This browser does not support audio recording.',
    microphonePermission: 'Allow microphone access to start recording.',
    recordingFailed: 'Could not finish the recording. Please try again.',
    original: 'Original audio',
    settings: 'Effect',
    presets: 'Start with a preset',
    classic: 'Classic clipping',
    radioPreset: 'Bad radio',
    bitPreset: '8-bit',
    foldPreset: 'Meme overdrive',
    mode: 'Distortion type',
    hard: 'Hard clipping',
    soft: 'Soft saturation',
    foldback: 'Foldback',
    bitcrush: 'Bitcrush',
    radio: 'Radio / megaphone',
    gain: 'Gain',
    drive: 'Drive strength',
    mix: 'Effect mix',
    bitDepth: 'Bit depth',
    sampleHold: 'Sample reduction',
    process: 'Apply effect',
    processing: 'Making the distortion…',
    preview: 'Listen to result',
    export: 'Export as',
    download: 'Download audio',
    outputFormat: 'Output format',
    bitrate: 'MP3 quality',
    local: 'Audio is decoded and processed in this browser. Your files are not uploaded to the site.',
    noFile: 'Add an audio file to start. Then adjust the controls or choose a preset.',
    fileSize: 'File size',
    duration: 'Duration',
    progress: (value: number) => `Processing ${Math.round(value * 100)}%`,
    fileTooLarge: 'The file size limit is 100 MB.',
    tooLong: 'Audio must be 4 minutes or shorter for local processing.',
    unsupported: 'This format could not be decoded in this browser. Try MP3 or WAV.',
    genericError: 'Could not process this audio.',
    mp3Error: 'Could not encode MP3. Try exporting as WAV.',
    processingNote: 'Preview is created as WAV. MP3 conversion loads the local encoder the first time.',
    db: 'dB',
    bits: 'bits',
    times: '×',
  },
  es: {
    title: 'Distorsionador de audio',
    intro: 'Distorsiona el audio a propósito con clipping, drive, efecto de radio o textura de 8 bits.',
    upload: 'Elegir audio',
    uploadHint: 'MP3, WAV, M4A, OGG y WebM. Hasta 100 MB y 4 minutos.',
    recordAudio: 'Grabar audio con el micrófono',
    recordAgain: 'Grabar otro audio',
    recording: 'Grabando con el micrófono',
    stopRecording: 'Detener grabación',
    recordingHint: 'La grabación permanece en este navegador y puede durar hasta 4 minutos.',
    recorderUnsupported: 'Este navegador no admite la grabación de audio.',
    microphonePermission: 'Permite el acceso al micrófono para empezar a grabar.',
    recordingFailed: 'No se pudo completar la grabación. Inténtalo de nuevo.',
    original: 'Audio original',
    settings: 'Efecto',
    presets: 'Empieza con un preset',
    classic: 'Clipping clásico',
    radioPreset: 'Radio vieja',
    bitPreset: '8 bits',
    foldPreset: 'Overdrive meme',
    mode: 'Tipo de distorsión',
    hard: 'Clipping seco',
    soft: 'Saturación suave',
    foldback: 'Foldback',
    bitcrush: 'Bitcrush',
    radio: 'Radio / megáfono',
    gain: 'Ganancia',
    drive: 'Intensidad del drive',
    mix: 'Mezcla del efecto',
    bitDepth: 'Resolución',
    sampleHold: 'Reducción de muestras',
    process: 'Aplicar efecto',
    processing: 'Creando la distorsión…',
    preview: 'Escuchar resultado',
    export: 'Exportar como',
    download: 'Descargar audio',
    outputFormat: 'Formato de salida',
    bitrate: 'Calidad MP3',
    local: 'El audio se decodifica y procesa en este navegador. Los archivos no se envían al sitio.',
    noFile: 'Añade un audio para empezar. Después ajusta los controles o elige un preset.',
    fileSize: 'Tamaño',
    duration: 'Duración',
    progress: (value: number) => `Procesando ${Math.round(value * 100)}%`,
    fileTooLarge: 'El límite es de 100 MB por archivo.',
    tooLong: 'El audio debe durar hasta 4 minutos para procesarlo localmente.',
    unsupported: 'Este formato no se pudo decodificar en este navegador. Prueba MP3 o WAV.',
    genericError: 'No se pudo procesar este audio.',
    mp3Error: 'No se pudo codificar el MP3. Prueba exportar en WAV.',
    processingNote: 'La vista previa se crea en WAV. La conversión a MP3 carga el codificador local la primera vez.',
    db: 'dB',
    bits: 'bits',
    times: '×',
  },
  zh: {
    title: '音频失真工具',
    intro: '使用削波、驱动、收音机音色或 8 位质感，为音频添加夸张失真。',
    upload: '选择音频',
    uploadHint: '支持 MP3、WAV、M4A、OGG、WebM，最大 100 MB，时长 4 分钟。',
    recordAudio: '使用麦克风录音',
    recordAgain: '重新录制音频',
    recording: '正在使用麦克风录音',
    stopRecording: '停止录音',
    recordingHint: '录音保存在此浏览器中，最长可录制 4 分钟。',
    recorderUnsupported: '此浏览器不支持音频录制。',
    microphonePermission: '请允许访问麦克风以开始录音。',
    recordingFailed: '无法完成录音，请重试。',
    original: '原始音频',
    settings: '效果',
    presets: '选择预设',
    classic: '经典削波',
    radioPreset: '老式收音机',
    bitPreset: '8 位',
    foldPreset: '梗图过载',
    mode: '失真类型',
    hard: '硬削波',
    soft: '柔和饱和',
    foldback: '折返失真',
    bitcrush: '位压碎',
    radio: '收音机 / 扩音器',
    gain: '增益',
    drive: '驱动强度',
    mix: '效果混合',
    bitDepth: '位深',
    sampleHold: '采样率降低',
    process: '应用效果',
    processing: '正在创建失真…',
    preview: '试听结果',
    export: '导出为',
    download: '下载音频',
    outputFormat: '输出格式',
    bitrate: 'MP3 质量',
    local: '音频在此浏览器中解码和处理，不会上传到网站。',
    noFile: '添加音频以开始，然后调整控件或选择预设。',
    fileSize: '文件大小',
    duration: '时长',
    progress: (value: number) => `处理中 ${Math.round(value * 100)}%`,
    fileTooLarge: '文件大小上限为 100 MB。',
    tooLong: '本地处理的音频时长不能超过 4 分钟。',
    unsupported: '此浏览器无法解码此格式，请尝试 MP3 或 WAV。',
    genericError: '无法处理此音频。',
    mp3Error: '无法编码 MP3，请尝试导出为 WAV。',
    processingNote: '预览以 WAV 生成。首次转换 MP3 时会加载本地编码器。',
    db: 'dB',
    bits: '位',
    times: '×',
  },
} satisfies Record<AppLocale, Record<string, string | ((value: number) => string)>>;

const presets: Record<string, Settings> = {
  classic: { mode: 'hard-clip', gainDb: 18, drive: 4, mix: 100, bitDepth: 8, sampleHold: 1 },
  radio: { mode: 'radio', gainDb: 10, drive: 3, mix: 100, bitDepth: 8, sampleHold: 1 },
  bit: { mode: 'bitcrush', gainDb: 8, drive: 2.5, mix: 100, bitDepth: 5, sampleHold: 9 },
  fold: { mode: 'foldback', gainDb: 8, drive: 7, mix: 85, bitDepth: 8, sampleHold: 1 },
};

const initialSettings: Settings = { mode: 'hard-clip', gainDb: 12, drive: 3, mix: 100, bitDepth: 8, sampleHold: 1 };

const formatDuration = (seconds: number): string => {
  const total = Math.max(0, Math.floor(seconds));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
};

const cleanName = (name: string) => name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-_]+/g, '-') || 'audio';

export function AudioBlasterTool({ locale = 'pt-br' }: AudioBlasterToolProps) {
  const ui = copy[locale];
  const [file, setFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [outputFormat, setOutputFormat] = useState<'mp3' | 'wav'>('mp3');
  const [bitrate, setBitrate] = useState(192);
  const [duration, setDuration] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [encoding, setEncoding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => () => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
  }, [sourceUrl, resultUrl]);

  const uiMode = {
    'hard-clip': ui.hard,
    'soft-clip': ui.soft,
    foldback: ui.foldback,
    bitcrush: ui.bitcrush,
    radio: ui.radio,
  } as Record<AudioDistortionMode, string>;

  const clearResult = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setResultFile(null);
  };

  const handleFiles = (files: File[], source: 'upload' | 'recording' = 'upload') => {
    const next = files[0];
    if (!next) return;
    clearResult();
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    setError('');
    setFile(next);
    setSourceUrl(URL.createObjectURL(next));
    setDuration(0);
    setProgress(0);
    if (source === 'upload') {
      trackEvent('tool_started', { tool: TOOL_ID.audioBlaster, locale });
      trackEvent('file_uploaded', { tool: TOOL_ID.audioBlaster, locale, file_type: 'audio' });
    }
    if (next.size > MAX_AUDIO_BLASTER_FILE_SIZE_BYTES) setError(ui.fileTooLarge);
  };

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);
  const recordingStartedAtRef = useRef(0);
  const recordingStartPendingRef = useRef(false);
  const recordingFailedRef = useRef(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingElapsed, setRecordingElapsed] = useState(0);

  const startRecording = async () => {
    if (recordingStartPendingRef.current || isRecording) return;
    setError('');

    if (typeof MediaRecorder === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setError(ui.recorderUnsupported);
      trackEvent('tool_error', { tool: TOOL_ID.audioBlaster, locale, error_type: 'unsupported_browser' });
      return;
    }

    recordingStartPendingRef.current = true;
    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const preferredMimeType = [
        'audio/webm;codecs=opus',
        'audio/mp4',
        'audio/ogg;codecs=opus',
        'audio/webm',
      ].find((mimeType) => MediaRecorder.isTypeSupported?.(mimeType));
      const recorder = preferredMimeType
        ? new MediaRecorder(stream, { mimeType: preferredMimeType })
        : new MediaRecorder(stream);

      streamRef.current = stream;
      recorderRef.current = recorder;
      recordingChunksRef.current = [];
      recordingFailedRef.current = false;
      recordingStartedAtRef.current = Date.now();
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) recordingChunksRef.current.push(event.data);
      };
      recorder.onerror = () => {
        recordingFailedRef.current = true;
        setError(ui.recordingFailed);
        trackEvent('tool_error', { tool: TOOL_ID.audioBlaster, locale, error_type: 'processing_failed' });
        if (recorder.state === 'recording') recorder.stop();
      };
      recorder.onstop = () => {
        const chunks = recordingChunksRef.current;
        const mimeType = recorder.mimeType || chunks[0]?.type || 'audio/webm';
        const recordedBlob = new Blob(chunks, { type: mimeType });
        stream?.getTracks().forEach((track) => track.stop());
        if (streamRef.current === stream) streamRef.current = null;
        if (recorderRef.current === recorder) recorderRef.current = null;
        setIsRecording(false);
        setRecordingElapsed(Math.min(MAX_AUDIO_BLASTER_DURATION_SECONDS, Math.floor((Date.now() - recordingStartedAtRef.current) / 1000)));

        if (recordingFailedRef.current || recordedBlob.size === 0) {
          if (!recordingFailedRef.current) setError(ui.recordingFailed);
          recordingChunksRef.current = [];
          return;
        }

        const extension = mimeType.includes('mp4') ? 'm4a' : mimeType.includes('ogg') ? 'ogg' : 'webm';
        const fileName = `gravacao-${new Date().toISOString().replace(/[:.]/g, '-')}.${extension}`;
        handleFiles([new File([recordedBlob], fileName, { type: mimeType })], 'recording');
        recordingChunksRef.current = [];
      };
      recorder.start(1000);
      setRecordingElapsed(0);
      setIsRecording(true);
      trackEvent('tool_started', { tool: TOOL_ID.audioBlaster, locale });
      trackEvent('generation_started', { tool: TOOL_ID.audioBlaster, locale, mode: 'microphone_recording' });
    } catch (cause) {
      stream?.getTracks().forEach((track) => track.stop());
      if (streamRef.current === stream) streamRef.current = null;
      recorderRef.current = null;
      const denied = cause instanceof DOMException && (cause.name === 'NotAllowedError' || cause.name === 'PermissionDeniedError');
      setError(denied ? ui.microphonePermission : ui.recordingFailed);
      trackEvent('tool_error', { tool: TOOL_ID.audioBlaster, locale, error_type: denied ? 'permission_denied' : 'processing_failed' });
    } finally {
      recordingStartPendingRef.current = false;
    }
  };

  const stopRecording = () => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
  };

  useEffect(() => {
    if (!isRecording) return;
    const timer = window.setInterval(() => {
      const elapsedSeconds = (Date.now() - recordingStartedAtRef.current) / 1000;
      const elapsed = Math.floor(elapsedSeconds);
      setRecordingElapsed(Math.min(elapsed, MAX_AUDIO_BLASTER_DURATION_SECONDS));
      if (elapsedSeconds >= MAX_AUDIO_BLASTER_DURATION_SECONDS - 0.5 && recorderRef.current?.state === 'recording') {
        recorderRef.current.stop();
      }
    }, 100);
    return () => window.clearInterval(timer);
  }, [isRecording]);

  useEffect(() => () => {
    const recorder = recorderRef.current;
    if (recorder) {
      recorder.ondataavailable = null;
      recorder.onstop = null;
      recorder.onerror = null;
      if (recorder.state === 'recording') recorder.stop();
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const updateSettings = (patch: Partial<Settings>) => {
    clearResult();
    setSettings((current) => ({ ...current, ...patch }));
  };

  const applyPreset = (id: keyof typeof presets) => {
    clearResult();
    setSettings(presets[id]);
    trackEvent('mode_selected', { tool: TOOL_ID.audioBlaster, locale, mode: presets[id].mode });
  };

  const process = async () => {
    if (!file || processing || encoding) return;
    setProcessing(true);
    setProgress(0);
    setError('');
    try {
      const audio = await processAudioForDistortion(file, {
        ...settings,
        onProgress: setProgress,
      });
      setDuration(audio.durationInSeconds);
      const wavFile = encodeProcessedAudioAsWav(audio, cleanName(file.name));
      const url = URL.createObjectURL(wavFile);
      setResultFile(wavFile);
      setResultUrl(url);
      trackEvent('tool_completed', { tool: TOOL_ID.audioBlaster, locale, mode: settings.mode });
    } catch (cause) {
      const code = cause instanceof AudioBlasterError ? cause.code : 'processing_failed';
      setError(
        code === 'file_too_large' ? ui.fileTooLarge
          : code === 'duration_too_long' ? ui.tooLong
            : code === 'unsupported_format' ? ui.unsupported
              : ui.genericError,
      );
      trackEvent('tool_error', { tool: TOOL_ID.audioBlaster, locale, error_type: code === 'unsupported_format' ? 'unsupported_format' : code === 'file_too_large' || code === 'duration_too_long' ? 'file_too_large' : 'processing_failed' });
    } finally {
      setProcessing(false);
    }
  };

  const downloadResult = async () => {
    if (!resultFile || !file || encoding) return;
    setError('');
    if (outputFormat === 'wav') {
      downloadBlob(resultFile, `${cleanName(file.name)}-estourado.wav`);
      trackEvent('result_downloaded', { tool: TOOL_ID.audioBlaster, locale, format: 'wav' });
      return;
    }

    setEncoding(true);
    try {
      const { exportAudioSegment } = await import('@/lib/audio-editor');
      const encoded = await exportAudioSegment(resultFile, {
        outputFormat: 'mp3',
        bitrateKbps: bitrate,
        startInSeconds: 0,
        endInSeconds: duration,
        outputName: `${cleanName(file.name)}-estourado.mp3`,
        onProgress: (event) => setProgress(Math.max(0, event.progress)),
      });
      downloadBlob(encoded, encoded.name);
      trackEvent('result_downloaded', { tool: TOOL_ID.audioBlaster, locale, format: 'mp3' });
    } catch {
      setError(ui.mp3Error);
      trackEvent('tool_error', { tool: TOOL_ID.audioBlaster, locale, error_type: 'processing_failed' });
    } finally {
      setEncoding(false);
    }
  };

  const rangeControl = (
    label: string,
    value: number,
    min: number,
    max: number,
    suffix: string,
    onChange: (value: number) => void,
    step = 1,
  ) => (
    <label className="block space-y-2 text-sm">
      <span className="flex items-center justify-between gap-2 text-slate-700"><span>{label}</span><span className="font-mono text-xs text-slate-500">{value}{suffix}</span></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="h-2 w-full cursor-pointer accent-brand-600" />
    </label>
  );

  const presetButtons = [
    { id: 'classic' as const, label: ui.classic, icon: Volume2 },
    { id: 'radio' as const, label: ui.radioPreset, icon: Radio },
    { id: 'bit' as const, label: ui.bitPreset, icon: AudioLines },
    { id: 'fold' as const, label: ui.foldPreset, icon: Waves },
  ];

  return (
    <Card className="space-y-5">
        <header className="rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 to-indigo-50 p-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{ui.title}</h3>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-700">{ui.intro}</p>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="min-w-0 space-y-5">
            {isRecording ? (
              <div className="space-y-4 rounded-xl border border-brand-200 bg-brand-50 p-4">
                <div role="status" aria-live="polite" className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700"><Mic size={17} /></span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-slate-900">{ui.recording}</div>
                    <div aria-live="off" className="font-mono text-xs text-slate-600">{formatDuration(recordingElapsed)} / {formatDuration(MAX_AUDIO_BLASTER_DURATION_SECONDS)}</div>
                  </div>
                </div>
                <p className="text-xs leading-5 text-slate-600">{ui.recordingHint}</p>
                <Button variant="secondary" className="w-full" onClick={stopRecording}><Square size={15} className="mr-2" />{ui.stopRecording}</Button>
              </div>
            ) : file && sourceUrl ? (
              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex min-w-0 items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700"><Volume2 size={17} /></span><div className="min-w-0"><div className="truncate text-sm font-semibold text-slate-900">{file.name}</div><div className="text-xs text-slate-600">{formatBytes(file.size)}{duration ? ` · ${formatDuration(duration)}` : ''}</div></div><button className="ml-auto shrink-0 text-xs font-medium text-brand-700 underline-offset-4 hover:underline" onClick={() => { setFile(null); setSourceUrl(null); clearResult(); }}>{ui.upload}</button></div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{ui.original}</p>
                <audio
                  src={sourceUrl}
                  controls
                  className="h-10 w-full"
                  onLoadedMetadata={(event) => {
                    const nextDuration = Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0;
                    setDuration(nextDuration);
                    if (nextDuration > MAX_AUDIO_BLASTER_DURATION_SECONDS) setError(ui.tooLong);
                    else if (file.size <= MAX_AUDIO_BLASTER_FILE_SIZE_BYTES) setError('');
                  }}
                />
              </div>
            ) : (
              <FileUploadDropzone
                label={ui.upload}
                helperText={ui.uploadHint}
                acceptedDescription="MP3, WAV, M4A, OGG, WebM"
                accept="audio/*,.mp3,.wav,.m4a,.ogg,.webm,.flac"
                maxSize={MAX_AUDIO_BLASTER_FILE_SIZE_BYTES}
                onFilesSelected={handleFiles}
                locale={locale}
              />
            )}

            {!isRecording ? (
              <Button variant="secondary" className="w-full" onClick={() => void startRecording()} disabled={processing || encoding}>
                <Mic size={16} className="mr-2" />{file ? ui.recordAgain : ui.recordAudio}
              </Button>
            ) : null}

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-800">{ui.presets}</h4>
              <div className="grid grid-cols-2 gap-2">
                {presetButtons.map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => applyPreset(id)} className={`flex min-h-12 min-w-0 items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors ${settings.mode === presets[id].mode ? 'border-brand-300 bg-brand-50 text-brand-800' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}><Icon size={15} className="shrink-0" /><span className="truncate">{label}</span></button>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-700">{ui.local}</div>
          </div>

          <div className="min-w-0 space-y-5 border-t border-slate-200 pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-800"><Sparkles size={16} className="text-brand-700" />{ui.settings}</h4>

            <label className="block space-y-1.5 text-sm text-slate-700">
              <span>{ui.mode}</span>
              <Select value={settings.mode} onChange={(event) => updateSettings({ mode: event.target.value as AudioDistortionMode })}>
                {Object.entries(uiMode).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </Select>
            </label>

            <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
              {rangeControl(ui.gain, settings.gainDb, 0, 30, ` ${ui.db}`, (gainDb) => updateSettings({ gainDb }))}
              {rangeControl(ui.drive, settings.drive, 1, 16, ui.times, (drive) => updateSettings({ drive }), 0.5)}
              {rangeControl(ui.mix, settings.mix, 0, 100, '%', (mix) => updateSettings({ mix }))}
              {settings.mode === 'bitcrush' ? (
                <>
                  {rangeControl(ui.bitDepth, settings.bitDepth, 2, 16, ` ${ui.bits}`, (bitDepth) => updateSettings({ bitDepth }))}
                  {rangeControl(ui.sampleHold, settings.sampleHold, 1, 32, ui.times, (sampleHold) => updateSettings({ sampleHold }))}
                </>
              ) : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <label className="block space-y-1.5 text-xs text-slate-600"><span>{ui.outputFormat}</span><Select value={outputFormat} onChange={(event) => setOutputFormat(event.target.value as 'mp3' | 'wav')}><option value="mp3">MP3</option><option value="wav">WAV</option></Select></label>
              {outputFormat === 'mp3' ? <label className="block space-y-1.5 text-xs text-slate-600"><span>{ui.bitrate}</span><Select value={bitrate} onChange={(event) => setBitrate(Number(event.target.value))}><option value={128}>128 kbps</option><option value={192}>192 kbps</option><option value={320}>320 kbps</option></Select></label> : null}
            </div>
            <p className="text-xs leading-5 text-slate-500">{ui.processingNote}</p>

            {error ? <p role="alert" className="text-sm leading-5 text-red-700">{error}</p> : null}
            {processing ? <div className="space-y-2"><div className="h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-brand-600 transition-[width]" style={{ width: `${Math.max(2, progress * 100)}%` }} /></div><div className="text-xs text-slate-600">{ui.progress(progress)}</div></div> : null}

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button className="w-full" onClick={() => void process()} disabled={!file || processing || encoding || isRecording || file.size > MAX_AUDIO_BLASTER_FILE_SIZE_BYTES || duration > MAX_AUDIO_BLASTER_DURATION_SECONDS}>
                {processing ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Waves size={16} className="mr-2" />}{processing ? ui.processing : ui.process}
              </Button>
            </div>

            {resultUrl && resultFile ? (
              <div className="space-y-4 border-t border-slate-200 pt-5">
                <h4 className="text-sm font-semibold text-slate-800">{ui.preview}</h4>
                <audio src={resultUrl} controls className="h-10 w-full" />
                <Button variant="secondary" className="w-full" onClick={() => void downloadResult()} disabled={encoding}>
                  {encoding ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Download size={16} className="mr-2" />}{encoding ? ui.processing : ui.download}
                </Button>
              </div>
            ) : !file ? <p className="flex min-h-16 items-center gap-3 text-sm leading-6 text-slate-600"><AudioLines size={22} className="shrink-0 text-brand-700" />{ui.noFile}</p> : null}
          </div>
        </div>
    </Card>
  );
}
