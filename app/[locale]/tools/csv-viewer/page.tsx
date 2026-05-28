import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/shared/json-ld';
import { CsvViewerTool } from '@/components/tools/csv-viewer-tool';
import { ToolAliasLinks } from '@/components/tools/tool-alias-links';
import { ToolPageShell } from '@/components/tools/tool-page-shell';
import {
  getRelatedToolAliasPages,
  toLocalizedToolAliasLink,
} from '@/data/tool-alias-pages';
import {
  getLocalizedRelatedTools,
  getLocalizedToolBySlug,
} from '@/data/tools-registry';
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

const toolSlug = 'csv-viewer';

type CsvViewerPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const aliasSectionByLocale: Record<AppLocale, { title: string; description: string }> = {
  'pt-br': {
    title: 'Recomendacoes de buscas relacionadas',
    description:
      'Atalhos leves para variacoes de busca sobre CSV sem poluir a interface principal.',
  },
  en: {
    title: 'Related CSV search recommendations',
    description:
      'Light shortcuts for CSV search variations, kept at the bottom to preserve focus on the tool.',
  },
  es: {
    title: 'Recomendaciones de busqueda relacionadas',
    description:
      'Atajos ligeros para variaciones de busqueda sobre CSV, ubicados al final para mantener enfoque.',
  },
};

export async function generateMetadata({
  params,
}: CsvViewerPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);
  const tool = getLocalizedToolBySlug(locale, toolSlug);

  return buildLocalizedMetadata({
    locale,
    title: tool?.seoTitle ?? `${dictionary.common.tools} | ${dictionary.seo.siteDefaultTitle}`,
    description: tool?.seoDescription ?? dictionary.seo.tools.description,
    localePaths: buildLocalePathMap('/tools/csv-viewer'),
    keywords: tool
      ? [tool.primaryKeyword, ...tool.secondaryKeywords]
      : dictionary.seo.tools.keywords,
  });
}

export default async function CsvViewerPage({ params }: CsvViewerPageProps) {
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
        toolUi={<CsvViewerTool locale={locale} />}
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
