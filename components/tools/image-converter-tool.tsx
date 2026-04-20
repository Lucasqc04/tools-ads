'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { FileUploadDropzone } from '@/components/shared/file-upload-dropzone';
import { ImageViewer } from '@/components/shared/image-viewer';
import { cn } from '@/lib/cn';
import {
  buildConvertedFileName,
  convertImageToImage,
  convertImageToPdf,
  convertPdfToImages,
  downloadBlob,
  formatSupportsQuality,
  getPdfPageCount,
  isImageFormatAvailableForOutput,
} from '@/lib/image-conversion';
import { type AppLocale } from '@/lib/i18n/config';
import type { ImageFormatId, RasterImageFormatId } from '@/types/image-conversion';

type ImageConverterToolProps = Readonly<{
  locale?: AppLocale;
  initialFromFormat?: ImageFormatId;
  initialToFormat?: ImageFormatId;
}>;

type SingleResult = {
  blob: Blob;
  url: string;
  filename: string;
  outputFormat: ImageFormatId;
};

type MultiResultItem = {
  pageNumber: number;
  blob: Blob;
  url: string;
  filename: string;
  width: number;
  height: number;
};

type MultiResult = {
  items: MultiResultItem[];
  totalPages: number;
};

type FormatGroupId = 'web' | 'desktop' | 'mobile' | 'pro' | 'raw' | 'document';

const formatGroups: Array<{ id: FormatGroupId; formats: ImageFormatId[] }> = [
  {
    id: 'web',
    formats: ['png', 'jpeg', 'webp', 'avif', 'gif', 'svg'],
  },
  {
    id: 'desktop',
    formats: ['bmp', 'tiff', 'ico', 'tga', 'dds'],
  },
  {
    id: 'mobile',
    formats: ['heic', 'heif'],
  },
  {
    id: 'pro',
    formats: ['hdr', 'exr', 'psd'],
  },
  {
    id: 'raw',
    formats: ['raw', 'cr2', 'nef', 'arw'],
  },
  {
    id: 'document',
    formats: ['pdf'],
  },
];

const formatOrder: ImageFormatId[] = formatGroups.flatMap((group) => group.formats);

const acceptedFileByFormat: Record<ImageFormatId, string> = {
  png: '.png,image/png',
  jpeg: '.jpg,.jpeg,image/jpeg,image/jpg',
  webp: '.webp,image/webp',
  avif: '.avif,image/avif',
  bmp: '.bmp,image/bmp,image/x-ms-bmp',
  tiff: '.tif,.tiff,image/tiff',
  ico: '.ico,image/x-icon,image/vnd.microsoft.icon',
  gif: '.gif,image/gif',
  svg: '.svg,image/svg+xml',
  heic: '.heic,image/heic',
  heif: '.heif,image/heif',
  tga: '.tga,image/x-tga',
  dds: '.dds,image/vnd.ms-dds',
  hdr: '.hdr,image/vnd.radiance',
  exr: '.exr,image/x-exr',
  psd: '.psd,image/vnd.adobe.photoshop',
  raw: '.raw,.dng,application/octet-stream',
  cr2: '.cr2,image/x-canon-cr2',
  nef: '.nef,image/x-nikon-nef',
  arw: '.arw,image/x-sony-arw',
  pdf: '.pdf,application/pdf',
};

const fileExtensionsByFormat: Record<ImageFormatId, string[]> = {
  png: ['png'],
  jpeg: ['jpg', 'jpeg', 'jpe'],
  webp: ['webp'],
  avif: ['avif'],
  bmp: ['bmp'],
  tiff: ['tif', 'tiff'],
  ico: ['ico'],
  gif: ['gif'],
  svg: ['svg'],
  heic: ['heic'],
  heif: ['heif'],
  tga: ['tga'],
  dds: ['dds'],
  hdr: ['hdr'],
  exr: ['exr'],
  psd: ['psd'],
  raw: ['raw', 'dng'],
  cr2: ['cr2'],
  nef: ['nef'],
  arw: ['arw'],
  pdf: ['pdf'],
};

const mimeTypesByFormat: Record<ImageFormatId, string[]> = {
  png: ['image/png'],
  jpeg: ['image/jpeg', 'image/jpg'],
  webp: ['image/webp'],
  avif: ['image/avif'],
  bmp: ['image/bmp', 'image/x-ms-bmp'],
  tiff: ['image/tiff'],
  ico: ['image/x-icon', 'image/vnd.microsoft.icon'],
  gif: ['image/gif'],
  svg: ['image/svg+xml'],
  heic: ['image/heic'],
  heif: ['image/heif'],
  tga: ['image/x-tga'],
  dds: ['image/vnd.ms-dds'],
  hdr: ['image/vnd.radiance'],
  exr: ['image/x-exr'],
  psd: ['image/vnd.adobe.photoshop'],
  raw: ['application/octet-stream', 'image/x-adobe-dng'],
  cr2: ['image/x-canon-cr2'],
  nef: ['image/x-nikon-nef'],
  arw: ['image/x-sony-arw'],
  pdf: ['application/pdf'],
};

type LocaleUi = {
  title: string;
  description: string;
  fromFormat: string;
  toFormat: string;
  sourceFile: string;
  qualityLabel: string;
  pdfPageLimitLabel: string;
  pdfPageLimitHint: string;
  pdfMetaLoading: string;
  pdfMetaSummary: (totalPages: number, generatedPages: number) => string;
  loadedFile: string;
  sourcePreviewTitle: string;
  resultPreviewTitle: string;
  pdfResultMessage: string;
  outputSupportHint: string;
  outputSupportReady: string;
  outputSupportUnavailable: string;
  convert: string;
  converting: string;
  reset: string;
  download: string;
  viewImage: string;
  downloadAll: string;
  convertedSingleTitle: string;
  convertedMultiTitle: string;
  multiResultSummary: (generated: number, total: number) => string;
  noFileHint: string;
  genericError: string;
  partialPagesNotice: (converted: number, total: number) => string;
  invalidFileForFormat: (formatLabel: string) => string;
  unsupportedOutput: (formatLabel: string) => string;
  formatLabels: Record<ImageFormatId, string>;
  formatGroupLabels: Record<FormatGroupId, string>;
};

const uiByLocale: Record<AppLocale, LocaleUi> = {
  'pt-br': {
    title: 'Conversor de Imagem e PDF',
    description:
      'Converta entre mais de 20 formatos de imagem e PDF, grátis, sem cadastro e com processamento local no navegador.',
    fromFormat: 'Formato de origem',
    toFormat: 'Formato de destino',
    sourceFile: 'Arquivo de origem',
    qualityLabel: 'Qualidade',
    pdfPageLimitLabel: 'Páginas do PDF para converter',
    pdfPageLimitHint: '1 imagem será gerada por página convertida.',
    pdfMetaLoading: 'Lendo quantidade total de páginas do PDF...',
    pdfMetaSummary: (totalPages, generatedPages) =>
      `PDF com ${totalPages} página(s). Nesta configuração serão geradas ${generatedPages} imagem(ns).`,
    loadedFile: 'Arquivo selecionado',
    sourcePreviewTitle: 'Prévia do arquivo de origem',
    resultPreviewTitle: 'Prévia do resultado',
    pdfResultMessage:
      'PDF gerado com sucesso. Use o botão de download para salvar o arquivo.',
    outputSupportHint:
      'Alguns formatos profissionais dependem de suporte de codificação local do navegador.',
    outputSupportReady: 'Destino compatível com o mecanismo local desta versão.',
    outputSupportUnavailable:
      'Destino ainda não disponível neste mecanismo local. Escolha outro formato.',
    convert: 'Converter',
    converting: 'Convertendo...',
    reset: 'Limpar',
    download: 'Baixar',
    viewImage: 'Ver imagem',
    downloadAll: 'Baixar todas as páginas',
    convertedSingleTitle: 'Conversão concluída',
    convertedMultiTitle: 'Páginas convertidas',
    multiResultSummary: (generated, total) =>
      `${generated} imagem(ns) gerada(s) de ${total} página(s) do PDF.`,
    noFileHint: 'Selecione um arquivo para iniciar.',
    genericError: 'Não foi possível concluir a conversão.',
    partialPagesNotice: (converted, total) =>
      `Foram convertidas ${converted} de ${total} páginas. Ajuste o limite para converter mais.`,
    invalidFileForFormat: (formatLabel) =>
      `Arquivo incompatível com ${formatLabel}. Selecione um arquivo válido para a origem escolhida.`,
    unsupportedOutput: (formatLabel) =>
      `${formatLabel} ainda não está disponível no mecanismo local desta versão.`,
    formatLabels: {
      png: 'PNG',
      jpeg: 'JPEG (JPG)',
      webp: 'WEBP',
      avif: 'AVIF',
      bmp: 'BMP',
      tiff: 'TIFF',
      ico: 'ICO',
      gif: 'GIF',
      svg: 'SVG',
      heic: 'HEIC',
      heif: 'HEIF',
      tga: 'TGA',
      dds: 'DDS',
      hdr: 'HDR',
      exr: 'EXR',
      psd: 'PSD',
      raw: 'RAW',
      cr2: 'CR2',
      nef: 'NEF',
      arw: 'ARW',
      pdf: 'PDF',
    },
    formatGroupLabels: {
      web: 'Formatos Web',
      desktop: 'Formatos Desktop',
      mobile: 'Formatos Mobile',
      pro: 'Formatos Profissionais',
      raw: 'Formatos RAW',
      document: 'Documentos',
    },
  },
  en: {
    title: 'Image and PDF Converter',
    description:
      'Convert between 20+ image formats and PDF for free, with no sign-up and local browser processing.',
    fromFormat: 'Source format',
    toFormat: 'Target format',
    sourceFile: 'Source file',
    qualityLabel: 'Quality',
    pdfPageLimitLabel: 'PDF pages to convert',
    pdfPageLimitHint: 'One image will be generated per converted page.',
    pdfMetaLoading: 'Reading total PDF page count...',
    pdfMetaSummary: (totalPages, generatedPages) =>
      `PDF has ${totalPages} page(s). This setup will generate ${generatedPages} image(s).`,
    loadedFile: 'Selected file',
    sourcePreviewTitle: 'Source preview',
    resultPreviewTitle: 'Output preview',
    pdfResultMessage: 'PDF generated successfully. Use download to save the file.',
    outputSupportHint:
      'Some professional formats depend on browser local encoding support.',
    outputSupportReady: 'Target is compatible with the local engine in this version.',
    outputSupportUnavailable:
      'Target is not yet available in this local engine. Choose another format.',
    convert: 'Convert',
    converting: 'Converting...',
    reset: 'Reset',
    download: 'Download',
    viewImage: 'View image',
    downloadAll: 'Download all pages',
    convertedSingleTitle: 'Conversion completed',
    convertedMultiTitle: 'Converted pages',
    multiResultSummary: (generated, total) =>
      `${generated} image(s) generated from ${total} PDF page(s).`,
    noFileHint: 'Select a file to start.',
    genericError: 'Could not complete conversion.',
    partialPagesNotice: (converted, total) =>
      `${converted} of ${total} pages were converted. Increase the page limit to process more.`,
    invalidFileForFormat: (formatLabel) =>
      `File is not compatible with ${formatLabel}. Select a valid file for the chosen source format.`,
    unsupportedOutput: (formatLabel) =>
      `${formatLabel} is not available in the local conversion engine yet.`,
    formatLabels: {
      png: 'PNG',
      jpeg: 'JPEG (JPG)',
      webp: 'WEBP',
      avif: 'AVIF',
      bmp: 'BMP',
      tiff: 'TIFF',
      ico: 'ICO',
      gif: 'GIF',
      svg: 'SVG',
      heic: 'HEIC',
      heif: 'HEIF',
      tga: 'TGA',
      dds: 'DDS',
      hdr: 'HDR',
      exr: 'EXR',
      psd: 'PSD',
      raw: 'RAW',
      cr2: 'CR2',
      nef: 'NEF',
      arw: 'ARW',
      pdf: 'PDF',
    },
    formatGroupLabels: {
      web: 'Web Formats',
      desktop: 'Desktop Formats',
      mobile: 'Mobile Formats',
      pro: 'Professional Formats',
      raw: 'RAW Formats',
      document: 'Documents',
    },
  },
  es: {
    title: 'Conversor de Imagen y PDF',
    description:
      'Convierte entre más de 20 formatos de imagen y PDF gratis, sin registro y con procesamiento local en el navegador.',
    fromFormat: 'Formato de origen',
    toFormat: 'Formato de destino',
    sourceFile: 'Archivo de origen',
    qualityLabel: 'Calidad',
    pdfPageLimitLabel: 'Páginas del PDF a convertir',
    pdfPageLimitHint: 'Se generará 1 imagen por cada página convertida.',
    pdfMetaLoading: 'Leyendo el total de páginas del PDF...',
    pdfMetaSummary: (totalPages, generatedPages) =>
      `El PDF tiene ${totalPages} página(s). Con esta configuración se generarán ${generatedPages} imagen(es).`,
    loadedFile: 'Archivo seleccionado',
    sourcePreviewTitle: 'Vista previa del origen',
    resultPreviewTitle: 'Vista previa del resultado',
    pdfResultMessage:
      'PDF generado correctamente. Usa el botón de descarga para guardarlo.',
    outputSupportHint:
      'Algunos formatos profesionales dependen del soporte de codificación local del navegador.',
    outputSupportReady: 'Destino compatible con el motor local en esta versión.',
    outputSupportUnavailable:
      'Destino no disponible todavía en este motor local. Elige otro formato.',
    convert: 'Convertir',
    converting: 'Convirtiendo...',
    reset: 'Limpiar',
    download: 'Descargar',
    viewImage: 'Ver imagen',
    downloadAll: 'Descargar todas las páginas',
    convertedSingleTitle: 'Conversión completada',
    convertedMultiTitle: 'Páginas convertidas',
    multiResultSummary: (generated, total) =>
      `${generated} imagen(es) generada(s) de ${total} página(s) del PDF.`,
    noFileHint: 'Selecciona un archivo para comenzar.',
    genericError: 'No fue posible completar la conversión.',
    partialPagesNotice: (converted, total) =>
      `Se convirtieron ${converted} de ${total} páginas. Aumenta el límite para procesar más.`,
    invalidFileForFormat: (formatLabel) =>
      `Archivo incompatible con ${formatLabel}. Selecciona un archivo válido para el formato de origen.`,
    unsupportedOutput: (formatLabel) =>
      `${formatLabel} todavía no está disponible en el motor de conversión local.`,
    formatLabels: {
      png: 'PNG',
      jpeg: 'JPEG (JPG)',
      webp: 'WEBP',
      avif: 'AVIF',
      bmp: 'BMP',
      tiff: 'TIFF',
      ico: 'ICO',
      gif: 'GIF',
      svg: 'SVG',
      heic: 'HEIC',
      heif: 'HEIF',
      tga: 'TGA',
      dds: 'DDS',
      hdr: 'HDR',
      exr: 'EXR',
      psd: 'PSD',
      raw: 'RAW',
      cr2: 'CR2',
      nef: 'NEF',
      arw: 'ARW',
      pdf: 'PDF',
    },
    formatGroupLabels: {
      web: 'Formatos Web',
      desktop: 'Formatos Desktop',
      mobile: 'Formatos Mobile',
      pro: 'Formatos Profesionales',
      raw: 'Formatos RAW',
      document: 'Documentos',
    },
  },
};

const getOutputFormats = (fromFormat: ImageFormatId): ImageFormatId[] =>
  formatOrder.filter((format) => format !== fromFormat);

const isFileCompatibleWithFormat = (file: File, format: ImageFormatId): boolean => {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  const mimeType = file.type.toLowerCase();

  return (
    mimeTypesByFormat[format].includes(mimeType) ||
    fileExtensionsByFormat[format].includes(extension)
  );
};

const resolveInitialFormats = (
  initialFromFormat: ImageFormatId | undefined,
  initialToFormat: ImageFormatId | undefined,
): { from: ImageFormatId; to: ImageFormatId } => {
  const from = initialFromFormat ?? 'png';
  const availableTargets = getOutputFormats(from);
  const to =
    initialToFormat && availableTargets.includes(initialToFormat)
      ? initialToFormat
      : availableTargets[0] ?? 'jpeg';

  return { from, to };
};

export function ImageConverterTool({
  locale = 'pt-br',
  initialFromFormat,
  initialToFormat,
}: ImageConverterToolProps) {
  const ui = uiByLocale[locale];
  const initialFormats = resolveInitialFormats(initialFromFormat, initialToFormat);
  const pdfMetadataRequestRef = useRef(0);

  const [fromFormat, setFromFormat] = useState<ImageFormatId>(initialFormats.from);
  const [toFormat, setToFormat] = useState<ImageFormatId>(initialFormats.to);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourcePreviewUrl, setSourcePreviewUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.9);
  const [pdfPageLimit, setPdfPageLimit] = useState(5);
  const [pdfTotalPages, setPdfTotalPages] = useState<number | null>(null);
  const [isReadingPdfMeta, setIsReadingPdfMeta] = useState(false);
  const [singleResult, setSingleResult] = useState<SingleResult | null>(null);
  const [multiResult, setMultiResult] = useState<MultiResult | null>(null);
  const [infoMessage, setInfoMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [viewerState, setViewerState] = useState<{
    src: string;
    alt: string;
    onDownload?: () => void;
  } | null>(null);

  const outputFormats = useMemo(() => getOutputFormats(fromFormat), [fromFormat]);
  const showQualityControl = formatSupportsQuality(toFormat);
  const inputAccept = acceptedFileByFormat[fromFormat];
  const acceptedFormatsDescription = useMemo(() => {
    const extensions = fileExtensionsByFormat[fromFormat]
      .map((extension) => `.${extension.toUpperCase()}`)
      .join(', ');

    return `${ui.formatLabels[fromFormat]} (${extensions})`;
  }, [fromFormat, ui.formatLabels]);
  const outputIsLocallySupported =
    toFormat === 'pdf' ? true : isImageFormatAvailableForOutput(toFormat as RasterImageFormatId);

  useEffect(() => {
    if (!sourceFile || fromFormat === 'pdf') {
      setSourcePreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(sourceFile);
    setSourcePreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [sourceFile, fromFormat]);

  useEffect(
    () => () => {
      if (singleResult) {
        URL.revokeObjectURL(singleResult.url);
      }
    },
    [singleResult],
  );

  useEffect(
    () => () => {
      multiResult?.items.forEach((item) => URL.revokeObjectURL(item.url));
    },
    [multiResult],
  );

  const clearResults = () => {
    setSingleResult((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous.url);
      }

      return null;
    });

    setMultiResult((previous) => {
      previous?.items.forEach((item) => URL.revokeObjectURL(item.url));
      return null;
    });
  };

  const resetFeedback = () => {
    setInfoMessage('');
    setErrorMessage('');
  };

  const resetPdfMetadata = () => {
    pdfMetadataRequestRef.current += 1;
    setPdfTotalPages(null);
    setIsReadingPdfMeta(false);
  };

  useEffect(() => {
    const nextFormats = resolveInitialFormats(initialFromFormat, initialToFormat);

    setFromFormat(nextFormats.from);
    setToFormat(nextFormats.to);
    setSourceFile(null);
    setQuality(0.9);
    setPdfPageLimit(5);
    resetPdfMetadata();
    clearResults();
    resetFeedback();
  }, [initialFromFormat, initialToFormat]);

  const handleFileChange = (file: File | null) => {
    clearResults();
    resetFeedback();
    resetPdfMetadata();

    if (!file) {
      setSourceFile(null);
      return;
    }

    if (!isFileCompatibleWithFormat(file, fromFormat)) {
      setSourceFile(null);
      setErrorMessage(ui.invalidFileForFormat(ui.formatLabels[fromFormat]));
      return;
    }

    setSourceFile(file);

    if (fromFormat === 'pdf') {
      const requestId = pdfMetadataRequestRef.current + 1;
      pdfMetadataRequestRef.current = requestId;
      setIsReadingPdfMeta(true);

      void getPdfPageCount(file)
        .then((totalPages) => {
          if (pdfMetadataRequestRef.current !== requestId) {
            return;
          }

          setPdfTotalPages(totalPages);
        })
        .catch(() => {
          if (pdfMetadataRequestRef.current !== requestId) {
            return;
          }

          setPdfTotalPages(null);
        })
        .finally(() => {
          if (pdfMetadataRequestRef.current !== requestId) {
            return;
          }

          setIsReadingPdfMeta(false);
        });
    }
  };

  const handleFromFormatChange = (nextFrom: ImageFormatId) => {
    const nextOutputOptions = getOutputFormats(nextFrom);
    const nextTo = nextOutputOptions.includes(toFormat) ? toFormat : nextOutputOptions[0];

    setFromFormat(nextFrom);
    setToFormat(nextTo);
    setSourceFile(null);
    setQuality(0.9);
    setPdfPageLimit(5);
    resetPdfMetadata();
    clearResults();
    resetFeedback();
  };

  const handleToFormatChange = (nextTo: ImageFormatId) => {
    setToFormat(nextTo);
    clearResults();
    resetFeedback();
  };

  const handleConvert = async () => {
    if (!sourceFile) {
      setErrorMessage(ui.noFileHint);
      return;
    }

    if (!outputIsLocallySupported && toFormat !== 'pdf') {
      setErrorMessage(ui.unsupportedOutput(ui.formatLabels[toFormat]));
      return;
    }

    setIsConverting(true);
    resetFeedback();
    clearResults();

    try {
      if (fromFormat === 'pdf') {
        const outputFormat = toFormat as RasterImageFormatId;
        const result = await convertPdfToImages(sourceFile, {
          outputFormat,
          quality,
          maxPages: pdfPageLimit,
        });

        const items: MultiResultItem[] = result.pages.map((page) => ({
          pageNumber: page.pageNumber,
          blob: page.blob,
          url: URL.createObjectURL(page.blob),
          filename: buildConvertedFileName(sourceFile.name, outputFormat, {
            pageNumber: page.pageNumber,
          }),
          width: page.width,
          height: page.height,
        }));

        setMultiResult({
          items,
          totalPages: result.totalPages,
        });

        if (result.totalPages > items.length) {
          setInfoMessage(ui.partialPagesNotice(items.length, result.totalPages));
        }

        return;
      }

      if (toFormat === 'pdf') {
        const blob = await convertImageToPdf(sourceFile);
        const url = URL.createObjectURL(blob);
        setSingleResult({
          blob,
          url,
          filename: buildConvertedFileName(sourceFile.name, 'pdf'),
          outputFormat: 'pdf',
        });
        return;
      }

      const outputFormat = toFormat as RasterImageFormatId;
      const blob = await convertImageToImage(sourceFile, outputFormat, quality);
      const url = URL.createObjectURL(blob);

      setSingleResult({
        blob,
        url,
        filename: buildConvertedFileName(sourceFile.name, outputFormat),
        outputFormat,
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : ui.genericError);
    } finally {
      setIsConverting(false);
    }
  };

  const handleReset = () => {
    setSourceFile(null);
    setQuality(0.9);
    setPdfPageLimit(5);
    resetPdfMetadata();
    resetFeedback();
    clearResults();
  };

  const estimatedGeneratedPages =
    pdfTotalPages === null ? pdfPageLimit : Math.min(pdfTotalPages, pdfPageLimit);

  return (
    <Card className="space-y-6 overflow-hidden">
      <div className="rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 to-emerald-50 p-4">
        <h3 className="text-lg font-semibold text-slate-900">{ui.title}</h3>
        <p className="mt-1 text-sm text-slate-700">{ui.description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{ui.fromFormat}</span>
          <Select
            value={fromFormat}
            onChange={(event) => handleFromFormatChange(event.target.value as ImageFormatId)}
          >
            {formatGroups.map((group) => (
              <optgroup key={group.id} label={ui.formatGroupLabels[group.id]}>
                {group.formats.map((format) => (
                  <option key={format} value={format}>
                    {ui.formatLabels[format]}
                  </option>
                ))}
              </optgroup>
            ))}
          </Select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{ui.toFormat}</span>
          <Select
            value={toFormat}
            onChange={(event) => handleToFormatChange(event.target.value as ImageFormatId)}
          >
            {formatGroups.map((group) => {
              const options = group.formats.filter((format) => outputFormats.includes(format));

              if (!options.length) {
                return null;
              }

              return (
                <optgroup key={group.id} label={ui.formatGroupLabels[group.id]}>
                  {options.map((format) => (
                    <option key={format} value={format}>
                      {ui.formatLabels[format]}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </Select>
          <p className="text-xs text-slate-600">{ui.outputSupportHint}</p>
          <p
            className={cn(
              'text-xs font-medium',
              outputIsLocallySupported ? 'text-emerald-700' : 'text-amber-700',
            )}
          >
            {outputIsLocallySupported ? ui.outputSupportReady : ui.outputSupportUnavailable}
          </p>
        </label>
      </div>

      <FileUploadDropzone
        locale={locale}
        label={ui.sourceFile}
        accept={inputAccept}
        acceptedDescription={acceptedFormatsDescription}
        multiple={false}
        onFilesSelected={(files) => handleFileChange(files[0] ?? null)}
        selectedFiles={sourceFile ? [sourceFile] : []}
        onRemoveFile={() => handleFileChange(null)}
      />

      <div
        className={cn(
          'grid gap-4',
          showQualityControl || fromFormat === 'pdf' ? 'md:grid-cols-2' : 'md:grid-cols-1',
        )}
      >
        {showQualityControl ? (
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">
              {ui.qualityLabel} ({Math.round(quality * 100)}%)
            </span>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={quality}
              onChange={(event) => setQuality(Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded bg-slate-200"
            />
          </label>
        ) : null}

        {fromFormat === 'pdf' ? (
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">
              {ui.pdfPageLimitLabel}
            </span>
            <input
              type="number"
              min={1}
              max={120}
              value={pdfPageLimit}
              onChange={(event) => {
                const parsed = Number(event.target.value);

                if (!Number.isFinite(parsed)) {
                  setPdfPageLimit(1);
                  return;
                }

                setPdfPageLimit(Math.max(1, Math.min(120, Math.trunc(parsed))));
              }}
              className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            />
            <p className="text-xs text-slate-600">{ui.pdfPageLimitHint}</p>
            <p className="text-xs font-medium text-slate-700">
              {isReadingPdfMeta
                ? ui.pdfMetaLoading
                : pdfTotalPages !== null
                  ? ui.pdfMetaSummary(pdfTotalPages, estimatedGeneratedPages)
                  : null}
            </p>
          </label>
        ) : null}
      </div>

      {sourceFile ? (
        <div className="space-y-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
          <p>
            <strong>{ui.loadedFile}:</strong> {sourceFile.name}
          </p>
          {fromFormat === 'pdf' && pdfTotalPages !== null ? (
            <p>{ui.pdfMetaSummary(pdfTotalPages, estimatedGeneratedPages)}</p>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button onClick={handleConvert} disabled={isConverting}>
          {isConverting ? ui.converting : ui.convert}
        </Button>
        <Button variant="ghost" onClick={handleReset}>
          {ui.reset}
        </Button>
      </div>

      {errorMessage ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {errorMessage}
        </p>
      ) : null}

      {infoMessage ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {infoMessage}
        </p>
      ) : null}

      {sourcePreviewUrl ? (
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-800">{ui.sourcePreviewTitle}</h3>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-2">
            <img
              src={sourcePreviewUrl}
              alt="source preview"
              className="max-h-[320px] w-full rounded-lg object-contain"
            />
          </div>
          <Button
            variant="secondary"
            onClick={() =>
              setViewerState({
                src: sourcePreviewUrl,
                alt: ui.sourcePreviewTitle,
                onDownload: sourceFile
                  ? () => downloadBlob(sourceFile, sourceFile.name)
                  : undefined,
              })
            }
          >
            {ui.viewImage}
          </Button>
        </section>
      ) : null}

      {singleResult ? (
        <section className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <h3 className="text-lg font-semibold text-emerald-900">{ui.convertedSingleTitle}</h3>
          <p className="text-sm text-emerald-800">
            {singleResult.filename} · {ui.formatLabels[singleResult.outputFormat]}
          </p>

          {singleResult.outputFormat !== 'pdf' ? (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-800">{ui.resultPreviewTitle}</p>
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-2">
                <img
                  src={singleResult.url}
                  alt="converted output"
                  className="max-h-[320px] w-full rounded-lg object-contain"
                />
              </div>
              <Button
                variant="secondary"
                onClick={() =>
                  setViewerState({
                    src: singleResult.url,
                    alt: singleResult.filename,
                    onDownload: () => downloadBlob(singleResult.blob, singleResult.filename),
                  })
                }
              >
                {ui.viewImage}
              </Button>
            </div>
          ) : (
            <p className="text-sm text-emerald-900">{ui.pdfResultMessage}</p>
          )}

          <Button onClick={() => downloadBlob(singleResult.blob, singleResult.filename)}>
            {ui.download}
          </Button>
        </section>
      ) : null}

      {multiResult ? (
        <section className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <h3 className="text-lg font-semibold text-emerald-900">{ui.convertedMultiTitle}</h3>
          <p className="text-sm text-emerald-800">
            {ui.multiResultSummary(multiResult.items.length, multiResult.totalPages)}
          </p>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {multiResult.items.map((item) => (
              <article
                key={item.pageNumber}
                className="space-y-2 rounded-lg border border-slate-200 bg-white p-3"
              >
                <p className="text-sm font-semibold text-slate-900">
                  #{item.pageNumber} · {item.width}x{item.height}
                </p>

                <div className="overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                  <img
                    src={item.url}
                    alt={`page ${item.pageNumber}`}
                    className="h-[160px] w-full object-contain"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => downloadBlob(item.blob, item.filename)}
                  >
                    {ui.download}
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() =>
                      setViewerState({
                        src: item.url,
                        alt: `#${item.pageNumber}`,
                        onDownload: () => downloadBlob(item.blob, item.filename),
                      })
                    }
                  >
                    {ui.viewImage}
                  </Button>
                </div>
              </article>
            ))}
          </div>

          <Button
            variant="secondary"
            onClick={() => {
              multiResult.items.forEach((item, index) => {
                globalThis.setTimeout(() => downloadBlob(item.blob, item.filename), index * 120);
              });
            }}
          >
            {ui.downloadAll}
          </Button>
        </section>
      ) : null}

      <ImageViewer
        src={viewerState?.src ?? ''}
        alt={viewerState?.alt ?? ui.resultPreviewTitle}
        isOpen={Boolean(viewerState)}
        onClose={() => setViewerState(null)}
        onDownload={viewerState?.onDownload}
      />
    </Card>
  );
}
