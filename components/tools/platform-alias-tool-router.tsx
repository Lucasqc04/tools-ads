'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import type { AppLocale } from '@/lib/i18n/config';

type PlatformAliasToolProps = Readonly<{ locale: AppLocale }>;
type PlatformAliasToolComponent = ComponentType<PlatformAliasToolProps>;

const toolComponents: Record<string, PlatformAliasToolComponent> = {
  'transcricao-de-audio-e-video': dynamic(
    () => import('@/components/tools/audio-video-transcription-tool').then((mod) => mod.AudioVideoTranscriptionTool),
    { ssr: false },
  ),
  'authenticator-code-generator': dynamic(
    () => import('@/components/tools/authenticator-code-generator-tool').then((mod) => mod.AuthenticatorCodeGeneratorTool),
    { ssr: false },
  ),
  'bitcoin-wallet': dynamic(
    () => import('@/components/tools/bitcoin-wallet-tool').then((mod) => mod.BitcoinWalletTool),
    { ssr: false },
  ),
  'html-viewer': dynamic(
    () => import('@/components/tools/lazy-html-viewer-tool').then((mod) => mod.LazyHtmlViewerTool),
    { ssr: false },
  ),
  'markdown-editor': dynamic(
    () => import('@/components/tools/markdown-editor-tool').then((mod) => mod.MarkdownEditorTool),
    { ssr: false },
  ),
  'json-formatter': dynamic(
    () => import('@/components/tools/json-formatter-tool').then((mod) => mod.JsonFormatterTool),
    { ssr: false },
  ),
  'csv-viewer': dynamic(
    () => import('@/components/tools/csv-viewer-tool').then((mod) => mod.CsvViewerTool),
    { ssr: false },
  ),
  'editor-etiquetas-zpl': dynamic(
    () => import('@/components/tools/zpl-label-editor-tool').then((mod) => mod.ZplLabelEditorTool),
    { ssr: false },
  ),
  'data-converter': dynamic(
    () => import('@/components/tools/data-converter-tool').then((mod) => mod.DataConverterTool),
    { ssr: false },
  ),
  'text-diff': dynamic(
    () => import('@/components/tools/text-diff-tool').then((mod) => mod.TextDiffTool),
    { ssr: false },
  ),
  'open-graph-preview': dynamic(
    () => import('@/components/tools/open-graph-preview-tool').then((mod) => mod.OpenGraphPreviewTool),
    { ssr: false },
  ),
  'cpf-generator': dynamic(
    () => import('@/components/tools/cpf-generator-tool').then((mod) => mod.CpfGeneratorTool),
    { ssr: false },
  ),
  'gerador-pessoa-fake': dynamic(
    () => import('@/components/tools/fake-person-generator-tool').then((mod) => mod.FakePersonGeneratorTool),
    { ssr: false },
  ),
  'password-generator': dynamic(
    () => import('@/components/tools/password-generator-tool').then((mod) => mod.PasswordGeneratorTool),
    { ssr: false },
  ),
  'base64-image-viewer': dynamic(
    () => import('@/components/tools/base64-image-viewer-tool').then((mod) => mod.Base64ImageViewerTool),
    { ssr: false },
  ),
  'image-to-base64': dynamic(
    () => import('@/components/tools/image-to-base64-tool').then((mod) => mod.ImageToBase64Tool),
    { ssr: false },
  ),
  'image-compression': dynamic(
    () => import('@/components/tools/image-compression-tool').then((mod) => mod.ImageCompressionTool),
    { ssr: false },
  ),
  'instagram-image-optimizer': dynamic(
    () => import('@/components/tools/instagram-image-optimizer-tool').then((mod) => mod.InstagramImageOptimizerTool),
    { ssr: false },
  ),
  'remover-fundo-imagem': dynamic(
    () => import('@/components/tools/chroma-background-remover-tool').then((mod) => mod.ChromaBackgroundRemoverTool),
    { ssr: false },
  ),
  'video-compression': dynamic(
    () => import('@/components/tools/video-compression-tool').then((mod) => mod.VideoCompressionTool),
    { ssr: false },
  ),
  'video-downloader': dynamic(
    () => import('@/components/tools/video-downloader-tool').then((mod) => mod.VideoDownloaderTool),
    { ssr: false },
  ),
  'share-screen': dynamic(
    () => import('@/components/tools/share-screen-tool').then((mod) => mod.ShareScreenTool),
    { ssr: false },
  ),
  'celular-como-webcam': dynamic(
    () => import('@/components/tools/celular-como-webcam-tool').then((mod) => mod.CelularComoWebcamTool),
    { ssr: false },
  ),
  'extrair-audio-de-video': dynamic(
    () => import('@/components/tools/audio-editor-tool').then((mod) => mod.AudioEditorTool),
    { ssr: false },
  ),
  'criador-de-timelapse': dynamic(
    () => import('@/components/tools/timelapse-creator-tool').then((mod) => mod.TimelapseCreatorTool),
    { ssr: false },
  ),
  'estourador-de-audio': dynamic(
    () => import('@/components/tools/audio-blaster-tool').then((mod) => mod.AudioBlasterTool),
    { ssr: false },
  ),
  'qr-code-generator': dynamic(
    () => import('@/components/tools/qr-code-generator').then((mod) => mod.QrCodeGeneratorTool),
    { ssr: false },
  ),
  'gerador-link-whatsapp-telegram': dynamic(
    () => import('@/components/tools/whatsapp-telegram-link-generator-tool').then((mod) => mod.WhatsAppTelegramLinkGeneratorTool),
    { ssr: false },
  ),
  sorteador: dynamic(
    () => import('@/components/tools/sorteador-tool').then((mod) => mod.SorteadorTool),
    { ssr: false },
  ),
  'calculadora-juros-compostos': dynamic(
    () => import('@/components/tools/compound-interest-tool').then((mod) => mod.CompoundInterestTool),
    { ssr: false },
  ),
  'pix-decoder': dynamic(
    () => import('@/components/tools/pix-decoder-tool').then((mod) => mod.PixDecoderTool),
    { ssr: false },
  ),
  'css-generator': dynamic(
    () => import('@/components/tools/css-generator-tool').then((mod) => mod.CssGeneratorTool),
    { ssr: false },
  ),
  'image-color-extractor': dynamic(
    () => import('@/components/tools/image-color-extractor-tool').then((mod) => mod.ImageColorExtractorTool),
    { ssr: false },
  ),
  'descobrir-ip-publico': dynamic(
    () => import('@/components/tools/ip-discovery-tool').then((mod) => mod.IpDiscoveryTool),
    { ssr: false },
  ),
  'code-converter': dynamic(
    () => import('@/components/tools/code-converter-tool').then((mod) => mod.CodeConverterTool),
    { ssr: false },
  ),
  'color-converter': dynamic(
    () => import('@/components/tools/color-converter-tool').then((mod) => mod.ColorConverterTool),
    { ssr: false },
  ),
  'email-temporario': dynamic(
    () => import('@/components/tools/temp-email-tool').then((mod) => mod.TempEmailTool),
    { ssr: false },
  ),
  'regex-tester': dynamic(
    () => import('@/components/tools/regex-tester-tool').then((mod) => mod.RegexTesterTool),
    { ssr: false },
  ),
  'conversor-unix-timestamp': dynamic(
    () => import('@/components/tools/unix-timestamp-converter-tool').then((mod) => mod.UnixTimestampConverterTool),
    { ssr: false },
  ),
  'lightning-decoder': dynamic(
    () => import('@/components/tools/lightning-decoder-tool').then((mod) => mod.LightningDecoderTool),
    { ssr: false },
  ),
  'remover-acentos': dynamic(
    () => import('@/components/tools/remove-accents-tool').then((mod) => mod.RemoveAccentsTool),
    { ssr: false },
  ),
  'contador-de-caracteres': dynamic(
    () => import('@/components/tools/character-counter-tool').then((mod) => mod.CharacterCounterTool),
    { ssr: false },
  ),
  'url-encoder-decoder': dynamic(
    () => import('@/components/tools/url-encoder-decoder-tool').then((mod) => mod.UrlEncoderDecoderTool),
    { ssr: false },
  ),
  'gerador-de-slug': dynamic(
    () => import('@/components/tools/slug-generator-tool').then((mod) => mod.SlugGeneratorTool),
    { ssr: false },
  ),
  'jwt-decoder': dynamic(
    () => import('@/components/tools/jwt-decoder-tool').then((mod) => mod.JwtDecoderTool),
    { ssr: false },
  ),
  'gerador-de-uuid-e-nanoid': dynamic(
    () => import('@/components/tools/uuid-nanoid-generator-tool').then((mod) => mod.UuidNanoIdGeneratorTool),
    { ssr: false },
  ),
  transfer: dynamic(
    () => import('@/components/tools/transfer-tool-wrapper').then((mod) => mod.TransferToolWrapper),
    { ssr: false },
  ),
};

export function PlatformAliasToolRouter({
  toolSlug,
  locale,
}: Readonly<{ toolSlug: string; locale: AppLocale }>) {
  const ToolComponent = toolComponents[toolSlug];

  if (!ToolComponent) {
    return null;
  }

  return <ToolComponent locale={locale} />;
}
