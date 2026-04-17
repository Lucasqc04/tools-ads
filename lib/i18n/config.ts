export const locales = ['pt-br', 'en', 'es'] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = 'en';

export const localeCookieName = 'NEXT_LOCALE';
export const localeRedirectCookieName = 'LOCALE_REDIRECTED';

export const localeMetadata: Record<
  AppLocale,
  {
    htmlLang: string;
    hreflang: string;
    openGraphLocale: string;
    label: string;
  }
> = {
  'pt-br': {
    htmlLang: 'pt-BR',
    hreflang: 'pt-br',
    openGraphLocale: 'pt_BR',
    label: 'Português',
  },
  en: {
    htmlLang: 'en',
    hreflang: 'en',
    openGraphLocale: 'en_US',
    label: 'English',
  },
  es: {
    htmlLang: 'es',
    hreflang: 'es',
    openGraphLocale: 'es_ES',
    label: 'Español',
  },
};

export const isValidLocale = (value: string): value is AppLocale =>
  locales.includes(value as AppLocale);

export const normalizeLocaleToken = (value: string): AppLocale | null => {
  const normalized = value.toLowerCase();

  if (normalized.startsWith('pt')) {
    return 'pt-br';
  }

  if (normalized.startsWith('es')) {
    return 'es';
  }

  if (normalized.startsWith('en')) {
    return 'en';
  }

  return null;
};

export const detectLocaleFromAcceptLanguage = (
  acceptLanguageHeader: string | null,
): AppLocale => {
  if (!acceptLanguageHeader) {
    return defaultLocale;
  }

  const candidates = acceptLanguageHeader
    .split(',')
    .map((chunk) => {
      const [languagePart, qualityPart] = chunk.trim().split(';q=');
      const quality = Number(qualityPart ?? '1');

      return {
        language: languagePart.trim(),
        quality: Number.isFinite(quality) ? quality : 0,
      };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const candidate of candidates) {
    const detected = normalizeLocaleToken(candidate.language);

    if (detected) {
      return detected;
    }
  }

  return defaultLocale;
};

export const stripLocaleFromPathname = (pathname: string): string => {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (!firstSegment || !isValidLocale(firstSegment)) {
    return pathname === '' ? '/' : pathname;
  }

  const rest = segments.slice(1).join('/');
  return rest ? `/${rest}` : '/';
};

export const getLocaleFromPathname = (pathname: string): AppLocale | null => {
  const firstSegment = pathname.split('/').filter(Boolean)[0];

  if (!firstSegment || !isValidLocale(firstSegment)) {
    return null;
  }

  return firstSegment;
};

export const localizePath = (locale: AppLocale, path: string): string => {
  const normalized = path.startsWith('/') ? path : `/${path}`;

  if (normalized === '/') {
    return `/${locale}`;
  }

  const withoutLocale = stripLocaleFromPathname(normalized);
  return `/${locale}${withoutLocale}`;
};

export const buildLocalePathMap = (
  path: string,
): Record<AppLocale, string> => ({
  'pt-br': localizePath('pt-br', path),
  en: localizePath('en', path),
  es: localizePath('es', path),
});
