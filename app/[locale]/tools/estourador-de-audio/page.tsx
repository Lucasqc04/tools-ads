import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/shared/json-ld';
import { AudioBlasterTool } from '@/components/tools/audio-blaster-tool';
import { ToolPageShell } from '@/components/tools/tool-page-shell';
import { getLocalizedRelatedTools, getLocalizedToolBySlug } from '@/data/tools-registry';
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

const toolSlug = 'estourador-de-audio';

type PageProps = Readonly<{ params: Promise<{ locale: string }> }>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);
  const tool = getLocalizedToolBySlug(locale, toolSlug);

  return buildLocalizedMetadata({
    locale,
    title: tool?.seoTitle ?? `${dictionary.common.tools} | ${dictionary.seo.siteDefaultTitle}`,
    description: tool?.seoDescription ?? dictionary.seo.tools.description,
    localePaths: buildLocalePathMap('/tools/estourador-de-audio'),
    keywords: tool ? [tool.primaryKeyword, ...tool.secondaryKeywords] : dictionary.seo.tools.keywords,
  });
}

export default async function AudioBlasterPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);
  const tool = getLocalizedToolBySlug(locale, toolSlug);

  if (!tool) notFound();

  return (
    <>
      <JsonLd data={buildToolWebPageJsonLd({ name: tool.name, description: tool.seoDescription, path: tool.canonicalPath, locale, keywords: [tool.primaryKeyword, ...tool.secondaryKeywords] })} />
      <JsonLd data={buildSoftwareApplicationJsonLd({ name: tool.name, description: tool.seoDescription, path: tool.canonicalPath, category: 'MultimediaApplication' })} />
      <JsonLd data={buildBreadcrumbJsonLd([
        { name: dictionary.common.home, path: localizePath(locale, '/') },
        { name: dictionary.common.tools, path: localizePath(locale, '/tools') },
        { name: tool.name, path: tool.canonicalPath },
      ])} />
      <JsonLd data={buildFaqJsonLd(tool.faq)} />
      <ToolPageShell
        locale={locale}
        tool={tool}
        relatedTools={getLocalizedRelatedTools(locale, tool.id)}
        toolUi={<AudioBlasterTool locale={locale} />}
      />
    </>
  );
}
