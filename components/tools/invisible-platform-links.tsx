import Link from 'next/link';
import type { InvisiblePlatformLinkItem } from '@/data/invisible-platform-pages';

type InvisiblePlatformLinksProps = {
  title: string;
  description?: string;
  links: InvisiblePlatformLinkItem[];
};

export function InvisiblePlatformLinks({
  title,
  description,
  links,
}: Readonly<InvisiblePlatformLinksProps>) {
  if (!links.length) {
    return null;
  }

  return (
    <section aria-labelledby="invisible-platform-links-title" className="space-y-3">
      <h2
        id="invisible-platform-links-title"
        className="text-2xl font-bold tracking-tight text-slate-900"
      >
        {title}
      </h2>

      {description ? <p className="text-sm text-slate-600">{description}</p> : null}

      <div className="grid gap-3 md:grid-cols-2">
        {links.map((link) => (
          <Link
            key={`${link.slug}-${link.name}`}
            href={link.path}
            className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-card"
          >
            <p className="text-base font-semibold text-slate-900">{link.name}</p>
            <p className="mt-1 text-sm text-slate-600">{link.categoryLabel}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">{link.compatibilityLabel}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
