import Link from 'next/link';
import { BrandLogo } from '@/components/layout/brand-logo';
import { Container } from '@/components/layout/container';
import { localizePath, type AppLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { siteConfig } from '@/lib/site-config';

type SiteFooterProps = {
  locale?: AppLocale;
};

export function SiteFooter({ locale = 'pt-br' }: SiteFooterProps) {
  const year = new Date().getFullYear();
  const dictionary = getDictionary(locale);

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <Container className="py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl space-y-3">
            <Link
              href={localizePath(locale, '/')}
              aria-label={dictionary.footer.goHomeAriaLabel}
              className="inline-flex"
            >
              <BrandLogo />
            </Link>
            <p className="text-sm text-slate-600">{dictionary.footer.tagline}</p>
          </div>

          <nav aria-label={dictionary.footer.navLabel} className="grid gap-2 text-sm text-slate-700">
            <Link href={localizePath(locale, '/about')}>{dictionary.common.about}</Link>
            <Link href={localizePath(locale, '/contact')}>{dictionary.common.contact}</Link>
            <Link href={localizePath(locale, '/privacy-policy')}>
              {dictionary.common.privacyPolicy}
            </Link>
            <Link href={localizePath(locale, '/terms')}>{dictionary.common.terms}</Link>
          </nav>
        </div>

        <p className="mt-8 text-xs text-slate-500">
          © {year} {siteConfig.siteName}. {dictionary.footer.rightsReserved}
        </p>
      </Container>
    </footer>
  );
}
