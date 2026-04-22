import type { AppLocale } from '@/lib/i18n/config';

export type InvisibleCharacterGroup = 'true-invisible' | 'special-space' | 'semi-invisible';

export type InvisibleCharacterDefinition = {
  id: string;
  label: string;
  unicode: string;
  codePoint: number;
  group: InvisibleCharacterGroup;
  bestForEmptyNick: boolean;
  value: string;
};

const fromCodePoint = (codePoint: number): string => String.fromCodePoint(codePoint);

const unicodeLabel = (codePoint: number): string =>
  `U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`;

const buildCharacter = (
  id: string,
  label: string,
  codePoint: number,
  group: InvisibleCharacterGroup,
  bestForEmptyNick: boolean,
): InvisibleCharacterDefinition => ({
  id,
  label,
  unicode: unicodeLabel(codePoint),
  codePoint,
  group,
  bestForEmptyNick,
  value: fromCodePoint(codePoint),
});

export const invisibleCharacterDefinitions: InvisibleCharacterDefinition[] = [
  buildCharacter('hangul-filler', 'Hangul Filler', 0x3164, 'true-invisible', true),
  buildCharacter('braille-blank', 'Braille Blank', 0x2800, 'true-invisible', true),
  buildCharacter('zero-width-space', 'Zero Width Space', 0x200b, 'true-invisible', true),
  buildCharacter('zero-width-non-joiner', 'Zero Width Non-Joiner', 0x200c, 'true-invisible', true),
  buildCharacter('zero-width-joiner', 'Zero Width Joiner', 0x200d, 'true-invisible', true),
  buildCharacter('word-joiner', 'Word Joiner', 0x2060, 'true-invisible', true),
  buildCharacter('zero-width-no-break-space', 'Zero Width No-Break Space', 0xfeff, 'true-invisible', true),
  buildCharacter('non-breaking-space', 'Non-Breaking Space', 0x00a0, 'special-space', false),
  buildCharacter('en-quad', 'En Quad', 0x2000, 'special-space', false),
  buildCharacter('em-quad', 'Em Quad', 0x2001, 'special-space', false),
  buildCharacter('en-space', 'En Space', 0x2002, 'special-space', false),
  buildCharacter('em-space', 'Em Space', 0x2003, 'special-space', false),
  buildCharacter('thin-space', 'Thin Space', 0x2009, 'special-space', false),
];

export type InvisibleCombinationDefinition = {
  id: string;
  label: string;
  description: string;
  value: string;
  characterIds: string[];
};

const findCharacterById = (id: string): InvisibleCharacterDefinition | undefined =>
  invisibleCharacterDefinitions.find((item) => item.id === id);

const buildCombinationValue = (characterIds: string[]): string =>
  characterIds
    .map((id) => findCharacterById(id)?.value ?? '')
    .join('');

const buildCombination = (
  id: string,
  label: string,
  description: string,
  characterIds: string[],
): InvisibleCombinationDefinition => ({
  id,
  label,
  description,
  characterIds,
  value: buildCombinationValue(characterIds),
});

export const invisibleCombinationDefinitions: InvisibleCombinationDefinition[] = [
  buildCombination(
    'hangul-double',
    'Hangul x2',
    'Boa escolha quando o jogo bloqueia apenas 1 caractere invisivel.',
    ['hangul-filler', 'hangul-filler'],
  ),
  buildCombination(
    'braille-hangul-braille',
    'Braille + Hangul + Braille',
    'Combinacao estavel para validacoes mais restritivas.',
    ['braille-blank', 'hangul-filler', 'braille-blank'],
  ),
  buildCombination(
    'zero-width-triple',
    'ZWSP + ZWNJ + ZWJ',
    'Boa para plataformas que aceitam sequencias zero-width.',
    ['zero-width-space', 'zero-width-non-joiner', 'zero-width-joiner'],
  ),
  buildCombination(
    'hangul-zero-hangul',
    'Hangul + ZWSP + Hangul',
    'Alternativa para nicks quando o primeiro padrao falha.',
    ['hangul-filler', 'zero-width-space', 'hangul-filler'],
  ),
  buildCombination(
    'braille-zero-braille',
    'Braille + ZWSP + Braille',
    'Opcao hibrida para tentar bypass de validacoes de espaco.',
    ['braille-blank', 'zero-width-space', 'braille-blank'],
  ),
  buildCombination(
    'hangul-triple',
    'Hangul x3',
    'Semi-invisivel para plataformas que pedem tamanho minimo maior.',
    ['hangul-filler', 'hangul-filler', 'hangul-filler'],
  ),
  buildCombination(
    'braille-quad',
    'Braille x4',
    'Semi-invisivel para testes em validadores rigidos.',
    ['braille-blank', 'braille-blank', 'braille-blank', 'braille-blank'],
  ),
];

export type InvisiblePlatformCategory = 'game' | 'social';

export type InvisibleCompatibilityLevel = 'high' | 'medium' | 'unstable';

export type InvisiblePlatform = {
  id: string;
  slug: string;
  name: string;
  category: InvisiblePlatformCategory;
  featured: boolean;
  compatibility: InvisibleCompatibilityLevel;
  recommendedCombinationId: string;
  validationHint: Record<AppLocale, string>;
  seoKeywordHints?: Partial<Record<AppLocale, string[]>>;
};

type PlatformSeed = Omit<InvisiblePlatform, 'validationHint'> & {
  hintPtBr: string;
  hintEn: string;
  hintEs: string;
};

const platformSeeds: PlatformSeed[] = [
  {
    id: 'free-fire',
    slug: 'free-fire',
    name: 'Free Fire',
    category: 'game',
    featured: true,
    compatibility: 'high',
    recommendedCombinationId: 'hangul-double',
    hintPtBr: 'Normalmente aceita U+3164 e combina melhor com 2 caracteres.',
    hintEn: 'Usually accepts U+3164 and tends to work better with 2 characters.',
    hintEs: 'Normalmente acepta U+3164 y suele funcionar mejor con 2 caracteres.',
    seoKeywordHints: {
      'pt-br': [
        'caractere invisivel free fire',
        'espaco invisivel free fire',
        'nick invisivel free fire',
      ],
      en: ['invisible character free fire', 'free fire invisible name'],
      es: ['caracter invisible free fire', 'nombre invisible free fire'],
    },
  },
  {
    id: 'cod-mobile',
    slug: 'cod-mobile',
    name: 'COD Mobile',
    category: 'game',
    featured: true,
    compatibility: 'medium',
    recommendedCombinationId: 'zero-width-triple',
    hintPtBr: 'Pode bloquear espacos simples; sequencias zero-width costumam performar melhor.',
    hintEn: 'May block simple spaces; zero-width sequences often perform better.',
    hintEs: 'Puede bloquear espacios simples; las secuencias zero-width suelen funcionar mejor.',
    seoKeywordHints: {
      'pt-br': ['nome invisivel cod mobile'],
      en: ['invisible name cod mobile'],
      es: ['nombre invisible cod mobile'],
    },
  },
  {
    id: 'discord',
    slug: 'discord',
    name: 'Discord',
    category: 'social',
    featured: true,
    compatibility: 'high',
    recommendedCombinationId: 'hangul-double',
    hintPtBr: 'Aceita bem Hangul Filler e combinacoes curtas para nome invisivel.',
    hintEn: 'Works well with Hangul Filler and short invisible combinations.',
    hintEs: 'Funciona bien con Hangul Filler y combinaciones cortas invisibles.',
    seoKeywordHints: {
      'pt-br': ['nick invisivel discord'],
      en: ['invisible text discord', 'invisible username discord'],
      es: ['nombre invisible discord'],
    },
  },
  {
    id: 'pubg-mobile',
    slug: 'pubg-mobile',
    name: 'PUBG Mobile',
    category: 'game',
    featured: true,
    compatibility: 'medium',
    recommendedCombinationId: 'hangul-zero-hangul',
    hintPtBr: 'Pode rejeitar 1 unico caractere invisivel em algumas contas.',
    hintEn: 'Some accounts may reject a single invisible character.',
    hintEs: 'Algunas cuentas pueden rechazar un unico caracter invisible.',
  },
  {
    id: 'fortnite',
    slug: 'fortnite',
    name: 'Fortnite',
    category: 'game',
    featured: true,
    compatibility: 'medium',
    recommendedCombinationId: 'zero-width-triple',
    hintPtBr: 'Validacao muda por regiao; teste 2 a 4 caracteres invisiveis.',
    hintEn: 'Validation can vary by region; test 2 to 4 invisible characters.',
    hintEs: 'La validacion puede variar por region; prueba 2 a 4 caracteres invisibles.',
  },
  {
    id: 'valorant',
    slug: 'valorant',
    name: 'Valorant',
    category: 'game',
    featured: true,
    compatibility: 'unstable',
    recommendedCombinationId: 'braille-hangul-braille',
    hintPtBr: 'Riot pode alterar filtros com frequencia; suporte e instavel.',
    hintEn: 'Riot may change filters often; support is unstable.',
    hintEs: 'Riot puede cambiar filtros con frecuencia; el soporte es inestable.',
  },
  {
    id: 'league-of-legends',
    slug: 'league-of-legends',
    name: 'League of Legends',
    category: 'game',
    featured: false,
    compatibility: 'unstable',
    recommendedCombinationId: 'braille-hangul-braille',
    hintPtBr: 'Filtros de nome mudam por servidor e temporada.',
    hintEn: 'Name filters vary by server and season.',
    hintEs: 'Los filtros de nombre varian por servidor y temporada.',
  },
  {
    id: 'counter-strike-2',
    slug: 'counter-strike-2',
    name: 'Counter-Strike 2',
    category: 'game',
    featured: false,
    compatibility: 'medium',
    recommendedCombinationId: 'hangul-double',
    hintPtBr: 'Steam permite parte dos caracteres, mas ha restricoes em alguns modos.',
    hintEn: 'Steam allows some characters, but restrictions exist in some modes.',
    hintEs: 'Steam permite algunos caracteres, pero hay restricciones en ciertos modos.',
  },
  {
    id: 'minecraft',
    slug: 'minecraft',
    name: 'Minecraft',
    category: 'game',
    featured: false,
    compatibility: 'unstable',
    recommendedCombinationId: 'zero-width-triple',
    hintPtBr: 'Depende da versao e do servidor; plugins podem bloquear totalmente.',
    hintEn: 'Depends on version and server; plugins may fully block it.',
    hintEs: 'Depende de la version y del servidor; plugins pueden bloquearlo por completo.',
  },
  {
    id: 'roblox',
    slug: 'roblox',
    name: 'Roblox',
    category: 'game',
    featured: true,
    compatibility: 'medium',
    recommendedCombinationId: 'hangul-double',
    hintPtBr: 'Filtro de chat e nome e dinamico; combine chars para maior chance.',
    hintEn: 'Chat and name filters are dynamic; combine chars for better odds.',
    hintEs: 'Los filtros de chat y nombre son dinamicos; combina caracteres para mejorar resultados.',
  },
  {
    id: 'gta-online',
    slug: 'gta-online',
    name: 'GTA Online',
    category: 'game',
    featured: false,
    compatibility: 'medium',
    recommendedCombinationId: 'hangul-zero-hangul',
    hintPtBr: 'Alguns clãs e crews aceitam, mas pode variar por plataforma.',
    hintEn: 'Some clans and crews accept it, but behavior changes by platform.',
    hintEs: 'Algunos clanes y crews lo aceptan, pero cambia segun la plataforma.',
  },
  {
    id: 'fifa-mobile',
    slug: 'fifa-mobile',
    name: 'FIFA Mobile',
    category: 'game',
    featured: false,
    compatibility: 'medium',
    recommendedCombinationId: 'hangul-double',
    hintPtBr: 'Campos de nome podem rejeitar espacos especiais tradicionais.',
    hintEn: 'Name fields may reject traditional special spaces.',
    hintEs: 'Los campos de nombre pueden rechazar espacios especiales tradicionales.',
  },
  {
    id: 'efootball',
    slug: 'efootball',
    name: 'eFootball',
    category: 'game',
    featured: false,
    compatibility: 'medium',
    recommendedCombinationId: 'zero-width-triple',
    hintPtBr: 'Testar sequencias diferentes aumenta chance de passar no validador.',
    hintEn: 'Testing different sequences improves validation success.',
    hintEs: 'Probar secuencias distintas mejora la probabilidad de pasar la validacion.',
  },
  {
    id: 'mobile-legends',
    slug: 'mobile-legends',
    name: 'Mobile Legends',
    category: 'game',
    featured: false,
    compatibility: 'high',
    recommendedCombinationId: 'hangul-double',
    hintPtBr: 'Normalmente funciona melhor com Hangul Filler repetido.',
    hintEn: 'Usually works best with repeated Hangul Filler.',
    hintEs: 'Normalmente funciona mejor con Hangul Filler repetido.',
  },
  {
    id: 'brawl-stars',
    slug: 'brawl-stars',
    name: 'Brawl Stars',
    category: 'game',
    featured: false,
    compatibility: 'unstable',
    recommendedCombinationId: 'braille-hangul-braille',
    hintPtBr: 'Supercell pode aplicar filtros novos sem aviso.',
    hintEn: 'Supercell can apply new filters without notice.',
    hintEs: 'Supercell puede aplicar nuevos filtros sin aviso.',
  },
  {
    id: 'clash-royale',
    slug: 'clash-royale',
    name: 'Clash Royale',
    category: 'game',
    featured: false,
    compatibility: 'unstable',
    recommendedCombinationId: 'hangul-triple',
    hintPtBr: 'Em alguns clãs passa, em outros o filtro bloqueia.',
    hintEn: 'May pass in some clans, but fail in others due to filtering.',
    hintEs: 'Puede funcionar en algunos clanes, pero fallar en otros por filtros.',
  },
  {
    id: 'clash-of-clans',
    slug: 'clash-of-clans',
    name: 'Clash of Clans',
    category: 'game',
    featured: false,
    compatibility: 'unstable',
    recommendedCombinationId: 'hangul-triple',
    hintPtBr: 'Validador de nome e severo em contas novas.',
    hintEn: 'Name validator is stricter on newer accounts.',
    hintEs: 'El validador de nombre es mas estricto en cuentas nuevas.',
  },
  {
    id: 'among-us',
    slug: 'among-us',
    name: 'Among Us',
    category: 'game',
    featured: false,
    compatibility: 'medium',
    recommendedCombinationId: 'hangul-double',
    hintPtBr: 'Atualizacoes podem alterar regras de nickname rapidamente.',
    hintEn: 'Updates can quickly change nickname rules.',
    hintEs: 'Las actualizaciones pueden cambiar rapido las reglas de nickname.',
  },
  {
    id: 'stumble-guys',
    slug: 'stumble-guys',
    name: 'Stumble Guys',
    category: 'game',
    featured: false,
    compatibility: 'medium',
    recommendedCombinationId: 'hangul-zero-hangul',
    hintPtBr: 'Tende a aceitar combinacoes curtas com 2 ou 3 chars.',
    hintEn: 'Tends to accept short 2-3 char combinations.',
    hintEs: 'Suele aceptar combinaciones cortas de 2 o 3 caracteres.',
  },
  {
    id: 'rocket-league',
    slug: 'rocket-league',
    name: 'Rocket League',
    category: 'game',
    featured: false,
    compatibility: 'medium',
    recommendedCombinationId: 'zero-width-triple',
    hintPtBr: 'Compatibilidade depende do launcher e da conta vinculada.',
    hintEn: 'Compatibility depends on launcher and linked account.',
    hintEs: 'La compatibilidad depende del launcher y de la cuenta vinculada.',
  },
  {
    id: 'apex-legends',
    slug: 'apex-legends',
    name: 'Apex Legends',
    category: 'game',
    featured: false,
    compatibility: 'unstable',
    recommendedCombinationId: 'braille-zero-braille',
    hintPtBr: 'EA pode restringir caracteres conforme politicas de seguranca.',
    hintEn: 'EA may restrict characters according to safety policies.',
    hintEs: 'EA puede restringir caracteres segun politicas de seguridad.',
  },
  {
    id: 'overwatch-2',
    slug: 'overwatch-2',
    name: 'Overwatch 2',
    category: 'game',
    featured: false,
    compatibility: 'unstable',
    recommendedCombinationId: 'braille-zero-braille',
    hintPtBr: 'BattleTag pode normalizar caracteres e remover invisiveis.',
    hintEn: 'BattleTag may normalize characters and strip invisibles.',
    hintEs: 'BattleTag puede normalizar caracteres y eliminar invisibles.',
  },
  {
    id: 'dota-2',
    slug: 'dota-2',
    name: 'Dota 2',
    category: 'game',
    featured: false,
    compatibility: 'medium',
    recommendedCombinationId: 'hangul-double',
    hintPtBr: 'Steam overlay pode exibir de forma diferente entre cliente e perfil.',
    hintEn: 'Steam overlay may display differently between client and profile.',
    hintEs: 'Steam overlay puede mostrarse distinto entre cliente y perfil.',
  },
  {
    id: 'rainbow-six-siege',
    slug: 'rainbow-six-siege',
    name: 'Rainbow Six Siege',
    category: 'game',
    featured: false,
    compatibility: 'unstable',
    recommendedCombinationId: 'braille-hangul-braille',
    hintPtBr: 'Ubisoft Connect possui filtros variaveis por regiao.',
    hintEn: 'Ubisoft Connect uses region-dependent filters.',
    hintEs: 'Ubisoft Connect usa filtros variables por region.',
  },
  {
    id: 'destiny-2',
    slug: 'destiny-2',
    name: 'Destiny 2',
    category: 'game',
    featured: false,
    compatibility: 'unstable',
    recommendedCombinationId: 'braille-hangul-braille',
    hintPtBr: 'Nomes podem ser normalizados quando sincronizados com plataforma.',
    hintEn: 'Names may be normalized when synchronized with platform account.',
    hintEs: 'Los nombres pueden normalizarse al sincronizar con la cuenta de plataforma.',
  },
  {
    id: 'genshin-impact',
    slug: 'genshin-impact',
    name: 'Genshin Impact',
    category: 'game',
    featured: false,
    compatibility: 'medium',
    recommendedCombinationId: 'hangul-zero-hangul',
    hintPtBr: 'Filtro de nickname pode variar entre servidores.',
    hintEn: 'Nickname filtering can vary by region server.',
    hintEs: 'El filtro de nickname puede variar segun el servidor.',
  },
  {
    id: 'honkai-star-rail',
    slug: 'honkai-star-rail',
    name: 'Honkai: Star Rail',
    category: 'game',
    featured: false,
    compatibility: 'medium',
    recommendedCombinationId: 'hangul-zero-hangul',
    hintPtBr: 'Use 2 ou 3 invisiveis para evitar bloqueio de tamanho minimo.',
    hintEn: 'Use 2 or 3 invisibles to avoid minimum length rejection.',
    hintEs: 'Usa 2 o 3 invisibles para evitar rechazo por longitud minima.',
  },
  {
    id: 'pokemon-go',
    slug: 'pokemon-go',
    name: 'Pokemon GO',
    category: 'game',
    featured: false,
    compatibility: 'unstable',
    recommendedCombinationId: 'braille-quad',
    hintPtBr: 'Niantic costuma bloquear nomes considerados fora do padrao.',
    hintEn: 'Niantic often blocks names considered out-of-pattern.',
    hintEs: 'Niantic suele bloquear nombres considerados fuera de patron.',
  },
  {
    id: 'hearthstone',
    slug: 'hearthstone',
    name: 'Hearthstone',
    category: 'game',
    featured: false,
    compatibility: 'unstable',
    recommendedCombinationId: 'braille-zero-braille',
    hintPtBr: 'BattleTag sincronizado pode sobrescrever nickname invisivel.',
    hintEn: 'Synced BattleTag may overwrite invisible nicknames.',
    hintEs: 'El BattleTag sincronizado puede sobrescribir nicks invisibles.',
  },
  {
    id: 'teamfight-tactics',
    slug: 'teamfight-tactics',
    name: 'Teamfight Tactics',
    category: 'game',
    featured: false,
    compatibility: 'unstable',
    recommendedCombinationId: 'braille-hangul-braille',
    hintPtBr: 'Mesmo ecossistema da Riot: suporte muda com patches.',
    hintEn: 'Same Riot ecosystem: support changes with patches.',
    hintEs: 'Mismo ecosistema Riot: el soporte cambia con parches.',
  },
  {
    id: 'world-of-warcraft',
    slug: 'world-of-warcraft',
    name: 'World of Warcraft',
    category: 'game',
    featured: false,
    compatibility: 'unstable',
    recommendedCombinationId: 'braille-quad',
    hintPtBr: 'Regras de nome de personagem sao mais restritivas.',
    hintEn: 'Character naming rules are generally more restrictive.',
    hintEs: 'Las reglas de nombre de personaje son mas restrictivas.',
  },
  {
    id: 'diablo-iv',
    slug: 'diablo-iv',
    name: 'Diablo IV',
    category: 'game',
    featured: false,
    compatibility: 'unstable',
    recommendedCombinationId: 'braille-quad',
    hintPtBr: 'Pode herdar politicas de Battle.net para nomes.',
    hintEn: 'May inherit Battle.net naming policies.',
    hintEs: 'Puede heredar politicas de nombres de Battle.net.',
  },
  {
    id: 'lost-ark',
    slug: 'lost-ark',
    name: 'Lost Ark',
    category: 'game',
    featured: false,
    compatibility: 'medium',
    recommendedCombinationId: 'hangul-triple',
    hintPtBr: 'Alguns servidores aceitam combinacoes com Hangul.',
    hintEn: 'Some servers accept Hangul-based combinations.',
    hintEs: 'Algunos servidores aceptan combinaciones con Hangul.',
  },
  {
    id: 'rust',
    slug: 'rust',
    name: 'Rust',
    category: 'game',
    featured: false,
    compatibility: 'medium',
    recommendedCombinationId: 'zero-width-triple',
    hintPtBr: 'Servidores com anticheat custom podem bloquear.',
    hintEn: 'Servers with custom anti-cheat rules may block it.',
    hintEs: 'Servidores con anti-cheat personalizado pueden bloquearlo.',
  },
  {
    id: 'warframe',
    slug: 'warframe',
    name: 'Warframe',
    category: 'game',
    featured: false,
    compatibility: 'medium',
    recommendedCombinationId: 'hangul-double',
    hintPtBr: 'Aceitacao varia por plataforma e regiao da conta.',
    hintEn: 'Acceptance varies by platform and account region.',
    hintEs: 'La aceptacion varia por plataforma y region de la cuenta.',
  },
  {
    id: 'paladins',
    slug: 'paladins',
    name: 'Paladins',
    category: 'game',
    featured: false,
    compatibility: 'medium',
    recommendedCombinationId: 'hangul-zero-hangul',
    hintPtBr: 'Nome exibido pode diferir entre launcher e partida.',
    hintEn: 'Displayed name can differ between launcher and match.',
    hintEs: 'El nombre mostrado puede variar entre launcher y partida.',
  },
  {
    id: 'osu',
    slug: 'osu',
    name: 'osu!',
    category: 'game',
    featured: false,
    compatibility: 'unstable',
    recommendedCombinationId: 'braille-quad',
    hintPtBr: 'Moderacao de comunidade pode remover nicks vazios.',
    hintEn: 'Community moderation can remove blank nicknames.',
    hintEs: 'La moderacion de comunidad puede eliminar nicks vacios.',
  },
  {
    id: 'mu-online',
    slug: 'mu-online',
    name: 'MU Online',
    category: 'game',
    featured: false,
    compatibility: 'medium',
    recommendedCombinationId: 'hangul-triple',
    hintPtBr: 'Servidores privados costumam ter regras diferentes do oficial.',
    hintEn: 'Private servers often use rules different from official servers.',
    hintEs: 'Los servidores privados suelen usar reglas distintas al oficial.',
  },
  {
    id: 'metin2',
    slug: 'metin2',
    name: 'Metin2',
    category: 'game',
    featured: false,
    compatibility: 'medium',
    recommendedCombinationId: 'hangul-triple',
    hintPtBr: 'Filtros antigos aceitam alguns espacos especiais.',
    hintEn: 'Older filters may accept some special spaces.',
    hintEs: 'Filtros antiguos pueden aceptar algunos espacios especiales.',
  },
  {
    id: 'point-blank',
    slug: 'point-blank',
    name: 'Point Blank',
    category: 'game',
    featured: false,
    compatibility: 'medium',
    recommendedCombinationId: 'hangul-zero-hangul',
    hintPtBr: 'Funciona melhor com combinacoes de 2 ou 3 invisiveis.',
    hintEn: 'Works better with 2-3 invisible combinations.',
    hintEs: 'Funciona mejor con combinaciones de 2 o 3 invisibles.',
  },
  {
    id: 'crossfire',
    slug: 'crossfire',
    name: 'CrossFire',
    category: 'game',
    featured: false,
    compatibility: 'medium',
    recommendedCombinationId: 'hangul-zero-hangul',
    hintPtBr: 'Pode exigir mais de 1 caractere para salvar nickname.',
    hintEn: 'May require more than one character to save nickname.',
    hintEs: 'Puede requerir mas de un caracter para guardar nickname.',
  },
  {
    id: 'instagram',
    slug: 'instagram',
    name: 'Instagram',
    category: 'social',
    featured: true,
    compatibility: 'medium',
    recommendedCombinationId: 'zero-width-triple',
    hintPtBr: 'Alguns campos aceitam invisivel, outros normalizam automaticamente.',
    hintEn: 'Some fields accept invisibles, others normalize automatically.',
    hintEs: 'Algunos campos aceptan invisibles, otros normalizan automaticamente.',
  },
  {
    id: 'tiktok',
    slug: 'tiktok',
    name: 'TikTok',
    category: 'social',
    featured: true,
    compatibility: 'medium',
    recommendedCombinationId: 'zero-width-triple',
    hintPtBr: 'Usuario pode passar e display name pode ser filtrado separadamente.',
    hintEn: 'Username may pass while display name is filtered separately.',
    hintEs: 'El usuario puede pasar y el nombre visible filtrarse por separado.',
  },
  {
    id: 'facebook',
    slug: 'facebook',
    name: 'Facebook',
    category: 'social',
    featured: false,
    compatibility: 'unstable',
    recommendedCombinationId: 'braille-hangul-braille',
    hintPtBr: 'Politicas de identidade normalmente restringem nome vazio.',
    hintEn: 'Identity policies usually restrict fully blank names.',
    hintEs: 'Las politicas de identidad suelen restringir nombres totalmente vacios.',
  },
  {
    id: 'x-twitter',
    slug: 'x-twitter',
    name: 'X (Twitter)',
    category: 'social',
    featured: false,
    compatibility: 'medium',
    recommendedCombinationId: 'zero-width-triple',
    hintPtBr: 'Display name pode aceitar sequencias invisiveis em alguns casos.',
    hintEn: 'Display name can accept invisible sequences in some cases.',
    hintEs: 'El nombre visible puede aceptar secuencias invisibles en algunos casos.',
  },
  {
    id: 'youtube',
    slug: 'youtube',
    name: 'YouTube',
    category: 'social',
    featured: false,
    compatibility: 'unstable',
    recommendedCombinationId: 'braille-quad',
    hintPtBr: 'Canal e handle seguem validacoes diferentes.',
    hintEn: 'Channel name and handle use different validators.',
    hintEs: 'El nombre del canal y el handle usan validaciones distintas.',
  },
  {
    id: 'twitch',
    slug: 'twitch',
    name: 'Twitch',
    category: 'social',
    featured: false,
    compatibility: 'unstable',
    recommendedCombinationId: 'braille-hangul-braille',
    hintPtBr: 'Username e nome de exibicao possuem regras separadas.',
    hintEn: 'Username and display name have different rules.',
    hintEs: 'El usuario y el nombre de visualizacion tienen reglas diferentes.',
  },
  {
    id: 'snapchat',
    slug: 'snapchat',
    name: 'Snapchat',
    category: 'social',
    featured: false,
    compatibility: 'medium',
    recommendedCombinationId: 'zero-width-triple',
    hintPtBr: 'Nome de exibicao pode aceitar invisivel melhor que username.',
    hintEn: 'Display name may accept invisibles better than username.',
    hintEs: 'El nombre visible puede aceptar invisibles mejor que el usuario.',
  },
  {
    id: 'telegram',
    slug: 'telegram',
    name: 'Telegram',
    category: 'social',
    featured: true,
    compatibility: 'high',
    recommendedCombinationId: 'hangul-double',
    hintPtBr: 'Nomes de perfil costumam aceitar combinacoes invisiveis.',
    hintEn: 'Profile names usually accept invisible combinations.',
    hintEs: 'Los nombres de perfil suelen aceptar combinaciones invisibles.',
  },
  {
    id: 'whatsapp',
    slug: 'whatsapp',
    name: 'WhatsApp',
    category: 'social',
    featured: true,
    compatibility: 'medium',
    recommendedCombinationId: 'hangul-double',
    hintPtBr: 'Nome do perfil pode variar por versao do app e sistema.',
    hintEn: 'Profile name behavior may vary by app and OS version.',
    hintEs: 'El comportamiento del nombre de perfil puede variar por version y sistema.',
  },
];

export const invisiblePlatforms: InvisiblePlatform[] = platformSeeds.map((platform) => ({
  ...platform,
  validationHint: {
    'pt-br': platform.hintPtBr,
    en: platform.hintEn,
    es: platform.hintEs,
  },
}));

export const compatibilityLabelByLocale: Record<
  AppLocale,
  Record<InvisibleCompatibilityLevel, string>
> = {
  'pt-br': {
    high: 'Alta chance de funcionar',
    medium: 'Funciona em parte dos casos',
    unstable: 'Instavel, depende da validacao',
  },
  en: {
    high: 'High chance to work',
    medium: 'Works in part of the cases',
    unstable: 'Unstable, validation dependent',
  },
  es: {
    high: 'Alta probabilidad de funcionar',
    medium: 'Funciona en parte de los casos',
    unstable: 'Inestable, depende de la validacion',
  },
};

const combinationById = new Map(
  invisibleCombinationDefinitions.map((combination) => [combination.id, combination]),
);

const characterByValue = new Map(
  invisibleCharacterDefinitions.map((character) => [character.value, character]),
);

export const getInvisiblePlatformById = (id: string): InvisiblePlatform | undefined =>
  invisiblePlatforms.find((platform) => platform.id === id);

export const getInvisiblePlatformBySlug = (slug: string): InvisiblePlatform | undefined =>
  invisiblePlatforms.find((platform) => platform.slug === slug);

export const getInvisibleCombinationById = (
  combinationId: string,
): InvisibleCombinationDefinition | undefined => combinationById.get(combinationId);

export const getRecommendedPatternForPlatform = (platformId: string): string => {
  const platform = getInvisiblePlatformById(platformId);

  if (!platform) {
    return invisibleCombinationDefinitions[0]?.value ?? '';
  }

  return (
    getInvisibleCombinationById(platform.recommendedCombinationId)?.value ??
    invisibleCombinationDefinitions[0]?.value ??
    ''
  );
};

const clampRepeat = (repeat: number): number => {
  if (!Number.isFinite(repeat)) {
    return 2;
  }

  return Math.max(1, Math.min(12, Math.trunc(repeat)));
};

export const buildInvisibleNickname = (pattern: string, repeat: number): string => {
  const safePattern = pattern || invisibleCombinationDefinitions[0]?.value || '';
  const size = clampRepeat(repeat);

  return Array.from({ length: size }, () => safePattern).join('');
};

export const buildRandomInvisibleNickname = (platformId: string): string => {
  const platform = getInvisiblePlatformById(platformId);
  const selected =
    getInvisibleCombinationById(platform?.recommendedCombinationId ?? '') ??
    invisibleCombinationDefinitions[0];
  const repeat = Math.floor(Math.random() * 3) + 2;

  return buildInvisibleNickname(selected?.value ?? '', repeat);
};

export type InvisibleDetectionMatch = {
  index: number;
  char: string;
  unicode: string;
  label: string;
  group: InvisibleCharacterGroup | 'unknown';
};

const unicodeInvisibleRegex = /[\p{Cf}\p{Zs}]/u;

const isPotentialInvisible = (char: string): boolean => {
  const codePoint = char.codePointAt(0) ?? 0;

  if (codePoint === 0x0020) {
    return false;
  }

  return unicodeInvisibleRegex.test(char) || codePoint === 0x3164 || codePoint === 0x2800;
};

export const detectInvisibleCharacters = (value: string): InvisibleDetectionMatch[] => {
  const matches: InvisibleDetectionMatch[] = [];
  let index = 0;

  for (const char of Array.from(value)) {
    const codePoint = char.codePointAt(0) ?? 0;
    const known = characterByValue.get(char);

    if (known) {
      matches.push({
        index,
        char,
        unicode: known.unicode,
        label: known.label,
        group: known.group,
      });
      index += 1;
      continue;
    }

    if (isPotentialInvisible(char)) {
      matches.push({
        index,
        char,
        unicode: unicodeLabel(codePoint),
        label: 'Caractere invisivel nao catalogado',
        group: 'unknown',
      });
    }

    index += 1;
  }

  return matches;
};

export const toUnicodeSequence = (value: string): string =>
  Array.from(value)
    .map((char) => {
      const codePoint = char.codePointAt(0) ?? 0;
      return unicodeLabel(codePoint);
    })
    .join(' ');
