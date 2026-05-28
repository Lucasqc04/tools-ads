'use client';

import { useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { cs2CommandCategories, type Cs2Command, type Cs2CommandCategory } from '@/data/cs2/commands';
import type {
  Cs2CommandPreset,
  Cs2CommandPresetCategory,
} from '@/data/cs2/command-presets';
import { getCommandsForPreset, getPresetCommandText } from '@/data/cs2/command-presets';
import type { Cs2SharedUiCopy } from '@/data/content/cs2-tools';
import type { AppLocale } from '@/lib/i18n/config';
import { getCommandCategoryLabel, type Cs2CommandFilters } from '@/lib/cs2/commands';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/cn';
import { buildCs2AutoexecFiles } from '@/lib/cs2/autoexec';

const writeClipboard = async (value: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
};

export function CopyButton({
  value,
  label,
  copiedLabel,
  className,
}: {
  value: string;
  label: string;
  copiedLabel: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    if (!(await writeClipboard(value))) {
      return;
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <Button variant="secondary" onClick={onCopy} className={className}>
      {copied ? copiedLabel : label}
    </Button>
  );
}

export function DownloadCfgButton({
  filename,
  content,
  label,
  className,
}: {
  filename: string;
  content: string;
  label: string;
  className?: string;
}) {
  const onDownload = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = filename;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="ghost" onClick={onDownload} className={className}>
      {label}
    </Button>
  );
}

export function Cs2SafetyBadge({ command, copy }: { command: Cs2Command; copy: Cs2SharedUiCopy }) {
  const badge = command.warningLevel === 'danger'
    ? copy.dangerBadge
    : command.warningLevel === 'caution'
      ? copy.cautionBadge
      : command.requiresSvCheats
        ? copy.svCheatsBadge
        : command.localOnly
          ? copy.localBadge
          : copy.safeBadge;

  const tone =
    command.warningLevel === 'danger'
      ? 'border-rose-300 bg-rose-50 text-rose-700'
      : command.warningLevel === 'caution'
        ? 'border-amber-300 bg-amber-50 text-amber-800'
        : command.requiresSvCheats || command.localOnly
          ? 'border-sky-300 bg-sky-50 text-sky-800'
          : 'border-emerald-300 bg-emerald-50 text-emerald-700';

  return <span className={cn('rounded-full border px-2 py-1 text-xs font-semibold', tone)}>{badge}</span>;
}

export function Cs2CommandWarning({
  text,
  title,
}: {
  text?: string;
  title: string;
}) {
  if (!text) {
    return null;
  }

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">
      <strong className="mr-1">{title}:</strong>
      {text}
    </div>
  );
}

export function Cs2CommandCard({
  command,
  locale,
  copy,
}: {
  command: Cs2Command;
  locale: AppLocale;
  copy: Cs2SharedUiCopy;
}) {
  const localized = command.locales[locale];

  return (
    <article className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold text-slate-900">{localized.name}</h4>
        <Cs2SafetyBadge command={command} copy={copy} />
      </header>

      <p className="text-sm leading-6 text-slate-700">{localized.description}</p>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="mb-2 text-xs font-semibold text-slate-700">{copy.commandLabel}</p>
        <pre className="overflow-x-auto break-all whitespace-pre-wrap font-mono text-xs text-slate-900">
          {command.command}
        </pre>
      </div>

      {localized.exampleUse ? (
        <p className="text-xs text-slate-600">
          <strong className="text-slate-800">{copy.exampleLabel}:</strong> {localized.exampleUse}
        </p>
      ) : null}

      <Cs2CommandWarning text={localized.warning} title={copy.warningTitle} />

      <CopyButton value={command.command} label={copy.copyCommand} copiedLabel={copy.copiedCommand} />
    </article>
  );
}

export function Cs2CommandSearch({
  value,
  onChange,
  copy,
}: {
  value: string;
  onChange: (value: string) => void;
  copy: Cs2SharedUiCopy;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-semibold text-slate-800">{copy.searchLabel}</span>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={copy.searchPlaceholder}
      />
    </label>
  );
}

export function Cs2CommandFilters({
  filters,
  categories,
  locale,
  copy,
  onChange,
}: {
  filters: Cs2CommandFilters;
  categories: Cs2CommandCategory[];
  locale: AppLocale;
  copy: Cs2SharedUiCopy;
  onChange: (next: Cs2CommandFilters) => void;
}) {
  const onToggle = (field: keyof Cs2CommandFilters) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange({
        ...filters,
        [field]: event.target.checked,
      });
    };

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{copy.categoryLabel}</span>
          <Select
            value={filters.category}
            onChange={(event) =>
              onChange({
                ...filters,
                category: event.target.value as '' | Cs2CommandCategory,
              })
            }
          >
            <option value="">{copy.categoryAll}</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {getCommandCategoryLabel(category, locale)}
              </option>
            ))}
          </Select>
        </label>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={filters.safeOnly} onChange={onToggle('safeOnly')} />
          <span>{copy.safeOnlyLabel}</span>
        </label>

        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={filters.localOnly} onChange={onToggle('localOnly')} />
          <span>{copy.localOnlyLabel}</span>
        </label>

        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={filters.requiresSvCheatsOnly}
            onChange={onToggle('requiresSvCheatsOnly')}
          />
          <span>{copy.svCheatsLabel}</span>
        </label>

        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={filters.needsValidationOnly}
            onChange={onToggle('needsValidationOnly')}
          />
          <span>{copy.needsValidationLabel}</span>
        </label>

        <label className="inline-flex items-center gap-2 text-sm text-slate-700 sm:col-span-2">
          <input
            type="checkbox"
            checked={filters.recommendedOnly}
            onChange={onToggle('recommendedOnly')}
          />
          <span>{copy.recommendedLabel}</span>
        </label>
      </div>
    </div>
  );
}

export function Cs2CommandList({
  commands,
  locale,
  copy,
}: {
  commands: Cs2Command[];
  locale: AppLocale;
  copy: Cs2SharedUiCopy;
}) {
  if (!commands.length) {
    return <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{copy.emptyState}</p>;
  }

  return (
    <div className="grid gap-3">
      {commands.map((command) => (
        <Cs2CommandCard key={command.id} command={command} locale={locale} copy={copy} />
      ))}
    </div>
  );
}

export function Cs2PresetCard({
  preset,
  locale,
  copy,
}: {
  preset: Cs2CommandPreset;
  locale: AppLocale;
  copy: Cs2SharedUiCopy;
}) {
  const localized = preset.locales[locale];
  const commandText = getPresetCommandText(preset);
  const preview = getCommandsForPreset(preset).slice(0, 8);

  return (
    <article className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <header>
        <h4 className="text-base font-semibold text-slate-900">{localized.title}</h4>
        <p className="mt-1 text-sm leading-6 text-slate-700">{localized.description}</p>
      </header>

      <pre className="max-h-52 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-900">
        {preview.map((item) => item.command).join('\n')}
      </pre>

      <div className="flex flex-wrap gap-2">
        <CopyButton value={commandText} label={copy.copyPreset} copiedLabel={copy.copiedPreset} />
        <DownloadCfgButton
          filename={`${preset.id}.cfg`}
          content={`${commandText}\n`}
          label={copy.downloadCfg}
        />
      </div>
    </article>
  );
}

export function Cs2PresetGenerator({
  title,
  presets,
  locale,
  copy,
}: {
  title: string;
  presets: Cs2CommandPreset[];
  locale: AppLocale;
  copy: Cs2SharedUiCopy;
}) {
  if (!presets.length) {
    return null;
  }

  return (
    <section className="space-y-3">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <div className="grid gap-3 md:grid-cols-2">
        {presets.map((preset) => (
          <Cs2PresetCard key={preset.id} preset={preset} locale={locale} copy={copy} />
        ))}
      </div>
    </section>
  );
}

export function Cs2ConfigPreview({
  title,
  filename,
  content,
  copy,
}: {
  title: string;
  filename: string;
  content: string;
  copy: Cs2SharedUiCopy;
}) {
  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <Textarea value={content} readOnly className="min-h-[220px] font-mono text-xs" />
      <div className="flex flex-wrap gap-2">
        <CopyButton value={content} label={copy.copyCfg} copiedLabel={copy.copiedCfg} />
        <DownloadCfgButton filename={filename} content={content} label={copy.downloadCfg} />
      </div>
    </section>
  );
}

export function Cs2RadarGenerator({ copy }: { copy: Cs2SharedUiCopy }) {
  const [radarScale, setRadarScale] = useState('0.5');
  const [hudScale, setHudScale] = useState('1.2');
  const [alwaysCentered, setAlwaysCentered] = useState('0');
  const [rotate, setRotate] = useState('0');
  const [iconScale, setIconScale] = useState('1');

  const output = useMemo(
    () =>
      [
        `cl_radar_scale ${radarScale}`,
        `cl_hud_radar_scale ${hudScale}`,
        `cl_radar_always_centered ${alwaysCentered}`,
        `cl_radar_rotate ${rotate}`,
        `cl_radar_icon_scale_min ${iconScale}`,
      ].join('\n'),
    [alwaysCentered, hudScale, iconScale, radarScale, rotate],
  );

  return (
    <Card className="space-y-3">
      <h3 className="text-base font-semibold text-slate-900">Radar Generator</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input value={radarScale} onChange={(event) => setRadarScale(event.target.value)} />
        <Input value={hudScale} onChange={(event) => setHudScale(event.target.value)} />
        <Select value={alwaysCentered} onChange={(event) => setAlwaysCentered(event.target.value)}>
          <option value="0">always centered 0</option>
          <option value="1">always centered 1</option>
        </Select>
        <Select value={rotate} onChange={(event) => setRotate(event.target.value)}>
          <option value="0">rotate 0</option>
          <option value="1">rotate 1</option>
        </Select>
        <Input value={iconScale} onChange={(event) => setIconScale(event.target.value)} />
      </div>
      <Cs2ConfigPreview
        title={copy.generatedPreviewTitle}
        filename="radar.cfg"
        content={`${output}\n`}
        copy={copy}
      />
    </Card>
  );
}

const hudColorOptions = [
  { value: '0', label: 'default' },
  { value: '1', label: 'white' },
  { value: '2', label: 'light blue' },
  { value: '3', label: 'blue' },
  { value: '4', label: 'purple' },
  { value: '5', label: 'red' },
  { value: '6', label: 'orange' },
  { value: '7', label: 'yellow' },
  { value: '8', label: 'green' },
  { value: '9', label: 'aqua' },
  { value: '10', label: 'pink' },
];

export function Cs2HudColorGenerator({ copy }: { copy: Cs2SharedUiCopy }) {
  const [color, setColor] = useState('0');

  const output = `cl_hud_color ${color}`;

  return (
    <Card className="space-y-3">
      <h3 className="text-base font-semibold text-slate-900">HUD Color Generator</h3>
      <Select value={color} onChange={(event) => setColor(event.target.value)}>
        {hudColorOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.value} - {option.label}
          </option>
        ))}
      </Select>
      <Cs2ConfigPreview
        title={copy.generatedPreviewTitle}
        filename="hud-color.cfg"
        content={`${output}\n`}
        copy={copy}
      />
    </Card>
  );
}

export function Cs2ViewmodelGenerator({ copy }: { copy: Cs2SharedUiCopy }) {
  const [fov, setFov] = useState('68');
  const [x, setX] = useState('2.5');
  const [y, setY] = useState('1');
  const [z, setZ] = useState('-1.5');
  const [preset, setPreset] = useState('3');

  const output = useMemo(
    () =>
      [
        `viewmodel_fov ${fov}`,
        `viewmodel_offset_x ${x}`,
        `viewmodel_offset_y ${y}`,
        `viewmodel_offset_z ${z}`,
        `viewmodel_presetpos ${preset}`,
      ].join('\n'),
    [fov, preset, x, y, z],
  );

  return (
    <Card className="space-y-3">
      <h3 className="text-base font-semibold text-slate-900">Viewmodel Generator</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input value={fov} onChange={(event) => setFov(event.target.value)} />
        <Input value={x} onChange={(event) => setX(event.target.value)} />
        <Input value={y} onChange={(event) => setY(event.target.value)} />
        <Input value={z} onChange={(event) => setZ(event.target.value)} />
        <Select value={preset} onChange={(event) => setPreset(event.target.value)}>
          <option value="1">preset 1</option>
          <option value="2">preset 2</option>
          <option value="3">preset 3</option>
        </Select>
      </div>
      <Cs2ConfigPreview
        title={copy.generatedPreviewTitle}
        filename="viewmodel.cfg"
        content={`${output}\n`}
        copy={copy}
      />
    </Card>
  );
}

export function Cs2VolumeGenerator({ copy }: { copy: Cs2SharedUiCopy }) {
  const [volumePercent, setVolumePercent] = useState(45);

  const volume = (volumePercent / 100).toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
  const output = `volume ${volume}`;

  return (
    <Card className="space-y-3">
      <h3 className="text-base font-semibold text-slate-900">Volume Generator</h3>
      <Input
        type="range"
        min={0}
        max={100}
        value={volumePercent}
        onChange={(event) => setVolumePercent(Number(event.target.value))}
      />
      <p className="text-sm text-slate-700">{volumePercent}%</p>
      <Cs2ConfigPreview
        title={copy.generatedPreviewTitle}
        filename="audio.cfg"
        content={`${output}\n`}
        copy={copy}
      />
    </Card>
  );
}

export function Cs2FpsCommandGenerator({ copy }: { copy: Cs2SharedUiCopy }) {
  const [fpsMax, setFpsMax] = useState('0');
  const [fpsUi, setFpsUi] = useState('120');
  const [showFps, setShowFps] = useState('1');

  const output = useMemo(
    () => [`fps_max ${fpsMax}`, `fps_max_ui ${fpsUi}`, `cl_showfps ${showFps}`].join('\n'),
    [fpsMax, fpsUi, showFps],
  );

  return (
    <Card className="space-y-3">
      <h3 className="text-base font-semibold text-slate-900">FPS Generator</h3>
      <div className="grid gap-3 sm:grid-cols-3">
        <Select value={fpsMax} onChange={(event) => setFpsMax(event.target.value)}>
          {['0', '144', '165', '240', '300', '400'].map((option) => (
            <option key={option} value={option}>
              fps_max {option}
            </option>
          ))}
        </Select>
        <Select value={fpsUi} onChange={(event) => setFpsUi(event.target.value)}>
          {['60', '120'].map((option) => (
            <option key={option} value={option}>
              fps_max_ui {option}
            </option>
          ))}
        </Select>
        <Select value={showFps} onChange={(event) => setShowFps(event.target.value)}>
          {['0', '1', '2'].map((option) => (
            <option key={option} value={option}>
              cl_showfps {option}
            </option>
          ))}
        </Select>
      </div>
      <Cs2ConfigPreview
        title={copy.generatedPreviewTitle}
        filename="fps.cfg"
        content={`${output}\n`}
        copy={copy}
      />
    </Card>
  );
}

export function Cs2AutoexecGenerator({
  copy,
  generalCommandIds,
  practicePresetIds,
  funPresetIds,
}: {
  copy: Cs2SharedUiCopy;
  generalCommandIds: string[];
  practicePresetIds: string[];
  funPresetIds: string[];
}) {
  const files = useMemo(
    () =>
      buildCs2AutoexecFiles({
        generalCommandIds,
        practicePresetIds,
        funPresetIds,
      }),
    [funPresetIds, generalCommandIds, practicePresetIds],
  );

  return (
    <section className="space-y-3">
      <Cs2ConfigPreview title="autoexec.cfg" filename="autoexec.cfg" content={files.autoexec} copy={copy} />
      <Cs2ConfigPreview title="practice.cfg" filename="practice.cfg" content={files.practice} copy={copy} />
      <Cs2ConfigPreview title="fun.cfg" filename="fun.cfg" content={files.fun} copy={copy} />
    </section>
  );
}

export const getCs2CommandCategories = (): Cs2CommandCategory[] => cs2CommandCategories;

export const getCs2PresetCategories = (): Cs2CommandPresetCategory[] => [
  'practice',
  'smoke',
  'spray',
  'bots',
  'competitive',
  'tournament_safe',
  'fun',
];
