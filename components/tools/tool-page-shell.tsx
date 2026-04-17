import type { ReactNode } from 'react';
import { AdSlotFooter } from '@/components/ads/ad-slot-footer';
import { AdSlotInContent } from '@/components/ads/ad-slot-in-content';
import { AdSlotSidebar } from '@/components/ads/ad-slot-sidebar';
import { AdSlotTop } from '@/components/ads/ad-slot-top';
import { Container } from '@/components/layout/container';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { ContentBlocks } from '@/components/shared/content-blocks';
import { Faq } from '@/components/shared/faq';
import { RelatedTools } from '@/components/shared/related-tools';
import { TrustNote } from '@/components/shared/trust-note';
import type { ToolDefinition } from '@/types/tool';

type ToolPageShellProps = {
  tool: ToolDefinition;
  relatedTools: ToolDefinition[];
  toolUi: ReactNode;
  afterToolSection?: ReactNode;
};

export function ToolPageShell({
  tool,
  relatedTools,
  toolUi,
  afterToolSection,
}: ToolPageShellProps) {
  return (
    <Container className="py-8 md:py-10">
      <Breadcrumbs
        items={[
          { name: 'Home', href: '/' },
          { name: 'Ferramentas', href: '/tools' },
          { name: tool.name },
        ]}
      />

      <header className="max-w-reading space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">{tool.h1}</h1>
        <p className="text-base leading-7 text-slate-700 md:text-lg">{tool.intro}</p>
      </header>

      <div className="mt-6">
        <AdSlotTop />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <main className="space-y-8">
          <section aria-labelledby="tool-interface-title" className="space-y-3">
            <h2 id="tool-interface-title" className="text-2xl font-bold tracking-tight text-slate-900">
              Use a ferramenta
            </h2>
            {toolUi}
          </section>

          {afterToolSection ? afterToolSection : null}

          <AdSlotInContent />

          <ContentBlocks blocks={tool.contentBlocks} />

          <Faq items={tool.faq} />

          <RelatedTools tools={relatedTools} />

          <TrustNote
            title="Privacidade e processamento local"
            text="As ferramentas desta página rodam no navegador e não enviam o conteúdo digitado para backend. Isso melhora privacidade, reduz latência e ajuda na experiência mobile."
          />

          <AdSlotFooter />
        </main>

        <aside className="hidden lg:block" aria-label="Área de anúncio lateral">
          <AdSlotSidebar />
        </aside>
      </div>
    </Container>
  );
}
