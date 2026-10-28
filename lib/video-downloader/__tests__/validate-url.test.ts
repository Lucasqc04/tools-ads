import { describe, expect, it } from 'vitest';
import { ExtractionError } from '../errors';
import { detectPlatform } from '../registry';
import { parseUserUrl } from '../validate-url';

const codeOf = (fn: () => unknown) => {
  try {
    fn();
  } catch (error) {
    return error instanceof ExtractionError ? error.code : 'other';
  }
  return 'none';
};

describe('parseUserUrl', () => {
  it('upgrades http to https and drops fragments and default ports', () => {
    expect(parseUserUrl('http://x.com:80/user/status/1#frag').toString()).toBe(
      'https://x.com/user/status/1',
    );
  });

  it('accepts links without a scheme', () => {
    expect(parseUserUrl('x.com/user/status/123').hostname).toBe('x.com');
  });

  it('extracts the link from pasted share text and strips trailing punctuation', () => {
    const url = parseUserUrl('Look at this: https://x.com/nasa/status/123?s=20). Wow');
    expect(url.pathname).toBe('/nasa/status/123');
  });

  it.each([
    ['empty', ''],
    ['whitespace', '   '],
    ['plain text', 'hello world'],
    ['non-string', 42],
    ['ftp', 'ftp://x.com/a/status/1'],
    ['javascript scheme', 'javascript:alert(1)'],
    ['file scheme', 'file:///etc/passwd'],
    ['credentials', 'https://user:pass@x.com/a/status/1'],
    ['custom port', 'https://x.com:8443/a/status/1'],
    ['ipv4 literal', 'https://127.0.0.1/a'],
    ['decimal ipv4', 'https://2130706433/a'],
    ['hex ipv4', 'https://0x7f000001/a'],
    ['ipv6 literal', 'https://[::1]/a'],
    ['no dot host', 'https://localhost/a'],
    ['too long', `https://x.com/${'a'.repeat(3000)}`],
  ])('rejects %s', (_label, input) => {
    expect(codeOf(() => parseUserUrl(input))).toBe('invalid_url');
  });
});

describe('detectPlatform', () => {
  it.each([
    ['https://x.com/a/status/1', 'twitter'],
    ['https://twitter.com/a/status/1', 'twitter'],
    ['https://www.twitter.com/a/status/1', 'twitter'],
    ['https://mobile.twitter.com/a/status/1', 'twitter'],
    ['https://www.pinterest.com/pin/123456789/', 'pinterest'],
    ['https://br.pinterest.com/pin/123456789/', 'pinterest'],
    ['https://pin.it/abc123', 'pinterest'],
  ])('maps %s to %s', (input, expected) => {
    expect(detectPlatform(parseUserUrl(input)).id).toBe(expected);
  });

  it.each([
    'https://evil.com/x.com/a/status/1',
    'https://x.com.evil.com/a/status/1',
    'https://notx.com/a/status/1',
    'https://pinterest.com.evil.io/pin/1',
    'https://example.com/video.mp4',
    'https://www.tiktok.com/@a/video/1',
    'https://www.instagram.com/reel/abc/',
  ])('rejects unsupported or look-alike host %s', (input) => {
    expect(codeOf(() => detectPlatform(parseUserUrl(input)))).toBe('unsupported_platform');
  });
});
