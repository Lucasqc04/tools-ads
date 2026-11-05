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

type JsonLdRecord = { id?: string; value: unknown };
type ImageObject = {
  name?: string;
  caption?: string;
  contentUrl?: string;
  url?: string | { url?: string };
  image?: string | { url?: string };
  thumbnailUrl?: string;
  width?: string | number;
  height?: string | number;
  creator?: { name?: string };
};

const readAttribute = (tag: string, name: string): string | undefined => {
  const match = tag.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  const value = match?.[1] ?? match?.[2] ?? match?.[3];
  return value?.replace(/&amp;/gi, '&').replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'");
};

const flattenJsonLd = (value: unknown): unknown[] => {
  if (Array.isArray(value)) {
    return value.flatMap(flattenJsonLd);
  }
  if (value && typeof value === 'object' && '@graph' in value) {
    return flattenJsonLd((value as { '@graph'?: unknown })['@graph']);
  }
  return [value];
};

const readJsonLd = (html: string): JsonLdRecord[] => {
  const records: JsonLdRecord[] = [];
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attributes = match[1] ?? '';
    const id = readAttribute(attributes, 'id');
    const type = readAttribute(attributes, 'type')?.toLowerCase();
    if (type !== 'application/ld+json' && id !== 'video-snippet' && id !== 'pin-json-schema') {
      continue;
    }
    try {
      const value = JSON.parse(match[2]?.trim() ?? '') as unknown;
      records.push(...flattenJsonLd(value).map((item) => ({ id, value: item })));
    } catch {
      // Pinterest pages can include unrelated or malformed JSON-LD snippets.
    }
  }
  return records;
};

const asObject = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null;

const readVideoObject = (records: JsonLdRecord[]): VideoObject | null => {
  const record = records.find(({ id, value }) => {
    const object = asObject(value);
    const type = object?.['@type'];
    return (id === 'video-snippet' || type === 'VideoObject' || (Array.isArray(type) && type.includes('VideoObject'))) &&
      typeof object?.contentUrl === 'string';
  });
  return (record && asObject(record.value) as VideoObject | null) ?? null;
};

const isAllowedVideoUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && /^(?:v\d*)\.pinimg\.com$/.test(url.hostname) && /\.mp4$/i.test(url.pathname);
  } catch {
    return false;
  }
};

const imageCandidateFrom = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value;
  const object = asObject(value);
  return typeof object?.url === 'string' ? object.url : undefined;
};

const readImageObject = (records: JsonLdRecord[]): ImageObject | null => {
  const record = records.find(({ id, value }) => {
    const object = asObject(value);
    const type = object?.['@type'];
    return (id === 'pin-json-schema' || type === 'ImageObject' || (Array.isArray(type) && type.includes('ImageObject'))) &&
      Boolean(object?.contentUrl || object?.url || object?.image);
  });
  return (record && asObject(record.value) as ImageObject | null) ?? null;
};

const readMetaValue = (html: string, property: string): string | undefined => {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = match[0];
    if (readAttribute(tag, 'property')?.toLowerCase() === property || readAttribute(tag, 'name')?.toLowerCase() === property) {
      return readAttribute(tag, 'content');
    }
  }
  return undefined;
};

const readPreloadedPinImage = (html: string): string | undefined => {
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    if (readAttribute(match[0], 'id') === 'pin-image-preload') {
      return readAttribute(match[0], 'href');
    }
  }
  return undefined;
};

const parseImage = (html: string, records: JsonLdRecord[]): ProviderExtraction | null => {
  const image = readImageObject(records);
  const imageUrl =
    imageCandidateFrom(image?.contentUrl) ??
    imageCandidateFrom(image?.url) ??
    imageCandidateFrom(image?.image) ??
    image?.thumbnailUrl ??
    readPreloadedPinImage(html) ??
    readMetaValue(html, 'og:image');
  if (!imageUrl) return null;

  let url: URL;
  try {
    url = new URL(imageUrl);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' || url.hostname !== 'i.pinimg.com') return null;

  const extension = url.pathname.match(/\.(jpe?g|png|webp)$/i)?.[1]?.toLowerCase();
  if (!extension) return null;
  const mimeType = extension === 'jpg' || extension === 'jpeg' ? 'image/jpeg' : `image/${extension}`;
  const container = extension as 'jpg' | 'jpeg' | 'png' | 'webp';
  const width = Number.parseInt(String(image?.width ?? ''), 10) || undefined;
  const height = Number.parseInt(String(image?.height ?? ''), 10) || undefined;
  const title = (image?.name ?? image?.caption ?? readMetaValue(html, 'og:title'))?.trim().slice(0, 240);

  return {
    mediaType: 'image',
    sourceUrl: '',
    title: title || 'Pinterest image',
    author: image?.creator?.name,
    thumbnail: url.toString(),
    formats: [
      {
        id: `image-${container}`,
        kind: 'progressive',
        quality: width && height ? `${width}×${height}` : undefined,
        container,
        mimeType,
        width,
        height,
        hasVideo: false,
        hasAudio: false,
        url: url.toString(),
      },
    ],
    browserDownload: 'open',
    notes: ['no_cors_open_only'],
  };
};

export const parsePinMedia = (html: string): ProviderExtraction => {
  const records = readJsonLd(html);
  const video = readVideoObject(records);
  const contentUrl = video?.contentUrl;

  if (video && contentUrl && isAllowedVideoUrl(contentUrl)) {
    const quality = contentUrl.match(/\/(\d{3,4})p\//)?.[1];
    const width = Number.parseInt(video.width ?? '', 10) || undefined;
    const height = Number.parseInt(video.height ?? '', 10) || undefined;

    return {
      mediaType: 'video',
      sourceUrl: '',
      title: video.name?.trim().slice(0, 240) || 'Pinterest video',
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
  }

  const image = parseImage(html, records);
  if (image) return image;
  throw new ExtractionError('no_media_found');
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

    return { ...parsePinMedia(response.body), sourceUrl: normalized.toString() };
  },
};
