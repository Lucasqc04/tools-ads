import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { JsonLd } from '@/components/shared/json-ld';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { organizationJsonLd, buildWebsiteJsonLd } from '@/lib/json-ld';
import { buildLocalePathMap, localeMetadata, locales } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { resolveLocale } from '@/lib/i18n/resolve-locale';
import { buildLocalizedMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';

export const dynamicParams = false;

const ADSENSE_CLIENT_ID = 'ca-pub-7845590634125025';
const ADSENSE_SCRIPT_SRC =
  'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7845590634125025';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type LocaleLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}>;

export const viewport: Viewport = {
  themeColor: '#1d67d6',
};

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);

  const localizedMeta = buildLocalizedMetadata({
    locale,
    title: `${siteConfig.siteName} | ${dictionary.seo.siteDefaultTitle}`,
    description: dictionary.seo.siteDefaultDescription,
    localePaths: buildLocalePathMap('/'),
  });

  return {
    ...localizedMeta,
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.siteName} | ${dictionary.seo.siteDefaultTitle}`,
      template: `%s | ${siteConfig.siteName}`,
    },
    applicationName: siteConfig.siteName,
    manifest: '/site.webmanifest',
    icons: {
      icon: [
        { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
      ],
      shortcut: '/favicon.ico',
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    },
    appleWebApp: {
      title: siteConfig.siteName,
    },
    verification: {
      google: 'cRhqoljDPEALmSgabr8emNGbUeWjHqUUbv_rmZ5r1jI',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  return (
    <html lang={localeMetadata[locale].htmlLang}>
      <head>
        <meta name="google-adsense-account" content={ADSENSE_CLIENT_ID} />
        <script async src={ADSENSE_SCRIPT_SRC} crossOrigin="anonymous"></script>
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <div className="flex min-h-screen flex-col">
          <JsonLd data={organizationJsonLd} />
          <JsonLd data={buildWebsiteJsonLd(locale)} />

          <SiteHeader locale={locale} />
          <div className="flex-1">{children}</div>
          <SiteFooter locale={locale} />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
