import Link from 'next/link';
import type { ToolAliasLinkItem } from '@/data/tool-alias-pages';

type ToolAliasLinksProps = {
  title: string;
  description?: string;
  links: ToolAliasLinkItem[];
};

export function ToolAliasLinks({
  title,
  description,
  links,
}: Readonly<ToolAliasLinksProps>) {
  if (!links.length) {
    return null;
  }

  return (
    <section aria-labelledby="tool-alias-links-title" className="space-y-3">
      <h2 id="tool-alias-links-title" className="text-2xl font-bold tracking-tight text-slate-900">
        {title}
      </h2>

      {description ? <p className="text-sm text-slate-600">{description}</p> : null}

      <div className="grid gap-3 md:grid-cols-2">
        {links.map((link) => (
          <Link
            key={link.slug}
            href={link.path}
            className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-card"
          >
            <p className="text-base font-semibold text-slate-900">{link.label}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
