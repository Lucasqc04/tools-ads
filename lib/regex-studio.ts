// Regex Studio — core library
// Generator patterns, explainer, validator, extractor, replacement presets, code snippets

// ─── Types ───────────────────────────────────────────────────────────────────

export type RegexMatchDetail = {
  value: string;
  indexStart: number;
  indexEnd: number;
  line: number;
  column: number;
  groups: string[];
  namedGroups?: Record<string, string>;
};

export type RegexTestResult = {
  ok: boolean;
  error?: string;
  regexPreview: string;
  totalMatches: number;
  matches: RegexMatchDetail[];
  highlightedText: string;
  replacedText: string;
  executionMs: number;
};

export type RegexDiagnostic = {
  valid: boolean;
  hasGroups: boolean;
  hasAnchors: boolean;
  hasQuantifiers: boolean;
  hasLookahead: boolean;
  hasLookbehind: boolean;
  hasUnicode: boolean;
  acceptsEmpty: boolean;
  possibleGreedy: boolean;
  suggestions: string[];
};

export type PatternCategory =
  | 'brasil'
  | 'web'
  | 'dev'
  | 'texto'
  | 'datas'
  | 'numeros'
  | 'seguranca';

export type PatternEntry = {
  id: string;
  name: string;
  description: string;
  category: PatternCategory;
  pattern: string;
  flags: string;
  testText: string;
  explanation: string;
  limitations: string;
};

export type GeneratorCategory =
  | 'email'
  | 'url'
  | 'telefone-br'
  | 'cpf'
  | 'cnpj'
  | 'cep'
  | 'data'
  | 'hora'
  | 'numero'
  | 'numero-decimal'
  | 'preco-brl'
  | 'hashtag'
  | 'mencao'
  | 'username'
  | 'palavra'
  | 'texto-aspas'
  | 'texto-parenteses'
  | 'html-tag'
  | 'ip'
  | 'uuid'
  | 'slug'
  | 'placa-mercosul'
  | 'linhas-vazias'
  | 'espacos-duplicados'
  | 'caracteres-invisiveis';

export type GeneratorOption = {
  id: string;
  label: string;
  default: boolean;
};

export type GeneratorConfig = {
  category: GeneratorCategory;
  label: string;
  options: GeneratorOption[];
};

export type ReplacementPreset = {
  id: string;
  name: string;
  pattern: string;
  flags: string;
  replacement: string;
  description: string;
};

export type ValidationResult = {
  valid: boolean;
  reason: string;
  regexUsed: string;
  example: string;
};

export type ExtractionType =
  | 'emails'
  | 'links'
  | 'telefones'
  | 'cpfs'
  | 'cnpjs'
  | 'hashtags'
  | 'mencoes'
  | 'datas'
  | 'numeros'
  | 'valores-monetarios';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const escapeHtml = (value: string): string =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

const toSafeRegexFlags = (flags: string): string => {
  const unique = Array.from(new Set(flags.split('')));
  const allowedOrder = ['g', 'i', 'm', 's', 'u', 'y'];
  return allowedOrder.filter((f) => unique.includes(f)).join('');
};

function getLineCol(text: string, index: number): { line: number; column: number } {
  const lines = text.slice(0, index).split('\n');
  return { line: lines.length, column: (lines[lines.length - 1]?.length ?? 0) + 1 };
}

// ─── Tester ──────────────────────────────────────────────────────────────────

const MATCH_COLORS = [
  'bg-amber-200',
  'bg-blue-200',
  'bg-green-200',
  'bg-pink-200',
  'bg-purple-200',
  'bg-cyan-200',
  'bg-orange-200',
  'bg-teal-200',
];

function buildHighlightHtml(text: string, matches: RegexMatchDetail[]): string {
  if (matches.length === 0) return escapeHtml(text);
  let cursor = 0;
  const chunks: string[] = [];
  matches.forEach((m, idx) => {
    const before = text.slice(cursor, m.indexStart);
    const content = text.slice(m.indexStart, m.indexEnd);
    const color = MATCH_COLORS[idx % MATCH_COLORS.length];
    chunks.push(escapeHtml(before));
    chunks.push(`<mark data-match="${idx + 1}" class="rounded px-0.5 ${color}">${escapeHtml(content)}</mark>`);
    cursor = m.indexEnd;
  });
  chunks.push(escapeHtml(text.slice(cursor)));
  return chunks.join('');
}

export function testRegex(
  pattern: string,
  flagsRaw: string,
  text: string,
  replacement: string,
): RegexTestResult {
  const flags = toSafeRegexFlags(flagsRaw || 'g');
  const start = performance.now();

  let regex: RegExp;
  try {
    regex = new RegExp(pattern, flags);
  } catch {
    return {
      ok: false,
      error: 'Expressão regular inválida para JavaScript.',
      regexPreview: `/${pattern}/${flags}`,
      totalMatches: 0,
      matches: [],
      highlightedText: escapeHtml(text),
      replacedText: text,
      executionMs: 0,
    };
  }

  const matches: RegexMatchDetail[] = [];
  const execRegex = new RegExp(pattern, flags.includes('g') ? flags : `${flags}g`);
  let m = execRegex.exec(text);

  while (m) {
    const value = m[0] ?? '';
    const indexStart = m.index;
    const indexEnd = indexStart + value.length;
    const { line, column } = getLineCol(text, indexStart);

    matches.push({
      value,
      indexStart,
      indexEnd,
      line,
      column,
      groups: m.slice(1).map((g) => g ?? ''),
      namedGroups: m.groups ? { ...m.groups } : undefined,
    });

    if (value.length === 0) execRegex.lastIndex += 1;
    m = execRegex.exec(text);
  }

  const highlightedText = buildHighlightHtml(text, matches);
  const replacedText = replacement ? text.replace(regex, replacement) : text;
  const executionMs = performance.now() - start;

  return {
    ok: true,
    regexPreview: `/${pattern}/${flags}`,
    totalMatches: matches.length,
    matches,
    highlightedText,
    replacedText,
    executionMs,
  };
}

// ─── Explainer ───────────────────────────────────────────────────────────────

export type ExplainToken = {
  token: string;
  description: string;
};

export function explainRegex(pattern: string): ExplainToken[] {
  const tokens: ExplainToken[] = [];
  let i = 0;

  while (i < pattern.length) {
    const ch = pattern[i];

    // Escape sequences
    if (ch === '\\' && i + 1 < pattern.length) {
      const next = pattern[i + 1];
      const pair = `\\${next}`;
      const map: Record<string, string> = {
        '\\d': 'Dígito (0-9)',
        '\\D': 'Não dígito',
        '\\w': 'Letra, número ou underscore',
        '\\W': 'Não letra/número/underscore',
        '\\s': 'Espaço em branco (espaço, tab, quebra)',
        '\\S': 'Não espaço',
        '\\b': 'Limite de palavra (word boundary)',
        '\\B': 'Não limite de palavra',
        '\\n': 'Quebra de linha',
        '\\t': 'Tab',
        '\\r': 'Retorno de carro',
        '\\0': 'Caractere nulo',
      };
      tokens.push({ token: pair, description: map[pair] ?? `Caractere escapado: ${next}` });
      i += 2;
      continue;
    }

    // Character classes
    if (ch === '[') {
      let end = i + 1;
      if (end < pattern.length && pattern[end] === '^') end++;
      while (end < pattern.length && pattern[end] !== ']') {
        if (pattern[end] === '\\') end++;
        end++;
      }
      const cls = pattern.slice(i, end + 1);
      const neg = cls[1] === '^';
      tokens.push({ token: cls, description: neg ? `Qualquer caractere EXCETO: ${cls.slice(2, -1)}` : `Conjunto de caracteres: ${cls.slice(1, -1)}` });
      i = end + 1;
      continue;
    }

    // Groups
    if (ch === '(') {
      if (pattern.slice(i, i + 3) === '(?:') {
        tokens.push({ token: '(?:...)', description: 'Grupo não capturante' });
        i += 3;
        continue;
      }
      if (pattern.slice(i, i + 4) === '(?<=') {
        tokens.push({ token: '(?<=...)', description: 'Lookbehind positivo' });
        i += 4;
        continue;
      }
      if (pattern.slice(i, i + 4) === '(?<!') {
        tokens.push({ token: '(?<!...)', description: 'Lookbehind negativo' });
        i += 4;
        continue;
      }
      if (pattern.slice(i, i + 3) === '(?=') {
        tokens.push({ token: '(?=...)', description: 'Lookahead positivo' });
        i += 3;
        continue;
      }
      if (pattern.slice(i, i + 3) === '(?!') {
        tokens.push({ token: '(?!...)', description: 'Lookahead negativo' });
        i += 3;
        continue;
      }
      if (pattern.slice(i).startsWith('(?<') && !pattern.slice(i).startsWith('(?<=') && !pattern.slice(i).startsWith('(?<!')) {
        const nameEnd = pattern.indexOf('>', i + 3);
        if (nameEnd !== -1) {
          const name = pattern.slice(i + 3, nameEnd);
          tokens.push({ token: `(?<${name}>...)`, description: `Grupo nomeado: "${name}"` });
          i = nameEnd + 1;
          continue;
        }
      }
      tokens.push({ token: '(', description: 'Início de grupo de captura' });
      i++;
      continue;
    }

    if (ch === ')') {
      tokens.push({ token: ')', description: 'Fim de grupo' });
      i++;
      continue;
    }

    // Quantifiers
    if (ch === '{') {
      let end = i + 1;
      while (end < pattern.length && pattern[end] !== '}') end++;
      const quant = pattern.slice(i, end + 1);
      if (/^\{\d+(,\d*)?\}$/.test(quant)) {
        tokens.push({ token: quant, description: `Repetição: ${quant}` });
        i = end + 1;
        continue;
      }
    }

    // Simple chars
    const simpleMap: Record<string, string> = {
      '.': 'Qualquer caractere (exceto quebra de linha sem flag s)',
      '^': 'Início da linha/string',
      '$': 'Fim da linha/string',
      '+': 'Uma ou mais ocorrências',
      '*': 'Zero ou mais ocorrências',
      '?': 'Opcional (zero ou uma ocorrência)',
      '|': 'Alternativa (OU)',
    };

    if (simpleMap[ch!]) {
      tokens.push({ token: ch!, description: simpleMap[ch!] });
    } else {
      tokens.push({ token: ch!, description: `Caractere literal: "${ch}"` });
    }
    i++;
  }

  return tokens;
}

// ─── Diagnostics ─────────────────────────────────────────────────────────────

export function diagnoseRegex(pattern: string, flags: string): RegexDiagnostic {
  let valid = true;
  try {
    new RegExp(pattern, toSafeRegexFlags(flags));
  } catch {
    valid = false;
  }

  const hasGroups = /\((?!\?)/.test(pattern) || /\(\?<[^!=]/.test(pattern);
  const hasAnchors = /\^|\$|\\b/.test(pattern);
  const hasQuantifiers = /[+*?]|\{\d/.test(pattern);
  const hasLookahead = /\(\?[=!]/.test(pattern);
  const hasLookbehind = /\(\?<[=!]/.test(pattern);
  const hasUnicode = /\\p\{|\\u\{/.test(pattern) || flags.includes('u');
  const acceptsEmpty = valid && (() => { try { return new RegExp(pattern, flags).test(''); } catch { return false; } })();
  const possibleGreedy = /\.\*[^?]|\.+[^?]/.test(pattern);

  const suggestions: string[] = [];
  if (!hasAnchors) suggestions.push('Considere usar ^ e $ para validar a string inteira.');
  if (possibleGreedy) suggestions.push('Cuidado com .* — pode capturar mais do que esperado. Considere .*?');
  if (pattern.includes('.') && !pattern.includes('\\.')) suggestions.push('Ponto sem escape (.) aceita qualquer caractere. Use \\. para ponto literal.');
  if (acceptsEmpty) suggestions.push('A regex aceita string vazia. Verifique se é intencional.');
  if (hasLookbehind) suggestions.push('Lookbehind pode não funcionar em navegadores antigos.');
  if (!flags.includes('g') && hasQuantifiers) suggestions.push('Sem flag g, apenas o primeiro match será encontrado.');

  return { valid, hasGroups, hasAnchors, hasQuantifiers, hasLookahead, hasLookbehind, hasUnicode, acceptsEmpty, possibleGreedy, suggestions };
}

// ─── Pattern Library ─────────────────────────────────────────────────────────

export const PATTERN_LIBRARY: PatternEntry[] = [
  // Brasil
  { id: 'cpf', name: 'CPF', description: 'CPF com ou sem pontuação', category: 'brasil', pattern: String.raw`\d{3}\.?\d{3}\.?\d{3}-?\d{2}`, flags: 'g', testText: '123.456.789-09 e 12345678909', explanation: '3 dígitos, ponto opcional, 3 dígitos, ponto opcional, 3 dígitos, traço opcional, 2 dígitos.', limitations: 'Valida apenas formato. Não verifica dígitos verificadores.' },
  { id: 'cnpj', name: 'CNPJ', description: 'CNPJ com ou sem pontuação', category: 'brasil', pattern: String.raw`\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}`, flags: 'g', testText: '12.345.678/0001-95 e 12345678000195', explanation: '2+3+3 dígitos com pontos opcionais, barra, 4 dígitos, traço, 2 dígitos.', limitations: 'Valida apenas formato.' },
  { id: 'cep', name: 'CEP', description: 'CEP brasileiro', category: 'brasil', pattern: String.raw`\d{5}-?\d{3}`, flags: 'g', testText: '01310-100 e 01310100', explanation: '5 dígitos, traço opcional, 3 dígitos.', limitations: 'Não valida se o CEP existe.' },
  { id: 'telefone-br', name: 'Telefone BR', description: 'Telefone brasileiro com DDD', category: 'brasil', pattern: String.raw`(?:\+55\s?)?(?:\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}`, flags: 'g', testText: '+55 (11) 99999-1234 e (21) 3333-4444', explanation: '+55 opcional, DDD com parênteses opcional, 4-5 dígitos, traço, 4 dígitos.', limitations: 'Formatos não convencionais podem escapar.' },
  { id: 'preco-brl', name: 'Preço R$', description: 'Valores monetários em reais', category: 'brasil', pattern: String.raw`R\$\s?\d{1,3}(?:\.\d{3})*,\d{2}`, flags: 'g', testText: 'Valor: R$ 1.299,99 e R$50,00', explanation: 'R$ seguido de número com separadores brasileiros.', limitations: 'Pode falhar em formatos não padronizados.' },
  { id: 'placa-mercosul', name: 'Placa Mercosul', description: 'Placa no padrão Mercosul', category: 'brasil', pattern: String.raw`[A-Z]{3}\d[A-Z]\d{2}`, flags: 'gi', testText: 'ABC1D23 e XYZ9W87', explanation: '3 letras, 1 dígito, 1 letra, 2 dígitos.', limitations: 'Apenas formato Mercosul, não o antigo.' },

  // Web
  { id: 'email', name: 'E-mail', description: 'Endereços de e-mail', category: 'web', pattern: String.raw`[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}`, flags: 'g', testText: 'contato@site.com user+tag@sub.domain.io', explanation: 'Letras/números/pontos antes do @, domínio com pontos, TLD 2+ chars.', limitations: 'Padrão simplificado. Não cobre 100% da RFC 5322.' },
  { id: 'url', name: 'URL', description: 'URLs com http/https', category: 'web', pattern: String.raw`https?://[^\s<>"']+`, flags: 'g', testText: 'Visite https://example.com/path?q=1 agora', explanation: 'http ou https seguido de :// e caracteres não-espaço.', limitations: 'Pode capturar pontuação adjacente.' },
  { id: 'dominio', name: 'Domínio', description: 'Nomes de domínio', category: 'web', pattern: String.raw`(?:[\w-]+\.)+[A-Za-z]{2,}`, flags: 'g', testText: 'site.com sub.dominio.com.br', explanation: 'Partes separadas por ponto com TLD final.', limitations: 'Pode capturar strings que não são domínios válidos.' },
  { id: 'slug', name: 'Slug', description: 'URL slugs', category: 'web', pattern: String.raw`[a-z0-9]+(?:-[a-z0-9]+)*`, flags: 'g', testText: 'meu-post-2024 outro-slug', explanation: 'Letras minúsculas e números separados por hífens.', limitations: 'Pode capturar palavras simples como slugs.' },
  { id: 'html-tag', name: 'HTML Tag', description: 'Tags HTML', category: 'web', pattern: String.raw`<\/?[a-z][a-z0-9]*[^>]*>`, flags: 'gi', testText: '<div class="box"><p>texto</p></div>', explanation: 'Abertura ou fechamento de tag HTML.', limitations: 'Regex não é ideal para parse de HTML. Use DOM parser para casos complexos.' },

  // Dev
  { id: 'uuid', name: 'UUID', description: 'UUID v4', category: 'dev', pattern: String.raw`[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}`, flags: 'gi', testText: '550e8400-e29b-41d4-a716-446655440000', explanation: 'Formato UUID v4 com segmentos hexadecimais.', limitations: 'Apenas UUID v4.' },
  { id: 'ip', name: 'IP v4', description: 'Endereço IPv4', category: 'dev', pattern: String.raw`\b(?:25[0-5]|2[0-4]\d|[01]?\d\d?)(?:\.(?:25[0-5]|2[0-4]\d|[01]?\d\d?)){3}\b`, flags: 'g', testText: '192.168.1.1 e 10.0.0.255', explanation: 'Quatro octetos de 0-255 separados por ponto.', limitations: 'IPv4 apenas.' },
  { id: 'hex-color', name: 'Hex Color', description: 'Cores hexadecimais', category: 'dev', pattern: String.raw`#(?:[0-9a-fA-F]{3}){1,2}\b`, flags: 'g', testText: '#fff #aabbcc #123456', explanation: '# seguido de 3 ou 6 dígitos hexadecimais.', limitations: 'Não cobre cores com alpha (8 dígitos).' },
  { id: 'json-key', name: 'JSON Key', description: 'Chaves JSON', category: 'dev', pattern: String.raw`"([^"]+)"\s*:`, flags: 'g', testText: '{"nome": "valor", "id": 123}', explanation: 'Texto entre aspas seguido de dois pontos.', limitations: 'Funciona para JSON simples.' },
  { id: 'base64', name: 'Base64', description: 'Strings Base64-like', category: 'dev', pattern: String.raw`[A-Za-z0-9+/]{20,}={0,2}`, flags: 'g', testText: 'data: SGVsbG8gV29ybGQ=', explanation: 'Sequência alfanumérica longa com possível padding =.', limitations: 'Falsos positivos em textos longos.' },

  // Texto
  { id: 'hashtag', name: 'Hashtag', description: 'Hashtags de redes sociais', category: 'texto', pattern: String.raw`#[\w\u00C0-\u024F]+`, flags: 'gu', testText: '#programação #dev #regex', explanation: '# seguido de letras, números ou underscore (com acentos).', limitations: 'Depende da flag u para acentos.' },
  { id: 'mencao', name: 'Menção @', description: 'Menções de usuário', category: 'texto', pattern: String.raw`@[\w._-]+`, flags: 'g', testText: '@lucas @dev_team @user.name', explanation: '@ seguido de letras, números, ponto, underscore ou hífen.', limitations: 'Pode capturar e-mails parcialmente.' },
  { id: 'espacos-dup', name: 'Espaços duplicados', description: 'Múltiplos espaços', category: 'texto', pattern: String.raw`[ \t]{2,}`, flags: 'g', testText: 'texto   com    espaços  extras', explanation: 'Dois ou mais espaços/tabs consecutivos.', limitations: '' },
  { id: 'linhas-vazias', name: 'Linhas vazias', description: 'Linhas em branco', category: 'texto', pattern: String.raw`^\s*$`, flags: 'gm', testText: 'linha 1\n\nlinha 3\n  \nlinha 5', explanation: 'Linha que contém apenas espaços ou nada.', limitations: 'Precisa da flag m.' },
  { id: 'palavra', name: 'Palavra inteira', description: 'Palavra específica com boundary', category: 'texto', pattern: String.raw`\bregex\b`, flags: 'gi', testText: 'regex é útil, mas regex101 é outra coisa', explanation: '\\b garante que "regex" é palavra inteira.', limitations: 'Substitua "regex" pela palavra desejada.' },

  // Datas
  { id: 'data-br', name: 'Data BR', description: 'dd/mm/aaaa', category: 'datas', pattern: String.raw`\b\d{2}/\d{2}/\d{4}\b`, flags: 'g', testText: 'Evento 28/05/2026 e 01/12/2025', explanation: '2 dígitos / 2 dígitos / 4 dígitos.', limitations: 'Não valida se a data é real (ex: 99/99/9999 passaria).' },
  { id: 'data-iso', name: 'Data ISO', description: 'yyyy-mm-dd', category: 'datas', pattern: String.raw`\b\d{4}-\d{2}-\d{2}\b`, flags: 'g', testText: '2026-05-28 e 2025-12-01', explanation: '4 dígitos - 2 dígitos - 2 dígitos.', limitations: 'Não valida se a data é real.' },
  { id: 'horario', name: 'Horário', description: 'hh:mm ou hh:mm:ss', category: 'datas', pattern: String.raw`\b\d{1,2}:\d{2}(?::\d{2})?\b`, flags: 'g', testText: '14:30 e 08:15:59', explanation: 'Horas : minutos opcionalmente : segundos.', limitations: 'Aceita valores inválidos como 99:99.' },

  // Números
  { id: 'inteiro', name: 'Número inteiro', description: 'Números inteiros', category: 'numeros', pattern: String.raw`-?\b\d+\b`, flags: 'g', testText: 'valores: 42, -7, 1000', explanation: 'Sinal negativo opcional + dígitos.', limitations: '' },
  { id: 'decimal', name: 'Decimal', description: 'Números decimais (ponto)', category: 'numeros', pattern: String.raw`-?\b\d+\.\d+\b`, flags: 'g', testText: '3.14 e -0.5 e 100.00', explanation: 'Dígitos . dígitos com sinal opcional.', limitations: 'Usa ponto como separador.' },
  { id: 'decimal-br', name: 'Decimal BR', description: 'Decimal com vírgula', category: 'numeros', pattern: String.raw`-?\b\d+,\d+\b`, flags: 'g', testText: '3,14 e -0,5 e 100,00', explanation: 'Dígitos , dígitos (formato brasileiro).', limitations: '' },

  // Segurança
  { id: 'senha-forte', name: 'Senha forte', description: 'Mínimo 8 chars, maiúscula, minúscula, número, especial', category: 'seguranca', pattern: String.raw`^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$`, flags: '', testText: 'Abc@1234', explanation: 'Lookaheads verificam presença de cada tipo de caractere.', limitations: 'Muitas políticas de senha têm regras adicionais.' },
  { id: 'jwt', name: 'JWT Token', description: 'Token JWT', category: 'seguranca', pattern: String.raw`eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+`, flags: 'g', testText: 'token: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.abc123', explanation: 'Três partes base64url separadas por ponto, começando com eyJ.', limitations: 'Não valida a assinatura.' },
];

// ─── Generator ───────────────────────────────────────────────────────────────

export const GENERATOR_CONFIGS: GeneratorConfig[] = [
  {
    category: 'email',
    label: 'E-mail',
    options: [
      { id: 'subdomain', label: 'Aceitar subdomínio', default: true },
      { id: 'plus', label: 'Aceitar + (plus addressing)', default: true },
      { id: 'insensitive', label: 'Case insensitive', default: true },
      { id: 'captureDomain', label: 'Capturar domínio separado', default: false },
    ],
  },
  {
    category: 'telefone-br',
    label: 'Telefone BR',
    options: [
      { id: 'country', label: 'Aceitar +55', default: true },
      { id: 'ddd', label: 'Aceitar DDD', default: true },
      { id: 'parens', label: 'Aceitar parênteses no DDD', default: true },
      { id: 'space', label: 'Aceitar espaço', default: true },
      { id: 'dash', label: 'Aceitar hífen', default: true },
      { id: 'nineDigit', label: 'Celular 9 dígitos', default: true },
    ],
  },
  {
    category: 'cpf',
    label: 'CPF',
    options: [
      { id: 'punctuation', label: 'Aceitar com pontuação', default: true },
      { id: 'noPunctuation', label: 'Aceitar sem pontuação', default: true },
      { id: 'captureGroups', label: 'Capturar grupos', default: false },
    ],
  },
  {
    category: 'cnpj',
    label: 'CNPJ',
    options: [
      { id: 'punctuation', label: 'Aceitar com pontuação', default: true },
      { id: 'noPunctuation', label: 'Aceitar sem pontuação', default: true },
    ],
  },
  {
    category: 'data',
    label: 'Data',
    options: [
      { id: 'brFormat', label: 'Formato dd/mm/aaaa', default: true },
      { id: 'isoFormat', label: 'Formato yyyy-mm-dd', default: false },
      { id: 'flexSep', label: 'Aceitar / ou -', default: false },
      { id: 'captureFields', label: 'Capturar dia, mês e ano', default: false },
    ],
  },
  {
    category: 'url',
    label: 'URL',
    options: [
      { id: 'https', label: 'Aceitar https', default: true },
      { id: 'http', label: 'Aceitar http', default: true },
      { id: 'capturePath', label: 'Capturar path', default: false },
    ],
  },
  {
    category: 'uuid',
    label: 'UUID',
    options: [
      { id: 'v4Only', label: 'Apenas v4', default: false },
      { id: 'anyVersion', label: 'Qualquer versão', default: true },
    ],
  },
  {
    category: 'cep',
    label: 'CEP',
    options: [
      { id: 'dash', label: 'Aceitar traço', default: true },
      { id: 'noDash', label: 'Aceitar sem traço', default: true },
    ],
  },
  {
    category: 'ip',
    label: 'IP',
    options: [
      { id: 'v4', label: 'IPv4', default: true },
      { id: 'strict', label: 'Validar range 0-255', default: true },
    ],
  },
  {
    category: 'hashtag',
    label: 'Hashtag',
    options: [
      { id: 'accents', label: 'Aceitar acentos', default: true },
      { id: 'numbers', label: 'Aceitar números', default: true },
    ],
  },
  {
    category: 'mencao',
    label: 'Menção @',
    options: [
      { id: 'dots', label: 'Aceitar pontos', default: true },
      { id: 'dashes', label: 'Aceitar hífens', default: true },
    ],
  },
  {
    category: 'numero',
    label: 'Número',
    options: [
      { id: 'negative', label: 'Aceitar negativo', default: true },
      { id: 'decimal', label: 'Aceitar decimal (ponto)', default: false },
      { id: 'decimalBr', label: 'Aceitar decimal (vírgula)', default: false },
    ],
  },
  {
    category: 'preco-brl',
    label: 'Preço R$',
    options: [
      { id: 'thousands', label: 'Aceitar separador de milhar', default: true },
      { id: 'space', label: 'Espaço após R$', default: true },
    ],
  },
  {
    category: 'slug',
    label: 'Slug',
    options: [
      { id: 'numbers', label: 'Aceitar números', default: true },
      { id: 'underscores', label: 'Aceitar underscores', default: false },
    ],
  },
  {
    category: 'html-tag',
    label: 'HTML Tag',
    options: [
      { id: 'withAttrs', label: 'Incluir atributos', default: true },
      { id: 'selfClosing', label: 'Aceitar self-closing', default: true },
    ],
  },
  {
    category: 'placa-mercosul',
    label: 'Placa Mercosul',
    options: [
      { id: 'insensitive', label: 'Case insensitive', default: true },
    ],
  },
  {
    category: 'linhas-vazias',
    label: 'Linhas vazias',
    options: [
      { id: 'withSpaces', label: 'Considerar linhas só com espaço', default: true },
    ],
  },
  {
    category: 'espacos-duplicados',
    label: 'Espaços duplicados',
    options: [
      { id: 'tabs', label: 'Incluir tabs', default: true },
    ],
  },
  {
    category: 'hora',
    label: 'Hora',
    options: [
      { id: 'seconds', label: 'Incluir segundos', default: false },
      { id: '24h', label: 'Formato 24h', default: true },
    ],
  },
  {
    category: 'numero-decimal',
    label: 'Número decimal',
    options: [
      { id: 'dotSep', label: 'Separador ponto', default: true },
      { id: 'commaSep', label: 'Separador vírgula', default: false },
    ],
  },
  {
    category: 'username',
    label: 'Username',
    options: [
      { id: 'dots', label: 'Aceitar pontos', default: true },
      { id: 'dashes', label: 'Aceitar hífens', default: true },
      { id: 'minLength', label: 'Mínimo 3 caracteres', default: true },
    ],
  },
  {
    category: 'palavra',
    label: 'Palavra específica',
    options: [
      { id: 'boundary', label: 'Palavra inteira (\\b)', default: true },
      { id: 'insensitive', label: 'Case insensitive', default: true },
    ],
  },
  {
    category: 'texto-aspas',
    label: 'Texto entre aspas',
    options: [
      { id: 'double', label: 'Aspas duplas', default: true },
      { id: 'single', label: 'Aspas simples', default: false },
    ],
  },
  {
    category: 'texto-parenteses',
    label: 'Texto entre parênteses',
    options: [
      { id: 'capture', label: 'Capturar conteúdo', default: true },
    ],
  },
  {
    category: 'caracteres-invisiveis',
    label: 'Caracteres invisíveis',
    options: [
      { id: 'zeroWidth', label: 'Zero-width chars', default: true },
      { id: 'bom', label: 'BOM', default: true },
    ],
  },
];

export function generateRegex(category: GeneratorCategory, selectedOptions: string[]): { pattern: string; flags: string; testText: string; explanation: string; limitations: string } {
  switch (category) {
    case 'email': {
      const capDom = selectedOptions.includes('captureDomain');
      const plus = selectedOptions.includes('plus') ? '+' : '';
      const pattern = capDom
        ? String.raw`[\w.${plus}-]+@([\w.-]+\.[A-Za-z]{2,})`
        : String.raw`[\w.${plus}-]+@[\w.-]+\.[A-Za-z]{2,}`;
      return { pattern, flags: selectedOptions.includes('insensitive') ? 'gi' : 'g', testText: 'user+tag@sub.domain.com test@site.io', explanation: 'Parte local + @ + domínio com TLD.', limitations: 'Simplificado. Não cobre 100% da RFC 5322.' };
    }
    case 'telefone-br': {
      let p = '';
      if (selectedOptions.includes('country')) p += String.raw`(?:\+55\s?)?`;
      if (selectedOptions.includes('ddd')) {
        p += selectedOptions.includes('parens') ? String.raw`(?:\(?\d{2}\)?\s?)?` : String.raw`(?:\d{2}\s?)?`;
      }
      const digits = selectedOptions.includes('nineDigit') ? '4,5' : '4';
      const dash = selectedOptions.includes('dash') ? '-?' : '';
      const space = selectedOptions.includes('space') ? String.raw`\s?` : '';
      p += String.raw`\d{${digits}}${dash}${space}\d{4}`;
      return { pattern: p, flags: 'g', testText: '+55 (11) 99999-1234 (21) 3333-4444', explanation: 'Código país + DDD + número.', limitations: 'Formatos exóticos podem não ser capturados.' };
    }
    case 'cpf': {
      const withPunct = selectedOptions.includes('punctuation');
      const noPunct = selectedOptions.includes('noPunctuation');
      const capture = selectedOptions.includes('captureGroups');
      const g = capture ? ['(', ')'] : ['', ''];
      let p: string;
      if (withPunct && noPunct) p = `${g[0]}\\d{3}${g[1]}\\.?${g[0]}\\d{3}${g[1]}\\.?${g[0]}\\d{3}${g[1]}-?${g[0]}\\d{2}${g[1]}`;
      else if (withPunct) p = `${g[0]}\\d{3}${g[1]}\\.${g[0]}\\d{3}${g[1]}\\.${g[0]}\\d{3}${g[1]}-${g[0]}\\d{2}${g[1]}`;
      else p = `${g[0]}\\d{3}${g[1]}${g[0]}\\d{3}${g[1]}${g[0]}\\d{3}${g[1]}${g[0]}\\d{2}${g[1]}`;
      return { pattern: p, flags: 'g', testText: '123.456.789-09 12345678909', explanation: 'Formato CPF.', limitations: 'Regex não valida dígitos verificadores.' };
    }
    case 'cnpj': {
      const wp = selectedOptions.includes('punctuation');
      const np = selectedOptions.includes('noPunctuation');
      let p: string;
      if (wp && np) p = String.raw`\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}`;
      else if (wp) p = String.raw`\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}`;
      else p = String.raw`\d{2}\d{3}\d{3}\d{4}\d{2}`;
      return { pattern: p, flags: 'g', testText: '12.345.678/0001-95 12345678000195', explanation: 'Formato CNPJ.', limitations: 'Não valida dígitos verificadores.' };
    }
    case 'cep': {
      const d = selectedOptions.includes('dash');
      const nd = selectedOptions.includes('noDash');
      const sep = d && nd ? '-?' : d ? '-' : '';
      return { pattern: `\\d{5}${sep}\\d{3}`, flags: 'g', testText: '01310-100 01310100', explanation: '5 + 3 dígitos.', limitations: '' };
    }
    case 'data': {
      const br = selectedOptions.includes('brFormat');
      const iso = selectedOptions.includes('isoFormat');
      const flex = selectedOptions.includes('flexSep');
      const cap = selectedOptions.includes('captureFields');
      const g = cap ? ['(', ')'] : ['', ''];
      const sep = flex ? '[/-]' : br ? '/' : '-';
      let p: string;
      if (br && !iso) p = `${g[0]}\\d{2}${g[1]}${sep}${g[0]}\\d{2}${g[1]}${sep}${g[0]}\\d{4}${g[1]}`;
      else if (iso && !br) p = `${g[0]}\\d{4}${g[1]}${sep}${g[0]}\\d{2}${g[1]}${sep}${g[0]}\\d{2}${g[1]}`;
      else p = `(?:${g[0]}\\d{2}${g[1]}${sep}${g[0]}\\d{2}${g[1]}${sep}${g[0]}\\d{4}${g[1]}|${g[0]}\\d{4}${g[1]}${sep}${g[0]}\\d{2}${g[1]}${sep}${g[0]}\\d{2}${g[1]})`;
      return { pattern: p, flags: 'g', testText: '28/05/2026 2026-05-28', explanation: 'Formato de data.', limitations: 'Não valida se data é real (ex: 31/02).' };
    }
    case 'hora': {
      const secs = selectedOptions.includes('seconds');
      const p = secs ? String.raw`\b\d{1,2}:\d{2}:\d{2}\b` : String.raw`\b\d{1,2}:\d{2}\b`;
      return { pattern: p, flags: 'g', testText: '14:30 08:15:59', explanation: 'Horário HH:MM ou HH:MM:SS.', limitations: 'Aceita valores inválidos como 99:99.' };
    }
    case 'numero': {
      let p = '';
      if (selectedOptions.includes('negative')) p += '-?';
      p += String.raw`\b\d+`;
      if (selectedOptions.includes('decimal')) p += String.raw`(?:\.\d+)?`;
      else if (selectedOptions.includes('decimalBr')) p += String.raw`(?:,\d+)?`;
      p += String.raw`\b`;
      return { pattern: p, flags: 'g', testText: '42 -7 3.14 100,5', explanation: 'Números.', limitations: '' };
    }
    case 'numero-decimal': {
      const dot = selectedOptions.includes('dotSep');
      const sep = dot ? '\\.' : ',';
      return { pattern: `-?\\b\\d+${sep}\\d+\\b`, flags: 'g', testText: '3.14 -0.5 100,00', explanation: 'Decimais.', limitations: '' };
    }
    case 'preco-brl': {
      const thou = selectedOptions.includes('thousands') ? String.raw`(?:\.\d{3})*` : '';
      const sp = selectedOptions.includes('space') ? String.raw`\s?` : '';
      return { pattern: `R\\$${sp}\\d{1,3}${thou},\\d{2}`, flags: 'g', testText: 'R$ 1.299,99 R$50,00', explanation: 'Valores em R$.', limitations: '' };
    }
    case 'hashtag': {
      const accentRange = selectedOptions.includes('accents') ? String.raw`\u00C0-\u024F` : '';
      const nums = selectedOptions.includes('numbers') ? '0-9' : '';
      return { pattern: `#[A-Za-z${accentRange}${nums}_]+`, flags: selectedOptions.includes('accents') ? 'gu' : 'g', testText: '#programação #dev #regex2024', explanation: '# + letras/números.', limitations: '' };
    }
    case 'mencao': {
      let cls = String.raw`\w`;
      if (selectedOptions.includes('dots')) cls += '.';
      if (selectedOptions.includes('dashes')) cls += '-';
      return { pattern: `@[${cls}]+`, flags: 'g', testText: '@lucas @dev.team @user-name', explanation: '@ + identificador.', limitations: '' };
    }
    case 'username': {
      let cls = String.raw`\w`;
      if (selectedOptions.includes('dots')) cls += '.';
      if (selectedOptions.includes('dashes')) cls += '-';
      const min = selectedOptions.includes('minLength') ? '{3,}' : '+';
      return { pattern: `^[${cls}]${min}$`, flags: '', testText: 'lucas_dev user.name a-b', explanation: 'Nome de usuário.', limitations: 'Usa ^ e $ para string completa.' };
    }
    case 'palavra': {
      const boundary = selectedOptions.includes('boundary') ? '\\b' : '';
      const flags = selectedOptions.includes('insensitive') ? 'gi' : 'g';
      return { pattern: `${boundary}palavra${boundary}`, flags, testText: 'A palavra aparece aqui. Palavras compostas não.', explanation: 'Substitua "palavra" pelo termo desejado.', limitations: '' };
    }
    case 'texto-aspas': {
      const dbl = selectedOptions.includes('double');
      const sgl = selectedOptions.includes('single');
      let p: string;
      if (dbl && sgl) p = String.raw`(?:"([^"]*)")|(?:'([^']*)')`;
      else if (sgl) p = String.raw`'([^']*)'`;
      else p = String.raw`"([^"]*)"`;
      return { pattern: p, flags: 'g', testText: `Ele disse "olá" e 'tchau'`, explanation: 'Texto entre aspas.', limitations: 'Não lida com aspas escapadas.' };
    }
    case 'texto-parenteses': {
      const cap = selectedOptions.includes('capture');
      const p = cap ? String.raw`\(([^)]*)\)` : String.raw`\([^)]*\)`;
      return { pattern: p, flags: 'g', testText: 'Resultado (final) e (parcial)', explanation: 'Conteúdo entre parênteses.', limitations: 'Não lida com aninhamento.' };
    }
    case 'html-tag': {
      const attrs = selectedOptions.includes('withAttrs') ? '[^>]*' : '';
      const self = selectedOptions.includes('selfClosing') ? '/?' : '';
      return { pattern: `<${self}[a-z][a-z0-9]*${attrs}>`, flags: 'gi', testText: '<div class="x"><br/><p>texto</p>', explanation: 'Tags HTML.', limitations: 'Use DOM parser para HTML complexo.' };
    }
    case 'url': {
      const h = selectedOptions.includes('https');
      const hp = selectedOptions.includes('http');
      const proto = h && hp ? 'https?' : h ? 'https' : 'http';
      return { pattern: `${proto}://[^\\s<>"']+`, flags: 'g', testText: 'https://example.com http://site.net/page', explanation: 'URL com protocolo.', limitations: 'Pode capturar pontuação adjacente.' };
    }
    case 'uuid': {
      const v4 = selectedOptions.includes('v4Only');
      const p = v4
        ? String.raw`[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}`
        : String.raw`[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}`;
      return { pattern: p, flags: 'gi', testText: '550e8400-e29b-41d4-a716-446655440000', explanation: 'UUID com segmentos hex.', limitations: v4 ? 'Apenas v4.' : 'Qualquer versão.' };
    }
    case 'ip': {
      const strict = selectedOptions.includes('strict');
      const p = strict
        ? String.raw`\b(?:25[0-5]|2[0-4]\d|[01]?\d\d?)(?:\.(?:25[0-5]|2[0-4]\d|[01]?\d\d?)){3}\b`
        : String.raw`\b\d{1,3}(?:\.\d{1,3}){3}\b`;
      return { pattern: p, flags: 'g', testText: '192.168.1.1 10.0.0.255 999.999.999.999', explanation: 'Endereço IPv4.', limitations: strict ? '' : 'Não valida range 0-255.' };
    }
    case 'slug': {
      let cls = 'a-z';
      if (selectedOptions.includes('numbers')) cls += '0-9';
      const sep = selectedOptions.includes('underscores') ? '[-_]' : '-';
      return { pattern: `[${cls}]+(?:${sep}[${cls}]+)*`, flags: 'g', testText: 'meu-post-2024 outro_slug', explanation: 'Slug URL.', limitations: '' };
    }
    case 'placa-mercosul': {
      const flags = selectedOptions.includes('insensitive') ? 'gi' : 'g';
      return { pattern: String.raw`[A-Z]{3}\d[A-Z]\d{2}`, flags, testText: 'ABC1D23 XYZ9W87', explanation: '3 letras + 1 dígito + 1 letra + 2 dígitos.', limitations: 'Apenas padrão Mercosul.' };
    }
    case 'linhas-vazias': {
      const sp = selectedOptions.includes('withSpaces') ? String.raw`\s*` : '';
      return { pattern: `^${sp}$`, flags: 'gm', testText: 'linha 1\n\nlinha 3\n  \nlinha 5', explanation: 'Linhas em branco.', limitations: 'Precisa flag m.' };
    }
    case 'espacos-duplicados': {
      const cls = selectedOptions.includes('tabs') ? String.raw`[ \t]` : ' ';
      return { pattern: `${cls}{2,}`, flags: 'g', testText: 'texto   com    espaços  extras', explanation: '2+ espaços consecutivos.', limitations: '' };
    }
    case 'caracteres-invisiveis': {
      const parts: string[] = [];
      if (selectedOptions.includes('zeroWidth')) parts.push(String.raw`[\u200B-\u200F\u2028-\u202F\uFEFF]`);
      if (selectedOptions.includes('bom')) parts.push(String.raw`\uFEFF`);
      const p = parts.length > 1 ? parts.join('|') : parts[0] ?? String.raw`[\u200B-\u200F]`;
      return { pattern: p, flags: 'g', testText: 'texto\u200Bcom\u200Binvisíveis\uFEFF', explanation: 'Caracteres de largura zero e BOM.', limitations: '' };
    }
    default:
      return { pattern: '', flags: 'g', testText: '', explanation: '', limitations: '' };
  }
}

// ─── Replacement Presets ─────────────────────────────────────────────────────

export const REPLACEMENT_PRESETS: ReplacementPreset[] = [
  { id: 'spaces-dup', name: 'Remover espaços duplicados', pattern: String.raw`[ \t]{2,}`, flags: 'g', replacement: ' ', description: 'Substitui múltiplos espaços por um.' },
  { id: 'empty-lines', name: 'Remover linhas vazias', pattern: String.raw`^\s*\n`, flags: 'gm', replacement: '', description: 'Remove linhas em branco.' },
  { id: 'multi-newline', name: 'Múltiplas quebras → uma', pattern: String.raw`\n{3,}`, flags: 'g', replacement: '\n\n', description: 'Limita quebras de linha consecutivas.' },
  { id: 'html-tags', name: 'Remover tags HTML', pattern: String.raw`<[^>]+>`, flags: 'g', replacement: '', description: 'Remove todas as tags HTML.' },
  { id: 'links', name: 'Remover links', pattern: String.raw`https?://\S+`, flags: 'g', replacement: '', description: 'Remove URLs do texto.' },
  { id: 'emojis', name: 'Remover emojis', pattern: String.raw`[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]`, flags: 'gu', replacement: '', description: 'Remove emojis comuns.' },
  { id: 'special-chars', name: 'Remover caracteres especiais', pattern: String.raw`[^\w\s]`, flags: 'g', replacement: '', description: 'Mantém apenas letras, números e espaços.' },
  { id: 'invisible', name: 'Remover caracteres invisíveis', pattern: String.raw`[\u200B-\u200F\u2028-\u202F\uFEFF]`, flags: 'g', replacement: '', description: 'Remove zero-width e BOM.' },
  { id: 'mask-email', name: 'Mascarar e-mails', pattern: String.raw`([\w.+-])[\w.+-]+(@[\w.-]+)`, flags: 'g', replacement: '$1***$2', description: 'Oculta parte do e-mail.' },
  { id: 'mask-phone', name: 'Mascarar telefones', pattern: String.raw`(\d{2})\d{4,5}(\d{4})`, flags: 'g', replacement: '$1*****$2', description: 'Oculta dígitos do meio.' },
  { id: 'mask-cpf', name: 'Mascarar CPFs', pattern: String.raw`(\d{3})\.\d{3}\.\d{3}(-\d{2})`, flags: 'g', replacement: '$1.***.***$2', description: 'Oculta dígitos centrais.' },
  { id: 'comma-to-dot', name: 'Vírgula → ponto', pattern: String.raw`(\d),(\d)`, flags: 'g', replacement: '$1.$2', description: 'Troca vírgula decimal por ponto.' },
  { id: 'normalize', name: 'Normalizar espaços', pattern: String.raw`\s+`, flags: 'g', replacement: ' ', description: 'Substitui qualquer sequência de espaços por um espaço.' },
];

// ─── Extraction ──────────────────────────────────────────────────────────────

const EXTRACTION_PATTERNS: Record<ExtractionType, { pattern: string; flags: string }> = {
  emails: { pattern: String.raw`[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}`, flags: 'g' },
  links: { pattern: String.raw`https?://[^\s<>"']+`, flags: 'g' },
  telefones: { pattern: String.raw`(?:\+55\s?)?(?:\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}`, flags: 'g' },
  cpfs: { pattern: String.raw`\d{3}\.?\d{3}\.?\d{3}-?\d{2}`, flags: 'g' },
  cnpjs: { pattern: String.raw`\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}`, flags: 'g' },
  hashtags: { pattern: String.raw`#[\w\u00C0-\u024F]+`, flags: 'gu' },
  mencoes: { pattern: String.raw`@[\w._-]+`, flags: 'g' },
  datas: { pattern: String.raw`\b\d{1,4}[/-]\d{1,2}[/-]\d{1,4}\b`, flags: 'g' },
  numeros: { pattern: String.raw`-?\b\d+(?:[.,]\d+)?\b`, flags: 'g' },
  'valores-monetarios': { pattern: String.raw`R\$\s?\d{1,3}(?:\.\d{3})*,\d{2}`, flags: 'g' },
};

export function extractFromText(text: string, type: ExtractionType): string[] {
  const { pattern, flags } = EXTRACTION_PATTERNS[type];
  const regex = new RegExp(pattern, flags);
  const results: string[] = [];
  let m = regex.exec(text);
  while (m) {
    results.push(m[0]);
    if (m[0].length === 0) regex.lastIndex++;
    m = regex.exec(text);
  }
  return results;
}

// ─── Validation ──────────────────────────────────────────────────────────────

type ValidationType = 'email' | 'cpf' | 'cnpj' | 'telefone' | 'cep' | 'url' | 'uuid' | 'slug' | 'data' | 'numero' | 'senha';

const VALIDATION_CONFIGS: Record<ValidationType, { pattern: string; flags: string; example: string; note: string }> = {
  email: { pattern: String.raw`^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$`, flags: 'i', example: 'user@domain.com', note: '' },
  cpf: { pattern: String.raw`^\d{3}\.\d{3}\.\d{3}-\d{2}$`, flags: '', example: '123.456.789-09', note: 'Valida apenas formato, não dígitos verificadores.' },
  cnpj: { pattern: String.raw`^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$`, flags: '', example: '12.345.678/0001-95', note: 'Valida apenas formato.' },
  telefone: { pattern: String.raw`^(?:\+55\s?)?(?:\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$`, flags: '', example: '(11) 99999-1234', note: '' },
  cep: { pattern: String.raw`^\d{5}-?\d{3}$`, flags: '', example: '01310-100', note: '' },
  url: { pattern: String.raw`^https?://[^\s]+$`, flags: 'i', example: 'https://example.com', note: '' },
  uuid: { pattern: String.raw`^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$`, flags: 'i', example: '550e8400-e29b-41d4-a716-446655440000', note: '' },
  slug: { pattern: String.raw`^[a-z0-9]+(?:-[a-z0-9]+)*$`, flags: '', example: 'meu-post-2024', note: '' },
  data: { pattern: String.raw`^(?:\d{2}\/\d{2}\/\d{4}|\d{4}-\d{2}-\d{2})$`, flags: '', example: '28/05/2026', note: 'Não valida se data é real.' },
  numero: { pattern: String.raw`^-?\d+(?:[.,]\d+)?$`, flags: '', example: '42', note: '' },
  senha: { pattern: String.raw`^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$`, flags: '', example: 'Abc@1234', note: 'Exige maiúscula, minúscula, número e especial.' },
};

export function validateInput(input: string, type: ValidationType): ValidationResult {
  const config = VALIDATION_CONFIGS[type];
  try {
    const regex = new RegExp(config.pattern, config.flags);
    const valid = regex.test(input);
    const reason = valid ? 'Formato válido.' : `Não corresponde ao formato esperado. Exemplo: ${config.example}`;
    return { valid, reason: config.note ? `${reason} ${config.note}` : reason, regexUsed: `/${config.pattern}/${config.flags}`, example: config.example };
  } catch {
    return { valid: false, reason: 'Erro ao validar.', regexUsed: '', example: config.example };
  }
}

export const VALIDATION_TYPES = Object.keys(VALIDATION_CONFIGS) as ValidationType[];

// ─── Code Snippets ───────────────────────────────────────────────────────────

type SnippetLanguage = 'javascript' | 'typescript' | 'python' | 'php' | 'java' | 'csharp' | 'go';

export const SNIPPET_LANGUAGES: { id: SnippetLanguage; label: string }[] = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'python', label: 'Python' },
  { id: 'php', label: 'PHP' },
  { id: 'java', label: 'Java' },
  { id: 'csharp', label: 'C#' },
  { id: 'go', label: 'Go' },
];

export function generateCodeSnippet(lang: SnippetLanguage, pattern: string, flags: string, mode: 'test' | 'extract' | 'replace'): string {
  const escapedPattern = pattern.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

  switch (lang) {
    case 'javascript':
    case 'typescript': {
      const regexLiteral = `/${pattern}/${flags}`;
      if (mode === 'test') return `const regex = ${regexLiteral};\nconst result = regex.test(text);\nconsole.log(result); // true ou false`;
      if (mode === 'extract') return `const regex = ${regexLiteral};\nconst matches = text.match(regex);\nconsole.log(matches);`;
      return `const regex = ${regexLiteral};\nconst result = text.replace(regex, replacement);\nconsole.log(result);`;
    }
    case 'python': {
      const pyFlags = flags.includes('i') ? ', re.IGNORECASE' : '';
      if (mode === 'test') return `import re\n\npattern = r"${escapedPattern}"\nresult = bool(re.search(pattern, text${pyFlags}))\nprint(result)`;
      if (mode === 'extract') return `import re\n\npattern = r"${escapedPattern}"\nmatches = re.findall(pattern, text${pyFlags})\nprint(matches)`;
      return `import re\n\npattern = r"${escapedPattern}"\nresult = re.sub(pattern, replacement, text${pyFlags})\nprint(result)`;
    }
    case 'php': {
      const phpFlags = flags.replace('g', '');
      const mod = phpFlags ? phpFlags : '';
      if (mode === 'test') return `<?php\n$pattern = "/${escapedPattern}/${mod}";\n$result = preg_match($pattern, $text);\nvar_dump((bool) $result);`;
      if (mode === 'extract') return `<?php\n$pattern = "/${escapedPattern}/${mod}";\npreg_match_all($pattern, $text, $matches);\nprint_r($matches[0]);`;
      return `<?php\n$pattern = "/${escapedPattern}/${mod}";\n$result = preg_replace($pattern, $replacement, $text);\necho $result;`;
    }
    case 'java': {
      const javaFlags = flags.includes('i') ? 'Pattern.CASE_INSENSITIVE' : '0';
      if (mode === 'test') return `import java.util.regex.*;\n\nPattern pattern = Pattern.compile("${escapedPattern}", ${javaFlags});\nMatcher matcher = pattern.matcher(text);\nboolean found = matcher.find();\nSystem.out.println(found);`;
      if (mode === 'extract') return `import java.util.regex.*;\nimport java.util.*;\n\nPattern pattern = Pattern.compile("${escapedPattern}", ${javaFlags});\nMatcher matcher = pattern.matcher(text);\nList<String> matches = new ArrayList<>();\nwhile (matcher.find()) matches.add(matcher.group());\nSystem.out.println(matches);`;
      return `import java.util.regex.*;\n\nString result = text.replaceAll("${escapedPattern}", replacement);\nSystem.out.println(result);`;
    }
    case 'csharp': {
      const csFlags = flags.includes('i') ? 'RegexOptions.IgnoreCase' : 'RegexOptions.None';
      if (mode === 'test') return `using System.Text.RegularExpressions;\n\nvar regex = new Regex(@"${escapedPattern}", ${csFlags});\nbool match = regex.IsMatch(text);\nConsole.WriteLine(match);`;
      if (mode === 'extract') return `using System.Text.RegularExpressions;\n\nvar regex = new Regex(@"${escapedPattern}", ${csFlags});\nvar matches = regex.Matches(text);\nforeach (Match m in matches) Console.WriteLine(m.Value);`;
      return `using System.Text.RegularExpressions;\n\nvar regex = new Regex(@"${escapedPattern}", ${csFlags});\nstring result = regex.Replace(text, replacement);\nConsole.WriteLine(result);`;
    }
    case 'go': {
      const goFlags = flags.includes('i') ? '(?i)' : '';
      if (mode === 'test') return `package main\n\nimport (\n\t"fmt"\n\t"regexp"\n)\n\nfunc main() {\n\tre := regexp.MustCompile(\`${goFlags}${escapedPattern}\`)\n\tfmt.Println(re.MatchString(text))\n}`;
      if (mode === 'extract') return `package main\n\nimport (\n\t"fmt"\n\t"regexp"\n)\n\nfunc main() {\n\tre := regexp.MustCompile(\`${goFlags}${escapedPattern}\`)\n\tmatches := re.FindAllString(text, -1)\n\tfmt.Println(matches)\n}`;
      return `package main\n\nimport (\n\t"fmt"\n\t"regexp"\n)\n\nfunc main() {\n\tre := regexp.MustCompile(\`${goFlags}${escapedPattern}\`)\n\tresult := re.ReplaceAllString(text, replacement)\n\tfmt.Println(result)\n}`;
    }
  }
}

// ─── Visual Builder Blocks ───────────────────────────────────────────────────

export type BuilderBlock = {
  id: string;
  label: string;
  insert: string;
  description: string;
  group: string;
};

export const BUILDER_BLOCKS: BuilderBlock[] = [
  // Caracteres
  { id: 'any', label: '.', insert: '.', description: 'Qualquer caractere', group: 'Caracteres' },
  { id: 'digit', label: '\\d', insert: '\\d', description: 'Dígito (0-9)', group: 'Caracteres' },
  { id: 'not-digit', label: '\\D', insert: '\\D', description: 'Não dígito', group: 'Caracteres' },
  { id: 'word', label: '\\w', insert: '\\w', description: 'Letra/número/_', group: 'Caracteres' },
  { id: 'not-word', label: '\\W', insert: '\\W', description: 'Não letra/número', group: 'Caracteres' },
  { id: 'space', label: '\\s', insert: '\\s', description: 'Espaço/tab/quebra', group: 'Caracteres' },
  { id: 'not-space', label: '\\S', insert: '\\S', description: 'Não espaço', group: 'Caracteres' },
  // Âncoras
  { id: 'start', label: '^', insert: '^', description: 'Início da linha', group: 'Âncoras' },
  { id: 'end', label: '$', insert: '$', description: 'Fim da linha', group: 'Âncoras' },
  { id: 'boundary', label: '\\b', insert: '\\b', description: 'Limite de palavra', group: 'Âncoras' },
  // Quantificadores
  { id: 'one-plus', label: '+', insert: '+', description: 'Um ou mais', group: 'Quantificadores' },
  { id: 'zero-plus', label: '*', insert: '*', description: 'Zero ou mais', group: 'Quantificadores' },
  { id: 'optional', label: '?', insert: '?', description: 'Opcional', group: 'Quantificadores' },
  { id: 'exact-n', label: '{n}', insert: '{3}', description: 'Exatamente N vezes', group: 'Quantificadores' },
  { id: 'range-nm', label: '{n,m}', insert: '{2,5}', description: 'Entre N e M vezes', group: 'Quantificadores' },
  { id: 'lazy', label: '*?', insert: '*?', description: 'Zero ou mais (lazy)', group: 'Quantificadores' },
  // Grupos
  { id: 'group', label: '(...)', insert: '()', description: 'Grupo de captura', group: 'Grupos' },
  { id: 'non-capture', label: '(?:...)', insert: '(?:)', description: 'Grupo não capturante', group: 'Grupos' },
  { id: 'named-group', label: '(?<nome>)', insert: '(?<nome>)', description: 'Grupo nomeado', group: 'Grupos' },
  { id: 'alt', label: 'a|b', insert: '|', description: 'Alternativa (OU)', group: 'Grupos' },
  // Conjuntos
  { id: 'set', label: '[abc]', insert: '[]', description: 'Conjunto de caracteres', group: 'Conjuntos' },
  { id: 'neg-set', label: '[^abc]', insert: '[^]', description: 'Negação de conjunto', group: 'Conjuntos' },
  { id: 'range', label: '[a-z]', insert: '[a-z]', description: 'Range de caracteres', group: 'Conjuntos' },
  // Lookaround
  { id: 'lookahead-pos', label: '(?=...)', insert: '(?=)', description: 'Lookahead positivo', group: 'Lookaround' },
  { id: 'lookahead-neg', label: '(?!...)', insert: '(?!)', description: 'Lookahead negativo', group: 'Lookaround' },
  { id: 'lookbehind-pos', label: '(?<=...)', insert: '(?<=)', description: 'Lookbehind positivo ⚠️', group: 'Lookaround' },
  { id: 'lookbehind-neg', label: '(?<!...)', insert: '(?<!)', description: 'Lookbehind negativo ⚠️', group: 'Lookaround' },
  // Escape
  { id: 'escape-dot', label: '\\.', insert: '\\.', description: 'Ponto literal', group: 'Escape' },
  { id: 'escape-paren', label: '\\(', insert: '\\(', description: 'Parêntese literal', group: 'Escape' },
  { id: 'escape-bracket', label: '\\[', insert: '\\[', description: 'Colchete literal', group: 'Escape' },
  { id: 'escape-backslash', label: '\\\\', insert: '\\\\', description: 'Barra invertida', group: 'Escape' },
];
