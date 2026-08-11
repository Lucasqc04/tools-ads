import type { AppLocale } from '@/lib/i18n/config';

export type NicknameSymbolCategoryId =
  | 'popular'
  | 'stars'
  | 'royal'
  | 'combat'
  | 'arrows'
  | 'brackets'
  | 'minimal'
  | 'hearts'
  | 'nature'
  | 'music'
  | 'cute'
  | 'japanese'
  | 'zodiac'
  | 'tags';

export type NicknameTextStyleId =
  | 'original'
  | 'small-caps'
  | 'fullwidth'
  | 'bold'
  | 'monospace'
  | 'serif-bold'
  | 'italic'
  | 'bold-italic'
  | 'circled'
  | 'squared'
  | 'spaced'
  | 'underlined';

export type NicknameSymbolCategory = {
  id: NicknameSymbolCategoryId;
  labelByLocale: Record<AppLocale, string>;
  symbols: string[];
};

export type NicknameFrame = {
  id: string;
  labelByLocale: Record<AppLocale, string>;
  left: string;
  right: string;
};

export type NicknameTextStyle = {
  id: NicknameTextStyleId;
  labelByLocale: Record<AppLocale, string>;
};

export type NicknameSymbolPlatform = {
  id: string;
  slug: string;
  name: string;
  featured: boolean;
  recommendedFrameIds: string[];
  recommendedStyleId: NicknameTextStyleId;
  guidanceByLocale: Record<AppLocale, string>;
  contextByLocale: Record<AppLocale, string>;
};

export type GeneratedNicknameVariant = {
  id: string;
  label: string;
  value: string;
  frameId: string;
};

export const nicknameSymbolCategories: NicknameSymbolCategory[] = [
  {
    id: 'popular',
    labelByLocale: { 'pt-br': 'Populares', en: 'Popular', es: 'Populares' },
    symbols: ['ツ', '亗', '乂', 'メ', '彡', '么', '〆', '々', 'ฬ', '乙', '࿐', '᭄', '乛', '气', 'ゞ', 'ミ'],
  },
  {
    id: 'stars',
    labelByLocale: { 'pt-br': 'Estrelas', en: 'Stars', es: 'Estrellas' },
    symbols: ['★', '☆', '✦', '✧', '✩', '✪', '✯', '✰', '⋆', '✵', '❂', '✶', '✷', '✸', '✹', '✺'],
  },
  {
    id: 'royal',
    labelByLocale: { 'pt-br': 'Coroas', en: 'Royal', es: 'Coronas' },
    symbols: ['♛', '♚', '♕', '♔', '♜', '♝', '♞', '♟', '⚜', '♠', '♦', '♣', '♤', '♢', '♧', '♙'],
  },
  {
    id: 'combat',
    labelByLocale: { 'pt-br': 'Combate', en: 'Combat', es: 'Combate' },
    symbols: ['⚔', 'ϟ', 'Ψ', '☬', '†', '‡', '⌁', '⌖', '⚡', '☠', '⛨', '⟁', '⚙', '⛓', '⚒', '⛊'],
  },
  {
    id: 'arrows',
    labelByLocale: { 'pt-br': 'Setas', en: 'Arrows', es: 'Flechas' },
    symbols: ['➤', '➜', '➳', '➶', '➷', '➹', '➺', '➻', '➼', '➽', '➸', '⇝', '⇢', '↠', '↣', '➲'],
  },
  {
    id: 'brackets',
    labelByLocale: { 'pt-br': 'Molduras', en: 'Frames', es: 'Marcos' },
    symbols: ['『', '』', '「', '」', '【', '】', '〖', '〗', '꧁', '꧂', '༺', '༻', '《', '》', '〈', '〉'],
  },
  {
    id: 'minimal',
    labelByLocale: { 'pt-br': 'Minimalistas', en: 'Minimal', es: 'Minimalistas' },
    symbols: ['•', '·', '︱', '×', '〳', '〴', '⌇', '⌁', '⸻', 'ー', '・', '＿', '〜', '〰', '○', '◇'],
  },
  {
    id: 'hearts',
    labelByLocale: { 'pt-br': 'Coracoes', en: 'Hearts', es: 'Corazones' },
    symbols: ['♡', '♥', 'ღ', '❥', '❣', 'დ', 'ෆ', '୨୧', 'ᰔ', 'ꨄ', '❦', 'ლ', '♥︎', '❤︎', '❧', '۵'],
  },
  {
    id: 'nature',
    labelByLocale: { 'pt-br': 'Natureza', en: 'Nature', es: 'Naturaleza' },
    symbols: ['✿', '❀', '❁', '❃', '❋', '❊', '☘', '♣', '☾', '☽', '☀', '☁', '❄', '☂', '☄', '𖤐'],
  },
  {
    id: 'music',
    labelByLocale: { 'pt-br': 'Musica', en: 'Music', es: 'Musica' },
    symbols: ['♪', '♫', '♬', '♩', '♭', '♮', '♯', '𝄞', '𝄢', '𝄡', '𝄐', '𝄪', '𝄫', '♭︎', '♯︎', '◖♪◗'],
  },
  {
    id: 'cute',
    labelByLocale: { 'pt-br': 'Fofos', en: 'Cute', es: 'Tiernos' },
    symbols: ['୨୧', 'ʚ', 'ɞ', '꒰', '꒱', 'ෆ', 'ᰔ', 'ꨄ', 'ღ', 'დ', 'ৎ', '୭', '໒', '১', 'ଘ', 'ଓ'],
  },
  {
    id: 'japanese',
    labelByLocale: { 'pt-br': 'Japoneses', en: 'Japanese', es: 'Japoneses' },
    symbols: ['ツ', 'シ', 'ジ', 'メ', 'ミ', '彡', '々', '〆', 'の', 'へ', 'く', 'し', '乂', '乙', '亗', '么'],
  },
  {
    id: 'zodiac',
    labelByLocale: { 'pt-br': 'Zodiaco', en: 'Zodiac', es: 'Zodiaco' },
    symbols: ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '☉', '☽', '☾', '⊙'],
  },
  {
    id: 'tags',
    labelByLocale: { 'pt-br': 'Tags e clan', en: 'Tags & clan', es: 'Tags y clan' },
    symbols: ['[', ']', '<', '>', '|', '/', '\\', '+', '=', '#', '@', '!', '?', ':', ';', '_'],
  },
];

export const nicknameFrameDefinitions: NicknameFrame[] = [
  {
    id: 'plain',
    labelByLocale: { 'pt-br': 'Sem moldura', en: 'No frame', es: 'Sin marco' },
    left: '',
    right: '',
  },
  {
    id: 'spark',
    labelByLocale: { 'pt-br': 'Faísca', en: 'Spark', es: 'Chispa' },
    left: '✦',
    right: '✦',
  },
  {
    id: 'katakana',
    labelByLocale: { 'pt-br': 'Katakana', en: 'Katakana', es: 'Katakana' },
    left: 'ツ',
    right: 'ツ',
  },
  {
    id: 'blade',
    labelByLocale: { 'pt-br': 'Laminas', en: 'Blades', es: 'Cuchillas' },
    left: '乂',
    right: '乂',
  },
  {
    id: 'japanese-corners',
    labelByLocale: { 'pt-br': 'Cantos', en: 'Corners', es: 'Esquinas' },
    left: '『',
    right: '』',
  },
  {
    id: 'royal',
    labelByLocale: { 'pt-br': 'Real', en: 'Royal', es: 'Real' },
    left: '♛',
    right: '♛',
  },
  {
    id: 'ornate',
    labelByLocale: { 'pt-br': 'Ornamentado', en: 'Ornate', es: 'Ornamentado' },
    left: '꧁',
    right: '꧂',
  },
  {
    id: 'wing',
    labelByLocale: { 'pt-br': 'Asas', en: 'Wings', es: 'Alas' },
    left: '彡',
    right: '彡',
  },
  {
    id: 'lightning',
    labelByLocale: { 'pt-br': 'Raio', en: 'Lightning', es: 'Rayo' },
    left: 'ϟ',
    right: 'ϟ',
  },
  {
    id: 'warrior',
    labelByLocale: { 'pt-br': 'Guerreiro', en: 'Warrior', es: 'Guerrero' },
    left: '☬',
    right: '☬',
  },
  {
    id: 'pro',
    labelByLocale: { 'pt-br': 'Pro', en: 'Pro', es: 'Pro' },
    left: '亗',
    right: '亗',
  },
  {
    id: 'heart',
    labelByLocale: { 'pt-br': 'Coracao', en: 'Heart', es: 'Corazon' },
    left: '♡',
    right: '♡',
  },
  {
    id: 'clan',
    labelByLocale: { 'pt-br': 'Clan', en: 'Clan', es: 'Clan' },
    left: '[',
    right: ']',
  },
  {
    id: 'minimal',
    labelByLocale: { 'pt-br': 'Minimalista', en: 'Minimal', es: 'Minimalista' },
    left: '•',
    right: '•',
  },
  {
    id: 'star',
    labelByLocale: { 'pt-br': 'Estrela', en: 'Star', es: 'Estrella' },
    left: '★',
    right: '☆',
  },
  {
    id: 'double-spark',
    labelByLocale: { 'pt-br': 'Brilho duplo', en: 'Double spark', es: 'Brillo doble' },
    left: '✧',
    right: '✦',
  },
  {
    id: 'arrow',
    labelByLocale: { 'pt-br': 'Setas', en: 'Arrows', es: 'Flechas' },
    left: '➤',
    right: '➤',
  },
  {
    id: 'flower',
    labelByLocale: { 'pt-br': 'Flor', en: 'Flower', es: 'Flor' },
    left: '✿',
    right: '✿',
  },
  {
    id: 'cute',
    labelByLocale: { 'pt-br': 'Fofo', en: 'Cute', es: 'Tierno' },
    left: '꒰',
    right: '꒱',
  },
  {
    id: 'moon',
    labelByLocale: { 'pt-br': 'Lua', en: 'Moon', es: 'Luna' },
    left: '☾',
    right: '☽',
  },
  {
    id: 'bold-brackets',
    labelByLocale: { 'pt-br': 'Colchetes', en: 'Bold brackets', es: 'Corchetes' },
    left: '【',
    right: '】',
  },
  {
    id: 'angle',
    labelByLocale: { 'pt-br': 'Angulos', en: 'Angles', es: 'Angulos' },
    left: '《',
    right: '》',
  },
  {
    id: 'wave',
    labelByLocale: { 'pt-br': 'Ondas', en: 'Waves', es: 'Ondas' },
    left: '〜',
    right: '〜',
  },
  {
    id: 'crosshair',
    labelByLocale: { 'pt-br': 'Mira', en: 'Crosshair', es: 'Mira' },
    left: '⌖',
    right: '⌖',
  },
  {
    id: 'x-mark',
    labelByLocale: { 'pt-br': 'X', en: 'X mark', es: 'X' },
    left: '×',
    right: '×',
  },
  {
    id: 'finisher',
    labelByLocale: { 'pt-br': 'Finalizador', en: 'Finisher', es: 'Finalizador' },
    left: '〆',
    right: '〆',
  },
  {
    id: 'feather',
    labelByLocale: { 'pt-br': 'Plumas', en: 'Feathers', es: 'Plumas' },
    left: '༺',
    right: '༻',
  },
  {
    id: 'music',
    labelByLocale: { 'pt-br': 'Musical', en: 'Music', es: 'Musical' },
    left: '♪',
    right: '♫',
  },
];

export const nicknameTextStyles: NicknameTextStyle[] = [
  {
    id: 'original',
    labelByLocale: { 'pt-br': 'Original', en: 'Original', es: 'Original' },
  },
  {
    id: 'small-caps',
    labelByLocale: { 'pt-br': 'Small caps', en: 'Small caps', es: 'Small caps' },
  },
  {
    id: 'fullwidth',
    labelByLocale: { 'pt-br': 'Largo', en: 'Fullwidth', es: 'Ancho' },
  },
  {
    id: 'bold',
    labelByLocale: { 'pt-br': 'Negrito Unicode', en: 'Unicode bold', es: 'Negrita Unicode' },
  },
  {
    id: 'monospace',
    labelByLocale: { 'pt-br': 'Monoespacado', en: 'Monospace', es: 'Monoespaciado' },
  },
  {
    id: 'serif-bold',
    labelByLocale: { 'pt-br': 'Negrito serifado', en: 'Serif bold', es: 'Negrita serif' },
  },
  {
    id: 'italic',
    labelByLocale: { 'pt-br': 'Italico Unicode', en: 'Unicode italic', es: 'Cursiva Unicode' },
  },
  {
    id: 'bold-italic',
    labelByLocale: { 'pt-br': 'Negrito italico', en: 'Bold italic', es: 'Negrita cursiva' },
  },
  {
    id: 'circled',
    labelByLocale: { 'pt-br': 'Circulado', en: 'Circled', es: 'Circulado' },
  },
  {
    id: 'squared',
    labelByLocale: { 'pt-br': 'Quadrados', en: 'Squared', es: 'Cuadrados' },
  },
  {
    id: 'spaced',
    labelByLocale: { 'pt-br': 'Espacado', en: 'Spaced', es: 'Espaciado' },
  },
  {
    id: 'underlined',
    labelByLocale: { 'pt-br': 'Sublinhado', en: 'Underlined', es: 'Subrayado' },
  },
];

export const nicknameSymbolPlatforms: NicknameSymbolPlatform[] = [
  {
    id: 'fortnite',
    slug: 'fortnite',
    name: 'Fortnite',
    featured: true,
    recommendedFrameIds: ['lightning', 'katakana', 'blade', 'spark', 'minimal'],
    recommendedStyleId: 'original',
    guidanceByLocale: {
      'pt-br': 'Comece com simbolos curtos em texto. O filtro da Epic pode rejeitar glifos complexos ou nomes longos.',
      en: 'Start with short text symbols. Epic filters may reject complex glyphs or long display names.',
      es: 'Empieza con simbolos de texto cortos. Los filtros de Epic pueden rechazar glifos complejos o nombres largos.',
    },
    contextByLocale: {
      'pt-br': 'Priorize leitura no lobby, lista de amigos e partidas competitivas.',
      en: 'Prioritize readability in lobbies, friend lists, and competitive matches.',
      es: 'Prioriza la lectura en el lobby, la lista de amigos y partidas competitivas.',
    },
  },
  {
    id: 'free-fire',
    slug: 'free-fire',
    name: 'Free Fire',
    featured: true,
    recommendedFrameIds: ['ornate', 'pro', 'royal', 'warrior', 'wing'],
    recommendedStyleId: 'small-caps',
    guidanceByLocale: {
      'pt-br': 'Simbolos Unicode em texto tendem a renderizar melhor que emoji, mas a fonte pode variar por aparelho.',
      en: 'Text Unicode symbols tend to render better than emoji, but the game font can vary by device.',
      es: 'Los simbolos Unicode de texto suelen renderizar mejor que los emoji, pero la fuente puede variar por dispositivo.',
    },
    contextByLocale: {
      'pt-br': 'Teste o resultado no perfil, guilda e telas pequenas antes de gastar uma troca de nome.',
      en: 'Test the result in profile, guild, and small-screen views before spending a name change.',
      es: 'Prueba el resultado en perfil, gremio y pantallas pequenas antes de gastar un cambio de nombre.',
    },
  },
  {
    id: 'roblox',
    slug: 'roblox',
    name: 'Roblox',
    featured: true,
    recommendedFrameIds: ['spark', 'heart', 'minimal', 'japanese-corners'],
    recommendedStyleId: 'original',
    guidanceByLocale: {
      'pt-br': 'Nome de usuario e nome de exibicao seguem regras diferentes; alguns simbolos podem ser filtrados.',
      en: 'Usernames and display names follow different rules, and some symbols can be filtered.',
      es: 'El nombre de usuario y el nombre visible siguen reglas distintas, y algunos simbolos pueden filtrarse.',
    },
    contextByLocale: {
      'pt-br': 'Prefira combinacoes simples que continuem legiveis no chat e dentro das experiencias.',
      en: 'Prefer simple combinations that stay readable in chat and inside experiences.',
      es: 'Prefiere combinaciones simples que sigan legibles en el chat y dentro de las experiencias.',
    },
  },
  {
    id: 'valorant',
    slug: 'valorant',
    name: 'Valorant',
    featured: true,
    recommendedFrameIds: ['minimal', 'lightning', 'spark', 'clan'],
    recommendedStyleId: 'original',
    guidanceByLocale: {
      'pt-br': 'O Riot ID separa nome do jogo e tagline. Use decoracao curta e mantenha a identificacao clara.',
      en: 'Riot ID separates the game name and tagline. Keep decorations short and the identity clear.',
      es: 'Riot ID separa el nombre del juego y el tagline. Usa decoracion corta y una identidad clara.',
    },
    contextByLocale: {
      'pt-br': 'Confira como o nickname aparece no placar, feed e lista do grupo.',
      en: 'Check how the nickname appears on the scoreboard, feed, and party list.',
      es: 'Revisa como aparece el nickname en el marcador, el feed y la lista del grupo.',
    },
  },
  {
    id: 'cod-mobile',
    slug: 'cod-mobile',
    name: 'COD Mobile',
    featured: true,
    recommendedFrameIds: ['blade', 'warrior', 'pro', 'lightning', 'clan'],
    recommendedStyleId: 'small-caps',
    guidanceByLocale: {
      'pt-br': 'Decoracoes compactas funcionam melhor em telas mobile. Evite empilhar muitos glifos.',
      en: 'Compact decorations work better on mobile screens. Avoid stacking too many glyphs.',
      es: 'Las decoraciones compactas funcionan mejor en pantallas moviles. Evita acumular demasiados glifos.',
    },
    contextByLocale: {
      'pt-br': 'Teste o nome na lista do clan, lobby e placar, onde o espaco visual e menor.',
      en: 'Test the name in clan lists, lobbies, and scoreboards where visual space is tighter.',
      es: 'Prueba el nombre en listas de clan, lobbies y marcadores donde hay menos espacio visual.',
    },
  },
  {
    id: 'pubg-mobile',
    slug: 'pubg-mobile',
    name: 'PUBG Mobile',
    featured: true,
    recommendedFrameIds: ['wing', 'warrior', 'royal', 'blade', 'minimal'],
    recommendedStyleId: 'small-caps',
    guidanceByLocale: {
      'pt-br': 'Use simbolos de texto compactos e teste a fonte no mesmo aparelho em que voce joga.',
      en: 'Use compact text symbols and test the font on the same device you play on.',
      es: 'Usa simbolos de texto compactos y prueba la fuente en el mismo dispositivo donde juegas.',
    },
    contextByLocale: {
      'pt-br': 'Observe o resultado em listas de squad, clan e feed de eliminacoes.',
      en: 'Review the result in squad lists, clans, and the elimination feed.',
      es: 'Revisa el resultado en listas de squad, clan y feed de eliminaciones.',
    },
  },
  {
    id: 'counter-strike-2',
    slug: 'cs2',
    name: 'CS2',
    featured: true,
    recommendedFrameIds: ['clan', 'minimal', 'lightning', 'blade'],
    recommendedStyleId: 'original',
    guidanceByLocale: {
      'pt-br': 'O nome exibido normalmente vem do perfil Steam; servidores e placares podem renderizar simbolos de formas diferentes.',
      en: 'The displayed name normally comes from Steam, while servers and scoreboards may render symbols differently.',
      es: 'El nombre visible normalmente viene de Steam, y servidores y marcadores pueden renderizar simbolos de forma distinta.',
    },
    contextByLocale: {
      'pt-br': 'Mantenha o nome curto para leitura rapida no placar, kill feed e demos.',
      en: 'Keep it short for fast reading in the scoreboard, kill feed, and demos.',
      es: 'Mantenlo corto para leer rapido en el marcador, kill feed y demos.',
    },
  },
  {
    id: 'minecraft',
    slug: 'minecraft',
    name: 'Minecraft',
    featured: false,
    recommendedFrameIds: ['minimal', 'clan', 'spark', 'japanese-corners'],
    recommendedStyleId: 'original',
    guidanceByLocale: {
      'pt-br': 'Java, Bedrock e servidores privados podem aplicar regras diferentes para nomes e apelidos.',
      en: 'Java, Bedrock, and private servers can apply different rules to account names and nicknames.',
      es: 'Java, Bedrock y servidores privados pueden aplicar reglas distintas a nombres y apodos.',
    },
    contextByLocale: {
      'pt-br': 'Confirme se o simbolo e aceito pelo servidor e se aparece bem no chat e na lista de jogadores.',
      en: 'Confirm the symbol is accepted by the server and renders well in chat and player lists.',
      es: 'Confirma que el servidor acepta el simbolo y que aparece bien en chat y listas de jugadores.',
    },
  },
  {
    id: 'brawl-stars',
    slug: 'brawl-stars',
    name: 'Brawl Stars',
    featured: false,
    recommendedFrameIds: ['spark', 'royal', 'heart', 'pro'],
    recommendedStyleId: 'small-caps',
    guidanceByLocale: {
      'pt-br': 'Escolha molduras curtas para preservar leitura nas telas compactas do jogo.',
      en: 'Choose short frames to preserve readability on the game’s compact screens.',
      es: 'Elige marcos cortos para mantener la lectura en las pantallas compactas del juego.',
    },
    contextByLocale: {
      'pt-br': 'Teste no perfil, clube e apresentacao da batalha antes de manter a alteracao.',
      en: 'Test it in profile, club, and battle intro views before keeping the change.',
      es: 'Pruebalo en perfil, club y presentacion de batalla antes de mantener el cambio.',
    },
  },
  {
    id: 'rocket-league',
    slug: 'rocket-league',
    name: 'Rocket League',
    featured: false,
    recommendedFrameIds: ['lightning', 'spark', 'minimal', 'clan'],
    recommendedStyleId: 'original',
    guidanceByLocale: {
      'pt-br': 'O nome pode depender da conta vinculada e da plataforma; nem todo glifo e compartilhado entre fontes.',
      en: 'The name can depend on the linked account and platform, and not every glyph is shared across fonts.',
      es: 'El nombre puede depender de la cuenta vinculada y la plataforma, y no todas las fuentes comparten los mismos glifos.',
    },
    contextByLocale: {
      'pt-br': 'Verifique legibilidade no placar, replay de gol e lista do grupo.',
      en: 'Check readability in scoreboards, goal replays, and party lists.',
      es: 'Comprueba la lectura en marcador, repeticion de gol y lista del grupo.',
    },
  },
];

const smallCapsMap: Record<string, string> = {
  a: 'ᴀ',
  b: 'ʙ',
  c: 'ᴄ',
  d: 'ᴅ',
  e: 'ᴇ',
  f: 'ꜰ',
  g: 'ɢ',
  h: 'ʜ',
  i: 'ɪ',
  j: 'ᴊ',
  k: 'ᴋ',
  l: 'ʟ',
  m: 'ᴍ',
  n: 'ɴ',
  o: 'ᴏ',
  p: 'ᴘ',
  q: 'ǫ',
  r: 'ʀ',
  s: 'ꜱ',
  t: 'ᴛ',
  u: 'ᴜ',
  v: 'ᴠ',
  w: 'ᴡ',
  x: 'x',
  y: 'ʏ',
  z: 'ᴢ',
};

const mapAsciiAlphanumeric = (
  value: string,
  uppercaseStart: number,
  lowercaseStart: number,
  digitStart: number,
): string =>
  Array.from(value)
    .map((character) => {
      const codePoint = character.codePointAt(0) ?? 0;

      if (codePoint >= 65 && codePoint <= 90) {
        return String.fromCodePoint(uppercaseStart + codePoint - 65);
      }

      if (codePoint >= 97 && codePoint <= 122) {
        return String.fromCodePoint(lowercaseStart + codePoint - 97);
      }

      if (codePoint >= 48 && codePoint <= 57) {
        return String.fromCodePoint(digitStart + codePoint - 48);
      }

      return character;
    })
    .join('');

const toCircledText = (value: string): string =>
  Array.from(value)
    .map((character) => {
      const codePoint = character.codePointAt(0) ?? 0;

      if (codePoint >= 65 && codePoint <= 90) {
        return String.fromCodePoint(0x24b6 + codePoint - 65);
      }

      if (codePoint >= 97 && codePoint <= 122) {
        return String.fromCodePoint(0x24d0 + codePoint - 97);
      }

      if (codePoint === 48) {
        return '⓪';
      }

      if (codePoint >= 49 && codePoint <= 57) {
        return String.fromCodePoint(0x2460 + codePoint - 49);
      }

      return character;
    })
    .join('');

const toSquaredText = (value: string): string =>
  Array.from(value)
    .map((character) => {
      const uppercase = character.toUpperCase();
      const codePoint = uppercase.codePointAt(0) ?? 0;

      if (codePoint >= 65 && codePoint <= 90) {
        return String.fromCodePoint(0x1f130 + codePoint - 65);
      }

      return character;
    })
    .join('');

export const transformNicknameText = (
  value: string,
  styleId: NicknameTextStyleId,
): string => {
  if (styleId === 'small-caps') {
    return Array.from(value)
      .map((character) => smallCapsMap[character.toLowerCase()] ?? character)
      .join('');
  }

  if (styleId === 'fullwidth') {
    return mapAsciiAlphanumeric(value, 0xff21, 0xff41, 0xff10);
  }

  if (styleId === 'bold') {
    return mapAsciiAlphanumeric(value, 0x1d5d4, 0x1d5ee, 0x1d7ec);
  }

  if (styleId === 'monospace') {
    return mapAsciiAlphanumeric(value, 0x1d670, 0x1d68a, 0x1d7f6);
  }

  if (styleId === 'serif-bold') {
    return mapAsciiAlphanumeric(value, 0x1d400, 0x1d41a, 0x1d7ce);
  }

  if (styleId === 'italic') {
    return mapAsciiAlphanumeric(value, 0x1d608, 0x1d622, 0x30);
  }

  if (styleId === 'bold-italic') {
    return mapAsciiAlphanumeric(value, 0x1d63c, 0x1d656, 0x1d7ec);
  }

  if (styleId === 'circled') {
    return toCircledText(value);
  }

  if (styleId === 'squared') {
    return toSquaredText(value);
  }

  if (styleId === 'spaced') {
    return Array.from(value).join('\u2009');
  }

  if (styleId === 'underlined') {
    return Array.from(value)
      .map((character) => (character.trim() ? `${character}\u0332` : character))
      .join('');
  }

  return value;
};

export type NicknameTextEditResult = {
  value: string;
  cursor: number;
};

const clampTextIndex = (value: string, index: number): number =>
  Math.max(0, Math.min(index, value.length));

export const limitNicknameCharacters = (value: string, limit = 48): string =>
  Array.from(value).slice(0, limit).join('');

export const insertNicknameTextAtSelection = (
  value: string,
  addition: string,
  selectionStart: number,
  selectionEnd: number,
  limit = 48,
): NicknameTextEditResult => {
  const limitedValue = limitNicknameCharacters(value, limit);
  const start = clampTextIndex(limitedValue, Math.min(selectionStart, selectionEnd));
  const end = clampTextIndex(limitedValue, Math.max(selectionStart, selectionEnd));
  const before = limitedValue.slice(0, start);
  const after = limitedValue.slice(end);
  const availableCharacters = Math.max(
    0,
    limit - Array.from(`${before}${after}`).length,
  );
  const insertedText = Array.from(addition).slice(0, availableCharacters).join('');

  return {
    value: `${before}${insertedText}${after}`,
    cursor: before.length + insertedText.length,
  };
};

export const deleteNicknameTextAtSelection = (
  value: string,
  selectionStart: number,
  selectionEnd: number,
): NicknameTextEditResult => {
  const start = clampTextIndex(value, Math.min(selectionStart, selectionEnd));
  const end = clampTextIndex(value, Math.max(selectionStart, selectionEnd));

  if (start !== end) {
    return {
      value: `${value.slice(0, start)}${value.slice(end)}`,
      cursor: start,
    };
  }

  const charactersBeforeCursor = Array.from(value.slice(0, start));
  charactersBeforeCursor.pop();
  const before = charactersBeforeCursor.join('');

  return {
    value: `${before}${value.slice(end)}`,
    cursor: before.length,
  };
};

export const normalizeNicknameInput = (value: string): string =>
  limitNicknameCharacters(value.replaceAll(/\s+/g, ' ').trim());

export const composeSymbolNickname = (
  baseName: string,
  left: string,
  right: string,
  styleId: NicknameTextStyleId = 'original',
): string => {
  const normalizedName = normalizeNicknameInput(baseName);
  return `${left}${transformNicknameText(normalizedName, styleId)}${right}`;
};

export const getNicknameSymbolPlatformById = (
  id: string,
): NicknameSymbolPlatform | undefined =>
  nicknameSymbolPlatforms.find((platform) => platform.id === id);

export const getNicknameSymbolPlatformBySlug = (
  slug: string,
): NicknameSymbolPlatform | undefined =>
  nicknameSymbolPlatforms.find((platform) => platform.slug === slug);

export const getNicknameFrameById = (id: string): NicknameFrame | undefined =>
  nicknameFrameDefinitions.find((frame) => frame.id === id);

export const buildNicknameSymbolVariants = (
  baseName: string,
  platformId: string,
  styleId: NicknameTextStyleId,
  limit = 12,
): GeneratedNicknameVariant[] => {
  const platform = getNicknameSymbolPlatformById(platformId) ?? nicknameSymbolPlatforms[0];
  const orderedFrameIds = [
    ...(platform?.recommendedFrameIds ?? []),
    ...nicknameFrameDefinitions.map((frame) => frame.id),
  ];
  const uniqueFrameIds = Array.from(new Set(orderedFrameIds));

  return uniqueFrameIds
    .map((frameId) => getNicknameFrameById(frameId))
    .filter((frame): frame is NicknameFrame => Boolean(frame))
    .slice(0, limit)
    .map((frame) => ({
      id: `${platform?.id ?? 'generic'}-${styleId}-${frame.id}`,
      label: frame.labelByLocale.en,
      frameId: frame.id,
      value: composeSymbolNickname(baseName, frame.left, frame.right, styleId),
    }));
};

export const countNicknameCharacters = (value: string): number => Array.from(value).length;
