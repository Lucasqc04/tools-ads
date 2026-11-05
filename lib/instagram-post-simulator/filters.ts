import type { SlideFilters } from '@/types/instagram-post-simulator';

export type FilterPresetId = 'original' | 'vivid' | 'soft' | 'mono' | 'contrast';

export const DEFAULT_FILTERS: SlideFilters = { brightness: 1, contrast: 1, saturation: 1 };

/** Nomes são próprios do simulador (não reproduzem filtros oficiais do Instagram). Os nomes ficam na UI. */
export const FILTER_PRESETS: Record<FilterPresetId, SlideFilters> = {
  original: DEFAULT_FILTERS,
  vivid: { brightness: 1.04, contrast: 1.12, saturation: 1.35 },
  soft: { brightness: 1.08, contrast: 0.9, saturation: 0.85 },
  mono: { brightness: 1, contrast: 1.1, saturation: 0 },
  contrast: { brightness: 0.98, contrast: 1.25, saturation: 0.9 },
};

export const FILTER_LIMITS = {
  brightness: { min: 0.5, max: 1.5, step: 0.01 },
  contrast: { min: 0.5, max: 1.5, step: 0.01 },
  saturation: { min: 0, max: 2, step: 0.01 },
} as const;

export const isDefaultFilters = (filters: SlideFilters): boolean =>
  filters.brightness === 1 && filters.contrast === 1 && filters.saturation === 1;

/**
 * Filtro CSS equivalente à ordem usada no exportador (brilho, contraste, saturação).
 * A prévia é aproximada: navegadores podem arredondar valores de forma ligeiramente diferente.
 */
export const toCssFilter = (filters: SlideFilters): string =>
  isDefaultFilters(filters)
    ? 'none'
    : `brightness(${filters.brightness}) contrast(${filters.contrast}) saturate(${filters.saturation})`;

/** Aplica os mesmos ajustes do CSS, pixel a pixel, para que o arquivo exportado bata com a prévia. */
export const applyFiltersToPixels = (data: Uint8ClampedArray, filters: SlideFilters): void => {
  if (isDefaultFilters(filters)) return;

  const { brightness, contrast, saturation } = filters;
  // Matriz de saturação definida na especificação de filter: saturate().
  const m00 = 0.213 + 0.787 * saturation;
  const m01 = 0.715 - 0.715 * saturation;
  const m02 = 0.072 - 0.072 * saturation;
  const m10 = 0.213 - 0.213 * saturation;
  const m11 = 0.715 + 0.285 * saturation;
  const m12 = 0.072 - 0.072 * saturation;
  const m20 = 0.213 - 0.213 * saturation;
  const m21 = 0.715 - 0.715 * saturation;
  const m22 = 0.072 + 0.928 * saturation;

  for (let i = 0; i < data.length; i += 4) {
    const r0 = ((data[i] / 255) * brightness - 0.5) * contrast + 0.5;
    const g0 = ((data[i + 1] / 255) * brightness - 0.5) * contrast + 0.5;
    const b0 = ((data[i + 2] / 255) * brightness - 0.5) * contrast + 0.5;

    data[i] = (m00 * r0 + m01 * g0 + m02 * b0) * 255;
    data[i + 1] = (m10 * r0 + m11 * g0 + m12 * b0) * 255;
    data[i + 2] = (m20 * r0 + m21 * g0 + m22 * b0) * 255;
  }
};
