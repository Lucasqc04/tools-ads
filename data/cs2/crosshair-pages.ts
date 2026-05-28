import { localizePath, type AppLocale } from '@/lib/i18n/config';

export const cs2CrosshairToolSlugByLocale: Record<AppLocale, string> = {
  'pt-br': 'codigos-de-mira-cs2',
  en: 'cs2-crosshair-codes',
  es: 'codigos-de-mira-cs2',
};

export const cs2CrosshairToolRouteSlugs = [
  'cs2-crosshair-codes',
  'codigos-de-mira-cs2',
] as const;

export type Cs2CrosshairToolRouteSlug = (typeof cs2CrosshairToolRouteSlugs)[number];

export const isCs2CrosshairToolRouteSlug = (
  slug: string,
): slug is Cs2CrosshairToolRouteSlug =>
  cs2CrosshairToolRouteSlugs.includes(slug as Cs2CrosshairToolRouteSlug);

export const getCs2CrosshairToolSlugForLocale = (locale: AppLocale): string =>
  cs2CrosshairToolSlugByLocale[locale];

export const getCs2CrosshairToolBasePathForLocale = (locale: AppLocale): string =>
  `/tools/${getCs2CrosshairToolSlugForLocale(locale)}`;

export const getCs2CrosshairToolPathForLocale = (locale: AppLocale): string =>
  localizePath(locale, getCs2CrosshairToolBasePathForLocale(locale));

export const getCs2CrosshairLocalePathMap = (): Record<AppLocale, string> => ({
  'pt-br': getCs2CrosshairToolPathForLocale('pt-br'),
  en: getCs2CrosshairToolPathForLocale('en'),
  es: getCs2CrosshairToolPathForLocale('es'),
});
