import { describe, expect, it } from 'vitest';
import { extractVideo } from '../extract';

/**
 * Hits real platforms, so it never runs in the default suite.
 *   LIVE_VIDEO_TESTS=1 npx vitest run lib/video-downloader/__tests__/live-extraction.test.ts
 * Each case also checks that the media bytes are reachable with a browser-style
 * request (Origin header) and reports whether CORS lets a page read them.
 */
const live = process.env.LIVE_VIDEO_TESTS ? describe : describe.skip;

const probeMedia = async (url: string) => {
  const response = await fetch(url, {
    headers: { Origin: 'https://tools.lucasqc.com', Range: 'bytes=0-1023' },
  });
  return {
    status: response.status,
    contentType: response.headers.get('content-type'),
    allowOrigin: response.headers.get('access-control-allow-origin'),
  };
};

live('live extraction', () => {
  it('X: public video post returns playable MP4s readable by the browser (CORS)', async () => {
    const result = await extractVideo('https://x.com/NASA/status/2042756933686337713');
    const mp4s = result.formats.filter((format) => format.kind === 'progressive');

    expect(mp4s.length).toBeGreaterThanOrEqual(3);
    const best = mp4s[0];
    const probe = await probeMedia(best.url);
    console.log('X', { title: result.title, durationSeconds: result.durationSeconds, qualities: mp4s.map((f) => f.quality), probe });

    expect([200, 206]).toContain(probe.status);
    expect(probe.contentType).toContain('video/mp4');
    expect(probe.allowOrigin).toBe('https://tools.lucasqc.com');
  }, 30000);

  it('X: legacy twitter.com link with /video/1 suffix works', async () => {
    const result = await extractVideo('https://twitter.com/NASA/status/1491475671058681863/video/1');
    expect(result.formats.some((format) => format.kind === 'progressive')).toBe(true);
  }, 30000);

  it('X: post without video reports no_video_found', async () => {
    await expect(extractVideo('https://x.com/elonmusk/status/1349129669258448897')).rejects.toMatchObject({
      code: 'no_video_found',
    });
  }, 30000);

  it('X: nonexistent post reports an unavailable/blocked state, not a crash', async () => {
    await expect(extractVideo('https://x.com/i/status/1')).rejects.toMatchObject({
      code: expect.stringMatching(/media_unavailable|no_video_found|upstream_error/),
    });
  }, 30000);

  it('Pinterest: public video pin returns an MP4 (CORS reported honestly)', async () => {
    const result = await extractVideo('https://www.pinterest.com/pin/487022147205683522/');
    const probe = await probeMedia(result.formats[0].url);
    console.log('Pinterest', { title: result.title, durationSeconds: result.durationSeconds, quality: result.formats[0].quality, probe });

    expect(result.browserDownload).toBe('open');
    expect([200, 206]).toContain(probe.status);
    expect(probe.allowOrigin).toBeNull();
  }, 30000);

  it('Pinterest: image pin reports no_video_found', async () => {
    await expect(extractVideo('https://www.pinterest.com/pin/487022284612061468/')).rejects.toMatchObject({
      code: 'no_video_found',
    });
  }, 30000);
});
