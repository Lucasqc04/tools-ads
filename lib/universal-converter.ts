import { buildSlug } from '@/lib/slug-generator';
import { removeAccentsText } from '@/lib/remove-accents';

import type { AppLocale } from '@/lib/i18n/config';

export type UniversalConversionCategory =
  | 'text-encoding'
  | 'hash-checksum'
  | 'numeric-bases'
  | 'classic-ciphers'
  | 'web-programming';

export type UniversalConversionId =
  | 'text-to-binary'
  | 'binary-to-text'
  | 'text-to-hex'
  | 'hex-to-text'
  | 'text-to-ascii-dec'
  | 'ascii-dec-to-text'
  | 'text-to-octal-text'
  | 'octal-text-to-text'
  | 'decimal-to-binary'
  | 'binary-to-decimal'
  | 'decimal-to-hex'
  | 'hex-to-decimal'
  | 'decimal-to-octal'
  | 'octal-to-decimal'
  | 'binary-to-hex'
  | 'hex-to-binary'
  | 'octal-to-hex'
  | 'hex-to-octal'
  | 'decimal-to-base36'
  | 'base36-to-decimal'
  | 'text-to-md5'
  | 'text-to-sha1'
  | 'text-to-sha224'
  | 'text-to-sha256'
  | 'text-to-sha384'
  | 'text-to-sha512'
  | 'text-to-sha3-256'
  | 'text-to-sha3-512'
  | 'text-to-ripemd160'
  | 'text-to-crc32'
  | 'text-to-morse'
  | 'morse-to-text'
  | 'text-to-caesar'
  | 'caesar-to-text'
  | 'text-to-rot13'
  | 'rot13-to-text'
  | 'text-to-atbash'
  | 'atbash-to-text'
  | 'text-to-vigenere'
  | 'vigenere-to-text'
  | 'text-to-reverse'
  | 'reverse-to-text'
  | 'text-to-json-escaped'
  | 'json-escaped-to-text'
  | 'text-to-html-entities'
  | 'html-entities-to-text'
  | 'text-to-url-encode'
  | 'url-encode-to-text'
  | 'query-string-to-json'
  | 'json-to-query-string'
  | 'text-to-slug'
  | 'text-remove-accents'
  | 'text-remove-invisible'
  | 'text-show-invisible';

export type UniversalConversionDefinition = {
  id: UniversalConversionId;
  slug: string;
  category: UniversalConversionCategory;
  from: string;
  to: string;
  labelByLocale: Record<AppLocale, string>;
  searchTerms: string[];
  reversible: boolean;
  reverseConversionId?: UniversalConversionId;
  acceptsBatch: boolean;
  acceptsFile: boolean;
  needsKey: boolean;
  needsShift: boolean;
  isEducational: boolean;
  isHash: boolean;
  shouldGenerateStaticPage: boolean;
  shouldAppearInUniversalTool: boolean;
  existingDedicatedToolSlug?: string;
};

export type UniversalConversionOptions = {
  shift?: number;
  key?: string;
  fromBase?: number;
  toBase?: number;
};

export type UniversalConversionResult = {
  ok: boolean;
  output: string;
  error?: string;
  warning?: string;
};

export type UniversalPresetId =
  | 'all-hashes'
  | 'all-encodings'
  | 'all-bases'
  | 'all-classic-ciphers'
  | 'text-analysis-tech'
  | 'clean-for-url'
  | 'prepare-for-code'
  | 'caesar-all-shifts';

export type UniversalPreset = {
  id: UniversalPresetId;
  labelByLocale: Record<AppLocale, string>;
  destinationIds: UniversalConversionId[];
  warningByLocale?: Partial<Record<AppLocale, string>>;
};

const isBrowser = (): boolean => globalThis.window !== undefined;

const textEncoder = new TextEncoder();

const toHex = (bytes: Uint8Array): string =>
  Array.from(bytes)
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('');

const fromHex = (hex: string): Uint8Array | undefined => {
  const cleaned = hex.replaceAll(/\s+/g, '').toLowerCase();
  if (!/^[0-9a-f]*$/.test(cleaned) || cleaned.length % 2 !== 0) {
    return undefined;
  }

  const bytes = new Uint8Array(cleaned.length / 2);
  for (let idx = 0; idx < cleaned.length; idx += 2) {
    const byte = Number.parseInt(cleaned.slice(idx, idx + 2), 16);
    if (!Number.isFinite(byte)) {
      return undefined;
    }
    bytes[idx / 2] = byte;
  }

  return bytes;
};

const bytesToText = (bytes: Uint8Array): string => {
  try {
    return new TextDecoder().decode(bytes);
  } catch {
    return '';
  }
};

const textToBytes = (value: string): Uint8Array => textEncoder.encode(value);

const textToBinary = (value: string): string =>
  Array.from(textToBytes(value))
    .map((byte) => byte.toString(2).padStart(8, '0'))
    .join(' ');

const binaryToText = (value: string): string | undefined => {
  const cleaned = value.replaceAll(/\s+/g, ' ').trim();
  if (!cleaned) {
    return '';
  }

  const parts = cleaned.split(' ');
  const bytes = new Uint8Array(parts.length);

  for (let idx = 0; idx < parts.length; idx += 1) {
    if (!/^[01]{1,8}$/.test(parts[idx])) {
      return undefined;
    }

    bytes[idx] = Number.parseInt(parts[idx], 2);
  }

  return bytesToText(bytes);
};

const textToAsciiDecimal = (value: string): string =>
  Array.from(value)
    .map((char) => String(char.codePointAt(0) ?? 0))
    .join(' ');

const asciiDecimalToText = (value: string): string | undefined => {
  const cleaned = value.trim();
  if (!cleaned) {
    return '';
  }

  const numbers = cleaned.split(/\s+/);
  const chars: string[] = [];

  for (const token of numbers) {
    if (!/^\d+$/.test(token)) {
      return undefined;
    }

    const codePoint = Number.parseInt(token, 10);
    if (!Number.isFinite(codePoint) || codePoint < 0 || codePoint > 0x10ffff) {
      return undefined;
    }

    chars.push(String.fromCodePoint(codePoint));
  }

  return chars.join('');
};

const textToOctalText = (value: string): string =>
  Array.from(textToBytes(value))
    .map((byte) => byte.toString(8).padStart(3, '0'))
    .join(' ');

const octalTextToText = (value: string): string | undefined => {
  const cleaned = value.trim();
  if (!cleaned) {
    return '';
  }

  const parts = cleaned.split(/\s+/);
  const bytes = new Uint8Array(parts.length);

  for (let idx = 0; idx < parts.length; idx += 1) {
    if (!/^[0-7]{1,3}$/.test(parts[idx])) {
      return undefined;
    }

    bytes[idx] = Number.parseInt(parts[idx], 8);
  }

  return bytesToText(bytes);
};

const parseNumeric = (value: string, base: number): number | undefined => {
  const cleaned = value.trim().toLowerCase();
  if (!cleaned) {
    return undefined;
  }

  let normalized = cleaned;
  if (base === 2) {
    normalized = cleaned.replace(/^0b/, '');
  } else if (base === 16) {
    normalized = cleaned.replace(/^0x/, '');
  } else if (base === 8) {
    normalized = cleaned.replace(/^0o/, '');
  }

  const parsed = Number.parseInt(normalized, base);
  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  if (String(parsed) === 'NaN') {
    return undefined;
  }

  return parsed;
};

const toBase = (value: number, base: number): string => value.toString(base);

const morseByChar: Record<string, string> = {
  a: '.-',
  b: '-...',
  c: '-.-.',
  d: '-..',
  e: '.',
  f: '..-.',
  g: '--.',
  h: '....',
  i: '..',
  j: '.---',
  k: '-.-',
  l: '.-..',
  m: '--',
  n: '-.',
  o: '---',
  p: '.--.',
  q: '--.-',
  r: '.-.',
  s: '...',
  t: '-',
  u: '..-',
  v: '...-',
  w: '.--',
  x: '-..-',
  y: '-.--',
  z: '--..',
  '0': '-----',
  '1': '.----',
  '2': '..---',
  '3': '...--',
  '4': '....-',
  '5': '.....',
  '6': '-....',
  '7': '--...',
  '8': '---..',
  '9': '----.',
  '.': '.-.-.-',
  ',': '--..--',
  '?': '..--..',
  '!': '-.-.--',
  '/': '-..-.',
  '-': '-....-',
  '(': '-.--.',
  ')': '-.--.-',
};

const charByMorse = Object.fromEntries(Object.entries(morseByChar).map(([key, value]) => [value, key]));

const textToMorse = (value: string): string =>
  Array.from(value.toLowerCase())
    .map((char) => {
      if (char === ' ') {
        return '/';
      }

      return morseByChar[char] ?? '?';
    })
    .join(' ');

const morseToText = (value: string): string | undefined => {
  const cleaned = value.trim();
  if (!cleaned) {
    return '';
  }

  const parts = cleaned.split(/\s+/);
  const chars: string[] = [];

  for (const token of parts) {
    if (token === '/') {
      chars.push(' ');
      continue;
    }

    const mapped = charByMorse[token];
    if (!mapped) {
      return undefined;
    }

    chars.push(mapped);
  }

  return chars.join('');
};

const shiftAlphabet = (char: string, shift: number): string => {
  const code = char.codePointAt(0) ?? 0;
  const isUpper = code >= 65 && code <= 90;
  const isLower = code >= 97 && code <= 122;

  if (!isUpper && !isLower) {
    return char;
  }

  const start = isUpper ? 65 : 97;
  const normalized = ((code - start + shift) % 26 + 26) % 26;
  return String.fromCodePoint(start + normalized);
};

const caesarEncode = (value: string, shift: number): string =>
  Array.from(value)
    .map((char) => shiftAlphabet(char, shift))
    .join('');

const atbashTransform = (value: string): string =>
  Array.from(value)
    .map((char) => {
      const code = char.codePointAt(0) ?? 0;
      if (code >= 65 && code <= 90) {
        return String.fromCodePoint(90 - (code - 65));
      }

      if (code >= 97 && code <= 122) {
        return String.fromCodePoint(122 - (code - 97));
      }

      return char;
    })
    .join('');

const vigenereTransform = (value: string, rawKey: string, decode: boolean): string | undefined => {
  const key = rawKey.replaceAll(/[^a-zA-Z]/g, '').toLowerCase();
  if (!key) {
    return undefined;
  }

  let keyIndex = 0;
  return Array.from(value)
    .map((char) => {
      const code = char.codePointAt(0) ?? 0;
      const isUpper = code >= 65 && code <= 90;
      const isLower = code >= 97 && code <= 122;

      if (!isUpper && !isLower) {
        return char;
      }

      const shift = (key[keyIndex % key.length].codePointAt(0) ?? 97) - 97;
      keyIndex += 1;

      return shiftAlphabet(char, decode ? -shift : shift);
    })
    .join('');
};

const escapeJsonString = (value: string): string => JSON.stringify(value).slice(1, -1);

const unescapeJsonString = (value: string): string | undefined => {
  try {
    return JSON.parse('"' + value + '"');
  } catch {
    return undefined;
  }
};

const escapeHtmlEntities = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const unescapeHtmlEntities = (value: string): string => {
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
  };

  return value.replaceAll(/(&amp;|&lt;|&gt;|&quot;|&#39;)/g, (entity) => map[entity] ?? entity);
};

const invisibleCharacters = new Set(['\u200B', '\u200C', '\u200D', '\u2060', '\uFEFF']);

const removeInvisibleCharacters = (value: string): string =>
  Array.from(value)
    .filter((char) => !invisibleCharacters.has(char))
    .join('');

const showInvisibleCharacters = (value: string): string =>
  Array.from(value)
    .map((char) => {
      if (char === ' ') {
        return '[SPACE]';
      }

      if (char === '\n') {
        return String.raw`[LF]\n`;
      }

      if (char === '\t') {
        return '[TAB]';
      }

      if (invisibleCharacters.has(char)) {
        return `[U+${(char.codePointAt(0) ?? 0).toString(16).toUpperCase()}]`;
      }

      return char;
    })
    .join('');

const crc32Table = (() => {
  const table = new Uint32Array(256);
  for (let idx = 0; idx < 256; idx += 1) {
    let c = idx;
    for (let k = 0; k < 8; k += 1) {
      c = (c & 1) === 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[idx] = c >>> 0;
  }
  return table;
})();

const crc32 = (value: string): string => {
  const bytes = textToBytes(value);
  let crc = 0xffffffff;

  for (const byte of bytes) {
    crc = crc32Table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }

  const normalized = (crc ^ 0xffffffff) >>> 0;
  return normalized.toString(16).padStart(8, '0');
};

const md5 = (value: string): string => {
  const rotateLeft = (x: number, c: number) => (x << c) | (x >>> (32 - c));
  const toWordArray = (input: Uint8Array): number[] => {
    const length = input.length;
    const words: number[] = [];
    for (let i = 0; i < length; i += 1) {
      words[i >> 2] = (words[i >> 2] ?? 0) | (input[i] << ((i % 4) * 8));
    }

    words[length >> 2] = (words[length >> 2] ?? 0) | (0x80 << ((length % 4) * 8));
    const bitLen = length * 8;
    const totalWords = (((length + 8) >> 6) + 1) * 16;

    words[totalWords - 2] = bitLen & 0xffffffff;
    words[totalWords - 1] = Math.floor(bitLen / 0x100000000);

    return words;
  };

  const F = (x: number, y: number, z: number) => (x & y) | (~x & z);
  const G = (x: number, y: number, z: number) => (x & z) | (y & ~z);
  const H = (x: number, y: number, z: number) => x ^ y ^ z;
  const I = (x: number, y: number, z: number) => y ^ (x | ~z);

  const T = new Array(64).fill(0).map((_, idx) => Math.floor(Math.abs(Math.sin(idx + 1)) * 0x100000000));
  const S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];

  const X = toWordArray(textToBytes(value));

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  for (let i = 0; i < X.length; i += 16) {
    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;

    for (let j = 0; j < 64; j += 1) {
      let f = 0;
      let g = 0;

      if (j < 16) {
        f = F(b, c, d);
        g = j;
      } else if (j < 32) {
        f = G(b, c, d);
        g = (5 * j + 1) % 16;
      } else if (j < 48) {
        f = H(b, c, d);
        g = (3 * j + 5) % 16;
      } else {
        f = I(b, c, d);
        g = (7 * j) % 16;
      }

      const tmp = d;
      d = c;
      c = b;
      b = (b + rotateLeft((a + f + T[j] + (X[i + g] ?? 0)) >>> 0, S[j])) >>> 0;
      a = tmp;
    }

    a0 = (a0 + a) >>> 0;
    b0 = (b0 + b) >>> 0;
    c0 = (c0 + c) >>> 0;
    d0 = (d0 + d) >>> 0;
  }

  const toHexWord = (n: number) =>
    [n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff]
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

  return `${toHexWord(a0)}${toHexWord(b0)}${toHexWord(c0)}${toHexWord(d0)}`;
};

const hashBySubtle = async (algorithm: string, value: string): Promise<string | undefined> => {
  if (!isBrowser() || !globalThis.crypto?.subtle) {
    return undefined;
  }

  try {
    const digest = await globalThis.crypto.subtle.digest(algorithm, textToBytes(value));
    return toHex(new Uint8Array(digest));
  } catch {
    return undefined;
  }
};

const convertQueryStringToJson = (value: string): string | undefined => {
  const query = value.trim().replace(/^\?/, '');
  if (!query) {
    return '{}';
  }

  try {
    const params = new URLSearchParams(query);
    const out: Record<string, string> = {};
    params.forEach((paramValue, key) => {
      out[key] = paramValue;
    });
    return JSON.stringify(out, null, 2);
  } catch {
    return undefined;
  }
};

const convertJsonToQueryString = (value: string): string | undefined => {
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return undefined;
    }

    const params = new URLSearchParams();
    const stringifyQueryValue = (item: unknown): string => {
      if (typeof item === 'string') {
        return item;
      }

      if (typeof item === 'number') {
        return `${item}`;
      }

      if (typeof item === 'boolean') {
        return item ? 'true' : 'false';
      }

      if (item === null) {
        return 'null';
      }

      return JSON.stringify(item);
    };

    Object.entries(parsed).forEach(([key, item]) => {
      params.set(key, stringifyQueryValue(item));
    });

    return params.toString();
  } catch {
    return undefined;
  }
};

const parseFlexibleBaseNumber = (value: string, base: number): number | undefined => {
  const cleaned = value.trim().toLowerCase();
  if (!cleaned) {
    return undefined;
  }

  const valid = /^[0-9a-z]+$/.test(cleaned);
  if (!valid) {
    return undefined;
  }

  const parsed = Number.parseInt(cleaned, base);
  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  return parsed;
};

const convertBaseCustom = (
  value: string,
  fromBase: number,
  toBase: number,
): string | undefined => {
  if (fromBase < 2 || fromBase > 36 || toBase < 2 || toBase > 36) {
    return undefined;
  }

  const parsed = parseFlexibleBaseNumber(value, fromBase);
  if (parsed === undefined) {
    return undefined;
  }

  return parsed.toString(toBase);
};

const conversion = (definition: UniversalConversionDefinition): UniversalConversionDefinition => definition;

export const universalConversions: UniversalConversionDefinition[] = [
  conversion({
    id: 'text-to-binary',
    slug: 'texto-para-binario',
    category: 'text-encoding',
    from: 'text',
    to: 'binary',
    labelByLocale: {
      'pt-br': 'Texto para binario',
      en: 'Text to binary',
      es: 'Texto a binario',
    },
    searchTerms: ['texto', 'binario', 'text', 'binary'],
    reversible: true,
    reverseConversionId: 'binary-to-text',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: false,
    shouldGenerateStaticPage: true,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'binary-to-text',
    slug: 'binario-para-texto',
    category: 'text-encoding',
    from: 'binary',
    to: 'text',
    labelByLocale: {
      'pt-br': 'Binario para texto',
      en: 'Binary to text',
      es: 'Binario a texto',
    },
    searchTerms: ['binario', 'texto', 'binary'],
    reversible: true,
    reverseConversionId: 'text-to-binary',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: false,
    shouldGenerateStaticPage: true,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'text-to-hex',
    slug: 'texto-para-hexadecimal',
    category: 'text-encoding',
    from: 'text',
    to: 'hexadecimal',
    labelByLocale: {
      'pt-br': 'Texto para hexadecimal',
      en: 'Text to hex',
      es: 'Texto a hexadecimal',
    },
    searchTerms: ['hex', 'hexadecimal', 'texto'],
    reversible: true,
    reverseConversionId: 'hex-to-text',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: false,
    shouldGenerateStaticPage: true,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'hex-to-text',
    slug: 'hexadecimal-para-texto',
    category: 'text-encoding',
    from: 'hexadecimal',
    to: 'text',
    labelByLocale: {
      'pt-br': 'Hexadecimal para texto',
      en: 'Hex to text',
      es: 'Hexadecimal a texto',
    },
    searchTerms: ['hex', 'texto', 'decode'],
    reversible: true,
    reverseConversionId: 'text-to-hex',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: false,
    shouldGenerateStaticPage: true,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'text-to-ascii-dec',
    slug: 'texto-para-ascii',
    category: 'text-encoding',
    from: 'text',
    to: 'ascii decimal',
    labelByLocale: {
      'pt-br': 'Texto para ASCII decimal',
      en: 'Text to ASCII decimal',
      es: 'Texto a ASCII decimal',
    },
    searchTerms: ['ascii', 'decimal', 'texto'],
    reversible: true,
    reverseConversionId: 'ascii-dec-to-text',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: false,
    shouldGenerateStaticPage: true,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'ascii-dec-to-text',
    slug: 'ascii-para-texto',
    category: 'text-encoding',
    from: 'ascii decimal',
    to: 'text',
    labelByLocale: {
      'pt-br': 'ASCII decimal para texto',
      en: 'ASCII decimal to text',
      es: 'ASCII decimal a texto',
    },
    searchTerms: ['ascii', 'texto', 'decimal'],
    reversible: true,
    reverseConversionId: 'text-to-ascii-dec',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: false,
    shouldGenerateStaticPage: true,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'text-to-octal-text',
    slug: 'texto-para-octal',
    category: 'text-encoding',
    from: 'text',
    to: 'octal text',
    labelByLocale: {
      'pt-br': 'Texto para octal',
      en: 'Text to octal',
      es: 'Texto a octal',
    },
    searchTerms: ['octal', 'texto'],
    reversible: true,
    reverseConversionId: 'octal-text-to-text',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: false,
    shouldGenerateStaticPage: false,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'octal-text-to-text',
    slug: 'octal-para-texto',
    category: 'text-encoding',
    from: 'octal text',
    to: 'text',
    labelByLocale: {
      'pt-br': 'Octal para texto',
      en: 'Octal to text',
      es: 'Octal a texto',
    },
    searchTerms: ['octal', 'texto'],
    reversible: true,
    reverseConversionId: 'text-to-octal-text',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: false,
    shouldGenerateStaticPage: false,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'decimal-to-binary',
    slug: 'decimal-para-binario',
    category: 'numeric-bases',
    from: 'decimal',
    to: 'binary',
    labelByLocale: {
      'pt-br': 'Decimal para binario',
      en: 'Decimal to binary',
      es: 'Decimal a binario',
    },
    searchTerms: ['decimal', 'binario', 'base'],
    reversible: true,
    reverseConversionId: 'binary-to-decimal',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: false,
    shouldGenerateStaticPage: true,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'binary-to-decimal',
    slug: 'binario-para-decimal',
    category: 'numeric-bases',
    from: 'binary',
    to: 'decimal',
    labelByLocale: {
      'pt-br': 'Binario para decimal',
      en: 'Binary to decimal',
      es: 'Binario a decimal',
    },
    searchTerms: ['decimal', 'binario', 'base'],
    reversible: true,
    reverseConversionId: 'decimal-to-binary',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: false,
    shouldGenerateStaticPage: true,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'decimal-to-hex',
    slug: 'decimal-para-hexadecimal',
    category: 'numeric-bases',
    from: 'decimal',
    to: 'hexadecimal',
    labelByLocale: {
      'pt-br': 'Decimal para hexadecimal',
      en: 'Decimal to hexadecimal',
      es: 'Decimal a hexadecimal',
    },
    searchTerms: ['decimal', 'hexadecimal', 'base'],
    reversible: true,
    reverseConversionId: 'hex-to-decimal',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: false,
    shouldGenerateStaticPage: true,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'hex-to-decimal',
    slug: 'hexadecimal-para-decimal',
    category: 'numeric-bases',
    from: 'hexadecimal',
    to: 'decimal',
    labelByLocale: {
      'pt-br': 'Hexadecimal para decimal',
      en: 'Hexadecimal to decimal',
      es: 'Hexadecimal a decimal',
    },
    searchTerms: ['decimal', 'hexadecimal', 'base'],
    reversible: true,
    reverseConversionId: 'decimal-to-hex',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: false,
    shouldGenerateStaticPage: true,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'decimal-to-octal',
    slug: 'decimal-para-octal',
    category: 'numeric-bases',
    from: 'decimal',
    to: 'octal',
    labelByLocale: {
      'pt-br': 'Decimal para octal',
      en: 'Decimal to octal',
      es: 'Decimal a octal',
    },
    searchTerms: ['decimal', 'octal', 'base'],
    reversible: true,
    reverseConversionId: 'octal-to-decimal',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: false,
    shouldGenerateStaticPage: false,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'octal-to-decimal',
    slug: 'octal-para-decimal',
    category: 'numeric-bases',
    from: 'octal',
    to: 'decimal',
    labelByLocale: {
      'pt-br': 'Octal para decimal',
      en: 'Octal to decimal',
      es: 'Octal a decimal',
    },
    searchTerms: ['decimal', 'octal', 'base'],
    reversible: true,
    reverseConversionId: 'decimal-to-octal',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: false,
    shouldGenerateStaticPage: false,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'binary-to-hex',
    slug: 'binario-para-hexadecimal',
    category: 'numeric-bases',
    from: 'binary',
    to: 'hexadecimal',
    labelByLocale: {
      'pt-br': 'Binario para hexadecimal',
      en: 'Binary to hexadecimal',
      es: 'Binario a hexadecimal',
    },
    searchTerms: ['binario', 'hexadecimal', 'base'],
    reversible: true,
    reverseConversionId: 'hex-to-binary',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: false,
    shouldGenerateStaticPage: false,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'hex-to-binary',
    slug: 'hexadecimal-para-binario',
    category: 'numeric-bases',
    from: 'hexadecimal',
    to: 'binary',
    labelByLocale: {
      'pt-br': 'Hexadecimal para binario',
      en: 'Hexadecimal to binary',
      es: 'Hexadecimal a binario',
    },
    searchTerms: ['binario', 'hexadecimal', 'base'],
    reversible: true,
    reverseConversionId: 'binary-to-hex',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: false,
    shouldGenerateStaticPage: false,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'octal-to-hex',
    slug: 'octal-para-hexadecimal',
    category: 'numeric-bases',
    from: 'octal',
    to: 'hexadecimal',
    labelByLocale: {
      'pt-br': 'Octal para hexadecimal',
      en: 'Octal to hexadecimal',
      es: 'Octal a hexadecimal',
    },
    searchTerms: ['octal', 'hexadecimal', 'base'],
    reversible: true,
    reverseConversionId: 'hex-to-octal',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: false,
    shouldGenerateStaticPage: false,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'hex-to-octal',
    slug: 'hexadecimal-para-octal',
    category: 'numeric-bases',
    from: 'hexadecimal',
    to: 'octal',
    labelByLocale: {
      'pt-br': 'Hexadecimal para octal',
      en: 'Hexadecimal to octal',
      es: 'Hexadecimal a octal',
    },
    searchTerms: ['octal', 'hexadecimal', 'base'],
    reversible: true,
    reverseConversionId: 'octal-to-hex',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: false,
    shouldGenerateStaticPage: false,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'decimal-to-base36',
    slug: 'decimal-para-base36',
    category: 'numeric-bases',
    from: 'decimal',
    to: 'base36',
    labelByLocale: {
      'pt-br': 'Decimal para base 36',
      en: 'Decimal to base 36',
      es: 'Decimal a base 36',
    },
    searchTerms: ['decimal', 'base36', 'base'],
    reversible: true,
    reverseConversionId: 'base36-to-decimal',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: false,
    shouldGenerateStaticPage: false,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'base36-to-decimal',
    slug: 'base36-para-decimal',
    category: 'numeric-bases',
    from: 'base36',
    to: 'decimal',
    labelByLocale: {
      'pt-br': 'Base 36 para decimal',
      en: 'Base 36 to decimal',
      es: 'Base 36 a decimal',
    },
    searchTerms: ['decimal', 'base36', 'base'],
    reversible: true,
    reverseConversionId: 'decimal-to-base36',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: false,
    shouldGenerateStaticPage: false,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'text-to-md5',
    slug: 'texto-para-md5',
    category: 'hash-checksum',
    from: 'text',
    to: 'md5',
    labelByLocale: {
      'pt-br': 'Texto para MD5',
      en: 'Text to MD5',
      es: 'Texto a MD5',
    },
    searchTerms: ['md5', 'hash', 'gerador'],
    reversible: false,
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: true,
    shouldGenerateStaticPage: true,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'text-to-sha1',
    slug: 'texto-para-sha1',
    category: 'hash-checksum',
    from: 'text',
    to: 'sha-1',
    labelByLocale: {
      'pt-br': 'Texto para SHA-1',
      en: 'Text to SHA-1',
      es: 'Texto a SHA-1',
    },
    searchTerms: ['sha1', 'hash'],
    reversible: false,
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: true,
    shouldGenerateStaticPage: false,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'text-to-sha224',
    slug: 'texto-para-sha224',
    category: 'hash-checksum',
    from: 'text',
    to: 'sha-224',
    labelByLocale: {
      'pt-br': 'Texto para SHA-224',
      en: 'Text to SHA-224',
      es: 'Texto a SHA-224',
    },
    searchTerms: ['sha224', 'hash'],
    reversible: false,
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: true,
    shouldGenerateStaticPage: false,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'text-to-sha256',
    slug: 'texto-para-sha256',
    category: 'hash-checksum',
    from: 'text',
    to: 'sha-256',
    labelByLocale: {
      'pt-br': 'Texto para SHA-256',
      en: 'Text to SHA-256',
      es: 'Texto a SHA-256',
    },
    searchTerms: ['sha256', 'hash', 'gerador'],
    reversible: false,
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: true,
    shouldGenerateStaticPage: true,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'text-to-sha384',
    slug: 'texto-para-sha384',
    category: 'hash-checksum',
    from: 'text',
    to: 'sha-384',
    labelByLocale: {
      'pt-br': 'Texto para SHA-384',
      en: 'Text to SHA-384',
      es: 'Texto a SHA-384',
    },
    searchTerms: ['sha384', 'hash'],
    reversible: false,
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: true,
    shouldGenerateStaticPage: false,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'text-to-sha512',
    slug: 'texto-para-sha512',
    category: 'hash-checksum',
    from: 'text',
    to: 'sha-512',
    labelByLocale: {
      'pt-br': 'Texto para SHA-512',
      en: 'Text to SHA-512',
      es: 'Texto a SHA-512',
    },
    searchTerms: ['sha512', 'hash', 'gerador'],
    reversible: false,
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: true,
    shouldGenerateStaticPage: true,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'text-to-sha3-256',
    slug: 'texto-para-sha3-256',
    category: 'hash-checksum',
    from: 'text',
    to: 'sha3-256',
    labelByLocale: {
      'pt-br': 'Texto para SHA3-256',
      en: 'Text to SHA3-256',
      es: 'Texto a SHA3-256',
    },
    searchTerms: ['sha3', 'hash'],
    reversible: false,
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: true,
    shouldGenerateStaticPage: false,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'text-to-sha3-512',
    slug: 'texto-para-sha3-512',
    category: 'hash-checksum',
    from: 'text',
    to: 'sha3-512',
    labelByLocale: {
      'pt-br': 'Texto para SHA3-512',
      en: 'Text to SHA3-512',
      es: 'Texto a SHA3-512',
    },
    searchTerms: ['sha3', 'hash'],
    reversible: false,
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: true,
    shouldGenerateStaticPage: false,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'text-to-ripemd160',
    slug: 'texto-para-ripemd160',
    category: 'hash-checksum',
    from: 'text',
    to: 'ripemd-160',
    labelByLocale: {
      'pt-br': 'Texto para RIPEMD-160',
      en: 'Text to RIPEMD-160',
      es: 'Texto a RIPEMD-160',
    },
    searchTerms: ['ripemd', 'hash'],
    reversible: false,
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: true,
    shouldGenerateStaticPage: false,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'text-to-crc32',
    slug: 'texto-para-crc32',
    category: 'hash-checksum',
    from: 'text',
    to: 'crc32',
    labelByLocale: {
      'pt-br': 'Texto para CRC32',
      en: 'Text to CRC32',
      es: 'Texto a CRC32',
    },
    searchTerms: ['crc32', 'checksum'],
    reversible: false,
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: true,
    shouldGenerateStaticPage: false,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'text-to-morse',
    slug: 'texto-para-morse',
    category: 'classic-ciphers',
    from: 'text',
    to: 'morse',
    labelByLocale: {
      'pt-br': 'Texto para Morse',
      en: 'Text to Morse',
      es: 'Texto a Morse',
    },
    searchTerms: ['morse', 'cifra'],
    reversible: true,
    reverseConversionId: 'morse-to-text',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: true,
    isHash: false,
    shouldGenerateStaticPage: true,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'morse-to-text',
    slug: 'morse-para-texto',
    category: 'classic-ciphers',
    from: 'morse',
    to: 'text',
    labelByLocale: {
      'pt-br': 'Morse para texto',
      en: 'Morse to text',
      es: 'Morse a texto',
    },
    searchTerms: ['morse', 'decode'],
    reversible: true,
    reverseConversionId: 'text-to-morse',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: true,
    isHash: false,
    shouldGenerateStaticPage: true,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'text-to-caesar',
    slug: 'cifra-de-cesar',
    category: 'classic-ciphers',
    from: 'text',
    to: 'caesar',
    labelByLocale: {
      'pt-br': 'Texto para Cifra de Cesar',
      en: 'Text to Caesar cipher',
      es: 'Texto a Cifra de Cesar',
    },
    searchTerms: ['cesar', 'cifra', 'shift'],
    reversible: true,
    reverseConversionId: 'caesar-to-text',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: true,
    isEducational: true,
    isHash: false,
    shouldGenerateStaticPage: true,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'caesar-to-text',
    slug: 'decodificador-cifra-de-cesar',
    category: 'classic-ciphers',
    from: 'caesar',
    to: 'text',
    labelByLocale: {
      'pt-br': 'Cifra de Cesar para texto',
      en: 'Caesar cipher to text',
      es: 'Cifra de Cesar a texto',
    },
    searchTerms: ['cesar', 'decodificador', 'cifra'],
    reversible: true,
    reverseConversionId: 'text-to-caesar',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: true,
    isEducational: true,
    isHash: false,
    shouldGenerateStaticPage: true,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'text-to-rot13',
    slug: 'texto-para-rot13',
    category: 'classic-ciphers',
    from: 'text',
    to: 'rot13',
    labelByLocale: {
      'pt-br': 'Texto para ROT13',
      en: 'Text to ROT13',
      es: 'Texto a ROT13',
    },
    searchTerms: ['rot13', 'cifra'],
    reversible: true,
    reverseConversionId: 'rot13-to-text',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: true,
    isHash: false,
    shouldGenerateStaticPage: true,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'rot13-to-text',
    slug: 'rot13-para-texto',
    category: 'classic-ciphers',
    from: 'rot13',
    to: 'text',
    labelByLocale: {
      'pt-br': 'ROT13 para texto',
      en: 'ROT13 to text',
      es: 'ROT13 a texto',
    },
    searchTerms: ['rot13', 'decode'],
    reversible: true,
    reverseConversionId: 'text-to-rot13',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: true,
    isHash: false,
    shouldGenerateStaticPage: true,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'text-to-atbash',
    slug: 'texto-para-atbash',
    category: 'classic-ciphers',
    from: 'text',
    to: 'atbash',
    labelByLocale: {
      'pt-br': 'Texto para Atbash',
      en: 'Text to Atbash',
      es: 'Texto a Atbash',
    },
    searchTerms: ['atbash', 'cifra'],
    reversible: true,
    reverseConversionId: 'atbash-to-text',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: true,
    isHash: false,
    shouldGenerateStaticPage: false,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'atbash-to-text',
    slug: 'atbash-para-texto',
    category: 'classic-ciphers',
    from: 'atbash',
    to: 'text',
    labelByLocale: {
      'pt-br': 'Atbash para texto',
      en: 'Atbash to text',
      es: 'Atbash a texto',
    },
    searchTerms: ['atbash', 'decode'],
    reversible: true,
    reverseConversionId: 'text-to-atbash',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: true,
    isHash: false,
    shouldGenerateStaticPage: false,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'text-to-vigenere',
    slug: 'texto-para-vigenere',
    category: 'classic-ciphers',
    from: 'text',
    to: 'vigenere',
    labelByLocale: {
      'pt-br': 'Texto para Vigenere',
      en: 'Text to Vigenere',
      es: 'Texto a Vigenere',
    },
    searchTerms: ['vigenere', 'cifra', 'key'],
    reversible: true,
    reverseConversionId: 'vigenere-to-text',
    acceptsBatch: false,
    acceptsFile: false,
    needsKey: true,
    needsShift: false,
    isEducational: true,
    isHash: false,
    shouldGenerateStaticPage: false,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'vigenere-to-text',
    slug: 'vigenere-para-texto',
    category: 'classic-ciphers',
    from: 'vigenere',
    to: 'text',
    labelByLocale: {
      'pt-br': 'Vigenere para texto',
      en: 'Vigenere to text',
      es: 'Vigenere a texto',
    },
    searchTerms: ['vigenere', 'decode', 'key'],
    reversible: true,
    reverseConversionId: 'text-to-vigenere',
    acceptsBatch: false,
    acceptsFile: false,
    needsKey: true,
    needsShift: false,
    isEducational: true,
    isHash: false,
    shouldGenerateStaticPage: false,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'text-to-reverse',
    slug: 'texto-invertido',
    category: 'classic-ciphers',
    from: 'text',
    to: 'reverse',
    labelByLocale: {
      'pt-br': 'Texto invertido',
      en: 'Text reverse',
      es: 'Texto invertido',
    },
    searchTerms: ['reverse', 'invertido'],
    reversible: true,
    reverseConversionId: 'reverse-to-text',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: true,
    isHash: false,
    shouldGenerateStaticPage: false,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'reverse-to-text',
    slug: 'inverter-texto',
    category: 'classic-ciphers',
    from: 'reverse',
    to: 'text',
    labelByLocale: {
      'pt-br': 'Reverter texto invertido',
      en: 'Reverse text back',
      es: 'Revertir texto invertido',
    },
    searchTerms: ['reverse', 'invert'],
    reversible: true,
    reverseConversionId: 'text-to-reverse',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: true,
    isHash: false,
    shouldGenerateStaticPage: false,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'text-to-json-escaped',
    slug: 'texto-para-json-string',
    category: 'web-programming',
    from: 'text',
    to: 'json escaped',
    labelByLocale: {
      'pt-br': 'Texto para JSON string escapada',
      en: 'Text to escaped JSON string',
      es: 'Texto a JSON string escapada',
    },
    searchTerms: ['json', 'escape', 'string'],
    reversible: true,
    reverseConversionId: 'json-escaped-to-text',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: false,
    shouldGenerateStaticPage: false,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'json-escaped-to-text',
    slug: 'json-string-para-texto',
    category: 'web-programming',
    from: 'json escaped',
    to: 'text',
    labelByLocale: {
      'pt-br': 'JSON string escapada para texto',
      en: 'Escaped JSON string to text',
      es: 'JSON string escapada a texto',
    },
    searchTerms: ['json', 'unescape', 'string'],
    reversible: true,
    reverseConversionId: 'text-to-json-escaped',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: false,
    shouldGenerateStaticPage: false,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'text-to-html-entities',
    slug: 'texto-para-html-entities',
    category: 'web-programming',
    from: 'text',
    to: 'html entities',
    labelByLocale: {
      'pt-br': 'Texto para HTML entities',
      en: 'Text to HTML entities',
      es: 'Texto a HTML entities',
    },
    searchTerms: ['html', 'entities', 'escape'],
    reversible: true,
    reverseConversionId: 'html-entities-to-text',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: false,
    shouldGenerateStaticPage: true,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'html-entities-to-text',
    slug: 'html-entities-para-texto',
    category: 'web-programming',
    from: 'html entities',
    to: 'text',
    labelByLocale: {
      'pt-br': 'HTML entities para texto',
      en: 'HTML entities to text',
      es: 'HTML entities a texto',
    },
    searchTerms: ['html', 'entities', 'decode'],
    reversible: true,
    reverseConversionId: 'text-to-html-entities',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: false,
    shouldGenerateStaticPage: true,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'text-to-url-encode',
    slug: 'url-encode',
    category: 'web-programming',
    from: 'text',
    to: 'url encoded',
    labelByLocale: {
      'pt-br': 'Texto para URL encoded',
      en: 'Text to URL encoded',
      es: 'Texto a URL encoded',
    },
    searchTerms: ['url', 'encode', 'query'],
    reversible: true,
    reverseConversionId: 'url-encode-to-text',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: false,
    shouldGenerateStaticPage: true,
    shouldAppearInUniversalTool: true,
    existingDedicatedToolSlug: 'url-encoder-decoder',
  }),
  conversion({
    id: 'url-encode-to-text',
    slug: 'url-decode',
    category: 'web-programming',
    from: 'url encoded',
    to: 'text',
    labelByLocale: {
      'pt-br': 'URL encoded para texto',
      en: 'URL encoded to text',
      es: 'URL encoded a texto',
    },
    searchTerms: ['url', 'decode', 'query'],
    reversible: true,
    reverseConversionId: 'text-to-url-encode',
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: false,
    shouldGenerateStaticPage: true,
    shouldAppearInUniversalTool: true,
    existingDedicatedToolSlug: 'url-encoder-decoder',
  }),
  conversion({
    id: 'query-string-to-json',
    slug: 'query-string-para-objeto',
    category: 'web-programming',
    from: 'query string',
    to: 'json object',
    labelByLocale: {
      'pt-br': 'Query string para objeto',
      en: 'Query string to object',
      es: 'Query string a objeto',
    },
    searchTerms: ['query', 'json', 'objeto'],
    reversible: true,
    reverseConversionId: 'json-to-query-string',
    acceptsBatch: false,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: false,
    shouldGenerateStaticPage: false,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'json-to-query-string',
    slug: 'objeto-para-query-string',
    category: 'web-programming',
    from: 'json object',
    to: 'query string',
    labelByLocale: {
      'pt-br': 'Objeto para query string',
      en: 'Object to query string',
      es: 'Objeto a query string',
    },
    searchTerms: ['query', 'json', 'objeto'],
    reversible: true,
    reverseConversionId: 'query-string-to-json',
    acceptsBatch: false,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: false,
    shouldGenerateStaticPage: false,
    shouldAppearInUniversalTool: true,
  }),
  conversion({
    id: 'text-to-slug',
    slug: 'texto-para-slug',
    category: 'web-programming',
    from: 'text',
    to: 'slug',
    labelByLocale: {
      'pt-br': 'Texto para slug',
      en: 'Text to slug',
      es: 'Texto a slug',
    },
    searchTerms: ['slug', 'url'],
    reversible: false,
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: false,
    shouldGenerateStaticPage: false,
    shouldAppearInUniversalTool: true,
    existingDedicatedToolSlug: 'gerador-de-slug',
  }),
  conversion({
    id: 'text-remove-accents',
    slug: 'remover-acentos',
    category: 'web-programming',
    from: 'text',
    to: 'text no accents',
    labelByLocale: {
      'pt-br': 'Remover acentos do texto',
      en: 'Remove accents from text',
      es: 'Quitar acentos del texto',
    },
    searchTerms: ['acentos', 'normalizar'],
    reversible: false,
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: false,
    shouldGenerateStaticPage: false,
    shouldAppearInUniversalTool: true,
    existingDedicatedToolSlug: 'remover-acentos',
  }),
  conversion({
    id: 'text-remove-invisible',
    slug: 'remover-caracteres-invisiveis',
    category: 'web-programming',
    from: 'text',
    to: 'text no invisible',
    labelByLocale: {
      'pt-br': 'Remover caracteres invisiveis',
      en: 'Remove invisible characters',
      es: 'Quitar caracteres invisibles',
    },
    searchTerms: ['invisivel', 'unicode'],
    reversible: false,
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: false,
    shouldGenerateStaticPage: false,
    shouldAppearInUniversalTool: true,
    existingDedicatedToolSlug: 'invisible-character',
  }),
  conversion({
    id: 'text-show-invisible',
    slug: 'mostrar-caracteres-invisiveis',
    category: 'web-programming',
    from: 'text',
    to: 'visible markers',
    labelByLocale: {
      'pt-br': 'Mostrar caracteres invisiveis',
      en: 'Show invisible characters',
      es: 'Mostrar caracteres invisibles',
    },
    searchTerms: ['invisivel', 'unicode', 'detectar'],
    reversible: false,
    acceptsBatch: true,
    acceptsFile: false,
    needsKey: false,
    needsShift: false,
    isEducational: false,
    isHash: false,
    shouldGenerateStaticPage: false,
    shouldAppearInUniversalTool: true,
    existingDedicatedToolSlug: 'invisible-character',
  }),
];

const conversionById = new Map(universalConversions.map((item) => [item.id, item]));

export const getUniversalConversionById = (
  id: UniversalConversionId,
): UniversalConversionDefinition | undefined => conversionById.get(id);

export const universalPresets: UniversalPreset[] = [
  {
    id: 'all-hashes',
    labelByLocale: {
      'pt-br': 'Texto para todos os hashes',
      en: 'Text to all hashes',
      es: 'Texto a todos los hashes',
    },
    destinationIds: [
      'text-to-md5',
      'text-to-sha1',
      'text-to-sha256',
      'text-to-sha384',
      'text-to-sha512',
      'text-to-sha3-256',
      'text-to-sha3-512',
      'text-to-ripemd160',
      'text-to-crc32',
    ],
    warningByLocale: {
      'pt-br': 'Hashes nao sao reversiveis por design.',
      en: 'Hashes are not reversible by design.',
      es: 'Los hashes no son reversibles por diseno.',
    },
  },
  {
    id: 'all-encodings',
    labelByLocale: {
      'pt-br': 'Texto para todos os encodings',
      en: 'Text to all encodings',
      es: 'Texto a todos los encodings',
    },
    destinationIds: ['text-to-binary', 'text-to-hex', 'text-to-ascii-dec', 'text-to-octal-text', 'text-to-html-entities', 'text-to-url-encode'],
  },
  {
    id: 'all-bases',
    labelByLocale: {
      'pt-br': 'Numero para todas as bases',
      en: 'Number to all bases',
      es: 'Numero a todas las bases',
    },
    destinationIds: ['decimal-to-binary', 'decimal-to-hex', 'decimal-to-octal', 'decimal-to-base36'],
  },
  {
    id: 'all-classic-ciphers',
    labelByLocale: {
      'pt-br': 'Texto para cifras classicas',
      en: 'Text to classic ciphers',
      es: 'Texto a cifras clasicas',
    },
    destinationIds: ['text-to-morse', 'text-to-caesar', 'text-to-rot13', 'text-to-atbash', 'text-to-vigenere', 'text-to-reverse'],
    warningByLocale: {
      'pt-br': 'Cifras classicas sao educativas e nao substituem criptografia moderna.',
      en: 'Classic ciphers are educational and not modern encryption.',
      es: 'Las cifras clasicas son educativas y no reemplazan cifrado moderno.',
    },
  },
  {
    id: 'text-analysis-tech',
    labelByLocale: {
      'pt-br': 'Analisar texto tecnico',
      en: 'Analyze technical text',
      es: 'Analizar texto tecnico',
    },
    destinationIds: ['text-show-invisible', 'text-to-json-escaped', 'text-to-html-entities'],
  },
  {
    id: 'clean-for-url',
    labelByLocale: {
      'pt-br': 'Limpar texto para URL',
      en: 'Clean text for URL',
      es: 'Limpiar texto para URL',
    },
    destinationIds: ['text-remove-accents', 'text-remove-invisible', 'text-to-slug', 'text-to-url-encode'],
  },
  {
    id: 'prepare-for-code',
    labelByLocale: {
      'pt-br': 'Preparar texto para codigo',
      en: 'Prepare text for code',
      es: 'Preparar texto para codigo',
    },
    destinationIds: ['text-to-json-escaped', 'text-to-html-entities', 'text-to-hex'],
  },
  {
    id: 'caesar-all-shifts',
    labelByLocale: {
      'pt-br': 'Testar todos deslocamentos Cesar',
      en: 'Test all Caesar shifts',
      es: 'Probar todos los desplazamientos Cesar',
    },
    destinationIds: ['caesar-to-text'],
  },
];

const presetById = new Map(universalPresets.map((item) => [item.id, item]));

export const getUniversalPresetById = (id: UniversalPresetId): UniversalPreset | undefined =>
  presetById.get(id);

const unavailableHashResult = (algorithm: string): UniversalConversionResult => ({
  ok: false,
  output: '',
  error: `Algoritmo ${algorithm} indisponivel no navegador nesta build.`,
});

const successful = (output: string, warning?: string): UniversalConversionResult => ({
  ok: true,
  output,
  warning,
});

const failed = (error: string): UniversalConversionResult => ({
  ok: false,
  output: '',
  error,
});

type ConversionHandler = (
  input: string,
  options: UniversalConversionOptions,
) => Promise<UniversalConversionResult>;

const ensureInputAllowed = (
  conversionId: UniversalConversionId,
  input: string,
): UniversalConversionResult | undefined => {
  const allowsEmpty = conversionId === 'query-string-to-json' || conversionId === 'json-to-query-string';
  if (!allowsEmpty && !input) {
    return failed('Entrada vazia. Cole um valor para converter.');
  }

  return undefined;
};

const hashWithWarning = async (algorithm: string, input: string): Promise<UniversalConversionResult> => {
  const output = await hashBySubtle(algorithm, input);
  return output ? successful(output, 'Hash nao e reversivel.') : unavailableHashResult(algorithm);
};

const conversionHandlers: Record<UniversalConversionId, ConversionHandler> = {
  'text-to-binary': async (input) => successful(textToBinary(input)),
  'binary-to-text': async (input) => {
    const value = binaryToText(input);
    return value === undefined
      ? failed('Formato binario invalido. Use grupos de 0 e 1 separados por espaco.')
      : successful(value);
  },
  'text-to-hex': async (input) => successful(toHex(textToBytes(input))),
  'hex-to-text': async (input) => {
    const bytes = fromHex(input);
    return bytes ? successful(bytesToText(bytes)) : failed('Hexadecimal invalido.');
  },
  'text-to-ascii-dec': async (input) => successful(textToAsciiDecimal(input)),
  'ascii-dec-to-text': async (input) => {
    const parsed = asciiDecimalToText(input);
    return parsed === undefined ? failed('ASCII decimal invalido.') : successful(parsed);
  },
  'text-to-octal-text': async (input) => successful(textToOctalText(input)),
  'octal-text-to-text': async (input) => {
    const parsed = octalTextToText(input);
    return parsed === undefined ? failed('Octal invalido para texto.') : successful(parsed);
  },
  'decimal-to-binary': async (input) => {
    const n = parseNumeric(input, 10);
    return n === undefined ? failed('Decimal invalido.') : successful(toBase(n, 2));
  },
  'binary-to-decimal': async (input) => {
    const n = parseNumeric(input, 2);
    return n === undefined ? failed('Binario invalido.') : successful(String(n));
  },
  'decimal-to-hex': async (input) => {
    const n = parseNumeric(input, 10);
    return n === undefined ? failed('Decimal invalido.') : successful(toBase(n, 16));
  },
  'hex-to-decimal': async (input) => {
    const n = parseNumeric(input, 16);
    return n === undefined ? failed('Hexadecimal invalido.') : successful(String(n));
  },
  'decimal-to-octal': async (input) => {
    const n = parseNumeric(input, 10);
    return n === undefined ? failed('Decimal invalido.') : successful(toBase(n, 8));
  },
  'octal-to-decimal': async (input) => {
    const n = parseNumeric(input, 8);
    return n === undefined ? failed('Octal invalido.') : successful(String(n));
  },
  'binary-to-hex': async (input) => {
    const n = parseNumeric(input, 2);
    return n === undefined ? failed('Binario invalido.') : successful(toBase(n, 16));
  },
  'hex-to-binary': async (input) => {
    const n = parseNumeric(input, 16);
    return n === undefined ? failed('Hexadecimal invalido.') : successful(toBase(n, 2));
  },
  'octal-to-hex': async (input) => {
    const n = parseNumeric(input, 8);
    return n === undefined ? failed('Octal invalido.') : successful(toBase(n, 16));
  },
  'hex-to-octal': async (input) => {
    const n = parseNumeric(input, 16);
    return n === undefined ? failed('Hexadecimal invalido.') : successful(toBase(n, 8));
  },
  'decimal-to-base36': async (input) => {
    const n = parseNumeric(input, 10);
    return n === undefined ? failed('Decimal invalido.') : successful(toBase(n, 36));
  },
  'base36-to-decimal': async (input) => {
    const n = parseFlexibleBaseNumber(input, 36);
    return n === undefined ? failed('Base36 invalida.') : successful(String(n));
  },
  'text-to-md5': async (input) => successful(md5(input), 'Hash nao e reversivel.'),
  'text-to-sha1': async (input) => hashWithWarning('SHA-1', input),
  'text-to-sha224': async () => unavailableHashResult('SHA-224'),
  'text-to-sha256': async (input) => hashWithWarning('SHA-256', input),
  'text-to-sha384': async (input) => hashWithWarning('SHA-384', input),
  'text-to-sha512': async (input) => hashWithWarning('SHA-512', input),
  'text-to-sha3-256': async () => unavailableHashResult('SHA3-256'),
  'text-to-sha3-512': async () => unavailableHashResult('SHA3-512'),
  'text-to-ripemd160': async () => unavailableHashResult('RIPEMD-160'),
  'text-to-crc32': async (input) => successful(crc32(input), 'Checksum nao e reversivel.'),
  'text-to-morse': async (input) => successful(textToMorse(input), 'Cifra educativa, nao criptografia moderna.'),
  'morse-to-text': async (input) => {
    const parsed = morseToText(input);
    return parsed === undefined
      ? failed('Morse invalido. Use pontos, tracos e / para espacos.')
      : successful(parsed, 'Cifra educativa, nao criptografia moderna.');
  },
  'text-to-caesar': async (input, options) => {
    const shift = Number.isFinite(options.shift) ? Math.trunc(options.shift ?? 0) : 3;
    return successful(caesarEncode(input, shift), 'Cifra classica educativa.');
  },
  'caesar-to-text': async (input, options) => {
    const shift = Number.isFinite(options.shift) ? Math.trunc(options.shift ?? 0) : 3;
    return successful(caesarEncode(input, -shift), 'Use deslocamento correto para recuperar o texto.');
  },
  'text-to-rot13': async (input) => successful(caesarEncode(input, 13), 'ROT13 e cifra educativa.'),
  'rot13-to-text': async (input) => successful(caesarEncode(input, 13), 'ROT13 e reversivel aplicando novamente.'),
  'text-to-atbash': async (input) => successful(atbashTransform(input), 'Atbash e cifra educativa.'),
  'atbash-to-text': async (input) => successful(atbashTransform(input), 'Atbash e reversivel pela mesma operacao.'),
  'text-to-vigenere': async (input, options) => {
    const transformed = vigenereTransform(input, options.key ?? '', false);
    return transformed === undefined
      ? failed('Informe uma chave alfabetica para Vigenere.')
      : successful(transformed, 'Cifra classica educativa.');
  },
  'vigenere-to-text': async (input, options) => {
    const transformed = vigenereTransform(input, options.key ?? '', true);
    return transformed === undefined
      ? failed('Informe a mesma chave usada na codificacao.')
      : successful(transformed, 'Cifra classica educativa.');
  },
  'text-to-reverse': async (input) => successful(Array.from(input).reverse().join('')),
  'reverse-to-text': async (input) => successful(Array.from(input).reverse().join('')),
  'text-to-json-escaped': async (input) => successful(escapeJsonString(input)),
  'json-escaped-to-text': async (input) => {
    const parsed = unescapeJsonString(input);
    return parsed === undefined ? failed('String JSON escapada invalida.') : successful(parsed);
  },
  'text-to-html-entities': async (input) => successful(escapeHtmlEntities(input)),
  'html-entities-to-text': async (input) => successful(unescapeHtmlEntities(input)),
  'text-to-url-encode': async (input) =>
    successful(encodeURIComponent(input), 'Tambem existe a ferramenta dedicada URL Encoder/Decoder.'),
  'url-encode-to-text': async (input) => {
    try {
      return successful(
        decodeURIComponent(input),
        'Tambem existe a ferramenta dedicada URL Encoder/Decoder.',
      );
    } catch {
      return failed('URL encoded invalido para decodeURIComponent.');
    }
  },
  'query-string-to-json': async (input) => {
    const parsed = convertQueryStringToJson(input);
    return parsed === undefined ? failed('Query string invalida.') : successful(parsed);
  },
  'json-to-query-string': async (input) => {
    const parsed = convertJsonToQueryString(input);
    return parsed === undefined ? failed('JSON invalido para query string.') : successful(parsed);
  },
  'text-to-slug': async (input) => {
    const slug = buildSlug(input, {
      separator: '-',
      lowercase: true,
      removeStopWords: false,
      maxLength: 120,
      keepWordBoundaries: true,
      removePunctuation: true,
      removeEmojis: true,
    });
    return successful(slug, 'Tambem existe a ferramenta dedicada Gerador de Slug.');
  },
  'text-remove-accents': async (input) => {
    const result = removeAccentsText(input, {
      mode: 'keep-case',
      removeSymbols: false,
      removePunct: false,
      removeEmojis: false,
      collapseSpaces: false,
      spaceReplacement: 'none',
      toSlug: false,
    });
    return successful(result.value, 'Tambem existe a ferramenta dedicada Remover Acentos.');
  },
  'text-remove-invisible': async (input) =>
    successful(input ? removeInvisibleCharacters(input) : '', 'Tambem existe a ferramenta dedicada de caractere invisivel.'),
  'text-show-invisible': async (input) =>
    successful(input ? showInvisibleCharacters(input) : '', 'Analise visual para depuracao de caracteres ocultos.'),
};

export const convertById = async (
  conversionId: UniversalConversionId,
  input: string,
  options: UniversalConversionOptions = {},
): Promise<UniversalConversionResult> => {
  const emptyInputError = ensureInputAllowed(conversionId, input);
  if (emptyInputError) {
    return emptyInputError;
  }

  const handler = conversionHandlers[conversionId];
  if (!handler) {
    return failed('Conversao ainda nao implementada.');
  }

  return handler(input, options);
};

export const convertToMultipleDestinations = async (
  input: string,
  destinationIds: UniversalConversionId[],
  options: UniversalConversionOptions = {},
): Promise<Array<{ id: UniversalConversionId; result: UniversalConversionResult }>> => {
  const out: Array<{ id: UniversalConversionId; result: UniversalConversionResult }> = [];

  for (const id of destinationIds) {
    const result = await convertById(id, input, options);
    out.push({ id, result });
  }

  return out;
};

export const convertBatchLines = async (
  conversionId: UniversalConversionId,
  input: string,
  options: UniversalConversionOptions = {},
): Promise<Array<{ line: string; result: UniversalConversionResult }>> => {
  const lines = input.split(/\r?\n/);
  const out: Array<{ line: string; result: UniversalConversionResult }> = [];

  for (const line of lines) {
    out.push({
      line,
      result: await convertById(conversionId, line, options),
    });
  }

  return out;
};

export const runConversionPipeline = async (
  input: string,
  steps: UniversalConversionId[],
  options: UniversalConversionOptions = {},
): Promise<{
  ok: boolean;
  finalOutput: string;
  stepResults: Array<{ id: UniversalConversionId; input: string; output: string; error?: string }>;
}> => {
  const stepResults: Array<{ id: UniversalConversionId; input: string; output: string; error?: string }> = [];

  let current = input;

  for (const id of steps) {
    const result = await convertById(id, current, options);
    if (!result.ok) {
      stepResults.push({ id, input: current, output: '', error: result.error });
      return {
        ok: false,
        finalOutput: current,
        stepResults,
      };
    }

    stepResults.push({ id, input: current, output: result.output });
    current = result.output;
  }

  return {
    ok: true,
    finalOutput: current,
    stepResults,
  };
};

export type UniversalInputDetection = {
  type:
    | 'binary'
    | 'hex'
    | 'morse'
    | 'url-encoded'
    | 'html-entities'
    | 'md5-like'
    | 'sha1-like'
    | 'sha256-like'
    | 'ascii-decimal-list'
    | 'query-string'
    | 'json-escaped'
    | 'unknown';
  confidence: number;
  suggestedConversionIds: UniversalConversionId[];
};

export const detectInputType = (value: string): UniversalInputDetection => {
  const input = value.trim();
  if (!input) {
    return { type: 'unknown', confidence: 0, suggestedConversionIds: [] };
  }

  if (/^(?:[01]{8}\s+)*[01]{8}$/.test(input)) {
    return {
      type: 'binary',
      confidence: 0.95,
      suggestedConversionIds: ['binary-to-text', 'binary-to-decimal', 'binary-to-hex'],
    };
  }

  if (/^(?:0x)?[0-9a-fA-F]{2,}$/.test(input.replaceAll(/\s+/g, ''))) {
    return {
      type: 'hex',
      confidence: 0.88,
      suggestedConversionIds: ['hex-to-text', 'hex-to-decimal', 'hex-to-binary'],
    };
  }

  if (/^[.\-/\s]+$/.test(input) && input.includes('.')) {
    return {
      type: 'morse',
      confidence: 0.8,
      suggestedConversionIds: ['morse-to-text'],
    };
  }

  if (/%[0-9a-fA-F]{2}/.test(input)) {
    return {
      type: 'url-encoded',
      confidence: 0.75,
      suggestedConversionIds: ['url-encode-to-text'],
    };
  }

  if (/&(?:amp|lt|gt|quot|#39);/.test(input)) {
    return {
      type: 'html-entities',
      confidence: 0.78,
      suggestedConversionIds: ['html-entities-to-text'],
    };
  }

  if (/^[a-f0-9]{32}$/i.test(input)) {
    return {
      type: 'md5-like',
      confidence: 0.9,
      suggestedConversionIds: ['text-to-md5'],
    };
  }

  if (/^[a-f0-9]{40}$/i.test(input)) {
    return {
      type: 'sha1-like',
      confidence: 0.9,
      suggestedConversionIds: ['text-to-sha1'],
    };
  }

  if (/^[a-f0-9]{64}$/i.test(input)) {
    return {
      type: 'sha256-like',
      confidence: 0.9,
      suggestedConversionIds: ['text-to-sha256'],
    };
  }

  if (/^\d+(\s+\d+)+$/.test(input)) {
    return {
      type: 'ascii-decimal-list',
      confidence: 0.72,
      suggestedConversionIds: ['ascii-dec-to-text'],
    };
  }

  if (input.includes('=') && input.includes('&')) {
    return {
      type: 'query-string',
      confidence: 0.8,
      suggestedConversionIds: ['query-string-to-json'],
    };
  }

  if (/\\n|\\t|\\u[0-9a-fA-F]{4}/.test(input)) {
    return {
      type: 'json-escaped',
      confidence: 0.7,
      suggestedConversionIds: ['json-escaped-to-text'],
    };
  }

  return {
    type: 'unknown',
    confidence: 0.2,
    suggestedConversionIds: ['text-to-binary', 'text-to-hex', 'text-to-sha256'],
  };
};

export const categoryLabelByLocale: Record<
  UniversalConversionCategory,
  Record<AppLocale, string>
> = {
  'text-encoding': {
    'pt-br': 'Texto e Encoding',
    en: 'Text and Encoding',
    es: 'Texto y Encoding',
  },
  'hash-checksum': {
    'pt-br': 'Hashes e checksums',
    en: 'Hashes and checksums',
    es: 'Hashes y checksums',
  },
  'numeric-bases': {
    'pt-br': 'Bases numericas',
    en: 'Numeric bases',
    es: 'Bases numericas',
  },
  'classic-ciphers': {
    'pt-br': 'Cifras classicas',
    en: 'Classic ciphers',
    es: 'Cifras clasicas',
  },
  'web-programming': {
    'pt-br': 'Web e programacao',
    en: 'Web and programming',
    es: 'Web y programacion',
  },
};

export const filterUniversalConversions = (
  query: string,
  category: UniversalConversionCategory | 'all',
): UniversalConversionDefinition[] => {
  const normalized = query.trim().toLowerCase();

  return universalConversions.filter((item) => {
    if (!item.shouldAppearInUniversalTool) {
      return false;
    }

    if (category !== 'all' && item.category !== category) {
      return false;
    }

    if (!normalized) {
      return true;
    }

    const haystack = [
      item.slug,
      item.from,
      item.to,
      ...item.searchTerms,
      ...Object.values(item.labelByLocale),
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalized);
  });
};

export const exportResultsAsTxt = (
  items: Array<{ title: string; output: string }>,
): string =>
  items
    .map((item) => `${item.title}\n${item.output}`)
    .join('\n\n');

export const exportResultsAsJson = (
  input: string,
  items: Array<{ id: UniversalConversionId; title: string; output: string; ok: boolean; error?: string }>,
): string =>
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      input,
      results: items,
    },
    null,
    2,
  );

export const exportBatchAsCsv = (
  rows: Array<{ line: string; output: string; ok: boolean; error?: string }>,
): string => {
  const lines = ['line,input,output,status,error'];

  rows.forEach((row, index) => {
    const sanitize = (value: string) => `"${value.replaceAll('"', '""')}"`;
    lines.push(
      [
        String(index + 1),
        sanitize(row.line),
        sanitize(row.output),
        row.ok ? 'ok' : 'error',
        sanitize(row.error ?? ''),
      ].join(','),
    );
  });

  return lines.join('\n');
};

export const normalizeConversionDefaults = (
  fromId?: UniversalConversionId,
  toId?: UniversalConversionId,
): { fromId: UniversalConversionId; toId: UniversalConversionId } => {
  const fallbackFrom: UniversalConversionId = 'text-to-binary';
  const fallbackTo: UniversalConversionId = 'binary-to-text';

  const safeFrom = fromId && conversionById.has(fromId) ? fromId : fallbackFrom;
  const safeTo = toId && conversionById.has(toId) ? toId : fallbackTo;

  return {
    fromId: safeFrom,
    toId: safeTo,
  };
};

export const getAllCaesarShiftAttempts = async (
  input: string,
): Promise<Array<{ shift: number; output: string }>> => {
  const out: Array<{ shift: number; output: string }> = [];

  for (let shift = 1; shift <= 25; shift += 1) {
    const result = await convertById('caesar-to-text', input, { shift });
    if (result.ok) {
      out.push({ shift, output: result.output });
    }
  }

  return out;
};

export const convertBetweenCustomBases = (
  value: string,
  fromBase: number,
  toBase: number,
): UniversalConversionResult => {
  const output = convertBaseCustom(value, fromBase, toBase);
  return output === undefined
    ? failed('Conversao de base personalizada invalida. Use bases entre 2 e 36.')
    : successful(output);
};
