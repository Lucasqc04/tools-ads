import {
  getCryptoConversionResolutionBySlug,
  type CryptoConversionPage,
} from '@/data/crypto-conversion-pages';
import {
  getImageConversionResolutionBySlug,
  type ImageConversionPage,
} from '@/data/image-conversion-pages';
import { invisiblePlatformPages } from '@/data/invisible-platform-pages';
import { toolAliasKeywordSeeds } from '@/data/tool-alias-keywords';
import { getLocalizedToolBySlug, toolsRegistry } from '@/data/tools-registry';
import { localizePath, locales, type AppLocale } from '@/lib/i18n/config';
import { invisiblePlatforms } from '@/lib/invisible-character';

type LocalizedText = Record<AppLocale, string>;

export type ToolAliasPage = {
  slug: string;
  toolSlug: string;
  keywordByLocale: LocalizedText;
  imageConversionSlug?: string;
  cryptoConversionSlug?: string;
  invisiblePlatformId?: string;
  invisiblePlatformSlug?: string;
};

export type ToolAliasLinkItem = {
  slug: string;
  path: string;
  label: string;
};

export type LocalizedToolAliasContent = {
  title: string;
  h1: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  primaryKeyword: string;
  searchIntent: string;
};

const ROOT_RESERVED_SLUGS = new Set<string>([
  'about',
  'contact',
  'tools',
  'privacy-policy',
  'terms',
  'api',
  'sitemap',
  'sitemap.xml',
  'robots',
  'robots.txt',
]);

const MAX_ALIASES_PER_TOOL = 72;

const invisiblePlatformSlugByAliasToken: Record<string, string> = {
  cod: 'cod-mobile',
  ff: 'free-fire',
  lol: 'league-of-legends',
  cs2: 'counter-strike-2',
  csgo: 'counter-strike-2',
  pubg: 'pubg-mobile',
};

const invisiblePlatformCandidates = [...invisiblePlatforms].sort(
  (a, b) => b.slug.length - a.slug.length,
);

const invisiblePageSlugSet = new Set(
  invisiblePlatformPages.flatMap((page) => [page.slugPtBr, page.slugEn, page.slugEs]),
);

const sanitizeSlug = (value: string): string =>
  value
    .trim()
    .replaceAll('μ', 'u')
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-+|-+$/g, '');

const normalizePhrase = (value: string): string =>
  value
    .replaceAll(/\s+/g, ' ')
    .replaceAll(/\u00a0/g, ' ')
    .trim();

const humanizeSlug = (slug: string): string => slug.replaceAll('-', ' ');

const dedupe = <T,>(items: T[]): T[] => Array.from(new Set(items));

const pickKeywordForLocale = (
  locale: AppLocale,
  byLocale: Partial<Record<AppLocale, string>>,
  slug: string,
): string =>
  byLocale[locale] ??
  byLocale['pt-br'] ??
  byLocale.en ??
  byLocale.es ??
  humanizeSlug(slug);

const collectToolKeywordSeeds = (toolSlug: string, locale: AppLocale): string[] => {
  const localizedTool = getLocalizedToolBySlug(locale, toolSlug);
  if (!localizedTool) {
    return [];
  }

  const customSeeds = toolAliasKeywordSeeds[toolSlug]?.[locale] ?? [];

  return dedupe(
    [
      localizedTool.name,
      localizedTool.h1,
      localizedTool.primaryKeyword,
      ...localizedTool.secondaryKeywords,
      ...customSeeds,
    ]
      .map((phrase) => normalizePhrase(phrase))
      .filter(Boolean),
  );
};

const detectInvisiblePlatform = (
  slug: string,
): { invisiblePlatformId: string; invisiblePlatformSlug: string } | undefined => {
  const exact = invisiblePlatformCandidates.find(
    (platform) =>
      slug === platform.slug ||
      slug.endsWith(`-${platform.slug}`) ||
      slug.includes(`-${platform.slug}-`),
  );

  if (exact) {
    return {
      invisiblePlatformId: exact.id,
      invisiblePlatformSlug: exact.slug,
    };
  }

  const aliasMatch = Object.entries(invisiblePlatformSlugByAliasToken).find(
    ([token]) => slug === token || slug.endsWith(`-${token}`) || slug.includes(`-${token}-`),
  );

  if (!aliasMatch) {
    return undefined;
  }

  const [, platformSlug] = aliasMatch;
  const platform = invisiblePlatforms.find((item) => item.slug === platformSlug);
  if (!platform) {
    return undefined;
  }

  return {
    invisiblePlatformId: platform.id,
    invisiblePlatformSlug: platform.slug,
  };
};

const detectImageConversionSlug = (slug: string): string | undefined => {
  const resolution = getImageConversionResolutionBySlug(slug);
  return resolution?.page.slug;
};

const detectCryptoConversionSlug = (slug: string): string | undefined => {
  const resolution = getCryptoConversionResolutionBySlug(slug);
  return resolution?.page.slug;
};

const shouldKeepAliasSlug = (slug: string): boolean => {
  if (!slug || slug.length < 4 || slug.length > 96) {
    return false;
  }

  if (ROOT_RESERVED_SLUGS.has(slug)) {
    return false;
  }

  if (invisiblePageSlugSet.has(slug)) {
    return false;
  }

  if (slug.startsWith('tools-')) {
    return false;
  }

  return true;
};

const buildToolAliasPages = (): ToolAliasPage[] => {
  const usedSlugs = new Set<string>();
  const pages: ToolAliasPage[] = [];

  toolsRegistry.forEach((tool) => {
    const keywordBucket = new Map<string, Partial<Record<AppLocale, string>>>();

    locales.forEach((locale) => {
      const phrases = collectToolKeywordSeeds(tool.slug, locale);

      phrases.forEach((phrase) => {
        const slug = sanitizeSlug(phrase);
        if (!shouldKeepAliasSlug(slug)) {
          return;
        }

        const current = keywordBucket.get(slug) ?? {};
        if (!current[locale]) {
          current[locale] = phrase;
          keywordBucket.set(slug, current);
        }
      });
    });

    const sortedAliases = Array.from(keywordBucket.entries()).slice(0, MAX_ALIASES_PER_TOOL);

    sortedAliases.forEach(([slug, byLocale]) => {
      if (usedSlugs.has(slug)) {
        return;
      }

      const keywordByLocale: LocalizedText = {
        'pt-br': pickKeywordForLocale('pt-br', byLocale, slug),
        en: pickKeywordForLocale('en', byLocale, slug),
        es: pickKeywordForLocale('es', byLocale, slug),
      };

      const basePage: ToolAliasPage = {
        slug,
        toolSlug: tool.slug,
        keywordByLocale,
      };

      if (tool.slug === 'image-converter') {
        const imageConversionSlug = detectImageConversionSlug(slug);
        if (imageConversionSlug) {
          basePage.imageConversionSlug = imageConversionSlug;
        }
      }

      if (tool.slug === 'crypto-unit-converter') {
        const cryptoConversionSlug = detectCryptoConversionSlug(slug);
        if (cryptoConversionSlug) {
          basePage.cryptoConversionSlug = cryptoConversionSlug;
        }
      }

      if (tool.slug === 'invisible-character') {
        const platformMatch = detectInvisiblePlatform(slug);
        if (platformMatch) {
          basePage.invisiblePlatformId = platformMatch.invisiblePlatformId;
          basePage.invisiblePlatformSlug = platformMatch.invisiblePlatformSlug;
        }
      }

      pages.push(basePage);
      usedSlugs.add(slug);
    });
  });

  return pages.sort((a, b) => a.slug.localeCompare(b.slug));
};

export const toolAliasPages: ToolAliasPage[] = buildToolAliasPages();

const toolAliasPageBySlug = new Map(toolAliasPages.map((page) => [page.slug, page]));

export const getToolAliasPageBySlug = (slug: string): ToolAliasPage | undefined =>
  toolAliasPageBySlug.get(slug);

export const getToolAliasStaticParamsByLocale = (
  locale: AppLocale,
): Array<{ platformPageSlug: string }> => {
  void locale;

  return toolAliasPages.map((page) => ({
    platformPageSlug: page.slug,
  }));
};

export const getToolAliasPathByLocale = (
  page: ToolAliasPage,
  locale: AppLocale,
): string => localizePath(locale, `/${page.slug}`);

export const getToolAliasLocalePathMap = (
  page: ToolAliasPage,
): Record<AppLocale, string> => ({
  'pt-br': getToolAliasPathByLocale(page, 'pt-br'),
  en: getToolAliasPathByLocale(page, 'en'),
  es: getToolAliasPathByLocale(page, 'es'),
});

export const getLocalizedToolAliasLabel = (
  page: ToolAliasPage,
  locale: AppLocale,
): string => page.keywordByLocale[locale];

const aliasIntroByLocale: Record<AppLocale, (keyword: string, toolName: string) => string> = {
  'pt-br': (keyword, toolName) =>
    `Versao dedicada para ${keyword}. Use ${toolName} com o mesmo fluxo completo da ferramenta principal, sem cadastro e sem login.`,
  en: (keyword, toolName) =>
    `Dedicated variation for ${keyword}. Use ${toolName} with the full workflow from the main tool, with no sign-up and no login.`,
  es: (keyword, toolName) =>
    `Variacion dedicada para ${keyword}. Usa ${toolName} con el flujo completo de la herramienta principal, sin registro y sin login.`,
};

const aliasSearchIntentByLocale: Record<
  AppLocale,
  (keyword: string, toolName: string) => string
> = {
  'pt-br': (keyword, toolName) =>
    `Usuarios buscando ${keyword} e querendo resolver a tarefa direto no ${toolName} com rapidez.`,
  en: (keyword, toolName) =>
    `Users searching for ${keyword} and expecting to complete the task quickly with ${toolName}.`,
  es: (keyword, toolName) =>
    `Usuarios que buscan ${keyword} y esperan resolver la tarea rapido con ${toolName}.`,
};

const aliasSeoDescriptionByLocale: Record<
  AppLocale,
  (keyword: string, toolName: string) => string
> = {
  'pt-br': (keyword, toolName) =>
    `Use ${toolName} para ${keyword} online, gratis, sem cadastro, sem login e com execucao rapida direto no navegador.`,
  en: (keyword, toolName) =>
    `Use ${toolName} for ${keyword} online, free, with no sign-up, no login, and fast in-browser execution.`,
  es: (keyword, toolName) =>
    `Usa ${toolName} para ${keyword} online, gratis, sin registro, sin login y con ejecucion rapida en el navegador.`,
};

export const getLocalizedToolAliasContent = (
  page: ToolAliasPage,
  locale: AppLocale,
  toolName: string,
): LocalizedToolAliasContent => {
  const keyword = page.keywordByLocale[locale];

  return {
    title: `${toolName} - ${keyword}`,
    h1: `${toolName}: ${keyword}`,
    intro: aliasIntroByLocale[locale](keyword, toolName),
    seoTitle: `${keyword} | ${toolName}`,
    seoDescription: aliasSeoDescriptionByLocale[locale](keyword, toolName),
    primaryKeyword: keyword,
    searchIntent: aliasSearchIntentByLocale[locale](keyword, toolName),
  };
};

export const getRelatedToolAliasPages = (
  toolSlug: string,
  currentSlug: string,
  limit = 8,
): ToolAliasPage[] =>
  toolAliasPages
    .filter((page) => page.toolSlug === toolSlug && page.slug !== currentSlug)
    .slice(0, limit);

export const toLocalizedToolAliasLink = (
  page: ToolAliasPage,
  locale: AppLocale,
): ToolAliasLinkItem => ({
  slug: page.slug,
  path: getToolAliasPathByLocale(page, locale),
  label: getLocalizedToolAliasLabel(page, locale),
});

export const getToolAliasImagePreset = (
  page: ToolAliasPage,
): Pick<ImageConversionPage, 'fromFormatId' | 'toFormatId'> | undefined => {
  if (!page.imageConversionSlug) {
    return undefined;
  }

  const resolution = getImageConversionResolutionBySlug(page.imageConversionSlug);
  if (!resolution) {
    return undefined;
  }

  return {
    fromFormatId: resolution.page.fromFormatId,
    toFormatId: resolution.page.toFormatId,
  };
};

export const getToolAliasCryptoPreset = (
  page: ToolAliasPage,
): Pick<CryptoConversionPage, 'assetId' | 'fromUnitId' | 'toUnitId'> | undefined => {
  if (!page.cryptoConversionSlug) {
    return undefined;
  }

  const resolution = getCryptoConversionResolutionBySlug(page.cryptoConversionSlug);
  if (!resolution) {
    return undefined;
  }

  return {
    assetId: resolution.page.assetId,
    fromUnitId: resolution.page.fromUnitId,
    toUnitId: resolution.page.toUnitId,
  };
};
