import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/shared/json-ld';
import { OpenGraphPreviewTool } from '@/components/tools/open-graph-preview-tool';
import { ToolAliasLinks } from '@/components/tools/tool-alias-links';
import { ToolPageShell } from '@/components/tools/tool-page-shell';
import { getRelatedToolAliasPages, toLocalizedToolAliasLink } from '@/data/tool-alias-pages';
import { getLocalizedRelatedTools, getLocalizedToolBySlug } from '@/data/tools-registry';
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildSoftwareApplicationJsonLd,
  buildToolWebPageJsonLd,
} from '@/lib/json-ld';
import { buildLocalePathMap, localizePath, type AppLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { resolveLocale } from '@/lib/i18n/resolve-locale';
import { buildLocalizedMetadata } from '@/lib/seo';

const toolSlug = 'open-graph-preview';

type PageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

const aliasSectionByLocale: Record<AppLocale, { title: string; description: string }> = {
  'pt-br': {
    title: 'Recomendacoes de buscas relacionadas',
    description: 'Atalhos para variacoes como preview de WhatsApp, Twitter Card e gerador de meta tags.',
  },
  en: {
    title: 'Related search recommendations',
    description: 'Shortcuts for WhatsApp preview, Twitter Card preview, and meta tag generator intents.',
  },
  es: {
    title: 'Recomendaciones de busqueda relacionadas',
    description: 'Atajos para preview de WhatsApp, Twitter Card y generador de meta tags.',
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);
  const tool = getLocalizedToolBySlug(locale, toolSlug);

  return buildLocalizedMetadata({
    locale,
    title: tool?.seoTitle ?? `${dictionary.common.tools} | ${dictionary.seo.siteDefaultTitle}`,
    description: tool?.seoDescription ?? dictionary.seo.tools.description,
    localePaths: buildLocalePathMap('/tools/open-graph-preview'),
    keywords: tool ? [tool.primaryKeyword, ...tool.secondaryKeywords] : dictionary.seo.tools.keywords,
  });
}

export default async function OpenGraphPreviewPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);
  const tool = getLocalizedToolBySlug(locale, toolSlug);

  if (!tool) {
    notFound();
  }

  const related = getLocalizedRelatedTools(locale, tool.id);
  const aliasLinks = getRelatedToolAliasPages(toolSlug, '', 4).map((page) =>
    toLocalizedToolAliasLink(page, locale),
  );

  return (
    <>
      <JsonLd
        data={buildToolWebPageJsonLd({
          name: tool.name,
          description: tool.seoDescription,
          path: tool.canonicalPath,
          locale,
          keywords: [tool.primaryKeyword, ...tool.secondaryKeywords],
        })}
      />
      <JsonLd
        data={buildSoftwareApplicationJsonLd({
          name: tool.name,
          description: tool.seoDescription,
          path: tool.canonicalPath,
          category: 'DeveloperApplication',
        })}
      />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: dictionary.common.home, path: localizePath(locale, '/') },
          { name: dictionary.common.tools, path: localizePath(locale, '/tools') },
          { name: tool.name, path: tool.canonicalPath },
        ])}
      />
      <JsonLd data={buildFaqJsonLd(tool.faq)} />

      <ToolPageShell
        locale={locale}
        tool={tool}
        relatedTools={related}
        toolUi={<OpenGraphPreviewTool locale={locale} />}
        afterContentSection={
          <ToolAliasLinks
            title={aliasSectionByLocale[locale].title}
            description={aliasSectionByLocale[locale].description}
            links={aliasLinks}
          />
        }
      />
    </>
  );
}
