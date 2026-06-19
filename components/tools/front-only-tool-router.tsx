import type { ComponentType, ReactNode } from 'react';
import dynamic from 'next/dynamic';
import type { FrontOnlyToolId } from '@/data/content/front-only-tool-suite';
import type { AppLocale } from '@/lib/i18n/config';

type FrontOnlyToolProps = Readonly<{ locale?: AppLocale }>;
type FrontOnlyToolComponent = ComponentType<FrontOnlyToolProps>;

const frontOnlyToolComponents = {
  'gerador-cnpj': dynamic(() =>
    import('@/components/tools/business-validator-tools').then((mod) => mod.CnpjValidatorGeneratorTool),
  ),
  'validar-boleto': dynamic(() =>
    import('@/components/tools/business-validator-tools').then((mod) => mod.BoletoValidatorTool),
  ),
  'file-checksum': dynamic(() =>
    import('@/components/tools/file-media-tools').then((mod) => mod.FileHashChecksumTool),
  ),
  'exif-viewer': dynamic(() =>
    import('@/components/tools/file-media-tools').then((mod) => mod.ExifReaderRemoverTool),
  ),
  'redimensionar-imagem': dynamic(() =>
    import('@/components/tools/file-media-tools').then((mod) => mod.ImageResizeCropTool),
  ),
  'pdf-organizer': dynamic(() =>
    import('@/components/tools/file-media-tools').then((mod) => mod.PdfOrganizerTool),
  ),
  'favicon-generator': dynamic(() =>
    import('@/components/tools/file-media-tools').then((mod) => mod.FaviconManifestGeneratorTool),
  ),
  'qr-code-scanner': dynamic(() =>
    import('@/components/tools/dev-qr-archive-tools').then((mod) => mod.QrCodeScannerDecoderTool),
  ),
  'qr-code-wifi-vcard-evento': dynamic(() =>
    import('@/components/tools/dev-qr-archive-tools').then((mod) => mod.QrPayloadGeneratorTool),
  ),
  'json-para-typescript': dynamic(() =>
    import('@/components/tools/dev-qr-archive-tools').then((mod) => mod.JsonTypeSchemaGeneratorTool),
  ),
  'cron-generator': dynamic(() =>
    import('@/components/tools/dev-qr-archive-tools').then((mod) => mod.CronGeneratorExplainerTool),
  ),
  'gzip-deflate-zip': dynamic(() =>
    import('@/components/tools/dev-qr-archive-tools').then((mod) => mod.GzipDeflateZipTool),
  ),
  'dns-lookup': dynamic(() =>
    import('@/components/tools/network-bitcoin-tools').then((mod) => mod.DnsLookupDohTool),
  ),
  'bitcoin-fee-calculator': dynamic(() =>
    import('@/components/tools/network-bitcoin-tools').then((mod) => mod.BitcoinFeeMempoolTool),
  ),
  'bitcoin-address-tx-decoder': dynamic(() =>
    import('@/components/tools/network-bitcoin-tools').then((mod) => mod.BitcoinAddressTxDecoderTool),
  ),
  'sql-formatter': dynamic(() =>
    import('@/components/tools/dev-qr-archive-tools').then((mod) => mod.SqlFormatterTool),
  ),
} satisfies Record<FrontOnlyToolId, FrontOnlyToolComponent>;

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
  slug in frontOnlyToolComponents;

export const renderFrontOnlyToolUi = (
  slug: string,
  locale: AppLocale,
): ReactNode | null => {
  if (!isFrontOnlyToolSlug(slug)) {
    return null;
  }

  const ToolComponent = frontOnlyToolComponents[slug];
  return <ToolComponent locale={locale} />;
};

export const getFrontOnlyToolSoftwareCategory = (slug: string): string | undefined =>
  isFrontOnlyToolSlug(slug) ? frontOnlyToolSoftwareCategory[slug] : undefined;
