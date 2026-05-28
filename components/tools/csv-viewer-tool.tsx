'use client';

import { useMemo, useState } from 'react';
import { FileUploadDropzone } from '@/components/shared/file-upload-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { AppLocale } from '@/lib/i18n/config';
import {
  convertCsvDelimiter,
  detectCsvDelimiter,
  parseCsvText,
  type CsvDelimiter,
} from '@/lib/csv-viewer';

type CsvViewerToolProps = {
  locale?: AppLocale;
};

type CsvViewerUi = {
  localNotice: string;
  pasteLabel: string;
  pastePlaceholder: string;
  uploadLabel: string;
  uploadHelp: string;
  autoSeparatorLabel: string;
  sourceSeparatorLabel: string;
  outputSeparatorLabel: string;
  rowsLabel: string;
  columnsLabel: string;
  previewLabel: string;
  noDataLabel: string;
  clear: string;
  copyConvertedCsv: string;
  copied: string;
  exportConvertedCsv: string;
  exportXlsx: string;
  firstRowHeader: string;
  parseError: string;
  fileReadError: string;
  chooseSeparatorAuto: string;
  filtersTitle: string;
  globalFilterLabel: string;
  globalFilterPlaceholder: string;
  columnFilterPlaceholder: string;
  clearFiltersAndSort: string;
  filteredRowsLabel: string;
  sortAsc: string;
  sortDesc: string;
};

const uiByLocale: Record<AppLocale, CsvViewerUi> = {
  'pt-br': {
    localNotice:
      'Processamento local no navegador. Cole CSV ou envie arquivo para visualizar, ajustar separador e exportar.',
    pasteLabel: 'Cole seu CSV',
    pastePlaceholder: 'nome;idade;cidade\nLucas;31;Sao Paulo\nAna;28;Porto',
    uploadLabel: 'Ou envie um arquivo CSV/TXT',
    uploadHelp: 'Aceita .csv e .txt. O arquivo e lido localmente.',
    autoSeparatorLabel: 'Separador detectado automaticamente',
    sourceSeparatorLabel: 'Separador de leitura',
    outputSeparatorLabel: 'Separador para CSV convertido',
    rowsLabel: 'Linhas',
    columnsLabel: 'Colunas',
    previewLabel: 'Preview da tabela',
    noDataLabel: 'Cole um CSV ou envie arquivo para visualizar a tabela.',
    clear: 'Limpar',
    copyConvertedCsv: 'Copiar CSV convertido',
    copied: 'Copiado',
    exportConvertedCsv: 'Baixar CSV convertido',
    exportXlsx: 'Exportar XLSX',
    firstRowHeader: 'Primeira linha como cabecalho',
    parseError: 'Nao foi possivel interpretar o CSV com esse separador.',
    fileReadError: 'Nao foi possivel ler o arquivo.',
    chooseSeparatorAuto: 'Auto',
    filtersTitle: 'Ordenacao e filtros da tabela',
    globalFilterLabel: 'Filtro geral',
    globalFilterPlaceholder: 'Filtrar em todas as colunas...',
    columnFilterPlaceholder: 'Filtrar coluna...',
    clearFiltersAndSort: 'Limpar filtros e ordenacao',
    filteredRowsLabel: 'Linhas visiveis',
    sortAsc: 'Crescente',
    sortDesc: 'Decrescente',
  },
  en: {
    localNotice:
      'Local browser processing. Paste CSV or upload a file to preview, adjust delimiters, and export.',
    pasteLabel: 'Paste your CSV',
    pastePlaceholder: 'name,age,city\nLucas,31,Sao Paulo\nAna,28,Porto',
    uploadLabel: 'Or upload a CSV/TXT file',
    uploadHelp: 'Accepts .csv and .txt files. Data stays in your browser.',
    autoSeparatorLabel: 'Auto-detected separator',
    sourceSeparatorLabel: 'Read separator',
    outputSeparatorLabel: 'Converted CSV separator',
    rowsLabel: 'Rows',
    columnsLabel: 'Columns',
    previewLabel: 'Table preview',
    noDataLabel: 'Paste CSV text or upload a file to preview the table.',
    clear: 'Clear',
    copyConvertedCsv: 'Copy converted CSV',
    copied: 'Copied',
    exportConvertedCsv: 'Download converted CSV',
    exportXlsx: 'Export XLSX',
    firstRowHeader: 'Use first row as header',
    parseError: 'Unable to parse CSV with this separator.',
    fileReadError: 'Unable to read file.',
    chooseSeparatorAuto: 'Auto',
    filtersTitle: 'Table sorting and filters',
    globalFilterLabel: 'Global filter',
    globalFilterPlaceholder: 'Filter across all columns...',
    columnFilterPlaceholder: 'Filter column...',
    clearFiltersAndSort: 'Clear filters and sorting',
    filteredRowsLabel: 'Visible rows',
    sortAsc: 'Ascending',
    sortDesc: 'Descending',
  },
  es: {
    localNotice:
      'Procesamiento local en navegador. Pega CSV o sube archivo para previsualizar, ajustar separador y exportar.',
    pasteLabel: 'Pega tu CSV',
    pastePlaceholder: 'nombre;edad;ciudad\nLucas;31;Sao Paulo\nAna;28;Porto',
    uploadLabel: 'O sube un archivo CSV/TXT',
    uploadHelp: 'Acepta .csv y .txt. El archivo se procesa localmente.',
    autoSeparatorLabel: 'Separador detectado automaticamente',
    sourceSeparatorLabel: 'Separador de lectura',
    outputSeparatorLabel: 'Separador para CSV convertido',
    rowsLabel: 'Filas',
    columnsLabel: 'Columnas',
    previewLabel: 'Vista previa de tabla',
    noDataLabel: 'Pega CSV o sube archivo para ver la tabla.',
    clear: 'Limpiar',
    copyConvertedCsv: 'Copiar CSV convertido',
    copied: 'Copiado',
    exportConvertedCsv: 'Descargar CSV convertido',
    exportXlsx: 'Exportar XLSX',
    firstRowHeader: 'Usar primera fila como cabecera',
    parseError: 'No se pudo interpretar el CSV con este separador.',
    fileReadError: 'No se pudo leer el archivo.',
    chooseSeparatorAuto: 'Auto',
    filtersTitle: 'Ordenacion y filtros de tabla',
    globalFilterLabel: 'Filtro global',
    globalFilterPlaceholder: 'Filtrar en todas las columnas...',
    columnFilterPlaceholder: 'Filtrar columna...',
    clearFiltersAndSort: 'Limpiar filtros y ordenacion',
    filteredRowsLabel: 'Filas visibles',
    sortAsc: 'Ascendente',
    sortDesc: 'Descendente',
  },
};

const delimiterLabels: Record<CsvDelimiter, string> = {
  ',': 'Virgula (,)',
  ';': 'Ponto e virgula (;)',
  '\t': 'Tab (\\t)',
  '|': 'Barra vertical (|)',
};

const saveTextFile = (filename: string, content: string): void => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

const separatorOptions: Array<{ value: 'auto' | CsvDelimiter; label: (ui: CsvViewerUi) => string }> = [
  {
    value: 'auto',
    label: (ui) => ui.chooseSeparatorAuto,
  },
  {
    value: ',',
    label: () => delimiterLabels[','],
  },
  {
    value: ';',
    label: () => delimiterLabels[';'],
  },
  {
    value: '\t',
    label: () => delimiterLabels['\t'],
  },
  {
    value: '|',
    label: () => delimiterLabels['|'],
  },
];

const normalizeComparableValue = (value: string): string => value.trim().toLowerCase();

const isNumericValue = (value: string): boolean => {
  const normalized = value.trim().replaceAll(',', '.');

  if (!normalized) {
    return false;
  }

  return !Number.isNaN(Number(normalized));
};

const compareCellValues = (a: string, b: string): number => {
  if (isNumericValue(a) && isNumericValue(b)) {
    return Number(a.replaceAll(',', '.')) - Number(b.replaceAll(',', '.'));
  }

  return normalizeComparableValue(a).localeCompare(normalizeComparableValue(b), undefined, {
    numeric: true,
    sensitivity: 'base',
  });
};

export function CsvViewerTool({ locale = 'pt-br' }: CsvViewerToolProps) {
  const ui = uiByLocale[locale];

  const [input, setInput] = useState('');
  const [selectedSeparator, setSelectedSeparator] = useState<'auto' | CsvDelimiter>('auto');
  const [outputSeparator, setOutputSeparator] = useState<CsvDelimiter>(',');
  const [useHeaderRow, setUseHeaderRow] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<Record<number, string>>({});
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const detected = useMemo(() => detectCsvDelimiter(input), [input]);

  const activeSeparator = selectedSeparator === 'auto' ? detected.delimiter : selectedSeparator;

  const parsed = useMemo(() => parseCsvText(input, activeSeparator), [input, activeSeparator]);

  const convertedCsv = useMemo(
    () => convertCsvDelimiter(input, activeSeparator, outputSeparator),
    [activeSeparator, input, outputSeparator],
  );

  const tableRows = useMemo(() => parsed.rows.slice(0, 1200), [parsed.rows]);

  const tableHead = useMemo(() => {
    if (!tableRows.length) {
      return [] as string[];
    }

    if (!useHeaderRow) {
      return Array.from({ length: parsed.columnCount }, (_, index) => `Column ${index + 1}`);
    }

    return tableRows[0].map((value, index) => value || `Column ${index + 1}`);
  }, [parsed.columnCount, tableRows, useHeaderRow]);

  const bodyRows = useMemo(() => {
    if (!tableRows.length) {
      return [] as string[][];
    }

    return useHeaderRow ? tableRows.slice(1) : tableRows;
  }, [tableRows, useHeaderRow]);

  const filteredAndSortedRows = useMemo(() => {
    const globalFilterValue = globalFilter.trim().toLowerCase();

    const filtered = bodyRows.filter((row) => {
      if (globalFilterValue) {
        const fullRow = row.join(' ').toLowerCase();
        if (!fullRow.includes(globalFilterValue)) {
          return false;
        }
      }

      const columnIndexes = Object.keys(columnFilters)
        .map((item) => Number(item))
        .filter((index) => Number.isInteger(index));

      for (const columnIndex of columnIndexes) {
        const filterValue = (columnFilters[columnIndex] ?? '').trim().toLowerCase();
        if (!filterValue) {
          continue;
        }

        const cellValue = (row[columnIndex] ?? '').toLowerCase();
        if (!cellValue.includes(filterValue)) {
          return false;
        }
      }

      return true;
    });

    if (sortColumn === null) {
      return filtered;
    }

    const sorted = [...filtered].sort((left, right) => {
      const leftValue = left[sortColumn] ?? '';
      const rightValue = right[sortColumn] ?? '';
      const result = compareCellValues(leftValue, rightValue);

      return sortDirection === 'asc' ? result : -result;
    });

    return sorted;
  }, [bodyRows, columnFilters, globalFilter, sortColumn, sortDirection]);

  const visibleRows = useMemo(() => filteredAndSortedRows.slice(0, 500), [filteredAndSortedRows]);

  const toggleSort = (columnIndex: number) => {
    if (sortColumn !== columnIndex) {
      setSortColumn(columnIndex);
      setSortDirection('asc');
      return;
    }

    setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
  };

  const handleCopyConvertedCsv = async () => {
    if (!convertedCsv) {
      return;
    }

    try {
      await navigator.clipboard.writeText(convertedCsv);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  const handleExportXlsx = async () => {
    if (!parsed.rows.length) {
      return;
    }

    try {
      const xlsxModule = await import('xlsx');
      const sheet = xlsxModule.utils.aoa_to_sheet(parsed.rows);
      const workbook = xlsxModule.utils.book_new();
      xlsxModule.utils.book_append_sheet(workbook, sheet, 'CSV');
      xlsxModule.writeFile(workbook, 'csv-viewer-export.xlsx');
      setError('');
    } catch {
      setError(ui.parseError);
    }
  };

  const handleFileSelection = async (files: File[]) => {
    const firstFile = files[0];

    if (!firstFile) {
      return;
    }

    try {
      const content = await firstFile.text();
      setInput(content);
      setError('');
      setCopied(false);
    } catch {
      setError(ui.fileReadError);
    }
  };

  return (
    <Card className="space-y-5">
      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        {ui.localNotice}
      </section>

      <label className="space-y-2">
        <span className="text-sm font-semibold text-slate-800">{ui.pasteLabel}</span>
        <Textarea
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setError('');
            setCopied(false);
          }}
          className="min-h-[220px] font-mono text-xs"
          placeholder={ui.pastePlaceholder}
        />
      </label>

      <FileUploadDropzone
        label={ui.uploadLabel}
        helperText={ui.uploadHelp}
        onFilesSelected={handleFileSelection}
        accept=".csv,.txt,text/csv,text/plain"
        multiple={false}
        compact
        locale={locale}
      />

      <div className="grid gap-3 md:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{ui.sourceSeparatorLabel}</span>
          <select
            value={selectedSeparator}
            onChange={(event) => setSelectedSeparator(event.target.value as 'auto' | CsvDelimiter)}
            className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800"
          >
            {separatorOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label(ui)}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{ui.outputSeparatorLabel}</span>
          <select
            value={outputSeparator}
            onChange={(event) => setOutputSeparator(event.target.value as CsvDelimiter)}
            className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800"
          >
            {separatorOptions
              .filter((option) => option.value !== 'auto')
              .map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label(ui)}
                </option>
              ))}
          </select>
        </label>

        <label className="flex items-end gap-2 rounded-md border border-slate-200 px-3 py-2">
          <input
            type="checkbox"
            checked={useHeaderRow}
            onChange={(event) => setUseHeaderRow(event.target.checked)}
            className="h-4 w-4"
          />
          <span className="text-sm text-slate-800">{ui.firstRowHeader}</span>
        </label>
      </div>

      <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        <p>
          <strong>{ui.autoSeparatorLabel}:</strong>{' '}
          {delimiterLabels[detected.delimiter]}
        </p>
        <p className="mt-1">
          <strong>{ui.rowsLabel}:</strong> {parsed.rows.length} | <strong>{ui.columnsLabel}:</strong>{' '}
          {parsed.columnCount}
        </p>
      </section>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          onClick={handleCopyConvertedCsv}
          disabled={!convertedCsv}
        >
          {copied ? ui.copied : ui.copyConvertedCsv}
        </Button>
        <Button
          variant="secondary"
          onClick={() => saveTextFile('csv-convertido.csv', convertedCsv)}
          disabled={!convertedCsv}
        >
          {ui.exportConvertedCsv}
        </Button>
        <Button
          variant="secondary"
          onClick={handleExportXlsx}
          disabled={!parsed.rows.length}
        >
          {ui.exportXlsx}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setInput('');
            setCopied(false);
            setError('');
            setGlobalFilter('');
            setColumnFilters({});
            setSortColumn(null);
            setSortDirection('asc');
          }}
        >
          {ui.clear}
        </Button>
      </div>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-semibold text-slate-800">{ui.filtersTitle}</h3>

        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.globalFilterLabel}</span>
            <Input
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              placeholder={ui.globalFilterPlaceholder}
            />
          </label>

          <Button
            variant="ghost"
            onClick={() => {
              setGlobalFilter('');
              setColumnFilters({});
              setSortColumn(null);
              setSortDirection('asc');
            }}
          >
            {ui.clearFiltersAndSort}
          </Button>
        </div>

        <p className="text-xs text-slate-600">
          {ui.filteredRowsLabel}: {filteredAndSortedRows.length}
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-800">{ui.previewLabel}</h3>

        {parsed.rows.length ? (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {tableHead.map((header, index) => (
                    <th key={`${header}-${index}`} className="border-b border-slate-200 px-3 py-2 font-semibold text-slate-800">
                      <button
                        type="button"
                        onClick={() => toggleSort(index)}
                        className="inline-flex items-center gap-1 text-left hover:text-brand-700"
                      >
                        <span>{header}</span>
                        {sortColumn === index ? (
                          <span className="text-[10px] uppercase text-brand-700">
                            {sortDirection === 'asc' ? ui.sortAsc : ui.sortDesc}
                          </span>
                        ) : null}
                      </button>
                    </th>
                  ))}
                </tr>
                <tr>
                  {tableHead.map((header, index) => (
                    <th key={`filter-${header}-${index}`} className="border-b border-slate-200 px-2 py-2">
                      <Input
                        value={columnFilters[index] ?? ''}
                        onChange={(event) =>
                          setColumnFilters((prev) => ({
                            ...prev,
                            [index]: event.target.value,
                          }))
                        }
                        placeholder={ui.columnFilterPlaceholder}
                        className="h-8 text-xs"
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row, rowIndex) => (
                  <tr key={`row-${rowIndex}`} className="odd:bg-white even:bg-slate-50/60">
                    {row.map((value, columnIndex) => (
                      <td
                        key={`cell-${rowIndex}-${columnIndex}`}
                        className="max-w-[320px] border-b border-slate-100 px-3 py-2 align-top text-slate-700"
                      >
                        <span className="break-words whitespace-pre-wrap">{value}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-600">
            {ui.noDataLabel}
          </p>
        )}
      </section>
    </Card>
  );
}
