import {
  buildConvertedFileName,
  convertImageToImage,
  downloadBlob,
  fileToBase64DataUrl,
  getImageFormatExtension,
  isImageFormatAvailableForOutput,
  normalizeImageFormatToken,
} from '@/lib/image-conversion';
import type { RasterImageFormatId } from '@/types/image-conversion';

const dataUrlPattern = /^data:(image\/[^;]+);base64,(.+)$/i;

const mimeToExtension: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
  'image/bmp': 'bmp',
  'image/tiff': 'tiff',
  'image/x-icon': 'ico',
  'image/vnd.microsoft.icon': 'ico',
  'image/svg+xml': 'svg',
  'image/x-tga': 'tga',
};

const normalizeBase64Payload = (payload: string): string => {
  const noWhitespace = payload.replaceAll(/\s+/g, '');
  const urlSafeNormalized = noWhitespace.replaceAll('-', '+').replaceAll('_', '/');

  if (!urlSafeNormalized) {
    return '';
  }

  const paddingMissing = urlSafeNormalized.length % 4;

  if (paddingMissing === 0) {
    return urlSafeNormalized;
  }

  return urlSafeNormalized.padEnd(urlSafeNormalized.length + (4 - paddingMissing), '=');
};

const isValidBase64 = (payload: string): boolean => /^[A-Za-z0-9+/]*={0,2}$/.test(payload);

const base64ToBytes = (payload: string): Uint8Array => {
  const binary = atob(payload);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.codePointAt(index) ?? 0;
  }

  return bytes;
};

const resolveExtensionFromMime = (mimeType: string): string => {
  const normalizedMime = mimeType.toLowerCase();

  if (mimeToExtension[normalizedMime]) {
    return mimeToExtension[normalizedMime];
  }

  const token = normalizedMime.split('/')[1] ?? 'png';
  const normalizedToken = normalizeImageFormatToken(token);

  if (normalizedToken) {
    return getImageFormatExtension(normalizedToken);
  }

  return 'png';
};

export type ParsedBase64Image = {
  mimeType: string;
  extension: string;
  normalizedPayload: string;
  dataUrl: string;
  blob: Blob;
  file: File;
};

export const parseBase64ImageInput = (
  input: string,
  fallbackMimeType = 'image/png',
): ParsedBase64Image => {
  const raw = input.trim();

  if (!raw) {
    throw new Error('Cole um Base64 para gerar a imagem.');
  }

  const dataUrlMatch = dataUrlPattern.exec(raw);
  const mimeType = dataUrlMatch?.[1] ?? fallbackMimeType;
  const payloadCandidate = dataUrlMatch?.[2] ?? raw;
  const normalizedPayload = normalizeBase64Payload(payloadCandidate);

  if (!normalizedPayload || !isValidBase64(normalizedPayload)) {
    throw new Error('Base64 invalido. Revise o conteudo e tente novamente.');
  }

  let bytes: Uint8Array;

  try {
    bytes = base64ToBytes(normalizedPayload);
  } catch {
    throw new Error('Nao foi possivel decodificar esse Base64.');
  }

  if (bytes.length === 0) {
    throw new Error('O Base64 informado nao contem dados de imagem.');
  }

  const extension = resolveExtensionFromMime(mimeType);
  const blob = new Blob([bytes], { type: mimeType });
  const file = new File([blob], `base64-image.${extension}`, { type: mimeType });

  return {
    mimeType,
    extension,
    normalizedPayload,
    dataUrl: `data:${mimeType};base64,${normalizedPayload}`,
    blob,
    file,
  };
};

export const availableBase64ImageOutputFormats = (
  [
    'png',
    'jpeg',
    'webp',
    'avif',
    'gif',
    'bmp',
    'tiff',
    'ico',
    'svg',
    'tga',
  ] as const
).filter((format) => isImageFormatAvailableForOutput(format));

export type Base64ImageOutputFormat = (typeof availableBase64ImageOutputFormats)[number];

export const exportParsedBase64Image = async (
  parsed: ParsedBase64Image,
  format: Base64ImageOutputFormat | 'original',
): Promise<void> => {
  if (format === 'original') {
    downloadBlob(parsed.blob, `base64-image-original.${parsed.extension}`);
    return;
  }

  const convertedBlob = await convertImageToImage(parsed.file, format);
  const filename = buildConvertedFileName(parsed.file.name, format);
  downloadBlob(convertedBlob, filename);
};

export const imageFileToBase64DataUrl = async (file: File): Promise<string> =>
  fileToBase64DataUrl(file);

export const normalizeImageOutputFormat = (token: string): RasterImageFormatId | null =>
  (() => {
    const format = normalizeImageFormatToken(token);

    if (!format || format === 'pdf') {
      return null;
    }

    return format;
  })();
