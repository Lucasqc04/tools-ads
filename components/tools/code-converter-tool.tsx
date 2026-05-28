'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { AppLocale } from '@/lib/i18n/config';
import {
  CLASSIC_STUDY_TOPICS,
  CODE_EXAMPLES,
  SUPPORTED_LANGUAGES,
  analyzeCode,
  convertCode,
  detectLanguage,
  getFileExtension,
  getClassicStudyExampleCode,
  getLanguageLabel,
} from '@/lib/code-converter';
import type { CodeStats, ConversionResult, Language } from '@/lib/code-converter/types';

// ---------- Labels ----------

const ui = {
  title: { 'pt-br': 'Conversor Educacional de Código', en: 'Educational Code Converter', es: 'Conversor Educacional de Código' },
  from: { 'pt-br': 'Linguagem de origem', en: 'Source language', es: 'Lenguaje de origen' },
  to: { 'pt-br': 'Linguagem de destino', en: 'Target language', es: 'Lenguaje de destino' },
  convert: { 'pt-br': 'Converter', en: 'Convert', es: 'Convertir' },
  clear: { 'pt-br': 'Limpar', en: 'Clear', es: 'Limpiar' },
  copy: { 'pt-br': 'Copiar', en: 'Copy', es: 'Copiar' },
  copied: { 'pt-br': 'Copiado!', en: 'Copied!', es: '¡Copiado!' },
  download: { 'pt-br': 'Baixar', en: 'Download', es: 'Descargar' },
  examples: { 'pt-br': 'Exemplos prontos', en: 'Ready examples', es: 'Ejemplos listos' },
  sourceCode: { 'pt-br': 'Código original', en: 'Source code', es: 'Código fuente' },
  result: { 'pt-br': 'Resultado', en: 'Result', es: 'Resultado' },
  explanations: { 'pt-br': 'Explicações de sintaxe', en: 'Syntax explanations', es: 'Explicaciones de sintaxis' },
  stats: { 'pt-br': 'Análise do código', en: 'Code analysis', es: 'Análisis del código' },
  detected: { 'pt-br': 'Linguagem detectada', en: 'Detected language', es: 'Lenguaje detectado' },
  lines: { 'pt-br': 'Linhas', en: 'Lines', es: 'Líneas' },
  variables: { 'pt-br': 'Variáveis', en: 'Variables', es: 'Variables' },
  loops: { 'pt-br': 'Laços', en: 'Loops', es: 'Bucles' },
  functions: { 'pt-br': 'Funções', en: 'Functions', es: 'Funciones' },
  conditionals: { 'pt-br': 'Condicionais', en: 'Conditionals', es: 'Condicionales' },
  warnings: { 'pt-br': 'Avisos', en: 'Warnings', es: 'Avisos' },
  educational: { 'pt-br': '🎓 Conversão educacional — revise antes de compilar.', en: '🎓 Educational conversion — review before compiling.', es: '🎓 Conversión educacional — revise antes de compilar.' },
  privacy: { 'pt-br': '🔒 100% local. Nenhum código é enviado ao servidor.', en: '🔒 100% local. No code is sent to any server.', es: '🔒 100% local. Ningún código se envía al servidor.' },
  loadExample: { 'pt-br': 'Carregar', en: 'Load', es: 'Cargar' },
  basic: { 'pt-br': 'Básicos', en: 'Basic', es: 'Básicos' },
  structures: { 'pt-br': 'Estruturas', en: 'Structures', es: 'Estructuras' },
  algorithms: { 'pt-br': 'Algoritmos', en: 'Algorithms', es: 'Algoritmos' },
  recursion: { 'pt-br': 'Recursão', en: 'Recursion', es: 'Recursión' },
  'data-structures': { 'pt-br': 'Estruturas de Dados', en: 'Data Structures', es: 'Estructuras de Datos' },
  sorting: { 'pt-br': 'Ordenação', en: 'Sorting', es: 'Ordenamiento' },
  search: { 'pt-br': 'Busca', en: 'Search', es: 'Búsqueda' },
  trees: { 'pt-br': 'Árvores', en: 'Trees', es: 'Árboles' },
  swap: { 'pt-br': 'Inverter', en: 'Swap', es: 'Invertir' },
  autoDetect: { 'pt-br': 'Detectar', en: 'Detect', es: 'Detectar' },
  compileAndTest: { 'pt-br': 'Compilar e testar', en: 'Compile and test', es: 'Compilar y probar' },
  classicTopics: { 'pt-br': 'Lista clássica de estudos (livros/faculdade)', en: 'Classic study list (books/university)', es: 'Lista clásica de estudio (libros/universidad)' },
  compileHint: {
    'pt-br': 'Para validar o resultado, use o OnlineGDB (editor/compilador online) e ajuste detalhes de sintaxe quando necessário.',
    en: 'To validate the result, use OnlineGDB (online editor/compiler) and adjust syntax details when needed.',
    es: 'Para validar el resultado, use OnlineGDB (editor/compilador en línea) y ajuste detalles de sintaxis cuando sea necesario.',
  },
  searchExamples: { 'pt-br': 'Buscar exemplos', en: 'Search examples', es: 'Buscar ejemplos' },
  searchExamplesPlaceholder: {
    'pt-br': 'Ex: pilha, árvore, fibonacci...',
    en: 'Ex: stack, tree, fibonacci...',
    es: 'Ej: pila, árbol, fibonacci...',
  },
  noExamplesFound: {
    'pt-br': 'Nenhum exemplo encontrado para este filtro.',
    en: 'No examples found for this filter.',
    es: 'No se encontraron ejemplos para este filtro.',
  },
  close: { 'pt-br': 'Fechar', en: 'Close', es: 'Cerrar' },
  viewComplete: { 'pt-br': 'Ver completo', en: 'View complete', es: 'Ver completo' },
  viewStructure: { 'pt-br': 'Ver estrutura', en: 'View structure', es: 'Ver estructura' },
  useInEditor: { 'pt-br': 'Usar no editor', en: 'Use in editor', es: 'Usar en el editor' },
} as const;

function t(key: keyof typeof ui, locale: AppLocale): string {
  return ui[key][locale] ?? ui[key]['pt-br'];
}

// ---------- Component ----------

type Props = Readonly<{ locale: AppLocale }>;
type StudyMode = 'complete' | 'structure';

type ExampleModalState = {
  title: string;
  description?: string;
  category: string;
  completeCode: string;
  structureCode: string;
};

export function CodeConverterTool({ locale }: Props) {
  const [sourceCode, setSourceCode] = useState('');
  const [fromLang, setFromLang] = useState<Language>('pascal');
  const [toLang, setToLang] = useState<Language>('c');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showExplanations, setShowExplanations] = useState(true);
  const [exampleQuery, setExampleQuery] = useState('');
  const [selectedExample, setSelectedExample] = useState<ExampleModalState | null>(null);
  const [studyMode, setStudyMode] = useState<StudyMode>('complete');
  const editorTopRef = useRef<HTMLDivElement | null>(null);

  const stats = useMemo<CodeStats | null>(() => {
    if (!sourceCode.trim()) return null;
    return analyzeCode(sourceCode);
  }, [sourceCode]);

  const exampleCategories = useMemo(() => {
    const order = ['basic', 'structures', 'recursion', 'data-structures', 'algorithms', 'sorting', 'search', 'trees'];
    const categories = Array.from(new Set(CODE_EXAMPLES.map(e => e.category)));
    categories.sort((a, b) => {
      const ia = order.indexOf(a);
      const ib = order.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
    return categories;
  }, []);

  const classicCategories = useMemo(() => {
    const order = ['basic', 'structures', 'recursion', 'data-structures', 'algorithms', 'sorting', 'search', 'trees'];
    const categories = Array.from(new Set(CLASSIC_STUDY_TOPICS.map(e => e.category)));
    categories.sort((a, b) => {
      const ia = order.indexOf(a);
      const ib = order.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
    return categories;
  }, []);

  const handleConvert = useCallback(() => {
    const r = convertCode(sourceCode, fromLang, toLang);
    setResult(r);
  }, [sourceCode, fromLang, toLang]);

  const handleClear = useCallback(() => {
    setSourceCode('');
    setResult(null);
  }, []);

  const handleSwap = useCallback(() => {
    const temp = fromLang;
    setFromLang(toLang);
    setToLang(temp);
    if (result?.output) {
      setSourceCode(result.output);
      setResult(null);
    }
  }, [fromLang, toLang, result]);

  const handleAutoDetect = useCallback(() => {
    const detected = detectLanguage(sourceCode);
    if (detected) setFromLang(detected);
  }, [sourceCode]);

  const handleCopy = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    });
  }, []);

  const handleDownload = useCallback((content: string, lang: Language) => {
    const ext = getFileExtension(lang);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleLoadExample = useCallback((exampleId: string) => {
    const example = CODE_EXAMPLES.find(e => e.id === exampleId);
    if (example) {
      const completeCode = example.code[fromLang];
      const structureCode = getClassicStudyExampleCode(example.title, example.category, fromLang, 'structure');
      setSelectedExample({
        title: example.title,
        description: example.description,
        category: example.category,
        completeCode,
        structureCode,
      });
      setStudyMode('complete');
      setSourceCode(completeCode);
      setResult(null);
      editorTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [fromLang]);

  const handleLoadClassicTopic = useCallback((title: string, category: string) => {
    const completeCode = getClassicStudyExampleCode(title, category, fromLang, 'complete');
    const structureCode = getClassicStudyExampleCode(title, category, fromLang, 'structure');
    setSelectedExample({ title, category, completeCode, structureCode });
    setStudyMode('complete');
    setSourceCode(completeCode);
    setResult(null);
    editorTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [fromLang]);

  const handleUseStudyMode = useCallback((mode: StudyMode) => {
    setStudyMode(mode);
    if (!selectedExample) return;
    setSourceCode(mode === 'complete' ? selectedExample.completeCode : selectedExample.structureCode);
    setResult(null);
    editorTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [selectedExample]);

  const handleCloseExampleModal = useCallback(() => {
    setSelectedExample(null);
  }, []);

  useEffect(() => {
    if (!selectedExample) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedExample(null);
    };

    window.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedExample]);

  const query = exampleQuery.trim().toLowerCase();
  const filteredExamples = useMemo(() => {
    if (!query) return CODE_EXAMPLES;
    return CODE_EXAMPLES.filter(example =>
      example.title.toLowerCase().includes(query) ||
      example.description.toLowerCase().includes(query) ||
      example.category.toLowerCase().includes(query),
    );
  }, [query]);

  const filteredClassicTopics = useMemo(() => {
    if (!query) return CLASSIC_STUDY_TOPICS;
    return CLASSIC_STUDY_TOPICS.filter(topic =>
      topic.title.toLowerCase().includes(query) ||
      topic.category.toLowerCase().includes(query),
    );
  }, [query]);

  return (
    <Card className="space-y-6">
      {/* Language selector */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[140px]">
          <label className="mb-1.5 block text-sm font-semibold text-slate-800">{t('from', locale)}</label>
          <select
            value={fromLang}
            onChange={(e) => setFromLang(e.target.value as Language)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {SUPPORTED_LANGUAGES.map(l => (
              <option key={l} value={l}>{getLanguageLabel(l)}</option>
            ))}
          </select>
        </div>

        <Button variant="ghost" className="h-9 px-3 text-xs" onClick={handleSwap}>⇄ {t('swap', locale)}</Button>

        <div className="flex-1 min-w-[140px]">
          <label className="mb-1.5 block text-sm font-semibold text-slate-800">{t('to', locale)}</label>
          <select
            value={toLang}
            onChange={(e) => setToLang(e.target.value as Language)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {SUPPORTED_LANGUAGES.map(l => (
              <option key={l} value={l}>{getLanguageLabel(l)}</option>
            ))}
          </select>
        </div>

        <Button variant="ghost" className="h-9 px-3 text-xs" onClick={handleAutoDetect}>🔍 {t('autoDetect', locale)}</Button>
      </div>

      {/* Editor area */}
      <div ref={editorTopRef} className="grid gap-4 lg:grid-cols-2">
        {/* Source */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-800">{t('sourceCode', locale)} ({getLanguageLabel(fromLang)})</span>
            {stats?.detectedLanguage && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-800">
                {t('detected', locale)}: {getLanguageLabel(stats.detectedLanguage)}
              </span>
            )}
          </div>
          <div className="relative">
            <textarea
              value={sourceCode}
              onChange={(e) => { setSourceCode(e.target.value); setResult(null); }}
              placeholder={locale === 'en' ? 'Paste your code here...' : locale === 'es' ? 'Pegue su código aquí...' : 'Cole seu código aqui...'}
              className="min-h-[280px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50/80 p-4 font-mono text-xs leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              spellCheck={false}
            />
            <div className="absolute bottom-2 right-2 flex gap-1">
              <button type="button" onClick={() => handleCopy(sourceCode, 'source')} className="rounded bg-white/80 px-2 py-0.5 text-[10px] text-slate-500 hover:text-slate-800 border border-slate-200">
                {copiedKey === 'source' ? '✓' : '⎘'}
              </button>
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-800">{t('result', locale)} ({getLanguageLabel(toLang)})</span>
            {result?.success && (
              <div className="flex gap-1">
                <Button variant="ghost" className="h-6 px-2 text-[10px]" onClick={() => handleCopy(result.output, 'result')}>
                  {copiedKey === 'result' ? t('copied', locale) : t('copy', locale)}
                </Button>
                <Button variant="ghost" className="h-6 px-2 text-[10px]" onClick={() => handleDownload(result.output, toLang)}>
                  {t('download', locale)}
                </Button>
              </div>
            )}
          </div>
          <div className="min-h-[280px] rounded-xl border border-slate-200 bg-slate-50/80 p-4 font-mono text-xs leading-relaxed text-slate-900 overflow-auto whitespace-pre-wrap">
            {result?.success ? result.output : result?.warnings?.length ? (
              <div className="space-y-1">
                {result.warnings.map((w, i) => (
                  <p key={i} className={`text-xs ${w.severity === 'error' ? 'text-red-600' : w.severity === 'warning' ? 'text-amber-600' : 'text-slate-500'}`}>
                    {w.severity === 'error' ? '❌' : w.severity === 'warning' ? '⚠️' : 'ℹ️'} {w.message}
                  </p>
                ))}
              </div>
            ) : (
              <span className="text-slate-400">{locale === 'en' ? 'Converted code will appear here' : locale === 'es' ? 'El código convertido aparecerá aquí' : 'O código convertido aparecerá aqui'}</span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleConvert} disabled={!sourceCode.trim()}>
          {t('convert', locale)}
        </Button>
        <Button variant="secondary" onClick={handleClear}>{t('clear', locale)}</Button>
      </div>

      {/* Warnings */}
      {result && result.warnings.length > 0 && (
        <section className="space-y-1 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
          <h4 className="text-xs font-semibold text-slate-800">{t('warnings', locale)}</h4>
          {result.warnings.map((w, i) => (
            <p key={i} className={`text-xs ${w.severity === 'error' ? 'text-red-600' : w.severity === 'warning' ? 'text-amber-600' : 'text-slate-500'}`}>
              {w.severity === 'error' ? '❌' : w.severity === 'warning' ? '⚠️' : 'ℹ️'} {w.message}
            </p>
          ))}
        </section>
      )}

      {/* Explanations */}
      {result?.explanations && result.explanations.length > 0 && (
        <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
          <button type="button" className="flex w-full items-center justify-between" onClick={() => setShowExplanations(!showExplanations)}>
            <h4 className="text-sm font-semibold text-slate-800">{t('explanations', locale)}</h4>
            <span className="text-xs text-slate-500">{showExplanations ? '▲' : '▼'}</span>
          </button>
          {showExplanations && (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {result.explanations.map((exp, i) => (
                <div key={i} className="rounded-lg border border-slate-200 bg-white p-3 space-y-1">
                  <div className="flex gap-2 text-[11px] font-mono">
                    <span className="rounded bg-blue-100 px-1.5 py-0.5 text-blue-800">{exp.sourceCode}</span>
                    <span className="text-slate-400">→</span>
                    <span className="rounded bg-green-100 px-1.5 py-0.5 text-green-800">{exp.targetCode}</span>
                  </div>
                  <p className="text-[11px] text-slate-600">{exp.explanation}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Stats */}
      {stats && (
        <section className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
          <h4 className="text-sm font-semibold text-slate-800">{t('stats', locale)}</h4>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            <StatBadge label={t('lines', locale)} value={stats.lines} />
            <StatBadge label={t('variables', locale)} value={stats.variables} />
            <StatBadge label={t('loops', locale)} value={stats.loops} />
            <StatBadge label={t('functions', locale)} value={stats.functions} />
            <StatBadge label={t('conditionals', locale)} value={stats.conditionals} />
          </div>
        </section>
      )}

      {/* Examples */}
      <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
        <div className="space-y-1">
          <label htmlFor="examples-search" className="block text-xs font-semibold text-slate-700">{t('searchExamples', locale)}</label>
          <input
            id="examples-search"
            value={exampleQuery}
            onChange={(e) => setExampleQuery(e.target.value)}
            placeholder={t('searchExamplesPlaceholder', locale)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <h4 className="text-sm font-semibold text-slate-800">{t('examples', locale)}</h4>
        <div className="space-y-2">
          {exampleCategories.map(cat => {
            const examples = filteredExamples.filter(e => e.category === cat);
            if (examples.length === 0) return null;
            return (
              <div key={cat}>
                <span className="text-[10px] font-medium uppercase text-slate-500">{getCategoryLabel(cat, locale)}</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {examples.map(ex => (
                    <button
                      key={ex.id}
                      type="button"
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-700 hover:border-brand-300 hover:bg-brand-50 transition-colors"
                      onClick={() => handleLoadExample(ex.id)}
                      title={ex.description}
                    >
                      {ex.title}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
          {filteredExamples.length === 0 && (
            <p className="text-xs text-slate-500">{t('noExamplesFound', locale)}</p>
          )}
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
        <h4 className="text-sm font-semibold text-slate-800">{t('classicTopics', locale)}</h4>
        <div className="space-y-2">
          {classicCategories.map(cat => {
            const topics = filteredClassicTopics.filter(topic => topic.category === cat);
            if (topics.length === 0) return null;
            return (
              <div key={`classic-${cat}`}>
                <span className="text-[10px] font-medium uppercase text-slate-500">{getCategoryLabel(cat, locale)}</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {topics.map(topic => (
                    <button
                      key={topic.title}
                      type="button"
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-700 hover:border-brand-300 hover:bg-brand-50 transition-colors"
                      onClick={() => handleLoadClassicTopic(topic.title, topic.category)}
                    >
                      {topic.title}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
          {filteredClassicTopics.length === 0 && (
            <p className="text-xs text-slate-500">{t('noExamplesFound', locale)}</p>
          )}
        </div>
      </section>

      {selectedExample && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4" onClick={handleCloseExampleModal}>
          <div
            className="w-full max-w-4xl rounded-xl border border-slate-200 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 p-4">
              <div>
                <h5 className="text-base font-semibold text-slate-900">{selectedExample.title}</h5>
                {selectedExample.description && (
                  <p className="mt-1 text-xs text-slate-600">{selectedExample.description}</p>
                )}
                <p className="mt-1 text-[11px] uppercase text-slate-500">{getCategoryLabel(selectedExample.category, locale)}</p>
              </div>
              <button
                type="button"
                onClick={handleCloseExampleModal}
                className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
              >
                {t('close', locale)}
              </button>
            </div>
            <div className="space-y-3 p-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={studyMode === 'complete' ? 'primary' : 'secondary'}
                  className="h-8 px-3 text-xs"
                  onClick={() => handleUseStudyMode('complete')}
                >
                  {t('viewComplete', locale)}
                </Button>
                <Button
                  type="button"
                  variant={studyMode === 'structure' ? 'primary' : 'secondary'}
                  className="h-8 px-3 text-xs"
                  onClick={() => handleUseStudyMode('structure')}
                >
                  {t('viewStructure', locale)}
                </Button>
              </div>
              <pre className="max-h-[55vh] overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-[11px] leading-relaxed text-slate-800 whitespace-pre-wrap">
                {studyMode === 'complete' ? selectedExample.completeCode : selectedExample.structureCode}
              </pre>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={handleCloseExampleModal} className="h-8 px-3 text-xs">
                  {t('close', locale)}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    handleUseStudyMode(studyMode);
                    handleCloseExampleModal();
                  }}
                  className="h-8 px-3 text-xs"
                >
                  {t('useInEditor', locale)}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="space-y-1">
        <p className="text-xs text-slate-500">{t('educational', locale)}</p>
        <p className="text-xs text-slate-500">{t('privacy', locale)}</p>
        <p className="text-xs text-slate-500">
          {t('compileAndTest', locale)}:{' '}
          <a
            href="https://www.onlinegdb.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-700 underline underline-offset-2 hover:text-brand-900"
          >
            OnlineGDB
          </a>
          {' — '}
          {t('compileHint', locale)}
        </p>
      </div>
    </Card>
  );
}

// ---------- Stat Badge ----------

function StatBadge({ label, value }: Readonly<{ label: string; value: number }>) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2 text-center">
      <p className="text-lg font-bold text-slate-900">{value}</p>
      <p className="text-[10px] text-slate-500">{label}</p>
    </div>
  );
}

function getCategoryLabel(category: string, locale: AppLocale): string {
  const normalized = category.toLowerCase();
  if (normalized in ui) {
    return t(normalized as keyof typeof ui, locale);
  }
  return category
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}
