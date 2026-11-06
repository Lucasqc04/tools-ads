'use client';

import { useEffect, useState } from 'react';
import { LoaderCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { type AppLocale } from '@/lib/i18n/config';
import { trackEvent } from '@/lib/analytics';
import type { ToolId } from '@/lib/analytics/tool-ids';

type ShareResultButtonProps = Readonly<{
  file: File;
  locale: AppLocale;
  tool: ToolId;
  format: string;
  className?: string;
}>;

const copy: Record<AppLocale, { share: string; failed: string }> = {
  'pt-br': { share: 'Compartilhar', failed: 'Não foi possível compartilhar este arquivo.' },
  en: { share: 'Share', failed: 'Could not share this file.' },
  es: { share: 'Compartir', failed: 'No se pudo compartir este archivo.' },
  zh: { share: '分享', failed: '无法分享此文件。' },
};

export function ShareResultButton({ file, locale, tool, format, className }: ShareResultButtonProps) {
  const [supported, setSupported] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState('');
  const ui = copy[locale];

  useEffect(() => {
    try {
      setSupported(
        typeof navigator !== 'undefined' &&
          typeof navigator.share === 'function' &&
          typeof navigator.canShare === 'function' &&
          navigator.canShare({ files: [file] }),
      );
    } catch {
      setSupported(false);
    }
  }, [file]);

  const share = async () => {
    if (!supported || sharing) return;
    setSharing(true);
    setError('');
    try {
      await navigator.share({ files: [file], title: file.name });
      trackEvent('result_shared', { tool, locale, format, method: 'native_file' });
    } catch (error_) {
      if (!(error_ instanceof Error && error_.name === 'AbortError')) {
        setError(ui.failed);
      }
    } finally {
      setSharing(false);
    }
  };

  if (!supported) return null;

  return (
    <div className={cn('space-y-1', className)}>
      <Button variant="secondary" onClick={() => void share()} disabled={sharing} className="w-full">
        {sharing ? <LoaderCircle className="mr-1.5 h-4 w-4 animate-spin" aria-hidden="true" /> : <Share2 className="mr-1.5 h-4 w-4" aria-hidden="true" />}
        {ui.share}
      </Button>
      {error ? <p role="alert" className="text-xs text-rose-700">{error}</p> : null}
    </div>
  );
}
