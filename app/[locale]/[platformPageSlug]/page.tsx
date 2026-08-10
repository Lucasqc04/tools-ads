import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound, permanentRedirect } from 'next/navigation';
import { JsonLd } from '@/components/shared/json-ld';
import { AudioEditorTool } from '@/components/tools/audio-editor-tool';
import { AuthenticatorCodeGeneratorTool } from '@/components/tools/authenticator-code-generator-tool';
import { Base64ImageViewerTool } from '@/components/tools/base64-image-viewer-tool';
import { BitcoinWalletTool } from '@/components/tools/bitcoin-wallet-tool';
import { CompoundInterestTool } from '@/components/tools/compound-interest-tool';
import { CpfGeneratorTool } from '@/components/tools/cpf-generator-tool';
import { CsvViewerTool } from '@/components/tools/csv-viewer-tool';
import { DataConverterTool } from '@/components/tools/data-converter-tool';
import { TextDiffTool } from '@/components/tools/text-diff-tool';
import { OpenGraphPreviewTool } from '@/components/tools/open-graph-preview-tool';
import { Cs2ToolSuite } from '@/components/tools/cs2-tool-suite';
import { FakePersonGeneratorTool } from '@/components/tools/fake-person-generator-tool';
import {
  frontOnlyToolSoftwareCategory,
  renderFrontOnlyToolUi,
} from '@/components/tools/front-only-tool-router';
import { CryptoConversionLinks } from '@/components/tools/crypto-conversion-links';
import { CryptoUnitConverterTool } from '@/components/tools/crypto-unit-converter';
import { LazyHtmlViewerTool } from '@/components/tools/lazy-html-viewer-tool';
import { MarkdownEditorTool } from '@/components/tools/markdown-editor-tool';
import { ImageConversionLinks } from '@/components/tools/image-conversion-links';
import { ImageConverterTool } from '@/components/tools/image-converter-tool';
import { ImageCompressionTool } from '@/components/tools/image-compression-tool';
import { ChromaBackgroundRemoverTool } from '@/components/tools/chroma-background-remover-tool';
import { ImageToBase64Tool } from '@/components/tools/image-to-base64-tool';
import { InvisibleCharacterTool } from '@/components/tools/invisible-character-tool';
import { InvisiblePlatformLinks } from '@/components/tools/invisible-platform-links';
import { NicknameSymbolGeneratorTool } from '@/components/tools/nickname-symbol-generator-tool';
import { NicknameSymbolPlatformLinks } from '@/components/tools/nickname-symbol-platform-links';
import { JsonFormatterTool } from '@/components/tools/json-formatter-tool';
import { GtaCheatCodesTool } from '@/components/tools/gta-cheat-codes-tool';
import { PasswordGeneratorTool } from '@/components/tools/password-generator-tool';
import { PixDecoderTool } from '@/components/tools/pix-decoder-tool';
import { QrCodeGeneratorTool } from '@/components/tools/qr-code-generator';
import { SorteadorTool } from '@/components/tools/sorteador-tool';
import { ToolAliasLinks } from '@/components/tools/tool-alias-links';
import { WhatsAppTelegramLinkGeneratorTool } from '@/components/tools/whatsapp-telegram-link-generator-tool';
import { ToolPageShell } from '@/components/tools/tool-page-shell';
import { VideoCompressionTool } from '@/components/tools/video-compression-tool';
import { UniversalConverterTool } from '@/components/tools/universal-converter-tool';
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
  getInvisiblePlatformLocalePathMap,
  getInvisiblePlatformPathByLocale,
  getInvisiblePlatformResolutionBySlug,
  getInvisiblePlatformSlugByLocale,
  getInvisiblePlatformStaticParamsByLocale,
  getLocalizedInvisiblePlatformContent,
  getRelatedInvisiblePlatformPages,
  getFeaturedInvisiblePlatformPages,
  invisiblePlatformPages,
  toLocalizedInvisiblePlatformLink,
} from '@/data/invisible-platform-pages';
import {
  getLocalizedNicknameSymbolPlatformContent,
  getNicknameSymbolPlatformLocalePathMap,
  getNicknameSymbolPlatformPathByLocale,
  getNicknameSymbolPlatformResolutionBySlug,
  getNicknameSymbolPlatformSlugByLocale,
  getNicknameSymbolPlatformStaticParamsByLocale,
  getRelatedNicknameSymbolPlatformPages,
  toLocalizedNicknameSymbolPlatformLink,
} from '@/data/nickname-symbol-platform-pages';
import {
  getLocalizedRelatedTools,
  getLocalizedToolBySlug,
} from '@/data/tools-registry';
import {
  getGtaSeoLocalePathMap,
  getGtaSeoPageBySlug,
  getGtaSeoPathByLocale,
  getGtaSeoStaticParamsByLocale,
  getLocalizedGtaSeoContent,
  getLocalizedGtaSeoLabel,
  getRelatedGtaSeoPages,
  type GtaSeoPage,
} from '@/data/gta/gta-seo-pages';
import {
  getLegacyToolAliasPageBySlug,
  getLegacyToolAliasToolSlugBySlug,
  getLocalizedToolAliasContent,
  getRelatedToolAliasPages,
  getToolAliasCryptoPreset,
  getToolAliasImagePreset,
  getToolAliasLocalePathMap,
  getToolAliasPageBySlug,
  getToolAliasPathByLocale,
  getToolAliasStaticParamsByLocale,
  getToolAliasUniversalPreset,
  toLocalizedToolAliasLink,
  type ToolAliasPage,
} from '@/data/tool-alias-pages';
import {
  getLocalizedUniversalConversionLandingContent,
  getUniversalConversionLandingBySlug,
} from '@/data/universal-converter-pages';
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
import { isCs2ToolId } from '@/data/cs2/tools';
import type { ToolDefinition } from '@/types/tool';

export const dynamicParams = true;

const baseInvisibleToolSlug = 'invisible-character';
const baseNicknameSymbolToolSlug = 'nickname-symbol-generator';
const credentialGeneratorToolSlug = ['pas', 'sword-generator'].join('');

const localizedSearchIntent: Record<AppLocale, string> = {
  'pt-br':
    'Pessoas que buscam caractere invisivel por jogo ou rede social para copiar e colar, com mais chance de aprovacao em validadores de nickname.',
  en: 'People looking for platform-specific invisible character patterns to copy and paste into nickname fields.',
  es: 'Personas que buscan patrones de caracter invisible por plataforma para copiar y pegar en campos de nickname.',
};

const nicknameSymbolSearchIntent: Record<AppLocale, string> = {
  'pt-br':
    'Jogadores que querem criar um nickname com simbolos e estilos Unicode adaptados ao contexto do jogo.',
  en: 'Players who want to create a gaming name with symbols and Unicode styles for a specific game.',
  es: 'Jugadores que quieren crear un nickname con simbolos y estilos Unicode para un juego concreto.',
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

const nicknameSymbolRelatedCopy: Record<AppLocale, { title: string; description: string }> = {
  'pt-br': {
    title: 'Simbolos para outros jogos',
    description: 'Abra outros presets com molduras e orientacoes proprias de cada jogo.',
  },
  en: {
    title: 'Name symbols for other games',
    description: 'Open other presets with frames and guidance tailored to each game.',
  },
  es: {
    title: 'Simbolos para otros juegos',
    description: 'Abre otros presets con marcos y recomendaciones para cada juego.',
  },
};

const toolAliasCopy: Record<AppLocale, { title: string; description: string }> = {
  'pt-br': {
    title: 'Outras formas de usar esta ferramenta',
    description:
      'Abra versoes focadas em tarefas especificas sem perder os recursos da ferramenta principal.',
  },
  en: {
    title: 'More ways to use this tool',
    description:
      'Open task-focused versions while keeping the complete workflow from the main tool.',
  },
  es: {
    title: 'Mas formas de usar esta herramienta',
    description:
      'Abre versiones enfocadas en tareas concretas sin perder el flujo de la herramienta principal.',
  },
};

const gtaRelatedCopy: Record<AppLocale, { title: string; description: string }> = {
  'pt-br': {
    title: 'Outras paginas de codigos GTA',
    description:
      'Acesse listas por jogo e categoria para copiar o cheat certo mais rapido.',
  },
  en: {
    title: 'Related GTA cheat pages',
    description:
      'Browse lists by game and category to find the exact cheat faster.',
  },
  es: {
    title: 'Otras paginas de codigos GTA',
    description:
      'Navega listas por juego y categoria para encontrar el cheat correcto mas rapido.',
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
  ...frontOnlyToolSoftwareCategory,
  'crypto-unit-converter': 'FinanceApplication',
  'bitcoin-wallet': 'FinanceApplication',
  'html-viewer': 'DeveloperApplication',
  'markdown-editor': 'DeveloperApplication',
  'json-formatter': 'DeveloperApplication',
  'csv-viewer': 'DeveloperApplication',
  'data-converter': 'DeveloperApplication',
  'text-diff': 'DeveloperApplication',
  'open-graph-preview': 'DeveloperApplication',
  'cpf-generator': 'UtilitiesApplication',
  'gerador-pessoa-fake': 'DeveloperApplication',
  [credentialGeneratorToolSlug]: 'SecurityApplication',
  'base64-image-viewer': 'DeveloperApplication',
  'image-to-base64': 'DeveloperApplication',
  'image-converter': 'UtilitiesApplication',
  'image-compression': 'UtilitiesApplication',
  'remover-fundo-imagem': 'UtilitiesApplication',
  'video-compression': 'UtilitiesApplication',
  'extrair-audio-de-video': 'MultimediaApplication',
  'qr-code-generator': 'UtilitiesApplication',
  'authenticator-code-generator': 'SecurityApplication',
  'gerador-link-whatsapp-telegram': 'UtilitiesApplication',
  sorteador: 'UtilitiesApplication',
  'calculadora-juros-compostos': 'FinanceApplication',
  'invisible-character': 'UtilitiesApplication',
  'nickname-symbol-generator': 'UtilitiesApplication',
  'conversor-universal': 'DeveloperApplication',
};

type LandingResolution =
  | {
      kind: 'gta-seo-page';
      page: GtaSeoPage;
    }
  | {
      kind: 'invisible-platform';
      resolution: NonNullable<ReturnType<typeof getInvisiblePlatformResolutionBySlug>>;
    }
  | {
      kind: 'nickname-symbol-platform';
      resolution: NonNullable<ReturnType<typeof getNicknameSymbolPlatformResolutionBySlug>>;
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

type RenderContext = {
  locale: AppLocale;
  dictionary: ReturnType<typeof getDictionary>;
};

type AliasUiResolution = {
  toolUi: ReactNode | null;
  focusedSection: ReactNode | null;
};

type SimpleAliasToolUiRenderer = (context: RenderContext) => ReactNode;

const dedupeKeywords = (keywords: string[]): string[] =>
  Array.from(new Set(keywords.map((item) => item.trim()).filter(Boolean)));

const resolveLanding = (slug: string): LandingResolution | undefined => {
  const gtaSeoPage = getGtaSeoPageBySlug(slug);
  if (gtaSeoPage) {
    return {
      kind: 'gta-seo-page',
      page: gtaSeoPage,
    };
  }

  const invisibleResolution = getInvisiblePlatformResolutionBySlug(slug);
  if (invisibleResolution) {
    return {
      kind: 'invisible-platform',
      resolution: invisibleResolution,
    };
  }

  const nicknameSymbolResolution = getNicknameSymbolPlatformResolutionBySlug(slug);
  if (nicknameSymbolResolution) {
    return {
      kind: 'nickname-symbol-platform',
      resolution: nicknameSymbolResolution,
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

const getImageAliasContext = (
  page: ToolAliasPage,
  locale: AppLocale,
): ContextualLandingContent | undefined => {
  if (page.toolSlug !== 'image-converter' || !page.imageConversionSlug) {
    return undefined;
  }

  const resolution = getImageConversionResolutionBySlug(page.imageConversionSlug);
  if (!resolution) {
    return undefined;
  }

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
};

const getCryptoAliasContext = (
  page: ToolAliasPage,
  locale: AppLocale,
): ContextualLandingContent | undefined => {
  if (page.toolSlug !== 'crypto-unit-converter' || !page.cryptoConversionSlug) {
    return undefined;
  }

  const resolution = getCryptoConversionResolutionBySlug(page.cryptoConversionSlug);
  if (!resolution) {
    return undefined;
  }

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
};

const getInvisibleAliasContext = (
  page: ToolAliasPage,
  locale: AppLocale,
): ContextualLandingContent | undefined => {
  if (page.toolSlug !== 'invisible-character' || !page.invisiblePlatformId) {
    return undefined;
  }

  const platformPage = invisiblePlatformPages.find((item) => item.platformId === page.invisiblePlatformId);
  if (!platformPage) {
    return undefined;
  }

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
};

const getUniversalAliasContext = (
  page: ToolAliasPage,
  locale: AppLocale,
): ContextualLandingContent | undefined => {
  if (page.toolSlug !== 'conversor-universal' || !page.universalConversionSlug) {
    return undefined;
  }

  const conversionPage = getUniversalConversionLandingBySlug(page.universalConversionSlug);
  if (!conversionPage) {
    return undefined;
  }

  const localized = getLocalizedUniversalConversionLandingContent(conversionPage, locale);
  return {
    title: localized.h1,
    intro: localized.intro,
    seoTitle: localized.seoTitle,
    seoDescription: localized.seoDescription,
    keywords: [localized.primaryKeyword, ...localized.secondaryKeywords],
    contentBlocks: localized.contentBlocks,
    faq: localized.faq,
  };
};

const getContextualLandingContent = (
  page: ToolAliasPage,
  locale: AppLocale,
): ContextualLandingContent | undefined => {
  const resolvers = [
    getImageAliasContext,
    getCryptoAliasContext,
    getInvisibleAliasContext,
    getUniversalAliasContext,
  ];

  for (const resolver of resolvers) {
    const context = resolver(page, locale);
    if (context) {
      return context;
    }
  }

  return undefined;
};

const simpleAliasToolUiRenderers: Record<string, SimpleAliasToolUiRenderer> = {
  'authenticator-code-generator': ({ locale }) => <AuthenticatorCodeGeneratorTool locale={locale} />,
  'bitcoin-wallet': ({ locale }) => <BitcoinWalletTool locale={locale} />,
  'html-viewer': ({ locale }) => <LazyHtmlViewerTool locale={locale} />,
  'markdown-editor': ({ locale }) => <MarkdownEditorTool locale={locale} />,
  'json-formatter': ({ locale }) => <JsonFormatterTool locale={locale} />,
  'csv-viewer': ({ locale }) => <CsvViewerTool locale={locale} />,
  'data-converter': ({ locale }) => <DataConverterTool locale={locale} />,
  'text-diff': ({ locale }) => <TextDiffTool locale={locale} />,
  'open-graph-preview': ({ locale }) => <OpenGraphPreviewTool locale={locale} />,
  'cpf-generator': ({ locale }) => <CpfGeneratorTool locale={locale} />,
  'gerador-pessoa-fake': ({ locale }) => <FakePersonGeneratorTool locale={locale} />,
  [credentialGeneratorToolSlug]: ({ locale }) => <PasswordGeneratorTool locale={locale} />,
  'base64-image-viewer': ({ locale }) => <Base64ImageViewerTool locale={locale} />,
  'image-to-base64': ({ locale }) => <ImageToBase64Tool locale={locale} />,
  'image-compression': ({ locale }) => <ImageCompressionTool locale={locale} />,
  'remover-fundo-imagem': ({ locale }) => <ChromaBackgroundRemoverTool locale={locale} />,
  'video-compression': ({ locale }) => <VideoCompressionTool locale={locale} />,
  'extrair-audio-de-video': ({ locale }) => <AudioEditorTool locale={locale} />,
  'qr-code-generator': ({ locale }) => <QrCodeGeneratorTool locale={locale} />,
  'gerador-link-whatsapp-telegram': ({ locale }) => (
    <WhatsAppTelegramLinkGeneratorTool locale={locale} />
  ),
  sorteador: ({ locale }) => <SorteadorTool locale={locale} />,
  'calculadora-juros-compostos': ({ locale }) => <CompoundInterestTool locale={locale} />,
  'pix-decoder': ({ locale }) => <PixDecoderTool locale={locale} />,
};

const resolveCryptoAliasUi = (
  aliasPage: ToolAliasPage,
  context: RenderContext,
): AliasUiResolution => {
  const cryptoPreset = getToolAliasCryptoPreset(aliasPage);
  const toolUi = (
    <CryptoUnitConverterTool
      locale={context.locale}
      initialAssetId={cryptoPreset?.assetId}
      initialFromUnitId={cryptoPreset?.fromUnitId}
      initialToUnitId={cryptoPreset?.toUnitId}
    />
  );

  const cryptoLinks = (aliasPage.cryptoConversionSlug
    ? getRelatedCryptoConversionPages(aliasPage.cryptoConversionSlug, 4)
    : getFeaturedCryptoConversionPages(4)
  ).map((page) => toLocalizedCryptoConversionLink(page, context.locale));

  const focusedSection = (
    <CryptoConversionLinks
      title={context.dictionary.toolShell.cryptoPopularTitle}
      description={context.dictionary.toolShell.cryptoPopularDescription}
      fromToConnector={context.dictionary.qrToolUi.fromToConnector}
      links={cryptoLinks}
    />
  );

  return { toolUi, focusedSection };
};

const resolveImageAliasUi = (
  aliasPage: ToolAliasPage,
  context: RenderContext,
): AliasUiResolution => {
  const imagePreset = getToolAliasImagePreset(aliasPage);
  const toolUi = (
    <ImageConverterTool
      locale={context.locale}
      initialFromFormat={imagePreset?.fromFormatId}
      initialToFormat={imagePreset?.toFormatId}
    />
  );

  const imageLinks = (aliasPage.imageConversionSlug
    ? getRelatedImageConversionPages(aliasPage.imageConversionSlug, 4)
    : getFeaturedImageConversionPages(4)
  ).map((page) => toLocalizedImageConversionLink(page, context.locale));

  const sectionCopy = imageConversionSectionByLocale[context.locale];
  const focusedSection = (
    <ImageConversionLinks
      title={sectionCopy.title}
      description={sectionCopy.description}
      fromToConnector={context.dictionary.qrToolUi.fromToConnector}
      links={imageLinks}
    />
  );

  return { toolUi, focusedSection };
};

const resolveInvisibleAliasUi = (
  aliasPage: ToolAliasPage,
  context: RenderContext,
): AliasUiResolution => {
  const toolUi = (
    <InvisibleCharacterTool locale={context.locale} initialPlatformId={aliasPage.invisiblePlatformId} />
  );

  const currentInvisiblePage = aliasPage.invisiblePlatformId
    ? invisiblePlatformPages.find((page) => page.platformId === aliasPage.invisiblePlatformId)
    : undefined;

  const platformLinks = (currentInvisiblePage
    ? getRelatedInvisiblePlatformPages(currentInvisiblePage.slug, 4)
    : getFeaturedInvisiblePlatformPages(4)
  ).map((page) => toLocalizedInvisiblePlatformLink(page, context.locale));

  const sectionCopy = invisibleSectionByLocale[context.locale];
  const focusedSection = (
    <InvisiblePlatformLinks
      title={sectionCopy.title}
      description={sectionCopy.description}
      links={platformLinks}
    />
  );

  return { toolUi, focusedSection };
};

const resolveSpecialAliasUi = (
  aliasPage: ToolAliasPage,
  context: RenderContext,
): AliasUiResolution | undefined => {
  if (aliasPage.toolSlug === 'crypto-unit-converter') {
    return resolveCryptoAliasUi(aliasPage, context);
  }

  if (aliasPage.toolSlug === 'image-converter') {
    return resolveImageAliasUi(aliasPage, context);
  }

  if (aliasPage.toolSlug === 'invisible-character') {
    return resolveInvisibleAliasUi(aliasPage, context);
  }

  if (isCs2ToolId(aliasPage.toolSlug)) {
    return {
      toolUi: <Cs2ToolSuite locale={context.locale} toolId={aliasPage.toolSlug} />,
      focusedSection: null,
    };
  }

  if (aliasPage.toolSlug === 'conversor-universal') {
    const universalPreset = getToolAliasUniversalPreset(aliasPage);

    return {
      toolUi: (
        <UniversalConverterTool
          locale={context.locale}
          defaultConversionId={universalPreset?.conversionId}
          defaultPresetId={universalPreset?.presetId}
          defaultInput={universalPreset?.exampleInput}
        />
      ),
      focusedSection: null,
    };
  }

  const frontOnlyToolUi = renderFrontOnlyToolUi(aliasPage.toolSlug, context.locale);
  if (frontOnlyToolUi) {
    return {
      toolUi: frontOnlyToolUi,
      focusedSection: null,
    };
  }

  return undefined;
};

const resolveToolAliasUi = (
  aliasPage: ToolAliasPage,
  context: RenderContext,
): AliasUiResolution => {
  const specialUi = resolveSpecialAliasUi(aliasPage, context);
  if (specialUi) {
    return specialUi;
  }

  const simpleRenderer = simpleAliasToolUiRenderers[aliasPage.toolSlug];
  if (!simpleRenderer) {
    return { toolUi: null, focusedSection: null };
  }

  return {
    toolUi: simpleRenderer(context),
    focusedSection: null,
  };
};

const buildAfterToolSection = (
  locale: AppLocale,
  focusedSection: ReactNode | null,
  aliasLinks: Array<{ slug: string; path: string; label: string }>,
): ReactNode | undefined => {
  const hasFocusedSection = Boolean(focusedSection);
  const hasAliasLinks = aliasLinks.length > 0;

  if (!hasFocusedSection && !hasAliasLinks) {
    return undefined;
  }

  return (
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
  );
};

const renderGtaLandingPage = (
  landingPage: GtaSeoPage,
  context: RenderContext,
): ReactNode => {
  const baseTool = getLocalizedToolBySlug(context.locale, 'gta-cheat-codes');

  if (!baseTool) {
    notFound();
  }

  const localizedContent = getLocalizedGtaSeoContent(landingPage, context.locale);
  const relatedTools = getLocalizedRelatedTools(context.locale, baseTool.id);
  const canonicalPath = getGtaSeoPathByLocale(landingPage, context.locale);

  const relatedGtaLinks = getRelatedGtaSeoPages(landingPage.id, 4).map((page) => ({
    slug: page.slugs[context.locale],
    path: getGtaSeoPathByLocale(page, context.locale),
    label: getLocalizedGtaSeoLabel(page, context.locale),
  }));

  const landingTool: ToolDefinition = {
    ...baseTool,
    name: localizedContent.title,
    h1: localizedContent.title,
    intro: localizedContent.intro,
    seoTitle: localizedContent.seoTitle,
    seoDescription: localizedContent.seoDescription,
    canonicalPath,
    primaryKeyword: localizedContent.primaryKeyword,
    secondaryKeywords: localizedContent.secondaryKeywords,
    searchIntent: baseTool.searchIntent,
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
          locale: context.locale,
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
          { name: context.dictionary.common.home, path: localizePath(context.locale, '/') },
          { name: context.dictionary.common.tools, path: localizePath(context.locale, '/tools') },
          { name: baseTool.name, path: baseTool.canonicalPath },
          { name: landingTool.name, path: canonicalPath },
        ])}
      />
      <JsonLd data={buildFaqJsonLd(landingTool.faq)} />

      <ToolPageShell
        locale={context.locale}
        tool={landingTool}
        relatedTools={relatedTools}
        toolUi={
          <GtaCheatCodesTool
            locale={context.locale}
            initialGame={landingPage.game}
            initialCategory={landingPage.category}
          />
        }
        afterToolSection={
          <ToolAliasLinks
            title={gtaRelatedCopy[context.locale].title}
            description={gtaRelatedCopy[context.locale].description}
            links={relatedGtaLinks}
          />
        }
      />
    </>
  );
};

const renderInvisibleLandingPage = (
  resolution: NonNullable<ReturnType<typeof getInvisiblePlatformResolutionBySlug>>,
  context: RenderContext,
): ReactNode => {
  const baseTool = getLocalizedToolBySlug(context.locale, baseInvisibleToolSlug);

  if (!baseTool) {
    notFound();
  }

  const localizedContent = getLocalizedInvisiblePlatformContent(resolution.page, context.locale);
  const relatedTools = getLocalizedRelatedTools(context.locale, baseTool.id);
  const relatedPlatformPages = getRelatedInvisiblePlatformPages(resolution.page.slug, 4).map((page) =>
    toLocalizedInvisiblePlatformLink(page, context.locale),
  );

  const canonicalPath = getInvisiblePlatformPathByLocale(resolution.page, context.locale);

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
    searchIntent: localizedSearchIntent[context.locale],
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
          locale: context.locale,
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
          { name: context.dictionary.common.home, path: localizePath(context.locale, '/') },
          { name: context.dictionary.common.tools, path: localizePath(context.locale, '/tools') },
          {
            name: baseTool.name,
            path: localizePath(context.locale, '/tools/invisible-character'),
          },
          {
            name: resolution.page.platformName,
            path: canonicalPath,
          },
        ])}
      />

      <JsonLd data={buildFaqJsonLd(landingTool.faq)} />

      <ToolPageShell
        locale={context.locale}
        tool={landingTool}
        relatedTools={relatedTools}
        toolUi={
          <InvisibleCharacterTool
            locale={context.locale}
            initialPlatformId={resolution.page.platformId}
          />
        }
        afterToolSection={
          <InvisiblePlatformLinks
            title={relatedSectionCopy[context.locale].title}
            description={relatedSectionCopy[context.locale].description}
            links={relatedPlatformPages}
          />
        }
      />
    </>
  );
};

const renderNicknameSymbolLandingPage = (
  resolution: NonNullable<ReturnType<typeof getNicknameSymbolPlatformResolutionBySlug>>,
  context: RenderContext,
): ReactNode => {
  const baseTool = getLocalizedToolBySlug(context.locale, baseNicknameSymbolToolSlug);

  if (!baseTool) {
    notFound();
  }

  const localizedContent = getLocalizedNicknameSymbolPlatformContent(
    resolution.page,
    context.locale,
  );
  const relatedTools = getLocalizedRelatedTools(context.locale, baseTool.id);
  const relatedPlatformPages = getRelatedNicknameSymbolPlatformPages(
    resolution.page.platformId,
    4,
  ).map((page) => toLocalizedNicknameSymbolPlatformLink(page, context.locale));
  const canonicalPath = getNicknameSymbolPlatformPathByLocale(
    resolution.page,
    context.locale,
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
    searchIntent: nicknameSymbolSearchIntent[context.locale],
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
          locale: context.locale,
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
          { name: context.dictionary.common.home, path: localizePath(context.locale, '/') },
          { name: context.dictionary.common.tools, path: localizePath(context.locale, '/tools') },
          {
            name: baseTool.name,
            path: localizePath(context.locale, '/tools/nickname-symbol-generator'),
          },
          { name: resolution.page.platformName, path: canonicalPath },
        ])}
      />

      <JsonLd data={buildFaqJsonLd(landingTool.faq)} />

      <ToolPageShell
        locale={context.locale}
        tool={landingTool}
        relatedTools={relatedTools}
        toolUi={
          <NicknameSymbolGeneratorTool
            locale={context.locale}
            initialPlatformId={resolution.page.platformId}
          />
        }
        afterToolSection={
          <NicknameSymbolPlatformLinks
            title={nicknameSymbolRelatedCopy[context.locale].title}
            description={nicknameSymbolRelatedCopy[context.locale].description}
            links={relatedPlatformPages}
          />
        }
      />
    </>
  );
};

const renderToolAliasLandingPage = (
  aliasPage: ToolAliasPage,
  context: RenderContext,
): ReactNode => {
  const baseTool = getLocalizedToolBySlug(context.locale, aliasPage.toolSlug);

  if (!baseTool) {
    notFound();
  }

  const aliasContent = getLocalizedToolAliasContent(aliasPage, context.locale, baseTool.name);
  const contextualContent = getContextualLandingContent(aliasPage, context.locale);
  const relatedTools = getLocalizedRelatedTools(context.locale, baseTool.id);
  const canonicalPath = getToolAliasPathByLocale(aliasPage, context.locale);

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

  const aliasUi = resolveToolAliasUi(aliasPage, context);
  if (!aliasUi.toolUi) {
    notFound();
  }

  const aliasLinks = getRelatedToolAliasPages(
    aliasPage.toolSlug,
    aliasPage.slug,
    context.locale,
    4,
  ).map((page) => toLocalizedToolAliasLink(page, context.locale));

  const afterToolSection = buildAfterToolSection(
    context.locale,
    aliasUi.focusedSection,
    aliasLinks,
  );

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
          locale: context.locale,
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
          { name: context.dictionary.common.home, path: localizePath(context.locale, '/') },
          { name: context.dictionary.common.tools, path: localizePath(context.locale, '/tools') },
          {
            name: baseTool.name,
            path: baseTool.canonicalPath,
          },
          {
            name: breadcrumbAliasLabel,
            path: canonicalPath,
          },
        ])}
      />

      <JsonLd data={buildFaqJsonLd(landingTool.faq)} />

      <ToolPageShell
        locale={context.locale}
        tool={landingTool}
        relatedTools={relatedTools}
        toolUi={aliasUi.toolUi}
        afterToolSection={afterToolSection}
      />
    </>
  );
};

export function generateStaticParams() {
  const params = new Set<string>();

  locales.forEach((locale) => {
    getGtaSeoStaticParamsByLocale(locale).forEach(({ platformPageSlug }) => {
      params.add(`${locale}:${platformPageSlug}`);
    });

    getInvisiblePlatformStaticParamsByLocale(locale).forEach(({ platformPageSlug }) => {
      params.add(`${locale}:${platformPageSlug}`);
    });

    getNicknameSymbolPlatformStaticParamsByLocale(locale).forEach(({ platformPageSlug }) => {
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
      localePaths: getInvisiblePlatformLocalePathMap(landing.resolution.page),
      keywords: localizedContent.keywords,
    });
  }

  if (landing.kind === 'nickname-symbol-platform') {
    const localizedContent = getLocalizedNicknameSymbolPlatformContent(
      landing.resolution.page,
      locale,
    );

    return buildLocalizedMetadata({
      locale,
      title: localizedContent.seoTitle,
      description: localizedContent.seoDescription,
      localePaths: getNicknameSymbolPlatformLocalePathMap(landing.resolution.page),
      keywords: localizedContent.keywords,
    });
  }

  if (landing.kind === 'gta-seo-page') {
    const localizedContent = getLocalizedGtaSeoContent(landing.page, locale);

    return buildLocalizedMetadata({
      locale,
      title: localizedContent.seoTitle,
      description: localizedContent.seoDescription,
      localePaths: getGtaSeoLocalePathMap(landing.page),
      keywords: [localizedContent.primaryKeyword, ...localizedContent.secondaryKeywords],
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
  const context: RenderContext = { locale, dictionary };

  if (!landing) {
    const legacyAliasPage = getLegacyToolAliasPageBySlug(platformPageSlug);
    if (legacyAliasPage) {
      const baseTool = getLocalizedToolBySlug(locale, legacyAliasPage.toolSlug);
      if (baseTool) {
        const targetPath = legacyAliasPage.sourceLocales.includes(locale)
          ? getToolAliasPathByLocale(legacyAliasPage, locale)
          : baseTool.canonicalPath;
        permanentRedirect(targetPath);
      }
    }

    const legacyToolSlug = getLegacyToolAliasToolSlugBySlug(platformPageSlug);
    if (legacyToolSlug) {
      const baseTool = getLocalizedToolBySlug(locale, legacyToolSlug);
      if (baseTool) {
        permanentRedirect(baseTool.canonicalPath);
      }
    }

    notFound();
  }

  if (landing.kind === 'gta-seo-page') {
    if (platformPageSlug !== landing.page.slugs[locale]) {
      permanentRedirect(getGtaSeoPathByLocale(landing.page, locale));
    }

    return renderGtaLandingPage(landing.page, context);
  }

  if (landing.kind === 'invisible-platform') {
    const canonicalSlug = getInvisiblePlatformSlugByLocale(landing.resolution.page, locale);
    if (platformPageSlug !== canonicalSlug) {
      permanentRedirect(getInvisiblePlatformPathByLocale(landing.resolution.page, locale));
    }

    return renderInvisibleLandingPage(landing.resolution, context);
  }

  if (landing.kind === 'nickname-symbol-platform') {
    const canonicalSlug = getNicknameSymbolPlatformSlugByLocale(
      landing.resolution.page,
      locale,
    );
    if (platformPageSlug !== canonicalSlug) {
      permanentRedirect(
        getNicknameSymbolPlatformPathByLocale(landing.resolution.page, locale),
      );
    }

    return renderNicknameSymbolLandingPage(landing.resolution, context);
  }

  if (!landing.page.sourceLocales.includes(locale)) {
    const baseTool = getLocalizedToolBySlug(locale, landing.page.toolSlug);
    if (baseTool) {
      permanentRedirect(baseTool.canonicalPath);
    }
  }

  return renderToolAliasLandingPage(landing.page, context);
}
