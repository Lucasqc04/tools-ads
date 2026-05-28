'use client';

import { useCallback, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { AppLocale } from '@/lib/i18n/config';
import {
  BUILDER_BLOCKS,
  GENERATOR_CONFIGS,
  PATTERN_LIBRARY,
  REPLACEMENT_PRESETS,
  SNIPPET_LANGUAGES,
  VALIDATION_TYPES,
  diagnoseRegex,
  explainRegex,
  extractFromText,
  generateCodeSnippet,
  generateRegex,
  testRegex,
  validateInput,
  type BuilderBlock,
  type ExtractionType,
  type GeneratorCategory,
  type PatternCategory,
  type PatternEntry,
  type RegexDiagnostic,
  type RegexMatchDetail,
  type RegexTestResult,
  type ReplacementPreset,
} from '@/lib/regex-studio';

// ─── i18n labels ─────────────────────────────────────────────────────────────

const TAB_LABELS = {
  'pt-br': { tester: 'Testar', generator: 'Gerar', builder: 'Construir', explain: 'Explicar', library: 'Biblioteca', validate: 'Validar', extract: 'Extrair', replace: 'Substituir', code: 'Código', diagnose: 'Diagnóstico' },
  en: { tester: 'Test', generator: 'Generate', builder: 'Build', explain: 'Explain', library: 'Library', validate: 'Validate', extract: 'Extract', replace: 'Replace', code: 'Code', diagnose: 'Diagnose' },
  es: { tester: 'Probar', generator: 'Generar', builder: 'Construir', explain: 'Explicar', library: 'Biblioteca', validate: 'Validar', extract: 'Extraer', replace: 'Sustituir', code: 'Código', diagnose: 'Diagnóstico' },
} as const;

type TabKey = keyof typeof TAB_LABELS['pt-br'];

const CATEGORY_LABELS: Record<PatternCategory, Record<AppLocale, string>> = {
  brasil: { 'pt-br': 'Brasil', en: 'Brazil', es: 'Brasil' },
  web: { 'pt-br': 'Web', en: 'Web', es: 'Web' },
  dev: { 'pt-br': 'Dev', en: 'Dev', es: 'Dev' },
  texto: { 'pt-br': 'Texto', en: 'Text', es: 'Texto' },
  datas: { 'pt-br': 'Datas', en: 'Dates', es: 'Fechas' },
  numeros: { 'pt-br': 'Números', en: 'Numbers', es: 'Números' },
  seguranca: { 'pt-br': 'Segurança', en: 'Security', es: 'Seguridad' },
};

// ─── Component ───────────────────────────────────────────────────────────────

type Props = Readonly<{ locale?: AppLocale }>;

export function RegexTesterTool({ locale = 'pt-br' }: Props) {
  const tabs = TAB_LABELS[locale];

  // Shared state
  const [activeTab, setActiveTab] = useState<TabKey>('tester');
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('');
  const [replacement, setReplacement] = useState('');
  const [copied, setCopied] = useState('');

  // Tester result
  const result = useMemo<RegexTestResult>(() => testRegex(pattern, flags, text, replacement), [pattern, flags, text, replacement]);
  const diagnostic = useMemo<RegexDiagnostic>(() => diagnoseRegex(pattern, flags), [pattern, flags]);

  const copyValue = useCallback(async (key: string, value: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(''), 1500);
    } catch { /* */ }
  }, []);

  const toggleFlag = (f: string) => setFlags(cur => cur.includes(f) ? cur.replace(f, '') || 'g' : cur + f);

  const loadPattern = useCallback((p: string, f: string, t: string, r?: string) => {
    setPattern(p);
    setFlags(f);
    setText(t);
    if (r !== undefined) setReplacement(r);
    setActiveTab('tester');
  }, []);

  return (
    <Card className="space-y-4">
      {/* Info bar */}
      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
        <p className="text-xs text-emerald-900">
          {locale === 'en' ? '🔒 100% local in the browser. Uses JavaScript regex engine.' : locale === 'es' ? '🔒 100% local en el navegador. Usa motor regex de JavaScript.' : '🔒 100% local no navegador. Usa motor de regex do JavaScript.'}
        </p>
      </section>

      {/* Tab bar */}
      <nav className="flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1.5">
        {(Object.keys(tabs) as TabKey[]).map(key => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${activeTab === key ? 'bg-white text-brand-700 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'}`}
          >
            {tabs[key]}
          </button>
        ))}
      </nav>

      {/* Regex input (always visible) */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-800">Regex</label>
        <div className="flex gap-2">
          <span className="flex items-center text-sm text-slate-400 font-mono">/</span>
          <Input value={pattern} onChange={e => setPattern(e.target.value)} placeholder={String.raw`\b\w+\b`} className="flex-1 font-mono text-sm" />
          <span className="flex items-center text-sm text-slate-400 font-mono">/</span>
          <Input value={flags} onChange={e => setFlags(e.target.value)} className="w-16 font-mono text-sm text-center" />
        </div>
        <div className="flex flex-wrap gap-2">
          {['g', 'i', 'm', 's', 'u', 'y'].map(f => (
            <label key={f} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-xs cursor-pointer select-none">
              <input type="checkbox" checked={flags.includes(f)} onChange={() => toggleFlag(f)} className="rounded" />
              <span className="font-mono">{f}</span>
            </label>
          ))}
        </div>
        {!result.ok && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-700">{result.error}</p>}
      </div>

      {/* Tab content */}
      {activeTab === 'tester' && <TesterPanel pattern={pattern} flags={flags} text={text} setText={setText} replacement={replacement} setReplacement={setReplacement} result={result} copied={copied} copyValue={copyValue} locale={locale} />}
      {activeTab === 'generator' && <GeneratorPanel loadPattern={loadPattern} locale={locale} />}
      {activeTab === 'builder' && <BuilderPanel pattern={pattern} setPattern={setPattern} />}
      {activeTab === 'explain' && <ExplainPanel pattern={pattern} flags={flags} />}
      {activeTab === 'library' && <LibraryPanel loadPattern={loadPattern} locale={locale} />}
      {activeTab === 'validate' && <ValidatePanel locale={locale} />}
      {activeTab === 'extract' && <ExtractPanel locale={locale} copied={copied} copyValue={copyValue} />}
      {activeTab === 'replace' && <ReplacePanel text={text} setText={setText} loadPattern={loadPattern} locale={locale} />}
      {activeTab === 'code' && <CodePanel pattern={pattern} flags={flags} locale={locale} copied={copied} copyValue={copyValue} />}
      {activeTab === 'diagnose' && <DiagnosePanel diagnostic={diagnostic} pattern={pattern} />}
    </Card>
  );
}

// ─── Tester Panel ────────────────────────────────────────────────────────────

function TesterPanel({ text, setText, replacement, setReplacement, result, copied, copyValue, locale }: {
  pattern: string; flags: string; text: string; setText: (v: string) => void;
  replacement: string; setReplacement: (v: string) => void;
  result: RegexTestResult; copied: string; copyValue: (k: string, v: string) => Promise<void>; locale: AppLocale;
}) {
  const exportJSON = () => {
    const data = result.matches.map((m, i) => ({ index: i + 1, value: m.value, start: m.indexStart, end: m.indexEnd, line: m.line, column: m.column, groups: m.groups }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    downloadBlob(blob, 'regex-matches.json');
  };
  const exportCSV = () => {
    const rows = ['index,value,start,end,line,column,groups', ...result.matches.map((m, i) => `${i + 1},"${m.value.replace(/"/g, '""')}",${m.indexStart},${m.indexEnd},${m.line},${m.column},"${m.groups.join(';')}"`)] ;
    downloadBlob(new Blob([rows.join('\n')], { type: 'text/csv' }), 'regex-matches.csv');
  };
  const exportTXT = () => {
    const lines = result.matches.map((m, i) => `${i + 1}. ${m.value} [${m.indexStart}-${m.indexEnd}] L${m.line}:C${m.column}`);
    downloadBlob(new Blob([lines.join('\n')], { type: 'text/plain' }), 'regex-matches.txt');
  };

  return (
    <div className="space-y-4">
      <label className="block space-y-1.5">
        <span className="text-sm font-semibold text-slate-800">{locale === 'en' ? 'Test text' : locale === 'es' ? 'Texto de prueba' : 'Texto de teste'}</span>
        <Textarea value={text} onChange={e => setText(e.target.value)} className="min-h-[160px] font-mono text-xs" placeholder={locale === 'en' ? 'Paste text to test against...' : 'Cole o texto para testar...'} />
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-semibold text-slate-800">Replacement {locale === 'pt-br' ? '(opcional)' : '(optional)'}</span>
        <Input value={replacement} onChange={e => setReplacement(e.target.value)} className="font-mono text-sm" placeholder="$1" />
      </label>

      {/* Stats bar */}
      {result.ok && text && (
        <div className="flex flex-wrap gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
          <span><strong>{result.totalMatches}</strong> {locale === 'en' ? 'matches' : 'matches'}</span>
          <span className="text-slate-300">|</span>
          <span>{result.executionMs.toFixed(1)}ms</span>
          {result.executionMs > 100 && <span className="text-amber-600">⚠️ {locale === 'en' ? 'Slow regex' : 'Regex lenta'}</span>}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => copyValue('regex', result.regexPreview)}>{copied === 'regex' ? '✓' : locale === 'en' ? 'Copy regex' : 'Copiar regex'}</Button>
        <Button variant="secondary" onClick={() => { const l = result.matches.map((m, i) => `${i + 1}. ${m.value}`).join('\n'); void copyValue('results', l); }}>{copied === 'results' ? '✓' : locale === 'en' ? 'Copy matches' : 'Copiar matches'}</Button>
        <Button variant="ghost" onClick={exportJSON}>JSON</Button>
        <Button variant="ghost" onClick={exportCSV}>CSV</Button>
        <Button variant="ghost" onClick={exportTXT}>TXT</Button>
        <Button variant="ghost" onClick={() => { setText(''); setReplacement(''); }}>{locale === 'en' ? 'Clear' : 'Limpar'}</Button>
      </div>

      {/* Highlight */}
      {text && (
        <section className="space-y-1.5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-slate-800">{locale === 'en' ? 'Match highlight' : 'Destaque dos matches'}</h3>
          <div className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-slate-200 bg-white p-3 font-mono text-xs text-slate-800" dangerouslySetInnerHTML={{ __html: result.highlightedText }} />
        </section>
      )}

      {/* Matches table */}
      {result.matches.length > 0 && (
        <section className="space-y-1.5 rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-800">{locale === 'en' ? 'Matches' : 'Resultados'}: {result.totalMatches}</h3>
          <div className="max-h-72 overflow-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-slate-50 text-left text-slate-600">
                <tr><th className="px-2 py-1">#</th><th className="px-2 py-1">Match</th><th className="px-2 py-1">{locale === 'en' ? 'Position' : 'Posição'}</th><th className="px-2 py-1">{locale === 'en' ? 'Line:Col' : 'Lin:Col'}</th><th className="px-2 py-1">{locale === 'en' ? 'Groups' : 'Grupos'}</th><th className="px-2 py-1" /></tr>
              </thead>
              <tbody>
                {result.matches.map((m, i) => (
                  <tr key={`${m.indexStart}-${i}`} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-2 py-1 text-slate-400">{i + 1}</td>
                    <td className="px-2 py-1 font-mono text-slate-900 break-all max-w-[200px]">{m.value || '(vazio)'}</td>
                    <td className="px-2 py-1 text-slate-500">{m.indexStart}–{m.indexEnd}</td>
                    <td className="px-2 py-1 text-slate-500">{m.line}:{m.column}</td>
                    <td className="px-2 py-1 text-slate-600 font-mono">{m.groups.length > 0 ? m.groups.join(', ') : '—'}</td>
                    <td className="px-2 py-1"><button type="button" onClick={() => void navigator.clipboard.writeText(m.value)} className="text-slate-400 hover:text-slate-700">⎘</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Replacement preview */}
      {replacement && text && (
        <section className="space-y-1.5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">{locale === 'en' ? 'Replacement preview' : 'Preview de substituição'}</h3>
            <Button variant="ghost" className="h-6 text-[10px]" onClick={() => void copyValue('replaced', result.replacedText)}>{copied === 'replaced' ? '✓' : '⎘'}</Button>
          </div>
          <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-all rounded-lg border border-slate-200 bg-white p-3 font-mono text-xs text-slate-800">{result.replacedText}</pre>
        </section>
      )}
    </div>
  );
}

// ─── Generator Panel ─────────────────────────────────────────────────────────

function GeneratorPanel({ loadPattern, locale }: { loadPattern: (p: string, f: string, t: string) => void; locale: AppLocale }) {
  const [selectedCat, setSelectedCat] = useState<GeneratorCategory>('email');
  const [selectedOpts, setSelectedOpts] = useState<string[]>(() => {
    const cfg = GENERATOR_CONFIGS.find(c => c.category === 'email');
    return cfg?.options.filter(o => o.default).map(o => o.id) ?? [];
  });

  const config = GENERATOR_CONFIGS.find(c => c.category === selectedCat);
  const generated = useMemo(() => generateRegex(selectedCat, selectedOpts), [selectedCat, selectedOpts]);

  const handleCatChange = (cat: GeneratorCategory) => {
    setSelectedCat(cat);
    const cfg = GENERATOR_CONFIGS.find(c => c.category === cat);
    setSelectedOpts(cfg?.options.filter(o => o.default).map(o => o.id) ?? []);
  };

  const toggleOpt = (id: string) => setSelectedOpts(cur => cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-800">{locale === 'en' ? 'What do you want to find?' : 'O que você quer encontrar?'}</label>
        <div className="flex flex-wrap gap-1.5">
          {GENERATOR_CONFIGS.map(cfg => (
            <button key={cfg.category} type="button" onClick={() => handleCatChange(cfg.category)} className={`rounded-lg border px-2.5 py-1 text-xs transition-colors ${selectedCat === cfg.category ? 'border-brand-300 bg-brand-50 text-brand-800 font-medium' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>
              {cfg.label}
            </button>
          ))}
        </div>
      </div>

      {config && (
        <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-semibold text-slate-800">{locale === 'en' ? 'Options' : 'Opções'}: {config.label}</h4>
          <div className="flex flex-wrap gap-2">
            {config.options.map(opt => (
              <label key={opt.id} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs cursor-pointer">
                <input type="checkbox" checked={selectedOpts.includes(opt.id)} onChange={() => toggleOpt(opt.id)} className="rounded" />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Generated result */}
      <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
        <h4 className="text-sm font-semibold text-slate-800">{locale === 'en' ? 'Generated regex' : 'Regex gerada'}</h4>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs break-all text-slate-900">/{generated.pattern}/{generated.flags}</div>
        {generated.explanation && <p className="text-xs text-slate-600">{generated.explanation}</p>}
        {generated.limitations && <p className="text-xs text-amber-600">⚠️ {generated.limitations}</p>}
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-2">
          <span className="text-[10px] uppercase text-slate-500 font-medium">{locale === 'en' ? 'Test text' : 'Texto de teste'}</span>
          <p className="font-mono text-xs text-slate-700 mt-0.5">{generated.testText}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => loadPattern(generated.pattern, generated.flags, generated.testText)}>{locale === 'en' ? 'Use in tester' : 'Usar no testador'}</Button>
          <Button variant="secondary" onClick={() => void navigator.clipboard.writeText(generated.pattern)}>{locale === 'en' ? 'Copy' : 'Copiar'}</Button>
        </div>
      </section>
    </div>
  );
}

// ─── Builder Panel ───────────────────────────────────────────────────────────

function BuilderPanel({ pattern, setPattern }: { pattern: string; setPattern: (v: string) => void }) {
  const groups = useMemo(() => {
    const map = new Map<string, BuilderBlock[]>();
    for (const b of BUILDER_BLOCKS) {
      if (!map.has(b.group)) map.set(b.group, []);
      map.get(b.group)!.push(b);
    }
    return map;
  }, []);

  const insertBlock = (block: BuilderBlock) => setPattern(pattern + block.insert);

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-600">Clique nos blocos para adicionar à regex atual.</p>
      {Array.from(groups.entries()).map(([group, blocks]) => (
        <div key={group} className="space-y-1.5">
          <h4 className="text-xs font-semibold text-slate-700 uppercase">{group}</h4>
          <div className="flex flex-wrap gap-1.5">
            {blocks.map(b => (
              <button key={b.id} type="button" title={b.description} onClick={() => insertBlock(b)} className="rounded-lg border border-slate-200 bg-white px-2 py-1 font-mono text-xs text-slate-800 hover:border-brand-300 hover:bg-brand-50 transition-colors">
                {b.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <span className="text-[10px] uppercase text-slate-500 font-medium">Regex atual</span>
        <p className="font-mono text-sm text-slate-900 mt-1 break-all">{pattern || '(vazia)'}</p>
      </div>

      <Button variant="ghost" onClick={() => setPattern('')}>Limpar regex</Button>
    </div>
  );
}

// ─── Explain Panel ───────────────────────────────────────────────────────────

function ExplainPanel({ pattern, flags }: { pattern: string; flags: string }) {
  const tokens = useMemo(() => explainRegex(pattern), [pattern]);

  if (!pattern) return <p className="text-xs text-slate-500">Digite uma regex para ver a explicação.</p>;

  return (
    <div className="space-y-4">
      <section className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
        <h4 className="text-sm font-semibold text-slate-800">Explicação token a token</h4>
        <div className="space-y-1">
          {tokens.map((t, i) => (
            <div key={i} className="flex items-baseline gap-3 rounded-lg bg-slate-50 px-3 py-1.5">
              <span className="font-mono text-xs font-bold text-brand-700 min-w-[60px]">{t.token}</span>
              <span className="text-xs text-slate-700">{t.description}</span>
            </div>
          ))}
        </div>
      </section>

      {flags && (
        <section className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-semibold text-slate-800">Flags ativas</h4>
          <div className="flex flex-wrap gap-2">
            {flags.split('').map(f => (
              <span key={f} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs">
                <strong className="font-mono">{f}</strong> — {getFlagDescription(f)}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function getFlagDescription(f: string): string {
  const map: Record<string, string> = { g: 'global (todos os matches)', i: 'case insensitive', m: 'multilinha (^ e $ por linha)', s: 'dotAll (. inclui \\n)', u: 'unicode', y: 'sticky' };
  return map[f] ?? '';
}

// ─── Library Panel ───────────────────────────────────────────────────────────

function LibraryPanel({ loadPattern, locale }: { loadPattern: (p: string, f: string, t: string) => void; locale: AppLocale }) {
  const [filter, setFilter] = useState('');
  const [activeCat, setActiveCat] = useState<PatternCategory | 'all'>('all');

  const filtered = useMemo(() => {
    let list = PATTERN_LIBRARY;
    if (activeCat !== 'all') list = list.filter(p => p.category === activeCat);
    if (filter) list = list.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()) || p.description.toLowerCase().includes(filter.toLowerCase()));
    return list;
  }, [activeCat, filter]);

  return (
    <div className="space-y-4">
      <Input value={filter} onChange={e => setFilter(e.target.value)} placeholder={locale === 'en' ? 'Search patterns...' : 'Buscar padrões...'} className="text-sm" />

      <div className="flex flex-wrap gap-1.5">
        <button type="button" onClick={() => setActiveCat('all')} className={`rounded-lg border px-2.5 py-1 text-xs ${activeCat === 'all' ? 'border-brand-300 bg-brand-50 text-brand-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
          {locale === 'en' ? 'All' : 'Todos'}
        </button>
        {(Object.keys(CATEGORY_LABELS) as PatternCategory[]).map(cat => (
          <button key={cat} type="button" onClick={() => setActiveCat(cat)} className={`rounded-lg border px-2.5 py-1 text-xs ${activeCat === cat ? 'border-brand-300 bg-brand-50 text-brand-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {CATEGORY_LABELS[cat][locale]}
          </button>
        ))}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {filtered.map(p => (
          <PatternCard key={p.id} entry={p} onUse={() => loadPattern(p.pattern, p.flags, p.testText)} locale={locale} />
        ))}
      </div>
      {filtered.length === 0 && <p className="text-xs text-slate-500">{locale === 'en' ? 'No patterns found.' : 'Nenhum padrão encontrado.'}</p>}
    </div>
  );
}

function PatternCard({ entry, onUse, locale }: { entry: PatternEntry; onUse: () => void; locale: AppLocale }) {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-1.5">
      <div className="flex items-center justify-between">
        <h5 className="text-xs font-semibold text-slate-800">{entry.name}</h5>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">{CATEGORY_LABELS[entry.category][locale]}</span>
      </div>
      <p className="text-[11px] text-slate-600">{entry.description}</p>
      <div className="rounded-lg bg-slate-50 px-2 py-1 font-mono text-[11px] text-slate-800 break-all">/{entry.pattern}/{entry.flags}</div>
      {showDetails && (
        <div className="space-y-1 text-[11px]">
          <p className="text-slate-600">{entry.explanation}</p>
          {entry.limitations && <p className="text-amber-600">⚠️ {entry.limitations}</p>}
          <p className="font-mono text-slate-500">{entry.testText}</p>
        </div>
      )}
      <div className="flex gap-1.5">
        <Button variant="ghost" className="h-6 text-[10px]" onClick={onUse}>{locale === 'en' ? 'Use' : 'Usar'}</Button>
        <Button variant="ghost" className="h-6 text-[10px]" onClick={() => void navigator.clipboard.writeText(entry.pattern)}>⎘</Button>
        <Button variant="ghost" className="h-6 text-[10px]" onClick={() => setShowDetails(!showDetails)}>{showDetails ? '▲' : '▼'}</Button>
      </div>
    </div>
  );
}

// ─── Validate Panel ──────────────────────────────────────────────────────────

function ValidatePanel({ locale }: { locale: AppLocale }) {
  const [type, setType] = useState<(typeof VALIDATION_TYPES)[number]>('email');
  const [input, setInput] = useState('');

  const result = useMemo(() => input ? validateInput(input, type) : null, [input, type]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-800">{locale === 'en' ? 'Validation type' : 'Tipo de validação'}</label>
        <div className="flex flex-wrap gap-1.5">
          {VALIDATION_TYPES.map(t => (
            <button key={t} type="button" onClick={() => { setType(t); setInput(''); }} className={`rounded-lg border px-2.5 py-1 text-xs capitalize ${type === t ? 'border-brand-300 bg-brand-50 text-brand-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <Input value={input} onChange={e => setInput(e.target.value)} placeholder={locale === 'en' ? 'Type value to validate...' : 'Digite o valor para validar...'} className="font-mono text-sm" />

      {result && (
        <section className={`rounded-xl border p-4 space-y-2 ${result.valid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <div className="flex items-center gap-2">
            <span className="text-lg">{result.valid ? '✅' : '❌'}</span>
            <span className={`text-sm font-semibold ${result.valid ? 'text-green-800' : 'text-red-800'}`}>{result.valid ? (locale === 'en' ? 'Valid' : 'Válido') : (locale === 'en' ? 'Invalid' : 'Inválido')}</span>
          </div>
          <p className="text-xs text-slate-700">{result.reason}</p>
          <div className="text-[11px] text-slate-500 font-mono">Regex: {result.regexUsed}</div>
          <div className="text-[11px] text-slate-500">{locale === 'en' ? 'Example' : 'Exemplo'}: <span className="font-mono">{result.example}</span></div>
        </section>
      )}
    </div>
  );
}

// ─── Extract Panel ───────────────────────────────────────────────────────────

function ExtractPanel({ locale, copied, copyValue }: { locale: AppLocale; copied: string; copyValue: (k: string, v: string) => Promise<void> }) {
  const [extractText, setExtractText] = useState('');
  const [extractType, setExtractType] = useState<ExtractionType>('emails');
  const [removeDups, setRemoveDups] = useState(false);
  const [sortResults, setSortResults] = useState(false);

  let results = useMemo(() => extractText ? extractFromText(extractText, extractType) : [], [extractText, extractType]);
  if (removeDups) results = [...new Set(results)];
  if (sortResults) results = [...results].sort();

  const download = (format: 'json' | 'csv' | 'txt') => {
    let content: string;
    if (format === 'json') content = JSON.stringify(results, null, 2);
    else if (format === 'csv') content = results.map(r => `"${r.replace(/"/g, '""')}"`).join('\n');
    else content = results.join('\n');
    downloadBlob(new Blob([content], { type: 'text/plain' }), `extracted.${format}`);
  };

  const EXTRACT_TYPES: { id: ExtractionType; label: string }[] = [
    { id: 'emails', label: 'E-mails' },
    { id: 'links', label: 'Links' },
    { id: 'telefones', label: 'Telefones' },
    { id: 'cpfs', label: 'CPFs' },
    { id: 'cnpjs', label: 'CNPJs' },
    { id: 'hashtags', label: 'Hashtags' },
    { id: 'mencoes', label: 'Menções' },
    { id: 'datas', label: locale === 'en' ? 'Dates' : 'Datas' },
    { id: 'numeros', label: locale === 'en' ? 'Numbers' : 'Números' },
    { id: 'valores-monetarios', label: locale === 'en' ? 'Currency' : 'Valores R$' },
  ];

  return (
    <div className="space-y-4">
      <Textarea value={extractText} onChange={e => setExtractText(e.target.value)} className="min-h-[140px] font-mono text-xs" placeholder={locale === 'en' ? 'Paste text to extract from...' : 'Cole o texto para extrair dados...'} />

      <div className="flex flex-wrap gap-1.5">
        {EXTRACT_TYPES.map(t => (
          <button key={t.id} type="button" onClick={() => setExtractType(t.id)} className={`rounded-lg border px-2.5 py-1 text-xs ${extractType === t.id ? 'border-brand-300 bg-brand-50 text-brand-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <label className="inline-flex items-center gap-1.5 text-xs cursor-pointer">
          <input type="checkbox" checked={removeDups} onChange={e => setRemoveDups(e.target.checked)} className="rounded" />
          {locale === 'en' ? 'Remove duplicates' : 'Remover duplicados'}
        </label>
        <label className="inline-flex items-center gap-1.5 text-xs cursor-pointer">
          <input type="checkbox" checked={sortResults} onChange={e => setSortResults(e.target.checked)} className="rounded" />
          {locale === 'en' ? 'Sort' : 'Ordenar'}
        </label>
      </div>

      {results.length > 0 && (
        <section className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-800">{results.length} {locale === 'en' ? 'found' : 'encontrados'}</h4>
            <div className="flex gap-1.5">
              <Button variant="ghost" className="h-6 text-[10px]" onClick={() => void copyValue('extract', results.join('\n'))}>{copied === 'extract' ? '✓' : '⎘'}</Button>
              <Button variant="ghost" className="h-6 text-[10px]" onClick={() => download('json')}>JSON</Button>
              <Button variant="ghost" className="h-6 text-[10px]" onClick={() => download('csv')}>CSV</Button>
              <Button variant="ghost" className="h-6 text-[10px]" onClick={() => download('txt')}>TXT</Button>
            </div>
          </div>
          <ul className="max-h-64 overflow-auto space-y-0.5 text-xs font-mono text-slate-800">
            {results.map((r, i) => <li key={i} className="rounded bg-slate-50 px-2 py-0.5">{r}</li>)}
          </ul>
        </section>
      )}
    </div>
  );
}

// ─── Replace Panel ───────────────────────────────────────────────────────────

function ReplacePanel({ text, setText, loadPattern, locale }: { text: string; setText: (v: string) => void; loadPattern: (p: string, f: string, t: string, r?: string) => void; locale: AppLocale }) {
  const [previewText, setPreviewText] = useState('');
  const [activePreset, setActivePreset] = useState<ReplacementPreset | null>(null);

  const preview = useMemo(() => {
    if (!activePreset || !previewText) return '';
    try {
      const regex = new RegExp(activePreset.pattern, activePreset.flags);
      return previewText.replace(regex, activePreset.replacement);
    } catch { return previewText; }
  }, [activePreset, previewText]);

  const count = useMemo(() => {
    if (!activePreset || !previewText) return 0;
    try {
      const regex = new RegExp(activePreset.pattern, activePreset.flags);
      return (previewText.match(regex) ?? []).length;
    } catch { return 0; }
  }, [activePreset, previewText]);

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-slate-800">{locale === 'en' ? 'Replacement presets' : 'Presets de substituição'}</h4>
      <div className="grid gap-1.5 sm:grid-cols-2">
        {REPLACEMENT_PRESETS.map(p => (
          <button key={p.id} type="button" onClick={() => { setActivePreset(p); if (!previewText && text) setPreviewText(text); }} className={`rounded-lg border p-2 text-left text-xs transition-colors ${activePreset?.id === p.id ? 'border-brand-300 bg-brand-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
            <span className="font-medium text-slate-800">{p.name}</span>
            <p className="text-[10px] text-slate-500 mt-0.5">{p.description}</p>
          </button>
        ))}
      </div>

      {activePreset && (
        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs font-mono text-slate-700">
            <span className="text-slate-500">Pattern:</span> /{activePreset.pattern}/{activePreset.flags}
            <br /><span className="text-slate-500">Replace:</span> {JSON.stringify(activePreset.replacement)}
          </div>

          <Textarea value={previewText} onChange={e => setPreviewText(e.target.value)} className="min-h-[100px] font-mono text-xs" placeholder={locale === 'en' ? 'Paste text to transform...' : 'Cole texto para transformar...'} />

          {previewText && (
            <>
              <p className="text-xs text-slate-600">{count} {locale === 'en' ? 'replacements' : 'substituições'}</p>
              <div className="grid gap-2 lg:grid-cols-2">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-slate-500 font-medium">{locale === 'en' ? 'Before' : 'Antes'}</span>
                  <pre className="max-h-40 overflow-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-white p-2 font-mono text-[11px] text-slate-800">{previewText}</pre>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-slate-500 font-medium">{locale === 'en' ? 'After' : 'Depois'}</span>
                  <pre className="max-h-40 overflow-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-white p-2 font-mono text-[11px] text-slate-800">{preview}</pre>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => void navigator.clipboard.writeText(preview)}>{locale === 'en' ? 'Copy result' : 'Copiar resultado'}</Button>
                <Button variant="ghost" onClick={() => { setText(preview); loadPattern(activePreset.pattern, activePreset.flags, preview, activePreset.replacement); }}>{locale === 'en' ? 'Use in tester' : 'Usar no testador'}</Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Code Panel ──────────────────────────────────────────────────────────────

function CodePanel({ pattern, flags, locale, copied, copyValue }: { pattern: string; flags: string; locale: AppLocale; copied: string; copyValue: (k: string, v: string) => Promise<void> }) {
  const [lang, setLang] = useState<(typeof SNIPPET_LANGUAGES)[number]['id']>('javascript');
  const [mode, setMode] = useState<'test' | 'extract' | 'replace'>('test');

  const snippet = useMemo(() => pattern ? generateCodeSnippet(lang, pattern, flags, mode) : '', [lang, pattern, flags, mode]);

  const MODES = [
    { id: 'test' as const, label: locale === 'en' ? 'Test match' : 'Testar match' },
    { id: 'extract' as const, label: locale === 'en' ? 'Extract matches' : 'Extrair matches' },
    { id: 'replace' as const, label: locale === 'en' ? 'Replace' : 'Substituir' },
  ];

  return (
    <div className="space-y-4">
      {!pattern && <p className="text-xs text-slate-500">{locale === 'en' ? 'Write a regex to see code snippets.' : 'Escreva uma regex para ver snippets de código.'}</p>}

      <div className="flex flex-wrap gap-1.5">
        {SNIPPET_LANGUAGES.map(l => (
          <button key={l.id} type="button" onClick={() => setLang(l.id)} className={`rounded-lg border px-2.5 py-1 text-xs ${lang === l.id ? 'border-brand-300 bg-brand-50 text-brand-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {l.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        {MODES.map(m => (
          <button key={m.id} type="button" onClick={() => setMode(m.id)} className={`rounded-lg border px-2.5 py-1 text-xs ${mode === m.id ? 'border-brand-300 bg-brand-50 text-brand-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {m.label}
          </button>
        ))}
      </div>

      {snippet && (
        <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">{SNIPPET_LANGUAGES.find(l => l.id === lang)?.label} — {MODES.find(m => m.id === mode)?.label}</span>
            <Button variant="ghost" className="h-6 text-[10px]" onClick={() => void copyValue('snippet', snippet)}>{copied === 'snippet' ? '✓' : locale === 'en' ? 'Copy' : 'Copiar'}</Button>
          </div>
          <pre className="overflow-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-white p-3 font-mono text-xs text-slate-800">{snippet}</pre>
          <p className="text-[10px] text-amber-600">⚠️ {locale === 'en' ? 'Regex may need adaptation depending on the language engine.' : 'A regex pode precisar de adaptação dependendo do motor da linguagem.'}</p>
        </div>
      )}
    </div>
  );
}

// ─── Diagnose Panel ──────────────────────────────────────────────────────────

function DiagnosePanel({ diagnostic, pattern }: { diagnostic: RegexDiagnostic; pattern: string }) {
  if (!pattern) return <p className="text-xs text-slate-500">Digite uma regex para ver o diagnóstico.</p>;

  const checks: { label: string; value: boolean; warn?: boolean }[] = [
    { label: 'Regex válida', value: diagnostic.valid },
    { label: 'Tem grupos de captura', value: diagnostic.hasGroups },
    { label: 'Tem âncoras (^, $, \\b)', value: diagnostic.hasAnchors },
    { label: 'Tem quantificadores', value: diagnostic.hasQuantifiers },
    { label: 'Usa lookahead', value: diagnostic.hasLookahead },
    { label: 'Usa lookbehind', value: diagnostic.hasLookbehind, warn: diagnostic.hasLookbehind },
    { label: 'Usa unicode', value: diagnostic.hasUnicode },
    { label: 'Aceita string vazia', value: diagnostic.acceptsEmpty, warn: diagnostic.acceptsEmpty },
    { label: 'Pode ser gananciosa', value: diagnostic.possibleGreedy, warn: diagnostic.possibleGreedy },
  ];

  return (
    <div className="space-y-4">
      <section className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
        <h4 className="text-sm font-semibold text-slate-800">Checklist</h4>
        <div className="space-y-1">
          {checks.map((c, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-1.5 text-xs">
              <span>{c.value ? (c.warn ? '⚠️' : '✅') : '⬜'}</span>
              <span className={c.warn ? 'text-amber-700' : 'text-slate-700'}>{c.label}</span>
            </div>
          ))}
        </div>
      </section>

      {diagnostic.suggestions.length > 0 && (
        <section className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h4 className="text-sm font-semibold text-amber-900">Sugestões</h4>
          <ul className="space-y-1">
            {diagnostic.suggestions.map((s, i) => (
              <li key={i} className="text-xs text-amber-800">💡 {s}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

// ─── Utility ─────────────────────────────────────────────────────────────────

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
