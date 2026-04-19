import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getLocalizedToolBySlug } from '@/data/tools-registry';
import { buildLocalePathMap, localizePath } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { resolveLocale } from '@/lib/i18n/resolve-locale';
import { buildLocalizedMetadata } from '@/lib/seo';

const targetSlug = 'html-viewer';

type HtmlPdfJsonPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: HtmlPdfJsonPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);
  const tool = getLocalizedToolBySlug(locale, targetSlug);

  return buildLocalizedMetadata({
    locale,
    title: tool?.seoTitle ?? dictionary.seo.htmlPdfJsonFallback.title,
    description: tool?.seoDescription ?? dictionary.seo.htmlPdfJsonFallback.description,
    localePaths: buildLocalePathMap('/tools/html-viewer'),
    keywords: tool
      ? [tool.primaryKeyword, ...tool.secondaryKeywords]
      : dictionary.seo.htmlPdfJsonFallback.keywords,
  });
}

export default async function HtmlPdfJsonPage({ params }: HtmlPdfJsonPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const targetPath = localizePath(locale, `/tools/${targetSlug}`);

  redirect(targetPath);
}
