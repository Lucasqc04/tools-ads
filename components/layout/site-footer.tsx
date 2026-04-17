import Link from 'next/link';
import { BrandLogo } from '@/components/layout/brand-logo';
import { Container } from '@/components/layout/container';
import { siteConfig } from '@/lib/site-config';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <Container className="py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl space-y-3">
            <Link href="/" aria-label={`Ir para ${siteConfig.siteName}`} className="inline-flex">
              <BrandLogo />
            </Link>
            <p className="text-sm text-slate-600">{siteConfig.tagline}</p>
          </div>

          <nav aria-label="Links institucionais" className="grid gap-2 text-sm text-slate-700">
            <Link href="/about">Sobre</Link>
            <Link href="/contact">Contato</Link>
            <Link href="/privacy-policy">Política de Privacidade</Link>
            <Link href="/terms">Termos de Uso</Link>
          </nav>
        </div>

        <p className="mt-8 text-xs text-slate-500">© {year} {siteConfig.siteName}. Todos os direitos reservados.</p>
      </Container>
    </footer>
  );
}
