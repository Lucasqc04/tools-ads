import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export type Cs2CrosshairCodesUiCopy = {
  searchLabel: string;
  searchPlaceholder: string;
  countryLabel: string;
  countryAll: string;
  teamLabel: string;
  teamAll: string;
  roleLabel: string;
  roleAll: string;
  withCodeOnly: string;
  resultCount: string;
  emptyState: string;
  copyCode: string;
  copiedCode: string;
  noCode: string;
  importTitle: string;
  importSteps: string[];
  updatedLabel: string;
  lastUsedLabel: string;
  confidenceLabel: string;
  confidenceValues: Record<'high' | 'medium' | 'low', string>;
  cautionTitle: string;
  cautionText: string;
  sourceLabel: string;
  currentCodeNote: string;
  legacyCodeNote: string;
  pixelGeneratorTitle: string;
  pixelGeneratorHelp: string;
  thicknessLabel: string;
  lengthLabel: string;
  gapLabel: string;
  gapHelp: string;
  copySettings: string;
  copiedSettings: string;
  officialUpdateLink: string;
};

export type Cs2CrosshairCodesLocaleContent = {
  name: string;
  shortDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  intro: string;
  contentBlocks: ContentBlock[];
  faq: FaqItem[];
  ui: Cs2CrosshairCodesUiCopy;
};

const ptBrContent: Cs2CrosshairCodesLocaleContent = {
  name: 'Codigos de Mira CS2 de Pro Players',
  shortDescription:
    'Encontre codigos de mira CS2 e CS:GO de jogadores profissionais, filtre por time/pais/funcao e copie em um clique.',
  primaryKeyword: 'codigos de mira cs2',
  secondaryKeywords: [
    'codigo de mira cs go',
    'mira de pro players cs2',
    'crosshair code cs2',
    'mira yuurih cs2',
    'mira donk cs2',
  ],
  searchIntent:
    'Jogadores de Counter-Strike que querem copiar codigos de mira de pro players, testar rapidamente e ajustar para seu proprio estilo.',
  seoTitle: 'Codigos de Mira CS2 e CS:GO de Pro Players | Copiar Crosshair',
  seoDescription:
    'Copie codigos de mira CS2/CS:GO de pro players, filtre por time, pais e funcao e veja como importar no Counter-Strike 2 em segundos.',
  h1: 'Codigos de Mira CS2 e CS:GO de Pro Players',
  intro:
    'Copie codigos de mira de jogadores profissionais do Counter-Strike 2, pesquise por nome, filtre por time, pais e funcao e importe a crosshair no jogo em poucos passos.',
  contentBlocks: [
    {
      title: 'Como usar esta base de miras no CS2',
      paragraphs: [
        'Esta pagina foi pensada para quem quer testar miras de pro players sem perder tempo em listas confusas. Voce pode buscar pelo nome do jogador, aplicar filtros por funcao e copiar o codigo no mesmo card.',
        'A base agora tem 31 perfis com codigos no formato atual. Vinte usam o codigo da partida mais recente registrada na CSstats, com partidas datadas de 8 a 28 de outubro de 2026; os outros 11 foram gerados a partir de configuracoes profissionais publicas. Cada ficha mostra a origem, a data da verificacao e, quando disponivel, a data da partida.',
        'Depois de importar, use o codigo como base e ajuste tamanho, gap, espessura e cor para o seu monitor e estilo de jogo. A melhor mira e a que voce consegue ler com clareza em qualquer mapa e situacao de combate.',
      ],
    },
    {
      title: 'Quando copiar mira de pro player ajuda de verdade',
      paragraphs: [
        'Copiar mira de jogador profissional funciona melhor quando voce quer encurtar o processo de tentativa e erro. Em vez de comecar do zero, voce parte de um setup ja usado em alto nivel competitivo e ajusta pequenos detalhes.',
        'Tambem e util quando voce muda de resolucao, de monitor ou de funcao no time. Um AWPer pode preferir uma leitura diferente de quem joga mais como entry ou lurker, por exemplo.',
      ],
      list: [
        'Teste pelo menos 2 ou 3 miras por alguns mapas antes de decidir.',
        'Nao troque de mira a cada partida para nao quebrar consistencia muscular.',
        'Guarde seus codigos favoritos no autoexec para trocar rapidamente.',
      ],
    },
    {
      title: 'Limites e avisos importantes',
      paragraphs: [
        'Jogadores profissionais podem mudar configuracoes por campeonato, monitor ou preferencia pessoal. A CSstats mostra o codigo da partida mais recente que registrou, mas esse historico depende das partidas disponiveis para cada atleta. Os 11 codigos gerados a partir de configuracoes publicas nao foram compartilhados diretamente pelos jogadores; codigos antigos que ainda nao foram renovados continuam marcados para confirmacao no cliente.',
        'Quando um codigo nao estiver confirmado com seguranca, ele fica marcado com confianca baixa. Nessas situacoes, use como referencia inicial e valide com outras fontes antes de tratar como configuracao definitiva.',
        'Tudo aqui e focado em praticidade para treino e melhoria de consistencia. O codigo nao substitui fundamentos como posicionamento, pre-fire, controle de spray e leitura de timing.',
      ],
    },
    {
      title: 'Privacidade e velocidade da ferramenta',
      paragraphs: [
        'A busca, os filtros e a copia do codigo funcionam no navegador. Voce nao precisa criar conta e nao precisa enviar documentos ou dados pessoais para usar a ferramenta.',
        'A pagina foi montada para ser leve e abrir rapido no celular e no desktop, mantendo foco total em copiar o codigo, importar no jogo e voltar para o treino.',
      ],
    },
  ],
  faq: [
    {
      question: 'Como importar um codigo de mira no CS2?',
      answer:
        'Abra Settings > Crosshair/Scopes > Share or Import e cole o codigo. Os codigos atuais comecam com CS; os antigos com CSGO- aparecem marcados no card e devem ser conferidos no jogo apos a conversao.',
    },
    {
      question: 'Esses codigos tambem funcionam para quem busca CS:GO crosshair?',
      answer:
        'Os termos de CS:GO ainda ajudam a encontrar configuracoes de mira. A Valve mudou o formato compartilhado em setembro de 2026, entao codigos anteriores a atualizacao precisam ser conferidos no jogo atual.',
    },
    {
      question: 'A mira de pro player pode mudar com o tempo?',
      answer:
        'Pode sim. Jogadores profissionais ajustam configuracoes com frequencia. Verifique a data de checagem e o nivel de confianca exibidos na pagina.',
    },
    {
      question: 'Copiar mira de pro player melhora minha mira automaticamente?',
      answer:
        'Nao automaticamente. O codigo ajuda como ponto de partida, mas consistencia vem de treino de mira, crosshair placement e tomada de decisao.',
    },
    {
      question: 'Preciso cadastrar conta para usar a ferramenta?',
      answer: 'Nao. A ferramenta e gratuita e pode ser usada sem cadastro.',
    },
  ],
  ui: {
    searchLabel: 'Buscar jogador',
    searchPlaceholder: 'Ex.: yuurih, donk, ZywOo',
    countryLabel: 'Pais',
    countryAll: 'Todos os paises',
    teamLabel: 'Time',
    teamAll: 'Todos os times',
    roleLabel: 'Funcao',
    roleAll: 'Todas as funcoes',
    withCodeOnly: 'Mostrar apenas jogadores com codigo confirmado',
    resultCount: 'jogador(es) encontrado(s)',
    emptyState: 'Nenhum jogador encontrado com esses filtros.',
    copyCode: 'Copiar codigo',
    copiedCode: 'Codigo copiado',
    noCode: 'Codigo de mira ainda nao confirmado com confianca.',
    importTitle: 'Como importar no CS2',
    importSteps: [
      'Abra o CS2 e entre em Settings.',
      'Vá em Game > Crosshair.',
      'Clique em Share or Import.',
      'Cole o codigo e confirme.',
    ],
    updatedLabel: 'Ultima checagem',
    lastUsedLabel: 'Ultima partida registrada',
    confidenceLabel: 'Confianca',
    confidenceValues: {
      high: 'Alta',
      medium: 'Media',
      low: 'Baixa',
    },
    cautionTitle: 'Aviso importante',
    cautionText:
      'A base tem 31 perfis com codigos atuais: 20 de partidas recentes e 11 baseados em configuracoes publicas. Confira a origem e a data em cada ficha.',
    sourceLabel: 'Fonte',
    currentCodeNote: 'Codigo no formato atual; veja a origem e a data abaixo.',
    legacyCodeNote:
      'Codigo anterior a atualizacao de setembro de 2026. Ele ainda nao foi revalidado no formato atual do CS2.',
    pixelGeneratorTitle: 'Gerador de mira no sistema atual de pixels',
    pixelGeneratorHelp:
      'A Valve agora mede espessura e comprimento em pixels. O exemplo oficial usa 1 px de espessura, 8 px de comprimento e gap 4. O jogo redimensiona os valores se a resolucao mudar.',
    thicknessLabel: 'Espessura (px)',
    lengthLabel: 'Comprimento (px)',
    gapLabel: 'Gap',
    gapHelp:
      'O gap negativo e permitido no estilo dinamico classico. Este gerador nao altera o estilo da sua mira.',
    copySettings: 'Copiar comandos',
    copiedSettings: 'Comandos copiados',
    officialUpdateLink: 'Notas oficiais da Valve',
  },
};

const enContent: Cs2CrosshairCodesLocaleContent = {
  name: 'CS2 Pro Crosshair Codes',
  shortDescription:
    'Browse CS2 and CS:GO crosshair codes from pro players, filter by team/country/role, and copy in one click.',
  primaryKeyword: 'cs2 crosshair codes',
  secondaryKeywords: [
    'csgo crosshair code',
    'pro cs2 crosshair',
    'best cs2 crosshair codes',
    'yuurih crosshair code',
    'donk crosshair code',
  ],
  searchIntent:
    'Counter-Strike players looking for practical pro crosshair codes to copy quickly and adapt for their own gameplay.',
  seoTitle: 'CS2 Crosshair Codes from Pro Players | Copy CSGO Crosshair Code',
  seoDescription:
    'Find and copy CS2/CS:GO crosshair codes from pro players, filter by role, team, and country, and import your crosshair in seconds.',
  h1: 'CS2 and CS:GO Crosshair Codes from Pro Players',
  intro:
    'Copy pro player crosshair codes for Counter-Strike 2, search by player name, filter by team/country/role, and import directly in-game.',
  contentBlocks: [
    {
      title: 'Use this CS2 crosshair database in a practical way',
      paragraphs: [
        'This page is built for speed. Instead of jumping across outdated screenshots, you can search by player name, filter by role, and copy the crosshair code from the same card.',
        'The database now has 31 profiles with current-format codes. Twenty use the code from each player’s latest match tracked by CSstats, with match dates from October 8 to 28, 2026; the other 11 were generated from public pro settings. Each card shows its source, verification date, and match date when available.',
        'After importing, adjust details like thickness, size, and color for your monitor and resolution. A pro code is a strong baseline, but the final crosshair should match your own visual comfort.',
      ],
    },
    {
      title: 'When pro crosshair presets are actually useful',
      paragraphs: [
        'Copying a pro setup is useful when you want to reduce trial-and-error. You start from a tested competitive baseline and fine-tune from there.',
        'It is especially useful when changing roles, maps, or video settings. AWPers and aggressive riflers often prefer different readability profiles in high-pressure rounds.',
      ],
      list: [
        'Test each crosshair for several maps before deciding.',
        'Avoid changing crosshair every match to keep consistency.',
        'Save your favorite presets in config files for quick swaps.',
      ],
    },
    {
      title: 'Important limitations and update notes',
      paragraphs: [
        'Professional players may change settings for tournaments, monitors, or personal preference. CSstats shows the latest match it has tracked, and its history depends on which matches are available for each player. The 11 codes generated from public settings were not shared directly by the players; older codes that have not been refreshed remain marked for in-game confirmation.',
        'When a code is not fully validated, we keep confidence as medium or low. Treat these entries as a starting point and confirm with additional reliable sources.',
        'A crosshair code helps with clarity, but aim performance still depends on positioning, crosshair placement discipline, spray control, and decision-making under pressure.',
      ],
    },
    {
      title: 'Privacy and fast usage',
      paragraphs: [
        'Search, filtering, and copy actions are handled in your browser. You can use the tool without creating an account.',
        'The layout is lightweight and mobile-friendly so you can copy a code quickly, jump into CS2, and continue practice without friction.',
      ],
    },
  ],
  faq: [
    {
      question: 'How do I import a crosshair code in CS2?',
      answer:
        'Open Settings > Crosshair/Scopes > Share or Import and paste the code. Current-format codes start with CS; older CSGO- codes are marked on their cards and should be checked in-game after conversion.',
    },
    {
      question: 'Do these codes work for CS:GO crosshair searches too?',
      answer:
        'CS:GO terms are still useful for finding crosshair settings. Valve changed the share-code format in September 2026, so entries from before the update need to be checked in the current game.',
    },
    {
      question: 'Can pro player crosshair settings change often?',
      answer:
        'Yes. Pro settings can change over time, so always check last update date and confidence level shown on each player card.',
    },
    {
      question: 'Will copying a pro code instantly improve my aim?',
      answer:
        'Not instantly. It helps you start from a good baseline, but improvement comes from disciplined training and gameplay fundamentals.',
    },
    {
      question: 'Is this tool free to use?',
      answer: 'Yes. It is free and does not require account creation.',
    },
  ],
  ui: {
    searchLabel: 'Search player',
    searchPlaceholder: 'e.g. yuurih, donk, ZywOo',
    countryLabel: 'Country',
    countryAll: 'All countries',
    teamLabel: 'Team',
    teamAll: 'All teams',
    roleLabel: 'Role',
    roleAll: 'All roles',
    withCodeOnly: 'Show only players with confirmed crosshair code',
    resultCount: 'player(s) found',
    emptyState: 'No players found with the selected filters.',
    copyCode: 'Copy code',
    copiedCode: 'Code copied',
    noCode: 'Crosshair code is not confirmed yet with strong confidence.',
    importTitle: 'How to import in CS2',
    importSteps: [
      'Open CS2 and go to Settings.',
      'Enter Game > Crosshair.',
      'Click Share or Import.',
      'Paste the code and confirm.',
    ],
    updatedLabel: 'Last checked',
    lastUsedLabel: 'Latest tracked match',
    confidenceLabel: 'Confidence',
    confidenceValues: {
      high: 'High',
      medium: 'Medium',
      low: 'Low',
    },
    cautionTitle: 'Important note',
    cautionText:
      'The database has 31 current-format profiles: 20 from recent matches and 11 based on public settings. Check each card for its source and date.',
    sourceLabel: 'Source',
    currentCodeNote: 'Current-format code; see the source and date below.',
    legacyCodeNote:
      'This code predates the September 2026 update and has not been revalidated in the current CS2 format.',
    pixelGeneratorTitle: 'Crosshair generator for the current pixel system',
    pixelGeneratorHelp:
      'Valve now measures thickness and length in pixels. Its official example uses 1 px thickness, 8 px length, and gap 4. The game rescales the values when your resolution changes.',
    thicknessLabel: 'Thickness (px)',
    lengthLabel: 'Length (px)',
    gapLabel: 'Gap',
    gapHelp:
      'Negative gaps are allowed with the classic dynamic style. This generator does not change your crosshair style.',
    copySettings: 'Copy commands',
    copiedSettings: 'Commands copied',
    officialUpdateLink: 'Valve official update notes',
  },
};

const esContent: Cs2CrosshairCodesLocaleContent = {
  name: 'Codigos de Mira CS2 de Pro Players',
  shortDescription:
    'Consulta codigos de mira de CS2 y CS:GO, filtra por equipo/pais/rol y copia cada crosshair en un clic.',
  primaryKeyword: 'codigo de mira cs2',
  secondaryKeywords: [
    'mira csgo codigo',
    'mira de pro players cs2',
    'cs2 crosshair code',
    'mira yuurih cs2',
    'mira donk cs2',
  ],
  searchIntent:
    'Jugadores de Counter-Strike que buscan copiar codigos de mira de profesionales y ajustarlos rapido para su estilo.',
  seoTitle: 'Codigos de Mira CS2 y CS:GO de Pro Players | Copiar Crosshair',
  seoDescription:
    'Copia codigos de mira CS2/CS:GO de pro players, filtra por equipo, pais y rol, y aprende como importar la crosshair en segundos.',
  h1: 'Codigos de Mira CS2 y CS:GO de Pro Players',
  intro:
    'Copia codigos de mira de profesionales de Counter-Strike 2, busca por nombre y filtra por equipo, pais y rol para importar rapido.',
  contentBlocks: [
    {
      title: 'Como aprovechar esta base de miras en CS2',
      paragraphs: [
        'La pagina esta enfocada en accion rapida: buscas el jugador, aplicas filtros y copias el codigo desde el mismo bloque sin pasos innecesarios.',
        'La base ahora tiene 31 perfiles con codigos en el formato actual. Veinte usan el codigo de la partida mas reciente registrada por CSstats, con partidas fechadas del 8 al 28 de octubre de 2026; los otros 11 se generaron desde configuraciones publicas de profesionales. Cada ficha muestra la fuente, la fecha de verificacion y, cuando esta disponible, la fecha de la partida.',
        'Despues de importar, conviene ajustar color, grosor, gap y tamano segun tu resolucion y visibilidad. Un codigo profesional es una base util, no un ajuste final obligatorio.',
      ],
    },
    {
      title: 'Cuando copiar una mira profesional si vale la pena',
      paragraphs: [
        'Copiar una mira de pro player reduce el tiempo de prueba y error, sobre todo si vienes de una configuracion inestable o cambiaste monitor/resolucion.',
        'Tambien ayuda al cambiar de rol. Un AWPer no siempre necesita la misma lectura visual que un entry o un lurker en rondas de alta velocidad.',
      ],
      list: [
        'Prueba cada mira durante varios mapas antes de fijarla.',
        'Evita cambiar de crosshair cada partida para mantener memoria visual.',
        'Guarda tus codigos favoritos para aplicarlos rapido cuando entrenas.',
      ],
    },
    {
      title: 'Limites y notas de actualizacion',
      paragraphs: [
        'Los jugadores profesionales pueden cambiar sus ajustes por torneos, monitores o preferencia. CSstats muestra la partida mas reciente que tiene registrada, pero el historial depende de las partidas disponibles para cada jugador. Los 11 codigos generados desde configuraciones publicas no fueron compartidos directamente por los jugadores; los codigos antiguos que faltan renovar siguen marcados para confirmarlos en el juego.',
        'Si un codigo no esta totalmente confirmado, queda marcado con confianza media o baja para que lo uses como referencia inicial y no como dato absoluto.',
        'Recuerda que la mira no reemplaza fundamentos de juego: colocacion de crosshair, control de spray, timing y toma de decisiones.',
      ],
    },
    {
      title: 'Privacidad y experiencia rapida',
      paragraphs: [
        'Busqueda, filtros y copia funcionan en el navegador. No necesitas crear cuenta para usar la herramienta.',
        'El diseno esta optimizado para movil y desktop, para copiar codigo, abrir CS2 y volver al entrenamiento sin friccion.',
      ],
    },
  ],
  faq: [
    {
      question: 'Como importo un codigo de mira en CS2?',
      answer:
        'Abre Settings > Crosshair/Scopes > Share or Import y pega el codigo. Los codigos actuales empiezan con CS; los codigos antiguos CSGO- aparecen marcados en la ficha y conviene revisarlos en el juego despues de convertirlos.',
    },
    {
      question: 'Estos codigos tambien sirven para busquedas de CS:GO crosshair?',
      answer:
        'Los terminos de CS:GO siguen ayudando a encontrar miras. Valve cambio el formato compartido en septiembre de 2026, asi que los codigos anteriores a la actualizacion deben comprobarse en el juego actual.',
    },
    {
      question: 'Las miras de pro players cambian con frecuencia?',
      answer:
        'Pueden cambiar. Revisa siempre la fecha de verificacion y la confianza indicada en cada tarjeta.',
    },
    {
      question: 'Copiar una mira profesional mejora mi aim automaticamente?',
      answer:
        'No automaticamente. Es un buen punto de partida, pero la mejora real viene del entrenamiento y de los fundamentos.',
    },
    {
      question: 'La herramienta es gratuita?',
      answer: 'Si. Puedes usarla gratis y sin registro.',
    },
  ],
  ui: {
    searchLabel: 'Buscar jugador',
    searchPlaceholder: 'Ej.: yuurih, donk, ZywOo',
    countryLabel: 'Pais',
    countryAll: 'Todos los paises',
    teamLabel: 'Equipo',
    teamAll: 'Todos los equipos',
    roleLabel: 'Rol',
    roleAll: 'Todos los roles',
    withCodeOnly: 'Mostrar solo jugadores con codigo confirmado',
    resultCount: 'jugador(es) encontrado(s)',
    emptyState: 'No se encontraron jugadores con esos filtros.',
    copyCode: 'Copiar codigo',
    copiedCode: 'Codigo copiado',
    noCode: 'Codigo de mira todavia no confirmado con confianza fuerte.',
    importTitle: 'Como importar en CS2',
    importSteps: [
      'Abre CS2 y entra en Settings.',
      'Ve a Game > Crosshair.',
      'Pulsa Share or Import.',
      'Pega el codigo y confirma.',
    ],
    updatedLabel: 'Ultima revision',
    lastUsedLabel: 'Ultima partida registrada',
    confidenceLabel: 'Confianza',
    confidenceValues: {
      high: 'Alta',
      medium: 'Media',
      low: 'Baja',
    },
    cautionTitle: 'Aviso importante',
    cautionText:
      'La base tiene 31 perfiles con codigos actuales: 20 de partidas recientes y 11 basados en ajustes publicos. Revisa la fuente y la fecha de cada ficha.',
    sourceLabel: 'Fuente',
    currentCodeNote: 'Codigo en formato actual; consulta la fuente y la fecha abajo.',
    legacyCodeNote:
      'Este codigo es anterior a la actualizacion de septiembre de 2026 y no fue revalidado en el formato actual de CS2.',
    pixelGeneratorTitle: 'Generador de mira para el sistema actual de pixeles',
    pixelGeneratorHelp:
      'Valve ahora mide grosor y longitud en pixeles. El ejemplo oficial usa 1 px de grosor, 8 px de longitud y gap 4. El juego reescala los valores si cambia la resolucion.',
    thicknessLabel: 'Grosor (px)',
    lengthLabel: 'Longitud (px)',
    gapLabel: 'Gap',
    gapHelp:
      'El gap negativo se permite con el estilo dinamico clasico. Este generador no cambia el estilo de tu mira.',
    copySettings: 'Copiar comandos',
    copiedSettings: 'Comandos copiados',
    officialUpdateLink: 'Notas oficiales de Valve',
  },
};

const zhContent: Cs2CrosshairCodesLocaleContent = {
  name: 'CS2 职业选手准星代码',
  shortDescription:
    '浏览职业选手的 CS2 和 CS:GO 准星代码,按战队/国家/位置筛选,一键复制。',
  primaryKeyword: 'cs2 准星代码',
  secondaryKeywords: [
    'csgo 准星代码',
    'cs2 职业选手准星',
    '最佳 cs2 准星代码',
    'yuurih 准星代码',
    'donk 准星代码',
  ],
  searchIntent:
    '希望快速复制职业选手准星代码并根据自己打法调整的 Counter-Strike 玩家。',
  seoTitle: '职业选手 CS2 准星代码 | 复制 CSGO 准星代码',
  seoDescription:
    '查找并复制职业选手的 CS2/CS:GO 准星代码,按位置、战队和国家筛选,几秒内导入你的准星。',
  h1: '职业选手的 CS2 与 CS:GO 准星代码',
  intro:
    '复制 Counter-Strike 2 职业选手的准星代码,按玩家姓名搜索,按战队/国家/位置筛选,并直接在游戏中导入。',
  contentBlocks: [
    {
      title: '如何高效使用这个 CS2 准星数据库',
      paragraphs: [
        '本页面专为速度而设计。你无需在过时的截图之间来回切换,只需按玩家姓名搜索、按位置筛选,并在同一张卡片中复制准星代码。',
        '本数据库现在有 31 位选手使用当前格式代码。20 个代码来自 CSstats 记录的选手最近一场比赛,比赛日期为 2026 年 10 月 8 日至 28 日;另外 11 个根据公开的职业选手设置生成。每张卡片会显示来源、核对日期,以及可用时的比赛日期。',
        '导入之后,请根据你的显示器和分辨率调整粗细、大小和颜色等细节。职业选手的代码是一个不错的起点,但最终的准星应该符合你自己的视觉舒适度。',
      ],
    },
    {
      title: '什么时候复制职业选手准星真的有用',
      paragraphs: [
        '当你想减少反复试错的时间时,复制职业选手的配置会很有帮助。你可以从一套经过高水平竞技验证的基础配置出发,再进行细节微调。',
        '在更换位置、地图或画面设置时也很有用。例如 AWP 手和进攻型步枪手在高压回合中往往偏好不同的视觉辨识度。',
      ],
      list: [
        '在最终确定前,先在多张地图上测试每个准星。',
        '不要每场比赛都更换准星,以免破坏肌肉记忆的一致性。',
        '将你喜欢的预设保存到配置文件中,方便快速切换。',
      ],
    },
    {
      title: '重要限制与更新说明',
      paragraphs: [
        '职业选手可能因赛事、显示器或个人偏好更改设置。CSstats 显示其记录到的最近一场比赛,记录完整度取决于每位选手可查到的比赛。11 个根据公开设置生成的代码并非选手本人直接分享;尚未更新的旧代码仍会标出,请在游戏中确认。',
        '当某个代码尚未被完全验证时,我们会将其标记为中等或较低可信度。这类信息请当作初步参考,并结合其他可靠来源加以确认。',
        '准星代码有助于提升清晰度,但实际的瞄准表现仍然取决于走位、准星预瞄习惯、压枪控制和高压下的判断力。',
      ],
    },
    {
      title: '隐私与快速使用体验',
      paragraphs: [
        '搜索、筛选和复制操作都在你的浏览器中完成。你无需注册账号即可使用本工具。',
        '页面设计轻量,在手机和电脑上都能快速打开,方便你复制代码、进入 CS2 并继续训练,不会有多余的操作阻碍。',
      ],
    },
  ],
  faq: [
    {
      question: '如何在 CS2 中导入准星代码?',
      answer:
        '进入 Settings > Crosshair/Scopes > Share or Import 并粘贴代码。当前格式的代码以 CS 开头;旧的 CSGO- 代码会在卡片上标出,转换后请在游戏中确认。',
    },
    {
      question: '这些代码也适用于搜索 CS:GO 准星的玩家吗?',
      answer: 'CS:GO 相关词汇仍可用于搜索准星设置。Valve 于 2026 年 9 月更改了分享代码格式,因此更新前的代码需要在当前游戏中确认。',
    },
    {
      question: '职业选手的准星设置会经常变化吗?',
      answer: '会的。职业选手的设置可能随时间调整,请始终查看每张卡片上显示的最后更新日期和可信度。',
    },
    {
      question: '复制职业选手的代码会立刻提升我的瞄准水平吗?',
      answer: '不会立刻提升。它能帮你从一个不错的基础开始,但真正的进步来自系统训练和扎实的基本功。',
    },
    {
      question: '这个工具免费吗?',
      answer: '是的,完全免费,且无需注册账号。',
    },
  ],
  ui: {
    searchLabel: '搜索选手',
    searchPlaceholder: '例如:yuurih、donk、ZywOo',
    countryLabel: '国家',
    countryAll: '全部国家',
    teamLabel: '战队',
    teamAll: '全部战队',
    roleLabel: '位置',
    roleAll: '全部位置',
    withCodeOnly: '仅显示已确认准星代码的选手',
    resultCount: '位选手',
    emptyState: '当前筛选条件下未找到选手。',
    copyCode: '复制代码',
    copiedCode: '代码已复制',
    noCode: '该准星代码尚未得到充分确认。',
    importTitle: '如何在 CS2 中导入',
    importSteps: [
      '打开 CS2 并进入 Settings。',
      '进入 Game > Crosshair。',
      '点击 Share or Import。',
      '粘贴代码并确认。',
    ],
    updatedLabel: '最后检查时间',
    lastUsedLabel: '最近记录的比赛',
    confidenceLabel: '可信度',
    confidenceValues: {
      high: '高',
      medium: '中',
      low: '低',
    },
    cautionTitle: '重要提示',
    cautionText:
      '本数据库有 31 位选手的当前格式代码:20 个来自近期比赛,11 个根据公开设置生成。请查看每张卡片的来源和日期。',
    sourceLabel: '来源',
    currentCodeNote: '当前格式代码;请查看下方来源和日期。',
    legacyCodeNote: '此代码早于 2026 年 9 月更新,尚未按当前 CS2 格式重新验证。',
    pixelGeneratorTitle: '当前像素准星设置生成器',
    pixelGeneratorHelp: 'Valve 现在以像素为单位调整准星粗细和长度。官方示例为粗细 1 px、长度 8 px、间距 4。更改分辨率时,游戏会重新缩放这些数值。',
    thicknessLabel: '粗细(px)',
    lengthLabel: '长度(px)',
    gapLabel: '间距',
    gapHelp: '经典动态样式允许负间距。本生成器不会更改你的准星样式。',
    copySettings: '复制指令',
    copiedSettings: '指令已复制',
    officialUpdateLink: 'Valve 官方更新说明',
  },
};

const contentByLocale: Record<AppLocale, Cs2CrosshairCodesLocaleContent> = {
  'pt-br': ptBrContent,
  en: enContent,
  es: esContent,
  zh: zhContent,
};

export const getCs2CrosshairCodesContent = (
  locale: AppLocale,
): Cs2CrosshairCodesLocaleContent => contentByLocale[locale];

export const cs2CrosshairCodesIntro = ptBrContent.intro;
export const cs2CrosshairCodesFaq = ptBrContent.faq;
export const cs2CrosshairCodesContentBlocks = ptBrContent.contentBlocks;
