import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/shared/json-ld';
import { ImageConversionLinks } from '@/components/tools/image-conversion-links';
import { ImageConverterTool } from '@/components/tools/image-converter-tool';
import { ToolPageShell } from '@/components/tools/tool-page-shell';
import {
  getFeaturedImageConversionPages,
  toLocalizedImageConversionLink,
} from '@/data/image-conversion-pages';
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

const toolSlug = 'image-converter';

type ImageConverterPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const conversionSectionByLocale: Record<
  AppLocale,
  { title: string; description: string }
> = {
  'pt-br': {
    title: 'Conversões populares de imagem e PDF',
    description:
      'Atalhos prontos entre 20+ formatos, incluindo PNG para JPEG, HEIC para JPG, TIFF para PNG e PDF para imagem.',
  },
  en: {
    title: 'Popular image and PDF conversions',
    description:
      'Ready shortcuts across 20+ formats, including PNG to JPEG, HEIC to JPG, TIFF to PNG, and PDF to image.',
  },
  es: {
    title: 'Conversiones populares de imagen y PDF',
    description:
      'Atajos listos entre más de 20 formatos, incluyendo PNG a JPEG, HEIC a JPG, TIFF a PNG y PDF a imagen.',
  },
};

export async function generateMetadata({
  params,
}: ImageConverterPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);
  const tool = getLocalizedToolBySlug(locale, toolSlug);

  return buildLocalizedMetadata({
    locale,
    title: tool?.seoTitle ?? `${dictionary.common.tools} | ${dictionary.seo.siteDefaultTitle}`,
    description: tool?.seoDescription ?? dictionary.seo.tools.description,
    localePaths: buildLocalePathMap('/tools/image-converter'),
    keywords: tool
      ? [tool.primaryKeyword, ...tool.secondaryKeywords]
      : dictionary.seo.tools.keywords,
  });
}

export default async function ImageConverterPage({ params }: ImageConverterPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);
  const tool = getLocalizedToolBySlug(locale, toolSlug);

  if (!tool) {
    notFound();
  }

  const related = getLocalizedRelatedTools(locale, tool.id);
  const featuredConversionLinks = getFeaturedImageConversionPages(4).map((page) =>
    toLocalizedImageConversionLink(page, locale),
  );
  const sectionCopy = conversionSectionByLocale[locale];

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
          category: 'UtilitiesApplication',
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
        toolUi={<ImageConverterTool locale={locale} />}
        afterToolSection={
          <ImageConversionLinks
            title={sectionCopy.title}
            description={sectionCopy.description}
            fromToConnector={dictionary.qrToolUi.fromToConnector}
            links={featuredConversionLinks}
          />
        }
      />
    </>
  );
}
