import type { Metadata } from 'next';
import { makeAbsoluteUrl, siteConfig } from '@/lib/site-config';

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
