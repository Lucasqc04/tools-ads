import { createId } from '@paralleldrive/cuid2';
import KSUID from 'ksuid';
import { ulid } from 'ulid';
import { parse as parseUuid, v1, v1ToV6, v3, v4, v5, v6, v7 } from 'uuid';

const nanoDefaultAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-';
const uuidNamespaceDns = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

export type UuidVersion = 'v1' | 'v3' | 'v4' | 'v5' | 'v6' | 'v7';

export type IdMode = 'uuid' | 'nanoid' | 'ulid' | 'ksuid' | 'cuid2' | 'objectid';

export type GenerateUuidOptions = {
  version?: UuidVersion;
  namespace?: string;
  name?: string;
};

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const getRandomInt = (maxExclusive: number): number => {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return bytes[0] % maxExclusive;
};

const getRandomHex = (bytesLength: number): string => {
  const bytes = new Uint8Array(bytesLength);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((item) => item.toString(16).padStart(2, '0'))
    .join('');
};

const safeNamespace = (namespace?: string): Uint8Array => {
  try {
    return parseUuid(namespace ?? uuidNamespaceDns);
  } catch {
    return parseUuid(uuidNamespaceDns);
  }
};

const getUuidVersionWarning = (
  version: UuidVersion,
  amount: number,
  name?: string,
): string | undefined => {
  if ((version === 'v3' || version === 'v5') && amount > 1 && !name) {
    return 'UUID v3/v5 sem nome personalizado gera sempre o mesmo ID para o mesmo namespace.';
  }

  return undefined;
};

export const generateUuidByVersion = (
  version: UuidVersion = 'v4',
  options: GenerateUuidOptions = {},
): string => {
  if (version === 'v1') {
    return v1().toLowerCase();
  }

  if (version === 'v3') {
    return v3(options.name ?? 'adtools-default-name', safeNamespace(options.namespace)).toLowerCase();
  }

  if (version === 'v5') {
    return v5(options.name ?? 'adtools-default-name', safeNamespace(options.namespace)).toLowerCase();
  }

  if (version === 'v6') {
    return v6().toLowerCase();
  }

  if (version === 'v7') {
    return v7().toLowerCase();
  }

  return v4().toLowerCase();
};

export const convertUuidV1ToV6 = (uuidV1: string): string | undefined => {
  try {
    return v1ToV6(uuidV1).toLowerCase();
  } catch {
    return undefined;
  }
};

export const generateUuidList = (
  amountRaw: number,
  options: GenerateUuidOptions = {},
): { ids: string[]; warning?: string } => {
  const amount = clamp(Math.floor(amountRaw), 1, 500);
  const version = options.version ?? 'v4';

  return {
    ids: Array.from({ length: amount }, (_, index) =>
      generateUuidByVersion(version, {
        ...options,
        name:
          version === 'v3' || version === 'v5'
            ? `${options.name ?? 'adtools-default-name'}-${index + 1}`
            : options.name,
      }),
    ),
    warning: getUuidVersionWarning(version, amount, options.name),
  };
};

export const sanitizeNanoAlphabet = (alphabetRaw: string): string => {
  const cleaned = Array.from(new Set(alphabetRaw.split('').filter(Boolean))).join('');

  if (cleaned.length < 2) {
    return nanoDefaultAlphabet;
  }

  return cleaned;
};

export const generateNanoId = (lengthRaw: number, alphabetRaw?: string): string => {
  const alphabet = sanitizeNanoAlphabet(alphabetRaw ?? nanoDefaultAlphabet);
  const length = clamp(Math.floor(lengthRaw), 4, 128);

  let output = '';

  for (let idx = 0; idx < length; idx += 1) {
    output += alphabet[getRandomInt(alphabet.length)] ?? alphabet[0];
  }

  return output;
};

export const generateNanoIdList = (
  amountRaw: number,
  lengthRaw: number,
  alphabetRaw?: string,
): string[] => {
  const amount = clamp(Math.floor(amountRaw), 1, 500);

  return Array.from({ length: amount }, () => generateNanoId(lengthRaw, alphabetRaw));
};

export const generateUlidList = (amountRaw: number): string[] => {
  const amount = clamp(Math.floor(amountRaw), 1, 500);
  return Array.from({ length: amount }, () => ulid());
};

export const generateKsuidList = (amountRaw: number): string[] => {
  const amount = clamp(Math.floor(amountRaw), 1, 500);
  return Array.from({ length: amount }, () => KSUID.randomSync().string);
};

export const generateCuid2List = (amountRaw: number): string[] => {
  const amount = clamp(Math.floor(amountRaw), 1, 500);
  return Array.from({ length: amount }, () => createId());
};

export const generateObjectId = (): string => {
  const timestampHex = Math.floor(Date.now() / 1000)
    .toString(16)
    .padStart(8, '0');
  const randomHex = getRandomHex(5);
  const counterHex = getRandomHex(3);

  return `${timestampHex}${randomHex}${counterHex}`;
};

export const generateObjectIdList = (amountRaw: number): string[] => {
  const amount = clamp(Math.floor(amountRaw), 1, 500);
  return Array.from({ length: amount }, () => generateObjectId());
};

export const idsToCsv = (ids: string[]): string => {
  const lines = ['index,id'];

  ids.forEach((id, idx) => {
    lines.push(`${idx + 1},"${id.replaceAll('"', '""')}"`);
  });

  return lines.join('\n');
};

export const idsToTxt = (ids: string[], lineBreak = true): string => ids.join(lineBreak ? '\n' : ', ');

export const getNanoDefaultAlphabet = (): string => nanoDefaultAlphabet;

export const getUuidNamespaceDns = (): string => uuidNamespaceDns;
