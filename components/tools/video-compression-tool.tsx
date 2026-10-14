'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { FileUploadDropzone } from '@/components/shared/file-upload-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { type AppLocale } from '@/lib/i18n/config';
import {
  compressVideoFile,
  estimateCompressedVideoSize,
  LARGE_VIDEO_THRESHOLD_BYTES,
  LargeVideoCompressionError,
  MAX_VIDEO_FILE_SIZE_BYTES,
  removeLargeVideoOutput,
  readVideoMetadata,
  type CompressionLogEvent,
  type VideoMetadata,
} from '@/lib/video-compression';
import { calculateSavingsPercent, formatBytes } from '@/lib/file-size';
import { downloadBlob } from '@/lib/image-conversion';
import { trackEvent, TOOL_ID } from '@/lib/analytics';

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
  resultName?: string;
  storageFileName?: string;
  errorMessage?: string;
  startedAt?: number;
  elapsedSeconds?: number;
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
  largeFileHint: string;
  largeFileNotice: string;
  elapsedLabel: (value: string) => string;
  largeCodecError: string;
  largeStorageError: string;
  largeQuotaError: string;
  largeProcessingError: string;
};

const uiByLocale: Record<AppLocale, VideoCompressionUi> = {
  'pt-br': {
    title: 'Compressor de video online',
    intro:
      'Comprima varios videos no navegador, ajuste o nivel de compressao e compare preview antes do download.',
    filesLabel: 'Videos para comprimir',
    filesHint:
      'Envio em lote para arquivos de ate 10 GB. Videos acima de 512 MB sao processados localmente em fluxo; arquivos menores podem usar o processamento do site.',
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
      'Videos acima de 512 MB ficam no aparelho e sao processados no navegador. Arquivos menores podem ser enviados para a API de processamento do site quando disponivel.',
    done: 'Concluido',
    pending: 'Pendente',
    error: 'Erro',
    compressButton: 'Comprimir',
    downloadButton: 'Baixar',
    genericError: 'Nao foi possivel comprimir este video.',
    largeFileHint:
      'Arquivos acima de 512 MB usam processamento local em fluxo. Em um video de 5 GB, a conversao pode levar bastante tempo e depende dos codecs do navegador e do espaco livre no aparelho.',
    largeFileNotice:
      'Video grande: o processamento roda em uma tarefa separada para manter a pagina responsiva e tenta manter a tela ligada. Mantenha esta pagina aberta; ao trocar de aplicativo ou bloquear o celular, o navegador pode pausar a conversao.',
    elapsedLabel: (value) => `Tempo: ${value}`,
    largeCodecError:
      'Este navegador ou dispositivo nao oferece os codecs necessarios para comprimir este video. Tente um navegador atualizado em um computador.',
    largeStorageError:
      'O armazenamento local do navegador nao esta disponivel para salvar o video comprimido.',
    largeQuotaError:
      'Nao ha espaco livre suficiente no armazenamento do navegador para terminar esta compressao.',
    largeProcessingError:
      'Nao foi possivel processar este video grande. Mantenha a pagina aberta e tente novamente em um navegador atualizado.',
  },
  en: {
    title: 'Online video compressor',
    intro:
      'Compress multiple videos directly in your browser, control compression level, and preview before download.',
    filesLabel: 'Videos to compress',
    filesHint:
      'Batch uploads up to 10 GB are supported. Videos over 512 MB are streamed locally; smaller files may use the site processing API.',
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
      'Videos over 512 MB stay on your device and are processed in the browser. Smaller files may be sent to the site processing API when available.',
    done: 'Done',
    pending: 'Pending',
    error: 'Error',
    compressButton: 'Compress',
    downloadButton: 'Download',
    genericError: 'Could not compress this video.',
    largeFileHint:
      'Files over 512 MB use local streaming processing. A 5 GB video can take a long time and depends on browser codecs and free device storage.',
    largeFileNotice:
      'Large video: processing runs in a separate task to keep the page responsive and tries to keep the screen awake. Keep this page open; switching apps or locking your phone may pause the conversion.',
    elapsedLabel: (value) => `Time: ${value}`,
    largeCodecError:
      'This browser or device does not provide the codecs needed for this video. Try an up-to-date browser on a computer.',
    largeStorageError:
      'Browser local storage is unavailable for saving the compressed video.',
    largeQuotaError:
      'There is not enough free browser storage to finish this compression.',
    largeProcessingError:
      'This large video could not be processed. Keep the page open and try again in an up-to-date browser.',
  },
  es: {
    title: 'Compresor de video online',
    intro:
      'Comprime varios videos en el navegador, ajusta el nivel de compresion y previsualiza antes de descargar.',
    filesLabel: 'Videos para comprimir',
    filesHint:
      'Admite cargas por lote de hasta 10 GB. Los videos de mas de 512 MB se procesan localmente en flujo; los archivos menores pueden usar la API del sitio.',
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
      'Los videos de mas de 512 MB permanecen en el dispositivo y se procesan en el navegador. Los archivos menores pueden enviarse a la API del sitio cuando este disponible.',
    done: 'Listo',
    pending: 'Pendiente',
    error: 'Error',
    compressButton: 'Comprimir',
    downloadButton: 'Descargar',
    genericError: 'No fue posible comprimir este video.',
    largeFileHint:
      'Los archivos de mas de 512 MB usan procesamiento local en flujo. Un video de 5 GB puede tardar bastante y depende de los codecs del navegador y del espacio libre del dispositivo.',
    largeFileNotice:
      'Video grande: el procesamiento se ejecuta en una tarea separada para mantener la pagina activa e intenta mantener la pantalla encendida. Deja esta pagina abierta; cambiar de aplicacion o bloquear el celular puede pausar la conversion.',
    elapsedLabel: (value) => `Tiempo: ${value}`,
    largeCodecError:
      'Este navegador o dispositivo no ofrece los codecs necesarios para comprimir este video. Prueba un navegador actualizado en una computadora.',
    largeStorageError:
      'El almacenamiento local del navegador no esta disponible para guardar el video comprimido.',
    largeQuotaError:
      'No hay suficiente espacio libre en el almacenamiento del navegador para terminar esta compresion.',
    largeProcessingError:
      'No se pudo procesar este video grande. Deja la pagina abierta e intenta de nuevo en un navegador actualizado.',
  },
  zh: {
    title: 'Online video compressor',
    intro:
      'Compress multiple videos directly in your browser, control compression level, and preview before download.',
    filesLabel: 'Videos to compress',
    filesHint:
      'Batch uploads up to 10 GB are supported. Videos over 512 MB are streamed locally; smaller files may use the site processing API.',
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
      'Videos over 512 MB stay on your device and are processed in the browser. Smaller files may be sent to the site processing API when available.',
    done: 'Done',
    pending: 'Pending',
    error: 'Error',
    compressButton: 'Compress',
    downloadButton: 'Download',
    genericError: 'Could not compress this video.',
    largeFileHint:
      'Files over 512 MB use local streaming processing. A 5 GB video can take a long time and depends on browser codecs and free device storage.',
    largeFileNotice:
      'Large video: processing runs in a separate task to keep the page responsive and tries to keep the screen awake. Keep this page open; switching apps or locking your phone may pause the conversion.',
    elapsedLabel: (value) => `Time: ${value}`,
    largeCodecError:
      'This browser or device does not provide the codecs needed for this video. Try an up-to-date browser on a computer.',
    largeStorageError:
      'Browser local storage is unavailable for saving the compressed video.',
    largeQuotaError:
      'There is not enough free browser storage to finish this compression.',
    largeProcessingError:
      'This large video could not be processed. Keep the page open and try again in an up-to-date browser.',
  },
};

const acceptedVideoTypes =
  'video/mp4,video/quicktime,video/webm,video/x-m4v,video/ogg,video/x-matroska,.mp4,.mov,.m4v,.webm,.ogv,.mkv';

const buildId = (file: File): string =>
  `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`;

const getFileKey = (file: File): string => `${file.name}-${file.size}-${file.lastModified}`;

const getFileTypeLabel = (file: File): string => {
  const mimeSubtype = file.type.split('/')[1];
  if (mimeSubtype) {
    return mimeSubtype.toLowerCase();
  }

  const extension = file.name.split('.').pop();
  return extension ? extension.toLowerCase() : 'unknown';
};

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

const requestScreenWakeLock = async (): Promise<WakeLockSentinel | null> => {
  if (typeof navigator === 'undefined' || !navigator.wakeLock || document.visibilityState !== 'visible') {
    return null;
  }

  try {
    return await navigator.wakeLock.request('screen');
  } catch {
    return null;
  }
};

const getLargeVideoErrorMessage = (error: unknown, ui: VideoCompressionUi): string => {
  if (!(error instanceof LargeVideoCompressionError)) {
    return error instanceof Error ? error.message : ui.genericError;
  }

  switch (error.code) {
    case 'webcodecs_unsupported':
    case 'unsupported_codec':
      return ui.largeCodecError;
    case 'storage_unavailable':
      return ui.largeStorageError;
    case 'storage_quota':
      return ui.largeQuotaError;
    default:
      return ui.largeProcessingError;
  }
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
  const isAnyItemCompressing = items.some((item) => item.status === 'compressing');
  const hasLargeFiles = items.some((item) => item.file.size > LARGE_VIDEO_THRESHOLD_BYTES);

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
        if (item.storageFileName) {
          void removeLargeVideoOutput(item.storageFileName);
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

      additions.forEach((addition) => {
        trackEvent('file_uploaded', {
          tool: TOOL_ID.videoCompression,
          locale,
          file_type: getFileTypeLabel(addition.file),
        });
      });

      return [...current, ...additions];
    });
  };

  const handleRemoveFile = (index: number) => {
    if (isCompressing || isAnyItemCompressing) {
      return;
    }

    setItems((current) => {
      const target = current[index];
      if (!target) {
        return current;
      }

      URL.revokeObjectURL(target.sourceUrl);
      if (target.resultUrl) {
        URL.revokeObjectURL(target.resultUrl);
      }
      if (target.storageFileName) {
        void removeLargeVideoOutput(target.storageFileName);
      }

      return current.filter((_, currentIndex) => currentIndex !== index);
    });
  };

  const handleClearAll = () => {
    if (isCompressing || isAnyItemCompressing) {
      return;
    }

    setItems((current) => {
      current.forEach((item) => {
        URL.revokeObjectURL(item.sourceUrl);
        if (item.resultUrl) {
          URL.revokeObjectURL(item.resultUrl);
        }
        if (item.storageFileName) {
          void removeLargeVideoOutput(item.storageFileName);
        }
      });

      return [];
    });
  };

  useEffect(() => {
    if (!isAnyItemCompressing) {
      return;
    }

    const interval = window.setInterval(() => {
      const now = Date.now();
      setItems((current) =>
        current.map((item) =>
          item.status === 'compressing' && item.startedAt
            ? { ...item, elapsedSeconds: Math.floor((now - item.startedAt) / 1000) }
            : item,
        ),
      );
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isAnyItemCompressing]);

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
    const startedAt = Date.now();
    if (item.resultUrl) {
      URL.revokeObjectURL(item.resultUrl);
    }
    if (item.storageFileName) {
      void removeLargeVideoOutput(item.storageFileName);
    }

    updateItem(item.id, (current) => ({
      ...current,
      status: 'compressing',
      progressPercent: 0,
      resultFile: undefined,
      resultUrl: undefined,
      resultName: undefined,
      storageFileName: undefined,
      errorMessage: undefined,
      startedAt,
      elapsedSeconds: 0,
    }));

    trackEvent('tool_started', {
      tool: TOOL_ID.videoCompression,
      locale,
      file_type: getFileTypeLabel(item.file),
    });

    let wakeLock: WakeLockSentinel | null = null;

    try {
      if (item.file.size > LARGE_VIDEO_THRESHOLD_BYTES) {
        wakeLock = await requestScreenWakeLock();
      }

      const result = await compressVideoFile(item.file, {
        compressionLevel,
        onProgress: (event) => {
          const percent = Math.round(clamp(event.progress * 100, 0, 100));

          updateItem(item.id, (current) => ({
            ...current,
            progressPercent: Number.isFinite(percent) ? percent : current.progressPercent,
          }));
        },
        onLog: (event: CompressionLogEvent) => {
          const text = event.message;
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
          resultName: result.file.name,
          storageFileName: result.storageFileName,
          progressPercent: 100,
          errorMessage: undefined,
          startedAt: undefined,
          elapsedSeconds: Math.floor((Date.now() - startedAt) / 1000),
        };
      });

      trackEvent('tool_completed', {
        tool: TOOL_ID.videoCompression,
        locale,
        format: 'mp4',
        compression_level: compressionLevel,
      });
    } catch (error) {
      const errorMessage = getLargeVideoErrorMessage(error, ui);
      updateItem(item.id, (current) => ({
        ...current,
        status: 'error',
        progressPercent: 0,
        errorMessage,
        startedAt: undefined,
        elapsedSeconds: Math.floor((Date.now() - startedAt) / 1000),
        logs: [...(current.logs ?? []), errorMessage].slice(-12),
      }));

      trackEvent('tool_error', {
        tool: TOOL_ID.videoCompression,
        locale,
        error_type: 'processing_failed',
      });
    } finally {
      await wakeLock?.release().catch(() => undefined);
    }
  };

  const handleCompressAll = async () => {
    if (!items.length || isCompressing || isAnyItemCompressing) {
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
    if (!completedItems.length) {
      return;
    }

    trackEvent('result_downloaded', {
      tool: TOOL_ID.videoCompression,
      locale,
      format: 'mp4',
      count: completedItems.length,
    });

    completedItems.forEach((item, index) => {
      const resultFile = item.resultFile;
      if (!resultFile) {
        return;
      }

      setTimeout(() => {
        const fileName = item.resultName ?? resultFile.name;
        downloadBlob(resultFile, fileName);
      }, index * 130);
    });
  };

  return (
    <Card className="space-y-5">
      <header className="border-b border-slate-200 pb-4">
        <h3 className="text-lg font-semibold text-slate-900">{ui.title}</h3>
        <p className="mt-1 text-sm text-slate-700">{ui.intro}</p>
      </header>

      <FileUploadDropzone
        locale={locale}
        label={ui.filesLabel}
        helperText={ui.filesHint}
        accept={acceptedVideoTypes}
        multiple
        maxSize={MAX_VIDEO_FILE_SIZE_BYTES}
        selectedFiles={items.map((item) => item.file)}
        onFilesSelected={handleAddFiles}
        onRemoveFile={handleRemoveFile}
      />

      {hasLargeFiles ? (
        <p
          role="status"
          className={`rounded-lg border p-3 text-sm ${
            isAnyItemCompressing
              ? 'border-amber-200 bg-amber-50 text-amber-800'
              : 'border-blue-200 bg-blue-50 text-blue-800'
          }`}
        >
          {isAnyItemCompressing ? ui.largeFileNotice : ui.largeFileHint}
        </p>
      ) : null}

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
          disabled={!hasFiles || isCompressing || isAnyItemCompressing}
        >
          {isCompressing || isAnyItemCompressing ? ui.compressingAll : ui.compressAll}
        </Button>
        <Button variant="secondary" onClick={handleDownloadAll} disabled={!canDownloadAll}>
          {ui.downloadAll}
        </Button>
        <Button
          variant="ghost"
          onClick={handleClearAll}
          disabled={!hasFiles || isCompressing || isAnyItemCompressing}
        >
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
                      {ui.processing} {item.progressPercent}% •{' '}
                      {ui.elapsedLabel(formatDuration(item.elapsedSeconds ?? 0))}
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
                    disabled={item.status === 'compressing' || isCompressing || isAnyItemCompressing}
                  >
                    {ui.compressButton}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      if (item.resultFile) {
                        trackEvent('result_downloaded', {
                          tool: TOOL_ID.videoCompression,
                          locale,
                          format: 'mp4',
                        });
                        downloadBlob(item.resultFile, item.resultName ?? item.resultFile.name);
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
