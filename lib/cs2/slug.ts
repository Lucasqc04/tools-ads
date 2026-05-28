export const normalizeCs2SlugToken = (value: string): string =>
  value
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

export const buildCs2PlayerAliasSet = (aliases: string[]): Set<string> =>
  new Set(aliases.map((alias) => normalizeCs2SlugToken(alias)).filter(Boolean));
