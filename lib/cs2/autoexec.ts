import {
  getCs2CommandById,
  type Cs2CommandCategory,
} from '@/data/cs2/commands';
import { getCs2CommandPresetById, getCommandsForPreset } from '@/data/cs2/command-presets';

export type Cs2AutoexecBuildInput = {
  generalCommandIds: string[];
  practicePresetIds: string[];
  funPresetIds: string[];
  additionalAutoexecLines?: string[];
};

const headerAutoexec = [
  '// LucasQC Tools - CS2 Autoexec',
  '// Generated locally in your browser',
  '',
];

const headerPractice = [
  '// LucasQC Tools - CS2 Practice Config',
  '// Generated locally in your browser',
  '// Local/private server commands may require sv_cheats 1',
  '',
];

const headerFun = [
  '// LucasQC Tools - CS2 Fun Config',
  '// Generated locally in your browser',
  '// Private/local server only - not for official competitive servers',
  '',
];

const dedupe = (lines: string[]): string[] => Array.from(new Set(lines.filter(Boolean)));

const commandById = (id: string): string | undefined => getCs2CommandById(id)?.command;

/**
 * One intentional baseline per client-side setting group. This avoids producing
 * an autoexec where several values for the same convar are written in sequence
 * and only the last one takes effect.
 */
const autoexecDefaultsByCategory: Partial<Record<Cs2CommandCategory, string[]>> = {
  radar: [
    'cl-radar-always-centered-0',
    'cl-radar-rotate-0',
    'cl-radar-scale-05',
    'cl-hud-radar-scale-12',
    'cl-radar-icon-scale-min-1',
    'cl-radar-square-with-scoreboard-1',
    'cl-teammate-colors-show-1',
  ],
  hud: [
    'hud-scaling-085',
    'cl-hud-color-0',
    'cl-showloadout-1',
    'cl-draw-only-deathnotices-0',
    'cl-hud-playercount-showcount-1',
    'cl-teamid-overhead-mode-2',
  ],
  viewmodel: [
    'viewmodel-fov-68',
    'viewmodel-offset-x-25',
    'viewmodel-offset-y-1',
    'viewmodel-offset-z-n15',
    'viewmodel-presetpos-3',
    'cl-prefer-lefthanded-0',
  ],
  fps: [
    'fps-max-0',
    'fps-max-ui-120',
    'cl-showfps-1',
    'cq-netgraph-1',
    'r-show-build-info-0',
    'cl-hud-telemetry-frametime-show-1',
    'cl-hud-telemetry-ping-show-1',
    'cl-hud-telemetry-net-misdelivery-show-1',
  ],
  audio: ['volume-045', 'voice-modenable-1', 'cl-mute-enemy-team-1'],
  binds: [
    'bind-mwheelup-jump',
    'bind-mwheeldown-jump',
    'bind-space-jump',
    'bind-c-slot8',
    'bind-x-slot7',
    'bind-z-slot6',
    'bind-h-switchhands',
  ],
};

export const getCs2AutoexecDefaultCommandIds = (
  categories: Iterable<Cs2CommandCategory>,
): string[] =>
  Array.from(categories).flatMap((category) => autoexecDefaultsByCategory[category] ?? []);

const collectPresetCommands = (presetIds: string[]): string[] => {
  const lines: string[] = [];

  presetIds.forEach((presetId) => {
    const preset = getCs2CommandPresetById(presetId);
    if (!preset) {
      return;
    }

    const commands = getCommandsForPreset(preset).map((item) => item.command);
    lines.push(...commands);
  });

  return lines;
};

const buildFile = (header: string[], lines: string[]): string =>
  [...header, ...dedupe(lines), '', 'host_writeconfig', ''].join('\n');

export const buildCs2AutoexecFiles = ({
  generalCommandIds,
  practicePresetIds,
  funPresetIds,
  additionalAutoexecLines = [],
}: Cs2AutoexecBuildInput): {
  autoexec: string;
  practice: string;
  fun: string;
} => {
  const autoexecCommands = generalCommandIds
    .map(commandById)
    .filter((value): value is string => Boolean(value));

  const practiceCommands = collectPresetCommands(practicePresetIds);
  const funCommands = collectPresetCommands(funPresetIds);

  return {
    autoexec: buildFile(headerAutoexec, [...autoexecCommands, ...additionalAutoexecLines]),
    practice: buildFile(headerPractice, practiceCommands),
    fun: buildFile(headerFun, funCommands),
  };
};
