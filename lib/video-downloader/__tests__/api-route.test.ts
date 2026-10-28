import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ExtractionError } from '../errors';
import { resetRateLimitState } from '../rate-limit';

const extractVideo = vi.fn();
vi.mock('../extract', () => ({ extractVideo: (...args: unknown[]) => extractVideo(...args) }));

const loadRoute = () => import('@/app/api/video-extractor/route');

const post = (body: unknown, init: { headers?: Record<string, string> } = {}) =>
  new Request('https://tools.example/api/video-extractor', {
    method: 'POST',
    headers: { 'content-type': 'application/json', host: 'tools.example', ...init.headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

const success = {
  success: true,
  platform: 'twitter',
  sourceUrl: 'https://x.com/i/status/1',
  title: 't',
  formats: [],
  browserDownload: 'fetch',
  notes: [],
};

beforeEach(() => {
  extractVideo.mockReset();
  resetRateLimitState();
});

describe('POST /api/video-extractor', () => {
  it('returns the extraction result with no-store caching', async () => {
    extractVideo.mockResolvedValue(success);
    const { POST } = await loadRoute();
    const response = await POST(post({ url: 'https://x.com/a/status/1' }, { headers: { 'x-forwarded-for': '1.1.1.1' } }));

    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(await response.json()).toEqual(success);
    expect(extractVideo).toHaveBeenCalledWith('https://x.com/a/status/1');
  });

  it.each([
    ['invalid_url', 400],
    ['unsupported_platform', 422],
    ['media_unavailable', 404],
    ['no_video_found', 404],
    ['access_blocked', 403],
    ['rate_limited', 429],
    ['timeout', 504],
    ['upstream_error', 502],
  ] as const)('maps %s to HTTP %i with a standard error body', async (code, status) => {
    extractVideo.mockRejectedValue(new ExtractionError(code));
    const { POST } = await loadRoute();
    const response = await POST(post({ url: 'https://x.com/a/status/1' }));
    const json = await response.json();

    expect(response.status).toBe(status);
    expect(json).toEqual({ success: false, error: { code, message: expect.any(String) } });
  });

  it('hides unexpected error details', async () => {
    extractVideo.mockRejectedValue(new Error('secret stack https://internal/token=abc'));
    const { POST } = await loadRoute();
    const response = await POST(post({ url: 'https://x.com/a/status/1' }));
    const text = JSON.stringify(await response.json());

    expect(response.status).toBe(502);
    expect(text).not.toContain('secret');
    expect(text).not.toContain('token');
  });

  it('rejects malformed bodies, wrong content types and oversized payloads', async () => {
    const { POST } = await loadRoute();

    expect((await POST(post('{not json'))).status).toBe(400);
    expect((await POST(post({ url: 'x' }, { headers: { 'content-type': 'text/plain' } }))).status).toBe(400);
    expect((await POST(post({ url: 'x'.repeat(5000) }))).status).toBe(400);
    expect(extractVideo).not.toHaveBeenCalled();
  });

  it('refuses cross-site browser requests', async () => {
    const { POST } = await loadRoute();
    const response = await POST(post({ url: 'https://x.com/a/status/1' }, { headers: { origin: 'https://evil.example' } }));
    expect(response.status).toBe(403);
    expect(extractVideo).not.toHaveBeenCalled();
  });

  it('rate limits a single client', async () => {
    extractVideo.mockResolvedValue(success);
    const { POST } = await loadRoute();
    const statuses: number[] = [];

    for (let index = 0; index < 14; index += 1) {
      statuses.push((await POST(post({ url: 'https://x.com/a/status/1' }, { headers: { 'x-forwarded-for': '9.9.9.9' } }))).status);
    }

    expect(statuses.filter((status) => status === 429)).toHaveLength(2);
  });

  it('only allows POST', async () => {
    const route = await loadRoute();
    const response = route.GET();
    expect(response.status).toBe(405);
  });
});
