import Link from 'next/link';
import { Suspense } from 'react';
import { BrandLogo } from '@/components/layout/brand-logo';
import { Container } from '@/components/layout/container';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { getDictionary } from '@/lib/i18n/dictionary';
import { localizePath, type AppLocale } from '@/lib/i18n/config';
import { siteConfig } from '@/lib/site-config';

type SiteHeaderProps = Readonly<{
  locale?: AppLocale;
}>;

export function SiteHeader({ locale = 'pt-br' }: SiteHeaderProps) {
  const dictionary = getDictionary(locale);

  const navLinks = [
    { href: '/tools', label: dictionary.common.tools },
    { href: '/about', label: dictionary.common.about },
    { href: '/contact', label: dictionary.common.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <Container className="py-3 md:py-0">
        <div className="flex min-h-16 flex-col gap-3 md:flex-row md:items-center md:gap-6">
          <div className="flex items-center justify-between gap-4">
            <Link
              href={localizePath(locale, '/')}
              className="flex shrink-0 items-center gap-3 rounded-lg pr-1"
              aria-label={dictionary.header.goHomeAriaLabel || `Go to ${siteConfig.siteName}`}
            >
              <BrandLogo priority size={36} imageClassName="h-9 w-9" />
              <span className="text-base font-bold tracking-tight text-slate-950 sm:text-lg">
                {siteConfig.siteName}
              </span>
            </Link>

            <div className="md:hidden">
              <Suspense fallback={<div className="h-9 w-16 rounded-lg bg-slate-100" />}>
                <LanguageSwitcher
                  currentLocale={locale}
                  label={dictionary.languageSwitcherLabel}
                />
              </Suspense>
            </div>
          </div>

          <nav
            aria-label={dictionary.header.navLabel}
            className="-mx-1 min-w-0 flex-1 md:mx-0"
          >
            <div className="flex items-center gap-1 overflow-x-auto px-1 pb-0.5 md:justify-end md:overflow-visible md:px-0 md:pb-0">
              {navLinks.map(({ href, label }, index) => (
                <Link
                  key={href}
                  href={localizePath(locale, href)}
                  className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                    index === 0
                      ? 'bg-brand-50 text-brand-700 hover:bg-brand-100 hover:text-brand-800'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="hidden shrink-0 border-l border-slate-200 pl-4 md:block">
            <Suspense fallback={<div className="h-9 w-16 rounded-lg bg-slate-100" />}>
              <LanguageSwitcher
                currentLocale={locale}
                label={dictionary.languageSwitcherLabel}
              />
            </Suspense>
          </div>
        </div>
      </Container>
    </header>
  );
}
