'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { cs2Commands } from '@/data/cs2/commands';
import { cs2CommandPresets } from '@/data/cs2/command-presets';
import {
  cs2SharedUiCopyByLocale,
  getCs2ToolContent,
} from '@/data/content/cs2-tools';
import { getCs2ToolUiConfig } from '@/data/cs2/tool-ui-config';
import type { Cs2ToolId } from '@/data/cs2/tools';
import type { AppLocale } from '@/lib/i18n/config';
import {
  defaultCs2CommandFilters,
  filterCs2Commands,
} from '@/lib/cs2/commands';
import {
  Cs2AutoexecGenerator,
  Cs2CommandFilters,
  Cs2CommandList,
  Cs2CommandSearch,
  Cs2FpsCommandGenerator,
  Cs2HudColorGenerator,
  Cs2PresetGenerator,
  Cs2RadarGenerator,
  Cs2ViewmodelGenerator,
  Cs2VolumeGenerator,
} from '@/components/tools/cs2-shared-ui';

type Cs2ToolSuiteProps = {
  locale: AppLocale;
  toolId: Cs2ToolId;
};

export function Cs2ToolSuite({ locale, toolId }: Cs2ToolSuiteProps) {
  const copy = cs2SharedUiCopyByLocale[locale];
  const content = getCs2ToolContent(toolId, locale);
  const uiConfig = getCs2ToolUiConfig(toolId);

  const [filters, setFilters] = useState({
    ...defaultCs2CommandFilters,
    safeOnly: uiConfig.showOnlySafeByDefault,
    localOnly: uiConfig.showOnlyLocalByDefault,
    recommendedOnly: uiConfig.showOnlyRecommendedByDefault,
  });

  const filteredCommands = useMemo(
    () => filterCs2Commands(cs2Commands, filters, uiConfig.commandCategories, locale),
    [filters, locale, uiConfig.commandCategories],
  );

  const presetList = useMemo(
    () =>
      cs2CommandPresets.filter((preset) =>
        uiConfig.presetCategories.includes(preset.category),
      ),
    [uiConfig.presetCategories],
  );

  const recommendedSafeCommandIds = useMemo(
    () =>
      cs2Commands
        .filter(
          (command) =>
            uiConfig.commandCategories.includes(command.category) &&
            command.safeForOfficialServers,
        )
        .map((command) => command.id),
    [uiConfig.commandCategories],
  );

  const practicePresetIds = useMemo(
    () =>
      cs2CommandPresets
        .filter((preset) => ['practice', 'smoke', 'spray', 'bots'].includes(preset.category))
        .map((preset) => preset.id),
    [],
  );

  const funPresetIds = useMemo(
    () =>
      cs2CommandPresets
        .filter((preset) => preset.category === 'fun')
        .map((preset) => preset.id),
    [],
  );

  return (
    <div className="space-y-6">
      <Card className="space-y-3 border-amber-200 bg-amber-50">
        <h3 className="text-base font-semibold text-amber-900">{copy.safetyTitle}</h3>
        <p className="text-sm leading-6 text-amber-900">{copy.safetyText}</p>
      </Card>

      <Card className="space-y-4">
        <Cs2CommandSearch
          value={filters.query}
          onChange={(value) => setFilters((current) => ({ ...current, query: value }))}
          copy={copy}
        />

        <Cs2CommandFilters
          filters={filters}
          categories={uiConfig.commandCategories}
          locale={locale}
          copy={copy}
          onChange={(next) => setFilters(next)}
        />

        <p className="text-sm text-slate-600">
          <strong className="text-slate-900">{filteredCommands.length}</strong> {copy.resultsLabel}
        </p>

        <Cs2CommandList commands={filteredCommands} locale={locale} copy={copy} />
      </Card>

      <Cs2PresetGenerator
        title={copy.presetTitle}
        presets={presetList}
        locale={locale}
        copy={copy}
      />

      {uiConfig.showRadarGenerator ? <Cs2RadarGenerator copy={copy} /> : null}
      {uiConfig.showHudColorGenerator ? <Cs2HudColorGenerator copy={copy} /> : null}
      {uiConfig.showViewmodelGenerator ? <Cs2ViewmodelGenerator copy={copy} /> : null}
      {uiConfig.showFpsGenerator ? <Cs2FpsCommandGenerator copy={copy} /> : null}
      {uiConfig.showVolumeGenerator ? <Cs2VolumeGenerator copy={copy} /> : null}

      {uiConfig.showAutoexecGenerator ? (
        <Cs2AutoexecGenerator
          copy={copy}
          generalCommandIds={recommendedSafeCommandIds}
          practicePresetIds={practicePresetIds}
          funPresetIds={funPresetIds}
        />
      ) : null}
    </div>
  );
}
