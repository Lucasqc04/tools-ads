export type CharacterCounterMode =
  | 'simple'
  | 'advanced'
  | 'programming'
  | 'seo'
  | 'social'
  | 'writing';

export type CharacterCounterPresetId =
  | 'general'
  | 'seo-title'
  | 'seo-meta-description'
  | 'seo-h1'
  | 'instagram-caption'
  | 'x-post'
  | 'youtube-description'
  | 'linkedin-post'
  | 'whatsapp-message'
  | 'sms';

export type CharacterCounterPreset = {
  id: CharacterCounterPresetId;
  mode: CharacterCounterMode;
  label: string;
  min?: number;
  idealMin?: number;
  idealMax?: number;
  max?: number;
  note?: string;
};

export type TextBasicMetrics = {
  charactersWithSpaces: number;
  charactersWithoutSpaces: number;
  visualCharacters: number;
  words: number;
  uniqueWords: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  spaces: number;
  lineBreaks: number;
  numbers: number;
  letters: number;
  punctuation: number;
  symbols: number;
  emojis: number;
  hashtags: number;
  mentions: number;
  urls: number;
  emails: number;
  phones: number;
  dates: number;
  bytesUtf8: number;
  kilobytesUtf8: number;
  megabytesUtf8: number;
  readingTimeSeconds: number;
  speakingTimeSeconds: number;
};

export type ProgrammingMetrics = {
  emptyLines: number;
  codeLines: number;
  commentLines: number;
  tabCount: number;
  doubleSpaces: number;
  trailingSpacesLines: number;
};

export type RepeatedWord = {
  word: string;
  count: number;
  percentage: number;
};

export type CounterAnalysis = {
  metrics: TextBasicMetrics;
  programming: ProgrammingMetrics;
  topWords: RepeatedWord[];
  repeatedWords: RepeatedWord[];
  longSentences: number;
  longParagraphs: number;
  invisibleCharacters: Record<string, number>;
};

export type LimitStatus = 'too-short' | 'ideal' | 'near-limit' | 'over-limit' | 'ok';

export type LimitEvaluation = {
  status: LimitStatus;
  progressPercent: number;
  current: number;
  min?: number;
  idealMin?: number;
  idealMax?: number;
  max?: number;
  remainingToMax?: number;
  exceededBy?: number;
};

const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
const emailRegex = /\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b/g;
const hashtagRegex = /(^|\s)#([\p{L}\p{N}_-]+)/gu;
const mentionRegex = /(^|\s)@([\p{L}\p{N}_.-]+)/gu;
const phoneRegex = /\+?\d[\d\s().-]{7,}\d/g;
const dateRegex = /\b(?:\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4}|\d{4}-\d{2}-\d{2})\b/g;
const punctuationRegex = /[.,!?;:]/g;
const symbolRegex = /[@#$%&*+=<>~^|`]+/g;
const lineCommentRegex = /^\s*(?:\/\/|#|--|;)/;
const htmlRegex = /<[^>]*>/g;
const markdownRegex = /[`*_#>[\]()~-]/g;
const emojiRegex = /\p{Extended_Pictographic}/gu;
const invisibleCharSet = new Set(['\u200B', '\u200C', '\u200D', '\u2060', '\uFEFF']);

const commonStopwords = new Set([
  'a',
  'o',
  'e',
  'de',
  'do',
  'da',
  'dos',
  'das',
  'em',
  'para',
  'por',
  'the',
  'and',
  'to',
  'of',
  'in',
]);

const segmentBy = (text: string, granularity: Intl.SegmenterOptions['granularity']) => {
  try {
    const segmenter = new Intl.Segmenter(undefined, { granularity });
    return Array.from(segmenter.segment(text));
  } catch {
    return [];
  }
};

const countVisualCharacters = (text: string): number => {
  const segments = segmentBy(text, 'grapheme');
  if (segments.length > 0) {
    return segments.length;
  }

  return Array.from(text).length;
};

const tokenizeWords = (text: string): string[] => {
  const segments = segmentBy(text, 'word');
  if (segments.length > 0) {
    return segments
      .filter((segment) => Boolean(segment.isWordLike))
      .map((segment) => segment.segment.toLowerCase());
  }

  const fallback = text.toLowerCase().match(/[\p{L}\p{N}_'-]+/gu);
  return fallback ?? [];
};

const splitSentences = (text: string): string[] => {
  const segments = segmentBy(text, 'sentence');
  if (segments.length > 0) {
    return segments.map((segment) => segment.segment.trim()).filter(Boolean);
  }

  return text
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalizeWord = (word: string): string =>
  word
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .toLowerCase();

const topRepeatedWords = (words: string[], limit = 12): RepeatedWord[] => {
  const total = words.length || 1;
  const map = new Map<string, number>();

  for (const rawWord of words) {
    const normalized = normalizeWord(rawWord);
    if (!normalized || commonStopwords.has(normalized)) {
      continue;
    }

    map.set(normalized, (map.get(normalized) ?? 0) + 1);
  }

  return Array.from(map.entries())
    .map(([word, count]) => ({
      word,
      count,
      percentage: Number(((count / total) * 100).toFixed(2)),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

const countRegex = (text: string, regex: RegExp): number => {
  const cloned = new RegExp(regex.source, regex.flags);
  const match = text.match(cloned);
  return match?.length ?? 0;
};

const countInvisible = (text: string): Record<string, number> => {
  const counts = {
    normalSpace: 0,
    nonBreakingSpace: 0,
    zeroWidthSpace: 0,
    zeroWidthJoiner: 0,
    tab: 0,
    lineBreak: 0,
    controlChars: 0,
  };

  for (const char of Array.from(text)) {
    switch (char) {
      case ' ':
        counts.normalSpace += 1;
        break;
      case '\u00A0':
        counts.nonBreakingSpace += 1;
        break;
      case '\u200B':
        counts.zeroWidthSpace += 1;
        break;
      case '\u200D':
        counts.zeroWidthJoiner += 1;
        break;
      case '\t':
        counts.tab += 1;
        break;
      case '\n':
        counts.lineBreak += 1;
        break;
      default: {
        const code = char.codePointAt(0) ?? 0;
        if ((code >= 0 && code <= 31) || code === 127) {
          counts.controlChars += 1;
        }
      }
    }
  }

  return counts;
};

const countProgrammingMetrics = (text: string): ProgrammingMetrics => {
  const lines = text.length ? text.split(/\r?\n/) : [];
  let emptyLines = 0;
  let codeLines = 0;
  let commentLines = 0;
  let trailingSpacesLines = 0;

  for (const line of lines) {
    if (!line.trim()) {
      emptyLines += 1;
      continue;
    }

    if (/\s+$/.test(line)) {
      trailingSpacesLines += 1;
    }

    if (lineCommentRegex.test(line.trim())) {
      commentLines += 1;
    } else {
      codeLines += 1;
    }
  }

  return {
    emptyLines,
    codeLines,
    commentLines,
    tabCount: countRegex(text, /\t/g),
    doubleSpaces: countRegex(text, / {2,}/g),
    trailingSpacesLines,
  };
};

export const analyzeText = (text = ''): CounterAnalysis => {
  const normalized = text;
  const words = tokenizeWords(normalized);
  const sentences = splitSentences(normalized);
  const paragraphs = normalized
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);
  const lines = normalized.length ? normalized.split(/\r?\n/) : [];

  const bytes = new TextEncoder().encode(normalized).length;
  const topWords = topRepeatedWords(words, 12);
  const repeatedWords = topWords.filter((item) => item.count > 1).slice(0, 8);

  const longSentences = sentences.filter((sentence) => tokenizeWords(sentence).length > 28).length;
  const longParagraphs = paragraphs.filter((paragraph) => tokenizeWords(paragraph).length > 90).length;

  return {
    metrics: {
      charactersWithSpaces: normalized.length,
      charactersWithoutSpaces: normalized.replace(/\s/g, '').length,
      visualCharacters: countVisualCharacters(normalized),
      words: words.length,
      uniqueWords: new Set(words.map((word) => normalizeWord(word)).filter(Boolean)).size,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      lines: lines.length,
      spaces: countRegex(normalized, / /g),
      lineBreaks: countRegex(normalized, /\n/g),
      numbers: countRegex(normalized, /\d/g),
      letters: countRegex(normalized, /\p{L}/gu),
      punctuation: countRegex(normalized, punctuationRegex),
      symbols: countRegex(normalized, symbolRegex),
      emojis: countRegex(normalized, emojiRegex),
      hashtags: countRegex(normalized, hashtagRegex),
      mentions: countRegex(normalized, mentionRegex),
      urls: countRegex(normalized, urlRegex),
      emails: countRegex(normalized, emailRegex),
      phones: countRegex(normalized, phoneRegex),
      dates: countRegex(normalized, dateRegex),
      bytesUtf8: bytes,
      kilobytesUtf8: Number((bytes / 1024).toFixed(2)),
      megabytesUtf8: Number((bytes / (1024 * 1024)).toFixed(4)),
      readingTimeSeconds: Math.max(1, Math.round((words.length / 200) * 60)),
      speakingTimeSeconds: Math.max(1, Math.round((words.length / 130) * 60)),
    },
    programming: countProgrammingMetrics(normalized),
    topWords,
    repeatedWords,
    longSentences,
    longParagraphs,
    invisibleCharacters: countInvisible(normalized),
  };
};

export const evaluateLimit = (
  current: number,
  preset?: CharacterCounterPreset,
): LimitEvaluation => {
  const base = {
    current,
    min: preset?.min,
    idealMin: preset?.idealMin,
    idealMax: preset?.idealMax,
    max: preset?.max,
  };

  if (!preset) {
    return {
      status: 'ok',
      progressPercent: 0,
      ...base,
    };
  }

  const max = preset.max;
  const idealMin = preset.idealMin;
  const idealMax = preset.idealMax;
  const min = preset.min;
  const progress = max ? Math.min(100, Math.round((current / max) * 100)) : 0;

  const withStatus = (status: LimitStatus, extra?: Partial<LimitEvaluation>): LimitEvaluation => ({
    status,
    progressPercent: status === 'over-limit' ? 100 : progress,
    ...base,
    remainingToMax: max ? Math.max(0, max - current) : undefined,
    ...extra,
  });

  if (max && current > max) {
    return withStatus('over-limit', {
      exceededBy: current - max,
      remainingToMax: 0,
    });
  }

  if (min && current < min) {
    return withStatus('too-short');
  }

  if (idealMin && idealMax && current >= idealMin && current <= idealMax) {
    return withStatus('ideal');
  }

  if (idealMax && current > idealMax) {
    return withStatus('near-limit');
  }

  return withStatus('ok');
};

export const splitTextByLimit = (
  text: string,
  limit: number,
  numbered = true,
): string[] => {
  const source = text.trim();
  if (!source || limit <= 0) {
    return [];
  }

  const words = source.split(/\s+/);
  const chunks: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;

    if (candidate.length <= limit) {
      current = candidate;
      continue;
    }

    if (current) {
      chunks.push(current);
      current = word;
      continue;
    }

    chunks.push(word.slice(0, limit));
    current = word.slice(limit);
  }

  if (current) {
    chunks.push(current);
  }

  if (!numbered || chunks.length <= 1) {
    return chunks;
  }

  return chunks.map((chunk, index) => `${index + 1}/${chunks.length} ${chunk}`);
};

export const textTransforms = {
  removeDuplicateSpaces: (text: string) => text.replace(/ {2,}/g, ' '),
  removeLineBreaks: (text: string) => text.replace(/\r?\n+/g, ' '),
  removeEmptyLines: (text: string) => text.replace(/(^\s*\r?\n)+/gm, ''),
  trimEachLine: (text: string) =>
    text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .join('\n'),
  removeHtml: (text: string) => text.replace(htmlRegex, ''),
  removeMarkdown: (text: string) => text.replace(markdownRegex, ''),
  removeEmojis: (text: string) => text.replace(emojiRegex, ''),
  removeLinks: (text: string) => text.replace(urlRegex, ''),
  removeHashtags: (text: string) => text.replace(hashtagRegex, '$1'),
  removeMentions: (text: string) => text.replace(mentionRegex, '$1'),
  removeAccents: (text: string) =>
    text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''),
  removeInvisibleChars: (text: string) =>
    Array.from(text)
      .filter((char) => !invisibleCharSet.has(char))
      .join(''),
  toUpperCase: (text: string) => text.toUpperCase(),
  toLowerCase: (text: string) => text.toLowerCase(),
  capitalizeSentence: (text: string) =>
    text.toLowerCase().replace(/(^|[.!?]\s+)([a-z\p{L}])/gu, (_, prefix, char: string) => `${prefix}${char.toUpperCase()}`),
  titleCase: (text: string) =>
    text.toLowerCase().replace(/\b([a-z\p{L}])/gu, (match) => match.toUpperCase()),
  reverseText: (text: string) => Array.from(text).reverse().join(''),
  toSlug: (text: string) =>
    text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-'),
};

export const toSnakeCase = (text: string): string => textTransforms.toSlug(text).replaceAll('-', '_');

export const toCamelCase = (text: string): string => {
  const slug = textTransforms.toSlug(text);
  return slug.replace(/-([a-z0-9])/g, (_, char: string) => char.toUpperCase());
};

export const toPascalCase = (text: string): string => {
  const camel = toCamelCase(text);
  if (!camel) {
    return '';
  }

  return camel[0].toUpperCase() + camel.slice(1);
};

export const toConstantCase = (text: string): string => toSnakeCase(text).toUpperCase();
