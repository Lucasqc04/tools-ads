'use client';

import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/card';
import { type AppLocale } from '@/lib/i18n/config';

type LazyHtmlViewerToolProps = Readonly<{
  locale?: AppLocale;
}>;

const HtmlViewerTool = dynamic(
  () => import('@/components/tools/html-viewer-tool').then((module) => module.HtmlViewerTool),
  {
    ssr: false,
    loading: () => (
      <Card className="flex min-h-[360px] items-center justify-center text-sm text-slate-500">
        Loading HTML editor...
      </Card>
    ),
  },
);

export function LazyHtmlViewerTool({ locale }: LazyHtmlViewerToolProps) {
  return <HtmlViewerTool locale={locale} />;
}
