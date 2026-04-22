import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/shared/json-ld';
import { Base64ImageViewerTool } from '@/components/tools/base64-image-viewer-tool';
import { BitcoinWalletTool } from '@/components/tools/bitcoin-wallet-tool';
import { CpfGeneratorTool } from '@/components/tools/cpf-generator-tool';
import { CryptoConversionLinks } from '@/components/tools/crypto-conversion-links';
import { CryptoUnitConverterTool } from '@/components/tools/crypto-unit-converter';
import { HtmlViewerTool } from '@/components/tools/html-viewer-tool';
import { ImageConversionLinks } from '@/components/tools/image-conversion-links';
import { ImageConverterTool } from '@/components/tools/image-converter-tool';
import { ImageCompressionTool } from '@/components/tools/image-compression-tool';
import { ImageToBase64Tool } from '@/components/tools/image-to-base64-tool';
import { InvisibleCharacterTool } from '@/components/tools/invisible-character-tool';
import { InvisiblePlatformLinks } from '@/components/tools/invisible-platform-links';
import { JsonFormatterTool } from '@/components/tools/json-formatter-tool';
import { PasswordGeneratorTool } from '@/components/tools/password-generator-tool';
import { QrCodeGeneratorTool } from '@/components/tools/qr-code-generator';
import { ToolAliasLinks } from '@/components/tools/tool-alias-links';
import { ToolPageShell } from '@/components/tools/tool-page-shell';
import { VideoCompressionTool } from '@/components/tools/video-compression-tool';
import {
  getFeaturedCryptoConversionPages,
  getLocalizedCryptoConversionContent,
  getRelatedCryptoConversionPages,
  getCryptoConversionResolutionBySlug,
  toLocalizedCryptoConversionLink,
} from '@/data/crypto-conversion-pages';
import {
  getFeaturedImageConversionPages,
  getImageConversionResolutionBySlug,
  getLocalizedImageConversionContent,
  getRelatedImageConversionPages,
  toLocalizedImageConversionLink,
} from '@/data/image-conversion-pages';
import {
  getInvisiblePlatformResolutionBySlug,
  getInvisiblePlatformStaticParamsByLocale,
  getLocalizedInvisiblePlatformContent,
  getRelatedInvisiblePlatformPages,
  getFeaturedInvisiblePlatformPages,
  invisiblePlatformPages,
  toLocalizedInvisiblePlatformLink,
} from '@/data/invisible-platform-pages';
import {
  getLocalizedRelatedTools,
  getLocalizedToolBySlug,
} from '@/data/tools-registry';
import {
  getLocalizedToolAliasContent,
  getRelatedToolAliasPages,
  getToolAliasCryptoPreset,
  getToolAliasImagePreset,
  getToolAliasLocalePathMap,
  getToolAliasPageBySlug,
  getToolAliasPathByLocale,
  getToolAliasStaticParamsByLocale,
  toLocalizedToolAliasLink,
  type ToolAliasPage,
} from '@/data/tool-alias-pages';
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildSoftwareApplicationJsonLd,
  buildToolWebPageJsonLd,
} from '@/lib/json-ld';
import { buildLocalePathMap, localizePath, locales, type AppLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { resolveLocale } from '@/lib/i18n/resolve-locale';
import { getInvisiblePlatformById } from '@/lib/invisible-character';
import { buildLocalizedMetadata } from '@/lib/seo';
import type { ToolDefinition } from '@/types/tool';

export const dynamicParams = false;

const baseInvisibleToolSlug = 'invisible-character';

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

const toolAliasCopy: Record<AppLocale, { title: string; description: string }> = {
  'pt-br': {
    title: 'Outras buscas desta ferramenta',
    description:
      'Variacoes de busca que levam para a mesma ferramenta com foco em intencoes diferentes.',
  },
  en: {
    title: 'Related search variations',
    description:
      'Different search intents mapped to the same tool to cover alternative query patterns.',
  },
  es: {
    title: 'Variaciones de busqueda relacionadas',
    description:
      'Intenciones de busqueda distintas mapeadas a la misma herramienta para cubrir consultas alternativas.',
  },
};

const imageConversionSectionByLocale: Record<AppLocale, { title: string; description: string }> = {
  'pt-br': {
    title: 'Conversoes populares de imagem e PDF',
    description:
      'Atalhos entre formatos com alta recorrencia, como PNG para JPEG, PDF para imagem e JPEG para PDF.',
  },
  en: {
    title: 'Popular image and PDF conversions',
    description:
      'High-demand format pairs such as PNG to JPEG, PDF to image, and JPEG to PDF.',
  },
  es: {
    title: 'Conversiones populares de imagen y PDF',
    description:
      'Pares de formatos con alta demanda, como PNG a JPEG, PDF a imagen y JPEG a PDF.',
  },
};

const invisibleSectionByLocale: Record<AppLocale, { title: string; description: string }> = {
  'pt-br': {
    title: 'Paginas por jogo e rede social',
    description:
      'Links para variacoes por plataforma com recomendacoes de padrao invisivel e compatibilidade.',
  },
  en: {
    title: 'Pages by game and social platform',
    description:
      'Links to platform-specific variations with hidden character compatibility hints.',
  },
  es: {
    title: 'Paginas por juego y red social',
    description:
      'Enlaces a variaciones por plataforma con recomendaciones de compatibilidad.',
  },
};

const softwareCategoryByToolSlug: Record<string, string> = {
  'crypto-unit-converter': 'FinanceApplication',
  'bitcoin-wallet': 'FinanceApplication',
  'html-viewer': 'DeveloperApplication',
  'json-formatter': 'DeveloperApplication',
  'cpf-generator': 'UtilitiesApplication',
  'password-generator': 'SecurityApplication',
  'base64-image-viewer': 'DeveloperApplication',
  'image-to-base64': 'DeveloperApplication',
  'image-converter': 'UtilitiesApplication',
  'image-compression': 'UtilitiesApplication',
  'video-compression': 'UtilitiesApplication',
  'qr-code-generator': 'UtilitiesApplication',
  'invisible-character': 'UtilitiesApplication',
};

type LandingResolution =
  | {
      kind: 'invisible-platform';
      resolution: NonNullable<ReturnType<typeof getInvisiblePlatformResolutionBySlug>>;
    }
  | {
      kind: 'tool-alias';
      page: ToolAliasPage;
    };

type ContextualLandingContent = {
  title: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  contentBlocks: ToolDefinition['contentBlocks'];
  faq: ToolDefinition['faq'];
};

const dedupeKeywords = (keywords: string[]): string[] =>
  Array.from(new Set(keywords.map((item) => item.trim()).filter(Boolean)));

const resolveLanding = (slug: string): LandingResolution | undefined => {
  const invisibleResolution = getInvisiblePlatformResolutionBySlug(slug);
  if (invisibleResolution) {
    return {
      kind: 'invisible-platform',
      resolution: invisibleResolution,
    };
  }

  const aliasPage = getToolAliasPageBySlug(slug);
  if (aliasPage) {
    return {
      kind: 'tool-alias',
      page: aliasPage,
    };
  }

  return undefined;
};

const getContextualLandingContent = (
  page: ToolAliasPage,
  locale: AppLocale,
): ContextualLandingContent | undefined => {
  if (page.toolSlug === 'image-converter' && page.imageConversionSlug) {
    const resolution = getImageConversionResolutionBySlug(page.imageConversionSlug);

    if (resolution) {
      const localized = getLocalizedImageConversionContent(resolution.page, locale);
      return {
        title: localized.title,
        intro: localized.intro,
        seoTitle: localized.seoTitle,
        seoDescription: localized.seoDescription,
        keywords: localized.keywords,
        contentBlocks: localized.contentBlocks,
        faq: localized.faq,
      };
    }
  }

  if (page.toolSlug === 'crypto-unit-converter' && page.cryptoConversionSlug) {
    const resolution = getCryptoConversionResolutionBySlug(page.cryptoConversionSlug);

    if (resolution) {
      const localized = getLocalizedCryptoConversionContent(resolution.page, locale);
      return {
        title: localized.title,
        intro: localized.intro,
        seoTitle: localized.seoTitle,
        seoDescription: localized.seoDescription,
        keywords: localized.keywords,
        contentBlocks: localized.contentBlocks,
        faq: localized.faq,
      };
    }
  }

  if (page.toolSlug === 'invisible-character' && page.invisiblePlatformId) {
    const platformPage = invisiblePlatformPages.find(
      (item) => item.platformId === page.invisiblePlatformId,
    );

    if (platformPage) {
      const localized = getLocalizedInvisiblePlatformContent(platformPage, locale);
      return {
        title: localized.title,
        intro: localized.intro,
        seoTitle: localized.seoTitle,
        seoDescription: localized.seoDescription,
        keywords: localized.keywords,
        contentBlocks: localized.contentBlocks,
        faq: localized.faq,
      };
    }
  }

  return undefined;
};

export function generateStaticParams() {
  const params = new Set<string>();

  locales.forEach((locale) => {
    getInvisiblePlatformStaticParamsByLocale(locale).forEach(({ platformPageSlug }) => {
      params.add(`${locale}:${platformPageSlug}`);
    });

    getToolAliasStaticParamsByLocale(locale).forEach(({ platformPageSlug }) => {
      params.add(`${locale}:${platformPageSlug}`);
    });
  });

  return Array.from(params).map((entry) => {
    const splitIndex = entry.indexOf(':');

    return {
      locale: entry.slice(0, splitIndex),
      platformPageSlug: entry.slice(splitIndex + 1),
    };
  });
}

type LandingPageProps = Readonly<{
  params: Promise<{
    locale: string;
    platformPageSlug: string;
  }>;
}>;

export async function generateMetadata({ params }: LandingPageProps): Promise<Metadata> {
  const { locale: localeParam, platformPageSlug } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);
  const landing = resolveLanding(platformPageSlug);

  if (!landing) {
    const fallbackTool = getLocalizedToolBySlug(locale, baseInvisibleToolSlug);

    return buildLocalizedMetadata({
      locale,
      title: fallbackTool?.seoTitle ?? `${dictionary.common.tools} | ${dictionary.seo.siteDefaultTitle}`,
      description: fallbackTool?.seoDescription ?? dictionary.seo.tools.description,
      localePaths: buildLocalePathMap('/tools/invisible-character'),
      keywords: fallbackTool
        ? [fallbackTool.primaryKeyword, ...fallbackTool.secondaryKeywords]
        : dictionary.seo.tools.keywords,
    });
  }

  if (landing.kind === 'invisible-platform') {
    const localizedContent = getLocalizedInvisiblePlatformContent(landing.resolution.page, locale);

    return buildLocalizedMetadata({
      locale,
      title: localizedContent.seoTitle,
      description: localizedContent.seoDescription,
      localePaths: buildLocalePathMap(`/${platformPageSlug}`),
      keywords: localizedContent.keywords,
    });
  }

  const baseTool = getLocalizedToolBySlug(locale, landing.page.toolSlug);
  if (!baseTool) {
    return buildLocalizedMetadata({
      locale,
      title: `${dictionary.common.tools} | ${dictionary.seo.siteDefaultTitle}`,
      description: dictionary.seo.tools.description,
      localePaths: buildLocalePathMap('/tools'),
      keywords: dictionary.seo.tools.keywords,
    });
  }

  const aliasContent = getLocalizedToolAliasContent(landing.page, locale, baseTool.name);
  const contextual = getContextualLandingContent(landing.page, locale);

  return buildLocalizedMetadata({
    locale,
    title: contextual?.seoTitle ?? aliasContent.seoTitle,
    description: contextual?.seoDescription ?? aliasContent.seoDescription,
    localePaths: getToolAliasLocalePathMap(landing.page),
    keywords: dedupeKeywords([
      ...(contextual?.keywords ?? []),
      aliasContent.primaryKeyword,
      ...baseTool.secondaryKeywords,
    ]).slice(0, 12),
  });
}

export default async function LandingPage({ params }: LandingPageProps) {
  const { locale: localeParam, platformPageSlug } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);
  const landing = resolveLanding(platformPageSlug);

  if (!landing) {
    notFound();
  }

  if (landing.kind === 'invisible-platform') {
    const baseTool = getLocalizedToolBySlug(locale, baseInvisibleToolSlug);

    if (!baseTool) {
      notFound();
    }

    const localizedContent = getLocalizedInvisiblePlatformContent(landing.resolution.page, locale);
    const relatedTools = getLocalizedRelatedTools(locale, baseTool.id);
    const relatedPlatformPages = getRelatedInvisiblePlatformPages(landing.resolution.page.slug, 6).map(
      (page) => toLocalizedInvisiblePlatformLink(page, locale),
    );

    const canonicalPath = localizePath(locale, `/${platformPageSlug}`);

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
              name: landing.resolution.page.platformName,
              path: canonicalPath,
            },
          ])}
        />

        <JsonLd data={buildFaqJsonLd(landingTool.faq)} />

        <ToolPageShell
          locale={locale}
          tool={landingTool}
          relatedTools={relatedTools}
          toolUi={
            <InvisibleCharacterTool
              locale={locale}
              initialPlatformId={landing.resolution.page.platformId}
            />
          }
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

  const aliasPage = landing.page;
  const baseTool = getLocalizedToolBySlug(locale, aliasPage.toolSlug);

  if (!baseTool) {
    notFound();
  }

  const aliasContent = getLocalizedToolAliasContent(aliasPage, locale, baseTool.name);
  const contextualContent = getContextualLandingContent(aliasPage, locale);
  const relatedTools = getLocalizedRelatedTools(locale, baseTool.id);
  const canonicalPath = getToolAliasPathByLocale(aliasPage, locale);

  const primaryKeyword = contextualContent?.keywords[0] ?? aliasContent.primaryKeyword;
  const secondaryKeywords = dedupeKeywords([
    ...(contextualContent?.keywords ?? []),
    aliasContent.primaryKeyword,
    ...baseTool.secondaryKeywords,
  ])
    .filter((keyword) => keyword !== primaryKeyword)
    .slice(0, 12);

  const landingTool: ToolDefinition = {
    ...baseTool,
    name: contextualContent?.title ?? aliasContent.title,
    h1: contextualContent?.title ?? aliasContent.h1,
    intro: contextualContent?.intro ?? aliasContent.intro,
    seoTitle: contextualContent?.seoTitle ?? aliasContent.seoTitle,
    seoDescription: contextualContent?.seoDescription ?? aliasContent.seoDescription,
    canonicalPath,
    primaryKeyword,
    secondaryKeywords,
    searchIntent: aliasContent.searchIntent,
    contentBlocks: contextualContent?.contentBlocks ?? baseTool.contentBlocks,
    faq: contextualContent?.faq ?? baseTool.faq,
  };

  const imagePreset = getToolAliasImagePreset(aliasPage);
  const cryptoPreset = getToolAliasCryptoPreset(aliasPage);

  let toolUi: ReactNode | null = null;
  let focusedSection: ReactNode | null = null;

  if (aliasPage.toolSlug === 'crypto-unit-converter') {
    toolUi = (
      <CryptoUnitConverterTool
        locale={locale}
        initialAssetId={cryptoPreset?.assetId}
        initialFromUnitId={cryptoPreset?.fromUnitId}
        initialToUnitId={cryptoPreset?.toUnitId}
      />
    );

    const cryptoLinks = (aliasPage.cryptoConversionSlug
      ? getRelatedCryptoConversionPages(aliasPage.cryptoConversionSlug, 4)
      : getFeaturedCryptoConversionPages(4)
    ).map((page) => toLocalizedCryptoConversionLink(page, locale));

    focusedSection = (
      <CryptoConversionLinks
        title={dictionary.toolShell.cryptoPopularTitle}
        description={dictionary.toolShell.cryptoPopularDescription}
        fromToConnector={dictionary.qrToolUi.fromToConnector}
        links={cryptoLinks}
      />
    );
  } else if (aliasPage.toolSlug === 'bitcoin-wallet') {
    toolUi = <BitcoinWalletTool locale={locale} />;
  } else if (aliasPage.toolSlug === 'html-viewer') {
    toolUi = <HtmlViewerTool locale={locale} />;
  } else if (aliasPage.toolSlug === 'json-formatter') {
    toolUi = <JsonFormatterTool locale={locale} />;
  } else if (aliasPage.toolSlug === 'cpf-generator') {
    toolUi = <CpfGeneratorTool locale={locale} />;
  } else if (aliasPage.toolSlug === 'password-generator') {
    toolUi = <PasswordGeneratorTool locale={locale} />;
  } else if (aliasPage.toolSlug === 'base64-image-viewer') {
    toolUi = <Base64ImageViewerTool locale={locale} />;
  } else if (aliasPage.toolSlug === 'image-to-base64') {
    toolUi = <ImageToBase64Tool locale={locale} />;
  } else if (aliasPage.toolSlug === 'image-converter') {
    toolUi = (
      <ImageConverterTool
        locale={locale}
        initialFromFormat={imagePreset?.fromFormatId}
        initialToFormat={imagePreset?.toFormatId}
      />
    );

    const imageLinks = (aliasPage.imageConversionSlug
      ? getRelatedImageConversionPages(aliasPage.imageConversionSlug, 4)
      : getFeaturedImageConversionPages(4)
    ).map((page) => toLocalizedImageConversionLink(page, locale));

    const sectionCopy = imageConversionSectionByLocale[locale];

    focusedSection = (
      <ImageConversionLinks
        title={sectionCopy.title}
        description={sectionCopy.description}
        fromToConnector={dictionary.qrToolUi.fromToConnector}
        links={imageLinks}
      />
    );
  } else if (aliasPage.toolSlug === 'image-compression') {
    toolUi = <ImageCompressionTool locale={locale} />;
  } else if (aliasPage.toolSlug === 'video-compression') {
    toolUi = <VideoCompressionTool locale={locale} />;
  } else if (aliasPage.toolSlug === 'qr-code-generator') {
    toolUi = <QrCodeGeneratorTool locale={locale} />;
  } else if (aliasPage.toolSlug === 'invisible-character') {
    toolUi = <InvisibleCharacterTool locale={locale} initialPlatformId={aliasPage.invisiblePlatformId} />;

    const currentInvisiblePage = aliasPage.invisiblePlatformId
      ? invisiblePlatformPages.find((page) => page.platformId === aliasPage.invisiblePlatformId)
      : undefined;

    const platformLinks = (currentInvisiblePage
      ? getRelatedInvisiblePlatformPages(currentInvisiblePage.slug, 8)
      : getFeaturedInvisiblePlatformPages(8)
    ).map((page) => toLocalizedInvisiblePlatformLink(page, locale));

    const sectionCopy = invisibleSectionByLocale[locale];

    focusedSection = (
      <InvisiblePlatformLinks
        title={sectionCopy.title}
        description={sectionCopy.description}
        links={platformLinks}
      />
    );
  }

  if (!toolUi) {
    notFound();
  }

  const aliasLinks = getRelatedToolAliasPages(aliasPage.toolSlug, aliasPage.slug, 10).map((page) =>
    toLocalizedToolAliasLink(page, locale),
  );

  const hasFocusedSection = Boolean(focusedSection);
  const hasAliasLinks = aliasLinks.length > 0;

  const afterToolSection = hasFocusedSection || hasAliasLinks ? (
    <>
      {focusedSection}
      {hasAliasLinks ? (
        <ToolAliasLinks
          title={toolAliasCopy[locale].title}
          description={toolAliasCopy[locale].description}
          links={aliasLinks}
        />
      ) : null}
    </>
  ) : undefined;

  const platformName = aliasPage.invisiblePlatformId
    ? getInvisiblePlatformById(aliasPage.invisiblePlatformId)?.name
    : undefined;

  const breadcrumbAliasLabel = platformName
    ? `${landingTool.name} (${platformName})`
    : landingTool.name;

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
          category: softwareCategoryByToolSlug[aliasPage.toolSlug] ?? 'UtilitiesApplication',
        })}
      />

      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: dictionary.common.home, path: localizePath(locale, '/') },
          { name: dictionary.common.tools, path: localizePath(locale, '/tools') },
          {
            name: baseTool.name,
            path: localizePath(locale, `/tools/${baseTool.slug}`),
          },
          {
            name: breadcrumbAliasLabel,
            path: canonicalPath,
          },
        ])}
      />

      <JsonLd data={buildFaqJsonLd(landingTool.faq)} />

      <ToolPageShell
        locale={locale}
        tool={landingTool}
        relatedTools={relatedTools}
        toolUi={toolUi}
        afterToolSection={afterToolSection}
      />
    </>
  );
}
