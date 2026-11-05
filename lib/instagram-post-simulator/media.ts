import type { SlideKind, SourceMedia } from '@/types/instagram-post-simulator';

/** Todo o processamento deste módulo acontece no navegador. Nenhum arquivo é enviado a um servidor. */

export const MAX_IMAGE_BYTES = 40 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 512 * 1024 * 1024;
export const MAX_IMAGE_PIXELS = 40_000_000;
const THUMB_SIDE = 320;
const VIDEO_TIMEOUT_MS = 12_000;
const POSTER_TIME_SECONDS = 0.1;

export type MediaErrorCode = 'unsupported_format' | 'file_too_large' | 'decode_failed' | 'too_many_pixels';

export class MediaProcessingError extends Error {
  readonly code: MediaErrorCode;

  constructor(code: MediaErrorCode) {
    super(code);
    this.name = 'MediaProcessingError';
    this.code = code;
  }
}

const imageExtensions = /\.(jpe?g|png|webp|gif|avif|heic|heif)$/i;
const videoExtensions = /\.(mp4|m4v|mov|webm)$/i;

export const classifyFile = (file: File): SlideKind | null => {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  // Alguns navegadores deixam o tipo vazio para HEIC e MOV; a extensão resolve esses casos.
  if (imageExtensions.test(file.name)) return 'image';
  if (videoExtensions.test(file.name)) return 'video';
  return null;
};

export const createMediaId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};

const canvasToBlob = (canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new MediaProcessingError('decode_failed'))), type, quality);
  });

const scaleToSide = (width: number, height: number, maxSide: number) => {
  const scale = Math.min(1, maxSide / Math.max(width, height));
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
};

const makeThumbnail = async (source: CanvasImageSource, width: number, height: number): Promise<string> => {
  const size = scaleToSide(width, height, THUMB_SIDE);
  const canvas = document.createElement('canvas');
  canvas.width = size.width;
  canvas.height = size.height;
  const context = canvas.getContext('2d');
  if (!context) throw new MediaProcessingError('decode_failed');
  context.drawImage(source, 0, 0, size.width, size.height);
  const blob = await canvasToBlob(canvas, 'image/jpeg', 0.82);
  return URL.createObjectURL(blob);
};

const readImage = async (file: File, id: string, url: string): Promise<SourceMedia> => {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    throw new MediaProcessingError('decode_failed');
  }

  try {
    if (bitmap.width * bitmap.height > MAX_IMAGE_PIXELS) {
      throw new MediaProcessingError('too_many_pixels');
    }
    const thumbUrl = await makeThumbnail(bitmap, bitmap.width, bitmap.height);
    return {
      id,
      kind: 'image',
      file,
      url,
      width: bitmap.width,
      height: bitmap.height,
      thumbUrl,
    };
  } finally {
    bitmap.close();
  }
};

const waitForVideoEvent = (video: HTMLVideoElement, success: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => cleanup(() => reject(new MediaProcessingError('decode_failed'))), VIDEO_TIMEOUT_MS);
    const onSuccess = () => cleanup(resolve);
    const onError = () => cleanup(() => reject(new MediaProcessingError('decode_failed')));
    const cleanup = (done: () => void) => {
      window.clearTimeout(timer);
      video.removeEventListener(success, onSuccess);
      video.removeEventListener('error', onError);
      done();
    };
    video.addEventListener(success, onSuccess);
    video.addEventListener('error', onError);
  });

/** Carrega um vídeo em elemento temporário, aguarda o quadro pedido e o desenha em canvas. */
export const captureVideoFrame = async (
  url: string,
  timeSeconds: number,
  maxSide: number,
): Promise<{ blob: Blob; width: number; height: number }> => {
  const video = document.createElement('video');
  video.preload = 'auto';
  video.muted = true;
  video.playsInline = true;
  video.src = url;

  try {
    if (video.readyState < 1) {
      await waitForVideoEvent(video, 'loadedmetadata');
    }
    if (!video.videoWidth || !video.videoHeight) throw new MediaProcessingError('decode_failed');

    const target = Math.max(0, Math.min(timeSeconds, Math.max(0, (video.duration || 0) - 0.05)));
    if (target > 0.01) {
      const seeked = waitForVideoEvent(video, 'seeked');
      video.currentTime = target;
      await seeked;
    } else if (video.readyState < 2) {
      await waitForVideoEvent(video, 'loadeddata').catch(() => undefined);
    }

    const size = scaleToSide(video.videoWidth, video.videoHeight, maxSide);
    const canvas = document.createElement('canvas');
    canvas.width = size.width;
    canvas.height = size.height;
    const context = canvas.getContext('2d');
    if (!context) throw new MediaProcessingError('decode_failed');
    context.drawImage(video, 0, 0, size.width, size.height);
    const blob = await canvasToBlob(canvas, 'image/jpeg', 0.92);
    return { blob, width: size.width, height: size.height };
  } finally {
    video.removeAttribute('src');
    video.load();
  }
};

const readVideo = async (file: File, id: string, url: string): Promise<SourceMedia> => {
  const metadata = document.createElement('video');
  metadata.preload = 'metadata';
  metadata.muted = true;
  metadata.playsInline = true;
  metadata.src = url;

  let width = 0;
  let height = 0;
  let duration = 0;
  try {
    if (metadata.readyState < 1) {
      await waitForVideoEvent(metadata, 'loadedmetadata');
    }
    width = metadata.videoWidth;
    height = metadata.videoHeight;
    duration = metadata.duration;
  } finally {
    metadata.removeAttribute('src');
    metadata.load();
  }

  if (!width || !height) throw new MediaProcessingError('decode_failed');

  // O quadro inicial vira miniatura. Se falhar, o vídeo continua utilizável sem miniatura.
  let thumbUrl: string | undefined;
  try {
    const poster = await captureVideoFrame(url, Math.min(POSTER_TIME_SECONDS, duration || 0), THUMB_SIDE);
    thumbUrl = URL.createObjectURL(poster.blob);
  } catch {
    thumbUrl = undefined;
  }

  return { id, kind: 'video', file, url, width, height, duration, thumbUrl };
};

/**
 * Valida um arquivo, cria sua URL de exibição e lê dimensões e miniatura.
 * Em caso de erro, libera a URL criada e lança `MediaProcessingError`.
 */
export const ingestFile = async (file: File): Promise<SourceMedia> => {
  const kind = classifyFile(file);
  if (!kind) throw new MediaProcessingError('unsupported_format');

  const limit = kind === 'image' ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
  if (file.size > limit) throw new MediaProcessingError('file_too_large');

  const id = createMediaId();
  const url = URL.createObjectURL(file);
  try {
    return kind === 'image' ? await readImage(file, id, url) : await readVideo(file, id, url);
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }
};

/** Libera as URLs de exibição e da miniatura. Chame antes de remover uma mídia do estado. */
export const releaseSource = (source: Pick<SourceMedia, 'url' | 'thumbUrl'> | null | undefined): void => {
  if (!source) return;
  URL.revokeObjectURL(source.url);
  if (source.thumbUrl) URL.revokeObjectURL(source.thumbUrl);
};

export const getMediaErrorCode = (error: unknown): MediaErrorCode =>
  error instanceof MediaProcessingError ? error.code : 'decode_failed';

/** Extensão do arquivo original, usada para nomear o download do vídeo sem modificá-lo. */
export const getFileExtension = (file: File, fallback: string): string => {
  const match = /\.([a-z0-9]{2,5})$/i.exec(file.name);
  return match ? match[1].toLowerCase() : fallback;
};
