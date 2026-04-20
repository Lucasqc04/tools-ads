'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ImageViewer } from '@/components/shared/image-viewer';
import {
  availableBase64ImageOutputFormats,
  exportParsedBase64Image,
  parseBase64ImageInput,
  type Base64ImageOutputFormat,
  type ParsedBase64Image,
} from '@/lib/base64-image';
import { type AppLocale } from '@/lib/i18n/config';

type Base64ImageViewerToolProps = Readonly<{
  locale?: AppLocale;
}>;

type ViewerUi = {
  title: string;
  intro: string;
  inputLabel: string;
  inputPlaceholder: string;
  fallbackMimeLabel: string;
  fallbackMimeHint: string;
  outputFormatLabel: string;
  outputFormatOriginal: string;
  viewImage: string;
  previewTitle: string;
  previewEmpty: string;
  clear: string;
  download: string;
  downloading: string;
  localNote: string;
  invalidPrefix: string;
  mimeTypes: Array<{ value: string; label: string }>;
  formatLabels: Record<Base64ImageOutputFormat, string>;
};

const uiByLocale: Record<AppLocale, ViewerUi> = {
  'pt-br': {
    title: 'Leitor de Base64 para imagem',
    intro:
      'Cole um Base64 e veja a imagem em tempo real. Depois baixe em varios formatos com um clique.',
    inputLabel: 'Base64 da imagem',
    inputPlaceholder: 'Cole aqui um data URL ou Base64 puro da imagem',
    fallbackMimeLabel: 'MIME padrao para Base64 puro',
    fallbackMimeHint:
      'Quando o texto nao tiver prefixo data:image, este tipo sera usado para renderizar a imagem.',
    outputFormatLabel: 'Formato para download',
    outputFormatOriginal: 'Original decodificado',
    viewImage: 'Ver imagem',
    previewTitle: 'Preview da imagem',
    previewEmpty: 'Cole um Base64 valido para ver a imagem aqui.',
    clear: 'Limpar',
    download: 'Baixar imagem',
    downloading: 'Baixando...',
    localNote:
      'Decodificacao e preview acontecem localmente no navegador. O Base64 nao e enviado para servidor por padrao.',
    invalidPrefix: 'Erro:',
    mimeTypes: [
      { value: 'image/png', label: 'PNG (image/png)' },
      { value: 'image/jpeg', label: 'JPEG (image/jpeg)' },
      { value: 'image/webp', label: 'WEBP (image/webp)' },
      { value: 'image/gif', label: 'GIF (image/gif)' },
      { value: 'image/svg+xml', label: 'SVG (image/svg+xml)' },
    ],
    formatLabels: {
      png: 'PNG',
      jpeg: 'JPEG',
      webp: 'WEBP',
      avif: 'AVIF',
      gif: 'GIF',
      bmp: 'BMP',
      tiff: 'TIFF',
      ico: 'ICO',
      svg: 'SVG',
      tga: 'TGA',
    },
  },
  en: {
    title: 'Base64 image viewer',
    intro:
      'Paste Base64 and preview the image instantly. Then download it in multiple formats.',
    inputLabel: 'Image Base64',
    inputPlaceholder: 'Paste a data URL or raw image Base64 here',
    fallbackMimeLabel: 'Fallback MIME for raw Base64',
    fallbackMimeHint:
      'When content has no data:image prefix, this type is used for image rendering.',
    outputFormatLabel: 'Download format',
    outputFormatOriginal: 'Original decoded file',
    viewImage: 'View image',
    previewTitle: 'Image preview',
    previewEmpty: 'Paste a valid Base64 string to preview image here.',
    clear: 'Clear',
    download: 'Download image',
    downloading: 'Downloading...',
    localNote:
      'Decoding and preview run locally in your browser. Base64 input is not sent to a server by default.',
    invalidPrefix: 'Error:',
    mimeTypes: [
      { value: 'image/png', label: 'PNG (image/png)' },
      { value: 'image/jpeg', label: 'JPEG (image/jpeg)' },
      { value: 'image/webp', label: 'WEBP (image/webp)' },
      { value: 'image/gif', label: 'GIF (image/gif)' },
      { value: 'image/svg+xml', label: 'SVG (image/svg+xml)' },
    ],
    formatLabels: {
      png: 'PNG',
      jpeg: 'JPEG',
      webp: 'WEBP',
      avif: 'AVIF',
      gif: 'GIF',
      bmp: 'BMP',
      tiff: 'TIFF',
      ico: 'ICO',
      svg: 'SVG',
      tga: 'TGA',
    },
  },
  es: {
    title: 'Lector de Base64 para imagen',
    intro:
      'Pega un Base64 y previsualiza la imagen al instante. Luego descargala en varios formatos.',
    inputLabel: 'Base64 de la imagen',
    inputPlaceholder: 'Pega aqui un data URL o Base64 puro de imagen',
    fallbackMimeLabel: 'MIME por defecto para Base64 puro',
    fallbackMimeHint:
      'Si el contenido no tiene prefijo data:image, se usa este tipo para renderizar la imagen.',
    outputFormatLabel: 'Formato de descarga',
    outputFormatOriginal: 'Archivo original decodificado',
    viewImage: 'Ver imagen',
    previewTitle: 'Vista previa de la imagen',
    previewEmpty: 'Pega un Base64 valido para ver la imagen aqui.',
    clear: 'Limpiar',
    download: 'Descargar imagen',
    downloading: 'Descargando...',
    localNote:
      'La decodificacion y vista previa se realizan localmente en tu navegador. El Base64 no se envia al servidor por defecto.',
    invalidPrefix: 'Error:',
    mimeTypes: [
      { value: 'image/png', label: 'PNG (image/png)' },
      { value: 'image/jpeg', label: 'JPEG (image/jpeg)' },
      { value: 'image/webp', label: 'WEBP (image/webp)' },
      { value: 'image/gif', label: 'GIF (image/gif)' },
      { value: 'image/svg+xml', label: 'SVG (image/svg+xml)' },
    ],
    formatLabels: {
      png: 'PNG',
      jpeg: 'JPEG',
      webp: 'WEBP',
      avif: 'AVIF',
      gif: 'GIF',
      bmp: 'BMP',
      tiff: 'TIFF',
      ico: 'ICO',
      svg: 'SVG',
      tga: 'TGA',
    },
  },
};

export function Base64ImageViewerTool({ locale = 'pt-br' }: Base64ImageViewerToolProps) {
  const ui = uiByLocale[locale];

  const [input, setInput] = useState('');
  const [fallbackMime, setFallbackMime] = useState('image/png');
  const [parsed, setParsed] = useState<ParsedBase64Image | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [outputFormat, setOutputFormat] = useState<Base64ImageOutputFormat | 'original'>('original');
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    if (!input.trim()) {
      setParsed(null);
      setErrorMessage('');
      return;
    }

    const timer = setTimeout(() => {
      try {
        const decoded = parseBase64ImageInput(input, fallbackMime);
        setParsed(decoded);
        setErrorMessage('');
      } catch (error) {
        setParsed(null);
        setErrorMessage(error instanceof Error ? error.message : 'Base64 invalido.');
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [input, fallbackMime]);

  const outputFormatOptions = useMemo(
    () => [
      { value: 'original', label: ui.outputFormatOriginal },
      ...availableBase64ImageOutputFormats.map((format) => ({
        value: format,
        label: ui.formatLabels[format],
      })),
    ],
    [ui],
  );

  const handleDownload = async () => {
    if (!parsed) {
      return;
    }

    setIsDownloading(true);

    try {
      await exportParsedBase64Image(parsed, outputFormat);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleOpenViewer = () => {
    if (!parsed) {
      return;
    }

    setIsViewerOpen(true);
  };

  return (
    <Card className="space-y-5">
      <header className="rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 to-indigo-50 p-4">
        <h3 className="text-lg font-semibold text-slate-900">{ui.title}</h3>
        <p className="mt-1 text-sm text-slate-700">{ui.intro}</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="space-y-4">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.inputLabel}</span>
            <Textarea
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
              }}
              className="min-h-[280px] font-mono text-xs"
              placeholder={ui.inputPlaceholder}
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.fallbackMimeLabel}</span>
            <Select value={fallbackMime} onChange={(event) => setFallbackMime(event.target.value)}>
              {ui.mimeTypes.map((mime) => (
                <option key={mime.value} value={mime.value}>
                  {mime.label}
                </option>
              ))}
            </Select>
            <span className="text-xs text-slate-500">{ui.fallbackMimeHint}</span>
          </label>
        </section>

        <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-semibold text-slate-800">{ui.previewTitle}</h4>

          <div className="flex min-h-[240px] items-center justify-center rounded-lg border border-slate-200 bg-white p-3">
            {parsed ? (
              <img
                src={parsed.dataUrl}
                alt="Preview da imagem Base64"
                className="max-h-[320px] w-auto max-w-full object-contain"
              />
            ) : (
              <p className="text-center text-sm text-slate-600">{ui.previewEmpty}</p>
            )}
          </div>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.outputFormatLabel}</span>
            <Select
              value={outputFormat}
              onChange={(event) =>
                setOutputFormat(event.target.value as Base64ImageOutputFormat | 'original')
              }
            >
              {outputFormatOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </label>

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={handleDownload} disabled={!parsed || isDownloading}>
              {isDownloading ? ui.downloading : ui.download}
            </Button>
            <Button variant="secondary" onClick={handleOpenViewer} disabled={!parsed}>
              {ui.viewImage}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setInput('');
                setParsed(null);
                setErrorMessage('');
              }}
            >
              {ui.clear}
            </Button>
          </div>
        </section>
      </div>

      {errorMessage ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {ui.invalidPrefix} {errorMessage}
        </p>
      ) : null}

      <p className="text-xs text-slate-600">{ui.localNote}</p>

      <ImageViewer
        src={parsed?.dataUrl ?? ''}
        alt={ui.previewTitle}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        onDownload={parsed ? handleDownload : undefined}
      />
    </Card>
  );
}
