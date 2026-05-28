'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  getCharacterCounterModes,
  getCharacterCounterPresets,
  getCharacterCounterUiCopy,
} from '@/data/content/character-counter';
import type { AppLocale } from '@/lib/i18n/config';
import {
  analyzeText,
  evaluateLimit,
  splitTextByLimit,
  textTransforms,
  toCamelCase,
  toConstantCase,
  toPascalCase,
  toSnakeCase,
  type CharacterCounterMode,
  type CharacterCounterPreset,
  type CharacterCounterPresetId,
  type CounterAnalysis,
  type LimitStatus,
} from '@/lib/character-counter';

type CharacterCounterToolProps = Readonly<{
  locale?: AppLocale;
}>;

const draftStorageKey = 'character-counter-draft-v1';

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const sec = seconds % 60;

  if (mins <= 0) {
    return `${sec}s`;
  }

  return `${mins}m ${sec.toString().padStart(2, '0')}s`;
};

const toCsv = (entries: Array<{ key: string; value: string | number }>): string =>
  ['metric,value', ...entries.map((entry) => `${entry.key},"${String(entry.value).replaceAll('"', '""')}"`)].join('\n');

const getStatusDetail = (
  status: LimitStatus,
  labels: {
    ideal: string;
    over: string;
    short: string;
    near: string;
    ok: string;
  },
): string => {
  if (status === 'ideal') {
    return labels.ideal;
  }

  if (status === 'over-limit') {
    return labels.over;
  }

  if (status === 'too-short') {
    return labels.short;
  }

  if (status === 'near-limit') {
    return labels.near;
  }

  return labels.ok;
};

const getProgressClass = (status: LimitStatus): string => {
  if (status === 'over-limit') {
    return 'h-full bg-red-500';
  }

  if (status === 'ideal') {
    return 'h-full bg-emerald-500';
  }

  if (status === 'near-limit') {
    return 'h-full bg-amber-500';
  }

  return 'h-full bg-slate-500';
};

const buildSmartAlerts = (analysis: CounterAnalysis, fallback: string): string[] => {
  const alerts: string[] = [];

  if (analysis.repeatedWords.length > 0) {
    alerts.push(`Palavra repetida em excesso: ${analysis.repeatedWords[0].word} (${analysis.repeatedWords[0].count}x)`);
  }
  if (analysis.longSentences > 0) {
    alerts.push(`${analysis.longSentences} frase(s) muito longa(s)`);
  }
  if (analysis.longParagraphs > 0) {
    alerts.push(`${analysis.longParagraphs} paragrafo(s) muito longo(s)`);
  }
  if (analysis.invisibleCharacters.zeroWidthSpace > 0 || analysis.invisibleCharacters.zeroWidthJoiner > 0) {
    alerts.push('Caracteres invisiveis detectados no texto');
  }
  if (analysis.metrics.urls > 0) {
    alerts.push(`${analysis.metrics.urls} link(s) detectado(s)`);
  }
  if (analysis.metrics.emojis > 0) {
    alerts.push(`${analysis.metrics.emojis} emoji(s) detectado(s)`);
  }

  if (alerts.length === 0) {
    alerts.push(fallback);
  }

  return alerts;
};

const downloadTextFile = (filename: string, content: string, mimeType = 'text/plain;charset=utf-8') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

export function CharacterCounterTool({ locale = 'pt-br' }: CharacterCounterToolProps) {
  const copy = getCharacterCounterUiCopy(locale);
  const modes = getCharacterCounterModes(locale);
  const presets = getCharacterCounterPresets(locale);

  const [text, setText] = useState('');
  const [mode, setMode] = useState<CharacterCounterMode>('simple');
  const [presetId, setPresetId] = useState<CharacterCounterPresetId>('general');
  const [customMaxTarget, setCustomMaxTarget] = useState('');
  const [splitLimit, setSplitLimit] = useState('280');
  const [splitNumbered, setSplitNumbered] = useState(true);
  const [splitOutput, setSplitOutput] = useState<string[]>([]);
  const [copiedText, setCopiedText] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  const selectedPreset = useMemo<CharacterCounterPreset | undefined>(
    () => presets.find((preset) => preset.id === presetId),
    [presetId, presets],
  );

  const effectivePreset = useMemo<CharacterCounterPreset | undefined>(() => {
    if (customMaxTarget.trim()) {
      const parsed = Number(customMaxTarget);
      if (Number.isFinite(parsed) && parsed > 0) {
        return {
          id: 'general',
          mode,
          label: 'custom',
          max: Math.floor(parsed),
        };
      }
    }

    return selectedPreset;
  }, [customMaxTarget, mode, selectedPreset]);

  const analysis = useMemo(() => analyzeText(text), [text]);
  const limit = useMemo(
    () => evaluateLimit(analysis.metrics.charactersWithSpaces, effectivePreset),
    [analysis.metrics.charactersWithSpaces, effectivePreset],
  );

  const smartAlerts = useMemo(
    () => buildSmartAlerts(analysis, copy.statusDetailOk),
    [analysis, copy.statusDetailOk],
  );

  const exportEntries = useMemo(
    () => [
      { key: 'characters_with_spaces', value: analysis.metrics.charactersWithSpaces },
      { key: 'characters_without_spaces', value: analysis.metrics.charactersWithoutSpaces },
      { key: 'visual_characters', value: analysis.metrics.visualCharacters },
      { key: 'words', value: analysis.metrics.words },
      { key: 'unique_words', value: analysis.metrics.uniqueWords },
      { key: 'sentences', value: analysis.metrics.sentences },
      { key: 'paragraphs', value: analysis.metrics.paragraphs },
      { key: 'lines', value: analysis.metrics.lines },
      { key: 'emojis', value: analysis.metrics.emojis },
      { key: 'hashtags', value: analysis.metrics.hashtags },
      { key: 'mentions', value: analysis.metrics.mentions },
      { key: 'urls', value: analysis.metrics.urls },
      { key: 'emails', value: analysis.metrics.emails },
      { key: 'phones', value: analysis.metrics.phones },
      { key: 'bytes_utf8', value: analysis.metrics.bytesUtf8 },
    ],
    [analysis],
  );

  useEffect(() => {
    const stored = globalThis.localStorage?.getItem(draftStorageKey);
    if (!stored) {
      return;
    }

    setText(stored);
  }, []);

  const copyFullText = async () => {
    if (!text) {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(true);
      globalThis.setTimeout(() => setCopiedText(false), 1300);
    } catch {
      setCopiedText(false);
    }
  };

  const saveDraft = () => {
    globalThis.localStorage?.setItem(draftStorageKey, text);
    setDraftSaved(true);
    globalThis.setTimeout(() => setDraftSaved(false), 1300);
  };

  const loadDraft = () => {
    const stored = globalThis.localStorage?.getItem(draftStorageKey);
    if (!stored) {
      return;
    }

    setText(stored);
  };

  const applyTransform = (transform: (value: string) => string) => {
    setText((current) => transform(current));
  };

  const onSplit = () => {
    const parsed = Number(splitLimit);
    const limitPerPart = Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 280;
    setSplitOutput(splitTextByLimit(text, limitPerPart, splitNumbered));
  };

  const statusDetailText = getStatusDetail(limit.status, {
    ideal: copy.statusDetailIdeal,
    over: copy.statusDetailOver,
    short: copy.statusDetailShort,
    near: copy.statusDetailNear,
    ok: copy.statusDetailOk,
  });

  return (
    <Card className="space-y-6">
      <section className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <h3 className="text-base font-semibold text-emerald-900">{copy.privacyTitle}</h3>
        <p className="text-sm leading-6 text-emerald-900">{copy.privacyText}</p>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{copy.modeLabel}</span>
          <Select
            value={mode}
            onChange={(event) => setMode(event.target.value as CharacterCounterMode)}
          >
            {modes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </Select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{copy.presetLabel}</span>
          <Select
            value={presetId}
            onChange={(event) => setPresetId(event.target.value as CharacterCounterPresetId)}
          >
            {presets
              .filter((preset) => preset.mode === mode || preset.id === 'general')
              .map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.label}
                </option>
              ))}
          </Select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{copy.targetLabel}</span>
          <Input
            value={customMaxTarget}
            onChange={(event) => setCustomMaxTarget(event.target.value)}
            placeholder={copy.targetPlaceholder}
            inputMode="numeric"
          />
        </label>
      </section>

      <label className="space-y-2">
        <span className="text-sm font-semibold text-slate-800">{copy.textInputLabel}</span>
        <Textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={copy.textInputPlaceholder}
          className="min-h-[240px]"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => setText('')}>
          {copy.clearText}
        </Button>
        <Button variant="secondary" onClick={copyFullText}>
          {copiedText ? copy.copiedText : copy.copyText}
        </Button>
        <Button variant="secondary" onClick={saveDraft}>
          {draftSaved ? copy.draftSaved : copy.saveDraft}
        </Button>
        <Button variant="ghost" onClick={loadDraft}>
          {copy.loadDraft}
        </Button>
        <Button variant="ghost" onClick={() => downloadTextFile('texto.txt', text)}>
          {copy.exportTxt}
        </Button>
        <Button
          variant="ghost"
          onClick={() => downloadTextFile('metricas.json', JSON.stringify({ analysis }, null, 2), 'application/json')}
        >
          {copy.exportJson}
        </Button>
        <Button variant="ghost" onClick={() => downloadTextFile('metricas.csv', toCsv(exportEntries), 'text/csv')}>
          {copy.exportCsv}
        </Button>
      </div>

      <section className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-base font-semibold text-slate-900">{copy.metricsTitle}</h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">Caracteres: <strong>{analysis.metrics.charactersWithSpaces}</strong></div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">Sem espacos: <strong>{analysis.metrics.charactersWithoutSpaces}</strong></div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">Visuais: <strong>{analysis.metrics.visualCharacters}</strong></div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">Palavras: <strong>{analysis.metrics.words}</strong></div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">Unicas: <strong>{analysis.metrics.uniqueWords}</strong></div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">Frases: <strong>{analysis.metrics.sentences}</strong></div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">Paragrafos: <strong>{analysis.metrics.paragraphs}</strong></div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">Linhas: <strong>{analysis.metrics.lines}</strong></div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">Emojis: <strong>{analysis.metrics.emojis}</strong></div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">Hashtags: <strong>{analysis.metrics.hashtags}</strong></div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">Mencoes: <strong>{analysis.metrics.mentions}</strong></div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">Links: <strong>{analysis.metrics.urls}</strong></div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">Bytes UTF-8: <strong>{analysis.metrics.bytesUtf8}</strong></div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">Leitura: <strong>{formatDuration(analysis.metrics.readingTimeSeconds)}</strong></div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">Fala: <strong>{formatDuration(analysis.metrics.speakingTimeSeconds)}</strong></div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">Status limite: <strong>{copy.statusByLimit[limit.status]}</strong></div>
        </div>

        <div className="space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className={getProgressClass(limit.status)}
              style={{ width: `${Math.min(Math.max(limit.progressPercent, 0), 100)}%` }}
            />
          </div>
          <p className="text-xs text-slate-600">{statusDetailText}</p>
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-base font-semibold text-slate-900">{copy.qualityTitle}</h3>
        <p className="text-sm text-slate-700">Frases longas: <strong>{analysis.longSentences}</strong> | Paragrafos longos: <strong>{analysis.longParagraphs}</strong></p>
        <p className="text-sm text-slate-700">Linhas vazias: <strong>{analysis.programming.emptyLines}</strong> | Linhas comentario: <strong>{analysis.programming.commentLines}</strong> | Tabs: <strong>{analysis.programming.tabCount}</strong></p>
      </section>

      <section className="grid gap-3 lg:grid-cols-2">
        <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="text-base font-semibold text-slate-900">{copy.topWordsTitle}</h3>
          <div className="max-h-56 overflow-auto">
            {analysis.topWords.length === 0 ? (
              <p className="text-sm text-slate-600">-</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-1">Palavra</th>
                    <th className="py-1">Qtd</th>
                    <th className="py-1">%</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.topWords.map((item) => (
                    <tr key={item.word} className="border-b border-slate-100">
                      <td className="py-1">{item.word}</td>
                      <td className="py-1">{item.count}</td>
                      <td className="py-1">{item.percentage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="text-base font-semibold text-slate-900">{copy.alertsTitle}</h3>
          <ul className="space-y-1 text-sm text-slate-700">
            {smartAlerts.map((alert) => (
              <li key={alert}>- {alert}</li>
            ))}
          </ul>
          <p className="text-xs text-slate-500">Zero-width: {analysis.invisibleCharacters.zeroWidthSpace} | ZWJ: {analysis.invisibleCharacters.zeroWidthJoiner} | NBSP: {analysis.invisibleCharacters.nonBreakingSpace}</p>
        </section>
      </section>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-base font-semibold text-slate-900">{copy.transformsTitle}</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" onClick={() => applyTransform(textTransforms.removeDuplicateSpaces)}>Remover espacos duplos</Button>
          <Button variant="ghost" onClick={() => applyTransform(textTransforms.removeLineBreaks)}>Remover quebras</Button>
          <Button variant="ghost" onClick={() => applyTransform(textTransforms.trimEachLine)}>Trim por linha</Button>
          <Button variant="ghost" onClick={() => applyTransform(textTransforms.removeAccents)}>Remover acentos</Button>
          <Button variant="ghost" onClick={() => applyTransform(textTransforms.removeEmojis)}>Remover emojis</Button>
          <Button variant="ghost" onClick={() => applyTransform(textTransforms.removeLinks)}>Remover links</Button>
          <Button variant="ghost" onClick={() => applyTransform(textTransforms.toUpperCase)}>MAIUSCULO</Button>
          <Button variant="ghost" onClick={() => applyTransform(textTransforms.toLowerCase)}>minusculo</Button>
          <Button variant="ghost" onClick={() => applyTransform(textTransforms.titleCase)}>Title Case</Button>
          <Button variant="ghost" onClick={() => applyTransform(textTransforms.toSlug)}>slug</Button>
          <Button variant="ghost" onClick={() => applyTransform(toSnakeCase)}>snake_case</Button>
          <Button variant="ghost" onClick={() => applyTransform(toCamelCase)}>camelCase</Button>
          <Button variant="ghost" onClick={() => applyTransform(toPascalCase)}>PascalCase</Button>
          <Button variant="ghost" onClick={() => applyTransform(toConstantCase)}>CONSTANT_CASE</Button>
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-base font-semibold text-slate-900">{copy.splitResultTitle}</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{copy.splitLimitLabel}</span>
            <Input value={splitLimit} onChange={(event) => setSplitLimit(event.target.value)} inputMode="numeric" />
          </label>

          <label className="flex items-end gap-2 text-sm text-slate-700 md:pb-2">
            <input
              type="checkbox"
              checked={splitNumbered}
              onChange={(event) => setSplitNumbered(event.target.checked)}
            />
            <span>{copy.splitNumberedLabel}</span>
          </label>

          <div className="flex items-end md:pb-1">
            <Button variant="secondary" onClick={onSplit}>
              {copy.splitText}
            </Button>
          </div>
        </div>

        {splitOutput.length > 0 ? (
          <Textarea readOnly value={splitOutput.join('\n\n')} className="min-h-[180px]" />
        ) : null}
      </section>
    </Card>
  );
}
