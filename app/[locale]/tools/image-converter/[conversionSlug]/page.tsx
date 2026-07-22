import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { JsonLd } from '@/components/shared/json-ld';
import { ImageConversionLinks } from '@/components/tools/image-conversion-links';
import { ImageConverterTool } from '@/components/tools/image-converter-tool';
import { ToolPageShell } from '@/components/tools/tool-page-shell';
import {
  getImageConversionResolutionBySlug,
  getImageConversionStaticParams,
  getLocalizedImageConversionContent,
  getRelatedImageConversionPages,
  isIndexableImageConversionPage,
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
import { buildLocalePathMap, localizePath, locales, type AppLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { resolveLocale } from '@/lib/i18n/resolve-locale';
import { buildLocalizedMetadata } from '@/lib/seo';
import type { ToolDefinition } from '@/types/tool';

export const dynamicParams = true;

const toolSlug = 'image-converter';

const localizedSearchIntent: Record<AppLocale, string> = {
  'pt-br':
    'Pessoas que querem converter entre múltiplos formatos de imagem e PDF com rapidez, sem cadastro e direto no navegador.',
  en: 'People who need fast in-browser conversion across many image and PDF formats with no sign-up.',
  es: 'Personas que necesitan convertir entre muchos formatos de imagen y PDF rápido en el navegador y sin registro.',
};

const conversionSectionByLocale: Record<
  AppLocale,
  { title: string; description: string }
> = {
  'pt-br': {
    title: 'Outras conversões relacionadas',
    description:
      'Acesse pares de formatos próximos para concluir outras conversões sem refazer o fluxo.',
  },
  en: {
    title: 'Related conversion pages',
    description:
      'Open nearby format pairs to complete other conversions without rebuilding your workflow.',
  },
  es: {
    title: 'Otras conversiones relacionadas',
    description:
      'Abre pares de formatos cercanos para completar otras conversiones sin rehacer el flujo.',
  },
};

export function generateStaticParams() {
  const slugs = getImageConversionStaticParams();

  return locales.flatMap((locale) =>
    slugs.map((item) => ({
      locale,
      conversionSlug: item.conversionSlug,
    })),
  );
}

type ConversionLandingPageProps = Readonly<{
  params: Promise<{
    locale: string;
    conversionSlug: string;
  }>;
}>;

export async function generateMetadata({
  params,
}: ConversionLandingPageProps): Promise<Metadata> {
  const { locale: localeParam, conversionSlug } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);
  const resolution = getImageConversionResolutionBySlug(conversionSlug);
  const baseTool = getLocalizedToolBySlug(locale, toolSlug);

  if (!resolution || !isIndexableImageConversionPage(resolution.page)) {
    return buildLocalizedMetadata({
      locale,
      title: baseTool?.seoTitle ?? `${dictionary.common.tools} | ${dictionary.seo.siteDefaultTitle}`,
      description: baseTool?.seoDescription ?? dictionary.seo.tools.description,
      localePaths: buildLocalePathMap('/tools/image-converter'),
      keywords: baseTool
        ? [baseTool.primaryKeyword, ...baseTool.secondaryKeywords]
        : dictionary.seo.tools.keywords,
    });
  }

  const conversionPage = resolution.page;
  const localized = getLocalizedImageConversionContent(conversionPage, locale);

  return buildLocalizedMetadata({
    locale,
    title: localized.seoTitle,
    description: localized.seoDescription,
    localePaths: buildLocalePathMap(`/tools/image-converter/${conversionSlug}`),
    keywords: localized.keywords,
  });
}

export default async function ConversionLandingPage({
  params,
}: ConversionLandingPageProps) {
  const { locale: localeParam, conversionSlug } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);

  const resolution = getImageConversionResolutionBySlug(conversionSlug);
  const baseTool = getLocalizedToolBySlug(locale, toolSlug);

  if (!resolution || !baseTool) {
    notFound();
  }

  if (!isIndexableImageConversionPage(resolution.page)) {
    permanentRedirect(localizePath(locale, '/tools/image-converter'));
  }

  const conversionPage = resolution.page;
  const localized = getLocalizedImageConversionContent(conversionPage, locale);
  const currentRequestPath = localizePath(locale, `/tools/image-converter/${conversionSlug}`);
  const canonicalPath = currentRequestPath;
  const currentPath = currentRequestPath;

  const relatedTools = getLocalizedRelatedTools(locale, baseTool.id);
  const relatedConversions = getRelatedImageConversionPages(conversionPage.slug, 4).map((page) =>
    toLocalizedImageConversionLink(page, locale),
  );
  const sectionCopy = conversionSectionByLocale[locale];

  const landingTool: ToolDefinition = {
    ...baseTool,
    name: localized.title,
    h1: localized.title,
    intro: localized.intro,
    seoTitle: localized.seoTitle,
    seoDescription: localized.seoDescription,
    canonicalPath,
    primaryKeyword: localized.keywords[0] ?? baseTool.primaryKeyword,
    secondaryKeywords: localized.keywords.slice(1),
    searchIntent: localizedSearchIntent[locale],
    contentBlocks: localized.contentBlocks,
    faq: localized.faq,
  };

  return (
    <>
      <JsonLd
        data={buildToolWebPageJsonLd({
          name: landingTool.name,
          description: landingTool.seoDescription,
          path: landingTool.canonicalPath,
          locale,
          keywords: [landingTool.primaryKeyword, ...landingTool.secondaryKeywords],
        })}
      />

      <JsonLd
        data={buildSoftwareApplicationJsonLd({
          name: landingTool.name,
          description: landingTool.seoDescription,
          path: landingTool.canonicalPath,
          category: 'UtilitiesApplication',
        })}
      />

      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: dictionary.common.home, path: localizePath(locale, '/') },
          { name: dictionary.common.tools, path: localizePath(locale, '/tools') },
          {
            name: baseTool.name,
            path: localizePath(locale, '/tools/image-converter'),
          },
          {
            name: `${conversionPage.fromLabel} ${dictionary.qrToolUi.fromToConnector} ${conversionPage.toLabel}`,
            path: currentPath,
          },
        ])}
      />

      <JsonLd data={buildFaqJsonLd(landingTool.faq)} />

      <ToolPageShell
        locale={locale}
        tool={landingTool}
        relatedTools={relatedTools}
        toolUi={
          <ImageConverterTool
            locale={locale}
            initialFromFormat={conversionPage.fromFormatId}
            initialToFormat={conversionPage.toFormatId}
          />
        }
        afterToolSection={
          <ImageConversionLinks
            title={sectionCopy.title}
            description={sectionCopy.description}
            fromToConnector={dictionary.qrToolUi.fromToConnector}
            links={relatedConversions}
          />
        }
      />
    </>
  );
}
