import { ExtractionError } from './errors';
import { detectPlatform } from './registry';
import type { ExtractionSuccess, VideoExtractor, VideoFormat } from './types';
import { parseUserUrl } from './validate-url';

export const EXTRACTION_TIMEOUT_MS = 8000;

const isHttpsOnHost = (value: string | undefined, extractor: VideoExtractor): value is string => {
  if (!value) {
    return false;
  }
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password && extractor.isAllowedMediaHost(url.hostname);
  } catch {
    return false;
  }
};

/**
 * Providers parse third-party data, so the orchestrator is the last line of defence:
 * only https URLs on the provider's own media hosts leave the server.
 */
export const sanitizeFormats = (formats: VideoFormat[], extractor: VideoExtractor): VideoFormat[] =>
  formats.filter((format) => isHttpsOnHost(format.url, extractor));

export const extractVideo = async (
  rawUrl: unknown,
  deps: { extractors?: (url: URL) => VideoExtractor } = {},
): Promise<ExtractionSuccess> => {
  const parsed = parseUserUrl(rawUrl);
  const extractor = (deps.extractors ?? detectPlatform)(parsed);
  const normalized = await extractor.normalize(parsed);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), EXTRACTION_TIMEOUT_MS);

  try {
    const result = await extractor.extract(normalized, controller.signal);
    const formats = sanitizeFormats(result.formats, extractor);

    if (!formats.length) {
      throw new ExtractionError('no_video_found');
    }

    return {
      success: true,
      platform: extractor.id,
      ...result,
      thumbnail: isHttpsOnHost(result.thumbnail, extractor) ? result.thumbnail : undefined,
      formats,
      browserDownload: extractor.browserDownload,
    };
  } finally {
    clearTimeout(timer);
  }
};
