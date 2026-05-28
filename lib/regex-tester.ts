export type RegexMatchDetail = {
  value: string;
  indexStart: number;
  indexEnd: number;
  groups: string[];
};

export type RegexTestResult = {
  ok: boolean;
  error?: string;
  regexPreview: string;
  totalMatches: number;
  matches: RegexMatchDetail[];
  highlightedText: string;
  replacedText: string;
};

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

const toSafeRegexFlags = (flags: string): string => {
  const unique = Array.from(new Set(flags.split('')));
  const allowedOrder = ['g', 'i', 'm', 's', 'u', 'y'];

  return allowedOrder.filter((flag) => unique.includes(flag)).join('');
};

const buildHighlightHtml = (text: string, matches: RegexMatchDetail[]): string => {
  if (matches.length === 0) {
    return escapeHtml(text);
  }

  let cursor = 0;
  const chunks: string[] = [];

  matches.forEach((match, idx) => {
    const before = text.slice(cursor, match.indexStart);
    const content = text.slice(match.indexStart, match.indexEnd);

    chunks.push(escapeHtml(before));
    chunks.push(`<mark data-match="${idx + 1}" class="rounded bg-amber-200 px-0.5">${escapeHtml(content)}</mark>`);

    cursor = match.indexEnd;
  });

  chunks.push(escapeHtml(text.slice(cursor)));
  return chunks.join('');
};

export const explainRegexPattern = (pattern: string): string[] => {
  const tips: string[] = [];

  if (pattern.includes('\\d')) tips.push('\\d corresponde a digitos (0-9).');
  if (pattern.includes('\\w')) tips.push('\\w corresponde a letras, numeros e underscore.');
  if (pattern.includes('\\s')) tips.push('\\s corresponde a espacos e quebras de linha.');
  if (pattern.includes('.*')) tips.push('.* tenta capturar qualquer sequencia de caracteres.');
  if (pattern.includes('^')) tips.push('^ ancora o inicio do texto ou linha (com flag m).');
  if (pattern.includes('$')) tips.push('$ ancora o final do texto ou linha (com flag m).');
  if (pattern.includes('(') && pattern.includes(')')) tips.push('Parenteses criam grupos de captura.');
  if (pattern.includes('[') && pattern.includes(']')) tips.push('Colchetes definem conjuntos de caracteres.');
  if (pattern.includes('+')) tips.push('+ exige uma ou mais ocorrencias do item anterior.');
  if (pattern.includes('*')) tips.push('* aceita zero ou mais ocorrencias do item anterior.');
  if (pattern.includes('?')) tips.push('? torna um item opcional ou nao guloso.');

  if (tips.length === 0) {
    tips.push('Regex valida. Edite o padrao para ver explicacoes de partes conhecidas.');
  }

  return tips;
};

export const testRegex = (
  pattern: string,
  flagsRaw: string,
  text: string,
  replacement: string,
): RegexTestResult => {
  const flags = toSafeRegexFlags(flagsRaw || 'g');
  let regex: RegExp;

  try {
    regex = new RegExp(pattern, flags);
  } catch {
    return {
      ok: false,
      error: 'Expressao regular invalida para JavaScript.',
      regexPreview: `/${pattern}/${flags}`,
      totalMatches: 0,
      matches: [],
      highlightedText: escapeHtml(text),
      replacedText: text,
    };
  }

  const matches: RegexMatchDetail[] = [];
  const executionRegex = new RegExp(pattern, flags.includes('g') ? flags : `${flags}g`);

  let match = executionRegex.exec(text);

  while (match) {
    const value = match[0] ?? '';
    const indexStart = match.index;
    const indexEnd = indexStart + value.length;

    matches.push({
      value,
      indexStart,
      indexEnd,
      groups: match.slice(1).map((item) => item ?? ''),
    });

    if (value.length === 0) {
      executionRegex.lastIndex += 1;
    }

    match = executionRegex.exec(text);
  }

  const highlightedText = buildHighlightHtml(text, matches);
  const replacedText = replacement ? text.replace(regex, replacement) : text;

  return {
    ok: true,
    regexPreview: `/${pattern}/${flags}`,
    totalMatches: matches.length,
    matches,
    highlightedText,
    replacedText,
  };
};
