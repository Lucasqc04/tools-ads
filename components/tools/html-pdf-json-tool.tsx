'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { formatJsonText } from '@/lib/json-formatter';
import { cn } from '@/lib/cn';

type ToolTab = 'html' | 'pdf' | 'json';

const HTML_SAMPLE = `<main style="font-family: Arial, sans-serif; padding: 16px;">
  <h1>Preview de HTML</h1>
  <p>Este bloco é renderizado no iframe com sandbox.</p>
</main>`;

const tabStyles = (active: boolean) =>
  cn(
    'rounded-lg px-4 py-2 text-sm font-semibold transition',
    active ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300',
  );

export function HtmlPdfJsonTool() {
  const [activeTab, setActiveTab] = useState<ToolTab>('html');

  const [htmlInput, setHtmlInput] = useState(HTML_SAMPLE);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfName, setPdfName] = useState<string>('');

  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState<string>('');
  const [jsonCopied, setJsonCopied] = useState(false);

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
    const result = formatJsonText(jsonInput, mode);

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
        <button type="button" className={tabStyles(activeTab === 'html')} onClick={() => setActiveTab('html')}>
          HTML Viewer
        </button>
        <button type="button" className={tabStyles(activeTab === 'pdf')} onClick={() => setActiveTab('pdf')}>
          PDF Viewer
        </button>
        <button type="button" className={tabStyles(activeTab === 'json')} onClick={() => setActiveTab('json')}>
          JSON Formatter
        </button>
      </div>

      {activeTab === 'html' ? (
        <section className="space-y-4" aria-labelledby="html-viewer-title">
          <h3 id="html-viewer-title" className="text-lg font-semibold text-slate-900">
            Visualizador de HTML
          </h3>
          <p className="text-sm text-slate-600">
            Cole seu HTML e veja o preview em sandbox. Scripts não são permitidos neste preview.
          </p>

          <Textarea
            value={htmlInput}
            onChange={(event) => setHtmlInput(event.target.value)}
            className="min-h-[180px] font-mono text-xs"
            placeholder="Cole aqui seu HTML"
          />

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setHtmlInput(HTML_SAMPLE)}>
              Exemplo rápido
            </Button>
            <Button variant="ghost" onClick={() => setHtmlInput('')}>
              Limpar
            </Button>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <iframe
              title="Preview do HTML"
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
            Visualizador de PDF
          </h3>
          <p className="text-sm text-slate-600">
            Selecione um PDF local. O arquivo não é enviado para servidor e permanece no seu navegador.
          </p>

          <input
            type="file"
            accept="application/pdf"
            onChange={(event) => handlePdfChange(event.target.files?.[0] ?? null)}
            className="block w-full rounded-lg border border-slate-300 bg-white p-2 text-sm text-slate-700"
          />

          {pdfName ? <p className="text-sm text-slate-700">Arquivo carregado: {pdfName}</p> : null}

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            {pdfUrl ? (
              <iframe title="Preview do PDF" src={pdfUrl} className="h-[420px] w-full" />
            ) : (
              <div className="flex h-[220px] items-center justify-center px-6 text-center text-sm text-slate-500">
                Selecione um arquivo PDF para iniciar a visualização local.
              </div>
            )}
          </div>
        </section>
      ) : null}

      {activeTab === 'json' ? (
        <section className="space-y-4" aria-labelledby="json-formatter-title">
          <h3 id="json-formatter-title" className="text-lg font-semibold text-slate-900">
            Formatador e Minificador de JSON
          </h3>
          <p className="text-sm text-slate-600">
            Cole um JSON válido para organizar com indentação ou gerar uma versão minificada.
          </p>

          <Textarea
            value={jsonInput}
            onChange={(event) => {
              setJsonInput(event.target.value);
              setJsonError('');
              setJsonCopied(false);
            }}
            className="min-h-[220px] font-mono text-xs"
            placeholder='{"exemplo": true}'
          />

          {jsonError ? <p className="text-sm font-medium text-red-700">{jsonError}</p> : null}

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => applyJsonAction('pretty')}>
              Formatar
            </Button>
            <Button variant="secondary" onClick={() => applyJsonAction('minify')}>
              Minificar
            </Button>
            <Button variant="secondary" onClick={handleCopyJson}>
              {jsonCopied ? 'Copiado' : 'Copiar'}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setJsonInput('');
                setJsonError('');
                setJsonCopied(false);
              }}
            >
              Limpar
            </Button>
          </div>
        </section>
      ) : null}
    </Card>
  );
}
