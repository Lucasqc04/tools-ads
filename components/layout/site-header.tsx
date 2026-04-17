import Link from 'next/link';
import { BrandLogo } from '@/components/layout/brand-logo';
import { Container } from '@/components/layout/container';
import { siteConfig } from '@/lib/site-config';

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
      <Container className="flex min-h-16 flex-wrap items-center gap-x-4 gap-y-2 py-3 md:h-16 md:flex-nowrap md:py-0">
        <Link
          href="/"
          className="shrink-0"
          aria-label={`Ir para ${siteConfig.siteName}`}
        >
          <BrandLogo priority />
        </Link>

        <nav
          aria-label="Navegação principal"
          className="ml-auto flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-sm font-medium text-slate-700"
        >
          <Link href="/tools">Ferramentas</Link>
          <Link href="/about">Sobre</Link>
          <Link href="/contact">Contato</Link>
        </nav>
      </Container>
    </header>
  );
}
