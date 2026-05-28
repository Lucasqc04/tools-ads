export type OpenGraphPreviewData = {
  url: string;
  title: string;
  description: string;
  image: string;
  siteName: string;
  type: string;
  locale: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  canonical: string;
  favicon: string;
};

const metaTagRegex = /<meta\s+[^>]*>/gi;
const attrRegex = /(property|name|content|href|rel)\s*=\s*(["'])(.*?)\2/gi;
const titleRegex = /<title[^>]*>([\s\S]*?)<\/title>/i;
const linkTagRegex = /<link\s+[^>]*>/gi;

const decodeHtmlEntities = (value: string): string =>
  value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');

const safeAbsoluteUrl = (candidate: string, baseUrl: string): string => {
  if (!candidate.trim()) {
    return '';
  }

  try {
    return new URL(candidate, baseUrl).toString();
  } catch {
    return candidate;
  }
};

const collectMeta = (html: string): Map<string, string> => {
  const map = new Map<string, string>();
  const tags = html.match(metaTagRegex) ?? [];

  tags.forEach((tag) => {
    let key = '';
    let value = '';
    const attrs = Array.from(tag.matchAll(attrRegex));

    attrs.forEach((match) => {
      const attrName = match[1]?.toLowerCase();
      const attrValue = decodeHtmlEntities(match[3] ?? '').trim();

      if (!attrName) {
        return;
      }

      if (attrName === 'property' || attrName === 'name') {
        key = attrValue.toLowerCase();
      }

      if (attrName === 'content' || attrName === 'href') {
        value = attrValue;
      }
    });

    if (key && value && !map.has(key)) {
      map.set(key, value);
    }
  });

  return map;
};

const getTitle = (html: string): string => {
  const match = html.match(titleRegex);
  return decodeHtmlEntities(match?.[1]?.trim() ?? '');
};

const getCanonical = (html: string, baseUrl: string): string => {
  const linkTags = html.match(linkTagRegex) ?? [];

  for (const tag of linkTags) {
    const attrs = Array.from(tag.matchAll(attrRegex));
    let rel = '';
    let href = '';

    attrs.forEach((match) => {
      const attrName = match[1]?.toLowerCase();
      const attrValue = decodeHtmlEntities(match[3] ?? '').trim();

      if (!attrName) {
        return;
      }

      if (attrName === 'rel') {
        rel = attrValue.toLowerCase();
      }

      if (attrName === 'href') {
        href = attrValue;
      }
    });

    if (rel === 'canonical' && href) {
      return safeAbsoluteUrl(href, baseUrl);
    }
  }

  return '';
};

const getFavicon = (html: string, baseUrl: string): string => {
  const linkTags = html.match(linkTagRegex) ?? [];

  for (const tag of linkTags) {
    const attrs = Array.from(tag.matchAll(attrRegex));
    let rel = '';
    let href = '';

    attrs.forEach((match) => {
      const attrName = match[1]?.toLowerCase();
      const attrValue = decodeHtmlEntities(match[3] ?? '').trim();

      if (!attrName) {
        return;
      }

      if (attrName === 'rel') {
        rel = attrValue.toLowerCase();
      }

      if (attrName === 'href') {
        href = attrValue;
      }
    });

    if ((rel.includes('icon') || rel === 'shortcut icon') && href) {
      return safeAbsoluteUrl(href, baseUrl);
    }
  }

  return '';
};

const firstValue = (map: Map<string, string>, keys: string[]): string => {
  for (const key of keys) {
    const value = map.get(key);
    if (value) {
      return value;
    }
  }

  return '';
};

export const extractOpenGraphData = (html: string, sourceUrl: string): OpenGraphPreviewData => {
  const meta = collectMeta(html);

  const title = firstValue(meta, ['og:title', 'twitter:title']) || getTitle(html);
  const description =
    firstValue(meta, ['og:description', 'twitter:description', 'description']) || '';

  const image = safeAbsoluteUrl(
    firstValue(meta, ['og:image', 'twitter:image']),
    sourceUrl,
  );

  const canonical = getCanonical(html, sourceUrl);
  const favicon = getFavicon(html, sourceUrl);

  return {
    url: firstValue(meta, ['og:url']) || canonical || sourceUrl,
    title,
    description,
    image,
    siteName: firstValue(meta, ['og:site_name']) || new URL(sourceUrl).hostname,
    type: firstValue(meta, ['og:type']) || 'website',
    locale: firstValue(meta, ['og:locale']) || 'en_US',
    twitterCard: firstValue(meta, ['twitter:card']) || 'summary_large_image',
    twitterTitle: firstValue(meta, ['twitter:title']) || title,
    twitterDescription: firstValue(meta, ['twitter:description']) || description,
    twitterImage: safeAbsoluteUrl(firstValue(meta, ['twitter:image']), sourceUrl) || image,
    canonical,
    favicon,
  };
};
