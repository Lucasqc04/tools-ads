export type SlugOptions = {
  separator: '-' | '_';
  lowercase: boolean;
  removeStopWords: boolean;
  maxLength?: number;
  keepWordBoundaries: boolean;
  removePunctuation: boolean;
  removeEmojis: boolean;
};

const stopwords = new Set([
  'a', 'o', 'as', 'os', 'de', 'da', 'do', 'das', 'dos', 'e', 'em', 'para', 'por', 'com',
  'the', 'of', 'and', 'to', 'in', 'for', 'on', 'with',
  'el', 'la', 'los', 'las', 'y', 'del', 'al',
]);

const removeDiacritics = (value: string): string =>
  value.normalize('NFD').replaceAll(/[\u0300-\u036f]/g, '');

const stripEmoji = (value: string): string => value.replaceAll(/[\p{Extended_Pictographic}\uFE0F]/gu, '');

const stripPunctuation = (value: string): string => value.replaceAll(/[.,!?;:()[\]{}"'`´~^]/g, ' ');

const cleanTokens = (value: string, removeCommonWords: boolean): string[] => {
  const tokens = value
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);

  if (!removeCommonWords) {
    return tokens;
  }

  return tokens.filter((token) => !stopwords.has(token.toLowerCase()));
};

const limitByWords = (tokens: string[], maxLength: number, separator: string): string[] => {
  const selected: string[] = [];

  tokens.forEach((token) => {
    const preview = selected.length === 0 ? token : `${selected.join(separator)}${separator}${token}`;
    if (preview.length <= maxLength) {
      selected.push(token);
    }
  });

  return selected;
};

export const buildSlug = (text: string, options: SlugOptions): string => {
  let value = text.trim();

  if (options.removeEmojis) {
    value = stripEmoji(value);
  }

  value = removeDiacritics(value);

  if (options.removePunctuation) {
    value = stripPunctuation(value);
  }

  value = value.replaceAll(/[^\p{L}\p{N}\s_-]/gu, ' ');
  value = value.replaceAll(/[_\s-]+/g, ' ').trim();

  let tokens = cleanTokens(value, options.removeStopWords);

  if (options.lowercase) {
    tokens = tokens.map((token) => token.toLowerCase());
  }

  if (tokens.length === 0) {
    return '';
  }

  if (options.maxLength && options.maxLength > 0) {
    if (options.keepWordBoundaries) {
      tokens = limitByWords(tokens, options.maxLength, options.separator);
    }
  }

  let slug = tokens.join(options.separator);

  if (options.maxLength && options.maxLength > 0 && slug.length > options.maxLength) {
    slug = slug.slice(0, options.maxLength);
    slug = slug.replaceAll(new RegExp(`${options.separator}+$`), '');
  }

  return slug;
};

export const createSlugSuggestions = (baseSlug: string): string[] => {
  const compact = baseSlug.replaceAll('-', '').replaceAll('_', '');
  const suggestions = [
    baseSlug,
    baseSlug.replaceAll('-', '_'),
    baseSlug.replaceAll('_', '-'),
    compact,
    `${baseSlug}-2026`,
  ].filter(Boolean);

  return Array.from(new Set(suggestions)).slice(0, 5);
};
