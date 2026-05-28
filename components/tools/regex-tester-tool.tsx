'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { AppLocale } from '@/lib/i18n/config';
import { explainRegexPattern, testRegex } from '@/lib/regex-tester';

type RegexTesterToolProps = Readonly<{ locale?: AppLocale }>;

type RegexUi = {
  localNote: string;
  testTextLabel: string;
  replacementLabel: string;
  copyRegex: string;
  copyResults: string;
  copied: string;
  clear: string;
  highlightTitle: string;
  resultsTitle: string;
  replacePreviewTitle: string;
  quickExplainTitle: string;
  examplesTitle: string;
};

const uiByLocale: Record<AppLocale, RegexUi> = {
  'pt-br': {
    localNote:
      'Teste regex localmente no navegador. O comportamento segue o motor de regex do JavaScript.',
    testTextLabel: 'Texto de teste',
    replacementLabel: 'Replacement (opcional)',
    copyRegex: 'Copiar regex',
    copyResults: 'Copiar resultados',
    copied: 'Copiado',
    clear: 'Limpar',
    highlightTitle: 'Destaque dos matches',
    resultsTitle: 'Resultados encontrados',
    replacePreviewTitle: 'Preview de substituicao',
    quickExplainTitle: 'Explicacao rapida da regex',
    examplesTitle: 'Exemplos prontos',
  },
  en: {
    localNote:
      'Test regex locally in your browser. Behavior follows JavaScript regex engine.',
    testTextLabel: 'Test text',
    replacementLabel: 'Replacement (optional)',
    copyRegex: 'Copy regex',
    copyResults: 'Copy results',
    copied: 'Copied',
    clear: 'Clear',
    highlightTitle: 'Match highlight',
    resultsTitle: 'Found matches',
    replacePreviewTitle: 'Replacement preview',
    quickExplainTitle: 'Quick regex explanation',
    examplesTitle: 'Ready examples',
  },
  es: {
    localNote:
      'Prueba regex localmente en el navegador. El comportamiento sigue el motor regex de JavaScript.',
    testTextLabel: 'Texto de prueba',
    replacementLabel: 'Replacement (opcional)',
    copyRegex: 'Copiar regex',
    copyResults: 'Copiar resultados',
    copied: 'Copiado',
    clear: 'Limpiar',
    highlightTitle: 'Resaltado de matches',
    resultsTitle: 'Resultados encontrados',
    replacePreviewTitle: 'Preview de reemplazo',
    quickExplainTitle: 'Explicacion rapida de la regex',
    examplesTitle: 'Ejemplos listos',
  },
};

const examples = [
  {
    name: 'Email',
    pattern: String.raw`[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}`,
    text: 'contato@site.com suporte@empresa.io',
  },
  {
    name: 'URL',
    pattern: String.raw`https?://[^\s]+`,
    text: 'Acesse https://example.com/docs agora',
  },
  {
    name: 'Telefone BR',
    pattern: String.raw`(?:\+55\s?)?(?:\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}`,
    text: '+55 (11) 99999-1234 e 2133445566',
  },
  {
    name: 'CPF',
    pattern: String.raw`\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b`,
    text: 'CPF: 123.456.789-09',
  },
  { name: 'Numeros', pattern: String.raw`\b\d+\b`, text: 'Pedido 342 e nota 2026' },
  { name: 'Hashtags', pattern: String.raw`#[\p{L}\p{N}_]+`, text: '#dev #regex #frontend' },
  { name: 'Mencoes', pattern: String.raw`@[\w_.-]+`, text: '@lucas e @dev.team' },
  {
    name: 'Datas',
    pattern: String.raw`\b\d{1,2}/\d{1,2}/\d{2,4}\b`,
    text: 'Evento 27/05/2026 e 01/06/2026',
  },
  {
    name: 'Palavra especifica',
    pattern: String.raw`\b(jwt|token|auth)\b`,
    text: 'jwt token auth session',
    flags: 'gi',
  },
  {
    name: 'Espacos duplicados',
    pattern: String.raw`\s{2,}`,
    text: 'texto   com    espacos',
    replacement: ' ',
  },
];

export function RegexTesterTool({ locale = 'pt-br' }: RegexTesterToolProps) {
  const ui = uiByLocale[locale];

  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('');
  const [replacement, setReplacement] = useState('');
  const [copied, setCopied] = useState('');

  const result = useMemo(() => testRegex(pattern, flags, text, replacement), [pattern, flags, text, replacement]);
  const tips = useMemo(() => explainRegexPattern(pattern), [pattern]);

  const toggleFlag = (flag: string) => {
    setFlags((current) => {
      if (current.includes(flag)) {
        return current.replaceAll(flag, '') || 'g';
      }

      return `${current}${flag}`;
    });
  };

  const copyValue = async (key: string, value: string) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(''), 1300);
    } catch {
      setCopied('');
    }
  };

  const copyResults = () => {
    const lines = result.matches.map(
      (item, idx) => `${idx + 1}. ${item.value} [${item.indexStart}-${item.indexEnd}]`,
    );
    void copyValue('results', lines.join('\n'));
  };

  const copyRegexLabel = copied === 'regex' ? ui.copied : ui.copyRegex;
  const copyResultsLabel = copied === 'results' ? ui.copied : ui.copyResults;

  return (
    <Card className="space-y-5">
      <section className="space-y-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-sm text-emerald-900">{ui.localNote}</p>
      </section>

      <label className="space-y-2">
        <span className="text-sm font-semibold text-slate-800">Regex</span>
        <Input
          value={pattern}
          onChange={(event) => setPattern(event.target.value)}
          placeholder={String.raw`\b\w+\b`}
          className="font-mono text-sm"
        />
      </label>

      <div className="flex flex-wrap gap-3">
        {['g', 'i', 'm', 's', 'u', 'y'].map((flag) => (
          <label key={flag} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm">
            <input
              type="checkbox"
              checked={flags.includes(flag)}
              onChange={() => toggleFlag(flag)}
            />
            {flag}
          </label>
        ))}
      </div>

      <label className="space-y-2">
        <span className="text-sm font-semibold text-slate-800">{ui.testTextLabel}</span>
        <Textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          className="min-h-[180px] font-mono text-xs"
        />
      </label>

      <label className="space-y-2">
        <span className="text-sm font-semibold text-slate-800">{ui.replacementLabel}</span>
        <Input
          value={replacement}
          onChange={(event) => setReplacement(event.target.value)}
          className="font-mono text-sm"
        />
      </label>

      {result.ok ? null : (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{result.error}</p>
      )}

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => copyValue('regex', result.regexPreview)}>
          {copyRegexLabel}
        </Button>
        <Button variant="secondary" onClick={copyResults}>
          {copyResultsLabel}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setPattern('');
            setText('');
            setReplacement('');
            setFlags('g');
          }}
        >
          {ui.clear}
        </Button>
      </div>

      <section className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-semibold text-slate-800">{ui.highlightTitle}</h3>
        <div
          className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-800"
          dangerouslySetInnerHTML={{ __html: result.highlightedText }}
        />
      </section>

      <section className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-800">
          {ui.resultsTitle}: {result.totalMatches}
        </h3>
        <ul className="max-h-64 space-y-2 overflow-auto text-xs text-slate-700">
          {result.matches.map((item, idx) => (
            <li key={`${item.indexStart}-${idx}`} className="rounded-lg border border-slate-200 p-2">
              <p><strong>{idx + 1}.</strong> {item.value || '(vazio)'} [{item.indexStart}-{item.indexEnd}]</p>
              {item.groups.length > 0 ? <p>groups: {item.groups.join(' | ')}</p> : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-semibold text-slate-800">{ui.replacePreviewTitle}</h3>
        <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-all rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-800">
          {result.replacedText}
        </pre>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-800">{ui.quickExplainTitle}</h3>
        <ul className="space-y-1 text-xs text-slate-700">
          {tips.map((tip) => (
            <li key={tip}>- {tip}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-800">{ui.examplesTitle}</h3>
        <div className="flex flex-wrap gap-2">
          {examples.map((example) => (
            <Button
              key={example.name}
              variant="ghost"
              onClick={() => {
                setPattern(example.pattern);
                setText(example.text);
                setFlags(example.flags ?? 'g');
                setReplacement(example.replacement ?? '');
              }}
            >
              {example.name}
            </Button>
          ))}
        </div>
      </section>
    </Card>
  );
}
