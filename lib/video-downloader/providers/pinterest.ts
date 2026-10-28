import { ExtractionError } from '../errors';
import { PINTEREST_SHORT_HOST as SHORT_HOST, platformHostMatchers } from '../platforms';
import { safeFetchText } from '../safe-fetch';
import type { ProviderExtraction, VideoExtractor } from '../types';

const MAX_HTML_BYTES = 3 * 1024 * 1024;
const PIN_PATH = /^\/pin\/(?:[^/]*--)?(\d{6,25})(?:\/|$)/;

const hostOf = (hostname: string) => hostname.replace(/^www\./, '');

export const extractPinId = (url: URL): string | null => url.pathname.match(PIN_PATH)?.[1] ?? null;

const parseIsoDuration = (value: unknown): number | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const match = value.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/);
  if (!match) {
    return undefined;
  }
  const seconds = Number(match[1] ?? 0) * 3600 + Number(match[2] ?? 0) * 60 + Number(match[3] ?? 0);
  return seconds > 0 ? seconds : undefined;
};

type VideoObject = {
  name?: string;
  thumbnailUrl?: string;
  duration?: string;
  width?: string;
  height?: string;
  contentUrl?: string;
  creator?: { name?: string };
};

const readVideoObject = (html: string): VideoObject | null => {
  const match = html.match(
    /<script[^>]*id="video-snippet"[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>|<script[^>]*type="application\/ld\+json"[^>]*id="video-snippet"[^>]*>([\s\S]*?)<\/script>/,
  );
  const json = match?.[1] ?? match?.[2];
  if (!json) {
    return null;
  }

  try {
    return JSON.parse(json) as VideoObject;
  } catch {
    return null;
  }
};

export const parsePinVideo = (html: string): ProviderExtraction => {
  const video = readVideoObject(html);
  const contentUrl = video?.contentUrl;

  if (!video || !contentUrl || !/^https:\/\/v\d*\.pinimg\.com\//.test(contentUrl)) {
    throw new ExtractionError('no_video_found');
  }

  const quality = contentUrl.match(/\/(\d{3,4})p\//)?.[1];
  const width = Number.parseInt(video.width ?? '', 10) || undefined;
  const height = Number.parseInt(video.height ?? '', 10) || undefined;

  return {
    sourceUrl: '',
    title: video.name?.trim() || 'Pinterest video',
    author: video.creator?.name,
    thumbnail: video.thumbnailUrl,
    durationSeconds: parseIsoDuration(video.duration),
    formats: [
      {
        id: quality ? `mp4-${quality}p` : 'mp4',
        kind: 'progressive',
        quality: quality ? `${quality}p` : undefined,
        container: 'mp4',
        mimeType: 'video/mp4',
        width,
        height,
        hasVideo: true,
        hasAudio: null,
        url: contentUrl,
      },
    ],
    browserDownload: 'open',
    notes: ['no_cors_open_only'],
  };
};

export const pinterestExtractor: VideoExtractor = {
  id: 'pinterest',
  name: 'Pinterest',
  browserDownload: 'open',

  matchesHost: platformHostMatchers.pinterest,

  isAllowedMediaHost: (hostname) => /^(?:v\d*|i)\.pinimg\.com$/.test(hostname),

  async normalize(url) {
    const host = hostOf(url.hostname);

    if (host === SHORT_HOST) {
      // Short links redirect to the pin. Read only the Location header; the target is
      // re-validated below, so a redirect cannot steer us to a non-Pinterest host.
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);
      try {
        const hop = await safeFetchText(url, {
          signal: controller.signal,
          isAllowedHost: (hostname) => hostOf(hostname) === SHORT_HOST,
          maxBytes: 64 * 1024,
          redirect: 'manual',
        });
        const location = hop.headers.location;
        const target = location ? new URL(location, url) : null;
        const pinId = target && platformHostMatchers.pinterest(target.hostname) && hostOf(target.hostname) !== SHORT_HOST ? extractPinId(target) : null;
        if (!pinId) {
          throw new ExtractionError('invalid_url');
        }
        return new URL(`https://www.pinterest.com/pin/${pinId}/`);
      } finally {
        clearTimeout(timer);
      }
    }

    const pinId = extractPinId(url);
    if (!pinId) {
      throw new ExtractionError('invalid_url');
    }
    return new URL(`https://www.pinterest.com/pin/${pinId}/`);
  },

  async extract(normalized, signal) {
    const response = await safeFetchText(normalized, {
      signal,
      isAllowedHost: (hostname) => hostname === 'www.pinterest.com',
      maxBytes: MAX_HTML_BYTES,
      maxRedirects: 2,
      accept: 'text/html,application/xhtml+xml',
    });

    return { ...parsePinVideo(response.body), sourceUrl: normalized.toString() };
  },
};
