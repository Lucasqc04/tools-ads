import Link from 'next/link';
import type { KeyboardShortcutsAppLinkItem } from '@/data/keyboard-shortcuts-app-pages';

type KeyboardShortcutsAppLinksProps = {
  title: string;
  description?: string;
  links: KeyboardShortcutsAppLinkItem[];
};

export function KeyboardShortcutsAppLinks({
  title,
  description,
  links,
}: Readonly<KeyboardShortcutsAppLinksProps>) {
  if (!links.length) {
    return null;
  }

  return (
    <section aria-labelledby="keyboard-shortcuts-app-links-title" className="space-y-3">
      <h2
        id="keyboard-shortcuts-app-links-title"
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
