import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import {
  buildCs2ToolMetadata,
  Cs2GenericToolPage,
} from '@/components/tools/cs2-generic-page';
import { getInvisiblePlatformResolutionBySlug } from '@/data/invisible-platform-pages';
import { getToolAliasPageBySlug } from '@/data/tool-alias-pages';
import {
  getCs2ToolIdBySlug,
  getCs2ToolPathForLocale,
  getCs2ToolSlugForLocale,
  cs2ToolConfigs,
} from '@/data/cs2/tools';
import { buildLocalePathMap, locales } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { resolveLocale } from '@/lib/i18n/resolve-locale';
import { buildLocalizedMetadata } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    cs2ToolConfigs.map((tool) => ({
      locale,
      toolAliasSlug: tool.slugByLocale[locale],
    })),
  );
}

type ToolAliasRoutePageProps = Readonly<{
  params: Promise<{
    locale: string;
    toolAliasSlug: string;
  }>;
}>;

export async function generateMetadata({
  params,
}: ToolAliasRoutePageProps): Promise<Metadata> {
  const { locale: localeParam, toolAliasSlug } = await params;
  const locale = resolveLocale(localeParam);

  const cs2ToolId = getCs2ToolIdBySlug(toolAliasSlug);
  if (cs2ToolId) {
    return buildCs2ToolMetadata(locale, cs2ToolId);
  }

  const dictionary = getDictionary(locale);

  return buildLocalizedMetadata({
    locale,
    title: `${dictionary.common.tools} | ${dictionary.seo.siteDefaultTitle}`,
    description: dictionary.seo.tools.description,
    localePaths: buildLocalePathMap('/tools'),
    keywords: dictionary.seo.tools.keywords,
  });
}

export default async function ToolAliasRoutePage({ params }: ToolAliasRoutePageProps) {
  const { locale: localeParam, toolAliasSlug } = await params;
  const locale = resolveLocale(localeParam);

  const cs2ToolId = getCs2ToolIdBySlug(toolAliasSlug);
  if (cs2ToolId) {
    const canonicalSlug = getCs2ToolSlugForLocale(cs2ToolId, locale);

    if (toolAliasSlug !== canonicalSlug) {
      redirect(getCs2ToolPathForLocale(cs2ToolId, locale));
    }

    return <Cs2GenericToolPage locale={locale} toolId={cs2ToolId} />;
  }

  const hasToolAlias = Boolean(getToolAliasPageBySlug(toolAliasSlug));
  const hasInvisibleLanding = Boolean(getInvisiblePlatformResolutionBySlug(toolAliasSlug));

  if (!hasToolAlias && !hasInvisibleLanding) {
    notFound();
  }

  redirect(`/${locale}/${toolAliasSlug}`);
}
