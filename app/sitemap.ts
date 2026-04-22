import type { MetadataRoute } from 'next';
import { getCryptoConversionStaticParams } from '@/data/crypto-conversion-pages';
import { getImageConversionStaticParams } from '@/data/image-conversion-pages';
import { getInvisiblePlatformStaticParamsByLocale } from '@/data/invisible-platform-pages';
import { getToolAliasStaticParamsByLocale } from '@/data/tool-alias-pages';
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

const collectInvisibleLandingSlugs = (): string[] => {
  const slugs = new Set<string>();

  locales.forEach((locale) => {
    getInvisiblePlatformStaticParamsByLocale(locale).forEach(({ platformPageSlug }) => {
      slugs.add(platformPageSlug);
    });
  });

  return Array.from(slugs);
};

const collectToolAliasSlugs = (): string[] => {
  const slugs = new Set<string>();

  locales.forEach((locale) => {
    getToolAliasStaticParamsByLocale(locale).forEach(({ platformPageSlug }) => {
      slugs.add(platformPageSlug);
    });
  });

  return Array.from(slugs);
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

  const toolRoutes: MetadataRoute.Sitemap = toolsRegistry.flatMap((tool) =>
    createLocalizedEntries(`/tools/${tool.slug}`, {
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }),
  );

  const cryptoConversionRoutes: MetadataRoute.Sitemap = getCryptoConversionStaticParams().flatMap(
    ({ conversionSlug }) =>
      createLocalizedEntries(`/tools/crypto-unit-converter/${conversionSlug}`, {
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.72,
      }),
  );

  const imageConversionRoutes: MetadataRoute.Sitemap = getImageConversionStaticParams().flatMap(
    ({ conversionSlug }) =>
      createLocalizedEntries(`/tools/image-converter/${conversionSlug}`, {
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.72,
      }),
  );

  const invisibleLandingRoutes: MetadataRoute.Sitemap = collectInvisibleLandingSlugs().flatMap(
    (slug) =>
      createLocalizedEntries(`/${slug}`, {
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.74,
      }),
  );

  const toolAliasRoutes: MetadataRoute.Sitemap = collectToolAliasSlugs().flatMap((slug) =>
    createLocalizedEntries(`/${slug}`, {
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }),
  );

  return dedupeByUrl([
    ...staticRoutes,
    ...toolRoutes,
    ...cryptoConversionRoutes,
    ...imageConversionRoutes,
    ...invisibleLandingRoutes,
    ...toolAliasRoutes,
  ]);
}
