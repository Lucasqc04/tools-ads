'use client';

import { useMemo, useState } from 'react';
import { FileUploadDropzone } from '@/components/shared/file-upload-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type { AppLocale } from '@/lib/i18n/config';
import {
  buildDiffReport,
  compareTexts,
  type DiffMode,
  type DiffOptions,
  type TextDiffResult,
} from '@/lib/text-diff';

type TextDiffToolProps = {
  locale?: AppLocale;
};

type Ui = {
  intro: string;
  textA: string;
  textB: string;
  compare: string;
  clear: string;
  swap: string;
  copyReport: string;
  copyFinal: string;
  copied: string;
  exportTxt: string;
  exportJson: string;
  mode: string;
  similarity: string;
  added: string;
  removed: string;
  changedLines: string;
  diffSize: string;
  summary: string;
  sideBySide: string;
  inline: string;
  changes: string;
  listMode: string;
  options: string;
  noResult: string;
};

const uiByLocale: Record<AppLocale, Ui> = {
  'pt-br': {
    intro:
      'Compare duas versoes de texto com diff por caractere, palavra, linha, paragrafo ou lista. Tudo local no navegador.',
    textA: 'Texto original',
    textB: 'Texto novo',
    compare: 'Comparar textos',
    clear: 'Limpar',
    swap: 'Trocar lados',
    copyReport: 'Copiar relatorio',
    copyFinal: 'Copiar texto final',
    copied: 'Copiado',
    exportTxt: 'Exportar TXT',
    exportJson: 'Exportar JSON',
    mode: 'Modo de comparacao',
    similarity: 'Similaridade',
    added: 'Adicoes',
    removed: 'Remocoes',
    changedLines: 'Linhas alteradas',
    diffSize: 'Diferenca de tamanho',
    summary: 'Resumo executivo',
    sideBySide: 'Diff lado a lado',
    inline: 'Diff inline',
    changes: 'Lista de alteracoes',
    listMode: 'Comparacao de listas',
    options: 'Opcoes de comparacao',
    noResult: 'Cole os dois textos e clique em comparar para gerar o diff.',
  },
  en: {
    intro:
      'Compare two text versions with diff by character, word, line, paragraph, or list. Fully local in-browser.',
    textA: 'Original text',
    textB: 'New text',
    compare: 'Compare texts',
    clear: 'Clear',
    swap: 'Swap sides',
    copyReport: 'Copy report',
    copyFinal: 'Copy final text',
    copied: 'Copied',
    exportTxt: 'Export TXT',
    exportJson: 'Export JSON',
    mode: 'Comparison mode',
    similarity: 'Similarity',
    added: 'Additions',
    removed: 'Removals',
    changedLines: 'Changed lines',
    diffSize: 'Size difference',
    summary: 'Executive summary',
    sideBySide: 'Side-by-side diff',
    inline: 'Inline diff',
    changes: 'Changes list',
    listMode: 'List comparison',
    options: 'Comparison options',
    noResult: 'Paste both texts and run compare to generate diff.',
  },
  es: {
    intro:
      'Compara dos versiones de texto con diff por caracter, palabra, linea, parrafo o lista. Todo local en el navegador.',
    textA: 'Texto original',
    textB: 'Texto nuevo',
    compare: 'Comparar textos',
    clear: 'Limpiar',
    swap: 'Cambiar lados',
    copyReport: 'Copiar reporte',
    copyFinal: 'Copiar texto final',
    copied: 'Copiado',
    exportTxt: 'Exportar TXT',
    exportJson: 'Exportar JSON',
    mode: 'Modo de comparacion',
    similarity: 'Similitud',
    added: 'Adiciones',
    removed: 'Eliminaciones',
    changedLines: 'Lineas alteradas',
    diffSize: 'Diferencia de tamano',
    summary: 'Resumen ejecutivo',
    sideBySide: 'Diff lado a lado',
    inline: 'Diff inline',
    changes: 'Lista de cambios',
    listMode: 'Comparacion de listas',
    options: 'Opciones de comparacion',
    noResult: 'Pega ambos textos y ejecuta comparar para generar el diff.',
  },
};

const modes: Array<{ value: DiffMode; label: string }> = [
  { value: 'character', label: 'Caractere' },
  { value: 'word', label: 'Palavra' },
  { value: 'line', label: 'Linha' },
  { value: 'paragraph', label: 'Paragrafo' },
  { value: 'list', label: 'Lista' },
];

const downloadText = (filename: string, content: string, mime = 'text/plain;charset=utf-8') => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

const getDiffClassName = (type: 'equal' | 'add' | 'remove') => {
  if (type === 'add') {
    return 'bg-emerald-100 text-emerald-900';
  }

  if (type === 'remove') {
    return 'bg-red-100 text-red-900 line-through';
  }

  return 'text-slate-700';
};

export function TextDiffTool({ locale = 'pt-br' }: TextDiffToolProps) {
  const ui = uiByLocale[locale];

  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [copiedKey, setCopiedKey] = useState('');
  const [options, setOptions] = useState<DiffOptions>({
    mode: 'word',
    ignoreCase: false,
    ignoreAccents: false,
    ignoreExtraSpaces: true,
    ignorePunctuation: false,
    ignoreLineBreaks: false,
  });
  const [result, setResult] = useState<TextDiffResult | null>(null);

  const finalText = useMemo(() => textB || '', [textB]);

  const compareNow = () => {
    setResult(compareTexts(textA, textB, options));
  };

  const copyToClipboard = async (key: string, value: string) => {
    if (!value.trim()) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(''), 1200);
    } catch {
      setCopiedKey('');
    }
  };

  const setOption = (key: keyof DiffOptions, value: boolean | DiffMode) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="space-y-5">
      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        {ui.intro}
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.textA}</span>
            <Textarea
              value={textA}
              onChange={(event) => setTextA(event.target.value)}
              className="min-h-[220px]"
            />
          </label>

          <FileUploadDropzone
            label={`${ui.textA} (.txt, .md, .json, .html, .csv, .xml, .log)`}
            onFilesSelected={async (files) => {
              const file = files[0];
              if (!file) return;
              setTextA(await file.text());
            }}
            accept=".txt,.md,.csv,.json,.html,.xml,.log,text/plain,text/markdown,text/csv,application/json,text/html,application/xml,text/xml"
            multiple={false}
            compact
            locale={locale}
          />
        </div>

        <div className="space-y-3">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.textB}</span>
            <Textarea
              value={textB}
              onChange={(event) => setTextB(event.target.value)}
              className="min-h-[220px]"
            />
          </label>

          <FileUploadDropzone
            label={`${ui.textB} (.txt, .md, .json, .html, .csv, .xml, .log)`}
            onFilesSelected={async (files) => {
              const file = files[0];
              if (!file) return;
              setTextB(await file.text());
            }}
            accept=".txt,.md,.csv,.json,.html,.xml,.log,text/plain,text/markdown,text/csv,application/json,text/html,application/xml,text/xml"
            multiple={false}
            compact
            locale={locale}
          />
        </div>
      </div>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-semibold text-slate-800">{ui.options}</h3>

        <div className="grid gap-3 md:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm text-slate-700">{ui.mode}</span>
            <select
              value={options.mode}
              onChange={(event) => setOption('mode', event.target.value as DiffMode)}
              className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
            >
              {modes.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
            <input type="checkbox" checked={options.ignoreCase} onChange={(e) => setOption('ignoreCase', e.target.checked)} />
            Ignorar maiusculas/minusculas
          </label>
          <label className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
            <input type="checkbox" checked={options.ignoreAccents} onChange={(e) => setOption('ignoreAccents', e.target.checked)} />
            Ignorar acentos
          </label>
          <label className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
            <input type="checkbox" checked={options.ignoreExtraSpaces} onChange={(e) => setOption('ignoreExtraSpaces', e.target.checked)} />
            Ignorar espacos extras
          </label>
          <label className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
            <input type="checkbox" checked={options.ignorePunctuation} onChange={(e) => setOption('ignorePunctuation', e.target.checked)} />
            Ignorar pontuacao
          </label>
          <label className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
            <input type="checkbox" checked={options.ignoreLineBreaks} onChange={(e) => setOption('ignoreLineBreaks', e.target.checked)} />
            Ignorar quebras de linha
          </label>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={compareNow}>{ui.compare}</Button>
        <Button
          variant="secondary"
          onClick={() => {
            setTextA(textB);
            setTextB(textA);
            setResult(null);
          }}
        >
          {ui.swap}
        </Button>
        <Button
          variant="secondary"
          onClick={() => copyToClipboard('report', result ? buildDiffReport(result) : '')}
          disabled={!result}
        >
          {copiedKey === 'report' ? ui.copied : ui.copyReport}
        </Button>
        <Button
          variant="secondary"
          onClick={() => copyToClipboard('final', finalText)}
          disabled={!finalText}
        >
          {copiedKey === 'final' ? ui.copied : ui.copyFinal}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setTextA('');
            setTextB('');
            setResult(null);
            setCopiedKey('');
          }}
        >
          {ui.clear}
        </Button>
      </div>

      {result ? (
        <>
          <section className="grid gap-3 md:grid-cols-5">
            <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm">
              <p className="text-slate-500">{ui.similarity}</p>
              <p className="text-lg font-semibold text-slate-900">{result.metrics.similarityPercent}%</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm">
              <p className="text-slate-500">{ui.added}</p>
              <p className="text-lg font-semibold text-emerald-700">{result.metrics.addedUnits}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm">
              <p className="text-slate-500">{ui.removed}</p>
              <p className="text-lg font-semibold text-red-700">{result.metrics.removedUnits}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm">
              <p className="text-slate-500">{ui.changedLines}</p>
              <p className="text-lg font-semibold text-slate-900">{result.metrics.changedLines}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm">
              <p className="text-slate-500">{ui.diffSize}</p>
              <p className="text-lg font-semibold text-slate-900">{result.metrics.charDiff >= 0 ? `+${result.metrics.charDiff}` : result.metrics.charDiff}</p>
            </div>
          </section>

          <section className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-800">{ui.summary}</h3>
            <p className="text-sm text-slate-700">{result.executiveSummary}</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-800">{ui.sideBySide}</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="max-h-[260px] overflow-auto rounded-xl border border-slate-200 bg-white p-3 text-xs">
                {result.operations.map((op, index) => (
                  <span key={`left-${index}`} className={`whitespace-pre-wrap ${op.type === 'remove' ? getDiffClassName('remove') : 'text-slate-500'}`}>
                    {op.type === 'remove' || op.type === 'equal' ? op.value : ''}
                  </span>
                ))}
              </div>
              <div className="max-h-[260px] overflow-auto rounded-xl border border-slate-200 bg-white p-3 text-xs">
                {result.operations.map((op, index) => (
                  <span key={`right-${index}`} className={`whitespace-pre-wrap ${op.type === 'add' ? getDiffClassName('add') : 'text-slate-500'}`}>
                    {op.type === 'add' || op.type === 'equal' ? op.value : ''}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-800">{ui.inline}</h3>
            <div className="max-h-[260px] overflow-auto rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
              {result.operations.map((op, index) => (
                <span key={`inline-${index}`} className={`whitespace-pre-wrap ${getDiffClassName(op.type)}`}>
                  {op.value}
                </span>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-800">{ui.changes}</h3>
            <ul className="max-h-[260px] space-y-2 overflow-auto rounded-xl border border-slate-200 bg-white p-3 text-xs">
              {result.operations
                .filter((op) => op.type !== 'equal')
                .slice(0, 120)
                .map((op, index) => (
                  <li key={`change-${index}`} className="rounded border border-slate-200 px-2 py-1">
                    <span className={op.type === 'add' ? 'text-emerald-700' : 'text-red-700'}>
                      {op.type === 'add' ? '+' : '-'}
                    </span>{' '}
                    {op.value}
                  </li>
                ))}
            </ul>
          </section>

          {result.listCompare ? (
            <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-800">{ui.listMode}</h3>
              <div className="grid gap-3 md:grid-cols-3 text-xs">
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <p className="font-semibold text-slate-800">Em comum ({result.listCompare.common.length})</p>
                  <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap">{result.listCompare.common.join('\n')}</pre>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <p className="font-semibold text-slate-800">So no A ({result.listCompare.onlyA.length})</p>
                  <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap">{result.listCompare.onlyA.join('\n')}</pre>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <p className="font-semibold text-slate-800">So no B ({result.listCompare.onlyB.length})</p>
                  <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap">{result.listCompare.onlyB.join('\n')}</pre>
                </div>
              </div>
            </section>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" onClick={() => downloadText('text-diff-report.txt', buildDiffReport(result))}>
              {ui.exportTxt}
            </Button>
            <Button
              variant="ghost"
              onClick={() =>
                downloadText(
                  'text-diff-report.json',
                  JSON.stringify(result, null, 2),
                  'application/json;charset=utf-8',
                )
              }
            >
              {ui.exportJson}
            </Button>
          </div>
        </>
      ) : (
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-600">{ui.noResult}</p>
      )}
    </Card>
  );
}
