import dns from 'node:dns';
import https from 'node:https';
import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ExtractionError } from '../errors';
import { guardedLookup, safeFetchText } from '../safe-fetch';

const lookupResult = (host: string, options: dns.LookupOptions = {}) =>
  new Promise<{ error: Error | null; address?: unknown; family?: number }>((resolve) => {
    (guardedLookup as unknown as (h: string, o: dns.LookupOptions, cb: (...a: unknown[]) => void) => void)(
      host,
      options,
      (error: unknown, address: unknown, family: unknown) =>
        resolve({ error: error as Error | null, address, family: family as number }),
    );
  });

afterEach(() => {
  vi.restoreAllMocks();
});

describe('guardedLookup (DNS rebinding / private address guard)', () => {
  it('blocks hostnames that resolve to private addresses', async () => {
    vi.spyOn(dns, 'lookup').mockImplementation(((_h: string, _o: unknown, cb: (...a: unknown[]) => void) =>
      cb(null, [{ address: '10.0.0.7', family: 4 }])) as never);

    const { error } = await lookupResult('internal.example.com');
    expect(error).toBeInstanceOf(ExtractionError);
    expect((error as ExtractionError).code).toBe('access_blocked');
  });

  it('blocks when only one of several answers is private', async () => {
    vi.spyOn(dns, 'lookup').mockImplementation(((_h: string, _o: unknown, cb: (...a: unknown[]) => void) =>
      cb(null, [
        { address: '8.8.8.8', family: 4 },
        { address: '169.254.169.254', family: 4 },
      ])) as never);

    const { error } = await lookupResult('mixed.example.com');
    expect((error as ExtractionError).code).toBe('access_blocked');
  });

  it('blocks localhost for real', async () => {
    const { error } = await lookupResult('localhost');
    expect((error as ExtractionError).code).toBe('access_blocked');
  });

  it('returns public addresses in both lookup shapes', async () => {
    vi.spyOn(dns, 'lookup').mockImplementation(((_h: string, _o: unknown, cb: (...a: unknown[]) => void) =>
      cb(null, [{ address: '8.8.8.8', family: 4 }])) as never);

    expect((await lookupResult('ok.example.com')).address).toBe('8.8.8.8');
    expect((await lookupResult('ok.example.com', { all: true })).address).toEqual([
      { address: '8.8.8.8', family: 4 },
    ]);
  });
});

const baseOptions = (overrides = {}) => ({
  signal: new AbortController().signal,
  isAllowedHost: (host: string) => host === 'allowed.example',
  maxBytes: 1024,
  ...overrides,
});

type FakeResponse = { status: number; headers?: Record<string, string>; body?: string };

const fakeHttps = (responses: Record<string, FakeResponse>) =>
  vi.spyOn(https, 'request').mockImplementation(((options: { hostname: string }, callback: (res: unknown) => void) => {
    const request = new EventEmitter() as EventEmitter & { end: () => void; destroy: (e?: Error) => void };
    const reply = responses[options.hostname];

    request.destroy = (error?: Error) => {
      if (error) request.emit('error', error);
      request.emit('close');
    };
    request.end = () => {
      queueMicrotask(() => {
        if (!reply) {
          request.destroy(new Error('unexpected host'));
          return;
        }
        const stream = new PassThrough() as PassThrough & { statusCode: number; headers: Record<string, string> };
        stream.statusCode = reply.status;
        stream.headers = reply.headers ?? {};
        callback(stream);
        stream.end(reply.body ?? '');
      });
    };
    return request;
  }) as never);

describe('safeFetchText', () => {
  it('refuses hosts outside the allowlist before any network call', async () => {
    const spy = vi.spyOn(https, 'request');
    await expect(safeFetchText(new URL('https://evil.example/a'), baseOptions())).rejects.toMatchObject({
      code: 'unsupported_platform',
    });
    expect(spy).not.toHaveBeenCalled();
  });

  it.each(['http://allowed.example/a', 'https://u:p@allowed.example/a', 'https://allowed.example:8443/a'])(
    'refuses %s',
    async (input) => {
      const spy = vi.spyOn(https, 'request');
      await expect(safeFetchText(new URL(input), baseOptions())).rejects.toMatchObject({
        code: 'unsupported_platform',
      });
      expect(spy).not.toHaveBeenCalled();
    },
  );

  it('returns the body for an allowlisted host', async () => {
    fakeHttps({ 'allowed.example': { status: 200, body: 'hello' } });
    const result = await safeFetchText(new URL('https://allowed.example/a'), baseOptions());
    expect(result.body).toBe('hello');
  });

  it('re-validates every redirect hop against the allowlist', async () => {
    fakeHttps({
      'allowed.example': { status: 302, headers: { location: 'https://169.254.169.254/latest/meta-data' } },
    });
    await expect(safeFetchText(new URL('https://allowed.example/a'), baseOptions())).rejects.toMatchObject({
      code: 'unsupported_platform',
    });
  });

  it('follows redirects between allowed hosts but caps the number of hops', async () => {
    fakeHttps({ 'allowed.example': { status: 302, headers: { location: 'https://allowed.example/loop' } } });
    await expect(
      safeFetchText(new URL('https://allowed.example/a'), baseOptions({ maxRedirects: 2 })),
    ).rejects.toMatchObject({ code: 'upstream_error' });
  });

  it('returns redirects untouched in manual mode', async () => {
    fakeHttps({ 'allowed.example': { status: 301, headers: { location: 'https://elsewhere.example/x' } } });
    const result = await safeFetchText(new URL('https://allowed.example/a'), baseOptions({ redirect: 'manual' }));
    expect(result.status).toBe(301);
    expect(result.headers.location).toBe('https://elsewhere.example/x');
  });

  it('rejects bodies larger than the cap', async () => {
    fakeHttps({ 'allowed.example': { status: 200, body: 'x'.repeat(5000) } });
    await expect(safeFetchText(new URL('https://allowed.example/a'), baseOptions())).rejects.toMatchObject({
      code: 'upstream_error',
    });
  });

  it.each([
    [404, 'media_unavailable'],
    [410, 'media_unavailable'],
    [403, 'access_blocked'],
    [429, 'rate_limited'],
    [500, 'upstream_error'],
  ])('maps upstream status %i to %s', async (status, code) => {
    fakeHttps({ 'allowed.example': { status } });
    await expect(safeFetchText(new URL('https://allowed.example/a'), baseOptions())).rejects.toMatchObject({ code });
  });

  it('reports a timeout when the signal is already aborted', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(
      safeFetchText(new URL('https://allowed.example/a'), baseOptions({ signal: controller.signal })),
    ).rejects.toMatchObject({ code: 'timeout' });
  });
});
