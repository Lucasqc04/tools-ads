import type { Cs2Command, Cs2CommandCategory } from '@/data/cs2/commands';
import type { AppLocale } from '@/lib/i18n/config';

export type Cs2CommandFilters = {
  query: string;
  category: '' | Cs2CommandCategory;
  safeOnly: boolean;
  localOnly: boolean;
  requiresSvCheatsOnly: boolean;
  needsValidationOnly: boolean;
  recommendedOnly: boolean;
};

export const defaultCs2CommandFilters: Cs2CommandFilters = {
  query: '',
  category: '',
  safeOnly: false,
  localOnly: false,
  requiresSvCheatsOnly: false,
  needsValidationOnly: false,
  recommendedOnly: false,
};

export const isCommandRecommended = (
  command: Cs2Command,
  categories: Cs2CommandCategory[],
): boolean => categories.includes(command.category);

export const filterCs2Commands = (
  commands: Cs2Command[],
  filters: Cs2CommandFilters,
  categories: Cs2CommandCategory[],
  locale: AppLocale,
): Cs2Command[] => {
  const query = filters.query.trim().toLowerCase();

  return commands.filter((command) => {
    if (filters.category && command.category !== filters.category) {
      return false;
    }

    if (filters.safeOnly && !command.safeForOfficialServers) {
      return false;
    }

    if (filters.localOnly && !command.localOnly) {
      return false;
    }

    if (filters.requiresSvCheatsOnly && !command.requiresSvCheats) {
      return false;
    }

    if (filters.needsValidationOnly && !command.needsValidation) {
      return false;
    }

    if (filters.recommendedOnly && !isCommandRecommended(command, categories)) {
      return false;
    }

    if (!query) {
      return true;
    }

    const localized = command.locales[locale];
    const haystack = [
      command.command,
      command.category,
      localized.name,
      localized.description,
      localized.exampleUse,
      localized.warning,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(query);
  });
};

export const getCommandCategoryLabel = (category: Cs2CommandCategory, locale: AppLocale): string => {
  const labels: Record<Cs2CommandCategory, Record<AppLocale, string>> = {
    practice: { 'pt-br': 'Treino', en: 'Practice', es: 'Practica' },
    round: { 'pt-br': 'Round/Tempo', en: 'Round/Time', es: 'Ronda/Tiempo' },
    money: { 'pt-br': 'Dinheiro/Compra', en: 'Money/Buy', es: 'Dinero/Compra' },
    grenades: { 'pt-br': 'Granadas', en: 'Grenades', es: 'Granadas' },
    smokes: { 'pt-br': 'Smokes', en: 'Smokes', es: 'Smokes' },
    bots: { 'pt-br': 'Bots', en: 'Bots', es: 'Bots' },
    radar: { 'pt-br': 'Radar', en: 'Radar', es: 'Radar' },
    hud: { 'pt-br': 'HUD', en: 'HUD', es: 'HUD' },
    viewmodel: { 'pt-br': 'Viewmodel', en: 'Viewmodel', es: 'Viewmodel' },
    fps: { 'pt-br': 'FPS/Performance', en: 'FPS/Performance', es: 'FPS/Rendimiento' },
    audio: { 'pt-br': 'Audio/Voz', en: 'Audio/Voice', es: 'Audio/Voz' },
    binds: { 'pt-br': 'Binds', en: 'Binds', es: 'Binds' },
    autoexec: { 'pt-br': 'Autoexec', en: 'Autoexec', es: 'Autoexec' },
    competitive: { 'pt-br': 'Competitivo', en: 'Competitive', es: 'Competitivo' },
    fun: { 'pt-br': 'Fun/Privado', en: 'Fun/Private', es: 'Fun/Privado' },
    server: { 'pt-br': 'Servidor', en: 'Server', es: 'Servidor' },
    dangerous_or_not_recommended: {
      'pt-br': 'Nao recomendado',
      en: 'Not recommended',
      es: 'No recomendado',
    },
  };

  return labels[category][locale];
};
