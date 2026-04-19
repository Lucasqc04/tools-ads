import Link from 'next/link';
import type { ImageConversionLinkItem } from '@/data/image-conversion-pages';

type ImageConversionLinksProps = {
  title: string;
  description?: string;
  links: ImageConversionLinkItem[];
  fromToConnector?: string;
};

export function ImageConversionLinks({
  title,
  description,
  links,
  fromToConnector = 'para',
}: ImageConversionLinksProps) {
  if (!links.length) {
    return null;
  }

  return (
    <section aria-labelledby="image-conversion-links-title" className="space-y-3">
      <h2
        id="image-conversion-links-title"
        className="text-2xl font-bold tracking-tight text-slate-900"
      >
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
            <p className="text-base font-semibold text-slate-900">
              {link.fromLabel} {fromToConnector} {link.toLabel}
            </p>
            <p className="mt-1 text-sm text-slate-600">{link.context}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

