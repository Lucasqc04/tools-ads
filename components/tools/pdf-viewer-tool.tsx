'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileUploadDropzone } from '@/components/shared/file-upload-dropzone';
import { type AppLocale } from '@/lib/i18n/config';

type PdfViewerToolProps = Readonly<{
  locale?: AppLocale;
}>;

type PdfViewerUi = {
  title: string;
  intro: string;
  inputLabel: string;
  loadedFile: string;
  openNewTab: string;
  clear: string;
  invalidFile: string;
  emptyState: string;
};

const uiByLocale: Record<AppLocale, PdfViewerUi> = {
  'pt-br': {
    title: 'PDF Viewer Local',
    intro:
      'Abra arquivos PDF no navegador sem upload para servidor, com preview amplo e opção de nova aba.',
    inputLabel: 'Selecione um PDF',
    loadedFile: 'Arquivo carregado',
    openNewTab: 'Abrir em nova aba',
    clear: 'Limpar',
    invalidFile: 'Selecione um arquivo PDF válido.',
    emptyState: 'Escolha um PDF para iniciar a visualização.',
  },
  en: {
    title: 'Local PDF Viewer',
    intro:
      'Open PDF files directly in your browser without server upload, with large preview and new-tab option.',
    inputLabel: 'Select a PDF',
    loadedFile: 'Loaded file',
    openNewTab: 'Open in new tab',
    clear: 'Clear',
    invalidFile: 'Select a valid PDF file.',
    emptyState: 'Choose a PDF file to start preview.',
  },
  es: {
    title: 'Visor PDF Local',
    intro:
      'Abre archivos PDF en el navegador sin subirlos a servidor, con vista amplia y opción de nueva pestaña.',
    inputLabel: 'Selecciona un PDF',
    loadedFile: 'Archivo cargado',
    openNewTab: 'Abrir en nueva pestaña',
    clear: 'Limpiar',
    invalidFile: 'Selecciona un archivo PDF válido.',
    emptyState: 'Elige un PDF para iniciar la visualización.',
  },
};

export function PdfViewerTool({ locale = 'pt-br' }: PdfViewerToolProps) {
  const ui = uiByLocale[locale];

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfName, setPdfName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const handlePdfChange = (file: File | null) => {
    setErrorMessage('');

    if (!file) {
      return;
    }

    const looksLikePdf =
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    if (!looksLikePdf) {
      setErrorMessage(ui.invalidFile);
      setPdfFile(null);
      setPdfName('');
      setPdfUrl(null);
      return;
    }

    setPdfFile(file);
    setPdfName(file.name);

    setPdfUrl((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }

      return URL.createObjectURL(file);
    });
  };

  const handleOpenNewTab = () => {
    if (!pdfUrl) {
      return;
    }

    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  };

  const handleClear = () => {
    setPdfFile(null);
    setPdfName('');
    setErrorMessage('');
    setPdfUrl((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }

      return null;
    });
  };

  return (
    <Card className="space-y-5">
      <header className="rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 to-cyan-50 p-4">
        <h3 className="text-lg font-semibold text-slate-900">{ui.title}</h3>
        <p className="mt-1 text-sm text-slate-700">{ui.intro}</p>
      </header>

      <FileUploadDropzone
        locale={locale}
        label={ui.inputLabel}
        accept="application/pdf,.pdf"
        acceptedDescription="PDF"
        multiple={false}
        onFilesSelected={(files) => handlePdfChange(files[0] ?? null)}
        selectedFiles={pdfFile ? [pdfFile] : []}
        onRemoveFile={handleClear}
      />

      {pdfName ? (
        <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
          <strong>{ui.loadedFile}:</strong> {pdfName}
        </p>
      ) : null}

      {errorMessage ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={handleOpenNewTab} disabled={!pdfUrl}>
          {ui.openNewTab}
        </Button>
        <Button variant="ghost" onClick={handleClear}>
          {ui.clear}
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {pdfUrl ? (
          <iframe title="PDF preview" src={pdfUrl} className="h-[620px] w-full" />
        ) : (
          <div className="flex h-[260px] items-center justify-center px-6 text-center text-sm text-slate-500">
            {ui.emptyState}
          </div>
        )}
      </div>
    </Card>
  );
}

