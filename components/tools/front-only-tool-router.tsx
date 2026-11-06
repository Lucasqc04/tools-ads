import type { ReactNode } from 'react';
import { FrontOnlyToolClientRouter } from '@/components/tools/front-only-tool-client-router';
import type { FrontOnlyToolId } from '@/data/content/front-only-tool-suite';
import type { AppLocale } from '@/lib/i18n/config';

export const frontOnlyToolSoftwareCategory = {
  'gerador-cnpj': 'UtilitiesApplication',
  'validar-boleto': 'FinanceApplication',
  'file-checksum': 'DeveloperApplication',
  'exif-viewer': 'UtilitiesApplication',
  'redimensionar-imagem': 'UtilitiesApplication',
  'pdf-organizer': 'UtilitiesApplication',
  'favicon-generator': 'DeveloperApplication',
  'qr-code-scanner': 'UtilitiesApplication',
  'qr-code-wifi-vcard-evento': 'UtilitiesApplication',
  'json-para-typescript': 'DeveloperApplication',
  'cron-generator': 'DeveloperApplication',
  'gzip-deflate-zip': 'DeveloperApplication',
  'dns-lookup': 'DeveloperApplication',
  'bitcoin-fee-calculator': 'FinanceApplication',
  'bitcoin-address-tx-decoder': 'FinanceApplication',
  'sql-formatter': 'DeveloperApplication',
} satisfies Record<FrontOnlyToolId, string>;

export const isFrontOnlyToolSlug = (slug: string): slug is FrontOnlyToolId =>
  slug in frontOnlyToolSoftwareCategory;

export const renderFrontOnlyToolUi = (
  slug: string,
  locale: AppLocale,
): ReactNode | null => {
  if (!isFrontOnlyToolSlug(slug)) {
    return null;
  }

  return <FrontOnlyToolClientRouter slug={slug} locale={locale} />;
};

export const getFrontOnlyToolSoftwareCategory = (slug: string): string | undefined =>
  isFrontOnlyToolSlug(slug) ? frontOnlyToolSoftwareCategory[slug] : undefined;
