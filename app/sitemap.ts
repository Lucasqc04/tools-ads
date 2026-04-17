import type { MetadataRoute } from 'next';
import { cryptoConversionPages } from '@/data/crypto-conversion-pages';
import { toolsRegistry } from '@/data/tools-registry';
import { siteConfig } from '@/lib/site-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/tools`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteConfig.url}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteConfig.url}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${siteConfig.url}/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  const toolRoutes: MetadataRoute.Sitemap = toolsRegistry.map((tool) => ({
    url: `${siteConfig.url}${tool.canonicalPath}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const conversionRoutes: MetadataRoute.Sitemap = cryptoConversionPages.map(
    (conversionPage) => ({
      url: `${siteConfig.url}${conversionPage.path}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.72,
    }),
  );

  return [...staticRoutes, ...toolRoutes, ...conversionRoutes];
}
