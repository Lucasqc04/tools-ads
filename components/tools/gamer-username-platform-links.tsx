import Link from 'next/link';
import type { GamerUsernamePlatformLinkItem } from '@/data/gamer-username-platform-pages';

type GamerUsernamePlatformLinksProps = {
  title: string;
  description?: string;
  links: GamerUsernamePlatformLinkItem[];
};

export function GamerUsernamePlatformLinks({
  title,
  description,
  links,
}: Readonly<GamerUsernamePlatformLinksProps>) {
  if (!links.length) {
    return null;
  }

  return (
    <section aria-labelledby="gamer-username-platform-links-title" className="space-y-3">
      <h2
        id="gamer-username-platform-links-title"
        className="text-2xl font-bold tracking-tight text-slate-900"
      >
        {title}
      </h2>

      {description ? <p className="text-sm leading-6 text-slate-600">{description}</p> : null}

      <div className="grid gap-3 md:grid-cols-2">
        {links.map((link) => (
          <Link
            key={link.slug}
            href={link.path}
            className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-card"
          >
            <p className="text-base font-semibold text-slate-900">{link.name}</p>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">
              {link.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
