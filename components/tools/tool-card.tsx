import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { AppLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import type { ToolDefinition } from '@/types/tool';

type ToolCardProps = {
  tool: ToolDefinition;
  locale?: AppLocale;
  headingLevel: 3 | 4 | 5;
};

export function ToolCard({ tool, locale = 'pt-br', headingLevel }: ToolCardProps) {
  const dictionary = getDictionary(locale);
  const Heading = headingLevel === 3 ? 'h3' : headingLevel === 4 ? 'h4' : 'h5';

  return (
    <article className="group flex h-full min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-100">
      <Heading className="text-base font-semibold leading-6 tracking-tight text-slate-900 md:text-[17px]">
        {tool.name}
      </Heading>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-700">{tool.shortDescription}</p>
      <Link
        href={tool.canonicalPath}
        className="mt-3 inline-flex w-fit items-center gap-1 text-sm font-semibold text-brand-700 transition-colors group-hover:text-brand-900 focus-visible:outline-none"
        aria-label={`${dictionary.toolCard.openToolAriaPrefix} ${tool.name}`}
      >
        {dictionary.toolCard.openTool}
        <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </article>
  );
}
