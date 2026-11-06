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
  radarGeneratorTitle: string;
  hudColorGeneratorTitle: string;
  viewmodelGeneratorTitle: string;
  volumeGeneratorTitle: string;
  fpsGeneratorTitle: string;
  fpsGeneratorHelp: string;
  telemetryGeneratorTitle: string;
  telemetryGeneratorHelp: string;
  telemetryFrameLabel: string;
  telemetryPingLabel: string;
  telemetryNetworkLabel: string;
  telemetryGraphLabel: string;
  telemetryOffOption: string;
  telemetryPoorOption: string;
  telemetryAlwaysOption: string;
  bindGeneratorTitle: string;
  bindGeneratorHelp: string;
  bindKeyLabel: string;
  bindActionLabel: string;
  bindPingAction: string;
  bindClutchAction: string;
  bindSwitchHandsAction: string;
  bindHeAction: string;
  bindFlashAction: string;
  bindSmokeAction: string;
  bindFireAction: string;
  autoexecGeneratorTitle: string;
  autoexecHelp: string;
  autoexecIncludeRadar: string;
  autoexecIncludeHud: string;
  autoexecIncludeViewmodel: string;
  autoexecIncludeFps: string;
  autoexecIncludeAudio: string;
  autoexecIncludeBinds: string;
  autoexecIncludePractice: string;
  autoexecIncludeFun: string;
  autoexecCrosshairLabel: string;
  autoexecCrosshairPlaceholder: string;
  verifiedBuildLabel: string;
  currentBuildAdditionsNote: string;
  valvePatchNotesLabel: string;
};

const safeWarning: Record<AppLocale, string> = {
  'pt-br':
    'Servidores oficiais podem bloquear automações que combinam movimento ou ataque no mesmo input. Esta ferramenta usa binds de uma única ação, treino local separado e configurações client-side seguras.',
  en:
    'Official servers can block automation that combines movement or attack actions on one input. This tool uses one-action binds, separate local practice, and safe client-side settings.',
  es:
    'Los servidores oficiales pueden bloquear automatizaciones que combinan movimiento o ataque en una entrada. Esta herramienta usa binds de una sola accion, practica local separada y ajustes cliente seguros.',
  zh:
    '官方服务器可能会屏蔽将移动和攻击组合在同一按键上的自动化操作。本工具使用单一动作的绑定、独立的本地训练以及安全的客户端设置。',
};

const performanceNote: Record<AppLocale, string> = {
  'pt-br':
    'Esses comandos ajudam a ajustar limite de FPS, telemetria e elementos visuais, mas o ganho real depende do hardware e das configurações do jogo.',
  en:
    'These commands help tune FPS caps, telemetry, and visual elements, but real gains depend on your hardware and full game setup.',
  es:
    'Estos comandos ayudan a ajustar limite de FPS, telemetria y elementos visuales, pero la mejora real depende del hardware y de la configuracion completa.',
  zh:
    '这些指令有助于调整 FPS 上限、遥测信息和视觉元素,但实际提升效果取决于你的硬件和整体游戏设置。',
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
    needsValidationLabel: 'Mostrar comandos marcados para validação',
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
    safetyTitle: 'Aviso de segurança',
    safetyText: safeWarning['pt-br'],
    warningTitle: 'Aviso',
    safeBadge: 'Seguro',
    localBadge: 'Treino local',
    svCheatsBadge: 'Requer sv_cheats',
    cautionBadge: 'Cuidado',
    dangerBadge: 'Não recomendado',
    presetTitle: 'Presets prontos',
    emptyState: 'Nenhum comando encontrado com os filtros atuais.',
    radarGeneratorTitle: 'Gerador de radar',
    hudColorGeneratorTitle: 'Gerador de cor da HUD',
    viewmodelGeneratorTitle: 'Gerador de viewmodel',
    volumeGeneratorTitle: 'Gerador de volume',
    fpsGeneratorTitle: 'Gerador de FPS',
    fpsGeneratorHelp:
      'Defina fps_max antes de entrar em um servidor. Desde 2025, o CS2 não permite alterar esse limite enquanto você está conectado.',
    telemetryGeneratorTitle: 'Gerador de telemetria',
    telemetryGeneratorHelp:
      'Use indicadores apenas quando houver problema para manter a tela limpa e ainda identificar travamentos, ping e perda de pacotes.',
    telemetryFrameLabel: 'Frame time / FPS',
    telemetryPingLabel: 'Ping',
    telemetryNetworkLabel: 'Perda ou pacotes fora de ordem',
    telemetryGraphLabel: 'Incluir gráfico de qualidade da rede',
    telemetryOffOption: 'Desativado',
    telemetryPoorOption: 'Somente em condição ruim',
    telemetryAlwaysOption: 'Sempre mostrar',
    bindGeneratorTitle: 'Gerador de binds seguros',
    bindGeneratorHelp:
      'Gera um bind de uma única ação para comunicação, utilitários ou viewmodel. Escolha uma tecla livre para evitar sobrescrever seu layout.',
    bindKeyLabel: 'Tecla',
    bindActionLabel: 'Ação',
    bindPingAction: 'Marcar local (ping)',
    bindClutchAction: 'Alternar modo clutch',
    bindSwitchHandsAction: 'Alternar mão do viewmodel',
    bindHeAction: 'Selecionar HE',
    bindFlashAction: 'Selecionar flashbang',
    bindSmokeAction: 'Selecionar smoke',
    bindFireAction: 'Selecionar molotov/incendiária',
    autoexecGeneratorTitle: 'Gerador de autoexec',
    autoexecHelp:
      'Gere arquivos separados para competitivo (autoexec.cfg), treino local (practice.cfg) e servidor privado (fun.cfg).',
    autoexecIncludeRadar: 'Incluir bloco de radar',
    autoexecIncludeHud: 'Incluir bloco de HUD',
    autoexecIncludeViewmodel: 'Incluir bloco de viewmodel',
    autoexecIncludeFps: 'Incluir bloco de FPS',
    autoexecIncludeAudio: 'Incluir bloco de áudio',
    autoexecIncludeBinds: 'Incluir binds simples',
    autoexecIncludePractice: 'Incluir practice.cfg',
    autoexecIncludeFun: 'Incluir fun.cfg',
    autoexecCrosshairLabel: 'Bloco opcional de crosshair',
    autoexecCrosshairPlaceholder:
      'Cole comandos atuais de mira aqui (ex.: cl_crosshair_thickness 1, cl_crosshair_length 8, cl_crosshair_gap 4)',
    verifiedBuildLabel: 'Comando encontrado no cliente instalado (CL)',
    currentBuildAdditionsNote:
      'Novos comandos conferidos no cliente instalado (CL {build}) em 29/10/2026.',
    valvePatchNotesLabel: 'Notas oficiais da Valve',
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
    radarGeneratorTitle: 'Radar generator',
    hudColorGeneratorTitle: 'HUD color generator',
    viewmodelGeneratorTitle: 'Viewmodel generator',
    volumeGeneratorTitle: 'Volume generator',
    fpsGeneratorTitle: 'FPS generator',
    fpsGeneratorHelp:
      'Set fps_max before you join a server. Since 2025, CS2 does not allow changing that cap while you are connected.',
    telemetryGeneratorTitle: 'Telemetry generator',
    telemetryGeneratorHelp:
      'Show indicators only when there is a problem to keep the screen clean while still spotting stutter, ping, and packet loss.',
    telemetryFrameLabel: 'Frame time / FPS',
    telemetryPingLabel: 'Ping',
    telemetryNetworkLabel: 'Packet loss or out-of-order delivery',
    telemetryGraphLabel: 'Include network-quality graph',
    telemetryOffOption: 'Off',
    telemetryPoorOption: 'Only in poor conditions',
    telemetryAlwaysOption: 'Always show',
    bindGeneratorTitle: 'Safe bind generator',
    bindGeneratorHelp:
      'Builds a one-action bind for communication, utility, or viewmodel. Choose a free key so you do not overwrite your layout.',
    bindKeyLabel: 'Key',
    bindActionLabel: 'Action',
    bindPingAction: 'Place a ping',
    bindClutchAction: 'Toggle clutch mode',
    bindSwitchHandsAction: 'Switch viewmodel hand',
    bindHeAction: 'Select HE grenade',
    bindFlashAction: 'Select flashbang',
    bindSmokeAction: 'Select smoke',
    bindFireAction: 'Select molotov/incendiary',
    autoexecGeneratorTitle: 'Autoexec generator',
    autoexecHelp:
      'Build separate files for competitive play (autoexec.cfg), local practice (practice.cfg), and private fun servers (fun.cfg).',
    autoexecIncludeRadar: 'Include radar block',
    autoexecIncludeHud: 'Include HUD block',
    autoexecIncludeViewmodel: 'Include viewmodel block',
    autoexecIncludeFps: 'Include FPS block',
    autoexecIncludeAudio: 'Include audio block',
    autoexecIncludeBinds: 'Include simple binds',
    autoexecIncludePractice: 'Include practice.cfg',
    autoexecIncludeFun: 'Include fun.cfg',
    autoexecCrosshairLabel: 'Optional crosshair block',
    autoexecCrosshairPlaceholder:
      'Paste current crosshair commands here (e.g., cl_crosshair_thickness 1, cl_crosshair_length 8, cl_crosshair_gap 4)',
    verifiedBuildLabel: 'Command found in installed client (CL)',
    currentBuildAdditionsNote:
      'New command entries checked against the installed client (CL {build}) on Oct 29, 2026.',
    valvePatchNotesLabel: 'Valve official update notes',
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
    radarGeneratorTitle: 'Generador de radar',
    hudColorGeneratorTitle: 'Generador de color HUD',
    viewmodelGeneratorTitle: 'Generador de viewmodel',
    volumeGeneratorTitle: 'Generador de volumen',
    fpsGeneratorTitle: 'Generador de FPS',
    fpsGeneratorHelp:
      'Define fps_max antes de entrar a un servidor. Desde 2025, CS2 no permite cambiar ese limite mientras estas conectado.',
    telemetryGeneratorTitle: 'Generador de telemetria',
    telemetryGeneratorHelp:
      'Usa indicadores solo cuando haya un problema para mantener la pantalla limpia e identificar stutter, ping y perdida de paquetes.',
    telemetryFrameLabel: 'Frame time / FPS',
    telemetryPingLabel: 'Ping',
    telemetryNetworkLabel: 'Perdida o paquetes fuera de orden',
    telemetryGraphLabel: 'Incluir grafico de calidad de red',
    telemetryOffOption: 'Desactivado',
    telemetryPoorOption: 'Solo en condiciones malas',
    telemetryAlwaysOption: 'Mostrar siempre',
    bindGeneratorTitle: 'Generador de binds seguros',
    bindGeneratorHelp:
      'Genera un bind de una sola accion para comunicacion, utilitarios o viewmodel. Elige una tecla libre para no sobrescribir tu layout.',
    bindKeyLabel: 'Tecla',
    bindActionLabel: 'Accion',
    bindPingAction: 'Marcar ubicacion (ping)',
    bindClutchAction: 'Alternar modo clutch',
    bindSwitchHandsAction: 'Cambiar mano del viewmodel',
    bindHeAction: 'Seleccionar HE',
    bindFlashAction: 'Seleccionar flashbang',
    bindSmokeAction: 'Seleccionar smoke',
    bindFireAction: 'Seleccionar molotov/incendiaria',
    autoexecGeneratorTitle: 'Generador de autoexec',
    autoexecHelp:
      'Genera archivos separados para competitivo (autoexec.cfg), practica local (practice.cfg) y servidor privado (fun.cfg).',
    autoexecIncludeRadar: 'Incluir bloque de radar',
    autoexecIncludeHud: 'Incluir bloque de HUD',
    autoexecIncludeViewmodel: 'Incluir bloque de viewmodel',
    autoexecIncludeFps: 'Incluir bloque de FPS',
    autoexecIncludeAudio: 'Incluir bloque de audio',
    autoexecIncludeBinds: 'Incluir binds simples',
    autoexecIncludePractice: 'Incluir practice.cfg',
    autoexecIncludeFun: 'Incluir fun.cfg',
    autoexecCrosshairLabel: 'Bloque opcional de crosshair',
    autoexecCrosshairPlaceholder:
      'Pega comandos actuales de mira (ej.: cl_crosshair_thickness 1, cl_crosshair_length 8, cl_crosshair_gap 4)',
    verifiedBuildLabel: 'Comando encontrado en el cliente instalado (CL)',
    currentBuildAdditionsNote:
      'Nuevos comandos comprobados en el cliente instalado (CL {build}) el 29/10/2026.',
    valvePatchNotesLabel: 'Notas oficiales de Valve',
  },
  zh: {
    searchLabel: '搜索指令',
    searchPlaceholder: '例如:sv_cheats、noclip、radar、viewmodel',
    categoryLabel: '分类',
    categoryAll: '全部分类',
    safeOnlyLabel: '仅显示竞技模式下安全的指令',
    localOnlyLabel: '仅显示本地/私人服务器指令',
    svCheatsLabel: '仅显示需要 sv_cheats 1 的指令',
    needsValidationLabel: '显示标记为待验证的指令',
    recommendedLabel: '仅显示本工具推荐的指令',
    resultsLabel: '条指令',
    commandLabel: '指令',
    exampleLabel: '使用示例',
    copyCommand: '复制指令',
    copiedCommand: '指令已复制',
    copyPreset: '复制预设',
    copiedPreset: '预设已复制',
    copyCfg: '复制 .cfg',
    copiedCfg: '.cfg 已复制',
    downloadCfg: '下载 .cfg',
    generatedPreviewTitle: '生成预览',
    safetyTitle: '安全提示',
    safetyText: safeWarning.zh,
    warningTitle: '警告',
    safeBadge: '安全',
    localBadge: '本地训练',
    svCheatsBadge: '需要 sv_cheats',
    cautionBadge: '谨慎',
    dangerBadge: '不推荐',
    presetTitle: '现成预设',
    emptyState: '当前筛选条件下未找到指令。',
    radarGeneratorTitle: '雷达生成器',
    hudColorGeneratorTitle: 'HUD 颜色生成器',
    viewmodelGeneratorTitle: 'Viewmodel 生成器',
    volumeGeneratorTitle: '音量生成器',
    fpsGeneratorTitle: 'FPS 生成器',
    fpsGeneratorHelp:
      '请在加入服务器前设置 fps_max。自2025年起,CS2 不允许在连接服务器后修改该上限。',
    telemetryGeneratorTitle: '遥测生成器',
    telemetryGeneratorHelp:
      '仅在出现问题时显示指示器,保持画面简洁的同时,依然能察觉卡顿、延迟和丢包。',
    telemetryFrameLabel: '帧时间 / FPS',
    telemetryPingLabel: '延迟(Ping)',
    telemetryNetworkLabel: '丢包或乱序传输',
    telemetryGraphLabel: '包含网络质量图表',
    telemetryOffOption: '关闭',
    telemetryPoorOption: '仅在网络不佳时',
    telemetryAlwaysOption: '始终显示',
    bindGeneratorTitle: '安全绑定生成器',
    bindGeneratorHelp:
      '为沟通、道具或视角切换生成单一动作的绑定。请选择空闲按键,以免覆盖你的按键布局。',
    bindKeyLabel: '按键',
    bindActionLabel: '动作',
    bindPingAction: '标记位置(ping)',
    bindClutchAction: '切换残局模式',
    bindSwitchHandsAction: '切换持枪手',
    bindHeAction: '选择手雷',
    bindFlashAction: '选择闪光弹',
    bindSmokeAction: '选择烟雾弹',
    bindFireAction: '选择燃烧瓶/火燃道具',
    autoexecGeneratorTitle: 'Autoexec 生成器',
    autoexecHelp:
      '分别生成竞技模式(autoexec.cfg)、本地训练(practice.cfg)和私服娱乐(fun.cfg)的配置文件。',
    autoexecIncludeRadar: '包含雷达设置',
    autoexecIncludeHud: '包含 HUD 设置',
    autoexecIncludeViewmodel: '包含 Viewmodel 设置',
    autoexecIncludeFps: '包含 FPS 设置',
    autoexecIncludeAudio: '包含音频设置',
    autoexecIncludeBinds: '包含简单绑定',
    autoexecIncludePractice: '包含 practice.cfg',
    autoexecIncludeFun: '包含 fun.cfg',
    autoexecCrosshairLabel: '可选的准星设置',
    autoexecCrosshairPlaceholder:
      '粘贴当前准星指令(例如:cl_crosshair_thickness 1、cl_crosshair_length 8、cl_crosshair_gap 4)',
    verifiedBuildLabel: '已在安装的客户端 (CL) 中找到此指令',
    currentBuildAdditionsNote: '新增指令已于 2026 年 10 月 29 日在已安装客户端 (CL {build}) 中核对。',
    valvePatchNotesLabel: 'Valve 官方更新说明',
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
              : locale === 'zh'
                ? '性能相关指令,不做虚假承诺'
                : 'Comandos de rendimiento sin promesas falsas',
        paragraphs: [
          performanceNote[locale],
          locale === 'pt-br'
            ? 'Use comparacoes consistentes: mesmo mapa, mesma resolucao e mesma situacao. Isso evita conclusao errada sobre ganho de desempenho.'
            : locale === 'en'
              ? 'Use consistent comparisons: same map, same resolution, and same scenario. This avoids false conclusions about performance gains.'
              : locale === 'zh'
                ? '使用一致的对比条件:相同地图、相同分辨率、相同场景,避免对性能提升得出错误结论。'
                : 'Usa comparaciones consistentes: mismo mapa, misma resolucion y misma situacion. Asi evitas conclusiones falsas.',
        ],
      },
      {
        title:
          locale === 'pt-br'
            ? 'Comandos principais para medir e ajustar'
            : locale === 'en'
              ? 'Core commands for measuring and tuning'
              : locale === 'zh'
                ? '用于测量和调优的核心指令'
                : 'Comandos clave para medir y ajustar',
        paragraphs: [
          locale === 'pt-br'
            ? 'fps_max, fps_max_ui, cl_showfps, cq_netgraph e a telemetria do HUD ajudam a montar uma baseline de desempenho. Em builds atuais, defina fps_max antes de entrar em um servidor, porque ele nao pode ser alterado durante a conexao.'
            : locale === 'en'
              ? 'fps_max, fps_max_ui, cl_showfps, cq_netgraph, and HUD telemetry help build a measurable performance baseline. On current builds, set fps_max before joining a server because it cannot be changed while connected.'
              : locale === 'zh'
                ? 'fps_max、fps_max_ui、cl_showfps、cq_netgraph 以及 HUD 遥测信息有助于建立可量化的性能基线。在当前版本中,请在加入服务器前设置好 fps_max,因为连接后无法修改该数值。'
                : 'fps_max, fps_max_ui, cl_showfps, cq_netgraph y la telemetria HUD ayudan a crear una baseline medible. En builds actuales, define fps_max antes de entrar a un servidor porque no se puede cambiar durante la conexion.',
          locale === 'pt-br'
            ? 'Evite alterar tudo ao mesmo tempo. Mudancas pequenas por etapa facilitam identificar causa de melhora ou piora.'
            : locale === 'en'
              ? 'Avoid changing everything at once. Small step-by-step adjustments make it easier to identify what improved or worsened.'
              : locale === 'zh'
                ? '避免一次性修改所有设置。分步骤进行小幅调整,更容易判断具体是什么带来了改善或下降。'
                : 'Evita cambiar todo a la vez. Ajustes pequenos por etapas facilitan identificar que mejoro o empeoro.',
        ],
      },
      {
        title:
          locale === 'pt-br'
            ? 'Separacao entre competitivo e treino local'
            : locale === 'en'
              ? 'Competitive vs local practice separation'
              : locale === 'zh'
                ? '竞技配置与本地训练的区分'
                : 'Separacion entre competitivo y practica local',
        paragraphs: [
          locale === 'pt-br'
            ? 'Comandos de FPS e HUD podem entrar em config competitiva segura. Comandos de treino local com sv_cheats devem ficar em arquivo separado.'
            : locale === 'en'
              ? 'FPS and HUD commands can be part of safe competitive config. Local sv_cheats practice commands should stay in separate files.'
              : locale === 'zh'
                ? 'FPS 和 HUD 相关指令可以纳入安全的竞技配置。需要 sv_cheats 的本地训练指令应放在单独的文件中。'
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
              : locale === 'zh'
                ? 'CS2 HUD 颜色对照表'
                : 'Mapa de colores HUD en CS2',
        paragraphs: [
          locale === 'pt-br'
            ? 'A ferramenta traduz cl_hud_color para nomes amigáveis: default, white, light blue, blue, purple, red, orange, yellow, green, aqua e pink.'
            : locale === 'en'
              ? 'This tool maps cl_hud_color values to friendly names: default, white, light blue, blue, purple, red, orange, yellow, green, aqua, and pink.'
              : locale === 'zh'
                ? '本工具将 cl_hud_color 的数值对应到易懂的名称:default、white、light blue、blue、purple、red、orange、yellow、green、aqua 和 pink。'
                : 'La herramienta mapea valores de cl_hud_color a nombres amigables: default, white, light blue, blue, purple, red, orange, yellow, green, aqua y pink.',
          locale === 'pt-br'
            ? 'Se algum valor mudar em update, marcamos como validacao para voce testar antes de fixar no autoexec.'
            : locale === 'en'
              ? 'If value behavior changes after updates, we flag it for validation before you lock it into autoexec.'
              : locale === 'zh'
                ? '如果某个数值在更新后表现发生变化,我们会标记为待验证,建议先测试再固定写入 autoexec。'
                : 'Si algun valor cambia tras updates, lo marcamos para validacion antes de fijarlo en autoexec.',
        ],
      },
      {
        title:
          locale === 'pt-br'
            ? 'Escolha de cor para leitura competitiva'
            : locale === 'en'
              ? 'Color choice for competitive readability'
              : locale === 'zh'
                ? '为竞技可读性选择颜色'
                : 'Eleccion de color para lectura competitiva',
        paragraphs: [
          locale === 'pt-br'
            ? 'A melhor cor depende do contraste com mapa e brilho do monitor. O ideal e testar em mapas claros e escuros antes de fechar configuracao.'
            : locale === 'en'
              ? 'Best color depends on map contrast and monitor brightness. Test on bright and dark maps before locking your setup.'
              : locale === 'zh'
                ? '最佳颜色取决于与地图的对比度和显示器亮度。建议先在明暗不同的地图上测试,再最终确定配置。'
                : 'El mejor color depende del contraste del mapa y brillo del monitor. Prueba en mapas claros y oscuros antes de fijar configuracion.',
          locale === 'pt-br'
            ? 'Comando de cor da HUD e client-side e normalmente seguro para competitivo, sem automacao de gameplay.'
            : locale === 'en'
              ? 'HUD color commands are client-side and generally safe for competitive play, with no gameplay automation.'
              : locale === 'zh'
                ? 'HUD 颜色指令属于客户端设置,通常在竞技对局中是安全的,不涉及任何游戏自动化。'
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
        : locale === 'zh'
          ? `如何在 CS2 中使用${focus}`
          : `Como usar ${focus} en CS2`;

  const flowTitle =
    locale === 'pt-br'
      ? 'Fluxo recomendado de configuracao e treino'
      : locale === 'en'
        ? 'Recommended setup and training flow'
        : locale === 'zh'
          ? '推荐的配置与训练流程'
          : 'Flujo recomendado de configuracion y practica';

  const safetyTitle =
    locale === 'pt-br'
      ? 'Seguranca, limites e uso competitivo'
      : locale === 'en'
        ? 'Safety, limits, and competitive usage'
        : locale === 'zh'
          ? '安全性、限制与竞技使用'
          : 'Seguridad, limites y uso competitivo';

  const firstParagraph =
    locale === 'pt-br'
      ? `A ferramenta de ${focus} foi criada para encurtar o caminho entre pesquisa e execucao. Em vez de montar comando manualmente, voce escolhe opcoes, copia blocos prontos e testa em segundos.`
      : locale === 'en'
        ? `The ${focus} tool is built to shorten the path from setup to execution. Instead of assembling commands manually, you choose options, copy ready blocks, and test in seconds.`
        : locale === 'zh'
          ? `${focus}工具的设计目标是缩短从查找到实际执行之间的路径。你无需手动拼接指令,只需选择选项、复制现成的配置块,几秒内即可测试。`
          : `La herramienta de ${focus} fue creada para acortar el camino entre busqueda y ejecucion. En lugar de montar comandos manualmente, eliges opciones y copias bloques listos.`;

  const secondParagraph =
    locale === 'pt-br'
      ? 'Esse formato melhora consistencia de treino e evita erro de digitacao em momentos de pressa. Tambem facilita repetir rotina entre mapas e comparar resultados.'
      : locale === 'en'
        ? 'This format improves routine consistency and avoids typing mistakes under pressure. It also makes map-to-map repetition and result comparison easier.'
        : locale === 'zh'
          ? '这种方式能提升训练流程的一致性,避免在紧张时刻手误输错指令,也让你更容易在不同地图之间重复流程并比较结果。'
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
        : locale === 'zh'
          ? isPracticeOrFun
            ? '使用预设快速搭建基础配置,再根据具体目标(烟雾弹、压枪、Bot、走位或私服娱乐)调整细节。'
            : '从一套均衡的预设开始,分小步调整,并在多张地图上验证后再最终确定配置。'
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
        : locale === 'zh'
          ? mode === 'autoexec'
            ? '将客户端指令保留在 autoexec.cfg 中,本地专用指令分别放入 practice.cfg/fun.cfg。这样可以降低正式比赛当天的操作风险。'
            : '当流程稳定后,将指令保存到 .cfg 文件中。之后用 exec 重新加载可以减少摩擦,让训练保持有条理。'
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
        : locale === 'zh'
          ? mode === 'competitive' || mode === 'tournament'
            ? '安全的竞技配置应避免本地训练指令和多动作自动化操作。优先使用雷达、HUD、viewmodel、音频、FPS 和简单绑定相关设置。'
            : '带有 sv_cheats 的指令应保留在本地/私人训练中。官方竞技对局只应使用常见的客户端调整。'
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
            : locale === 'zh'
              ? [
                  '在复制指令前先明确本次训练的目标。',
                  '分小段测试并记录哪些设置有效。',
                  '保留一套基础预设,避免每次从零开始。',
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
  const q = (pt: string, en: string, es: string, zh: string) =>
    locale === 'pt-br' ? pt : locale === 'en' ? en : locale === 'zh' ? zh : es;

  const base: FaqItem[] = [
    {
      question: q(
        'Como abrir o console no CS2?',
        'How do I open console in CS2?',
        'Como abro la consola en CS2?',
        '如何在 CS2 中打开控制台?',
      ),
      answer: q(
        'Ative Developer Console nas configuracoes e use a tecla configurada para abrir durante treino ou partida.',
        'Enable Developer Console in settings and use your configured key during practice or matches.',
        'Activa Developer Console en ajustes y usa tu tecla configurada durante practica o partida.',
        '在设置中启用开发者控制台(Developer Console),然后在训练或对局中使用你设置的按键打开它。',
      ),
    },
    {
      question: q(
        'Posso usar esses comandos no competitivo oficial?',
        'Can I use these commands in official competitive matches?',
        'Puedo usar estos comandos en competitivo oficial?',
        '这些指令可以在官方竞技比赛中使用吗?',
      ),
      answer: q(
        'Apenas comandos client-side comuns. Comandos de treino local com sv_cheats devem ficar fora da config competitiva.',
        'Only common client-side commands. Local sv_cheats training commands should stay out of competitive config.',
        'Solo comandos cliente comunes. Comandos locales con sv_cheats deben quedar fuera de la config competitiva.',
        '只能使用常见的客户端指令。带有 sv_cheats 的本地训练指令不应出现在竞技配置中。',
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
          'autoexec.cfg、practice.cfg 和 fun.cfg 应该放在哪里?',
        ),
        answer: q(
          'Salve os arquivos na pasta cfg do CS2 e carregue com exec autoexec, exec practice e exec fun conforme o contexto.',
          'Save files in the CS2 cfg folder and run exec autoexec, exec practice, and exec fun depending on context.',
          'Guarda archivos en carpeta cfg de CS2 y ejecuta exec autoexec, exec practice y exec fun segun contexto.',
          '将文件保存在 CS2 的 cfg 文件夹中,并根据场景使用 exec autoexec、exec practice 和 exec fun 加载。',
        ),
      },
      {
        question: q(
          'Por que separar arquivos em vez de usar um so?',
          'Why separate files instead of one single file?',
          'Por que separar archivos en lugar de uno solo?',
          '为什么要分开多个文件,而不是使用一个文件?',
        ),
        answer: q(
          'Separar evita que comando de treino local entre por engano na config de competitivo oficial.',
          'Separation prevents local training commands from leaking into official competitive config by mistake.',
          'Separar evita que comandos de practica local entren por error en config competitiva oficial.',
          '分开文件可以避免本地训练指令意外混入官方竞技配置中。',
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
        '如何在 CS2 中修改 HUD 颜色?',
      ),
      answer: q(
        'Use cl_hud_color com o numero da cor desejada e salve no autoexec para manter padrao.',
        'Use cl_hud_color with your desired color value and store it in autoexec for consistency.',
        'Usa cl_hud_color con el valor de color deseado y guardalo en autoexec para mantener consistencia.',
        '使用 cl_hud_color 加上你想要的颜色数值,并保存到 autoexec 中以保持一致。',
      ),
    });
  }

  if (mode === 'fps') {
    base.push({
      question: q(
        'Esses comandos garantem aumento de FPS?',
        'Do these commands guarantee higher FPS?',
        'Estos comandos garantizan mas FPS?',
        '这些指令能保证提升 FPS 吗?',
      ),
      answer: q(
        'Nao. Eles ajudam a ajustar comportamento, mas o resultado final depende do hardware e do setup completo.',
        'No. They help tune behavior, but final results depend on hardware and complete setup.',
        'No. Ayudan a ajustar comportamiento, pero el resultado final depende de hardware y setup completo.',
        '不能。它们有助于调整相关设置,但最终效果取决于硬件和整体配置。',
      ),
    });
  }

  if (mode === 'fun' || mode === 'tournament' || mode === 'competitive') {
    base.push({
      question: q(
        'Binds de automacao sao recomendados?',
        'Are automation binds recommended?',
        'Se recomiendan binds de automatizacion?',
        '推荐使用自动化绑定吗?',
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
        '如何将指令保存到 .cfg 文件中?',
      ),
      answer: q(
        'Crie o arquivo na pasta cfg, coloque um comando por linha e execute com exec nome-do-arquivo.',
        'Create the file in the cfg folder, place one command per line, and run it with exec file-name.',
        'Crea el archivo en carpeta cfg, coloca un comando por linea y ejecútalo con exec nombre-del-archivo.',
        '在 cfg 文件夹中创建文件,每行写一条指令,然后使用 exec 文件名执行。',
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
          'Copie comandos de treino do CS2 para tempo de rodada, compra livre, munição infinita, granadas e smokes.',
        primaryKeyword: 'comandos de treino cs2',
        secondaryKeywords: [
          'config de treino cs2',
          'comandos granadas cs2',
          'treinar smoke cs2',
          'sv_cheats cs2',
          'comandos para treinar no cs2',
        ],
        searchIntent:
          'Jogadores que querem montar uma sala de treino local no CS2 com comandos prontos, sem digitar um por um.',
        seoTitle: 'Comandos de Treino CS2 - Rodada Longa, Compra e Granadas',
        seoDescription:
          'Copie comandos de treino do CS2 com rodada longa, compra livre, munição infinita, rethrow e noclip, ou baixe presets prontos em .cfg.',
        h1: 'Comandos de treino CS2',
        intro:
          'Copie comandos de treino do CS2 para montar uma sala local com rodada longa, dinheiro alto, compra livre e munição infinita. Use a busca e os filtros para achar o comando certo ou baixe um preset completo.',
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
      zh: {
        name: 'CS2 训练指令',
        shortDescription:
          '复制 CS2 训练指令,用于烟雾弹、Bot、回合设置、经济系统和投掷物重复练习。',
        primaryKeyword: 'cs2 训练指令',
        secondaryKeywords: [
          'cs2 训练配置',
          'cs2 投掷物指令',
          'cs2 烟雾弹训练',
          'cs2 bot 指令',
          'cs2 sv_cheats 指令',
        ],
        searchIntent: '希望获得现成 CS2 本地训练指令组合,快速开始训练的玩家。',
        seoTitle: 'CS2 训练指令 - 投掷物、Bot、烟雾弹训练配置',
        seoDescription:
          '复制实用的 CS2 本地训练指令:无限弹药、超长回合、投掷物弹道预览、Bot、穿墙模式以及现成预设。',
        h1: 'CS2 训练指令',
        intro:
          '复制实用指令,搭建包含超长回合、高额经济、Bot、道具重复练习和本地训练流程的 CS2 训练场景。',
        focus: '训练指令',
      },
    },
  },
  'cs2-practice-config': {
    mode: 'practice_config',
    localized: {
      'pt-br': {
        name: 'Config de Treino CS2',
        shortDescription:
          'Escolha um preset de treino do CS2 (básico, granadas, smoke, spray, bots ou scrim), copie os comandos e baixe o .cfg para carregar com exec.',
        primaryKeyword: 'config de treino cs2',
        secondaryKeywords: [
          'practice cfg cs2',
          'treinar smoke cs2',
          'config treino granadas cs2',
          'autoexec treino cs2',
        ],
        searchIntent:
          'Jogadores que querem baixar um arquivo .cfg de treino local no CS2 sem montar os comandos manualmente.',
        seoTitle: 'Config de Treino CS2 - Presets de Treino em .cfg',
        seoDescription:
          'Config de treino para CS2 com presets de treino básico, granadas, smoke, spray, bots e scrim privada. Copie os comandos ou baixe o .cfg.',
        h1: 'Config de treino CS2',
        intro:
          'Monte sua config de treino do CS2 a partir de presets prontos de treino básico, granadas, smoke, spray, bots e scrim privada. Copie os comandos ou baixe o .cfg e carregue com exec.',
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
      zh: {
        name: 'CS2 训练配置生成器',
        shortDescription:
          '生成用于单人训练、烟雾弹、压枪、Bot 和移动练习的 practice.cfg,支持一键复制和下载。',
        primaryKeyword: 'cs2 训练配置',
        secondaryKeywords: [
          'cs2 practice cfg',
          'cs2 烟雾弹训练配置',
          'cs2 投掷物配置',
          'cs2 exec practice',
        ],
        searchIntent:
          '希望直接获得可运行的 .cfg 文件、而不想手动拼接指令的 CS2 本地训练玩家。',
        seoTitle: 'CS2 训练配置生成器 - 生成烟雾弹、Bot、压枪 practice.cfg',
        seoDescription:
          '生成包含基础训练、投掷物、Bot 和压枪练习预设的 CS2 practice.cfg,一键复制或下载。',
        h1: 'CS2 训练配置生成器',
        intro:
          '使用现成预设搭建你的 CS2 训练配置,复制指令区块,并下载 practice.cfg 用于本地房间。',
        focus: '训练配置',
      },
    },
  },
  'cs2-grenade-practice-commands': {
    mode: 'grenades',
    localized: {
      'pt-br': {
        name: 'Comandos de Granadas CS2',
        shortDescription:
          'Comandos de treino de granadas no CS2: trajetória, rethrow, impactos, mira de arremesso, noclip e limpeza de projéteis.',
        primaryKeyword: 'comandos granadas cs2',
        secondaryKeywords: [
          'comando rastro granada cs2',
          'comando repetir granada cs2',
          'treino smoke cs2',
          'sv_rethrow_last_grenade',
        ],
        searchIntent:
          'Jogadores que querem repetir lineups de granada no CS2 com feedback visual e reinício rápido.',
        seoTitle: 'Comandos de Granadas CS2 - Trajetória, Rethrow e Lineups',
        seoDescription:
          'Copie comandos de granada do CS2: sv_grenade_trajectory_prac_pipreview, sv_rethrow_last_grenade, mira de arremesso e limpeza de projéteis.',
        h1: 'Comandos de granadas CS2',
        intro:
          'Treine lineups de granada no CS2 com comandos de trajetória, repetição da última granada, mira de arremesso e limpeza de projéteis. Tudo para uma sala local ou servidor privado.',
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
      zh: {
        name: 'CS2 投掷物指令',
        shortDescription:
          'CS2 投掷物训练指令,包含弹道预览、重抛、命中标记、穿墙模式和清除投掷物。',
        primaryKeyword: 'cs2 投掷物指令',
        secondaryKeywords: [
          'cs2 投掷物弹道指令',
          'cs2 重抛投掷物指令',
          'cs2 烟雾弹训练指令',
          'sv_rethrow_last_grenade',
        ],
        searchIntent: '希望通过快速重置和可视化反馈来反复练习 CS2 投掷物点位的玩家。',
        seoTitle: 'CS2 投掷物指令 - 弹道、重抛与道具训练',
        seoDescription:
          '复制 CS2 投掷物指令,包括弹道预览、sv_rethrow_last_grenade、命中标记、穿墙模式和清除投掷物。',
        h1: 'CS2 投掷物指令',
        intro:
          '使用弹道预览、重抛上一个投掷物、穿墙模式和命中标记等指令,在 CS2 中练习投掷物点位并验证每次尝试。',
        focus: '投掷物指令',
      },
    },
  },
  'cs2-smoke-practice-commands': {
    mode: 'smokes',
    localized: {
      'pt-br': {
        name: 'Comandos de Smoke CS2',
        shortDescription:
          'Comandos para treinar smoke no CS2: rethrow, trajetória, noclip, compra livre e preset de smoke pronto para copiar.',
        primaryKeyword: 'comandos smoke cs2',
        secondaryKeywords: [
          'treinar smoke cs2',
          'comandos para treinar smoke cs2',
          'lineups smoke cs2',
          'rethrow granada cs2',
        ],
        searchIntent:
          'Jogadores que querem uma rotina dedicada para treinar smoke no CS2, com repetição rápida e leitura visual do trajeto.',
        seoTitle: 'Comandos de Smoke CS2 - Treinar Lineups com Rethrow',
        seoDescription:
          'Copie o preset de smoke do CS2 com sv_grenade_trajectory_prac_pipreview, sv_rethrow_last_grenade, noclip, compra livre e rodada longa.',
        h1: 'Comandos para treinar smoke no CS2',
        intro:
          'Use o preset de smoke para treinar lineups no CS2 com repetição da última granada, noclip e trajetória visível. Copie os comandos ou baixe o .cfg e carregue na sua sala local.',
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
      zh: {
        name: 'CS2 烟雾弹训练指令',
        shortDescription:
          '专注烟雾弹训练的 CS2 指令集,包含重抛、穿墙、弹道预览和超长回合重复练习。',
        primaryKeyword: 'cs2 烟雾弹训练指令',
        secondaryKeywords: [
          'cs2 烟雾弹训练',
          'cs2 烟雾弹点位指令',
          'cs2 重抛烟雾弹指令',
          'cs2 道具训练',
        ],
        searchIntent: '需要专门的 CS2 烟雾弹训练流程、快速重复并获得可视化弹道反馈的玩家。',
        seoTitle: 'CS2 烟雾弹训练指令 - 用重抛和弹道练习点位',
        seoDescription:
          '复制包含弹道预览、重抛绑定、穿墙移动和超长回合设置的 CS2 烟雾弹训练指令。',
        h1: 'CS2 烟雾弹训练指令',
        intro:
          '使用专注烟雾弹的指令,配合重抛、穿墙模式和弹道可视化,加快 CS2 点位训练速度。',
        focus: '烟雾弹训练指令',
      },
    },
  },
  'cs2-bot-commands': {
    mode: 'bots',
    localized: {
      'pt-br': {
        name: 'Comandos de Bots CS2',
        shortDescription:
          'Adicione, congele, posicione e configure bots no CS2 para treinar peek, pre-fire e spray em uma sala local.',
        primaryKeyword: 'comandos bot cs2',
        secondaryKeywords: [
          'como colocar bot cs2',
          'bot_place cs2',
          'bot_stop 1 cs2',
          'treino com bots cs2',
        ],
        searchIntent:
          'Jogadores que querem controlar bots no CS2 em treinos específicos, sem depender de servidor cheio.',
        seoTitle: 'Comandos de Bot CS2 - Adicionar, Parar e Posicionar Bots',
        seoDescription:
          'Comandos de bot do CS2: bot_add_t, bot_add_ct, bot_stop, bot_place, dificuldade e quantidade. Copie a lista ou baixe o preset de treino com bots.',
        h1: 'Comandos de bots CS2',
        intro:
          'Controle bots no CS2 para treinar peek, pre-fire e spray sem depender de servidor cheio. Copie comandos para adicionar, parar, posicionar e ajustar a dificuldade dos bots.',
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
      zh: {
        name: 'CS2 Bot 指令',
        shortDescription:
          '在 CS2 中添加、冻结、放置和调整 Bot,用于探头、预瞄、压枪和走位训练。',
        primaryKeyword: 'cs2 bot 指令',
        secondaryKeywords: ['cs2 如何放置 bot', 'bot_place 指令 cs2', 'bot_stop 1 cs2', 'cs2 bot 训练'],
        searchIntent: '希望在不依赖真实服务器的情况下,完全控制 CS2 Bot 进行专项训练的玩家。',
        seoTitle: 'CS2 Bot 指令 - 如何添加、冻结与训练 Bot',
        seoDescription:
          '使用 CS2 Bot 指令,如 bot_add_t、bot_add_ct、bot_stop、bot_place、难度预设和重生训练设置。',
        h1: 'CS2 Bot 指令',
        intro: '通过实用的指令区块配置 CS2 Bot,用于预瞄、站位、压枪和走位训练。',
        focus: 'Bot 指令',
      },
    },
  },
  'cs2-radar-settings': {
    mode: 'radar',
    localized: {
      'pt-br': {
        name: 'Configuração de Radar CS2',
        shortDescription:
          'Gere comandos de radar do CS2: escala, tamanho na HUD, rotação, centralização, ícones e cores dos companheiros.',
        primaryKeyword: 'configuração radar cs2',
        secondaryKeywords: [
          'comandos radar cs2',
          'cl_radar_scale cs2',
          'radar competitivo cs2',
          'cl_hud_radar_scale cs2',
        ],
        searchIntent:
          'Jogadores que querem ajustar o radar do CS2 para ler melhor o mapa e a posição do time.',
        seoTitle: 'Configuração de Radar CS2 - Comandos e Gerador de Radar',
        seoDescription:
          'Ajuste o radar do CS2 com cl_radar_scale, cl_hud_radar_scale, cl_radar_rotate e cl_radar_always_centered. Copie os comandos ou gere um radar.cfg.',
        h1: 'Configuração de radar CS2',
        intro:
          'Ajuste o radar do CS2 para ler melhor o mapa e a posição do time. Escolha escala, rotação e centralização no gerador, copie os comandos ou baixe um radar.cfg.',
        focus: 'configuração de radar',
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
      zh: {
        name: 'CS2 雷达设置生成器',
        shortDescription:
          '生成 CS2 雷达指令组合,包含缩放、旋转、居中和队友颜色可见性设置。',
        primaryKeyword: 'cs2 雷达设置',
        secondaryKeywords: [
          'cs2 雷达指令',
          'cl_radar_scale cs2',
          'cs2 竞技雷达',
          'cl_hud_radar_scale cs2',
        ],
        searchIntent: '希望优化 CS2 雷达可读性,提升地图意识和团队信息获取的玩家。',
        seoTitle: 'CS2 雷达设置 - 竞技指令生成器',
        seoDescription:
          '调整 cl_radar_scale、cl_hud_radar_scale、cl_radar_rotate 等 CS2 雷达相关指令,做出更好的判断。',
        h1: 'CS2 雷达设置生成器',
        intro:
          '搭建 CS2 雷达设置,在竞技回合中提升绕后意识、间距判断和队友信息获取能力。',
        focus: '雷达设置',
      },
    },
  },
  'cs2-hud-commands': {
    mode: 'hud',
    localized: {
      'pt-br': {
        name: 'Comandos de HUD CS2',
        shortDescription:
          'Comandos de HUD do CS2 para escala, inventário, contagem de jogadores, killfeed, cor e mira, com gerador de binds de uma ação.',
        primaryKeyword: 'comandos hud cs2',
        secondaryKeywords: [
          'hud_scaling cs2',
          'cl_showloadout cs2',
          'cl_hud_color cs2',
          'mudar hud cs2',
        ],
        searchIntent:
          'Jogadores que querem uma HUD mais limpa e legível no CS2 sem esconder informações importantes.',
        seoTitle: 'Comandos HUD CS2 - Escala, Inventário e Interface',
        seoDescription:
          'Copie comandos de HUD do CS2: hud_scaling, cl_showloadout, cl_hud_playercount_showcount, cl_hud_color e opções de mira, mais binds de uma ação.',
        h1: 'Comandos de HUD CS2',
        intro:
          'Deixe a interface do CS2 mais limpa sem perder informação importante. Copie comandos de escala, inventário, contagem de jogadores e killfeed, e gere binds simples de ping, clutch e granadas.',
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
      zh: {
        name: 'CS2 HUD 指令',
        shortDescription:
          '通过缩放、装备显示、击杀信息和颜色选项调整 CS2 HUD,让竞技信息更清晰。',
        primaryKeyword: 'cs2 hud 指令',
        secondaryKeywords: ['hud_scaling cs2', 'cl_showloadout cs2', 'cl_hud_color cs2', 'cs2 hud 清爽'],
        searchIntent: '希望在不丢失关键对局信息的前提下,让 CS2 HUD 更简洁易读的玩家。',
        seoTitle: 'CS2 HUD 指令 - 缩放、颜色与竞技界面',
        seoDescription:
          '复制 CS2 HUD 指令,调整 hud_scaling、cl_showloadout、cl_hud_color,让界面读取更快。',
        h1: 'CS2 HUD 指令',
        intro: '使用 HUD 指令调整你的 CS2 界面,在可见性、回合专注度和关键信息清晰度之间取得平衡。',
        focus: 'HUD 指令',
      },
    },
  },
  'cs2-hud-color': {
    mode: 'hud_color',
    localized: {
      'pt-br': {
        name: 'Gerador de Cor da HUD CS2',
        shortDescription:
          'Escolha a cor da HUD do CS2 pelo nome e copie o comando cl_hud_color pronto, de 0 (padrão) a 10 (pink).',
        primaryKeyword: 'mudar cor hud cs2',
        secondaryKeywords: [
          'cl_hud_color cs2',
          'cores hud cs2',
          'hud color cs2 comando',
          'hud rosa cs2',
        ],
        searchIntent:
          'Jogadores que querem mudar a cor da HUD do CS2 rapidamente, sem decorar os valores numéricos.',
        seoTitle: 'Mudar Cor da HUD CS2 - Gerador do Comando cl_hud_color',
        seoDescription:
          'Escolha a cor da HUD do CS2 pelo nome e copie o comando cl_hud_color de 0 a 10 para o console, um .cfg ou o seu autoexec.',
        h1: 'Mudar cor da HUD no CS2',
        intro:
          'Escolha a cor da HUD no CS2 pelo nome, veja o comando cl_hud_color correspondente e copie para o console ou para o seu autoexec.',
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
      zh: {
        name: 'CS2 HUD 颜色生成器',
        shortDescription:
          '通过易懂的名称选择 CS2 HUD 颜色,并生成可直接用于 autoexec 的 cl_hud_color 指令。',
        primaryKeyword: 'cs2 hud 颜色',
        secondaryKeywords: ['cl_hud_color cs2', 'cs2 hud 颜色代码', '修改 cs2 hud 颜色', 'cs2 粉色 hud'],
        searchIntent: '希望快速修改 CS2 HUD 颜色、又不想记住具体数值的玩家。',
        seoTitle: 'CS2 HUD 颜色生成器 - cl_hud_color 指令',
        seoDescription: '使用易懂的颜色名称生成 CS2 的 cl_hud_color 指令,并立即复制到你的配置中。',
        h1: 'CS2 HUD 颜色生成器',
        intro:
          '按名称选择 HUD 颜色,查看对应指令,并复制可直接用于控制台或 autoexec 的 cl_hud_color。',
        focus: 'HUD 颜色',
      },
    },
  },
  'cs2-viewmodel-generator': {
    mode: 'viewmodel',
    localized: {
      'pt-br': {
        name: 'Gerador de Viewmodel CS2',
        shortDescription:
          'Ajuste viewmodel_fov, offsets X, Y e Z e o preset de posição da arma no CS2 e copie os comandos prontos.',
        primaryKeyword: 'gerador viewmodel cs2',
        secondaryKeywords: [
          'viewmodel cs2',
          'viewmodel_fov 68',
          'viewmodel_offset_x',
          'config viewmodel competitivo',
        ],
        searchIntent:
          'Jogadores que querem ajustar a posição da arma no CS2 para melhorar a leitura da tela sem perder a referência.',
        seoTitle: 'Gerador de Viewmodel CS2 - FOV, Offsets e Posição da Arma',
        seoDescription:
          'Monte seu viewmodel no CS2 com viewmodel_fov, viewmodel_offset_x/y/z e viewmodel_presetpos. Copie os comandos ou baixe o viewmodel.cfg.',
        h1: 'Gerador de viewmodel CS2',
        intro:
          'Ajuste a posição da arma na tela do CS2 com FOV, offsets X, Y e Z e preset de posição. O gerador monta os comandos e você copia para o console ou baixa um viewmodel.cfg.',
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
      zh: {
        name: 'CS2 Viewmodel 生成器',
        shortDescription:
          '通过现成预设调整 CS2 的 viewmodel_fov 和偏移量,并生成可直接复制的最终指令。',
        primaryKeyword: 'cs2 viewmodel 生成器',
        secondaryKeywords: [
          'cs2 viewmodel 设置',
          'viewmodel_fov 68',
          'cs2 viewmodel_offset_x',
          '职业选手 viewmodel cs2',
        ],
        searchIntent: '希望调整 CS2 武器模型位置,以获得更好的画面清晰度和一致性的玩家。',
        seoTitle: 'CS2 Viewmodel 生成器 - FOV、偏移量与现成预设',
        seoDescription:
          '使用 viewmodel_fov 和 x/y/z 偏移量,搭配 compact、职业风格、最大可见度等预设,搭建你的 CS2 viewmodel。',
        h1: 'CS2 Viewmodel 生成器',
        intro:
          '使用现成预设调整 CS2 武器 FOV 和偏移量,然后复制最终指令,保持训练与竞技中的一致性。',
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
          'Gere comandos de fps_max, cl_showfps, telemetria de rede e volume para o CS2 e acompanhe o desempenho do seu PC.',
        primaryKeyword: 'comandos fps cs2',
        secondaryKeywords: [
          'aumentar fps cs2',
          'fps_max cs2',
          'cl_showfps cs2',
          'comandos performance cs2',
        ],
        searchIntent:
          'Jogadores que querem organizar comandos de desempenho no CS2 e medir o efeito de cada ajuste, sem promessa de ganho garantido.',
        seoTitle: 'Comandos FPS CS2 - fps_max, Telemetria e Volume',
        seoDescription:
          'Copie comandos de FPS do CS2: fps_max, fps_max_ui, cl_showfps e telemetria de ping e perda de pacotes. Meça o efeito antes de adotar.',
        h1: 'Comandos de FPS no CS2',
        intro:
          'Defina o limite de FPS, exiba FPS e telemetria de rede e ajuste o volume do CS2 com comandos prontos. Eles ajudam a medir e organizar o desempenho; o ganho real depende do seu PC.',
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
      zh: {
        name: 'CS2 FPS 指令',
        shortDescription:
          '通过现成指令调整 CS2 的 FPS 上限、遥测信息和视觉元素,可直接复制测试。',
        primaryKeyword: 'cs2 fps 指令',
        secondaryKeywords: ['cs2 最佳性能指令', 'fps_max cs2', 'cl_showfps cs2', 'cs2 遥测指令'],
        searchIntent: '希望在不轻信"保证提升 FPS"说法的前提下,实用地调整 CS2 性能指令的玩家。',
        seoTitle: 'CS2 FPS 指令 - 上限、遥测与性能调优',
        seoDescription:
          '复制 CS2 FPS 相关指令,如 fps_max、cl_showfps、cq_netgraph 和视觉开关,在你的硬件上测试性能。',
        h1: 'CS2 FPS 指令',
        intro: '测试 CS2 的 FPS 上限和遥测相关指令,在对局和训练中平衡流畅度、稳定性与可见性。',
        focus: 'FPS 指令',
      },
    },
  },
  'cs2-autoexec-generator': {
    mode: 'autoexec',
    localized: {
      'pt-br': {
        name: 'Gerador de Autoexec CS2',
        shortDescription:
          'Gere autoexec.cfg, practice.cfg e fun.cfg separados, com radar, HUD, viewmodel, FPS, áudio e binds simples.',
        primaryKeyword: 'gerador autoexec cs2',
        secondaryKeywords: [
          'autoexec cs2',
          'practice cfg cs2',
          'fun cfg cs2',
          'config competitiva cs2',
        ],
        searchIntent:
          'Jogadores que querem organizar as configurações do CS2 em arquivos separados para jogo competitivo, treino e servidor privado.',
        seoTitle: 'Gerador de Autoexec CS2 - autoexec.cfg, practice.cfg e fun.cfg',
        seoDescription:
          'Monte autoexec.cfg, practice.cfg e fun.cfg do CS2 escolhendo os blocos de radar, HUD, viewmodel, FPS, áudio e binds. Copie ou baixe cada arquivo.',
        h1: 'Gerador de autoexec CS2',
        intro:
          'Escolha os blocos de radar, HUD, viewmodel, FPS, áudio e binds e gere arquivos separados: autoexec.cfg para o dia a dia, practice.cfg para treino local e fun.cfg para servidor privado.',
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
      zh: {
        name: 'CS2 Autoexec 生成器',
        shortDescription:
          '分别生成包含雷达、HUD、viewmodel、FPS、音频和简单绑定的 autoexec.cfg、practice.cfg 和 fun.cfg。',
        primaryKeyword: 'cs2 autoexec 生成器',
        secondaryKeywords: ['cs2 autoexec', 'cs2 practice cfg', 'cs2 fun cfg', 'cs2 安全配置生成器'],
        searchIntent: '希望按用途(竞技、训练、私服娱乐)分别整理结构化 CS2 配置文件的玩家。',
        seoTitle: 'CS2 Autoexec 生成器 - autoexec.cfg、practice.cfg 和 fun.cfg',
        seoDescription:
          '按用途分别生成 CS2 配置文件:竞技用 autoexec、本地训练用 practice cfg,以及私服娱乐用 fun cfg。',
        h1: 'CS2 Autoexec 生成器',
        intro:
          '选择指令区块,分别生成用于竞技 autoexec、本地训练和私服娱乐指令的独立文件。',
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
          'Monte uma config competitiva para o CS2 com radar, HUD, viewmodel, FPS, áudio e binds de uma ação, sem comandos de treino.',
        primaryKeyword: 'config competitiva cs2',
        secondaryKeywords: [
          'config safe cs2',
          'binds seguros cs2',
          'radar competitivo cs2',
          'viewmodel competitivo cs2',
        ],
        searchIntent:
          'Jogadores que querem uma base de configuração competitiva no CS2, sem comandos de treino local nem automações arriscadas.',
        seoTitle: 'Config Competitiva CS2 - Radar, HUD, Viewmodel e Binds',
        seoDescription:
          'Monte sua config competitiva do CS2 com radar, HUD, viewmodel, FPS, áudio e binds simples. Só comandos de cliente, sem sv_cheats nem comandos de treino.',
        h1: 'Config competitiva CS2',
        intro:
          'Monte uma config competitiva para o CS2 com radar legível, HUD limpa, viewmodel consistente, telemetria de FPS e ping e binds simples. A lista mostra só comandos de cliente, sem sv_cheats.',
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
      zh: {
        name: 'CS2 竞技配置',
        shortDescription:
          '搭建安全的 CS2 竞技配置,包含雷达、viewmodel、HUD、FPS 和简单绑定,不含训练专用指令。',
        primaryKeyword: 'cs2 竞技配置',
        secondaryKeywords: ['cs2 安全配置', 'cs2 安全绑定', 'cs2 竞技雷达', 'cs2 竞技 viewmodel'],
        searchIntent: '希望获得不含风险自动化或本地专用指令的 CS2 竞技配置基础的玩家。',
        seoTitle: 'CS2 竞技配置 - 雷达、Viewmodel、HUD 与安全绑定',
        seoDescription:
          '使用常见客户端指令生成安全的 CS2 竞技配置,不含 sv_cheats、穿墙或风险自动化操作。',
        h1: 'CS2 竞技配置',
        intro:
          '搭建安全的 CS2 竞技配置,专注于雷达可读性、HUD 清晰度、一致的 viewmodel 和简单绑定。',
        focus: '竞技配置',
      },
    },
  },
  'cs2-tournament-safe-config': {
    mode: 'tournament',
    localized: {
      'pt-br': {
        name: 'Config Campeonato CS2',
        shortDescription:
          'Monte uma config limpa para campeonato no CS2: só comandos de cliente, binds de uma ação e nenhum bloco de treino ou sv_cheats.',
        primaryKeyword: 'config campeonato cs2',
        secondaryKeywords: [
          'config segura cs2',
          'config para competitivo cs2',
          'binds seguros cs2',
          'autoexec campeonato cs2',
        ],
        searchIntent:
          'Jogadores que precisam de uma config limpa para campeonato, sem risco de levar comandos locais ou automações para a partida.',
        seoTitle: 'Config Campeonato CS2 - Setup Limpo e Sem Comandos de Treino',
        seoDescription:
          'Prepare uma config para campeonato do CS2 com radar, HUD, viewmodel, FPS, áudio e binds simples, sem sv_cheats, bots ou comandos de treino.',
        h1: 'Config campeonato CS2',
        intro:
          'Prepare uma config enxuta para jogar campeonato no CS2: apenas comandos de cliente, binds de uma ação e nenhum comando de treino. Confira o regulamento do evento antes de aplicar.',
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
      zh: {
        name: 'CS2 赛事安全配置',
        shortDescription: '使用常见客户端指令搭建赛事安全的 CS2 配置,不包含本地训练模块。',
        primaryKeyword: 'cs2 赛事安全配置',
        secondaryKeywords: [
          'cs2 安全赛事配置',
          'cs2 竞技安全配置',
          'cs2 安全绑定',
          'cs2 赛事 autoexec',
        ],
        searchIntent: '需要一份干净的赛事配置、不含本地专用指令或风险自动化的玩家。',
        seoTitle: 'CS2 赛事安全配置 - 官方竞技安全设置',
        seoDescription:
          '创建包含雷达、HUD、viewmodel 和简单绑定的赛事安全 CS2 配置,不含 sv_cheats 或风险自动化。',
        h1: 'CS2 赛事安全配置',
        intro:
          '搭建简单且安全的 CS2 赛事配置,不含本地训练指令、不依赖 sv_cheats,也不含风险自动化操作。',
        focus: '赛事安全配置',
      },
    },
  },
  'cs2-fun-commands': {
    mode: 'fun',
    localized: {
      'pt-br': {
        name: 'Comandos Divertidos CS2',
        shortDescription:
          'Comandos fun para servidor privado no CS2: gravidade, bunnyhop automático, noclip, god, timescale e respawn.',
        primaryKeyword: 'comandos divertidos cs2',
        secondaryKeywords: [
          'comandos sv_cheats cs2',
          'comandos private cs2',
          'gravity cs2',
          'bunnyhop treino cs2',
        ],
        searchIntent:
          'Jogadores que querem testar comandos divertidos no CS2 em sala local ou servidor privado, sem impacto em partidas competitivas.',
        seoTitle: 'Comandos Divertidos CS2 - Gravidade, Bunnyhop e Noclip',
        seoDescription:
          'Copie comandos divertidos do CS2 para servidor privado: sv_gravity, bunnyhop automático, noclip, god, host_timescale e respawn. A maioria exige sv_cheats 1.',
        h1: 'Comandos divertidos para CS2 (servidor privado)',
        intro:
          'Experimente gravidade baixa, bunnyhop automático, noclip, modo god e timescale em uma sala local ou servidor privado seu. Os comandos que exigem sv_cheats vêm com aviso e servem só para treino.',
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
      zh: {
        name: 'CS2 娱乐指令',
        shortDescription:
          '适用于 CS2 私服的娱乐指令,包含重力调整、连跳、穿墙、重生和本地实验。',
        primaryKeyword: 'cs2 娱乐指令',
        secondaryKeywords: ['cs2 sv_cheats 指令', 'cs2 私服指令', 'cs2 重力指令', 'cs2 本地连跳'],
        searchIntent: '希望在本地/私人服务器中体验 CS2 娱乐指令、且不影响竞技对局的玩家。',
        seoTitle: 'CS2 娱乐指令 - 私服、重力与连跳',
        seoDescription:
          '复制适用于私服的 CS2 娱乐指令,包含 sv_cheats、穿墙、重力、重生,以及标注清楚的本地实验性设置。',
        h1: 'CS2 私服娱乐指令',
        intro:
          '在本地/私人服务器中体验 CS2 娱乐指令,并附有明确提示,说明哪些内容不应用于官方竞技对局。',
        focus: '娱乐指令',
      },
    },
  },
};

type Cs2PtBrToolContent = {
  contentBlocks: ContentBlock[];
  faq: FaqItem[];
};

/**
 * Texto pt-BR específico de cada ferramenta CS2. Os fatos vêm do catálogo
 * (data/cs2/commands.ts), dos presets (data/cs2/command-presets.ts), da
 * configuração de cada página (data/cs2/tool-ui-config.ts) e dos geradores
 * em components/tools/cs2-shared-ui.tsx.
 */
const ptBrContentByToolId: Record<Cs2ToolId, Cs2PtBrToolContent> = {
  'cs2-practice-commands': {
    contentBlocks: [
      {
        title: 'O que esta lista reúne',
        paragraphs: [
          'A lista reúne comandos de sete categorias: treino, round/tempo, dinheiro/compra, granadas, smokes, servidor e binds. Cada cartão mostra o comando, uma descrição curta, um selo ("Treino local" ou "Requer sv_cheats") e o botão para copiar.',
          'Ao abrir a página, os filtros já mostram só comandos de treino local. Para ver a lista completa, desmarque "Apenas treino local/private server". Os comandos são texto: a ferramenta não executa nada no jogo.',
        ],
      },
      {
        title: 'Como montar uma sala de treino',
        paragraphs: [
          'Crie uma partida local ou um servidor seu e abra o console. Comece por sv_cheats 1: comandos com o selo "Requer sv_cheats", como sv_infinite_ammo 1, noclip, sv_rethrow_last_grenade e sv_showimpacts 1, só funcionam depois dele. Já os ajustes de regra, como mp_freezetime 0, mp_roundtime 60, mp_buytime 9999, mp_buy_anywhere 1 e mp_startmoney 60000, não têm esse selo no catálogo.',
          'O preset "Treino básico" junta tudo em ordem: sv_cheats 1, bot_kick, mp_warmup_end, mp_freezetime 0, rodada de 60 minutos, compra liberada, dinheiro inicial e máximo de 60000, munição infinita, ammo_grenade_limit_total 5 e, por fim, mp_restartgame 1 para reiniciar a partida já com tudo aplicado. Os outros presets da página são granadas, smoke, spray e regras de scrim privada.',
        ],
        list: [
          'Copiar preset: leva todos os comandos do preset, um por linha, para colar no console.',
          'Baixar .cfg: gera um arquivo com o nome do preset (por exemplo, basic-practice.cfg). Salve na pasta cfg do CS2 e carregue com exec basic-practice.',
          'A prévia do cartão mostra só os 8 primeiros comandos; a cópia e o download levam o preset inteiro.',
        ],
      },
      {
        title: 'Limites desta página',
        paragraphs: [
          'Os comandos são para sala local, lobby privado ou servidor que você controla. Alguns estão marcados para validação (como sv_showimpacts_time e os ent_fire que limpam granadas) porque podem mudar entre atualizações; um filtro lista só esses.',
          'Esta página não traz comandos de bots: eles estão em Comandos de bots CS2 e em Config de treino CS2. Tudo é gerado no seu navegador e nada do que você escolhe é enviado a um servidor.',
        ],
      },
    ],
    faq: [
      {
        question: 'Preciso de sv_cheats 1 para todos os comandos de treino?',
        answer:
          'Não. Segundo o catálogo da ferramenta, só os comandos com o selo "Requer sv_cheats" dependem dele, como sv_infinite_ammo 1, noclip, sv_rethrow_last_grenade e sv_showimpacts 1. Os ajustes de regra, como mp_roundtime e mp_startmoney, valem apenas em servidor seu, mas não têm esse selo.',
      },
      {
        question: 'Posso usar esses comandos em partida competitiva oficial?',
        answer:
          'Não. Os comandos desta página servem para sala local ou servidor privado, e a maioria está marcada como treino local no catálogo. Para o dia a dia no competitivo, use a Config competitiva CS2, que lista só ajustes de cliente.',
      },
      {
        question: 'Como guardo um preset para usar de novo?',
        answer:
          'Clique em "Baixar .cfg" no preset, salve o arquivo na pasta cfg do CS2 e rode exec com o nome do arquivo, sem a extensão (por exemplo, exec basic-practice). O arquivo traz um comando por linha, sem cabeçalho.',
      },
      {
        question: 'Qual a diferença para a página Config de treino CS2?',
        answer:
          'Esta página lista comandos de treino, rodada, dinheiro, granadas, smokes, servidor e binds. A Config de treino CS2 acrescenta os comandos e o preset de bots, para quem treina duelos e posicionamento.',
      },
    ],
  },
  'cs2-practice-config': {
    contentBlocks: [
      {
        title: 'Presets de treino disponíveis',
        paragraphs: [
          'Cada preset é uma lista fixa de comandos que você copia ou baixa. Nesta página há seis, e cinco deles começam com sv_cheats 1:',
        ],
        list: [
          'Treino básico: rodada de 60 minutos, compra liberada, dinheiro alto, munição infinita e reinício da partida.',
          'Treino de granadas: base de treino mais trajetória e rastro da granada, mira de arremesso, impactos, bind V para noclip e bind R para repetir a última granada.',
          'Treino de smoke: versão enxuta, com trajetória, rethrow e noclip, sem limpar bots nem encerrar o aquecimento.',
          'Treino de spray: munição infinita e marcação de impactos por 10 segundos para ajustar o controle de recuo.',
          'Treino com bots: bot_add_t, bot_add_ct, bot_stop 1, bot_dont_shoot 1, bot_freeze 1, bot_ignore_enemies 1, bot_place e respawn automático dos dois lados.',
          'Regras de scrim privada: bomba em 40 segundos, 30 rounds, overtime de 6 rounds com dinheiro de 10000 e pausas táticas. Este é o único que não usa sv_cheats.',
        ],
      },
      {
        title: 'Como transformar o preset em practice.cfg',
        paragraphs: [
          'O arquivo baixado leva o nome do preset, como basic-practice.cfg ou bot-practice.cfg. Para usá-lo, salve na pasta cfg do CS2 e rode exec com esse nome. Se preferir o nome practice.cfg, renomeie o arquivo antes de salvar e use exec practice.',
          'Se você quer um único practice.cfg com todos os presets de treino juntos, o Gerador de autoexec CS2 faz isso: ele reúne treino básico, granadas, smoke, spray, bots e scrim, remove linhas repetidas e coloca host_writeconfig no final.',
        ],
      },
      {
        title: 'Limites e cuidados',
        paragraphs: [
          'Os presets são listas prontas: a página não edita o conteúdo antes do download. Para tirar ou trocar uma linha, abra o .cfg em um editor de texto. Como os comandos rodam em sequência, mantenha sv_cheats 1 antes dos que dependem dele.',
          'Não carregue esses arquivos em partida oficial: eles misturam comandos de treino local. A página roda no navegador e não envia o que você escolhe a nenhum servidor.',
        ],
      },
    ],
    faq: [
      {
        question: 'Qual preset devo usar primeiro?',
        answer:
          'Comece pelo "Treino básico". Ele libera compra, dinheiro e munição e deixa a rodada longa. Depois acrescente o de granadas, smoke, spray ou bots conforme o que você quer treinar.',
      },
      {
        question: 'O arquivo baixado já se chama practice.cfg?',
        answer:
          'Não. O nome segue o preset, como basic-practice.cfg. Você pode carregá-lo com exec basic-practice ou renomear para practice.cfg. Para reunir todos os presets de treino em um só arquivo, use o Gerador de autoexec CS2.',
      },
      {
        question: 'Todos os presets exigem sv_cheats 1?',
        answer:
          'Cinco dos seis começam com sv_cheats 1. As "Regras de scrim privada" usam só comandos mp_, como mp_maxrounds e mp_overtime_enable, e valem em servidor que você controla.',
      },
      {
        question: 'Posso levar essa config para o competitivo?',
        answer:
          'Não. Os presets de treino ligam recursos como munição infinita, noclip e bots. Para jogar partidas, use a Config competitiva CS2 ou a Config campeonato CS2.',
      },
    ],
  },
  'cs2-grenade-practice-commands': {
    contentBlocks: [
      {
        title: 'Comandos que mostram o arremesso',
        paragraphs: [
          'Para ver onde a granada vai cair, ligue sv_grenade_trajectory_prac_pipreview 1 (prévia da trajetória) e sv_grenade_trajectory_prac_trailtime 10 (rastro visível por 10 segundos). Os dois exigem sv_cheats 1. Também há sv_grenade_trajectory_time_spectator 10, que define por quanto tempo a trajetória aparece para espectadores.',
          'A mira de arremesso funciona separada: cl_grenadecrosshair_smoke, _flash, _fire, _explosive e _decoy, mais cl_grenadecrosshair_keepusercrosshair 1. São ajustes de cliente, não pedem sv_cheats e aparecem como seguros no catálogo. Para conferir onde a granada bateu, use sv_showimpacts 1 e sv_showimpacts_time 10.',
        ],
      },
      {
        title: 'Repetir, repor e limpar granadas',
        paragraphs: [
          'sv_rethrow_last_grenade repete a última granada para você comparar lineup e timing. O preset "Treino de granadas" já traz bind "r" "sv_rethrow_last_grenade" e bind "v" "noclip", para voltar ao ponto de arremesso sem refazer o caminho.',
          'Para repor utilitários, a lista tem give weapon_smokegrenade, give weapon_flashbang e ammo_grenade_limit_total 5. Para remover projéteis ativos há ent_fire com smokegrenade_projectile, flashbang_projectile, hegrenade_projectile e molotov_projectile; todos exigem sv_cheats 1 e estão marcados para validação.',
        ],
        list: [
          'Ative sv_cheats 1 e aplique o preset de granadas.',
          'Faça o arremesso e confira a trajetória e o ponto de impacto.',
          'Aperte R para repetir a última granada e compare o resultado.',
          'Use V (noclip) para ir até o alvo e conferir de perto.',
        ],
      },
      {
        title: 'Limites',
        paragraphs: [
          'A página não guarda coordenadas nem confere se um lineup está certo: ela só entrega os comandos que ajudam a repetir e a enxergar cada tentativa. Os comandos de trajetória, rethrow e limpeza servem para sala local ou servidor privado. Se um ent_fire não surtir efeito após uma atualização do jogo, reinicie a partida com mp_restartgame 1.',
          'Tudo é gerado no navegador e não é enviado a servidor algum.',
        ],
      },
    ],
    faq: [
      {
        question: 'Quais comandos de granada exigem sv_cheats?',
        answer:
          'Os que têm o selo "Requer sv_cheats": prévia e rastro da trajetória, sv_rethrow_last_grenade, give, ent_fire e as marcações de impacto. A mira de arremesso (cl_grenadecrosshair_*) é ajuste de cliente e não pede sv_cheats.',
      },
      {
        question: 'Como repetir a última granada com uma tecla?',
        answer:
          'Use bind "r" "sv_rethrow_last_grenade", que já vem no preset de treino de granadas. Ative sv_cheats 1 antes, senão o bind não tem efeito. Se a tecla R já estiver em uso, troque no comando.',
      },
      {
        question: 'Posso usar a mira de arremesso no competitivo?',
        answer:
          'No catálogo da ferramenta, os cl_grenadecrosshair_* aparecem como seguros e sem sv_cheats. Já trajetória, rethrow, give e ent_fire ficam restritos ao treino local. Confirme as regras do servidor ou do campeonato onde você vai jogar.',
      },
      {
        question: 'O ent_fire para limpar granadas sempre funciona?',
        answer:
          'Não há garantia. Esses comandos estão marcados para validação porque podem mudar entre atualizações do jogo. Se não funcionarem, reinicie a partida com mp_restartgame 1.',
      },
    ],
  },
  'cs2-smoke-practice-commands': {
    contentBlocks: [
      {
        title: 'O que o preset de smoke faz',
        paragraphs: [
          'O preset "Treino de smoke" é uma lista enxuta de dez comandos: sv_cheats 1, mp_roundtime_defuse 60, mp_buy_anywhere 1, mp_buytime 9999, sv_infinite_ammo 1, ammo_grenade_limit_total 5, prévia e rastro da trajetória, bind "r" para repetir a última granada e bind "v" para noclip.',
          'Ele não limpa bots nem encerra o aquecimento, e define o tempo de rodada só para mapas de bomba (mp_roundtime_defuse). Para esses ajustes, use o "Treino básico", que também aparece nesta página.',
        ],
      },
      {
        title: 'Rotina para treinar um lineup de smoke',
        paragraphs: [
          'Aplique o preset, vá até a posição de arremesso e jogue a smoke. A trajetória e o rastro mostram o caminho; o noclip (tecla V) leva você até o ponto de queda para conferir se a smoke fechou o que devia. Depois, aperte R para repetir a última granada e compare.',
          'Para tirar a smoke do mapa antes da próxima tentativa, a lista traz ent_fire smokegrenade_projectile kill, que tenta remover smokes ativas no servidor local. Ele está marcado para validação: se não funcionar na sua versão do jogo, use mp_restartgame 1.',
        ],
        list: [
          'give weapon_smokegrenade entrega uma smoke na hora, sem abrir o menu de compra.',
          'sv_grenade_trajectory_prac_trailtime 10 mantém o rastro por 10 segundos.',
          'Salve o preset como .cfg para repetir a sessão sem copiar tudo de novo.',
        ],
      },
      {
        title: 'O que esta página não faz',
        paragraphs: [
          'Ela não traz lineups prontos nem coordenadas de mapas: entrega os comandos para você repetir e enxergar os seus. A lista de comandos é a mesma de Comandos de granadas CS2; aqui o foco é a rotina de smoke.',
          'Os comandos valem em sala local ou servidor privado. O texto é gerado no navegador, sem envio a servidor.',
        ],
      },
    ],
    faq: [
      {
        question: 'Qual a diferença entre esta página e a de comandos de granadas?',
        answer:
          'A lista de comandos e os presets exibidos são os mesmos nas duas páginas. A diferença é o foco do texto: aqui, a rotina de smoke e o preset enxuto "Treino de smoke"; na outra, o conjunto de granadas, com mira de arremesso e marcação de impactos.',
      },
      {
        question: 'Como remover a smoke para repetir o lineup?',
        answer:
          'Use ent_fire smokegrenade_projectile kill, que exige sv_cheats 1 e tenta remover smokes ativas. Como está marcado para validação, pode falhar após atualizações; nesse caso, reinicie com mp_restartgame 1.',
      },
      {
        question: 'Preciso comprar smoke a cada tentativa?',
        answer:
          'Não. O preset libera compra em qualquer lugar (mp_buy_anywhere 1), compra sem limite de tempo (mp_buytime 9999) e munição infinita. Se quiser uma smoke na hora, use give weapon_smokegrenade, que também exige sv_cheats 1.',
      },
      {
        question: 'Posso usar o preset de smoke em servidor oficial?',
        answer:
          'Não. O preset começa com sv_cheats 1 e inclui noclip e rethrow, que são comandos de treino local. Use apenas em sala sua ou servidor privado.',
      },
    ],
  },
  'cs2-bot-commands': {
    contentBlocks: [
      {
        title: 'Criar e controlar bots',
        paragraphs: [
          'Para colocar bots na sala, use bot_add_t e bot_add_ct (um bot em cada lado), bot_add (no time disponível) ou bot_quota 10 com bot_quota_mode fill para preencher os times até a quantidade desejada. bot_kick remove todos. mp_limitteams 0 permite adicionar bots sem restrição de balanceamento e mp_autoteambalance 0 evita a troca automática de bots entre os times.',
          'A dificuldade vai de bot_difficulty 0 (fácil) a 3 (expert). Para duelos mais fáceis ou mais duros, escolha o nível antes de adicionar os bots.',
        ],
      },
      {
        title: 'Congelar, posicionar e repetir o treino',
        paragraphs: [
          'bot_stop 1 e bot_freeze 1 deixam os bots parados como alvos fixos; bot_dont_shoot 1 faz com que eles não atirem, útil para pre-fire e para treinar trajetória de granada; bot_ignore_enemies 1 os faz ignorar adversários e bot_crouch 1 os mantém agachados. Com sv_cheats 1, bot_place coloca o bot no ponto da sua mira, para simular um ângulo específico.',
          'O preset "Treino com bots" reúne: sv_cheats 1, bot_kick, bot_add_t, bot_add_ct, bot_stop 1, bot_dont_shoot 1, bot_freeze 1, bot_ignore_enemies 1, bot_place e mp_respawn_on_death_ct 1 e _t 1, para você reaparecer sem reiniciar a rodada.',
        ],
        list: [
          'bot_knives_only 1 limita os bots a facas.',
          'bot_all_weapons 1 libera todas as armas para eles.',
          'bot_allow_grenades 1 permite que comprem e usem granadas.',
        ],
      },
      {
        title: 'Limites',
        paragraphs: [
          'Bots seguem a inteligência do jogo e não reproduzem o comportamento de jogadores reais, então servem para mecânica (pre-fire, spray, ângulos) e não para treinar leitura de jogo. bot_mimic está marcado como experimental e para validação.',
          'Os comandos valem em sala local ou servidor seu; bot_place também pede sv_cheats 1. A página gera o texto no navegador e não envia nada a servidor.',
        ],
      },
    ],
    faq: [
      {
        question: 'Como colocar um bot parado na minha mira?',
        answer:
          'Ative sv_cheats 1, adicione o bot com bot_add_t ou bot_add_ct, congele com bot_stop 1 e use bot_place, que posiciona o bot no ponto para onde você está mirando.',
      },
      {
        question: 'Como fazer os bots pararem de atirar?',
        answer:
          'Use bot_dont_shoot 1. Para ter alvos imóveis, combine com bot_stop 1 ou bot_freeze 1. Para voltar ao normal, use bot_dont_shoot 0 e bot_stop 0.',
      },
      {
        question: 'Preciso de sv_cheats para adicionar bots?',
        answer:
          'No catálogo, apenas bot_place exige sv_cheats 1. bot_add_t, bot_add_ct, bot_stop, bot_difficulty e os demais comandos de bot valem em servidor seu sem esse selo.',
      },
      {
        question: 'Por que os bots não entram no time que escolhi?',
        answer:
          'Pode ser a restrição de balanceamento de times. A lista traz mp_limitteams 0, que permite adicionar bots sem essa restrição, e mp_autoteambalance 0, que evita a troca automática de bots entre os times.',
      },
    ],
  },
  'cs2-radar-settings': {
    contentBlocks: [
      {
        title: 'O que cada ajuste de radar muda',
        paragraphs: [
          'cl_radar_scale controla o zoom do mapa: 0.35 mostra mais área, 0.5 equilibra detalhe e visão geral e 0.7 aproxima. cl_hud_radar_scale define o tamanho do radar na tela (1 é o padrão; 1.15 e 1.2 aumentam). Não confunda os dois: um muda o zoom do mapa, o outro muda o tamanho da janela do radar.',
          'cl_radar_always_centered 0 mostra mais área do mapa; com 1, você fica fixo no centro. cl_radar_rotate 0 mantém o radar fixo e 1 gira conforme a sua direção. cl_radar_icon_scale_min define o tamanho mínimo dos ícones (0.6 menores, 1 maiores). A lista inclui ainda cl_teammate_colors_show, cl_radar_square_with_scoreboard e opções de fundo do radar.',
        ],
      },
      {
        title: 'Usar o gerador de radar',
        paragraphs: [
          'O gerador tem cinco campos, na ordem do resultado: escala do radar, escala do radar na HUD, radar centralizado (0 ou 1), rotação (0 ou 1) e escala mínima dos ícones. Os valores iniciais são 0.5, 1.2, 0, 0 e 1.',
          'Com esses valores, o resultado é: cl_radar_scale 0.5, cl_hud_radar_scale 1.2, cl_radar_always_centered 0, cl_radar_rotate 0 e cl_radar_icon_scale_min 1. Use "Copiar .cfg" para colar no console ou "Baixar .cfg" para salvar radar.cfg e carregar com exec radar.',
        ],
        list: [
          'Mude um valor por vez e teste em uma partida de treino.',
          'Digite números com ponto decimal, como nos exemplos.',
          'O preset "Radar competitivo" traz sete comandos prontos, incluindo cl_teammate_colors_show 1.',
        ],
      },
      {
        title: 'Limites',
        paragraphs: [
          'Os campos numéricos do gerador aceitam qualquer texto e não validam faixas de valor, então confira o resultado antes de salvar. A página não mostra uma prévia do radar; o efeito só aparece dentro do jogo. Algumas opções, como cl_radar_scale_dynamic e cl_radar_show_all_players_when_spectating, dependem do modo de jogo.',
          'Os comandos de radar são ajustes de interface do cliente, não exigem sv_cheats e aparecem como seguros no catálogo. Tudo é gerado no seu navegador.',
        ],
      },
    ],
    faq: [
      {
        question: 'Qual a diferença entre cl_radar_scale e cl_hud_radar_scale?',
        answer:
          'cl_radar_scale é o zoom do mapa dentro do radar. cl_hud_radar_scale é o tamanho do radar na tela. Você pode deixar o mapa mais aberto e o radar maior ao mesmo tempo.',
      },
      {
        question: 'Devo deixar o radar girar ou fixo?',
        answer:
          'É preferência pessoal. cl_radar_rotate 0 mantém a orientação fixa, o que o catálogo descreve como mais rápido para ler o mapa. Com 1, o radar gira conforme a direção em que você olha.',
      },
      {
        question: 'Esses comandos funcionam em partida oficial?',
        answer:
          'São ajustes locais de interface, sem sv_cheats, e todos os comandos de radar da lista estão marcados como seguros no catálogo da ferramenta.',
      },
      {
        question: 'O gerador confere se os números são válidos?',
        answer:
          'Não. Os campos aceitam o que você digitar e o resultado sai exatamente como escrito. Use os valores da lista (0.35, 0.5, 0.7 para a escala; 1, 1.15, 1.2 para o tamanho) como referência.',
      },
    ],
  },
  'cs2-hud-commands': {
    contentBlocks: [
      {
        title: 'O que a lista de HUD inclui',
        paragraphs: [
          'hud_scaling define o tamanho da interface: 0.85 deixa a HUD mais compacta e libera área de visão, 0.95 é intermediário e 1 volta ao padrão. cl_showloadout 1 mostra armas e granadas equipadas o tempo todo. cl_hud_playercount_showcount 1 troca os avatares pela contagem numérica de vivos, e cl_teamid_overhead_mode 2 mostra nome e equipamento sobre os aliados.',
          'cl_draw_only_deathnotices 1 deixa só o killfeed na tela, o que o catálogo indica para gravação e análise em treino. A lista traz também cl_hud_color de 0 a 10 (para escolher pelo nome, veja Mudar cor da HUD no CS2) e opções de mira: contorno, formato em T, cl_crosshair_recoil, aviso de aliado e o estilo Static Quadrant (cl_crosshairstyle 9).',
        ],
      },
      {
        title: 'Gerador de binds de uma ação',
        paragraphs: [
          'Abaixo da lista há um gerador de bind: você escolhe a tecla (mouse3, mouse4, mouse5, H, V, C, X, Z ou Alt) e a ação (ping, modo clutch, trocar a mão do viewmodel ou selecionar granada). O resultado é uma linha, como bind "mouse5" "clutch_mode_toggle", que você cola no console ou baixa em binds.cfg.',
          'Se a tecla já tem uma função, o bind novo a substitui. Escolha uma tecla livre e, se precisar, ajuste o comando antes de copiar. O modo clutch, segundo o catálogo, alterna temporariamente o chat de voz recebido para ajudar no foco.',
        ],
      },
      {
        title: 'Limites',
        paragraphs: [
          'A página não mostra como a HUD ficará: teste no jogo, de preferência em uma partida de treino. cl_crosshair_recoil faz a mira acompanhar o recuo como recurso visual e não reduz o recoil.',
          'O gerador cria apenas binds de uma ação. Scripts que misturam movimento ou ataque em uma tecla (jumpthrow, null bind, Snap Tap) são marcados como não recomendados no catálogo da ferramenta, e o gerador não os cria. Tudo roda no navegador.',
        ],
      },
    ],
    faq: [
      {
        question: 'Qual valor de hud_scaling devo usar?',
        answer:
          'A lista traz 0.85, 0.95 e 1. Valores menores deixam a HUD mais compacta e liberam espaço na tela; 1 é o padrão. Teste em treino para ver qual leitura é mais confortável no seu monitor.',
      },
      {
        question: 'O bind do gerador pode sobrescrever minhas teclas?',
        answer:
          'Sim, se a tecla já tiver um bind. Por isso o gerador deixa você escolher a tecla antes de copiar. Use uma tecla que você não usa para outra função.',
      },
      {
        question: 'cl_crosshair_recoil reduz o recuo da arma?',
        answer:
          'Não. Segundo o catálogo, ele só faz a mira acompanhar o recuo como recurso visual de treino. O recoil continua igual.',
      },
      {
        question: 'Esses comandos de HUD são permitidos em partida oficial?',
        answer:
          'Os comandos de HUD da lista são ajustes locais de interface e estão marcados como seguros no catálogo, sem sv_cheats. Os binds do gerador executam uma única ação por tecla.',
      },
    ],
  },
  'cs2-hud-color': {
    contentBlocks: [
      {
        title: 'Valores de cl_hud_color e suas cores',
        paragraphs: [
          'O gerador converte o nome da cor no número que o comando espera. A lista completa do seletor é:',
        ],
        list: [
          '0 - default (padrão)',
          '1 - white, 2 - light blue, 3 - blue',
          '4 - purple, 5 - red, 6 - orange',
          '7 - yellow, 8 - green, 9 - aqua, 10 - pink',
        ],
      },
      {
        title: 'Como aplicar e manter a cor',
        paragraphs: [
          'Escolha a cor e o preview mostra uma única linha, por exemplo cl_hud_color 5 para vermelho. Cole no console para testar na hora, copie para o seu próprio .cfg ou baixe hud-color.cfg e carregue com exec hud-color depois de salvar o arquivo na pasta cfg do CS2.',
          'Atenção ao autoexec: o bloco de HUD do Gerador de autoexec CS2 grava cl_hud_color 0 (cor padrão). Se você usar esse gerador, cole a sua linha cl_hud_color no campo opcional dele (rotulado como bloco de crosshair, mas ele aceita qualquer comando): as linhas desse campo entram no fim do arquivo e prevalecem sobre o valor padrão.',
        ],
      },
      {
        title: 'Como escolher e quais os limites',
        paragraphs: [
          'A cor muda a paleta da HUD inteira, e o resultado depende do mapa e do brilho do monitor. A ferramenta não mostra uma prévia visual da cor: teste em partida de treino e, se quiser, compare em mapas claros e escuros antes de fixar.',
          'O seletor gera apenas os valores de 0 a 10. É um ajuste visual do cliente, sem sv_cheats, marcado como seguro no catálogo. Para mexer também em escala, inventário e killfeed, use Comandos de HUD CS2. O texto é gerado no navegador, sem envio a servidor.',
        ],
      },
    ],
    faq: [
      {
        question: 'Como mudar a cor da HUD no CS2?',
        answer:
          'Abra o console e use cl_hud_color com um número de 0 a 10, por exemplo cl_hud_color 5 para vermelho. Para guardar a escolha, coloque a linha em um .cfg que você carregue com exec.',
      },
      {
        question: 'Por que a cor volta ao padrão depois de usar meu autoexec?',
        answer:
          'Provavelmente o arquivo tem cl_hud_color 0 depois da sua linha. O bloco de HUD do Gerador de autoexec CS2 inclui cl_hud_color 0; coloque a sua cor no campo opcional dele, que é escrito por último.',
      },
      {
        question: 'Posso usar uma cor fora da lista, como um código hexadecimal?',
        answer:
          'Esta ferramenta gera apenas os 11 valores do seletor (0 a 10). Ela não aceita códigos hexadecimais nem valores personalizados.',
      },
      {
        question: 'Mudar a cor da HUD é permitido no competitivo?',
        answer:
          'No catálogo da ferramenta, cl_hud_color é um ajuste visual do cliente, sem sv_cheats e marcado como seguro para servidores oficiais.',
      },
    ],
  },
  'cs2-viewmodel-generator': {
    contentBlocks: [
      {
        title: 'O que cada parâmetro do viewmodel faz',
        paragraphs: [
          'viewmodel_fov define quanto campo de visão a arma ocupa: a lista traz 54 (compacto), 60 (equilibrado) e 68 (máxima visibilidade, valor comum em configs competitivas). viewmodel_offset_x move a arma na horizontal, viewmodel_offset_y ajusta a profundidade e viewmodel_offset_z a move para cima ou para baixo. viewmodel_presetpos aplica uma posição rápida (1, 2 ou 3).',
          'O gerador tem quatro campos de texto, na ordem do comando (FOV, X, Y e Z), e um seletor de preset. Os valores iniciais são 68, 2.5, 1, -1.5 e preset 3, que geram cinco linhas: viewmodel_fov 68, viewmodel_offset_x 2.5, viewmodel_offset_y 1, viewmodel_offset_z -1.5 e viewmodel_presetpos 3.',
        ],
      },
      {
        title: 'Como testar o resultado',
        paragraphs: [
          'Copie as linhas para o console ou baixe viewmodel.cfg, salve na pasta cfg do CS2 e carregue com exec viewmodel. Altere um parâmetro por vez e confira dentro do jogo, porque a página não mostra uma prévia da arma.',
          'Se a arma não ficar onde você configurou, verifique a ordem: viewmodel_presetpos sai na última linha do resultado. Aplique-o antes, ou reaplique os offsets depois dele, para ver se ele está interferindo.',
        ],
        list: [
          'cl_prefer_lefthanded 1 define a mão esquerda como preferência; com 0, a direita.',
          'O gerador de binds, nesta página, cria um bind "h" "switchhands" para alternar a mão com uma tecla.',
          'O preset "Viewmodel limpo" traz os mesmos valores iniciais do gerador.',
        ],
      },
      {
        title: 'Limites',
        paragraphs: [
          'Os campos aceitam qualquer texto e não validam faixas de valor. O resultado sai exatamente como digitado, então confira os valores dentro do jogo.',
          'São ajustes visuais do cliente, sem sv_cheats, marcados como seguros no catálogo. O texto é gerado no navegador e não é enviado a servidor.',
        ],
      },
    ],
    faq: [
      {
        question: 'Qual valor de viewmodel_fov devo usar?',
        answer:
          'A lista tem 54, 60 e 68. O valor inicial do gerador é 68, que o catálogo descreve como popular em configs competitivas para abrir o campo visual. Escolha o que for mais confortável para você.',
      },
      {
        question: 'O que o viewmodel_presetpos faz?',
        answer:
          'Aplica uma posição rápida da arma (1, 2 ou 3). O gerador usa 3 por padrão. Como ele é escrito depois dos offsets, teste o resultado e, se preciso, reaplique os offsets depois dele.',
      },
      {
        question: 'Como trocar a arma para a mão esquerda?',
        answer:
          'Use cl_prefer_lefthanded 1, que está na lista, ou crie um bind com o gerador de binds desta página: a ação "Alternar mão do viewmodel" gera bind "h" "switchhands", por exemplo.',
      },
      {
        question: 'O viewmodel exige sv_cheats?',
        answer:
          'Não. Todos os comandos de viewmodel da lista são ajustes de cliente, sem o selo de sv_cheats, e aparecem como seguros no catálogo.',
      },
    ],
  },
  'cs2-fps-commands': {
    contentBlocks: [
      {
        title: 'Limite de FPS e exibição de desempenho',
        paragraphs: [
          'fps_max define o teto de FPS: 0 deixa sem limite, e o gerador oferece 144, 165, 240, 300 e 400. fps_max_ui (60 ou 120) limita o FPS nos menus. cl_showfps (0, 1 ou 2) mostra o FPS na tela, e cq_netgraph exibe dados de rede e desempenho. O aviso do gerador lembra que, desde 2025, o fps_max precisa ser definido antes de entrar em um servidor.',
          'Os valores iniciais do gerador geram fps_max 0, fps_max_ui 120 e cl_showfps 1, e você pode baixar o resultado como fps.cfg. A lista traz ainda r_show_build_info e r_drawtracers_firstperson, e engine_low_latency_sleep_after_client_tick, que o catálogo marca com cautela porque pode piorar o frametime em alguns PCs.',
        ],
      },
      {
        title: 'Telemetria de rede e volume',
        paragraphs: [
          'O gerador de telemetria tem três seletores (frame time, ping e perda ou pacotes fora de ordem), cada um com as opções Desativado (0), Somente em condição ruim (1) e Sempre mostrar (2), mais uma caixa para o gráfico de qualidade da rede. Com os valores iniciais, o resultado é cl_hud_telemetry_frametime_show 1, cl_hud_telemetry_ping_show 1 e cl_hud_telemetry_net_misdelivery_show 1.',
          'O gerador de volume usa um controle de 0 a 100% e escreve volume com o valor em decimal; no padrão de 45%, a linha é volume 0.45. A lista inclui também voice_modenable e cl_mute_enemy_team para a voz.',
        ],
      },
      {
        title: 'Como medir sem se enganar',
        paragraphs: [
          'Compare sempre no mesmo mapa, na mesma resolução e na mesma situação, mudando um comando por vez, com cl_showfps ligado. A ferramenta não mede o seu FPS: ela só gera os comandos. O ganho real depende do hardware e do resto da configuração, e nenhum comando aqui garante mais FPS.',
          'Os ajustes são do cliente, sem sv_cheats. O texto é gerado no navegador, sem envio a servidor.',
        ],
      },
    ],
    faq: [
      {
        question: 'Qual valor de fps_max devo escolher?',
        answer:
          'O gerador oferece 0 (sem limite) e 144, 165, 240, 300 e 400. O catálogo sugere 0 ou um valor fixo alinhado com o seu monitor. Teste e compare o FPS e a estabilidade no seu PC.',
      },
      {
        question: 'Posso mudar o fps_max durante a partida?',
        answer:
          'Segundo o aviso do gerador, desde 2025 o CS2 não permite alterar esse limite enquanto você está conectado. Defina o valor antes de entrar no servidor.',
      },
      {
        question: 'Esses comandos garantem mais FPS?',
        answer:
          'Não. Eles ajudam a organizar o limite de FPS e a mostrar telemetria, mas o resultado depende do seu hardware e da configuração completa. Compare antes e depois com cl_showfps.',
      },
      {
        question: 'O que significa mostrar telemetria "somente em condição ruim"?',
        answer:
          'O indicador de frame time, ping ou perda de pacotes só aparece quando o jogo detecta um problema, o que mantém a tela limpa. Com "Sempre mostrar", ele fica visível o tempo todo.',
      },
    ],
  },
  'cs2-autoexec-generator': {
    contentBlocks: [
      {
        title: 'O que cada arquivo gerado contém',
        paragraphs: [
          'O gerador cria até três arquivos. O autoexec.cfg junta os blocos marcados, com um valor inicial por ajuste: radar (7 comandos), HUD (6, incluindo hud_scaling 0.85 e cl_hud_color 0), viewmodel (6, com FOV 68), FPS (8, com fps_max 0 e telemetria), áudio (voice_modenable 1 e cl_mute_enemy_team 1) e binds simples (7 linhas).',
          'O practice.cfg reúne todos os presets de treino (básico, granadas, smoke, spray, bots e scrim privada), sem linhas repetidas, e o fun.cfg traz o preset de comandos divertidos. Cada arquivo começa com comentários que identificam a origem e termina com host_writeconfig, que grava a configuração atual no arquivo do jogo.',
        ],
      },
      {
        title: 'Como usar os arquivos',
        paragraphs: [
          'Salve os arquivos na pasta cfg do CS2 e carregue conforme o contexto: exec autoexec para o dia a dia, exec practice antes de treinar e exec fun em servidor privado. O practice.cfg tem sv_cheats 1, então não o carregue em partida oficial.',
          'Revise antes de salvar: o bloco de binds sobrescreve a roda do mouse (pular), espaço, C, X, Z e H. O bloco de HUD grava cl_hud_color 0. Desmarque o que não quiser. Para personalizar valores, use os geradores de radar, viewmodel, FPS, volume, telemetria e binds desta página e cole as linhas no campo opcional: ele aceita qualquer comando, elimina linhas vazias e entra no fim do autoexec.cfg.',
        ],
        list: [
          'Desmarque "Incluir practice.cfg" e "Incluir fun.cfg" se quiser só o arquivo do dia a dia.',
          'O campo opcional não valida o que você cola.',
          'Cada arquivo tem botões para copiar ou baixar.',
        ],
      },
      {
        title: 'Limites',
        paragraphs: [
          'Os valores dos blocos são fixos: a ferramenta não deixa editar cada número dentro do arquivo gerado. O catálogo marca como não recomendados jumpthrow automatizado, null bind e Snap Tap/SOCD, e esses itens não entram em nenhum dos arquivos. Os arquivos são gerados localmente no navegador, como diz o cabeçalho de cada um.',
        ],
      },
    ],
    faq: [
      {
        question: 'Onde salvar autoexec.cfg, practice.cfg e fun.cfg?',
        answer:
          'Na pasta cfg do CS2. Depois, use exec autoexec, exec practice e exec fun no console, conforme o que for jogar.',
      },
      {
        question: 'Por que separar em três arquivos?',
        answer:
          'O autoexec.cfg só tem ajustes de cliente. O practice.cfg tem comandos de treino, como sv_cheats 1 e noclip, e o fun.cfg tem comandos de servidor privado. Separados, os de treino não entram sem querer no seu dia a dia.',
      },
      {
        question: 'Meus binds atuais serão sobrescritos?',
        answer:
          'Se o bloco "Incluir binds simples" estiver marcado, sim: ele define a roda do mouse, espaço, C, X, Z e H. Desmarque o bloco para manter os seus.',
      },
      {
        question: 'Como incluo minha mira no autoexec?',
        answer:
          'Cole os comandos de mira no campo opcional, uma linha por comando. Eles são acrescentados ao fim do autoexec.cfg, sem validação, então confira a digitação.',
      },
      {
        question: 'O que o host_writeconfig faz no fim dos arquivos?',
        answer:
          'Segundo o catálogo, grava os comandos atuais no arquivo de configuração do jogo, para que eles permaneçam depois de sair.',
      },
    ],
  },
  'cs2-competitive-config': {
    contentBlocks: [
      {
        title: 'O que entra numa config competitiva',
        paragraphs: [
          'A lista cobre radar, HUD, viewmodel, FPS/performance, áudio/voz e binds. Ao abrir a página, o filtro "Apenas comandos seguros para competitivo" já vem marcado, então só aparecem ajustes de cliente, sem sv_cheats e sem comandos de treino.',
          'O preset "Config competitiva segura" reúne 21 comandos: cinco de radar, contagem de jogadores e identificação de aliados, hud_scaling 0.85, cl_showloadout 1, viewmodel 68/2.5/1/-1.5, fps_max 0, r_show_build_info 0, telemetria de frame time, ping e perda de pacotes, binds de pulo na roda do mouse e bind H para trocar a mão. Há também presets só de radar, de viewmodel, de FPS e telemetria e de binds de comunicação e utilitários.',
        ],
      },
      {
        title: 'Passo a passo para montar a sua',
        paragraphs: [
          'Comece pelo preset seguro e refine com os geradores da própria página: radar, cor da HUD, viewmodel, FPS, volume, telemetria e binds. Cada um gera um arquivo pequeno (radar.cfg, viewmodel.cfg, fps.cfg, audio.cfg e outros). Para juntar tudo em um só autoexec.cfg, use o Gerador de autoexec no fim da página.',
          'Nesse gerador, desmarque practice.cfg e fun.cfg se quiser apenas o arquivo competitivo; eles vêm marcados por padrão e trazem comandos de treino.',
        ],
        list: [
          'Teste cada bloco em treino antes de usar em partida.',
          'Defina fps_max antes de conectar ao servidor.',
          'Mantenha uma cópia do seu autoexec anterior.',
        ],
      },
      {
        title: 'O que "seguro" significa e o que não cobre',
        paragraphs: [
          'Aqui "seguro" é a marcação do catálogo para comandos de cliente, sem sv_cheats e sem automação de várias ações em uma tecla. Jumpthrow automatizado, null bind e Snap Tap/SOCD aparecem como não recomendados e não são gerados. A marcação não substitui as regras de cada plataforma ou campeonato.',
          'Esta página e a Config campeonato CS2 usam os mesmos comandos e presets; use esta para o seu setup do dia a dia. Tudo é gerado no navegador.',
        ],
      },
    ],
    faq: [
      {
        question: 'O que significa "seguro" nesta config?',
        answer:
          'Que o comando é um ajuste de cliente, não exige sv_cheats e não combina várias ações em um único input. É uma classificação do catálogo da ferramenta e não uma autorização de plataforma ou campeonato.',
      },
      {
        question: 'Posso incluir comandos de treino nesta config?',
        answer:
          'Não é recomendado. Comandos como sv_infinite_ammo e noclip exigem sv_cheats 1 e ficam em outro arquivo. Use o Gerador de autoexec CS2 para mantê-los no practice.cfg, separados do autoexec.cfg.',
      },
      {
        question: 'Qual a diferença para a Config campeonato CS2?',
        answer:
          'As duas páginas usam os mesmos comandos, presets e geradores. Esta é pensada para o setup do dia a dia; a de campeonato traz um roteiro de conferência antes de uma partida de evento.',
      },
      {
        question: 'Preciso usar todos os blocos?',
        answer:
          'Não. Radar, HUD, viewmodel, FPS, áudio e binds são independentes: copie só o que quiser. No gerador de autoexec, cada bloco tem uma caixa para marcar ou desmarcar.',
      },
    ],
  },
  'cs2-tournament-safe-config': {
    contentBlocks: [
      {
        title: 'Roteiro de conferência antes da partida',
        paragraphs: [
          'Para campeonato, o objetivo é levar só o que é ajuste de cliente. A página já abre com o filtro de comandos seguros marcado e usa o preset "Config competitiva segura" como referência. Antes de jogar, confira:',
        ],
        list: [
          'Você vai rodar só o autoexec.cfg: nada de exec practice nem exec fun.',
          'O arquivo não contém sv_cheats, noclip nem linhas começando com mp_ ou bot_.',
          'Os binds executam uma única ação (como +jump na roda do mouse ou switchhands).',
          'Não há jumpthrow, null bind nem Snap Tap/SOCD, que o catálogo marca como não recomendados.',
          'fps_max está definido antes de conectar ao servidor.',
        ],
      },
      {
        title: 'Como gerar o arquivo limpo',
        paragraphs: [
          'Use o Gerador de autoexec no fim da página: marque radar, HUD, viewmodel, FPS, áudio e binds e desmarque "Incluir practice.cfg" e "Incluir fun.cfg". Salve o autoexec.cfg na pasta cfg do CS2 e rode exec autoexec. Se preferir só um bloco, baixe o preset "Config competitiva segura" ou use o gerador específico (radar.cfg, viewmodel.cfg, fps.cfg).',
          'Os geradores desta página são os mesmos da Config competitiva CS2; o que muda aqui é o foco na conferência e na separação dos arquivos de treino.',
        ],
      },
      {
        title: 'Limites',
        paragraphs: [
          'A ferramenta não consulta o regulamento de nenhum campeonato. "Seguro" é a marcação do catálogo para ajustes de cliente sem sv_cheats e sem automação; cada organização define o que aceita, então confirme com ela. Tudo é gerado no seu navegador, sem envio a servidor.',
        ],
      },
    ],
    faq: [
      {
        question: 'Essa config é aprovada por campeonatos?',
        answer:
          'Não. A ferramenta usa apenas comandos de cliente marcados como seguros no catálogo, mas não consulta regulamentos. Confirme com a organização do evento o que é aceito.',
      },
      {
        question: 'Como garantir que não há comando de treino no meu arquivo?',
        answer:
          'Gere o autoexec com practice.cfg e fun.cfg desmarcados e abra o arquivo para procurar sv_cheats, noclip e linhas com mp_ ou bot_. O autoexec gerado pelos blocos desta página não traz esses comandos.',
      },
      {
        question: 'Posso usar bind de pulo na roda do mouse?',
        answer:
          'O preset seguro inclui bind "mwheelup" "+jump" e bind "mwheeldown" "+jump", que executam uma única ação. A ferramenta evita automações que combinam movimento ou ataque em um input.',
      },
      {
        question: 'Qual a diferença para a Config competitiva CS2?',
        answer:
          'Os comandos, presets e geradores são os mesmos. Esta página acrescenta o roteiro de conferência para eventos e reforça a separação entre autoexec e arquivos de treino.',
      },
    ],
  },
  'cs2-fun-commands': {
    contentBlocks: [
      {
        title: 'O que o preset fun faz',
        paragraphs: [
          'O preset "Comandos divertidos para servidor privado" começa com sv_cheats 1 e reúne: noclip, sv_gravity 300 (gravidade baixa), sv_autobunnyhopping 1, sv_enablebunnyhopping 1, sv_airaccelerate 1000, respawn automático nos dois lados, mp_ignore_round_win_conditions 1, god, buddha e host_timescale 0.5 e 2.',
          'Repare que host_timescale 0.5 e 2 aparecem em sequência: no arquivo, vale o último que rodar. Para ficar em câmera lenta, apague a linha do 2; para acelerar, a do 0.5. God (invencibilidade) e buddha (vida mínima) estão marcados para validação porque podem mudar entre atualizações.',
        ],
      },
      {
        title: 'Como testar com segurança e voltar ao normal',
        paragraphs: [
          'Crie uma partida local, ative sv_cheats 1 e cole os comandos que quiser. Os cartões com o selo vermelho "Não recomendado" (bunnyhop automático, airaccelerate, gravidades extremas, god, buddha e timescale) alteram movimento, física ou velocidade do jogo e devem ficar restritos a sala sua.',
          'Para reverter, a lista tem sv_gravity 800 (gravidade padrão) e host_timescale 1; para sair do voo, rode noclip de novo. A lista também traz comandos de servidor, como mp_friendlyfire 1 e mp_teammates_are_enemies 1, para modos personalizados.',
        ],
        list: [
          'Teste um comando por vez para saber qual causou cada efeito.',
          'sv_clantags_enabled 0 só serve em servidor personalizado que você administra.',
          'Baixe o preset em .cfg para repetir a sessão sem copiar tudo de novo.',
        ],
      },
      {
        title: 'Limites',
        paragraphs: [
          'Nada aqui vale em partida oficial nem em servidor de terceiros: são comandos pensados para sala local, lobby privado ou servidor que você controla. A maioria exige sv_cheats 1, e os que não exigem, como mp_respawn_on_death, valem apenas em servidor seu. A página só copia texto e gera o arquivo no navegador, sem enviar a servidor.',
        ],
      },
    ],
    faq: [
      {
        question: 'Esses comandos funcionam em matchmaking ou em servidor de outras pessoas?',
        answer:
          'Não são para isso. Eles são marcados como treino local no catálogo e servem para sala sua, lobby privado ou servidor que você controla. Não use em partida oficial.',
      },
      {
        question: 'Preciso ativar sv_cheats 1?',
        answer:
          'Para a maioria, sim: noclip, gravidade, bunnyhop, god, buddha e timescale têm o selo "Requer sv_cheats". O preset já começa com sv_cheats 1. Já mp_respawn_on_death_ct e _t não exigem.',
      },
      {
        question: 'Como voltar ao normal depois de testar?',
        answer:
          'Use sv_gravity 800 para a gravidade padrão e host_timescale 1 para a velocidade normal. Para sair do voo, rode noclip de novo. Se algo ficar fora do lugar, reinicie a partida ou crie uma nova sala.',
      },
      {
        question: 'Qual a diferença entre god e buddha?',
        answer:
          'Segundo o catálogo, god dá invencibilidade e buddha mantém a vida no mínimo. Ambos são comandos fun de servidor local, marcados para validação porque podem não funcionar em todas as versões.',
      },
    ],
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
    contentBlocks:
      locale === 'pt-br'
        ? ptBrContentByToolId[toolId].contentBlocks
        : buildContentBlocks(locale, seed.mode, entry.focus),
    faq: locale === 'pt-br' ? ptBrContentByToolId[toolId].faq : buildFaq(locale, seed.mode),
  };
};

export const getCs2ToolContent = (toolId: Cs2ToolId, locale: AppLocale): Cs2ToolLocaleContent =>
  buildContent(toolId, locale);
