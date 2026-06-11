'use client';

import { Suspense } from 'react';
import { TransferTool } from './transfer-tool';
import type { AppLocale } from '@/lib/i18n/config';

type TransferToolWrapperProps = Readonly<{
  locale?: AppLocale;
}>;

/**
 * Wrapper para TransferTool que fornece Suspense boundary para useSearchParams()
 */
export function TransferToolWrapper({ locale = 'pt-br' }: TransferToolWrapperProps) {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <TransferTool locale={locale} />
    </Suspense>
  );
}
