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
    slugWordByLocale: { 'pt-br': 'seta', en: 'arrow', es: 'flecha' , zh: '箭头' },
    labelByLocale: { 'pt-br': 'Setas', en: 'Arrows', es: 'Flechas' , zh: '箭头' },
    searchTermsByLocale: {
      'pt-br': ['seta', 'direcao', 'navegacao'],
      en: ['arrow', 'direction', 'pointer'],
      es: ['flecha', 'direccion', 'puntero'],
      zh: ['箭头', '方向', '指针'],
    },
    symbols: [
      '←', '→', '↑', '↓', '↔', '↕', '↖', '↗', '↘', '↙', '⇐', '⇒', '⇑', '⇓',
      '⇔', '⇕', '➔', '➜', '➝', '➞', '➟', '➠', '➡', '➢', '➣', '➤', '↩', '↪',
      '↺', '↻', '⤴', '⤵', '⇦', '⇧', '⇨', '⇩', '⟵', '⟶', '⟷', '↦',
    ],
  },
  {
    id: 'hearts',
    slugWordByLocale: { 'pt-br': 'coracao', en: 'heart', es: 'corazon' , zh: '爱心' },
    labelByLocale: { 'pt-br': 'Corações', en: 'Hearts', es: 'Corazones' , zh: '爱心' },
    searchTermsByLocale: {
      'pt-br': ['coracao', 'amor', 'paixao'],
      en: ['heart', 'love', 'romance'],
      es: ['corazon', 'amor', 'romance'],
      zh: ['爱心', '爱情', '浪漫'],
    },
    symbols: [
      '♥', '♡', '❤', '❣', '❥', '❦', '❧', 'ღ', '💛', '💚', '💙', '💜', '🖤',
      '🤍', '🤎', '💔', '💕', '💞', '💓', '💗', '💖', '💘', '💝',
    ],
  },
  {
    id: 'stars',
    slugWordByLocale: { 'pt-br': 'estrela', en: 'star', es: 'estrella' , zh: '星星' },
    labelByLocale: { 'pt-br': 'Estrelas', en: 'Stars', es: 'Estrellas' , zh: '星星' },
    searchTermsByLocale: {
      'pt-br': ['estrela', 'brilho', 'destaque'],
      en: ['star', 'sparkle', 'favorite'],
      es: ['estrella', 'brillo', 'favorito'],
      zh: ['星星', '闪耀', '收藏'],
    },
    symbols: [
      '★', '☆', '✦', '✧', '✩', '✪', '✫', '✬', '✭', '✮', '✯', '✰', '⭐',
      '🌟', '✡', '🔯', '⚝', '✴', '✵', '✶', '✷', '✸', '✹',
    ],
  },
  {
    id: 'math',
    slugWordByLocale: { 'pt-br': 'matematico', en: 'math', es: 'matematico' , zh: '数学' },
    labelByLocale: { 'pt-br': 'Matemáticos', en: 'Math', es: 'Matemáticos' , zh: '数学符号' },
    searchTermsByLocale: {
      'pt-br': ['matematica', 'algebra', 'calculo'],
      en: ['math', 'algebra', 'calculus'],
      es: ['matematica', 'algebra', 'calculo'],
      zh: ['数学', '代数', '微积分'],
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
    slugWordByLocale: { 'pt-br': 'moeda', en: 'currency', es: 'moneda' , zh: '货币' },
    labelByLocale: { 'pt-br': 'Moedas', en: 'Currency', es: 'Monedas' , zh: '货币符号' },
    searchTermsByLocale: {
      'pt-br': ['moeda', 'dinheiro', 'preco'],
      en: ['currency', 'money', 'price'],
      es: ['moneda', 'dinero', 'precio'],
      zh: ['货币', '金钱', '价格'],
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
      zh: '对错标记',
    },
    labelByLocale: {
      'pt-br': 'Certo e Errado',
      en: 'Check Marks',
      es: 'Marcas de Verificación',
      zh: '对错标记',
    },
    searchTermsByLocale: {
      'pt-br': ['certo', 'errado', 'check', 'x'],
      en: ['check', 'tick', 'cross', 'x'],
      es: ['correcto', 'incorrecto', 'check', 'x'],
      zh: ['对勾', '错误', 'check', '叉'],
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
      zh: '线条边框',
    },
    labelByLocale: {
      'pt-br': 'Linhas e Bordas',
      en: 'Lines & Borders',
      es: 'Líneas y Bordes',
      zh: '线条与边框',
    },
    searchTermsByLocale: {
      'pt-br': ['linha', 'borda', 'moldura', 'tabela'],
      en: ['line', 'border', 'frame', 'table'],
      es: ['linea', 'borde', 'marco', 'tabla'],
      zh: ['线条', '边框', '装饰', '表格'],
    },
    symbols: [
      '─', '│', '┌', '┐', '└', '┘', '├', '┤', '┬', '┴', '┼', '═', '║', '╔',
      '╗', '╚', '╝', '╠', '╣', '╦', '╩', '╬', '▬', '▭', '▮', '▯', '▰', '▱',
      '░', '▒', '▓', '█', '▄', '▀', '▌', '▐', '•', '·',
    ],
  },
  {
    id: 'music',
    slugWordByLocale: { 'pt-br': 'musica', en: 'music', es: 'musica' , zh: '音乐' },
    labelByLocale: { 'pt-br': 'Música', en: 'Music', es: 'Música' , zh: '音乐' },
    searchTermsByLocale: {
      'pt-br': ['musica', 'nota', 'som'],
      en: ['music', 'note', 'sound'],
      es: ['musica', 'nota', 'sonido'],
      zh: ['音乐', '音符', '声音'],
    },
    symbols: ['♩', '♪', '♫', '♬', '♭', '♮', '♯', '🎵', '🎶', '🎼', '🎹', '🎸', '🎤', '🎧'],
  },
  {
    id: 'zodiac',
    slugWordByLocale: { 'pt-br': 'zodiaco', en: 'zodiac', es: 'zodiaco' , zh: '星座' },
    labelByLocale: { 'pt-br': 'Zodíaco', en: 'Zodiac', es: 'Zodiaco' , zh: '星座' },
    searchTermsByLocale: {
      'pt-br': ['zodiaco', 'signo', 'horoscopo'],
      en: ['zodiac', 'sign', 'horoscope'],
      es: ['zodiaco', 'signo', 'horoscopo'],
      zh: ['星座', '生肖', '占星'],
    },
    symbols: ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '⛎'],
  },
  {
    id: 'greek',
    slugWordByLocale: {
      'pt-br': 'letra-grega',
      en: 'greek-letter',
      es: 'letra-griega',
      zh: '希腊字母',
    },
    labelByLocale: {
      'pt-br': 'Letras Gregas',
      en: 'Greek Letters',
      es: 'Letras Griegas',
      zh: '希腊字母',
    },
    searchTermsByLocale: {
      'pt-br': ['grego', 'alfabeto', 'letra'],
      en: ['greek', 'alphabet', 'letter'],
      es: ['griego', 'alfabeto', 'letra'],
      zh: ['希腊', '字母表', '字母'],
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
      zh: '项目符号',
    },
    labelByLocale: {
      'pt-br': 'Marcadores de Lista',
      en: 'Bullet Points',
      es: 'Viñetas',
      zh: '项目符号',
    },
    searchTermsByLocale: {
      'pt-br': ['marcador', 'lista', 'topico'],
      en: ['bullet', 'list', 'point'],
      es: ['vineta', 'lista', 'punto'],
      zh: ['项目符号', '列表', '要点'],
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
      zh: '棋类游戏',
    },
    labelByLocale: {
      'pt-br': 'Xadrez e Jogos',
      en: 'Chess & Game',
      es: 'Ajedrez y Juegos',
      zh: '棋类与游戏',
    },
    searchTermsByLocale: {
      'pt-br': ['xadrez', 'peca', 'dado', 'carta'],
      en: ['chess', 'piece', 'dice', 'card'],
      es: ['ajedrez', 'pieza', 'dado', 'carta'],
      zh: ['象棋', '棋子', '骰子', '扑克'],
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
