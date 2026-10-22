export type InstagramPresetId =
  | 'feed-34'
  | 'feed-45'
  | 'square'
  | 'landscape'
  | 'story'
  | 'profile'
  | 'custom'
  | 'original';

export type InstagramPreset = {
  id: InstagramPresetId;
  width: number;
  height: number;
};

export type CropPosition = {
  x: number;
  y: number;
  zoom: number;
};

export type CropRectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

// Instagram Help Center, photo resolution: https://help.instagram.com/1631821640426723
// Feed values are references; Stories and profile output sizes are practical presets, not guarantees.
export const INSTAGRAM_PRESETS: Record<Exclude<InstagramPresetId, 'original' | 'custom'>, InstagramPreset> = {
  'feed-34': { id: 'feed-34', width: 1080, height: 1440 },
  'feed-45': { id: 'feed-45', width: 1080, height: 1350 },
  square: { id: 'square', width: 1080, height: 1080 },
  landscape: { id: 'landscape', width: 1080, height: 566 },
  story: { id: 'story', width: 1080, height: 1920 },
  profile: { id: 'profile', width: 1080, height: 1080 },
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const calculateCropRectangle = (
  sourceWidth: number,
  sourceHeight: number,
  targetRatio: number,
  position: CropPosition,
): CropRectangle => {
  if (
    !Number.isFinite(sourceWidth) ||
    !Number.isFinite(sourceHeight) ||
    !Number.isFinite(targetRatio) ||
    sourceWidth < 1 ||
    sourceHeight < 1 ||
    targetRatio <= 0
  ) {
    throw new Error('Invalid image dimensions or target ratio.');
  }

  const sourceRatio = sourceWidth / sourceHeight;
  const baseWidth = sourceRatio > targetRatio ? sourceHeight * targetRatio : sourceWidth;
  const baseHeight = sourceRatio > targetRatio ? sourceHeight : sourceWidth / targetRatio;
  const zoom = clamp(position.zoom, 1, 2);
  const width = Math.min(sourceWidth, baseWidth / zoom);
  const height = Math.min(sourceHeight, baseHeight / zoom);
  const x = clamp(position.x, 0, 1) * (sourceWidth - width);
  const y = clamp(position.y, 0, 1) * (sourceHeight - height);

  return {
    x: Math.round(x),
    y: Math.round(y),
    width: Math.max(1, Math.round(width)),
    height: Math.max(1, Math.round(height)),
  };
};

export const calculateOutputDimensions = (
  crop: Pick<CropRectangle, 'width' | 'height'>,
  target: Pick<InstagramPreset, 'width' | 'height'>,
): { width: number; height: number } => {
  const cropRatio = crop.width / crop.height;
  const targetRatio = target.width / target.height;
  const alreadyLargeEnough = crop.width >= target.width && crop.height >= target.height;
  if (alreadyLargeEnough && Math.abs(cropRatio - targetRatio) < 0.001) {
    return { width: target.width, height: target.height };
  }

  const scale = Math.min(1, target.width / crop.width, target.height / crop.height);

  return {
    width: Math.max(1, Math.round(crop.width * scale)),
    height: Math.max(1, Math.round(crop.height * scale)),
  };
};

export const isImageAlreadyWithinPreset = (
  sourceWidth: number,
  sourceHeight: number,
  target: Pick<InstagramPreset, 'width' | 'height'>,
): boolean => {
  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = target.width / target.height;

  return (
    sourceWidth <= target.width &&
    sourceHeight <= target.height &&
    Math.abs(sourceRatio - targetRatio) < 0.001
  );
};

export const buildInstagramOutputName = (fileName: string, extension: string): string => {
  const baseName = fileName
    .replace(/\.[^.]+$/, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'imagem';

  return `${baseName}-instagram.${extension}`;
};
