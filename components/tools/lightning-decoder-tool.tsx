'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Copy,
  Download,
  FileJson,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type { AppLocale } from '@/lib/i18n/config';
import {
  decodeLightningInput,
  lightningRawToJson,
  type LightningDecodeResult,
  type LightningField,
  type LightningInputType,
} from '@/lib/lightning-decoder';

type Tab = 'decoder' | 'qrcode' | 'export';

type QrCodeExtension = 'png' | 'svg' | 'jpeg' | 'webp';

type QrCodeRawOutput = Blob | ArrayBuffer | Uint8Array | null | undefined;

type QrCodeStylingInstance = {
  append: (container: HTMLElement) => void;
  download: (options: { extension: QrCodeExtension; name: string }) => void;
  getRawData: (extension: QrCodeExtension) => Promise<QrCodeRawOutput>;
};

type QrCodeStylingConstructor = new (options: unknown) => QrCodeStylingInstance;

type QrLibrary = {
  default: QrCodeStylingConstructor;
};

type FieldExplanation = {
  title: string;
  meaning: string;
  whyItMatters: string;
};

type RawBolt11Section = {
  name: string;
  tag?: string;
  letters?: string;
  value?: unknown;
};

type PayloadSegment = {
  id: string;
  name: string;
  letters: string;
  group: LightningField['group'];
  displayValue: string;
  description?: string;
};

type UrlPart = {
  id: string;
  label: string;
  value: string;
  description: string;
};

type LightningDecoderToolProps = Readonly<{
  locale?: AppLocale;
}>;

const ui: Record<string, Record<AppLocale, string>> = {
  title: {
    'pt-br': 'Cole BOLT11, BOLT12, LNURL ou Lightning Address',
    en: 'Paste BOLT11, BOLT12, LNURL, or Lightning Address',
    es: 'Pega BOLT11, BOLT12, LNURL o Lightning Address',
  },
  inputPlaceholder: {
    'pt-br': 'Ex.: lnbc..., lno1..., lnurl1..., ou usuario@dominio.com',
    en: 'Ex.: lnbc..., lno1..., lnurl1..., or user@domain.com',
    es: 'Ej.: lnbc..., lno1..., lnurl1..., o usuario@dominio.com',
  },
  decode: { 'pt-br': 'Decodificar', en: 'Decode', es: 'Decodificar' },
  copied: { 'pt-br': 'Copiado!', en: 'Copied!', es: 'Copiado!' },
  copy: { 'pt-br': 'Copiar', en: 'Copy', es: 'Copiar' },
  tabDecoder: { 'pt-br': 'Decoder', en: 'Decoder', es: 'Decoder' },
  tabQrCode: { 'pt-br': 'QR Code', en: 'QR Code', es: 'QR Code' },
  tabExport: { 'pt-br': 'Exportar', en: 'Export', es: 'Exportar' },
  noData: {
    'pt-br': 'Sem dados para mostrar ainda.',
    en: 'No data to display yet.',
    es: 'Aun no hay datos para mostrar.',
  },
  statusOk: { 'pt-br': 'Decode válido', en: 'Valid decode', es: 'Decode válido' },
  statusFail: { 'pt-br': 'Decode com erro', en: 'Decode failed', es: 'Decode con error' },
  typeLabel: { 'pt-br': 'Tipo', en: 'Type', es: 'Tipo' },
  privacy: {
    'pt-br': 'Processamento 100% local no navegador. Nenhum payload é enviado ao servidor.',
    en: '100% local browser processing. No payload is sent to any server.',
    es: 'Procesamiento 100% local en el navegador. Ningun payload se envia al servidor.',
  },
  warning: {
    'pt-br': 'Sempre confirme destinatário e valor no app da sua carteira antes de pagar.',
    en: 'Always verify recipient and amount in your wallet app before paying.',
    es: 'Siempre verifica destinatario y monto en tu app de wallet antes de pagar.',
  },
  rawDetails: { 'pt-br': 'Raw details (JSON)', en: 'Raw details (JSON)', es: 'Raw details (JSON)' },
  fieldLegend: { 'pt-br': 'Legenda de campos', en: 'Field legend', es: 'Leyenda de campos' },
  payloadLegend: {
    'pt-br': 'Payload segmentado (clique para detalhes)',
    en: 'Segmented payload (click for details)',
    es: 'Payload segmentado (clic para detalles)',
  },
  urlLegend: {
    'pt-br': 'URL segmentada (clique para entender cada parte)',
    en: 'Segmented URL (click each part)',
    es: 'URL segmentada (clic para entender cada parte)',
  },
  qrSize: { 'pt-br': 'Tamanho do QR', en: 'QR size', es: 'Tamano del QR' },
  qrColor: { 'pt-br': 'Cor do QR', en: 'QR color', es: 'Color del QR' },
  qrBg: { 'pt-br': 'Cor de fundo', en: 'Background', es: 'Color de fondo' },
  downloadPng: { 'pt-br': 'Baixar PNG', en: 'Download PNG', es: 'Descargar PNG' },
  downloadSvg: { 'pt-br': 'Baixar SVG', en: 'Download SVG', es: 'Descargar SVG' },
  downloadJpeg: { 'pt-br': 'Baixar JPEG', en: 'Download JPEG', es: 'Descargar JPEG' },
  downloadWebp: { 'pt-br': 'Baixar WEBP', en: 'Download WEBP', es: 'Descargar WEBP' },
  copyQrImage: { 'pt-br': 'Copiar imagem do QR', en: 'Copy QR image', es: 'Copiar imagen del QR' },
  exportTxt: { 'pt-br': 'Exportar TXT', en: 'Export TXT', es: 'Exportar TXT' },
  exportJson: { 'pt-br': 'Exportar JSON', en: 'Export JSON', es: 'Exportar JSON' },
  summaryTitle: { 'pt-br': 'Resumo', en: 'Summary', es: 'Resumen' },
  amountRaw: { 'pt-br': 'Valor (msat bruto)', en: 'Amount (raw msat)', es: 'Monto (msat bruto)' },
  amountFormatted: { 'pt-br': 'Valor (formatado)', en: 'Amount (formatted)', es: 'Monto (formateado)' },
  createdRaw: { 'pt-br': 'Criado (unix)', en: 'Created (unix)', es: 'Creado (unix)' },
  createdFormatted: { 'pt-br': 'Criado (formatado)', en: 'Created (formatted)', es: 'Creado (formateado)' },
  expiresRaw: { 'pt-br': 'Expira (unix)', en: 'Expires (unix)', es: 'Expira (unix)' },
  expiresFormatted: { 'pt-br': 'Expira (formatado)', en: 'Expires (formatted)', es: 'Expira (formateado)' },
  expiresWindow: {
    'pt-br': 'Validade da fatura (seg)',
    en: 'Invoice validity (sec)',
    es: 'Validez de factura (seg)',
  },
  expiresIn: {
    'pt-br': 'Expira em',
    en: 'Expires in',
    es: 'Expira en',
  },
  expiredAgo: {
    'pt-br': 'Expirou há',
    en: 'Expired',
    es: 'Expiro hace',
  },
  timezone: {
    'pt-br': 'Fuso horário',
    en: 'Time zone',
    es: 'Zona horaria',
  },
  details: { 'pt-br': 'Detalhes', en: 'Details', es: 'Detalles' },
  explanationTitle: { 'pt-br': 'Explicação do campo', en: 'Field explanation', es: 'Explicacion del campo' },
};

const typeLabelByLocale: Record<AppLocale, Record<LightningInputType, string>> = {
  'pt-br': {
    bolt11: 'BOLT11',
    bolt12: 'BOLT12',
    lnurl: 'LNURL',
    'lightning-address': 'Lightning Address',
    unknown: 'Desconhecido',
  },
  en: {
    bolt11: 'BOLT11',
    bolt12: 'BOLT12',
    lnurl: 'LNURL',
    'lightning-address': 'Lightning Address',
    unknown: 'Unknown',
  },
  es: {
    bolt11: 'BOLT11',
    bolt12: 'BOLT12',
    lnurl: 'LNURL',
    'lightning-address': 'Lightning Address',
    unknown: 'Desconocido',
  },
};

const fieldGroupStyles: Record<LightningField['group'], { bg: string; text: string; label: string }> = {
  header: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Header' },
  payment: { bg: 'bg-green-100', text: 'text-green-800', label: 'Pagamento' },
  timing: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Tempo' },
  routing: { bg: 'bg-violet-100', text: 'text-violet-800', label: 'Roteamento' },
  security: { bg: 'bg-rose-100', text: 'text-rose-800', label: 'Seguranca' },
  metadata: { bg: 'bg-cyan-100', text: 'text-cyan-800', label: 'Metadados' },
  unknown: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Desconhecido' },
};

const translatedFieldLabels: Record<string, string> = {
  lightning_network: 'Rede Lightning',
  coin_network: 'Rede da moeda',
  amount: 'Valor',
  separator: 'Separador',
  timestamp: 'Timestamp de criação',
  payment_hash: 'Hash do pagamento',
  description: 'Descrição',
  min_final_cltv_expiry: 'CLTV final mínimo',
  expiry: 'Expiração (segundos)',
  payment_secret: 'Segredo do pagamento',
  feature_bits: 'Bits de funcionalidade',
  signature: 'Assinatura',
  checksum: 'Checksum',
  recovery_flag: 'Recovery flag',
  chain: 'Chain',
  chains: 'Chains',
  node_id: 'Node ID',
  offer: 'Oferta',
  metadata: 'Metadados',
};

const fieldExplanations: Record<string, FieldExplanation> = {
  lightning_network: {
    title: 'Rede Lightning',
    meaning: 'Prefixo que indica que o payload pertence ao ecossistema Lightning Network.',
    whyItMatters: 'Ajuda a identificar o padrão correto antes de tentar interpretar os demais campos.',
  },
  coin_network: {
    title: 'Rede da moeda',
    meaning: 'Define em qual rede o pagamento deve ocorrer, como bitcoin-mainnet ou testnet.',
    whyItMatters: 'Evita enviar pagamento para rede errada.',
  },
  amount: {
    title: 'Valor',
    meaning: 'Quantidade solicitada, geralmente em millisatoshis (msat).',
    whyItMatters: 'Permite validar o valor exato antes de pagar.',
  },
  separator: {
    title: 'Separador',
    meaning: 'Marcador do formato bech32 que separa prefixo da parte codificada.',
    whyItMatters: 'É parte estrutural do formato e ajuda na validação sintática.',
  },
  timestamp: {
    title: 'Timestamp',
    meaning: 'Momento de criação do invoice em formato unix (segundos desde 1970).',
    whyItMatters: 'Ajuda a verificar se a cobrança é recente e coerente.',
  },
  expiry: {
    title: 'Expiração',
    meaning: 'Tempo de validade da cobrança em segundos.',
    whyItMatters: 'Se expirado, o pagamento deve ser recusado pela carteira.',
  },
  payment_hash: {
    title: 'Payment Hash',
    meaning: 'Identificador criptográfico da pré-imagem do pagamento.',
    whyItMatters: 'É um campo central para a segurança do fluxo HTLC.',
  },
  payment_secret: {
    title: 'Payment Secret',
    meaning: 'Segredo adicional para evitar probing e reforçar proteção do pagamento.',
    whyItMatters: 'Reduz vetores de ataque e melhora a segurança da cobrança.',
  },
  feature_bits: {
    title: 'Feature Bits',
    meaning: 'Conjunto de capacidades do protocolo marcadas como requeridas ou suportadas.',
    whyItMatters: 'Indica compatibilidade entre carteira pagadora e recebedora.',
  },
  signature: {
    title: 'Assinatura',
    meaning: 'Assinatura criptográfica do invoice.',
    whyItMatters: 'No fluxo completo, é usada para verificar autenticidade da origem.',
  },
  checksum: {
    title: 'Checksum',
    meaning: 'Parte final do bech32 usada para detectar erros de digitação/corrupção.',
    whyItMatters: 'Ajuda a evitar leitura de payload inválido.',
  },
  recovery_flag: {
    title: 'Recovery Flag',
    meaning: 'Bit extra usado na recuperação de chave pública a partir da assinatura.',
    whyItMatters: 'Campo técnico para validação avançada de assinatura.',
  },
};

function t(key: string, locale: AppLocale): string {
  return ui[key]?.[locale] ?? ui[key]?.['pt-br'] ?? key;
}

function prettifyFieldLabel(label: string, locale: AppLocale): string {
  if (locale !== 'pt-br') {
    return label;
  }

  return translatedFieldLabels[label] ?? label;
}

function formatIsoDateForLocale(value: string | undefined, locale: AppLocale): string | undefined {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(locale);
}

function formatUnixDateForLocale(unixSeconds: number | undefined, locale: AppLocale): string | undefined {
  if (unixSeconds === undefined) {
    return undefined;
  }

  const date = new Date(unixSeconds * 1000);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toLocaleString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'short',
  });
}

function formatSecondsToReadable(totalSeconds: number): string {
  const abs = Math.abs(totalSeconds);
  const days = Math.floor(abs / 86400);
  const hours = Math.floor((abs % 86400) / 3600);
  const minutes = Math.floor((abs % 3600) / 60);
  const seconds = abs % 60;

  const parts: string[] = [];
  if (days > 0) {
    parts.push(`${days}d`);
  }
  parts.push(`${hours}h`, `${minutes}m`, `${seconds}s`);
  return parts.join(' ');
}

function optionalNumberToString(value: number | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return String(value);
}

function normalizeQrRawData(raw: QrCodeRawOutput): Blob | null {
  if (!raw) {
    return null;
  }

  if (raw instanceof Blob) {
    return raw;
  }

  if (raw instanceof ArrayBuffer) {
    return new Blob([raw], { type: 'image/png' });
  }

  if (raw instanceof Uint8Array) {
    return new Blob([raw], { type: 'image/png' });
  }

  return null;
}

function findFirstUrlCandidate(result: LightningDecodeResult | null): string | null {
  if (!result) {
    return null;
  }

  const fieldUrl = result.fields.find((field) => /^https?:\/\//i.test(field.value.trim()));
  if (fieldUrl) {
    return fieldUrl.value.trim();
  }

  const rawValues = Object.values(result.raw);
  const rawUrl = rawValues.find((value) => typeof value === 'string' && /^https?:\/\//i.test(value.trim()));
  if (typeof rawUrl === 'string') {
    return rawUrl.trim();
  }

  return null;
}

function buildUrlParts(urlCandidate: string | null): UrlPart[] {
  if (!urlCandidate) {
    return [];
  }

  try {
    const parsed = new URL(urlCandidate);
    const parts: UrlPart[] = [
      {
        id: 'protocol',
        label: 'Protocolo',
        value: parsed.protocol,
        description: 'Define o esquema de transporte, como https:.',
      },
      {
        id: 'host',
        label: 'Domínio',
        value: parsed.host,
        description: 'Servidor de destino da URL.',
      },
      {
        id: 'path',
        label: 'Caminho',
        value: parsed.pathname || '/',
        description: 'Rota do recurso no servidor.',
      },
    ];

    if (parsed.search) {
      parts.push({
        id: 'query',
        label: 'Query String',
        value: parsed.search,
        description: 'Parâmetros adicionais da URL.',
      });

      parsed.searchParams.forEach((value, key) => {
        parts.push({
          id: `query-${key}`,
          label: `Param: ${key}`,
          value,
          description: `Valor do parâmetro ${key}.`,
        });
      });
    }

    if (parsed.hash) {
      parts.push({
        id: 'hash',
        label: 'Fragmento',
        value: parsed.hash,
        description: 'Âncora interna da URL.',
      });
    }

    return parts;
  } catch {
    return [];
  }
}

function getBolt11Sections(result: LightningDecodeResult | null): RawBolt11Section[] {
  if (!result) {
    return [];
  }

  const rawSections = result.raw.sections;
  if (!Array.isArray(rawSections)) {
    return [];
  }

  return rawSections.filter((section): section is RawBolt11Section => {
    if (!section || typeof section !== 'object') {
      return false;
    }

    const maybeName = (section as { name?: unknown }).name;
    return typeof maybeName === 'string';
  });
}

function buildPayloadSegments(result: LightningDecodeResult | null, locale: AppLocale): PayloadSegment[] {
  const sections = getBolt11Sections(result);
  if (sections.length === 0 || !result) {
    return [];
  }

  const fieldByLabel = new Map<string, LightningField>();
  result.fields.forEach((field) => {
    fieldByLabel.set(field.label, field);
  });

  return sections.map((section, index) => {
    const field = fieldByLabel.get(section.name);
    const letters = typeof section.letters === 'string' ? section.letters : '';

    let displayValue = letters;
    if (typeof section.value === 'string' || typeof section.value === 'number') {
      displayValue = String(section.value);
    } else if (section.value && typeof section.value === 'object') {
      displayValue = JSON.stringify(section.value);
    }

    return {
      id: `${section.name}-${index}`,
      name: prettifyFieldLabel(section.name, locale),
      letters,
      group: field?.group ?? 'unknown',
      displayValue: field?.value ?? displayValue,
      description: field?.description ?? (section.tag ? `Tag ${section.tag}` : undefined),
    };
  });
}

export function LightningDecoderTool({ locale = 'pt-br' }: LightningDecoderToolProps) {
  const [activeTab, setActiveTab] = useState<Tab>('decoder');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<LightningDecodeResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [qrSize, setQrSize] = useState(288);
  const [qrColor, setQrColor] = useState('#111827');
  const [qrBg, setQrBg] = useState('#ffffff');

  const [qrLib, setQrLib] = useState<QrLibrary | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const qrInstanceRef = useRef<any>(null);

  const [selectedExplanationKey, setSelectedExplanationKey] = useState<string | null>(null);
  const [nowUnix, setNowUnix] = useState<number>(() => Math.floor(Date.now() / 1000));

  const copyToClipboard = useCallback((value: string, key: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    });
  }, []);

  const downloadFile = useCallback((content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }, []);

  const normalizedPayload = result?.normalized ?? input.trim();

  useEffect(() => {
    import('qr-code-styling').then((mod) => setQrLib(mod as unknown as QrLibrary));
  }, []);

  const handleDecode = useCallback(() => {
    setResult(decodeLightningInput(input));
    setActiveTab('decoder');
  }, [input]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNowUnix(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const summaryRows = useMemo(() => {
    if (!result) {
      return [] as Array<{ label: string; value: string }>;
    }

    const createdUnix = typeof result.raw.createdAt === 'number' ? result.raw.createdAt : undefined;
    const expiresInSeconds = typeof result.raw.expiresInSeconds === 'number' ? result.raw.expiresInSeconds : undefined;
    const expiresFromRaw = typeof result.raw.expiresAt === 'number' ? result.raw.expiresAt : undefined;
    const computedExpiresUnix =
      expiresFromRaw ??
      (createdUnix !== undefined && expiresInSeconds !== undefined
        ? createdUnix + expiresInSeconds
        : undefined);

    const countdownLabel =
      computedExpiresUnix !== undefined && computedExpiresUnix >= nowUnix
        ? t('expiresIn', locale)
        : t('expiredAgo', locale);

    let countdownValue: string | undefined;
    if (computedExpiresUnix === undefined) {
      countdownValue = undefined;
    } else {
      countdownValue = formatSecondsToReadable(computedExpiresUnix - nowUnix);
    }

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const rows: Array<{ label: string; value?: string }> = [
      { label: t('summaryTitle', locale), value: result.summary.title },
      { label: 'Network', value: result.summary.network },
      { label: 'Prefix', value: result.summary.prefix },
      { label: 'Payee', value: result.summary.payeePubKey },
      { label: t('amountFormatted', locale), value: result.summary.amountFormatted },
      {
        label: t('createdFormatted', locale),
        value: formatUnixDateForLocale(createdUnix, locale) ?? formatIsoDateForLocale(result.summary.createdAtIso, locale),
      },
      { label: t('expiresWindow', locale), value: optionalNumberToString(expiresInSeconds) },
      {
        label: t('expiresFormatted', locale),
        value:
          formatUnixDateForLocale(computedExpiresUnix, locale) ??
          formatIsoDateForLocale(result.summary.expiresAtIso, locale),
      },
      { label: countdownLabel, value: countdownValue },
      { label: t('timezone', locale), value: timezone },
    ];

    return rows.filter((row): row is { label: string; value: string } => Boolean(row.value));
  }, [result, locale, nowUnix]);

  const rawJson = useMemo(() => {
    if (!result) {
      return '';
    }

    return lightningRawToJson(result);
  }, [result]);

  const payloadSegments = useMemo(() => buildPayloadSegments(result, locale), [result, locale]);
  const urlParts = useMemo(() => buildUrlParts(findFirstUrlCandidate(result)), [result]);

  const runQrDownload = useCallback(async (extension: QrCodeExtension) => {
    if (!normalizedPayload || !qrLib) {
      return;
    }

    const qr = qrInstanceRef.current as QrCodeStylingInstance | null;
    if (qr) {
      qr.download({ extension, name: 'lightning-decoder' });
      return;
    }

    const QRCodeStyling = qrLib.default;
    const tempContainer = document.createElement('div');
    const tempQr = new QRCodeStyling({
      width: qrSize,
      height: qrSize,
      data: normalizedPayload,
      dotsOptions: { color: qrColor, type: 'square' },
      backgroundOptions: { color: qrBg },
      cornersSquareOptions: { color: qrColor },
      cornersDotOptions: { color: qrColor },
      qrOptions: { errorCorrectionLevel: 'M' },
    });
    tempQr.append(tempContainer);
    tempQr.download({ extension, name: 'lightning-decoder' });
  }, [normalizedPayload, qrLib, qrSize, qrColor, qrBg]);

  const copyQrImageToClipboard = useCallback(async () => {
    if (!normalizedPayload || !qrLib || !navigator.clipboard?.write || globalThis.ClipboardItem === undefined) {
      return;
    }

    let qr = qrInstanceRef.current as QrCodeStylingInstance | null;

    if (!qr) {
      const QRCodeStyling = qrLib.default;
      const tempContainer = document.createElement('div');
      qr = new QRCodeStyling({
        width: qrSize,
        height: qrSize,
        data: normalizedPayload,
        dotsOptions: { color: qrColor, type: 'square' },
        backgroundOptions: { color: qrBg },
        cornersSquareOptions: { color: qrColor },
        cornersDotOptions: { color: qrColor },
        qrOptions: { errorCorrectionLevel: 'M' },
      });
      qr.append(tempContainer);
    }

    const raw = await qr.getRawData('png');
    const blob = normalizeQrRawData(raw);
    if (!blob) {
      return;
    }

    await navigator.clipboard.write([
      new globalThis.ClipboardItem({
        [blob.type || 'image/png']: blob,
      }),
    ]);
  }, [normalizedPayload, qrBg, qrColor, qrLib, qrSize]);

  const tabs: Array<{ key: Tab; label: string }> = [
    { key: 'decoder', label: t('tabDecoder', locale) },
    { key: 'qrcode', label: t('tabQrCode', locale) },
    { key: 'export', label: t('tabExport', locale) },
  ];

  const selectedExplanation = selectedExplanationKey ? fieldExplanations[selectedExplanationKey] : null;

  return (
    <Card className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-800">{t('title', locale)}</label>
        <Textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={t('inputPlaceholder', locale)}
          className="min-h-[108px] font-mono text-xs"
          rows={4}
        />
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleDecode}>{t('decode', locale)}</Button>
          <Button variant="secondary" onClick={() => copyToClipboard(input, 'input-copy')}>
            <Copy className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            {copiedKey === 'input-copy' ? t('copied', locale) : t('copy', locale)}
          </Button>
        </div>
      </div>

      {result && (
        <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${result.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {result.isValid ? t('statusOk', locale) : t('statusFail', locale)}
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
              {t('typeLabel', locale)}: {typeLabelByLocale[locale][result.type]}
            </span>
          </div>
          <div className="mt-3 divide-y divide-slate-200/80 rounded-lg border border-slate-200/70 bg-white/60">
            {summaryRows.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-3 px-2.5 py-2 text-xs">
                <span className="text-slate-500">{row.label}</span>
                <span className="break-all font-mono text-slate-900">{row.value}</span>
              </div>
            ))}
          </div>
          {result.errors.length > 0 && (
            <div className="mt-3 space-y-1">
              {result.errors.map((error) => (
                <p key={error} className="flex items-start gap-1.5 text-xs text-red-600">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{error}</span>
                </p>
              ))}
            </div>
          )}
          {result.warnings.length > 0 && (
            <div className="mt-3 space-y-1">
              {result.warnings.map((warning) => (
                <p key={warning} className="flex items-start gap-1.5 text-xs text-amber-700">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{warning}</span>
                </p>
              ))}
            </div>
          )}
        </section>
      )}

      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <div className="inline-flex min-w-full gap-1 rounded-xl border border-slate-200 bg-slate-100/70 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`min-h-9 whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'decoder' && (
        <DecoderTab
          locale={locale}
          result={result}
          rawJson={rawJson}
          copyToClipboard={copyToClipboard}
          copiedKey={copiedKey}
          payloadSegments={payloadSegments}
          urlParts={urlParts}
          onOpenExplanation={setSelectedExplanationKey}
        />
      )}

      {activeTab === 'qrcode' && (
        <QrCodeTab
          locale={locale}
          payload={normalizedPayload}
          qrSize={qrSize}
          setQrSize={setQrSize}
          qrColor={qrColor}
          setQrColor={setQrColor}
          qrBg={qrBg}
          setQrBg={setQrBg}
          qrLib={qrLib}
          qrInstanceRef={qrInstanceRef}
          onDownload={runQrDownload}
          onCopyImage={copyQrImageToClipboard}
        />
      )}

      {activeTab === 'export' && (
        <ExportTab
          locale={locale}
          result={result}
          rawJson={rawJson}
          copyToClipboard={copyToClipboard}
          copiedKey={copiedKey}
          downloadFile={downloadFile}
          onDownloadQr={runQrDownload}
          onCopyQrImage={copyQrImageToClipboard}
        />
      )}

      <div className="grid gap-2 border-t border-slate-200 pt-4">
        <p className="flex items-start gap-2 text-xs text-slate-500">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" aria-hidden="true" />
          <span>{t('privacy', locale)}</span>
        </p>
        <p className="flex items-start gap-2 text-xs text-amber-700">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{t('warning', locale)}</span>
        </p>
      </div>

      {selectedExplanation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">{t('explanationTitle', locale)}</h3>
              <button
                type="button"
                className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                onClick={() => setSelectedExplanationKey(null)}
                aria-label="Fechar explicação"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <p className="font-semibold text-slate-900">{selectedExplanation.title}</p>
              <p className="text-slate-700"><span className="font-medium">O que é:</span> {selectedExplanation.meaning}</p>
              <p className="text-slate-700"><span className="font-medium">Por que importa:</span> {selectedExplanation.whyItMatters}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

function DecoderTab({
  locale,
  result,
  rawJson,
  copyToClipboard,
  copiedKey,
  payloadSegments,
  urlParts,
  onOpenExplanation,
}: Readonly<{
  locale: AppLocale;
  result: LightningDecodeResult | null;
  rawJson: string;
  copyToClipboard: (value: string, key: string) => void;
  copiedKey: string | null;
  payloadSegments: PayloadSegment[];
  urlParts: UrlPart[];
  onOpenExplanation: (fieldKey: string) => void;
}>) {
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const [selectedUrlPartId, setSelectedUrlPartId] = useState<string | null>(null);

  const selectedSegment = payloadSegments.find((segment) => segment.id === selectedSegmentId) ?? null;
  const selectedUrlPart = urlParts.find((part) => part.id === selectedUrlPartId) ?? null;

  if (result === null) {
    return (
      <div className="flex h-28 items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
        {t('noData', locale)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-semibold text-slate-700">{t('fieldLegend', locale)}</p>
        <div className="flex flex-wrap gap-1.5">
          {Object.values(fieldGroupStyles).map((group) => (
            <span key={group.label} className={`rounded px-2 py-0.5 text-[10px] font-medium ${group.bg} ${group.text}`}>
              {group.label}
            </span>
          ))}
        </div>
      </div>

      {payloadSegments.length > 0 && (
        <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <p className="text-xs font-semibold text-slate-700">{t('payloadLegend', locale)}</p>
          <div className="flex flex-wrap gap-1">
            {payloadSegments.map((segment) => {
              const style = fieldGroupStyles[segment.group];
              const isActive = selectedSegment?.id === segment.id;

              return (
                <button
                  key={segment.id}
                  type="button"
                  onClick={() => setSelectedSegmentId(segment.id)}
                  className={`rounded px-2 py-1 font-mono text-[11px] ${style.bg} ${style.text} ${isActive ? 'ring-2 ring-brand-500' : ''}`}
                  title={segment.name}
                >
                  {segment.letters || segment.displayValue.slice(0, 24)}
                </button>
              );
            })}
          </div>

          {selectedSegment && (
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold text-slate-900">{selectedSegment.name}</span>
                <div className="flex items-center gap-1">
                  {fieldExplanations[selectedSegment.name] && (
                    <button
                      type="button"
                      className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      onClick={() => onOpenExplanation(selectedSegment.name)}
                      aria-label="Abrir explicação"
                    >
                      <HelpCircle className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                  <Button
                    variant="ghost"
                    className="h-7 px-2 text-[11px]"
                    onClick={() => copyToClipboard(selectedSegment.displayValue, `segment-${selectedSegment.id}`)}
                  >
                    {copiedKey === `segment-${selectedSegment.id}` ? 'OK' : t('copy', locale)}
                  </Button>
                </div>
              </div>
              <p className="mt-2 break-all font-mono text-xs text-slate-900">{selectedSegment.displayValue}</p>
              {selectedSegment.description && <p className="mt-1 text-[11px] text-slate-500">{selectedSegment.description}</p>}
            </div>
          )}
        </section>
      )}

      {urlParts.length > 0 && (
        <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <p className="text-xs font-semibold text-slate-700">{t('urlLegend', locale)}</p>
          <div className="flex flex-wrap gap-1.5">
            {urlParts.map((part, index) => (
              <button
                key={part.id}
                type="button"
                onClick={() => setSelectedUrlPartId(part.id)}
                className={`rounded px-2 py-1 text-[11px] font-semibold ${index % 2 === 0 ? 'bg-indigo-100 text-indigo-900' : 'bg-cyan-100 text-cyan-900'} ${selectedUrlPart?.id === part.id ? 'ring-2 ring-brand-500' : ''}`}
              >
                {part.label}
              </button>
            ))}
          </div>

          {selectedUrlPart && (
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-slate-900">{selectedUrlPart.label}</span>
                <Button
                  variant="ghost"
                  className="h-7 px-2 text-[11px]"
                  onClick={() => copyToClipboard(selectedUrlPart.value, `url-${selectedUrlPart.id}`)}
                >
                  {copiedKey === `url-${selectedUrlPart.id}` ? 'OK' : t('copy', locale)}
                </Button>
              </div>
              <p className="mt-2 break-all font-mono text-xs text-slate-900">{selectedUrlPart.value}</p>
              <p className="mt-1 text-[11px] text-slate-500">{selectedUrlPart.description}</p>
            </div>
          )}
        </section>
      )}

      <section className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
        {result.fields.length > 0 ? (
          result.fields.map((field) => {
            const style = fieldGroupStyles[field.group];
            const fieldCopyKey = `field-${field.id}`;

            return (
              <div key={field.id} className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${style.bg} ${style.text}`}>
                      {field.group}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">{prettifyFieldLabel(field.label, locale)}</span>
                    {fieldExplanations[field.label] && (
                      <button
                        type="button"
                        className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                        onClick={() => onOpenExplanation(field.label)}
                        aria-label="Abrir explicação"
                      >
                        <HelpCircle className="h-4 w-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    className="h-7 px-2 text-[11px]"
                    onClick={() => copyToClipboard(field.value, fieldCopyKey)}
                  >
                    {copiedKey === fieldCopyKey ? 'OK' : t('copy', locale)}
                  </Button>
                </div>
                <p className="mt-2 break-all font-mono text-xs text-slate-900">{field.value}</p>
                {field.description && <p className="mt-1 text-[11px] text-slate-500">{field.description}</p>}
              </div>
            );
          })
        ) : (
          <p className="text-xs text-slate-500">{t('noData', locale)}</p>
        )}
      </section>

      <section className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-800">{t('rawDetails', locale)}</h3>
          <Button className="h-8 gap-1.5 px-3 text-xs" onClick={() => copyToClipboard(rawJson, 'raw-json-copy')}>
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            {copiedKey === 'raw-json-copy' ? t('copied', locale) : t('copy', locale)}
          </Button>
        </div>
        <pre className="max-h-80 overflow-auto rounded-lg border border-slate-200 bg-white p-3 text-[11px] text-slate-800">{rawJson}</pre>
      </section>
    </div>
  );
}

function QrCodeTab({
  locale,
  payload,
  qrSize,
  setQrSize,
  qrColor,
  setQrColor,
  qrBg,
  setQrBg,
  qrLib,
  qrInstanceRef,
  onDownload,
  onCopyImage,
}: Readonly<{
  locale: AppLocale;
  payload: string;
  qrSize: number;
  setQrSize: (value: number) => void;
  qrColor: string;
  setQrColor: (value: string) => void;
  qrBg: string;
  setQrBg: (value: string) => void;
  qrLib: QrLibrary | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  qrInstanceRef: React.MutableRefObject<any>;
  onDownload: (extension: QrCodeExtension) => Promise<void>;
  onCopyImage: () => Promise<void>;
}>) {
  const qrCanvasRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!qrLib || !payload || !qrCanvasRef.current) {
      return;
    }

    const QRCodeStyling = qrLib.default;
    const container = qrCanvasRef.current;
    container.innerHTML = '';

    const qr = new QRCodeStyling({
      width: qrSize,
      height: qrSize,
      data: payload,
      dotsOptions: { color: qrColor, type: 'square' },
      backgroundOptions: { color: qrBg },
      cornersSquareOptions: { color: qrColor },
      cornersDotOptions: { color: qrColor },
      qrOptions: { errorCorrectionLevel: 'M' },
    });

    qr.append(container);
    qrInstanceRef.current = qr;
  }, [qrBg, qrColor, qrLib, qrSize, payload, qrInstanceRef]);

  if (payload.length === 0) {
    return (
      <div className="flex h-28 items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
        {t('noData', locale)}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-800">{t('qrSize', locale)}: {qrSize}px</label>
          <input
            type="range"
            min={128}
            max={512}
            step={32}
            value={qrSize}
            onChange={(event) => setQrSize(Number(event.target.value))}
            className="w-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-800">{t('qrColor', locale)}</label>
            <input
              type="color"
              value={qrColor}
              onChange={(event) => setQrColor(event.target.value)}
              className="h-9 w-full cursor-pointer rounded-lg border border-slate-200"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-800">{t('qrBg', locale)}</label>
            <input
              type="color"
              value={qrBg}
              onChange={(event) => setQrBg(event.target.value)}
              className="h-9 w-full cursor-pointer rounded-lg border border-slate-200"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button className="h-8 gap-1.5 px-3 text-xs" onClick={() => onDownload('png')}>
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            {t('downloadPng', locale)}
          </Button>
          <Button className="h-8 gap-1.5 px-3 text-xs" variant="secondary" onClick={() => onDownload('svg')}>
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            {t('downloadSvg', locale)}
          </Button>
          <Button className="h-8 gap-1.5 px-3 text-xs" variant="secondary" onClick={() => onDownload('jpeg')}>
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            {t('downloadJpeg', locale)}
          </Button>
          <Button className="h-8 gap-1.5 px-3 text-xs" variant="secondary" onClick={() => onDownload('webp')}>
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            {t('downloadWebp', locale)}
          </Button>
        </div>
        <Button className="h-8 gap-1.5 px-3 text-xs" variant="ghost" onClick={onCopyImage}>
          <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {t('copyQrImage', locale)}
        </Button>
      </div>

      <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50/80 p-6">
        <div ref={qrCanvasRef} className="flex items-center justify-center" />
      </div>
    </div>
  );
}

function ExportTab({
  locale,
  result,
  rawJson,
  copyToClipboard,
  copiedKey,
  downloadFile,
  onDownloadQr,
  onCopyQrImage,
}: Readonly<{
  locale: AppLocale;
  result: LightningDecodeResult | null;
  rawJson: string;
  copyToClipboard: (value: string, key: string) => void;
  copiedKey: string | null;
  downloadFile: (content: string, filename: string, type: string) => void;
  onDownloadQr: (extension: QrCodeExtension) => Promise<void>;
  onCopyQrImage: () => Promise<void>;
}>) {
  if (result === null) {
    return (
      <div className="flex h-28 items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
        {t('noData', locale)}
      </div>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
      <Button className="h-9 gap-1.5 text-xs" variant="secondary" onClick={() => copyToClipboard(result.normalized, 'export-payload')}>
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
        {copiedKey === 'export-payload' ? t('copied', locale) : `${t('copy', locale)} payload`}
      </Button>
      <Button
        className="h-9 gap-1.5 text-xs"
        variant="secondary"
        onClick={() => downloadFile(result.normalized, 'lightning-input.txt', 'text/plain')}
      >
        <FileText className="h-3.5 w-3.5" aria-hidden="true" />
        {t('exportTxt', locale)}
      </Button>
      <Button className="h-9 gap-1.5 text-xs" variant="secondary" onClick={() => copyToClipboard(rawJson, 'export-json-copy')}>
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
        {copiedKey === 'export-json-copy' ? t('copied', locale) : `${t('copy', locale)} JSON`}
      </Button>
      <Button
        className="h-9 gap-1.5 text-xs"
        variant="secondary"
        onClick={() => downloadFile(rawJson, 'lightning-decoded.json', 'application/json')}
      >
        <FileJson className="h-3.5 w-3.5" aria-hidden="true" />
        {t('exportJson', locale)}
      </Button>
      <Button className="h-9 gap-1.5 text-xs" variant="secondary" onClick={() => onDownloadQr('png')}>
        <Download className="h-3.5 w-3.5" aria-hidden="true" />
        QR PNG
      </Button>
      <Button className="h-9 gap-1.5 text-xs" variant="secondary" onClick={() => onDownloadQr('svg')}>
        <Download className="h-3.5 w-3.5" aria-hidden="true" />
        QR SVG
      </Button>
      <Button className="h-9 gap-1.5 text-xs" variant="secondary" onClick={() => onDownloadQr('jpeg')}>
        <Download className="h-3.5 w-3.5" aria-hidden="true" />
        QR JPEG
      </Button>
      <Button className="h-9 gap-1.5 text-xs" variant="secondary" onClick={() => onDownloadQr('webp')}>
        <Download className="h-3.5 w-3.5" aria-hidden="true" />
        QR WEBP
      </Button>
      <Button className="h-9 gap-1.5 text-xs" variant="secondary" onClick={onCopyQrImage}>
        <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
        {t('copyQrImage', locale)}
      </Button>
    </div>
  );
}
