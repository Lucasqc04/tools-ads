import { getCs2CommandById } from '@/data/cs2/commands';
import { getCs2CommandPresetById, getCommandsForPreset } from '@/data/cs2/command-presets';

export type Cs2AutoexecBuildInput = {
  generalCommandIds: string[];
  practicePresetIds: string[];
  funPresetIds: string[];
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
    autoexec: buildFile(headerAutoexec, autoexecCommands),
    practice: buildFile(headerPractice, practiceCommands),
    fun: buildFile(headerFun, funCommands),
  };
};
