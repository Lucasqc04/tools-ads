export const CAPTION_LIMIT = 2200;

/** Aproximação da prévia: a legenda do feed mostra um trecho e um link “mais”. */
export const FEED_CAPTION_PREVIEW_CHARS = 125;

export const countCaptionCharacters = (text: string): number => [...text].length;

export type FeedCaption = {
  visible: string;
  hasMore: boolean;
};

/** Corta no primeiro quebra de linha ou no limite de caracteres, o que vier antes. */
export const splitCaptionForFeed = (text: string, limit = FEED_CAPTION_PREVIEW_CHARS): FeedCaption => {
  const firstBreak = text.indexOf('\n');
  const cut = firstBreak >= 0 && firstBreak < limit ? firstBreak : limit;

  if (text.length <= cut) {
    return { visible: text, hasMore: false };
  }

  return { visible: text.slice(0, cut).trimEnd(), hasMore: true };
};

/** Nome de usuário no formato do Instagram: letras minúsculas, números, ponto e underline. */
export const normalizeUsername = (value: string): string => {
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/^@+/, '')
    .replace(/[^a-z0-9._]/g, '')
    .slice(0, 30);

  return cleaned || 'seu.perfil';
};

/** Lista de marcações separadas por vírgula ou espaço. Retorna nomes já normalizados e sem repetição. */
export const parseTags = (raw: string, max = 10): string[] => {
  const names = raw
    .split(/[,\s]+/)
    .map((item) => item.replace(/^@+/, '').replace(/[^a-zA-Z0-9._]/g, '').slice(0, 30))
    .filter(Boolean);

  return [...new Set(names)].slice(0, max);
};

/** Separa a legenda em partes para destacar #hashtags e @menções. O texto nunca vira HTML. */
export type CaptionToken = { type: 'text' | 'hashtag' | 'mention'; value: string };

export const tokenizeCaption = (text: string): CaptionToken[] =>
  text
    .split(/(\s+)/)
    .filter((part) => part.length > 0)
    .map((part) => {
      if (part.length > 1 && part.startsWith('#')) return { type: 'hashtag', value: part };
      if (part.length > 1 && part.startsWith('@')) return { type: 'mention', value: part };
      return { type: 'text', value: part };
    });
