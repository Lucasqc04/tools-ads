import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/shared/json-ld';
import { TextDiffTool } from '@/components/tools/text-diff-tool';
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

const toolSlug = 'text-diff';

type PageProps = {
  params: Promise<{ locale: string }>;
};

const aliasSectionByLocale: Record<AppLocale, { title: string; description: string }> = {
  'pt-br': {
    title: 'Recomendacoes de variacoes de busca',
    description: 'Atalhos para intencoes relacionadas como diff online, comparar listas e comparar contratos.',
  },
  en: {
    title: 'Related search recommendations',
    description: 'Shortcuts for related intents such as online diff, list compare, and contract compare.',
  },
  es: {
    title: 'Recomendaciones de busqueda relacionadas',
    description: 'Atajos para intenciones relacionadas como diff online, comparar listas y contratos.',
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
    localePaths: buildLocalePathMap('/tools/text-diff'),
    keywords: tool ? [tool.primaryKeyword, ...tool.secondaryKeywords] : dictionary.seo.tools.keywords,
  });
}

export default async function TextDiffPage({ params }: PageProps) {
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
        toolUi={<TextDiffTool locale={locale} />}
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
