'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileUploadDropzone } from '@/components/shared/file-upload-dropzone';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/cn';
import { type AppLocale } from '@/lib/i18n/config';

type HtmlViewerToolProps = Readonly<{
  locale?: AppLocale;
}>;

type EditorMode = 'editor' | 'files';

type SourceFileKind = 'html' | 'css' | 'js' | 'unsupported';

type LoadedSourceFile = {
  id: string;
  name: string;
  kind: SourceFileKind;
  content: string;
};

type HtmlViewerUi = {
  title: string;
  intro: string;
  modeEditor: string;
  modeFiles: string;
  htmlLabel: string;
  cssLabel: string;
  jsLabel: string;
  htmlPlaceholder: string;
  cssPlaceholder: string;
  jsPlaceholder: string;
  sample: string;
  clear: string;
  filesLabel: string;
  filesHint: string;
  htmlEntryLabel: string;
  unsupportedFilesWarning: string;
  noHtmlFileWarning: string;
  fileReadError: string;
  loadedFilesTitle: string;
  previewTitle: string;
  previewHint: string;
  fullscreen: string;
  exitFullscreen: string;
  openNewTab: string;
  securityHint: string;
  emptyPreviewHint: string;
};

const uiByLocale: Record<AppLocale, HtmlViewerUi> = {
  'pt-br': {
    title: 'HTML Viewer com CSS + JS',
    intro:
      'Cole código ou carregue múltiplos arquivos (.html, .css, .js), renderize em sandbox e visualize em tela cheia ou nova aba.',
    modeEditor: 'Editor',
    modeFiles: 'Arquivos',
    htmlLabel: 'HTML',
    cssLabel: 'CSS',
    jsLabel: 'JavaScript',
    htmlPlaceholder: '<main><h1>Olá, mundo</h1></main>',
    cssPlaceholder: 'body { font-family: sans-serif; }',
    jsPlaceholder: "document.querySelector('h1')?.classList.add('ativo');",
    sample: 'Exemplo rápido',
    clear: 'Limpar',
    filesLabel: 'Arquivos de código',
    filesHint: 'Você pode enviar vários .html, .css e .js de uma vez.',
    htmlEntryLabel: 'Arquivo HTML principal',
    unsupportedFilesWarning:
      'Alguns arquivos foram ignorados por extensão não suportada. Use apenas .html, .css ou .js.',
    noHtmlFileWarning:
      'Nenhum arquivo HTML foi encontrado. Inclua ao menos um .html para montar o preview com arquivos.',
    fileReadError:
      'Não foi possível ler um ou mais arquivos selecionados. Tente novamente.',
    loadedFilesTitle: 'Arquivos carregados',
    previewTitle: 'Preview',
    previewHint: 'O preview permite execução de CSS e JavaScript no sandbox.',
    fullscreen: 'Tela cheia',
    exitFullscreen: 'Sair da tela cheia',
    openNewTab: 'Abrir em nova aba',
    securityHint:
      'Dica de segurança: rode apenas código de confiança. Scripts são executados no preview.',
    emptyPreviewHint: 'Adicione HTML para visualizar o resultado.',
  },
  en: {
    title: 'HTML Viewer with CSS + JS',
    intro:
      'Paste code or upload multiple files (.html, .css, .js), render in sandbox, and preview in fullscreen or a new tab.',
    modeEditor: 'Editor',
    modeFiles: 'Files',
    htmlLabel: 'HTML',
    cssLabel: 'CSS',
    jsLabel: 'JavaScript',
    htmlPlaceholder: '<main><h1>Hello world</h1></main>',
    cssPlaceholder: 'body { font-family: sans-serif; }',
    jsPlaceholder: "document.querySelector('h1')?.classList.add('active');",
    sample: 'Quick sample',
    clear: 'Clear',
    filesLabel: 'Code files',
    filesHint: 'You can upload multiple .html, .css, and .js files at once.',
    htmlEntryLabel: 'Main HTML file',
    unsupportedFilesWarning:
      'Some files were ignored because their extension is not supported. Use .html, .css, or .js only.',
    noHtmlFileWarning:
      'No HTML file was found. Include at least one .html file for file mode preview.',
    fileReadError:
      'Could not read one or more selected files. Please try again.',
    loadedFilesTitle: 'Loaded files',
    previewTitle: 'Preview',
    previewHint: 'Preview supports CSS and JavaScript execution inside a sandbox.',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit fullscreen',
    openNewTab: 'Open in new tab',
    securityHint:
      'Security tip: run trusted code only. Scripts are executed inside preview.',
    emptyPreviewHint: 'Add HTML content to render preview.',
  },
  es: {
    title: 'Visor HTML con CSS + JS',
    intro:
      'Pega código o sube múltiples archivos (.html, .css, .js), renderiza en sandbox y visualiza en pantalla completa o nueva pestaña.',
    modeEditor: 'Editor',
    modeFiles: 'Archivos',
    htmlLabel: 'HTML',
    cssLabel: 'CSS',
    jsLabel: 'JavaScript',
    htmlPlaceholder: '<main><h1>Hola mundo</h1></main>',
    cssPlaceholder: 'body { font-family: sans-serif; }',
    jsPlaceholder: "document.querySelector('h1')?.classList.add('activo');",
    sample: 'Ejemplo rápido',
    clear: 'Limpiar',
    filesLabel: 'Archivos de código',
    filesHint: 'Puedes subir varios .html, .css y .js al mismo tiempo.',
    htmlEntryLabel: 'Archivo HTML principal',
    unsupportedFilesWarning:
      'Algunos archivos fueron ignorados por extensión no soportada. Usa solo .html, .css o .js.',
    noHtmlFileWarning:
      'No se encontró archivo HTML. Incluye al menos un .html para previsualizar en modo archivos.',
    fileReadError:
      'No fue posible leer uno o más archivos seleccionados. Inténtalo de nuevo.',
    loadedFilesTitle: 'Archivos cargados',
    previewTitle: 'Vista previa',
    previewHint: 'La vista previa permite ejecutar CSS y JavaScript dentro del sandbox.',
    fullscreen: 'Pantalla completa',
    exitFullscreen: 'Salir de pantalla completa',
    openNewTab: 'Abrir en nueva pestaña',
    securityHint:
      'Consejo de seguridad: ejecuta solo código confiable. Los scripts se ejecutan en la vista previa.',
    emptyPreviewHint: 'Agrega HTML para renderizar la vista previa.',
  },
};

const defaultSamplesByLocale: Record<AppLocale, { html: string; css: string; js: string }> = {
  'pt-br': {
    html: `<main class="hero">
  <h1>Preview de HTML em tempo real</h1>
  <p>Edite HTML, CSS e JS para testar componentes rápido.</p>
  <button id="cta">Clique aqui</button>
</main>`,
    css: `:root {
  color-scheme: light;
}

body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  font-family: "IBM Plex Sans", system-ui, sans-serif;
  background:
    radial-gradient(circle at 15% 15%, #fef3c7 0%, transparent 45%),
    radial-gradient(circle at 90% 10%, #dbeafe 0%, transparent 35%),
    #f8fafc;
}

.hero {
  max-width: 680px;
  padding: 2rem;
  border-radius: 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
}

#cta {
  border: 0;
  border-radius: 999px;
  padding: 0.7rem 1rem;
  font-weight: 700;
  background: #1d4ed8;
  color: white;
  cursor: pointer;
}`,
    js: `const btn = document.getElementById('cta');
if (btn) {
  btn.addEventListener('click', () => {
    btn.textContent = 'Funcionou!';
    btn.style.background = '#0f766e';
  });
}`,
  },
  en: {
    html: `<main class="hero">
  <h1>Real-time HTML preview</h1>
  <p>Edit HTML, CSS, and JS to test components quickly.</p>
  <button id="cta">Click me</button>
</main>`,
    css: `:root {
  color-scheme: light;
}

body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  font-family: "IBM Plex Sans", system-ui, sans-serif;
  background:
    radial-gradient(circle at 15% 15%, #fef3c7 0%, transparent 45%),
    radial-gradient(circle at 90% 10%, #dbeafe 0%, transparent 35%),
    #f8fafc;
}

.hero {
  max-width: 680px;
  padding: 2rem;
  border-radius: 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
}

#cta {
  border: 0;
  border-radius: 999px;
  padding: 0.7rem 1rem;
  font-weight: 700;
  background: #1d4ed8;
  color: white;
  cursor: pointer;
}`,
    js: `const btn = document.getElementById('cta');
if (btn) {
  btn.addEventListener('click', () => {
    btn.textContent = 'Done!';
    btn.style.background = '#0f766e';
  });
}`,
  },
  es: {
    html: `<main class="hero">
  <h1>Vista previa HTML en tiempo real</h1>
  <p>Edita HTML, CSS y JS para probar componentes rápido.</p>
  <button id="cta">Haz clic</button>
</main>`,
    css: `:root {
  color-scheme: light;
}

body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  font-family: "IBM Plex Sans", system-ui, sans-serif;
  background:
    radial-gradient(circle at 15% 15%, #fef3c7 0%, transparent 45%),
    radial-gradient(circle at 90% 10%, #dbeafe 0%, transparent 35%),
    #f8fafc;
}

.hero {
  max-width: 680px;
  padding: 2rem;
  border-radius: 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
}

#cta {
  border: 0;
  border-radius: 999px;
  padding: 0.7rem 1rem;
  font-weight: 700;
  background: #1d4ed8;
  color: white;
  cursor: pointer;
}`,
    js: `const btn = document.getElementById('cta');
if (btn) {
  btn.addEventListener('click', () => {
    btn.textContent = 'Listo!';
    btn.style.background = '#0f766e';
  });
}`,
  },
};

const modeButtonClass = (active: boolean) =>
  cn(
    'rounded-lg px-4 py-2 text-sm font-semibold transition',
    active ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300',
  );

const getSourceFileKind = (name: string): SourceFileKind => {
  const normalized = name.toLowerCase();

  if (normalized.endsWith('.html') || normalized.endsWith('.htm')) {
    return 'html';
  }

  if (normalized.endsWith('.css')) {
    return 'css';
  }

  if (normalized.endsWith('.js')) {
    return 'js';
  }

  return 'unsupported';
};

const readFileText = async (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error(`Falha ao ler ${file.name}`));
    reader.readAsText(file);
  });

const ensureHtmlDocument = (inputHtml: string): string => {
  const trimmed = inputHtml.trim();

  if (!trimmed) {
    return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>HTML Preview</title>
  </head>
  <body></body>
</html>`;
  }

  if (/<html[\s>]/i.test(trimmed)) {
    return trimmed;
  }

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>HTML Preview</title>
  </head>
  <body>
${trimmed}
  </body>
</html>`;
};

const injectStyleAndScript = (baseHtml: string, css: string, js: string): string => {
  let next = ensureHtmlDocument(baseHtml);

  if (css.trim()) {
    const styleTag = `<style id="preview-inline-css">\n${css}\n</style>`;

    if (/<\/head>/i.test(next)) {
      next = next.replace(/<\/head>/i, `${styleTag}\n</head>`);
    } else {
      next = `${styleTag}\n${next}`;
    }
  }

  if (js.trim()) {
    const scriptTag = `<script id="preview-inline-js">\n${js}\n</script>`;

    if (/<\/body>/i.test(next)) {
      next = next.replace(/<\/body>/i, `${scriptTag}\n</body>`);
    } else {
      next = `${next}\n${scriptTag}`;
    }
  }

  return next;
};

const joinFileBundle = (files: LoadedSourceFile[], kind: 'css' | 'js') =>
  files
    .filter((file) => file.kind === kind)
    .map((file) => `/* ${file.name} */\n${file.content}`)
    .join('\n\n');

export function HtmlViewerTool({ locale = 'pt-br' }: HtmlViewerToolProps) {
  const ui = uiByLocale[locale];
  const samples = defaultSamplesByLocale[locale];
  const previewContainerRef = useRef<HTMLDivElement | null>(null);

  const [mode, setMode] = useState<EditorMode>('editor');
  const [htmlInput, setHtmlInput] = useState(samples.html);
  const [cssInput, setCssInput] = useState(samples.css);
  const [jsInput, setJsInput] = useState(samples.js);

  const [loadedFiles, setLoadedFiles] = useState<LoadedSourceFile[]>([]);
  const [selectedHtmlFileId, setSelectedHtmlFileId] = useState<string>('');

  const [warningMessage, setWarningMessage] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setHtmlInput(samples.html);
    setCssInput(samples.css);
    setJsInput(samples.js);
  }, [samples.css, samples.html, samples.js]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === previewContainerRef.current);
    };

    window.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      window.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const htmlFiles = useMemo(
    () => loadedFiles.filter((file) => file.kind === 'html'),
    [loadedFiles],
  );

  const activeHtmlFile = useMemo(() => {
    if (!htmlFiles.length) {
      return null;
    }

    return (
      htmlFiles.find((file) => file.id === selectedHtmlFileId) ?? htmlFiles[0]
    );
  }, [htmlFiles, selectedHtmlFileId]);

  const previewFromEditor = useMemo(
    () => injectStyleAndScript(htmlInput, cssInput, jsInput),
    [cssInput, htmlInput, jsInput],
  );

  const previewFromFiles = useMemo(() => {
    const cssBundle = joinFileBundle(loadedFiles, 'css');
    const jsBundle = joinFileBundle(loadedFiles, 'js');
    const htmlBase = activeHtmlFile?.content ?? '';

    return injectStyleAndScript(htmlBase, cssBundle, jsBundle);
  }, [activeHtmlFile?.content, loadedFiles]);

  const previewDocument = mode === 'editor' ? previewFromEditor : previewFromFiles;

  const handleApplySample = () => {
    setHtmlInput(samples.html);
    setCssInput(samples.css);
    setJsInput(samples.js);
    setMode('editor');
    setWarningMessage('');
  };

  const handleClearEditor = () => {
    setHtmlInput('');
    setCssInput('');
    setJsInput('');
    setWarningMessage('');
  };

  const handleOpenNewTab = () => {
    const htmlBlob = new Blob([previewDocument], { type: 'text/html' });
    const blobUrl = URL.createObjectURL(htmlBlob);
    window.open(blobUrl, '_blank', 'noopener,noreferrer');
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
  };

  const handleToggleFullscreen = async () => {
    if (!previewContainerRef.current) {
      return;
    }

    try {
      if (document.fullscreenElement === previewContainerRef.current) {
        await document.exitFullscreen();
        return;
      }

      await previewContainerRef.current.requestFullscreen();
    } catch {
      setIsFullscreen(false);
    }
  };

  const handleFilesUpload = async (files: File[]) => {
    if (!files.length) {
      return;
    }

    let loaded: LoadedSourceFile[] = [];

    try {
      loaded = await Promise.all(
        files.map(async (file, index) => {
          const kind = getSourceFileKind(file.name);
          const content = kind === 'unsupported' ? '' : await readFileText(file);

          return {
            id: `${Date.now()}-${index}-${file.name}`,
            name: file.name,
            kind,
            content,
          } as LoadedSourceFile;
        }),
      );
    } catch {
      setWarningMessage(ui.fileReadError);
      return;
    }

    const supported = loaded.filter((file) => file.kind !== 'unsupported');
    const unsupportedCount = loaded.length - supported.length;
    const firstHtml = supported.find((file) => file.kind === 'html');

    setLoadedFiles(supported);
    setSelectedHtmlFileId(firstHtml?.id ?? '');
    setMode('files');

    if (!firstHtml) {
      setWarningMessage(ui.noHtmlFileWarning);
      return;
    }

    if (unsupportedCount > 0) {
      setWarningMessage(ui.unsupportedFilesWarning);
      return;
    }

    setWarningMessage('');
  };

  return (
    <Card className="space-y-6">
      <header className="rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 via-cyan-50 to-emerald-50 p-4">
        <h3 className="text-lg font-semibold text-slate-900">{ui.title}</h3>
        <p className="mt-1 text-sm text-slate-700">{ui.intro}</p>
      </header>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={modeButtonClass(mode === 'editor')}
          onClick={() => setMode('editor')}
        >
          {ui.modeEditor}
        </button>
        <button
          type="button"
          className={modeButtonClass(mode === 'files')}
          onClick={() => setMode('files')}
        >
          {ui.modeFiles}
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section className="space-y-4">
          {mode === 'editor' ? (
            <>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-800">{ui.htmlLabel}</span>
                <Textarea
                  value={htmlInput}
                  onChange={(event) => setHtmlInput(event.target.value)}
                  className="min-h-[170px] font-mono text-xs"
                  placeholder={ui.htmlPlaceholder}
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-800">{ui.cssLabel}</span>
                <Textarea
                  value={cssInput}
                  onChange={(event) => setCssInput(event.target.value)}
                  className="min-h-[150px] font-mono text-xs"
                  placeholder={ui.cssPlaceholder}
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-800">{ui.jsLabel}</span>
                <Textarea
                  value={jsInput}
                  onChange={(event) => setJsInput(event.target.value)}
                  className="min-h-[160px] font-mono text-xs"
                  placeholder={ui.jsPlaceholder}
                />
              </label>

              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={handleApplySample}>
                  {ui.sample}
                </Button>
                <Button variant="ghost" onClick={handleClearEditor}>
                  {ui.clear}
                </Button>
              </div>
            </>
          ) : null}

          {mode === 'files' ? (
            <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <FileUploadDropzone
                locale={locale}
                label={ui.filesLabel}
                helperText={ui.filesHint}
                accept=".html,.htm,.css,.js,text/html,text/css,text/javascript,application/javascript"
                acceptedDescription=".HTML, .HTM, .CSS, .JS"
                multiple
                onFilesSelected={(files) => {
                  void handleFilesUpload(files);
                }}
              />

              {htmlFiles.length ? (
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-800">{ui.htmlEntryLabel}</span>
                  <Select
                    value={activeHtmlFile?.id ?? ''}
                    onChange={(event) => setSelectedHtmlFileId(event.target.value)}
                  >
                    {htmlFiles.map((file) => (
                      <option key={file.id} value={file.id}>
                        {file.name}
                      </option>
                    ))}
                  </Select>
                </label>
              ) : null}

              {loadedFiles.length ? (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-800">{ui.loadedFilesTitle}</p>
                  <ul className="space-y-1 text-sm text-slate-700">
                    {loadedFiles.map((file) => (
                      <li key={file.id} className="rounded bg-white px-2 py-1">
                        <strong className="uppercase text-slate-500">{file.kind}</strong>{' '}
                        {file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          {warningMessage ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              {warningMessage}
            </p>
          ) : null}
        </section>

        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="text-base font-semibold text-slate-900">{ui.previewTitle}</h4>
              <p className="text-xs text-slate-600">{ui.previewHint}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={handleOpenNewTab}>
                {ui.openNewTab}
              </Button>
              <Button variant="secondary" onClick={handleToggleFullscreen}>
                {isFullscreen ? ui.exitFullscreen : ui.fullscreen}
              </Button>
            </div>
          </div>

          <div
            ref={previewContainerRef}
            className={cn(
              'overflow-hidden rounded-xl border border-slate-200 bg-white',
              isFullscreen ? 'h-full w-full' : 'h-[520px]',
            )}
          >
            {previewDocument.trim() ? (
              <iframe
                title="HTML preview"
                srcDoc={previewDocument}
                sandbox="allow-scripts allow-forms allow-modals allow-popups allow-downloads"
                className="h-full w-full"
              />
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-500">
                {ui.emptyPreviewHint}
              </div>
            )}
          </div>

          <p className="text-xs text-slate-500">{ui.securityHint}</p>
        </section>
      </div>
    </Card>
  );
}
