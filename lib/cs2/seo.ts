import type { AppLocale } from '@/lib/i18n/config';

export const dedupeSeoKeywords = (keywords: string[]): string[] =>
  Array.from(new Set(keywords.map((item) => item.trim()).filter(Boolean)));

export const buildCs2SiblingTitle = (
  locale: AppLocale,
  keyword: string,
  toolName: string,
): string => {
  if (locale === 'pt-br') {
    return `${keyword} | ${toolName}`;
  }

  if (locale === 'es') {
    return `${keyword} | ${toolName}`;
  }

  return `${keyword} | ${toolName}`;
};
