import type { MetadataRoute } from 'next';
import {
  cryptoConversionPages,
  getCryptoConversionPathByLocale,
} from '@/data/crypto-conversion-pages';
import {
  getImageConversionPathByLocale,
  imageConversionPages,
} from '@/data/image-conversion-pages';
import {
  getInvisiblePlatformPathByLocale,
  invisiblePlatformPages,
} from '@/data/invisible-platform-pages';
import { toolsRegistry } from '@/data/tools-registry';
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

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

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
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }),
  );

  const toolRoutes: MetadataRoute.Sitemap = toolsRegistry.flatMap((tool) => {
    const pathMap = buildLocalePathMap(`/tools/${tool.slug}`);

    return locales.map((locale) => ({
      url: makeAbsoluteUrl(pathMap[locale]),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: buildAlternates(pathMap),
    }));
  });

  const conversionRoutes: MetadataRoute.Sitemap = cryptoConversionPages.flatMap((page) => {
    const pathMap: Record<AppLocale, string> = {
      'pt-br': getCryptoConversionPathByLocale(page, 'pt-br'),
      en: getCryptoConversionPathByLocale(page, 'en'),
      es: getCryptoConversionPathByLocale(page, 'es'),
    };

    return locales.map((locale) => ({
      url: makeAbsoluteUrl(pathMap[locale]),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.72,
      alternates: buildAlternates(pathMap),
    }));
  });

  const imageConversionRoutes: MetadataRoute.Sitemap = imageConversionPages.flatMap((page) => {
    const pathMap: Record<AppLocale, string> = {
      'pt-br': getImageConversionPathByLocale(page, 'pt-br'),
      en: getImageConversionPathByLocale(page, 'en'),
      es: getImageConversionPathByLocale(page, 'es'),
    };

    return locales.map((locale) => ({
      url: makeAbsoluteUrl(pathMap[locale]),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.72,
      alternates: buildAlternates(pathMap),
    }));
  });

  const invisiblePlatformRoutes: MetadataRoute.Sitemap = invisiblePlatformPages.flatMap(
    (page) => {
      const pathMap: Record<AppLocale, string> = {
        'pt-br': getInvisiblePlatformPathByLocale(page, 'pt-br'),
        en: getInvisiblePlatformPathByLocale(page, 'en'),
        es: getInvisiblePlatformPathByLocale(page, 'es'),
      };

      return locales.map((locale) => ({
        url: makeAbsoluteUrl(pathMap[locale]),
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.72,
        alternates: buildAlternates(pathMap),
      }));
    },
  );

  return dedupeByUrl([
    ...staticRoutes,
    ...toolRoutes,
    ...conversionRoutes,
    ...imageConversionRoutes,
    ...invisiblePlatformRoutes,
  ]);
}
