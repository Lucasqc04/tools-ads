import Link from 'next/link';
import type { ToolDefinition } from '@/types/tool';

type ToolCardProps = {
  tool: ToolDefinition;
};

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <h3 className="text-xl font-semibold tracking-tight text-slate-900">{tool.name}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-700">{tool.shortDescription}</p>
      <Link
        href={`/tools/${tool.slug}`}
        className="mt-4 inline-flex text-sm font-semibold"
        aria-label={`Abrir ${tool.name}`}
      >
        Abrir ferramenta
      </Link>
    </article>
  );
}
