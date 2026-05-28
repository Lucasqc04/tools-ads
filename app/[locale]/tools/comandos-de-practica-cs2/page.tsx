import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import {
  getCs2ToolPathForLocale,
  getCs2ToolSlugForLocale,
} from '@/data/cs2/tools';
import {
  buildCs2PracticeCommandsMetadata,
  Cs2PracticeCommandsPage,
} from '@/components/tools/cs2-practice-commands-page';
import { resolveLocale } from '@/lib/i18n/resolve-locale';

type Cs2PracticeCommandsRouteProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: Cs2PracticeCommandsRouteProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  return buildCs2PracticeCommandsMetadata(locale);
}

export default async function Cs2PracticeCommandsEsRoute({
  params,
}: Cs2PracticeCommandsRouteProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  if (getCs2ToolSlugForLocale('cs2-practice-commands', locale) !== 'comandos-de-practica-cs2') {
    redirect(getCs2ToolPathForLocale('cs2-practice-commands', locale));
  }

  return <Cs2PracticeCommandsPage locale={locale} />;
}
