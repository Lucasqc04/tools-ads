'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { AppLocale } from '@/lib/i18n/config';
import {
  checkContrast,
  formatCmyk,
  formatHsl,
  formatHsla,
  formatHsv,
  formatRgb,
  formatRgba,
  fullParse,
  generateAnalogous,
  generateComplementary,
  generateScale,
  generateTriadic,
  hexToRgb,
  isLightColor,
  type ParsedColor,
} from '@/lib/color-utils';

type ColorConverterToolProps = Readonly<{
  locale?: AppLocale;
}>;

const FAVORITES_KEY = 'color-converter-favorites-v1';

const labels: Record<string, Record<AppLocale, string>> = {
  inputPlaceholder: { 'pt-br': 'Digite uma cor (ex: #7c3aed, rgb(124,58,237), hsl(262,83%,58%), tomato)', en: 'Enter a color (e.g. #7c3aed, rgb(124,58,237), hsl(262,83%,58%), tomato)', es: 'Ingresa un color (ej: #7c3aed, rgb(124,58,237), hsl(262,83%,58%), tomato)' },
  preview: { 'pt-br': 'Preview', en: 'Preview', es: 'Vista previa' },
  formats: { 'pt-br': 'Formatos', en: 'Formats', es: 'Formatos' },
  copy: { 'pt-br': 'Copiar', en: 'Copy', es: 'Copiar' },
  copied: { 'pt-br': 'Copiado!', en: 'Copied!', es: '¡Copiado!' },
  copyAll: { 'pt-br': 'Copiar todos', en: 'Copy all', es: 'Copiar todos' },
  contrast: { 'pt-br': 'Contraste', en: 'Contrast', es: 'Contraste' },
  contrastBg: { 'pt-br': 'Cor de fundo', en: 'Background color', es: 'Color de fondo' },
  contrastRatio: { 'pt-br': 'Razão de contraste', en: 'Contrast ratio', es: 'Relación de contraste' },
  scale: { 'pt-br': 'Escala de tonalidades', en: 'Shade scale', es: 'Escala de tonos' },
  complementary: { 'pt-br': 'Complementar', en: 'Complementary', es: 'Complementario' },
  analogous: { 'pt-br': 'Análogas', en: 'Analogous', es: 'Análogos' },
  triadic: { 'pt-br': 'Triádica', en: 'Triadic', es: 'Triádica' },
  cssName: { 'pt-br': 'Nome CSS', en: 'CSS Name', es: 'Nombre CSS' },
  tailwind: { 'pt-br': 'Tailwind', en: 'Tailwind', es: 'Tailwind' },
  palettes: { 'pt-br': 'Paletas', en: 'Palettes', es: 'Paletas' },
  favorites: { 'pt-br': 'Favoritos', en: 'Favorites', es: 'Favoritos' },
  addFav: { 'pt-br': 'Favoritar', en: 'Favorite', es: 'Favorito' },
  removeFav: { 'pt-br': 'Remover', en: 'Remove', es: 'Quitar' },
  invalidColor: { 'pt-br': 'Cor inválida', en: 'Invalid color', es: 'Color inválido' },
  privacy: { 'pt-br': '🔒 Processamento 100% local. Nenhum dado é enviado ao servidor.', en: '🔒 100% local processing. No data is sent to any server.', es: '🔒 Procesamiento 100% local. Ningún dato se envía al servidor.' },
  suggestion: { 'pt-br': 'Sugestão: texto', en: 'Suggestion: text', es: 'Sugerencia: texto' },
  openExtractor: { 'pt-br': 'Extrair cores de imagem →', en: 'Extract colors from image →', es: 'Extraer colores de imagen →' },
};

function l(key: string, locale: AppLocale): string {
  return labels[key]?.[locale] ?? labels[key]?.['pt-br'] ?? key;
}

export function ColorConverterTool({ locale = 'pt-br' }: ColorConverterToolProps) {
  const [input, setInput] = useState('#7c3aed');
  const [bgInput, setBgInput] = useState('#ffffff');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const f = localStorage.getItem(FAVORITES_KEY);
      if (f) setFavorites(JSON.parse(f));
    } catch { /* ignore */ }
  }, []);

  const parsed: ParsedColor | null = useMemo(() => fullParse(input), [input]);
  const bgParsed = useMemo(() => fullParse(bgInput), [bgInput]);

  const contrastResult = useMemo(() => {
    if (!parsed || !bgParsed) return null;
    return checkContrast(parsed.rgb, bgParsed.rgb);
  }, [parsed, bgParsed]);

  const scale = useMemo(() => (parsed ? generateScale(parsed.hex) : []), [parsed]);
  const complementary = useMemo(() => (parsed ? generateComplementary(parsed.hex) : null), [parsed]);
  const analogous = useMemo(() => (parsed ? generateAnalogous(parsed.hex) : []), [parsed]);
  const triadic = useMemo(() => (parsed ? generateTriadic(parsed.hex) : []), [parsed]);

  const copyToClipboard = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    });
  }, []);

  const toggleFavorite = useCallback((hex: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(hex) ? prev.filter((h) => h !== hex) : [...prev, hex];
      try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
      return updated;
    });
  }, []);

  const formats = useMemo(() => {
    if (!parsed) return [];
    return [
      { label: 'HEX', value: parsed.hex },
      { label: 'HEX8', value: parsed.hex8 },
      { label: 'RGB', value: formatRgb(parsed.rgb) },
      { label: 'RGBA', value: formatRgba(parsed.rgba) },
      { label: 'HSL', value: formatHsl(parsed.hsl) },
      { label: 'HSLA', value: formatHsla(parsed.hsla) },
      { label: 'HSV', value: formatHsv(parsed.hsv) },
      { label: 'CMYK', value: formatCmyk(parsed.cmyk) },
    ];
  }, [parsed]);

  const copyAllFormats = useCallback(() => {
    const text = formats.map((f) => `${f.label}: ${f.value}`).join('\n');
    copyToClipboard(text, 'all');
  }, [formats, copyToClipboard]);

  const isFav = parsed ? favorites.includes(parsed.hex) : false;

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="p-4 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={l('inputPlaceholder', locale)}
              className="font-mono text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={parsed?.hex ?? '#000000'}
              onChange={(e) => setInput(e.target.value)}
              className="h-10 w-10 cursor-pointer rounded border border-gray-300 p-0"
              aria-label="Color picker"
            />
            {parsed && (
              <Button
                variant="secondary"
                className="h-8 px-3 text-xs"
                onClick={() => toggleFavorite(parsed.hex)}
              >
                {isFav ? '★' : '☆'} {isFav ? l('removeFav', locale) : l('addFav', locale)}
              </Button>
            )}
          </div>
        </div>

        {!parsed && input.trim() !== '' && (
          <p className="mt-2 text-sm text-red-500">{l('invalidColor', locale)}</p>
        )}
      </Card>

      {parsed && (
        <>
          {/* Preview + Formats */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Preview */}
            <Card className="p-4 md:p-6">
              <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">{l('preview', locale)}</h3>
              <div
                className="flex h-32 items-center justify-center rounded-lg border text-sm font-mono"
                style={{ backgroundColor: parsed.hex }}
              >
                <span style={{ color: isLightColor(parsed.rgb) ? '#000000' : '#ffffff' }}>
                  {parsed.hex}
                </span>
              </div>
              {parsed.cssName && (
                <p className="mt-2 text-xs text-gray-500">
                  {l('cssName', locale)}: <span className="font-mono">{parsed.cssName}</span>
                </p>
              )}
              {parsed.tailwind && (
                <p className="mt-1 text-xs text-gray-500">
                  {l('tailwind', locale)}: <span className="font-mono">{parsed.tailwind}</span>
                </p>
              )}
            </Card>

            {/* Formats */}
            <Card className="p-4 md:p-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{l('formats', locale)}</h3>
                <Button variant="ghost" className="h-8 px-3 text-xs" onClick={copyAllFormats}>
                  {copiedKey === 'all' ? l('copied', locale) : l('copyAll', locale)}
                </Button>
              </div>
              <div className="space-y-2">
                {formats.map((f) => (
                  <div key={f.label} className="flex items-center justify-between gap-2 rounded bg-slate-800 px-3 py-1.5">
                    <span className="text-xs font-medium text-slate-300 min-w-[40px]">{f.label}</span>
                    <code className="flex-1 truncate text-xs text-white">{f.value}</code>
                    <Button
                      variant="ghost"
                      className="h-6 px-2 text-xs text-slate-200 hover:text-white"
                      onClick={() => copyToClipboard(f.value, f.label)}
                    >
                      {copiedKey === f.label ? '✓' : l('copy', locale)}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Contrast Checker */}
          <Card className="p-4 md:p-6">
            <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">{l('contrast', locale)}</h3>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label className="mb-1 block text-xs text-gray-500">{l('contrastBg', locale)}</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={bgInput}
                    onChange={(e) => setBgInput(e.target.value)}
                    className="font-mono text-sm"
                  />
                  <input
                    type="color"
                    value={bgParsed?.hex ?? '#ffffff'}
                    onChange={(e) => setBgInput(e.target.value)}
                    className="h-10 w-10 cursor-pointer rounded border border-gray-300 p-0"
                    aria-label="Background color picker"
                  />
                </div>
              </div>
              {contrastResult && (
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{contrastResult.ratio}:1</p>
                    <p className="text-xs text-gray-500">{l('contrastRatio', locale)}</p>
                  </div>
                  <div className={`rounded px-2 py-1 text-xs font-bold ${
                    contrastResult.level === 'AAA' ? 'bg-green-100 text-green-800' :
                    contrastResult.level === 'AA' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    WCAG {contrastResult.level === 'fail' ? 'Fail' : contrastResult.level}
                  </div>
                </div>
              )}
            </div>
            {contrastResult && bgParsed && (
              <div
                className="mt-4 flex items-center justify-center rounded-lg border p-4"
                style={{ backgroundColor: bgParsed.hex, color: parsed.hex }}
              >
                <span className="text-lg font-semibold">
                  {locale === 'en' ? 'Sample text' : locale === 'es' ? 'Texto de ejemplo' : 'Texto de exemplo'}
                </span>
              </div>
            )}
          </Card>

          {/* Scale */}
          <Card className="p-4 md:p-6">
            <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">{l('scale', locale)}</h3>
            <div className="flex flex-wrap gap-1">
              {scale.map((s) => (
                <button
                  key={s.shade}
                  type="button"
                  className="group relative flex h-12 w-full flex-1 min-w-[40px] cursor-pointer flex-col items-center justify-center rounded transition-transform hover:scale-105"
                  style={{ backgroundColor: s.hex }}
                  onClick={() => copyToClipboard(s.hex, `scale-${s.shade}`)}
                  title={s.hex}
                >
                  <span
                    className="text-[10px] font-medium opacity-80"
                    style={{ color: isLightColor(s.rgb) ? '#000' : '#fff' }}
                  >
                    {s.shade}
                  </span>
                  {copiedKey === `scale-${s.shade}` && (
                    <span className="absolute -top-5 rounded bg-black px-1.5 py-0.5 text-[10px] text-white">✓</span>
                  )}
                </button>
              ))}
            </div>
          </Card>

          {/* Palettes */}
          <Card className="p-4 md:p-6">
            <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">{l('palettes', locale)}</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Complementary */}
              <div>
                <p className="mb-1 text-xs font-medium text-gray-500">{l('complementary', locale)}</p>
                <div className="flex gap-1">
                  <ColorSwatch hex={parsed.hex} onClick={() => copyToClipboard(parsed.hex, 'comp-1')} copied={copiedKey === 'comp-1'} />
                  {complementary && (
                    <ColorSwatch hex={complementary} onClick={() => copyToClipboard(complementary, 'comp-2')} copied={copiedKey === 'comp-2'} />
                  )}
                </div>
              </div>
              {/* Analogous */}
              <div>
                <p className="mb-1 text-xs font-medium text-gray-500">{l('analogous', locale)}</p>
                <div className="flex gap-1">
                  {analogous.map((hex, i) => (
                    <ColorSwatch key={hex} hex={hex} onClick={() => copyToClipboard(hex, `analog-${i}`)} copied={copiedKey === `analog-${i}`} />
                  ))}
                </div>
              </div>
              {/* Triadic */}
              <div>
                <p className="mb-1 text-xs font-medium text-gray-500">{l('triadic', locale)}</p>
                <div className="flex gap-1">
                  {triadic.map((hex, i) => (
                    <ColorSwatch key={hex} hex={hex} onClick={() => copyToClipboard(hex, `triad-${i}`)} copied={copiedKey === `triad-${i}`} />
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Favorites */}
          <Card className="p-4 md:p-6">
            <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">{l('favorites', locale)}</h3>
            <div className="flex flex-wrap gap-1">
              {favorites.length === 0 && (
                <p className="text-xs text-gray-400">{locale === 'en' ? 'No favorites yet' : locale === 'es' ? 'Sin favoritos' : 'Nenhum favorito'}</p>
              )}
              {favorites.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  className="h-8 w-8 rounded border border-gray-200 transition-transform hover:scale-110 dark:border-gray-700"
                  style={{ backgroundColor: hex }}
                  onClick={() => setInput(hex)}
                  title={hex}
                />
              ))}
            </div>
          </Card>
        </>
      )}

      {/* Link to extractor */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">{l('privacy', locale)}</p>
        <a
          href={`/${locale}/tools/image-color-extractor`}
          className="text-xs text-brand-600 hover:underline"
        >
          {l('openExtractor', locale)}
        </a>
      </div>
    </div>
  );
}

// --- Internal ColorSwatch component ---

function ColorSwatch({ hex, onClick, copied }: Readonly<{ hex: string; onClick: () => void; copied: boolean }>) {
  const rgb = hexToRgb(hex);
  const light = rgb ? isLightColor(rgb) : false;

  return (
    <button
      type="button"
      className="relative flex h-10 flex-1 min-w-[40px] cursor-pointer items-center justify-center rounded transition-transform hover:scale-105"
      style={{ backgroundColor: hex }}
      onClick={onClick}
      title={hex}
    >
      <span className="text-[10px] font-mono" style={{ color: light ? '#000' : '#fff' }}>
        {hex}
      </span>
      {copied && (
        <span className="absolute -top-5 rounded bg-black px-1.5 py-0.5 text-[10px] text-white">✓</span>
      )}
    </button>
  );
}
