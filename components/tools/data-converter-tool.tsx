'use client';

import { useMemo, useState } from 'react';
import {
  ClipboardPaste,
  Copy,
  Download,
  FileSpreadsheet,
  RefreshCw,
} from 'lucide-react';
import { FileUploadDropzone } from '@/components/shared/file-upload-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  buildDataConverterFilename,
  createParsedTableFromRows,
  formatFromFilename,
  getPreviewRows,
  parseDataText,
  serializeDataTable,
  type DataConverterFormat,
  type ParsedDataTable,
} from '@/lib/data-converter';
import type { AppLocale } from '@/lib/i18n/config';

type DataConverterToolProps = {
  locale?: AppLocale;
};

type OutputFormat = Exclude<DataConverterFormat, 'auto'>;
type TextOutputFormat = Exclude<OutputFormat, 'xlsx'>;

type DataConverterUi = {
  localNotice: string;
  pasteLabel: string;
  pastePlaceholder: string;
  pasteFromClipboard: string;
  uploadLabel: string;
  uploadHelp: string;
  sourceFormat: string;
  targetFormat: string;
  autoDetect: string;
  firstRowHeader: string;
  tableName: string;
  tableNamePlaceholder: string;
  convert: string;
  converting: string;
  clear: string;
  copyResult: string;
  copied: string;
  downloadResult: string;
  detectedFormat: string;
  rows: string;
  columns: string;
  selectedFile: string;
  preview: string;
  result: string;
  resultPlaceholder: string;
  noData: string;
  parseError: string;
  fileReadError: string;
  clipboardError: string;
  convertedText: string;
  convertedXlsx: string;
  xlsxSheetMissing: string;
  outputEmpty: string;
  formatLabels: Record<OutputFormat, string>;
};

const uiByLocale: Record<AppLocale, DataConverterUi> = {
  'pt-br': {
    localNotice:
      'Processamento local no navegador. Cole dados, envie arquivo ou importe TXT para detectar e converter entre formatos tabulares.',
    pasteLabel: 'Cole JSON, SQL, CSV, TSV ou TXT',
    pastePlaceholder:
      'id,nome,total\n1,Ana,120.50\n2,Lucas,89.90\n\nOu cole JSON, SQL INSERT, TSV...',
    pasteFromClipboard: 'Colar',
    uploadLabel: 'Ou envie um arquivo',
    uploadHelp:
      'Aceita .json, .sql, .csv, .tsv, .txt, .xlsx e .xls. XLSX usa a primeira aba.',
    sourceFormat: 'Formato de origem',
    targetFormat: 'Formato de destino',
    autoDetect: 'Detectar automaticamente',
    firstRowHeader: 'Primeira linha como cabecalho',
    tableName: 'Tabela SQL',
    tableNamePlaceholder: 'converted_data',
    convert: 'Converter',
    converting: 'Convertendo...',
    clear: 'Limpar',
    copyResult: 'Copiar resultado',
    copied: 'Copiado',
    downloadResult: 'Baixar resultado',
    detectedFormat: 'Formato detectado',
    rows: 'Linhas',
    columns: 'Colunas',
    selectedFile: 'Arquivo',
    preview: 'Preview da tabela',
    result: 'Resultado',
    resultPlaceholder: 'O resultado de texto aparece aqui depois da conversao.',
    noData: 'Cole dados ou envie arquivo para gerar o preview.',
    parseError:
      'Nao foi possivel interpretar a entrada com o formato selecionado.',
    fileReadError: 'Nao foi possivel ler o arquivo.',
    clipboardError: 'Nao foi possivel acessar o clipboard.',
    convertedText: 'Conversao pronta. Copie ou baixe o resultado.',
    convertedXlsx: 'XLSX gerado e baixado.',
    xlsxSheetMissing: 'O arquivo XLSX nao possui uma aba legivel.',
    outputEmpty: 'Nao ha linhas suficientes para gerar esse formato.',
    formatLabels: {
      json: 'JSON',
      sql: 'SQL INSERT',
      csv: 'CSV',
      tsv: 'TSV',
      xlsx: 'XLSX',
    },
  },
  en: {
    localNotice:
      'Local browser processing. Paste data, upload a file, or import TXT to detect and convert tabular formats.',
    pasteLabel: 'Paste JSON, SQL, CSV, TSV, or TXT',
    pastePlaceholder:
      'id,name,total\n1,Ana,120.50\n2,Lucas,89.90\n\nOr paste JSON, SQL INSERT, TSV...',
    pasteFromClipboard: 'Paste',
    uploadLabel: 'Or upload a file',
    uploadHelp:
      'Accepts .json, .sql, .csv, .tsv, .txt, .xlsx, and .xls. XLSX reads the first sheet.',
    sourceFormat: 'Source format',
    targetFormat: 'Target format',
    autoDetect: 'Auto-detect',
    firstRowHeader: 'Use first row as header',
    tableName: 'SQL table',
    tableNamePlaceholder: 'converted_data',
    convert: 'Convert',
    converting: 'Converting...',
    clear: 'Clear',
    copyResult: 'Copy result',
    copied: 'Copied',
    downloadResult: 'Download result',
    detectedFormat: 'Detected format',
    rows: 'Rows',
    columns: 'Columns',
    selectedFile: 'File',
    preview: 'Table preview',
    result: 'Result',
    resultPlaceholder: 'Text output appears here after conversion.',
    noData: 'Paste data or upload a file to generate the preview.',
    parseError: 'Unable to parse the input with the selected format.',
    fileReadError: 'Unable to read the file.',
    clipboardError: 'Unable to access the clipboard.',
    convertedText: 'Conversion ready. Copy or download the result.',
    convertedXlsx: 'XLSX generated and downloaded.',
    xlsxSheetMissing: 'The XLSX file does not contain a readable sheet.',
    outputEmpty: 'There are not enough rows to generate this format.',
    formatLabels: {
      json: 'JSON',
      sql: 'SQL INSERT',
      csv: 'CSV',
      tsv: 'TSV',
      xlsx: 'XLSX',
    },
  },
  es: {
    localNotice:
      'Procesamiento local en navegador. Pega datos, sube archivo o importa TXT para detectar y convertir formatos tabulares.',
    pasteLabel: 'Pega JSON, SQL, CSV, TSV o TXT',
    pastePlaceholder:
      'id,nombre,total\n1,Ana,120.50\n2,Lucas,89.90\n\nO pega JSON, SQL INSERT, TSV...',
    pasteFromClipboard: 'Pegar',
    uploadLabel: 'O sube un archivo',
    uploadHelp:
      'Acepta .json, .sql, .csv, .tsv, .txt, .xlsx y .xls. XLSX usa la primera hoja.',
    sourceFormat: 'Formato de origen',
    targetFormat: 'Formato de destino',
    autoDetect: 'Detectar automaticamente',
    firstRowHeader: 'Usar primera fila como cabecera',
    tableName: 'Tabla SQL',
    tableNamePlaceholder: 'converted_data',
    convert: 'Convertir',
    converting: 'Convirtiendo...',
    clear: 'Limpiar',
    copyResult: 'Copiar resultado',
    copied: 'Copiado',
    downloadResult: 'Descargar resultado',
    detectedFormat: 'Formato detectado',
    rows: 'Filas',
    columns: 'Columnas',
    selectedFile: 'Archivo',
    preview: 'Vista previa de tabla',
    result: 'Resultado',
    resultPlaceholder: 'La salida de texto aparece aqui despues de convertir.',
    noData: 'Pega datos o sube un archivo para generar la vista previa.',
    parseError: 'No se pudo interpretar la entrada con el formato seleccionado.',
    fileReadError: 'No se pudo leer el archivo.',
    clipboardError: 'No se pudo acceder al clipboard.',
    convertedText: 'Conversion lista. Copia o descarga el resultado.',
    convertedXlsx: 'XLSX generado y descargado.',
    xlsxSheetMissing: 'El archivo XLSX no tiene una hoja legible.',
    outputEmpty: 'No hay filas suficientes para generar este formato.',
    formatLabels: {
      json: 'JSON',
      sql: 'SQL INSERT',
      csv: 'CSV',
      tsv: 'TSV',
      xlsx: 'XLSX',
    },
  },
};

const sourceFormats: DataConverterFormat[] = ['auto', 'json', 'sql', 'csv', 'tsv', 'xlsx'];
const outputFormats: OutputFormat[] = ['json', 'sql', 'csv', 'tsv', 'xlsx'];

const acceptedFiles = [
  '.json',
  'application/json',
  '.sql',
  '.csv',
  'text/csv',
  '.tsv',
  '.txt',
  'text/plain',
  '.xlsx',
  '.xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
].join(',');

const isTextOutputFormat = (format: OutputFormat): format is TextOutputFormat =>
  format !== 'xlsx';

const getTextMimeType = (format: TextOutputFormat): string => {
  if (format === 'json') return 'application/json;charset=utf-8';
  if (format === 'csv') return 'text/csv;charset=utf-8';
  if (format === 'tsv') return 'text/tab-separated-values;charset=utf-8';
  return 'text/plain;charset=utf-8';
};

const downloadTextFile = (filename: string, content: string, format: TextOutputFormat): void => {
  const blob = new Blob([content], { type: getTextMimeType(format) });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

const tableToXlsxRows = (table: ParsedDataTable): Array<Array<string | number | boolean | null>> =>
  table.rows.map((row) => row.map((cell) => cell ?? ''));

export function DataConverterTool({ locale = 'pt-br' }: DataConverterToolProps) {
  const ui = uiByLocale[locale];
  const [input, setInput] = useState('');
  const [sourceFormat, setSourceFormat] = useState<DataConverterFormat>('auto');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('json');
  const [useHeaderRow, setUseHeaderRow] = useState(true);
  const [tableName, setTableName] = useState('converted_data');
  const [uploadedTable, setUploadedTable] = useState<ParsedDataTable | null>(null);
  const [sourceFileName, setSourceFileName] = useState('');
  const [result, setResult] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const parsedState = useMemo(() => {
    if (uploadedTable) {
      return { table: uploadedTable, error: '' };
    }

    if (!input.trim()) {
      return { table: null, error: '' };
    }

    try {
      return {
        table: parseDataText(input, {
          format: sourceFormat,
          filename: sourceFileName,
        }),
        error: '',
      };
    } catch {
      return { table: null, error: ui.parseError };
    }
  }, [input, sourceFileName, sourceFormat, ui.parseError, uploadedTable]);

  const table = parsedState.table;
  const previewRows = useMemo(() => getPreviewRows(table?.rows ?? [], 80), [table]);
  const visibleRowCount = Math.max(0, (table?.rows.length ?? 0) - (useHeaderRow ? 1 : 0));
  const canConvert = Boolean(table?.rows.length) && !parsedState.error && !isBusy;

  const resetFeedback = () => {
    setMessage('');
    setError('');
    setCopied(false);
  };

  const clearAll = () => {
    setInput('');
    setUploadedTable(null);
    setSourceFileName('');
    setResult('');
    setSourceFormat('auto');
    resetFeedback();
  };

  const downloadXlsx = async (activeTable: ParsedDataTable, filename: string) => {
    const xlsxModule = await import('xlsx');
    const sheet = xlsxModule.utils.aoa_to_sheet(tableToXlsxRows(activeTable));
    const workbook = xlsxModule.utils.book_new();
    xlsxModule.utils.book_append_sheet(workbook, sheet, 'Data');
    xlsxModule.writeFile(workbook, filename);
  };

  const handleConvert = async () => {
    resetFeedback();

    if (!table?.rows.length) {
      setError(ui.noData);
      return;
    }

    setIsBusy(true);

    try {
      if (outputFormat === 'xlsx') {
        await downloadXlsx(table, buildDataConverterFilename(sourceFileName, 'xlsx'));
        setResult('');
        setMessage(ui.convertedXlsx);
        return;
      }

      const output = serializeDataTable(table.rows, outputFormat, {
        useHeaderRow,
        tableName,
      });

      if (!output) {
        setError(ui.outputEmpty);
        return;
      }

      setResult(output);
      setMessage(ui.convertedText);
    } catch {
      setError(ui.parseError);
    } finally {
      setIsBusy(false);
    }
  };

  const handleCopyResult = async () => {
    if (!result) {
      return;
    }

    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  const handlePasteClipboard = async () => {
    resetFeedback();

    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      setUploadedTable(null);
      setSourceFileName('');
      setSourceFormat('auto');
      setResult('');
    } catch {
      setError(ui.clipboardError);
    }
  };

  const handleFileSelection = async (files: File[]) => {
    const file = files[0];
    if (!file) {
      return;
    }

    resetFeedback();
    setIsBusy(true);
    setResult('');
    setSourceFileName(file.name);

    try {
      const detectedFormat = formatFromFilename(file.name);

      if (detectedFormat === 'xlsx') {
        const xlsxModule = await import('xlsx');
        const buffer = await file.arrayBuffer();
        const workbook = xlsxModule.read(buffer, { type: 'array', cellDates: true });
        const sheetName = workbook.SheetNames[0];

        if (!sheetName) {
          setError(ui.xlsxSheetMissing);
          return;
        }

        const sheet = workbook.Sheets[sheetName];
        const rows = xlsxModule.utils.sheet_to_json(sheet, {
          header: 1,
          defval: null,
          blankrows: false,
          raw: true,
        }) as unknown[][];

        setUploadedTable(createParsedTableFromRows(rows, 'xlsx'));
        setInput('');
        setSourceFormat('xlsx');
        setMessage(`${ui.selectedFile}: ${file.name}`);
        return;
      }

      const text = await file.text();
      setInput(text);
      setUploadedTable(null);
      setSourceFormat(detectedFormat ?? 'auto');
      setMessage(`${ui.selectedFile}: ${file.name}`);
    } catch {
      setError(ui.fileReadError);
    } finally {
      setIsBusy(false);
    }
  };

  const activeError = error || parsedState.error;

  return (
    <Card className="space-y-5">
      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        {ui.localNotice}
      </section>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_160px_160px]">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{ui.tableName}</span>
          <Input
            value={tableName}
            onChange={(event) => setTableName(event.target.value)}
            placeholder={ui.tableNamePlaceholder}
            autoComplete="off"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{ui.sourceFormat}</span>
          <Select
            value={sourceFormat}
            onChange={(event) => {
              setSourceFormat(event.target.value as DataConverterFormat);
              setResult('');
              resetFeedback();
            }}
          >
            {sourceFormats.map((format) => (
              <option key={format} value={format}>
                {format === 'auto' ? ui.autoDetect : ui.formatLabels[format]}
              </option>
            ))}
          </Select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{ui.targetFormat}</span>
          <Select
            value={outputFormat}
            onChange={(event) => {
              setOutputFormat(event.target.value as OutputFormat);
              setResult('');
              resetFeedback();
            }}
          >
            {outputFormats.map((format) => (
              <option key={format} value={format}>
                {ui.formatLabels[format]}
              </option>
            ))}
          </Select>
        </label>
      </div>

      <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
        <input
          type="checkbox"
          checked={useHeaderRow}
          onChange={(event) => {
            setUseHeaderRow(event.target.checked);
            setResult('');
            resetFeedback();
          }}
          className="h-4 w-4"
        />
        <span className="text-sm text-slate-800">{ui.firstRowHeader}</span>
      </label>

      <label className="space-y-2">
        <span className="text-sm font-semibold text-slate-800">{ui.pasteLabel}</span>
        <Textarea
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setUploadedTable(null);
            setSourceFileName('');
            setResult('');
            resetFeedback();
          }}
          className="min-h-[220px] font-mono text-xs"
          placeholder={ui.pastePlaceholder}
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={handlePasteClipboard} className="gap-2">
          <ClipboardPaste className="h-4 w-4" />
          {ui.pasteFromClipboard}
        </Button>
      </div>

      <FileUploadDropzone
        label={ui.uploadLabel}
        helperText={ui.uploadHelp}
        onFilesSelected={handleFileSelection}
        accept={acceptedFiles}
        multiple={false}
        compact
        locale={locale}
      />

      <section className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 md:grid-cols-4">
        <p>
          <strong className="text-slate-900">{ui.detectedFormat}:</strong>{' '}
          {table ? ui.formatLabels[table.detectedFormat] : '-'}
        </p>
        <p>
          <strong className="text-slate-900">{ui.rows}:</strong> {visibleRowCount}
        </p>
        <p>
          <strong className="text-slate-900">{ui.columns}:</strong>{' '}
          {table?.columnCount ?? 0}
        </p>
        <p className="min-w-0 truncate">
          <strong className="text-slate-900">{ui.selectedFile}:</strong>{' '}
          {sourceFileName || '-'}
        </p>
      </section>

      {activeError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {activeError}
        </p>
      ) : null}

      {message ? (
        <p className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-800">
          {message}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button onClick={handleConvert} disabled={!canConvert} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          {isBusy ? ui.converting : ui.convert}
        </Button>
        <Button
          variant="secondary"
          onClick={handleCopyResult}
          disabled={!result}
          className="gap-2"
        >
          <Copy className="h-4 w-4" />
          {copied ? ui.copied : ui.copyResult}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            if (!result || !isTextOutputFormat(outputFormat)) {
              return;
            }

            downloadTextFile(
              buildDataConverterFilename(sourceFileName, outputFormat),
              result,
              outputFormat,
            );
          }}
          disabled={!result || !isTextOutputFormat(outputFormat)}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          {ui.downloadResult}
        </Button>
        <Button variant="ghost" onClick={clearAll} className="gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          {ui.clear}
        </Button>
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-800">{ui.result}</h3>
        <Textarea
          value={result}
          readOnly
          className="min-h-[180px] font-mono text-xs"
          placeholder={ui.resultPlaceholder}
        />
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-800">{ui.preview}</h3>

        {previewRows.length ? (
          <div className="max-h-[420px] overflow-auto rounded-xl border border-slate-200">
            <table className="min-w-full border-collapse text-left text-sm">
              <tbody>
                {previewRows.map((row, rowIndex) => (
                  <tr
                    key={`preview-row-${rowIndex}`}
                    className={
                      useHeaderRow && rowIndex === 0
                        ? 'bg-slate-100'
                        : rowIndex % 2 === 0
                          ? 'bg-white'
                          : 'bg-slate-50/70'
                    }
                  >
                    {row.map((cell, columnIndex) => (
                      <td
                        key={`preview-cell-${rowIndex}-${columnIndex}`}
                        className="max-w-[280px] border-b border-slate-100 px-3 py-2 align-top text-slate-700"
                      >
                        <span
                          className={
                            useHeaderRow && rowIndex === 0
                              ? 'break-words font-semibold text-slate-900'
                              : 'break-words whitespace-pre-wrap'
                          }
                        >
                          {cell}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-600">
            {ui.noData}
          </p>
        )}
      </section>
    </Card>
  );
}
