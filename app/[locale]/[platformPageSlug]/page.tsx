import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { JsonLd } from '@/components/shared/json-ld';
import { InvisibleCharacterTool } from '@/components/tools/invisible-character-tool';
import { InvisiblePlatformLinks } from '@/components/tools/invisible-platform-links';
import { ToolPageShell } from '@/components/tools/tool-page-shell';
import {
  getInvisiblePlatformLocalePathMap,
  getInvisiblePlatformPathByVariant,
  getInvisiblePlatformResolutionBySlug,
  getInvisiblePlatformStaticParamsByLocale,
  getLocalizedInvisiblePlatformContent,
  getRelatedInvisiblePlatformPages,
  toLocalizedInvisiblePlatformLink,
} from '@/data/invisible-platform-pages';
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
import { localizePath, locales, type AppLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { resolveLocale } from '@/lib/i18n/resolve-locale';
import { buildLocalizedMetadata } from '@/lib/seo';
import type { ToolDefinition } from '@/types/tool';

export const dynamicParams = false;

const baseToolSlug = 'invisible-character';

const localizedSearchIntent: Record<AppLocale, string> = {
  'pt-br':
    'Pessoas que buscam caractere invisivel por jogo ou rede social para copiar e colar, com mais chance de aprovacao em validadores de nickname.',
  en: 'People looking for platform-specific invisible character patterns to copy and paste into nickname fields.',
  es: 'Personas que buscan patrones de caracter invisible por plataforma para copiar y pegar en campos de nickname.',
};

const relatedSectionCopy: Record<AppLocale, { title: string; description: string }> = {
  'pt-br': {
    title: 'Outras paginas de caractere invisivel',
    description:
      'Navegue entre jogos e redes sociais para testar padroes diferentes de Unicode invisivel.',
  },
  en: {
    title: 'Related invisible character pages',
    description:
      'Navigate across games and social platforms to test different hidden Unicode patterns.',
  },
  es: {
    title: 'Otras paginas de caracter invisible',
    description:
      'Navega por juegos y redes sociales para probar distintos patrones Unicode invisibles.',
  },
};

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getInvisiblePlatformStaticParamsByLocale(locale).map((item) => ({
      locale,
      platformPageSlug: item.platformPageSlug,
    })),
  );
}

type InvisiblePlatformLandingPageProps = Readonly<{
  params: Promise<{
    locale: string;
    platformPageSlug: string;
  }>;
}>;

export async function generateMetadata({
  params,
}: InvisiblePlatformLandingPageProps): Promise<Metadata> {
  const { locale: localeParam, platformPageSlug } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);

  const resolution = getInvisiblePlatformResolutionBySlug(platformPageSlug);
  const baseTool = getLocalizedToolBySlug(locale, baseToolSlug);

  if (!resolution) {
    return buildLocalizedMetadata({
      locale,
      title: baseTool?.seoTitle ?? `${dictionary.common.tools} | ${dictionary.seo.siteDefaultTitle}`,
      description: baseTool?.seoDescription ?? dictionary.seo.tools.description,
      localePaths: {
        'pt-br': localizePath('pt-br', '/tools/invisible-character'),
        en: localizePath('en', '/tools/invisible-character'),
        es: localizePath('es', '/tools/invisible-character'),
      },
      keywords: baseTool
        ? [baseTool.primaryKeyword, ...baseTool.secondaryKeywords]
        : dictionary.seo.tools.keywords,
    });
  }

  const localizedContent = getLocalizedInvisiblePlatformContent(resolution.page, locale);

  return buildLocalizedMetadata({
    locale,
    title: localizedContent.seoTitle,
    description: localizedContent.seoDescription,
    localePaths: getInvisiblePlatformLocalePathMap(resolution.page),
    keywords: localizedContent.keywords,
  });
}

export default async function InvisiblePlatformLandingPage({
  params,
}: InvisiblePlatformLandingPageProps) {
  const { locale: localeParam, platformPageSlug } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);

  const resolution = getInvisiblePlatformResolutionBySlug(platformPageSlug);
  const baseTool = getLocalizedToolBySlug(locale, baseToolSlug);

  if (!resolution || !baseTool) {
    notFound();
  }

  const localePathMap = getInvisiblePlatformLocalePathMap(resolution.page);
  const canonicalPath = localePathMap[locale];
  const currentRequestPath = localizePath(locale, `/${platformPageSlug}`);

  if (currentRequestPath !== canonicalPath) {
    redirect(canonicalPath);
  }

  const localizedContent = getLocalizedInvisiblePlatformContent(resolution.page, locale);
  const relatedTools = getLocalizedRelatedTools(locale, baseTool.id);
  const relatedPlatformPages = getRelatedInvisiblePlatformPages(resolution.page.slug, 6).map((page) =>
    toLocalizedInvisiblePlatformLink(page, locale),
  );

  const landingTool: ToolDefinition = {
    ...baseTool,
    name: localizedContent.title,
    h1: localizedContent.title,
    intro: localizedContent.intro,
    seoTitle: localizedContent.seoTitle,
    seoDescription: localizedContent.seoDescription,
    canonicalPath,
    primaryKeyword: localizedContent.keywords[0] ?? baseTool.primaryKeyword,
    secondaryKeywords: localizedContent.keywords.slice(1),
    searchIntent: localizedSearchIntent[locale],
    contentBlocks: localizedContent.contentBlocks,
    faq: localizedContent.faq,
  };

  const currentPath = localizePath(
    locale,
    getInvisiblePlatformPathByVariant(resolution.page, resolution.variant),
  );

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
            path: localizePath(locale, '/tools/invisible-character'),
          },
          {
            name: resolution.page.platformName,
            path: currentPath,
          },
        ])}
      />

      <JsonLd data={buildFaqJsonLd(landingTool.faq)} />

      <ToolPageShell
        locale={locale}
        tool={landingTool}
        relatedTools={relatedTools}
        toolUi={<InvisibleCharacterTool locale={locale} initialPlatformId={resolution.page.platformId} />}
        afterToolSection={
          <InvisiblePlatformLinks
            title={relatedSectionCopy[locale].title}
            description={relatedSectionCopy[locale].description}
            links={relatedPlatformPages}
          />
        }
      />
    </>
  );
}
