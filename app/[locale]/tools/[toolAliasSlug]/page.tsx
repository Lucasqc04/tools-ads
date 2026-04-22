import { notFound, redirect } from 'next/navigation';
import { getInvisiblePlatformResolutionBySlug } from '@/data/invisible-platform-pages';
import { getToolAliasPageBySlug } from '@/data/tool-alias-pages';
import { localizePath } from '@/lib/i18n/config';
import { resolveLocale } from '@/lib/i18n/resolve-locale';

type ToolAliasRedirectPageProps = Readonly<{
  params: Promise<{
    locale: string;
    toolAliasSlug: string;
  }>;
}>;

export default async function ToolAliasRedirectPage({
  params,
}: ToolAliasRedirectPageProps) {
  const { locale: localeParam, toolAliasSlug } = await params;
  const locale = resolveLocale(localeParam);

  const hasToolAlias = Boolean(getToolAliasPageBySlug(toolAliasSlug));
  const hasInvisibleLanding = Boolean(getInvisiblePlatformResolutionBySlug(toolAliasSlug));

  if (!hasToolAlias && !hasInvisibleLanding) {
    notFound();
  }

  redirect(localizePath(locale, `/${toolAliasSlug}`));
}
