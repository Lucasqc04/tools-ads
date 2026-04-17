import Link from 'next/link';
import type { ToolDefinition } from '@/types/tool';

type RelatedToolsProps = {
  tools: ToolDefinition[];
};

export function RelatedTools({ tools }: RelatedToolsProps) {
  if (!tools.length) {
    return null;
  }

  return (
    <section aria-labelledby="related-tools-title" className="space-y-3">
      <h2 id="related-tools-title" className="text-2xl font-bold tracking-tight text-slate-900">
        Outras ferramentas úteis
      </h2>
      <p className="text-sm text-slate-600">
        Links internos discretos para navegação contextual e descoberta orgânica.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            href={`/tools/${tool.slug}`}
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
