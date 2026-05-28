import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import {
  buildCs2ToolMetadata,
  Cs2GenericToolPage,
} from '@/components/tools/cs2-generic-page';
import {
  getCs2ToolPathForLocale,
  getCs2ToolSlugForLocale,
} from '@/data/cs2/tools';
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

  return buildCs2ToolMetadata(locale, 'cs2-practice-commands');
}

export default async function Cs2PracticeCommandsRoute({
  params,
}: Cs2PracticeCommandsRouteProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  if (getCs2ToolSlugForLocale('cs2-practice-commands', locale) !== 'cs2-practice-commands') {
    redirect(getCs2ToolPathForLocale('cs2-practice-commands', locale));
  }

  return <Cs2GenericToolPage locale={locale} toolId="cs2-practice-commands" />;
}
