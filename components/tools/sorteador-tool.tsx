'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  buildRangeItems,
  detectNumericOnlyItems,
  drawPickerResults,
  parsePickerItems,
  separatorLabelOrder,
  simulatePickerDistribution,
  type ParsedPickerItem,
  type PickerDrawMode,
  type PickerSeparatorMode,
} from '@/lib/random-picker';
import { type AppLocale } from '@/lib/i18n/config';

type SorteadorToolProps = Readonly<{
  locale?: AppLocale;
}>;

type Ui = {
  title: string;
  intro: string;
  sourceTitle: string;
  sourcePlaceholder: string;
  pasteClipboard: string;
  clearInput: string;
  separatorLabel: string;
  autoSeparator: string;
  separatorNames: Record<Exclude<PickerSeparatorMode, 'auto'>, string>;
  optionsTitle: string;
  dedupe: string;
  trimSpaces: string;
  ignoreEmpty: string;
  parseWeights: string;
  manualModeToggle: string;
  manualModeTitle: string;
  manualInputPlaceholder: string;
  manualAdd: string;
  manualListEmpty: string;
  moveUp: string;
  moveDown: string;
  remove: string;
  drawConfigTitle: string;
  drawModeLabel: string;
  drawModeSimple: string;
  drawModeNoRepeat: string;
  drawModeRepeat: string;
  drawModeShuffle: string;
  resultCountLabel: string;
  delayLabel: string;
  delayInstant: string;
  delay3: string;
  delay5: string;
  delay10: string;
  rouletteToggle: string;
  weightedToggle: string;
  shuffleBeforeDraw: string;
  avoidPreviousWinners: string;
  drawButton: string;
  drawingButton: string;
  invalidDraw: string;
  parsedSummary: string;
  detectedSeparatorLabel: string;
  noItemsHint: string;
  numericModeTitle: string;
  rangeStartLabel: string;
  rangeEndLabel: string;
  rangeButton: string;
  resultTitle: string;
  noResult: string;
  winnerLabel: string;
  copyResult: string;
  copyOrdered: string;
  downloadCsv: string;
  shareLink: string;
  copied: string;
  fairnessTitle: string;
  fairnessSeed: string;
  fairnessAlgorithm: string;
  simulationTitle: string;
  simulationDescription: string;
  simulateButton: string;
  simulationHits: string;
  simulationShare: string;
  localNote: string;
  copyError: string;
  shareError: string;
};

const uiByLocale: Record<AppLocale, Ui> = {
  'pt-br': {
    title: 'Sorteador Online Completo (nomes, numeros e roleta)',
    intro:
      'Cole qualquer lista, detecte separadores automaticamente, sorteie com ou sem repeticao, use roleta visual e compartilhe o resultado por link.',
    sourceTitle: 'Cole ou digite os itens para sortear',
    sourcePlaceholder:
      'Ex:\nJoao, Maria, Pedro\nou\n1 2 3 4 5\nou\nitem1 | item2 | item3\nou\num por linha',
    pasteClipboard: 'Colar da area de transferencia',
    clearInput: 'Limpar lista',
    separatorLabel: 'Separador de itens',
    autoSeparator: 'Detectar automaticamente',
    separatorNames: {
      newline: 'Quebra de linha',
      comma: 'Virgula (,)',
      space: 'Espaco',
      tab: 'Tab',
      dot: 'Ponto (.)',
      pipe: 'Pipe (|)',
      slash: 'Barra (/)',
      semicolon: 'Ponto e virgula (;)',
    },
    optionsTitle: 'Limpeza e preparo da lista',
    dedupe: 'Remover duplicados',
    trimSpaces: 'Remover espacos extras',
    ignoreEmpty: 'Ignorar itens vazios',
    parseWeights: 'Ler pesos (ex: Joao (2x), Maria x1)',
    manualModeToggle: 'Adicionar itens manualmente',
    manualModeTitle: 'Lista manual editavel',
    manualInputPlaceholder: 'Digite um item e clique em adicionar...',
    manualAdd: 'Adicionar',
    manualListEmpty: 'Nenhum item manual ainda.',
    moveUp: 'Subir',
    moveDown: 'Descer',
    remove: 'Remover',
    drawConfigTitle: 'Configuracoes do sorteio',
    drawModeLabel: 'Tipo de sorteio',
    drawModeSimple: 'Aleatorio simples (1 resultado)',
    drawModeNoRepeat: 'Sem repeticao',
    drawModeRepeat: 'Com repeticao',
    drawModeShuffle: 'Ordem aleatoria completa (shuffle)',
    resultCountLabel: 'Quantidade de resultados',
    delayLabel: 'Tempo de suspense',
    delayInstant: 'Instantaneo',
    delay3: '3 segundos',
    delay5: '5 segundos',
    delay10: '10 segundos',
    rouletteToggle: 'Ativar modo roleta visual',
    weightedToggle: 'Aplicar pesos no sorteio',
    shuffleBeforeDraw: 'Embaralhar pool antes de sortear',
    avoidPreviousWinners: 'Evitar repetir nomes ja sorteados',
    drawButton: 'Sortear agora',
    drawingButton: 'Sorteando...',
    invalidDraw: 'Adicione pelo menos um item valido para sortear.',
    parsedSummary: 'Itens validos na pool',
    detectedSeparatorLabel: 'Separador detectado',
    noItemsHint: 'Nenhum item valido encontrado. Ajuste a lista ou separador.',
    numericModeTitle: 'Modo numeros (detecao automatica)',
    rangeStartLabel: 'Inicio do intervalo',
    rangeEndLabel: 'Fim do intervalo',
    rangeButton: 'Gerar intervalo e substituir lista',
    resultTitle: 'Resultado do sorteio',
    noResult: 'Ainda sem resultado. Configure e clique em sortear.',
    winnerLabel: 'Resultado principal',
    copyResult: 'Copiar resultado',
    copyOrdered: 'Copiar lista ordenada',
    downloadCsv: 'Baixar CSV',
    shareLink: 'Copiar link compartilhavel',
    copied: 'Copiado',
    fairnessTitle: 'Modo justo e transparencia',
    fairnessSeed: 'Seed aleatoria',
    fairnessAlgorithm: 'Algoritmo',
    simulationTitle: 'Simulacao rapida (1000 sorteios)',
    simulationDescription:
      'Use para validar distribuicao e conferir se pesos estao funcionando como esperado.',
    simulateButton: 'Rodar simulacao',
    simulationHits: 'Ocorrencias',
    simulationShare: 'Participacao',
    localNote:
      'Processamento 100% local no navegador. Lista e resultados nao sao enviados para servidor por padrao.',
    copyError: 'Nao foi possivel copiar agora. Tente novamente.',
    shareError: 'Nao foi possivel gerar link compartilhavel neste dispositivo.',
  },
  en: {
    title: 'Complete Random Picker (names, numbers, and wheel)',
    intro:
      'Paste any list, auto-detect separators, draw with or without repetition, enable wheel mode, and share the run with a URL.',
    sourceTitle: 'Paste or type items to draw',
    sourcePlaceholder:
      'Example:\nJohn, Mary, Peter\nor\n1 2 3 4 5\nor\nitem1 | item2 | item3\nor\none item per line',
    pasteClipboard: 'Paste from clipboard',
    clearInput: 'Clear list',
    separatorLabel: 'Item separator',
    autoSeparator: 'Auto detect',
    separatorNames: {
      newline: 'New line',
      comma: 'Comma (,)',
      space: 'Space',
      tab: 'Tab',
      dot: 'Dot (.)',
      pipe: 'Pipe (|)',
      slash: 'Slash (/)',
      semicolon: 'Semicolon (;)',
    },
    optionsTitle: 'List cleanup options',
    dedupe: 'Remove duplicates',
    trimSpaces: 'Trim extra spaces',
    ignoreEmpty: 'Ignore empty items',
    parseWeights: 'Parse weights (ex: John (2x), Mary x1)',
    manualModeToggle: 'Add items manually',
    manualModeTitle: 'Editable manual list',
    manualInputPlaceholder: 'Type an item and click add...',
    manualAdd: 'Add',
    manualListEmpty: 'No manual items yet.',
    moveUp: 'Up',
    moveDown: 'Down',
    remove: 'Remove',
    drawConfigTitle: 'Draw configuration',
    drawModeLabel: 'Draw mode',
    drawModeSimple: 'Simple random (1 result)',
    drawModeNoRepeat: 'Without repetition',
    drawModeRepeat: 'With repetition',
    drawModeShuffle: 'Full random order (shuffle)',
    resultCountLabel: 'Number of results',
    delayLabel: 'Suspense time',
    delayInstant: 'Instant',
    delay3: '3 seconds',
    delay5: '5 seconds',
    delay10: '10 seconds',
    rouletteToggle: 'Enable wheel mode',
    weightedToggle: 'Use weights in draw',
    shuffleBeforeDraw: 'Shuffle pool before draw',
    avoidPreviousWinners: 'Avoid previously drawn names',
    drawButton: 'Draw now',
    drawingButton: 'Drawing...',
    invalidDraw: 'Add at least one valid item before drawing.',
    parsedSummary: 'Valid items in pool',
    detectedSeparatorLabel: 'Detected separator',
    noItemsHint: 'No valid items found. Adjust your list or separator.',
    numericModeTitle: 'Numbers mode (auto detection)',
    rangeStartLabel: 'Range start',
    rangeEndLabel: 'Range end',
    rangeButton: 'Generate range and replace list',
    resultTitle: 'Draw result',
    noResult: 'No result yet. Configure and click draw.',
    winnerLabel: 'Primary result',
    copyResult: 'Copy result',
    copyOrdered: 'Copy ordered list',
    downloadCsv: 'Download CSV',
    shareLink: 'Copy shareable link',
    copied: 'Copied',
    fairnessTitle: 'Fair mode and transparency',
    fairnessSeed: 'Random seed',
    fairnessAlgorithm: 'Algorithm',
    simulationTitle: 'Quick simulation (1000 draws)',
    simulationDescription: 'Useful to inspect distribution and validate weight behavior.',
    simulateButton: 'Run simulation',
    simulationHits: 'Hits',
    simulationShare: 'Share',
    localNote: '100% local browser processing. No automatic server upload by default.',
    copyError: 'Could not copy right now. Please try again.',
    shareError: 'Could not build shareable URL on this device.',
  },
  es: {
    title: 'Sorteador Completo (nombres, numeros y ruleta)',
    intro:
      'Pega cualquier lista, detecta separadores automaticamente, sortea con o sin repeticion, activa ruleta visual y comparte con URL.',
    sourceTitle: 'Pega o escribe los elementos para sortear',
    sourcePlaceholder:
      'Ejemplo:\nJuan, Maria, Pedro\no\n1 2 3 4 5\no\nitem1 | item2 | item3\no\nuno por linea',
    pasteClipboard: 'Pegar desde portapapeles',
    clearInput: 'Limpiar lista',
    separatorLabel: 'Separador de elementos',
    autoSeparator: 'Detectar automaticamente',
    separatorNames: {
      newline: 'Salto de linea',
      comma: 'Coma (,)',
      space: 'Espacio',
      tab: 'Tab',
      dot: 'Punto (.)',
      pipe: 'Pipe (|)',
      slash: 'Barra (/)',
      semicolon: 'Punto y coma (;)',
    },
    optionsTitle: 'Limpieza de lista',
    dedupe: 'Quitar duplicados',
    trimSpaces: 'Quitar espacios extra',
    ignoreEmpty: 'Ignorar vacios',
    parseWeights: 'Leer pesos (ej: Juan (2x), Maria x1)',
    manualModeToggle: 'Agregar elementos manualmente',
    manualModeTitle: 'Lista manual editable',
    manualInputPlaceholder: 'Escribe un elemento y pulsa agregar...',
    manualAdd: 'Agregar',
    manualListEmpty: 'Sin elementos manuales.',
    moveUp: 'Subir',
    moveDown: 'Bajar',
    remove: 'Quitar',
    drawConfigTitle: 'Configuracion del sorteo',
    drawModeLabel: 'Tipo de sorteo',
    drawModeSimple: 'Aleatorio simple (1 resultado)',
    drawModeNoRepeat: 'Sin repeticion',
    drawModeRepeat: 'Con repeticion',
    drawModeShuffle: 'Orden aleatorio completo (shuffle)',
    resultCountLabel: 'Cantidad de resultados',
    delayLabel: 'Tiempo de suspense',
    delayInstant: 'Instantaneo',
    delay3: '3 segundos',
    delay5: '5 segundos',
    delay10: '10 segundos',
    rouletteToggle: 'Activar ruleta visual',
    weightedToggle: 'Usar pesos en el sorteo',
    shuffleBeforeDraw: 'Mezclar pool antes de sortear',
    avoidPreviousWinners: 'Evitar repetir ganadores anteriores',
    drawButton: 'Sortear ahora',
    drawingButton: 'Sorteando...',
    invalidDraw: 'Agrega al menos un elemento valido para sortear.',
    parsedSummary: 'Elementos validos en pool',
    detectedSeparatorLabel: 'Separador detectado',
    noItemsHint: 'No se encontraron elementos validos. Ajusta lista o separador.',
    numericModeTitle: 'Modo numeros (deteccion automatica)',
    rangeStartLabel: 'Inicio del rango',
    rangeEndLabel: 'Fin del rango',
    rangeButton: 'Generar rango y reemplazar lista',
    resultTitle: 'Resultado del sorteo',
    noResult: 'Aun sin resultado. Configura y pulsa sortear.',
    winnerLabel: 'Resultado principal',
    copyResult: 'Copiar resultado',
    copyOrdered: 'Copiar lista ordenada',
    downloadCsv: 'Descargar CSV',
    shareLink: 'Copiar enlace compartible',
    copied: 'Copiado',
    fairnessTitle: 'Modo justo y transparencia',
    fairnessSeed: 'Seed aleatoria',
    fairnessAlgorithm: 'Algoritmo',
    simulationTitle: 'Simulacion rapida (1000 sorteos)',
    simulationDescription: 'Sirve para revisar distribucion y validar pesos.',
    simulateButton: 'Ejecutar simulacion',
    simulationHits: 'Apariciones',
    simulationShare: 'Participacion',
    localNote: 'Procesamiento 100% local. No se suben datos al servidor por defecto.',
    copyError: 'No fue posible copiar ahora. Intentalo de nuevo.',
    shareError: 'No fue posible generar enlace compartible en este dispositivo.',
  },
};

const checkboxClassName =
  'h-4 w-4 rounded border border-slate-300 text-brand-600 focus:ring-2 focus:ring-brand-200';

const rouletteColors = [
  '#0f766e',
  '#2563eb',
  '#f97316',
  '#7c3aed',
  '#db2777',
  '#0ea5e9',
  '#65a30d',
  '#d97706',
  '#059669',
  '#0284c7',
  '#7e22ce',
  '#dc2626',
];

const defaultSourceInput =
  'Joao, Maria, Pedro, Ana, Carlos, Beatriz, Rafael, Julia';

const storageKey = 'tool:sorteador:v1';

const formatPercent = (value: number): string => `${(value * 100).toFixed(2)}%`;

const wait = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => {
    globalThis.setTimeout(resolve, milliseconds);
  });

const normalizeLineBreaks = (value: string): string => value.replace(/\r\n/g, '\n');

const delayToSeconds = (delayValue: string): number => {
  const parsed = Number(delayValue);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }

  return parsed;
};

const parsePositiveInt = (value: string, fallback: number): number => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.max(1, Math.floor(parsed));
};

const downloadText = (filename: string, content: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  URL.revokeObjectURL(url);
};

const csvFileNameByLocale: Record<AppLocale, string> = {
  'pt-br': 'resultado-sorteio.csv',
  en: 'draw-results.csv',
  es: 'resultado-sorteo.csv',
};

const toResultsCsv = (results: ParsedPickerItem[], locale: AppLocale): string => {
  const header =
    locale === 'en' ? 'position,item\n' : locale === 'es' ? 'posicion,item\n' : 'posicao,item\n';
  const rows = results
    .map((item, index) => `${index + 1},"${item.label.replaceAll('"', '""')}"`)
    .join('\n');

  return `${header}${rows}`;
};

const toOrderedText = (results: ParsedPickerItem[]): string =>
  results.map((item, index) => `${index + 1}. ${item.label}`).join('\n');

const fairnessAlgorithmByLocale: Record<AppLocale, string> = {
  'pt-br':
    'crypto.getRandomValues + selecao sem vies (rejection sampling) + pesos opcionais',
  en: 'crypto.getRandomValues + unbiased index selection (rejection sampling) + optional weights',
  es: 'crypto.getRandomValues + seleccion sin sesgo (rejection sampling) + pesos opcionales',
};

export function SorteadorTool({ locale = 'pt-br' }: SorteadorToolProps) {
  const ui = uiByLocale[locale];
  const [sourceInput, setSourceInput] = useState(defaultSourceInput);
  const [separatorMode, setSeparatorMode] = useState<PickerSeparatorMode>('auto');
  const [removeDuplicates, setRemoveDuplicates] = useState(true);
  const [trimSpaces, setTrimSpaces] = useState(true);
  const [ignoreEmpty, setIgnoreEmpty] = useState(true);
  const [parseWeights, setParseWeights] = useState(true);
  const [manualMode, setManualMode] = useState(false);
  const [manualDraft, setManualDraft] = useState('');
  const [manualItems, setManualItems] = useState<string[]>([]);
  const [drawMode, setDrawMode] = useState<PickerDrawMode>('without-repetition');
  const [resultCountInput, setResultCountInput] = useState('1');
  const [delayInput, setDelayInput] = useState('3');
  const [useRoulette, setUseRoulette] = useState(true);
  const [useWeights, setUseWeights] = useState(false);
  const [shuffleBeforeDraw, setShuffleBeforeDraw] = useState(false);
  const [avoidPreviousWinners, setAvoidPreviousWinners] = useState(false);
  const [historyNormalized, setHistoryNormalized] = useState<string[]>([]);
  const [rangeStartInput, setRangeStartInput] = useState('1');
  const [rangeEndInput, setRangeEndInput] = useState('100');
  const [isDrawing, setIsDrawing] = useState(false);
  const [rollingLabel, setRollingLabel] = useState('');
  const [rouletteRotation, setRouletteRotation] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [resultItems, setResultItems] = useState<ParsedPickerItem[]>([]);
  const [resultSeed, setResultSeed] = useState('');
  const [resultAlgorithm, setResultAlgorithm] = useState('');
  const [simulationRows, setSimulationRows] = useState<
    Array<{ label: string; hits: number; share: number }>
  >([]);

  const sourceForParsing = manualMode ? manualItems.join('\n') : sourceInput;

  const parsed = useMemo(
    () =>
      parsePickerItems(sourceForParsing, {
        separatorMode: manualMode ? 'newline' : separatorMode,
        trimSpaces,
        ignoreEmpty,
        removeDuplicates,
        parseWeights,
      }),
    [sourceForParsing, manualMode, separatorMode, trimSpaces, ignoreEmpty, removeDuplicates, parseWeights],
  );

  const blockedSet = useMemo(() => {
    if (!avoidPreviousWinners) {
      return undefined;
    }

    return new Set(historyNormalized);
  }, [avoidPreviousWinners, historyNormalized]);

  const poolItems = useMemo(
    () =>
      parsed.items.filter((item) => !blockedSet || !blockedSet.has(item.normalized)),
    [parsed.items, blockedSet],
  );

  const hasNumericOnly = useMemo(() => detectNumericOnlyItems(parsed.items), [parsed.items]);

  const rouletteSegments = useMemo(() => poolItems.slice(0, 12), [poolItems]);

  const detectedSeparatorLabel =
    ui.separatorNames[parsed.detectedSeparator] ?? ui.separatorNames.newline;

  useEffect(() => {
    const fromUrl = new URLSearchParams(globalThis.location.search);

    if (!fromUrl.size) {
      const stored = globalThis.localStorage.getItem(storageKey);
      if (!stored) {
        return;
      }

      try {
        const parsedStored = JSON.parse(stored) as {
          sourceInput?: string;
          separatorMode?: PickerSeparatorMode;
          drawMode?: PickerDrawMode;
          resultCountInput?: string;
          delayInput?: string;
          manualMode?: boolean;
          manualItems?: string[];
          useRoulette?: boolean;
          useWeights?: boolean;
          avoidPreviousWinners?: boolean;
        };

        if (parsedStored.sourceInput) {
          setSourceInput(parsedStored.sourceInput);
        }

        if (parsedStored.separatorMode) {
          setSeparatorMode(parsedStored.separatorMode);
        }

        if (parsedStored.drawMode) {
          setDrawMode(parsedStored.drawMode);
        }

        if (parsedStored.resultCountInput) {
          setResultCountInput(parsedStored.resultCountInput);
        }

        if (parsedStored.delayInput) {
          setDelayInput(parsedStored.delayInput);
        }

        if (typeof parsedStored.manualMode === 'boolean') {
          setManualMode(parsedStored.manualMode);
        }

        if (Array.isArray(parsedStored.manualItems)) {
          setManualItems(parsedStored.manualItems.filter((value) => typeof value === 'string'));
        }

        if (typeof parsedStored.useRoulette === 'boolean') {
          setUseRoulette(parsedStored.useRoulette);
        }

        if (typeof parsedStored.useWeights === 'boolean') {
          setUseWeights(parsedStored.useWeights);
        }

        if (typeof parsedStored.avoidPreviousWinners === 'boolean') {
          setAvoidPreviousWinners(parsedStored.avoidPreviousWinners);
        }
      } catch {
        globalThis.localStorage.removeItem(storageKey);
      }

      return;
    }

    const itemsParam = fromUrl.get('items');
    const manualParam = fromUrl.get('manual');

    if (itemsParam) {
      setSourceInput(normalizeLineBreaks(itemsParam));
    }

    if (manualParam === '1') {
      setManualMode(true);
      setManualItems(normalizeLineBreaks(itemsParam ?? '').split('\n').filter(Boolean));
    }

    const nextSeparator = fromUrl.get('sep') as PickerSeparatorMode | null;
    if (nextSeparator) {
      setSeparatorMode(nextSeparator);
    }

    const nextMode = fromUrl.get('mode') as PickerDrawMode | null;
    if (nextMode) {
      setDrawMode(nextMode);
    }

    const nextCount = fromUrl.get('count');
    if (nextCount) {
      setResultCountInput(nextCount);
    }

    const nextDelay = fromUrl.get('delay');
    if (nextDelay) {
      setDelayInput(nextDelay);
    }

    setUseRoulette(fromUrl.get('wheel') === '1');
    setUseWeights(fromUrl.get('weights') === '1');
    setRemoveDuplicates(fromUrl.get('dedupe') !== '0');
    setTrimSpaces(fromUrl.get('trim') !== '0');
    setIgnoreEmpty(fromUrl.get('ignoreEmpty') !== '0');
    setParseWeights(fromUrl.get('parseWeights') !== '0');
    setShuffleBeforeDraw(fromUrl.get('shuffle') === '1');
    setAvoidPreviousWinners(fromUrl.get('avoidHistory') === '1');
  }, []);

  useEffect(() => {
    const payload = {
      sourceInput,
      separatorMode,
      drawMode,
      resultCountInput,
      delayInput,
      manualMode,
      manualItems,
      useRoulette,
      useWeights,
      avoidPreviousWinners,
    };

    globalThis.localStorage.setItem(storageKey, JSON.stringify(payload));
  }, [
    sourceInput,
    separatorMode,
    drawMode,
    resultCountInput,
    delayInput,
    manualMode,
    manualItems,
    useRoulette,
    useWeights,
    avoidPreviousWinners,
  ]);

  const safeRequestedCount =
    drawMode === 'simple' ? 1 : parsePositiveInt(resultCountInput, 1);

  const runDraw = async () => {
    if (!poolItems.length) {
      setErrorMessage(ui.invalidDraw);
      return;
    }

    setErrorMessage('');
    setFeedbackMessage('');
    setSimulationRows([]);

    const delaySeconds = delayToSeconds(delayInput);
    const delayMs = Math.floor(delaySeconds * 1000);

    if (delayMs > 0) {
      setIsDrawing(true);

      const ticker = globalThis.setInterval(() => {
        const next = poolItems[Math.floor(Math.random() * poolItems.length)];
        setRollingLabel(next?.label ?? '...');
      }, 90);

      if (useRoulette) {
        setRouletteRotation((current) => current + 1440 + Math.floor(Math.random() * 480));
      }

      await wait(delayMs);
      globalThis.clearInterval(ticker);
    }

    const draw = drawPickerResults({
      items: parsed.items,
      mode: drawMode,
      requestedCount: safeRequestedCount,
      weighted: useWeights,
      shuffleBeforeDraw,
      blockedNormalizedLabels: blockedSet,
    });

    setIsDrawing(false);
    setResultItems(draw.results);
    setResultSeed(draw.seed);
    setResultAlgorithm(fairnessAlgorithmByLocale[locale] || draw.algorithm);
    setRollingLabel(draw.results[0]?.label ?? '');

    if (avoidPreviousWinners && draw.results.length) {
      setHistoryNormalized((current) =>
        Array.from(new Set([...current, ...draw.results.map((item) => item.normalized)])),
      );
    }
  };

  const copyText = async (value: string) => {
    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setFeedbackMessage(ui.copied);
      globalThis.setTimeout(() => {
        setFeedbackMessage('');
      }, 1400);
    } catch {
      setFeedbackMessage(ui.copyError);
    }
  };

  const copyShareLink = async () => {
    try {
      const query = new URLSearchParams();
      query.set('items', sourceForParsing);
      query.set('manual', manualMode ? '1' : '0');
      query.set('sep', separatorMode);
      query.set('mode', drawMode);
      query.set('count', String(safeRequestedCount));
      query.set('delay', delayInput);
      query.set('wheel', useRoulette ? '1' : '0');
      query.set('weights', useWeights ? '1' : '0');
      query.set('dedupe', removeDuplicates ? '1' : '0');
      query.set('trim', trimSpaces ? '1' : '0');
      query.set('ignoreEmpty', ignoreEmpty ? '1' : '0');
      query.set('parseWeights', parseWeights ? '1' : '0');
      query.set('shuffle', shuffleBeforeDraw ? '1' : '0');
      query.set('avoidHistory', avoidPreviousWinners ? '1' : '0');

      const shareUrl = `${globalThis.location.origin}${globalThis.location.pathname}?${query.toString()}`;
      await navigator.clipboard.writeText(shareUrl);
      setFeedbackMessage(ui.copied);
      globalThis.setTimeout(() => {
        setFeedbackMessage('');
      }, 1400);
    } catch {
      setFeedbackMessage(ui.shareError);
    }
  };

  const addManualItem = () => {
    const value = manualDraft.trim();

    if (!value) {
      return;
    }

    setManualItems((current) => [...current, value]);
    setManualDraft('');
  };

  const updateManualItem = (index: number, value: string) => {
    setManualItems((current) => current.map((item, itemIndex) => (itemIndex === index ? value : item)));
  };

  const removeManualItem = (index: number) => {
    setManualItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const moveManualItem = (index: number, direction: -1 | 1) => {
    setManualItems((current) => {
      const target = index + direction;

      if (target < 0 || target >= current.length) {
        return current;
      }

      const clone = [...current];
      const currentItem = clone[index];
      clone[index] = clone[target] as string;
      clone[target] = currentItem as string;
      return clone;
    });
  };

  const replaceWithRange = () => {
    const start = Number(rangeStartInput);
    const end = Number(rangeEndInput);
    const rangeItems = buildRangeItems(start, end);

    if (!rangeItems.length) {
      return;
    }

    const nextRaw = rangeItems.map((item) => item.label).join('\n');

    if (manualMode) {
      setManualItems(rangeItems.map((item) => item.label));
    } else {
      setSourceInput(nextRaw);
      setSeparatorMode('newline');
    }

    setResultItems([]);
    setSimulationRows([]);
  };

  const runSimulation = () => {
    if (!poolItems.length) {
      setErrorMessage(ui.invalidDraw);
      return;
    }

    setErrorMessage('');
    const output = simulatePickerDistribution(poolItems, 1000, useWeights);
    setSimulationRows(output.slice(0, 12));
  };

  const shouldShowCount = drawMode !== 'simple' && drawMode !== 'shuffle';

  const wheelBackground = useMemo(() => {
    if (!rouletteSegments.length) {
      return 'radial-gradient(circle at center, #f8fafc, #e2e8f0)';
    }

    const angle = 360 / rouletteSegments.length;
    const segments = rouletteSegments.map((_, index) => {
      const color = rouletteColors[index % rouletteColors.length] as string;
      const start = Math.round(index * angle * 100) / 100;
      const end = Math.round((index + 1) * angle * 100) / 100;
      return `${color} ${start}deg ${end}deg`;
    });

    return `conic-gradient(${segments.join(', ')})`;
  }, [rouletteSegments]);

  return (
    <Card className="space-y-5">
      <header className="rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 to-indigo-50 p-4">
        <h3 className="text-lg font-semibold text-slate-900">{ui.title}</h3>
        <p className="mt-1 text-sm text-slate-700">{ui.intro}</p>
      </header>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h4 className="text-sm font-semibold text-slate-900">{ui.sourceTitle}</h4>

        {!manualMode ? (
          <>
            <Textarea
              rows={6}
              value={sourceInput}
              placeholder={ui.sourcePlaceholder}
              onChange={(event) => setSourceInput(event.target.value)}
            />

            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                onClick={async () => {
                  try {
                    const value = await navigator.clipboard.readText();
                    setSourceInput((current) => [current, value].filter(Boolean).join('\n'));
                  } catch {
                    setFeedbackMessage(ui.copyError);
                  }
                }}
              >
                {ui.pasteClipboard}
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  setSourceInput('');
                  setResultItems([]);
                  setSimulationRows([]);
                  setHistoryNormalized([]);
                }}
              >
                {ui.clearInput}
              </Button>
            </div>
          </>
        ) : null}

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{ui.separatorLabel}</span>
          <Select
            value={separatorMode}
            onChange={(event) => setSeparatorMode(event.target.value as PickerSeparatorMode)}
            disabled={manualMode}
          >
            <option value="auto">{ui.autoSeparator}</option>
            {separatorLabelOrder.map((separator) => (
              <option key={separator} value={separator}>
                {ui.separatorNames[separator]}
              </option>
            ))}
          </Select>
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            className={checkboxClassName}
            checked={manualMode}
            onChange={(event) => setManualMode(event.target.checked)}
          />
          {ui.manualModeToggle}
        </label>

        {manualMode ? (
          <section className="space-y-3 rounded-lg border border-slate-200 bg-white p-3">
            <h5 className="text-sm font-semibold text-slate-800">{ui.manualModeTitle}</h5>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={manualDraft}
                placeholder={ui.manualInputPlaceholder}
                onChange={(event) => setManualDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    addManualItem();
                  }
                }}
              />
              <Button variant="secondary" onClick={addManualItem}>
                {ui.manualAdd}
              </Button>
            </div>

            {manualItems.length ? (
              <div className="space-y-2">
                {manualItems.map((item, index) => (
                  <div key={`${item}-${index}`} className="rounded-lg border border-slate-200 p-2">
                    <Input
                      value={item}
                      onChange={(event) => updateManualItem(index, event.target.value)}
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Button variant="ghost" onClick={() => moveManualItem(index, -1)}>
                        {ui.moveUp}
                      </Button>
                      <Button variant="ghost" onClick={() => moveManualItem(index, 1)}>
                        {ui.moveDown}
                      </Button>
                      <Button variant="ghost" onClick={() => removeManualItem(index)}>
                        {ui.remove}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-600">{ui.manualListEmpty}</p>
            )}
          </section>
        ) : null}

        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold text-slate-900">{ui.optionsTitle}</legend>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              className={checkboxClassName}
              checked={removeDuplicates}
              onChange={(event) => setRemoveDuplicates(event.target.checked)}
            />
            {ui.dedupe}
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              className={checkboxClassName}
              checked={trimSpaces}
              onChange={(event) => setTrimSpaces(event.target.checked)}
            />
            {ui.trimSpaces}
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              className={checkboxClassName}
              checked={ignoreEmpty}
              onChange={(event) => setIgnoreEmpty(event.target.checked)}
            />
            {ui.ignoreEmpty}
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              className={checkboxClassName}
              checked={parseWeights}
              onChange={(event) => setParseWeights(event.target.checked)}
            />
            {ui.parseWeights}
          </label>
        </fieldset>

        <p className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
          {ui.parsedSummary}: <strong>{poolItems.length}</strong> | {ui.detectedSeparatorLabel}:{' '}
          <strong>{detectedSeparatorLabel}</strong>
        </p>
      </section>

      {hasNumericOnly ? (
        <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-semibold text-slate-900">{ui.numericModeTitle}</h4>
          <div className="grid gap-3 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">{ui.rangeStartLabel}</span>
              <Input
                inputMode="numeric"
                value={rangeStartInput}
                onChange={(event) => setRangeStartInput(event.target.value)}
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">{ui.rangeEndLabel}</span>
              <Input
                inputMode="numeric"
                value={rangeEndInput}
                onChange={(event) => setRangeEndInput(event.target.value)}
              />
            </label>
            <div className="flex items-end">
              <Button variant="secondary" onClick={replaceWithRange} className="w-full">
                {ui.rangeButton}
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h4 className="text-sm font-semibold text-slate-900">{ui.drawConfigTitle}</h4>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.drawModeLabel}</span>
            <Select
              value={drawMode}
              onChange={(event) => setDrawMode(event.target.value as PickerDrawMode)}
            >
              <option value="simple">{ui.drawModeSimple}</option>
              <option value="without-repetition">{ui.drawModeNoRepeat}</option>
              <option value="with-repetition">{ui.drawModeRepeat}</option>
              <option value="shuffle">{ui.drawModeShuffle}</option>
            </Select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.resultCountLabel}</span>
            <Input
              inputMode="numeric"
              disabled={!shouldShowCount}
              value={shouldShowCount ? resultCountInput : '1'}
              onChange={(event) => setResultCountInput(event.target.value)}
            />
          </label>
        </div>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{ui.delayLabel}</span>
          <Select value={delayInput} onChange={(event) => setDelayInput(event.target.value)}>
            <option value="0">{ui.delayInstant}</option>
            <option value="3">{ui.delay3}</option>
            <option value="5">{ui.delay5}</option>
            <option value="10">{ui.delay10}</option>
          </Select>
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            className={checkboxClassName}
            checked={useRoulette}
            onChange={(event) => setUseRoulette(event.target.checked)}
          />
          {ui.rouletteToggle}
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            className={checkboxClassName}
            checked={useWeights}
            onChange={(event) => setUseWeights(event.target.checked)}
          />
          {ui.weightedToggle}
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            className={checkboxClassName}
            checked={shuffleBeforeDraw}
            onChange={(event) => setShuffleBeforeDraw(event.target.checked)}
          />
          {ui.shuffleBeforeDraw}
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            className={checkboxClassName}
            checked={avoidPreviousWinners}
            onChange={(event) => setAvoidPreviousWinners(event.target.checked)}
          />
          {ui.avoidPreviousWinners}
        </label>

        {errorMessage ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        {feedbackMessage ? (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {feedbackMessage}
          </p>
        ) : null}

        <Button
          variant="secondary"
          onClick={() => {
            void runDraw();
          }}
          disabled={isDrawing || !poolItems.length}
        >
          {isDrawing ? ui.drawingButton : ui.drawButton}
        </Button>
      </section>

      {useRoulette ? (
        <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
          <div className="mx-auto max-w-xs">
            <div className="relative mx-auto h-64 w-64">
              <div className="absolute left-1/2 top-0 z-20 h-0 w-0 -translate-x-1/2 border-l-8 border-r-8 border-t-[14px] border-l-transparent border-r-transparent border-t-slate-900" />
              <div
                className="absolute inset-0 rounded-full border-4 border-white shadow-inner"
                style={{
                  background: wheelBackground,
                  transform: `rotate(${rouletteRotation}deg)`,
                  transition: isDrawing
                    ? `transform ${Math.max(0.4, delayToSeconds(delayInput))}s cubic-bezier(0.12, 0.92, 0.15, 1)`
                    : 'none',
                }}
              />
              <div className="absolute inset-[28%] z-10 flex items-center justify-center rounded-full border border-slate-200 bg-white/95 p-3 text-center text-xs font-semibold text-slate-800">
                {rollingLabel || resultItems[0]?.label || '---'}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h4 className="text-sm font-semibold text-slate-900">{ui.resultTitle}</h4>

        {resultItems.length ? (
          <>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-900">
              <p className="text-xs font-semibold uppercase tracking-wide">{ui.winnerLabel}</p>
              <p className="mt-1 break-words text-xl font-bold">{resultItems[0]?.label}</p>
            </div>

            <ol className="space-y-2">
              {resultItems.map((item, index) => (
                <li
                  key={`${item.id}-${index}`}
                  className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-800"
                >
                  <strong>{index + 1}.</strong> {item.label}
                </li>
              ))}
            </ol>

            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => void copyText(resultItems[0]?.label ?? '')}>
                {ui.copyResult}
              </Button>
              <Button variant="secondary" onClick={() => void copyText(toOrderedText(resultItems))}>
                {ui.copyOrdered}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  downloadText(
                    csvFileNameByLocale[locale],
                    toResultsCsv(resultItems, locale),
                    'text/csv;charset=utf-8;',
                  );
                }}
              >
                {ui.downloadCsv}
              </Button>
              <Button variant="secondary" onClick={() => void copyShareLink()}>
                {ui.shareLink}
              </Button>
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-600">{ui.noResult}</p>
        )}
      </section>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
        <h4 className="text-sm font-semibold text-slate-900">{ui.fairnessTitle}</h4>
        <p className="text-sm text-slate-700">
          <strong>{ui.fairnessSeed}:</strong> {resultSeed || '--'}
        </p>
        <p className="text-sm text-slate-700">
          <strong>{ui.fairnessAlgorithm}:</strong> {resultAlgorithm || '--'}
        </p>
      </section>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h4 className="text-sm font-semibold text-slate-900">{ui.simulationTitle}</h4>
        <p className="text-sm text-slate-700">{ui.simulationDescription}</p>

        <Button variant="secondary" onClick={runSimulation} disabled={!poolItems.length}>
          {ui.simulateButton}
        </Button>

        {simulationRows.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-2 py-2">Item</th>
                  <th className="px-2 py-2">{ui.simulationHits}</th>
                  <th className="px-2 py-2">{ui.simulationShare}</th>
                </tr>
              </thead>
              <tbody>
                {simulationRows.map((row) => (
                  <tr key={row.label} className="border-b border-slate-100">
                    <td className="px-2 py-2">{row.label}</td>
                    <td className="px-2 py-2">{row.hits}</td>
                    <td className="px-2 py-2">{formatPercent(row.share)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>

      {!poolItems.length ? <p className="text-sm text-slate-600">{ui.noItemsHint}</p> : null}

      <p className="text-xs text-slate-600">{ui.localNote}</p>
    </Card>
  );
}
