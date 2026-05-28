'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { UniversalConversionLinks } from '@/components/tools/universal-conversion-links';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Textarea } from '@/components/ui/textarea';
import {
  toLocalizedUniversalConversionLink,
  universalConversionLandingPages,
} from '@/data/universal-converter-pages';
import type { AppLocale } from '@/lib/i18n/config';
import {
  convertBatchLines,
  convertById,
  convertToMultipleDestinations,
  detectInputType,
  exportBatchAsCsv,
  exportResultsAsJson,
  exportResultsAsTxt,
  filterUniversalConversions,
  getAllCaesarShiftAttempts,
  getUniversalConversionById,
  getUniversalPresetById,
  runConversionPipeline,
  type UniversalConversionId,
  type UniversalPresetId,
  universalConversions,
} from '@/lib/universal-converter';

type UniversalConverterToolProps = Readonly<{
  locale?: AppLocale;
  defaultConversionId?: UniversalConversionId;
  defaultPresetId?: UniversalPresetId;
  defaultInput?: string;
}>;

type UiText = {
  localNotice: string;
  sourceLabel: string;
  inputTypeLabel: string;
  outputTypeLabel: string;
  shiftLabel: string;
  keyLabel: string;
  convert: string;
  copy: string;
  copied: string;
  clear: string;
  applyPreset: string;
  runMultiOutput: string;
  batchMode: string;
  runBatch: string;
  pipelineMode: string;
  runPipeline: string;
  detection: string;
  result: string;
  multiResults: string;
  batchResults: string;
  pipelineResults: string;
  exportTxt: string;
  exportJson: string;
  exportCsv: string;
  allCategories: string;
  allPresets: string;
  dedicatedToolHint: string;
  outputRoutesTitle: string;
  outputRoutesDescription: string;
  inputRoutesTitle: string;
  inputRoutesDescription: string;
  invalidPipeline: string;
  lineByLine: string;
  caesarAttack: string;
  runCaesarAttack: string;
};

const uiByLocale: Record<AppLocale, UiText> = {
  'pt-br': {
    localNotice:
      'Processamento local no navegador sempre que possivel. Hashes sao irreversiveis e cifras classicas sao educativas.',
    sourceLabel: 'Entrada',
    inputTypeLabel: 'Tipo de entrada',
    outputTypeLabel: 'Tipo de saida',
    shiftLabel: 'Deslocamento (Cesar)',
    keyLabel: 'Chave (Vigenere)',
    convert: 'Converter',
    copy: 'Copiar',
    copied: 'Copiado',
    clear: 'Limpar',
    applyPreset: 'Aplicar preset',
    runMultiOutput: 'Gerar multiplos resultados',
    batchMode: 'Modo lote (uma linha por entrada)',
    runBatch: 'Executar lote',
    pipelineMode: 'Pipeline (ids separados por virgula)',
    runPipeline: 'Executar pipeline',
    detection: 'Deteccao de tipo de entrada',
    result: 'Resultado principal',
    multiResults: 'Resultados multiplos',
    batchResults: 'Resultado em lote',
    pipelineResults: 'Resultado do pipeline',
    exportTxt: 'Exportar TXT',
    exportJson: 'Exportar JSON',
    exportCsv: 'Exportar CSV',
    allCategories: 'Todas',
    allPresets: 'Sem preset',
    dedicatedToolHint: 'Existe ferramenta dedicada para este formato. Use a central para fluxo rapido e comparativo.',
    outputRoutesTitle: 'Paginas dinamicas da saida escolhida',
    outputRoutesDescription: 'Atalhos prontos para slugs dinamicos desta conversao.',
    inputRoutesTitle: 'Todas as paginas dinamicas desta entrada',
    inputRoutesDescription: 'Escolha qualquer variacao predefinida para esta entrada.',
    invalidPipeline: 'Pipeline invalido. Use ids separados por virgula.',
    lineByLine: 'linha',
    caesarAttack: 'Ataque de Cesar (tentar deslocamentos 1-25)',
    runCaesarAttack: 'Testar deslocamentos',
  },
  en: {
    localNotice:
      'Local in-browser processing whenever possible. Hashes are one-way and classic ciphers are educational.',
    sourceLabel: 'Input',
    inputTypeLabel: 'Input type',
    outputTypeLabel: 'Output type',
    shiftLabel: 'Shift (Caesar)',
    keyLabel: 'Key (Vigenere)',
    convert: 'Convert',
    copy: 'Copy',
    copied: 'Copied',
    clear: 'Clear',
    applyPreset: 'Apply preset',
    runMultiOutput: 'Generate multiple outputs',
    batchMode: 'Batch mode (one line per input)',
    runBatch: 'Run batch',
    pipelineMode: 'Pipeline (comma-separated ids)',
    runPipeline: 'Run pipeline',
    detection: 'Input type detection',
    result: 'Main result',
    multiResults: 'Multiple results',
    batchResults: 'Batch results',
    pipelineResults: 'Pipeline results',
    exportTxt: 'Export TXT',
    exportJson: 'Export JSON',
    exportCsv: 'Export CSV',
    allCategories: 'All',
    allPresets: 'No preset',
    dedicatedToolHint: 'A dedicated tool exists for this format. Use this hub for quick comparison workflows.',
    outputRoutesTitle: 'Dynamic pages for selected output',
    outputRoutesDescription: 'Direct links to dynamic slugs for this conversion.',
    inputRoutesTitle: 'All dynamic pages for this input',
    inputRoutesDescription: 'Choose any prebuilt variation for the selected input type.',
    invalidPipeline: 'Invalid pipeline. Use comma-separated ids.',
    lineByLine: 'line',
    caesarAttack: 'Caesar attack (test shifts 1-25)',
    runCaesarAttack: 'Test shifts',
  },
  es: {
    localNotice:
      'Procesamiento local en navegador cuando es posible. Hashes son unidireccionales y cifras clasicas son educativas.',
    sourceLabel: 'Entrada',
    inputTypeLabel: 'Tipo de entrada',
    outputTypeLabel: 'Tipo de salida',
    shiftLabel: 'Desplazamiento (Cesar)',
    keyLabel: 'Clave (Vigenere)',
    convert: 'Convertir',
    copy: 'Copiar',
    copied: 'Copiado',
    clear: 'Limpiar',
    applyPreset: 'Aplicar preset',
    runMultiOutput: 'Generar multiples salidas',
    batchMode: 'Modo lote (una linea por entrada)',
    runBatch: 'Ejecutar lote',
    pipelineMode: 'Pipeline (ids separados por coma)',
    runPipeline: 'Ejecutar pipeline',
    detection: 'Deteccion de tipo de entrada',
    result: 'Resultado principal',
    multiResults: 'Resultados multiples',
    batchResults: 'Resultado por lote',
    pipelineResults: 'Resultado del pipeline',
    exportTxt: 'Exportar TXT',
    exportJson: 'Exportar JSON',
    exportCsv: 'Exportar CSV',
    allCategories: 'Todas',
    allPresets: 'Sin preset',
    dedicatedToolHint: 'Existe herramienta dedicada para este formato. Usa esta central para flujo rapido y comparativo.',
    outputRoutesTitle: 'Paginas dinamicas de la salida elegida',
    outputRoutesDescription: 'Enlaces directos a slugs dinamicos de esta conversion.',
    inputRoutesTitle: 'Todas las paginas dinamicas de esta entrada',
    inputRoutesDescription: 'Elige cualquier variacion predefinida para esta entrada.',
    invalidPipeline: 'Pipeline invalido. Usa ids separados por coma.',
    lineByLine: 'linea',
    caesarAttack: 'Ataque de Cesar (probar desplazamientos 1-25)',
    runCaesarAttack: 'Probar desplazamientos',
  },
};

const PRESET_IDS: UniversalPresetId[] = [
  'all-hashes',
  'all-encodings',
  'all-bases',
  'all-classic-ciphers',
  'text-analysis-tech',
  'clean-for-url',
  'prepare-for-code',
  'caesar-all-shifts',
];

const downloadText = (filename: string, content: string): void => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export function UniversalConverterTool({
  locale = 'pt-br',
  defaultConversionId = 'text-to-binary',
  defaultPresetId,
  defaultInput = '',
}: UniversalConverterToolProps) {
  const ui = uiByLocale[locale];

  const defaultFromType =
    getUniversalConversionById(defaultConversionId)?.from ??
    universalConversions.find((item) => item.shouldAppearInUniversalTool)?.from ??
    'text';

  const [fromType, setFromType] = useState(defaultFromType);
  const [conversionId, setConversionId] = useState<UniversalConversionId>(defaultConversionId);
  const [input, setInput] = useState(defaultInput);
  const [shift, setShift] = useState('3');
  const [key, setKey] = useState('');
  const [result, setResult] = useState('');
  const [warning, setWarning] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [presetId, setPresetId] = useState<UniversalPresetId | ''>(defaultPresetId ?? '');
  const [multiResults, setMultiResults] = useState<Array<{ id: UniversalConversionId; title: string; output: string; ok: boolean; error?: string }>>([]);
  const [batchRows, setBatchRows] = useState<Array<{ line: string; output: string; ok: boolean; error?: string }>>([]);
  const [pipeline, setPipeline] = useState('');
  const [pipelineLog, setPipelineLog] = useState<Array<{ id: string; input: string; output: string; error?: string }>>([]);
  const [caesarAttempts, setCaesarAttempts] = useState<Array<{ shift: number; output: string }>>([]);

  const allVisibleConversions = useMemo(
    () => filterUniversalConversions('', 'all'),
    [],
  );

  const availableConversions = useMemo(
    () => allVisibleConversions.filter((item) => item.from === fromType),
    [allVisibleConversions, fromType],
  );

  useEffect(() => {
    if (availableConversions.some((item) => item.id === conversionId)) {
      return;
    }

    if (availableConversions.length > 0) {
      setConversionId(availableConversions[0].id);
    }
  }, [availableConversions, conversionId]);

  const inputTypeOptions = useMemo(() => {
    const uniqueFromTypes = Array.from(new Set(allVisibleConversions.map((item) => item.from)));
    const formatFromLabel = (value: string): string => {
      if (locale === 'pt-br') {
        const labels: Record<string, string> = {
          text: 'Texto',
          binary: 'Binario',
          decimal: 'Decimal',
          hexadecimal: 'Hexadecimal',
          morse: 'Morse',
          'url encoded': 'URL encoded',
          'json object': 'JSON objeto',
          'query string': 'Query string',
        };
        return labels[value] ?? value;
      }

      if (locale === 'es') {
        const labels: Record<string, string> = {
          text: 'Texto',
          binary: 'Binario',
          decimal: 'Decimal',
          hexadecimal: 'Hexadecimal',
          morse: 'Morse',
          'url encoded': 'URL encoded',
          'json object': 'JSON objeto',
          'query string': 'Query string',
        };
        return labels[value] ?? value;
      }

      const labels: Record<string, string> = {
        text: 'Text',
        binary: 'Binary',
        decimal: 'Decimal',
        hexadecimal: 'Hexadecimal',
        morse: 'Morse',
        'url encoded': 'URL encoded',
        'json object': 'JSON object',
        'query string': 'Query string',
      };
      return labels[value] ?? value;
    };

    return uniqueFromTypes.map((from) => ({
      value: from,
      label: formatFromLabel(from),
      keywords: [from],
    }));
  }, [allVisibleConversions, locale]);

  const conversionOptions = useMemo(
    () =>
      availableConversions.map((item) => ({
        value: item.id,
        label: item.labelByLocale[locale],
        keywords: item.searchTerms,
      })),
    [availableConversions, locale],
  );

  const presetOptions = useMemo(
    () => {
      const options: Array<{ value: string; label: string; keywords: string[] }> = [
        { value: '', label: ui.allPresets, keywords: ['none', 'sem', 'preset', 'default'] },
      ];

      for (const item of PRESET_IDS) {
        const preset = getUniversalPresetById(item);
        if (!preset) {
          continue;
        }

        options.push({
          value: item,
          label: preset.labelByLocale[locale],
          keywords: [item],
        });
      }

      return options;
    },
    [locale, ui.allPresets],
  );

  const selectedConversion = useMemo(
    () => getUniversalConversionById(conversionId),
    [conversionId],
  );

  const outputDynamicLinks = useMemo(
    () =>
      universalConversionLandingPages
        .filter((page) => page.conversionId === conversionId)
        .map((page) => toLocalizedUniversalConversionLink(page, locale)),
    [conversionId, locale],
  );

  const inputDynamicLinks = useMemo(() => {
    const possibleIds = new Set(availableConversions.map((item) => item.id));
    return universalConversionLandingPages
      .filter((page) => possibleIds.has(page.conversionId))
      .map((page) => toLocalizedUniversalConversionLink(page, locale));
  }, [availableConversions, locale]);

  const detection = useMemo(() => detectInputType(input), [input]);

  const options = useMemo(
    () => ({
      shift: Number.parseInt(shift, 10),
      key,
    }),
    [key, shift],
  );

  const handleConvert = async () => {
    const response = await convertById(conversionId, input, options);
    if (!response.ok) {
      setResult('');
      setError(response.error ?? 'Erro');
      setWarning('');
      return;
    }

    setResult(response.output);
    setError('');
    setWarning(response.warning ?? '');
    setCaesarAttempts([]);
  };

  const handleCopy = async () => {
    if (!result) {
      return;
    }

    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1100);
    } catch {
      setCopied(false);
    }
  };

  const handleApplyPreset = async () => {
    if (!presetId) {
      return;
    }

    const preset = getUniversalPresetById(presetId);
    if (!preset) {
      return;
    }

    const responses = await convertToMultipleDestinations(input, preset.destinationIds, options);
    setMultiResults(
      responses.map((item) => ({
        id: item.id,
        title: getUniversalConversionById(item.id)?.labelByLocale[locale] ?? item.id,
        output: item.result.output,
        ok: item.result.ok,
        error: item.result.error,
      })),
    );

    if (preset.warningByLocale?.[locale]) {
      setWarning(preset.warningByLocale[locale] ?? '');
    }
  };

  const handleBatch = async () => {
    const rows = await convertBatchLines(conversionId, input, options);
    setBatchRows(
      rows.map((row) => ({
        line: row.line,
        output: row.result.output,
        ok: row.result.ok,
        error: row.result.error,
      })),
    );
  };

  const handlePipeline = async () => {
    const steps = pipeline
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean) as UniversalConversionId[];

    if (steps.length === 0) {
      setError(ui.invalidPipeline);
      return;
    }

    const execution = await runConversionPipeline(input, steps, options);
    setPipelineLog(execution.stepResults);
    if (execution.ok) {
      setResult(execution.finalOutput);
      setError('');
    } else {
      setError(execution.stepResults.at(-1)?.error ?? ui.invalidPipeline);
    }
  };

  const handleCaesarAttack = async () => {
    const attempts = await getAllCaesarShiftAttempts(input);
    setCaesarAttempts(attempts);
  };

  const conversionNeedsShift = selectedConversion?.needsShift ?? false;
  const conversionNeedsKey = selectedConversion?.needsKey ?? false;

  return (
    <Card className="space-y-5">
      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        {ui.localNotice}
      </section>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{ui.inputTypeLabel}</span>
          <SearchableSelect
            value={fromType}
            onValueChange={setFromType}
            options={inputTypeOptions}
            searchPlaceholder="Buscar tipo de entrada..."
            noResultsText="Nenhum tipo encontrado."
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{ui.outputTypeLabel}</span>
          <SearchableSelect
            value={conversionId}
            onValueChange={(nextValue) => setConversionId(nextValue as UniversalConversionId)}
            options={conversionOptions}
            searchPlaceholder="Buscar saida possivel..."
            noResultsText="Nenhuma saida encontrada para esta entrada."
          />
        </label>
      </div>

      {selectedConversion?.existingDedicatedToolSlug ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{ui.dedicatedToolHint}</p>
      ) : null}

      <UniversalConversionLinks
        title={ui.outputRoutesTitle}
        description={ui.outputRoutesDescription}
        links={outputDynamicLinks}
      />

      <UniversalConversionLinks
        title={ui.inputRoutesTitle}
        description={ui.inputRoutesDescription}
        links={inputDynamicLinks}
      />

      <label className="space-y-2">
        <span className="text-sm font-semibold text-slate-800">{ui.sourceLabel}</span>
        <Textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-[180px]" />
      </label>

      <div className="grid gap-3 md:grid-cols-2">
        {conversionNeedsShift ? (
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.shiftLabel}</span>
            <Input value={shift} onChange={(event) => setShift(event.target.value)} inputMode="numeric" />
          </label>
        ) : null}

        {conversionNeedsKey ? (
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.keyLabel}</span>
            <Input value={key} onChange={(event) => setKey(event.target.value)} />
          </label>
        ) : null}
      </div>

      <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700">
        <strong>{ui.detection}:</strong> {detection.type} ({Math.round(detection.confidence * 100)}%)
      </section>

      {warning ? <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{warning}</p> : null}
      {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={handleConvert}>{ui.convert}</Button>
        <Button variant="secondary" onClick={handleCopy}>{copied ? ui.copied : ui.copy}</Button>
        <Button
          variant="ghost"
          onClick={() => {
            setInput('');
            setResult('');
            setWarning('');
            setError('');
            setMultiResults([]);
            setBatchRows([]);
            setPipelineLog([]);
            setCaesarAttempts([]);
          }}
        >
          {ui.clear}
        </Button>
      </div>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-800">{ui.result}</h3>
        <Textarea value={result} onChange={(event) => setResult(event.target.value)} className="min-h-[140px]" />
      </section>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-end">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">Preset</span>
            <SearchableSelect
              value={presetId}
              onValueChange={(nextValue) => setPresetId(nextValue as UniversalPresetId | '')}
              options={presetOptions}
              searchPlaceholder="Buscar preset..."
              noResultsText="Nenhum preset encontrado."
            />
          </label>

          <Button variant="secondary" onClick={handleApplyPreset}>{ui.applyPreset}</Button>
          <Button variant="secondary" onClick={handleApplyPreset}>{ui.runMultiOutput}</Button>
        </div>

        {multiResults.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-800">{ui.multiResults}</h4>
            {multiResults.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200 bg-white p-3 text-xs">
                <p className="font-semibold text-slate-800">{item.title}</p>
                {item.ok ? (
                  <p className="mt-1 break-all font-mono text-slate-700">{item.output || '-'}</p>
                ) : (
                  <p className="mt-1 text-red-700">{item.error}</p>
                )}
              </div>
            ))}
          </div>
        ) : null}

        {multiResults.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="ghost"
              onClick={() =>
                downloadText(
                  'universal-results.txt',
                  exportResultsAsTxt(
                    multiResults.map((item) => ({ title: item.title, output: item.ok ? item.output : item.error ?? '' })),
                  ),
                )
              }
            >
              {ui.exportTxt}
            </Button>
            <Button
              variant="ghost"
              onClick={() => downloadText('universal-results.json', exportResultsAsJson(input, multiResults))}
            >
              {ui.exportJson}
            </Button>
          </div>
        ) : null}
      </section>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h4 className="text-sm font-semibold text-slate-800">{ui.batchMode}</h4>
        <Button variant="secondary" onClick={handleBatch}>{ui.runBatch}</Button>

        {batchRows.length > 0 ? (
          <>
            <div className="space-y-2">
              <h5 className="text-sm font-semibold text-slate-800">{ui.batchResults}</h5>
              {batchRows.map((row, index) => (
                <div key={`${row.line}-${index}`} className="rounded-lg border border-slate-200 bg-white p-3 text-xs">
                  <p className="font-semibold text-slate-700">{ui.lineByLine} {index + 1}</p>
                  <p className="mt-1 break-all font-mono text-slate-600">{row.line}</p>
                  <p className="mt-1 break-all font-mono text-slate-900">{row.ok ? row.output : row.error}</p>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              onClick={() =>
                downloadText(
                  'universal-batch.csv',
                  exportBatchAsCsv(
                    batchRows.map((row) => ({
                      line: row.line,
                      output: row.output,
                      ok: row.ok,
                      error: row.error,
                    })),
                  ),
                )
              }
            >
              {ui.exportCsv}
            </Button>
          </>
        ) : null}
      </section>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{ui.pipelineMode}</span>
          <Input value={pipeline} onChange={(event) => setPipeline(event.target.value)} placeholder="text-to-url-encode,url-encode-to-text" />
        </label>

        <Button variant="secondary" onClick={handlePipeline}>{ui.runPipeline}</Button>

        {pipelineLog.length > 0 ? (
          <div className="space-y-2">
            <h5 className="text-sm font-semibold text-slate-800">{ui.pipelineResults}</h5>
            {pipelineLog.map((step, index) => (
              <div key={`${step.id}-${index}`} className="rounded-lg border border-slate-200 bg-white p-3 text-xs">
                <p className="font-semibold text-slate-800">{index + 1}. {step.id}</p>
                <p className="mt-1 break-all font-mono text-slate-600">IN: {step.input}</p>
                {step.error ? (
                  <p className="mt-1 text-red-700">{step.error}</p>
                ) : (
                  <p className="mt-1 break-all font-mono text-slate-900">OUT: {step.output}</p>
                )}
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h4 className="text-sm font-semibold text-slate-800">{ui.caesarAttack}</h4>
        <Button variant="secondary" onClick={handleCaesarAttack}>{ui.runCaesarAttack}</Button>

        {caesarAttempts.length > 0 ? (
          <div className="grid gap-2 md:grid-cols-2">
            {caesarAttempts.map((attempt) => (
              <div key={attempt.shift} className="rounded-lg border border-slate-200 bg-white p-3 text-xs">
                <p className="font-semibold text-slate-800">Shift {attempt.shift}</p>
                <p className="mt-1 break-all font-mono text-slate-700">{attempt.output}</p>
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </Card>
  );
}
