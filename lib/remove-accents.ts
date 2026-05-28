const removeDiacritics = (value: string): string =>
  value
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .replaceAll('ç', 'c')
    .replaceAll('Ç', 'C');

const removeEmoji = (value: string): string => value.replaceAll(/[\p{Extended_Pictographic}\uFE0F]/gu, '');

const removePunctuation = (value: string): string => value.replaceAll(/[.,!?;:()[\]{}"'`´~^]/g, '');

export type RemoveAccentsOptions = {
  mode: 'keep-case' | 'lowercase' | 'uppercase';
  removeSymbols: boolean;
  removePunct: boolean;
  removeEmojis: boolean;
  collapseSpaces: boolean;
  spaceReplacement: 'none' | '-' | '_';
  toSlug: boolean;
};

export type RemoveAccentsResult = {
  value: string;
  changedCount: number;
  alreadyClean: boolean;
};

const applyCaseMode = (value: string, mode: RemoveAccentsOptions['mode']): string => {
  if (mode === 'lowercase') {
    return value.toLowerCase();
  }

  if (mode === 'uppercase') {
    return value.toUpperCase();
  }

  return value;
};

export const removeAccentsText = (
  input: string,
  options: RemoveAccentsOptions,
): RemoveAccentsResult => {
  const original = input ?? '';
  let value = removeDiacritics(original);

  if (options.removeEmojis) {
    value = removeEmoji(value);
  }

  if (options.removePunct) {
    value = removePunctuation(value);
  }

  if (options.removeSymbols) {
    value = value.replaceAll(/[^\p{L}\p{N}\s_-]/gu, '');
  }

  if (options.collapseSpaces) {
    value = value.replaceAll(/\s+/g, ' ').trim();
  }

  if (options.spaceReplacement !== 'none') {
    value = value.replaceAll(/\s+/g, options.spaceReplacement);
  }

  value = applyCaseMode(value, options.mode);

  if (options.toSlug) {
    value = value
      .toLowerCase()
      .replaceAll(/[^a-z0-9\s-]/g, ' ')
      .replaceAll(/\s+/g, '-')
      .replaceAll(/-+/g, '-')
      .replaceAll(/^-+|-+$/g, '');
  }

  let changedCount = 0;
  const max = Math.max(original.length, value.length);

  for (let idx = 0; idx < max; idx += 1) {
    if ((original[idx] ?? '') !== (value[idx] ?? '')) {
      changedCount += 1;
    }
  }

  return {
    value,
    changedCount,
    alreadyClean: changedCount === 0,
  };
};
