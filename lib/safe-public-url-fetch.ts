import dns from 'node:dns';
import http from 'node:http';
import https from 'node:https';
import type { IncomingHttpHeaders } from 'node:http';
import { isBlockedIp } from '@/lib/video-downloader/ip-guard';

const redirectStatuses = new Set([301, 302, 303, 307, 308]);

export class PublicUrlFetchError extends Error {
  constructor(readonly code: 'unsafe_url' | 'too_many_redirects' | 'response_too_large' | 'upstream_error') {
    super(code);
    this.name = 'PublicUrlFetchError';
  }
}

export type PublicUrlFetchResult = {
  status: number;
  statusText: string;
  url: URL;
  headers: IncomingHttpHeaders;
  body: Buffer;
};

type PublicUrlFetchOptions = {
  signal: AbortSignal;
  accept: string;
  userAgent: string;
  maxBytes: number;
  maxRedirects?: number;
};

/** Resolve and connect through this lookup so DNS cannot change after validation. */
const guardedLookup: typeof dns.lookup = ((
  hostname: string,
  options: dns.LookupOptions | number | undefined,
  callback: (...args: unknown[]) => void,
) => {
  const lookupOptions: dns.LookupOptions =
    typeof options === 'object' && options !== null ? options : {};

  dns.lookup(hostname, { ...lookupOptions, all: true }, (error, addresses) => {
    if (error) {
      callback(error);
      return;
    }

    const resolvedAddresses = addresses as dns.LookupAddress[];
    if (!resolvedAddresses.length || resolvedAddresses.some(({ address }) => isBlockedIp(address))) {
      callback(new PublicUrlFetchError('unsafe_url'));
      return;
    }

    if (lookupOptions.all) {
      callback(null, resolvedAddresses);
      return;
    }

    callback(null, resolvedAddresses[0].address, resolvedAddresses[0].family);
  });
}) as typeof dns.lookup;

const validateUrl = (url: URL): void => {
  const expectedPort = url.protocol === 'https:' ? '443' : '80';

  if (
    (url.protocol !== 'http:' && url.protocol !== 'https:') ||
    !url.hostname ||
    url.username ||
    url.password ||
    (url.port && url.port !== expectedPort)
  ) {
    throw new PublicUrlFetchError('unsafe_url');
  }
};

const requestOnce = (
  url: URL,
  options: PublicUrlFetchOptions,
): Promise<PublicUrlFetchResult> =>
  new Promise((resolve, reject) => {
    if (options.signal.aborted) {
      reject(new PublicUrlFetchError('upstream_error'));
      return;
    }

    const client = url.protocol === 'https:' ? https : http;
    const hostname = url.hostname.replace(/^\[|\]$/g, '');
    const request = client.request(
      {
        hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: `${url.pathname}${url.search}`,
        method: 'GET',
        lookup: guardedLookup,
        headers: {
          Accept: options.accept,
          'Accept-Encoding': 'identity',
          'User-Agent': options.userAgent,
        },
      },
      (response) => {
        const status = response.statusCode ?? 0;
        const resultBase = {
          status,
          statusText: response.statusMessage ?? '',
          url,
          headers: response.headers,
        };

        if (redirectStatuses.has(status) || status < 200 || status >= 300) {
          response.resume();
          resolve({ ...resultBase, body: Buffer.alloc(0) });
          return;
        }

        const chunks: Buffer[] = [];
        let received = 0;

        response.on('data', (chunk: Buffer) => {
          received += chunk.length;
          if (received > options.maxBytes) {
            request.destroy(new PublicUrlFetchError('response_too_large'));
            return;
          }
          chunks.push(chunk);
        });
        response.on('end', () => resolve({ ...resultBase, body: Buffer.concat(chunks) }));
        response.on('error', () => reject(new PublicUrlFetchError('upstream_error')));
      },
    );

    const onAbort = () => request.destroy(new PublicUrlFetchError('upstream_error'));
    options.signal.addEventListener('abort', onAbort, { once: true });
    request.once('close', () => options.signal.removeEventListener('abort', onAbort));
    request.on('error', (error) => {
      reject(
        error instanceof PublicUrlFetchError
          ? error
          : new PublicUrlFetchError('upstream_error'),
      );
    });
    request.end();
  });

/** Fetch a public HTTP(S) URL with DNS-pinned IP checks, bounded redirects, and a response cap. */
export const fetchPublicUrl = async (
  input: URL,
  options: PublicUrlFetchOptions,
): Promise<PublicUrlFetchResult> => {
  const maxRedirects = options.maxRedirects ?? 4;
  let current = input;

  for (let hop = 0; hop <= maxRedirects; hop += 1) {
    validateUrl(current);
    const result = await requestOnce(current, options);

    if (!redirectStatuses.has(result.status)) {
      if (result.status < 200 || result.status >= 300) {
        throw new PublicUrlFetchError('upstream_error');
      }
      return result;
    }

    if (hop === maxRedirects) {
      throw new PublicUrlFetchError('too_many_redirects');
    }

    const location = result.headers.location;
    if (typeof location !== 'string' || !location) {
      throw new PublicUrlFetchError('upstream_error');
    }

    try {
      current = new URL(location, current);
    } catch {
      throw new PublicUrlFetchError('upstream_error');
    }
  }

  throw new PublicUrlFetchError('too_many_redirects');
};
