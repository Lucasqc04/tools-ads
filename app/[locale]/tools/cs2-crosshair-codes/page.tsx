import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import {
  getCs2CrosshairToolPathForLocale,
  getCs2CrosshairToolSlugForLocale,
} from '@/data/cs2/crosshair-pages';
import {
  Cs2CrosshairCodesPage,
  buildCs2CrosshairCodesMetadata,
} from '@/components/tools/cs2-crosshair-codes-page';
import { resolveLocale } from '@/lib/i18n/resolve-locale';

type Cs2CrosshairCodesRouteProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: Cs2CrosshairCodesRouteProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  return buildCs2CrosshairCodesMetadata(locale);
}

export default async function Cs2CrosshairCodesRoute({
  params,
}: Cs2CrosshairCodesRouteProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  if (getCs2CrosshairToolSlugForLocale(locale) !== 'cs2-crosshair-codes') {
    redirect(getCs2CrosshairToolPathForLocale(locale));
  }

  return <Cs2CrosshairCodesPage locale={locale} />;
}
