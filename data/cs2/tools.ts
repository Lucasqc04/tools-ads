import { localizePath, type AppLocale } from '@/lib/i18n/config';

export type Cs2ToolId =
  | 'cs2-practice-commands'
  | 'cs2-practice-config'
  | 'cs2-grenade-practice-commands'
  | 'cs2-smoke-practice-commands'
  | 'cs2-bot-commands'
  | 'cs2-radar-settings'
  | 'cs2-hud-commands'
  | 'cs2-hud-color'
  | 'cs2-viewmodel-generator'
  | 'cs2-fps-commands'
  | 'cs2-autoexec-generator'
  | 'cs2-competitive-config'
  | 'cs2-tournament-safe-config'
  | 'cs2-fun-commands';

export type Cs2ToolConfig = {
  id: Cs2ToolId;
  slugByLocale: Record<AppLocale, string>;
  softwareCategory:
    | 'UtilitiesApplication'
    | 'DeveloperApplication'
    | 'SportsApplication'
    | 'SecurityApplication';
};

export const cs2ToolConfigs: Cs2ToolConfig[] = [
  {
    id: 'cs2-practice-commands',
    slugByLocale: {
      'pt-br': 'comandos-de-treino-cs2',
      en: 'cs2-practice-commands',
      es: 'comandos-de-practica-cs2',
    },
    softwareCategory: 'UtilitiesApplication',
  },
  {
    id: 'cs2-practice-config',
    slugByLocale: {
      'pt-br': 'config-de-treino-cs2',
      en: 'cs2-practice-config',
      es: 'config-de-practica-cs2',
    },
    softwareCategory: 'UtilitiesApplication',
  },
  {
    id: 'cs2-grenade-practice-commands',
    slugByLocale: {
      'pt-br': 'comandos-granadas-cs2',
      en: 'cs2-grenade-practice-commands',
      es: 'comandos-granadas-cs2',
    },
    softwareCategory: 'UtilitiesApplication',
  },
  {
    id: 'cs2-smoke-practice-commands',
    slugByLocale: {
      'pt-br': 'comandos-smoke-cs2',
      en: 'cs2-smoke-practice-commands',
      es: 'comandos-smoke-cs2',
    },
    softwareCategory: 'UtilitiesApplication',
  },
  {
    id: 'cs2-bot-commands',
    slugByLocale: {
      'pt-br': 'comandos-bot-cs2',
      en: 'cs2-bot-commands',
      es: 'comandos-bots-cs2',
    },
    softwareCategory: 'UtilitiesApplication',
  },
  {
    id: 'cs2-radar-settings',
    slugByLocale: {
      'pt-br': 'configuracao-radar-cs2',
      en: 'cs2-radar-settings',
      es: 'configuracion-radar-cs2',
    },
    softwareCategory: 'UtilitiesApplication',
  },
  {
    id: 'cs2-hud-commands',
    slugByLocale: {
      'pt-br': 'comandos-hud-cs2',
      en: 'cs2-hud-commands',
      es: 'comandos-hud-cs2',
    },
    softwareCategory: 'UtilitiesApplication',
  },
  {
    id: 'cs2-hud-color',
    slugByLocale: {
      'pt-br': 'mudar-cor-hud-cs2',
      en: 'cs2-hud-color',
      es: 'color-hud-cs2',
    },
    softwareCategory: 'UtilitiesApplication',
  },
  {
    id: 'cs2-viewmodel-generator',
    slugByLocale: {
      'pt-br': 'gerador-viewmodel-cs2',
      en: 'cs2-viewmodel-generator',
      es: 'generador-viewmodel-cs2',
    },
    softwareCategory: 'UtilitiesApplication',
  },
  {
    id: 'cs2-fps-commands',
    slugByLocale: {
      'pt-br': 'comandos-fps-cs2',
      en: 'cs2-fps-commands',
      es: 'comandos-fps-cs2',
    },
    softwareCategory: 'UtilitiesApplication',
  },
  {
    id: 'cs2-autoexec-generator',
    slugByLocale: {
      'pt-br': 'gerador-autoexec-cs2',
      en: 'cs2-autoexec-generator',
      es: 'generador-autoexec-cs2',
    },
    softwareCategory: 'UtilitiesApplication',
  },
  {
    id: 'cs2-competitive-config',
    slugByLocale: {
      'pt-br': 'config-competitiva-cs2',
      en: 'cs2-competitive-config',
      es: 'config-competitiva-cs2',
    },
    softwareCategory: 'UtilitiesApplication',
  },
  {
    id: 'cs2-tournament-safe-config',
    slugByLocale: {
      'pt-br': 'config-campeonato-cs2',
      en: 'cs2-tournament-safe-config',
      es: 'config-torneo-cs2',
    },
    softwareCategory: 'UtilitiesApplication',
  },
  {
    id: 'cs2-fun-commands',
    slugByLocale: {
      'pt-br': 'comandos-divertidos-cs2',
      en: 'cs2-fun-commands',
      es: 'comandos-divertidos-cs2',
    },
    softwareCategory: 'UtilitiesApplication',
  },
];

const cs2ToolById = new Map(cs2ToolConfigs.map((item) => [item.id, item]));

const cs2ToolByAnySlug = new Map<string, Cs2ToolId>(
  cs2ToolConfigs.flatMap((item) =>
    Object.values(item.slugByLocale).map((slug) => [slug, item.id] as const),
  ),
);

export const cs2ToolIds = cs2ToolConfigs.map((item) => item.id);

export const isCs2ToolId = (value: string): value is Cs2ToolId =>
  cs2ToolById.has(value as Cs2ToolId);

export const getCs2ToolConfigById = (id: Cs2ToolId): Cs2ToolConfig => {
  const value = cs2ToolById.get(id);

  if (!value) {
    throw new Error(`Missing CS2 tool config for id: ${id}`);
  }

  return value;
};

export const getCs2ToolIdBySlug = (slug: string): Cs2ToolId | undefined =>
  cs2ToolByAnySlug.get(slug);

export const getCs2ToolSlugForLocale = (id: Cs2ToolId, locale: AppLocale): string =>
  getCs2ToolConfigById(id).slugByLocale[locale];

export const getCs2ToolBasePathForLocale = (id: Cs2ToolId, locale: AppLocale): string =>
  `/tools/${getCs2ToolSlugForLocale(id, locale)}`;

export const getCs2ToolPathForLocale = (id: Cs2ToolId, locale: AppLocale): string =>
  localizePath(locale, getCs2ToolBasePathForLocale(id, locale));

export const getCs2ToolLocalePathMap = (id: Cs2ToolId): Record<AppLocale, string> => ({
  'pt-br': getCs2ToolPathForLocale(id, 'pt-br'),
  en: getCs2ToolPathForLocale(id, 'en'),
  es: getCs2ToolPathForLocale(id, 'es'),
});

export const getCs2ToolCanonicalBasePathByLocale = (
  id: Cs2ToolId,
): Record<AppLocale, string> => ({
  'pt-br': getCs2ToolBasePathForLocale(id, 'pt-br'),
  en: getCs2ToolBasePathForLocale(id, 'en'),
  es: getCs2ToolBasePathForLocale(id, 'es'),
});
