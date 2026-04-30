'use client';

import { useEffect, useMemo, useRef, useState, type KeyboardEventHandler } from 'react';
import { FileUploadDropzone } from '@/components/shared/file-upload-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
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
  title: string;
  intro: string;
  uploadLabel: string;
  uploadHint: string;
  acceptedDescription: string;
  editorLabel: string;
  editorPlaceholder: string;
  previewLabel: string;
  previewHint: string;
  previewEmpty: string;
  toolbarTitle: string;
  layoutTitle: string;
  splitView: string;
  editorOnly: string;
  previewOnly: string;
  focusMode: string;
  exitFocusMode: string;
  loadSample: string;
  clear: string;
  htmlCopy: string;
  htmlCopied: string;
  exportTitle: string;
  exportFormatLabel: string;
  exportAction: string;
  exportingAction: string;
  currentFileLabel: string;
  localProcessingNote: string;
  statsTitle: string;
  wordsLabel: string;
  charsLabel: string;
  charsNoSpaceLabel: string;
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

const uiByLocale: Record<AppLocale, ToolUi> = {
  'pt-br': {
    title: 'Visualizador e Editor de Markdown',
    intro:
      'Edite Markdown com preview em tempo real, upload de arquivo .md, modo foco em tela cheia e exportacao em multiplos formatos.',
    uploadLabel: 'Arquivo Markdown (.md)',
    uploadHint: 'Envie um arquivo para abrir e continuar editando no navegador.',
    acceptedDescription: '.MD, .MARKDOWN',
    editorLabel: 'Editor Markdown',
    editorPlaceholder: '# Seu documento\n\nComece a escrever aqui...',
    previewLabel: 'Preview renderizado',
    previewHint: 'Visualizacao em tempo real da sintaxe Markdown.',
    previewEmpty: 'Digite ou envie um arquivo Markdown para visualizar aqui.',
    toolbarTitle: 'Atalhos de edicao',
    layoutTitle: 'Layout',
    splitView: 'Dividido',
    editorOnly: 'So editor',
    previewOnly: 'So preview',
    focusMode: 'Modo foco tela cheia',
    exitFocusMode: 'Sair do modo foco',
    loadSample: 'Carregar exemplo',
    clear: 'Limpar',
    htmlCopy: 'Copiar HTML renderizado',
    htmlCopied: 'HTML copiado',
    exportTitle: 'Exportacao',
    exportFormatLabel: 'Formato de saida',
    exportAction: 'Baixar / Exportar',
    exportingAction: 'Exportando...',
    currentFileLabel: 'Arquivo atual',
    localProcessingNote:
      'Privacidade: edicao, preview e exportacao acontecem localmente no navegador por padrao.',
    statsTitle: 'Resumo rapido',
    wordsLabel: 'Palavras',
    charsLabel: 'Caracteres',
    charsNoSpaceLabel: 'Caracteres sem espaco',
    linesLabel: 'Linhas',
    readingTimeLabel: 'Leitura estimada',
    minutesSuffix: 'min',
    statusFileLoaded: 'Arquivo Markdown carregado com sucesso.',
    statusFileReadError: 'Nao foi possivel ler o arquivo enviado. Tente novamente.',
    statusNoContentToExport: 'Adicione conteudo Markdown antes de exportar.',
    statusExportDone: 'Exportacao concluida com sucesso.',
    statusExportDoneTruncated:
      'Exportacao concluida. Documento muito longo: o arquivo final pode ter sido limitado para manter performance.',
    statusExportDoneExternalImages:
      'Exportacao concluida. Algumas imagens externas nao puderam ser incorporadas e foram substituidas por aviso no arquivo.',
    statusHtmlCopied: 'HTML renderizado copiado para a area de transferencia.',
    statusHtmlCopyError: 'Nao foi possivel copiar o HTML. Verifique permissoes do navegador.',
    statusExportError: 'Falha ao exportar o arquivo. Tente novamente em alguns segundos.',
    placeholders: {
      heading: 'Titulo da secao',
      listItem: 'Item da lista',
      taskItem: 'Tarefa pendente',
      quote: 'Texto em destaque',
      bold: 'texto forte',
      italic: 'texto em enfase',
      strike: 'texto removido',
      linkText: 'texto do link',
      linkUrl: 'https://seu-link.com',
      imageAlt: 'descricao da imagem',
      imageUrl: 'https://seu-arquivo.com/imagem.png',
      codeInline: 'const valor = 42',
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
      bold: 'Negrito',
      italic: 'Italico',
      strike: 'Tachado',
      quote: 'Citacao',
      ul: 'Lista',
      ol: 'Numerada',
      task: 'Checklist',
      link: 'Link',
      image: 'Imagem',
      code: 'Codigo',
      codeBlock: 'Bloco de codigo',
      table: 'Tabela',
      hr: 'Linha',
    },
    exportOptions: [
      { value: 'md', label: 'Markdown (.md)' },
      { value: 'html', label: 'HTML (.html)' },
      { value: 'png', label: 'Imagem PNG (.png)' },
      { value: 'pdf', label: 'PDF (.pdf)' },
      { value: 'docx', label: 'Documento Word (.docx)' },
    ],
    sampleMarkdown: `# Guia rapido de Markdown\n\n## O que voce pode editar\n\n- Titulos\n- Listas\n- Links e imagens\n- Tabelas\n- Blocos de codigo\n\n> Dica: use o modo foco para editar em tela cheia.\n\n### Exemplo de tabela\n\n| Recurso | Status |\n| --- | --- |\n| Upload .md | OK |\n| Preview em tempo real | OK |\n| Exportacao PDF/PNG | OK |\n\n### Exemplo de codigo\n\n\`\`\`ts\nconst mensagem = 'Markdown pronto para publicar';\nconsole.log(mensagem);\n\`\`\`\n`,
  },
  en: {
    title: 'Markdown Viewer and Editor',
    intro:
      'Edit Markdown with real-time preview, .md upload, fullscreen focus mode, and multi-format export.',
    uploadLabel: 'Markdown file (.md)',
    uploadHint: 'Upload a file to open and continue editing directly in your browser.',
    acceptedDescription: '.MD, .MARKDOWN',
    editorLabel: 'Markdown editor',
    editorPlaceholder: '# Your document\n\nStart writing here...',
    previewLabel: 'Rendered preview',
    previewHint: 'Real-time visualization of Markdown syntax.',
    previewEmpty: 'Type or upload a Markdown file to preview here.',
    toolbarTitle: 'Editing shortcuts',
    layoutTitle: 'Layout',
    splitView: 'Split',
    editorOnly: 'Editor only',
    previewOnly: 'Preview only',
    focusMode: 'Fullscreen focus mode',
    exitFocusMode: 'Exit focus mode',
    loadSample: 'Load sample',
    clear: 'Clear',
    htmlCopy: 'Copy rendered HTML',
    htmlCopied: 'HTML copied',
    exportTitle: 'Export',
    exportFormatLabel: 'Output format',
    exportAction: 'Download / Export',
    exportingAction: 'Exporting...',
    currentFileLabel: 'Current file',
    localProcessingNote:
      'Privacy: editing, preview, and exports are processed locally in your browser by default.',
    statsTitle: 'Quick stats',
    wordsLabel: 'Words',
    charsLabel: 'Characters',
    charsNoSpaceLabel: 'Chars without spaces',
    linesLabel: 'Lines',
    readingTimeLabel: 'Estimated reading',
    minutesSuffix: 'min',
    statusFileLoaded: 'Markdown file loaded successfully.',
    statusFileReadError: 'Could not read the uploaded file. Please try again.',
    statusNoContentToExport: 'Add Markdown content before exporting.',
    statusExportDone: 'Export completed successfully.',
    statusExportDoneTruncated:
      'Export completed. Large document detected: output may be capped to keep performance stable.',
    statusExportDoneExternalImages:
      'Export completed. Some external images could not be embedded and were replaced with fallback notes.',
    statusHtmlCopied: 'Rendered HTML copied to clipboard.',
    statusHtmlCopyError: 'Could not copy HTML. Check browser clipboard permissions.',
    statusExportError: 'Export failed. Please try again in a few seconds.',
    placeholders: {
      heading: 'Section title',
      listItem: 'List item',
      taskItem: 'Pending task',
      quote: 'Highlighted text',
      bold: 'strong text',
      italic: 'emphasized text',
      strike: 'removed text',
      linkText: 'link label',
      linkUrl: 'https://your-link.com',
      imageAlt: 'image description',
      imageUrl: 'https://your-file.com/image.png',
      codeInline: 'const value = 42',
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
      bold: 'Bold',
      italic: 'Italic',
      strike: 'Strike',
      quote: 'Quote',
      ul: 'Bulleted',
      ol: 'Numbered',
      task: 'Checklist',
      link: 'Link',
      image: 'Image',
      code: 'Code',
      codeBlock: 'Code block',
      table: 'Table',
      hr: 'Divider',
    },
    exportOptions: [
      { value: 'md', label: 'Markdown (.md)' },
      { value: 'html', label: 'HTML (.html)' },
      { value: 'png', label: 'PNG image (.png)' },
      { value: 'pdf', label: 'PDF (.pdf)' },
      { value: 'docx', label: 'Word document (.docx)' },
    ],
    sampleMarkdown: `# Quick Markdown Guide\n\n## What you can edit\n\n- Headings\n- Lists\n- Links and images\n- Tables\n- Code blocks\n\n> Tip: switch to focus mode for fullscreen editing.\n\n### Sample table\n\n| Feature | Status |\n| --- | --- |\n| .md upload | OK |\n| Real-time preview | OK |\n| PDF/PNG export | OK |\n\n### Sample code\n\n\`\`\`ts\nconst message = 'Markdown ready to publish';\nconsole.log(message);\n\`\`\`\n`,
  },
  es: {
    title: 'Visualizador y Editor de Markdown',
    intro:
      'Edita Markdown con vista previa en tiempo real, carga de .md, modo foco en pantalla completa y exportacion en varios formatos.',
    uploadLabel: 'Archivo Markdown (.md)',
    uploadHint: 'Sube un archivo para abrirlo y continuar editando en el navegador.',
    acceptedDescription: '.MD, .MARKDOWN',
    editorLabel: 'Editor Markdown',
    editorPlaceholder: '# Tu documento\n\nEmpieza a escribir aqui...',
    previewLabel: 'Vista previa renderizada',
    previewHint: 'Visualizacion en tiempo real de la sintaxis Markdown.',
    previewEmpty: 'Escribe o sube un archivo Markdown para verlo aqui.',
    toolbarTitle: 'Atajos de edicion',
    layoutTitle: 'Diseno',
    splitView: 'Dividido',
    editorOnly: 'Solo editor',
    previewOnly: 'Solo preview',
    focusMode: 'Modo foco pantalla completa',
    exitFocusMode: 'Salir del modo foco',
    loadSample: 'Cargar ejemplo',
    clear: 'Limpiar',
    htmlCopy: 'Copiar HTML renderizado',
    htmlCopied: 'HTML copiado',
    exportTitle: 'Exportacion',
    exportFormatLabel: 'Formato de salida',
    exportAction: 'Descargar / Exportar',
    exportingAction: 'Exportando...',
    currentFileLabel: 'Archivo actual',
    localProcessingNote:
      'Privacidad: la edicion, vista previa y exportacion se procesan localmente en tu navegador por defecto.',
    statsTitle: 'Resumen rapido',
    wordsLabel: 'Palabras',
    charsLabel: 'Caracteres',
    charsNoSpaceLabel: 'Caracteres sin espacio',
    linesLabel: 'Lineas',
    readingTimeLabel: 'Lectura estimada',
    minutesSuffix: 'min',
    statusFileLoaded: 'Archivo Markdown cargado correctamente.',
    statusFileReadError: 'No fue posible leer el archivo subido. Intentalo otra vez.',
    statusNoContentToExport: 'Agrega contenido Markdown antes de exportar.',
    statusExportDone: 'Exportacion completada con exito.',
    statusExportDoneTruncated:
      'Exportacion completada. Documento grande detectado: la salida puede limitarse para mantener rendimiento.',
    statusExportDoneExternalImages:
      'Exportacion completada. Algunas imagenes externas no pudieron incorporarse y fueron reemplazadas por avisos.',
    statusHtmlCopied: 'HTML renderizado copiado al portapapeles.',
    statusHtmlCopyError: 'No fue posible copiar el HTML. Revisa permisos del navegador.',
    statusExportError: 'Fallo al exportar el archivo. Intentalo de nuevo en unos segundos.',
    placeholders: {
      heading: 'Titulo de seccion',
      listItem: 'Elemento de lista',
      taskItem: 'Tarea pendiente',
      quote: 'Texto destacado',
      bold: 'texto fuerte',
      italic: 'texto en enfasis',
      strike: 'texto eliminado',
      linkText: 'texto del enlace',
      linkUrl: 'https://tu-enlace.com',
      imageAlt: 'descripcion de imagen',
      imageUrl: 'https://tu-archivo.com/imagen.png',
      codeInline: 'const valor = 42',
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
      bold: 'Negrita',
      italic: 'Italica',
      strike: 'Tachado',
      quote: 'Cita',
      ul: 'Lista',
      ol: 'Numerada',
      task: 'Checklist',
      link: 'Enlace',
      image: 'Imagen',
      code: 'Codigo',
      codeBlock: 'Bloque codigo',
      table: 'Tabla',
      hr: 'Linea',
    },
    exportOptions: [
      { value: 'md', label: 'Markdown (.md)' },
      { value: 'html', label: 'HTML (.html)' },
      { value: 'png', label: 'Imagen PNG (.png)' },
      { value: 'pdf', label: 'PDF (.pdf)' },
      { value: 'docx', label: 'Documento Word (.docx)' },
    ],
    sampleMarkdown: `# Guia rapido de Markdown\n\n## Que puedes editar\n\n- Titulos\n- Listas\n- Enlaces e imagenes\n- Tablas\n- Bloques de codigo\n\n> Consejo: usa el modo foco para editar en pantalla completa.\n\n### Tabla de ejemplo\n\n| Recurso | Estado |\n| --- | --- |\n| Carga .md | OK |\n| Preview en tiempo real | OK |\n| Exportacion PDF/PNG | OK |\n\n### Codigo de ejemplo\n\n\`\`\`ts\nconst mensaje = 'Markdown listo para publicar';\nconsole.log(mensaje);\n\`\`\`\n`,
  },
};

const statusClassByTone: Record<StatusTone, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  error: 'border-rose-200 bg-rose-50 text-rose-800',
};

const editorTextareaClass =
  'w-full rounded-xl border border-slate-300 bg-white p-4 text-sm font-mono text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-200';

const readTextFile = async (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('Falha ao ler arquivo'));

    reader.readAsText(file);
  });

const createLineListFromSelection = (selected: string, fallback: string): string[] => {
  const base = selected || fallback;
  return base.split('\n').map((line) => line || fallback);
};

export function MarkdownEditorTool({ locale = 'pt-br' }: MarkdownEditorToolProps) {
  const ui = uiByLocale[locale];
  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);

  const [input, setInput] = useState(ui.sampleMarkdown);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('split');
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [fileName, setFileName] = useState('markdown-document.md');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [isHtmlCopied, setIsHtmlCopied] = useState(false);
  const [status, setStatus] = useState<{ tone: StatusTone; text: string } | null>(null);

  useEffect(() => {
    setInput(ui.sampleMarkdown);
    setStatus(null);
    setIsHtmlCopied(false);
  }, [locale, ui.sampleMarkdown]);

  useEffect(() => {
    if (!isFocusMode) {
      return undefined;
    }

    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    const scrollY = window.scrollY;

    const previousHtmlOverflow = htmlElement.style.overflow;
    const previousBodyOverflow = bodyElement.style.overflow;
    const previousBodyPosition = bodyElement.style.position;
    const previousBodyTop = bodyElement.style.top;
    const previousBodyWidth = bodyElement.style.width;
    const previousBodyLeft = bodyElement.style.left;
    const previousBodyRight = bodyElement.style.right;
    const previousBodyOverscrollBehavior = bodyElement.style.overscrollBehavior;
    const previousHtmlOverscrollBehavior = htmlElement.style.overscrollBehavior;

    htmlElement.style.overflow = 'hidden';
    htmlElement.style.overscrollBehavior = 'none';
    bodyElement.style.overflow = 'hidden';
    bodyElement.style.overscrollBehavior = 'none';
    bodyElement.style.position = 'fixed';
    bodyElement.style.top = `-${scrollY}px`;
    bodyElement.style.left = '0';
    bodyElement.style.right = '0';
    bodyElement.style.width = '100%';

    return () => {
      htmlElement.style.overflow = previousHtmlOverflow;
      bodyElement.style.overflow = previousBodyOverflow;
      bodyElement.style.position = previousBodyPosition;
      bodyElement.style.top = previousBodyTop;
      bodyElement.style.width = previousBodyWidth;
      bodyElement.style.left = previousBodyLeft;
      bodyElement.style.right = previousBodyRight;
      bodyElement.style.overscrollBehavior = previousBodyOverscrollBehavior;
      htmlElement.style.overscrollBehavior = previousHtmlOverscrollBehavior;
      window.scrollTo(0, scrollY);
    };
  }, [isFocusMode]);

  const renderedHtml = useMemo(() => parseMarkdownToHtml(input), [input]);
  const stats = useMemo(() => getMarkdownStats(input), [input]);
  const sanitizedBaseName = useMemo(() => sanitizeMarkdownFileBaseName(fileName), [fileName]);

  const mutateSelection = (buildMutation: (selectedText: string) => SelectionMutation) => {
    const textarea = editorRef.current;

    if (!textarea) {
      return;
    }

    const start = textarea.selectionStart ?? input.length;
    const end = textarea.selectionEnd ?? input.length;

    const before = input.slice(0, start);
    const selected = input.slice(start, end);
    const after = input.slice(end);

    const mutation = buildMutation(selected);
    const nextValue = `${before}${mutation.text}${after}`;

    setInput(nextValue);
    setStatus(null);

    window.requestAnimationFrame(() => {
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
        return {
          text: merged,
          selectionStart: merged.length,
          selectionEnd: merged.length,
        };
      }

      return {
        text: merged,
        selectionStart: prefix.length,
        selectionEnd: prefix.length + placeholder.length,
      };
    });
  };

  const applyLinePrefix = (prefix: string, placeholder: string) => {
    mutateSelection((selectedText) => {
      const lines = createLineListFromSelection(selectedText, placeholder);
      const merged = lines.map((line) => `${prefix}${line}`).join('\n');

      return {
        text: merged,
        selectionStart: merged.length,
        selectionEnd: merged.length,
      };
    });
  };

  const insertHeading = (level: 1 | 2 | 3) => {
    applyLinePrefix(`${'#'.repeat(level)} `, ui.placeholders.heading);
  };

  const insertOrderedList = () => {
    mutateSelection((selectedText) => {
      const lines = createLineListFromSelection(selectedText, ui.placeholders.listItem);
      const merged = lines.map((line, index) => `${index + 1}. ${line}`).join('\n');

      return {
        text: merged,
        selectionStart: merged.length,
        selectionEnd: merged.length,
      };
    });
  };

  const insertTaskList = () => {
    mutateSelection((selectedText) => {
      const lines = createLineListFromSelection(selectedText, ui.placeholders.taskItem);
      const merged = lines.map((line) => `- [ ] ${line}`).join('\n');

      return {
        text: merged,
        selectionStart: merged.length,
        selectionEnd: merged.length,
      };
    });
  };

  const insertLink = () => {
    mutateSelection((selectedText) => {
      const label = selectedText || ui.placeholders.linkText;
      const merged = `[${label}](${ui.placeholders.linkUrl})`;
      const urlStart = merged.indexOf(ui.placeholders.linkUrl);

      if (selectedText) {
        return {
          text: merged,
          selectionStart: merged.length,
          selectionEnd: merged.length,
        };
      }

      return {
        text: merged,
        selectionStart: urlStart,
        selectionEnd: urlStart + ui.placeholders.linkUrl.length,
      };
    });
  };

  const insertImage = () => {
    mutateSelection((selectedText) => {
      const alt = selectedText || ui.placeholders.imageAlt;
      const merged = `![${alt}](${ui.placeholders.imageUrl})`;
      const urlStart = merged.indexOf(ui.placeholders.imageUrl);

      if (selectedText) {
        return {
          text: merged,
          selectionStart: merged.length,
          selectionEnd: merged.length,
        };
      }

      return {
        text: merged,
        selectionStart: urlStart,
        selectionEnd: urlStart + ui.placeholders.imageUrl.length,
      };
    });
  };

  const insertCodeBlock = () => {
    mutateSelection((selectedText) => {
      const block = selectedText || ui.placeholders.codeBlock;
      const merged = `\n\`\`\`ts\n${block}\n\`\`\`\n`;
      const blockStart = merged.indexOf(block);

      if (selectedText) {
        return {
          text: merged,
          selectionStart: merged.length,
          selectionEnd: merged.length,
        };
      }

      return {
        text: merged,
        selectionStart: blockStart,
        selectionEnd: blockStart + block.length,
      };
    });
  };

  const insertTable = () => {
    const snippet = `| ${ui.placeholders.tableHeadA} | ${ui.placeholders.tableHeadB} |\n| --- | --- |\n| ${ui.placeholders.tableCellA} | ${ui.placeholders.tableCellB} |`;

    mutateSelection((selectedText) => {
      if (selectedText) {
        return {
          text: `${selectedText}\n${snippet}`,
          selectionStart: selectedText.length + snippet.length + 1,
          selectionEnd: selectedText.length + snippet.length + 1,
        };
      }

      return {
        text: snippet,
        selectionStart: 0,
        selectionEnd: snippet.length,
      };
    });
  };

  const insertDivider = () => {
    mutateSelection(() => ({
      text: '\n---\n',
      selectionStart: 5,
      selectionEnd: 5,
    }));
  };

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      mutateSelection((selectedText) => {
        if (!selectedText) {
          return {
            text: '  ',
            selectionStart: 2,
            selectionEnd: 2,
          };
        }

        const indented = selectedText
          .split('\n')
          .map((line) => `  ${line}`)
          .join('\n');

        return {
          text: indented,
          selectionStart: 0,
          selectionEnd: indented.length,
        };
      });
      return;
    }

    const lower = event.key.toLowerCase();
    const hasModifier = event.metaKey || event.ctrlKey;

    if (!hasModifier) {
      return;
    }

    if (lower === 'b') {
      event.preventDefault();
      applyWrap('**', '**', ui.placeholders.bold);
    }

    if (lower === 'i') {
      event.preventDefault();
      applyWrap('*', '*', ui.placeholders.italic);
    }

    if (lower === 'k') {
      event.preventDefault();
      insertLink();
    }
  };

  const toolbarButtons = [
    { id: 'h1', label: ui.actions.h1, onClick: () => insertHeading(1) },
    { id: 'h2', label: ui.actions.h2, onClick: () => insertHeading(2) },
    { id: 'h3', label: ui.actions.h3, onClick: () => insertHeading(3) },
    { id: 'bold', label: ui.actions.bold, onClick: () => applyWrap('**', '**', ui.placeholders.bold) },
    { id: 'italic', label: ui.actions.italic, onClick: () => applyWrap('*', '*', ui.placeholders.italic) },
    { id: 'strike', label: ui.actions.strike, onClick: () => applyWrap('~~', '~~', ui.placeholders.strike) },
    { id: 'quote', label: ui.actions.quote, onClick: () => applyLinePrefix('> ', ui.placeholders.quote) },
    { id: 'ul', label: ui.actions.ul, onClick: () => applyLinePrefix('- ', ui.placeholders.listItem) },
    { id: 'ol', label: ui.actions.ol, onClick: insertOrderedList },
    { id: 'task', label: ui.actions.task, onClick: insertTaskList },
    { id: 'link', label: ui.actions.link, onClick: insertLink },
    { id: 'image', label: ui.actions.image, onClick: insertImage },
    { id: 'code', label: ui.actions.code, onClick: () => applyWrap('`', '`', ui.placeholders.codeInline) },
    { id: 'code-block', label: ui.actions.codeBlock, onClick: insertCodeBlock },
    { id: 'table', label: ui.actions.table, onClick: insertTable },
    { id: 'hr', label: ui.actions.hr, onClick: insertDivider },
  ];

  const handleUpload = async (files: File[]) => {
    const file = files[0];

    if (!file) {
      return;
    }

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
        const htmlDocument = buildMarkdownHtmlDocument({
          title: base,
          renderedHtml,
        });
        downloadTextFile(htmlDocument, `${base}.html`, 'text/html;charset=utf-8');
        setStatus({ tone: 'success', text: ui.statusExportDone });
        return;
      }

      if (exportFormat === 'docx') {
        await exportMarkdownAsDocx({
          markdownText: input,
          filename: `${base}.docx`,
        });
        setStatus({ tone: 'success', text: ui.statusExportDone });
        return;
      }

      const previewWidth = Math.max(860, previewContainerRef.current?.clientWidth ?? 1100);
      const buildWarningStatusText = (truncated: boolean, omittedExternalImages: number): string => {
        if (truncated && omittedExternalImages > 0) {
          return `${ui.statusExportDoneTruncated} ${ui.statusExportDoneExternalImages}`;
        }

        if (truncated) {
          return ui.statusExportDoneTruncated;
        }

        if (omittedExternalImages > 0) {
          return ui.statusExportDoneExternalImages;
        }

        return ui.statusExportDone;
      };

      if (exportFormat === 'png') {
        const result = await exportMarkdownPreviewAsPng({
          renderedHtml,
          filename: `${base}.png`,
          width: previewWidth,
        });

        setStatus({
          tone: result.truncated || result.omittedExternalImages > 0 ? 'warning' : 'success',
          text: buildWarningStatusText(result.truncated, result.omittedExternalImages),
        });

        return;
      }

      const result = await exportMarkdownPreviewAsPdf({
        renderedHtml,
        filename: `${base}.pdf`,
        width: previewWidth,
      });

      const hasPdfWarnings = result.truncated || result.omittedExternalImages > 0;
      setStatus({
        tone: hasPdfWarnings ? 'warning' : 'success',
        text: hasPdfWarnings
          ? `${buildWarningStatusText(result.truncated, result.omittedExternalImages)} (${result.pages} ${result.pages > 1 ? 'pages' : 'page'})`
          : `${ui.statusExportDone} (${result.pages} ${result.pages > 1 ? 'pages' : 'page'})`,
      });
    } catch {
      setStatus({ tone: 'error', text: ui.statusExportError });
    } finally {
      setIsExporting(false);
    }
  };

  const showEditor = layoutMode !== 'preview';
  const showPreview = layoutMode !== 'editor';

  return (
    <div
      className={cn(
        isFocusMode && 'fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-slate-950/50 p-2 sm:p-4',
      )}
    >
      <Card
        className={cn(
          'space-y-5',
          isFocusMode &&
            'mx-auto flex min-h-[calc(100vh-1rem)] w-full max-w-[1900px] flex-col overflow-y-auto rounded-2xl border-slate-200 p-4 shadow-2xl sm:min-h-[calc(100vh-2rem)] sm:p-6 lg:h-[calc(100vh-2rem)] lg:min-h-0',
        )}
      >
        <header className="rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 via-sky-50 to-emerald-50 p-4">
          <h3 className="text-lg font-semibold text-slate-900">{ui.title}</h3>
          <p className="mt-1 text-sm text-slate-700">{ui.intro}</p>
        </header>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <FileUploadDropzone
              locale={locale}
              label={ui.uploadLabel}
              helperText={ui.uploadHint}
              accept=".md,.markdown,text/markdown,text/plain"
              acceptedDescription={ui.acceptedDescription}
              multiple={false}
              onFilesSelected={(files) => {
                void handleUpload(files);
              }}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-800">{ui.layoutTitle}</span>
                <Select
                  value={layoutMode}
                  onChange={(event) => setLayoutMode(event.target.value as LayoutMode)}
                >
                  <option value="split">{ui.splitView}</option>
                  <option value="editor">{ui.editorOnly}</option>
                  <option value="preview">{ui.previewOnly}</option>
                </Select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-800">{ui.exportFormatLabel}</span>
                <Select
                  value={exportFormat}
                  onChange={(event) => setExportFormat(event.target.value as ExportFormat)}
                >
                  {ui.exportOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </label>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                onClick={() => setIsFocusMode((current) => !current)}
              >
                {isFocusMode ? ui.exitFocusMode : ui.focusMode}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setInput(ui.sampleMarkdown);
                  setFileName('markdown-document.md');
                  setStatus(null);
                  setIsHtmlCopied(false);
                }}
              >
                {ui.loadSample}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setInput('');
                  setStatus(null);
                  setIsHtmlCopied(false);
                }}
              >
                {ui.clear}
              </Button>
              <Button variant="secondary" onClick={handleCopyHtml}>
                {isHtmlCopied ? ui.htmlCopied : ui.htmlCopy}
              </Button>
              <Button variant="primary" onClick={() => void handleExport()} disabled={isExporting}>
                {isExporting ? ui.exportingAction : ui.exportAction}
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-800">{ui.toolbarTitle}</p>
              <div className="flex flex-wrap gap-2">
                {toolbarButtons.map((action) => (
                  <Button key={action.id} variant="secondary" className="h-9 px-3 text-xs" onClick={action.onClick}>
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <section className="rounded-xl border border-slate-200 bg-white p-4">
              <h4 className="text-sm font-semibold text-slate-900">{ui.statsTitle}</h4>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-700">
                <div className="rounded-lg bg-slate-50 p-2">
                  <dt className="text-xs text-slate-500">{ui.wordsLabel}</dt>
                  <dd className="font-semibold text-slate-900">{stats.words}</dd>
                </div>
                <div className="rounded-lg bg-slate-50 p-2">
                  <dt className="text-xs text-slate-500">{ui.linesLabel}</dt>
                  <dd className="font-semibold text-slate-900">{stats.lines}</dd>
                </div>
                <div className="rounded-lg bg-slate-50 p-2">
                  <dt className="text-xs text-slate-500">{ui.charsLabel}</dt>
                  <dd className="font-semibold text-slate-900">{stats.characters}</dd>
                </div>
                <div className="rounded-lg bg-slate-50 p-2">
                  <dt className="text-xs text-slate-500">{ui.charsNoSpaceLabel}</dt>
                  <dd className="font-semibold text-slate-900">{stats.nonWhitespaceCharacters}</dd>
                </div>
                <div className="col-span-2 rounded-lg bg-slate-50 p-2">
                  <dt className="text-xs text-slate-500">{ui.readingTimeLabel}</dt>
                  <dd className="font-semibold text-slate-900">
                    {stats.readingMinutes} {ui.minutesSuffix}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4">
              <h4 className="text-sm font-semibold text-slate-900">{ui.exportTitle}</h4>
              <p className="mt-2 text-xs text-slate-600">
                {ui.currentFileLabel}:{' '}
                <span className="font-semibold text-slate-800">{fileName}</span>
              </p>
              <p className="mt-3 text-xs text-slate-500">{ui.localProcessingNote}</p>
            </section>
          </div>
        </section>

        {status ? (
          <p className={cn('rounded-lg border px-3 py-2 text-sm', statusClassByTone[status.tone])}>
            {status.text}
          </p>
        ) : null}

        <section
          className={cn(
            'grid gap-4',
            layoutMode === 'split' ? 'xl:grid-cols-2' : 'grid-cols-1',
            isFocusMode && 'lg:min-h-0 lg:flex-1 lg:overflow-hidden',
          )}
        >
          {showEditor ? (
            <div className={cn('space-y-2', isFocusMode && 'lg:flex lg:min-h-0 lg:flex-col lg:overflow-hidden')}>
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-slate-900">{ui.editorLabel}</h4>
              </div>
              <div
                className={cn(
                  'rounded-xl border border-slate-200 bg-white p-2',
                  isFocusMode && 'flex min-h-[360px] flex-col lg:h-full lg:min-h-0',
                )}
              >
                <textarea
                  ref={editorRef}
                  value={input}
                  onChange={(event) => {
                    setInput(event.target.value);
                    setStatus(null);
                    setIsHtmlCopied(false);
                  }}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                  placeholder={ui.editorPlaceholder}
                  className={cn(
                    editorTextareaClass,
                    isFocusMode
                      ? 'min-h-[320px] flex-1 resize-none overflow-auto overscroll-contain lg:min-h-0'
                      : 'min-h-[440px] resize-y',
                  )}
                />
              </div>
            </div>
          ) : null}

          {showPreview ? (
            <div className={cn('space-y-2', isFocusMode && 'lg:flex lg:min-h-0 lg:flex-col lg:overflow-hidden')}>
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-slate-900">{ui.previewLabel}</h4>
                <p className="text-xs text-slate-500">{ui.previewHint}</p>
              </div>
              <div
                ref={previewContainerRef}
                className={cn(
                  'rounded-xl border border-slate-200 bg-white p-4',
                  isFocusMode
                    ? 'min-h-[320px] overflow-auto overscroll-contain lg:h-full lg:min-h-0'
                    : 'max-h-[640px] overflow-auto',
                )}
              >
                {renderedHtml ? (
                  <article
                    className="markdown-viewer-prose"
                    dangerouslySetInnerHTML={{ __html: renderedHtml }}
                  />
                ) : (
                  <p className="text-sm text-slate-500">{ui.previewEmpty}</p>
                )}
              </div>
            </div>
          ) : null}
        </section>
      </Card>
    </div>
  );
}
