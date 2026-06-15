export type ChromaPresetId = 'magenta' | 'green' | 'white' | 'auto' | 'manual';

export type ChromaOptionId = 'light' | 'balanced' | 'strong';

export type CropShape = 'none' | 'free' | 'square' | 'circle';

export type CropSettings = {
  shape: CropShape;
  sizePercent: number;
  widthPercent: number;
  heightPercent: number;
  xPercent: number;
  yPercent: number;
};

export type ChromaRgb = {
  r: number;
  g: number;
  b: number;
};

export type ChromaOptionConfig = {
  id: ChromaOptionId;
  threshold: number;
  softness: number;
};

export type ChromaRemovalStats = {
  pixelCount: number;
  transparentPixels: number;
  softPixels: number;
  opaquePixels: number;
  transparentRatio: number;
};

export type ChromaRemovalOptions = {
  chromaRgb: ChromaRgb;
  threshold: number;
  softness: number;
  despill: boolean;
};

export type LoadedImageData = {
  imageData: ImageData;
  width: number;
  height: number;
  scale: number;
};

export type RemovedChromaResult = {
  imageData: ImageData;
  stats: ChromaRemovalStats;
};

type CropRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export const DEFAULT_CHROMA_THRESHOLD = 80;
export const DEFAULT_CHROMA_SOFTNESS = 60;
export const PREVIEW_MAX_DIMENSION = 1200;
export const DEFAULT_CROP_SETTINGS: CropSettings = {
  shape: 'none',
  sizePercent: 82,
  widthPercent: 82,
  heightPercent: 82,
  xPercent: 50,
  yPercent: 50,
};

const SUPPORTED_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'webp', 'bmp']);

const OPTION_TUNING: Record<
  ChromaOptionId,
  { thresholdOffset: number; softnessOffset: number }
> = {
  light: {
    thresholdOffset: -15,
    softnessOffset: 15,
  },
  balanced: {
    thresholdOffset: 0,
    softnessOffset: 0,
  },
  strong: {
    thresholdOffset: 18,
    softnessOffset: -12,
  },
};

const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.min(maximum, Math.max(minimum, value));

const sanitizeBaseName = (rawName: string): string => {
  const normalized = rawName
    .replace(/\.[^.]+$/, '')
    .trim()
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .replaceAll(/[^a-zA-Z0-9-_]+/g, '-')
    .replaceAll(/-+/g, '-')
    .replaceAll(/^-+|-+$/g, '');

  return normalized || 'imagem';
};

const getFileExtension = (file: File): string =>
  file.name.split('.').pop()?.toLowerCase() ?? '';

const getCanvasContext = (
  canvas: HTMLCanvasElement,
): CanvasRenderingContext2D => {
  const context = canvas.getContext('2d', { willReadFrequently: true });

  if (!context) {
    throw new Error('Nao foi possivel iniciar o canvas para processar a imagem.');
  }

  return context;
};

export const isSupportedChromaImage = (file: File): boolean => {
  if (file.type && !file.type.startsWith('image/')) {
    return false;
  }

  return SUPPORTED_EXTENSIONS.has(getFileExtension(file));
};

export const parseHexColor = (hexColor: string): ChromaRgb => {
  const value = hexColor.trim().replace('#', '');

  if (!/^[0-9a-fA-F]{6}$/.test(value)) {
    throw new Error('Use uma cor no formato #RRGGBB.');
  }

  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
};

export const rgbToHex = ({ r, g, b }: ChromaRgb): string =>
  `#${[r, g, b]
    .map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`;

export const getCornerAverageColor = (
  imageData: ImageData,
  sampleSize = 20,
): ChromaRgb => {
  const { width, height, data } = imageData;
  const sample = Math.max(1, Math.min(sampleSize, Math.floor(width / 2), Math.floor(height / 2)));
  const corners = [
    { startX: 0, startY: 0 },
    { startX: width - sample, startY: 0 },
    { startX: 0, startY: height - sample },
    { startX: width - sample, startY: height - sample },
  ];

  let red = 0;
  let green = 0;
  let blue = 0;
  let count = 0;

  corners.forEach((corner) => {
    for (let y = 0; y < sample; y += 1) {
      for (let x = 0; x < sample; x += 1) {
        const index = ((corner.startY + y) * width + corner.startX + x) * 4;
        red += data[index] ?? 0;
        green += data[index + 1] ?? 0;
        blue += data[index + 2] ?? 0;
        count += 1;
      }
    }
  });

  return {
    r: Math.round(red / count),
    g: Math.round(green / count),
    b: Math.round(blue / count),
  };
};

export const getChromaColor = (
  preset: ChromaPresetId,
  manualHex: string,
  sourceImageData: ImageData,
): ChromaRgb => {
  if (preset === 'magenta') {
    return { r: 255, g: 0, b: 255 };
  }

  if (preset === 'green') {
    return { r: 0, g: 255, b: 0 };
  }

  if (preset === 'white') {
    return { r: 255, g: 255, b: 255 };
  }

  if (preset === 'auto') {
    return getCornerAverageColor(sourceImageData);
  }

  return parseHexColor(manualHex);
};

export const buildChromaOptionConfigs = (
  threshold: number,
  softness: number,
): ChromaOptionConfig[] =>
  (['light', 'balanced', 'strong'] as const).map((id) => {
    const tuning = OPTION_TUNING[id];

    return {
      id,
      threshold: clamp(threshold + tuning.thresholdOffset, 5, 150),
      softness: clamp(softness + tuning.softnessOffset, 1, 120),
    };
  });

export const resolveCropRect = (
  width: number,
  height: number,
  cropSettings: CropSettings,
): CropRect => {
  if (cropSettings.shape === 'none') {
    return {
      left: 0,
      top: 0,
      width,
      height,
    };
  }

  const cropWidth =
    cropSettings.shape === 'free'
      ? Math.max(1, Math.round(width * clamp(cropSettings.widthPercent, 5, 100) / 100))
      : Math.max(
          1,
          Math.round(Math.min(width, height) * clamp(cropSettings.sizePercent, 5, 100) / 100),
        );
  const cropHeight =
    cropSettings.shape === 'free'
      ? Math.max(1, Math.round(height * clamp(cropSettings.heightPercent, 5, 100) / 100))
      : cropWidth;
  const centerX = width * clamp(cropSettings.xPercent, 0, 100) / 100;
  const centerY = height * clamp(cropSettings.yPercent, 0, 100) / 100;
  const left = Math.round(clamp(centerX - cropWidth / 2, 0, width - cropWidth));
  const top = Math.round(clamp(centerY - cropHeight / 2, 0, height - cropHeight));

  return {
    left,
    top,
    width: cropWidth,
    height: cropHeight,
  };
};

export const applyCropToImageData = (
  sourceImageData: ImageData,
  cropSettings: CropSettings,
): ImageData => {
  if (cropSettings.shape === 'none') {
    return sourceImageData;
  }

  const rect = resolveCropRect(sourceImageData.width, sourceImageData.height, cropSettings);
  const output = new Uint8ClampedArray(rect.width * rect.height * 4);
  const source = sourceImageData.data;

  for (let y = 0; y < rect.height; y += 1) {
    for (let x = 0; x < rect.width; x += 1) {
      const sourceIndex = ((rect.top + y) * sourceImageData.width + rect.left + x) * 4;
      const outputIndex = (y * rect.width + x) * 4;

      output[outputIndex] = source[sourceIndex];
      output[outputIndex + 1] = source[sourceIndex + 1];
      output[outputIndex + 2] = source[sourceIndex + 2];
      output[outputIndex + 3] = source[sourceIndex + 3];

      if (cropSettings.shape === 'circle') {
        const radius = rect.width / 2;
        const distanceX = x + 0.5 - radius;
        const distanceY = y + 0.5 - radius;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        const edgeSoftness = 1.5;
        const alphaMultiplier = clamp((radius - distance) / edgeSoftness, 0, 1);

        output[outputIndex + 3] = Math.round(output[outputIndex + 3] * alphaMultiplier);
      }
    }
  }

  return new ImageData(output, rect.width, rect.height);
};

export const removeChromaFromImageData = (
  sourceImageData: ImageData,
  options: ChromaRemovalOptions,
): RemovedChromaResult => {
  const { width, height, data: sourceData } = sourceImageData;
  const output = new Uint8ClampedArray(sourceData);
  const chromaChannels = [options.chromaRgb.r, options.chromaRgb.g, options.chromaRgb.b];
  const chromaMainChannel = chromaChannels.indexOf(Math.max(...chromaChannels));
  const otherChannels = [0, 1, 2].filter((channel) => channel !== chromaMainChannel);
  const softness = Math.max(options.softness, 1);

  let transparentPixels = 0;
  let softPixels = 0;
  let opaquePixels = 0;

  for (let index = 0; index < output.length; index += 4) {
    const redDistance = output[index] - options.chromaRgb.r;
    const greenDistance = output[index + 1] - options.chromaRgb.g;
    const blueDistance = output[index + 2] - options.chromaRgb.b;
    const distance = Math.sqrt(
      redDistance * redDistance + greenDistance * greenDistance + blueDistance * blueDistance,
    );

    const originalAlpha = output[index + 3];
    const alphaRatio = clamp((distance - options.threshold) / softness, 0, 1);
    const alpha = Math.min(alphaRatio * 255, originalAlpha);

    if (options.despill && alpha > 0 && alpha < 255) {
      const firstOther = output[index + otherChannels[0]];
      const secondOther = output[index + otherChannels[1]];
      const averageOther = (firstOther + secondOther) / 2;
      const channelIndex = index + chromaMainChannel;

      output[channelIndex] = Math.min(output[channelIndex], averageOther * 1.15);
    }

    output[index + 3] = alpha;

    if (alpha <= 0) {
      transparentPixels += 1;
    } else if (alpha >= 255) {
      opaquePixels += 1;
    } else {
      softPixels += 1;
    }
  }

  const pixelCount = width * height;

  return {
    imageData: new ImageData(output, width, height),
    stats: {
      pixelCount,
      transparentPixels,
      softPixels,
      opaquePixels,
      transparentRatio: pixelCount > 0 ? transparentPixels / pixelCount : 0,
    },
  };
};

export const loadImageDataFromFile = async (
  file: File,
  maxDimension?: number,
): Promise<LoadedImageData> => {
  if (typeof document === 'undefined') {
    throw new Error('Esta ferramenta precisa rodar no navegador.');
  }

  if (!isSupportedChromaImage(file)) {
    throw new Error('Formato nao suportado. Use PNG, JPG, JPEG, WEBP ou BMP.');
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();

      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error('Nao foi possivel abrir a imagem.'));
      element.src = objectUrl;
    });

    const sourceWidth = image.naturalWidth || image.width;
    const sourceHeight = image.naturalHeight || image.height;
    const largestSide = Math.max(sourceWidth, sourceHeight);
    const scale =
      maxDimension && largestSide > maxDimension ? maxDimension / largestSide : 1;
    const width = Math.max(1, Math.round(sourceWidth * scale));
    const height = Math.max(1, Math.round(sourceHeight * scale));
    const canvas = document.createElement('canvas');

    canvas.width = width;
    canvas.height = height;

    const context = getCanvasContext(canvas);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(image, 0, 0, width, height);

    return {
      imageData: context.getImageData(0, 0, width, height),
      width,
      height,
      scale,
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

export const imageDataToPngBlob = (imageData: ImageData): Promise<Blob> => {
  if (typeof document === 'undefined') {
    return Promise.reject(new Error('Esta ferramenta precisa rodar no navegador.'));
  }

  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;

  const context = getCanvasContext(canvas);
  context.putImageData(imageData, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Nao foi possivel gerar o PNG transparente.'));
        return;
      }

      resolve(blob);
    }, 'image/png');
  });
};

export const buildRemovedBackgroundFileName = (
  originalName: string,
  optionId: ChromaOptionId,
): string => `${sanitizeBaseName(originalName)}-fundo-removido-${optionId}.png`;
