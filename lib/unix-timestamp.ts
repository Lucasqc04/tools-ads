export type TimestampParseResult = {
  ok: boolean;
  error?: string;
  ms?: number;
  seconds?: number;
  isoUtc?: string;
  localDateTime?: string;
  timezone?: string;
  relative?: string;
  isFuture?: boolean;
};

const formatRelative = (diffMs: number): string => {
  const absSeconds = Math.round(Math.abs(diffMs) / 1000);

  if (absSeconds < 60) {
    return diffMs < 0 ? `há ${absSeconds}s` : `daqui ${absSeconds}s`;
  }

  const absMinutes = Math.round(absSeconds / 60);
  if (absMinutes < 60) {
    return diffMs < 0 ? `há ${absMinutes} min` : `daqui ${absMinutes} min`;
  }

  const absHours = Math.round(absMinutes / 60);
  if (absHours < 48) {
    return diffMs < 0 ? `há ${absHours} h` : `daqui ${absHours} h`;
  }

  const absDays = Math.round(absHours / 24);
  return diffMs < 0 ? `há ${absDays} dias` : `daqui ${absDays} dias`;
};

const parseRawAsMs = (valueRaw: string): number | undefined => {
  const value = valueRaw.trim();
  if (!value) {
    return undefined;
  }

  if (/^-?\d+$/.test(value)) {
    const numeric = Number(value);

    if (!Number.isFinite(numeric)) {
      return undefined;
    }

    const abs = Math.abs(numeric);

    if (abs >= 1e12) {
      return numeric;
    }

    return numeric * 1000;
  }

  const parsedDate = Date.parse(value);
  if (Number.isNaN(parsedDate)) {
    return undefined;
  }

  return parsedDate;
};

export const parseTimestampInput = (valueRaw: string): TimestampParseResult => {
  const ms = parseRawAsMs(valueRaw);

  if (ms === undefined) {
    return {
      ok: false,
      error: 'Valor inválido. Informe um timestamp (s/ms) ou uma data reconhecível.',
    };
  }

  const date = new Date(ms);

  if (Number.isNaN(date.getTime())) {
    return {
      ok: false,
      error: 'Data inválida. Revise o valor informado.',
    };
  }

  const now = Date.now();
  const diff = ms - now;

  return {
    ok: true,
    ms,
    seconds: Math.floor(ms / 1000),
    isoUtc: date.toISOString(),
    localDateTime: date.toLocaleString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    relative: formatRelative(diff),
    isFuture: diff > 0,
  };
};

export const toUnixFromDateTime = (datePart: string, timePart: string): TimestampParseResult => {
  if (!datePart) {
    return {
      ok: false,
      error: 'Selecione uma data para converter.',
    };
  }

  const base = timePart ? `${datePart}T${timePart}` : `${datePart}T00:00`;
  const date = new Date(base);

  if (Number.isNaN(date.getTime())) {
    return {
      ok: false,
      error: 'Data/hora inválida para conversão.',
    };
  }

  return parseTimestampInput(String(date.getTime()));
};

export const getNowTimestamp = (): TimestampParseResult => parseTimestampInput(String(Date.now()));
