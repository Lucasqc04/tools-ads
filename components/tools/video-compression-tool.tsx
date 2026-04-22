'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { FileUploadDropzone } from '@/components/shared/file-upload-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { type AppLocale } from '@/lib/i18n/config';
import {
  compressVideoFile,
  estimateCompressedVideoSize,
  readVideoMetadata,
  type VideoMetadata,
} from '@/lib/video-compression';
import { calculateSavingsPercent, formatBytes } from '@/lib/file-size';
import { downloadBlob } from '@/lib/image-conversion';

type VideoCompressionToolProps = Readonly<{
  locale?: AppLocale;
}>;

type ItemStatus = 'pending' | 'compressing' | 'done' | 'error';

type VideoCompressionItem = {
  id: string;
  file: File;
  sourceUrl: string;
  metadata?: VideoMetadata;
  status: ItemStatus;
  progressPercent: number;
  logs?: string[];
  resultFile?: File;
  resultUrl?: string;
  errorMessage?: string;
};

type VideoCompressionUi = {
  title: string;
  intro: string;
  filesLabel: string;
  filesHint: string;
  compressionLevelLabel: string;
  compressionLevelHint: string;
  compressionLevelBadge: (value: number) => string;
  compressAll: string;
  compressingAll: string;
  clearAll: string;
  downloadAll: string;
  sourcePreview: string;
  resultPreview: string;
  waitingCompression: string;
  processing: string;
  noFilesHint: string;
  estimatedSizeLabel: string;
  currentSizeLabel: string;
  finalSizeLabel: string;
  durationLabel: string;
  resolutionLabel: string;
  savingsLabel: (value: number) => string;
  ffmpegWarmupNote: string;
  processingLocalNote: string;
  done: string;
  pending: string;
  error: string;
  compressButton: string;
  downloadButton: string;
  genericError: string;
};

const uiByLocale: Record<AppLocale, VideoCompressionUi> = {
  'pt-br': {
    title: 'Compressor de video online',
    intro:
      'Comprima varios videos no navegador, ajuste o nivel de compressao e compare preview antes do download.',
    filesLabel: 'Videos para comprimir',
    filesHint:
      'Suporta envio em lote. O processamento e local e pode levar mais tempo em arquivos grandes.',
    compressionLevelLabel: 'Nivel de compressao',
    compressionLevelHint:
      'Nivel maior reduz mais o tamanho (com impacto maior em qualidade e possivel reducao de resolucao).',
    compressionLevelBadge: (value) => `${value}%`,
    compressAll: 'Comprimir todos',
    compressingAll: 'Comprimindo...',
    clearAll: 'Limpar lista',
    downloadAll: 'Baixar todos',
    sourcePreview: 'Original',
    resultPreview: 'Comprimido',
    waitingCompression: 'Aguardando compressao.',
    processing: 'Processando...',
    noFilesHint: 'Adicione videos para iniciar a compressao.',
    estimatedSizeLabel: 'Estimativa',
    currentSizeLabel: 'Tamanho atual',
    finalSizeLabel: 'Tamanho final',
    durationLabel: 'Duracao',
    resolutionLabel: 'Resolucao',
    savingsLabel: (value) => `Reducao: ${value.toFixed(1)}%`,
    ffmpegWarmupNote:
      'No primeiro uso, o mecanismo de compressao pode baixar recursos e iniciar mais devagar.',
    processingLocalNote:
      'Os videos sao processados localmente no navegador. Nao ha upload automatico para servidor por padrao.',
    done: 'Concluido',
    pending: 'Pendente',
    error: 'Erro',
    compressButton: 'Comprimir',
    downloadButton: 'Baixar',
    genericError: 'Nao foi possivel comprimir este video.',
  },
  en: {
    title: 'Online video compressor',
    intro:
      'Compress multiple videos directly in your browser, control compression level, and preview before download.',
    filesLabel: 'Videos to compress',
    filesHint:
      'Batch upload is supported. Processing is local and may take longer for large files.',
    compressionLevelLabel: 'Compression level',
    compressionLevelHint:
      'Higher levels usually reduce size more, with stronger quality and resolution impact.',
    compressionLevelBadge: (value) => `${value}%`,
    compressAll: 'Compress all',
    compressingAll: 'Compressing...',
    clearAll: 'Clear list',
    downloadAll: 'Download all',
    sourcePreview: 'Original',
    resultPreview: 'Compressed',
    waitingCompression: 'Waiting for compression.',
    processing: 'Processing...',
    noFilesHint: 'Add videos to start compression.',
    estimatedSizeLabel: 'Estimated',
    currentSizeLabel: 'Current size',
    finalSizeLabel: 'Final size',
    durationLabel: 'Duration',
    resolutionLabel: 'Resolution',
    savingsLabel: (value) => `Savings: ${value.toFixed(1)}%`,
    ffmpegWarmupNote:
      'On first run, the compression engine may download assets and start slower.',
    processingLocalNote:
      'Videos are processed locally in your browser. No automatic server upload is performed by default.',
    done: 'Done',
    pending: 'Pending',
    error: 'Error',
    compressButton: 'Compress',
    downloadButton: 'Download',
    genericError: 'Could not compress this video.',
  },
  es: {
    title: 'Compresor de video online',
    intro:
      'Comprime varios videos en el navegador, ajusta el nivel de compresion y previsualiza antes de descargar.',
    filesLabel: 'Videos para comprimir',
    filesHint:
      'Soporta carga por lote. El procesamiento es local y puede tardar mas en archivos grandes.',
    compressionLevelLabel: 'Nivel de compresion',
    compressionLevelHint:
      'Un nivel mayor suele reducir mas el tamano, con mayor impacto en calidad y resolucion.',
    compressionLevelBadge: (value) => `${value}%`,
    compressAll: 'Comprimir todos',
    compressingAll: 'Comprimiendo...',
    clearAll: 'Limpiar lista',
    downloadAll: 'Descargar todos',
    sourcePreview: 'Original',
    resultPreview: 'Comprimido',
    waitingCompression: 'Esperando compresion.',
    processing: 'Procesando...',
    noFilesHint: 'Agrega videos para iniciar la compresion.',
    estimatedSizeLabel: 'Estimado',
    currentSizeLabel: 'Tamano actual',
    finalSizeLabel: 'Tamano final',
    durationLabel: 'Duracion',
    resolutionLabel: 'Resolucion',
    savingsLabel: (value) => `Reduccion: ${value.toFixed(1)}%`,
    ffmpegWarmupNote:
      'En el primer uso, el motor de compresion puede descargar recursos e iniciar mas lento.',
    processingLocalNote:
      'Los videos se procesan localmente en el navegador. No hay subida automatica a servidor por defecto.',
    done: 'Listo',
    pending: 'Pendiente',
    error: 'Error',
    compressButton: 'Comprimir',
    downloadButton: 'Descargar',
    genericError: 'No fue posible comprimir este video.',
  },
};

const acceptedVideoTypes =
  'video/mp4,video/quicktime,video/webm,video/x-m4v,video/ogg,video/x-matroska,.mp4,.mov,.m4v,.webm,.ogv,.mkv';

const buildId = (file: File): string =>
  `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`;

const getFileKey = (file: File): string => `${file.name}-${file.size}-${file.lastModified}`;

const statusClassName: Record<ItemStatus, string> = {
  pending: 'border-slate-200 bg-slate-100 text-slate-700',
  compressing: 'border-amber-200 bg-amber-50 text-amber-700',
  done: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  error: 'border-red-200 bg-red-50 text-red-700',
};

const formatDuration = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return '--';
  }

  const minutes = Math.floor(seconds / 60);
  const rest = Math.round(seconds % 60)
    .toString()
    .padStart(2, '0');

  return `${minutes}:${rest}`;
};

const formatResolution = (metadata: VideoMetadata | undefined): string => {
  if (!metadata || !metadata.width || !metadata.height) {
    return '--';
  }

  return `${metadata.width}x${metadata.height}`;
};

const getStatusLabel = (ui: VideoCompressionUi, status: ItemStatus): string => {
  if (status === 'done') {
    return ui.done;
  }

  if (status === 'error') {
    return ui.error;
  }

  if (status === 'compressing') {
    return ui.processing;
  }

  return ui.pending;
};

export function VideoCompressionTool({ locale = 'pt-br' }: VideoCompressionToolProps) {
  const ui = uiByLocale[locale];
  const [items, setItems] = useState<VideoCompressionItem[]>([]);
  const [compressionLevel, setCompressionLevel] = useState(58);
  const [isCompressing, setIsCompressing] = useState(false);
  const itemsRef = useRef<VideoCompressionItem[]>([]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(
    () => () => {
      itemsRef.current.forEach((item) => {
        URL.revokeObjectURL(item.sourceUrl);
        if (item.resultUrl) {
          URL.revokeObjectURL(item.resultUrl);
        }
      });
    },
    [],
  );

  const updateItem = (
    itemId: string,
    updater: (item: VideoCompressionItem) => VideoCompressionItem,
  ) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== itemId) {
          return item;
        }

        return updater(item);
      }),
    );
  };

  const hasFiles = items.length > 0;
  const completedItems = items.filter((item) => item.status === 'done' && item.resultFile);
  const canDownloadAll = completedItems.length > 0;

  const totalSourceSize = useMemo(
    () => items.reduce((sum, item) => sum + item.file.size, 0),
    [items],
  );
  const totalEstimatedSize = useMemo(
    () =>
      items.reduce((sum, item) => {
        const duration = item.metadata?.durationInSeconds ?? 0;
        return sum + estimateCompressedVideoSize(item.file.size, duration, compressionLevel);
      }, 0),
    [compressionLevel, items],
  );

  const handleAddFiles = (nextFiles: File[]) => {
    setItems((current) => {
      const existing = new Set(current.map((item) => getFileKey(item.file)));
      const additions = nextFiles
        .filter((file) => !existing.has(getFileKey(file)))
        .map<VideoCompressionItem>((file) => ({
          id: buildId(file),
          file,
          sourceUrl: URL.createObjectURL(file),
          status: 'pending',
          progressPercent: 0,
          logs: [],
        }));

      return [...current, ...additions];
    });
  };

  const handleRemoveFile = (index: number) => {
    setItems((current) => {
      const target = current[index];
      if (!target) {
        return current;
      }

      URL.revokeObjectURL(target.sourceUrl);
      if (target.resultUrl) {
        URL.revokeObjectURL(target.resultUrl);
      }

      return current.filter((_, currentIndex) => currentIndex !== index);
    });
  };

  const handleClearAll = () => {
    setItems((current) => {
      current.forEach((item) => {
        URL.revokeObjectURL(item.sourceUrl);
        if (item.resultUrl) {
          URL.revokeObjectURL(item.resultUrl);
        }
      });

      return [];
    });
  };

  useEffect(() => {
    items.forEach((item) => {
      if (item.metadata) {
        return;
      }

      void readVideoMetadata(item.file)
        .then((metadata) => {
          updateItem(item.id, (current) => ({
            ...current,
            metadata,
          }));
        })
        .catch((err) => {
          updateItem(item.id, (current) => ({
            ...current,
            logs: [...(current.logs ?? []), `metadata error: ${err instanceof Error ? err.message : String(err)}`].slice(-8),
          }));
        });
    });
  }, [items]);

  const handleCompressSingle = async (item: VideoCompressionItem) => {
    updateItem(item.id, (current) => ({
      ...current,
      status: 'compressing',
      progressPercent: 0,
      errorMessage: undefined,
    }));

    try {
      const result = await compressVideoFile(item.file, {
        compressionLevel,
        onProgress: (event) => {
          const raw = event as any;
          const ratio =
            typeof raw.progress === 'number'
              ? raw.progress
              : typeof raw.ratio === 'number'
              ? raw.ratio
              : typeof raw.percent === 'number'
              ? raw.percent / 100
              : 0;

          const percent = Math.round(clamp(ratio * 100, 0, 100));

          updateItem(item.id, (current) => ({
            ...current,
            progressPercent: Number.isFinite(percent) ? percent : current.progressPercent,
          }));
        },
        onLog: (event) => {
          const msg = (event && ((event as any).message ?? (event as any).msg)) || String(event);
          const text = typeof msg === 'string' ? msg : JSON.stringify(msg);
          updateItem(item.id, (current) => ({
            ...current,
            logs: [...(current.logs ?? []), text].slice(-12),
          }));
          // also emit to console for easier debugging in devtools
          // eslint-disable-next-line no-console
          console.debug('[video-compression][log]', text);
        },
      });
      const nextResultUrl = URL.createObjectURL(result.file);

      updateItem(item.id, (current) => {
        if (current.resultUrl) {
          URL.revokeObjectURL(current.resultUrl);
        }

        return {
          ...current,
          metadata: result.metadata,
          status: 'done',
          resultFile: result.file,
          resultUrl: nextResultUrl,
          progressPercent: 100,
          errorMessage: undefined,
        };
      });
    } catch (error) {
      updateItem(item.id, (current) => ({
        ...current,
        status: 'error',
        progressPercent: 0,
        errorMessage: error instanceof Error ? error.message : ui.genericError,
        logs: [...(current.logs ?? []), error instanceof Error ? error.message : String(error)].slice(-12),
      }));
    }
  };

  const handleCompressAll = async () => {
    if (!items.length || isCompressing) {
      return;
    }

    setIsCompressing(true);

    try {
      const snapshot = [...items];
      for (const item of snapshot) {
        await handleCompressSingle(item);
      }
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownloadAll = () => {
    completedItems.forEach((item, index) => {
      const resultFile = item.resultFile;
      if (!resultFile) {
        return;
      }

      setTimeout(() => {
        downloadBlob(resultFile, resultFile.name);
      }, index * 130);
    });
  };

  return (
    <Card className="space-y-5">
      <header className="rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 to-indigo-50 p-4">
        <h3 className="text-lg font-semibold text-slate-900">{ui.title}</h3>
        <p className="mt-1 text-sm text-slate-700">{ui.intro}</p>
      </header>

      <FileUploadDropzone
        locale={locale}
        label={ui.filesLabel}
        helperText={ui.filesHint}
        accept={acceptedVideoTypes}
        multiple
        maxSize={1024 * 1024 * 1024}
        selectedFiles={items.map((item) => item.file)}
        onFilesSelected={handleAddFiles}
        onRemoveFile={handleRemoveFile}
      />

      <label className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-slate-800">{ui.compressionLevelLabel}</span>
          <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
            {ui.compressionLevelBadge(compressionLevel)}
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={100}
          value={compressionLevel}
          onChange={(event) => setCompressionLevel(Number(event.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-brand-600"
        />
        <span className="text-xs text-slate-500">{ui.compressionLevelHint}</span>
      </label>

      {hasFiles ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-700">
            {ui.currentSizeLabel}: <strong>{formatBytes(totalSourceSize)}</strong> •{' '}
            {ui.estimatedSizeLabel}: <strong>{formatBytes(totalEstimatedSize)}</strong>
          </p>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
          {ui.noFilesHint}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          onClick={() => {
            void handleCompressAll();
          }}
          disabled={!hasFiles || isCompressing}
        >
          {isCompressing ? ui.compressingAll : ui.compressAll}
        </Button>
        <Button variant="secondary" onClick={handleDownloadAll} disabled={!canDownloadAll}>
          {ui.downloadAll}
        </Button>
        <Button variant="ghost" onClick={handleClearAll} disabled={!hasFiles || isCompressing}>
          {ui.clearAll}
        </Button>
      </div>

      {items.length ? (
        <div className="space-y-4">
          {items.map((item) => {
            const estimatedSize = estimateCompressedVideoSize(
              item.file.size,
              item.metadata?.durationInSeconds ?? 0,
              compressionLevel,
            );
            const hasResult = Boolean(item.resultFile && item.resultUrl);
            const savings = hasResult
              ? calculateSavingsPercent(item.file.size, item.resultFile?.size ?? item.file.size)
              : calculateSavingsPercent(item.file.size, estimatedSize);

            return (
              <article
                key={item.id}
                className="space-y-3 rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-semibold text-slate-900">{item.file.name}</h4>
                    <p className="text-xs text-slate-600">
                      {ui.currentSizeLabel}: {formatBytes(item.file.size)} • {ui.estimatedSizeLabel}:{' '}
                      {formatBytes(estimatedSize)} • {ui.savingsLabel(savings)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {ui.durationLabel}: {formatDuration(item.metadata?.durationInSeconds ?? 0)} •{' '}
                      {ui.resolutionLabel}: {formatResolution(item.metadata)}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-2 py-1 text-xs font-semibold ${statusClassName[item.status]}`}
                  >
                    {getStatusLabel(ui, item.status)}
                  </span>
                </div>

                {item.status === 'compressing' ? (
                  <div className="space-y-2">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-brand-600 transition-all"
                        style={{ width: `${item.progressPercent}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-600">
                      {ui.processing} {item.progressPercent}%
                    </p>
                  </div>
                ) : null}

                <div className="grid gap-3 md:grid-cols-2">
                  <section className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <h5 className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                      {ui.sourcePreview}
                    </h5>
                    <video
                      src={item.sourceUrl}
                      controls
                      preload="metadata"
                      className="h-44 w-full rounded-md border border-slate-200 bg-black/90 object-contain"
                    />
                  </section>

                  <section className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <h5 className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                      {ui.resultPreview}
                    </h5>
                    {hasResult && item.resultUrl ? (
                      <>
                        <video
                          src={item.resultUrl}
                          controls
                          preload="metadata"
                          className="h-44 w-full rounded-md border border-slate-200 bg-black/90 object-contain"
                        />
                        <p className="text-xs text-slate-600">
                          {ui.finalSizeLabel}: {formatBytes(item.resultFile?.size ?? 0)}
                        </p>
                      </>
                    ) : item.status === 'error' ? (
                      <p className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">
                        {item.errorMessage ?? ui.genericError}
                      </p>
                    ) : item.status === 'compressing' ? (
                      <p className="rounded-md border border-amber-200 bg-amber-50 p-2 text-sm text-amber-700">
                        {ui.processing}
                      </p>
                    ) : (
                      <p className="rounded-md border border-slate-200 bg-white p-2 text-sm text-slate-600">
                        {ui.waitingCompression}
                      </p>
                    )}

                    {item.logs && item.logs.length ? (
                      <div className="mt-2 rounded-md border border-slate-100 bg-slate-50 p-2 text-xs text-slate-600">
                        <strong className="font-semibold">Logs:</strong>
                        <ul className="mt-1 list-inside list-disc space-y-1">
                          {item.logs.map((l, idx) => (
                            <li key={idx} className="break-words">
                              {l}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </section>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      void handleCompressSingle(item);
                    }}
                    disabled={item.status === 'compressing' || isCompressing}
                  >
                    {ui.compressButton}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      if (item.resultFile) {
                        downloadBlob(item.resultFile, item.resultFile.name);
                      }
                    }}
                    disabled={!item.resultFile}
                  >
                    {ui.downloadButton}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}

      <p className="text-xs text-slate-600">{ui.ffmpegWarmupNote}</p>
      <p className="text-xs text-slate-600">{ui.processingLocalNote}</p>
    </Card>
  );
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));
