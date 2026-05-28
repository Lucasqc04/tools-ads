export type JwtDecodedResult = {
  token: string;
  parts: {
    headerPart: string;
    payloadPart: string;
    signaturePart: string;
  };
  headerJsonText: string;
  payloadJsonText: string;
  headerObject?: Record<string, unknown>;
  payloadObject?: Record<string, unknown>;
  warnings: string[];
  errors: string[];
  commonClaims: Array<{
    key: string;
    value: unknown;
    formattedValue: string;
  }>;
  expiration?: {
    exp: number;
    isoUtc: string;
    localText: string;
    expired: boolean;
    secondsDiff: number;
  };
};

const base64UrlToBase64 = (value: string): string => {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/');
  const padding = normalized.length % 4;

  if (padding === 2) {
    return `${normalized}==`;
  }
  if (padding === 3) {
    return `${normalized}=`;
  }

  return normalized;
};

const decodeBase64UrlText = (value: string): string => {
  const base64 = base64UrlToBase64(value);

  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.codePointAt(0) ?? 0);

  return new TextDecoder().decode(bytes);
};

const stringifyJson = (value: unknown): string => JSON.stringify(value, null, 2);

const formatDate = (timestampInSeconds: number): { isoUtc: string; localText: string } => {
  const date = new Date(timestampInSeconds * 1000);

  return {
    isoUtc: date.toISOString(),
    localText: date.toLocaleString(),
  };
};

const formatClaimValue = (key: string, value: unknown): string => {
  if (typeof value === 'number' && (key === 'exp' || key === 'iat' || key === 'nbf')) {
    const dateInfo = formatDate(value);
    return `${value} (${dateInfo.localText} / ${dateInfo.isoUtc})`;
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return stringifyJson(value);
};

const commonClaimKeys = ['exp', 'iat', 'nbf', 'iss', 'aud', 'sub', 'role'];

const toRecordIfObject = (value: unknown): Record<string, unknown> | undefined => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return undefined;
  }

  return value as Record<string, unknown>;
};

const decodeJsonPart = (
  part: string,
  invalidObjectError: string,
  decodeError: string,
): {
  jsonText: string;
  object?: Record<string, unknown>;
  error?: string;
} => {
  try {
    const decoded = decodeBase64UrlText(part);
    const parsed = JSON.parse(decoded);
    const record = toRecordIfObject(parsed);

    if (record) {
      return {
        jsonText: stringifyJson(record),
        object: record,
      };
    }

    return {
      jsonText: '',
      error: invalidObjectError,
    };
  } catch {
    return {
      jsonText: '',
      error: decodeError,
    };
  }
};

const buildCommonClaims = (
  payloadObject?: Record<string, unknown>,
): Array<{ key: string; value: unknown; formattedValue: string }> => {
  if (!payloadObject) {
    return [];
  }

  return commonClaimKeys
    .filter((key) => payloadObject[key] !== undefined)
    .map((key) => {
      const value = payloadObject[key];

      return {
        key,
        value,
        formattedValue: formatClaimValue(key, value),
      };
    });
};

const buildExpiration = (
  payloadObject?: Record<string, unknown>,
): JwtDecodedResult['expiration'] => {
  const expValue = payloadObject?.exp;
  if (typeof expValue !== 'number' || !Number.isFinite(expValue)) {
    return undefined;
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  const secondsDiff = expValue - nowInSeconds;
  const dateInfo = formatDate(expValue);

  return {
    exp: expValue,
    isoUtc: dateInfo.isoUtc,
    localText: dateInfo.localText,
    expired: secondsDiff <= 0,
    secondsDiff,
  };
};

export const decodeJwtToken = (tokenRaw: string): JwtDecodedResult => {
  const token = tokenRaw.trim();
  const parts = token.split('.');
  const errors: string[] = [];
  const warnings: string[] = [];

  let headerJsonText = '';
  let payloadJsonText = '';
  let headerObject: Record<string, unknown> | undefined;
  let payloadObject: Record<string, unknown> | undefined;

  if (!token) {
    errors.push('Informe um token JWT para continuar.');
  }

  if (parts.length !== 3) {
    errors.push('JWT malformado: o token precisa ter 3 partes separadas por ponto.');
  }

  const [headerPart = '', payloadPart = '', signaturePart = ''] = parts;

  if (errors.length === 0) {
    const headerResult = decodeJsonPart(
      headerPart,
      'Header decodificado, mas nao e um objeto JSON valido.',
      'Nao foi possivel decodificar o header do JWT.',
    );
    headerJsonText = headerResult.jsonText;
    headerObject = headerResult.object;
    if (headerResult.error) {
      errors.push(headerResult.error);
    }

    const payloadResult = decodeJsonPart(
      payloadPart,
      'Payload decodificado, mas nao e um objeto JSON valido.',
      'Nao foi possivel decodificar o payload do JWT.',
    );
    payloadJsonText = payloadResult.jsonText;
    payloadObject = payloadResult.object;
    if (payloadResult.error) {
      errors.push(payloadResult.error);
    }
  }

  if (signaturePart.length === 0) {
    warnings.push('A parte de assinatura esta vazia. Isso pode indicar token incompleto.');
  }

  const commonClaims = buildCommonClaims(payloadObject);
  const expiration = buildExpiration(payloadObject);

  if (errors.length === 0) {
    warnings.push('Este resultado apenas decodifica o JWT e NAO valida assinatura, emissor ou confiabilidade.');
  }

  return {
    token,
    parts: {
      headerPart,
      payloadPart,
      signaturePart,
    },
    headerJsonText,
    payloadJsonText,
    headerObject,
    payloadObject,
    warnings,
    errors,
    commonClaims,
    expiration,
  };
};
