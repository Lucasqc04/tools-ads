import { Lightbulb } from 'lucide-react';
import type { AppLocale } from '@/lib/i18n/config';

const telegramUrl = 'https://t.me/Lucasqc04';

const copyByLocale: Record<AppLocale, { label: string; ariaLabel: string }> = {
  'pt-br': {
    label: 'Sugerir ferramenta',
    ariaLabel: 'Sugerir ferramenta ou melhoria no Telegram',
  },
  en: {
    label: 'Suggest a tool',
    ariaLabel: 'Suggest a tool or improvement on Telegram',
  },
  es: {
    label: 'Sugerir herramienta',
    ariaLabel: 'Sugerir herramienta o mejora en Telegram',
  },
};

type FloatingTelegramSuggestionProps = {
  locale?: AppLocale;
};

export function FloatingTelegramSuggestion({ locale = 'pt-br' }: Readonly<FloatingTelegramSuggestionProps>) {
  const copy = copyByLocale[locale];

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 sm:bottom-5 sm:right-5">
      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer nofollow"
        aria-label={copy.ariaLabel}
        className="pointer-events-auto inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-3.5 text-sm font-medium text-slate-800 shadow-lg shadow-slate-900/10 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
      >
        <Lightbulb className="h-4 w-4 text-amber-500" aria-hidden="true" />
        <span className="hidden sm:inline">{copy.label}</span>
      </a>
    </div>
  );
}
