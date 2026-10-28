import dns from 'node:dns';
import https from 'node:https';
import type { IncomingHttpHeaders } from 'node:http';
import { Readable } from 'node:stream';
import zlib from 'node:zlib';
import { ExtractionError } from './errors';
import { isBlockedIp } from './ip-guard';

const USER_AGENT =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

export type SafeFetchOptions = {
  signal: AbortSignal;
  /** Called for the initial URL and again for every redirect target. */
  isAllowedHost: (hostname: string) => boolean;
  /** Cap on the decoded body, in bytes. */
  maxBytes: number;
  /** 'manual' returns the 3xx response untouched so callers can read `location`. */
  redirect?: 'follow' | 'manual';
  maxRedirects?: number;
  accept?: string;
};

export type SafeFetchResult = {
  status: number;
  url: URL;
  headers: IncomingHttpHeaders;
  body: string;
};

/**
 * dns.lookup wrapper used as the socket's own resolver. Because the validated
 * addresses are the ones the connection uses, DNS rebinding cannot swap in a
 * private address between "check" and "connect".
 */
export const guardedLookup: typeof dns.lookup = ((
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

    const list = addresses as dns.LookupAddress[];
    if (!list.length || list.some((entry) => isBlockedIp(entry.address))) {
      callback(new ExtractionError('access_blocked', 'Blocked destination address.'));
      return;
    }

    if (lookupOptions.all) {
      callback(null, list);
      return;
    }

    callback(null, list[0].address, list[0].family);
  });
}) as typeof dns.lookup;

const statusToError = (status: number): ExtractionError => {
  if (status === 404 || status === 410) {
    return new ExtractionError('media_unavailable');
  }
  if (status === 401 || status === 403) {
    return new ExtractionError('access_blocked');
  }
  if (status === 429) {
    return new ExtractionError('rate_limited');
  }
  return new ExtractionError('upstream_error');
};

const decodeStream = (
  response: Readable & { headers: IncomingHttpHeaders },
): Readable => {
  const encoding = String(response.headers['content-encoding'] ?? '').toLowerCase();

  if (encoding === 'gzip' || encoding === 'x-gzip') {
    return response.pipe(zlib.createGunzip());
  }
  if (encoding === 'br') {
    return response.pipe(zlib.createBrotliDecompress());
  }
  if (encoding === 'deflate') {
    return response.pipe(zlib.createInflate());
  }
  return response;
};

const isRedirectStatus = (status: number): boolean => [301, 302, 303, 307, 308].includes(status);

const requestOnce = (url: URL, options: SafeFetchOptions): Promise<SafeFetchResult> =>
  new Promise((resolve, reject) => {
    if (options.signal.aborted) {
      reject(new ExtractionError('timeout'));
      return;
    }

    const request = https.request(
      {
        protocol: 'https:',
        hostname: url.hostname,
        port: 443,
        path: `${url.pathname}${url.search}`,
        method: 'GET',
        lookup: guardedLookup,
        headers: {
          'User-Agent': USER_AGENT,
          Accept: options.accept ?? '*/*',
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      },
      (response) => {
        const status = response.statusCode ?? 0;

        if (isRedirectStatus(status)) {
          response.resume();
          resolve({ status, url, headers: response.headers, body: '' });
          return;
        }

        if (status < 200 || status >= 300) {
          response.resume();
          reject(statusToError(status));
          return;
        }

        const chunks: Buffer[] = [];
        let received = 0;
        const stream = decodeStream(response);

        stream.on('data', (chunk: Buffer) => {
          received += chunk.length;
          if (received > options.maxBytes) {
            request.destroy(new ExtractionError('upstream_error', 'Response too large.'));
            return;
          }
          chunks.push(chunk);
        });
        stream.on('end', () =>
          resolve({
            status,
            url,
            headers: response.headers,
            body: Buffer.concat(chunks).toString('utf8'),
          }),
        );
        stream.on('error', (error) =>
          reject(error instanceof ExtractionError ? error : new ExtractionError('upstream_error')),
        );
      },
    );

    const onAbort = () => request.destroy(new ExtractionError('timeout'));
    options.signal.addEventListener('abort', onAbort, { once: true });
    request.on('close', () => options.signal.removeEventListener('abort', onAbort));

    request.on('error', (error) => {
      if (error instanceof ExtractionError) {
        reject(error);
        return;
      }
      reject(new ExtractionError('upstream_error'));
    });

    request.end();
  });

/**
 * GET over HTTPS to an allowlisted host only. Every hop (initial URL and each
 * redirect) is checked against `isAllowedHost` and resolved through `guardedLookup`.
 * Throws ExtractionError for non-2xx statuses, oversized bodies and timeouts.
 */
export const safeFetchText = async (
  input: URL,
  options: SafeFetchOptions,
): Promise<SafeFetchResult> => {
  const maxRedirects = options.maxRedirects ?? 2;
  let current = input;

  for (let hop = 0; hop <= maxRedirects; hop += 1) {
    if (
      current.protocol !== 'https:' ||
      current.username ||
      current.password ||
      (current.port && current.port !== '443') ||
      !options.isAllowedHost(current.hostname)
    ) {
      throw new ExtractionError('unsupported_platform');
    }

    const result = await requestOnce(current, options);

    if (!isRedirectStatus(result.status) || options.redirect === 'manual') {
      return result;
    }

    const location = result.headers.location;
    if (!location) {
      throw new ExtractionError('upstream_error');
    }

    try {
      current = new URL(location, current);
    } catch {
      throw new ExtractionError('upstream_error');
    }
  }

  throw new ExtractionError('upstream_error', 'Too many redirects.');
};
