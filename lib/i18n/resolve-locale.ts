import { notFound } from 'next/navigation';
import { isValidLocale, type AppLocale } from '@/lib/i18n/config';

export const resolveLocale = (localeValue: string): AppLocale => {
  if (!isValidLocale(localeValue)) {
    notFound();
  }

  return localeValue;
};
