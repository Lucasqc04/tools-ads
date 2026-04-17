import { makeAbsoluteUrl, siteConfig } from '@/lib/site-config';
import type { FaqItem } from '@/types/content';

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.siteName,
  url: siteConfig.url,
  logo: makeAbsoluteUrl('/og-default.svg'),
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: siteConfig.contactEmail,
  },
};

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.siteName,
  url: siteConfig.url,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteConfig.url}/tools?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export const buildBreadcrumbJsonLd = (
  items: Array<{ name: string; path: string }>,
) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: makeAbsoluteUrl(item.path),
  })),
});

export const buildFaqJsonLd = (faq: FaqItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
});

export const buildToolWebPageJsonLd = (input: {
  name: string;
  description: string;
  path: string;
  keywords: string[];
}) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: input.name,
  description: input.description,
  url: makeAbsoluteUrl(input.path),
  inLanguage: 'pt-BR',
  keywords: input.keywords.join(', '),
  isPartOf: {
    '@type': 'WebSite',
    name: siteConfig.siteName,
    url: siteConfig.url,
  },
});

export const buildSoftwareApplicationJsonLd = (input: {
  name: string;
  description: string;
  path: string;
  category: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: input.name,
  description: input.description,
  applicationCategory: input.category,
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  url: makeAbsoluteUrl(input.path),
});
