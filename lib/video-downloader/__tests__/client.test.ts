import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  AnalyzeError,
  analyzeVideoUrl,
  buildDownloadFileName,
  downloadMedia,
  downloadableFormats,
  estimateSizeBytes,
  formatDuration,
  MAX_BROWSER_DOWNLOAD_BYTES,
} from '../client';
import { guessPlatformFromText } from '../platforms';
import type { ExtractionSuccess, VideoFormat } from '../types';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const streamOf = (chunks: Uint8Array[], onCancel?: () => void) => {
  let index = 0;
  return new ReadableStream<Uint8Array>({
    pull(controller) {
      if (index < chunks.length) {
        controller.enqueue(chunks[index++]);
      } else {
        controller.close();
      }
    },
    cancel() {
      onCancel?.();
    },
  });
};

const stubFetch = (response: Response | Promise<Response> | (() => Promise<Response>)) =>
  vi.stubGlobal('fetch', vi.fn(typeof response === 'function' ? response : () => Promise.resolve(response)));

const format = { url: 'https://video.twimg.com/a.mp4', mimeType: 'video/mp4' };

describe('downloadMedia', () => {
  it('reports real progress and returns a Blob of the exact size', async () => {
    const chunks = [new Uint8Array(400), new Uint8Array(600)];
    stubFetch(new Response(streamOf(chunks), { headers: { 'content-length': '1000' } }));
    const progress: Array<[number, number | null]> = [];

    const blob = await downloadMedia(format, {
      onProgress: (value) => progress.push([value.receivedBytes, value.totalBytes]),
    });

    expect(blob.size).toBe(1000);
    expect(blob.type).toBe('video/mp4');
    expect(progress).toEqual([
      [400, 1000],
      [1000, 1000],
    ]);
  });

  it('requests the CDN without credentials or referrer', async () => {
    stubFetch(new Response(streamOf([new Uint8Array(1)])));
    await downloadMedia(format);
    expect(fetch).toHaveBeenCalledWith(format.url, expect.objectContaining({ credentials: 'omit', referrerPolicy: 'no-referrer' }));
  });

  it('reports a CORS/network refusal as "blocked" and never falls back to our server', async () => {
    stubFetch(() => Promise.reject(new TypeError('Failed to fetch')));
    await expect(downloadMedia(format)).rejects.toMatchObject({ kind: 'blocked' });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(vi.mocked(fetch).mock.calls[0][0]).toBe(format.url);
  });

  it('maps HTTP errors and empty bodies', async () => {
    stubFetch(new Response('nope', { status: 403 }));
    await expect(downloadMedia(format)).rejects.toMatchObject({ kind: 'http' });

    stubFetch(new Response(streamOf([])));
    await expect(downloadMedia(format)).rejects.toMatchObject({ kind: 'empty' });
  });

  it('refuses files above the in-memory limit using Content-Length, without reading the body', async () => {
    let cancelled = false;
    stubFetch(
      new Response(streamOf([new Uint8Array(1)], () => (cancelled = true)), {
        headers: { 'content-length': String(MAX_BROWSER_DOWNLOAD_BYTES + 1) },
      }),
    );
    await expect(downloadMedia(format)).rejects.toMatchObject({ kind: 'too_large' });
    expect(cancelled).toBe(true);
  });

  it('rejects as cancelled when aborted mid-download and keeps no partial result', async () => {
    const controller = new AbortController();
    const body = new ReadableStream<Uint8Array>({
      pull(streamController) {
        streamController.enqueue(new Uint8Array(10));
        controller.abort();
        streamController.error(new DOMException('aborted', 'AbortError'));
      },
    });
    stubFetch(new Response(body));

    await expect(downloadMedia(format, { signal: controller.signal })).rejects.toMatchObject({ kind: 'cancelled' });
  });

  it('rejects as cancelled when aborted before the response arrives', async () => {
    const controller = new AbortController();
    stubFetch(
      () =>
        new Promise<Response>((_resolve, reject) => {
          controller.signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
        }),
    );
    const pending = downloadMedia(format, { signal: controller.signal });
    controller.abort();
    await expect(pending).rejects.toMatchObject({ kind: 'cancelled' });
  });
});

describe('analyzeVideoUrl', () => {
  const success: ExtractionSuccess = {
    success: true,
    platform: 'twitter',
    sourceUrl: 'https://x.com/i/status/1',
    title: 't',
    formats: [],
    browserDownload: 'fetch',
    notes: [],
  };

  it('posts JSON to the API and returns the result', async () => {
    stubFetch(Response.json(success));
    await expect(analyzeVideoUrl('https://x.com/a/status/1')).resolves.toEqual(success);
    const [url, init] = vi.mocked(fetch).mock.calls[0];
    expect(url).toBe('/api/video-extractor');
    expect(init).toMatchObject({ method: 'POST', body: JSON.stringify({ url: 'https://x.com/a/status/1' }) });
  });

  it('surfaces the API error code', async () => {
    stubFetch(Response.json({ success: false, error: { code: 'media_unavailable', message: 'x' } }, { status: 404 }));
    await expect(analyzeVideoUrl('u')).rejects.toMatchObject({ code: 'media_unavailable' });
  });

  it('maps network failures and non-JSON replies', async () => {
    stubFetch(() => Promise.reject(new TypeError('offline')));
    await expect(analyzeVideoUrl('u')).rejects.toMatchObject({ code: 'network' });

    stubFetch(new Response('<html>502</html>', { status: 502 }));
    await expect(analyzeVideoUrl('u')).rejects.toBeInstanceOf(AnalyzeError);
  });
});

describe('helpers', () => {
  const base: VideoFormat = {
    id: 'a',
    kind: 'progressive',
    container: 'mp4',
    mimeType: 'video/mp4',
    hasVideo: true,
    hasAudio: null,
    url: 'https://video.twimg.com/a.mp4',
  };

  it('builds safe file names', () => {
    expect(buildDownloadFileName({ platform: 'twitter', title: 'Olá, Mundo! ../../etc/passwd', quality: '720p' }, 'mp4')).toBe(
      'twitter-ola-mundo-etc-passwd-720p.mp4',
    );
    expect(buildDownloadFileName({ platform: 'pinterest', title: '🎉🎉' }, 'mp3')).toBe('pinterest-video.mp3');
  });

  it('estimates size only when bitrate and duration are known', () => {
    expect(estimateSizeBytes({ ...base, bitrateKbps: 800 }, 10)).toBe(1_000_000);
    expect(estimateSizeBytes(base, 10)).toBeNull();
    expect(estimateSizeBytes({ ...base, bitrateKbps: 800 }, undefined)).toBeNull();
  });

  it('formats durations', () => {
    expect(formatDuration(32.4)).toBe('0:32');
    expect(formatDuration(204.9)).toBe('3:25');
    expect(formatDuration(3725)).toBe('1:02:05');
  });

  it('lists only progressive formats as downloadable', () => {
    const result = { formats: [base, { ...base, id: 'hls', kind: 'hls' as const }] } as ExtractionSuccess;
    expect(downloadableFormats(result).map((item) => item.id)).toEqual(['a']);
  });

  it('guesses the platform from pasted text for the UI hint', () => {
    expect(guessPlatformFromText('veja https://twitter.com/a/status/1?s=20')).toBe('twitter');
    expect(guessPlatformFromText('pin.it/abc')).toBe('pinterest');
    expect(guessPlatformFromText('https://example.com/x')).toBeNull();
    expect(guessPlatformFromText('')).toBeNull();
  });
});
