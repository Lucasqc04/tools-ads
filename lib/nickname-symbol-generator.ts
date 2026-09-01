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
    labelByLocale: { 'pt-br': 'Populares', en: 'Popular', es: 'Populares' , zh: '热门' },
    symbols: ['ツ', '亗', '乂', 'メ', '彡', '么', '〆', '々', 'ฬ', '乙', '࿐', '᭄', '乛', '气', 'ゞ', 'ミ'],
  },
  {
    id: 'stars',
    labelByLocale: { 'pt-br': 'Estrelas', en: 'Stars', es: 'Estrellas' , zh: '星星' },
    symbols: ['★', '☆', '✦', '✧', '✩', '✪', '✯', '✰', '⋆', '✵', '❂', '✶', '✷', '✸', '✹', '✺'],
  },
  {
    id: 'royal',
    labelByLocale: { 'pt-br': 'Coroas', en: 'Royal', es: 'Coronas' , zh: '皇冠' },
    symbols: ['♛', '♚', '♕', '♔', '♜', '♝', '♞', '♟', '⚜', '♠', '♦', '♣', '♤', '♢', '♧', '♙'],
  },
  {
    id: 'combat',
    labelByLocale: { 'pt-br': 'Combate', en: 'Combat', es: 'Combate' , zh: '战斗' },
    symbols: ['⚔', 'ϟ', 'Ψ', '☬', '†', '‡', '⌁', '⌖', '⚡', '☠', '⛨', '⟁', '⚙', '⛓', '⚒', '⛊'],
  },
  {
    id: 'arrows',
    labelByLocale: { 'pt-br': 'Setas', en: 'Arrows', es: 'Flechas' , zh: '箭头' },
    symbols: ['➤', '➜', '➳', '➶', '➷', '➹', '➺', '➻', '➼', '➽', '➸', '⇝', '⇢', '↠', '↣', '➲'],
  },
  {
    id: 'brackets',
    labelByLocale: { 'pt-br': 'Molduras', en: 'Frames', es: 'Marcos' , zh: '边框' },
    symbols: ['『', '』', '「', '」', '【', '】', '〖', '〗', '꧁', '꧂', '༺', '༻', '《', '》', '〈', '〉'],
  },
  {
    id: 'minimal',
    labelByLocale: { 'pt-br': 'Minimalistas', en: 'Minimal', es: 'Minimalistas' , zh: '简约' },
    symbols: ['•', '·', '︱', '×', '〳', '〴', '⌇', '⌁', '⸻', 'ー', '・', '＿', '〜', '〰', '○', '◇'],
  },
  {
    id: 'hearts',
    labelByLocale: { 'pt-br': 'Coracoes', en: 'Hearts', es: 'Corazones' , zh: '爱心' },
    symbols: ['♡', '♥', 'ღ', '❥', '❣', 'დ', 'ෆ', '୨୧', 'ᰔ', 'ꨄ', '❦', 'ლ', '♥︎', '❤︎', '❧', '۵'],
  },
  {
    id: 'nature',
    labelByLocale: { 'pt-br': 'Natureza', en: 'Nature', es: 'Naturaleza' , zh: '自然' },
    symbols: ['✿', '❀', '❁', '❃', '❋', '❊', '☘', '♣', '☾', '☽', '☀', '☁', '❄', '☂', '☄', '𖤐'],
  },
  {
    id: 'music',
    labelByLocale: { 'pt-br': 'Musica', en: 'Music', es: 'Musica' , zh: '音乐' },
    symbols: ['♪', '♫', '♬', '♩', '♭', '♮', '♯', '𝄞', '𝄢', '𝄡', '𝄐', '𝄪', '𝄫', '♭︎', '♯︎', '◖♪◗'],
  },
  {
    id: 'cute',
    labelByLocale: { 'pt-br': 'Fofos', en: 'Cute', es: 'Tiernos' , zh: '可爱' },
    symbols: ['୨୧', 'ʚ', 'ɞ', '꒰', '꒱', 'ෆ', 'ᰔ', 'ꨄ', 'ღ', 'დ', 'ৎ', '୭', '໒', '১', 'ଘ', 'ଓ'],
  },
  {
    id: 'japanese',
    labelByLocale: { 'pt-br': 'Japoneses', en: 'Japanese', es: 'Japoneses' , zh: '日系' },
    symbols: ['ツ', 'シ', 'ジ', 'メ', 'ミ', '彡', '々', '〆', 'の', 'へ', 'く', 'し', '乂', '乙', '亗', '么'],
  },
  {
    id: 'zodiac',
    labelByLocale: { 'pt-br': 'Zodiaco', en: 'Zodiac', es: 'Zodiaco' , zh: '星座' },
    symbols: ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '☉', '☽', '☾', '⊙'],
  },
  {
    id: 'tags',
    labelByLocale: { 'pt-br': 'Tags e clan', en: 'Tags & clan', es: 'Tags y clan' , zh: '战队标签' },
    symbols: ['[', ']', '<', '>', '|', '/', '\\', '+', '=', '#', '@', '!', '?', ':', ';', '_'],
  },
];

export const nicknameFrameDefinitions: NicknameFrame[] = [
  {
    id: 'plain',
    labelByLocale: { 'pt-br': 'Sem moldura', en: 'No frame', es: 'Sin marco' , zh: '无边框' },
    left: '',
    right: '',
  },
  {
    id: 'spark',
    labelByLocale: { 'pt-br': 'Faísca', en: 'Spark', es: 'Chispa' , zh: '火花' },
    left: '✦',
    right: '✦',
  },
  {
    id: 'katakana',
    labelByLocale: { 'pt-br': 'Katakana', en: 'Katakana', es: 'Katakana' , zh: '片假名' },
    left: 'ツ',
    right: 'ツ',
  },
  {
    id: 'blade',
    labelByLocale: { 'pt-br': 'Laminas', en: 'Blades', es: 'Cuchillas' , zh: '刀刃' },
    left: '乂',
    right: '乂',
  },
  {
    id: 'japanese-corners',
    labelByLocale: { 'pt-br': 'Cantos', en: 'Corners', es: 'Esquinas' , zh: '日式边角' },
    left: '『',
    right: '』',
  },
  {
    id: 'royal',
    labelByLocale: { 'pt-br': 'Real', en: 'Royal', es: 'Real' , zh: '皇冠' },
    left: '♛',
    right: '♛',
  },
  {
    id: 'ornate',
    labelByLocale: { 'pt-br': 'Ornamentado', en: 'Ornate', es: 'Ornamentado' , zh: '华丽' },
    left: '꧁',
    right: '꧂',
  },
  {
    id: 'wing',
    labelByLocale: { 'pt-br': 'Asas', en: 'Wings', es: 'Alas' , zh: '翅膀' },
    left: '彡',
    right: '彡',
  },
  {
    id: 'lightning',
    labelByLocale: { 'pt-br': 'Raio', en: 'Lightning', es: 'Rayo' , zh: '闪电' },
    left: 'ϟ',
    right: 'ϟ',
  },
  {
    id: 'warrior',
    labelByLocale: { 'pt-br': 'Guerreiro', en: 'Warrior', es: 'Guerrero' , zh: '战士' },
    left: '☬',
    right: '☬',
  },
  {
    id: 'pro',
    labelByLocale: { 'pt-br': 'Pro', en: 'Pro', es: 'Pro' , zh: '职业' },
    left: '亗',
    right: '亗',
  },
  {
    id: 'heart',
    labelByLocale: { 'pt-br': 'Coracao', en: 'Heart', es: 'Corazon' , zh: '爱心' },
    left: '♡',
    right: '♡',
  },
  {
    id: 'clan',
    labelByLocale: { 'pt-br': 'Clan', en: 'Clan', es: 'Clan' , zh: '战队' },
    left: '[',
    right: ']',
  },
  {
    id: 'minimal',
    labelByLocale: { 'pt-br': 'Minimalista', en: 'Minimal', es: 'Minimalista' , zh: '简约' },
    left: '•',
    right: '•',
  },
  {
    id: 'star',
    labelByLocale: { 'pt-br': 'Estrela', en: 'Star', es: 'Estrella' , zh: '星星' },
    left: '★',
    right: '☆',
  },
  {
    id: 'double-spark',
    labelByLocale: { 'pt-br': 'Brilho duplo', en: 'Double spark', es: 'Brillo doble' , zh: '双重火花' },
    left: '✧',
    right: '✦',
  },
  {
    id: 'arrow',
    labelByLocale: { 'pt-br': 'Setas', en: 'Arrows', es: 'Flechas' , zh: '箭头' },
    left: '➤',
    right: '➤',
  },
  {
    id: 'flower',
    labelByLocale: { 'pt-br': 'Flor', en: 'Flower', es: 'Flor' , zh: '花朵' },
    left: '✿',
    right: '✿',
  },
  {
    id: 'cute',
    labelByLocale: { 'pt-br': 'Fofo', en: 'Cute', es: 'Tierno' , zh: '可爱' },
    left: '꒰',
    right: '꒱',
  },
  {
    id: 'moon',
    labelByLocale: { 'pt-br': 'Lua', en: 'Moon', es: 'Luna' , zh: '月亮' },
    left: '☾',
    right: '☽',
  },
  {
    id: 'bold-brackets',
    labelByLocale: { 'pt-br': 'Colchetes', en: 'Bold brackets', es: 'Corchetes' , zh: '粗边框' },
    left: '【',
    right: '】',
  },
  {
    id: 'angle',
    labelByLocale: { 'pt-br': 'Angulos', en: 'Angles', es: 'Angulos' , zh: '尖角' },
    left: '《',
    right: '》',
  },
  {
    id: 'wave',
    labelByLocale: { 'pt-br': 'Ondas', en: 'Waves', es: 'Ondas' , zh: '波浪' },
    left: '〜',
    right: '〜',
  },
  {
    id: 'crosshair',
    labelByLocale: { 'pt-br': 'Mira', en: 'Crosshair', es: 'Mira' , zh: '准星' },
    left: '⌖',
    right: '⌖',
  },
  {
    id: 'x-mark',
    labelByLocale: { 'pt-br': 'X', en: 'X mark', es: 'X' , zh: 'X 标记' },
    left: '×',
    right: '×',
  },
  {
    id: 'finisher',
    labelByLocale: { 'pt-br': 'Finalizador', en: 'Finisher', es: 'Finalizador' , zh: '收尾符' },
    left: '〆',
    right: '〆',
  },
  {
    id: 'feather',
    labelByLocale: { 'pt-br': 'Plumas', en: 'Feathers', es: 'Plumas' , zh: '羽毛' },
    left: '༺',
    right: '༻',
  },
  {
    id: 'music',
    labelByLocale: { 'pt-br': 'Musical', en: 'Music', es: 'Musical' , zh: '音乐' },
    left: '♪',
    right: '♫',
  },
];

export const nicknameTextStyles: NicknameTextStyle[] = [
  {
    id: 'original',
    labelByLocale: { 'pt-br': 'Original', en: 'Original', es: 'Original' , zh: '原始' },
  },
  {
    id: 'small-caps',
    labelByLocale: { 'pt-br': 'Small caps', en: 'Small caps', es: 'Small caps' , zh: '小型大写' },
  },
  {
    id: 'fullwidth',
    labelByLocale: { 'pt-br': 'Largo', en: 'Fullwidth', es: 'Ancho' , zh: '全角' },
  },
  {
    id: 'bold',
    labelByLocale: { 'pt-br': 'Negrito Unicode', en: 'Unicode bold', es: 'Negrita Unicode' , zh: 'Unicode 粗体' },
  },
  {
    id: 'monospace',
    labelByLocale: { 'pt-br': 'Monoespacado', en: 'Monospace', es: 'Monoespaciado' , zh: '等宽' },
  },
  {
    id: 'serif-bold',
    labelByLocale: { 'pt-br': 'Negrito serifado', en: 'Serif bold', es: 'Negrita serif' , zh: '衬线粗体' },
  },
  {
    id: 'italic',
    labelByLocale: { 'pt-br': 'Italico Unicode', en: 'Unicode italic', es: 'Cursiva Unicode' , zh: 'Unicode 斜体' },
  },
  {
    id: 'bold-italic',
    labelByLocale: { 'pt-br': 'Negrito italico', en: 'Bold italic', es: 'Negrita cursiva' , zh: '粗斜体' },
  },
  {
    id: 'circled',
    labelByLocale: { 'pt-br': 'Circulado', en: 'Circled', es: 'Circulado' , zh: '圆圈' },
  },
  {
    id: 'squared',
    labelByLocale: { 'pt-br': 'Quadrados', en: 'Squared', es: 'Cuadrados' , zh: '方框' },
  },
  {
    id: 'spaced',
    labelByLocale: { 'pt-br': 'Espacado', en: 'Spaced', es: 'Espaciado' , zh: '间隔' },
  },
  {
    id: 'underlined',
    labelByLocale: { 'pt-br': 'Sublinhado', en: 'Underlined', es: 'Subrayado' , zh: '下划线' },
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
      zh: '先尝试简短的文字符号。Epic 的过滤规则可能会拒绝过于复杂的字形或过长的显示名称。',
    },
    contextByLocale: {
      'pt-br': 'Priorize leitura no lobby, lista de amigos e partidas competitivas.',
      en: 'Prioritize readability in lobbies, friend lists, and competitive matches.',
      es: 'Prioriza la lectura en el lobby, la lista de amigos y partidas competitivas.',
      zh: '优先考虑在大厅、好友列表和竞技对局中的可读性。',
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
      zh: '文字类 Unicode 符号通常比表情符号渲染效果更好,但字体可能因设备而异。',
    },
    contextByLocale: {
      'pt-br': 'Teste o resultado no perfil, guilda e telas pequenas antes de gastar uma troca de nome.',
      en: 'Test the result in profile, guild, and small-screen views before spending a name change.',
      es: 'Prueba el resultado en perfil, gremio y pantallas pequenas antes de gastar un cambio de nombre.',
      zh: '在花费改名机会之前,先在个人资料、公会和小屏幕视图中测试效果。',
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
      zh: '用户名和显示名称遵循不同规则,部分符号可能会被过滤。',
    },
    contextByLocale: {
      'pt-br': 'Prefira combinacoes simples que continuem legiveis no chat e dentro das experiencias.',
      en: 'Prefer simple combinations that stay readable in chat and inside experiences.',
      es: 'Prefiere combinaciones simples que sigan legibles en el chat y dentro de las experiencias.',
      zh: '优先选择在聊天和各类体验中依然清晰可读的简单组合。',
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
      zh: 'Riot ID 会将游戏名称和标签分开显示。使用简短的装饰,保持身份清晰可辨。',
    },
    contextByLocale: {
      'pt-br': 'Confira como o nickname aparece no placar, feed e lista do grupo.',
      en: 'Check how the nickname appears on the scoreboard, feed, and party list.',
      es: 'Revisa como aparece el nickname en el marcador, el feed y la lista del grupo.',
      zh: '确认昵称在记分板、动态消息和队伍列表中的显示效果。',
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
      zh: '紧凑的装饰在移动端屏幕上效果更好。避免堆叠过多字形。',
    },
    contextByLocale: {
      'pt-br': 'Teste o nome na lista do clan, lobby e placar, onde o espaco visual e menor.',
      en: 'Test the name in clan lists, lobbies, and scoreboards where visual space is tighter.',
      es: 'Prueba el nombre en listas de clan, lobbies y marcadores donde hay menos espacio visual.',
      zh: '在战队列表、大厅和记分板等视觉空间较小的地方测试名称效果。',
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
      zh: '使用紧凑的文字符号,并在你实际游戏的设备上测试字体效果。',
    },
    contextByLocale: {
      'pt-br': 'Observe o resultado em listas de squad, clan e feed de eliminacoes.',
      en: 'Review the result in squad lists, clans, and the elimination feed.',
      es: 'Revisa el resultado en listas de squad, clan y feed de eliminaciones.',
      zh: '留意名称在小队列表、战队和淘汰动态中的显示效果。',
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
      zh: '显示名称通常来自 Steam 个人资料,服务器和记分板对符号的渲染方式可能不同。',
    },
    contextByLocale: {
      'pt-br': 'Mantenha o nome curto para leitura rapida no placar, kill feed e demos.',
      en: 'Keep it short for fast reading in the scoreboard, kill feed, and demos.',
      es: 'Mantenlo corto para leer rapido en el marcador, kill feed y demos.',
      zh: '保持名称简短,便于在记分板、击杀信息和录像中快速阅读。',
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
      zh: 'Java 版、基岩版和私服可能对账号名称和昵称采用不同的规则。',
    },
    contextByLocale: {
      'pt-br': 'Confirme se o simbolo e aceito pelo servidor e se aparece bem no chat e na lista de jogadores.',
      en: 'Confirm the symbol is accepted by the server and renders well in chat and player lists.',
      es: 'Confirma que el servidor acepta el simbolo y que aparece bien en chat y listas de jugadores.',
      zh: '确认服务器是否接受该符号,并检查它在聊天和玩家列表中的显示效果。',
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
      zh: '选择较短的边框,以便在游戏紧凑的屏幕上保持可读性。',
    },
    contextByLocale: {
      'pt-br': 'Teste no perfil, clube e apresentacao da batalha antes de manter a alteracao.',
      en: 'Test it in profile, club, and battle intro views before keeping the change.',
      es: 'Pruebalo en perfil, club y presentacion de batalla antes de mantener el cambio.',
      zh: '在保留修改前,先在个人资料、俱乐部和对局开场画面中测试效果。',
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
      zh: '名称可能取决于关联的账号和平台,并非所有字体都支持相同的字形。',
    },
    contextByLocale: {
      'pt-br': 'Verifique legibilidade no placar, replay de gol e lista do grupo.',
      en: 'Check readability in scoreboards, goal replays, and party lists.',
      es: 'Comprueba la lectura en marcador, repeticion de gol y lista del grupo.',
      zh: '检查名称在记分板、进球回放和队伍列表中的可读性。',
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
