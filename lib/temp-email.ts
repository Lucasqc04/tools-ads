import crypto from 'node:crypto';
import sanitizeHtml from 'sanitize-html';
import { tempEmailStore } from '@/lib/temp-email-store';
import type {
  TempEmailInboxPayload,
  TempEmailMessage,
  TempEmailMessagesPayload,
  TempEmailMeta,
} from '@/types/temp-email';

const DEFAULT_TEMP_EMAIL_TTL_SECONDS = 3600;
const MIN_TEMP_EMAIL_TTL_SECONDS = 300;
const MAX_TEMP_EMAIL_TTL_SECONDS = 86_400;

export const MAX_TEMP_EMAIL_MESSAGES = 50;
export const MAX_TEMP_EMAIL_TEXT_CHARS = 50_000;
export const MAX_TEMP_EMAIL_HTML_CHARS = 100_000;

const MAX_MAIL_HEADER_CHARS = 320;
const MAX_SUBJECT_CHARS = 300;

const CREATE_RATE_LIMIT_WINDOW_SECONDS = 60;
const CREATE_RATE_LIMIT_MAX_REQUESTS = 12;

const TEMP_EMAIL_KEY_PREFIX = 'tempemail';

const TEMP_EMAIL_DOMAIN_REGEX =
  /^(?=.{3,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)(\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const clampNumber = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const trimAndClamp = (value: string, maxChars: number): string =>
  value.trim().slice(0, maxChars);

const normalizeAddress = (value: string): string => trimAndClamp(value, MAX_MAIL_HEADER_CHARS).toLowerCase();

const normalizeToken = (value: string): string => value.trim().toLowerCase();

const toIsoString = (value: unknown): string => {
  const asString = typeof value === 'string' ? value : '';
  const ms = Date.parse(asString);

  if (!Number.isFinite(ms)) {
    return new Date().toISOString();
  }

  return new Date(ms).toISOString();
};

const parseTtlSeconds = (): number => {
  const raw = process.env.TEMP_EMAIL_TTL_SECONDS;

  if (!raw) {
    return DEFAULT_TEMP_EMAIL_TTL_SECONDS;
  }

  const parsed = Number(raw);

  if (!Number.isFinite(parsed)) {
    return DEFAULT_TEMP_EMAIL_TTL_SECONDS;
  }

  return clampNumber(
    Math.floor(parsed),
    MIN_TEMP_EMAIL_TTL_SECONDS,
    MAX_TEMP_EMAIL_TTL_SECONDS,
  );
};

const getTempEmailDomain = (): string | null => {
  const rawDomain = process.env.TEMP_EMAIL_DOMAIN?.trim().toLowerCase() ?? '';

  if (!rawDomain || !TEMP_EMAIL_DOMAIN_REGEX.test(rawDomain)) {
    return null;
  }

  return rawDomain;
};

const buildInboxKey = (address: string): string =>
  `${TEMP_EMAIL_KEY_PREFIX}:inbox:${normalizeAddress(address)}`;

const buildMessagesKey = (token: string): string =>
  `${TEMP_EMAIL_KEY_PREFIX}:messages:${normalizeToken(token)}`;

const buildMetaKey = (token: string): string =>
  `${TEMP_EMAIL_KEY_PREFIX}:meta:${normalizeToken(token)}`;

const buildCreateRateLimitKey = (ipAddress: string): string => {
  const hash = crypto
    .createHash('sha256')
    .update(ipAddress)
    .digest('hex')
    .slice(0, 24);

  return `${TEMP_EMAIL_KEY_PREFIX}:ratelimit:create:${hash}`;
};

const isMeta = (value: unknown): value is TempEmailMeta => {
  if (!isPlainObject(value)) {
    return false;
  }

  return typeof value.address === 'string' && typeof value.expiresAt === 'string';
};

const isMessage = (value: unknown): value is TempEmailMessage => {
  if (!isPlainObject(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    typeof value.from === 'string' &&
    typeof value.to === 'string' &&
    typeof value.subject === 'string' &&
    typeof value.receivedAt === 'string'
  );
};

export const isValidTempEmailToken = (token: string): boolean =>
  /^[a-f0-9]{64}$/.test(normalizeToken(token));

export const sanitizeEmailHtml = (unsafeHtml: string | undefined): string | undefined => {
  if (typeof unsafeHtml !== 'string') {
    return undefined;
  }

  const clamped = unsafeHtml.slice(0, MAX_TEMP_EMAIL_HTML_CHARS).trim();

  if (!clamped) {
    return undefined;
  }

  const sanitized = sanitizeHtml(clamped, {
    allowedTags: [
      'p',
      'br',
      'div',
      'span',
      'strong',
      'b',
      'em',
      'i',
      'u',
      'small',
      'blockquote',
      'ul',
      'ol',
      'li',
      'a',
      'pre',
      'code',
      'hr',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
    ],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      '*': ['aria-label'],
    },
    disallowedTagsMode: 'discard',
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: {
      a: ['http', 'https', 'mailto'],
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', {
        target: '_blank',
        rel: 'noopener noreferrer nofollow',
      }),
    },
    nonTextTags: ['script', 'style', 'textarea', 'option', 'noscript'],
  });

  const clean = sanitized.trim();
  return clean || undefined;
};

const normalizeInboundMessage = (
  inboundMessage: TempEmailMessage,
  normalizedRecipient: string,
): TempEmailMessage => {
  const text =
    typeof inboundMessage.text === 'string'
      ? trimAndClamp(inboundMessage.text, MAX_TEMP_EMAIL_TEXT_CHARS)
      : undefined;
  const html = sanitizeEmailHtml(inboundMessage.html);

  const safeFrom =
    typeof inboundMessage.from === 'string'
      ? trimAndClamp(inboundMessage.from, MAX_MAIL_HEADER_CHARS)
      : '';

  const safeSubject =
    typeof inboundMessage.subject === 'string'
      ? trimAndClamp(inboundMessage.subject, MAX_SUBJECT_CHARS)
      : '';

  return {
    id:
      typeof inboundMessage.id === 'string' && inboundMessage.id.trim()
        ? trimAndClamp(inboundMessage.id, 128)
        : crypto.randomUUID(),
    from: safeFrom || 'unknown@unknown',
    to: normalizedRecipient,
    subject: safeSubject || '(sem assunto)',
    text: text || undefined,
    html,
    receivedAt: toIsoString(inboundMessage.receivedAt),
  };
};

const sortMessagesDesc = (messages: TempEmailMessage[]): TempEmailMessage[] =>
  [...messages].sort(
    (a, b) => Date.parse(b.receivedAt) - Date.parse(a.receivedAt),
  );

const normalizeStoredMessages = (value: unknown): TempEmailMessage[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(isMessage)
    .map((item) => normalizeInboundMessage(item, normalizeAddress(item.to)));
};

const clearByTokenAndAddress = async (
  token: string,
  address: string | null,
): Promise<void> => {
  const operations: Promise<void>[] = [
    tempEmailStore.del(buildMessagesKey(token)),
    tempEmailStore.del(buildMetaKey(token)),
  ];

  if (address) {
    operations.push(tempEmailStore.del(buildInboxKey(address)));
  }

  await Promise.all(operations);
};

export const createTempInbox = async (): Promise<TempEmailInboxPayload> => {
  const domain = getTempEmailDomain();

  if (!domain) {
    throw new Error('TEMP_EMAIL_DOMAIN nao configurado corretamente.');
  }

  const ttlSeconds = parseTtlSeconds();

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const username = crypto.randomBytes(5).toString('hex');
    const token = crypto.randomBytes(32).toString('hex');
    const address = normalizeAddress(`${username}@${domain}`);

    const existing = await tempEmailStore.get<string>(buildInboxKey(address));

    if (typeof existing === 'string' && existing.trim()) {
      continue;
    }

    const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
    const meta: TempEmailMeta = { address, expiresAt };

    await Promise.all([
      tempEmailStore.set(buildInboxKey(address), token, ttlSeconds),
      tempEmailStore.set(buildMessagesKey(token), [], ttlSeconds),
      tempEmailStore.set(buildMetaKey(token), meta, ttlSeconds),
    ]);

    return {
      address,
      token,
      expiresAt,
      ttlSeconds,
    };
  }

  throw new Error('Nao foi possivel gerar e-mail temporario agora.');
};

export const getTempInboxMessages = async (
  token: string,
): Promise<TempEmailMessagesPayload | { expired: true; messages: [] }> => {
  const normalizedToken = normalizeToken(token);

  if (!isValidTempEmailToken(normalizedToken)) {
    return {
      expired: true,
      messages: [],
    };
  }

  const rawMeta = await tempEmailStore.get<TempEmailMeta>(buildMetaKey(normalizedToken));

  if (!isMeta(rawMeta)) {
    return {
      expired: true,
      messages: [],
    };
  }

  const meta = {
    address: normalizeAddress(rawMeta.address),
    expiresAt: toIsoString(rawMeta.expiresAt),
  };

  const expiresAtMs = Date.parse(meta.expiresAt);

  if (!Number.isFinite(expiresAtMs) || expiresAtMs <= Date.now()) {
    await clearByTokenAndAddress(normalizedToken, meta.address);

    return {
      expired: true,
      messages: [],
    };
  }

  const rawMessages = await tempEmailStore.get<TempEmailMessage[]>(
    buildMessagesKey(normalizedToken),
  );

  const messages = sortMessagesDesc(normalizeStoredMessages(rawMessages)).slice(
    0,
    MAX_TEMP_EMAIL_MESSAGES,
  );

  return {
    address: meta.address,
    expiresAt: meta.expiresAt,
    messages,
  };
};

export const deleteTempInbox = async (token: string): Promise<void> => {
  const normalizedToken = normalizeToken(token);

  if (!isValidTempEmailToken(normalizedToken)) {
    return;
  }

  const rawMeta = await tempEmailStore.get<TempEmailMeta>(buildMetaKey(normalizedToken));
  const address = isMeta(rawMeta) ? normalizeAddress(rawMeta.address) : null;

  await clearByTokenAndAddress(normalizedToken, address);
};

export const saveInboundMessage = async (
  recipient: string,
  inboundMessage: TempEmailMessage,
): Promise<boolean> => {
  const normalizedRecipient = normalizeAddress(recipient);

  if (!normalizedRecipient || !normalizedRecipient.includes('@')) {
    return false;
  }

  const mappedToken = await tempEmailStore.get<string>(buildInboxKey(normalizedRecipient));

  if (typeof mappedToken !== 'string') {
    return false;
  }

  const normalizedToken = normalizeToken(mappedToken);

  if (!isValidTempEmailToken(normalizedToken)) {
    await tempEmailStore.del(buildInboxKey(normalizedRecipient));
    return false;
  }

  const rawMeta = await tempEmailStore.get<TempEmailMeta>(buildMetaKey(normalizedToken));

  if (!isMeta(rawMeta)) {
    await clearByTokenAndAddress(normalizedToken, normalizedRecipient);
    return false;
  }

  const expiresAtMs = Date.parse(rawMeta.expiresAt);

  if (!Number.isFinite(expiresAtMs) || expiresAtMs <= Date.now()) {
    await clearByTokenAndAddress(normalizedToken, normalizeAddress(rawMeta.address));
    return false;
  }

  const ttlSeconds = Math.max(1, Math.ceil((expiresAtMs - Date.now()) / 1000));
  const normalizedMessage = normalizeInboundMessage(inboundMessage, normalizedRecipient);

  const rawMessages = await tempEmailStore.get<TempEmailMessage[]>(
    buildMessagesKey(normalizedToken),
  );

  const existingMessages = normalizeStoredMessages(rawMessages).filter(
    (message) => Date.parse(message.receivedAt) > Date.now() - MAX_TEMP_EMAIL_TTL_SECONDS * 1000,
  );

  const nextMessages = [normalizedMessage, ...existingMessages].slice(
    0,
    MAX_TEMP_EMAIL_MESSAGES,
  );

  const meta: TempEmailMeta = {
    address: normalizeAddress(rawMeta.address),
    expiresAt: new Date(expiresAtMs).toISOString(),
  };

  await Promise.all([
    tempEmailStore.set(buildMessagesKey(normalizedToken), nextMessages, ttlSeconds),
    tempEmailStore.set(buildMetaKey(normalizedToken), meta, ttlSeconds),
    tempEmailStore.set(buildInboxKey(meta.address), normalizedToken, ttlSeconds),
  ]);

  return true;
};

export const verifyMailgunSignature = ({
  timestamp,
  token,
  signature,
  signingKey,
}: {
  timestamp: string;
  token: string;
  signature: string;
  signingKey: string;
}): boolean => {
  if (!timestamp || !token || !signature || !signingKey) {
    return false;
  }

  const digest = crypto
    .createHmac('sha256', signingKey)
    .update(timestamp + token)
    .digest('hex');

  const expectedBuffer = Buffer.from(digest, 'utf8');
  const signatureBuffer = Buffer.from(signature, 'utf8');

  if (expectedBuffer.length !== signatureBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
};

export const getClientIpFromHeaders = (headers: Headers): string => {
  const forwardedFor = headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const realIp = headers.get('x-real-ip')?.trim();
  const connectingIp = headers.get('cf-connecting-ip')?.trim();

  const candidate = connectingIp || forwardedFor || realIp || 'unknown';

  if (!candidate || candidate.length > 120) {
    return 'unknown';
  }

  const safeCandidate = candidate.replace(/[^a-fA-F0-9:.]/g, '');

  return safeCandidate || 'unknown';
};

export const checkCreateInboxRateLimit = async (
  ipAddress: string,
): Promise<{ allowed: boolean; retryAfterSeconds: number }> => {
  const key = buildCreateRateLimitKey(ipAddress || 'unknown');

  const rawCurrent = await tempEmailStore.get<number | string>(key);
  const currentValue = Number(rawCurrent ?? 0);
  const safeCurrent = Number.isFinite(currentValue) ? Math.max(0, Math.floor(currentValue)) : 0;

  if (safeCurrent >= CREATE_RATE_LIMIT_MAX_REQUESTS) {
    const ttlSeconds = await tempEmailStore.ttl(key);

    return {
      allowed: false,
      retryAfterSeconds: ttlSeconds > 0 ? ttlSeconds : CREATE_RATE_LIMIT_WINDOW_SECONDS,
    };
  }

  await tempEmailStore.set(key, safeCurrent + 1, CREATE_RATE_LIMIT_WINDOW_SECONDS);

  return {
    allowed: true,
    retryAfterSeconds: 0,
  };
};

export const extractMailgunRecipient = (value: string): string => {
  const firstRecipient = value.split(',')[0]?.trim() ?? '';

  if (!firstRecipient) {
    return '';
  }

  const bracketMatch = firstRecipient.match(/<([^>]+)>/);
  const address = bracketMatch?.[1] ?? firstRecipient;

  return normalizeAddress(address);
};
