import jsPDF from 'jspdf';
import type { ImageFormatId, RasterImageFormatId } from '@/types/image-conversion';

export type ConvertedPdfPageImage = {
  pageNumber: number;
  blob: Blob;
  width: number;
  height: number;
};

type PdfToImagesOptions = {
  outputFormat: RasterImageFormatId;
  quality?: number;
  scale?: number;
  maxPages?: number;
};

type PdfDocumentLike = {
  numPages: number;
  getPage: (pageNumber: number) => Promise<{
    getViewport: (options: { scale: number }) => { width: number; height: number };
    render: (options: {
      canvasContext: CanvasRenderingContext2D;
      viewport: { width: number; height: number };
    }) => { promise: Promise<void> };
    cleanup?: () => void;
  }>;
  cleanup?: () => void;
  destroy?: () => Promise<void> | void;
};

type PdfJsRuntime = {
  version?: string;
  GlobalWorkerOptions?: {
    workerSrc?: string;
    workerPort?: Worker | null;
  };
  getDocument: (params: {
    data: ArrayBuffer | Uint8Array;
    isEvalSupported?: boolean;
  }) => {
    promise: Promise<PdfDocumentLike>;
  };
};

const mimeTypeByFormat: Partial<Record<RasterImageFormatId, string>> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  avif: 'image/avif',
  gif: 'image/gif',
  tiff: 'image/tiff',
};

const extensionByFormat: Record<ImageFormatId, string> = {
  png: 'png',
  jpeg: 'jpg',
  webp: 'webp',
  avif: 'avif',
  bmp: 'bmp',
  tiff: 'tiff',
  ico: 'ico',
  gif: 'gif',
  svg: 'svg',
  heic: 'heic',
  heif: 'heif',
  tga: 'tga',
  dds: 'dds',
  hdr: 'hdr',
  exr: 'exr',
  psd: 'psd',
  raw: 'raw',
  cr2: 'cr2',
  nef: 'nef',
  arw: 'arw',
  pdf: 'pdf',
};

const aliasToFormat: Record<string, ImageFormatId> = {
  png: 'png',
  jpeg: 'jpeg',
  jpg: 'jpeg',
  jpe: 'jpeg',
  webp: 'webp',
  avif: 'avif',
  bmp: 'bmp',
  tiff: 'tiff',
  tif: 'tiff',
  ico: 'ico',
  icon: 'ico',
  gif: 'gif',
  svg: 'svg',
  heic: 'heic',
  heif: 'heif',
  tga: 'tga',
  dds: 'dds',
  hdr: 'hdr',
  exr: 'exr',
  psd: 'psd',
  raw: 'raw',
  cr2: 'cr2',
  nef: 'nef',
  arw: 'arw',
  pdf: 'pdf',
};

const qualityFormats = new Set<ImageFormatId>(['jpeg', 'webp', 'avif', 'heic', 'heif']);
const nativelyEncodedFormats = new Set<RasterImageFormatId>([
  'png',
  'jpeg',
  'webp',
  'avif',
  'gif',
  'tiff',
]);

const customEncodedFormats = new Set<RasterImageFormatId>(['bmp', 'ico', 'svg', 'tga']);

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const sanitizeBaseName = (rawName: string): string => {
  const withoutExtension = rawName.replace(/\.[^.]+$/, '');
  const normalized = withoutExtension
    .trim()
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .replaceAll(/[^a-zA-Z0-9-_]+/g, '-')
    .replaceAll(/-+/g, '-')
    .replaceAll(/^-+|-+$/g, '');

  return normalized || 'arquivo-convertido';
};

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('Falha ao ler arquivo.'));
    reader.readAsDataURL(file);
  });

const loadImageFromFile = async (file: File): Promise<HTMLImageElement> => {
  const tryLoadFromBlob = async (blob: Blob): Promise<HTMLImageElement> => {
    const url = URL.createObjectURL(blob);

    try {
      return await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Falha ao carregar imagem.'));
        img.src = url;
      });
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  try {
    return await tryLoadFromBlob(file);
  } catch (initialError) {
    // Se falhar de primeira, para HEIC/HEIF tenta fallback server-side.
    const lower = file.name.toLowerCase();
    const isHeic =
      file.type === 'image/heic' || file.type === 'image/heif' || lower.endsWith('.heic') || lower.endsWith('.heif');

    if (!isHeic) {
      throw initialError;
    }

    try {
      const form = new FormData();
      form.append('file', file as unknown as Blob);

      const resp = await fetch('/api/convert/heic', { method: 'POST', body: form });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || `Server returned ${resp.status}`);
      }

      const blob = await resp.blob();
      return await tryLoadFromBlob(blob);
    } catch (serverErr) {
      const msg = serverErr instanceof Error ? serverErr.message : String(serverErr);
      throw new Error(
        `Falha ao carregar imagem HEIC/HEIF. Conversao server-side falhou: ${msg}`,
      );
    }
  }
};

const canvasToBlob = (
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality?: number,
): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Falha ao gerar arquivo convertido.'));
          return;
        }

        resolve(blob);
      },
      mimeType,
      quality,
    );
  });

const blobToUint8Array = async (blob: Blob): Promise<Uint8Array> =>
  new Uint8Array(await blob.arrayBuffer());

const encodeBmpFromCanvas = (canvas: HTMLCanvasElement): Blob => {
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Falha ao gerar BMP a partir do canvas.');
  }

  const width = canvas.width;
  const height = canvas.height;
  const imageData = context.getImageData(0, 0, width, height).data;

  const rowStride = width * 3;
  const paddedRowStride = (rowStride + 3) & ~3;
  const pixelDataSize = paddedRowStride * height;
  const fileSize = 54 + pixelDataSize;

  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);

  view.setUint8(0, 0x42); // B
  view.setUint8(1, 0x4d); // M
  view.setUint32(2, fileSize, true);
  view.setUint32(10, 54, true);
  view.setUint32(14, 40, true); // DIB header size
  view.setInt32(18, width, true);
  view.setInt32(22, height, true); // bottom-up
  view.setUint16(26, 1, true); // planes
  view.setUint16(28, 24, true); // bits per pixel
  view.setUint32(34, pixelDataSize, true);

  let writeOffset = 54;
  for (let y = height - 1; y >= 0; y -= 1) {
    const rowOffset = y * width * 4;
    for (let x = 0; x < width; x += 1) {
      const pixelOffset = rowOffset + x * 4;
      view.setUint8(writeOffset, imageData[pixelOffset + 2]); // B
      view.setUint8(writeOffset + 1, imageData[pixelOffset + 1]); // G
      view.setUint8(writeOffset + 2, imageData[pixelOffset]); // R
      writeOffset += 3;
    }

    while ((writeOffset - 54) % paddedRowStride !== 0) {
      view.setUint8(writeOffset, 0);
      writeOffset += 1;
    }
  }

  return new Blob([buffer], { type: 'image/bmp' });
};

const encodeTgaFromCanvas = (canvas: HTMLCanvasElement): Blob => {
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Falha ao gerar TGA a partir do canvas.');
  }

  const width = canvas.width;
  const height = canvas.height;
  const imageData = context.getImageData(0, 0, width, height).data;
  const headerSize = 18;
  const pixelSize = width * height * 4;
  const buffer = new ArrayBuffer(headerSize + pixelSize);
  const view = new DataView(buffer);

  view.setUint8(2, 2); // image type = uncompressed true-color
  view.setUint16(12, width, true);
  view.setUint16(14, height, true);
  view.setUint8(16, 32); // 32 bits
  view.setUint8(17, 0x28); // 8 alpha bits + top-left origin

  let writeOffset = headerSize;
  for (let y = 0; y < height; y += 1) {
    const rowOffset = y * width * 4;
    for (let x = 0; x < width; x += 1) {
      const pixelOffset = rowOffset + x * 4;
      const r = imageData[pixelOffset];
      const g = imageData[pixelOffset + 1];
      const b = imageData[pixelOffset + 2];
      const a = imageData[pixelOffset + 3];
      view.setUint8(writeOffset, b);
      view.setUint8(writeOffset + 1, g);
      view.setUint8(writeOffset + 2, r);
      view.setUint8(writeOffset + 3, a);
      writeOffset += 4;
    }
  }

  return new Blob([buffer], { type: 'image/x-tga' });
};

const encodeSvgFromCanvas = async (canvas: HTMLCanvasElement): Promise<Blob> => {
  const pngDataUrl = canvas.toDataURL('image/png');
  const width = canvas.width;
  const height = canvas.height;
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<image href="${pngDataUrl}" width="${width}" height="${height}" />`,
    '</svg>',
  ].join('');

  return new Blob([svg], { type: 'image/svg+xml' });
};

const encodeIcoFromCanvas = async (canvas: HTMLCanvasElement): Promise<Blob> => {
  const pngBlob = await canvasToBlob(canvas, 'image/png');
  const pngBytes = await blobToUint8Array(pngBlob);
  const widthByte = canvas.width >= 256 ? 0 : canvas.width;
  const heightByte = canvas.height >= 256 ? 0 : canvas.height;
  const entryOffset = 6 + 16;
  const buffer = new ArrayBuffer(entryOffset + pngBytes.length);
  const view = new DataView(buffer);

  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // icon type
  view.setUint16(4, 1, true); // one image

  view.setUint8(6, widthByte);
  view.setUint8(7, heightByte);
  view.setUint8(8, 0); // color palette
  view.setUint8(9, 0); // reserved
  view.setUint16(10, 1, true); // planes
  view.setUint16(12, 32, true); // bpp
  view.setUint32(14, pngBytes.length, true); // image bytes
  view.setUint32(18, entryOffset, true); // image data offset

  new Uint8Array(buffer, entryOffset).set(pngBytes);

  return new Blob([buffer], { type: 'image/x-icon' });
};

const convertCanvasToNativeBlob = async (
  canvas: HTMLCanvasElement,
  outputFormat: RasterImageFormatId,
  quality: number,
): Promise<Blob> => {
  const mimeType = mimeTypeByFormat[outputFormat];

  if (!mimeType) {
    throw new Error(`Formato ${outputFormat.toUpperCase()} não suportado para saída nativa.`);
  }

  const qualityValue = formatSupportsQuality(outputFormat) ? clamp(quality, 0.1, 1) : undefined;
  const blob = await canvasToBlob(canvas, mimeType, qualityValue);

  if (blob.type === mimeType || (mimeType === 'image/jpeg' && blob.type === 'image/jpg')) {
    return blob;
  }

  if (blob.type === 'image/png' && mimeType !== 'image/png') {
    throw new Error(
      `Seu navegador não oferece codificação nativa para ${outputFormat.toUpperCase()} nesta versão.`,
    );
  }

  return blob;
};

const convertCanvasToFormatBlob = async (
  canvas: HTMLCanvasElement,
  outputFormat: RasterImageFormatId,
  quality: number,
): Promise<Blob> => {
  if (customEncodedFormats.has(outputFormat)) {
    if (outputFormat === 'bmp') {
      return encodeBmpFromCanvas(canvas);
    }

    if (outputFormat === 'tga') {
      return encodeTgaFromCanvas(canvas);
    }

    if (outputFormat === 'svg') {
      return encodeSvgFromCanvas(canvas);
    }

    if (outputFormat === 'ico') {
      return encodeIcoFromCanvas(canvas);
    }
  }

  if (nativelyEncodedFormats.has(outputFormat)) {
    return convertCanvasToNativeBlob(canvas, outputFormat, quality);
  }

  throw new Error(
    `Conversão para ${outputFormat.toUpperCase()} ainda não está disponível neste motor local.`,
  );
};

const drawImageToCanvas = (image: HTMLImageElement): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Falha ao iniciar o mecanismo de conversão da imagem.');
  }

  canvas.width = image.width;
  canvas.height = image.height;
  context.drawImage(image, 0, 0);

  return canvas;
};

let modernPdfJsRuntimePromise: Promise<PdfJsRuntime> | null = null;
let legacyPdfJsRuntimePromise: Promise<PdfJsRuntime> | null = null;

const ensurePromiseWithResolvers = () => {
  if (typeof (Promise as PromiseConstructor & { withResolvers?: unknown }).withResolvers === 'function') {
    return;
  }

  (
    Promise as PromiseConstructor & {
      withResolvers?: <T>() => {
        promise: Promise<T>;
        resolve: (value: T | PromiseLike<T>) => void;
        reject: (reason?: unknown) => void;
      };
    }
  ).withResolvers = <T>() => {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: unknown) => void;

    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });

    return { promise, resolve, reject };
  };
};

const configurePdfWorker = (runtime: PdfJsRuntime) => {
  if (typeof window === 'undefined') {
    return;
  }

  const workerOptions = runtime.GlobalWorkerOptions;

  if (!workerOptions) {
    return;
  }

  if (
    (typeof workerOptions.workerSrc === 'string' && workerOptions.workerSrc.length > 0) ||
    workerOptions.workerPort
  ) {
    return;
  }

  const version = runtime.version ?? '5.6.205';
  workerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
};

const resolvePdfJsRuntime = (
  runtimeModule: unknown,
  errorMessage: string,
): PdfJsRuntime => {
  const runtime = (
    runtimeModule as {
      default?: PdfJsRuntime;
    }
  ).default ?? (runtimeModule as PdfJsRuntime);

  if (!runtime || typeof runtime.getDocument !== 'function') {
    throw new Error(errorMessage);
  }

  configurePdfWorker(runtime);
  return runtime;
};

const getModernPdfJsRuntime = async (): Promise<PdfJsRuntime> => {
  if (!modernPdfJsRuntimePromise) {
    modernPdfJsRuntimePromise = (async () => {
      ensurePromiseWithResolvers();
      const runtimeModule = await import('pdfjs-dist/build/pdf.mjs');
      return resolvePdfJsRuntime(
        runtimeModule,
        'Não foi possível inicializar o mecanismo moderno de leitura de PDF.',
      );
    })();
  }

  return modernPdfJsRuntimePromise;
};

const getLegacyPdfJsRuntime = async (): Promise<PdfJsRuntime> => {
  if (!legacyPdfJsRuntimePromise) {
    legacyPdfJsRuntimePromise = (async () => {
      ensurePromiseWithResolvers();
      const runtimeModule = await import('pdfjs-dist/legacy/build/pdf.mjs');
      return resolvePdfJsRuntime(
        runtimeModule,
        'Não foi possível inicializar o mecanismo legado de leitura de PDF.',
      );
    })();
  }

  return legacyPdfJsRuntimePromise;
};

const getPdfJsRuntime = async (): Promise<PdfJsRuntime> => {
  try {
    return await getModernPdfJsRuntime();
  } catch {
    return getLegacyPdfJsRuntime();
  }
};

const loadPdfDocument = async (file: File): Promise<PdfDocumentLike> => {
  const fileBytes = await file.arrayBuffer();
  const buildDataBuffer = () => new Uint8Array(fileBytes.slice(0));
  const openWithRuntime = async (runtime: PdfJsRuntime) =>
    runtime.getDocument({
      data: buildDataBuffer(),
      isEvalSupported: false,
    }).promise;

  const primaryRuntime = await getPdfJsRuntime();

  try {
    return await openWithRuntime(primaryRuntime);
  } catch (primaryError) {
    try {
      const legacyRuntime = await getLegacyPdfJsRuntime();

      if (legacyRuntime !== primaryRuntime) {
        return await openWithRuntime(legacyRuntime);
      }
    } catch {
      // Ignore fallback error and keep the original error below.
    }

    throw primaryError;
  }
};

export const formatSupportsQuality = (format: ImageFormatId): boolean =>
  qualityFormats.has(format);

export const isImageFormatAvailableForOutput = (format: RasterImageFormatId): boolean =>
  nativelyEncodedFormats.has(format) || customEncodedFormats.has(format);

export const normalizeImageFormatToken = (token: string): ImageFormatId | null =>
  aliasToFormat[token.trim().toLowerCase()] ?? null;

export const getImageFormatExtension = (format: ImageFormatId): string =>
  extensionByFormat[format];

export const buildConvertedFileName = (
  sourceName: string,
  toFormat: ImageFormatId,
  options?: {
    pageNumber?: number;
  },
): string => {
  const baseName = sanitizeBaseName(sourceName);
  const pageSuffix =
    typeof options?.pageNumber === 'number' ? `-pagina-${options.pageNumber}` : '';
  return `${baseName}${pageSuffix}.${extensionByFormat[toFormat]}`;
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(url), 0);
};

export const convertImageToImage = async (
  file: File,
  outputFormat: RasterImageFormatId,
  quality = 0.92,
): Promise<Blob> => {
  const image = await loadImageFromFile(file);
  const canvas = drawImageToCanvas(image);
  return convertCanvasToFormatBlob(canvas, outputFormat, quality);
};

export const convertImageToPdf = async (file: File): Promise<Blob> => {
  const image = await loadImageFromFile(file);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Falha ao iniciar o mecanismo de conversão para PDF.');
  }

  canvas.width = image.width;
  canvas.height = image.height;
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0);

  const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.94);
  const orientation = image.width >= image.height ? 'landscape' : 'portrait';
  const pdf = new jsPDF({
    orientation,
    unit: 'px',
    format: [image.width, image.height],
  });

  pdf.addImage(jpegDataUrl, 'JPEG', 0, 0, image.width, image.height);
  return pdf.output('blob');
};

export const getPdfPageCount = async (file: File): Promise<number> => {
  const pdf = await loadPdfDocument(file);

  try {
    return pdf.numPages;
  } finally {
    pdf.cleanup?.();
    await pdf.destroy?.();
  }
};

export const convertPdfToImages = async (
  file: File,
  options: PdfToImagesOptions,
): Promise<{ totalPages: number; pages: ConvertedPdfPageImage[] }> => {
  const { outputFormat, quality = 0.92, scale = 1.8, maxPages = 5 } = options;
  const pdf = await loadPdfDocument(file);

  try {
    const safeMaxPages = clamp(maxPages, 1, 120);
    const safeScale = clamp(scale, 0.7, 3);
    const pagesToConvert = Math.min(pdf.numPages, safeMaxPages);
    const pages: ConvertedPdfPageImage[] = [];

    for (let pageNumber = 1; pageNumber <= pagesToConvert; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: safeScale });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Falha ao renderizar página do PDF.');
      }

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);

      await page.render({ canvasContext: context, viewport }).promise;
      page.cleanup?.();

      const blob = await convertCanvasToFormatBlob(canvas, outputFormat, quality);

      pages.push({
        pageNumber,
        blob,
        width: canvas.width,
        height: canvas.height,
      });
    }

    return {
      totalPages: pdf.numPages,
      pages,
    };
  } finally {
    pdf.cleanup?.();
    await pdf.destroy?.();
  }
};

export const fileToBase64DataUrl = fileToDataUrl;
