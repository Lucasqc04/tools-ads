import Link from 'next/link';
import { headers } from 'next/headers';
import { Container } from '@/components/layout/container';
import { defaultLocale, isValidLocale, localizePath } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';

export default async function LocalizedNotFound() {
  const headersList = await headers();
  const localeHeader = headersList.get('x-locale') ?? '';
  const locale = isValidLocale(localeHeader) ? localeHeader : defaultLocale;
  const dictionary = getDictionary(locale);

  return (
    <Container className="py-16">
      <div className="max-w-reading space-y-4 rounded-xl border border-slate-200 bg-white p-8 text-center shadow-card">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {dictionary.notFound.title}
        </h1>
        <p className="text-slate-700">{dictionary.notFound.description}</p>
        <Link href={localizePath(locale, '/')} className="inline-flex text-sm font-semibold text-brand-600">
          {dictionary.notFound.cta}
        </Link>
      </div>
    </Container>
  );
}
