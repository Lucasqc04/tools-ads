'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import type { FrontOnlyToolId } from '@/data/content/front-only-tool-suite';
import type { AppLocale } from '@/lib/i18n/config';

type FrontOnlyToolProps = Readonly<{ locale?: AppLocale }>;
type FrontOnlyToolComponent = ComponentType<FrontOnlyToolProps>;

const frontOnlyToolComponents: Record<FrontOnlyToolId, FrontOnlyToolComponent> = {
  'gerador-cnpj': dynamic(
    () => import('@/components/tools/business-validator-tools').then((mod) => mod.CnpjValidatorGeneratorTool),
    { ssr: false },
  ),
  'validar-boleto': dynamic(
    () => import('@/components/tools/business-validator-tools').then((mod) => mod.BoletoValidatorTool),
    { ssr: false },
  ),
  'file-checksum': dynamic(
    () => import('@/components/tools/file-media-tools').then((mod) => mod.FileHashChecksumTool),
    { ssr: false },
  ),
  'exif-viewer': dynamic(
    () => import('@/components/tools/file-media-tools').then((mod) => mod.ExifReaderRemoverTool),
    { ssr: false },
  ),
  'redimensionar-imagem': dynamic(
    () => import('@/components/tools/file-media-tools').then((mod) => mod.ImageResizeCropTool),
    { ssr: false },
  ),
  'pdf-organizer': dynamic(
    () => import('@/components/tools/file-media-tools').then((mod) => mod.PdfOrganizerTool),
    { ssr: false },
  ),
  'favicon-generator': dynamic(
    () => import('@/components/tools/file-media-tools').then((mod) => mod.FaviconManifestGeneratorTool),
    { ssr: false },
  ),
  'qr-code-scanner': dynamic(
    () => import('@/components/tools/dev-qr-archive-tools').then((mod) => mod.QrCodeScannerDecoderTool),
    { ssr: false },
  ),
  'qr-code-wifi-vcard-evento': dynamic(
    () => import('@/components/tools/dev-qr-archive-tools').then((mod) => mod.QrPayloadGeneratorTool),
    { ssr: false },
  ),
  'json-para-typescript': dynamic(
    () => import('@/components/tools/dev-qr-archive-tools').then((mod) => mod.JsonTypeSchemaGeneratorTool),
    { ssr: false },
  ),
  'cron-generator': dynamic(
    () => import('@/components/tools/dev-qr-archive-tools').then((mod) => mod.CronGeneratorExplainerTool),
    { ssr: false },
  ),
  'gzip-deflate-zip': dynamic(
    () => import('@/components/tools/dev-qr-archive-tools').then((mod) => mod.GzipDeflateZipTool),
    { ssr: false },
  ),
  'dns-lookup': dynamic(
    () => import('@/components/tools/network-bitcoin-tools').then((mod) => mod.DnsLookupDohTool),
    { ssr: false },
  ),
  'bitcoin-fee-calculator': dynamic(
    () => import('@/components/tools/network-bitcoin-tools').then((mod) => mod.BitcoinFeeMempoolTool),
    { ssr: false },
  ),
  'bitcoin-address-tx-decoder': dynamic(
    () => import('@/components/tools/network-bitcoin-tools').then((mod) => mod.BitcoinAddressTxDecoderTool),
    { ssr: false },
  ),
  'sql-formatter': dynamic(
    () => import('@/components/tools/dev-qr-archive-tools').then((mod) => mod.SqlFormatterTool),
    { ssr: false },
  ),
};

export function FrontOnlyToolClientRouter({
  slug,
  locale,
}: Readonly<{ slug: FrontOnlyToolId; locale: AppLocale }>) {
  const ToolComponent = frontOnlyToolComponents[slug];
  return <ToolComponent locale={locale} />;
}
