import { ExtractionError } from '../errors';
import { platformHostMatchers } from '../platforms';
import { safeFetchText } from '../safe-fetch';
import type { ProviderExtraction, VideoExtractor, VideoFormat } from '../types';

const SYNDICATION_HOST = 'cdn.syndication.twimg.com';
const MAX_JSON_BYTES = 512 * 1024;

const STATUS_PATH = /^\/(?:(?:[A-Za-z0-9_]{1,15})|i(?:\/web)?)\/status(?:es)?\/(\d{1,20})(?:\/|$)/;

type SyndicationVariant = {
  content_type?: string;
  bitrate?: number;
  url?: string;
};

type SyndicationMedia = {
  type?: string;
  media_url_https?: string;
  video_info?: {
    duration_millis?: number;
    variants?: SyndicationVariant[];
  };
};

type SyndicationTweet = {
  __typename?: string;
  text?: string;
  user?: { name?: string; screen_name?: string };
  mediaDetails?: SyndicationMedia[];
};

export const extractTweetId = (url: URL): string | null => {
  const match = url.pathname.match(STATUS_PATH);
  return match ? match[1] : null;
};

/**
 * Token the syndication endpoint expects. Mirrors the embed widget's own derivation
 * from the tweet id; it is not a secret or an auth credential.
 */
export const syndicationToken = (tweetId: string): string =>
  ((Number(tweetId) / 1e15) * Math.PI).toString(36).replace(/(0+|\.)/g, '');

const cleanTweetText = (text: string | undefined): string => {
  const withoutTrailingLinks = (text ?? '').replace(/(?:\s*https?:\/\/t\.co\/\w+)+\s*$/i, '');
  const collapsed = withoutTrailingLinks.replace(/\s+/g, ' ').trim();
  return collapsed.length > 140 ? `${collapsed.slice(0, 137)}...` : collapsed;
};

const toVideoFormats = (variants: SyndicationVariant[], isGif: boolean): VideoFormat[] => {
  const formats: VideoFormat[] = [];

  variants.forEach((variant) => {
    if (!variant.url) {
      return;
    }

    if (variant.content_type === 'video/mp4') {
      const size = variant.url.match(/\/(\d{2,5})x(\d{2,5})\//);
      const width = size ? Number(size[1]) : undefined;
      const height = size ? Number(size[2]) : undefined;
      const quality = height ? `${Math.min(width ?? height, height)}p` : undefined;

      formats.push({
        id: `mp4-${height ?? variant.bitrate ?? formats.length}`,
        kind: 'progressive',
        quality,
        container: 'mp4',
        mimeType: 'video/mp4',
        width,
        height,
        bitrateKbps: variant.bitrate ? Math.round(variant.bitrate / 1000) : undefined,
        hasVideo: true,
        hasAudio: isGif ? false : null,
        url: variant.url,
      });
      return;
    }

    if (variant.content_type === 'application/x-mpegURL') {
      formats.push({
        id: 'hls',
        kind: 'hls',
        container: 'm3u8',
        mimeType: 'application/x-mpegURL',
        hasVideo: true,
        hasAudio: null,
        url: variant.url,
      });
    }
  });

  return formats.sort((a, b) => (b.height ?? 0) - (a.height ?? 0));
};

export const parseTweetMedia = (tweet: SyndicationTweet): ProviderExtraction => {
  if (tweet.__typename === 'TweetTombstone') {
    throw new ExtractionError('media_unavailable');
  }

  const videos = (tweet.mediaDetails ?? []).filter(
    (media) =>
      (media.type === 'video' || media.type === 'animated_gif') &&
      (media.video_info?.variants?.length ?? 0) > 0,
  );

  if (!videos.length) {
    throw new ExtractionError('no_video_found');
  }

  const media = videos[0];
  const isGif = media.type === 'animated_gif';
  const formats = toVideoFormats(media.video_info?.variants ?? [], isGif);

  if (!formats.length) {
    throw new ExtractionError('no_video_found');
  }

  const screenName = tweet.user?.screen_name;
  const durationMillis = media.video_info?.duration_millis;

  return {
    sourceUrl: '',
    title: cleanTweetText(tweet.text) || (screenName ? `@${screenName}` : 'X video'),
    author: tweet.user?.name || (screenName ? `@${screenName}` : undefined),
    thumbnail: media.media_url_https,
    durationSeconds: durationMillis ? Math.round(durationMillis / 100) / 10 : undefined,
    formats,
    browserDownload: 'fetch',
    notes: [
      ...(videos.length > 1 ? (['multiple_media_only_first'] as const) : []),
      ...(isGif ? (['gif_without_audio'] as const) : []),
    ],
  };
};

export const twitterExtractor: VideoExtractor = {
  id: 'twitter',
  name: 'X (Twitter)',
  browserDownload: 'fetch',

  matchesHost: platformHostMatchers.twitter,

  isAllowedMediaHost: (hostname) =>
    hostname === 'video.twimg.com' || hostname === 'pbs.twimg.com',

  normalize: (url) => {
    const tweetId = extractTweetId(url);
    if (!tweetId) {
      throw new ExtractionError('invalid_url');
    }
    return new URL(`https://x.com/i/status/${tweetId}`);
  },

  async extract(normalized, signal) {
    const tweetId = extractTweetId(normalized);
    if (!tweetId) {
      throw new ExtractionError('invalid_url');
    }

    const endpoint = new URL(`https://${SYNDICATION_HOST}/tweet-result`);
    endpoint.searchParams.set('id', tweetId);
    endpoint.searchParams.set('token', syndicationToken(tweetId));

    const response = await safeFetchText(endpoint, {
      signal,
      isAllowedHost: (hostname) => hostname === SYNDICATION_HOST,
      maxBytes: MAX_JSON_BYTES,
      maxRedirects: 0,
      accept: 'application/json',
    });

    let tweet: SyndicationTweet;
    try {
      tweet = JSON.parse(response.body) as SyndicationTweet;
    } catch {
      // The endpoint answers with an HTML page when it refuses a tweet (deleted, age-restricted, protected).
      throw new ExtractionError('media_unavailable');
    }

    return { ...parseTweetMedia(tweet), sourceUrl: normalized.toString() };
  },
};
