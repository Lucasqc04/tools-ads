import type { Metadata } from 'next';
import { makeAbsoluteUrl, siteConfig } from '@/lib/site-config';
import {
  defaultLocale,
  localeMetadata,
  locales,
  type AppLocale,
} from '@/lib/i18n/config';

type BuildMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

export const buildMetadata = ({
  title,
  description,
  path,
  keywords = [],
}: BuildMetadataInput): Metadata => {
  const canonical = makeAbsoluteUrl(path);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      type: 'website',
      locale: siteConfig.locale,
      url: canonical,
      title,
      description,
      siteName: siteConfig.siteName,
      images: [
        {
          url: makeAbsoluteUrl('/og-default.svg'),
          width: 1200,
          height: 630,
          alt: `${siteConfig.siteName} - Open Graph`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: siteConfig.social.twitter,
      images: [makeAbsoluteUrl('/og-default.svg')],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
};

type BuildLocalizedMetadataInput = {
  locale: AppLocale;
  title: string;
  description: string;
  localePaths: Record<AppLocale, string>;
  keywords?: string[];
};

const buildLanguageAlternates = (
  localePaths: Record<AppLocale, string>,
): Record<string, string> => {
  const alternates: Record<string, string> = {};

  locales.forEach((locale) => {
    alternates[localeMetadata[locale].hreflang] = makeAbsoluteUrl(localePaths[locale]);
  });

  alternates['x-default'] = makeAbsoluteUrl(localePaths[defaultLocale]);

  return alternates;
};

export const buildLocalizedMetadata = ({
  locale,
  title,
  description,
  localePaths,
  keywords = [],
}: BuildLocalizedMetadataInput): Metadata => {
  const canonical = makeAbsoluteUrl(localePaths[locale]);
  const localeInfo = localeMetadata[locale];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(localePaths),
    },
    openGraph: {
      type: 'website',
      locale: localeInfo.openGraphLocale,
      url: canonical,
      title,
      description,
      siteName: siteConfig.siteName,
      images: [
        {
          url: makeAbsoluteUrl('/og-default.svg'),
          width: 1200,
          height: 630,
          alt: `${siteConfig.siteName} - Open Graph`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: siteConfig.social.twitter,
      images: [makeAbsoluteUrl('/og-default.svg')],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
};
