'use client';

import { Button } from '@/components/ui/button';
import { ChoiceGroup, RangeField } from '@/components/tools/instagram-post-simulator/editor/editor-ui';
import { FILTER_LIMITS, FILTER_PRESETS, type FilterPresetId } from '@/lib/instagram-post-simulator/filters';
import type { SlideFilters } from '@/types/instagram-post-simulator';

export type FilterLabels = {
  filtersTitle: string;
  presets: Record<FilterPresetId, string>;
  brightness: string;
  contrast: string;
  saturation: string;
  applyFiltersToAll?: string;
};

type FilterControlsProps = Readonly<{
  filters: SlideFilters;
  onChange: (filters: SlideFilters) => void;
  onApplyAll?: () => void;
  labels: FilterLabels;
}>;

const presetIds: FilterPresetId[] = ['original', 'vivid', 'soft', 'mono', 'contrast'];

const sameFilters = (a: SlideFilters, b: SlideFilters) =>
  Math.abs(a.brightness - b.brightness) < 1e-6 && Math.abs(a.contrast - b.contrast) < 1e-6 && Math.abs(a.saturation - b.saturation) < 1e-6;

/** Predefinições e ajustes finos. A prévia usa CSS; o download aplica os mesmos valores pixel a pixel. */
export function FilterControls({ filters, onChange, onApplyAll, labels }: FilterControlsProps) {
  // Sem predefinição correspondente, nenhum botão aparece marcado: os ajustes finos são personalizados.
  const currentPreset = presetIds.find((id) => sameFilters(FILTER_PRESETS[id], filters)) ?? null;

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-slate-900">{labels.filtersTitle}</h4>
      <ChoiceGroup<FilterPresetId>
        legend={labels.filtersTitle}
        value={currentPreset}
        onChange={(id) => onChange(FILTER_PRESETS[id])}
        options={presetIds.map((id) => ({ value: id, label: labels.presets[id] }))}
        columns="grid-cols-2 sm:grid-cols-3"
      />
      <div className="space-y-4">
        <RangeField
          label={labels.brightness}
          {...FILTER_LIMITS.brightness}
          value={filters.brightness}
          onChange={(value) => onChange({ ...filters, brightness: value })}
        />
        <RangeField
          label={labels.contrast}
          {...FILTER_LIMITS.contrast}
          value={filters.contrast}
          onChange={(value) => onChange({ ...filters, contrast: value })}
        />
        <RangeField
          label={labels.saturation}
          {...FILTER_LIMITS.saturation}
          value={filters.saturation}
          onChange={(value) => onChange({ ...filters, saturation: value })}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {onApplyAll && labels.applyFiltersToAll ? (
          <Button variant="secondary" onClick={onApplyAll}>
            {labels.applyFiltersToAll}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
