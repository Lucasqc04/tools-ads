'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { formatJsonText, type JsonFormatterMessages } from '@/lib/json-formatter';
import { type AppLocale } from '@/lib/i18n/config';

type JsonFormatterToolProps = {
  locale?: AppLocale;
};

type JsonFormatterUi = {
  title: string;
  intro: string;
  textareaLabel: string;
  textareaPlaceholder: string;
  format: string;
  minify: string;
  copy: string;
  copied: string;
  clear: string;
  resultLabel: string;
  messages: JsonFormatterMessages;
};

const uiByLocale: Record<AppLocale, JsonFormatterUi> = {
  'pt-br': {
    title: 'JSON Formatter e Minifier',
    intro:
      'Cole JSON, valide sintaxe, formate com indentação ou minifique para payload compacto.',
    textareaLabel: 'Entrada JSON',
    textareaPlaceholder: '{"produto":"Tool","ativo":true}',
    format: 'Formatar',
    minify: 'Minificar',
    copy: 'Copiar resultado',
    copied: 'Copiado',
    clear: 'Limpar',
    resultLabel: 'Resultado',
    messages: {
      emptyInput: 'Cole um JSON válido antes de formatar.',
      invalidPrefix: 'JSON inválido:',
      invalidFallback: 'JSON inválido. Revise a sintaxe e tente novamente.',
    },
  },
  en: {
    title: 'JSON Formatter and Minifier',
    intro:
      'Paste JSON, validate syntax, format with indentation, or minify for compact payloads.',
    textareaLabel: 'JSON input',
    textareaPlaceholder: '{"product":"Tool","active":true}',
    format: 'Format',
    minify: 'Minify',
    copy: 'Copy output',
    copied: 'Copied',
    clear: 'Clear',
    resultLabel: 'Output',
    messages: {
      emptyInput: 'Paste valid JSON before formatting.',
      invalidPrefix: 'Invalid JSON:',
      invalidFallback: 'Invalid JSON. Review syntax and try again.',
    },
  },
  es: {
    title: 'Formateador y Minificador JSON',
    intro:
      'Pega JSON, valida sintaxis, formatea con indentación o minifica para payload compacto.',
    textareaLabel: 'Entrada JSON',
    textareaPlaceholder: '{"producto":"Tool","activo":true}',
    format: 'Formatear',
    minify: 'Minificar',
    copy: 'Copiar resultado',
    copied: 'Copiado',
    clear: 'Limpiar',
    resultLabel: 'Resultado',
    messages: {
      emptyInput: 'Pega un JSON válido antes de formatear.',
      invalidPrefix: 'JSON inválido:',
      invalidFallback: 'JSON inválido. Revisa la sintaxis e inténtalo de nuevo.',
    },
  },
};

export function JsonFormatterTool({ locale = 'pt-br' }: JsonFormatterToolProps) {
  const ui = uiByLocale[locale];

  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const applyAction = (mode: 'pretty' | 'minify') => {
    const output = formatJsonText(input, mode, ui.messages);

    if (!output.ok) {
      setErrorMessage(output.error);
      setCopied(false);
      return;
    }

    setInput(output.value);
    setResult(output.value);
    setErrorMessage('');
    setCopied(false);
  };

  const handleCopy = async () => {
    const valueToCopy = result || input;

    if (!valueToCopy.trim()) {
      return;
    }

    try {
      await navigator.clipboard.writeText(valueToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Card className="space-y-5">
      <header className="rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 to-indigo-50 p-4">
        <h3 className="text-lg font-semibold text-slate-900">{ui.title}</h3>
        <p className="mt-1 text-sm text-slate-700">{ui.intro}</p>
      </header>

      <label className="space-y-2">
        <span className="text-sm font-semibold text-slate-800">{ui.textareaLabel}</span>
        <Textarea
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setErrorMessage('');
            setCopied(false);
          }}
          className="min-h-[260px] font-mono text-xs"
          placeholder={ui.textareaPlaceholder}
        />
      </label>

      {errorMessage ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => applyAction('pretty')}>
          {ui.format}
        </Button>
        <Button variant="secondary" onClick={() => applyAction('minify')}>
          {ui.minify}
        </Button>
        <Button variant="secondary" onClick={handleCopy}>
          {copied ? ui.copied : ui.copy}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setInput('');
            setResult('');
            setErrorMessage('');
            setCopied(false);
          }}
        >
          {ui.clear}
        </Button>
      </div>

      <section className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h4 className="text-sm font-semibold text-slate-800">{ui.resultLabel}</h4>
        <pre className="max-h-[280px] overflow-auto whitespace-pre-wrap break-all rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-800">
          {result || input || '{}'}
        </pre>
      </section>
    </Card>
  );
}

