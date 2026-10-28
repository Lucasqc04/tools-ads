import { isIP } from 'node:net';
import { ExtractionError } from './errors';

export const MAX_INPUT_LENGTH = 2048;

const URL_IN_TEXT = /https?:\/\/[^\s<>"'`]+/i;
const BARE_HOST_PREFIX = /^(?:[a-z0-9-]+\.)+[a-z]{2,}(?:[/?#]|$)/i;

/**
 * Turns whatever the user pasted into a public https URL object, or throws
 * ExtractionError('invalid_url'). This is structural validation only; whether the
 * host is *supported* is decided by the registry allowlist.
 */
export const parseUserUrl = (raw: unknown): URL => {
  if (typeof raw !== 'string') {
    throw new ExtractionError('invalid_url');
  }

  const trimmed = raw.trim();
  if (!trimmed || trimmed.length > MAX_INPUT_LENGTH) {
    throw new ExtractionError('invalid_url');
  }

  const embedded = trimmed.match(URL_IN_TEXT)?.[0];
  let candidate = embedded ?? trimmed;

  if (!embedded) {
    if (/\s/.test(candidate) || !BARE_HOST_PREFIX.test(candidate)) {
      throw new ExtractionError('invalid_url');
    }
    candidate = `https://${candidate}`;
  }

  // Trailing punctuation that commonly sticks to links copied from chat apps.
  candidate = candidate.replace(/[)\].,;!?]+$/, '');

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    throw new ExtractionError('invalid_url');
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new ExtractionError('invalid_url');
  }

  if (url.username || url.password) {
    throw new ExtractionError('invalid_url');
  }

  if (url.port && url.port !== '443' && url.port !== '80') {
    throw new ExtractionError('invalid_url');
  }

  const hostname = url.hostname.replace(/\.$/, '').toLowerCase();
  const bareHost = hostname.replace(/^\[|\]$/g, '');

  // IP literals (including decimal/hex forms that WHATWG URL rewrites to dotted IPv4) are never valid here.
  if (!hostname.includes('.') || isIP(bareHost) !== 0 || hostname.includes(':')) {
    throw new ExtractionError('invalid_url');
  }

  const normalized = new URL(url.toString());
  normalized.protocol = 'https:';
  normalized.port = '';
  normalized.hostname = hostname;
  normalized.hash = '';

  return normalized;
};

export const hostWithoutWww = (hostname: string): string => hostname.replace(/^www\./, '');
