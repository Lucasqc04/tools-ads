'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { AppLocale } from '@/lib/i18n/config';
import {
  decodeFullUrl,
  decodeQueryValue,
  encodeFullUrl,
  encodeQueryValue,
  looksEncoded,
  parseUrlQueryParams,
  rebuildUrlWithParams,
  type QueryParamItem,
} from '@/lib/url-encoder-decoder';

type UrlEncoderDecoderToolProps = Readonly<{ locale?: AppLocale }>;

type Mode = 'full' | 'param';

type UrlUi = {
  localNote: string;
  sourceLabel: string;
  encodedHint: string;
  encodeError: string;
  decodeError: string;
  copied: string;
  copyResult: string;
  swap: string;
  clear: string;
  queryParamsTitle: string;
  rebuildUrl: string;
  examplesTitle: string;
};

const uiByLocale: Record<AppLocale, UrlUi> = {
  'pt-br': {
    localNote: 'Codificacao/decodificacao local no navegador. Sem login e sem backend obrigatorio.',
    sourceLabel: 'Texto ou URL original',
    encodedHint: 'O texto parece ja estar codificado.',
    encodeError: 'Falha ao codificar.',
    decodeError: 'Falha ao decodificar o valor informado.',
    copied: 'Copiado',
    copyResult: 'Copiar resultado',
    swap: 'Inverter origem/resultado',
    clear: 'Limpar',
    queryParamsTitle: 'Query params',
    rebuildUrl: 'Reconstruir URL final',
    examplesTitle: 'Exemplos prontos',
  },
  en: {
    localNote: 'Local encode/decode in browser. No login and no mandatory backend.',
    sourceLabel: 'Original text or URL',
    encodedHint: 'Input appears to be already encoded.',
    encodeError: 'Failed to encode.',
    decodeError: 'Failed to decode input.',
    copied: 'Copied',
    copyResult: 'Copy result',
    swap: 'Swap source/result',
    clear: 'Clear',
    queryParamsTitle: 'Query params',
    rebuildUrl: 'Rebuild URL',
    examplesTitle: 'Ready examples',
  },
  es: {
    localNote: 'Codificacion/decodificacion local en el navegador. Sin login y sin backend obligatorio.',
    sourceLabel: 'Texto o URL original',
    encodedHint: 'El texto parece ya codificado.',
    encodeError: 'Error al codificar.',
    decodeError: 'Error al decodificar el valor.',
    copied: 'Copiado',
    copyResult: 'Copiar resultado',
    swap: 'Invertir origen/resultado',
    clear: 'Limpiar',
    queryParamsTitle: 'Query params',
    rebuildUrl: 'Reconstruir URL final',
    examplesTitle: 'Ejemplos listos',
  },
};

const examples = [
  'https://site.com/produto especial?utm_source=google ads&utm_campaign=lancamento',
  'https%3A%2F%2Fsite.com%2Fbusca%3Fq%3Dcamisa%2520azul',
  'redirect=https://dominio.com/pagamento?order=123&ref=abc',
  'nome=Joao da Silva&cidade=Sao Paulo',
];

export function UrlEncoderDecoderTool({ locale = 'pt-br' }: UrlEncoderDecoderToolProps) {
  const ui = uiByLocale[locale];

  const [mode, setMode] = useState<Mode>('full');
  const [source, setSource] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [params, setParams] = useState<QueryParamItem[]>([]);
  const [baseUrl, setBaseUrl] = useState('https://example.com');

  const encodedHint = useMemo(() => looksEncoded(source), [source]);
  const copyResultLabel = copied ? ui.copied : ui.copyResult;

  const applyEncode = () => {
    setError('');
    try {
      const output = mode === 'full' ? encodeFullUrl(source) : encodeQueryValue(source);
      setResult(output);
      setParams(parseUrlQueryParams(output));
    } catch {
      setError(ui.encodeError);
    }
  };

  const applyDecode = () => {
    setError('');
    try {
      const output = mode === 'full' ? decodeFullUrl(source) : decodeQueryValue(source);
      setResult(output);
      setParams(parseUrlQueryParams(output));
    } catch {
      setError(ui.decodeError);
    }
  };

  const copyResult = async () => {
    if (!result.trim()) return;

    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  const updateParam = (index: number, field: keyof QueryParamItem, value: string) => {
    setParams((current) => current.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)));
  };

  return (
    <Card className="space-y-5">
      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        {ui.localNote}
      </section>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="space-y-2 md:col-span-1">
          <span className="text-sm font-semibold text-slate-800">Modo</span>
          <Select value={mode} onChange={(event) => setMode(event.target.value as Mode)}>
            <option value="full">URL completa</option>
            <option value="param">Parametro</option>
          </Select>
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-slate-800">Base URL</span>
          <Input value={baseUrl} onChange={(event) => setBaseUrl(event.target.value)} />
        </label>
      </div>

      <label className="space-y-2">
        <span className="text-sm font-semibold text-slate-800">{ui.sourceLabel}</span>
        <Textarea value={source} onChange={(event) => setSource(event.target.value)} className="min-h-[180px]" />
      </label>

      {encodedHint ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {ui.encodedHint}
        </p>
      ) : null}

      {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={applyEncode}>Encode</Button>
        <Button variant="secondary" onClick={applyDecode}>Decode</Button>
        <Button variant="secondary" onClick={copyResult}>{copyResultLabel}</Button>
        <Button
          variant="secondary"
          onClick={() => {
            setSource(result);
            setResult(source);
          }}
        >
          {ui.swap}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setSource('');
            setResult('');
            setError('');
            setParams([]);
          }}
        >
          {ui.clear}
        </Button>
      </div>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-800">Resultado</h3>
        <Textarea value={result} onChange={(event) => setResult(event.target.value)} className="min-h-[140px]" />
      </section>

      <section className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-semibold text-slate-800">
          {ui.queryParamsTitle} ({params.length})
        </h3>

        <div className="space-y-2">
          {params.map((item, index) => (
            <div key={`${item.key}-${index}`} className="grid gap-2 md:grid-cols-2">
              <Input value={item.key} onChange={(event) => updateParam(index, 'key', event.target.value)} />
              <Input value={item.value} onChange={(event) => updateParam(index, 'value', event.target.value)} />
            </div>
          ))}
        </div>

        <Button variant="secondary" onClick={() => setResult(rebuildUrlWithParams(baseUrl, params))}>
          {ui.rebuildUrl}
        </Button>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-800">{ui.examplesTitle}</h3>
        <div className="flex flex-wrap gap-2">
          {examples.map((example) => (
            <Button key={example} variant="ghost" onClick={() => setSource(example)}>
              {example.slice(0, 35)}...
            </Button>
          ))}
        </div>
      </section>
    </Card>
  );
}
