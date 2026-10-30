import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CelularWebcamCamera } from '@/components/tools/celular-webcam-camera';
import { isValidWebcamSessionId } from '@/lib/celular-webcam/protocol';
import { resolveLocale } from '@/lib/i18n/resolve-locale';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Conectar câmera do celular',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

type PageProps = Readonly<{
  params: Promise<{ locale: string; sessionId: string }>;
  searchParams: Promise<{ audio?: string }>;
}>;

export default async function CelularWebcamConnectPage({ params, searchParams }: PageProps) {
  const { locale: localeParam, sessionId } = await params;
  const query = await searchParams;
  if (!isValidWebcamSessionId(sessionId)) notFound();
  const locale = resolveLocale(localeParam);
  return <CelularWebcamCamera locale={locale} sessionId={sessionId} audioAllowed={query.audio === '1'} />;
}
