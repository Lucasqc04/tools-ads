import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/shared/json-ld';
import { HtmlViewerTool } from '@/components/tools/html-viewer-tool';
import { ToolPageShell } from '@/components/tools/tool-page-shell';
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
import { buildLocalePathMap, localizePath } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { resolveLocale } from '@/lib/i18n/resolve-locale';
import { buildLocalizedMetadata } from '@/lib/seo';

const toolSlug = 'html-viewer';

type HtmlViewerPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: HtmlViewerPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);
  const tool = getLocalizedToolBySlug(locale, toolSlug);

  return buildLocalizedMetadata({
    locale,
    title: tool?.seoTitle ?? `${dictionary.common.tools} | ${dictionary.seo.siteDefaultTitle}`,
    description: tool?.seoDescription ?? dictionary.seo.tools.description,
    localePaths: buildLocalePathMap('/tools/html-viewer'),
    keywords: tool
      ? [tool.primaryKeyword, ...tool.secondaryKeywords]
      : dictionary.seo.tools.keywords,
  });
}

export default async function HtmlViewerPage({ params }: HtmlViewerPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);
  const tool = getLocalizedToolBySlug(locale, toolSlug);

  if (!tool) {
    notFound();
  }

  const related = getLocalizedRelatedTools(locale, tool.id);

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
        toolUi={<HtmlViewerTool locale={locale} />}
      />
    </>
  );
}

