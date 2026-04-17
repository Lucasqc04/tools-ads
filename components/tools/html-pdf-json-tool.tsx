'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { type AppLocale } from '@/lib/i18n/config';
import { formatJsonText, type JsonFormatterMessages } from '@/lib/json-formatter';
import { cn } from '@/lib/cn';

type ToolTab = 'html' | 'pdf' | 'json';

type HtmlPdfJsonToolProps = {
  locale?: AppLocale;
};

type HtmlPdfJsonUi = {
  htmlSample: string;
  tabHtml: string;
  tabPdf: string;
  tabJson: string;
  htmlTitle: string;
  htmlDescription: string;
  htmlPlaceholder: string;
  quickExample: string;
  clear: string;
  htmlIframeTitle: string;
  pdfTitle: string;
  pdfDescription: string;
  fileLoaded: string;
  pdfIframeTitle: string;
  pdfEmpty: string;
  jsonTitle: string;
  jsonDescription: string;
  jsonPlaceholder: string;
  format: string;
  minify: string;
  copy: string;
  copied: string;
  jsonMessages: JsonFormatterMessages;
};

const uiByLocale: Record<AppLocale, HtmlPdfJsonUi> = {
  'pt-br': {
    htmlSample: `<main style="font-family: Arial, sans-serif; padding: 16px;">
  <h1>Preview de HTML</h1>
  <p>Este bloco é renderizado no iframe com sandbox.</p>
</main>`,
    tabHtml: 'HTML Viewer',
    tabPdf: 'PDF Viewer',
    tabJson: 'JSON Formatter',
    htmlTitle: 'Visualizador de HTML',
    htmlDescription:
      'Cole seu HTML e veja o preview em sandbox. Scripts não são permitidos neste preview.',
    htmlPlaceholder: 'Cole aqui seu HTML',
    quickExample: 'Exemplo rápido',
    clear: 'Limpar',
    htmlIframeTitle: 'Preview do HTML',
    pdfTitle: 'Visualizador de PDF',
    pdfDescription:
      'Selecione um PDF local. O arquivo não é enviado para servidor e permanece no seu navegador.',
    fileLoaded: 'Arquivo carregado:',
    pdfIframeTitle: 'Preview do PDF',
    pdfEmpty: 'Selecione um arquivo PDF para iniciar a visualização local.',
    jsonTitle: 'Formatador e Minificador de JSON',
    jsonDescription:
      'Cole um JSON válido para organizar com indentação ou gerar uma versão minificada.',
    jsonPlaceholder: '{"exemplo": true}',
    format: 'Formatar',
    minify: 'Minificar',
    copy: 'Copiar',
    copied: 'Copiado',
    jsonMessages: {
      emptyInput: 'Cole um JSON válido antes de formatar.',
      invalidPrefix: 'JSON inválido:',
      invalidFallback: 'JSON inválido. Revise a sintaxe e tente novamente.',
    },
  },
  en: {
    htmlSample: `<main style="font-family: Arial, sans-serif; padding: 16px;">
  <h1>HTML Preview</h1>
  <p>This block is rendered inside a sandboxed iframe.</p>
</main>`,
    tabHtml: 'HTML Viewer',
    tabPdf: 'PDF Viewer',
    tabJson: 'JSON Formatter',
    htmlTitle: 'HTML Viewer',
    htmlDescription:
      'Paste HTML and preview it in a sandbox. Script execution is disabled in this preview.',
    htmlPlaceholder: 'Paste your HTML here',
    quickExample: 'Quick sample',
    clear: 'Clear',
    htmlIframeTitle: 'HTML preview',
    pdfTitle: 'PDF Viewer',
    pdfDescription:
      'Select a local PDF file. It stays in your browser and is not uploaded by default.',
    fileLoaded: 'Loaded file:',
    pdfIframeTitle: 'PDF preview',
    pdfEmpty: 'Select a PDF file to start local preview.',
    jsonTitle: 'JSON Formatter and Minifier',
    jsonDescription:
      'Paste valid JSON to format with indentation or generate a minified output.',
    jsonPlaceholder: '{"example": true}',
    format: 'Format',
    minify: 'Minify',
    copy: 'Copy',
    copied: 'Copied',
    jsonMessages: {
      emptyInput: 'Paste valid JSON before formatting.',
      invalidPrefix: 'Invalid JSON:',
      invalidFallback: 'Invalid JSON. Check syntax and try again.',
    },
  },
  es: {
    htmlSample: `<main style="font-family: Arial, sans-serif; padding: 16px;">
  <h1>Vista previa de HTML</h1>
  <p>Este bloque se renderiza dentro de un iframe con sandbox.</p>
</main>`,
    tabHtml: 'Visor HTML',
    tabPdf: 'Visor PDF',
    tabJson: 'Formateador JSON',
    htmlTitle: 'Visor de HTML',
    htmlDescription:
      'Pega tu HTML y revisa la vista previa en sandbox. No se ejecutan scripts en este preview.',
    htmlPlaceholder: 'Pega aquí tu HTML',
    quickExample: 'Ejemplo rápido',
    clear: 'Limpiar',
    htmlIframeTitle: 'Vista previa HTML',
    pdfTitle: 'Visor de PDF',
    pdfDescription:
      'Selecciona un PDF local. El archivo permanece en tu navegador y no se sube por defecto.',
    fileLoaded: 'Archivo cargado:',
    pdfIframeTitle: 'Vista previa PDF',
    pdfEmpty: 'Selecciona un PDF para iniciar la vista local.',
    jsonTitle: 'Formateador y Minificador JSON',
    jsonDescription:
      'Pega un JSON válido para formatear con indentación o minificar.',
    jsonPlaceholder: '{"ejemplo": true}',
    format: 'Formatear',
    minify: 'Minificar',
    copy: 'Copiar',
    copied: 'Copiado',
    jsonMessages: {
      emptyInput: 'Pega un JSON válido antes de formatear.',
      invalidPrefix: 'JSON inválido:',
      invalidFallback: 'JSON inválido. Revisa la sintaxis e inténtalo de nuevo.',
    },
  },
};

const tabStyles = (active: boolean) =>
  cn(
    'rounded-lg px-4 py-2 text-sm font-semibold transition',
    active ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300',
  );

export function HtmlPdfJsonTool({ locale = 'pt-br' }: HtmlPdfJsonToolProps) {
  const ui = uiByLocale[locale];

  const [activeTab, setActiveTab] = useState<ToolTab>('html');

  const [htmlInput, setHtmlInput] = useState<string>(ui.htmlSample);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfName, setPdfName] = useState<string>('');

  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState<string>('');
  const [jsonCopied, setJsonCopied] = useState(false);

  useEffect(() => {
    setHtmlInput(ui.htmlSample);
  }, [ui.htmlSample]);

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const htmlPreview = useMemo(() => htmlInput, [htmlInput]);

  const handlePdfChange = (file: File | null) => {
    if (!file) {
      return;
    }

    if (file.type !== 'application/pdf') {
      setPdfName('');
      setPdfUrl(null);
      return;
    }

    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }

    const url = URL.createObjectURL(file);
    setPdfUrl(url);
    setPdfName(file.name);
  };

  const applyJsonAction = (mode: 'pretty' | 'minify') => {
    const result = formatJsonText(jsonInput, mode, ui.jsonMessages);

    if (!result.ok) {
      setJsonError(result.error);
      setJsonCopied(false);
      return;
    }

    setJsonInput(result.value);
    setJsonError('');
    setJsonCopied(false);
  };

  const handleCopyJson = async () => {
    if (!jsonInput.trim()) {
      return;
    }

    try {
      await navigator.clipboard.writeText(jsonInput);
      setJsonCopied(true);
      setTimeout(() => setJsonCopied(false), 1800);
    } catch {
      setJsonCopied(false);
    }
  };

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={tabStyles(activeTab === 'html')}
          onClick={() => setActiveTab('html')}
        >
          {ui.tabHtml}
        </button>
        <button
          type="button"
          className={tabStyles(activeTab === 'pdf')}
          onClick={() => setActiveTab('pdf')}
        >
          {ui.tabPdf}
        </button>
        <button
          type="button"
          className={tabStyles(activeTab === 'json')}
          onClick={() => setActiveTab('json')}
        >
          {ui.tabJson}
        </button>
      </div>

      {activeTab === 'html' ? (
        <section className="space-y-4" aria-labelledby="html-viewer-title">
          <h3 id="html-viewer-title" className="text-lg font-semibold text-slate-900">
            {ui.htmlTitle}
          </h3>
          <p className="text-sm text-slate-600">{ui.htmlDescription}</p>

          <Textarea
            value={htmlInput}
            onChange={(event) => setHtmlInput(event.target.value)}
            className="min-h-[180px] font-mono text-xs"
            placeholder={ui.htmlPlaceholder}
          />

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setHtmlInput(ui.htmlSample)}>
              {ui.quickExample}
            </Button>
            <Button variant="ghost" onClick={() => setHtmlInput('')}>
              {ui.clear}
            </Button>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <iframe
              title={ui.htmlIframeTitle}
              sandbox=""
              srcDoc={htmlPreview}
              className="h-[280px] w-full"
            />
          </div>
        </section>
      ) : null}

      {activeTab === 'pdf' ? (
        <section className="space-y-4" aria-labelledby="pdf-viewer-title">
          <h3 id="pdf-viewer-title" className="text-lg font-semibold text-slate-900">
            {ui.pdfTitle}
          </h3>
          <p className="text-sm text-slate-600">{ui.pdfDescription}</p>

          <input
            type="file"
            accept="application/pdf"
            onChange={(event) => handlePdfChange(event.target.files?.[0] ?? null)}
            className="block w-full rounded-lg border border-slate-300 bg-white p-2 text-sm text-slate-700"
          />

          {pdfName ? (
            <p className="text-sm text-slate-700">
              {ui.fileLoaded} {pdfName}
            </p>
          ) : null}

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            {pdfUrl ? (
              <iframe title={ui.pdfIframeTitle} src={pdfUrl} className="h-[420px] w-full" />
            ) : (
              <div className="flex h-[220px] items-center justify-center px-6 text-center text-sm text-slate-500">
                {ui.pdfEmpty}
              </div>
            )}
          </div>
        </section>
      ) : null}

      {activeTab === 'json' ? (
        <section className="space-y-4" aria-labelledby="json-formatter-title">
          <h3 id="json-formatter-title" className="text-lg font-semibold text-slate-900">
            {ui.jsonTitle}
          </h3>
          <p className="text-sm text-slate-600">{ui.jsonDescription}</p>

          <Textarea
            value={jsonInput}
            onChange={(event) => {
              setJsonInput(event.target.value);
              setJsonError('');
              setJsonCopied(false);
            }}
            className="min-h-[220px] font-mono text-xs"
            placeholder={ui.jsonPlaceholder}
          />

          {jsonError ? <p className="text-sm font-medium text-red-700">{jsonError}</p> : null}

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => applyJsonAction('pretty')}>
              {ui.format}
            </Button>
            <Button variant="secondary" onClick={() => applyJsonAction('minify')}>
              {ui.minify}
            </Button>
            <Button variant="secondary" onClick={handleCopyJson}>
              {jsonCopied ? ui.copied : ui.copy}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setJsonInput('');
                setJsonError('');
                setJsonCopied(false);
              }}
            >
              {ui.clear}
            </Button>
          </div>
        </section>
      ) : null}
    </Card>
  );
}
