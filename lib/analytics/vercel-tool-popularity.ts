import {
  getGamerUsernamePlatformStaticParamsByLocale,
} from '@/data/gamer-username-platform-pages';
import { getGtaSeoStaticParamsByLocale } from '@/data/gta/gta-seo-pages';
import {
  getInvisiblePlatformStaticParamsByLocale,
} from '@/data/invisible-platform-pages';
import {
  getKeyboardShortcutsAppStaticParamsByLocale,
} from '@/data/keyboard-shortcuts-app-pages';
import {
  getMultiplicationTableStaticParamsByLocale,
} from '@/data/multiplication-table-pages';
import {
  getNicknameSymbolPlatformStaticParamsByLocale,
} from '@/data/nickname-symbol-platform-pages';
import { toolAliasPages } from '@/data/tool-alias-pages';
import { toolPopularitySnapshot } from '@/data/tool-popularity-snapshot';
import { getLocalizedToolsRegistry } from '@/data/tools-registry';
import { getSymbolCategoryStaticParamsByLocale } from '@/data/symbol-category-pages';
import { localizePath, type AppLocale } from '@/lib/i18n/config';

const analyticsProjectId = 'prj_cLHpV2QQeulVG666wOeZWL078EFK';
const analyticsTeamSlug = 'lucas-quinteiro-campos-projects';
const popularityWindowDays = 30;

type PageviewRow = {
  requestPath?: string;
  pageviews?: number;
};

type PageviewResponse = {
  data?: PageviewRow[];
};

const getToolIdByPath = (locale: AppLocale): Map<string, string> => {
  const pathToToolId = new Map<string, string>();
  const add = (path: string, toolId: string) => {
    pathToToolId.set(path.replace(/\/$/, ''), toolId);
  };

  for (const tool of getLocalizedToolsRegistry(locale)) {
    add(tool.canonicalPath, tool.id);
  }

  for (const alias of toolAliasPages) {
    if (alias.sourceLocales.includes(locale)) {
      add(localizePath(locale, `/${alias.slug}`), alias.toolSlug);
    }
  }

  const pageFamilies = [
    [getNicknameSymbolPlatformStaticParamsByLocale, 'nickname-symbol-generator'],
    [getInvisiblePlatformStaticParamsByLocale, 'invisible-character'],
    [getGamerUsernamePlatformStaticParamsByLocale, 'gamer-username-generator'],
    [getSymbolCategoryStaticParamsByLocale, 'symbols-to-copy'],
    [getMultiplicationTableStaticParamsByLocale, 'multiplication-table-quiz'],
    [getKeyboardShortcutsAppStaticParamsByLocale, 'keyboard-shortcuts'],
    [getGtaSeoStaticParamsByLocale, 'gta-cheat-codes'],
  ] as const;

  for (const [getPages, toolId] of pageFamilies) {
    for (const page of getPages(locale)) {
      add(localizePath(locale, `/${page.platformPageSlug}`), toolId);
    }
  }

  return pathToToolId;
};

const getUtcDayWindow = () => {
  const now = new Date();
  const until = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  const since = new Date(until.getTime() - popularityWindowDays * 24 * 60 * 60 * 1000);

  return { since: since.toISOString(), until: until.toISOString() };
};

export const getVercelToolPopularity = async (
  locale: AppLocale,
): Promise<Readonly<Record<string, number>>> => {
  const token = process.env.VERCEL_ANALYTICS_READ_TOKEN;
  if (!token) {
    return toolPopularitySnapshot[locale];
  }

  const params = new URLSearchParams({
    projectId: analyticsProjectId,
    slug: analyticsTeamSlug,
    ...getUtcDayWindow(),
    by: 'requestPath',
    limit: '100',
    filter: `startswith(requestPath, '/${locale}/')`,
  });

  try {
    const response = await fetch(
      `https://api.vercel.com/v1/query/web-analytics/visits/aggregate?${params.toString()}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      return toolPopularitySnapshot[locale];
    }

    const payload = (await response.json()) as PageviewResponse;
    const pathToToolId = getToolIdByPath(locale);
    const totals: Record<string, number> = {};

    for (const row of payload.data ?? []) {
      const path = row.requestPath?.replace(/\/$/, '');
      const pageviews = row.pageviews ?? 0;
      const toolId = path ? pathToToolId.get(path) : undefined;

      if (toolId && pageviews > 0) {
        totals[toolId] = (totals[toolId] ?? 0) + pageviews;
      }
    }

    return Object.keys(totals).length > 0 ? totals : toolPopularitySnapshot[locale];
  } catch {
    return toolPopularitySnapshot[locale];
  }
};
