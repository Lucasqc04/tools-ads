'use client';
/* eslint-disable @next/next/no-img-element */

import dynamic from 'next/dynamic';
import type { ReactCodeMirrorProps } from '@uiw/react-codemirror';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardPaste,
  Code2,
  Download,
  FileCode2,
  Grid3X3,
  Maximize2,
  Minus,
  Move,
  Plus,
  RotateCcw,
  Search,
  Settings2,
  Undo2,
} from 'lucide-react';
import { FileUploadDropzone } from '@/components/shared/file-upload-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { trackEvent, TOOL_ID } from '@/lib/analytics';
import { cn } from '@/lib/cn';
import type { AppLocale } from '@/lib/i18n/config';
import {
  buildBatchZpl,
  buildLabelZpl,
  createLabelItems,
  defaultLabelStyle,
  getZplWarnings,
  parseZplBatch,
  renderLocalZplPngDataUrl,
  requestZplProviderPreview,
  type LabelItem,
  type LabelStyle,
} from '@/lib/zpl';
import { ZplLabelPreview, ZplLabelThumbnail } from './zpl-label-preview';

const CodeMirror = dynamic<ReactCodeMirrorProps>(() => import('@uiw/react-codemirror'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-500">
      Carregando editor ZPL...
    </div>
  ),
});

const DRAFT_KEY = 'tools:zpl-label-editor:draft:v1';
const DRAFT_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

type ZplLabelEditorToolProps = Readonly<{ locale?: AppLocale }>;
type FilterMode = 'all' | 'filled' | 'pending';
type WorkspaceMode = 'focus' | 'grid';
type BatchAction = 'clear' | 'restore';

type Draft = {
  version: 1;
  savedAt: number;
  fileName: string;
  selectedIndex: number;
  labels: LabelItem[];
  style: LabelStyle;
};

type Feedback = { tone: 'success' | 'error' | 'info'; message: string } | null;

type ToolUi = {
  importTitle: string;
  importSubtitle: string;
  chooseFile: string;
  pasteCode: string;
  pasteLabel: string;
  pastePlaceholder: string;
  analyze: string;
  found: (count: number) => string;
  invalidZpl: string;
  restoreDraft: string;
  discardDraft: string;
  draftFound: string;
  processingLocal: string;
  labels: string;
  search: string;
  searchPlaceholder: string;
  all: string;
  filled: string;
  pending: string;
  nextPending: string;
  focus: string;
  grid: string;
  description: string;
  descriptionPlaceholder: string;
  keyboardHint: string;
  note: string;
  notePlaceholder: string;
  saveAndNext: string;
  previous: string;
  next: string;
  generated: string;
  exportPdf: string;
  exportZpl: string;
  exportPng: string;
  advanced: string;
  batch: string;
  selected: (current: number, total: number) => string;
  original: string;
  restoreLabel: string;
  settings: string;
  applyStyle: (count: number) => string;
  position: string;
  editPosition: string;
  stopEditingPosition: string;
  fontSize: string;
  alignment: string;
  alignLeft: string;
  alignCenter: string;
  alignRight: string;
  maxLines: string;
  width: string;
  dpi: string;
  labelSize: string;
  rotation: string;
  styleSaved: string;
  ready: (count: number) => string;
  incomplete: (filled: number, total: number) => string;
  reviewPending: string;
  generateAnyway: string;
  previewFallback: string;
  previewProvider: string;
  previewLoading: string;
  previewPrivacy: string;
  dragDescription: string;
  noLabels: string;
  confirmClear: string;
  confirmRestore: string;
  clearAll: string;
  restoreAll: string;
  confirm: string;
  cancel: string;
  undo: string;
  restored: string;
  cleared: string;
  codeEditor: string;
  codeHint: string;
  batchZpl: string;
  warnings: string;
  noWarnings: string;
  fullscreen: string;
  close: string;
  gridSize: string;
  small: string;
  medium: string;
  large: string;
  generating: (current: number, total: number) => string;
  pdfReady: (count: number) => string;
};

const uiByLocale: Record<AppLocale, ToolUi> = {
  'pt-br': {
    importTitle: 'Importe seu lote de etiquetas',
    importSubtitle: 'Arraste um arquivo ZPL ou cole o código para separar as etiquetas automaticamente.',
    chooseFile: 'Selecionar arquivo', pasteCode: 'Colar código', pasteLabel: 'Cole o ZPL completo', pastePlaceholder: '^XA\n^FO50,50^FDExemplo^FS\n^XZ', analyze: 'Analisar etiquetas',
    found: (count) => `${count} ${count === 1 ? 'etiqueta encontrada' : 'etiquetas encontradas'}`,
    invalidZpl: 'Não conseguimos identificar etiquetas ZPL completas neste arquivo.', restoreDraft: 'Continuar', discardDraft: 'Descartar', draftFound: 'Encontramos um lote não finalizado neste navegador.', processingLocal: 'Seu lote fica neste navegador enquanto você edita.',
    labels: 'Etiquetas', search: 'Buscar', searchPlaceholder: 'Buscar descrição...', all: 'Todos', filled: 'Preenchidos', pending: 'Pendentes', nextPending: 'Próxima pendente', focus: 'Individual', grid: 'Grade',
    description: 'Descrição do produto', descriptionPlaceholder: 'Ex.: Havaianas Slim Preto 39', keyboardHint: 'Enter: salvar e avançar. Shift + Enter: nova linha.', note: 'Observação opcional', notePlaceholder: 'Ex.: caixa avariada / cor confirmada', saveAndNext: 'Salvar e próxima', previous: 'Anterior', next: 'Próxima',
    generated: 'Gerar PDF', exportPdf: 'Exportar PDF', exportZpl: 'Exportar ZPL', exportPng: 'PNG atual', advanced: 'ZPL avançado', batch: 'Lote', selected: (current, total) => `Etiqueta ${current} de ${total}`,
    original: 'Original preservado', restoreLabel: 'Restaurar etiqueta original', settings: 'Estilo da descrição', applyStyle: (count) => `Aplicar estilo às ${count} etiquetas`, position: 'Posição', editPosition: 'Editar posição no preview', stopEditingPosition: 'Concluir posição', fontSize: 'Tamanho da fonte', alignment: 'Alinhamento', alignLeft: 'Esquerda', alignCenter: 'Centro', alignRight: 'Direita', maxLines: 'Máximo de linhas', width: 'Largura disponível', dpi: 'DPI', labelSize: 'Tamanho da etiqueta (mm)', rotation: 'Rotação', styleSaved: 'Estilo aplicado ao lote.',
    ready: (count) => `${count} etiquetas prontas`, incomplete: (filled, total) => `${filled} de ${total} preenchidas`, reviewPending: 'Revisar pendentes', generateAnyway: 'Gerar mesmo assim', previewFallback: 'Prévia local simplificada', previewProvider: 'Prévia compatível com ZPL', previewLoading: 'Gerando prévia…', previewPrivacy: 'O lote é salvo localmente. Ao gerar preview preciso ou PDF, apenas a etiqueta em processamento é enviada ao renderizador ZPL.', dragDescription: 'Mover descrição', noLabels: 'Não há etiquetas neste filtro.',
    confirmClear: 'Limpar todas as descrições deste lote?', confirmRestore: 'Restaurar todas as etiquetas ao conteúdo original?', clearAll: 'Limpar descrições', restoreAll: 'Restaurar todas', confirm: 'Confirmar', cancel: 'Cancelar', undo: 'Desfazer', restored: 'Etiquetas restauradas.', cleared: 'Descrições removidas.',
    codeEditor: 'Código da etiqueta selecionada', codeHint: 'Edite somente se você conhece ZPL. A descrição continua sendo aplicada separadamente.', batchZpl: 'ZPL gerado para todo o lote', warnings: 'Avisos do ZPL', noWarnings: 'Nenhum aviso estrutural simples.', fullscreen: 'Tela cheia', close: 'Fechar', gridSize: 'Tamanho da grade', small: 'Pequeno', medium: 'Médio', large: 'Grande', generating: (current, total) => `Gerando PDF: ${current} de ${total}`, pdfReady: (count) => `PDF gerado com ${count} etiquetas.`,
  },
  en: {
    importTitle: 'Import your label batch', importSubtitle: 'Drop a ZPL file or paste code to split labels automatically.', chooseFile: 'Choose file', pasteCode: 'Paste code', pasteLabel: 'Paste complete ZPL', pastePlaceholder: '^XA\n^FO50,50^FDExample^FS\n^XZ', analyze: 'Analyze labels', found: (count) => `${count} ${count === 1 ? 'label found' : 'labels found'}`, invalidZpl: 'We could not identify complete ZPL labels in this file.', restoreDraft: 'Continue', discardDraft: 'Discard', draftFound: 'We found an unfinished batch in this browser.', processingLocal: 'Your batch stays in this browser while you edit.',
    labels: 'Labels', search: 'Search', searchPlaceholder: 'Search description...', all: 'All', filled: 'Filled', pending: 'Pending', nextPending: 'Next pending', focus: 'Focus', grid: 'Grid', description: 'Product description', descriptionPlaceholder: 'e.g. Black Slim Flip Flop 39', keyboardHint: 'Enter: save and move on. Shift + Enter: new line.', note: 'Optional note', notePlaceholder: 'e.g. color confirmed', saveAndNext: 'Save and next', previous: 'Previous', next: 'Next', generated: 'Generate PDF', exportPdf: 'Export PDF', exportZpl: 'Export ZPL', exportPng: 'Current PNG', advanced: 'Advanced ZPL', batch: 'Batch', selected: (current, total) => `Label ${current} of ${total}`,
    original: 'Original preserved', restoreLabel: 'Restore original label', settings: 'Description style', applyStyle: (count) => `Apply style to ${count} labels`, position: 'Position', editPosition: 'Edit position in preview', stopEditingPosition: 'Finish positioning', fontSize: 'Font size', alignment: 'Alignment', alignLeft: 'Left', alignCenter: 'Center', alignRight: 'Right', maxLines: 'Maximum lines', width: 'Available width', dpi: 'DPI', labelSize: 'Label size (mm)', rotation: 'Rotation', styleSaved: 'Style applied to batch.',
    ready: (count) => `${count} labels ready`, incomplete: (filled, total) => `${filled} of ${total} filled`, reviewPending: 'Review pending', generateAnyway: 'Generate anyway', previewFallback: 'Simplified local preview', previewProvider: 'ZPL-compatible preview', previewLoading: 'Generating preview…', previewPrivacy: 'The batch is saved locally. When generating a precise preview or PDF, only the label being processed is sent to the ZPL renderer.', dragDescription: 'Move description', noLabels: 'No labels in this filter.',
    confirmClear: 'Clear every description in this batch?', confirmRestore: 'Restore every label to its original content?', clearAll: 'Clear descriptions', restoreAll: 'Restore all', confirm: 'Confirm', cancel: 'Cancel', undo: 'Undo', restored: 'Labels restored.', cleared: 'Descriptions removed.', codeEditor: 'Selected label code', codeHint: 'Edit only if you know ZPL. The description is still applied separately.', batchZpl: 'Generated ZPL for the full batch', warnings: 'ZPL warnings', noWarnings: 'No simple structural warnings.', fullscreen: 'Fullscreen', close: 'Close', gridSize: 'Grid size', small: 'Small', medium: 'Medium', large: 'Large', generating: (current, total) => `Generating PDF: ${current} of ${total}`, pdfReady: (count) => `PDF generated with ${count} labels.`,
  },
  es: {
    importTitle: 'Importa tu lote de etiquetas', importSubtitle: 'Arrastra un archivo ZPL o pega el código para separar etiquetas automáticamente.', chooseFile: 'Seleccionar archivo', pasteCode: 'Pegar código', pasteLabel: 'Pega el ZPL completo', pastePlaceholder: '^XA\n^FO50,50^FDEjemplo^FS\n^XZ', analyze: 'Analizar etiquetas', found: (count) => `${count} ${count === 1 ? 'etiqueta encontrada' : 'etiquetas encontradas'}`, invalidZpl: 'No pudimos identificar etiquetas ZPL completas en este archivo.', restoreDraft: 'Continuar', discardDraft: 'Descartar', draftFound: 'Encontramos un lote sin terminar en este navegador.', processingLocal: 'El lote permanece en este navegador mientras editas.',
    labels: 'Etiquetas', search: 'Buscar', searchPlaceholder: 'Buscar descripción...', all: 'Todas', filled: 'Completadas', pending: 'Pendientes', nextPending: 'Siguiente pendiente', focus: 'Individual', grid: 'Cuadrícula', description: 'Descripción del producto', descriptionPlaceholder: 'Ej.: Havaianas Slim Negro 39', keyboardHint: 'Enter: guardar y avanzar. Shift + Enter: nueva línea.', note: 'Nota opcional', notePlaceholder: 'Ej.: color confirmado', saveAndNext: 'Guardar y siguiente', previous: 'Anterior', next: 'Siguiente', generated: 'Generar PDF', exportPdf: 'Exportar PDF', exportZpl: 'Exportar ZPL', exportPng: 'PNG actual', advanced: 'ZPL avanzado', batch: 'Lote', selected: (current, total) => `Etiqueta ${current} de ${total}`,
    original: 'Original preservado', restoreLabel: 'Restaurar etiqueta original', settings: 'Estilo de descripción', applyStyle: (count) => `Aplicar estilo a ${count} etiquetas`, position: 'Posición', editPosition: 'Editar posición en preview', stopEditingPosition: 'Terminar posición', fontSize: 'Tamaño de fuente', alignment: 'Alineación', alignLeft: 'Izquierda', alignCenter: 'Centro', alignRight: 'Derecha', maxLines: 'Máximo de líneas', width: 'Anchura disponible', dpi: 'DPI', labelSize: 'Tamaño de etiqueta (mm)', rotation: 'Rotación', styleSaved: 'Estilo aplicado al lote.',
    ready: (count) => `${count} etiquetas listas`, incomplete: (filled, total) => `${filled} de ${total} completadas`, reviewPending: 'Revisar pendientes', generateAnyway: 'Generar de todos modos', previewFallback: 'Preview local simplificado', previewProvider: 'Preview compatible con ZPL', previewLoading: 'Generando vista previa…', previewPrivacy: 'El lote se guarda localmente. Al generar un preview preciso o PDF, solo la etiqueta en proceso se envía al renderizador ZPL.', dragDescription: 'Mover descripción', noLabels: 'No hay etiquetas en este filtro.',
    confirmClear: 'Eliminar todas las descripciones del lote?', confirmRestore: 'Restaurar todas las etiquetas a su contenido original?', clearAll: 'Limpiar descripciones', restoreAll: 'Restaurar todas', confirm: 'Confirmar', cancel: 'Cancelar', undo: 'Deshacer', restored: 'Etiquetas restauradas.', cleared: 'Descripciones eliminadas.', codeEditor: 'Código de la etiqueta seleccionada', codeHint: 'Edita solo si conoces ZPL. La descripción se aplica por separado.', batchZpl: 'ZPL generado para todo el lote', warnings: 'Avisos de ZPL', noWarnings: 'No hay avisos estructurales simples.', fullscreen: 'Pantalla completa', close: 'Cerrar', gridSize: 'Tamaño de cuadrícula', small: 'Pequeño', medium: 'Mediano', large: 'Grande', generating: (current, total) => `Generando PDF: ${current} de ${total}`, pdfReady: (count) => `PDF generado con ${count} etiquetas.`,
  },
  zh: {} as ToolUi,
};
uiByLocale.zh = uiByLocale.en;

const isDraft = (value: unknown): value is Draft => {
  if (!value || typeof value !== 'object') return false;
  const draft = value as Partial<Draft>;
  return draft.version === 1 && Array.isArray(draft.labels) && typeof draft.savedAt === 'number' && typeof draft.style === 'object';
};

const isFilled = (label: LabelItem): boolean => Boolean(label.customData.description.trim());
const labelNumber = (index: number): string => String(index + 1).padStart(2, '0');
const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};
const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => (typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Invalid image data.')));
    reader.onerror = () => reject(reader.error ?? new Error('Could not read image data.'));
    reader.readAsDataURL(blob);
  });

export function ZplLabelEditorTool({ locale = 'pt-br' }: ZplLabelEditorToolProps) {
  const ui = uiByLocale[locale];
  const [labels, setLabels] = useState<LabelItem[]>([]);
  const [style, setStyle] = useState<LabelStyle>(defaultLabelStyle);
  const [fileName, setFileName] = useState('etiquetas.zpl');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filter, setFilter] = useState<FilterMode>('all');
  const [search, setSearch] = useState('');
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>('focus');
  const [gridSize, setGridSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [showPaste, setShowPaste] = useState(false);
  const [pastedZpl, setPastedZpl] = useState('');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [pendingAction, setPendingAction] = useState<BatchAction | null>(null);
  const [undoLabels, setUndoLabels] = useState<LabelItem[] | null>(null);
  const [advanced, setAdvanced] = useState(false);
  const [editingPosition, setEditingPosition] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewState, setPreviewState] = useState<'loading' | 'provider' | 'fallback'>('loading');
  const [zoom, setZoom] = useState(100);
  const [fullscreen, setFullscreen] = useState(false);
  const [exportProgress, setExportProgress] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const startedRef = useRef(false);
  const focusAfterNavigationRef = useRef(false);
  const previewCacheRef = useRef(new Map<string, string>());

  const selectedLabel = labels[selectedIndex] ?? null;
  const selectedZpl = useMemo(
    () => (selectedLabel ? buildLabelZpl(selectedLabel, style) : ''),
    [selectedLabel, style],
  );
  const visibleLabels = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();
    return labels.filter((label) => {
      if (filter === 'filled' && !isFilled(label)) return false;
      if (filter === 'pending' && isFilled(label)) return false;
      return !normalizedSearch || `${labelNumber(label.index)} ${label.customData.description} ${label.customData.note}`.toLocaleLowerCase().includes(normalizedSearch);
    });
  }, [filter, labels, search]);
  const filledCount = useMemo(() => labels.filter(isFilled).length, [labels]);
  const progress = labels.length ? Math.round((filledCount / labels.length) * 100) : 0;
  const warnings = useMemo(() => (selectedLabel ? getZplWarnings(selectedLabel.editableZpl) : []), [selectedLabel]);

  useEffect(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? 'null') as unknown;
      if (isDraft(parsed) && Date.now() - parsed.savedAt < DRAFT_MAX_AGE_MS) setDraft(parsed);
      else localStorage.removeItem(DRAFT_KEY);
    } catch {
      localStorage.removeItem(DRAFT_KEY);
    }
  }, []);

  useEffect(() => {
    if (!labels.length) return undefined;
    const timer = window.setTimeout(() => {
      const nextDraft: Draft = { version: 1, savedAt: Date.now(), fileName, selectedIndex, labels, style };
      try {
        const serialized = JSON.stringify(nextDraft);
        if (serialized.length < 4_500_000) localStorage.setItem(DRAFT_KEY, serialized);
      } catch {
        // Autosave is optional and must never interrupt editing.
      }
    }, 700);
    return () => window.clearTimeout(timer);
  }, [fileName, labels, selectedIndex, style]);

  useEffect(
    () => () => {
      previewCacheRef.current.forEach((url) => URL.revokeObjectURL(url));
    },
    [],
  );

  useEffect(() => {
    if (!selectedZpl) return undefined;
    const cacheKey = `${selectedZpl}|${style.dpi}|${style.widthMm}|${style.heightMm}`;
    const cached = previewCacheRef.current.get(cacheKey);
    if (cached) {
      setPreviewUrl(cached);
      setPreviewState('provider');
      return undefined;
    }

    setPreviewState('loading');
    setPreviewUrl(null);
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void requestZplProviderPreview(selectedZpl, style)
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          if (cancelled) {
            URL.revokeObjectURL(url);
            return;
          }
          previewCacheRef.current.set(cacheKey, url);
          if (previewCacheRef.current.size > 28) {
            const oldest = previewCacheRef.current.keys().next().value as string | undefined;
            if (oldest) {
              const oldUrl = previewCacheRef.current.get(oldest);
              if (oldUrl) URL.revokeObjectURL(oldUrl);
              previewCacheRef.current.delete(oldest);
            }
          }
          setPreviewUrl(url);
          setPreviewState('provider');
        })
        .catch(() => {
          if (cancelled) return;
          setPreviewState('fallback');
          trackEvent('tool_error', { tool: TOOL_ID.zplLabelEditor, locale, error_type: 'provider_unavailable' });
        });
    }, 400);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [locale, selectedZpl, style]);

  useEffect(() => {
    if (!focusAfterNavigationRef.current) return;
    const timer = window.setTimeout(() => document.getElementById('zpl-description')?.focus(), 0);
    focusAfterNavigationRef.current = false;
    return () => window.clearTimeout(timer);
  }, [selectedIndex]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') return;
      if (event.key === 'ArrowLeft') navigate(-1);
      if (event.key === 'ArrowRight') navigate(1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  // navigate only reads stable setters and labels via its closure in render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labels.length, selectedIndex]);

  const setFeedbackMessage = (tone: NonNullable<Feedback>['tone'], message: string) => {
    setFeedback({ tone, message });
    window.setTimeout(() => setFeedback(null), 5500);
  };

  const importZpl = (source: string, nextFileName: string, method: 'file' | 'paste') => {
    const parsed = parseZplBatch(source);
    if (!parsed.labels.length) {
      setFeedbackMessage('error', parsed.warnings[0] ?? ui.invalidZpl);
      trackEvent('tool_error', { tool: TOOL_ID.zplLabelEditor, locale, error_type: 'parse_error' });
      return;
    }
    const nextLabels = createLabelItems(parsed.labels);
    setLabels(nextLabels);
    setFileName(nextFileName);
    setSelectedIndex(0);
    setShowPaste(false);
    setPastedZpl('');
    setFeedbackMessage('success', ui.found(nextLabels.length));
    trackEvent('file_uploaded', { tool: TOOL_ID.zplLabelEditor, locale, method });
    if (!startedRef.current) {
      startedRef.current = true;
      trackEvent('tool_started', { tool: TOOL_ID.zplLabelEditor, locale, method });
    }
  };

  const handleFiles = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    try {
      importZpl(await file.text(), file.name, 'file');
    } catch {
      setFeedbackMessage('error', ui.invalidZpl);
      trackEvent('tool_error', { tool: TOOL_ID.zplLabelEditor, locale, error_type: 'processing_failed' });
    }
  };

  const resumeDraft = () => {
    if (!draft) return;
    setLabels(draft.labels);
    setStyle(draft.style);
    setFileName(draft.fileName);
    setSelectedIndex(Math.min(Math.max(draft.selectedIndex, 0), Math.max(draft.labels.length - 1, 0)));
    setDraft(null);
    startedRef.current = true;
  };

  const discardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setDraft(null);
  };

  const updateCurrentLabel = (updater: (label: LabelItem) => LabelItem) => {
    if (!selectedLabel) return;
    setLabels((previous) => previous.map((label, index) => (index === selectedIndex ? updater(label) : label)));
  };

  const updateDescription = (field: 'description' | 'note', value: string) => {
    updateCurrentLabel((label) => {
      const next = { ...label, customData: { ...label.customData, [field]: value } };
      return { ...next, generatedZpl: buildLabelZpl(next, style) };
    });
  };

  function navigate(direction: -1 | 1) {
    if (!labels.length) return;
    setSelectedIndex((current) => Math.max(0, Math.min(labels.length - 1, current + direction)));
  }

  const goToNextPending = () => {
    if (!labels.length) return;
    const next = labels.findIndex((label, index) => index > selectedIndex && !isFilled(label));
    const fallback = labels.findIndex((label) => !isFilled(label));
    const target = next >= 0 ? next : fallback;
    if (target >= 0) {
      setSelectedIndex(target);
      setWorkspaceMode('focus');
      focusAfterNavigationRef.current = true;
    }
  };

  const updateStyle = <Key extends keyof LabelStyle>(key: Key, value: LabelStyle[Key]) => {
    setStyle((current) => ({ ...current, [key]: value }));
  };

  const applyStyle = () => {
    setLabels((current) => current.map((label) => ({ ...label, generatedZpl: buildLabelZpl(label, style) })));
    setFeedbackMessage('success', ui.styleSaved);
    trackEvent('parameter_changed', { tool: TOOL_ID.zplLabelEditor, locale, field: 'description_style' });
  };

  const restoreCurrent = () => {
    updateCurrentLabel((label) => ({
      ...label,
      editableZpl: label.originalZpl,
      customData: { description: '', note: '' },
      generatedZpl: label.originalZpl,
    }));
    setFeedbackMessage('success', ui.restored);
  };

  const executeBatchAction = () => {
    if (!pendingAction) return;
    setUndoLabels(labels);
    setLabels((current) => current.map((label) => {
      if (pendingAction === 'clear') {
        const next = { ...label, customData: { description: '', note: '' } };
        return { ...next, generatedZpl: buildLabelZpl(next, style) };
      }
      return { ...label, editableZpl: label.originalZpl, customData: { description: '', note: '' }, generatedZpl: label.originalZpl };
    }));
    setFeedbackMessage('success', pendingAction === 'clear' ? ui.cleared : ui.restored);
    setPendingAction(null);
  };

  const undoBatch = () => {
    if (!undoLabels) return;
    setLabels(undoLabels);
    setUndoLabels(null);
  };

  const downloadZpl = () => {
    const blob = new Blob([buildBatchZpl(labels, style)], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, fileName.replace(/\.(zpl|txt)$/i, '') + '-editado.zpl');
    trackEvent('result_downloaded', { tool: TOOL_ID.zplLabelEditor, locale, format: 'zpl' });
  };

  const getExportImage = async (label: LabelItem): Promise<{ dataUrl: string; fallback: boolean }> => {
    const generated = buildLabelZpl(label, style);
    try {
      const blob = await requestZplProviderPreview(generated, style);
      return { dataUrl: await blobToDataUrl(blob), fallback: false };
    } catch {
      return { dataUrl: await renderLocalZplPngDataUrl(generated, style), fallback: true };
    }
  };

  const exportCurrentPng = async () => {
    if (!selectedLabel) return;
    try {
      const image = await getExportImage(selectedLabel);
      const response = await fetch(image.dataUrl);
      downloadBlob(await response.blob(), `etiqueta-${labelNumber(selectedLabel.index)}.png`);
      trackEvent('result_downloaded', { tool: TOOL_ID.zplLabelEditor, locale, format: 'png' });
    } catch {
      setFeedbackMessage('error', ui.invalidZpl);
      trackEvent('tool_error', { tool: TOOL_ID.zplLabelEditor, locale, error_type: 'processing_failed' });
    }
  };

  const exportPdf = async () => {
    if (!labels.length || isExporting) return;
    setIsExporting(true);
    setExportProgress(0);
    trackEvent('generation_started', { tool: TOOL_ID.zplLabelEditor, locale, format: 'pdf' });
    let fallbackCount = 0;
    try {
      const { jsPDF } = await import('jspdf');
      const orientation = style.widthMm > style.heightMm ? 'landscape' : 'portrait';
      const pdf = new jsPDF({ orientation, unit: 'mm', format: [style.widthMm, style.heightMm] });

      for (let index = 0; index < labels.length; index += 1) {
        const image = await getExportImage(labels[index]);
        if (image.fallback) fallbackCount += 1;
        if (index > 0) pdf.addPage([style.widthMm, style.heightMm], orientation);
        pdf.addImage(image.dataUrl, 'PNG', 0, 0, style.widthMm, style.heightMm);
        setExportProgress(index + 1);
      }
      pdf.save(fileName.replace(/\.(zpl|txt)$/i, '') + '-etiquetas.pdf');
      trackEvent('tool_completed', { tool: TOOL_ID.zplLabelEditor, locale, format: 'pdf' });
      trackEvent('result_downloaded', { tool: TOOL_ID.zplLabelEditor, locale, format: 'pdf' });
      setFeedbackMessage('success', fallbackCount ? `${ui.pdfReady(labels.length)} ${fallbackCount} preview(s) usaram o modo local.` : ui.pdfReady(labels.length));
    } catch {
      setFeedbackMessage('error', ui.invalidZpl);
      trackEvent('tool_error', { tool: TOOL_ID.zplLabelEditor, locale, error_type: 'processing_failed' });
    } finally {
      setIsExporting(false);
      setExportProgress(null);
    }
  };

  if (!labels.length) {
    return (
      <Card className="mx-auto max-w-4xl space-y-6">
        {draft ? (
          <div className="flex flex-col gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-brand-900">{ui.draftFound}</p>
            <div className="flex gap-2">
              <Button onClick={resumeDraft}>{ui.restoreDraft}</Button>
              <Button variant="secondary" onClick={discardDraft}>{ui.discardDraft}</Button>
            </div>
          </div>
        ) : null}
        <div className="space-y-2 text-center">
          <h3 className="text-xl font-bold tracking-tight text-slate-900">{ui.importTitle}</h3>
          <p className="mx-auto max-w-xl text-sm leading-6 text-slate-600">{ui.importSubtitle}</p>
        </div>
        <FileUploadDropzone
          label={ui.chooseFile}
          onFilesSelected={(files) => void handleFiles(files)}
          accept=".zpl,.txt,text/plain,application/octet-stream"
          multiple={false}
          acceptedDescription=".zpl, .txt"
          helperText={ui.processingLocal}
          locale={locale}
        />
        <div className="flex justify-center">
          <Button variant="ghost" onClick={() => setShowPaste((current) => !current)} className="gap-2">
            <ClipboardPaste className="h-4 w-4" /> {ui.pasteCode}
          </Button>
        </div>
        {showPaste ? (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-800" htmlFor="zpl-paste">{ui.pasteLabel}</label>
            <Textarea id="zpl-paste" value={pastedZpl} onChange={(event) => setPastedZpl(event.target.value)} placeholder={ui.pastePlaceholder} className="min-h-[220px] font-mono text-xs" />
            <div className="flex justify-end"><Button onClick={() => importZpl(pastedZpl, 'etiquetas-coladas.zpl', 'paste')} disabled={!pastedZpl.trim()}>{ui.analyze}</Button></div>
          </div>
        ) : null}
        {feedback ? <FeedbackMessage feedback={feedback} /> : null}
      </Card>
    );
  }

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-5">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{fileName}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span>{ui.found(labels.length)}</span><span aria-hidden>•</span><span className="font-semibold text-emerald-700">{ui.incomplete(filledCount, labels.length)}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={downloadZpl} className="gap-2"><FileCode2 className="h-4 w-4" />{ui.exportZpl}</Button>
          <Button onClick={() => void exportPdf()} disabled={isExporting} className="gap-2"><Download className="h-4 w-4" />{isExporting && exportProgress !== null ? ui.generating(exportProgress, labels.length) : ui.generated}</Button>
        </div>
      </div>

      <div className="border-b border-slate-200 px-4 py-3 lg:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex rounded-lg bg-slate-100 p-1" role="tablist" aria-label="Modo de edição">
            <button type="button" onClick={() => setWorkspaceMode('focus')} className={cn('rounded-md px-3 py-1.5 text-sm font-semibold', workspaceMode === 'focus' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600')}><span className="inline-flex items-center gap-2"><Move className="h-4 w-4" />{ui.focus}</span></button>
            <button type="button" onClick={() => setWorkspaceMode('grid')} className={cn('rounded-md px-3 py-1.5 text-sm font-semibold', workspaceMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600')}><span className="inline-flex items-center gap-2"><Grid3X3 className="h-4 w-4" />{ui.grid}</span></button>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600"><span>{progress}%</span><div className="h-2 w-28 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} /></div></div>
        </div>
      </div>

      {workspaceMode === 'grid' ? (
        <GridWorkspace labels={visibleLabels} style={style} ui={ui} gridSize={gridSize} filter={filter} search={search} onFilterChange={setFilter} onSearchChange={setSearch} onGridSizeChange={setGridSize} onSelect={(index) => { setSelectedIndex(index); setWorkspaceMode('focus'); }} />
      ) : selectedLabel ? (
        <div className="grid min-w-0 lg:grid-cols-[250px_minmax(0,1fr)]">
          <LabelSidebar labels={visibleLabels} selectedIndex={selectedIndex} filter={filter} search={search} ui={ui} onFilterChange={setFilter} onSearchChange={setSearch} onSelect={setSelectedIndex} onNextPending={goToNextPending} />
          <div className="min-w-0 space-y-5 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><p className="text-sm font-bold text-slate-900">{ui.selected(selectedIndex + 1, labels.length)}</p><p className="text-xs text-slate-500">{ui.original}</p></div>
              <div className="flex flex-wrap gap-1">
                <Button variant="ghost" onClick={() => setZoom((current) => Math.max(70, current - 20))} aria-label="Diminuir zoom" className="w-10 px-0"><Minus className="h-4 w-4" /></Button>
                <Button variant="ghost" onClick={() => setZoom((current) => Math.min(160, current + 20))} aria-label="Aumentar zoom" className="w-10 px-0"><Plus className="h-4 w-4" /></Button>
                <Button variant="ghost" onClick={() => setZoom(100)} className="px-3">100%</Button>
                <Button variant="ghost" onClick={() => setFullscreen(true)} className="w-10 px-0" aria-label={ui.fullscreen}><Maximize2 className="h-4 w-4" /></Button>
              </div>
            </div>

            <div className="grid place-items-center overflow-auto rounded-xl bg-slate-100 p-4 sm:p-6" style={{ height: 'min(68vh, 680px)', minHeight: '320px' }}>
              <div className="w-full shrink-0" style={{ maxWidth: `${Math.round(380 * (zoom / 100))}px` }}>
                <ZplLabelPreview zpl={selectedZpl} style={style} imageUrl={previewUrl} fallback={previewState === 'fallback'} loading={previewState === 'loading'} loadingLabel={ui.previewLoading} dragLabel={ui.dragDescription} editablePosition={editingPosition} onPositionChange={(position) => { updateStyle('x', position.x); updateStyle('y', position.y); }} />
              </div>
            </div>
            <p className="text-xs text-slate-500">{previewState === 'loading' ? ui.previewLoading : previewState === 'provider' ? ui.previewProvider : ui.previewFallback}. {ui.previewPrivacy}</p>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
              <div className="space-y-4">
                <div className="space-y-2"><label className="text-sm font-semibold text-slate-800" htmlFor="zpl-description">{ui.description}</label><Textarea id="zpl-description" value={selectedLabel.customData.description} onChange={(event) => updateDescription('description', event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); if (!(event.metaKey || event.ctrlKey)) { focusAfterNavigationRef.current = true; navigate(1); } } }} placeholder={ui.descriptionPlaceholder} className="min-h-[96px]" /><p className="text-xs text-slate-500">{ui.keyboardHint}</p></div>
                <div className="space-y-2"><label className="text-sm font-semibold text-slate-800" htmlFor="zpl-note">{ui.note}</label><Input id="zpl-note" value={selectedLabel.customData.note} onChange={(event) => updateDescription('note', event.target.value)} placeholder={ui.notePlaceholder} /></div>
                <div className="flex flex-wrap justify-between gap-2"><Button variant="secondary" onClick={() => navigate(-1)} disabled={selectedIndex === 0} className="gap-2"><ArrowLeft className="h-4 w-4" />{ui.previous}</Button><div className="flex gap-2"><Button variant="ghost" onClick={goToNextPending}>{ui.nextPending}</Button><Button onClick={() => { focusAfterNavigationRef.current = true; navigate(1); }} disabled={selectedIndex === labels.length - 1} className="gap-2">{ui.next}<ArrowRight className="h-4 w-4" /></Button></div></div>
              </div>
              <StyleEditor style={style} ui={ui} editingPosition={editingPosition} onStyleChange={updateStyle} onTogglePosition={() => setEditingPosition((current) => !current)} onApply={applyStyle} count={labels.length} />
            </div>

            <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-4"><Button variant="secondary" onClick={() => setAdvanced((current) => !current)} className="gap-2"><Code2 className="h-4 w-4" />{advanced ? ui.batch : ui.advanced}</Button><Button variant="secondary" onClick={() => void exportCurrentPng()}>{ui.exportPng}</Button><Button variant="ghost" onClick={restoreCurrent} className="gap-2"><RotateCcw className="h-4 w-4" />{ui.restoreLabel}</Button><Button variant="ghost" onClick={() => setPendingAction('clear')}>{ui.clearAll}</Button><Button variant="ghost" onClick={() => setPendingAction('restore')}>{ui.restoreAll}</Button></div>

            {advanced ? <AdvancedEditor label={selectedLabel} generatedZpl={selectedZpl} warnings={warnings} ui={ui} onChange={(editableZpl) => updateCurrentLabel((label) => { const next = { ...label, editableZpl }; return { ...next, generatedZpl: buildLabelZpl(next, style) }; })} /> : null}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><p className={cn('text-sm font-semibold', filledCount === labels.length ? 'text-emerald-700' : 'text-slate-700')}>{filledCount === labels.length ? `✓ ${ui.ready(labels.length)}` : `⚠ ${ui.incomplete(filledCount, labels.length)}`}</p><div className="flex flex-wrap gap-2"><Button variant="secondary" onClick={goToNextPending} disabled={filledCount === labels.length}>{ui.reviewPending}</Button><Button onClick={() => void exportPdf()} disabled={isExporting}>{ui.generateAnyway}</Button></div></div>
      {feedback ? <div className="px-4 py-3"><FeedbackMessage feedback={feedback} /></div> : null}
      {undoLabels ? <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-brand-50 px-4 py-3 text-sm text-brand-900"><span>{ui.cleared}</span><Button variant="ghost" onClick={undoBatch} className="gap-2 text-brand-900"><Undo2 className="h-4 w-4" />{ui.undo}</Button></div> : null}
      {pendingAction ? <ConfirmationBar message={pendingAction === 'clear' ? ui.confirmClear : ui.confirmRestore} ui={ui} onConfirm={executeBatchAction} onCancel={() => setPendingAction(null)} /> : null}
      {fullscreen && selectedLabel ? <FullscreenPreview ui={ui} zpl={selectedZpl} style={style} imageUrl={previewUrl} fallback={previewState === 'fallback'} onClose={() => setFullscreen(false)} /> : null}
    </Card>
  );
}

function FeedbackMessage({ feedback }: Readonly<{ feedback: NonNullable<Feedback> }>) {
  return <div className={cn('rounded-lg border px-3 py-2 text-sm', feedback.tone === 'error' ? 'border-red-200 bg-red-50 text-red-800' : feedback.tone === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-brand-200 bg-brand-50 text-brand-900')}>{feedback.message}</div>;
}

type SidebarProps = Readonly<{ labels: LabelItem[]; selectedIndex: number; filter: FilterMode; search: string; ui: ToolUi; onFilterChange: (filter: FilterMode) => void; onSearchChange: (search: string) => void; onSelect: (index: number) => void; onNextPending: () => void }>;
function LabelSidebar({ labels, selectedIndex, filter, search, ui, onFilterChange, onSearchChange, onSelect, onNextPending }: SidebarProps) {
  return <aside className="min-w-0 border-b border-slate-200 bg-slate-50 p-3 lg:border-b-0 lg:border-r"><div className="space-y-3"><div className="flex items-center justify-between"><h3 className="text-sm font-bold uppercase tracking-wide text-slate-600">{ui.labels}</h3><Button variant="ghost" onClick={onNextPending} className="h-8 px-2 text-xs">{ui.nextPending}</Button></div><label className="relative block"><span className="sr-only">{ui.search}</span><Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" /><Input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder={ui.searchPlaceholder} className="h-10 pl-9" /></label><div className="flex gap-1 overflow-x-auto"><FilterButton active={filter === 'all'} onClick={() => onFilterChange('all')}>{ui.all}</FilterButton><FilterButton active={filter === 'filled'} onClick={() => onFilterChange('filled')}>{ui.filled}</FilterButton><FilterButton active={filter === 'pending'} onClick={() => onFilterChange('pending')}>{ui.pending}</FilterButton></div></div><div className="mt-3 max-h-[280px] space-y-1 overflow-y-auto lg:max-h-[650px]">{labels.length ? labels.map((label) => <button key={label.id} type="button" onClick={() => onSelect(label.index)} className={cn('flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition', selectedIndex === label.index ? 'bg-brand-100 text-brand-900' : 'hover:bg-slate-100 text-slate-700')}><span className={cn('grid h-5 w-5 shrink-0 place-items-center rounded-full text-xs font-bold', isFilled(label) ? 'bg-emerald-100 text-emerald-700' : selectedIndex === label.index ? 'bg-brand-600 text-white' : 'bg-amber-100 text-amber-800')}>{isFilled(label) ? <Check className="h-3.5 w-3.5" /> : selectedIndex === label.index ? '•' : '!'}</span><span className="shrink-0 font-mono text-xs">{labelNumber(label.index)}</span><span className="truncate">{label.customData.description || 'Sem descrição'}</span></button>) : <p className="p-3 text-sm text-slate-500">{ui.noLabels}</p>}</div></aside>;
}
function FilterButton({ active, children, onClick }: Readonly<{ active: boolean; children: React.ReactNode; onClick: () => void }>) { return <button type="button" onClick={onClick} className={cn('whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold', active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-slate-200')}>{children}</button>; }

type GridProps = Readonly<{ labels: LabelItem[]; style: LabelStyle; ui: ToolUi; gridSize: 'small' | 'medium' | 'large'; filter: FilterMode; search: string; onFilterChange: (filter: FilterMode) => void; onSearchChange: (search: string) => void; onGridSizeChange: (size: 'small' | 'medium' | 'large') => void; onSelect: (index: number) => void }>;
function GridWorkspace({ labels, style, ui, gridSize, filter, search, onFilterChange, onSearchChange, onGridSizeChange, onSelect }: GridProps) {
  const gridClass = gridSize === 'small' ? 'grid-cols-2 sm:grid-cols-4 xl:grid-cols-6' : gridSize === 'large' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4';
  return <div className="space-y-4 p-4 sm:p-5"><div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><div className="flex flex-wrap items-center gap-2"><div className="flex rounded-lg bg-slate-100 p-1"><FilterButton active={filter === 'all'} onClick={() => onFilterChange('all')}>{ui.all}</FilterButton><FilterButton active={filter === 'filled'} onClick={() => onFilterChange('filled')}>{ui.filled}</FilterButton><FilterButton active={filter === 'pending'} onClick={() => onFilterChange('pending')}>{ui.pending}</FilterButton></div><Select aria-label={ui.gridSize} value={gridSize} onChange={(event) => onGridSizeChange(event.target.value as 'small' | 'medium' | 'large')} className="h-9"><option value="small">{ui.small}</option><option value="medium">{ui.medium}</option><option value="large">{ui.large}</option></Select></div><label className="relative block"><span className="sr-only">{ui.search}</span><Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" /><Input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder={ui.searchPlaceholder} className="h-10 pl-9" /></label></div><div className={cn('grid gap-3', gridClass)}>{labels.map((label) => <button key={label.id} type="button" onClick={() => onSelect(label.index)} className="group min-w-0 rounded-xl border border-slate-200 bg-white p-2 text-left transition hover:border-brand-300 hover:shadow-card"><ZplLabelThumbnail zpl={buildLabelZpl(label, style)} style={style} label={`Etiqueta ${labelNumber(label.index)}`} /><div className="mt-2 flex items-center gap-2"><span className="font-mono text-xs font-bold text-slate-500">#{labelNumber(label.index)}</span><span className={cn('h-2 w-2 rounded-full', isFilled(label) ? 'bg-emerald-500' : 'bg-amber-400')} /></div><p className="mt-1 truncate text-sm font-semibold text-slate-800">{label.customData.description || 'Sem descrição'}</p></button>)}</div>{!labels.length ? <p className="py-10 text-center text-sm text-slate-500">{ui.noLabels}</p> : null}</div>;
}

type StyleEditorProps = Readonly<{ style: LabelStyle; ui: ToolUi; editingPosition: boolean; count: number; onStyleChange: <Key extends keyof LabelStyle>(key: Key, value: LabelStyle[Key]) => void; onTogglePosition: () => void; onApply: () => void }>;
function StyleEditor({ style, ui, editingPosition, count, onStyleChange, onTogglePosition, onApply }: StyleEditorProps) {
  const numberInput = (key: keyof LabelStyle, label: string, value: number, min: number, max: number) => <label className="block text-xs font-semibold text-slate-600">{label}<Input type="number" min={min} max={max} value={value} onChange={(event) => onStyleChange(key, Math.max(min, Math.min(max, Number(event.target.value) || min)) as never)} className="mt-1 h-9" /></label>;
  return <aside className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3"><div className="flex items-center gap-2"><Settings2 className="h-4 w-4 text-slate-500" /><h3 className="text-sm font-bold text-slate-900">{ui.settings}</h3></div><div className="grid grid-cols-2 gap-2">{numberInput('x', 'X', style.x, 0, 32000)}{numberInput('y', 'Y', style.y, 0, 32000)}</div><Button variant="secondary" onClick={onTogglePosition} className="h-9 w-full gap-2 text-xs"><Move className="h-4 w-4" />{editingPosition ? ui.stopEditingPosition : ui.editPosition}</Button><div className="grid grid-cols-2 gap-2">{numberInput('fontSize', ui.fontSize, style.fontSize, 8, 600)}{numberInput('width', ui.width, style.width, 20, 32000)}{numberInput('maxLines', ui.maxLines, style.maxLines, 1, 12)}</div><label className="block text-xs font-semibold text-slate-600">{ui.alignment}<Select value={style.alignment} onChange={(event) => onStyleChange('alignment', event.target.value as LabelStyle['alignment'])} className="mt-1 h-9"><option value="left">{ui.alignLeft}</option><option value="center">{ui.alignCenter}</option><option value="right">{ui.alignRight}</option></Select></label><label className="block text-xs font-semibold text-slate-600">{ui.dpi}<Select value={style.dpi} onChange={(event) => onStyleChange('dpi', Number(event.target.value) as LabelStyle['dpi'])} className="mt-1 h-9"><option value={203}>203</option><option value={300}>300</option><option value={600}>600</option></Select></label><div className="grid grid-cols-2 gap-2">{numberInput('widthMm', 'W mm', style.widthMm, 10, 500)}{numberInput('heightMm', 'H mm', style.heightMm, 10, 1000)}</div><label className="block text-xs font-semibold text-slate-600">{ui.rotation}<Select value={style.rotation} onChange={(event) => onStyleChange('rotation', Number(event.target.value) as LabelStyle['rotation'])} className="mt-1 h-9"><option value={0}>0°</option><option value={90}>90°</option><option value={180}>180°</option><option value={270}>270°</option></Select></label><Button onClick={onApply} className="h-auto min-h-10 w-full px-3 py-2 text-xs">{ui.applyStyle(count)}</Button></aside>;
}

function AdvancedEditor({ label, generatedZpl, warnings, ui, onChange }: Readonly<{ label: LabelItem; generatedZpl: string; warnings: string[]; ui: ToolUi; onChange: (value: string) => void }>) {
  return <div className="space-y-4 border-t border-slate-200 pt-5"><div><h3 className="text-base font-bold text-slate-900">{ui.codeEditor}</h3><p className="mt-1 text-sm text-slate-600">{ui.codeHint}</p></div><CodeMirror value={label.editableZpl} height="420px" basicSetup={{ lineNumbers: true, highlightActiveLine: true, foldGutter: true }} onChange={onChange} className="overflow-hidden rounded-lg border border-slate-200 text-sm" /><div className="rounded-lg border border-slate-200 bg-slate-50 p-3"><h4 className="text-sm font-bold text-slate-900">{ui.warnings}</h4>{warnings.length ? <ul className="mt-2 space-y-1 text-sm text-amber-800">{warnings.map((warning) => <li key={warning} className="flex gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{warning}</li>)}</ul> : <p className="mt-1 text-sm text-emerald-700">{ui.noWarnings}</p>}</div><details className="rounded-lg border border-slate-200 bg-white p-3"><summary className="cursor-pointer text-sm font-semibold text-slate-800">{ui.batchZpl}</summary><Textarea value={generatedZpl} readOnly className="mt-3 min-h-[220px] font-mono text-xs" /></details></div>;
}

function ConfirmationBar({ message, ui, onConfirm, onCancel }: Readonly<{ message: string; ui: ToolUi; onConfirm: () => void; onCancel: () => void }>) { return <div className="flex flex-col gap-3 border-t border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm font-semibold text-amber-900">{message}</p><div className="flex gap-2"><Button variant="secondary" onClick={onCancel}>{ui.cancel}</Button><Button onClick={onConfirm}>{ui.confirm}</Button></div></div>; }
function FullscreenPreview({ ui, zpl, style, imageUrl, fallback, onClose }: Readonly<{ ui: ToolUi; zpl: string; style: LabelStyle; imageUrl: string | null; fallback: boolean; onClose: () => void }>) { return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4"><div className="max-h-full w-full max-w-3xl overflow-auto rounded-xl bg-slate-100 p-4 shadow-2xl"><div className="mb-3 flex justify-end"><Button variant="secondary" onClick={onClose}>{ui.close}</Button></div><div className="mx-auto w-full max-w-[520px]"><ZplLabelPreview zpl={zpl} style={style} imageUrl={imageUrl} fallback={fallback} loadingLabel={ui.previewLoading} /></div></div></div>; }
