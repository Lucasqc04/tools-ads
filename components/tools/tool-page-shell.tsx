import type { ReactNode } from 'react';
import { Container } from '@/components/layout/container';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { ContentBlocks } from '@/components/shared/content-blocks';
import { Faq } from '@/components/shared/faq';
import { RelatedTools } from '@/components/shared/related-tools';
import { TrustNote } from '@/components/shared/trust-note';
import { localizePath, type AppLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import type { ToolDefinition } from '@/types/tool';

type ToolPageShellProps = {
  tool: ToolDefinition;
  relatedTools: ToolDefinition[];
  toolUi: ReactNode;
  afterToolSection?: ReactNode;
  locale?: AppLocale;
};

export function ToolPageShell({
  tool,
  relatedTools,
  toolUi,
  afterToolSection,
  locale = 'pt-br',
}: ToolPageShellProps) {
  const dictionary = getDictionary(locale);

  return (
    <Container className="py-8 md:py-10">
      <Breadcrumbs
        items={[
          { name: dictionary.common.home, href: localizePath(locale, '/') },
          { name: dictionary.common.tools, href: localizePath(locale, '/tools') },
          { name: tool.name },
        ]}
      />

      <header className="max-w-reading space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">{tool.h1}</h1>
        <p className="text-base leading-7 text-slate-700 md:text-lg">{tool.intro}</p>
      </header>

      <div className="mt-8">
        <main className="space-y-8">
          <section aria-labelledby="tool-interface-title" className="space-y-3">
            <h2 id="tool-interface-title" className="text-2xl font-bold tracking-tight text-slate-900">
              {dictionary.toolShell.useToolTitle}
            </h2>
            {toolUi}
          </section>

          {afterToolSection ? afterToolSection : null}

          {/* Ads temporariamente desativados
          <div className="flex justify-center">
            <MediumRectangleAd />
          </div>
          */}

          <ContentBlocks
            blocks={tool.contentBlocks}
            title={dictionary.toolShell.contentTitle}
          />

          <Faq items={tool.faq} title={dictionary.toolShell.faqTitle} />

          <RelatedTools tools={relatedTools} locale={locale} />

          <TrustNote
            title={dictionary.toolShell.trustTitle}
            text={dictionary.toolShell.trustText}
          />
        </main>
      </div>

    </Container>
  );
}
