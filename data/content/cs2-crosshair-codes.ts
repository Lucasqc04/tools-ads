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
  confidenceLabel: string;
  confidenceValues: Record<'high' | 'medium' | 'low', string>;
  cautionTitle: string;
  cautionText: string;
  sourceLabel: string;
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
        'Muitos jogadores ainda procuram por termo de CS:GO, e isso faz sentido: o formato do codigo continua no padrao CSGO-xxxxx. Na pratica, esses codigos continuam sendo usados no Counter-Strike 2 para importar configuracoes de crosshair.',
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
        'Jogadores profissionais podem mudar configuracoes com frequencia por fase, campeonato, monitor ou preferencia pessoal. Por isso cada card mostra data de ultima checagem e nivel de confianca da informacao.',
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
        'Abra Counter-Strike 2, va em Settings > Game > Crosshair e use a opcao de importacao. Cole o codigo CSGO-xxxxx e confirme para aplicar.',
    },
    {
      question: 'Esses codigos tambem funcionam para quem busca CS:GO crosshair?',
      answer:
        'Sim. Mesmo com o jogo atual sendo CS2, o formato de codigo de mira continua no padrao conhecido de CSGO crosshair code.',
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
    confidenceLabel: 'Confianca',
    confidenceValues: {
      high: 'Alta',
      medium: 'Media',
      low: 'Baixa',
    },
    cautionTitle: 'Aviso importante',
    cautionText:
      'Jogadores profissionais podem mudar suas configuracoes com o tempo. Mantemos esta pagina atualizada quando novas informacoes confiaveis aparecem.',
    sourceLabel: 'Fonte',
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
        'Many players still search for CS:GO crosshair terms, and that is expected. The import format still uses CSGO-style codes, so old naming behavior remains common in current CS2 searches.',
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
        'Professional players may update their settings often due to tournaments, monitor changes, or personal preference. That is why each entry includes last checked date and confidence level.',
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
        'Open Counter-Strike 2, go to Settings > Game > Crosshair, choose import/share, paste the CSGO-style code, and apply it.',
    },
    {
      question: 'Do these codes work for CS:GO crosshair searches too?',
      answer:
        'Yes. Even though the current game is CS2, the code format remains compatible with the known CSGO crosshair style.',
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
    confidenceLabel: 'Confidence',
    confidenceValues: {
      high: 'High',
      medium: 'Medium',
      low: 'Low',
    },
    cautionTitle: 'Important note',
    cautionText:
      'Professional players may change their settings over time. We keep this page updated when new reliable information is available.',
    sourceLabel: 'Source',
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
        'Muchos usuarios siguen buscando por terminos de CS:GO, y eso sigue siendo normal. El formato del codigo de mira mantiene el patron CSGO-xxxxx, por eso ambas intenciones de busqueda conviven.',
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
        'Los profesionales cambian configuraciones con el tiempo. Por eso cada jugador muestra fecha de verificacion y nivel de confianza de la informacion.',
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
        'Entra en Counter-Strike 2, abre Settings > Game > Crosshair, usa la opcion de importar/compartir, pega el codigo y confirma.',
    },
    {
      question: 'Estos codigos tambien sirven para busquedas de CS:GO crosshair?',
      answer:
        'Si. Aunque el juego actual es CS2, el formato de codigo sigue el estilo conocido de CSGO crosshair code.',
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
    confidenceLabel: 'Confianza',
    confidenceValues: {
      high: 'Alta',
      medium: 'Media',
      low: 'Baja',
    },
    cautionTitle: 'Aviso importante',
    cautionText:
      'Los jugadores profesionales pueden cambiar su configuracion con el tiempo. Actualizamos esta pagina cuando aparecen fuentes confiables nuevas.',
    sourceLabel: 'Fuente',
  },
};

const contentByLocale: Record<AppLocale, Cs2CrosshairCodesLocaleContent> = {
  'pt-br': ptBrContent,
  en: enContent,
  es: esContent,
};

export const getCs2CrosshairCodesContent = (
  locale: AppLocale,
): Cs2CrosshairCodesLocaleContent => contentByLocale[locale];

export const cs2CrosshairCodesIntro = ptBrContent.intro;
export const cs2CrosshairCodesFaq = ptBrContent.faq;
export const cs2CrosshairCodesContentBlocks = ptBrContent.contentBlocks;
