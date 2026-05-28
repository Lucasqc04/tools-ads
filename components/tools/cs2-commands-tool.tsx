'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  cs2Commands,
  cs2CommandCategories,
  type Cs2Command,
} from '@/data/cs2/commands';
import {
  cs2CommandPresets,
  getPresetCommandText,
} from '@/data/cs2/command-presets';
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
  getCommandCategoryLabel,
} from '@/lib/cs2/commands';

type Cs2CommandsToolProps = {
  locale?: AppLocale;
  toolId: Cs2ToolId;
};

const buildPresetFilename = (id: string) => `${id}.cfg`;

const toCfgText = (lines: string): string =>
  ['// LucasQC Tools - CS2 Config', '// Generated locally in your browser', '', lines, '', ''].join(
    '\n',
  );

const downloadTextFile = (filename: string, content: string) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

const warningToneClassByLevel: Record<Cs2Command['warningLevel'], string> = {
  none: 'text-slate-700',
  info: 'text-slate-700',
  caution: 'text-amber-800',
  danger: 'text-rose-700',
};

const warningBadgeClassByLevel: Record<Cs2Command['warningLevel'], string> = {
  none: 'border-slate-200 bg-slate-100 text-slate-700',
  info: 'border-slate-200 bg-slate-100 text-slate-700',
  caution: 'border-amber-300 bg-amber-100 text-amber-900',
  danger: 'border-rose-300 bg-rose-100 text-rose-800',
};

export function Cs2CommandsTool({ locale = 'pt-br', toolId }: Cs2CommandsToolProps) {
  const content = getCs2ToolContent(toolId, locale);
  const ui = cs2SharedUiCopyByLocale[locale];
  const config = getCs2ToolUiConfig(toolId);

  const [filters, setFilters] = useState({
    ...defaultCs2CommandFilters,
    safeOnly: config.showOnlySafeByDefault,
    localOnly: config.showOnlyLocalByDefault,
    recommendedOnly: config.showOnlyRecommendedByDefault,
  });
  const [copiedCommandId, setCopiedCommandId] = useState<string>('');
  const [copiedPresetId, setCopiedPresetId] = useState<string>('');

  const availableCategories = useMemo(
    () => cs2CommandCategories.filter((category) => config.commandCategories.includes(category)),
    [config.commandCategories],
  );

  const filteredCommands = useMemo(
    () => filterCs2Commands(cs2Commands, filters, config.commandCategories, locale),
    [config.commandCategories, filters, locale],
  );

  const visiblePresets = useMemo(
    () => cs2CommandPresets.filter((preset) => config.presetCategories.includes(preset.category)),
    [config.presetCategories],
  );

  const handleCopyCommand = async (command: Cs2Command) => {
    try {
      await navigator.clipboard.writeText(command.command);
      setCopiedCommandId(command.id);
      window.setTimeout(() => {
        setCopiedCommandId((current) => (current === command.id ? '' : current));
      }, 1500);
    } catch {
      setCopiedCommandId('');
    }
  };

  const handleCopyPreset = async (presetId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPresetId(presetId);
      window.setTimeout(() => {
        setCopiedPresetId((current) => (current === presetId ? '' : current));
      }, 1500);
    } catch {
      setCopiedPresetId('');
    }
  };

  return (
    <Card className="space-y-6">
      <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
        <h3 className="text-base font-semibold">{ui.safetyTitle}</h3>
        <p className="mt-1 text-sm leading-6">{ui.safetyText}</p>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label className="space-y-2 xl:col-span-2">
          <span className="text-sm font-semibold text-slate-800">{ui.searchLabel}</span>
          <Input
            value={filters.query}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                query: event.target.value,
              }))
            }
            placeholder={ui.searchPlaceholder}
          />
        </label>

        <label className="space-y-2 md:max-w-xs">
          <span className="text-sm font-semibold text-slate-800">{ui.categoryLabel}</span>
          <Select
            value={filters.category}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                category: event.target.value as typeof current.category,
              }))
            }
          >
            <option value="">{ui.categoryAll}</option>
            {availableCategories.map((category) => (
              <option key={category} value={category}>
                {getCommandCategoryLabel(category, locale)}
              </option>
            ))}
          </Select>
        </label>
      </section>

      <section className="grid gap-2 sm:grid-cols-2">
        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={filters.safeOnly}
            onChange={(event) =>
              setFilters((current) => ({ ...current, safeOnly: event.target.checked }))
            }
          />
          <span>{ui.safeOnlyLabel}</span>
        </label>

        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={filters.localOnly}
            onChange={(event) =>
              setFilters((current) => ({ ...current, localOnly: event.target.checked }))
            }
          />
          <span>{ui.localOnlyLabel}</span>
        </label>

        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={filters.requiresSvCheatsOnly}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                requiresSvCheatsOnly: event.target.checked,
              }))
            }
          />
          <span>{ui.svCheatsLabel}</span>
        </label>

        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={filters.needsValidationOnly}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                needsValidationOnly: event.target.checked,
              }))
            }
          />
          <span>{ui.needsValidationLabel}</span>
        </label>

        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={filters.recommendedOnly}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                recommendedOnly: event.target.checked,
              }))
            }
          />
          <span>{ui.recommendedLabel}</span>
        </label>
      </section>

      <p className="text-sm text-slate-700">
        <strong className="text-slate-900">{filteredCommands.length}</strong> {ui.resultsLabel}
      </p>

      {filteredCommands.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {ui.emptyState}
        </p>
      ) : null}

      <section className="space-y-3" aria-live="polite">
        {filteredCommands.map((command) => {
          const localized = command.locales[locale];
          const warningBadgeLabel =
            command.warningLevel === 'danger'
              ? ui.dangerBadge
              : command.warningLevel === 'caution'
                ? ui.cautionBadge
                : null;

          return (
            <article key={command.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <header className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-slate-900">{localized.name}</h3>
                  <p className="text-xs text-slate-600">
                    {getCommandCategoryLabel(command.category, locale)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1 text-[11px] font-semibold">
                  {command.safeForOfficialServers ? (
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-emerald-700">
                      {ui.safeBadge}
                    </span>
                  ) : null}
                  {command.localOnly ? (
                    <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-1 text-slate-700">
                      {ui.localBadge}
                    </span>
                  ) : null}
                  {command.requiresSvCheats ? (
                    <span className="rounded-full border border-amber-200 bg-amber-100 px-2 py-1 text-amber-900">
                      {ui.svCheatsBadge}
                    </span>
                  ) : null}
                  {warningBadgeLabel ? (
                    <span
                      className={`rounded-full border px-2 py-1 ${warningBadgeClassByLevel[command.warningLevel]}`}
                    >
                      {warningBadgeLabel}
                    </span>
                  ) : null}
                </div>
              </header>

              <p className="mt-2 text-sm leading-6 text-slate-700">{localized.description}</p>

              <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  {ui.commandLabel}
                </p>
                <pre className="mt-1 overflow-x-auto whitespace-pre-wrap break-all rounded bg-white p-2 font-mono text-xs text-slate-900">
                  {command.command}
                </pre>
                <Button
                  variant="secondary"
                  className="mt-2 w-full sm:w-auto"
                  onClick={() => {
                    void handleCopyCommand(command);
                  }}
                >
                  {copiedCommandId === command.id ? ui.copiedCommand : ui.copyCommand}
                </Button>
              </div>

              {localized.exampleUse ? (
                <p className="mt-2 text-xs text-slate-600">
                  <strong className="text-slate-800">{ui.exampleLabel}:</strong> {localized.exampleUse}
                </p>
              ) : null}

              {localized.warning ? (
                <p className={`mt-2 text-xs ${warningToneClassByLevel[command.warningLevel]}`}>
                  <strong>{ui.warningTitle}:</strong> {localized.warning}
                </p>
              ) : null}
            </article>
          );
        })}
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900">{ui.presetTitle}</h3>

        <div className="grid gap-3 md:grid-cols-2">
          {visiblePresets.map((preset) => {
            const presetText = getPresetCommandText(preset);
            const localized = preset.locales[locale];
            const cfgText = toCfgText(presetText);

            return (
              <article key={preset.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <h4 className="text-base font-semibold text-slate-900">{localized.title}</h4>
                <p className="mt-1 text-sm leading-6 text-slate-700">{localized.description}</p>
                <pre className="mt-3 max-h-40 overflow-auto whitespace-pre-wrap break-all rounded bg-slate-50 p-2 font-mono text-xs text-slate-900">
                  {presetText}
                </pre>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      void handleCopyPreset(preset.id, presetText);
                    }}
                  >
                    {copiedPresetId === preset.id ? ui.copiedPreset : ui.copyPreset}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      void handleCopyPreset(`${preset.id}-cfg`, cfgText);
                    }}
                  >
                    {copiedPresetId === `${preset.id}-cfg` ? ui.copiedCfg : ui.copyCfg}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => downloadTextFile(buildPresetFilename(preset.id), cfgText)}
                  >
                    {ui.downloadCfg}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        <h3 className="text-base font-semibold text-slate-900">{content.h1}</h3>
        <p className="mt-1 leading-6">{content.intro}</p>
      </section>
    </Card>
  );
}
