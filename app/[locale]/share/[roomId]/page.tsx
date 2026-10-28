import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ShareScreenTool } from '@/components/tools/share-screen-tool';
import { resolveLocale } from '@/lib/i18n/resolve-locale';
import { isValidRoomId } from '@/lib/screenshare/protocol';

export const dynamic = 'force-dynamic';

type PageProps = Readonly<{ params: Promise<{ locale: string; roomId: string }> }>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const title = locale === 'en' ? 'Join the call · Chamada' : locale === 'es' ? 'Unirse a la llamada · Chamada' : locale === 'zh' ? '加入通话 · Chamada' : 'Entrar na chamada · Chamada';
  return { title, robots: { index: false, follow: false } };
}

export default async function ScreenShareRoomPage({ params }: PageProps) {
  const { locale: localeParam, roomId } = await params;
  const locale = resolveLocale(localeParam);
  if (!isValidRoomId(roomId)) notFound();
  return <main className="mx-auto min-h-[70vh] w-full max-w-7xl px-4 py-8 md:px-8 md:py-12"><ShareScreenTool locale={locale} initialRoomId={roomId} /></main>;
}
