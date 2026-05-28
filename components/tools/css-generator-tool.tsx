'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { AppLocale } from '@/lib/i18n/config';

// ---------- TYPES ----------

type CategoryId =
  | 'presets'
  | 'shadow'
  | 'radius'
  | 'gradient'
  | 'glass'
  | 'border'
  | 'text'
  | 'spacing'
  | 'transform'
  | 'filters'
  | 'animation';

type ElementType = 'card' | 'button' | 'input' | 'badge' | 'hero' | 'toast';
type BackgroundType = 'solid' | 'gradient' | 'dots' | 'blobs' | 'dark' | 'checkerboard' | 'image';
type GradientType = 'linear' | 'radial' | 'conic';
type BorderStyle = 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'none';
type AnimationType = 'none' | 'pulse' | 'float' | 'glow' | 'rotate' | 'shimmer' | 'bounce';
type CodeTab = 'css' | 'html' | 'tailwind' | 'variables';

type ShadowLayer = {
  id: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
};

type CssState = {
  // Shadow
  shadowEnabled: boolean;
  shadowLayers: ShadowLayer[];
  // Border radius
  radiusLinked: boolean;
  radiusAll: number;
  radiusTopLeft: number;
  radiusTopRight: number;
  radiusBottomRight: number;
  radiusBottomLeft: number;
  radiusUnit: 'px' | '%';
  // Gradient
  gradientEnabled: boolean;
  gradientType: GradientType;
  gradientAngle: number;
  gradientColors: { color: string; stop: number }[];
  // Glass
  glassEnabled: boolean;
  glassBgOpacity: number;
  glassBgColor: string;
  glassBlur: number;
  glassSaturation: number;
  glassBrightness: number;
  glassBorderOpacity: number;
  glassBorderColor: string;
  // Border
  borderEnabled: boolean;
  borderWidth: number;
  borderColor: string;
  borderStyle: BorderStyle;
  borderOpacity: number;
  // Text
  textColor: string;
  textSize: number;
  textWeight: number;
  textShadowEnabled: boolean;
  textShadowX: number;
  textShadowY: number;
  textShadowBlur: number;
  textShadowColor: string;
  // Spacing
  width: number;
  height: number;
  padding: number;
  // Transform
  rotate: number;
  scale: number;
  skewX: number;
  skewY: number;
  translateX: number;
  translateY: number;
  // Filters
  filterBlur: number;
  filterBrightness: number;
  filterContrast: number;
  filterGrayscale: number;
  filterHueRotate: number;
  filterSaturate: number;
  filterSepia: number;
  // Animation
  animation: AnimationType;
  animationDuration: number;
  // Background color of element
  bgColor: string;
  bgOpacity: number;
};

type Preset = {
  id: string;
  name: string;
  state: Partial<CssState>;
};

// ---------- CONSTANTS ----------

const DEFAULT_SHADOW_LAYER: ShadowLayer = {
  id: '1',
  offsetX: 0,
  offsetY: 8,
  blur: 32,
  spread: 0,
  color: '#000000',
  opacity: 18,
  inset: false,
};

const DEFAULT_STATE: CssState = {
  shadowEnabled: true,
  shadowLayers: [{ ...DEFAULT_SHADOW_LAYER }],
  radiusLinked: true,
  radiusAll: 16,
  radiusTopLeft: 16,
  radiusTopRight: 16,
  radiusBottomRight: 16,
  radiusBottomLeft: 16,
  radiusUnit: 'px',
  gradientEnabled: false,
  gradientType: 'linear',
  gradientAngle: 135,
  gradientColors: [
    { color: '#8b5cf6', stop: 0 },
    { color: '#06b6d4', stop: 100 },
  ],
  glassEnabled: false,
  glassBgOpacity: 16,
  glassBgColor: '#ffffff',
  glassBlur: 16,
  glassSaturation: 180,
  glassBrightness: 100,
  glassBorderOpacity: 28,
  glassBorderColor: '#ffffff',
  borderEnabled: true,
  borderWidth: 1,
  borderColor: '#e2e8f0',
  borderStyle: 'solid',
  borderOpacity: 100,
  textColor: '#1e293b',
  textSize: 16,
  textWeight: 400,
  textShadowEnabled: false,
  textShadowX: 0,
  textShadowY: 2,
  textShadowBlur: 4,
  textShadowColor: '#000000',
  width: 320,
  height: 200,
  padding: 32,
  rotate: 0,
  scale: 1,
  skewX: 0,
  skewY: 0,
  translateX: 0,
  translateY: 0,
  filterBlur: 0,
  filterBrightness: 100,
  filterContrast: 100,
  filterGrayscale: 0,
  filterHueRotate: 0,
  filterSaturate: 100,
  filterSepia: 0,
  animation: 'none',
  animationDuration: 2,
  bgColor: '#ffffff',
  bgOpacity: 100,
};

const PRESETS: Preset[] = [
  {
    id: 'soft-shadow',
    name: 'Soft Shadow',
    state: {
      shadowEnabled: true,
      shadowLayers: [{ id: '1', offsetX: 0, offsetY: 4, blur: 24, spread: -4, color: '#000000', opacity: 12, inset: false }],
      radiusAll: 16, radiusTopLeft: 16, radiusTopRight: 16, radiusBottomRight: 16, radiusBottomLeft: 16,
      bgColor: '#ffffff', bgOpacity: 100,
    },
  },
  {
    id: 'deep-shadow',
    name: 'Deep Shadow',
    state: {
      shadowEnabled: true,
      shadowLayers: [
        { id: '1', offsetX: 0, offsetY: 20, blur: 60, spread: -10, color: '#000000', opacity: 25, inset: false },
        { id: '2', offsetX: 0, offsetY: 4, blur: 12, spread: 0, color: '#000000', opacity: 8, inset: false },
      ],
      radiusAll: 24, radiusTopLeft: 24, radiusTopRight: 24, radiusBottomRight: 24, radiusBottomLeft: 24,
      bgColor: '#ffffff', bgOpacity: 100,
    },
  },
  {
    id: 'neon-glow',
    name: 'Neon Glow',
    state: {
      shadowEnabled: true,
      shadowLayers: [
        { id: '1', offsetX: 0, offsetY: 0, blur: 20, spread: 0, color: '#8b5cf6', opacity: 60, inset: false },
        { id: '2', offsetX: 0, offsetY: 0, blur: 60, spread: 0, color: '#8b5cf6', opacity: 30, inset: false },
      ],
      radiusAll: 16, radiusTopLeft: 16, radiusTopRight: 16, radiusBottomRight: 16, radiusBottomLeft: 16,
      bgColor: '#1e1b4b', bgOpacity: 100, textColor: '#e0e7ff',
      borderEnabled: true, borderWidth: 1, borderColor: '#8b5cf6', borderOpacity: 60,
    },
  },
  {
    id: 'neumorphism',
    name: 'Neumorphism',
    state: {
      shadowEnabled: true,
      shadowLayers: [
        { id: '1', offsetX: 8, offsetY: 8, blur: 16, spread: 0, color: '#000000', opacity: 10, inset: false },
        { id: '2', offsetX: -8, offsetY: -8, blur: 16, spread: 0, color: '#ffffff', opacity: 80, inset: false },
      ],
      radiusAll: 20, radiusTopLeft: 20, radiusTopRight: 20, radiusBottomRight: 20, radiusBottomLeft: 20,
      bgColor: '#e2e8f0', bgOpacity: 100, borderEnabled: false,
    },
  },
  {
    id: 'neumorphism-pressed',
    name: 'Neumorphism Pressed',
    state: {
      shadowEnabled: true,
      shadowLayers: [
        { id: '1', offsetX: 4, offsetY: 4, blur: 10, spread: 0, color: '#000000', opacity: 12, inset: true },
        { id: '2', offsetX: -4, offsetY: -4, blur: 10, spread: 0, color: '#ffffff', opacity: 60, inset: true },
      ],
      radiusAll: 20, radiusTopLeft: 20, radiusTopRight: 20, radiusBottomRight: 20, radiusBottomLeft: 20,
      bgColor: '#e2e8f0', bgOpacity: 100, borderEnabled: false,
    },
  },
  {
    id: 'neumorphism-dark',
    name: 'Neumorphism Dark',
    state: {
      shadowEnabled: true,
      shadowLayers: [
        { id: '1', offsetX: 8, offsetY: 8, blur: 16, spread: 0, color: '#000000', opacity: 40, inset: false },
        { id: '2', offsetX: -8, offsetY: -8, blur: 16, spread: 0, color: '#3b3b3b', opacity: 30, inset: false },
      ],
      radiusAll: 20, radiusTopLeft: 20, radiusTopRight: 20, radiusBottomRight: 20, radiusBottomLeft: 20,
      bgColor: '#1e1e2e', bgOpacity: 100, borderEnabled: false, textColor: '#cdd6f4',
    },
  },
  {
    id: 'glass-card',
    name: 'Glassmorphism',
    state: {
      glassEnabled: true, glassBgOpacity: 16, glassBgColor: '#ffffff', glassBlur: 16,
      glassSaturation: 180, glassBrightness: 100, glassBorderOpacity: 28, glassBorderColor: '#ffffff',
      shadowEnabled: true,
      shadowLayers: [{ id: '1', offsetX: 0, offsetY: 8, blur: 32, spread: 0, color: '#000000', opacity: 18, inset: false }],
      radiusAll: 20, radiusTopLeft: 20, radiusTopRight: 20, radiusBottomRight: 20, radiusBottomLeft: 20,
      bgColor: '#ffffff', bgOpacity: 16, borderEnabled: false, textColor: '#ffffff',
    },
  },
  {
    id: 'dark-glass',
    name: 'Glass Dark',
    state: {
      glassEnabled: true, glassBgOpacity: 20, glassBgColor: '#000000', glassBlur: 20,
      glassSaturation: 150, glassBrightness: 80, glassBorderOpacity: 20, glassBorderColor: '#ffffff',
      shadowEnabled: true,
      shadowLayers: [{ id: '1', offsetX: 0, offsetY: 12, blur: 40, spread: 0, color: '#000000', opacity: 30, inset: false }],
      radiusAll: 16, radiusTopLeft: 16, radiusTopRight: 16, radiusBottomRight: 16, radiusBottomLeft: 16,
      bgColor: '#000000', bgOpacity: 20, borderEnabled: false, textColor: '#f1f5f9',
    },
  },
  {
    id: 'glass-tinted',
    name: 'Glass Tinted',
    state: {
      glassEnabled: true, glassBgOpacity: 20, glassBgColor: '#8b5cf6', glassBlur: 12,
      glassSaturation: 200, glassBrightness: 110, glassBorderOpacity: 30, glassBorderColor: '#c4b5fd',
      shadowEnabled: true,
      shadowLayers: [{ id: '1', offsetX: 0, offsetY: 8, blur: 24, spread: 0, color: '#8b5cf6', opacity: 20, inset: false }],
      radiusAll: 16, radiusTopLeft: 16, radiusTopRight: 16, radiusBottomRight: 16, radiusBottomLeft: 16,
      bgColor: '#8b5cf6', bgOpacity: 20, borderEnabled: false, textColor: '#ffffff',
    },
  },
  {
    id: 'claymorphism',
    name: 'Claymorphism',
    state: {
      shadowEnabled: true,
      shadowLayers: [
        { id: '1', offsetX: 0, offsetY: 10, blur: 20, spread: -5, color: '#000000', opacity: 15, inset: false },
        { id: '2', offsetX: 0, offsetY: -3, blur: 6, spread: 0, color: '#ffffff', opacity: 60, inset: true },
      ],
      radiusAll: 24, radiusTopLeft: 24, radiusTopRight: 24, radiusBottomRight: 24, radiusBottomLeft: 24,
      bgColor: '#f0abfc', bgOpacity: 100, borderEnabled: false, textColor: '#1e1b4b',
    },
  },
  {
    id: 'aurora-glow',
    name: 'Aurora Glow',
    state: {
      shadowEnabled: true,
      shadowLayers: [
        { id: '1', offsetX: 0, offsetY: 0, blur: 30, spread: 0, color: '#06b6d4', opacity: 40, inset: false },
        { id: '2', offsetX: 0, offsetY: 0, blur: 60, spread: 0, color: '#8b5cf6', opacity: 25, inset: false },
        { id: '3', offsetX: 0, offsetY: 0, blur: 90, spread: 0, color: '#ec4899', opacity: 15, inset: false },
      ],
      radiusAll: 20, radiusTopLeft: 20, radiusTopRight: 20, radiusBottomRight: 20, radiusBottomLeft: 20,
      bgColor: '#0f172a', bgOpacity: 100, borderEnabled: true, borderWidth: 1, borderColor: '#06b6d4', borderOpacity: 40,
      textColor: '#e0f2fe',
    },
  },
  {
    id: 'gradient-button',
    name: 'Gradient Button',
    state: {
      gradientEnabled: true, gradientType: 'linear', gradientAngle: 135,
      gradientColors: [{ color: '#8b5cf6', stop: 0 }, { color: '#06b6d4', stop: 100 }],
      shadowEnabled: true,
      shadowLayers: [{ id: '1', offsetX: 0, offsetY: 4, blur: 16, spread: 0, color: '#8b5cf6', opacity: 30, inset: false }],
      radiusAll: 12, radiusTopLeft: 12, radiusTopRight: 12, radiusBottomRight: 12, radiusBottomLeft: 12,
      textColor: '#ffffff', borderEnabled: false,
    },
  },
  {
    id: 'sunset-gradient',
    name: 'Sunset Gradient',
    state: {
      gradientEnabled: true, gradientType: 'linear', gradientAngle: 135,
      gradientColors: [{ color: '#f97316', stop: 0 }, { color: '#ec4899', stop: 50 }, { color: '#8b5cf6', stop: 100 }],
      shadowEnabled: true,
      shadowLayers: [{ id: '1', offsetX: 0, offsetY: 8, blur: 24, spread: -4, color: '#ec4899', opacity: 30, inset: false }],
      radiusAll: 16, radiusTopLeft: 16, radiusTopRight: 16, radiusBottomRight: 16, radiusBottomLeft: 16,
      textColor: '#ffffff', borderEnabled: false,
    },
  },
  {
    id: 'modern-card',
    name: 'Modern Card',
    state: {
      shadowEnabled: true,
      shadowLayers: [
        { id: '1', offsetX: 0, offsetY: 1, blur: 3, spread: 0, color: '#000000', opacity: 10, inset: false },
        { id: '2', offsetX: 0, offsetY: 10, blur: 40, spread: -8, color: '#000000', opacity: 10, inset: false },
      ],
      radiusAll: 12, radiusTopLeft: 12, radiusTopRight: 12, radiusBottomRight: 12, radiusBottomLeft: 12,
      bgColor: '#ffffff', bgOpacity: 100, borderEnabled: true, borderWidth: 1, borderColor: '#e2e8f0', borderOpacity: 100,
    },
  },
  {
    id: 'brutalist',
    name: 'Brutalist',
    state: {
      shadowEnabled: true,
      shadowLayers: [{ id: '1', offsetX: 6, offsetY: 6, blur: 0, spread: 0, color: '#000000', opacity: 100, inset: false }],
      radiusAll: 0, radiusTopLeft: 0, radiusTopRight: 0, radiusBottomRight: 0, radiusBottomLeft: 0,
      bgColor: '#fef08a', bgOpacity: 100, borderEnabled: true, borderWidth: 3, borderColor: '#000000', borderOpacity: 100,
      textColor: '#000000',
    },
  },
  {
    id: 'retro-3d',
    name: 'Retro 3D',
    state: {
      shadowEnabled: true,
      shadowLayers: [
        { id: '1', offsetX: 4, offsetY: 4, blur: 0, spread: 0, color: '#1e293b', opacity: 100, inset: false },
        { id: '2', offsetX: 8, offsetY: 8, blur: 0, spread: 0, color: '#334155', opacity: 60, inset: false },
      ],
      radiusAll: 8, radiusTopLeft: 8, radiusTopRight: 8, radiusBottomRight: 8, radiusBottomLeft: 8,
      bgColor: '#f8fafc', bgOpacity: 100, borderEnabled: true, borderWidth: 2, borderColor: '#1e293b', borderOpacity: 100,
      textColor: '#1e293b',
    },
  },
  {
    id: 'floating-card',
    name: 'Floating Card',
    state: {
      shadowEnabled: true,
      shadowLayers: [
        { id: '1', offsetX: 0, offsetY: 25, blur: 50, spread: -12, color: '#000000', opacity: 20, inset: false },
      ],
      radiusAll: 20, radiusTopLeft: 20, radiusTopRight: 20, radiusBottomRight: 20, radiusBottomLeft: 20,
      bgColor: '#ffffff', bgOpacity: 100, borderEnabled: false,
    },
  },
  {
    id: 'pill-button',
    name: 'Pill Button',
    state: {
      radiusAll: 999, radiusTopLeft: 999, radiusTopRight: 999, radiusBottomRight: 999, radiusBottomLeft: 999,
      radiusUnit: 'px',
      bgColor: '#3b82f6', bgOpacity: 100, textColor: '#ffffff',
      shadowEnabled: true,
      shadowLayers: [{ id: '1', offsetX: 0, offsetY: 4, blur: 12, spread: 0, color: '#3b82f6', opacity: 30, inset: false }],
      borderEnabled: false, padding: 16, width: 200, height: 48,
    },
  },
  {
    id: 'pastel-gradient',
    name: 'Pastel Gradient',
    state: {
      gradientEnabled: true, gradientType: 'linear', gradientAngle: 135,
      gradientColors: [{ color: '#fde68a', stop: 0 }, { color: '#fbcfe8', stop: 50 }, { color: '#c4b5fd', stop: 100 }],
      radiusAll: 20, radiusTopLeft: 20, radiusTopRight: 20, radiusBottomRight: 20, radiusBottomLeft: 20,
      shadowEnabled: true,
      shadowLayers: [{ id: '1', offsetX: 0, offsetY: 8, blur: 24, spread: 0, color: '#000000', opacity: 10, inset: false }],
      borderEnabled: false, textColor: '#1e293b',
    },
  },
  {
    id: 'morphism-concave',
    name: 'Morphism Concave',
    state: {
      shadowEnabled: true,
      shadowLayers: [
        { id: '1', offsetX: 6, offsetY: 6, blur: 12, spread: 0, color: '#000000', opacity: 12, inset: false },
        { id: '2', offsetX: -6, offsetY: -6, blur: 12, spread: 0, color: '#ffffff', opacity: 70, inset: false },
        { id: '3', offsetX: 3, offsetY: 3, blur: 6, spread: 0, color: '#000000', opacity: 8, inset: true },
      ],
      radiusAll: 16, radiusTopLeft: 16, radiusTopRight: 16, radiusBottomRight: 16, radiusBottomLeft: 16,
      bgColor: '#e2e8f0', bgOpacity: 100, borderEnabled: false,
      gradientEnabled: true, gradientType: 'linear', gradientAngle: 145,
      gradientColors: [{ color: '#d1d5db', stop: 0 }, { color: '#f1f5f9', stop: 100 }],
    },
  },
  {
    id: 'morphism-convex',
    name: 'Morphism Convex',
    state: {
      shadowEnabled: true,
      shadowLayers: [
        { id: '1', offsetX: 6, offsetY: 6, blur: 12, spread: 0, color: '#000000', opacity: 12, inset: false },
        { id: '2', offsetX: -6, offsetY: -6, blur: 12, spread: 0, color: '#ffffff', opacity: 70, inset: false },
      ],
      radiusAll: 16, radiusTopLeft: 16, radiusTopRight: 16, radiusBottomRight: 16, radiusBottomLeft: 16,
      bgColor: '#e2e8f0', bgOpacity: 100, borderEnabled: false,
      gradientEnabled: true, gradientType: 'linear', gradientAngle: 145,
      gradientColors: [{ color: '#f1f5f9', stop: 0 }, { color: '#d1d5db', stop: 100 }],
    },
  },
  {
    id: 'morphism-flat',
    name: 'Morphism Flat',
    state: {
      shadowEnabled: true,
      shadowLayers: [
        { id: '1', offsetX: 6, offsetY: 6, blur: 14, spread: 0, color: '#000000', opacity: 12, inset: false },
        { id: '2', offsetX: -6, offsetY: -6, blur: 14, spread: 0, color: '#ffffff', opacity: 70, inset: false },
      ],
      radiusAll: 16, radiusTopLeft: 16, radiusTopRight: 16, radiusBottomRight: 16, radiusBottomLeft: 16,
      bgColor: '#e2e8f0', bgOpacity: 100, borderEnabled: false,
    },
  },
  {
    id: 'inner-shadow',
    name: 'Inner Shadow',
    state: {
      shadowEnabled: true,
      shadowLayers: [
        { id: '1', offsetX: 0, offsetY: 4, blur: 8, spread: 0, color: '#000000', opacity: 15, inset: true },
        { id: '2', offsetX: 0, offsetY: -2, blur: 4, spread: 0, color: '#ffffff', opacity: 50, inset: true },
      ],
      radiusAll: 12, radiusTopLeft: 12, radiusTopRight: 12, radiusBottomRight: 12, radiusBottomLeft: 12,
      bgColor: '#f1f5f9', bgOpacity: 100, borderEnabled: true, borderWidth: 1, borderColor: '#e2e8f0', borderOpacity: 100,
    },
  },
  {
    id: 'frosted-panel',
    name: 'Frosted Panel',
    state: {
      glassEnabled: true, glassBgOpacity: 40, glassBgColor: '#ffffff', glassBlur: 8,
      glassSaturation: 120, glassBrightness: 110, glassBorderOpacity: 50, glassBorderColor: '#ffffff',
      shadowEnabled: true,
      shadowLayers: [{ id: '1', offsetX: 0, offsetY: 4, blur: 16, spread: 0, color: '#000000', opacity: 8, inset: false }],
      radiusAll: 12, radiusTopLeft: 12, radiusTopRight: 12, radiusBottomRight: 12, radiusBottomLeft: 12,
      bgColor: '#ffffff', bgOpacity: 40, borderEnabled: false, textColor: '#1e293b',
    },
  },
  {
    id: 'colorful-shadow',
    name: 'Colorful Shadow',
    state: {
      shadowEnabled: true,
      shadowLayers: [
        { id: '1', offsetX: -10, offsetY: 0, blur: 30, spread: -5, color: '#8b5cf6', opacity: 40, inset: false },
        { id: '2', offsetX: 10, offsetY: 0, blur: 30, spread: -5, color: '#06b6d4', opacity: 40, inset: false },
        { id: '3', offsetX: 0, offsetY: 10, blur: 30, spread: -5, color: '#ec4899', opacity: 30, inset: false },
      ],
      radiusAll: 16, radiusTopLeft: 16, radiusTopRight: 16, radiusBottomRight: 16, radiusBottomLeft: 16,
      bgColor: '#ffffff', bgOpacity: 100, borderEnabled: false,
    },
  },
];

// ---------- UI LABELS ----------

type UiLabels = {
  categories: Record<CategoryId, string>;
  elements: Record<ElementType, string>;
  backgrounds: Record<BackgroundType, string>;
  codeTab: Record<CodeTab, string>;
  copy: string;
  copied: string;
  reset: string;
  resetSection: string;
  addLayer: string;
  removeLayer: string;
  enabled: string;
  linked: string;
  unlinked: string;
  previewTitle: string;
  previewText: string;
  previewButton: string;
  codeTitle: string;
  element: string;
  background: string;
  angle: string;
  inset: string;
  offsetX: string;
  offsetY: string;
  blur: string;
  spread: string;
  color: string;
  opacity: string;
  all: string;
  width: string;
  height: string;
  padding: string;
  weight: string;
  size: string;
  style: string;
  duration: string;
  glassHint: string;
};

const labelsByLocale: Record<AppLocale, UiLabels> = {
  'pt-br': {
    categories: {
      presets: 'Presets', shadow: 'Sombra', radius: 'Border Radius', gradient: 'Gradiente',
      glass: 'Glassmorphism', border: 'Borda', text: 'Texto', spacing: 'Tamanho',
      transform: 'Transform', filters: 'Filtros', animation: 'Animação',
    },
    elements: { card: 'Card', button: 'Botão', input: 'Input', badge: 'Badge', hero: 'Hero', toast: 'Toast' },
    backgrounds: { solid: 'Sólido', gradient: 'Gradiente', dots: 'Pontos', blobs: 'Blobs', dark: 'Escuro', checkerboard: 'Xadrez', image: 'Imagem' },
    codeTab: { css: 'CSS', html: 'HTML + CSS', tailwind: 'Tailwind', variables: 'Variables' },
    copy: 'Copiar', copied: 'Copiado!', reset: 'Resetar tudo', resetSection: 'Resetar seção', addLayer: 'Adicionar camada',
    removeLayer: 'Remover', enabled: 'Ativado', linked: 'Linkado', unlinked: 'Individual',
    previewTitle: 'Título do card', previewText: 'Texto de exemplo para testar contraste, blur, fundo e sombra.',
    previewButton: 'Botão de exemplo', codeTitle: 'Código CSS gerado', element: 'Elemento',
    background: 'Fundo', angle: 'Ângulo', inset: 'Interna', offsetX: 'Offset X', offsetY: 'Offset Y',
    blur: 'Blur', spread: 'Spread', color: 'Cor', opacity: 'Opacidade', all: 'Todos',
    width: 'Largura', height: 'Altura', padding: 'Padding', weight: 'Peso', size: 'Tamanho',
    style: 'Estilo', duration: 'Duração', glassHint: 'O glassmorphism fica melhor com fundo colorido atrás.',
  },
  en: {
    categories: {
      presets: 'Presets', shadow: 'Shadow', radius: 'Border Radius', gradient: 'Gradient',
      glass: 'Glassmorphism', border: 'Border', text: 'Text', spacing: 'Size',
      transform: 'Transform', filters: 'Filters', animation: 'Animation',
    },
    elements: { card: 'Card', button: 'Button', input: 'Input', badge: 'Badge', hero: 'Hero', toast: 'Toast' },
    backgrounds: { solid: 'Solid', gradient: 'Gradient', dots: 'Dots', blobs: 'Blobs', dark: 'Dark', checkerboard: 'Checkerboard', image: 'Image' },
    codeTab: { css: 'CSS', html: 'HTML + CSS', tailwind: 'Tailwind', variables: 'Variables' },
    copy: 'Copy', copied: 'Copied!', reset: 'Reset all', resetSection: 'Reset section', addLayer: 'Add layer',
    removeLayer: 'Remove', enabled: 'Enabled', linked: 'Linked', unlinked: 'Individual',
    previewTitle: 'Card Title', previewText: 'Sample text to test contrast, blur, background and shadow.',
    previewButton: 'Example Button', codeTitle: 'Generated CSS code', element: 'Element',
    background: 'Background', angle: 'Angle', inset: 'Inset', offsetX: 'Offset X', offsetY: 'Offset Y',
    blur: 'Blur', spread: 'Spread', color: 'Color', opacity: 'Opacity', all: 'All',
    width: 'Width', height: 'Height', padding: 'Padding', weight: 'Weight', size: 'Size',
    style: 'Style', duration: 'Duration', glassHint: 'Glassmorphism looks better with a colorful background behind.',
  },
  es: {
    categories: {
      presets: 'Presets', shadow: 'Sombra', radius: 'Border Radius', gradient: 'Gradiente',
      glass: 'Glassmorphism', border: 'Borde', text: 'Texto', spacing: 'Tamaño',
      transform: 'Transform', filters: 'Filtros', animation: 'Animación',
    },
    elements: { card: 'Card', button: 'Botón', input: 'Input', badge: 'Badge', hero: 'Hero', toast: 'Toast' },
    backgrounds: { solid: 'Sólido', gradient: 'Gradiente', dots: 'Puntos', blobs: 'Blobs', dark: 'Oscuro', checkerboard: 'Ajedrez', image: 'Imagen' },
    codeTab: { css: 'CSS', html: 'HTML + CSS', tailwind: 'Tailwind', variables: 'Variables' },
    copy: 'Copiar', copied: '¡Copiado!', reset: 'Resetear todo', resetSection: 'Resetear sección', addLayer: 'Agregar capa',
    removeLayer: 'Eliminar', enabled: 'Activado', linked: 'Enlazado', unlinked: 'Individual',
    previewTitle: 'Título del card', previewText: 'Texto de ejemplo para probar contraste, blur, fondo y sombra.',
    previewButton: 'Botón de ejemplo', codeTitle: 'Código CSS generado', element: 'Elemento',
    background: 'Fondo', angle: 'Ángulo', inset: 'Interna', offsetX: 'Offset X', offsetY: 'Offset Y',
    blur: 'Blur', spread: 'Spread', color: 'Color', opacity: 'Opacidad', all: 'Todos',
    width: 'Ancho', height: 'Alto', padding: 'Padding', weight: 'Peso', size: 'Tamaño',
    style: 'Estilo', duration: 'Duración', glassHint: 'El glassmorphism se ve mejor con un fondo colorido detrás.',
  },
};

// ---------- HELPERS ----------

function hexToRgba(hex: string, opacity: number): string {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${(opacity / 100).toFixed(2)})`;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}

// ---------- CSS GENERATION ----------

function buildShadowCss(layers: ShadowLayer[]): string {
  if (layers.length === 0) return 'none';
  return layers
    .map((l) => {
      const rgba = hexToRgba(l.color, l.opacity);
      const insetStr = l.inset ? 'inset ' : '';
      return `${insetStr}${l.offsetX}px ${l.offsetY}px ${l.blur}px ${l.spread}px ${rgba}`;
    })
    .join(',\n    ');
}

function buildGradientCss(state: CssState): string {
  const stops = state.gradientColors.map((c) => `${c.color} ${c.stop}%`).join(', ');
  switch (state.gradientType) {
    case 'radial':
      return `radial-gradient(circle, ${stops})`;
    case 'conic':
      return `conic-gradient(from ${state.gradientAngle}deg, ${stops})`;
    default:
      return `linear-gradient(${state.gradientAngle}deg, ${stops})`;
  }
}

function buildFilterCss(state: CssState): string {
  const parts: string[] = [];
  if (state.filterBlur > 0) parts.push(`blur(${state.filterBlur}px)`);
  if (state.filterBrightness !== 100) parts.push(`brightness(${state.filterBrightness}%)`);
  if (state.filterContrast !== 100) parts.push(`contrast(${state.filterContrast}%)`);
  if (state.filterGrayscale > 0) parts.push(`grayscale(${state.filterGrayscale}%)`);
  if (state.filterHueRotate !== 0) parts.push(`hue-rotate(${state.filterHueRotate}deg)`);
  if (state.filterSaturate !== 100) parts.push(`saturate(${state.filterSaturate}%)`);
  if (state.filterSepia > 0) parts.push(`sepia(${state.filterSepia}%)`);
  return parts.length > 0 ? parts.join(' ') : '';
}

function buildTransformCss(state: CssState): string {
  const parts: string[] = [];
  if (state.rotate !== 0) parts.push(`rotate(${state.rotate}deg)`);
  if (state.scale !== 1) parts.push(`scale(${state.scale})`);
  if (state.skewX !== 0) parts.push(`skewX(${state.skewX}deg)`);
  if (state.skewY !== 0) parts.push(`skewY(${state.skewY}deg)`);
  if (state.translateX !== 0) parts.push(`translateX(${state.translateX}px)`);
  if (state.translateY !== 0) parts.push(`translateY(${state.translateY}px)`);
  return parts.length > 0 ? parts.join(' ') : '';
}

function buildAnimationKeyframes(animation: AnimationType): string {
  switch (animation) {
    case 'pulse':
      return `@keyframes pulse {\n  0%, 100% { transform: scale(1); }\n  50% { transform: scale(1.05); }\n}`;
    case 'float':
      return `@keyframes float {\n  0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-12px); }\n}`;
    case 'glow':
      return `@keyframes glow {\n  0%, 100% { box-shadow: 0 0 5px rgba(139,92,246,0.3); }\n  50% { box-shadow: 0 0 20px rgba(139,92,246,0.6), 0 0 40px rgba(139,92,246,0.3); }\n}`;
    case 'rotate':
      return `@keyframes spin {\n  from { transform: rotate(0deg); }\n  to { transform: rotate(360deg); }\n}`;
    case 'shimmer':
      return `@keyframes shimmer {\n  0% { background-position: -200% 0; }\n  100% { background-position: 200% 0; }\n}`;
    case 'bounce':
      return `@keyframes bounce {\n  0%, 100% { transform: translateY(0); }\n  25% { transform: translateY(-8px); }\n  75% { transform: translateY(4px); }\n}`;
    default:
      return '';
  }
}

function buildAnimationCss(animation: AnimationType, duration: number): string {
  switch (animation) {
    case 'pulse': return `pulse ${duration}s ease-in-out infinite`;
    case 'float': return `float ${duration}s ease-in-out infinite`;
    case 'glow': return `glow ${duration}s ease-in-out infinite`;
    case 'rotate': return `spin ${duration}s linear infinite`;
    case 'shimmer': return `shimmer ${duration}s linear infinite`;
    case 'bounce': return `bounce ${duration}s ease-in-out infinite`;
    default: return '';
  }
}

function buildPreviewBackground(state: CssState): React.CSSProperties {
  if (state.glassEnabled) {
    const backdrop = `blur(${state.glassBlur}px) saturate(${state.glassSaturation}%) brightness(${state.glassBrightness}%)`;
    const result: React.CSSProperties = {
      background: hexToRgba(state.glassBgColor, state.glassBgOpacity),
      backdropFilter: backdrop,
      WebkitBackdropFilter: backdrop,
    };
    if (state.glassBorderOpacity > 0) {
      result.border = `1px solid ${hexToRgba(state.glassBorderColor, state.glassBorderOpacity)}`;
    }
    return result;
  }
  if (state.gradientEnabled) {
    return { background: buildGradientCss(state) };
  }
  return { background: hexToRgba(state.bgColor, state.bgOpacity) };
}

function generateFullCss(state: CssState): string {
  const props = buildCssProperties(state);
  const body = props.map((p) => `  ${p}`);
  const lines = ['.element {', ...body, '}'];

  const keyframes = buildAnimationKeyframes(state.animation);
  if (keyframes) {
    lines.push('', keyframes);
  }

  return lines.join('\n');
}

function buildCssBackgroundProp(state: CssState): string {
  if (state.glassEnabled) return `background: ${hexToRgba(state.glassBgColor, state.glassBgOpacity)};`;
  if (state.gradientEnabled) return `background: ${buildGradientCss(state)};`;
  return `background: ${hexToRgba(state.bgColor, state.bgOpacity)};`;
}

function buildCssGlassProps(state: CssState): string[] {
  if (!state.glassEnabled) return [];
  const parts = [`blur(${state.glassBlur}px)`];
  if (state.glassSaturation !== 100) parts.push(`saturate(${state.glassSaturation}%)`);
  if (state.glassBrightness !== 100) parts.push(`brightness(${state.glassBrightness}%)`);
  const val = parts.join(' ');
  const result = [`backdrop-filter: ${val};`, `-webkit-backdrop-filter: ${val};`];
  if (state.glassBorderOpacity > 0) {
    result.push(`border: 1px solid ${hexToRgba(state.glassBorderColor, state.glassBorderOpacity)};`);
  }
  return result;
}

function buildCssProperties(state: CssState): string[] {
  const unit = state.radiusUnit;
  const radiusVal = state.radiusLinked
    ? `${state.radiusAll}${unit}`
    : `${state.radiusTopLeft}${unit} ${state.radiusTopRight}${unit} ${state.radiusBottomRight}${unit} ${state.radiusBottomLeft}${unit}`;

  const props: string[] = [
    `width: ${state.width}px;`,
    `height: ${state.height}px;`,
    `padding: ${state.padding}px;`,
    buildCssBackgroundProp(state),
    `border-radius: ${radiusVal};`,
  ];

  if (state.borderEnabled && state.borderStyle !== 'none') {
    props.push(`border: ${state.borderWidth}px ${state.borderStyle} ${hexToRgba(state.borderColor, state.borderOpacity)};`);
  }
  if (state.shadowEnabled && state.shadowLayers.length > 0) {
    props.push(`box-shadow: ${buildShadowCss(state.shadowLayers)};`);
  }

  props.push(...buildCssGlassProps(state), `color: ${state.textColor};`);
  if (state.textSize !== 16) props.push(`font-size: ${state.textSize}px;`);
  if (state.textWeight !== 400) props.push(`font-weight: ${state.textWeight};`);
  if (state.textShadowEnabled) {
    props.push(`text-shadow: ${state.textShadowX}px ${state.textShadowY}px ${state.textShadowBlur}px ${hexToRgba(state.textShadowColor, 50)};`);
  }

  const transform = buildTransformCss(state);
  if (transform) props.push(`transform: ${transform};`);

  const filter = buildFilterCss(state);
  if (filter) props.push(`filter: ${filter};`);

  const animCss = buildAnimationCss(state.animation, state.animationDuration);
  if (animCss) props.push(`animation: ${animCss};`);

  return props;
}

function generateHtmlCss(state: CssState): string {
  const css = generateFullCss(state);
  return `<div class="element">\n  <h3>Card title</h3>\n  <p>Example content for your element.</p>\n</div>\n\n<style>\n${css}\n</style>`;
}

function generateTailwind(state: CssState): string {
  const classes = buildTailwindClasses(state);
  return `<div class="${classes.join(' ')}">\n  <h3>Card title</h3>\n  <p>Example content for your element.</p>\n</div>`;
}

function getTailwindRadiusClass(r: number): string {
  if (r >= 999) return 'rounded-full';
  if (r >= 24) return 'rounded-3xl';
  if (r >= 16) return 'rounded-2xl';
  if (r >= 12) return 'rounded-xl';
  if (r >= 8) return 'rounded-lg';
  if (r >= 6) return 'rounded-md';
  if (r >= 4) return 'rounded';
  return 'rounded-none';
}

function getTailwindShadowClass(layers: ShadowLayer[]): string {
  const totalBlur = layers.reduce((s, l) => s + l.blur, 0);
  if (totalBlur > 40) return 'shadow-2xl';
  if (totalBlur > 24) return 'shadow-xl';
  if (totalBlur > 12) return 'shadow-lg';
  if (totalBlur > 6) return 'shadow-md';
  return 'shadow';
}

function buildTailwindClasses(state: CssState): string[] {
  const classes: string[] = [
    `w-[${state.width}px]`,
    `h-[${state.height}px]`,
    `p-[${state.padding}px]`,
  ];

  // Border radius
  if (state.radiusLinked) {
    classes.push(getTailwindRadiusClass(state.radiusAll));
  } else {
    classes.push(`rounded-tl-[${state.radiusTopLeft}${state.radiusUnit}]`);
    classes.push(`rounded-tr-[${state.radiusTopRight}${state.radiusUnit}]`);
    classes.push(`rounded-br-[${state.radiusBottomRight}${state.radiusUnit}]`);
    classes.push(`rounded-bl-[${state.radiusBottomLeft}${state.radiusUnit}]`);
  }

  // Shadow
  if (state.shadowEnabled && state.shadowLayers.length > 0) {
    classes.push(getTailwindShadowClass(state.shadowLayers));
  }

  // Glass
  if (state.glassEnabled) {
    classes.push(`backdrop-blur-[${state.glassBlur}px]`);
    classes.push(`bg-white/${Math.round(state.glassBgOpacity)}`);
    if (state.glassBorderOpacity > 0) {
      classes.push('border', 'border-white/20');
    }
  }

  // Background (non-glass)
  if (!state.glassEnabled && !state.gradientEnabled) {
    if (state.bgOpacity === 100) {
      classes.push(`bg-[${state.bgColor}]`);
    } else {
      classes.push(`bg-[${state.bgColor}]/${state.bgOpacity}`);
    }
  }

  // Border (non-glass)
  if (state.borderEnabled && !state.glassEnabled) {
    classes.push(`border-[${state.borderWidth}px]`);
    classes.push(`border-[${state.borderColor}]`);
    if (state.borderStyle !== 'solid') {
      classes.push(`border-${state.borderStyle}`);
    }
  }

  // Text
  if (state.textColor !== '#1e293b') {
    classes.push(`text-[${state.textColor}]`);
  }
  if (state.textSize !== 16) {
    classes.push(`text-[${state.textSize}px]`);
  }
  if (state.textWeight !== 400) {
    const weightMap: Record<number, string> = { 100: 'thin', 200: 'extralight', 300: 'light', 500: 'medium', 600: 'semibold', 700: 'bold', 800: 'extrabold', 900: 'black' };
    classes.push(`font-${weightMap[state.textWeight] ?? `[${state.textWeight}]`}`);
  }

  // Transform
  if (state.rotate !== 0) classes.push(`rotate-[${state.rotate}deg]`);
  if (state.scale !== 1) classes.push(`scale-[${state.scale}]`);
  if (state.translateX !== 0) classes.push(`translate-x-[${state.translateX}px]`);
  if (state.translateY !== 0) classes.push(`translate-y-[${state.translateY}px]`);
  if (state.skewX !== 0) classes.push(`skew-x-[${state.skewX}deg]`);
  if (state.skewY !== 0) classes.push(`skew-y-[${state.skewY}deg]`);

  // Filters
  if (state.filterBlur > 0) classes.push(`blur-[${state.filterBlur}px]`);
  if (state.filterGrayscale > 0) classes.push(`grayscale-[${state.filterGrayscale}%]`);
  if (state.filterBrightness !== 100) classes.push(`brightness-[${state.filterBrightness}%]`);
  if (state.filterContrast !== 100) classes.push(`contrast-[${state.filterContrast}%]`);
  if (state.filterSaturate !== 100) classes.push(`saturate-[${state.filterSaturate}%]`);
  if (state.filterSepia > 0) classes.push(`sepia-[${state.filterSepia}%]`);
  if (state.filterHueRotate !== 0) classes.push(`hue-rotate-[${state.filterHueRotate}deg]`);

  // Animation
  if (state.animation !== 'none') {
    const animMap: Record<string, string> = { pulse: 'animate-pulse', bounce: 'animate-bounce', rotate: 'animate-spin' };
    classes.push(animMap[state.animation] ?? `animate-[${state.animation}_${state.animationDuration}s_ease-in-out_infinite]`);
  }

  return classes;
}

function generateCssVariables(state: CssState): string {
  const unit = state.radiusUnit;
  const vars: string[] = [
    `  --el-width: ${state.width}px;`,
    `  --el-height: ${state.height}px;`,
    `  --el-padding: ${state.padding}px;`,
    `  --el-radius: ${state.radiusLinked ? state.radiusAll : state.radiusTopLeft}${unit};`,
  ];

  if (state.shadowEnabled && state.shadowLayers.length > 0) {
    vars.push(`  --el-shadow: ${buildShadowCss(state.shadowLayers)};`);
  }
  if (state.glassEnabled) {
    vars.push(`  --el-glass-bg: ${hexToRgba(state.glassBgColor, state.glassBgOpacity)};`, `  --el-glass-blur: ${state.glassBlur}px;`);
  }
  if (state.gradientEnabled) {
    vars.push(`  --el-gradient: ${buildGradientCss(state)};`);
  }
  vars.push(`  --el-text-color: ${state.textColor};`);

  return [':root {', ...vars, '}'].join('\n');
}

// ---------- SLIDER COMPONENT ----------

function Slider({
  label, value, min, max, step = 1, onChange, unit = '', showValue = true,
}: Readonly<{
  label: string; value: number; min: number; max: number; step?: number;
  onChange: (v: number) => void; unit?: string; showValue?: boolean;
}>) {
  return (
    <label className="flex flex-col gap-1">
      <span className="flex items-center justify-between text-xs font-medium text-slate-600">
        <span>{label}</span>
        {showValue && <span className="tabular-nums text-slate-500">{value}{unit}</span>}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-brand-600 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-600"
      />
    </label>
  );
}

function ColorPicker({ label, value, onChange }: Readonly<{ label: string; value: string; onChange: (v: string) => void }>) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 w-7 cursor-pointer rounded border border-slate-300 p-0"
      />
      <span className="text-xs text-slate-500">{value}</span>
    </label>
  );
}

function Toggle({ label, checked, onChange }: Readonly<{ label: string; checked: boolean; onChange: (v: boolean) => void }>) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2">
      <div className="relative">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
        <div className="h-5 w-9 rounded-full bg-slate-300 transition peer-checked:bg-brand-600" />
        <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-4" />
      </div>
      <span className="text-xs font-medium text-slate-600">{label}</span>
    </label>
  );
}

// ---------- MAIN COMPONENT ----------

type CssGeneratorToolProps = Readonly<{ locale?: AppLocale; initialCategory?: CategoryId }>;

export function CssGeneratorTool({ locale = 'pt-br', initialCategory = 'presets' }: CssGeneratorToolProps) {
  const labels = labelsByLocale[locale];
  const [state, setState] = useState<CssState>({ ...DEFAULT_STATE });
  const [category, setCategory] = useState<CategoryId>(initialCategory);
  const [elementType, setElementType] = useState<ElementType>('card');
  const [bgType, setBgType] = useState<BackgroundType>('gradient');
  const [codeTab, setCodeTab] = useState<CodeTab>('css');
  const [copied, setCopied] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const update = useCallback((partial: Partial<CssState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  const removeShadowLayer = useCallback((layerId: string) => {
    update({ shadowLayers: state.shadowLayers.filter((l) => l.id !== layerId) });
  }, [state.shadowLayers, update]);

  const updateShadowLayer = useCallback((idx: number, partial: Partial<ShadowLayer>) => {
    const layers = [...state.shadowLayers];
    layers[idx] = { ...layers[idx], ...partial };
    update({ shadowLayers: layers });
  }, [state.shadowLayers, update]);

  const removeGradientColor = useCallback((idx: number) => {
    update({ gradientColors: state.gradientColors.filter((_, i) => i !== idx) });
  }, [state.gradientColors, update]);

  const updateGradientColor = useCallback((idx: number, partial: Partial<{ color: string; stop: number }>) => {
    const colors = [...state.gradientColors];
    colors[idx] = { ...colors[idx], ...partial };
    update({ gradientColors: colors });
  }, [state.gradientColors, update]);

  // Build inline styles for preview
  const previewStyle = useMemo((): React.CSSProperties => {
    const s: React.CSSProperties = {
      width: state.width,
      height: state.height,
      padding: state.padding,
      color: state.textColor,
    };
    if (state.textSize !== 16) s.fontSize = state.textSize;
    if (state.textWeight !== 400) s.fontWeight = state.textWeight;

    // Background
    Object.assign(s, buildPreviewBackground(state));

    // Radius
    const unit = state.radiusUnit;
    s.borderRadius = state.radiusLinked
      ? `${state.radiusAll}${unit}`
      : `${state.radiusTopLeft}${unit} ${state.radiusTopRight}${unit} ${state.radiusBottomRight}${unit} ${state.radiusBottomLeft}${unit}`;

    // Border (not glass)
    if (state.borderEnabled && !state.glassEnabled && state.borderStyle !== 'none') {
      s.border = `${state.borderWidth}px ${state.borderStyle} ${hexToRgba(state.borderColor, state.borderOpacity)}`;
    }

    // Shadow
    if (state.shadowEnabled && state.shadowLayers.length > 0) {
      s.boxShadow = buildShadowCss(state.shadowLayers);
    }

    // Text shadow
    if (state.textShadowEnabled) {
      s.textShadow = `${state.textShadowX}px ${state.textShadowY}px ${state.textShadowBlur}px ${hexToRgba(state.textShadowColor, 50)}`;
    }

    // Transform
    const transform = buildTransformCss(state);
    if (transform) s.transform = transform;

    // Filter
    const filter = buildFilterCss(state);
    if (filter) s.filter = filter;

    // Animation
    if (state.animation !== 'none') {
      s.animation = buildAnimationCss(state.animation, state.animationDuration);
    }

    return s;
  }, [state]);

  const codeOutput = useMemo(() => {
    switch (codeTab) {
      case 'html': return generateHtmlCss(state);
      case 'tailwind': return generateTailwind(state);
      case 'variables': return generateCssVariables(state);
      default: return generateFullCss(state);
    }
  }, [state, codeTab]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(codeOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [codeOutput]);

  const applyPreset = useCallback((preset: Preset) => {
    setState(() => ({ ...DEFAULT_STATE, ...preset.state }));
  }, []);

  const handleReset = useCallback(() => {
    setState({ ...DEFAULT_STATE });
  }, []);

  const handleResetSection = useCallback(() => {
    const sectionDefaults: Record<CategoryId, Partial<CssState>> = {
      presets: {},
      shadow: { shadowEnabled: DEFAULT_STATE.shadowEnabled, shadowLayers: [{ ...DEFAULT_SHADOW_LAYER }] },
      radius: { radiusLinked: true, radiusAll: 16, radiusTopLeft: 16, radiusTopRight: 16, radiusBottomRight: 16, radiusBottomLeft: 16, radiusUnit: 'px' },
      gradient: { gradientEnabled: false, gradientType: 'linear', gradientAngle: 135, gradientColors: [{ color: '#8b5cf6', stop: 0 }, { color: '#06b6d4', stop: 100 }] },
      glass: { glassEnabled: false, glassBgOpacity: 16, glassBgColor: '#ffffff', glassBlur: 16, glassSaturation: 180, glassBrightness: 100, glassBorderOpacity: 28, glassBorderColor: '#ffffff' },
      border: { borderEnabled: true, borderWidth: 1, borderColor: '#e2e8f0', borderStyle: 'solid', borderOpacity: 100 },
      text: { textColor: '#1e293b', textSize: 16, textWeight: 400, textShadowEnabled: false, textShadowX: 0, textShadowY: 2, textShadowBlur: 4, textShadowColor: '#000000' },
      spacing: { width: 320, height: 200, padding: 32, bgColor: '#ffffff', bgOpacity: 100 },
      transform: { rotate: 0, scale: 1, skewX: 0, skewY: 0, translateX: 0, translateY: 0 },
      filters: { filterBlur: 0, filterBrightness: 100, filterContrast: 100, filterGrayscale: 0, filterHueRotate: 0, filterSaturate: 100, filterSepia: 0 },
      animation: { animation: 'none', animationDuration: 2 },
    };
    const defaults = sectionDefaults[category];
    if (defaults && Object.keys(defaults).length > 0) {
      setState((prev) => ({ ...prev, ...defaults }));
    }
  }, [category]);

  // Keyframes style injection
  useEffect(() => {
    if (state.animation === 'none') return;
    const keyframes = buildAnimationKeyframes(state.animation);
    if (!keyframes) return;
    const id = 'css-gen-keyframes';
    let style = document.getElementById(id) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement('style');
      style.id = id;
      document.head.appendChild(style);
    }
    style.textContent = keyframes;
    return () => { if (style) style.textContent = ''; };
  }, [state.animation]);

  // Background for preview area
  const bgStyle = useMemo((): React.CSSProperties => {
    switch (bgType) {
      case 'solid': return { background: '#f8fafc' };
      case 'dark': return { background: '#0f172a' };
      case 'dots': return { background: '#f8fafc', backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' };
      case 'checkerboard': return { background: 'repeating-conic-gradient(#e2e8f0 0% 25%, #ffffff 0% 50%) 0 0 / 20px 20px' };
      case 'blobs': return { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' };
      case 'image': return { background: 'linear-gradient(135deg, #1e3a5f 0%, #4a90d9 50%, #a8d8ea 100%)' };
      default: return { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' };
    }
  }, [bgType]);

  // --- RENDER CATEGORY PANELS ---

  const renderPresetsPanel = () => (
    <div className="grid grid-cols-2 gap-2">
      {PRESETS.map((p) => (
        <button
          key={p.id}
          onClick={() => applyPreset(p)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-xs font-medium text-slate-700 shadow-sm transition hover:border-brand-300 hover:bg-brand-50"
        >
          {p.name}
        </button>
      ))}
    </div>
  );

  const renderShadowPanel = () => (
    <div className="space-y-4">
      <Toggle label={labels.enabled} checked={state.shadowEnabled} onChange={(v) => update({ shadowEnabled: v })} />
      {state.shadowEnabled && state.shadowLayers.map((layer, idx) => (
        <div key={layer.id} className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Layer {idx + 1}</span>
            {state.shadowLayers.length > 1 && (
              <button
                onClick={() => removeShadowLayer(layer.id)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                {labels.removeLayer}
              </button>
            )}
          </div>
          <Toggle label={labels.inset} checked={layer.inset} onChange={(v) => updateShadowLayer(idx, { inset: v })} />
          <Slider label={labels.offsetX} value={layer.offsetX} min={-100} max={100} onChange={(v) => updateShadowLayer(idx, { offsetX: v })} unit="px" />
          <Slider label={labels.offsetY} value={layer.offsetY} min={-100} max={100} onChange={(v) => updateShadowLayer(idx, { offsetY: v })} unit="px" />
          <Slider label={labels.blur} value={layer.blur} min={0} max={200} onChange={(v) => updateShadowLayer(idx, { blur: v })} unit="px" />
          <Slider label={labels.spread} value={layer.spread} min={-50} max={100} onChange={(v) => updateShadowLayer(idx, { spread: v })} unit="px" />
          <Slider label={labels.opacity} value={layer.opacity} min={0} max={100} onChange={(v) => updateShadowLayer(idx, { opacity: v })} unit="%" />
          <ColorPicker label={labels.color} value={layer.color} onChange={(v) => updateShadowLayer(idx, { color: v })} />
        </div>
      ))}
      {state.shadowEnabled && (
        <Button variant="secondary" className="w-full text-xs" onClick={() => {
          update({ shadowLayers: [...state.shadowLayers, { ...DEFAULT_SHADOW_LAYER, id: generateId() }] });
        }}>
          + {labels.addLayer}
        </Button>
      )}
    </div>
  );

  const renderRadiusPanel = () => (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => update({ radiusLinked: true })}
          className={`rounded-md px-3 py-1 text-xs font-medium ${state.radiusLinked ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}
        >
          {labels.linked}
        </button>
        <button
          onClick={() => update({ radiusLinked: false })}
          className={`rounded-md px-3 py-1 text-xs font-medium ${state.radiusLinked ? 'bg-slate-100 text-slate-600' : 'bg-brand-600 text-white'}`}
        >
          {labels.unlinked}
        </button>
      </div>
      <div className="flex gap-2">
        <button onClick={() => update({ radiusUnit: 'px' })} className={`rounded px-2 py-1 text-xs ${state.radiusUnit === 'px' ? 'bg-brand-600 text-white' : 'bg-slate-100'}`}>px</button>
        <button onClick={() => update({ radiusUnit: '%' })} className={`rounded px-2 py-1 text-xs ${state.radiusUnit === '%' ? 'bg-brand-600 text-white' : 'bg-slate-100'}`}>%</button>
      </div>
      {state.radiusLinked ? (
        <Slider label={labels.all} value={state.radiusAll} min={0} max={state.radiusUnit === '%' ? 50 : 200} onChange={(v) => update({ radiusAll: v, radiusTopLeft: v, radiusTopRight: v, radiusBottomRight: v, radiusBottomLeft: v })} unit={state.radiusUnit} />
      ) : (
        <>
          <Slider label="Top Left" value={state.radiusTopLeft} min={0} max={state.radiusUnit === '%' ? 50 : 200} onChange={(v) => update({ radiusTopLeft: v })} unit={state.radiusUnit} />
          <Slider label="Top Right" value={state.radiusTopRight} min={0} max={state.radiusUnit === '%' ? 50 : 200} onChange={(v) => update({ radiusTopRight: v })} unit={state.radiusUnit} />
          <Slider label="Bottom Right" value={state.radiusBottomRight} min={0} max={state.radiusUnit === '%' ? 50 : 200} onChange={(v) => update({ radiusBottomRight: v })} unit={state.radiusUnit} />
          <Slider label="Bottom Left" value={state.radiusBottomLeft} min={0} max={state.radiusUnit === '%' ? 50 : 200} onChange={(v) => update({ radiusBottomLeft: v })} unit={state.radiusUnit} />
        </>
      )}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => update({ radiusAll: 999, radiusTopLeft: 999, radiusTopRight: 999, radiusBottomRight: 999, radiusBottomLeft: 999, radiusLinked: true, radiusUnit: 'px' })} className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50">Pill</button>
        <button onClick={() => update({ radiusAll: 50, radiusTopLeft: 50, radiusTopRight: 50, radiusBottomRight: 50, radiusBottomLeft: 50, radiusLinked: true, radiusUnit: '%' })} className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50">Circle</button>
        <button onClick={() => update({ radiusAll: 0, radiusTopLeft: 0, radiusTopRight: 0, radiusBottomRight: 0, radiusBottomLeft: 0, radiusLinked: true })} className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50">Square</button>
      </div>
    </div>
  );

  const renderGradientPanel = () => (
    <div className="space-y-4">
      <Toggle label={labels.enabled} checked={state.gradientEnabled} onChange={(v) => update({ gradientEnabled: v })} />
      {state.gradientEnabled && (
        <>
          <div className="flex gap-2">
            {(['linear', 'radial', 'conic'] as const).map((t) => (
              <button key={t} onClick={() => update({ gradientType: t })} className={`rounded-md px-3 py-1 text-xs font-medium capitalize ${state.gradientType === t ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{t}</button>
            ))}
          </div>
          {state.gradientType !== 'radial' && (
            <Slider label={labels.angle} value={state.gradientAngle} min={0} max={360} onChange={(v) => update({ gradientAngle: v })} unit="°" />
          )}
          {state.gradientColors.map((gc, idx) => (
            <div key={`color-${gc.color}-${gc.stop}`} className="flex items-center gap-2">
              <input type="color" value={gc.color} onChange={(e) => updateGradientColor(idx, { color: e.target.value })} className="h-7 w-7 cursor-pointer rounded border border-slate-300 p-0" />
              <Slider label={`Stop ${idx + 1}`} value={gc.stop} min={0} max={100} onChange={(v) => updateGradientColor(idx, { stop: v })} unit="%" />
              {state.gradientColors.length > 2 && (
                <button onClick={() => removeGradientColor(idx)} className="text-xs text-red-500">✕</button>
              )}
            </div>
          ))}
          <Button variant="secondary" className="w-full text-xs" onClick={() => update({ gradientColors: [...state.gradientColors, { color: '#10b981', stop: 50 }] })}>
            + Color
          </Button>
        </>
      )}
    </div>
  );

  const renderGlassPanel = () => (
    <div className="space-y-4">
      <Toggle label={labels.enabled} checked={state.glassEnabled} onChange={(v) => update({ glassEnabled: v })} />
      {state.glassEnabled && (
        <>
          <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">{labels.glassHint}</p>
          <Slider label={`BG ${labels.opacity}`} value={state.glassBgOpacity} min={0} max={100} onChange={(v) => update({ glassBgOpacity: v })} unit="%" />
          <ColorPicker label={`BG ${labels.color}`} value={state.glassBgColor} onChange={(v) => update({ glassBgColor: v })} />
          <Slider label={labels.blur} value={state.glassBlur} min={0} max={40} onChange={(v) => update({ glassBlur: v })} unit="px" />
          <Slider label="Saturation" value={state.glassSaturation} min={0} max={300} onChange={(v) => update({ glassSaturation: v })} unit="%" />
          <Slider label="Brightness" value={state.glassBrightness} min={50} max={150} onChange={(v) => update({ glassBrightness: v })} unit="%" />
          <Slider label={`Border ${labels.opacity}`} value={state.glassBorderOpacity} min={0} max={100} onChange={(v) => update({ glassBorderOpacity: v })} unit="%" />
          <ColorPicker label={`Border ${labels.color}`} value={state.glassBorderColor} onChange={(v) => update({ glassBorderColor: v })} />
        </>
      )}
    </div>
  );

  const renderBorderPanel = () => (
    <div className="space-y-4">
      <Toggle label={labels.enabled} checked={state.borderEnabled} onChange={(v) => update({ borderEnabled: v })} />
      {state.borderEnabled && (
        <>
          <Slider label={labels.width} value={state.borderWidth} min={0} max={20} onChange={(v) => update({ borderWidth: v })} unit="px" />
          <div className="flex flex-wrap gap-1">
            {(['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'none'] as BorderStyle[]).map((s) => (
              <button key={s} onClick={() => update({ borderStyle: s })} className={`rounded px-2 py-1 text-xs capitalize ${state.borderStyle === s ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{s}</button>
            ))}
          </div>
          <ColorPicker label={labels.color} value={state.borderColor} onChange={(v) => update({ borderColor: v })} />
          <Slider label={labels.opacity} value={state.borderOpacity} min={0} max={100} onChange={(v) => update({ borderOpacity: v })} unit="%" />
        </>
      )}
    </div>
  );

  const renderTextPanel = () => (
    <div className="space-y-4">
      <ColorPicker label={labels.color} value={state.textColor} onChange={(v) => update({ textColor: v })} />
      <Slider label={labels.size} value={state.textSize} min={10} max={48} onChange={(v) => update({ textSize: v })} unit="px" />
      <Slider label={labels.weight} value={state.textWeight} min={100} max={900} step={100} onChange={(v) => update({ textWeight: v })} />
      <Toggle label="Text Shadow" checked={state.textShadowEnabled} onChange={(v) => update({ textShadowEnabled: v })} />
      {state.textShadowEnabled && (
        <>
          <Slider label={labels.offsetX} value={state.textShadowX} min={-20} max={20} onChange={(v) => update({ textShadowX: v })} unit="px" />
          <Slider label={labels.offsetY} value={state.textShadowY} min={-20} max={20} onChange={(v) => update({ textShadowY: v })} unit="px" />
          <Slider label={labels.blur} value={state.textShadowBlur} min={0} max={30} onChange={(v) => update({ textShadowBlur: v })} unit="px" />
          <ColorPicker label={labels.color} value={state.textShadowColor} onChange={(v) => update({ textShadowColor: v })} />
        </>
      )}
    </div>
  );

  const renderSpacingPanel = () => (
    <div className="space-y-4">
      <Slider label={labels.width} value={state.width} min={100} max={600} onChange={(v) => update({ width: v })} unit="px" />
      <Slider label={labels.height} value={state.height} min={40} max={500} onChange={(v) => update({ height: v })} unit="px" />
      <Slider label={labels.padding} value={state.padding} min={0} max={80} onChange={(v) => update({ padding: v })} unit="px" />
      <ColorPicker label={`BG ${labels.color}`} value={state.bgColor} onChange={(v) => update({ bgColor: v })} />
      <Slider label={`BG ${labels.opacity}`} value={state.bgOpacity} min={0} max={100} onChange={(v) => update({ bgOpacity: v })} unit="%" />
    </div>
  );

  const renderTransformPanel = () => (
    <div className="space-y-4">
      <Slider label="Rotate" value={state.rotate} min={-180} max={180} onChange={(v) => update({ rotate: v })} unit="°" />
      <Slider label="Scale" value={state.scale} min={0.1} max={3} step={0.05} onChange={(v) => update({ scale: v })} />
      <Slider label="Skew X" value={state.skewX} min={-45} max={45} onChange={(v) => update({ skewX: v })} unit="°" />
      <Slider label="Skew Y" value={state.skewY} min={-45} max={45} onChange={(v) => update({ skewY: v })} unit="°" />
      <Slider label="Translate X" value={state.translateX} min={-100} max={100} onChange={(v) => update({ translateX: v })} unit="px" />
      <Slider label="Translate Y" value={state.translateY} min={-100} max={100} onChange={(v) => update({ translateY: v })} unit="px" />
    </div>
  );

  const renderFiltersPanel = () => (
    <div className="space-y-4">
      <Slider label="Blur" value={state.filterBlur} min={0} max={20} onChange={(v) => update({ filterBlur: v })} unit="px" />
      <Slider label="Brightness" value={state.filterBrightness} min={0} max={200} onChange={(v) => update({ filterBrightness: v })} unit="%" />
      <Slider label="Contrast" value={state.filterContrast} min={0} max={200} onChange={(v) => update({ filterContrast: v })} unit="%" />
      <Slider label="Grayscale" value={state.filterGrayscale} min={0} max={100} onChange={(v) => update({ filterGrayscale: v })} unit="%" />
      <Slider label="Hue Rotate" value={state.filterHueRotate} min={0} max={360} onChange={(v) => update({ filterHueRotate: v })} unit="°" />
      <Slider label="Saturate" value={state.filterSaturate} min={0} max={300} onChange={(v) => update({ filterSaturate: v })} unit="%" />
      <Slider label="Sepia" value={state.filterSepia} min={0} max={100} onChange={(v) => update({ filterSepia: v })} unit="%" />
    </div>
  );

  const renderAnimationPanel = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1">
        {(['none', 'pulse', 'float', 'glow', 'rotate', 'shimmer', 'bounce'] as AnimationType[]).map((a) => (
          <button key={a} onClick={() => update({ animation: a })} className={`rounded-md px-3 py-1 text-xs font-medium capitalize ${state.animation === a ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{a}</button>
        ))}
      </div>
      {state.animation !== 'none' && (
        <Slider label={labels.duration} value={state.animationDuration} min={0.5} max={5} step={0.1} onChange={(v) => update({ animationDuration: v })} unit="s" />
      )}
    </div>
  );

  const renderPanel = () => {
    switch (category) {
      case 'presets': return renderPresetsPanel();
      case 'shadow': return renderShadowPanel();
      case 'radius': return renderRadiusPanel();
      case 'gradient': return renderGradientPanel();
      case 'glass': return renderGlassPanel();
      case 'border': return renderBorderPanel();
      case 'text': return renderTextPanel();
      case 'spacing': return renderSpacingPanel();
      case 'transform': return renderTransformPanel();
      case 'filters': return renderFiltersPanel();
      case 'animation': return renderAnimationPanel();
    }
  };

  // Preview element content
  const renderElementContent = () => {
    switch (elementType) {
      case 'button':
        return <span className="font-semibold">{labels.previewButton}</span>;
      case 'input':
        return <span className="opacity-50">placeholder@email.com</span>;
      case 'badge':
        return <span className="text-xs font-bold uppercase">Badge</span>;
      case 'toast':
        return (
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold">Notification</span>
            <span className="text-xs opacity-70">{labels.previewText}</span>
          </div>
        );
      case 'hero':
        return (
          <div className="flex flex-col gap-2">
            <span className="text-xl font-bold">{labels.previewTitle}</span>
            <span className="text-sm opacity-80">{labels.previewText}</span>
          </div>
        );
      default:
        return (
          <div className="flex flex-col gap-2">
            <span className="text-lg font-semibold">{labels.previewTitle}</span>
            <span className="text-sm opacity-75">{labels.previewText}</span>
            <span className="mt-1 inline-block self-start rounded-md bg-current/10 px-3 py-1 text-xs font-medium">{labels.previewButton}</span>
          </div>
        );
    }
  };

  // Categories list
  const categoryList: CategoryId[] = ['presets', 'shadow', 'radius', 'gradient', 'glass', 'border', 'text', 'spacing', 'transform', 'filters', 'animation'];

  return (
    <Card className="overflow-hidden p-0">
      {/* Mobile: preview + toggle */}
      <div className="lg:hidden">
        {/* Preview area mobile */}
        <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-t-xl p-6" style={bgStyle}>
          <div ref={previewRef} style={previewStyle} className="flex max-w-full items-center justify-center overflow-hidden">
            {renderElementContent()}
          </div>
        </div>

        {/* Mobile toolbar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2">
          <select value={elementType} onChange={(e) => setElementType(e.target.value as ElementType)} className="rounded border border-slate-200 bg-white px-2 py-1 text-xs">
            {(Object.keys(labels.elements) as ElementType[]).map((el) => (
              <option key={el} value={el}>{labels.elements[el]}</option>
            ))}
          </select>
          <select value={bgType} onChange={(e) => setBgType(e.target.value as BackgroundType)} className="rounded border border-slate-200 bg-white px-2 py-1 text-xs">
            {(Object.keys(labels.backgrounds) as BackgroundType[]).map((bg) => (
              <option key={bg} value={bg}>{labels.backgrounds[bg]}</option>
            ))}
          </select>
          <button onClick={handleReset} className="ml-auto rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 hover:bg-slate-50">{labels.reset}</button>
          <button onClick={handleResetSection} className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 hover:bg-slate-50">{labels.resetSection}</button>
        </div>

        {/* Mobile category tabs */}
        <div className="flex overflow-x-auto border-b border-slate-200 bg-white px-2">
          {categoryList.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`whitespace-nowrap px-3 py-2 text-xs font-medium transition ${category === cat ? 'border-b-2 border-brand-600 text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {labels.categories[cat]}
            </button>
          ))}
        </div>

        {/* Mobile controls */}
        <div className="max-h-[300px] overflow-y-auto p-4">
          {renderPanel()}
        </div>

        {/* Mobile code */}
        <div className="border-t border-slate-200 bg-slate-50 p-4">
          <div className="mb-2 flex gap-1">
            {(Object.keys(labels.codeTab) as CodeTab[]).map((tab) => (
              <button key={tab} onClick={() => setCodeTab(tab)} className={`rounded px-2 py-1 text-xs font-medium ${codeTab === tab ? 'bg-brand-600 text-white' : 'bg-white text-slate-600'}`}>{labels.codeTab[tab]}</button>
            ))}
          </div>
          <pre className="max-h-[200px] overflow-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
            <code>{codeOutput}</code>
          </pre>
          <Button onClick={handleCopy} variant="primary" className="mt-2 w-full text-xs">
            {copied ? labels.copied : labels.copy}
          </Button>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:grid lg:grid-cols-[280px_1fr]">
        {/* Left panel */}
        <div className="flex max-h-[700px] flex-col border-r border-slate-200 bg-slate-50/50">
          {/* Category nav */}
          <nav className="flex flex-wrap gap-1 border-b border-slate-200 p-3">
            {categoryList.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-md px-2 py-1 text-xs font-medium transition ${category === cat ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
              >
                {labels.categories[cat]}
              </button>
            ))}
          </nav>
          {/* Controls */}
          <div className="flex-1 overflow-y-auto p-4">
            {renderPanel()}
          </div>
          <div className="border-t border-slate-200 p-3 space-y-2">
            <Button variant="secondary" className="w-full text-xs" onClick={handleResetSection}>{labels.resetSection}</Button>
            <Button variant="ghost" className="w-full text-xs" onClick={handleReset}>{labels.reset}</Button>
          </div>
        </div>

        {/* Right area */}
        <div className="flex flex-col">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-4 py-2">
            <label className="flex items-center gap-1 text-xs text-slate-600">
              {labels.element}:
              <select value={elementType} onChange={(e) => setElementType(e.target.value as ElementType)} className="rounded border border-slate-200 bg-white px-2 py-1 text-xs">
                {(Object.keys(labels.elements) as ElementType[]).map((el) => (
                  <option key={el} value={el}>{labels.elements[el]}</option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-1 text-xs text-slate-600">
              {labels.background}:
              <select value={bgType} onChange={(e) => setBgType(e.target.value as BackgroundType)} className="rounded border border-slate-200 bg-white px-2 py-1 text-xs">
                {(Object.keys(labels.backgrounds) as BackgroundType[]).map((bg) => (
                  <option key={bg} value={bg}>{labels.backgrounds[bg]}</option>
                ))}
              </select>
            </label>
          </div>

          {/* Preview */}
          <div className="relative flex min-h-[350px] flex-1 items-center justify-center overflow-hidden p-8" style={bgStyle}>
            <div ref={previewRef} style={previewStyle} className="flex max-w-full items-center justify-center overflow-hidden">
              {renderElementContent()}
            </div>
          </div>

          {/* Code output */}
          <div className="border-t border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <h3 className="text-xs font-semibold text-slate-700">{labels.codeTitle}</h3>
              <div className="ml-auto flex gap-1">
                {(Object.keys(labels.codeTab) as CodeTab[]).map((tab) => (
                  <button key={tab} onClick={() => setCodeTab(tab)} className={`rounded px-2 py-1 text-xs font-medium transition ${codeTab === tab ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}>{labels.codeTab[tab]}</button>
                ))}
              </div>
            </div>
            <pre className="max-h-[220px] overflow-auto rounded-lg bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">
              <code>{codeOutput}</code>
            </pre>
            <div className="mt-3 flex gap-2">
              <Button onClick={handleCopy} variant="primary" className="text-xs">
                {copied ? labels.copied : labels.copy}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
