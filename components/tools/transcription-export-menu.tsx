'use client';

import { useState } from 'react';
import { Check, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type AppLocale } from '@/lib/i18n/config';
import { downloadBlob } from '@/lib/image-conversion';
import {
  buildExportFileName,
  buildTranscriptionJson,
  segmentsToPlainText,
  segmentsToSrt,
  segmentsToTimestampedText,
  segmentsToVtt,
  type TranscriptExportFormat,
} from '@/lib/transcription/exporters';
import type { TranscriptResult } from '@/lib/transcription/transcription-types';

type TranscriptionExportMenuProps = Readonly<{
  result: TranscriptResult;
  locale: AppLocale;
  onCopy?: (kind: 'text' | 'timestamped') => void;
  onDownload?: (format: TranscriptExportFormat) => void;
}>;

type ExportUi = {
  copyText: string;
  copyTimestamped: string;
  copied: string;
  downloadTxt: string;
  downloadTxtTimestamped: string;
  downloadSrt: string;
  downloadVtt: string;
  downloadJson: string;
};

const uiByLocale: Record<AppLocale, ExportUi> = {
  'pt-br': {
    copyText: 'Copiar texto',
    copyTimestamped: 'Copiar com timestamps',
    copied: 'Copiado!',
    downloadTxt: 'Baixar TXT',
    downloadTxtTimestamped: 'Baixar TXT com timestamps',
    downloadSrt: 'Baixar SRT',
    downloadVtt: 'Baixar VTT',
    downloadJson: 'Baixar JSON',
  },
  en: {
    copyText: 'Copy text',
    copyTimestamped: 'Copy with timestamps',
    copied: 'Copied!',
    downloadTxt: 'Download TXT',
    downloadTxtTimestamped: 'Download TXT with timestamps',
    downloadSrt: 'Download SRT',
    downloadVtt: 'Download VTT',
    downloadJson: 'Download JSON',
  },
  es: {
    copyText: 'Copiar texto',
    copyTimestamped: 'Copiar con timestamps',
    copied: 'Copiado!',
    downloadTxt: 'Descargar TXT',
    downloadTxtTimestamped: 'Descargar TXT con timestamps',
    downloadSrt: 'Descargar SRT',
    downloadVtt: 'Descargar VTT',
    downloadJson: 'Descargar JSON',
  },
  zh: {
    copyText: 'Copy text',
    copyTimestamped: 'Copy with timestamps',
    copied: 'Copied!',
    downloadTxt: 'Download TXT',
    downloadTxtTimestamped: 'Download TXT with timestamps',
    downloadSrt: 'Download SRT',
    downloadVtt: 'Download VTT',
    downloadJson: 'Download JSON',
  },
};

export function TranscriptionExportMenu({ result, locale, onCopy, onDownload }: TranscriptionExportMenuProps) {
  const ui = uiByLocale[locale];
  const [copiedKind, setCopiedKind] = useState<'text' | 'timestamped' | null>(null);

  const handleCopy = async (kind: 'text' | 'timestamped') => {
    const content =
      kind === 'text' ? segmentsToPlainText(result.segments) : segmentsToTimestampedText(result.segments);

    try {
      await navigator.clipboard.writeText(content);
      setCopiedKind(kind);
      onCopy?.(kind);
      globalThis.setTimeout(() => setCopiedKind((current) => (current === kind ? null : current)), 2000);
    } catch {
      // Clipboard permission denied or unavailable: silently ignore, no crash.
    }
  };

  const handleDownload = (format: TranscriptExportFormat) => {
    const content =
      format === 'txt'
        ? segmentsToPlainText(result.segments)
        : format === 'txt-timestamped'
          ? segmentsToTimestampedText(result.segments)
          : format === 'srt'
            ? segmentsToSrt(result.segments)
            : format === 'vtt'
              ? segmentsToVtt(result.segments)
              : buildTranscriptionJson(result);

    const mimeType = format === 'json' ? 'application/json' : 'text/plain';
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
    downloadBlob(blob, buildExportFileName(result.fileName, format));
    onDownload?.(format);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="secondary" onClick={() => void handleCopy('text')}>
        {copiedKind === 'text' ? (
          <Check className="mr-1.5 h-4 w-4 text-emerald-600" />
        ) : (
          <Copy className="mr-1.5 h-4 w-4" />
        )}
        {copiedKind === 'text' ? ui.copied : ui.copyText}
      </Button>
      <Button variant="secondary" onClick={() => void handleCopy('timestamped')}>
        {copiedKind === 'timestamped' ? (
          <Check className="mr-1.5 h-4 w-4 text-emerald-600" />
        ) : (
          <Copy className="mr-1.5 h-4 w-4" />
        )}
        {copiedKind === 'timestamped' ? ui.copied : ui.copyTimestamped}
      </Button>
      <Button variant="ghost" onClick={() => handleDownload('txt')}>
        <Download className="mr-1.5 h-4 w-4" />
        {ui.downloadTxt}
      </Button>
      <Button variant="ghost" onClick={() => handleDownload('txt-timestamped')}>
        <Download className="mr-1.5 h-4 w-4" />
        {ui.downloadTxtTimestamped}
      </Button>
      <Button variant="ghost" onClick={() => handleDownload('srt')}>
        <Download className="mr-1.5 h-4 w-4" />
        {ui.downloadSrt}
      </Button>
      <Button variant="ghost" onClick={() => handleDownload('vtt')}>
        <Download className="mr-1.5 h-4 w-4" />
        {ui.downloadVtt}
      </Button>
      <Button variant="ghost" onClick={() => handleDownload('json')}>
        <Download className="mr-1.5 h-4 w-4" />
        {ui.downloadJson}
      </Button>
    </div>
  );
}
