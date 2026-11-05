import { describe, expect, it } from 'vitest';
import { extractPinId, parsePinMedia, pinterestExtractor } from '../providers/pinterest';

const snippet = JSON.stringify({
  '@type': 'VideoObject',
  name: 'Matisse Cutouts Inspired Wallpaper',
  thumbnailUrl: 'https://i.pinimg.com/videos/thumbnails/originals/da/d6/ca/x-00001.jpg',
  duration: 'PT23S',
  width: '1080 px',
  height: '1920 px',
  contentUrl: 'https://v1.pinimg.com/videos/720p/da/d6/ca/x.mp4',
  creator: { name: 'MuralsWallpaper' },
});

const html = (json: string) =>
  `<html><head><script data-test id="video-snippet" type="application/ld+json">${json}</script></head></html>`;

describe('pinterest provider', () => {
  it('reads pin ids from slugged and plain paths', () => {
    expect(extractPinId(new URL('https://www.pinterest.com/pin/487022147205683522/'))).toBe('487022147205683522');
    expect(extractPinId(new URL('https://www.pinterest.com/pin/some-title--487022147205683522/'))).toBe(
      '487022147205683522',
    );
    expect(extractPinId(new URL('https://www.pinterest.com/user/board/'))).toBeNull();
  });

  it('normalizes ccTLD pin links to www.pinterest.com', async () => {
    const normalized = await pinterestExtractor.normalize(
      new URL('https://br.pinterest.com/pin/487022147205683522/?utm=1'),
    );
    expect(normalized.toString()).toBe('https://www.pinterest.com/pin/487022147205683522/');
  });

  it('parses the embedded VideoObject and marks it as open-only (no CORS)', () => {
    const result = parsePinMedia(html(snippet));

    expect(result.mediaType).toBe('video');
    expect(result.formats).toHaveLength(1);
    expect(result.formats[0]).toMatchObject({ kind: 'progressive', quality: '720p', container: 'mp4', width: 1080, height: 1920 });
    expect(result.durationSeconds).toBe(23);
    expect(result.author).toBe('MuralsWallpaper');
    expect(result.browserDownload).toBe('open');
    expect(result.notes).toContain('no_cors_open_only');
  });

  it('extracts a public image pin from its Pinterest image metadata', () => {
    const result = parsePinMedia(
      '<html><head><meta content="https://i.pinimg.com/originals/aa/bb/cc/pin.jpg" property="og:image" /><meta property="og:title" content="A saved pin" /></head></html>',
    );

    expect(result).toMatchObject({
      mediaType: 'image',
      title: 'A saved pin',
      browserDownload: 'open',
      formats: [{ kind: 'progressive', container: 'jpg', mimeType: 'image/jpeg', hasVideo: false, url: 'https://i.pinimg.com/originals/aa/bb/cc/pin.jpg' }],
    });
  });

  it('rejects pins without supported media or with a foreign media URL', () => {
    expect(() => parsePinMedia('<html></html>')).toThrowError(expect.objectContaining({ code: 'no_media_found' }));
    expect(() =>
      parsePinMedia(
        '<html><head><meta property="og:image" content="https://evil.example/pin.jpg" /></head></html>',
      ),
    ).toThrowError(expect.objectContaining({ code: 'no_media_found' }));
  });
});
