import { describe, expect, it } from 'vitest';
import { ExtractionError } from '../errors';
import {
  extractTweetId,
  parseTweetMedia,
  syndicationToken,
  twitterExtractor,
} from '../providers/twitter';

// Trimmed copy of the shape returned by cdn.syndication.twimg.com for a public video post.
const videoTweet = {
  text: 'Splashdown confirmed! https://t.co/abc123',
  user: { name: 'NASA', screen_name: 'NASA' },
  mediaDetails: [
    {
      type: 'video',
      media_url_https: 'https://pbs.twimg.com/amplify_video_thumb/1/img/a.jpg',
      video_info: {
        duration_millis: 32405,
        variants: [
          { content_type: 'application/x-mpegURL', url: 'https://video.twimg.com/amplify_video/1/pl/a.m3u8' },
          { content_type: 'video/mp4', bitrate: 256000, url: 'https://video.twimg.com/amplify_video/1/vid/avc1/480x270/a.mp4' },
          { content_type: 'video/mp4', bitrate: 2176000, url: 'https://video.twimg.com/amplify_video/1/vid/avc1/1280x720/b.mp4' },
          { content_type: 'video/mp4', bitrate: 832000, url: 'https://video.twimg.com/amplify_video/1/vid/avc1/640x360/c.mp4' },
        ],
      },
    },
  ],
};

describe('twitter provider', () => {
  it('extracts tweet ids from common URL shapes', () => {
    expect(extractTweetId(new URL('https://x.com/NASA/status/1902118174591521056'))).toBe('1902118174591521056');
    expect(extractTweetId(new URL('https://twitter.com/NASA/status/19/video/1'))).toBe('19');
    expect(extractTweetId(new URL('https://x.com/i/status/19'))).toBe('19');
    expect(extractTweetId(new URL('https://x.com/i/web/status/19'))).toBe('19');
    expect(extractTweetId(new URL('https://x.com/NASA'))).toBeNull();
    expect(extractTweetId(new URL('https://x.com/NASA/status/abc'))).toBeNull();
  });

  it('normalizes to a canonical status URL and rejects profiles', () => {
    expect(twitterExtractor.normalize(new URL('https://twitter.com/NASA/status/19?s=20')).toString()).toBe(
      'https://x.com/i/status/19',
    );
    expect(() => twitterExtractor.normalize(new URL('https://x.com/NASA'))).toThrow(ExtractionError);
  });

  it('derives the syndication token for a known id', () => {
    expect(syndicationToken('1655608985058267139')).toBe('4h8yqhtwly');
  });

  it('lists mp4 qualities best-first and keeps HLS as a separate kind', () => {
    const result = parseTweetMedia(videoTweet);

    expect(result.formats.map((format) => [format.kind, format.quality])).toEqual([
      ['progressive', '720p'],
      ['progressive', '360p'],
      ['progressive', '270p'],
      ['hls', undefined],
    ]);
    expect(result.formats[0]).toMatchObject({ width: 1280, height: 720, bitrateKbps: 2176, container: 'mp4' });
    expect(result.title).toBe('Splashdown confirmed!');
    expect(result.author).toBe('NASA');
    expect(result.durationSeconds).toBeCloseTo(32.4, 1);
    expect(result.browserDownload).toBe('fetch');
  });

  it('does not claim audio information the source does not provide', () => {
    const result = parseTweetMedia(videoTweet);
    expect(result.formats.every((format) => format.hasAudio === null)).toBe(true);
  });

  it('flags animated GIFs as silent', () => {
    const gif = {
      ...videoTweet,
      mediaDetails: [{ ...videoTweet.mediaDetails[0], type: 'animated_gif' }],
    };
    const result = parseTweetMedia(gif);
    expect(result.notes).toContain('gif_without_audio');
    expect(result.formats[0].hasAudio).toBe(false);
  });

  it('reports only the first video when a post has several', () => {
    const result = parseTweetMedia({
      ...videoTweet,
      mediaDetails: [videoTweet.mediaDetails[0], videoTweet.mediaDetails[0]],
    });
    expect(result.notes).toContain('multiple_media_only_first');
  });

  it('maps tombstones to media_unavailable and photo-only posts to no_video_found', () => {
    expect(() => parseTweetMedia({ __typename: 'TweetTombstone' })).toThrowError(
      expect.objectContaining({ code: 'media_unavailable' }),
    );
    expect(() =>
      parseTweetMedia({ text: 'photo', mediaDetails: [{ type: 'photo' }] }),
    ).toThrowError(expect.objectContaining({ code: 'no_video_found' }));
    expect(() => parseTweetMedia({ text: 'text only' })).toThrowError(
      expect.objectContaining({ code: 'no_video_found' }),
    );
  });
});
