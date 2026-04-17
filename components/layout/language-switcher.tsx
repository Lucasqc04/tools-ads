'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  localizePath,
  localeCookieName,
  localeMetadata,
  locales,
  stripLocaleFromPathname,
  type AppLocale,
} from '@/lib/i18n/config';

type LanguageSwitcherProps = {
  currentLocale: AppLocale;
  label: string;
};

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

const shortCode = (locale: AppLocale) =>
  localeMetadata[locale].hreflang.split('-')[0].toUpperCase();

export function LanguageSwitcher({ currentLocale, label }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const pathnameWithoutLocale = stripLocaleFromPathname(pathname || '/');
  const queryString = searchParams.toString();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={label}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
        <span>{shortCode(currentLocale)}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 min-w-[152px] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
          {locales.map((nextLocale) => {
            const nextPath = localizePath(nextLocale, pathnameWithoutLocale);
            const href = queryString ? `${nextPath}?${queryString}` : nextPath;
            const isActive = currentLocale === nextLocale;

            return (
              <Link
                key={nextLocale}
                href={href}
                locale={false}
                onClick={() => {
                  document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=${ONE_YEAR_IN_SECONDS}; samesite=lax`;
                  try {
                    globalThis.localStorage.setItem('preferred-locale', nextLocale);
                  } catch {
                    // Ignore storage failures in restricted browsing modes.
                  }
                  setOpen(false);
                }}
                className={`flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-slate-50 font-medium text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="w-5 text-center text-xs font-bold uppercase text-slate-400">
                  {shortCode(nextLocale)}
                </span>
                <span className="flex-1">{localeMetadata[nextLocale].label}</span>
                {isActive && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-brand-600"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
