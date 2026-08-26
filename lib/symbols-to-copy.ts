import type { AppLocale } from '@/lib/i18n/config';

export type SymbolCategoryId =
  | 'arrows'
  | 'hearts'
  | 'stars'
  | 'math'
  | 'currency'
  | 'check-cross'
  | 'lines-borders'
  | 'music'
  | 'zodiac'
  | 'greek'
  | 'bullets'
  | 'chess-game';

export type SymbolCategory = {
  id: SymbolCategoryId;
  slugWordByLocale: Record<AppLocale, string>;
  labelByLocale: Record<AppLocale, string>;
  searchTermsByLocale: Record<AppLocale, string[]>;
  symbols: string[];
};

export type CopyFormat = 'raw' | 'html-entity' | 'codepoint';

export const symbolCategories: SymbolCategory[] = [
  {
    id: 'arrows',
    slugWordByLocale: { 'pt-br': 'seta', en: 'arrow', es: 'flecha' },
    labelByLocale: { 'pt-br': 'Setas', en: 'Arrows', es: 'Flechas' },
    searchTermsByLocale: {
      'pt-br': ['seta', 'direcao', 'navegacao'],
      en: ['arrow', 'direction', 'pointer'],
      es: ['flecha', 'direccion', 'puntero'],
    },
    symbols: [
      '←', '→', '↑', '↓', '↔', '↕', '↖', '↗', '↘', '↙', '⇐', '⇒', '⇑', '⇓',
      '⇔', '⇕', '➔', '➜', '➝', '➞', '➟', '➠', '➡', '➢', '➣', '➤', '↩', '↪',
      '↺', '↻', '⤴', '⤵', '⇦', '⇧', '⇨', '⇩', '⟵', '⟶', '⟷', '↦',
    ],
  },
  {
    id: 'hearts',
    slugWordByLocale: { 'pt-br': 'coracao', en: 'heart', es: 'corazon' },
    labelByLocale: { 'pt-br': 'Corações', en: 'Hearts', es: 'Corazones' },
    searchTermsByLocale: {
      'pt-br': ['coracao', 'amor', 'paixao'],
      en: ['heart', 'love', 'romance'],
      es: ['corazon', 'amor', 'romance'],
    },
    symbols: [
      '♥', '♡', '❤', '❣', '❥', '❦', '❧', 'ღ', '💛', '💚', '💙', '💜', '🖤',
      '🤍', '🤎', '💔', '💕', '💞', '💓', '💗', '💖', '💘', '💝',
    ],
  },
  {
    id: 'stars',
    slugWordByLocale: { 'pt-br': 'estrela', en: 'star', es: 'estrella' },
    labelByLocale: { 'pt-br': 'Estrelas', en: 'Stars', es: 'Estrellas' },
    searchTermsByLocale: {
      'pt-br': ['estrela', 'brilho', 'destaque'],
      en: ['star', 'sparkle', 'favorite'],
      es: ['estrella', 'brillo', 'favorito'],
    },
    symbols: [
      '★', '☆', '✦', '✧', '✩', '✪', '✫', '✬', '✭', '✮', '✯', '✰', '⭐',
      '🌟', '✡', '🔯', '⚝', '✴', '✵', '✶', '✷', '✸', '✹',
    ],
  },
  {
    id: 'math',
    slugWordByLocale: { 'pt-br': 'matematico', en: 'math', es: 'matematico' },
    labelByLocale: { 'pt-br': 'Matemáticos', en: 'Math', es: 'Matemáticos' },
    searchTermsByLocale: {
      'pt-br': ['matematica', 'algebra', 'calculo'],
      en: ['math', 'algebra', 'calculus'],
      es: ['matematica', 'algebra', 'calculo'],
    },
    symbols: [
      '±', '×', '÷', '=', '≠', '≈', '≡', '≤', '≥', '<', '>', '√', '∛', '∜',
      '∞', '∑', '∏', '∫', '∂', '∇', '∆', '°', '‰', '‱', 'π', '∈', '∉', '⊂',
      '⊃', '⊆', '⊇', '∪', '∩', '∅', '∀', '∃', '¬', '∧', '∨', '⊕', '⊗', '⊥',
      '∥', '∝', '∴', '∵', '½', '⅓', '⅔', '¼', '¾',
    ],
  },
  {
    id: 'currency',
    slugWordByLocale: { 'pt-br': 'moeda', en: 'currency', es: 'moneda' },
    labelByLocale: { 'pt-br': 'Moedas', en: 'Currency', es: 'Monedas' },
    searchTermsByLocale: {
      'pt-br': ['moeda', 'dinheiro', 'preco'],
      en: ['currency', 'money', 'price'],
      es: ['moneda', 'dinero', 'precio'],
    },
    symbols: [
      '$', '€', '£', '¥', '¢', '₹', '₩', '₽', '₺', '₴', '₦', '₫', '₱', '₲',
      '₪', '₡', '฿', '₭', '₮', '₸', '₼', '₾', '¤', 'ƒ',
    ],
  },
  {
    id: 'check-cross',
    slugWordByLocale: {
      'pt-br': 'certo-e-errado',
      en: 'check-mark',
      es: 'marca-de-verificacion',
    },
    labelByLocale: {
      'pt-br': 'Certo e Errado',
      en: 'Check Marks',
      es: 'Marcas de Verificación',
    },
    searchTermsByLocale: {
      'pt-br': ['certo', 'errado', 'check', 'x'],
      en: ['check', 'tick', 'cross', 'x'],
      es: ['correcto', 'incorrecto', 'check', 'x'],
    },
    symbols: [
      '✓', '✔', '✗', '✘', '☑', '☒', '✕', '✖', '❌', '✅', '☓', '✚', '✜',
      '✛', '✝', '✞', '✟', '†', '‡',
    ],
  },
  {
    id: 'lines-borders',
    slugWordByLocale: {
      'pt-br': 'linha-e-borda',
      en: 'line-border',
      es: 'linea-y-borde',
    },
    labelByLocale: {
      'pt-br': 'Linhas e Bordas',
      en: 'Lines & Borders',
      es: 'Líneas y Bordes',
    },
    searchTermsByLocale: {
      'pt-br': ['linha', 'borda', 'moldura', 'tabela'],
      en: ['line', 'border', 'frame', 'table'],
      es: ['linea', 'borde', 'marco', 'tabla'],
    },
    symbols: [
      '─', '│', '┌', '┐', '└', '┘', '├', '┤', '┬', '┴', '┼', '═', '║', '╔',
      '╗', '╚', '╝', '╠', '╣', '╦', '╩', '╬', '▬', '▭', '▮', '▯', '▰', '▱',
      '░', '▒', '▓', '█', '▄', '▀', '▌', '▐', '•', '·',
    ],
  },
  {
    id: 'music',
    slugWordByLocale: { 'pt-br': 'musica', en: 'music', es: 'musica' },
    labelByLocale: { 'pt-br': 'Música', en: 'Music', es: 'Música' },
    searchTermsByLocale: {
      'pt-br': ['musica', 'nota', 'som'],
      en: ['music', 'note', 'sound'],
      es: ['musica', 'nota', 'sonido'],
    },
    symbols: ['♩', '♪', '♫', '♬', '♭', '♮', '♯', '🎵', '🎶', '🎼', '🎹', '🎸', '🎤', '🎧'],
  },
  {
    id: 'zodiac',
    slugWordByLocale: { 'pt-br': 'zodiaco', en: 'zodiac', es: 'zodiaco' },
    labelByLocale: { 'pt-br': 'Zodíaco', en: 'Zodiac', es: 'Zodiaco' },
    searchTermsByLocale: {
      'pt-br': ['zodiaco', 'signo', 'horoscopo'],
      en: ['zodiac', 'sign', 'horoscope'],
      es: ['zodiaco', 'signo', 'horoscopo'],
    },
    symbols: ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '⛎'],
  },
  {
    id: 'greek',
    slugWordByLocale: {
      'pt-br': 'letra-grega',
      en: 'greek-letter',
      es: 'letra-griega',
    },
    labelByLocale: {
      'pt-br': 'Letras Gregas',
      en: 'Greek Letters',
      es: 'Letras Griegas',
    },
    searchTermsByLocale: {
      'pt-br': ['grego', 'alfabeto', 'letra'],
      en: ['greek', 'alphabet', 'letter'],
      es: ['griego', 'alfabeto', 'letra'],
    },
    symbols: [
      'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ',
      'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω', 'Α', 'Β', 'Γ', 'Δ',
      'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ',
      'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω',
    ],
  },
  {
    id: 'bullets',
    slugWordByLocale: {
      'pt-br': 'marcador-de-lista',
      en: 'bullet-point',
      es: 'vineta',
    },
    labelByLocale: {
      'pt-br': 'Marcadores de Lista',
      en: 'Bullet Points',
      es: 'Viñetas',
    },
    searchTermsByLocale: {
      'pt-br': ['marcador', 'lista', 'topico'],
      en: ['bullet', 'list', 'point'],
      es: ['vineta', 'lista', 'punto'],
    },
    symbols: [
      '•', '◦', '‣', '⁃', '∙', '○', '●', '◆', '◇', '■', '□', '▪', '▫', '►',
      '◄', '➤', '➢', '➣', '⁕', '❖',
    ],
  },
  {
    id: 'chess-game',
    slugWordByLocale: {
      'pt-br': 'xadrez-e-jogos',
      en: 'chess-and-game',
      es: 'ajedrez-y-juegos',
    },
    labelByLocale: {
      'pt-br': 'Xadrez e Jogos',
      en: 'Chess & Game',
      es: 'Ajedrez y Juegos',
    },
    searchTermsByLocale: {
      'pt-br': ['xadrez', 'peca', 'dado', 'carta'],
      en: ['chess', 'piece', 'dice', 'card'],
      es: ['ajedrez', 'pieza', 'dado', 'carta'],
    },
    symbols: [
      '♔', '♕', '♖', '♗', '♘', '♙', '♚', '♛', '♜', '♝', '♞', '♟', '⚀', '⚁',
      '⚂', '⚃', '⚄', '⚅', '♠', '♣', '♦', '🀄',
    ],
  },
];

const categoryById = new Map(symbolCategories.map((category) => [category.id, category]));

export const getSymbolCategoryById = (id: string): SymbolCategory | undefined =>
  categoryById.get(id as SymbolCategoryId);

const normalize = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

export const searchSymbolCategories = (
  query: string,
  locale: AppLocale,
): SymbolCategory[] => {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return symbolCategories;
  }

  return symbolCategories.filter((category) => {
    const haystack = [
      category.labelByLocale[locale],
      category.slugWordByLocale[locale],
      ...category.searchTermsByLocale[locale],
    ]
      .map(normalize)
      .join(' ');

    return haystack.includes(normalizedQuery);
  });
};

export const toHtmlEntity = (symbol: string): string =>
  Array.from(symbol)
    .map((char) => `&#${char.codePointAt(0) ?? 0};`)
    .join('');

export const toUnicodeCodepoint = (symbol: string): string =>
  Array.from(symbol)
    .map((char) => `U+${(char.codePointAt(0) ?? 0).toString(16).toUpperCase().padStart(4, '0')}`)
    .join(' ');

export const formatSymbol = (symbol: string, format: CopyFormat): string => {
  if (format === 'html-entity') {
    return toHtmlEntity(symbol);
  }

  if (format === 'codepoint') {
    return toUnicodeCodepoint(symbol);
  }

  return symbol;
};

export const formatSymbolSequence = (sequence: string, format: CopyFormat): string => {
  if (format === 'raw') {
    return sequence;
  }

  const joiner = format === 'codepoint' ? ' ' : '';
  return Array.from(sequence)
    .map((char) => formatSymbol(char, format))
    .join(joiner);
};

const MAX_RECENT_SYMBOLS = 24;

export const pushRecentSymbol = (recent: string[], symbol: string): string[] => {
  const withoutDuplicate = recent.filter((item) => item !== symbol);
  return [symbol, ...withoutDuplicate].slice(0, MAX_RECENT_SYMBOLS);
};
