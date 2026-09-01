import type { MetadataRoute } from 'next';
import {
  cryptoConversionPages,
  getCryptoConversionLocalePathMap,
} from '@/data/crypto-conversion-pages';
import {
  getImageConversionLocalePathMap,
  imageConversionPages,
  isIndexableImageConversionPage,
} from '@/data/image-conversion-pages';
import {
  getInvisiblePlatformLocalePathMap,
  invisiblePlatformPages,
} from '@/data/invisible-platform-pages';
import {
  getNicknameSymbolPlatformLocalePathMap,
  nicknameSymbolPlatformPages,
} from '@/data/nickname-symbol-platform-pages';
import {
  getSymbolCategoryLocalePathMap,
  symbolCategoryPages,
} from '@/data/symbol-category-pages';
import {
  getMultiplicationTableLocalePathMap,
  multiplicationTablePages,
} from '@/data/multiplication-table-pages';
import {
  getKeyboardShortcutsAppLocalePathMap,
  keyboardShortcutsAppPages,
} from '@/data/keyboard-shortcuts-app-pages';
import {
  getGamerUsernamePlatformLocalePathMap,
  gamerUsernamePlatformPages,
} from '@/data/gamer-username-platform-pages';
import { getGtaSeoLocalePathMap, gtaSeoPages } from '@/data/gta/gta-seo-pages';
import { getToolAliasStaticParamsByLocale } from '@/data/tool-alias-pages';
import { getToolLocalePathMap, toolsRegistry } from '@/data/tools-registry';
import {
  defaultLocale,
  localeMetadata,
  locales,
  localizePath,
  type AppLocale,
} from '@/lib/i18n/config';
import { makeAbsoluteUrl } from '@/lib/site-config';

const buildAlternates = (paths: Record<AppLocale, string>) => {
  const languages: Record<string, string> = {};

  locales.forEach((locale) => {
    languages[localeMetadata[locale].hreflang] = makeAbsoluteUrl(paths[locale]);
  });

  languages['x-default'] = makeAbsoluteUrl(paths[defaultLocale]);

  return { languages };
};

const buildLocalePathMap = (path: string): Record<AppLocale, string> => ({
  'pt-br': localizePath('pt-br', path),
  en: localizePath('en', path),
  es: localizePath('es', path),
  zh: localizePath('zh', path),
});

const createLocalizedEntries = (
  basePath: string,
  options: {
    lastModified: Date;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority: number;
  },
): MetadataRoute.Sitemap => {
  const pathMap = buildLocalePathMap(basePath);

  return locales.map((locale) => ({
    url: makeAbsoluteUrl(pathMap[locale]),
    lastModified: options.lastModified,
    changeFrequency: options.changeFrequency,
    priority: options.priority,
    alternates: buildAlternates(pathMap),
  }));
};

const dedupeByUrl = (entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap => {
  const byUrl = new Map<string, MetadataRoute.Sitemap[number]>();

  entries.forEach((entry) => {
    byUrl.set(entry.url, entry);
  });

  return Array.from(byUrl.values());
};

const contentLastModified = new Date('2026-07-22T00:00:00.000Z');

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRouteConfigs: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority: number;
  }> = [
    { path: '/', changeFrequency: 'weekly', priority: 1 },
    { path: '/tools', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/privacy-policy', changeFrequency: 'monthly', priority: 0.4 },
    { path: '/terms', changeFrequency: 'monthly', priority: 0.4 },
  ];

  const staticRoutes = staticRouteConfigs.flatMap((route) =>
    createLocalizedEntries(route.path, {
      lastModified: contentLastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }),
  );

  const toolRoutes: MetadataRoute.Sitemap = toolsRegistry.flatMap((tool) => {
    const pathMap = getToolLocalePathMap(tool);

    return locales.map((locale) => ({
      url: makeAbsoluteUrl(pathMap[locale]),
      lastModified: contentLastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: buildAlternates(pathMap),
    }));
  });

  const cryptoConversionRoutes: MetadataRoute.Sitemap = cryptoConversionPages.flatMap((page) => {
    const pathMap = getCryptoConversionLocalePathMap(page);

    return locales.map((locale) => ({
      url: makeAbsoluteUrl(pathMap[locale]),
      lastModified: contentLastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.72,
      alternates: buildAlternates(pathMap),
    }));
  });

  const imageConversionRoutes: MetadataRoute.Sitemap = imageConversionPages
    .filter(isIndexableImageConversionPage)
    .flatMap((page) => {
      const pathMap = getImageConversionLocalePathMap(page);

      return locales.map((locale) => ({
        url: makeAbsoluteUrl(pathMap[locale]),
        lastModified: contentLastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.72,
        alternates: buildAlternates(pathMap),
      }));
    });

  const invisibleLandingRoutes: MetadataRoute.Sitemap = invisiblePlatformPages.flatMap((page) => {
    const pathMap = getInvisiblePlatformLocalePathMap(page);

    return locales.map((locale) => ({
      url: makeAbsoluteUrl(pathMap[locale]),
      lastModified: contentLastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.74,
      alternates: buildAlternates(pathMap),
    }));
  });

  const nicknameSymbolLandingRoutes: MetadataRoute.Sitemap =
    nicknameSymbolPlatformPages.flatMap((page) => {
      const pathMap = getNicknameSymbolPlatformLocalePathMap(page);

      return locales.map((locale) => ({
        url: makeAbsoluteUrl(pathMap[locale]),
        lastModified: contentLastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.76,
        alternates: buildAlternates(pathMap),
      }));
    });

  const symbolCategoryRoutes: MetadataRoute.Sitemap = symbolCategoryPages.flatMap((page) => {
    const pathMap = getSymbolCategoryLocalePathMap(page);

    return locales.map((locale) => ({
      url: makeAbsoluteUrl(pathMap[locale]),
      lastModified: contentLastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: buildAlternates(pathMap),
    }));
  });

  const multiplicationTableRoutes: MetadataRoute.Sitemap = multiplicationTablePages.flatMap((page) => {
    const pathMap = getMultiplicationTableLocalePathMap(page);

    return locales.map((locale) => ({
      url: makeAbsoluteUrl(pathMap[locale]),
      lastModified: contentLastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: buildAlternates(pathMap),
    }));
  });

  const keyboardShortcutsAppRoutes: MetadataRoute.Sitemap = keyboardShortcutsAppPages.flatMap((page) => {
    const pathMap = getKeyboardShortcutsAppLocalePathMap(page);

    return locales.map((locale) => ({
      url: makeAbsoluteUrl(pathMap[locale]),
      lastModified: contentLastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: buildAlternates(pathMap),
    }));
  });

  const gamerUsernamePlatformRoutes: MetadataRoute.Sitemap = gamerUsernamePlatformPages.flatMap((page) => {
    const pathMap = getGamerUsernamePlatformLocalePathMap(page);

    return locales.map((locale) => ({
      url: makeAbsoluteUrl(pathMap[locale]),
      lastModified: contentLastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.74,
      alternates: buildAlternates(pathMap),
    }));
  });

  const toolAliasRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    getToolAliasStaticParamsByLocale(locale).map(({ platformPageSlug }) => ({
      url: makeAbsoluteUrl(localizePath(locale, `/${platformPageSlug}`)),
      lastModified: contentLastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  );

  const gtaSeoRoutes: MetadataRoute.Sitemap = gtaSeoPages.flatMap((page) => {
    const pathMap = getGtaSeoLocalePathMap(page);

    return locales.map((locale) => ({
      url: makeAbsoluteUrl(pathMap[locale]),
      lastModified: contentLastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.76,
      alternates: buildAlternates(pathMap),
    }));
  });

  return dedupeByUrl([
    ...staticRoutes,
    ...toolRoutes,
    ...cryptoConversionRoutes,
    ...imageConversionRoutes,
    ...invisibleLandingRoutes,
    ...nicknameSymbolLandingRoutes,
    ...symbolCategoryRoutes,
    ...multiplicationTableRoutes,
    ...keyboardShortcutsAppRoutes,
    ...gamerUsernamePlatformRoutes,
    ...toolAliasRoutes,
    ...gtaSeoRoutes,
  ]);
}
