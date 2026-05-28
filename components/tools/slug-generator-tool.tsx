'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { AppLocale } from '@/lib/i18n/config';
import { buildSlug, createSlugSuggestions, type SlugOptions } from '@/lib/slug-generator';

type SlugGeneratorToolProps = Readonly<{ locale?: AppLocale }>;

type SlugUi = {
  localNote: string;
  originalTextLabel: string;
  urlPrefixLabel: string;
  emptySlugWarning: string;
  longSlugWarning: string;
  copied: string;
  copySlug: string;
  copyFullUrl: string;
  saveHistory: string;
  clear: string;
  suggestionsTitle: string;
  examplesTitle: string;
  localHistoryTitle: string;
};

const uiByLocale: Record<AppLocale, SlugUi> = {
  'pt-br': {
    localNote: 'Geracao local no navegador. Ideal para CMS, blog, e-commerce e rotas web.',
    originalTextLabel: 'Texto original',
    urlPrefixLabel: 'Prefixo de URL',
    emptySlugWarning: 'Slug vazio: ajuste o texto ou as configuracoes.',
    longSlugWarning: 'Slug longo. Considere reduzir para facilitar leitura.',
    copied: 'Copiado',
    copySlug: 'Copiar slug',
    copyFullUrl: 'Copiar URL completa',
    saveHistory: 'Salvar no historico',
    clear: 'Limpar',
    suggestionsTitle: 'Sugestoes',
    examplesTitle: 'Exemplos prontos',
    localHistoryTitle: 'Historico local',
  },
  en: {
    localNote: 'Local generation in browser. Useful for CMS, blogs, e-commerce, and web routes.',
    originalTextLabel: 'Original text',
    urlPrefixLabel: 'URL prefix',
    emptySlugWarning: 'Empty slug: adjust text or options.',
    longSlugWarning: 'Long slug. Consider reducing for readability.',
    copied: 'Copied',
    copySlug: 'Copy slug',
    copyFullUrl: 'Copy full URL',
    saveHistory: 'Save history',
    clear: 'Clear',
    suggestionsTitle: 'Suggestions',
    examplesTitle: 'Ready examples',
    localHistoryTitle: 'Local history',
  },
  es: {
    localNote: 'Generacion local en el navegador. Ideal para CMS, blog, e-commerce y rutas web.',
    originalTextLabel: 'Texto original',
    urlPrefixLabel: 'Prefijo de URL',
    emptySlugWarning: 'Slug vacio: ajusta texto o configuraciones.',
    longSlugWarning: 'Slug largo. Conviene reducirlo.',
    copied: 'Copiado',
    copySlug: 'Copiar slug',
    copyFullUrl: 'Copiar URL completa',
    saveHistory: 'Guardar historial',
    clear: 'Limpiar',
    suggestionsTitle: 'Sugerencias',
    examplesTitle: 'Ejemplos listos',
    localHistoryTitle: 'Historial local',
  },
};

const historyKey = 'slug-generator-history-v1';

const exampleTexts = [
  'Como criar um bom slug para URL em 2026',
  'Lançamento: Camiseta Premium Azul #Coleção',
  'Guia completo de Next.js para e-commerce',
  'Título com Acentuação e Símbolos %$#',
];

export function SlugGeneratorTool({ locale = 'pt-br' }: SlugGeneratorToolProps) {
  const ui = uiByLocale[locale];

  const [text, setText] = useState('');
  const [prefix, setPrefix] = useState('https://site.com/blog');
  const [separator, setSeparator] = useState<'-' | '_'>('-');
  const [lowercase, setLowercase] = useState(true);
  const [removeStopWords, setRemoveStopWords] = useState(false);
  const [removePunctuation, setRemovePunctuation] = useState(true);
  const [removeEmojis, setRemoveEmojis] = useState(true);
  const [maxLength, setMaxLength] = useState('80');
  const [keepWordBoundaries, setKeepWordBoundaries] = useState(true);
  const [copied, setCopied] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(historyKey);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as string[];
      setHistory(Array.isArray(parsed) ? parsed : []);
    } catch {
      setHistory([]);
    }
  }, []);

  const options: SlugOptions = {
    separator,
    lowercase,
    removeStopWords,
    maxLength: Number(maxLength) || undefined,
    keepWordBoundaries,
    removePunctuation,
    removeEmojis,
  };

  const slug = useMemo(() => buildSlug(text, options), [text, options]);
  const suggestions = useMemo(() => createSlugSuggestions(slug), [slug]);
  const fullUrl = slug ? `${prefix.replaceAll(/\/+$/g, '')}/${slug}` : '';

  const tooLong = slug.length > 72;
  const slugEmpty = slug.length === 0;
  const copySlugLabel = copied === 'slug' ? ui.copied : ui.copySlug;
  const copyUrlLabel = copied === 'url' ? ui.copied : ui.copyFullUrl;

  const copyValue = async (key: string, value: string) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(''), 1200);
    } catch {
      setCopied('');
    }
  };

  const saveHistory = () => {
    if (!slug) return;

    setHistory((current) => {
      const next = Array.from(new Set([slug, ...current])).slice(0, 20);
      localStorage.setItem(historyKey, JSON.stringify(next));
      return next;
    });
  };

  return (
    <Card className="space-y-5">
      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        {ui.localNote}
      </section>

      <label className="space-y-2">
        <span className="text-sm font-semibold text-slate-800">{ui.originalTextLabel}</span>
        <Textarea value={text} onChange={(event) => setText(event.target.value)} className="min-h-[130px]" />
      </label>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">Separador</span>
          <Select value={separator} onChange={(event) => setSeparator(event.target.value as '-' | '_')}>
            <option value="-">Hifen (-)</option>
            <option value="_">Underscore (_)</option>
          </Select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">Max length</span>
          <Input value={maxLength} onChange={(event) => setMaxLength(event.target.value)} inputMode="numeric" />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{ui.urlPrefixLabel}</span>
          <Input value={prefix} onChange={(event) => setPrefix(event.target.value)} />
        </label>
      </div>

      <div className="grid gap-2 md:grid-cols-2 text-sm text-slate-700">
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={lowercase} onChange={(event) => setLowercase(event.target.checked)} />lowercase</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={removeStopWords} onChange={(event) => setRemoveStopWords(event.target.checked)} />remove stopwords</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={removePunctuation} onChange={(event) => setRemovePunctuation(event.target.checked)} />remove punctuation</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={removeEmojis} onChange={(event) => setRemoveEmojis(event.target.checked)} />remove emojis</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={keepWordBoundaries} onChange={(event) => setKeepWordBoundaries(event.target.checked)} />keep word boundaries</label>
      </div>

      <section className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-semibold text-slate-800">Slug</h3>
        <p className="break-all rounded-lg border border-slate-200 bg-white p-3 font-mono text-xs text-slate-800">{slug || '-'}</p>
        <p className="break-all rounded-lg border border-slate-200 bg-white p-3 font-mono text-xs text-slate-800">{fullUrl || '-'}</p>

        {slugEmpty ? <p className="text-xs text-amber-700">{ui.emptySlugWarning}</p> : null}
        {tooLong ? <p className="text-xs text-amber-700">{ui.longSlugWarning}</p> : null}
      </section>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => copyValue('slug', slug)}>{copySlugLabel}</Button>
        <Button variant="secondary" onClick={() => copyValue('url', fullUrl)}>{copyUrlLabel}</Button>
        <Button variant="secondary" onClick={saveHistory}>{ui.saveHistory}</Button>
        <Button
          variant="ghost"
          onClick={() => {
            setText('');
            setCopied('');
          }}
        >
          {ui.clear}
        </Button>
      </div>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-800">{ui.suggestionsTitle}</h3>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((item) => (
            <Button key={item} variant="ghost" onClick={() => setText(item)}>{item}</Button>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-800">{ui.examplesTitle}</h3>
        <div className="flex flex-wrap gap-2">
          {exampleTexts.map((example) => (
            <Button key={example} variant="ghost" onClick={() => setText(example)}>{example.slice(0, 28)}...</Button>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-800">{ui.localHistoryTitle}</h3>
        <div className="flex flex-wrap gap-2">
          {history.map((item) => (
            <Button key={item} variant="ghost" onClick={() => setText(item)}>{item}</Button>
          ))}
        </div>
      </section>
    </Card>
  );
}
