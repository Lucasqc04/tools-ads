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
  ogImages: string[];
  twitterImages: string[];
  manifest: string;
  robots: string;
  themeColor: string;
  author: string;
  publishedTime: string;
  modifiedTime: string;
  language: string;
  htmlLang: string;
  verification: Array<{ name: string; value: string }>;
  appLinks: Array<{ platform: string; value: string }>;
  icons: Array<{
    rel: string;
    href: string;
    type: string;
    sizes: string;
    media: string;
    color: string;
    purpose: string;
  }>;
  alternates: Array<{
    rel: string;
    href: string;
    hreflang: string;
    type: string;
    media: string;
    title: string;
  }>;
  feeds: Array<{ title: string; type: string; href: string }>;
  allMetaTags: Array<{ key: string; value: string; source: 'name' | 'property' | 'http-equiv' | 'itemprop' }>;
  linkTagsCount: number;
  metaTagsCount: number;
  structuredDataCount: number;
};

const metaTagRegex = /<meta\s+[^>]*>/gi;
const linkTagRegex = /<link\s+[^>]*>/gi;
const htmlLangRegex = /<html[^>]*\blang\s*=\s*(["'])(.*?)\1/i;
const attrRegex = /([^\s=/>"]+)\s*=\s*(["'])(.*?)\2/gi;
const titleRegex = /<title[^>]*>([\s\S]*?)<\/title>/i;
const jsonLdRegex = /<script[^>]*type\s*=\s*(["'])application\/ld\+json\1[^>]*>[\s\S]*?<\/script>/gi;

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

const collectTagAttributes = (tag: string): Record<string, string> => {
  const attrs: Record<string, string> = {};
  const matches = Array.from(tag.matchAll(attrRegex));

  matches.forEach((match) => {
    const attrName = match[1]?.toLowerCase().trim();
    const attrValue = decodeHtmlEntities(match[3] ?? '').trim();

    if (!attrName) {
      return;
    }

    attrs[attrName] = attrValue;
  });

  return attrs;
};

const collectMeta = (
  html: string,
): {
  firstByKey: Map<string, string>;
  allByKey: Map<string, string[]>;
  allMetaTags: OpenGraphPreviewData['allMetaTags'];
} => {
  const map = new Map<string, string>();
  const allByKey = new Map<string, string[]>();
  const allMetaTags: OpenGraphPreviewData['allMetaTags'] = [];
  const tags = html.match(metaTagRegex) ?? [];

  tags.forEach((tag) => {
    const attrs = collectTagAttributes(tag);
    const content = attrs.content || attrs.href || '';
    const candidates: Array<{ source: OpenGraphPreviewData['allMetaTags'][number]['source']; key: string }> = [];

    if (attrs.property) {
      candidates.push({ source: 'property', key: attrs.property.toLowerCase() });
    }
    if (attrs.name) {
      candidates.push({ source: 'name', key: attrs.name.toLowerCase() });
    }
    if (attrs['http-equiv']) {
      candidates.push({ source: 'http-equiv', key: attrs['http-equiv'].toLowerCase() });
    }
    if (attrs.itemprop) {
      candidates.push({ source: 'itemprop', key: attrs.itemprop.toLowerCase() });
    }

    candidates.forEach((candidate) => {
      if (!candidate.key || !content) {
        return;
      }

      allMetaTags.push({ key: candidate.key, value: content, source: candidate.source });

      if (!map.has(candidate.key)) {
        map.set(candidate.key, content);
      }

      const current = allByKey.get(candidate.key) ?? [];
      current.push(content);
      allByKey.set(candidate.key, current);
    });

    if (attrs.charset) {
      allMetaTags.push({ key: 'charset', value: attrs.charset, source: 'name' });
    }
  });

  return {
    firstByKey: map,
    allByKey,
    allMetaTags,
  };
};

const getTitle = (html: string): string => {
  const match = titleRegex.exec(html);
  return decodeHtmlEntities(match?.[1]?.trim() ?? '');
};

const getCanonical = (html: string, baseUrl: string): string => {
  const linkTags = html.match(linkTagRegex) ?? [];

  for (const tag of linkTags) {
    const attrs = collectTagAttributes(tag);
    const rel = (attrs.rel ?? '').toLowerCase();
    const href = attrs.href ?? '';

    if (rel === 'canonical' && href) {
      return safeAbsoluteUrl(href, baseUrl);
    }
  }

  return '';
};

const getFavicon = (html: string, baseUrl: string): string => {
  const icons = getIcons(html, baseUrl);
  return icons[0]?.href ?? '';
};

const getIcons = (html: string, baseUrl: string): OpenGraphPreviewData['icons'] => {
  const linkTags = html.match(linkTagRegex) ?? [];
  const icons: OpenGraphPreviewData['icons'] = [];

  linkTags.forEach((tag) => {
    const attrs = collectTagAttributes(tag);
    const rel = (attrs.rel ?? '').toLowerCase();
    const href = attrs.href ?? '';

    if ((rel.includes('icon') || rel === 'shortcut icon') && href) {
      icons.push({
        rel,
        href: safeAbsoluteUrl(href, baseUrl),
        type: attrs.type ?? '',
        sizes: attrs.sizes ?? '',
        media: attrs.media ?? '',
        color: attrs.color ?? '',
        purpose: attrs.purpose ?? '',
      });
    }
  });

  return icons;
};

const getAlternates = (html: string, baseUrl: string): OpenGraphPreviewData['alternates'] => {
  const linkTags = html.match(linkTagRegex) ?? [];

  return linkTags
    .map((tag) => collectTagAttributes(tag))
    .filter((attrs) => Boolean(attrs.rel) && Boolean(attrs.href))
    .map((attrs) => ({
      rel: attrs.rel?.toLowerCase() ?? '',
      href: safeAbsoluteUrl(attrs.href ?? '', baseUrl),
      hreflang: attrs.hreflang ?? '',
      type: attrs.type ?? '',
      media: attrs.media ?? '',
      title: attrs.title ?? '',
    }))
    .filter((item) => item.rel.includes('alternate') || item.rel === 'canonical');
};

const getFeeds = (alternates: OpenGraphPreviewData['alternates']): OpenGraphPreviewData['feeds'] =>
  alternates
    .filter((item) => item.type.includes('rss') || item.type.includes('atom') || item.type.includes('xml'))
    .map((item) => ({ title: item.title, type: item.type, href: item.href }));

const getManifest = (html: string, baseUrl: string): string => {
  const linkTags = html.match(linkTagRegex) ?? [];

  for (const tag of linkTags) {
    const attrs = collectTagAttributes(tag);
    if ((attrs.rel ?? '').toLowerCase() === 'manifest' && attrs.href) {
      return safeAbsoluteUrl(attrs.href, baseUrl);
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

const allValues = (map: Map<string, string[]>, keys: string[]): string[] => {
  const values: string[] = [];

  keys.forEach((key) => {
    const entries = map.get(key);
    if (!entries) {
      return;
    }

    entries.forEach((entry) => {
      if (entry && !values.includes(entry)) {
        values.push(entry);
      }
    });
  });

  return values;
};

const getHtmlLang = (html: string): string => {
  const match = htmlLangRegex.exec(html);
  return decodeHtmlEntities(match?.[2] ?? '').trim();
};

const countStructuredData = (html: string): number => Array.from(html.matchAll(jsonLdRegex)).length;

export const extractOpenGraphData = (html: string, sourceUrl: string): OpenGraphPreviewData => {
  const meta = collectMeta(html);

  const title = firstValue(meta.firstByKey, ['og:title', 'twitter:title']) || getTitle(html);
  const description =
    firstValue(meta.firstByKey, ['og:description', 'twitter:description', 'description']) || '';

  const ogImages = allValues(meta.allByKey, [
    'og:image',
    'og:image:url',
    'og:image:secure_url',
  ]).map((value) => safeAbsoluteUrl(value, sourceUrl));
  const twitterImages = allValues(meta.allByKey, ['twitter:image', 'twitter:image:src']).map((value) =>
    safeAbsoluteUrl(value, sourceUrl),
  );

  const image = safeAbsoluteUrl(
    firstValue(meta.firstByKey, ['og:image', 'og:image:url', 'twitter:image', 'twitter:image:src']),
    sourceUrl,
  );

  const canonical = getCanonical(html, sourceUrl);
  const favicon = getFavicon(html, sourceUrl);
  const icons = getIcons(html, sourceUrl);
  const alternates = getAlternates(html, sourceUrl);
  const manifest = getManifest(html, sourceUrl);
  const verificationKeys = [
    'google-site-verification',
    'msvalidate.01',
    'yandex-verification',
    'facebook-domain-verification',
    'p:domain_verify',
  ];
  const appLinkKeys = [
    'al:ios:url',
    'al:ios:app_store_id',
    'al:ios:app_name',
    'al:android:url',
    'al:android:package',
    'al:android:app_name',
    'al:web:url',
    'twitter:app:name:iphone',
    'twitter:app:id:iphone',
    'twitter:app:url:iphone',
    'twitter:app:name:googleplay',
    'twitter:app:id:googleplay',
    'twitter:app:url:googleplay',
  ];

  const verification = verificationKeys
    .map((key) => ({ name: key, value: firstValue(meta.firstByKey, [key]) }))
    .filter((item) => Boolean(item.value));

  const appLinks = appLinkKeys
    .map((key) => ({ platform: key, value: firstValue(meta.firstByKey, [key]) }))
    .filter((item) => Boolean(item.value));

  const htmlLang = getHtmlLang(html);
  const language = firstValue(meta.firstByKey, ['language']) || htmlLang;

  return {
    url: firstValue(meta.firstByKey, ['og:url']) || canonical || sourceUrl,
    title,
    description,
    image,
    siteName: firstValue(meta.firstByKey, ['og:site_name', 'application-name']) || new URL(sourceUrl).hostname,
    type: firstValue(meta.firstByKey, ['og:type']) || 'website',
    locale: firstValue(meta.firstByKey, ['og:locale']) || 'en_US',
    twitterCard: firstValue(meta.firstByKey, ['twitter:card']) || 'summary_large_image',
    twitterTitle: firstValue(meta.firstByKey, ['twitter:title']) || title,
    twitterDescription: firstValue(meta.firstByKey, ['twitter:description']) || description,
    twitterImage: safeAbsoluteUrl(firstValue(meta.firstByKey, ['twitter:image', 'twitter:image:src']), sourceUrl) || image,
    canonical,
    favicon,
    ogImages,
    twitterImages,
    manifest,
    robots: firstValue(meta.firstByKey, ['robots', 'googlebot']),
    themeColor: firstValue(meta.firstByKey, ['theme-color', 'msapplication-navbutton-color']),
    author: firstValue(meta.firstByKey, ['author', 'article:author']),
    publishedTime: firstValue(meta.firstByKey, [
      'article:published_time',
      'og:published_time',
      'date',
    ]),
    modifiedTime: firstValue(meta.firstByKey, ['article:modified_time', 'og:updated_time']),
    language,
    htmlLang,
    verification,
    appLinks,
    icons,
    alternates,
    feeds: getFeeds(alternates),
    allMetaTags: meta.allMetaTags,
    linkTagsCount: (html.match(linkTagRegex) ?? []).length,
    metaTagsCount: (html.match(metaTagRegex) ?? []).length,
    structuredDataCount: countStructuredData(html),
  };
};
