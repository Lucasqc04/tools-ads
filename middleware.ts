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

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

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
  const pathname = request.nextUrl.pathname;
  const localeInPath = getLocaleFromPathname(pathname);

  if (localeInPath) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-locale', localeInPath);

    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    const cookieLocale = request.cookies.get(localeCookieName)?.value;

    if (cookieLocale !== localeInPath) {
      persistLocaleCookies(response, localeInPath);
    }

    return response;
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
