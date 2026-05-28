import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';
import type { Cs2ToolId } from '@/data/cs2/tools';

export type Cs2ToolLocaleContent = {
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
};

export type Cs2SharedUiCopy = {
  searchLabel: string;
  searchPlaceholder: string;
  categoryLabel: string;
  categoryAll: string;
  safeOnlyLabel: string;
  localOnlyLabel: string;
  svCheatsLabel: string;
  needsValidationLabel: string;
  recommendedLabel: string;
  resultsLabel: string;
  commandLabel: string;
  exampleLabel: string;
  copyCommand: string;
  copiedCommand: string;
  copyPreset: string;
  copiedPreset: string;
  copyCfg: string;
  copiedCfg: string;
  downloadCfg: string;
  generatedPreviewTitle: string;
  safetyTitle: string;
  safetyText: string;
  warningTitle: string;
  safeBadge: string;
  localBadge: string;
  svCheatsBadge: string;
  cautionBadge: string;
  dangerBadge: string;
  presetTitle: string;
  emptyState: string;
};

const safeWarning: Record<AppLocale, string> = {
  'pt-br':
    'Alguns binds e automacoes podem ser bloqueados ou considerados invalidos em servidores oficiais. Esta ferramenta prioriza comandos simples, treino local e configuracoes seguras.',
  en:
    'Some binds and automation features may be blocked or considered invalid on official servers. This tool focuses on simple commands, local practice and safe settings.',
  es:
    'Algunos binds y automatizaciones pueden estar bloqueados o considerarse invalidos en servidores oficiales. Esta herramienta prioriza comandos simples, practica local y configuraciones seguras.',
};

const performanceNote: Record<AppLocale, string> = {
  'pt-br':
    'Esses comandos ajudam a ajustar limite de FPS, telemetria e elementos visuais, mas o ganho real depende do hardware e das configuracoes do jogo.',
  en:
    'These commands help tune FPS caps, telemetry, and visual elements, but real gains depend on your hardware and full game setup.',
  es:
    'Estos comandos ayudan a ajustar limite de FPS, telemetria y elementos visuales, pero la mejora real depende del hardware y de la configuracion completa.',
};

export const cs2SafetyAlertByLocale = safeWarning;
export const cs2PerformanceHonestNoteByLocale = performanceNote;

export const cs2SharedUiCopyByLocale: Record<AppLocale, Cs2SharedUiCopy> = {
  'pt-br': {
    searchLabel: 'Buscar comando',
    searchPlaceholder: 'Ex.: sv_cheats, noclip, radar, viewmodel',
    categoryLabel: 'Categoria',
    categoryAll: 'Todas as categorias',
    safeOnlyLabel: 'Apenas comandos seguros para competitivo',
    localOnlyLabel: 'Apenas treino local/private server',
    svCheatsLabel: 'Apenas comandos que exigem sv_cheats 1',
    needsValidationLabel: 'Mostrar comandos marcados para validacao',
    recommendedLabel: 'Mostrar apenas recomendados para esta ferramenta',
    resultsLabel: 'comando(s) encontrado(s)',
    commandLabel: 'Comando',
    exampleLabel: 'Exemplo de uso',
    copyCommand: 'Copiar comando',
    copiedCommand: 'Comando copiado',
    copyPreset: 'Copiar preset',
    copiedPreset: 'Preset copiado',
    copyCfg: 'Copiar .cfg',
    copiedCfg: '.cfg copiado',
    downloadCfg: 'Baixar .cfg',
    generatedPreviewTitle: 'Preview gerado',
    safetyTitle: 'Aviso de seguranca',
    safetyText: safeWarning['pt-br'],
    warningTitle: 'Aviso',
    safeBadge: 'Seguro',
    localBadge: 'Treino local',
    svCheatsBadge: 'Requer sv_cheats',
    cautionBadge: 'Cuidado',
    dangerBadge: 'Nao recomendado',
    presetTitle: 'Presets prontos',
    emptyState: 'Nenhum comando encontrado com os filtros atuais.',
  },
  en: {
    searchLabel: 'Search command',
    searchPlaceholder: 'e.g. sv_cheats, noclip, radar, viewmodel',
    categoryLabel: 'Category',
    categoryAll: 'All categories',
    safeOnlyLabel: 'Only safe commands for competitive play',
    localOnlyLabel: 'Only local/private server commands',
    svCheatsLabel: 'Only commands requiring sv_cheats 1',
    needsValidationLabel: 'Show commands flagged for validation',
    recommendedLabel: 'Show only commands recommended for this tool',
    resultsLabel: 'command(s) found',
    commandLabel: 'Command',
    exampleLabel: 'Example use',
    copyCommand: 'Copy command',
    copiedCommand: 'Command copied',
    copyPreset: 'Copy preset',
    copiedPreset: 'Preset copied',
    copyCfg: 'Copy .cfg',
    copiedCfg: '.cfg copied',
    downloadCfg: 'Download .cfg',
    generatedPreviewTitle: 'Generated preview',
    safetyTitle: 'Safety notice',
    safetyText: safeWarning.en,
    warningTitle: 'Warning',
    safeBadge: 'Safe',
    localBadge: 'Local practice',
    svCheatsBadge: 'Requires sv_cheats',
    cautionBadge: 'Caution',
    dangerBadge: 'Not recommended',
    presetTitle: 'Ready presets',
    emptyState: 'No commands found for current filters.',
  },
  es: {
    searchLabel: 'Buscar comando',
    searchPlaceholder: 'Ej.: sv_cheats, noclip, radar, viewmodel',
    categoryLabel: 'Categoria',
    categoryAll: 'Todas las categorias',
    safeOnlyLabel: 'Solo comandos seguros para competitivo',
    localOnlyLabel: 'Solo comandos de practica local/private server',
    svCheatsLabel: 'Solo comandos que requieren sv_cheats 1',
    needsValidationLabel: 'Mostrar comandos marcados para validar',
    recommendedLabel: 'Mostrar solo recomendados para esta herramienta',
    resultsLabel: 'comando(s) encontrado(s)',
    commandLabel: 'Comando',
    exampleLabel: 'Ejemplo de uso',
    copyCommand: 'Copiar comando',
    copiedCommand: 'Comando copiado',
    copyPreset: 'Copiar preset',
    copiedPreset: 'Preset copiado',
    copyCfg: 'Copiar .cfg',
    copiedCfg: '.cfg copiado',
    downloadCfg: 'Descargar .cfg',
    generatedPreviewTitle: 'Preview generado',
    safetyTitle: 'Aviso de seguridad',
    safetyText: safeWarning.es,
    warningTitle: 'Aviso',
    safeBadge: 'Seguro',
    localBadge: 'Practica local',
    svCheatsBadge: 'Requiere sv_cheats',
    cautionBadge: 'Cuidado',
    dangerBadge: 'No recomendado',
    presetTitle: 'Presets listos',
    emptyState: 'No se encontraron comandos con esos filtros.',
  },
};

type ToolContentMode =
  | 'practice_commands'
  | 'practice_config'
  | 'grenades'
  | 'smokes'
  | 'bots'
  | 'radar'
  | 'hud'
  | 'hud_color'
  | 'viewmodel'
  | 'fps'
  | 'autoexec'
  | 'competitive'
  | 'tournament'
  | 'fun';

type ToolSeed = {
  mode: ToolContentMode;
  localized: Record<
    AppLocale,
    {
      name: string;
      shortDescription: string;
      primaryKeyword: string;
      secondaryKeywords: string[];
      searchIntent: string;
      seoTitle: string;
      seoDescription: string;
      h1: string;
      intro: string;
      focus: string;
    }
  >;
};

const buildContentBlocks = (locale: AppLocale, mode: ToolContentMode, focus: string): ContentBlock[] => {
  if (mode === 'fps') {
    return [
      {
        title:
          locale === 'pt-br'
            ? 'Comandos de performance sem promessa falsa'
            : locale === 'en'
              ? 'Performance commands without fake promises'
              : 'Comandos de rendimiento sin promesas falsas',
        paragraphs: [
          performanceNote[locale],
          locale === 'pt-br'
            ? 'Use comparacoes consistentes: mesmo mapa, mesma resolucao e mesma situacao. Isso evita conclusao errada sobre ganho de desempenho.'
            : locale === 'en'
              ? 'Use consistent comparisons: same map, same resolution, and same scenario. This avoids false conclusions about performance gains.'
              : 'Usa comparaciones consistentes: mismo mapa, misma resolucion y misma situacion. Asi evitas conclusiones falsas.',
        ],
      },
      {
        title:
          locale === 'pt-br'
            ? 'Comandos principais para medir e ajustar'
            : locale === 'en'
              ? 'Core commands for measuring and tuning'
              : 'Comandos clave para medir y ajustar',
        paragraphs: [
          locale === 'pt-br'
            ? 'fps_max, fps_max_ui, cl_showfps e cq_netgraph ajudam a montar baseline de desempenho. Ajustes visuais como tracers podem reduzir ruído em alguns setups.'
            : locale === 'en'
              ? 'fps_max, fps_max_ui, cl_showfps, and cq_netgraph help build a measurable performance baseline. Visual toggles such as tracers can reduce clutter on some setups.'
              : 'fps_max, fps_max_ui, cl_showfps y cq_netgraph ayudan a crear baseline medible. Ajustes visuales como tracers pueden reducir ruido en algunos equipos.',
          locale === 'pt-br'
            ? 'Evite alterar tudo ao mesmo tempo. Mudancas pequenas por etapa facilitam identificar causa de melhora ou piora.'
            : locale === 'en'
              ? 'Avoid changing everything at once. Small step-by-step adjustments make it easier to identify what improved or worsened.'
              : 'Evita cambiar todo a la vez. Ajustes pequenos por etapas facilitan identificar que mejoro o empeoro.',
        ],
      },
      {
        title:
          locale === 'pt-br'
            ? 'Separacao entre competitivo e treino local'
            : locale === 'en'
              ? 'Competitive vs local practice separation'
              : 'Separacion entre competitivo y practica local',
        paragraphs: [
          locale === 'pt-br'
            ? 'Comandos de FPS e HUD podem entrar em config competitiva segura. Comandos de treino local com sv_cheats devem ficar em arquivo separado.'
            : locale === 'en'
              ? 'FPS and HUD commands can be part of safe competitive config. Local sv_cheats practice commands should stay in separate files.'
              : 'Comandos de FPS y HUD pueden formar parte de config competitiva segura. Comandos locales con sv_cheats deben quedar separados.',
          safeWarning[locale],
        ],
      },
    ];
  }

  if (mode === 'hud_color') {
    return [
      {
        title:
          locale === 'pt-br'
            ? 'Mapa de cores da HUD no CS2'
            : locale === 'en'
              ? 'CS2 HUD color map'
              : 'Mapa de colores HUD en CS2',
        paragraphs: [
          locale === 'pt-br'
            ? 'A ferramenta traduz cl_hud_color para nomes amigáveis: default, white, light blue, blue, purple, red, orange, yellow, green, aqua e pink.'
            : locale === 'en'
              ? 'This tool maps cl_hud_color values to friendly names: default, white, light blue, blue, purple, red, orange, yellow, green, aqua, and pink.'
              : 'La herramienta mapea valores de cl_hud_color a nombres amigables: default, white, light blue, blue, purple, red, orange, yellow, green, aqua y pink.',
          locale === 'pt-br'
            ? 'Se algum valor mudar em update, marcamos como validacao para voce testar antes de fixar no autoexec.'
            : locale === 'en'
              ? 'If value behavior changes after updates, we flag it for validation before you lock it into autoexec.'
              : 'Si algun valor cambia tras updates, lo marcamos para validacion antes de fijarlo en autoexec.',
        ],
      },
      {
        title:
          locale === 'pt-br'
            ? 'Escolha de cor para leitura competitiva'
            : locale === 'en'
              ? 'Color choice for competitive readability'
              : 'Eleccion de color para lectura competitiva',
        paragraphs: [
          locale === 'pt-br'
            ? 'A melhor cor depende do contraste com mapa e brilho do monitor. O ideal e testar em mapas claros e escuros antes de fechar configuracao.'
            : locale === 'en'
              ? 'Best color depends on map contrast and monitor brightness. Test on bright and dark maps before locking your setup.'
              : 'El mejor color depende del contraste del mapa y brillo del monitor. Prueba en mapas claros y oscuros antes de fijar configuracion.',
          locale === 'pt-br'
            ? 'Comando de cor da HUD e client-side e normalmente seguro para competitivo, sem automacao de gameplay.'
            : locale === 'en'
              ? 'HUD color commands are client-side and generally safe for competitive play, with no gameplay automation.'
              : 'El comando de color HUD es cliente y normalmente seguro para competitivo, sin automatizacion de gameplay.',
        ],
      },
    ];
  }

  const isPracticeOrFun =
    mode === 'practice_commands' ||
    mode === 'practice_config' ||
    mode === 'grenades' ||
    mode === 'smokes' ||
    mode === 'bots' ||
    mode === 'fun';

  const modeTitle =
    locale === 'pt-br'
      ? `Como usar ${focus} no CS2`
      : locale === 'en'
        ? `How to use ${focus} in CS2`
        : `Como usar ${focus} en CS2`;

  const flowTitle =
    locale === 'pt-br'
      ? 'Fluxo recomendado de configuracao e treino'
      : locale === 'en'
        ? 'Recommended setup and training flow'
        : 'Flujo recomendado de configuracion y practica';

  const safetyTitle =
    locale === 'pt-br'
      ? 'Seguranca, limites e uso competitivo'
      : locale === 'en'
        ? 'Safety, limits, and competitive usage'
        : 'Seguridad, limites y uso competitivo';

  const firstParagraph =
    locale === 'pt-br'
      ? `A ferramenta de ${focus} foi criada para encurtar o caminho entre pesquisa e execucao. Em vez de montar comando manualmente, voce escolhe opcoes, copia blocos prontos e testa em segundos.`
      : locale === 'en'
        ? `The ${focus} tool is built to shorten the path from search intent to execution. Instead of assembling commands manually, you choose options, copy ready blocks, and test in seconds.`
        : `La herramienta de ${focus} fue creada para acortar el camino entre busqueda y ejecucion. En lugar de montar comandos manualmente, eliges opciones y copias bloques listos.`;

  const secondParagraph =
    locale === 'pt-br'
      ? 'Esse formato melhora consistencia de treino e evita erro de digitacao em momentos de pressa. Tambem facilita repetir rotina entre mapas e comparar resultados.'
      : locale === 'en'
        ? 'This format improves routine consistency and avoids typing mistakes under pressure. It also makes map-to-map repetition and result comparison easier.'
        : 'Este formato mejora consistencia de rutina y evita errores de escritura en momentos de prisa. Tambien facilita repetir y comparar resultados.';

  const flowParagraphA =
    locale === 'pt-br'
      ? isPracticeOrFun
        ? 'Use presets para montar base rapida e depois ajuste detalhes por objetivo: smoke, spray, bots, movimento ou sessao fun de servidor privado.'
        : 'Comece com um preset equilibrado, ajuste em passos pequenos e valide por alguns mapas antes de adotar em definitivo.'
      : locale === 'en'
        ? isPracticeOrFun
          ? 'Use presets for a quick baseline, then adjust details by objective: smokes, spray, bots, movement, or private fun sessions.'
          : 'Start from a balanced preset, tune in small steps, and validate over several maps before adopting permanently.'
        : isPracticeOrFun
          ? 'Usa presets para base rapida y luego ajusta detalles por objetivo: smokes, spray, bots, movimiento o sesion fun privada.'
          : 'Empieza con preset equilibrado, ajusta en pasos pequenos y valida en varios mapas antes de fijar definitivo.';

  const flowParagraphB =
    locale === 'pt-br'
      ? mode === 'autoexec'
        ? 'Mantenha autoexec.cfg para comandos client-side e separe practice.cfg/fun.cfg para comandos locais. Isso reduz risco operacional em dia de partida oficial.'
        : 'Salve comandos em arquivo .cfg quando a rotina estiver boa. Reaplicar com exec reduz friccao e mantém o treino organizado.'
      : locale === 'en'
        ? mode === 'autoexec'
          ? 'Keep autoexec.cfg for client-side commands and separate practice.cfg/fun.cfg for local-only commands. This reduces operational risk on official match days.'
          : 'Save your routine in .cfg files once stable. Reapplying with exec reduces friction and keeps practice structured.'
        : mode === 'autoexec'
          ? 'Mantén autoexec.cfg para comandos cliente y separa practice.cfg/fun.cfg para comandos locales. Esto reduce riesgo en dias oficiales.'
          : 'Guarda rutina en archivos .cfg cuando este estable. Reaplicar con exec reduce friccion y mantiene practica organizada.';

  const safetyParagraphA =
    locale === 'pt-br'
      ? mode === 'competitive' || mode === 'tournament'
        ? 'Config competitiva segura deve evitar comandos de treino local e automacao de multiplas acoes. Priorize radar, HUD, viewmodel, audio, FPS e binds simples.'
        : 'Comandos com sv_cheats devem ficar em treino local/private server. Para competitivo oficial mantenha apenas ajustes client-side comuns.'
      : locale === 'en'
        ? mode === 'competitive' || mode === 'tournament'
          ? 'Safe competitive config should avoid local training commands and multi-action automation. Prioritize radar, HUD, viewmodel, audio, FPS, and simple binds.'
          : 'sv_cheats commands should stay in local/private practice. For official competitive play, keep only common client-side adjustments.'
        : mode === 'competitive' || mode === 'tournament'
          ? 'Config competitiva segura debe evitar comandos locales y automatizacion multiaccion. Prioriza radar, HUD, viewmodel, audio, FPS y binds simples.'
          : 'Comandos con sv_cheats deben quedarse en practica local/private. Para competitivo oficial, usa solo ajustes cliente comunes.';

  return [
    {
      title: modeTitle,
      paragraphs: [firstParagraph, secondParagraph],
    },
    {
      title: flowTitle,
      paragraphs: [flowParagraphA, flowParagraphB],
      list:
        locale === 'pt-br'
          ? [
              'Defina objetivo da sessao antes de copiar comandos.',
              'Teste em blocos pequenos e registre o que funcionou.',
              'Mantenha um preset base para nao recomeçar do zero.',
            ]
          : locale === 'en'
            ? [
                'Define session objective before copying commands.',
                'Test in small blocks and record what worked.',
                'Keep one baseline preset so you do not restart from zero.',
              ]
            : [
                'Define objetivo de sesion antes de copiar comandos.',
                'Prueba en bloques pequenos y registra lo que funciono.',
                'Mantén un preset base para no reiniciar desde cero.',
              ],
    },
    {
      title: safetyTitle,
      paragraphs: [safetyParagraphA, safeWarning[locale]],
    },
  ];
};

const buildFaq = (locale: AppLocale, mode: ToolContentMode): FaqItem[] => {
  const q = (pt: string, en: string, es: string) =>
    locale === 'pt-br' ? pt : locale === 'en' ? en : es;

  const base: FaqItem[] = [
    {
      question: q(
        'Como abrir o console no CS2?',
        'How do I open console in CS2?',
        'Como abro la consola en CS2?',
      ),
      answer: q(
        'Ative Developer Console nas configuracoes e use a tecla configurada para abrir durante treino ou partida.',
        'Enable Developer Console in settings and use your configured key during practice or matches.',
        'Activa Developer Console en ajustes y usa tu tecla configurada durante practica o partida.',
      ),
    },
    {
      question: q(
        'Posso usar esses comandos no competitivo oficial?',
        'Can I use these commands in official competitive matches?',
        'Puedo usar estos comandos en competitivo oficial?',
      ),
      answer: q(
        'Apenas comandos client-side comuns. Comandos de treino local com sv_cheats devem ficar fora da config competitiva.',
        'Only common client-side commands. Local sv_cheats training commands should stay out of competitive config.',
        'Solo comandos cliente comunes. Comandos locales con sv_cheats deben quedar fuera de la config competitiva.',
      ),
    },
  ];

  if (mode === 'autoexec') {
    base.push(
      {
        question: q(
          'Onde colocar autoexec.cfg, practice.cfg e fun.cfg?',
          'Where should I place autoexec.cfg, practice.cfg, and fun.cfg?',
          'Donde debo colocar autoexec.cfg, practice.cfg y fun.cfg?',
        ),
        answer: q(
          'Salve os arquivos na pasta cfg do CS2 e carregue com exec autoexec, exec practice e exec fun conforme o contexto.',
          'Save files in the CS2 cfg folder and run exec autoexec, exec practice, and exec fun depending on context.',
          'Guarda archivos en carpeta cfg de CS2 y ejecuta exec autoexec, exec practice y exec fun segun contexto.',
        ),
      },
      {
        question: q(
          'Por que separar arquivos em vez de usar um so?',
          'Why separate files instead of one single file?',
          'Por que separar archivos en lugar de uno solo?',
        ),
        answer: q(
          'Separar evita que comando de treino local entre por engano na config de competitivo oficial.',
          'Separation prevents local training commands from leaking into official competitive config by mistake.',
          'Separar evita que comandos de practica local entren por error en config competitiva oficial.',
        ),
      },
    );
  }

  if (mode === 'hud_color') {
    base.push({
      question: q(
        'Como mudar a cor da HUD no CS2?',
        'How do I change HUD color in CS2?',
        'Como cambio color de HUD en CS2?',
      ),
      answer: q(
        'Use cl_hud_color com o numero da cor desejada e salve no autoexec para manter padrao.',
        'Use cl_hud_color with your desired color value and store it in autoexec for consistency.',
        'Usa cl_hud_color con el valor de color deseado y guardalo en autoexec para mantener consistencia.',
      ),
    });
  }

  if (mode === 'fps') {
    base.push({
      question: q(
        'Esses comandos garantem aumento de FPS?',
        'Do these commands guarantee higher FPS?',
        'Estos comandos garantizan mas FPS?',
      ),
      answer: q(
        'Nao. Eles ajudam a ajustar comportamento, mas o resultado final depende do hardware e do setup completo.',
        'No. They help tune behavior, but final results depend on hardware and complete setup.',
        'No. Ayudan a ajustar comportamiento, pero el resultado final depende de hardware y setup completo.',
      ),
    });
  }

  if (mode === 'fun' || mode === 'tournament' || mode === 'competitive') {
    base.push({
      question: q(
        'Binds de automacao sao recomendados?',
        'Are automation binds recommended?',
        'Se recomiendan binds de automatizacion?',
      ),
      answer: safeWarning[locale],
    });
  }

  if (base.length < 3) {
    base.push({
      question: q(
        'Como salvar comandos em arquivo .cfg?',
        'How can I save commands into a .cfg file?',
        'Como guardo comandos en archivo .cfg?',
      ),
      answer: q(
        'Crie o arquivo na pasta cfg, coloque um comando por linha e execute com exec nome-do-arquivo.',
        'Create the file in the cfg folder, place one command per line, and run it with exec file-name.',
        'Crea el archivo en carpeta cfg, coloca un comando por linea y ejecútalo con exec nombre-del-archivo.',
      ),
    });
  }

  return base.slice(0, 5);
};

const seedByToolId: Record<Cs2ToolId, ToolSeed> = {
  'cs2-practice-commands': {
    mode: 'practice_commands',
    localized: {
      'pt-br': {
        name: 'Comandos de Treino CS2',
        shortDescription:
          'Copie comandos de treino CS2 para smokes, bots, tempo de rodada, compra e repeticao de granadas.',
        primaryKeyword: 'comandos de treino cs2',
        secondaryKeywords: [
          'config de treino cs2',
          'comandos granadas cs2',
          'treinar smoke cs2',
          'sv_cheats cs2',
          'comandos bots cs2',
        ],
        searchIntent:
          'Jogadores que querem montar uma sessao de treino local no CS2 com comandos prontos e sem perder tempo.',
        seoTitle: 'Comandos de Treino CS2 - Config para Smokes, Bots e Granadas',
        seoDescription:
          'Copie comandos de treino para CS2 com dinheiro alto, tempo longo, municao infinita, noclip, rethrow e presets para smokes e spray.',
        h1: 'Comandos de treino CS2',
        intro:
          'Copie comandos uteis para criar sessao de treino no Counter-Strike 2 com dinheiro maximo, tempo longo, municao infinita, bots e granadas.',
        focus: 'comandos de treino',
      },
      en: {
        name: 'CS2 Practice Commands',
        shortDescription:
          'Copy CS2 training commands for smokes, bots, round setup, economy, and grenade repetition.',
        primaryKeyword: 'cs2 practice commands',
        secondaryKeywords: [
          'cs2 practice config',
          'cs2 grenade commands',
          'cs2 smoke practice',
          'cs2 bot commands',
          'cs2 sv_cheats commands',
        ],
        searchIntent:
          'Players who want a ready local CS2 training setup with practical command bundles.',
        seoTitle: 'CS2 Practice Commands - Grenades, Bots, Smokes and Training Setup',
        seoDescription:
          'Copy useful CS2 local practice commands: infinite ammo, long rounds, grenade preview, bots, noclip, and ready presets.',
        h1: 'CS2 practice commands',
        intro:
          'Copy practical commands to build your CS2 training session with long rounds, high economy, bots, utility repetition and local practice flow.',
        focus: 'practice commands',
      },
      es: {
        name: 'Comandos de Practica CS2',
        shortDescription:
          'Copia comandos de practica CS2 para smokes, bots, tiempo de ronda, compra y repeticion de granadas.',
        primaryKeyword: 'comandos de practica cs2',
        secondaryKeywords: [
          'config de practica cs2',
          'comandos granadas cs2',
          'practicar smokes cs2',
          'sv_cheats cs2',
          'comandos bots cs2',
        ],
        searchIntent:
          'Jugadores que quieren montar una sesion de practica local en CS2 con comandos listos.',
        seoTitle: 'Comandos de Practica CS2 - Smokes, Bots, Granadas y Config',
        seoDescription:
          'Copia comandos utiles de practica CS2: municion infinita, rondas largas, trayectoria, bots, noclip y presets listos.',
        h1: 'Comandos de practica CS2',
        intro:
          'Copia comandos utiles para crear una sesion de practica en CS2 con rondas largas, economia alta, bots y repeticion de utilidades.',
        focus: 'comandos de practica',
      },
    },
  },
  'cs2-practice-config': {
    mode: 'practice_config',
    localized: {
      'pt-br': {
        name: 'Config de Treino CS2',
        shortDescription:
          'Monte practice.cfg para treino solo, smokes, spray, bots e movimentacao com comandos prontos para copiar e baixar.',
        primaryKeyword: 'config de treino cs2',
        secondaryKeywords: [
          'practice cfg cs2',
          'treinar smoke cs2',
          'config treino granadas cs2',
          'autoexec treino cs2',
        ],
        searchIntent:
          'Jogadores que querem gerar e baixar arquivos .cfg para treino local no CS2 sem montar comandos manualmente.',
        seoTitle: 'Config de Treino CS2 - Gerar practice.cfg com Smokes, Bots e Spray',
        seoDescription:
          'Gere practice.cfg para CS2 com presets de treino basico, granadas, bots e spray. Copie comandos ou baixe arquivo pronto.',
        h1: 'Config de treino CS2',
        intro:
          'Monte uma config de treino para Counter-Strike 2 com presets prontos, copie os comandos e baixe practice.cfg para usar no lobby local.',
        focus: 'config de treino',
      },
      en: {
        name: 'CS2 Practice Config Generator',
        shortDescription:
          'Generate practice.cfg for solo drills, smokes, spray, bots, and movement with copy and download ready output.',
        primaryKeyword: 'cs2 practice config',
        secondaryKeywords: [
          'cs2 practice cfg',
          'cs2 smoke practice config',
          'cs2 grenade config',
          'exec practice cs2',
        ],
        searchIntent:
          'Players who want ready-to-run .cfg files for local CS2 practice without manual command assembly.',
        seoTitle: 'CS2 Practice Config Generator - Build practice.cfg for Smokes, Bots and Spray',
        seoDescription:
          'Build CS2 practice.cfg with ready presets for basic training, grenades, bots, and spray drills. Copy or download in one click.',
        h1: 'CS2 practice config generator',
        intro:
          'Build your CS2 practice config with ready presets, copy command blocks, and download practice.cfg for local lobbies.',
        focus: 'practice config',
      },
      es: {
        name: 'Config de Practica CS2',
        shortDescription:
          'Genera practice.cfg para entrenamiento solo, smokes, spray, bots y movimiento con copia y descarga.',
        primaryKeyword: 'config de practica cs2',
        secondaryKeywords: [
          'practice cfg cs2',
          'config practica granadas cs2',
          'entrenar smokes cs2',
          'exec practice cs2',
        ],
        searchIntent:
          'Jugadores que quieren archivos .cfg listos para practica local en CS2 sin montar comandos a mano.',
        seoTitle: 'Config de Practica CS2 - Generar practice.cfg para Smokes, Bots y Spray',
        seoDescription:
          'Genera practice.cfg de CS2 con presets listos para practica basica, granadas, bots y spray. Copia o descarga rapido.',
        h1: 'Generador de config de practica CS2',
        intro:
          'Crea tu config de practica para CS2 con presets listos, copia bloques de comandos y descarga practice.cfg.',
        focus: 'config de practica',
      },
    },
  },
  'cs2-grenade-practice-commands': {
    mode: 'grenades',
    localized: {
      'pt-br': {
        name: 'Comandos de Granadas CS2',
        shortDescription:
          'Comandos para treino de granadas no CS2: trajetoria, rethrow, impactos, noclip e limpeza de projetis.',
        primaryKeyword: 'comandos granadas cs2',
        secondaryKeywords: [
          'comando rastro granada cs2',
          'comando repetir granada cs2',
          'treino smoke cs2',
          'sv_rethrow_last_grenade',
        ],
        searchIntent:
          'Jogadores que querem repetir lineups de granada no CS2 com feedback visual e comandos de reset rapido.',
        seoTitle: 'Comandos de Granadas CS2 - Rastro, Rethrow e Treino de Utility',
        seoDescription:
          'Copie comandos de granada para CS2: sv_grenade_trajectory_prac_pipreview, sv_rethrow_last_grenade, noclip, impactos e limpeza de projetis.',
        h1: 'Comandos de granadas CS2',
        intro:
          'Treine lineups de granadas no CS2 com comandos de rastro, repeticao da ultima granada, noclip e impactos para validar cada tentativa.',
        focus: 'comandos de granadas',
      },
      en: {
        name: 'CS2 Grenade Practice Commands',
        shortDescription:
          'CS2 grenade training commands for trajectory preview, rethrow, impacts, noclip, and projectile cleanup.',
        primaryKeyword: 'cs2 grenade practice commands',
        secondaryKeywords: [
          'cs2 grenade trajectory command',
          'cs2 rethrow last grenade command',
          'cs2 smoke practice commands',
          'sv_rethrow_last_grenade',
        ],
        searchIntent:
          'Players who want repeatable CS2 grenade lineups with fast reset and visual feedback commands.',
        seoTitle: 'CS2 Grenade Practice Commands - Trajectory, Rethrow and Utility Training',
        seoDescription:
          'Copy CS2 grenade commands including trajectory preview, sv_rethrow_last_grenade, impacts, noclip, and projectile cleanup.',
        h1: 'CS2 grenade practice commands',
        intro:
          'Train CS2 utility lineups with trajectory preview, last-grenade rethrow, noclip movement, and impact feedback for each attempt.',
        focus: 'grenade practice commands',
      },
      es: {
        name: 'Comandos de Granadas CS2',
        shortDescription:
          'Comandos de granadas CS2 con trayectoria, rethrow, impactos, noclip y limpieza de proyectiles.',
        primaryKeyword: 'comandos granadas cs2',
        secondaryKeywords: [
          'comando trayectoria granada cs2',
          'comando repetir granada cs2',
          'practica smoke cs2',
          'sv_rethrow_last_grenade',
        ],
        searchIntent:
          'Jugadores que quieren repetir lineups de granadas en CS2 con feedback visual y reset rapido.',
        seoTitle: 'Comandos de Granadas CS2 - Trayectoria, Rethrow y Practica de Utility',
        seoDescription:
          'Copia comandos de granadas CS2 con trayectoria, sv_rethrow_last_grenade, impactos, noclip y limpieza de proyectiles.',
        h1: 'Comandos de granadas CS2',
        intro:
          'Entrena lineups de granadas en CS2 con trayectoria, repeticion de ultima granada, noclip e impactos para validar cada tiro.',
        focus: 'comandos de granadas',
      },
    },
  },
  'cs2-smoke-practice-commands': {
    mode: 'smokes',
    localized: {
      'pt-br': {
        name: 'Comandos de Smoke CS2',
        shortDescription:
          'Comandos focados em treino de smoke no CS2 com rethrow, noclip, trajetoria e round longo para repeticao.',
        primaryKeyword: 'comandos smoke cs2',
        secondaryKeywords: [
          'treinar smoke cs2',
          'comandos para treinar smoke cs2',
          'lineups smoke cs2',
          'rethrow granada cs2',
        ],
        searchIntent:
          'Jogadores que querem rotina dedicada para treinar smoke no CS2 com repeticao rapida e leitura visual de trajeto.',
        seoTitle: 'Comandos de Smoke CS2 - Treinar Lineups com Rethrow e Trajetoria',
        seoDescription:
          'Copie comandos para treinar smoke no CS2 com sv_grenade_trajectory_prac_pipreview, sv_rethrow_last_grenade, noclip e tempo de round alto.',
        h1: 'Comandos para treinar smoke no CS2',
        intro:
          'Use comandos focados em smoke para acelerar treino de lineup no CS2 com repeticao da ultima granada, noclip e trajetoria visual.',
        focus: 'comandos de smoke',
      },
      en: {
        name: 'CS2 Smoke Practice Commands',
        shortDescription:
          'Smoke-focused CS2 practice command set with rethrow, noclip, trajectory preview, and long-round repetition.',
        primaryKeyword: 'cs2 smoke practice commands',
        secondaryKeywords: [
          'train smokes cs2',
          'cs2 smoke lineup commands',
          'cs2 rethrow smoke command',
          'cs2 utility practice',
        ],
        searchIntent:
          'Players who need a dedicated smoke-practice routine in CS2 with fast repetition and visual trajectory feedback.',
        seoTitle: 'CS2 Smoke Practice Commands - Train Lineups with Rethrow and Trajectory',
        seoDescription:
          'Copy CS2 smoke practice commands with trajectory preview, rethrow bind, noclip movement, and long round setup.',
        h1: 'CS2 smoke practice commands',
        intro:
          'Use smoke-focused commands to speed up CS2 lineup training with rethrow, noclip, and trajectory visualization.',
        focus: 'smoke practice commands',
      },
      es: {
        name: 'Comandos de Smoke CS2',
        shortDescription:
          'Comandos enfocados en practica de smokes CS2 con rethrow, noclip, trayectoria y rondas largas.',
        primaryKeyword: 'comandos smoke cs2',
        secondaryKeywords: [
          'practicar smoke cs2',
          'comandos para practicar smokes cs2',
          'lineups smoke cs2',
          'rethrow granada cs2',
        ],
        searchIntent:
          'Jugadores que quieren rutina dedicada para practicar smoke en CS2 con repeticion rapida y lectura visual.',
        seoTitle: 'Comandos de Smoke CS2 - Practicar Lineups con Rethrow y Trayectoria',
        seoDescription:
          'Copia comandos para practicar smokes en CS2 con trayectoria, rethrow, noclip y ronda larga.',
        h1: 'Comandos para practicar smoke en CS2',
        intro:
          'Usa comandos enfocados en smoke para acelerar entrenamiento de lineups en CS2 con rethrow, noclip y trayectoria.',
        focus: 'comandos de smoke',
      },
    },
  },
  'cs2-bot-commands': {
    mode: 'bots',
    localized: {
      'pt-br': {
        name: 'Comandos de Bots CS2',
        shortDescription:
          'Adicione, pare, posicione e configure bots no CS2 para treino de peek, pre-fire, spray e movimentacao.',
        primaryKeyword: 'comandos bot cs2',
        secondaryKeywords: ['como colocar bot cs2', 'bot_place cs2', 'bot_stop 1 cs2', 'treino com bots cs2'],
        searchIntent:
          'Jogadores que querem controlar bots no CS2 para treinos especificos sem depender de servidor cheio.',
        seoTitle: 'Comandos de Bot CS2 - Como Colocar, Parar e Treinar com Bots',
        seoDescription:
          'Use comandos de bot no CS2 para adicionar bot_add_t, bot_add_ct, bot_stop, bot_place, dificuldade e treino de respawn.',
        h1: 'Comandos de bots CS2',
        intro:
          'Configure bots no CS2 para treino de pre-fire, posicionamento, spray e movimentacao com comandos simples e blocos prontos.',
        focus: 'comandos de bots',
      },
      en: {
        name: 'CS2 Bot Commands',
        shortDescription:
          'Add, freeze, place, and tune bots in CS2 for peek drills, pre-fire training, spray routines, and movement practice.',
        primaryKeyword: 'cs2 bot commands',
        secondaryKeywords: [
          'how to place bots cs2',
          'bot_place command cs2',
          'bot_stop 1 cs2',
          'cs2 bot practice',
        ],
        searchIntent:
          'Players who need full bot control in CS2 for focused drills without relying on live servers.',
        seoTitle: 'CS2 Bot Commands - How to Add, Freeze and Train with Bots',
        seoDescription:
          'Use CS2 bot commands like bot_add_t, bot_add_ct, bot_stop, bot_place, difficulty presets, and respawn training setup.',
        h1: 'CS2 bot commands',
        intro:
          'Configure CS2 bots for pre-fire, positioning, spray, and movement drills with practical command blocks.',
        focus: 'bot commands',
      },
      es: {
        name: 'Comandos de Bots CS2',
        shortDescription:
          'Agrega, congela, posiciona y ajusta bots en CS2 para peek, pre-fire, spray y movimiento.',
        primaryKeyword: 'comandos bots cs2',
        secondaryKeywords: ['como poner bots cs2', 'bot_place cs2', 'bot_stop 1 cs2', 'practica con bots cs2'],
        searchIntent:
          'Jugadores que necesitan control total de bots en CS2 para ejercicios enfocados sin servidor lleno.',
        seoTitle: 'Comandos de Bots CS2 - Como Agregar, Parar y Practicar',
        seoDescription:
          'Usa comandos de bots CS2 como bot_add_t, bot_add_ct, bot_stop, bot_place, dificultad y respawn para practica.',
        h1: 'Comandos de bots CS2',
        intro:
          'Configura bots de CS2 para pre-fire, posicionamiento, spray y movimiento con bloques de comandos listos.',
        focus: 'comandos de bots',
      },
    },
  },
  'cs2-radar-settings': {
    mode: 'radar',
    localized: {
      'pt-br': {
        name: 'Configuracao de Radar CS2',
        shortDescription:
          'Gere comandos de radar CS2 para leitura competitiva com escala, rotacao, centralizacao e cores de teammates.',
        primaryKeyword: 'configuracao radar cs2',
        secondaryKeywords: [
          'comandos radar cs2',
          'cl_radar_scale cs2',
          'radar competitivo cs2',
          'cl_hud_radar_scale cs2',
        ],
        searchIntent:
          'Jogadores que querem ajustar radar do CS2 para melhorar leitura de mapa e informacao de equipe.',
        seoTitle: 'Configuracao de Radar CS2 - Gerador de Comandos Competitivos',
        seoDescription:
          'Ajuste cl_radar_scale, cl_hud_radar_scale, cl_radar_rotate e outros comandos de radar CS2 para melhorar tomada de decisao.',
        h1: 'Configuracao de radar CS2',
        intro:
          'Monte comandos de radar no CS2 para ganhar leitura de rotacao, espacamento e informacao de teammates em partidas competitivas.',
        focus: 'configuracao de radar',
      },
      en: {
        name: 'CS2 Radar Settings Generator',
        shortDescription:
          'Generate CS2 radar command setups with scale, rotation, centering, and teammate color visibility.',
        primaryKeyword: 'cs2 radar settings',
        secondaryKeywords: [
          'cs2 radar commands',
          'cl_radar_scale cs2',
          'competitive radar cs2',
          'cl_hud_radar_scale cs2',
        ],
        searchIntent:
          'Players who want to optimize CS2 radar readability for map awareness and team information.',
        seoTitle: 'CS2 Radar Settings - Competitive Command Generator',
        seoDescription:
          'Tune cl_radar_scale, cl_hud_radar_scale, cl_radar_rotate and related CS2 radar commands for better decisions.',
        h1: 'CS2 radar settings generator',
        intro:
          'Build CS2 radar settings that improve rotation awareness, spacing reads, and teammate information in competitive rounds.',
        focus: 'radar settings',
      },
      es: {
        name: 'Configuracion de Radar CS2',
        shortDescription:
          'Genera configuraciones de radar CS2 con escala, rotacion, centrado y colores de companeros.',
        primaryKeyword: 'configuracion radar cs2',
        secondaryKeywords: [
          'comandos radar cs2',
          'cl_radar_scale cs2',
          'radar competitivo cs2',
          'cl_hud_radar_scale cs2',
        ],
        searchIntent:
          'Jugadores que quieren optimizar radar de CS2 para mejor lectura de mapa y equipo.',
        seoTitle: 'Configuracion de Radar CS2 - Generador de Comandos Competitivos',
        seoDescription:
          'Ajusta cl_radar_scale, cl_hud_radar_scale, cl_radar_rotate y otros comandos de radar CS2 para mejorar decisiones.',
        h1: 'Generador de configuracion de radar CS2',
        intro:
          'Configura radar de CS2 para mejorar lectura de rotaciones, espaciado e informacion de companeros en competitivo.',
        focus: 'configuracion de radar',
      },
    },
  },
  'cs2-hud-commands': {
    mode: 'hud',
    localized: {
      'pt-br': {
        name: 'Comandos de HUD CS2',
        shortDescription:
          'Ajuste HUD no CS2 com escala, loadout, death notices e cores para manter informacao clara em partidas competitivas.',
        primaryKeyword: 'comandos hud cs2',
        secondaryKeywords: ['hud_scaling cs2', 'cl_showloadout cs2', 'cl_hud_color cs2', 'mudar hud cs2'],
        searchIntent:
          'Jogadores que querem HUD mais limpo e legivel no CS2 sem remover informacoes importantes.',
        seoTitle: 'Comandos HUD CS2 - Escala, Cores e Interface Competitiva',
        seoDescription:
          'Copie comandos de HUD CS2 para ajustar hud_scaling, cl_showloadout, cl_hud_color e elementos de interface para leitura mais rapida.',
        h1: 'Comandos de HUD CS2',
        intro:
          'Ajuste a interface do CS2 com comandos de HUD para equilibrar visibilidade, foco no round e leitura de informacoes essenciais.',
        focus: 'comandos de HUD',
      },
      en: {
        name: 'CS2 HUD Commands',
        shortDescription:
          'Tune CS2 HUD with scaling, loadout visibility, death notices, and color options for clearer competitive information.',
        primaryKeyword: 'cs2 hud commands',
        secondaryKeywords: ['hud_scaling cs2', 'cl_showloadout cs2', 'cl_hud_color cs2', 'clean hud cs2'],
        searchIntent:
          'Players who want a cleaner, more readable CS2 HUD without losing critical match information.',
        seoTitle: 'CS2 HUD Commands - Scaling, Colors, and Competitive Interface',
        seoDescription:
          'Copy CS2 HUD commands to tune hud_scaling, cl_showloadout, cl_hud_color and interface clarity for faster reads.',
        h1: 'CS2 HUD commands',
        intro:
          'Tune your CS2 interface with HUD commands to balance visibility, round focus, and essential information clarity.',
        focus: 'HUD commands',
      },
      es: {
        name: 'Comandos de HUD CS2',
        shortDescription:
          'Ajusta HUD en CS2 con escala, loadout, death notices y colores para informacion clara en competitivo.',
        primaryKeyword: 'comandos hud cs2',
        secondaryKeywords: ['hud_scaling cs2', 'cl_showloadout cs2', 'cl_hud_color cs2', 'cambiar hud cs2'],
        searchIntent:
          'Jugadores que quieren HUD mas limpio y legible en CS2 sin perder informacion importante.',
        seoTitle: 'Comandos HUD CS2 - Escala, Colores e Interfaz Competitiva',
        seoDescription:
          'Copia comandos de HUD CS2 para ajustar hud_scaling, cl_showloadout, cl_hud_color y mejorar lectura.',
        h1: 'Comandos de HUD CS2',
        intro:
          'Ajusta la interfaz de CS2 con comandos de HUD para equilibrar visibilidad, foco y lectura de informacion esencial.',
        focus: 'comandos de HUD',
      },
    },
  },
  'cs2-hud-color': {
    mode: 'hud_color',
    localized: {
      'pt-br': {
        name: 'Gerador de Cor da HUD CS2',
        shortDescription:
          'Escolha cor da HUD no CS2 por nome amigavel e gere comando cl_hud_color para copiar no autoexec.',
        primaryKeyword: 'mudar cor hud cs2',
        secondaryKeywords: ['cl_hud_color cs2', 'cores hud cs2', 'hud color cs2 comando', 'hud rosa cs2'],
        searchIntent:
          'Jogadores que querem mudar cor da HUD no CS2 rapidamente sem decorar valores numericos.',
        seoTitle: 'Mudar Cor da HUD CS2 - Gerador cl_hud_color',
        seoDescription:
          'Gere comando cl_hud_color no CS2 com nomes de cores amigaveis e copie rapidamente para sua config.',
        h1: 'Mudar cor da HUD no CS2',
        intro:
          'Escolha a cor da HUD no CS2 por nome, veja o comando correspondente e copie cl_hud_color pronto para usar no console ou autoexec.',
        focus: 'cor da HUD',
      },
      en: {
        name: 'CS2 HUD Color Generator',
        shortDescription:
          'Pick CS2 HUD colors with friendly names and generate cl_hud_color commands ready for autoexec.',
        primaryKeyword: 'cs2 hud color',
        secondaryKeywords: ['cl_hud_color cs2', 'cs2 hud color codes', 'change hud color cs2', 'pink hud cs2'],
        searchIntent:
          'Players who want to change CS2 HUD color quickly without memorizing numeric values.',
        seoTitle: 'CS2 HUD Color Generator - cl_hud_color Commands',
        seoDescription:
          'Generate CS2 cl_hud_color commands using friendly color names and copy them instantly to your config.',
        h1: 'CS2 HUD color generator',
        intro:
          'Pick a HUD color by name, see the matching command, and copy cl_hud_color ready for console or autoexec.',
        focus: 'HUD color',
      },
      es: {
        name: 'Generador de Color HUD CS2',
        shortDescription:
          'Elige color de HUD en CS2 con nombres amigables y genera comando cl_hud_color para autoexec.',
        primaryKeyword: 'color hud cs2',
        secondaryKeywords: ['cl_hud_color cs2', 'colores hud cs2', 'cambiar color hud cs2', 'hud rosa cs2'],
        searchIntent:
          'Jugadores que quieren cambiar color de HUD en CS2 sin memorizar valores numericos.',
        seoTitle: 'Color HUD CS2 - Generador de comando cl_hud_color',
        seoDescription:
          'Genera comando cl_hud_color en CS2 con nombres de color amigables y copia rapido a tu config.',
        h1: 'Generador de color HUD en CS2',
        intro:
          'Elige color de HUD por nombre, mira el comando y copia cl_hud_color listo para consola o autoexec.',
        focus: 'color de HUD',
      },
    },
  },
  'cs2-viewmodel-generator': {
    mode: 'viewmodel',
    localized: {
      'pt-br': {
        name: 'Gerador de Viewmodel CS2',
        shortDescription:
          'Ajuste viewmodel_fov e offsets no CS2 com presets prontos e comando final para copiar no console ou autoexec.',
        primaryKeyword: 'gerador viewmodel cs2',
        secondaryKeywords: ['viewmodel cs2', 'viewmodel_fov 68', 'viewmodel_offset_x', 'config viewmodel competitivo'],
        searchIntent:
          'Jogadores que querem ajustar posicao da arma no CS2 para melhorar leitura de tela sem perder referencia.',
        seoTitle: 'Gerador de Viewmodel CS2 - FOV, Offsets e Presets Prontos',
        seoDescription:
          'Monte seu viewmodel no CS2 com viewmodel_fov, offset_x/y/z e presets como compact, pro style e max visibility.',
        h1: 'Gerador de viewmodel CS2',
        intro:
          'Ajuste FOV e offsets da arma no CS2 com presets prontos e copie o comando final para manter consistencia no treino e competitivo.',
        focus: 'viewmodel',
      },
      en: {
        name: 'CS2 Viewmodel Generator',
        shortDescription:
          'Tune viewmodel_fov and offsets in CS2 with ready presets and copyable command output.',
        primaryKeyword: 'cs2 viewmodel generator',
        secondaryKeywords: ['cs2 viewmodel settings', 'viewmodel_fov 68', 'viewmodel_offset_x cs2', 'pro viewmodel cs2'],
        searchIntent:
          'Players who want to adjust weapon model position in CS2 for better screen clarity and consistency.',
        seoTitle: 'CS2 Viewmodel Generator - FOV, Offsets and Ready Presets',
        seoDescription:
          'Build your CS2 viewmodel using viewmodel_fov and x/y/z offsets with presets like compact, pro style, and max visibility.',
        h1: 'CS2 viewmodel generator',
        intro:
          'Tune weapon FOV and offsets in CS2 with ready presets, then copy final commands for consistent practice and competitive play.',
        focus: 'viewmodel',
      },
      es: {
        name: 'Generador de Viewmodel CS2',
        shortDescription:
          'Ajusta viewmodel_fov y offsets en CS2 con presets listos y comando final para copiar.',
        primaryKeyword: 'generador viewmodel cs2',
        secondaryKeywords: ['viewmodel cs2', 'viewmodel_fov 68', 'viewmodel_offset_x cs2', 'config viewmodel competitivo'],
        searchIntent:
          'Jugadores que quieren ajustar posicion del arma en CS2 para mejor lectura y consistencia.',
        seoTitle: 'Generador de Viewmodel CS2 - FOV, Offsets y Presets Listos',
        seoDescription:
          'Configura tu viewmodel en CS2 con viewmodel_fov y offsets x/y/z usando presets como compact, pro style y max visibility.',
        h1: 'Generador de viewmodel CS2',
        intro:
          'Ajusta FOV y offsets del arma en CS2 con presets listos y copia comando final para mantener consistencia.',
        focus: 'viewmodel',
      },
    },
  },
  'cs2-fps-commands': {
    mode: 'fps',
    localized: {
      'pt-br': {
        name: 'Comandos de FPS CS2',
        shortDescription:
          'Ajuste limite de FPS, telemetria e elementos visuais no CS2 com comandos prontos para copiar e testar.',
        primaryKeyword: 'comandos fps cs2',
        secondaryKeywords: ['aumentar fps cs2', 'fps_max cs2', 'cl_showfps cs2', 'comandos performance cs2'],
        searchIntent:
          'Jogadores que querem organizar comandos de performance no CS2 sem promessa falsa de ganho garantido.',
        seoTitle: 'Comandos FPS CS2 - Limite, Telemetria e Ajustes de Performance',
        seoDescription:
          'Copie comandos de FPS para CS2 como fps_max, cl_showfps, cq_netgraph e ajustes visuais para testar performance no seu PC.',
        h1: 'Comandos de FPS no CS2',
        intro:
          'Teste comandos de limite de FPS e telemetria no CS2 para equilibrar fluidez, estabilidade e visibilidade durante partidas e treinos.',
        focus: 'comandos de FPS',
      },
      en: {
        name: 'CS2 FPS Commands',
        shortDescription:
          'Tune FPS caps, telemetry, and visual elements in CS2 with ready commands you can copy and test.',
        primaryKeyword: 'cs2 fps commands',
        secondaryKeywords: ['best cs2 performance commands', 'fps_max cs2', 'cl_showfps cs2', 'cs2 telemetry commands'],
        searchIntent:
          'Players who want practical CS2 performance command tuning without unrealistic guaranteed-FPS claims.',
        seoTitle: 'CS2 FPS Commands - Caps, Telemetry and Performance Tweaks',
        seoDescription:
          'Copy CS2 FPS commands like fps_max, cl_showfps, cq_netgraph, and visual toggles to test performance on your hardware.',
        h1: 'CS2 FPS commands',
        intro:
          'Test FPS cap and telemetry commands in CS2 to balance smoothness, stability, and visibility during matches and practice.',
        focus: 'FPS commands',
      },
      es: {
        name: 'Comandos de FPS CS2',
        shortDescription:
          'Ajusta limite de FPS, telemetria y elementos visuales en CS2 con comandos listos para probar.',
        primaryKeyword: 'comandos fps cs2',
        secondaryKeywords: ['aumentar fps cs2', 'fps_max cs2', 'cl_showfps cs2', 'comandos rendimiento cs2'],
        searchIntent:
          'Jugadores que quieren ajustar comandos de rendimiento en CS2 sin promesas irreales de FPS garantizado.',
        seoTitle: 'Comandos FPS CS2 - Limite, Telemetria y Ajustes de Rendimiento',
        seoDescription:
          'Copia comandos de FPS CS2 como fps_max, cl_showfps, cq_netgraph y ajustes visuales para probar rendimiento.',
        h1: 'Comandos de FPS en CS2',
        intro:
          'Prueba comandos de limite de FPS y telemetria en CS2 para equilibrar fluidez, estabilidad y visibilidad.',
        focus: 'comandos de FPS',
      },
    },
  },
  'cs2-autoexec-generator': {
    mode: 'autoexec',
    localized: {
      'pt-br': {
        name: 'Gerador de Autoexec CS2',
        shortDescription:
          'Gere autoexec.cfg, practice.cfg e fun.cfg separados com radar, HUD, viewmodel, FPS, audio e binds simples.',
        primaryKeyword: 'gerador autoexec cs2',
        secondaryKeywords: ['autoexec cs2', 'practice cfg cs2', 'fun cfg cs2', 'config competitiva cs2'],
        searchIntent:
          'Jogadores que querem organizar configuracoes do CS2 em arquivos separados para competitivo, treino e fun/private server.',
        seoTitle: 'Gerador Autoexec CS2 - autoexec.cfg, practice.cfg e fun.cfg',
        seoDescription:
          'Monte arquivos de config CS2 separados por objetivo: autoexec competitivo, practice cfg para treino local e fun cfg para servidor privado.',
        h1: 'Gerador de autoexec CS2',
        intro:
          'Selecione blocos de comandos e gere arquivos separados para autoexec competitivo, treino local e comandos divertidos de servidor privado.',
        focus: 'autoexec',
      },
      en: {
        name: 'CS2 Autoexec Generator',
        shortDescription:
          'Generate separate autoexec.cfg, practice.cfg, and fun.cfg files with radar, HUD, viewmodel, FPS, audio, and simple binds.',
        primaryKeyword: 'cs2 autoexec generator',
        secondaryKeywords: ['cs2 autoexec', 'cs2 practice cfg', 'cs2 fun cfg', 'safe cs2 config generator'],
        searchIntent:
          'Players who want structured CS2 config files separated by use case: competitive, practice, and private fun servers.',
        seoTitle: 'CS2 Autoexec Generator - autoexec.cfg, practice.cfg and fun.cfg',
        seoDescription:
          'Build separated CS2 config files by purpose: competitive autoexec, local practice cfg, and private fun cfg.',
        h1: 'CS2 autoexec generator',
        intro:
          'Select command blocks and generate separate files for competitive autoexec, local practice, and private fun-server commands.',
        focus: 'autoexec',
      },
      es: {
        name: 'Generador de Autoexec CS2',
        shortDescription:
          'Genera autoexec.cfg, practice.cfg y fun.cfg separados con radar, HUD, viewmodel, FPS, audio y binds simples.',
        primaryKeyword: 'generador autoexec cs2',
        secondaryKeywords: ['autoexec cs2', 'practice cfg cs2', 'fun cfg cs2', 'config competitiva cs2'],
        searchIntent:
          'Jugadores que quieren organizar configuraciones CS2 en archivos separados para competitivo, practica y fun/private.',
        seoTitle: 'Generador Autoexec CS2 - autoexec.cfg, practice.cfg y fun.cfg',
        seoDescription:
          'Monta archivos de config CS2 separados por objetivo: autoexec competitivo, practice cfg local y fun cfg privado.',
        h1: 'Generador de autoexec CS2',
        intro:
          'Selecciona bloques de comandos y genera archivos separados para autoexec competitivo, practica local y comandos fun de servidor privado.',
        focus: 'autoexec',
      },
    },
  },
  'cs2-competitive-config': {
    mode: 'competitive',
    localized: {
      'pt-br': {
        name: 'Config Competitiva CS2',
        shortDescription:
          'Monte config competitiva segura no CS2 com radar, viewmodel, HUD, FPS e binds simples sem comandos de treino.',
        primaryKeyword: 'config competitiva cs2',
        secondaryKeywords: ['config safe cs2', 'binds seguros cs2', 'radar competitivo cs2', 'viewmodel competitivo cs2'],
        searchIntent:
          'Jogadores que querem base de configuracao competitiva no CS2 sem comandos arriscados ou locais.',
        seoTitle: 'Config Competitiva CS2 - Radar, Viewmodel, HUD e Binds Seguros',
        seoDescription:
          'Gere config competitiva segura para CS2 com comandos client-side comuns e sem sv_cheats, noclip ou automacao arriscada.',
        h1: 'Config competitiva CS2',
        intro:
          'Monte uma config competitiva segura para CS2 com foco em leitura de radar, clareza de HUD, viewmodel consistente e binds simples.',
        focus: 'config competitiva',
      },
      en: {
        name: 'CS2 Competitive Config',
        shortDescription:
          'Build a safe CS2 competitive config with radar, viewmodel, HUD, FPS, and simple binds without training-only commands.',
        primaryKeyword: 'cs2 competitive config',
        secondaryKeywords: ['safe cs2 config', 'safe cs2 binds', 'competitive radar cs2', 'competitive viewmodel cs2'],
        searchIntent:
          'Players who want a competitive CS2 configuration baseline without risky automation or local-only commands.',
        seoTitle: 'CS2 Competitive Config - Radar, Viewmodel, HUD and Safe Binds',
        seoDescription:
          'Generate a safe CS2 competitive config using common client-side commands without sv_cheats, noclip, or risky automation.',
        h1: 'CS2 competitive config',
        intro:
          'Build a safe competitive CS2 config focused on radar readability, HUD clarity, consistent viewmodel, and simple binds.',
        focus: 'competitive config',
      },
      es: {
        name: 'Config Competitiva CS2',
        shortDescription:
          'Monta config competitiva segura en CS2 con radar, viewmodel, HUD, FPS y binds simples sin comandos de practica.',
        primaryKeyword: 'config competitiva cs2',
        secondaryKeywords: ['config segura cs2', 'binds seguros cs2', 'radar competitivo cs2', 'viewmodel competitivo cs2'],
        searchIntent:
          'Jugadores que quieren base de configuracion competitiva en CS2 sin comandos riesgosos ni locales.',
        seoTitle: 'Config Competitiva CS2 - Radar, Viewmodel, HUD y Binds Seguros',
        seoDescription:
          'Genera config competitiva segura de CS2 con comandos cliente comunes, sin sv_cheats, noclip ni automatizacion riesgosa.',
        h1: 'Config competitiva CS2',
        intro:
          'Monta una config competitiva segura en CS2 enfocada en radar legible, HUD clara, viewmodel consistente y binds simples.',
        focus: 'config competitiva',
      },
    },
  },
  'cs2-tournament-safe-config': {
    mode: 'tournament',
    localized: {
      'pt-br': {
        name: 'Config Campeonato CS2',
        shortDescription:
          'Monte config segura para campeonato CS2 com comandos client-side comuns e sem blocos de treino/local.',
        primaryKeyword: 'config campeonato cs2',
        secondaryKeywords: ['config segura cs2', 'config para competitivo cs2', 'binds seguros cs2', 'autoexec campeonato cs2'],
        searchIntent:
          'Jogadores que precisam separar uma config limpa para campeonato sem risco de comandos locais ou automacoes.',
        seoTitle: 'Config Campeonato CS2 - Setup Seguro para Competitivo Oficial',
        seoDescription:
          'Crie config de campeonato CS2 com radar, HUD, viewmodel, binds simples e sem sv_cheats ou automacoes de risco.',
        h1: 'Config campeonato CS2',
        intro:
          'Monte uma config simples e segura para partidas competitivas no CS2, sem comandos de treino local, sem sv_cheats e sem automacoes arriscadas.',
        focus: 'config de campeonato',
      },
      en: {
        name: 'CS2 Tournament Safe Config',
        shortDescription:
          'Build a tournament-safe CS2 config using common client-side commands and no local training blocks.',
        primaryKeyword: 'cs2 tournament safe config',
        secondaryKeywords: ['safe cs2 tournament config', 'competitive safe cs2 config', 'safe cs2 binds', 'tournament autoexec cs2'],
        searchIntent:
          'Players who need a clean tournament-ready config without local-only commands or risky automation.',
        seoTitle: 'CS2 Tournament Safe Config - Official Competitive Safe Setup',
        seoDescription:
          'Create a tournament-safe CS2 config with radar, HUD, viewmodel, and simple binds, without sv_cheats or risky automation.',
        h1: 'CS2 tournament safe config',
        intro:
          'Build a simple and safe CS2 tournament config without local practice commands, sv_cheats dependencies, or risky automation.',
        focus: 'tournament safe config',
      },
      es: {
        name: 'Config Torneo CS2',
        shortDescription:
          'Monta config segura para torneo CS2 con comandos cliente comunes y sin bloques de practica local.',
        primaryKeyword: 'config torneo cs2',
        secondaryKeywords: ['config segura cs2', 'config torneo cs2', 'binds seguros cs2', 'autoexec torneo cs2'],
        searchIntent:
          'Jugadores que necesitan una config limpia para torneo sin comandos locales ni automatizaciones riesgosas.',
        seoTitle: 'Config Torneo CS2 - Setup Seguro para Competitivo Oficial',
        seoDescription:
          'Crea config de torneo CS2 con radar, HUD, viewmodel y binds simples, sin sv_cheats ni automatizacion riesgosa.',
        h1: 'Config torneo CS2',
        intro:
          'Monta una config simple y segura para competitivo en CS2 sin comandos de practica local, sin sv_cheats y sin automatizacion riesgosa.',
        focus: 'config de torneo',
      },
    },
  },
  'cs2-fun-commands': {
    mode: 'fun',
    localized: {
      'pt-br': {
        name: 'Comandos Divertidos CS2',
        shortDescription:
          'Comandos fun para servidor privado no CS2 com gravidade, bunnyhop, noclip, respawn e experimentos locais.',
        primaryKeyword: 'comandos divertidos cs2',
        secondaryKeywords: ['comandos sv_cheats cs2', 'comandos private cs2', 'gravity cs2', 'bunnyhop treino cs2'],
        searchIntent:
          'Jogadores que querem testar comandos fun no CS2 em servidor local/private sem impacto em competitivo.',
        seoTitle: 'Comandos Divertidos CS2 - Servidor Privado, Gravidade e Bunnyhop',
        seoDescription:
          'Copie comandos fun do CS2 para servidor privado com sv_cheats, noclip, gravidade, respawn e testes locais marcados com aviso.',
        h1: 'Comandos divertidos para CS2 (servidor privado)',
        intro:
          'Teste comandos divertidos de CS2 em ambiente local/private server com avisos claros sobre o que nao deve ir para competitivo oficial.',
        focus: 'comandos divertidos',
      },
      en: {
        name: 'CS2 Fun Commands',
        shortDescription:
          'Private-server fun commands for CS2 including gravity tweaks, bunnyhop, noclip, respawn, and local experiments.',
        primaryKeyword: 'cs2 fun commands',
        secondaryKeywords: ['cs2 sv_cheats commands', 'cs2 private server commands', 'cs2 gravity commands', 'cs2 bhop local'],
        searchIntent:
          'Players who want to experiment with CS2 fun commands in local/private servers without competitive impact.',
        seoTitle: 'CS2 Fun Commands - Private Server, Gravity and Bunnyhop',
        seoDescription:
          'Copy CS2 fun commands for private servers with sv_cheats, noclip, gravity, respawn, and locally flagged experimental settings.',
        h1: 'CS2 fun commands for private servers',
        intro:
          'Experiment with CS2 fun commands in local/private servers with clear warnings about what should never be used in official competitive play.',
        focus: 'fun commands',
      },
      es: {
        name: 'Comandos Divertidos CS2',
        shortDescription:
          'Comandos fun para servidor privado en CS2 con gravedad, bunnyhop, noclip, respawn y pruebas locales.',
        primaryKeyword: 'comandos divertidos cs2',
        secondaryKeywords: ['comandos sv_cheats cs2', 'comandos servidor privado cs2', 'gravedad cs2', 'bhop local cs2'],
        searchIntent:
          'Jugadores que quieren experimentar comandos fun en CS2 en servidor local/private sin impacto competitivo.',
        seoTitle: 'Comandos Divertidos CS2 - Servidor Privado, Gravedad y Bunnyhop',
        seoDescription:
          'Copia comandos fun de CS2 para servidor privado con sv_cheats, noclip, gravedad, respawn y pruebas locales con aviso.',
        h1: 'Comandos divertidos para CS2 (servidor privado)',
        intro:
          'Prueba comandos divertidos de CS2 en entorno local/private con avisos claros sobre lo que no debe ir a competitivo oficial.',
        focus: 'comandos divertidos',
      },
    },
  },
};

const buildContent = (toolId: Cs2ToolId, locale: AppLocale): Cs2ToolLocaleContent => {
  const seed = seedByToolId[toolId];
  const entry = seed.localized[locale];

  return {
    name: entry.name,
    shortDescription: entry.shortDescription,
    primaryKeyword: entry.primaryKeyword,
    secondaryKeywords: entry.secondaryKeywords,
    searchIntent: entry.searchIntent,
    seoTitle: entry.seoTitle,
    seoDescription: entry.seoDescription,
    h1: entry.h1,
    intro: entry.intro,
    contentBlocks: buildContentBlocks(locale, seed.mode, entry.focus),
    faq: buildFaq(locale, seed.mode),
  };
};

export const getCs2ToolContent = (toolId: Cs2ToolId, locale: AppLocale): Cs2ToolLocaleContent =>
  buildContent(toolId, locale);
