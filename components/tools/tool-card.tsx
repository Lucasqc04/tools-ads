import Link from 'next/link';
import { localizePath, type AppLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import type { ToolDefinition } from '@/types/tool';

type ToolCardProps = {
  tool: ToolDefinition;
  locale?: AppLocale;
};

export function ToolCard({ tool, locale = 'pt-br' }: ToolCardProps) {
  const dictionary = getDictionary(locale);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <h3 className="text-xl font-semibold tracking-tight text-slate-900">{tool.name}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-700">{tool.shortDescription}</p>
      <Link
        href={localizePath(locale, `/tools/${tool.slug}`)}
        className="mt-4 inline-flex text-sm font-semibold"
        aria-label={`${dictionary.toolCard.openToolAriaPrefix} ${tool.name}`}
      >
        {dictionary.toolCard.openTool}
      </Link>
    </article>
  );
}
