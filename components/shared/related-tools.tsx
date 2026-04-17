import Link from 'next/link';
import { localizePath, type AppLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import type { ToolDefinition } from '@/types/tool';

type RelatedToolsProps = {
  tools: ToolDefinition[];
  locale?: AppLocale;
};

export function RelatedTools({ tools, locale = 'pt-br' }: RelatedToolsProps) {
  if (!tools.length) {
    return null;
  }

  const dictionary = getDictionary(locale);

  return (
    <section aria-labelledby="related-tools-title" className="space-y-3">
      <h2 id="related-tools-title" className="text-2xl font-bold tracking-tight text-slate-900">
        {dictionary.toolShell.relatedToolsTitle}
      </h2>
      <p className="text-sm text-slate-600">
        {dictionary.toolShell.relatedToolsDescription}
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            href={localizePath(locale, `/tools/${tool.slug}`)}
            className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-card"
          >
            <p className="text-base font-semibold text-slate-900">{tool.name}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">{tool.shortDescription}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
