'use client';

import { useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SearchableSelect } from '@/components/ui/searchable-select';
import type { AppLocale } from '@/lib/i18n/config';
import { trackEvent, TOOL_ID } from '@/lib/analytics';
import {
  type IdMode,
  type UuidVersion,
  generateCuid2List,
  generateKsuidList,
  generateNanoIdList,
  generateObjectIdList,
  generateUlidList,
  generateUuidList,
  getNanoDefaultAlphabet,
  getUuidNamespaceDns,
  idsToCsv,
  idsToTxt,
} from '@/lib/id-generator';

type UuidNanoIdGeneratorToolProps = Readonly<{ locale?: AppLocale }>;

type UuidUi = {
  localNote: string;
  modeLabel: string;
  uuidVersionLabel: string;
  uuidNamespaceLabel: string;
  uuidNameLabel: string;
  amountLabel: string;
  nanoLengthLabel: string;
  nanoAlphabetLabel: string;
  shortLengthWarning: string;
  deterministicUuidWarning: string;
  generate: string;
  regenerate: string;
  copyAll: string;
  copied: string;
  clearList: string;
  copyLineBreakLabel: string;
  generatedIds: string;
  copy: string;
  exportTxt: string;
  exportCsv: string;
  modeHintByMode: Record<IdMode, string>;
  modeLabelByMode: Record<IdMode, string>;
  uuidVersionLabelByVersion: Record<UuidVersion, string>;
};

const uiByLocale: Record<AppLocale, UuidUi> = {
  'pt-br': {
    localNote: 'Geracao local no navegador, sem login e sem backend obrigatorio.',
    modeLabel: 'Tipo de ID',
    uuidVersionLabel: 'Versao UUID',
    uuidNamespaceLabel: 'Namespace UUID (v3/v5)',
    uuidNameLabel: 'Nome UUID (v3/v5)',
    amountLabel: 'Quantidade',
    nanoLengthLabel: 'Tamanho NanoID',
    nanoAlphabetLabel: 'Alfabeto NanoID',
    shortLengthWarning: 'Tamanhos muito pequenos aumentam risco de colisao.',
    deterministicUuidWarning: 'UUID v3/v5 usa namespace+nome. Sem mudar nome, o resultado sera deterministico.',
    generate: 'Gerar IDs',
    regenerate: 'Gerar novamente',
    copyAll: 'Copiar todos',
    copied: 'Copiado',
    clearList: 'Limpar lista',
    copyLineBreakLabel: 'Copiar com quebra de linha',
    generatedIds: 'IDs gerados',
    copy: 'Copiar',
    exportTxt: 'Exportar TXT',
    exportCsv: 'Exportar CSV',
    modeHintByMode: {
      uuid: 'UUID com suporte a versoes v1, v3, v4, v5, v6 e v7.',
      nanoid: 'NanoID com tamanho e alfabeto customizavel.',
      ulid: 'ULID ordenavel por tempo, util para banco e logs.',
      ksuid: 'KSUID com timestamp embutido para ordenacao cronologica.',
      cuid2: 'CUID2 para IDs amigaveis, curtos e resistentes a colisao.',
      objectid: 'ObjectId estilo MongoDB (24 chars hex) com timestamp no prefixo.',
    },
    modeLabelByMode: {
      uuid: 'UUID',
      nanoid: 'NanoID',
      ulid: 'ULID',
      ksuid: 'KSUID',
      cuid2: 'CUID2',
      objectid: 'ObjectId',
    },
    uuidVersionLabelByVersion: {
      v1: 'UUID v1 (time-based)',
      v3: 'UUID v3 (namespace + nome, MD5)',
      v4: 'UUID v4 (aleatorio)',
      v5: 'UUID v5 (namespace + nome, SHA-1)',
      v6: 'UUID v6 (time-ordered)',
      v7: 'UUID v7 (unix time + random)',
    },
  },
  en: {
    localNote: 'Local generation in your browser, no login and no mandatory backend.',
    modeLabel: 'ID type',
    uuidVersionLabel: 'UUID version',
    uuidNamespaceLabel: 'UUID namespace (v3/v5)',
    uuidNameLabel: 'UUID name (v3/v5)',
    amountLabel: 'Amount',
    nanoLengthLabel: 'NanoID length',
    nanoAlphabetLabel: 'NanoID alphabet',
    shortLengthWarning: 'Very short length increases collision risk.',
    deterministicUuidWarning: 'UUID v3/v5 is namespace+name based. Without changing name, output stays deterministic.',
    generate: 'Generate IDs',
    regenerate: 'Generate again',
    copyAll: 'Copy all',
    copied: 'Copied',
    clearList: 'Clear list',
    copyLineBreakLabel: 'Copy with line breaks',
    generatedIds: 'Generated IDs',
    copy: 'Copy',
    exportTxt: 'Export TXT',
    exportCsv: 'Export CSV',
    modeHintByMode: {
      uuid: 'UUID with versions v1, v3, v4, v5, v6, and v7.',
      nanoid: 'NanoID with custom length and alphabet.',
      ulid: 'ULID, lexicographically sortable by time.',
      ksuid: 'KSUID with embedded timestamp for chronological sorting.',
      cuid2: 'CUID2 for short, collision-resistant IDs.',
      objectid: 'MongoDB-style ObjectId (24 hex chars) with timestamp prefix.',
    },
    modeLabelByMode: {
      uuid: 'UUID',
      nanoid: 'NanoID',
      ulid: 'ULID',
      ksuid: 'KSUID',
      cuid2: 'CUID2',
      objectid: 'ObjectId',
    },
    uuidVersionLabelByVersion: {
      v1: 'UUID v1 (time-based)',
      v3: 'UUID v3 (namespace + name, MD5)',
      v4: 'UUID v4 (random)',
      v5: 'UUID v5 (namespace + name, SHA-1)',
      v6: 'UUID v6 (time-ordered)',
      v7: 'UUID v7 (unix time + random)',
    },
  },
  es: {
    localNote: 'Generacion local en el navegador, sin login y sin backend obligatorio.',
    modeLabel: 'Tipo de ID',
    uuidVersionLabel: 'Version UUID',
    uuidNamespaceLabel: 'Namespace UUID (v3/v5)',
    uuidNameLabel: 'Nombre UUID (v3/v5)',
    amountLabel: 'Cantidad',
    nanoLengthLabel: 'Longitud NanoID',
    nanoAlphabetLabel: 'Alfabeto NanoID',
    shortLengthWarning: 'Longitudes muy pequenas aumentan riesgo de colision.',
    deterministicUuidWarning: 'UUID v3/v5 depende de namespace+nombre. Sin cambiar nombre, el resultado es determinista.',
    generate: 'Generar IDs',
    regenerate: 'Generar nuevamente',
    copyAll: 'Copiar todos',
    copied: 'Copiado',
    clearList: 'Limpiar lista',
    copyLineBreakLabel: 'Copiar con salto de linea',
    generatedIds: 'IDs generados',
    copy: 'Copiar',
    exportTxt: 'Exportar TXT',
    exportCsv: 'Exportar CSV',
    modeHintByMode: {
      uuid: 'UUID con versiones v1, v3, v4, v5, v6 y v7.',
      nanoid: 'NanoID con longitud y alfabeto personalizable.',
      ulid: 'ULID ordenable por tiempo para logs y base de datos.',
      ksuid: 'KSUID con timestamp embebido para orden cronologico.',
      cuid2: 'CUID2 para IDs cortos y resistentes a colisiones.',
      objectid: 'ObjectId estilo MongoDB (24 hex) con timestamp al inicio.',
    },
    modeLabelByMode: {
      uuid: 'UUID',
      nanoid: 'NanoID',
      ulid: 'ULID',
      ksuid: 'KSUID',
      cuid2: 'CUID2',
      objectid: 'ObjectId',
    },
    uuidVersionLabelByVersion: {
      v1: 'UUID v1 (basado en tiempo)',
      v3: 'UUID v3 (namespace + nombre, MD5)',
      v4: 'UUID v4 (aleatorio)',
      v5: 'UUID v5 (namespace + nombre, SHA-1)',
      v6: 'UUID v6 (ordenado por tiempo)',
      v7: 'UUID v7 (unix time + random)',
    },
  },
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

export function UuidNanoIdGeneratorTool({ locale = 'pt-br' }: UuidNanoIdGeneratorToolProps) {
  const ui = uiByLocale[locale];

  const [mode, setMode] = useState<IdMode>('uuid');
  const [uuidVersion, setUuidVersion] = useState<UuidVersion>('v4');
  const [uuidNamespace, setUuidNamespace] = useState(getUuidNamespaceDns());
  const [uuidName, setUuidName] = useState('adtools-id');
  const [amount, setAmount] = useState('10');
  const [nanoLength, setNanoLength] = useState('21');
  const [alphabet, setAlphabet] = useState(getNanoDefaultAlphabet());
  const [lineBreakCopy, setLineBreakCopy] = useState(true);
  const [ids, setIds] = useState<string[]>([]);
  const [copied, setCopied] = useState('');
  const [warning, setWarning] = useState('');
  const hasStartedRef = useRef(false);

  const amountNumber = Number(amount);
  const nanoLengthNumber = Number(nanoLength);

  const smallLengthWarning = mode === 'nanoid' && Number.isFinite(nanoLengthNumber) && nanoLengthNumber < 8;
  const usesUuidName = mode === 'uuid' && (uuidVersion === 'v3' || uuidVersion === 'v5');

  const modeHint = useMemo(() => ui.modeHintByMode[mode], [mode, ui.modeHintByMode]);
  const copyAllLabel = copied === 'all' ? ui.copied : ui.copyAll;

  const generateIds = () => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      trackEvent('tool_started', { tool: TOOL_ID.uuidNanoidGenerator, locale });
    }

    setWarning('');

    const count = amountNumber || 1;

    if (mode === 'uuid') {
      const generated = generateUuidList(count, {
        version: uuidVersion,
        namespace: uuidNamespace,
        name: uuidName,
      });

      setIds(generated.ids);

      if (generated.warning) {
        setWarning(generated.warning);
      }

      trackEvent('tool_completed', {
        tool: TOOL_ID.uuidNanoidGenerator,
        locale,
        id_mode: mode,
        uuid_version: uuidVersion,
        count,
      });

      return;
    }

    if (mode === 'nanoid') {
      setIds(generateNanoIdList(count, nanoLengthNumber || 21, alphabet));
      trackEvent('tool_completed', { tool: TOOL_ID.uuidNanoidGenerator, locale, id_mode: mode, count });
      return;
    }

    if (mode === 'ulid') {
      setIds(generateUlidList(count));
      trackEvent('tool_completed', { tool: TOOL_ID.uuidNanoidGenerator, locale, id_mode: mode, count });
      return;
    }

    if (mode === 'ksuid') {
      setIds(generateKsuidList(count));
      trackEvent('tool_completed', { tool: TOOL_ID.uuidNanoidGenerator, locale, id_mode: mode, count });
      return;
    }

    if (mode === 'cuid2') {
      setIds(generateCuid2List(count));
      trackEvent('tool_completed', { tool: TOOL_ID.uuidNanoidGenerator, locale, id_mode: mode, count });
      return;
    }

    setIds(generateObjectIdList(count));
    trackEvent('tool_completed', { tool: TOOL_ID.uuidNanoidGenerator, locale, id_mode: mode, count });
  };

  const copyValue = async (key: string, value: string, field: string) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(''), 1300);
      trackEvent('result_copied', { tool: TOOL_ID.uuidNanoidGenerator, locale, field });
    } catch {
      setCopied('');
    }
  };

  return (
    <Card className="space-y-5">
      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        {ui.localNote}
      </section>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{ui.modeLabel}</span>
          <SearchableSelect
            value={mode}
            onValueChange={(nextValue) => {
              setMode(nextValue as IdMode);
              trackEvent('mode_selected', { tool: TOOL_ID.uuidNanoidGenerator, locale, id_mode: nextValue });
            }}
            options={[
              { value: 'uuid', label: ui.modeLabelByMode.uuid, keywords: ['guid', 'rfc4122'] },
              { value: 'nanoid', label: ui.modeLabelByMode.nanoid, keywords: ['id curto', 'custom alphabet'] },
              { value: 'ulid', label: ui.modeLabelByMode.ulid, keywords: ['ordenavel', 'lexicographic'] },
              { value: 'ksuid', label: ui.modeLabelByMode.ksuid, keywords: ['sortable', 'timestamp'] },
              { value: 'cuid2', label: ui.modeLabelByMode.cuid2, keywords: ['collision resistant'] },
              { value: 'objectid', label: ui.modeLabelByMode.objectid, keywords: ['mongodb', 'bson'] },
            ]}
            searchPlaceholder="Buscar tipo de id..."
            noResultsText="Nenhum tipo encontrado."
          />
        </label>

        {mode === 'uuid' ? (
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.uuidVersionLabel}</span>
            <SearchableSelect
              value={uuidVersion}
              onValueChange={(nextValue) => {
                setUuidVersion(nextValue as UuidVersion);
                trackEvent('mode_selected', {
                  tool: TOOL_ID.uuidNanoidGenerator,
                  locale,
                  id_mode: 'uuid',
                  uuid_version: nextValue,
                });
              }}
              options={[
                { value: 'v1', label: ui.uuidVersionLabelByVersion.v1, keywords: ['timestamp', 'mac'] },
                { value: 'v3', label: ui.uuidVersionLabelByVersion.v3, keywords: ['md5', 'deterministico'] },
                { value: 'v4', label: ui.uuidVersionLabelByVersion.v4, keywords: ['random'] },
                { value: 'v5', label: ui.uuidVersionLabelByVersion.v5, keywords: ['sha1', 'deterministico'] },
                { value: 'v6', label: ui.uuidVersionLabelByVersion.v6, keywords: ['ordered time'] },
                { value: 'v7', label: ui.uuidVersionLabelByVersion.v7, keywords: ['unix time', 'ordered'] },
              ]}
              searchPlaceholder="Buscar versao UUID..."
              noResultsText="Nenhuma versao encontrada."
            />
          </label>
        ) : null}

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">
            {ui.amountLabel}
          </span>
          <Input value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="numeric" />
        </label>
      </div>

      {usesUuidName ? (
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.uuidNamespaceLabel}</span>
            <Input value={uuidNamespace} onChange={(event) => setUuidNamespace(event.target.value)} className="font-mono text-xs" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.uuidNameLabel}</span>
            <Input value={uuidName} onChange={(event) => setUuidName(event.target.value)} className="font-mono text-xs" />
          </label>
        </div>
      ) : null}

      {mode === 'nanoid' ? (
        <>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">
                {ui.nanoLengthLabel}
              </span>
              <Input value={nanoLength} onChange={(event) => setNanoLength(event.target.value)} inputMode="numeric" />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">
                {ui.nanoAlphabetLabel}
              </span>
              <Input value={alphabet} onChange={(event) => setAlphabet(event.target.value)} className="font-mono text-xs" />
            </label>
          </div>

          {smallLengthWarning ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
              {ui.shortLengthWarning}
            </p>
          ) : null}
        </>
      ) : null}

      {usesUuidName ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
          {ui.deterministicUuidWarning}
        </p>
      ) : null}

      {warning ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
          {warning}
        </p>
      ) : null}

      <p className="text-sm text-slate-600">{modeHint}</p>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={generateIds}>
          {ui.generate}
        </Button>
        <Button variant="secondary" onClick={generateIds}>
          {ui.regenerate}
        </Button>
        <Button variant="secondary" onClick={() => copyValue('all', idsToTxt(ids, lineBreakCopy), 'id_list')}>
          {copyAllLabel}
        </Button>
        <Button variant="ghost" onClick={() => setIds([])}>
          {ui.clearList}
        </Button>
      </div>

      <label className="inline-flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={lineBreakCopy} onChange={(event) => setLineBreakCopy(event.target.checked)} />
        {ui.copyLineBreakLabel}
      </label>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          onClick={() => {
            downloadTextFile('ids.txt', idsToTxt(ids, true));
            trackEvent('result_downloaded', { tool: TOOL_ID.uuidNanoidGenerator, locale, format: 'txt' });
          }}
        >
          {ui.exportTxt}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            downloadTextFile('ids.csv', idsToCsv(ids), 'text/csv;charset=utf-8');
            trackEvent('result_downloaded', { tool: TOOL_ID.uuidNanoidGenerator, locale, format: 'csv' });
          }}
        >
          {ui.exportCsv}
        </Button>
      </div>

      <section className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-semibold text-slate-800">
          {ui.generatedIds} ({ids.length})
        </h3>
        <ul className="max-h-72 space-y-2 overflow-auto text-xs text-slate-700">
          {ids.map((id, index) => (
            <li key={`${id}-${index}`} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-2">
              <span className="truncate font-mono">{id}</span>
              <Button variant="ghost" onClick={() => copyValue(`item-${index}`, id, 'id')}>
                {copied === `item-${index}` ? ui.copied : ui.copy}
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </Card>
  );
}
