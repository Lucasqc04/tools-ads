import Link from 'next/link';
import type { CryptoConversionLinkItem } from '@/data/crypto-conversion-pages';

type CryptoConversionLinksProps = {
  title: string;
  description?: string;
  links: CryptoConversionLinkItem[];
  fromToConnector?: string;
};

export function CryptoConversionLinks({
  title,
  description,
  links,
  fromToConnector = 'para',
}: CryptoConversionLinksProps) {
  if (!links.length) {
    return null;
  }

  return (
    <section aria-labelledby="crypto-conversion-links-title" className="space-y-3">
      <h2
        id="crypto-conversion-links-title"
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
            <p className="mt-1 text-sm text-slate-600">{link.assetName}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
