import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import {
  defaultLocale,
  detectLocaleFromAcceptLanguage,
  getLocaleFromPathname,
  isValidLocale,
  localizePath,
  localeCookieName,
  localeRedirectCookieName,
  type AppLocale,
} from '@/lib/i18n/config';
import { siteConfig } from '@/lib/site-config';

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;
const canonicalUrl = new URL(siteConfig.url);
const legacyHosts = new Set(['lucasqc.com', 'www.lucasqc.com']);

const persistLocaleCookies = (response: NextResponse, locale: AppLocale) => {
  response.cookies.set(localeCookieName, locale, {
    path: '/',
    maxAge: ONE_YEAR_IN_SECONDS,
    sameSite: 'lax',
  });

  response.cookies.set(localeRedirectCookieName, '1', {
    path: '/',
    maxAge: ONE_YEAR_IN_SECONDS,
    sameSite: 'lax',
  });
};

export function middleware(request: NextRequest) {
  const forwardedHost = request.headers.get('x-forwarded-host');
  const requestHost = (forwardedHost ?? request.headers.get('host') ?? request.nextUrl.host)
    .split(',')[0]
    ?.trim()
    .split(':')[0]
    ?.toLowerCase();

  if (requestHost && legacyHosts.has(requestHost)) {
    const canonicalRequestUrl = request.nextUrl.clone();
    canonicalRequestUrl.protocol = canonicalUrl.protocol;
    canonicalRequestUrl.hostname = canonicalUrl.hostname;
    canonicalRequestUrl.port = canonicalUrl.port;
    return NextResponse.redirect(canonicalRequestUrl, 308);
  }

  const pathname = request.nextUrl.pathname;
  const localeInPath = getLocaleFromPathname(pathname);

  if (localeInPath) {
    return NextResponse.next();
  }

  const cookieLocale = request.cookies.get(localeCookieName)?.value;
  const hasRedirectCookie = Boolean(request.cookies.get(localeRedirectCookieName)?.value);

  const preferredLocale: AppLocale = (() => {
    if (cookieLocale && isValidLocale(cookieLocale)) {
      return cookieLocale;
    }

    if (hasRedirectCookie) {
      return defaultLocale;
    }

    return detectLocaleFromAcceptLanguage(request.headers.get('accept-language'));
  })();

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = localizePath(preferredLocale, pathname);

  const response = NextResponse.redirect(redirectUrl);
  persistLocaleCookies(response, preferredLocale);

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
