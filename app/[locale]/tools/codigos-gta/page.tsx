import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import {
  getGtaToolPathForLocale,
  getGtaToolSlugForLocale,
} from '@/data/gta/gta-seo-pages';
import {
  GtaCheatCodesPage,
  buildGtaCheatCodesMetadata,
} from '@/components/tools/gta-cheat-codes-page';
import { resolveLocale } from '@/lib/i18n/resolve-locale';

type GtaCheatsRouteProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: GtaCheatsRouteProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  return buildGtaCheatCodesMetadata(locale);
}

export default async function GtaCheatCodesLocalizedRoute({ params }: GtaCheatsRouteProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  if (getGtaToolSlugForLocale(locale) !== 'codigos-gta') {
    redirect(getGtaToolPathForLocale(locale));
  }

  return <GtaCheatCodesPage locale={locale} />;
}
