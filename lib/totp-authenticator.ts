export type TotpAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-512';

export type TotpConfig = {
  secret: string;
  label: string;
  issuer: string;
  account: string;
  digits: 6 | 8;
  period: number;
  algorithm: TotpAlgorithm;
};

export type TotpParseResult =
  | { ok: true; config: TotpConfig }
  | {
      ok: false;
      reason:
        | 'empty'
        | 'invalid-url'
        | 'unsupported-type'
        | 'missing-secret'
        | 'invalid-secret'
        | 'temporary-code';
    };

const DEFAULT_PERIOD = 30;

const algorithmByValue: Record<string, TotpAlgorithm> = {
  SHA1: 'SHA-1',
  'SHA-1': 'SHA-1',
  SHA256: 'SHA-256',
  'SHA-256': 'SHA-256',
  SHA512: 'SHA-512',
  'SHA-512': 'SHA-512',
};

const normalizeBase32Secret = (value: string): string =>
  value.trim().replaceAll(/[\s-]/g, '').toUpperCase();

export const isValidBase32Secret = (value: string): boolean => {
  const normalized = normalizeBase32Secret(value);
  const withoutPadding = normalized.replace(/=+$/, '');

  return (
    withoutPadding.length >= 16 &&
    /^[A-Z2-7]+$/.test(withoutPadding) &&
    /^[A-Z2-7]*={0,6}$/.test(normalized)
  );
};

export const base32ToBytes = (secret: string): Uint8Array => {
  const normalized = normalizeBase32Secret(secret).replace(/=+$/, '');

  if (!isValidBase32Secret(normalized)) {
    throw new Error('Invalid Base32 secret.');
  }

  let buffer = 0;
  let bits = 0;
  const bytes: number[] = [];

  for (const character of normalized) {
    const value = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'.indexOf(character);
    buffer = (buffer << 5) | value;
    bits += 5;

    while (bits >= 8) {
      bytes.push((buffer >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }

  return new Uint8Array(bytes);
};

const sanitizeDigits = (value: string | null): 6 | 8 =>
  value === '8' ? 8 : 6;

const sanitizePeriod = (value: string | null): number => {
  const parsed = Number(value ?? DEFAULT_PERIOD);

  return Number.isInteger(parsed) && parsed >= 5 && parsed <= 300
    ? parsed
    : DEFAULT_PERIOD;
};

const safelyDecodeUrlPart = (value: string): string => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const getLabelParts = (label: string, issuer: string) => {
  const decodedLabel = safelyDecodeUrlPart(label).trim();
  const separatorIndex = decodedLabel.indexOf(':');
  const labelIssuer = separatorIndex > -1 ? decodedLabel.slice(0, separatorIndex).trim() : '';
  const account = separatorIndex > -1 ? decodedLabel.slice(separatorIndex + 1).trim() : decodedLabel;

  return {
    issuer: issuer.trim() || labelIssuer,
    account,
    label: decodedLabel || issuer || 'Temporary authenticator code',
  };
};

export const parseTotpInput = (input: string, customLabel = ''): TotpParseResult => {
  const trimmed = input.trim();

  if (!trimmed) {
    return { ok: false, reason: 'empty' };
  }

  if (/^\d{6,8}$/.test(trimmed)) {
    return { ok: false, reason: 'temporary-code' };
  }

  if (!/^otpauth:/i.test(trimmed)) {
    const secret = normalizeBase32Secret(trimmed);

    if (!isValidBase32Secret(secret)) {
      return { ok: false, reason: 'invalid-secret' };
    }

    return {
      ok: true,
      config: {
        secret,
        label: customLabel.trim() || 'Temporary authenticator code',
        issuer: '',
        account: '',
        digits: 6,
        period: DEFAULT_PERIOD,
        algorithm: 'SHA-1',
      },
    };
  }

  let url: URL;

  try {
    url = new URL(trimmed);
  } catch {
    return { ok: false, reason: 'invalid-url' };
  }

  if (url.hostname.toLowerCase() !== 'totp') {
    return { ok: false, reason: 'unsupported-type' };
  }

  const secret = normalizeBase32Secret(url.searchParams.get('secret') ?? '');

  if (!secret) {
    return { ok: false, reason: 'missing-secret' };
  }

  if (!isValidBase32Secret(secret)) {
    return { ok: false, reason: 'invalid-secret' };
  }

  const { issuer, account, label } = getLabelParts(
    url.pathname.replace(/^\//, ''),
    safelyDecodeUrlPart(url.searchParams.get('issuer') ?? ''),
  );
  const algorithm = algorithmByValue[(url.searchParams.get('algorithm') ?? 'SHA1').toUpperCase()];

  if (!algorithm) {
    return { ok: false, reason: 'invalid-url' };
  }

  return {
    ok: true,
    config: {
      secret,
      label: customLabel.trim() || label,
      issuer,
      account,
      digits: sanitizeDigits(url.searchParams.get('digits')),
      period: sanitizePeriod(url.searchParams.get('period')),
      algorithm,
    },
  };
};

export const generateTotpCode = async (
  config: Pick<TotpConfig, 'secret' | 'digits' | 'period' | 'algorithm'>,
  now = Date.now(),
): Promise<string> => {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Web Crypto is unavailable.');
  }

  const counter = Math.floor(now / 1000 / config.period);
  const counterBytes = new Uint8Array(8);
  let remainder = counter;

  for (let index = 7; index >= 0; index -= 1) {
    counterBytes[index] = remainder & 0xff;
    remainder = Math.floor(remainder / 256);
  }

  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    base32ToBytes(config.secret),
    { name: 'HMAC', hash: { name: config.algorithm } },
    false,
    ['sign'],
  );
  const signed = new Uint8Array(
    await globalThis.crypto.subtle.sign('HMAC', key, counterBytes),
  );
  const offset = signed[signed.length - 1] & 0x0f;
  const binary =
    ((signed[offset] & 0x7f) << 24) |
    (signed[offset + 1] << 16) |
    (signed[offset + 2] << 8) |
    signed[offset + 3];

  return String(binary % 10 ** config.digits).padStart(config.digits, '0');
};

export const getTotpTiming = (period: number, now = Date.now()) => {
  const elapsedSeconds = Math.floor(now / 1000) % period;
  const remainingSeconds = period - elapsedSeconds || period;

  return {
    remainingSeconds,
    progress: (remainingSeconds / period) * 100,
  };
};
