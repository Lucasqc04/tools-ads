import Link from 'next/link';
import { Suspense } from 'react';
import { BrandLogo } from '@/components/layout/brand-logo';
import { Container } from '@/components/layout/container';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { getDictionary } from '@/lib/i18n/dictionary';
import { localizePath, type AppLocale } from '@/lib/i18n/config';
import { siteConfig } from '@/lib/site-config';

type SiteHeaderProps = {
  locale?: AppLocale;
};

export function SiteHeader({ locale = 'pt-br' }: SiteHeaderProps) {
  const dictionary = getDictionary(locale);

  const navLinks = [
    { href: '/tools', label: dictionary.common.tools },
    { href: '/about', label: dictionary.common.about },
    { href: '/contact', label: dictionary.common.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
      <Container className="flex h-14 items-center gap-4 md:h-16">
        <Link
          href={localizePath(locale, '/')}
          className="flex shrink-0 items-center gap-2.5"
          aria-label={dictionary.header.goHomeAriaLabel || `Go to ${siteConfig.siteName}`}
        >
          <BrandLogo priority size={32} imageClassName="h-8 w-8" />
          <span className="hidden text-sm font-bold tracking-tight text-slate-900 sm:inline">
            {siteConfig.siteName}
          </span>
        </Link>

        <nav
          aria-label={dictionary.header.navLabel}
          className="ml-auto flex items-center gap-0.5"
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={localizePath(locale, href)}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-l border-slate-200 pl-3">
          <Suspense fallback={<div className="h-8 w-16 rounded-lg bg-slate-100" />}>
            <LanguageSwitcher
              currentLocale={locale}
              label={dictionary.languageSwitcherLabel}
            />
          </Suspense>
        </div>
      </Container>
    </header>
  );
}
