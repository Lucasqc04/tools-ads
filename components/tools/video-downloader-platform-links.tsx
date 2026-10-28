import Link from 'next/link';
import type { VideoDownloaderPlatformLink } from '@/data/video-downloader-pages';

type VideoDownloaderPlatformLinksProps = Readonly<{
  title: string;
  description?: string;
  links: VideoDownloaderPlatformLink[];
}>;

export function VideoDownloaderPlatformLinks({ title, description, links }: VideoDownloaderPlatformLinksProps) {
  if (!links.length) {
    return null;
  }

  return (
    <section aria-labelledby="video-downloader-links-title" className="space-y-3">
      <h2 id="video-downloader-links-title" className="text-2xl font-bold tracking-tight text-slate-900">
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
            <p className="text-base font-semibold text-slate-900">{link.name}</p>
            <p className="mt-1 text-sm text-slate-600">{link.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
