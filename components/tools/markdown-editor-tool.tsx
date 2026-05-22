'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEventHandler, type MouseEvent as ReactMouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import type { AppLocale } from '@/lib/i18n/config';
import {
  buildMarkdownHtmlDocument,
  downloadTextFile,
  exportMarkdownAsDocx,
  exportMarkdownPreviewAsPdf,
  exportMarkdownPreviewAsPng,
  getMarkdownStats,
  parseMarkdownToHtml,
  sanitizeMarkdownFileBaseName,
} from '@/lib/markdown';

type MarkdownEditorToolProps = Readonly<{
  locale?: AppLocale;
}>;

type LayoutMode = 'split' | 'editor' | 'preview';
type ExportFormat = 'md' | 'html' | 'png' | 'pdf' | 'docx';
type StatusTone = 'success' | 'warning' | 'error';

type ToolUi = {
  editorPlaceholder: string;
  previewEmpty: string;
  splitView: string;
  editorOnly: string;
  previewOnly: string;
  focusMode: string;
  exitFocusMode: string;
  loadSample: string;
  clear: string;
  htmlCopy: string;
  htmlCopied: string;
  exportAction: string;
  exportingAction: string;
  localProcessingNote: string;
  wordsLabel: string;
  charsLabel: string;
  linesLabel: string;
  readingTimeLabel: string;
  minutesSuffix: string;
  statusFileLoaded: string;
  statusFileReadError: string;
  statusNoContentToExport: string;
  statusExportDone: string;
  statusExportDoneTruncated: string;
  statusExportDoneExternalImages: string;
  statusHtmlCopied: string;
  statusHtmlCopyError: string;
  statusExportError: string;
  uploadFile: string;
  placeholders: {
    heading: string;
    listItem: string;
    taskItem: string;
    quote: string;
    bold: string;
    italic: string;
    strike: string;
    linkText: string;
    linkUrl: string;
    imageAlt: string;
    imageUrl: string;
    codeInline: string;
    codeBlock: string;
    tableHeadA: string;
    tableHeadB: string;
    tableCellA: string;
    tableCellB: string;
  };
  actions: {
    h1: string;
    h2: string;
    h3: string;
    bold: string;
    italic: string;
    strike: string;
    highlight: string;
    quote: string;
    ul: string;
    ol: string;
    task: string;
    link: string;
    image: string;
    code: string;
    codeBlock: string;
    table: string;
    hr: string;
  };
  exportOptions: Array<{ value: ExportFormat; label: string }>;
  sampleMarkdown: string;
};

type SelectionMutation = {
  text: string;
  selectionStart: number;
  selectionEnd: number;
};

const STORAGE_KEY = 'md-editor-content';
const STORAGE_FILENAME_KEY = 'md-editor-filename';

const uiByLocale: Record<AppLocale, ToolUi> = {
  'pt-br': {
    editorPlaceholder: '# Seu documento\n\nComece a escrever aqui...',
    previewEmpty: 'Digite ou envie um arquivo Markdown para visualizar aqui.',
    splitView: 'Dividido',
    editorOnly: 'Editor',
    previewOnly: 'Preview',
    focusMode: 'Tela cheia',
    exitFocusMode: 'Sair',
    loadSample: 'Exemplo',
    clear: 'Limpar',
    htmlCopy: 'Copiar HTML',
    htmlCopied: 'Copiado!',
    exportAction: 'Exportar',
    exportingAction: 'Exportando...',
    localProcessingNote: 'Tudo processado localmente no navegador.',
    wordsLabel: 'Palavras',
    charsLabel: 'Caracteres',
    linesLabel: 'Linhas',
    readingTimeLabel: 'Leitura',
    minutesSuffix: 'min',
    statusFileLoaded: 'Arquivo carregado com sucesso.',
    statusFileReadError: 'Nao foi possivel ler o arquivo.',
    statusNoContentToExport: 'Adicione conteudo antes de exportar.',
    statusExportDone: 'Exportacao concluida.',
    statusExportDoneTruncated: 'Exportacao concluida. Documento limitado por performance.',
    statusExportDoneExternalImages: 'Exportacao concluida. Imagens externas substituidas por aviso.',
    statusHtmlCopied: 'HTML copiado para a area de transferencia.',
    statusHtmlCopyError: 'Nao foi possivel copiar. Verifique permissoes.',
    statusExportError: 'Falha ao exportar. Tente novamente.',
    uploadFile: 'Abrir .md',
    placeholders: {
      heading: 'Titulo',
      listItem: 'Item',
      taskItem: 'Tarefa',
      quote: 'Citacao',
      bold: 'negrito',
      italic: 'italico',
      strike: 'tachado',
      linkText: 'texto do link',
      linkUrl: 'https://exemplo.com',
      imageAlt: 'descricao',
      imageUrl: 'https://exemplo.com/imagem.png',
      codeInline: 'const x = 42',
      codeBlock: 'function exemplo() {\n  return true;\n}',
      tableHeadA: 'Coluna A',
      tableHeadB: 'Coluna B',
      tableCellA: 'Valor 1',
      tableCellB: 'Valor 2',
    },
    actions: {
      h1: 'H1',
      h2: 'H2',
      h3: 'H3',
      bold: 'B',
      italic: 'I',
      strike: 'S',
      highlight: 'Destaque',
      quote: 'Quote',
      ul: 'Lista',
      ol: '1.',
      task: '\u2611',
      link: 'Link',
      image: 'Img',
      code: 'Code',
      codeBlock: '{ }',
      table: 'Tabela',
      hr: '\u2014',
    },
    exportOptions: [
      { value: 'md', label: 'Markdown (.md)' },
      { value: 'html', label: 'HTML (.html)' },
      { value: 'png', label: 'PNG (.png)' },
      { value: 'pdf', label: 'PDF (.pdf)' },
      { value: 'docx', label: 'Word (.docx)' },
    ],
    sampleMarkdown: '# Guia rapido de Markdown\n\n## O que voce pode editar\n\n- Titulos\n- Listas\n- Links e imagens\n- Tabelas\n- Blocos de codigo\n\n> Dica: use o modo tela cheia para editar com mais espaco.\n\n### Exemplo de tabela\n\n| Recurso | Status |\n| --- | --- |\n| Upload .md | OK |\n| Preview em tempo real | OK |\n| Exportacao PDF/PNG | OK |\n\n### Exemplo de codigo\n\n```ts\nconst mensagem = \'Markdown pronto para publicar\';\nconsole.log(mensagem);\n```\n',
  },
  en: {
    editorPlaceholder: '# Your document\n\nStart writing here...',
    previewEmpty: 'Type or upload a Markdown file to preview here.',
    splitView: 'Split',
    editorOnly: 'Editor',
    previewOnly: 'Preview',
    focusMode: 'Fullscreen',
    exitFocusMode: 'Exit',
    loadSample: 'Sample',
    clear: 'Clear',
    htmlCopy: 'Copy HTML',
    htmlCopied: 'Copied!',
    exportAction: 'Export',
    exportingAction: 'Exporting...',
    localProcessingNote: 'Everything processed locally in your browser.',
    wordsLabel: 'Words',
    charsLabel: 'Characters',
    linesLabel: 'Lines',
    readingTimeLabel: 'Reading',
    minutesSuffix: 'min',
    statusFileLoaded: 'File loaded successfully.',
    statusFileReadError: 'Could not read the file.',
    statusNoContentToExport: 'Add content before exporting.',
    statusExportDone: 'Export completed.',
    statusExportDoneTruncated: 'Export completed. Output capped for performance.',
    statusExportDoneExternalImages: 'Export completed. External images replaced with fallback.',
    statusHtmlCopied: 'HTML copied to clipboard.',
    statusHtmlCopyError: 'Could not copy. Check browser permissions.',
    statusExportError: 'Export failed. Try again.',
    uploadFile: 'Open .md',
    placeholders: {
      heading: 'Title',
      listItem: 'Item',
      taskItem: 'Task',
      quote: 'Quote',
      bold: 'bold',
      italic: 'italic',
      strike: 'strike',
      linkText: 'link text',
      linkUrl: 'https://example.com',
      imageAlt: 'description',
      imageUrl: 'https://example.com/image.png',
      codeInline: 'const x = 42',
      codeBlock: 'function sample() {\n  return true;\n}',
      tableHeadA: 'Column A',
      tableHeadB: 'Column B',
      tableCellA: 'Value 1',
      tableCellB: 'Value 2',
    },
    actions: {
      h1: 'H1',
      h2: 'H2',
      h3: 'H3',
      bold: 'B',
      italic: 'I',
      strike: 'S',
      highlight: 'Mark',
      quote: 'Quote',
      ul: 'List',
      ol: '1.',
      task: '\u2611',
      link: 'Link',
      image: 'Img',
      code: 'Code',
      codeBlock: '{ }',
      table: 'Table',
      hr: '\u2014',
    },
    exportOptions: [
      { value: 'md', label: 'Markdown (.md)' },
      { value: 'html', label: 'HTML (.html)' },
      { value: 'png', label: 'PNG (.png)' },
      { value: 'pdf', label: 'PDF (.pdf)' },
      { value: 'docx', label: 'Word (.docx)' },
    ],
    sampleMarkdown: '# Quick Markdown Guide\n\n## What you can edit\n\n- Headings\n- Lists\n- Links and images\n- Tables\n- Code blocks\n\n> Tip: use fullscreen mode for a better editing experience.\n\n### Sample table\n\n| Feature | Status |\n| --- | --- |\n| .md upload | OK |\n| Real-time preview | OK |\n| PDF/PNG export | OK |\n\n### Sample code\n\n```ts\nconst message = \'Markdown ready to publish\';\nconsole.log(message);\n```\n',
  },
  es: {
    editorPlaceholder: '# Tu documento\n\nEmpieza a escribir aqui...',
    previewEmpty: 'Escribe o sube un archivo Markdown para verlo aqui.',
    splitView: 'Dividido',
    editorOnly: 'Editor',
    previewOnly: 'Preview',
    focusMode: 'Pantalla completa',
    exitFocusMode: 'Salir',
    loadSample: 'Ejemplo',
    clear: 'Limpiar',
    htmlCopy: 'Copiar HTML',
    htmlCopied: 'Copiado!',
    exportAction: 'Exportar',
    exportingAction: 'Exportando...',
    localProcessingNote: 'Todo procesado localmente en tu navegador.',
    wordsLabel: 'Palabras',
    charsLabel: 'Caracteres',
    linesLabel: 'Lineas',
    readingTimeLabel: 'Lectura',
    minutesSuffix: 'min',
    statusFileLoaded: 'Archivo cargado correctamente.',
    statusFileReadError: 'No fue posible leer el archivo.',
    statusNoContentToExport: 'Agrega contenido antes de exportar.',
    statusExportDone: 'Exportacion completada.',
    statusExportDoneTruncated: 'Exportacion completada. Salida limitada por rendimiento.',
    statusExportDoneExternalImages: 'Exportacion completada. Imagenes externas reemplazadas.',
    statusHtmlCopied: 'HTML copiado al portapapeles.',
    statusHtmlCopyError: 'No fue posible copiar. Revisa permisos.',
    statusExportError: 'Fallo al exportar. Intentalo de nuevo.',
    uploadFile: 'Abrir .md',
    placeholders: {
      heading: 'Titulo',
      listItem: 'Elemento',
      taskItem: 'Tarea',
      quote: 'Cita',
      bold: 'negrita',
      italic: 'italica',
      strike: 'tachado',
      linkText: 'texto del enlace',
      linkUrl: 'https://ejemplo.com',
      imageAlt: 'descripcion',
      imageUrl: 'https://ejemplo.com/imagen.png',
      codeInline: 'const x = 42',
      codeBlock: 'function ejemplo() {\n  return true;\n}',
      tableHeadA: 'Columna A',
      tableHeadB: 'Columna B',
      tableCellA: 'Valor 1',
      tableCellB: 'Valor 2',
    },
    actions: {
      h1: 'H1',
      h2: 'H2',
      h3: 'H3',
      bold: 'B',
      italic: 'I',
      strike: 'S',
      highlight: 'Resaltar',
      quote: 'Cita',
      ul: 'Lista',
      ol: '1.',
      task: '\u2611',
      link: 'Link',
      image: 'Img',
      code: 'Code',
      codeBlock: '{ }',
      table: 'Tabla',
      hr: '\u2014',
    },
    exportOptions: [
      { value: 'md', label: 'Markdown (.md)' },
      { value: 'html', label: 'HTML (.html)' },
      { value: 'png', label: 'PNG (.png)' },
      { value: 'pdf', label: 'PDF (.pdf)' },
      { value: 'docx', label: 'Word (.docx)' },
    ],
    sampleMarkdown: '# Guia rapido de Markdown\n\n## Que puedes editar\n\n- Titulos\n- Listas\n- Enlaces e imagenes\n- Tablas\n- Bloques de codigo\n\n> Consejo: usa pantalla completa para mas espacio.\n\n### Tabla de ejemplo\n\n| Recurso | Estado |\n| --- | --- |\n| Carga .md | OK |\n| Preview en tiempo real | OK |\n| Exportacion PDF/PNG | OK |\n\n### Codigo de ejemplo\n\n```ts\nconst mensaje = \'Markdown listo para publicar\';\nconsole.log(mensaje);\n```\n',
  },
};

const statusClassByTone: Record<StatusTone, string> = {
  success: 'bg-emerald-600 text-white',
  warning: 'bg-amber-500 text-white',
  error: 'bg-rose-600 text-white',
};

const readTextFile = (file: File): Promise<string> => file.text();

const createLineListFromSelection = (selected: string, fallback: string): string[] => {
  const base = selected || fallback;
  return base.split('\n').map((line) => line || fallback);
};

export function MarkdownEditorTool({ locale = 'pt-br' }: MarkdownEditorToolProps) {
  const ui = uiByLocale[locale];
  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [input, setInput] = useState('');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('split');
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [fileName, setFileName] = useState('markdown-document.md');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [isHtmlCopied, setIsHtmlCopied] = useState(false);
  const [status, setStatus] = useState<{ tone: StatusTone; text: string } | null>(null);
  const [splitRatio, setSplitRatio] = useState(50);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedContent = localStorage.getItem(STORAGE_KEY);
      const savedFilename = localStorage.getItem(STORAGE_FILENAME_KEY);
      if (savedContent !== null) {
        setInput(savedContent);
      } else {
        setInput(ui.sampleMarkdown);
      }
      if (savedFilename) {
        setFileName(savedFilename);
      }
    } catch {
      setInput(ui.sampleMarkdown);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage on change (debounced)
  useEffect(() => {
    if (!isHydrated) return;
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, input);
        localStorage.setItem(STORAGE_FILENAME_KEY, fileName);
      } catch {
        // Storage full or unavailable
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [input, fileName, isHydrated]);

  // Lock body scroll in focus mode
  useEffect(() => {
    if (!isFocusMode) return undefined;

    const scrollY = globalThis.scrollY;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      globalThis.scrollTo(0, scrollY);
    };
  }, [isFocusMode]);

  const renderedHtml = useMemo(() => parseMarkdownToHtml(input), [input]);
  const stats = useMemo(() => getMarkdownStats(input), [input]);
  const sanitizedBaseName = useMemo(() => sanitizeMarkdownFileBaseName(fileName), [fileName]);

  // Resizer drag logic
  const handleResizeStart = useCallback((e: ReactMouseEvent) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;

    const startX = e.clientX;
    const containerRect = container.getBoundingClientRect();
    const startRatio = splitRatio;

    const onMove = (moveEvent: globalThis.MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaPercent = (deltaX / containerRect.width) * 100;
      const newRatio = Math.min(80, Math.max(20, startRatio + deltaPercent));
      setSplitRatio(newRatio);
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [splitRatio]);

  // Selection mutation helpers
  const mutateSelection = (buildMutation: (selectedText: string) => SelectionMutation) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart ?? input.length;
    const end = textarea.selectionEnd ?? input.length;

    const before = input.slice(0, start);
    const selected = input.slice(start, end);
    const after = input.slice(end);

    const mutation = buildMutation(selected);
    const nextValue = `${before}${mutation.text}${after}`;

    setInput(nextValue);
    setStatus(null);

    globalThis.requestAnimationFrame(() => {
      textarea.focus();
      const absoluteStart = before.length + mutation.selectionStart;
      const absoluteEnd = before.length + mutation.selectionEnd;
      textarea.setSelectionRange(absoluteStart, absoluteEnd);
    });
  };

  const applyWrap = (prefix: string, suffix: string, placeholder: string) => {
    mutateSelection((selectedText) => {
      const text = selectedText || placeholder;
      const merged = `${prefix}${text}${suffix}`;
      if (selectedText) {
        return { text: merged, selectionStart: merged.length, selectionEnd: merged.length };
      }
      return { text: merged, selectionStart: prefix.length, selectionEnd: prefix.length + placeholder.length };
    });
  };

  const applyLinePrefix = (prefix: string, placeholder: string) => {
    mutateSelection((selectedText) => {
      const lines = createLineListFromSelection(selectedText, placeholder);
      const merged = lines.map((line) => `${prefix}${line}`).join('\n');
      return { text: merged, selectionStart: merged.length, selectionEnd: merged.length };
    });
  };

  const insertHeading = (level: 1 | 2 | 3) => {
    applyLinePrefix(`${'#'.repeat(level)} `, ui.placeholders.heading);
  };

  const insertOrderedList = () => {
    mutateSelection((selectedText) => {
      const lines = createLineListFromSelection(selectedText, ui.placeholders.listItem);
      const merged = lines.map((line, i) => `${i + 1}. ${line}`).join('\n');
      return { text: merged, selectionStart: merged.length, selectionEnd: merged.length };
    });
  };

  const insertTaskList = () => {
    mutateSelection((selectedText) => {
      const lines = createLineListFromSelection(selectedText, ui.placeholders.taskItem);
      const merged = lines.map((line) => `- [ ] ${line}`).join('\n');
      return { text: merged, selectionStart: merged.length, selectionEnd: merged.length };
    });
  };

  const insertLink = () => {
    mutateSelection((selectedText) => {
      const label = selectedText || ui.placeholders.linkText;
      const merged = `[${label}](${ui.placeholders.linkUrl})`;
      const urlStart = merged.indexOf(ui.placeholders.linkUrl);
      if (selectedText) {
        return { text: merged, selectionStart: merged.length, selectionEnd: merged.length };
      }
      return { text: merged, selectionStart: urlStart, selectionEnd: urlStart + ui.placeholders.linkUrl.length };
    });
  };

  const insertImage = () => {
    mutateSelection((selectedText) => {
      const alt = selectedText || ui.placeholders.imageAlt;
      const merged = `![${alt}](${ui.placeholders.imageUrl})`;
      const urlStart = merged.indexOf(ui.placeholders.imageUrl);
      if (selectedText) {
        return { text: merged, selectionStart: merged.length, selectionEnd: merged.length };
      }
      return { text: merged, selectionStart: urlStart, selectionEnd: urlStart + ui.placeholders.imageUrl.length };
    });
  };

  const insertCodeBlock = () => {
    mutateSelection((selectedText) => {
      const block = selectedText || ui.placeholders.codeBlock;
      const merged = '\n```ts\n' + block + '\n```\n';
      const blockStart = merged.indexOf(block);
      if (selectedText) {
        return { text: merged, selectionStart: merged.length, selectionEnd: merged.length };
      }
      return { text: merged, selectionStart: blockStart, selectionEnd: blockStart + block.length };
    });
  };

  const insertTable = () => {
    const snippet = `| ${ui.placeholders.tableHeadA} | ${ui.placeholders.tableHeadB} |\n| --- | --- |\n| ${ui.placeholders.tableCellA} | ${ui.placeholders.tableCellB} |`;
    mutateSelection((selectedText) => {
      if (selectedText) {
        return { text: `${selectedText}\n${snippet}`, selectionStart: selectedText.length + snippet.length + 1, selectionEnd: selectedText.length + snippet.length + 1 };
      }
      return { text: snippet, selectionStart: 0, selectionEnd: snippet.length };
    });
  };

  const insertDivider = () => {
    mutateSelection(() => ({ text: '\n---\n', selectionStart: 5, selectionEnd: 5 }));
  };

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      mutateSelection((selectedText) => {
        if (!selectedText) return { text: '  ', selectionStart: 2, selectionEnd: 2 };
        const indented = selectedText.split('\n').map((line) => `  ${line}`).join('\n');
        return { text: indented, selectionStart: 0, selectionEnd: indented.length };
      });
      return;
    }

    const hasModifier = event.metaKey || event.ctrlKey;
    if (!hasModifier) return;

    const lower = event.key.toLowerCase();
    if (lower === 'b') { event.preventDefault(); applyWrap('**', '**', ui.placeholders.bold); }
    if (lower === 'i') { event.preventDefault(); applyWrap('*', '*', ui.placeholders.italic); }
    if (lower === 'k') { event.preventDefault(); insertLink(); }
  };

  const toolbarButtons = [
    { id: 'h1', label: ui.actions.h1, onClick: () => insertHeading(1), title: 'Heading 1' },
    { id: 'h2', label: ui.actions.h2, onClick: () => insertHeading(2), title: 'Heading 2' },
    { id: 'h3', label: ui.actions.h3, onClick: () => insertHeading(3), title: 'Heading 3' },
    { id: 'sep1', label: '|', onClick: undefined, title: '' },
    { id: 'bold', label: ui.actions.bold, onClick: () => applyWrap('**', '**', ui.placeholders.bold), title: 'Bold (Ctrl+B)' },
    { id: 'italic', label: ui.actions.italic, onClick: () => applyWrap('*', '*', ui.placeholders.italic), title: 'Italic (Ctrl+I)' },
    { id: 'strike', label: ui.actions.strike, onClick: () => applyWrap('~~', '~~', ui.placeholders.strike), title: 'Strikethrough' },
    { id: 'highlight', label: ui.actions.highlight, onClick: () => applyWrap('==', '==', 'highlight'), title: 'Highlight' },
    { id: 'sep2', label: '|', onClick: undefined, title: '' },
    { id: 'quote', label: ui.actions.quote, onClick: () => applyLinePrefix('> ', ui.placeholders.quote), title: 'Blockquote' },
    { id: 'ul', label: ui.actions.ul, onClick: () => applyLinePrefix('- ', ui.placeholders.listItem), title: 'Unordered list' },
    { id: 'ol', label: ui.actions.ol, onClick: insertOrderedList, title: 'Ordered list' },
    { id: 'task', label: ui.actions.task, onClick: insertTaskList, title: 'Task list' },
    { id: 'sep3', label: '|', onClick: undefined, title: '' },
    { id: 'link', label: ui.actions.link, onClick: insertLink, title: 'Link (Ctrl+K)' },
    { id: 'image', label: ui.actions.image, onClick: insertImage, title: 'Image' },
    { id: 'code', label: ui.actions.code, onClick: () => applyWrap('`', '`', ui.placeholders.codeInline), title: 'Inline code' },
    { id: 'code-block', label: ui.actions.codeBlock, onClick: insertCodeBlock, title: 'Code block' },
    { id: 'table', label: ui.actions.table, onClick: insertTable, title: 'Table' },
    { id: 'hr', label: ui.actions.hr, onClick: insertDivider, title: 'Horizontal rule' },
  ];

  const handleUpload = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    try {
      const loadedText = await readTextFile(file);
      setInput(loadedText);
      setFileName(file.name);
      setStatus({ tone: 'success', text: ui.statusFileLoaded });
      setLayoutMode('split');
      setIsHtmlCopied(false);
    } catch {
      setStatus({ tone: 'error', text: ui.statusFileReadError });
    }
  };

  const handleCopyHtml = async () => {
    if (!renderedHtml) {
      setStatus({ tone: 'warning', text: ui.statusNoContentToExport });
      return;
    }
    try {
      await navigator.clipboard.writeText(renderedHtml);
      setIsHtmlCopied(true);
      setStatus({ tone: 'success', text: ui.statusHtmlCopied });
      setTimeout(() => setIsHtmlCopied(false), 1800);
    } catch {
      setStatus({ tone: 'error', text: ui.statusHtmlCopyError });
      setIsHtmlCopied(false);
    }
  };

  const handleExport = async () => {
    if (!input.trim() || !renderedHtml.trim()) {
      setStatus({ tone: 'warning', text: ui.statusNoContentToExport });
      return;
    }

    const base = sanitizedBaseName || 'markdown-document';
    setIsExporting(true);

    try {
      if (exportFormat === 'md') {
        downloadTextFile(input, `${base}.md`, 'text/markdown;charset=utf-8');
        setStatus({ tone: 'success', text: ui.statusExportDone });
        return;
      }
      if (exportFormat === 'html') {
        const htmlDocument = buildMarkdownHtmlDocument({ title: base, renderedHtml });
        downloadTextFile(htmlDocument, `${base}.html`, 'text/html;charset=utf-8');
        setStatus({ tone: 'success', text: ui.statusExportDone });
        return;
      }
      if (exportFormat === 'docx') {
        await exportMarkdownAsDocx({ markdownText: input, filename: `${base}.docx` });
        setStatus({ tone: 'success', text: ui.statusExportDone });
        return;
      }

      const previewWidth = Math.max(860, previewContainerRef.current?.clientWidth ?? 1100);

      if (exportFormat === 'png') {
        const result = await exportMarkdownPreviewAsPng({ renderedHtml, filename: `${base}.png`, width: previewWidth });
        const tone = result.truncated || result.omittedExternalImages > 0 ? 'warning' : 'success';
        const text = result.truncated ? ui.statusExportDoneTruncated : result.omittedExternalImages > 0 ? ui.statusExportDoneExternalImages : ui.statusExportDone;
        setStatus({ tone, text });
        return;
      }

      const result = await exportMarkdownPreviewAsPdf({ renderedHtml, filename: `${base}.pdf`, width: previewWidth });
      const tone = result.truncated || result.omittedExternalImages > 0 ? 'warning' : 'success';
      const text = result.truncated ? ui.statusExportDoneTruncated : result.omittedExternalImages > 0 ? ui.statusExportDoneExternalImages : ui.statusExportDone;
      setStatus({ tone, text });
    } catch {
      setStatus({ tone: 'error', text: ui.statusExportError });
    } finally {
      setIsExporting(false);
    }
  };

  const showEditor = layoutMode !== 'preview';
  const showPreview = layoutMode !== 'editor';

  // Status toast auto-dismiss
  useEffect(() => {
    if (!status) return;
    const timeout = setTimeout(() => setStatus(null), 4000);
    return () => clearTimeout(timeout);
  }, [status]);

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden',
        isFocusMode
          ? 'fixed inset-0 z-50 bg-white'
          : 'relative min-h-[560px] rounded-xl border border-slate-200',
      )}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,text/markdown,text/plain"
        className="hidden"
        onChange={(e) => { void handleUpload(e.target.files); e.target.value = ''; }}
      />

      {/* Top toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-1.5">
        {/* Formatting buttons */}
        <div className="flex flex-wrap items-center gap-0.5">
          {toolbarButtons.map((action) => {
            if (action.label === '|') {
              return <span key={action.id} className="mx-1 h-5 w-px bg-slate-300" />;
            }
            return (
              <button
                key={action.id}
                type="button"
                title={action.title}
                onClick={action.onClick}
                className="rounded px-2 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-200 hover:text-slate-900"
              >
                {action.label}
              </button>
            );
          })}
        </div>

        {/* Separator */}
        <span className="mx-2 h-5 w-px bg-slate-300 hidden sm:block" />

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-1 ml-auto">
          {/* Layout toggle */}
          <div className="flex items-center rounded-md border border-slate-300 bg-white overflow-hidden">
            {(['split', 'editor', 'preview'] as LayoutMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setLayoutMode(mode)}
                className={cn(
                  'px-2 py-1 text-xs font-medium transition',
                  layoutMode === mode
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100',
                )}
              >
                {mode === 'split' ? ui.splitView : mode === 'editor' ? ui.editorOnly : ui.previewOnly}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded px-2 py-1 text-xs font-medium text-slate-700 border border-slate-300 bg-white hover:bg-slate-100 transition"
          >
            {ui.uploadFile}
          </button>

          <button
            type="button"
            onClick={() => { setInput(ui.sampleMarkdown); setFileName('markdown-document.md'); setStatus(null); }}
            className="rounded px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 transition"
          >
            {ui.loadSample}
          </button>

          <button
            type="button"
            onClick={() => { setInput(''); setStatus(null); }}
            className="rounded px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-200 transition"
          >
            {ui.clear}
          </button>

          <button
            type="button"
            onClick={() => void handleCopyHtml()}
            className="rounded px-2 py-1 text-xs font-medium text-slate-700 border border-slate-300 bg-white hover:bg-slate-100 transition"
          >
            {isHtmlCopied ? ui.htmlCopied : ui.htmlCopy}
          </button>

          {/* Export group */}
          <div className="flex items-center gap-0">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
              className="h-7 rounded-l-md border border-r-0 border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none"
            >
              {ui.exportOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <Button
              variant="primary"
              className="h-7 rounded-l-none rounded-r-md px-3 text-xs"
              onClick={() => void handleExport()}
              disabled={isExporting}
            >
              {isExporting ? ui.exportingAction : ui.exportAction}
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setIsFocusMode((c) => !c)}
            className={cn(
              'rounded px-2 py-1 text-xs font-semibold transition',
              isFocusMode
                ? 'bg-slate-900 text-white hover:bg-slate-700'
                : 'text-slate-700 border border-slate-300 bg-white hover:bg-slate-100',
            )}
          >
            {isFocusMode ? ui.exitFocusMode : ui.focusMode}
          </button>
        </div>
      </div>

      {/* Main split panel */}
      <div
        ref={containerRef}
        className="flex flex-1 overflow-hidden min-h-0"
      >
        {/* Editor panel */}
        {showEditor && (
          <div
            className="flex flex-col overflow-hidden"
            style={{ width: layoutMode === 'split' ? `${splitRatio}%` : '100%' }}
          >
            <textarea
              ref={editorRef}
              value={input}
              onChange={(e) => { setInput(e.target.value); setStatus(null); setIsHtmlCopied(false); }}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              placeholder={ui.editorPlaceholder}
              className="h-full w-full flex-1 resize-none border-none bg-white p-4 font-mono text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
        )}

        {/* Resizer handle */}
        {showEditor && showPreview && (
          <div
            onMouseDown={handleResizeStart}
            className="group relative z-10 flex w-2 flex-shrink-0 cursor-col-resize items-center justify-center border-x border-slate-200 bg-slate-100 transition-colors hover:bg-brand-100"
          >
            <div className="h-8 w-0.5 rounded-full bg-slate-400 transition-colors group-hover:bg-brand-500" />
          </div>
        )}

        {/* Preview panel */}
        {showPreview && (
          <div
            ref={previewContainerRef}
            className="flex-1 overflow-auto bg-white p-6"
            style={{ width: layoutMode === 'split' ? `${100 - splitRatio}%` : '100%' }}
          >
            {renderedHtml ? (
              <article
                className="markdown-viewer-prose mx-auto max-w-none"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />
            ) : (
              <p className="text-sm text-slate-400 italic">{ui.previewEmpty}</p>
            )}
          </div>
        )}
      </div>

      {/* Bottom status bar */}
      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span>{ui.wordsLabel}: <strong className="text-slate-700">{stats.words}</strong></span>
          <span>{ui.charsLabel}: <strong className="text-slate-700">{stats.characters}</strong></span>
          <span>{ui.linesLabel}: <strong className="text-slate-700">{stats.lines}</strong></span>
          <span>{ui.readingTimeLabel}: <strong className="text-slate-700">{stats.readingMinutes} {ui.minutesSuffix}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-slate-400">{ui.localProcessingNote}</span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="text-slate-600 font-medium">{fileName}</span>
        </div>
      </div>

      {/* Status toast */}
      {status && (
        <div className={cn(
          'absolute bottom-10 left-1/2 -translate-x-1/2 rounded-lg px-4 py-2 text-xs font-medium shadow-lg z-20',
          statusClassByTone[status.tone],
        )}>
          {status.text}
        </div>
      )}
    </div>
  );
}
