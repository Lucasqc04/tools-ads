import type { FitMode, FrameAspectId, PanCrop, PanoramaAspectId } from '@/types/instagram-post-simulator';

/**
 * Geometria compartilhada entre a prévia (CSS em porcentagem) e o exportador (pixels).
 * Um quadro é descrito pela proporção largura/altura. Uma caixa é descrita em frações:
 * left/width relativos à largura do quadro e top/height relativos à altura.
 */
export type FrameBox = { left: number; top: number; width: number; height: number };

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 3;
export const MAX_PANORAMA_SLIDES = 20;
export const MIN_PANORAMA_SLIDES = 2;
export const CAROUSEL_LIMIT = 20;
export const OUTPUT_WIDTH = 1080;

export const DEFAULT_CROP: PanCrop = { x: 0.5, y: 0.5, zoom: 1 };

export const FRAME_ASPECTS: Record<FrameAspectId, { width: number; height: number }> = {
  '1:1': { width: 1080, height: 1080 },
  '4:5': { width: 1080, height: 1350 },
  '3:4': { width: 1080, height: 1440 },
  '1.91:1': { width: 1080, height: 566 },
};

export const REEL_RATIO = 9 / 16;
export const GRID_RATIO = 3 / 4;

export const frameRatioOf = (aspect: FrameAspectId | PanoramaAspectId): number => {
  const size = FRAME_ASPECTS[aspect];
  return size.width / size.height;
};

const clamp = (value: number, min: number, max: number): number =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : min;

export const clampCrop = (crop: PanCrop): PanCrop => ({
  x: clamp(crop.x, 0, 1),
  y: clamp(crop.y, 0, 1),
  zoom: clamp(crop.zoom, MIN_ZOOM, MAX_ZOOM),
});

export const FULL_BOX: FrameBox = { left: 0, top: 0, width: 1, height: 1 };

/**
 * Calcula onde a imagem fica dentro de um quadro. O preenchimento usa cobertura com zoom;
 * o modo ajustar mostra a imagem inteira e centraliza com faixas.
 */
export const getImageLayout = (
  image: { width: number; height: number },
  frameRatio: number,
  crop: PanCrop,
  fit: FitMode,
): FrameBox => {
  if (!(image.width > 0) || !(image.height > 0) || !(frameRatio > 0)) return FULL_BOX;

  const c = clampCrop(crop);
  const imageRatio = image.width / image.height;
  // Trabalha com altura do quadro = 1 e largura = frameRatio.
  const scale = fit === 'fill'
    ? Math.max(frameRatio / imageRatio, 1) * c.zoom
    : Math.min(frameRatio / imageRatio, 1);
  const drawWidth = imageRatio * scale;
  const drawHeight = scale;
  const panX = fit === 'fill' ? c.x : 0.5;
  const panY = fit === 'fill' ? c.y : 0.5;
  const left = (frameRatio - drawWidth) * panX;
  const top = (1 - drawHeight) * panY;

  return {
    left: left / frameRatio,
    top,
    width: drawWidth / frameRatio,
    height: drawHeight,
  };
};

/**
 * Converte a caixa de um carrossel contínuo (quadro composto de `count` slides)
 * em uma caixa relativa a um único slide. Os limites ficam exatos porque todos
 * os slides compartilham a mesma escala.
 */
export const getPanoramaSlideBox = (box: FrameBox, count: number, index: number): FrameBox => ({
  left: box.left * count - index,
  top: box.top,
  width: box.width * count,
  height: box.height,
});

/** Janela que a grade do perfil (3:4) mostra dentro de um quadro de proporção `frameRatio`. */
export const getGridWindow = (frameRatio: number, gridCrop: PanCrop): FrameBox => {
  const c = clampCrop({ ...gridCrop, zoom: 1 });

  if (frameRatio > GRID_RATIO) {
    const width = GRID_RATIO / frameRatio;
    return { left: (1 - width) * c.x, top: 0, width, height: 1 };
  }

  const height = frameRatio / GRID_RATIO;
  return { left: 0, top: (1 - height) * c.y, width: 1, height };
};

/** Quanto do quadro sai da grade, em porcentagem da área total (0 = nada cortado). */
export const getGridCutPercent = (frameRatio: number): number => {
  const window = getGridWindow(frameRatio, { x: 0.5, y: 0.5, zoom: 1 });
  return Math.round((1 - window.width * window.height) * 100);
};

/** Transforma uma caixa em pixels de um quadro de largura `width` e altura `height`. */
export const toPixelRect = (box: FrameBox, width: number, height: number) => ({
  x: box.left * width,
  y: box.top * height,
  width: box.width * width,
  height: box.height * height,
});

/**
 * Converte um arraste em pixels da prévia em nova posição de enquadramento.
 * Arrastar para a direita mostra a parte esquerda da imagem, por isso o sinal é invertido.
 */
export const panCropByPixels = (
  crop: PanCrop,
  box: FrameBox,
  frameWidthPx: number,
  frameHeightPx: number,
  deltaXPx: number,
  deltaYPx: number,
): PanCrop => {
  const overflowX = (box.width - 1) * frameWidthPx;
  const overflowY = (box.height - 1) * frameHeightPx;
  const x = overflowX > 1 ? crop.x - deltaXPx / overflowX : crop.x;
  const y = overflowY > 1 ? crop.y - deltaYPx / overflowY : crop.y;

  return clampCrop({ ...crop, x, y });
};

/** Zoom por pinça: escala a partir do zoom inicial pela razão entre as distâncias dos dedos. */
export const zoomFromPinch = (startZoom: number, startDistance: number, currentDistance: number): number => {
  if (!(startDistance > 0)) return clamp(startZoom, MIN_ZOOM, MAX_ZOOM);
  return clamp(startZoom * (currentDistance / startDistance), MIN_ZOOM, MAX_ZOOM);
};

export const getPanoramaCompositeRatio = (count: number, aspect: PanoramaAspectId): number =>
  count * frameRatioOf(aspect);

export const clampPanoramaCount = (value: number): number =>
  Math.round(clamp(value, MIN_PANORAMA_SLIDES, MAX_PANORAMA_SLIDES));
