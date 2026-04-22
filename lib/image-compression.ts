import imageCompression, { type Options as BrowserImageCompressionOptions } from 'browser-image-compression';

export type ImageCompressionOutputFormat = 'same' | 'jpeg' | 'webp';

export type ImageCompressionOptions = {
  compressionLevel: number;
  outputFormat?: ImageCompressionOutputFormat;
};

export type ImageCompressionPreview = {
  estimatedBytes: number;
  quality: number;
};

const MIN_IMAGE_BYTES = 8 * 1024;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const toBaseName = (fileName: string): string => {
  const sanitized = fileName
    .replace(/\.[^.]+$/, '')
    .trim()
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .replaceAll(/[^a-zA-Z0-9-_]+/g, '-')
    .replaceAll(/-+/g, '-')
    .replaceAll(/^-+|-+$/g, '');

  return sanitized || 'imagem';
};

const getNormalizedLevel = (compressionLevel: number): number =>
  clamp(compressionLevel / 100, 0, 1);

const getTargetMimeType = (
  file: File,
  outputFormat: ImageCompressionOutputFormat,
): string | undefined => {
  if (outputFormat === 'jpeg') {
    return 'image/jpeg';
  }

  if (outputFormat === 'webp') {
    return 'image/webp';
  }

  if (file.type.startsWith('image/')) {
    return file.type;
  }

  return undefined;
};

const getOutputExtension = (mimeType: string | undefined, fileName: string): string => {
  if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
    return 'jpg';
  }

  if (mimeType === 'image/webp') {
    return 'webp';
  }

  if (mimeType === 'image/png') {
    return 'png';
  }

  if (mimeType === 'image/avif') {
    return 'avif';
  }

  const fallback = fileName.split('.').pop()?.toLowerCase();
  return fallback || 'jpg';
};

const getQualityForLevel = (compressionLevel: number): number => {
  const normalizedLevel = getNormalizedLevel(compressionLevel);
  return clamp(0.94 - normalizedLevel * 0.7, 0.2, 0.94);
};

const getRatioForLevel = (
  compressionLevel: number,
  outputFormat: ImageCompressionOutputFormat,
): number => {
  const normalizedLevel = getNormalizedLevel(compressionLevel);
  const baseRatio = 0.96 - normalizedLevel * 0.78;

  if (outputFormat === 'webp') {
    return clamp(baseRatio * 0.88, 0.08, 0.98);
  }

  if (outputFormat === 'jpeg') {
    return clamp(baseRatio * 0.94, 0.09, 0.98);
  }

  return clamp(baseRatio, 0.1, 0.99);
};

const readImageDimensions = async (
  file: File,
): Promise<{ width: number; height: number } | undefined> => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    return await new Promise<{ width: number; height: number }>((resolve, reject) => {
      const image = new Image();

      image.onload = () => {
        resolve({ width: image.naturalWidth, height: image.naturalHeight });
      };

      image.onerror = () => reject(new Error('Falha ao ler dimensoes da imagem.'));
      image.src = objectUrl;
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

const buildMaxDimension = (
  width: number,
  height: number,
  compressionLevel: number,
): number | undefined => {
  const normalizedLevel = getNormalizedLevel(compressionLevel);
  const largestSide = Math.max(width, height);

  if (!largestSide || largestSide <= 0) {
    return undefined;
  }

  const scaleFactor = 1 - normalizedLevel * 0.42;

  if (scaleFactor >= 0.99) {
    return undefined;
  }

  return Math.max(640, Math.round(largestSide * scaleFactor));
};

export const estimateCompressedImageSize = (
  originalSize: number,
  compressionLevel: number,
  outputFormat: ImageCompressionOutputFormat = 'same',
): number => {
  const ratio = getRatioForLevel(compressionLevel, outputFormat);
  const estimated = Math.round(originalSize * ratio);

  return Math.max(MIN_IMAGE_BYTES, estimated);
};

export const getImageCompressionPreview = (
  originalSize: number,
  compressionLevel: number,
  outputFormat: ImageCompressionOutputFormat = 'same',
): ImageCompressionPreview => ({
  estimatedBytes: estimateCompressedImageSize(originalSize, compressionLevel, outputFormat),
  quality: getQualityForLevel(compressionLevel),
});

export const buildCompressedImageFileName = (
  originalName: string,
  extension: string,
): string => `${toBaseName(originalName)}-compressed.${extension}`;

export const compressImageFile = async (
  file: File,
  options: ImageCompressionOptions,
): Promise<File> => {
  const outputFormat = options.outputFormat ?? 'same';
  const quality = getQualityForLevel(options.compressionLevel);
  const estimatedBytes = estimateCompressedImageSize(file.size, options.compressionLevel, outputFormat);
  const maxSizeMB = clamp(estimatedBytes / 1024 / 1024, 0.02, 64);
  const targetMimeType = getTargetMimeType(file, outputFormat);
  const dimensions = await readImageDimensions(file);
  const maxDimension = dimensions
    ? buildMaxDimension(dimensions.width, dimensions.height, options.compressionLevel)
    : undefined;

  const compressionOptions: BrowserImageCompressionOptions = {
    maxSizeMB,
    initialQuality: quality,
    maxIteration: 12,
    useWebWorker: true,
    ...(maxDimension ? { maxWidthOrHeight: maxDimension } : {}),
    ...(targetMimeType ? { fileType: targetMimeType } : {}),
  };

  const compressedBlob = await imageCompression(file, compressionOptions);
  const extension = getOutputExtension(compressedBlob.type || targetMimeType, file.name);

  return new File([compressedBlob], buildCompressedImageFileName(file.name, extension), {
    type: compressedBlob.type || targetMimeType || file.type,
    lastModified: Date.now(),
  });
};
