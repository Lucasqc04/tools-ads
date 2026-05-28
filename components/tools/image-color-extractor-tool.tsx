'use client';

import { useCallback, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUploadDropzone } from '@/components/shared/file-upload-dropzone';
import type { AppLocale } from '@/lib/i18n/config';
import {
  extractColorsFromImageData,
  formatHsl,
  formatRgb,
  type PaletteColor,
} from '@/lib/color-utils';

type ImageColorExtractorToolProps = Readonly<{
  locale?: AppLocale;
}>;

type ExportFormat = 'css' | 'json' | 'tailwind' | 'scss' | 'hex';

const labels: Record<string, Record<AppLocale, string>> = {
  dropzone: { 'pt-br': 'Arraste uma imagem aqui ou clique para selecionar', en: 'Drag an image here or click to select', es: 'Arrastra una imagen aquí o haz clic para seleccionar' },
  dropzoneHint: { 'pt-br': 'JPG, PNG, WebP, GIF, SVG, BMP', en: 'JPG, PNG, WebP, GIF, SVG, BMP', es: 'JPG, PNG, WebP, GIF, SVG, BMP' },
  colorCount: { 'pt-br': 'Quantidade de cores', en: 'Color count', es: 'Cantidad de colores' },
  extract: { 'pt-br': 'Extrair cores', en: 'Extract colors', es: 'Extraer colores' },
  palette: { 'pt-br': 'Paleta extraída', en: 'Extracted palette', es: 'Paleta extraída' },
  export: { 'pt-br': 'Exportar', en: 'Export', es: 'Exportar' },
  copy: { 'pt-br': 'Copiar', en: 'Copy', es: 'Copiar' },
  copied: { 'pt-br': 'Copiado!', en: 'Copied!', es: '¡Copiado!' },
  openConverter: { 'pt-br': 'Abrir no conversor', en: 'Open in converter', es: 'Abrir en conversor' },
  privacy: { 'pt-br': '🔒 Processamento 100% local. Nenhuma imagem é enviada ao servidor.', en: '🔒 100% local processing. No image is sent to any server.', es: '🔒 Procesamiento 100% local. Ninguna imagen se envía al servidor.' },
  noImage: { 'pt-br': 'Selecione uma imagem para começar', en: 'Select an image to start', es: 'Selecciona una imagen para comenzar' },
  filterWhite: { 'pt-br': 'Ignorar brancos', en: 'Ignore whites', es: 'Ignorar blancos' },
  filterBlack: { 'pt-br': 'Ignorar pretos', en: 'Ignore blacks', es: 'Ignorar negros' },
  exportCss: { 'pt-br': 'Variáveis CSS', en: 'CSS Variables', es: 'Variables CSS' },
  exportJson: { 'pt-br': 'JSON', en: 'JSON', es: 'JSON' },
  exportTailwind: { 'pt-br': 'Tailwind Config', en: 'Tailwind Config', es: 'Tailwind Config' },
  exportScss: { 'pt-br': 'SCSS', en: 'SCSS', es: 'SCSS' },
  exportHex: { 'pt-br': 'Lista HEX', en: 'HEX List', es: 'Lista HEX' },
  processing: { 'pt-br': 'Processando...', en: 'Processing...', es: 'Procesando...' },
  newImage: { 'pt-br': 'Nova imagem', en: 'New image', es: 'Nueva imagen' },
};

function l(key: string, locale: AppLocale): string {
  return labels[key]?.[locale] ?? labels[key]?.['pt-br'] ?? key;
}

function generateExport(colors: PaletteColor[], format: ExportFormat): string {
  switch (format) {
    case 'css':
      return `:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n')}\n}`;
    case 'json':
      return JSON.stringify(
        colors.map((c) => ({ hex: c.hex, rgb: formatRgb(c.rgb), hsl: formatHsl(c.hsl), percentage: c.percentage })),
        null,
        2,
      );
    case 'tailwind':
      return `// tailwind.config.ts → theme.extend.colors\ncolors: {\n${colors.map((c, i) => `  'palette-${i + 1}': '${c.hex}',`).join('\n')}\n}`;
    case 'scss':
      return colors.map((c, i) => `$color-${i + 1}: ${c.hex};`).join('\n');
    case 'hex':
      return colors.map((c) => c.hex).join('\n');
  }
}

export function ImageColorExtractorTool({ locale = 'pt-br' }: ImageColorExtractorToolProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [colors, setColors] = useState<PaletteColor[]>([]);
  const [colorCount, setColorCount] = useState(8);
  const [ignoreWhite, setIgnoreWhite] = useState(true);
  const [ignoreBlack, setIgnoreBlack] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const copyToClipboard = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    });
  }, []);

  const processImage = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setImageFile(file);
    setProcessing(true);
    setColors([]);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) { setProcessing(false); return; }

      const maxSize = 400;
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);

      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) { setProcessing(false); return; }

      ctx.drawImage(img, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);

      const extracted = extractColorsFromImageData(imageData, colorCount, {
        ignoreWhite,
        ignoreBlack,
      });
      setColors(extracted);
      setProcessing(false);
    };
    img.onerror = () => { setProcessing(false); };
    img.src = url;
  }, [colorCount, ignoreWhite, ignoreBlack]);

  const handleFilesSelected = useCallback((files: File[]) => {
    const file = files[0];
    if (file?.type.startsWith('image/')) processImage(file);
  }, [processImage]);

  const handleRemoveFile = useCallback(() => {
    setImageUrl(null);
    setImageFile(null);
    setColors([]);
  }, []);

  const reExtract = useCallback(() => {
    if (!imageUrl) return;
    setProcessing(true);
    setColors([]);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) { setProcessing(false); return; }

      const maxSize = 400;
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);

      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) { setProcessing(false); return; }

      ctx.drawImage(img, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);

      const extracted = extractColorsFromImageData(imageData, colorCount, {
        ignoreWhite,
        ignoreBlack,
      });
      setColors(extracted);
      setProcessing(false);
    };
    img.src = imageUrl;
  }, [imageUrl, colorCount, ignoreWhite, ignoreBlack]);

  return (
    <div className="space-y-6">
      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Upload area */}
      <FileUploadDropzone
        locale={locale}
        label={l('dropzone', locale)}
        helperText={l('dropzoneHint', locale)}
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/bmp"
        multiple={false}
        selectedFiles={imageFile ? [imageFile] : []}
        onFilesSelected={handleFilesSelected}
        onRemoveFile={handleRemoveFile}
      />

      {/* Image preview */}
      {imageUrl && (
        <Card className="p-4 md:p-6">
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Uploaded"
              className="max-h-64 rounded-lg border object-contain"
            />
          </div>
        </Card>
      )}

      {/* Controls */}
      {imageUrl && (
        <Card className="p-4 md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                {l('colorCount', locale)}: {colorCount}
              </label>
              <input
                type="range"
                min={3}
                max={16}
                value={colorCount}
                onChange={(e) => setColorCount(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex gap-3">
              <label className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                <input type="checkbox" checked={ignoreWhite} onChange={(e) => setIgnoreWhite(e.target.checked)} />
                {l('filterWhite', locale)}
              </label>
              <label className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                <input type="checkbox" checked={ignoreBlack} onChange={(e) => setIgnoreBlack(e.target.checked)} />
                {l('filterBlack', locale)}
              </label>
            </div>
            <Button className="h-8 px-3 text-xs" onClick={reExtract} disabled={processing}>
              {processing ? l('processing', locale) : l('extract', locale)}
            </Button>
          </div>
        </Card>
      )}

      {/* Palette display */}
      {colors.length > 0 && (
        <Card className="p-4 md:p-6">
          <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">{l('palette', locale)}</h3>

          {/* Color swatches */}
          <div className="mb-4 grid grid-cols-4 gap-2 sm:grid-cols-8">
            {colors.map((color, i) => (
              <div key={color.hex} className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  className="relative h-12 w-full rounded-lg border transition-transform hover:scale-105"
                  style={{ backgroundColor: color.hex }}
                  onClick={() => copyToClipboard(color.hex, `color-${i}`)}
                  title={color.hex}
                >
                  {copiedKey === `color-${i}` && (
                    <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 text-xs text-white">✓</span>
                  )}
                </button>
                <span className="text-[10px] font-mono text-gray-500">{color.hex}</span>
                {color.percentage !== undefined && (
                  <span className="text-[9px] text-gray-400">{color.percentage}%</span>
                )}
              </div>
            ))}
          </div>

          {/* Color detail table */}
          <div className="mb-4 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-1 pr-3">#</th>
                  <th className="pb-1 pr-3">HEX</th>
                  <th className="pb-1 pr-3">RGB</th>
                  <th className="pb-1 pr-3">HSL</th>
                  <th className="pb-1 pr-3">%</th>
                  <th className="pb-1"></th>
                </tr>
              </thead>
              <tbody>
                {colors.map((color) => (
                  <tr key={color.hex} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-1.5 pr-3">
                      <div className="h-4 w-4 rounded" style={{ backgroundColor: color.hex }} />
                    </td>
                    <td className="py-1.5 pr-3 font-mono">{color.hex}</td>
                    <td className="py-1.5 pr-3 font-mono">{formatRgb(color.rgb)}</td>
                    <td className="py-1.5 pr-3 font-mono">{formatHsl(color.hsl)}</td>
                    <td className="py-1.5 pr-3">{color.percentage}%</td>
                    <td className="py-1.5">
                      <a
                        href={`/${locale}/tools/color-converter?color=${encodeURIComponent(color.hex)}`}
                        className="text-brand-600 hover:underline"
                        title={l('openConverter', locale)}
                      >
                        →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Export buttons */}
          <div className="flex flex-wrap gap-2">
            {(['css', 'json', 'tailwind', 'scss', 'hex'] as ExportFormat[]).map((format) => (
              <Button
                key={format}
                variant="secondary"
                className="h-8 px-3 text-xs"
                onClick={() => copyToClipboard(generateExport(colors, format), `export-${format}`)}
              >
                {copiedKey === `export-${format}` ? l('copied', locale) : l(`export${format.charAt(0).toUpperCase() + format.slice(1)}` as string, locale)}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Privacy note */}
      <p className="text-xs text-gray-400">{l('privacy', locale)}</p>
    </div>
  );
}
