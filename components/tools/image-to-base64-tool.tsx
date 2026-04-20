'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FileUploadDropzone } from '@/components/shared/file-upload-dropzone';
import { ImageViewer } from '@/components/shared/image-viewer';
import {
  availableBase64ImageOutputFormats,
  imageFileToBase64DataUrl,
  normalizeImageOutputFormat,
} from '@/lib/base64-image';
import {
  convertImageToImage,
  downloadBlob,
  isImageFormatAvailableForOutput,
} from '@/lib/image-conversion';
import { type AppLocale } from '@/lib/i18n/config';
import type { RasterImageFormatId } from '@/types/image-conversion';

type ImageToBase64ToolProps = Readonly<{
  locale?: AppLocale;
}>;

type Mode = 'data-url' | 'base64-only';

type EncoderUi = {
  title: string;
  intro: string;
  fileLabel: string;
  fileHint: string;
  outputImageFormatLabel: string;
  outputTextModeLabel: string;
  modeDataUrl: string;
  modeBase64Only: string;
  viewImage: string;
  generatedBase64Label: string;
  previewTitle: string;
  previewEmpty: string;
  copy: string;
  copied: string;
  downloadTxt: string;
  clear: string;
  converting: string;
  genericError: string;
  localNote: string;
  unsupportedOutput: string;
  formatLabels: Record<RasterImageFormatId, string>;
};

const uiByLocale: Record<AppLocale, EncoderUi> = {
  'pt-br': {
    title: 'Gerador de Base64 por imagem',
    intro:
      'Envie uma imagem e gere Base64 automaticamente. Escolha formato de saida e copie o resultado em um clique.',
    fileLabel: 'Imagem de origem',
    fileHint: 'PNG, JPG, WEBP, GIF, SVG e outros formatos de imagem sao aceitos.',
    outputImageFormatLabel: 'Formato da imagem para codificar',
    outputTextModeLabel: 'Modo do texto Base64',
    modeDataUrl: 'Data URL completo',
    modeBase64Only: 'Somente Base64',
    viewImage: 'Ver imagem',
    generatedBase64Label: 'Base64 gerado',
    previewTitle: 'Preview da imagem',
    previewEmpty: 'Selecione uma imagem para gerar Base64 e ver o preview.',
    copy: 'Copiar',
    copied: 'Copiado',
    downloadTxt: 'Baixar .txt',
    clear: 'Limpar',
    converting: 'Gerando Base64...',
    genericError: 'Nao foi possivel gerar Base64 para essa imagem.',
    localNote:
      'Conversao para Base64 acontece localmente no navegador. A imagem nao e enviada para servidor por padrao.',
    unsupportedOutput: 'Formato de saida nao suportado neste navegador.',
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
      heic: 'HEIC',
      heif: 'HEIF',
      dds: 'DDS',
      hdr: 'HDR',
      exr: 'EXR',
      psd: 'PSD',
      raw: 'RAW',
      cr2: 'CR2',
      nef: 'NEF',
      arw: 'ARW',
    },
  },
  en: {
    title: 'Image to Base64 generator',
    intro:
      'Upload an image and generate Base64 automatically. Choose output format and copy in one click.',
    fileLabel: 'Source image',
    fileHint: 'PNG, JPG, WEBP, GIF, SVG and other image formats are accepted.',
    outputImageFormatLabel: 'Image format to encode',
    outputTextModeLabel: 'Base64 text mode',
    modeDataUrl: 'Full data URL',
    modeBase64Only: 'Base64 only',
    viewImage: 'View image',
    generatedBase64Label: 'Generated Base64',
    previewTitle: 'Image preview',
    previewEmpty: 'Select an image to generate Base64 and preview it.',
    copy: 'Copy',
    copied: 'Copied',
    downloadTxt: 'Download .txt',
    clear: 'Clear',
    converting: 'Generating Base64...',
    genericError: 'Could not generate Base64 for this image.',
    localNote:
      'Base64 conversion runs locally in your browser. The image is not sent to a server by default.',
    unsupportedOutput: 'Selected output format is not supported in this browser.',
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
      heic: 'HEIC',
      heif: 'HEIF',
      dds: 'DDS',
      hdr: 'HDR',
      exr: 'EXR',
      psd: 'PSD',
      raw: 'RAW',
      cr2: 'CR2',
      nef: 'NEF',
      arw: 'ARW',
    },
  },
  es: {
    title: 'Generador de Base64 desde imagen',
    intro:
      'Sube una imagen y genera Base64 automaticamente. Elige formato de salida y copia en un clic.',
    fileLabel: 'Imagen de origen',
    fileHint: 'Se aceptan PNG, JPG, WEBP, GIF, SVG y otros formatos de imagen.',
    outputImageFormatLabel: 'Formato de imagen para codificar',
    outputTextModeLabel: 'Modo del texto Base64',
    modeDataUrl: 'Data URL completo',
    modeBase64Only: 'Solo Base64',
    viewImage: 'Ver imagen',
    generatedBase64Label: 'Base64 generado',
    previewTitle: 'Vista previa de la imagen',
    previewEmpty: 'Selecciona una imagen para generar Base64 y ver la vista previa.',
    copy: 'Copiar',
    copied: 'Copiado',
    downloadTxt: 'Descargar .txt',
    clear: 'Limpiar',
    converting: 'Generando Base64...',
    genericError: 'No fue posible generar Base64 para esta imagen.',
    localNote:
      'La conversion a Base64 se realiza localmente en tu navegador. La imagen no se envia al servidor por defecto.',
    unsupportedOutput: 'El formato de salida seleccionado no es compatible con este navegador.',
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
      heic: 'HEIC',
      heif: 'HEIF',
      dds: 'DDS',
      hdr: 'HDR',
      exr: 'EXR',
      psd: 'PSD',
      raw: 'RAW',
      cr2: 'CR2',
      nef: 'NEF',
      arw: 'ARW',
    },
  },
};

const fileInputAccept = 'image/*';

const buildTextFileName = (sourceName: string): string => {
  const base = sourceName
    .replace(/\.[^.]+$/, '')
    .trim()
    .replaceAll(/[^a-zA-Z0-9-_]+/g, '-')
    .replaceAll(/-+/g, '-')
    .replaceAll(/^-+|-+$/g, '');

  return `${base || 'base64-image'}.txt`;
};

export function ImageToBase64Tool({ locale = 'pt-br' }: ImageToBase64ToolProps) {
  const ui = uiByLocale[locale];

  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState<RasterImageFormatId>('png');
  const [mode, setMode] = useState<Mode>('data-url');
  const [dataUrl, setDataUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const outputFormats = useMemo(
    () => availableBase64ImageOutputFormats.filter((format) => isImageFormatAvailableForOutput(format)),
    [],
  );

  const outputText = useMemo(() => {
    if (!dataUrl) {
      return '';
    }

    if (mode === 'base64-only') {
      return dataUrl.split(',')[1] ?? '';
    }

    return dataUrl;
  }, [dataUrl, mode]);

  useEffect(() => {
    if (!sourceFile) {
      setDataUrl('');
      setPreviewUrl('');
      setIsConverting(false);
      setErrorMessage('');
      return;
    }

    if (!isImageFormatAvailableForOutput(outputFormat)) {
      setErrorMessage(ui.unsupportedOutput);
      return;
    }

    let cancelled = false;

    const run = async () => {
      setIsConverting(true);
      setErrorMessage('');
      setCopied(false);

      try {
        const sourceToken = normalizeImageOutputFormat(sourceFile.type.split('/')[1] ?? '');
        const shouldConvert = sourceToken !== outputFormat;

        let finalBlob: Blob;
        let finalFile: File;

        if (shouldConvert) {
          finalBlob = await convertImageToImage(sourceFile, outputFormat);
          finalFile = new File([finalBlob], `converted.${outputFormat}`, {
            type: finalBlob.type,
          });
        } else {
          finalBlob = sourceFile;
          finalFile = sourceFile;
        }

        const generatedDataUrl = await imageFileToBase64DataUrl(finalFile);

        if (cancelled) {
          return;
        }

        setDataUrl(generatedDataUrl);

        const objectUrl = URL.createObjectURL(finalBlob);
        setPreviewUrl((previous) => {
          if (previous) {
            URL.revokeObjectURL(previous);
          }

          return objectUrl;
        });
      } catch {
        if (!cancelled) {
          setDataUrl('');
          setPreviewUrl('');
          setErrorMessage(ui.genericError);
        }
      } finally {
        if (!cancelled) {
          setIsConverting(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [sourceFile, outputFormat, ui.genericError, ui.unsupportedOutput]);

  useEffect(
    () => () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    },
    [previewUrl],
  );

  const handleCopy = async () => {
    if (!outputText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleDownloadText = () => {
    if (!outputText || !sourceFile) {
      return;
    }

    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, buildTextFileName(sourceFile.name));
  };

  return (
    <Card className="space-y-5">
      <header className="rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 to-indigo-50 p-4">
        <h3 className="text-lg font-semibold text-slate-900">{ui.title}</h3>
        <p className="mt-1 text-sm text-slate-700">{ui.intro}</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="space-y-4">
          <FileUploadDropzone
            locale={locale}
            label={ui.fileLabel}
            helperText={ui.fileHint}
            accept={fileInputAccept}
            multiple={false}
            onFilesSelected={(files) => {
              setSourceFile(files[0] ?? null);
              setCopied(false);
            }}
            selectedFiles={sourceFile ? [sourceFile] : []}
            onRemoveFile={() => {
              setSourceFile(null);
              setCopied(false);
            }}
          />

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.outputImageFormatLabel}</span>
            <Select
              value={outputFormat}
              onChange={(event) => setOutputFormat(event.target.value as RasterImageFormatId)}
            >
              {outputFormats.map((format) => (
                <option key={format} value={format}>
                  {ui.formatLabels[format]}
                </option>
              ))}
            </Select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.outputTextModeLabel}</span>
            <Select value={mode} onChange={(event) => setMode(event.target.value as Mode)}>
              <option value="data-url">{ui.modeDataUrl}</option>
              <option value="base64-only">{ui.modeBase64Only}</option>
            </Select>
          </label>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h4 className="text-sm font-semibold text-slate-800">{ui.previewTitle}</h4>
            <div className="mt-2 flex min-h-[220px] items-center justify-center rounded-lg border border-slate-200 bg-white p-3">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview da imagem"
                  className="max-h-[280px] w-auto max-w-full object-contain"
                />
              ) : (
                <p className="text-center text-sm text-slate-600">{ui.previewEmpty}</p>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.generatedBase64Label}</span>
            <Textarea
              value={isConverting ? ui.converting : outputText}
              readOnly
              className="min-h-[360px] font-mono text-xs"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={handleCopy} disabled={!outputText || isConverting}>
              {copied ? ui.copied : ui.copy}
            </Button>
            <Button variant="secondary" onClick={() => setIsViewerOpen(true)} disabled={!previewUrl}>
              {ui.viewImage}
            </Button>
            <Button variant="secondary" onClick={handleDownloadText} disabled={!outputText || isConverting}>
              {ui.downloadTxt}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setSourceFile(null);
                setDataUrl('');
                setErrorMessage('');
                setCopied(false);
                setPreviewUrl((previous) => {
                  if (previous) {
                    URL.revokeObjectURL(previous);
                  }

                  return '';
                });
              }}
            >
              {ui.clear}
            </Button>
          </div>

          {errorMessage ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}
        </section>
      </div>

      <p className="text-xs text-slate-600">{ui.localNote}</p>

      <ImageViewer
        src={previewUrl}
        alt={ui.previewTitle}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />
    </Card>
  );
}
