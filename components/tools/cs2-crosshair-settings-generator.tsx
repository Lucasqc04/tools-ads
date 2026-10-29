'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Cs2CrosshairCodesUiCopy } from '@/data/content/cs2-crosshair-codes';
import type { AppLocale } from '@/lib/i18n/config';
import { trackEvent, TOOL_ID } from '@/lib/analytics';

const valveUpdateNotesUrl = 'https://store.steampowered.com/news/posts/?appids=730';

export function Cs2CrosshairSettingsGenerator({
  locale,
  copy,
}: Readonly<{ locale: AppLocale; copy: Cs2CrosshairCodesUiCopy }>) {
  const [values, setValues] = useState({ thickness: '1', length: '8', gap: '4' });
  const [copied, setCopied] = useState(false);
  const hasStartedRef = useRef(false);

  const commands = [
    `cl_crosshair_thickness ${values.thickness}`,
    `cl_crosshair_length ${values.length}`,
    `cl_crosshair_gap ${values.gap}`,
  ].join('\n');
  const hasValidValues = Object.values(values).every((value) => {
    if (!value.trim()) return false;
    const parsed = Number(value);
    return Number.isFinite(parsed) && Number.isInteger(parsed);
  }) && Number(values.thickness) > 0 && Number(values.length) > 0;

  const markStarted = () => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      trackEvent('tool_started', { tool: TOOL_ID.cs2CrosshairCodes, locale });
    }
  };

  const updateValue = (field: keyof typeof values, value: string) => {
    markStarted();
    setCopied(false);
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleCopy = async () => {
    if (!hasValidValues) return;
    markStarted();

    try {
      await navigator.clipboard.writeText(commands);
      setCopied(true);
      trackEvent('tool_completed', { tool: TOOL_ID.cs2CrosshairCodes, locale });
      trackEvent('result_copied', {
        tool: TOOL_ID.cs2CrosshairCodes,
        locale,
        field: 'crosshair_settings',
      });
    } catch {
      setCopied(false);
      trackEvent('tool_error', {
        tool: TOOL_ID.cs2CrosshairCodes,
        locale,
        error_type: 'processing_failed',
        action: 'copy',
      });
    }
  };

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
      <header className="space-y-1">
        <h3 className="text-base font-semibold text-slate-900">{copy.pixelGeneratorTitle}</h3>
        <p className="text-sm leading-6 text-slate-700">{copy.pixelGeneratorHelp}</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{copy.thicknessLabel}</span>
          <Input
            type="number"
            min={1}
            step={1}
            value={values.thickness}
            onChange={(event) => updateValue('thickness', event.target.value)}
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{copy.lengthLabel}</span>
          <Input
            type="number"
            min={1}
            step={1}
            value={values.length}
            onChange={(event) => updateValue('length', event.target.value)}
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{copy.gapLabel}</span>
          <Input
            type="number"
            step={1}
            value={values.gap}
            onChange={(event) => updateValue('gap', event.target.value)}
          />
        </label>
      </div>

      <pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-900">
        {commands}
      </pre>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" onClick={handleCopy} disabled={!hasValidValues}>
          {copied ? copy.copiedSettings : copy.copySettings}
        </Button>
        <a
          href={valveUpdateNotesUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-brand-700 underline underline-offset-2"
        >
          {copy.officialUpdateLink}
        </a>
      </div>

      <p className="text-xs leading-5 text-slate-600">{copy.gapHelp}</p>
    </section>
  );
}
