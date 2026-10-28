import { videoDownloaderPlatformContent, type VideoDownloaderPlatformContent } from '@/data/content/video-downloader-platforms';
import { buildLocalePathMap, localizePath, type AppLocale } from '@/lib/i18n/config';
import { platformDisplayNames } from '@/lib/video-downloader/platforms';
import type { VideoPlatformId } from '@/lib/video-downloader/types';

/**
 * Child pages of the video downloader. A platform is listed here only when its
 * extractor is implemented and was verified against real public posts
 * (see lib/video-downloader/__tests__/live-extraction.test.ts).
 */
export type VideoDownloaderPlatformPage = {
  slug: VideoPlatformId;
  platformId: VideoPlatformId;
  name: string;
};

export const VIDEO_DOWNLOADER_BASE_PATH = '/tools/video-downloader';

export const videoDownloaderPlatformPages: VideoDownloaderPlatformPage[] = (
  ['twitter', 'pinterest'] as const
).map((id) => ({ slug: id, platformId: id, name: platformDisplayNames[id] }));

export const getVideoDownloaderPlatformPage = (slug: string): VideoDownloaderPlatformPage | undefined =>
  videoDownloaderPlatformPages.find((page) => page.slug === slug);

export const getVideoDownloaderStaticParams = (): Array<{ platformSlug: string }> =>
  videoDownloaderPlatformPages.map((page) => ({ platformSlug: page.slug }));

export const getVideoDownloaderPlatformPath = (page: VideoDownloaderPlatformPage, locale: AppLocale): string =>
  localizePath(locale, `${VIDEO_DOWNLOADER_BASE_PATH}/${page.slug}`);

export const getVideoDownloaderPlatformLocalePathMap = (page: VideoDownloaderPlatformPage) =>
  buildLocalePathMap(`${VIDEO_DOWNLOADER_BASE_PATH}/${page.slug}`);

export const getLocalizedVideoDownloaderPlatformContent = (
  page: VideoDownloaderPlatformPage,
  locale: AppLocale,
): VideoDownloaderPlatformContent =>
  videoDownloaderPlatformContent[page.platformId][locale] ?? videoDownloaderPlatformContent[page.platformId]['pt-br'];

export type VideoDownloaderPlatformLink = { slug: string; path: string; name: string; description: string };

/** Links to the sibling platform pages (everything except the current one). */
export const getVideoDownloaderPlatformLinks = (
  locale: AppLocale,
  excludeSlug?: string,
): VideoDownloaderPlatformLink[] =>
  videoDownloaderPlatformPages
    .filter((page) => page.slug !== excludeSlug)
    .map((page) => ({
      slug: page.slug,
      path: getVideoDownloaderPlatformPath(page, locale),
      name: page.name,
      description: getLocalizedVideoDownloaderPlatformContent(page, locale).title,
    }));
