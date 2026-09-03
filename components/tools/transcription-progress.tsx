'use client';

import type { TranscriptionProgress, TranscriptionStatus } from '@/hooks/use-transcription';
import { formatClockTime } from '@/lib/transcription/timestamps';
import { type AppLocale } from '@/lib/i18n/config';

type TranscriptionProgressViewProps = Readonly<{
  status: TranscriptionStatus;
  progress: TranscriptionProgress;
  modelFromCache: boolean | null;
  locale: AppLocale;
}>;

type ProgressUi = {
  extractingAudio: string;
  preparingModel: string;
  downloadingModel: string;
  transcribing: string;
  modelCached: string;
  modelDownloaded: string;
  processedOf: (processed: string, total: string) => string;
};

const uiByLocale: Record<AppLocale, ProgressUi> = {
  'pt-br': {
    extractingAudio: 'Extraindo audio do arquivo...',
    preparingModel: 'Preparando modelo...',
    downloadingModel: 'Baixando modelo de transcricao...',
    transcribing: 'Transcrevendo...',
    modelCached: 'Modelo ja estava salvo no navegador (sem novo download).',
    modelDownloaded: 'Modelo baixado e pronto para uso local.',
    processedOf: (processed, total) => `${processed} / ${total} processados`,
  },
  en: {
    extractingAudio: 'Extracting audio from the file...',
    preparingModel: 'Preparing model...',
    downloadingModel: 'Downloading transcription model...',
    transcribing: 'Transcribing...',
    modelCached: 'Model was already cached in your browser (no new download).',
    modelDownloaded: 'Model downloaded and ready for local use.',
    processedOf: (processed, total) => `${processed} / ${total} processed`,
  },
  es: {
    extractingAudio: 'Extrayendo audio del archivo...',
    preparingModel: 'Preparando modelo...',
    downloadingModel: 'Descargando modelo de transcripcion...',
    transcribing: 'Transcribiendo...',
    modelCached: 'El modelo ya estaba guardado en el navegador (sin nueva descarga).',
    modelDownloaded: 'Modelo descargado y listo para uso local.',
    processedOf: (processed, total) => `${processed} / ${total} procesados`,
  },
  zh: {
    extractingAudio: 'Extracting audio from the file...',
    preparingModel: 'Preparing model...',
    downloadingModel: 'Downloading transcription model...',
    transcribing: 'Transcribing...',
    modelCached: 'Model was already cached in your browser (no new download).',
    modelDownloaded: 'Model downloaded and ready for local use.',
    processedOf: (processed, total) => `${processed} / ${total} processed`,
  },
};

const getPhaseLabel = (
  status: TranscriptionStatus,
  progress: TranscriptionProgress,
  ui: ProgressUi,
): string => {
  if (status === 'extracting-audio' || progress.phase === 'extracting-audio') {
    return ui.extractingAudio;
  }

  if (progress.phase === 'preparing-model') {
    return ui.preparingModel;
  }

  if (progress.phase === 'downloading-model') {
    return ui.downloadingModel;
  }

  return ui.transcribing;
};

const ACTIVE_STATUSES: TranscriptionStatus[] = ['extracting-audio', 'loading-model', 'transcribing'];

export function TranscriptionProgressView({
  status,
  progress,
  modelFromCache,
  locale,
}: TranscriptionProgressViewProps) {
  const ui = uiByLocale[locale];

  if (!ACTIVE_STATUSES.includes(status)) {
    return null;
  }

  const label = getPhaseLabel(status, progress, ui);
  const hasPercent = typeof progress.percent === 'number';
  const percent = hasPercent ? Math.max(0, Math.min(100, progress.percent as number)) : null;
  const showCacheNote =
    status === 'loading-model' && progress.phase !== 'preparing-model' && modelFromCache !== null;

  return (
    <div
      className="space-y-2 rounded-xl border border-brand-200 bg-brand-50 p-4"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {percent !== null ? (
          <span className="text-xs font-semibold text-slate-600">{percent}%</span>
        ) : null}
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-white/70">
        <div
          className={`h-full rounded-full bg-brand-600 transition-all ${percent === null ? 'w-1/3 animate-pulse' : ''}`}
          style={percent !== null ? { width: `${percent}%` } : undefined}
        />
      </div>

      {status === 'transcribing' &&
      typeof progress.processedSeconds === 'number' &&
      typeof progress.totalSeconds === 'number' &&
      progress.totalSeconds > 0 ? (
        <p className="text-xs text-slate-600">
          {ui.processedOf(formatClockTime(progress.processedSeconds), formatClockTime(progress.totalSeconds))}
        </p>
      ) : null}

      {showCacheNote ? (
        <p className="text-xs text-slate-600">{modelFromCache ? ui.modelCached : ui.modelDownloaded}</p>
      ) : null}
    </div>
  );
}
