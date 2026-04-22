'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState } from 'react';
import { FileUploadDropzone } from '@/components/shared/file-upload-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { type AppLocale } from '@/lib/i18n/config';
import {
  compressImageFile,
  estimateCompressedImageSize,
  type ImageCompressionOutputFormat,
} from '@/lib/image-compression';
import { calculateSavingsPercent, formatBytes } from '@/lib/file-size';
import { downloadBlob } from '@/lib/image-conversion';

type ImageCompressionToolProps = Readonly<{
  locale?: AppLocale;
}>;

type ItemStatus = 'pending' | 'compressing' | 'done' | 'error';

type ImageCompressionItem = {
  id: string;
  file: File;
  sourceUrl: string;
  status: ItemStatus;
  resultFile?: File;
  resultUrl?: string;
  errorMessage?: string;
};

type ImageCompressionUi = {
  title: string;
  intro: string;
  filesLabel: string;
  filesHint: string;
  outputFormatLabel: string;
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
  savingsLabel: (value: number) => string;
  outputFormatSame: string;
  outputFormatJpeg: string;
  outputFormatWebp: string;
  done: string;
  pending: string;
  error: string;
  compressButton: string;
  downloadButton: string;
  processingLocalNote: string;
  genericError: string;
};

const uiByLocale: Record<AppLocale, ImageCompressionUi> = {
  'pt-br': {
    title: 'Compressor de imagem em lote',
    intro:
      'Reduza tamanho de varias imagens de uma vez, ajuste o nivel de compressao e veja preview antes de baixar.',
    filesLabel: 'Imagens para comprimir',
    filesHint: 'Adicione varias imagens. O processamento acontece localmente no navegador.',
    outputFormatLabel: 'Formato de saida',
    compressionLevelLabel: 'Nivel de compressao',
    compressionLevelHint:
      'Quanto maior o nivel, menor tende a ficar o arquivo final (com mais perda de qualidade).',
    compressionLevelBadge: (value) => `${value}%`,
    compressAll: 'Comprimir todas',
    compressingAll: 'Comprimindo...',
    clearAll: 'Limpar lista',
    downloadAll: 'Baixar todas',
    sourcePreview: 'Original',
    resultPreview: 'Comprimida',
    waitingCompression: 'Aguardando compressao.',
    processing: 'Processando...',
    noFilesHint: 'Adicione imagens para iniciar a compressao em lote.',
    estimatedSizeLabel: 'Estimativa',
    currentSizeLabel: 'Tamanho atual',
    finalSizeLabel: 'Tamanho final',
    savingsLabel: (value) => `Reducao: ${value.toFixed(1)}%`,
    outputFormatSame: 'Manter formato original',
    outputFormatJpeg: 'Converter para JPEG',
    outputFormatWebp: 'Converter para WEBP',
    done: 'Concluido',
    pending: 'Pendente',
    error: 'Erro',
    compressButton: 'Comprimir',
    downloadButton: 'Baixar',
    processingLocalNote:
      'Nenhuma imagem e enviada para servidor por padrao. A compressao acontece localmente no seu navegador.',
    genericError: 'Nao foi possivel comprimir esta imagem.',
  },
  en: {
    title: 'Batch image compressor',
    intro:
      'Reduce the size of multiple images at once, choose compression level, and preview before downloading.',
    filesLabel: 'Images to compress',
    filesHint: 'Add multiple images. Processing runs locally in your browser.',
    outputFormatLabel: 'Output format',
    compressionLevelLabel: 'Compression level',
    compressionLevelHint:
      'Higher levels usually produce smaller files, with more visible quality loss.',
    compressionLevelBadge: (value) => `${value}%`,
    compressAll: 'Compress all',
    compressingAll: 'Compressing...',
    clearAll: 'Clear list',
    downloadAll: 'Download all',
    sourcePreview: 'Original',
    resultPreview: 'Compressed',
    waitingCompression: 'Waiting for compression.',
    processing: 'Processing...',
    noFilesHint: 'Add images to start batch compression.',
    estimatedSizeLabel: 'Estimated',
    currentSizeLabel: 'Current size',
    finalSizeLabel: 'Final size',
    savingsLabel: (value) => `Savings: ${value.toFixed(1)}%`,
    outputFormatSame: 'Keep original format',
    outputFormatJpeg: 'Convert to JPEG',
    outputFormatWebp: 'Convert to WEBP',
    done: 'Done',
    pending: 'Pending',
    error: 'Error',
    compressButton: 'Compress',
    downloadButton: 'Download',
    processingLocalNote:
      'No image is uploaded to a server by default. Compression happens locally in your browser.',
    genericError: 'Could not compress this image.',
  },
  es: {
    title: 'Compresor de imagenes por lote',
    intro:
      'Reduce el tamano de varias imagenes a la vez, ajusta el nivel de compresion y previsualiza antes de descargar.',
    filesLabel: 'Imagenes para comprimir',
    filesHint: 'Agrega varias imagenes. El procesamiento se hace localmente en el navegador.',
    outputFormatLabel: 'Formato de salida',
    compressionLevelLabel: 'Nivel de compresion',
    compressionLevelHint:
      'Un nivel mas alto suele reducir mas el archivo, con mayor perdida de calidad.',
    compressionLevelBadge: (value) => `${value}%`,
    compressAll: 'Comprimir todas',
    compressingAll: 'Comprimiendo...',
    clearAll: 'Limpiar lista',
    downloadAll: 'Descargar todas',
    sourcePreview: 'Original',
    resultPreview: 'Comprimida',
    waitingCompression: 'Esperando compresion.',
    processing: 'Procesando...',
    noFilesHint: 'Agrega imagenes para iniciar la compresion por lote.',
    estimatedSizeLabel: 'Estimado',
    currentSizeLabel: 'Tamano actual',
    finalSizeLabel: 'Tamano final',
    savingsLabel: (value) => `Reduccion: ${value.toFixed(1)}%`,
    outputFormatSame: 'Mantener formato original',
    outputFormatJpeg: 'Convertir a JPEG',
    outputFormatWebp: 'Convertir a WEBP',
    done: 'Listo',
    pending: 'Pendiente',
    error: 'Error',
    compressButton: 'Comprimir',
    downloadButton: 'Descargar',
    processingLocalNote:
      'Ninguna imagen se envia al servidor por defecto. La compresion ocurre localmente en tu navegador.',
    genericError: 'No fue posible comprimir esta imagen.',
  },
};

const acceptedImageTypes =
  'image/png,image/jpeg,image/jpg,image/webp,image/avif,image/gif,image/bmp,image/tiff,image/x-icon,.png,.jpg,.jpeg,.webp,.avif,.gif,.bmp,.tif,.tiff,.ico';

const buildId = (file: File): string =>
  `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`;

const getFileKey = (file: File): string => `${file.name}-${file.size}-${file.lastModified}`;

const statusClassName: Record<ItemStatus, string> = {
  pending: 'border-slate-200 bg-slate-100 text-slate-700',
  compressing: 'border-amber-200 bg-amber-50 text-amber-700',
  done: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  error: 'border-red-200 bg-red-50 text-red-700',
};

const getStatusLabel = (ui: ImageCompressionUi, status: ItemStatus): string => {
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

export function ImageCompressionTool({ locale = 'pt-br' }: ImageCompressionToolProps) {
  const ui = uiByLocale[locale];
  const [items, setItems] = useState<ImageCompressionItem[]>([]);
  const [compressionLevel, setCompressionLevel] = useState(56);
  const [outputFormat, setOutputFormat] = useState<ImageCompressionOutputFormat>('same');
  const [isCompressing, setIsCompressing] = useState(false);
  const itemsRef = useRef<ImageCompressionItem[]>([]);

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
    updater: (item: ImageCompressionItem) => ImageCompressionItem,
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
      items.reduce(
        (sum, item) =>
          sum + estimateCompressedImageSize(item.file.size, compressionLevel, outputFormat),
        0,
      ),
    [compressionLevel, items, outputFormat],
  );

  const handleAddFiles = (nextFiles: File[]) => {
    setItems((current) => {
      const existing = new Set(current.map((item) => getFileKey(item.file)));
      const additions = nextFiles
        .filter((file) => !existing.has(getFileKey(file)))
        .map<ImageCompressionItem>((file) => ({
          id: buildId(file),
          file,
          sourceUrl: URL.createObjectURL(file),
          status: 'pending',
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

  const handleCompressSingle = async (item: ImageCompressionItem) => {
    updateItem(item.id, (current) => ({
      ...current,
      status: 'compressing',
      errorMessage: undefined,
    }));

    try {
      const compressedFile = await compressImageFile(item.file, {
        compressionLevel,
        outputFormat,
      });
      const nextResultUrl = URL.createObjectURL(compressedFile);

      updateItem(item.id, (current) => {
        if (current.resultUrl) {
          URL.revokeObjectURL(current.resultUrl);
        }

        return {
          ...current,
          status: 'done',
          resultFile: compressedFile,
          resultUrl: nextResultUrl,
          errorMessage: undefined,
        };
      });
    } catch {
      updateItem(item.id, (current) => ({
        ...current,
        status: 'error',
        errorMessage: ui.genericError,
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
      }, index * 120);
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
        accept={acceptedImageTypes}
        multiple
        selectedFiles={items.map((item) => item.file)}
        onFilesSelected={handleAddFiles}
        onRemoveFile={handleRemoveFile}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{ui.outputFormatLabel}</span>
          <Select
            value={outputFormat}
            onChange={(event) => setOutputFormat(event.target.value as ImageCompressionOutputFormat)}
          >
            <option value="same">{ui.outputFormatSame}</option>
            <option value="jpeg">{ui.outputFormatJpeg}</option>
            <option value="webp">{ui.outputFormatWebp}</option>
          </Select>
        </label>

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
      </div>

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
            const estimatedSize = estimateCompressedImageSize(
              item.file.size,
              compressionLevel,
              outputFormat,
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
                  </div>
                  <span
                    className={`rounded-full border px-2 py-1 text-xs font-semibold ${statusClassName[item.status]}`}
                  >
                    {getStatusLabel(ui, item.status)}
                  </span>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <section className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <h5 className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                      {ui.sourcePreview}
                    </h5>
                    <img
                      src={item.sourceUrl}
                      alt={item.file.name}
                      className="h-40 w-full rounded-md border border-slate-200 bg-white object-contain"
                    />
                  </section>

                  <section className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <h5 className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                      {ui.resultPreview}
                    </h5>
                    {hasResult && item.resultUrl ? (
                      <>
                        <img
                          src={item.resultUrl}
                          alt={`${item.file.name}-compressed`}
                          className="h-40 w-full rounded-md border border-slate-200 bg-white object-contain"
                        />
                        <p className="text-xs text-slate-600">
                          {ui.finalSizeLabel}: {formatBytes(item.resultFile?.size ?? 0)}
                        </p>
                      </>
                    ) : item.status === 'compressing' ? (
                      <p className="rounded-md border border-amber-200 bg-amber-50 p-2 text-sm text-amber-700">
                        {ui.processing}
                      </p>
                    ) : item.status === 'error' ? (
                      <p className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">
                        {item.errorMessage ?? ui.genericError}
                      </p>
                    ) : (
                      <p className="rounded-md border border-slate-200 bg-white p-2 text-sm text-slate-600">
                        {ui.waitingCompression}
                      </p>
                    )}
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

      <p className="text-xs text-slate-600">{ui.processingLocalNote}</p>
    </Card>
  );
}
