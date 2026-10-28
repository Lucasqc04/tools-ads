import type { VideoPlatformId } from './types';

/**
 * Client-safe platform metadata. The server providers and the browser UI both read
 * host matching from here so "which links are supported" has a single definition.
 */
const PINTEREST_HOST =
  /^(?:[a-z]{2,3}\.)?pinterest\.(?:com|com\.br|com\.au|com\.mx|co\.uk|es|pt|fr|de|it|ca|nl|jp|ru|ph|se|dk|ch|at|ie|nz|cl|co\.kr)$/;
const TWITTER_HOSTS = new Set(['x.com', 'twitter.com', 'mobile.x.com', 'mobile.twitter.com']);

const stripWww = (hostname: string): string => hostname.toLowerCase().replace(/^www\./, '');

export const PINTEREST_SHORT_HOST = 'pin.it';

export const platformHostMatchers: Record<VideoPlatformId, (hostname: string) => boolean> = {
  twitter: (hostname) => TWITTER_HOSTS.has(stripWww(hostname)),
  pinterest: (hostname) => {
    const host = stripWww(hostname);
    return host === PINTEREST_SHORT_HOST || PINTEREST_HOST.test(host);
  },
};

export const platformDisplayNames: Record<VideoPlatformId, string> = {
  twitter: 'X (Twitter)',
  pinterest: 'Pinterest',
};

export const videoPlatformIds = Object.keys(platformHostMatchers) as VideoPlatformId[];

export const isVideoPlatformId = (value: string): value is VideoPlatformId =>
  (videoPlatformIds as string[]).includes(value);

/** Lenient, UI-only hint while the user types. The server still validates everything. */
export const guessPlatformFromText = (text: string): VideoPlatformId | null => {
  const candidate = text.match(/https?:\/\/[^\s<>"']+/i)?.[0] ?? text.trim();

  try {
    const hostname = new URL(/^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`).hostname;
    return videoPlatformIds.find((id) => platformHostMatchers[id](hostname)) ?? null;
  } catch {
    return null;
  }
};
