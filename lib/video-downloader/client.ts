import type { ExtractionErrorCode, ExtractionResponse, ExtractionSuccess, VideoFormat } from './types';

/** Browser-side helpers: analyse a link through the API, then fetch the media straight from its CDN. */

export class DownloadError extends Error {
  readonly kind: 'cancelled' | 'blocked' | 'http' | 'too_large' | 'empty';

  constructor(kind: DownloadError['kind'], message?: string) {
    super(message ?? kind);
    this.name = 'DownloadError';
    this.kind = kind;
  }
}

export class AnalyzeError extends Error {
  readonly code: ExtractionErrorCode | 'network';

  constructor(code: AnalyzeError['code']) {
    super(code);
    this.name = 'AnalyzeError';
    this.code = code;
  }
}

export const MAX_BROWSER_DOWNLOAD_BYTES = 1024 * 1024 * 1024;

export const analyzeVideoUrl = async (url: string, signal?: AbortSignal): Promise<ExtractionSuccess> => {
  let response: Response;

  try {
    response = await fetch('/api/video-extractor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
      signal,
    });
  } catch {
    if (signal?.aborted) {
      throw new AnalyzeError('timeout');
    }
    throw new AnalyzeError('network');
  }

  let payload: ExtractionResponse | null = null;
  try {
    payload = (await response.json()) as ExtractionResponse;
  } catch {
    payload = null;
  }

  if (payload?.success) {
    return payload;
  }

  throw new AnalyzeError(payload && !payload.success ? payload.error.code : 'upstream_error');
};

export type DownloadProgress = { receivedBytes: number; totalBytes: number | null };

/**
 * Streams a media file into memory with real progress. Rejects with DownloadError('blocked')
 * when the CDN refuses a cross-origin read (CORS) so the UI can explain the limitation
 * instead of retrying through our server.
 */
export const downloadMedia = async (
  format: Pick<VideoFormat, 'url' | 'mimeType'>,
  options: { signal?: AbortSignal; onProgress?: (progress: DownloadProgress) => void } = {},
): Promise<Blob> => {
  let response: Response;

  try {
    response = await fetch(format.url, {
      signal: options.signal,
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
    });
  } catch {
    if (options.signal?.aborted) {
      throw new DownloadError('cancelled');
    }
    throw new DownloadError('blocked');
  }

  if (!response.ok || !response.body) {
    throw new DownloadError('http');
  }

  const declared = Number(response.headers.get('content-length'));
  const totalBytes = Number.isFinite(declared) && declared > 0 ? declared : null;

  if (totalBytes !== null && totalBytes > MAX_BROWSER_DOWNLOAD_BYTES) {
    await response.body.cancel().catch(() => undefined);
    throw new DownloadError('too_large');
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let receivedBytes = 0;

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      receivedBytes += value.byteLength;
      if (receivedBytes > MAX_BROWSER_DOWNLOAD_BYTES) {
        throw new DownloadError('too_large');
      }

      chunks.push(value);
      options.onProgress?.({ receivedBytes, totalBytes });
    }
  } catch (error) {
    await reader.cancel().catch(() => undefined);
    if (error instanceof DownloadError) {
      throw error;
    }
    throw new DownloadError(options.signal?.aborted ? 'cancelled' : 'blocked');
  } finally {
    reader.releaseLock?.();
  }

  if (receivedBytes === 0) {
    throw new DownloadError('empty');
  }

  return new Blob(chunks as BlobPart[], { type: format.mimeType });
};

const slugify = (value: string, maxLength: number): string =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLength)
    .replace(/-+$/g, '');

export const buildDownloadFileName = (
  parts: { platform: string; title: string; quality?: string },
  extension: 'mp4' | 'mp3' | 'm4a',
): string => {
  const base = [parts.platform, slugify(parts.title, 40) || 'video', parts.quality ? slugify(parts.quality, 10) : '']
    .filter(Boolean)
    .join('-');
  return `${base}.${extension}`;
};

/** Rough size from bitrate x duration. Always shown as an estimate, never as the real file size. */
export const estimateSizeBytes = (format: VideoFormat, durationSeconds?: number): number | null => {
  if (!format.bitrateKbps || !durationSeconds) {
    return null;
  }
  return Math.round(((format.bitrateKbps * 1000) / 8) * durationSeconds);
};

export const formatDuration = (totalSeconds: number): string => {
  const rounded = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const seconds = rounded % 60;
  const pad = (value: number) => String(value).padStart(2, '0');
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;
};

export const downloadableFormats = (result: ExtractionSuccess): VideoFormat[] =>
  result.formats.filter((format) => format.kind === 'progressive');
