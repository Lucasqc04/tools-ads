export const imageFormatIds = [
  'png',
  'jpeg',
  'webp',
  'avif',
  'bmp',
  'tiff',
  'ico',
  'gif',
  'svg',
  'heic',
  'heif',
  'tga',
  'dds',
  'hdr',
  'exr',
  'psd',
  'raw',
  'cr2',
  'nef',
  'arw',
  'pdf',
] as const;

export type ImageFormatId = (typeof imageFormatIds)[number];

export type RasterImageFormatId = Exclude<ImageFormatId, 'pdf'>;
