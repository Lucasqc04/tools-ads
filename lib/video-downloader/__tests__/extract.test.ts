import { describe, expect, it } from 'vitest';
import { ExtractionError } from '../errors';
import { extractVideo, sanitizeFormats } from '../extract';
import { acquireExtractionSlot, resetRateLimitState, takeRequestSlot } from '../rate-limit';
import type { ProviderExtraction, VideoExtractor, VideoFormat } from '../types';

const format = (url: string): VideoFormat => ({
  id: url,
  kind: 'progressive',
  container: 'mp4',
  mimeType: 'video/mp4',
  hasVideo: true,
  hasAudio: null,
  url,
});

const makeExtractor = (extract: VideoExtractor['extract']): VideoExtractor => ({
  id: 'twitter',
  name: 'Fake',
  browserDownload: 'fetch',
  matchesHost: () => true,
  isAllowedMediaHost: (host) => host === 'video.twimg.com' || host === 'pbs.twimg.com',
  normalize: (url) => url,
  extract,
});

const good: ProviderExtraction = {
  sourceUrl: 'https://x.com/i/status/1',
  title: 't',
  thumbnail: 'https://pbs.twimg.com/a.jpg',
  formats: [format('https://video.twimg.com/a.mp4')],
  browserDownload: 'fetch',
  notes: [],
};

describe('extractVideo orchestration', () => {
  it('returns the documented success contract', async () => {
    const result = await extractVideo('https://x.com/a/status/1', {
      extractors: () => makeExtractor(async () => good),
    });

    expect(result).toMatchObject({ success: true, platform: 'twitter', title: 't', browserDownload: 'fetch' });
    expect(result.formats).toHaveLength(1);
  });

  it('drops media URLs on hosts the provider does not own, and http URLs', () => {
    const extractor = makeExtractor(async () => good);
    const kept = sanitizeFormats(
      [
        format('https://video.twimg.com/ok.mp4'),
        format('https://evil.example/steal.mp4'),
        format('http://video.twimg.com/plain.mp4'),
        format('https://user:pw@video.twimg.com/cred.mp4'),
        format('https://video.twimg.com.evil.example/x.mp4'),
        format('not a url'),
      ],
      extractor,
    );
    expect(kept.map((item) => item.url)).toEqual(['https://video.twimg.com/ok.mp4']);
  });

  it('fails with no_video_found when every format is filtered out', async () => {
    const extractor = makeExtractor(async () => ({ ...good, formats: [format('https://evil.example/a.mp4')] }));
    await expect(extractVideo('https://x.com/a/status/1', { extractors: () => extractor })).rejects.toMatchObject({
      code: 'no_video_found',
    });
  });

  it('removes a thumbnail that is not on an allowed host', async () => {
    const extractor = makeExtractor(async () => ({ ...good, thumbnail: 'https://evil.example/t.jpg' }));
    const result = await extractVideo('https://x.com/a/status/1', { extractors: () => extractor });
    expect(result.thumbnail).toBeUndefined();
  });

  it('propagates typed provider errors', async () => {
    const extractor = makeExtractor(async () => {
      throw new ExtractionError('media_unavailable');
    });
    await expect(extractVideo('https://x.com/a/status/1', { extractors: () => extractor })).rejects.toMatchObject({
      code: 'media_unavailable',
    });
  });

  it('rejects invalid input and unsupported platforms without calling a provider', async () => {
    await expect(extractVideo('nope')).rejects.toMatchObject({ code: 'invalid_url' });
    await expect(extractVideo('https://example.com/video')).rejects.toMatchObject({ code: 'unsupported_platform' });
    await expect(extractVideo('https://127.0.0.1/a')).rejects.toMatchObject({ code: 'invalid_url' });
    await expect(extractVideo('https://metadata.google.internal/a')).rejects.toMatchObject({
      code: 'unsupported_platform',
    });
  });

  it('passes an abort signal to the provider so slow platforms time out', async () => {
    let received: AbortSignal | undefined;
    const extractor = makeExtractor(async (_url, signal) => {
      received = signal;
      return good;
    });
    await extractVideo('https://x.com/a/status/1', { extractors: () => extractor });
    expect(received).toBeInstanceOf(AbortSignal);
  });
});

describe('per-instance limits', () => {
  it('allows a burst up to the window limit, then refuses, then recovers', () => {
    resetRateLimitState();
    const start = 1_000_000;
    const results = Array.from({ length: 14 }, () => takeRequestSlot('ip-a', start));
    expect(results.filter(Boolean)).toHaveLength(12);
    expect(takeRequestSlot('ip-b', start)).toBe(true);
    expect(takeRequestSlot('ip-a', start + 61_000)).toBe(true);
  });

  it('caps concurrent extractions and releases slots exactly once', () => {
    resetRateLimitState();
    const releases = Array.from({ length: 6 }, () => acquireExtractionSlot());
    expect(releases.every(Boolean)).toBe(true);
    expect(acquireExtractionSlot()).toBeNull();

    releases[0]?.();
    releases[0]?.();
    expect(acquireExtractionSlot()).not.toBeNull();
    expect(acquireExtractionSlot()).toBeNull();
  });
});
