export type MessageTarget =
  | { kind: 'phone'; value: string }
  | { kind: 'username'; value: string };

export type GeneratedMessageLinks = {
  target: MessageTarget | null;
  whatsappLink: string | null;
  telegramLink: string | null;
  errors: string[];
};

const normalizePhone = (value: string): string => value.replaceAll(/\D+/g, '');

const normalizeUsername = (value: string): string =>
  value
    .trim()
    .replace(/^@+/, '')
    .replaceAll(/\s+/g, '');

export const detectMessageTarget = (rawValue: string): MessageTarget | null => {
  const cleaned = rawValue.trim();

  if (!cleaned) {
    return null;
  }

  const phone = normalizePhone(cleaned);
  if (phone.length >= 8) {
    return { kind: 'phone', value: phone };
  }

  const username = normalizeUsername(cleaned);
  if (username.length >= 3) {
    return { kind: 'username', value: username };
  }

  return null;
};

const appendTextParam = (baseUrl: string, message: string): string => {
  const normalizedMessage = message.trim();
  if (!normalizedMessage) {
    return baseUrl;
  }

  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}text=${encodeURIComponent(normalizedMessage)}`;
};

export const buildWhatsAppLink = (phone: string, message: string): string => {
  const sanitizedPhone = normalizePhone(phone);
  const baseUrl = `https://wa.me/${sanitizedPhone}`;

  return appendTextParam(baseUrl, message);
};

export const buildTelegramLink = (target: MessageTarget, message: string): string => {
  const routeTarget = target.kind === 'phone' ? `+${target.value}` : target.value;
  const baseUrl = `https://t.me/${routeTarget}`;

  return appendTextParam(baseUrl, message);
};

export const generateMessageLinks = (
  rawTarget: string,
  rawMessage: string,
): GeneratedMessageLinks => {
  const target = detectMessageTarget(rawTarget);

  if (!target) {
    return {
      target: null,
      whatsappLink: null,
      telegramLink: null,
      errors: ['invalid-target'],
    };
  }

  const telegramLink = buildTelegramLink(target, rawMessage);

  if (target.kind === 'username') {
    return {
      target,
      whatsappLink: null,
      telegramLink,
      errors: ['whatsapp-requires-phone'],
    };
  }

  return {
    target,
    whatsappLink: buildWhatsAppLink(target.value, rawMessage),
    telegramLink,
    errors: [],
  };
};
