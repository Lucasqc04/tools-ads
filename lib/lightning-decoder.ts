import { bech32 } from 'bech32';
import { decode as decodeBolt11Invoice } from 'light-bolt11-decoder';

export type LightningInputType =
  | 'bolt11'
  | 'bolt12'
  | 'lnurl'
  | 'lightning-address'
  | 'unknown';

export type LightningField = {
  id: string;
  label: string;
  value: string;
  group: 'header' | 'payment' | 'timing' | 'routing' | 'security' | 'metadata' | 'unknown';
  description?: string;
};

export type LightningDecodeResult = {
  type: LightningInputType;
  input: string;
  normalized: string;
  isValid: boolean;
  summary: {
    title: string;
    network?: string;
    amountMsat?: number;
    amountFormatted?: string;
    createdAtIso?: string;
    expiresAtIso?: string;
    payeePubKey?: string;
    prefix?: string;
  };
  fields: LightningField[];
  warnings: string[];
  errors: string[];
  raw: Record<string, unknown>;
};

type Bolt11Section = {
  name: string;
  tag?: string;
  letters?: string;
  value?: unknown;
};

type Bolt11Decoded = {
  paymentRequest: string;
  sections: Bolt11Section[];
  expiry?: number;
  route_hints?: unknown[];
};

type Bolt12Subtype = 'offer' | 'invoice-request' | 'invoice' | 'unknown';

type Bolt12TlvEntry = {
  type: bigint;
  length: bigint;
  value: Uint8Array;
};

type Bolt12TlvMeta = {
  label: string;
  description: string;
  parser:
    | 'hex'
    | 'utf8'
    | 'number'
    | 'node-id'
    | 'payment-hash'
    | 'chains'
    | 'features';
};

const lightningAddressRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

const formatMsat = (amountMsat: number): string =>
  new Intl.NumberFormat('pt-BR').format(amountMsat).replaceAll(',', '.');

const toDateIso = (unixSeconds: number): string =>
  new Date(unixSeconds * 1000).toISOString();

const normalizeInput = (value: string): string =>
  value
    .trim()
    .replace(/^lightning:/i, '')
    .replace(/[\n\r\t ]+/g, '');

function toUnknownErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function detectLightningInputType(value: string): LightningInputType {
  const normalized = normalizeInput(value);

  if (!normalized) {
    return 'unknown';
  }

  const lower = normalized.toLowerCase();

  if (lightningAddressRegex.test(normalized)) {
    return 'lightning-address';
  }

  if (lower.startsWith('lnurl')) {
    return 'lnurl';
  }

  if (lower.startsWith('lno1') || lower.startsWith('lnr1') || lower.startsWith('lnf1')) {
    return 'bolt12';
  }

  if (lower.startsWith('lnbc') || lower.startsWith('lntb') || lower.startsWith('lnbcrt') || lower.startsWith('lnsb')) {
    return 'bolt11';
  }

  return 'unknown';
}

function decodeBech32ToBytes(input: string): Uint8Array {
  const decoded = bech32.decode(input, 4096);
  const words = decoded.words;
  return Uint8Array.from(bech32.fromWords(words));
}

function decodeBech32Data(input: string): { hrp: string; bytes: Uint8Array } {
  const decoded = bech32.decode(input, 4096);
  return {
    hrp: decoded.prefix,
    bytes: Uint8Array.from(bech32.fromWords(decoded.words)),
  };
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function bytesToBigInt(bytes: Uint8Array): bigint {
  let value = 0n;

  for (const byte of bytes) {
    value = (value << 8n) + BigInt(byte);
  }

  return value;
}

function parseBolt12Subtype(hrp: string): Bolt12Subtype {
  if (hrp.startsWith('lno')) {
    return 'offer';
  }

  if (hrp.startsWith('lnr')) {
    return 'invoice-request';
  }

  if (hrp.startsWith('lni')) {
    return 'invoice';
  }

  return 'unknown';
}

function getBolt12TypeName(subtype: Bolt12Subtype): string {
  if (subtype === 'offer') {
    return 'BOLT12 Offer';
  }

  if (subtype === 'invoice-request') {
    return 'BOLT12 Invoice Request';
  }

  if (subtype === 'invoice') {
    return 'BOLT12 Invoice';
  }

  return 'BOLT12';
}

function parseBigSize(bytes: Uint8Array, offset: number): {
  value?: bigint;
  nextOffset: number;
  error?: string;
} {
  if (offset >= bytes.length) {
    return {
      nextOffset: offset,
      error: 'Fim do payload ao ler BigSize.',
    };
  }

  const first = bytes[offset];

  if (first < 0xfd) {
    return { value: BigInt(first), nextOffset: offset + 1 };
  }

  let need = 8;
  if (first === 0xfd) {
    need = 2;
  } else if (first === 0xfe) {
    need = 4;
  }
  const start = offset + 1;
  const end = start + need;

  if (end > bytes.length) {
    return {
      nextOffset: bytes.length,
      error: 'Payload truncado ao ler BigSize.',
    };
  }

  return {
    value: bytesToBigInt(bytes.slice(start, end)),
    nextOffset: end,
  };
}

function parseBolt12Tlvs(bytes: Uint8Array): {
  entries: Bolt12TlvEntry[];
  warnings: string[];
} {
  const entries: Bolt12TlvEntry[] = [];
  const warnings: string[] = [];
  let offset = 0;

  while (offset < bytes.length) {
    const typeResult = parseBigSize(bytes, offset);
    if (typeResult.error || typeResult.value === undefined) {
      warnings.push(typeResult.error ?? 'Erro ao ler tipo TLV.');
      break;
    }

    const lengthResult = parseBigSize(bytes, typeResult.nextOffset);
    if (lengthResult.error || lengthResult.value === undefined) {
      warnings.push(lengthResult.error ?? 'Erro ao ler tamanho TLV.');
      break;
    }

    if (lengthResult.value > BigInt(Number.MAX_SAFE_INTEGER)) {
      warnings.push(`TLV type ${typeResult.value.toString()} com tamanho grande demais para parse local.`);
      break;
    }

    const length = Number(lengthResult.value);
    const valueStart = lengthResult.nextOffset;
    const valueEnd = valueStart + length;

    if (valueEnd > bytes.length) {
      warnings.push(`TLV type ${typeResult.value.toString()} truncado: tamanho declarado ${length}.`);
      break;
    }

    entries.push({
      type: typeResult.value,
      length: lengthResult.value,
      value: bytes.slice(valueStart, valueEnd),
    });

    offset = valueEnd;
  }

  return { entries, warnings };
}

function getBolt12TlvMeta(subtype: Bolt12Subtype, type: bigint): Bolt12TlvMeta | undefined {
  const typeId = Number(type);

  const commonMap: Record<number, Bolt12TlvMeta> = {
    2: {
      label: 'metadata',
      description: 'Metadados do pagamento.',
      parser: 'hex',
    },
    10: {
      label: 'features',
      description: 'Feature bits negociadas no protocolo.',
      parser: 'features',
    },
  };

  if (commonMap[typeId]) {
    return commonMap[typeId];
  }

  if (subtype === 'offer') {
    const offerMap: Record<number, Bolt12TlvMeta> = {
      1: { label: 'chains', description: 'Lista de blockchains aceitas.', parser: 'chains' },
      4: { label: 'currency', description: 'Código de moeda da oferta.', parser: 'utf8' },
      6: { label: 'amount', description: 'Valor definido na oferta.', parser: 'number' },
      8: { label: 'description', description: 'Descrição textual da oferta.', parser: 'utf8' },
      12: { label: 'absolute_expiry', description: 'Expiração absoluta (unix time).', parser: 'number' },
      16: { label: 'issuer', description: 'Emissor da oferta.', parser: 'utf8' },
      18: { label: 'quantity_max', description: 'Quantidade máxima permitida.', parser: 'number' },
      20: { label: 'node_id', description: 'Node pubkey do emissor.', parser: 'node-id' },
    };

    return offerMap[typeId];
  }

  if (subtype === 'invoice-request') {
    const requestMap: Record<number, Bolt12TlvMeta> = {
      1: { label: 'chain', description: 'Blockchain escolhida para o pedido.', parser: 'chains' },
      3: { label: 'amount', description: 'Valor solicitado.', parser: 'number' },
      5: { label: 'features', description: 'Feature bits solicitadas.', parser: 'features' },
      7: { label: 'quantity', description: 'Quantidade solicitada.', parser: 'number' },
      9: { label: 'payer_key', description: 'Chave pública do pagador.', parser: 'node-id' },
      11: { label: 'payer_note', description: 'Nota enviada pelo pagador.', parser: 'utf8' },
      13: { label: 'payer_info', description: 'Informações adicionais do pagador.', parser: 'hex' },
      15: { label: 'recurrence_counter', description: 'Contador de recorrência.', parser: 'number' },
    };

    return requestMap[typeId];
  }

  if (subtype === 'invoice') {
    const invoiceMap: Record<number, Bolt12TlvMeta> = {
      1: { label: 'chain', description: 'Blockchain da fatura.', parser: 'chains' },
      3: { label: 'offer_id', description: 'ID da offer relacionada.', parser: 'hex' },
      5: { label: 'amount', description: 'Valor final da invoice.', parser: 'number' },
      7: { label: 'description', description: 'Descrição da cobrança.', parser: 'utf8' },
      9: { label: 'features', description: 'Feature bits da invoice.', parser: 'features' },
      11: { label: 'node_id', description: 'Node pubkey do recebedor.', parser: 'node-id' },
      13: { label: 'quantity', description: 'Quantidade final.', parser: 'number' },
      19: { label: 'created_at', description: 'Data de criação (unix time).', parser: 'number' },
      21: { label: 'relative_expiry', description: 'Expiração relativa em segundos.', parser: 'number' },
      23: { label: 'payment_hash', description: 'Hash do pagamento.', parser: 'payment-hash' },
      25: { label: 'cltv', description: 'CLTV mínimo final.', parser: 'number' },
    };

    return invoiceMap[typeId];
  }

  return undefined;
}

function parseChains(value: Uint8Array): string {
  if (value.length % 32 !== 0) {
    return `hex:${bytesToHex(value)} (cadeias com tamanho não múltiplo de 32 bytes)`;
  }

  const chains: string[] = [];

  for (let index = 0; index < value.length; index += 32) {
    chains.push(bytesToHex(value.slice(index, index + 32)));
  }

  return chains.join(', ');
}

function parseFeatures(value: Uint8Array): string {
  const bits: string[] = [];
  for (let byteIndex = 0; byteIndex < value.length; byteIndex += 1) {
    for (let bit = 0; bit < 8; bit += 1) {
      const mask = 1 << bit;
      if ((value[byteIndex] & mask) !== 0) {
        bits.push(String(byteIndex * 8 + bit));
      }
    }
  }

  const hex = bytesToHex(value);
  if (bits.length === 0) {
    return `hex:${hex} (sem bits ativos)`;
  }

  return `hex:${hex} | bits:${bits.join(',')}`;
}

function parseTlvValue(meta: Bolt12TlvMeta | undefined, value: Uint8Array): string {
  if (!meta) {
    return `hex:${bytesToHex(value)}`;
  }

  if (meta.parser === 'utf8') {
    const decoded = decodeUtf8OrHex(value);
    return decoded.isMostlyText ? decoded.utf8 : `hex:${decoded.hex}`;
  }

  if (meta.parser === 'number') {
    return bytesToBigInt(value).toString();
  }

  if (meta.parser === 'node-id') {
    if (value.length !== 33) {
      return `hex:${bytesToHex(value)} (esperado 33 bytes)`;
    }

    return bytesToHex(value);
  }

  if (meta.parser === 'payment-hash') {
    if (value.length !== 32) {
      return `hex:${bytesToHex(value)} (esperado 32 bytes)`;
    }

    return bytesToHex(value);
  }

  if (meta.parser === 'chains') {
    return parseChains(value);
  }

  if (meta.parser === 'features') {
    return parseFeatures(value);
  }

  return `hex:${bytesToHex(value)}`;
}

function decodeUtf8OrHex(bytes: Uint8Array): { utf8: string; hex: string; isMostlyText: boolean } {
  const utf8 = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
  const printableChars = utf8.replace(/[\x20-\x7E]/g, '').length;
  const isMostlyText = utf8.length > 0 && printableChars / utf8.length < 0.2;
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return { utf8, hex, isMostlyText };
}

function decodeLightningAddress(input: string): LightningDecodeResult {
  const [username, domain] = input.split('@');
  const lnurlp = `https://${domain}/.well-known/lnurlp/${username}`;

  return {
    type: 'lightning-address',
    input,
    normalized: input,
    isValid: true,
    summary: {
      title: 'Lightning Address detectado',
    },
    fields: [
      {
        id: 'address',
        label: 'Lightning Address',
        value: input,
        group: 'header',
      },
      {
        id: 'username',
        label: 'Username',
        value: username,
        group: 'metadata',
      },
      {
        id: 'domain',
        label: 'Domínio',
        value: domain,
        group: 'metadata',
      },
      {
        id: 'lnurlp',
        label: 'Endpoint LNURLp',
        value: lnurlp,
        group: 'routing',
        description: 'Endpoint padrão para resolver metadados de pagamento Lightning Address.',
      },
    ],
    warnings: ['Esta ferramenta não consulta o endpoint LNURLp automaticamente.'],
    errors: [],
    raw: {
      address: input,
      username,
      domain,
      lnurlp,
    },
  };
}

function decodeLnurl(input: string): LightningDecodeResult {
  try {
    const bytes = decodeBech32ToBytes(input.toLowerCase());
    const decoded = decodeUtf8OrHex(bytes);

    return {
      type: 'lnurl',
      input,
      normalized: input,
      isValid: true,
      summary: {
        title: 'LNURL decodificado',
      },
      fields: [
        {
          id: 'lnurl',
          label: 'LNURL',
          value: input,
          group: 'header',
        },
        {
          id: 'decoded',
          label: decoded.isMostlyText ? 'URL/Texto decodificado' : 'Payload em hexadecimal',
          value: decoded.isMostlyText ? decoded.utf8 : decoded.hex,
          group: 'routing',
        },
        {
          id: 'bytes',
          label: 'Tamanho (bytes)',
          value: String(bytes.length),
          group: 'metadata',
        },
      ],
      warnings: decoded.isMostlyText ? [] : ['LNURL não parece conter texto URL legível; exibindo hexadecimal.'],
      errors: [],
      raw: {
        lnurl: input,
        decodedText: decoded.utf8,
        decodedHex: decoded.hex,
        byteLength: bytes.length,
      },
    };
  } catch (error) {
    return {
      type: 'lnurl',
      input,
      normalized: input,
      isValid: false,
      summary: { title: 'Falha ao decodificar LNURL' },
      fields: [],
      warnings: [],
      errors: [error instanceof Error ? error.message : 'Erro desconhecido ao decodificar LNURL.'],
      raw: {
        lnurl: input,
      },
    };
  }
}

function decodeBolt12(input: string): LightningDecodeResult {
  try {
    const { hrp, bytes } = decodeBech32Data(input.toLowerCase());
    const subtype = parseBolt12Subtype(hrp);
    const decoded = decodeUtf8OrHex(bytes);
    const tlvResult = parseBolt12Tlvs(bytes);
    const tlvFields: LightningField[] = tlvResult.entries.map((entry, index) => {
      const meta = getBolt12TlvMeta(subtype, entry.type);
      const label = meta?.label ?? `unknown_tag_${entry.type.toString()}`;

      return {
        id: `tlv-${index}`,
        label,
        value: parseTlvValue(meta, entry.value),
        group: meta ? 'payment' : 'unknown',
        description: meta?.description ?? `TLV type ${entry.type.toString()} (${entry.length.toString()} bytes).`,
      };
    });

    const readablePayload = decoded.isMostlyText ? decoded.utf8 : decoded.hex;
    const bolt12TypeName = getBolt12TypeName(subtype);

    return {
      type: 'bolt12',
      input,
      normalized: input,
      isValid: true,
      summary: {
        title: `${bolt12TypeName} detectado`,
      },
      fields: [
        {
          id: 'offer',
          label: bolt12TypeName,
          value: input,
          group: 'header',
        },
        {
          id: 'hrp',
          label: 'Prefixo (HRP)',
          value: hrp,
          group: 'metadata',
        },
        {
          id: 'payload',
          label: decoded.isMostlyText ? 'Payload base (texto)' : 'Payload base (hex)',
          value: readablePayload,
          group: 'payment',
        },
        {
          id: 'bytes',
          label: 'Tamanho (bytes)',
          value: String(bytes.length),
          group: 'metadata',
        },
        {
          id: 'tlv-count',
          label: 'TLVs detectados',
          value: String(tlvFields.length),
          group: 'metadata',
        },
        ...tlvFields,
      ],
      warnings: [
        ...tlvResult.warnings,
        'Parse TLV exibido localmente com rótulos comuns de BOLT12; tipos fora do mapeamento aparecem como unknown_tag.',
      ],
      errors: [],
      raw: {
        offer: input,
        hrp,
        subtype,
        decodedText: decoded.utf8,
        decodedHex: decoded.hex,
        byteLength: bytes.length,
        tlvs: tlvResult.entries.map((entry) => ({
          type: entry.type.toString(),
          length: entry.length.toString(),
          valueHex: bytesToHex(entry.value),
        })),
      },
    };
  } catch (error) {
    return {
      type: 'bolt12',
      input,
      normalized: input,
      isValid: false,
      summary: { title: 'Falha ao decodificar BOLT12' },
      fields: [],
      warnings: [],
      errors: [toUnknownErrorMessage(error, 'Erro desconhecido ao decodificar BOLT12.')],
      raw: {
        offer: input,
      },
    };
  }
}

function getBolt11SectionValue(decoded: Bolt11Decoded, name: string): unknown {
  return decoded.sections.find((section) => section.name === name)?.value;
}

function mapBolt11Fields(decoded: Bolt11Decoded): LightningField[] {
  const fields: LightningField[] = [];

  decoded.sections.forEach((section, index) => {
    const id = `${section.name}-${index}`;
    const value = getSectionDisplayValue(section);

    let group: LightningField['group'] = 'unknown';

    if (['lightning_network', 'coin_network', 'amount', 'separator'].includes(section.name)) {
      group = 'header';
    } else if (['payment_hash', 'description', 'payment_secret', 'feature_bits'].includes(section.name)) {
      group = 'payment';
    } else if (['timestamp', 'expiry', 'min_final_cltv_expiry'].includes(section.name)) {
      group = 'timing';
    } else if (['route_hint', 'fallback_address'].includes(section.name)) {
      group = 'routing';
    } else if (['signature', 'checksum'].includes(section.name)) {
      group = 'security';
    } else if (section.name === 'unknown_tag') {
      group = 'metadata';
    }

    fields.push({
      id,
      label: section.name,
      value,
      group,
      description: section.tag ? `Tag ${section.tag}` : undefined,
    });
  });

  return fields;
}

function getSectionDisplayValue(section: Bolt11Section): string {
  if (typeof section.value === 'string' || typeof section.value === 'number') {
    return String(section.value);
  }

  if (section.value === null || section.value === undefined) {
    return section.letters ?? '';
  }

  return JSON.stringify(section.value);
}

function readSectionAsNumber(decoded: Bolt11Decoded, name: string): number | undefined {
  const raw = getBolt11SectionValue(decoded, name);

  if (typeof raw === 'number') {
    return raw;
  }

  if (typeof raw === 'string') {
    const parsed = Number.parseInt(raw, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  return undefined;
}

function readSectionAsString(decoded: Bolt11Decoded, name: string): string | undefined {
  const raw = getBolt11SectionValue(decoded, name);
  return typeof raw === 'string' ? raw : undefined;
}

function resolveBolt11Network(prefix: string): string {
  if (prefix.startsWith('lntb')) {
    return 'bitcoin-testnet';
  }

  if (prefix.startsWith('lnbcrt')) {
    return 'bitcoin-regtest';
  }

  if (prefix.startsWith('lnbc')) {
    return 'bitcoin-mainnet';
  }

  return prefix;
}

function readRecoveryFlag(signature: string): number | undefined {
  if (signature.length < 2) {
    return undefined;
  }

  return Number.parseInt(signature.slice(-2), 16);
}

function decodeBolt11(input: string): LightningDecodeResult {
  try {
    const decoded = decodeBolt11Invoice(input) as unknown as Bolt11Decoded;

    const amountMsat = readSectionAsNumber(decoded, 'amount');
    const timestamp = readSectionAsNumber(decoded, 'timestamp');
    const explicitExpiry = readSectionAsNumber(decoded, 'expiry');
    const expirySeconds = explicitExpiry ?? decoded.expiry ?? 3600;
    const expiresAt = timestamp ? timestamp + expirySeconds : undefined;

    const payeePubKey = readSectionAsString(decoded, 'payee');

    const signature = readSectionAsString(decoded, 'signature') ?? '';
    const recoveryFlag = readRecoveryFlag(signature);

    const prefix = input.includes('1') ? input.slice(0, input.indexOf('1')) : input;
    const networkPrefix = resolveBolt11Network(prefix);

    const fields = mapBolt11Fields(decoded);

    if (signature) {
      fields.push({
        id: 'recovery-flag',
        label: 'recovery_flag',
        value: recoveryFlag === undefined ? 'N/A' : String(recoveryFlag),
        group: 'security',
      });
    }

    const amountFormatted =
      amountMsat !== undefined && Number.isFinite(amountMsat)
        ? `${formatMsat(amountMsat)} millisats`
        : undefined;

    return {
      type: 'bolt11',
      input,
      normalized: input,
      isValid: true,
      summary: {
        title: 'BOLT11 Invoice decodificado',
        network: networkPrefix,
        amountMsat: Number.isFinite(amountMsat) ? amountMsat : undefined,
        amountFormatted,
        createdAtIso: timestamp ? toDateIso(timestamp) : undefined,
        expiresAtIso: expiresAt ? toDateIso(expiresAt) : undefined,
        payeePubKey,
        prefix,
      },
      fields,
      warnings: [
        'A assinatura não é validada criptograficamente nesta ferramenta.',
      ],
      errors: [],
      raw: {
        paymentRequest: decoded.paymentRequest,
        prefix,
        network: networkPrefix,
        amountMsat,
        createdAt: timestamp,
        expiresInSeconds: expirySeconds,
        expiresAt,
        payeePubKey,
        recoveryFlag,
        sections: decoded.sections,
        routeHints: decoded.route_hints ?? [],
      },
    };
  } catch (error) {
    return {
      type: 'bolt11',
      input,
      normalized: input,
      isValid: false,
      summary: { title: 'Falha ao decodificar BOLT11' },
      fields: [],
      warnings: [],
      errors: [toUnknownErrorMessage(error, 'Erro desconhecido ao decodificar BOLT11.')],
      raw: {
        paymentRequest: input,
      },
    };
  }
}

export function decodeLightningInput(value: string): LightningDecodeResult {
  const normalized = normalizeInput(value);
  const type = detectLightningInputType(normalized);

  if (!normalized) {
    return {
      type: 'unknown',
      input: value,
      normalized,
      isValid: false,
      summary: { title: 'Nenhum conteúdo para decodificar' },
      fields: [],
      warnings: [],
      errors: ['Cole um BOLT11, BOLT12, LNURL ou Lightning Address para iniciar.'],
      raw: {},
    };
  }

  if (type === 'lightning-address') {
    return decodeLightningAddress(normalized);
  }

  if (type === 'lnurl') {
    return decodeLnurl(normalized);
  }

  if (type === 'bolt12') {
    return decodeBolt12(normalized);
  }

  if (type === 'bolt11') {
    return decodeBolt11(normalized);
  }

  return {
    type,
    input: value,
    normalized,
    isValid: false,
    summary: { title: 'Formato não reconhecido' },
    fields: [],
    warnings: [],
    errors: ['Formato não reconhecido. Use BOLT11, BOLT12, LNURL ou Lightning Address.'],
    raw: {
      input: normalized,
    },
  };
}

export function lightningRawToJson(result: LightningDecodeResult): string {
  return JSON.stringify(result.raw, null, 2);
}
