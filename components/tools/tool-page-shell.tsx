import type { ReactNode } from 'react';
import { ToolViewTracker } from '@/components/analytics/tool-view-tracker';
import { Container } from '@/components/layout/container';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { ContentBlocks } from '@/components/shared/content-blocks';
import { Faq } from '@/components/shared/faq';
import { RelatedTools } from '@/components/shared/related-tools';
import { TrustNote } from '@/components/shared/trust-note';
import { ZhTranslationNotice } from '@/components/shared/zh-translation-notice';
import { ToolAliasLinks } from '@/components/tools/tool-alias-links';
import {
  getRelatedToolAliasPages,
  toLocalizedToolAliasLink,
} from '@/data/tool-alias-pages';
import { localizePath, type AppLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import type { ToolDefinition } from '@/types/tool';

type ToolPageShellProps = {
  tool: ToolDefinition;
  relatedTools: ToolDefinition[];
  toolUi: ReactNode;
  beforeToolSection?: ReactNode;
  afterToolSection?: ReactNode;
  afterContentSection?: ReactNode;
  locale?: AppLocale;
};

export function ToolPageShell({
  tool,
  relatedTools,
  toolUi,
  beforeToolSection,
  afterToolSection,
  afterContentSection,
  locale = 'pt-br',
}: ToolPageShellProps) {
  const dictionary = getDictionary(locale);
  const toolsPrefix = `/${locale}/tools/`;
  const toolPathRemainder = tool.canonicalPath.startsWith(toolsPrefix)
    ? tool.canonicalPath.slice(toolsPrefix.length)
    : '';
  const isCanonicalToolRoute = Boolean(toolPathRemainder) && !toolPathRemainder.includes('/');
  const intentLinks = isCanonicalToolRoute && !afterToolSection
    ? getRelatedToolAliasPages(tool.slug, '', locale, 2).map((page) =>
        toLocalizedToolAliasLink(page, locale),
      )
    : [];

  const intentSectionCopy: Record<AppLocale, { title: string; description: string }> = {
    'pt-br': {
      title: 'Tarefas especificas com esta ferramenta',
      description: 'Atalhos para usos frequentes com o mesmo fluxo completo.',
    },
    en: {
      title: 'Specific tasks with this tool',
      description: 'Shortcuts to common tasks using the same complete workflow.',
    },
    es: {
      title: 'Tareas especificas con esta herramienta',
      description: 'Atajos para usos frecuentes con el mismo flujo completo.',
    },
    zh: {
      title: '使用该工具的具体任务',
      description: '针对常见用途的快捷入口,使用相同的完整流程。',
    },
  };
  const trustNoteByToolId: Partial<Record<string, Record<AppLocale, { title: string; text: string }>>> = {
    'zpl-label-editor': {
      'pt-br': {
        title: 'Privacidade e renderização de etiquetas',
        text: 'O lote e o rascunho ficam neste navegador. Para obter preview e PDF compatíveis com ZPL, a etiqueta em processamento é enviada ao renderizador; o conteúdo das etiquetas não é incluído nos eventos de análise.',
      },
      en: {
        title: 'Privacy and label rendering',
        text: 'The batch and draft stay in this browser. To produce ZPL-compatible previews and PDFs, the label being processed is sent to the renderer; label content is not included in analytics events.',
      },
      es: {
        title: 'Privacidad y renderización de etiquetas',
        text: 'El lote y borrador permanecen en este navegador. Para generar previews y PDF compatibles con ZPL, la etiqueta en proceso se envía al renderizador; el contenido no se incluye en eventos analíticos.',
      },
      zh: {
        title: 'Privacy and label rendering',
        text: 'The batch and draft stay in this browser. To produce ZPL-compatible previews and PDFs, the label being processed is sent to the renderer; label content is not included in analytics events.',
      },
    },
  };
  const trustNote = trustNoteByToolId[tool.id]?.[locale] ?? {
    title: dictionary.toolShell.trustTitle,
    text: dictionary.toolShell.trustText,
  };

  return (
    <Container className="py-5 md:py-8">
      <ToolViewTracker toolId={tool.id} locale={locale} />
      <Breadcrumbs
        items={[
          { name: dictionary.common.home, href: localizePath(locale, '/') },
          { name: dictionary.common.tools, href: localizePath(locale, '/tools') },
          { name: tool.name },
        ]}
      />

      <header className="max-w-reading space-y-2">
        <h1 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl md:text-4xl">{tool.h1}</h1>
        <p className="text-sm leading-6 text-slate-700 md:text-base md:leading-7">{tool.intro}</p>
      </header>

      <div className="mt-6 md:mt-8">
        <ZhTranslationNotice locale={locale} toolId={tool.id} />

        {beforeToolSection ? <div className="mb-6 md:mb-8">{beforeToolSection}</div> : null}

        <main className="space-y-6 md:space-y-8">
          <section aria-labelledby="tool-interface-title" className="space-y-3">
            <h2 id="tool-interface-title" className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
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

          <RelatedTools
            tools={relatedTools.slice(0, intentLinks.length ? 2 : 4)}
            locale={locale}
          />

          <ToolAliasLinks
            title={intentSectionCopy[locale].title}
            description={intentSectionCopy[locale].description}
            links={intentLinks}
          />

          {afterContentSection ? afterContentSection : null}

          <TrustNote
            title={trustNote.title}
            text={trustNote.text}
          />
        </main>
      </div>

    </Container>
  );
}
