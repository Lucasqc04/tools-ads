import { getCs2CommandById } from '@/data/cs2/commands';

export type Cs2CommandPresetCategory =
  | 'practice'
  | 'smoke'
  | 'spray'
  | 'bots'
  | 'competitive'
  | 'tournament_safe'
  | 'fun';

export type Cs2CommandPreset = {
  id: string;
  category: Cs2CommandPresetCategory;
  commandIds: string[];
  locales: {
    'pt-br': { title: string; description: string };
    en: { title: string; description: string };
    es: { title: string; description: string };
  };
};

export const cs2CommandPresets: Cs2CommandPreset[] = [
  {
    id: 'basic-practice',
    category: 'practice',
    commandIds: [
      'sv-cheats-1',
      'bot-kick',
      'mp-warmup-end',
      'mp-freezetime-0',
      'mp-roundtime-60',
      'mp-roundtime-defuse-60',
      'mp-buytime-9999',
      'mp-buy-anywhere-1',
      'mp-maxmoney-60000',
      'mp-startmoney-60000',
      'sv-infinite-ammo-1',
      'ammo-grenade-limit-total-5',
      'mp-restartgame-1',
    ],
    locales: {
      'pt-br': {
        title: 'Treino basico',
        description:
          'Preset rapido para abrir treino local com dinheiro alto, tempo longo, granadas e repeticao imediata.',
      },
      en: {
        title: 'Basic practice',
        description:
          'Quick local-practice setup with long rounds, high money, grenade access, and fast restart flow.',
      },
      es: {
        title: 'Practica basica',
        description:
          'Preset rapido para practica local con rondas largas, dinero alto y flujo de repeticion.',
      },
    },
  },
  {
    id: 'grenade-practice',
    category: 'practice',
    commandIds: [
      'sv-cheats-1',
      'bot-kick',
      'mp-warmup-end',
      'mp-freezetime-0',
      'mp-roundtime-60',
      'mp-roundtime-defuse-60',
      'mp-buytime-9999',
      'mp-buy-anywhere-1',
      'sv-infinite-ammo-1',
      'ammo-grenade-limit-total-5',
      'sv-grenade-trajectory-preview-on',
      'sv-showimpacts-on',
      'sv-showimpacts-time-10',
      'bind-v-noclip',
      'bind-r-rethrow',
      'mp-restartgame-1',
    ],
    locales: {
      'pt-br': {
        title: 'Treino de granadas',
        description:
          'Foco em lineups com preview de trajetoria, impactos, rethrow e noclip para iterar rapido.',
      },
      en: {
        title: 'Grenade practice',
        description:
          'Lineup-focused preset with trajectory preview, impacts, rethrow bind and noclip for fast iteration.',
      },
      es: {
        title: 'Practica de granadas',
        description:
          'Preset para lineups con trayectoria, impactos, rethrow y noclip para repetir mas rapido.',
      },
    },
  },
  {
    id: 'smoke-practice',
    category: 'smoke',
    commandIds: [
      'sv-cheats-1',
      'mp-roundtime-defuse-60',
      'mp-buy-anywhere-1',
      'mp-buytime-9999',
      'sv-infinite-ammo-1',
      'ammo-grenade-limit-total-5',
      'sv-grenade-trajectory-preview-on',
      'bind-r-rethrow',
      'bind-v-noclip',
    ],
    locales: {
      'pt-br': {
        title: 'Treino de smoke',
        description:
          'Preset enxuto para treinar smoke em servidor local com rastro, rethrow e movimentacao livre.',
      },
      en: {
        title: 'Smoke practice',
        description:
          'Compact local smoke preset with trajectory preview, rethrow bind and free movement.',
      },
      es: {
        title: 'Practica de smokes',
        description:
          'Preset corto para smokes en local con trayectoria, rethrow y movimiento libre.',
      },
    },
  },
  {
    id: 'spray-practice',
    category: 'spray',
    commandIds: [
      'sv-cheats-1',
      'sv-infinite-ammo-1',
      'sv-showimpacts-on',
      'sv-showimpacts-time-10',
      'mp-roundtime-60',
      'mp-buy-anywhere-1',
      'mp-buytime-9999',
    ],
    locales: {
      'pt-br': {
        title: 'Treino de spray',
        description:
          'Mostra impacto dos tiros com municao infinita para ajustar recoil e controle de spray.',
      },
      en: {
        title: 'Spray practice',
        description:
          'Shows bullet impacts with infinite ammo so you can calibrate recoil control.',
      },
      es: {
        title: 'Practica de spray',
        description:
          'Muestra impactos de bala con municion infinita para mejorar control de recoil.',
      },
    },
  },
  {
    id: 'bot-practice',
    category: 'bots',
    commandIds: [
      'sv-cheats-1',
      'bot-kick',
      'bot-add-t',
      'bot-add-ct',
      'bot-stop-1',
      'bot-dont-shoot-1',
      'bot-place',
      'mp-respawn-on-death-ct-1',
      'mp-respawn-on-death-t-1',
    ],
    locales: {
      'pt-br': {
        title: 'Treino com bots',
        description:
          'Configura bots estaticos para treinar pre-fire, peek e reposicionamento em cenario controlado.',
      },
      en: {
        title: 'Bot practice',
        description:
          'Sets static bots for controlled pre-fire, peek and repositioning drills.',
      },
      es: {
        title: 'Practica con bots',
        description:
          'Configura bots estaticos para practicar pre-fire, peek y reposicionamiento.',
      },
    },
  },
  {
    id: 'competitive-radar',
    category: 'competitive',
    commandIds: [
      'cl-radar-always-centered-0',
      'cl-radar-rotate-0',
      'cl-radar-scale-05',
      'cl-hud-radar-scale-12',
      'cl-radar-icon-scale-min-1',
      'cl-radar-square-with-scoreboard-1',
      'cl-teammate-colors-show-1',
    ],
    locales: {
      'pt-br': {
        title: 'Radar competitivo',
        description:
          'Preset de radar para leitura rapida de espacamento e tomada de decisao em partida oficial.',
      },
      en: {
        title: 'Competitive radar',
        description:
          'Radar-focused preset for fast spacing reads and decision-making in official matches.',
      },
      es: {
        title: 'Radar competitivo',
        description:
          'Preset de radar para lectura rapida de posiciones en partidas oficiales.',
      },
    },
  },
  {
    id: 'clean-viewmodel',
    category: 'competitive',
    commandIds: [
      'viewmodel-fov-68',
      'viewmodel-offset-x-25',
      'viewmodel-offset-y-1',
      'viewmodel-offset-z-n15',
      'viewmodel-presetpos-3',
    ],
    locales: {
      'pt-br': {
        title: 'Viewmodel limpo',
        description:
          'Preset visual limpo para abrir campo de visao sem remover informacoes importantes.',
      },
      en: {
        title: 'Clean viewmodel',
        description:
          'Clean viewmodel baseline focused on visibility while keeping essential weapon feedback.',
      },
      es: {
        title: 'Viewmodel limpio',
        description:
          'Preset limpio para mejorar visibilidad sin perder referencia del arma.',
      },
    },
  },
  {
    id: 'fps-telemetry',
    category: 'competitive',
    commandIds: [
      'fps-max-0',
      'fps-max-ui-120',
      'cl-showfps-1',
      'cq-netgraph-1',
      'r-show-build-info-0',
    ],
    locales: {
      'pt-br': {
        title: 'FPS e telemetria',
        description:
          'Preset para controlar limite de FPS e expor telemetria basica sem prometer ganho fixo.',
      },
      en: {
        title: 'FPS and telemetry',
        description:
          'Preset to tune FPS caps and basic telemetry without promising fixed performance gains.',
      },
      es: {
        title: 'FPS y telemetria',
        description:
          'Preset para ajustar limite de FPS y telemetria basica sin prometer mejora fija.',
      },
    },
  },
  {
    id: 'safe-competitive-config',
    category: 'tournament_safe',
    commandIds: [
      'cl-radar-always-centered-0',
      'cl-radar-rotate-0',
      'cl-radar-scale-05',
      'cl-hud-radar-scale-12',
      'cl-radar-icon-scale-min-1',
      'hud-scaling-085',
      'cl-showloadout-1',
      'viewmodel-fov-68',
      'viewmodel-offset-x-25',
      'viewmodel-offset-y-1',
      'viewmodel-offset-z-n15',
      'fps-max-0',
      'r-show-build-info-0',
      'bind-mwheelup-jump',
      'bind-mwheeldown-jump',
    ],
    locales: {
      'pt-br': {
        title: 'Config competitiva segura',
        description:
          'Preset sem sv_cheats e sem automacao arriscada, focado em comandos client-side comuns.',
      },
      en: {
        title: 'Safe competitive config',
        description:
          'No-sv_cheats baseline with common client-side commands and no risky automation.',
      },
      es: {
        title: 'Config competitiva segura',
        description:
          'Preset sin sv_cheats y sin automatizaciones riesgosas, enfocado en comandos cliente.',
      },
    },
  },
  {
    id: 'fun-private-server',
    category: 'fun',
    commandIds: [
      'sv-cheats-1',
      'noclip',
      'sv-gravity-300',
      'sv-autobunnyhopping-1',
      'sv-enablebunnyhopping-1',
      'sv-airaccelerate-1000',
      'mp-respawn-on-death-ct-1',
      'mp-respawn-on-death-t-1',
      'mp-ignore-round-win-conditions-1',
      'god',
      'buddha',
      'host-timescale-05',
      'host-timescale-2',
    ],
    locales: {
      'pt-br': {
        title: 'Comandos divertidos para servidor privado',
        description:
          'Preset fun para lobby privado/local com variacoes de gravidade, respawn e tempo de jogo.',
      },
      en: {
        title: 'Fun private server commands',
        description:
          'Fun preset for private/local lobbies with gravity, respawn, and timescale-style experiments.',
      },
      es: {
        title: 'Comandos divertidos para servidor privado',
        description:
          'Preset fun para lobby privado/local con gravedad, respawn y pruebas de ritmo.',
      },
    },
  },
];

const presetById = new Map(cs2CommandPresets.map((preset) => [preset.id, preset]));

export const getCs2CommandPresetById = (id: string): Cs2CommandPreset | undefined =>
  presetById.get(id);

export const getCs2CommandPresetsByCategory = (
  category: Cs2CommandPresetCategory,
): Cs2CommandPreset[] => cs2CommandPresets.filter((preset) => preset.category === category);

export const getCommandsForPreset = (preset: Cs2CommandPreset) =>
  preset.commandIds
    .map((commandId) => getCs2CommandById(commandId))
    .filter((command): command is NonNullable<typeof command> => Boolean(command));

export const getPresetCommandText = (preset: Cs2CommandPreset): string =>
  getCommandsForPreset(preset)
    .map((command) => command.command)
    .join('\n');
