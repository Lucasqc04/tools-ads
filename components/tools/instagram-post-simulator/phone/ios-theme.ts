import type { PhoneModelId, PhoneTheme } from '@/types/instagram-post-simulator';

/**
 * Medidas do aparelho em pontos lógicos. O iPhone 17 Pro usa 402 × 874 pt (3×, 1206 × 2622 px).
 * Os recuos de segurança e os raios são estimativas de referência; ver docs/instagram-post-simulator-reference.md.
 */
export type IosDevice = {
  label: string;
  width: number;
  height: number;
  safeTop: number;
  safeBottom: number;
  radius: number;
  bezel: number;
};

export const IOS_DEVICES: Record<PhoneModelId, IosDevice> = {
  'iphone-17-pro': { label: 'iPhone 17 Pro', width: 402, height: 874, safeTop: 62, safeBottom: 34, radius: 55, bezel: 12 },
  'iphone-17-pro-max': { label: 'iPhone 17 Pro Max', width: 440, height: 956, safeTop: 62, safeBottom: 34, radius: 62, bezel: 12 },
};

/** Cores da interface do Instagram para iOS, em estimativas de referência (aparência clara e escura). */
export type IosPalette = {
  bg: string;
  text: string;
  muted: string;
  separator: string;
  surfaceAlt: string;
  accent: string;
  link: string;
  like: string;
  dot: string;
  frame: string;
  scrim: string;
};

export const IOS_PALETTES: Record<PhoneTheme, IosPalette> = {
  light: {
    bg: '#ffffff',
    text: '#262626',
    muted: '#737373',
    separator: '#dbdbdb',
    surfaceAlt: '#efefef',
    accent: '#0095f6',
    link: '#00376b',
    like: '#ed4956',
    dot: '#c7c7c7',
    frame: '#1c1c1e',
    scrim: 'rgba(0, 0, 0, 0.45)',
  },
  dark: {
    bg: '#000000',
    text: '#f5f5f5',
    muted: '#a8a8a8',
    separator: '#262626',
    surfaceAlt: '#262626',
    accent: '#0095f6',
    link: '#e0f1ff',
    like: '#ff3040',
    dot: '#4d4d4d',
    frame: '#2c2c2e',
    scrim: 'rgba(0, 0, 0, 0.6)',
  },
};

/** Pilha de fontes do sistema da Apple. Não depende da fonte do site. */
export const IOS_FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif';

export const DYNAMIC_ISLAND = { width: 126, height: 37, top: 11 };
export const HOME_INDICATOR = { width: 134, height: 5, bottom: 8 };
export const NAV_BAR_HEIGHT = 44;
export const TAB_BAR_HEIGHT = 49;
