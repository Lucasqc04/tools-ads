'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { FileUploadDropzone } from '@/components/shared/file-upload-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { calculateFileChecksums, type ChecksumAlgorithm, type FileChecksumResult } from '@/lib/file-checksum';
import { formatBytes } from '@/lib/file-size';
import { downloadBlob } from '@/lib/image-conversion';
import { generateFaviconPackage, loadImageBitmapFromFile, type FaviconAsset, type FaviconPackage } from '@/lib/favicon-generator';
import type { AppLocale } from '@/lib/i18n/config';

type Notice = { tone: 'info' | 'success' | 'error'; text: string } | null;

const noticeClass = {
  info: 'border-slate-200 bg-slate-50 text-slate-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  error: 'border-red-200 bg-red-50 text-red-700',
};

const copyText = async (value: string, setNotice: (notice: Notice) => void, copiedText: string, errorText: string) => {
  try {
    await navigator.clipboard.writeText(value);
    setNotice({ tone: 'success', text: copiedText });
  } catch {
    setNotice({ tone: 'error', text: errorText });
  }
};

const downloadText = (content: string, fileName: string, type = 'text/plain') => {
  downloadBlob(new Blob([content], { type }), fileName);
};

const makeZip = async (
  entries: Array<{ name: string; blob: Blob }>,
  fileName: string,
  password?: string,
) => {
  const zip = await import('@zip.js/zip.js');
  const writer = new zip.ZipWriter(new zip.BlobWriter('application/zip'), {
    bufferedWrite: true,
    password: password || undefined,
    encryptionStrength: password ? 3 : undefined,
  });

  for (const entry of entries) {
    await writer.add(entry.name, new zip.BlobReader(entry.blob));
  }

  const blob = await writer.close();
  downloadBlob(blob, fileName);
};

function ToolHeader({ title, intro }: Readonly<{ title: string; intro: string }>) {
  return (
    <header className="rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 to-indigo-50 p-4">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-700">{intro}</p>
    </header>
  );
}

function NoticeBox({ notice }: Readonly<{ notice: Notice }>) {
  if (!notice) return null;
  return <p className={`rounded-lg border px-3 py-2 text-sm ${noticeClass[notice.tone]}`}>{notice.text}</p>;
}

const hashUi = {
  'pt-br': {
    title: 'Hash de arquivo e checksum',
    intro: 'Calcule MD5, SHA e CRC32 de arquivos locais e compare com checksums esperados.',
    file: 'Arquivo',
    expected: 'Checksum esperado',
    expectedPlaceholder: 'Cole um hash para comparar automaticamente',
    calculate: 'Calcular hashes',
    calculating: 'Calculando...',
    algorithms: 'Algoritmos',
    algorithm: 'Algoritmo',
    hash: 'Hash',
    compare: 'Comparacao',
    copyAll: 'Copiar todos',
    copyHash: 'Copiar hash',
    exportJson: 'Exportar JSON',
    exportCsv: 'Exportar CSV',
    copied: 'Copiado.',
    copyError: 'Nao foi possivel copiar.',
    match: 'Confere',
    noMatch: 'Nao confere',
    empty: 'Selecione um arquivo para calcular checksums.',
  },
  en: {
    title: 'File hash and checksum',
    intro: 'Calculate MD5, SHA, and CRC32 for local files and compare against expected checksums.',
    file: 'File',
    expected: 'Expected checksum',
    expectedPlaceholder: 'Paste a hash to compare automatically',
    calculate: 'Calculate hashes',
    calculating: 'Calculating...',
    algorithms: 'Algorithms',
    algorithm: 'Algorithm',
    hash: 'Hash',
    compare: 'Compare',
    copyAll: 'Copy all',
    copyHash: 'Copy hash',
    exportJson: 'Export JSON',
    exportCsv: 'Export CSV',
    copied: 'Copied.',
    copyError: 'Could not copy.',
    match: 'Match',
    noMatch: 'No match',
    empty: 'Select a file to calculate checksums.',
  },
  es: {
    title: 'Hash de archivo y checksum',
    intro: 'Calcula MD5, SHA y CRC32 de archivos locales y compara con checksums esperados.',
    file: 'Archivo',
    expected: 'Checksum esperado',
    expectedPlaceholder: 'Pega un hash para comparar automaticamente',
    calculate: 'Calcular hashes',
    calculating: 'Calculando...',
    algorithms: 'Algoritmos',
    algorithm: 'Algoritmo',
    hash: 'Hash',
    compare: 'Comparacion',
    copyAll: 'Copiar todos',
    copyHash: 'Copiar hash',
    exportJson: 'Exportar JSON',
    exportCsv: 'Exportar CSV',
    copied: 'Copiado.',
    copyError: 'No fue posible copiar.',
    match: 'Coincide',
    noMatch: 'No coincide',
    empty: 'Selecciona un archivo para calcular checksums.',
  },
} satisfies Record<AppLocale, Record<string, string>>;

const algorithms: ChecksumAlgorithm[] = ['md5', 'sha1', 'sha256', 'sha384', 'sha512', 'crc32'];

export function FileHashChecksumTool({ locale = 'pt-br' }: Readonly<{ locale?: AppLocale }>) {
  const ui = hashUi[locale];
  const [files, setFiles] = useState<File[]>([]);
  const [expected, setExpected] = useState('');
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<ChecksumAlgorithm[]>(['md5', 'sha256', 'sha512', 'crc32']);
  const [results, setResults] = useState<FileChecksumResult[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [copiedAlgorithm, setCopiedAlgorithm] = useState<ChecksumAlgorithm | null>(null);
  const file = files[0];

  const expectedClean = expected.trim().toLowerCase();
  const resultText = results.map((item) => `${item.algorithm.toUpperCase()}: ${item.value}`).join('\n');
  const json = JSON.stringify({ file: file?.name, size: file?.size, results }, null, 2);
  const csv = ['algorithm,value', ...results.map((item) => `${item.algorithm},${item.value}`)].join('\n');

  const calculate = async () => {
    if (!file) return;
    setIsBusy(true);
    setNotice(null);
    setCopiedAlgorithm(null);
    try {
      setResults(await calculateFileChecksums(file, selectedAlgorithms));
    } catch (error) {
      setNotice({ tone: 'error', text: error instanceof Error ? error.message : 'Erro ao calcular.' });
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <Card className="space-y-5">
      <ToolHeader title={ui.title} intro={ui.intro} />
      <FileUploadDropzone locale={locale} label={ui.file} multiple={false} selectedFiles={files} onFilesSelected={(next) => setFiles(next.slice(0, 1))} onRemoveFile={() => setFiles([])} />
      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{ui.expected}</span>
          <Input value={expected} onChange={(event) => setExpected(event.target.value)} placeholder={ui.expectedPlaceholder} className="font-mono" />
        </label>
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold text-slate-800">{ui.algorithms}</legend>
          <div className="flex flex-wrap gap-2">
            {algorithms.map((algorithm) => (
              <label key={algorithm} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={selectedAlgorithms.includes(algorithm)}
                  onChange={(event) =>
                    setSelectedAlgorithms((current) =>
                      event.target.checked
                        ? [...current, algorithm]
                        : current.filter((item) => item !== algorithm),
                    )
                  }
                />
                {algorithm.toUpperCase()}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" disabled={!file || isBusy || !selectedAlgorithms.length} onClick={() => void calculate()}>
          {isBusy ? ui.calculating : ui.calculate}
        </Button>
        <Button variant="secondary" disabled={!results.length} onClick={() => void copyText(resultText, setNotice, ui.copied, ui.copyError)}>{ui.copyAll}</Button>
        <Button variant="secondary" disabled={!results.length} onClick={() => downloadText(json, 'checksums.json', 'application/json')}>{ui.exportJson}</Button>
        <Button variant="secondary" disabled={!results.length} onClick={() => downloadText(csv, 'checksums.csv', 'text/csv')}>{ui.exportCsv}</Button>
      </div>
      <NoticeBox notice={notice} />
      {results.length ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr><th className="px-3 py-2">{ui.algorithm}</th><th className="px-3 py-2">{ui.hash}</th><th className="px-3 py-2">{ui.compare}</th><th className="px-3 py-2"></th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {results.map((item) => {
                const matches = expectedClean && item.value.toLowerCase() === expectedClean;
                return (
                  <tr key={item.algorithm}>
                    <td className="px-3 py-2 font-semibold">{item.algorithm.toUpperCase()}</td>
                    <td className="break-all px-3 py-2 font-mono text-xs">{item.value}</td>
                    <td className={`px-3 py-2 font-semibold ${expectedClean ? (matches ? 'text-emerald-700' : 'text-red-700') : 'text-slate-500'}`}>
                      {expectedClean ? (matches ? ui.match : ui.noMatch) : '-'}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Button
                        variant="ghost"
                        className="h-8 px-3 text-xs"
                        onClick={() => {
                          setCopiedAlgorithm(item.algorithm);
                          void copyText(item.value, setNotice, ui.copied, ui.copyError);
                          setTimeout(() => setCopiedAlgorithm(null), 1800);
                        }}
                      >
                        {copiedAlgorithm === item.algorithm ? ui.copied : ui.copyHash}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">{ui.empty}</p>}
    </Card>
  );
}

const imageAccept = 'image/png,image/jpeg,image/jpg,image/webp,image/avif,image/gif,image/bmp,image/tiff,.png,.jpg,.jpeg,.webp,.avif,.gif,.bmp,.tif,.tiff';

const exifUi = {
  'pt-br': {
    title: 'Leitor e removedor de EXIF',
    intro: 'Leia metadados de imagens, identifique GPS/camera e baixe uma copia limpa gerada por canvas.',
    file: 'Imagens',
    read: 'Ler metadados',
    remove: 'Remover EXIF da imagem ativa',
    removeAll: 'Remover EXIF de todas',
    copyJson: 'Copiar JSON',
    exportJson: 'Exportar JSON',
    metadata: 'Metadados',
    friendlyView: 'Leitura simples',
    rawJson: 'JSON bruto',
    selectedImage: 'Imagem',
    fileInfo: 'Arquivo',
    dimensions: 'Dimensoes',
    createdAt: 'Data de criacao',
    software: 'Software',
    camera: 'Camera',
    lens: 'Lente',
    gps: 'Localizacao GPS',
    colors: 'Cores',
    orientation: 'Orientacao',
    notFound: 'Nao informado',
    noMetadata: 'Nenhum metadado EXIF encontrado ou formato nao suportado.',
    cleanDone: 'Imagem limpa gerada.',
    cleanAllDone: 'Imagens limpas geradas em ZIP.',
    copied: 'Copiado.',
    copyError: 'Nao foi possivel copiar.',
    quality: 'Qualidade JPEG/WEBP',
    format: 'Formato limpo',
  },
  en: {
    title: 'EXIF reader and remover',
    intro: 'Read image metadata, detect GPS/camera fields, and download a clean canvas-rendered copy.',
    file: 'Images',
    read: 'Read metadata',
    remove: 'Remove EXIF from active image',
    removeAll: 'Remove EXIF from all',
    copyJson: 'Copy JSON',
    exportJson: 'Export JSON',
    metadata: 'Metadata',
    friendlyView: 'Simple view',
    rawJson: 'Raw JSON',
    selectedImage: 'Image',
    fileInfo: 'File',
    dimensions: 'Dimensions',
    createdAt: 'Creation date',
    software: 'Software',
    camera: 'Camera',
    lens: 'Lens',
    gps: 'GPS location',
    colors: 'Colors',
    orientation: 'Orientation',
    notFound: 'Not provided',
    noMetadata: 'No EXIF metadata found or unsupported format.',
    cleanDone: 'Clean image generated.',
    cleanAllDone: 'Clean images generated in ZIP.',
    copied: 'Copied.',
    copyError: 'Could not copy.',
    quality: 'JPEG/WEBP quality',
    format: 'Clean format',
  },
  es: {
    title: 'Lector y removedor de EXIF',
    intro: 'Lee metadatos de imagenes, detecta GPS/camara y descarga una copia limpia generada por canvas.',
    file: 'Imagenes',
    read: 'Leer metadatos',
    remove: 'Remover EXIF de imagen activa',
    removeAll: 'Remover EXIF de todas',
    copyJson: 'Copiar JSON',
    exportJson: 'Exportar JSON',
    metadata: 'Metadatos',
    friendlyView: 'Lectura simple',
    rawJson: 'JSON bruto',
    selectedImage: 'Imagen',
    fileInfo: 'Archivo',
    dimensions: 'Dimensiones',
    createdAt: 'Fecha de creacion',
    software: 'Software',
    camera: 'Camara',
    lens: 'Lente',
    gps: 'Ubicacion GPS',
    colors: 'Colores',
    orientation: 'Orientacion',
    notFound: 'No informado',
    noMetadata: 'No se encontraron metadatos EXIF o el formato no es compatible.',
    cleanDone: 'Imagen limpia generada.',
    cleanAllDone: 'Imagenes limpias generadas en ZIP.',
    copied: 'Copiado.',
    copyError: 'No fue posible copiar.',
    quality: 'Calidad JPEG/WEBP',
    format: 'Formato limpio',
  },
} satisfies Record<AppLocale, Record<string, string>>;

const cleanImage = async (file: File, format: 'png' | 'jpeg' | 'webp', quality: number): Promise<Blob> => {
  const bitmap = await loadImageBitmapFromFile(file);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas indisponivel.');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  context.drawImage(bitmap, 0, 0);
  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Falha ao gerar imagem.'))), `image/${format}`, quality / 100);
  });
};

type ExifImageMetadata = {
  fileKey: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  metadata: Record<string, unknown> | null;
};

type ExifFriendlyCard = {
  title: string;
  value: string;
  description: string;
  className: string;
};

const friendlyExifClasses = [
  'border-cyan-200 bg-cyan-50 text-cyan-900',
  'border-emerald-200 bg-emerald-50 text-emerald-900',
  'border-amber-200 bg-amber-50 text-amber-900',
  'border-violet-200 bg-violet-50 text-violet-900',
  'border-rose-200 bg-rose-50 text-rose-900',
  'border-slate-200 bg-slate-50 text-slate-900',
];

const getFileKey = (file: File): string => `${file.name}-${file.size}-${file.lastModified}`;

const formatExifValue = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return '';
  if (value instanceof Date) return value.toLocaleString('pt-BR');
  if (Array.isArray(value)) return value.map(formatExifValue).filter(Boolean).join(', ');
  if (typeof value === 'object') {
    if ('description' in value && typeof (value as { description?: unknown }).description === 'string') {
      return (value as { description: string }).description;
    }

    return JSON.stringify(value);
  }
  return String(value);
};

const findMetadataValue = (metadata: Record<string, unknown> | null, keys: string[]): string => {
  if (!metadata) return '';
  for (const key of keys) {
    const value = formatExifValue(metadata[key]);
    if (value) return value;
  }
  return '';
};

const buildExifFriendlyCards = (
  item: ExifImageMetadata | null,
  ui: Record<string, string>,
): ExifFriendlyCard[] => {
  if (!item) return [];
  const metadata = item.metadata;
  const width = findMetadataValue(metadata, ['ImageWidth', 'ExifImageWidth', 'PixelXDimension', 'width']);
  const height = findMetadataValue(metadata, ['ImageHeight', 'ExifImageHeight', 'PixelYDimension', 'height']);
  const colorParts = [
    findMetadataValue(metadata, ['ColorType', 'ColorSpace']),
    findMetadataValue(metadata, ['BitDepth', 'BitsPerSample']) ? `${findMetadataValue(metadata, ['BitDepth', 'BitsPerSample'])} bits` : '',
    findMetadataValue(metadata, ['Compression']),
  ].filter(Boolean);
  const gps = [
    findMetadataValue(metadata, ['latitude', 'GPSLatitude']),
    findMetadataValue(metadata, ['longitude', 'GPSLongitude']),
  ].filter(Boolean).join(', ');

  return [
    {
      title: ui.fileInfo,
      value: `${item.fileName} (${formatBytes(item.fileSize)})`,
      description: item.fileType || ui.notFound,
      className: friendlyExifClasses[0],
    },
    {
      title: ui.dimensions,
      value: width && height ? `${width} x ${height}px` : ui.notFound,
      description: 'Largura e altura registradas no arquivo.',
      className: friendlyExifClasses[1],
    },
    {
      title: ui.createdAt,
      value: findMetadataValue(metadata, ['DateTimeOriginal', 'CreateDate', 'ModifyDate', 'Creation Time']) || ui.notFound,
      description: 'Data/hora gravada no metadado, quando existe.',
      className: friendlyExifClasses[2],
    },
    {
      title: ui.software,
      value: findMetadataValue(metadata, ['Software', 'ProcessingSoftware']) || ui.notFound,
      description: 'Programa ou sistema que gerou/editou a imagem.',
      className: friendlyExifClasses[3],
    },
    {
      title: ui.camera,
      value: [findMetadataValue(metadata, ['Make']), findMetadataValue(metadata, ['Model'])].filter(Boolean).join(' ') || ui.notFound,
      description: 'Fabricante e modelo da camera, quando o arquivo informa.',
      className: friendlyExifClasses[4],
    },
    {
      title: ui.lens,
      value: findMetadataValue(metadata, ['LensModel', 'Lens', 'LensInfo']) || ui.notFound,
      description: 'Lente ou configuracao optica registrada pela camera.',
      className: friendlyExifClasses[5],
    },
    {
      title: ui.gps,
      value: gps || ui.notFound,
      description: 'Coordenadas podem revelar onde a foto foi feita.',
      className: friendlyExifClasses[0],
    },
    {
      title: ui.colors,
      value: colorParts.join(' / ') || ui.notFound,
      description: 'Informacoes tecnicas de cor, profundidade e compressao.',
      className: friendlyExifClasses[1],
    },
    {
      title: ui.orientation,
      value: findMetadataValue(metadata, ['Orientation']) || ui.notFound,
      description: 'Indica como a imagem deve ser rotacionada para exibicao.',
      className: friendlyExifClasses[2],
    },
  ];
};

export function ExifReaderRemoverTool({ locale = 'pt-br' }: Readonly<{ locale?: AppLocale }>) {
  const ui = exifUi[locale];
  const [files, setFiles] = useState<File[]>([]);
  const [metadataItems, setMetadataItems] = useState<ExifImageMetadata[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [notice, setNotice] = useState<Notice>(null);
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('jpeg');
  const [quality, setQuality] = useState(92);
  const file = files[activeIndex];
  const activeMetadata = metadataItems[activeIndex] ?? null;
  const metadataJson = activeMetadata ? JSON.stringify(activeMetadata.metadata ?? {}, null, 2) : '';
  const friendlyCards = useMemo(() => buildExifFriendlyCards(activeMetadata, ui), [activeMetadata, ui]);

  const readMetadata = async () => {
    if (!files.length) return;
    setNotice(null);
    const exifr = await import('exifr');
    const items = await Promise.all(files.map(async (imageFile) => {
      const parsed = (await exifr.parse(imageFile, { xmp: true, iptc: true, gps: true, jfif: true, ihdr: true })) as Record<string, unknown> | undefined;
      return {
        fileKey: getFileKey(imageFile),
        fileName: imageFile.name,
        fileSize: imageFile.size,
        fileType: imageFile.type,
        metadata: parsed ?? null,
      };
    }));
    setMetadataItems(items);
    setActiveIndex((current) => Math.min(current, Math.max(0, items.length - 1)));
    if (!items.some((item) => item.metadata && Object.keys(item.metadata).length > 0)) {
      setNotice({ tone: 'info', text: ui.noMetadata });
    }
  };

  const removeMetadata = async () => {
    if (!file) return;
    try {
      const blob = await cleanImage(file, format, quality);
      downloadBlob(blob, `${file.name.replace(/\.[^.]+$/, '')}-sem-exif.${format === 'jpeg' ? 'jpg' : format}`);
      setNotice({ tone: 'success', text: ui.cleanDone });
    } catch (error) {
      setNotice({ tone: 'error', text: error instanceof Error ? error.message : 'Erro.' });
    }
  };

  const removeAllMetadata = async () => {
    if (!files.length) return;
    try {
      const entries = await Promise.all(files.map(async (imageFile) => {
        const blob = await cleanImage(imageFile, format, quality);
        const extension = format === 'jpeg' ? 'jpg' : format;
        return {
          name: `${imageFile.name.replace(/\.[^.]+$/, '')}-sem-exif.${extension}`,
          blob,
        };
      }));

      if (entries.length === 1) {
        downloadBlob(entries[0].blob, entries[0].name);
        setNotice({ tone: 'success', text: ui.cleanDone });
        return;
      }

      await makeZip(entries, 'imagens-sem-exif.zip');
      setNotice({ tone: 'success', text: ui.cleanAllDone });
    } catch (error) {
      setNotice({ tone: 'error', text: error instanceof Error ? error.message : 'Erro.' });
    }
  };

  const handleFilesSelected = (next: File[]) => {
    setFiles(next);
    setMetadataItems([]);
    setActiveIndex(0);
    setNotice(null);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setMetadataItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setActiveIndex((current) => Math.max(0, Math.min(current, files.length - 2)));
  };

  return (
    <Card className="space-y-5">
      <ToolHeader title={ui.title} intro={ui.intro} />
      <FileUploadDropzone locale={locale} label={ui.file} accept={imageAccept} multiple selectedFiles={files} onFilesSelected={handleFilesSelected} onRemoveFile={handleRemoveFile} />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{ui.format}</span>
          <Select value={format} onChange={(event) => setFormat(event.target.value as typeof format)}>
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="webp">WEBP</option>
          </Select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{ui.quality}: {quality}%</span>
          <input className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-brand-600" type="range" min={10} max={100} value={quality} onChange={(event) => setQuality(Number(event.target.value))} />
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" disabled={!files.length} onClick={() => void readMetadata()}>{ui.read}</Button>
        <Button variant="secondary" disabled={!file} onClick={() => void removeMetadata()}>{ui.remove}</Button>
        <Button variant="secondary" disabled={!files.length} onClick={() => void removeAllMetadata()}>{ui.removeAll}</Button>
        <Button variant="secondary" disabled={!activeMetadata} onClick={() => void copyText(metadataJson, setNotice, ui.copied, ui.copyError)}>{ui.copyJson}</Button>
        <Button variant="secondary" disabled={!activeMetadata} onClick={() => downloadText(metadataJson, `${activeMetadata?.fileName ?? 'exif'}-metadata.json`, 'application/json')}>{ui.exportJson}</Button>
      </div>
      <NoticeBox notice={notice} />
      {files.length ? (
        <div className="flex gap-2 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-2">
          {files.map((imageFile, index) => (
            <button
              key={getFileKey(imageFile)}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`shrink-0 rounded-lg border px-3 py-2 text-left text-xs font-semibold transition ${
                index === activeIndex ? 'border-brand-300 bg-white text-brand-700 shadow-sm' : 'border-transparent text-slate-600 hover:bg-white'
              }`}
            >
              {ui.selectedImage} {index + 1}
              <span className="mt-0.5 block max-w-[180px] truncate font-normal text-slate-500">{imageFile.name}</span>
            </button>
          ))}
        </div>
      ) : null}

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-slate-900">{ui.friendlyView}</h4>
          <span className="text-xs text-slate-500">{activeMetadata?.fileName ?? ui.noMetadata}</span>
        </div>
        {friendlyCards.length ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {friendlyCards.map((card) => (
              <div key={card.title} className={`rounded-lg border p-3 ${card.className}`}>
                <p className="text-xs font-semibold uppercase tracking-wide opacity-75">{card.title}</p>
                <p className="mt-1 break-all text-sm font-semibold">{card.value}</p>
                <p className="mt-2 text-xs leading-relaxed opacity-80">{card.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">{ui.noMetadata}</p>
        )}
      </section>

      <section className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h4 className="text-sm font-semibold text-slate-900">{ui.rawJson}</h4>
        <pre className="max-h-[420px] overflow-auto rounded-lg bg-white p-3 text-xs text-slate-800">{metadataJson || ui.noMetadata}</pre>
      </section>
    </Card>
  );
}

const resizeUi = {
  'pt-br': {
    title: 'Redimensionar e cortar imagem',
    intro: 'Redimensione, recorte em proporcao fixa e exporte imagem em PNG, JPEG ou WEBP.',
    file: 'Imagem',
    width: 'Largura',
    height: 'Altura',
    keepRatio: 'Manter proporcao',
    mode: 'Modo',
    fit: 'Ajustar sem cortar',
    cover: 'Cortar para preencher',
    square: 'Quadrado central',
    format: 'Formato',
    quality: 'Qualidade',
    sourcePreview: 'Imagem original',
    livePreview: 'Resultado ao vivo',
    cropHint: 'Arraste a moldura ou os quadrados para escolher o corte.',
    outputSize: 'Saida',
    download: 'Baixar resultado',
    preview: 'Preview',
    rendering: 'Atualizando preview...',
    noImage: 'Selecione uma imagem para abrir o editor.',
    copied: 'Imagem pronta.',
  },
  en: {
    title: 'Resize and crop image',
    intro: 'Resize, crop to fixed ratios, and export PNG, JPEG, or WEBP locally.',
    file: 'Image',
    width: 'Width',
    height: 'Height',
    keepRatio: 'Keep ratio',
    mode: 'Mode',
    fit: 'Fit without crop',
    cover: 'Crop to cover',
    square: 'Centered square',
    format: 'Format',
    quality: 'Quality',
    sourcePreview: 'Original image',
    livePreview: 'Live result',
    cropHint: 'Drag the frame or handles to choose the crop.',
    outputSize: 'Output',
    download: 'Download result',
    preview: 'Preview',
    rendering: 'Updating preview...',
    noImage: 'Select an image to open the editor.',
    copied: 'Image ready.',
  },
  es: {
    title: 'Redimensionar y cortar imagen',
    intro: 'Redimensiona, recorta con proporcion fija y exporta PNG, JPEG o WEBP localmente.',
    file: 'Imagen',
    width: 'Ancho',
    height: 'Alto',
    keepRatio: 'Mantener proporcion',
    mode: 'Modo',
    fit: 'Ajustar sin cortar',
    cover: 'Cortar para cubrir',
    square: 'Cuadrado central',
    format: 'Formato',
    quality: 'Calidad',
    sourcePreview: 'Imagen original',
    livePreview: 'Resultado en vivo',
    cropHint: 'Arrastra el marco o los cuadrados para elegir el recorte.',
    outputSize: 'Salida',
    download: 'Descargar resultado',
    preview: 'Preview',
    rendering: 'Actualizando preview...',
    noImage: 'Selecciona una imagen para abrir el editor.',
    copied: 'Imagen lista.',
  },
} satisfies Record<AppLocale, Record<string, string>>;

type ResizeMode = 'fit' | 'cover' | 'square';

type ImageCrop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type CropDragMode = 'move' | 'n' | 's' | 'e' | 'w' | 'nw' | 'ne' | 'sw' | 'se';

type CropDragState = {
  mode: CropDragMode;
  startClientX: number;
  startClientY: number;
  startCrop: ImageCrop;
  stageWidth: number;
  stageHeight: number;
};

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

const parsePositiveDimension = (value: string, fallback: number): number => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const getCropAspect = (mode: ResizeMode, width: number, height: number): number =>
  mode === 'square' ? 1 : Math.max(0.01, width / Math.max(1, height));

const createCenteredCrop = (imageWidth: number, imageHeight: number, aspect: number): ImageCrop => {
  let cropWidth = imageWidth;
  let cropHeight = cropWidth / aspect;

  if (cropHeight > imageHeight) {
    cropHeight = imageHeight;
    cropWidth = cropHeight * aspect;
  }

  return {
    x: Math.round((imageWidth - cropWidth) / 2),
    y: Math.round((imageHeight - cropHeight) / 2),
    width: Math.round(cropWidth),
    height: Math.round(cropHeight),
  };
};

const normalizeCrop = (crop: ImageCrop, imageWidth: number, imageHeight: number, aspect: number): ImageCrop => {
  const minWidth = Math.min(80, imageWidth);
  const minHeight = minWidth / aspect;
  let width = Math.max(minWidth, crop.width);
  let height = width / aspect;

  if (height < minHeight) {
    height = minHeight;
    width = height * aspect;
  }

  if (width > imageWidth) {
    width = imageWidth;
    height = width / aspect;
  }

  if (height > imageHeight) {
    height = imageHeight;
    width = height * aspect;
  }

  return {
    x: Math.round(clamp(crop.x, 0, Math.max(0, imageWidth - width))),
    y: Math.round(clamp(crop.y, 0, Math.max(0, imageHeight - height))),
    width: Math.round(width),
    height: Math.round(height),
  };
};

const adjustCropToAspect = (crop: ImageCrop, imageWidth: number, imageHeight: number, aspect: number): ImageCrop => {
  const centerX = crop.x + crop.width / 2;
  const centerY = crop.y + crop.height / 2;
  let width = crop.width;
  let height = width / aspect;

  if (height > crop.height) {
    height = crop.height;
    width = height * aspect;
  }

  return normalizeCrop({ x: centerX - width / 2, y: centerY - height / 2, width, height }, imageWidth, imageHeight, aspect);
};

const getDraggedCrop = (
  drag: CropDragState,
  clientX: number,
  clientY: number,
  imageWidth: number,
  imageHeight: number,
  aspect: number,
): ImageCrop => {
  const deltaX = ((clientX - drag.startClientX) / drag.stageWidth) * imageWidth;
  const deltaY = ((clientY - drag.startClientY) / drag.stageHeight) * imageHeight;
  const start = drag.startCrop;

  if (drag.mode === 'move') {
    return normalizeCrop({ ...start, x: start.x + deltaX, y: start.y + deltaY }, imageWidth, imageHeight, aspect);
  }

  let widthDelta = 0;

  if (drag.mode.includes('e')) widthDelta = deltaX;
  if (drag.mode.includes('w')) widthDelta = -deltaX;
  if (drag.mode === 'n') widthDelta = -deltaY * aspect;
  if (drag.mode === 's') widthDelta = deltaY * aspect;

  if (drag.mode === 'ne' || drag.mode === 'sw') {
    widthDelta = Math.abs(deltaX) > Math.abs(deltaY * aspect)
      ? (drag.mode === 'ne' ? deltaX : -deltaX)
      : (drag.mode === 'ne' ? -deltaY * aspect : deltaY * aspect);
  }

  if (drag.mode === 'nw' || drag.mode === 'se') {
    widthDelta = Math.abs(deltaX) > Math.abs(deltaY * aspect)
      ? (drag.mode === 'se' ? deltaX : -deltaX)
      : (drag.mode === 'se' ? deltaY * aspect : -deltaY * aspect);
  }

  const nextWidth = Math.max(20, start.width + widthDelta);
  const nextHeight = nextWidth / aspect;
  let x = start.x;
  let y = start.y;

  if (drag.mode.includes('w')) x = start.x + start.width - nextWidth;
  if (drag.mode.includes('n')) y = start.y + start.height - nextHeight;

  return normalizeCrop({ x, y, width: nextWidth, height: nextHeight }, imageWidth, imageHeight, aspect);
};

const renderResizedBlob = async (
  image: HTMLImageElement,
  crop: ImageCrop | null,
  targetWidth: number,
  targetHeight: number,
  mode: ResizeMode,
  format: 'png' | 'jpeg' | 'webp',
  quality: number,
): Promise<Blob> => {
  const outputWidth = Math.max(1, Math.round(targetWidth));
  const outputHeight = Math.max(1, Math.round(mode === 'square' ? targetWidth : targetHeight));
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas indisponivel.');
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  context.imageSmoothingQuality = 'high';
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, outputWidth, outputHeight);

  if (mode === 'fit') {
    const scale = Math.min(outputWidth / image.naturalWidth, outputHeight / image.naturalHeight);
    const drawWidth = Math.round(image.naturalWidth * scale);
    const drawHeight = Math.round(image.naturalHeight * scale);
    context.drawImage(image, Math.round((outputWidth - drawWidth) / 2), Math.round((outputHeight - drawHeight) / 2), drawWidth, drawHeight);
  } else {
    const sourceCrop = crop ?? createCenteredCrop(image.naturalWidth, image.naturalHeight, outputWidth / outputHeight);
    context.drawImage(image, sourceCrop.x, sourceCrop.y, sourceCrop.width, sourceCrop.height, 0, 0, outputWidth, outputHeight);
  }

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Falha ao gerar imagem.'))), `image/${format}`, quality / 100);
  });
};

export function ImageResizeCropTool({ locale = 'pt-br' }: Readonly<{ locale?: AppLocale }>) {
  const ui = resizeUi[locale];
  const [files, setFiles] = useState<File[]>([]);
  const [width, setWidth] = useState('1080');
  const [height, setHeight] = useState('1080');
  const [keepRatio, setKeepRatio] = useState(false);
  const [mode, setMode] = useState<ResizeMode>('cover');
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('webp');
  const [quality, setQuality] = useState(90);
  const [sourceUrl, setSourceUrl] = useState('');
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(null);
  const [crop, setCrop] = useState<ImageCrop | null>(null);
  const [resultUrl, setResultUrl] = useState('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef<CropDragState | null>(null);
  const resultUrlRef = useRef('');
  const file = files[0];
  const targetWidth = parsePositiveDimension(width, 1080);
  const targetHeight = mode === 'square' ? targetWidth : parsePositiveDimension(height, 1080);
  const cropAspect = getCropAspect(mode, targetWidth, targetHeight);
  const cropEnabled = mode !== 'fit';

  useEffect(() => {
    resultUrlRef.current = resultUrl;
  }, [resultUrl]);

  useEffect(() => () => {
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
  }, []);

  useEffect(() => {
    if (!file) {
      setSourceUrl('');
      setNaturalSize(null);
      setCrop(null);
      setResultBlob(null);
      setResultUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return '';
      });
      return undefined;
    }

    const nextUrl = URL.createObjectURL(file);
    setSourceUrl(nextUrl);
    setNaturalSize(null);
    setCrop(null);
    setResultBlob(null);
    setResultUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return '';
    });

    return () => URL.revokeObjectURL(nextUrl);
  }, [file]);

  useEffect(() => {
    if (!naturalSize || !cropEnabled) return;
    setCrop((current) => (
      current
        ? adjustCropToAspect(current, naturalSize.width, naturalSize.height, cropAspect)
        : createCenteredCrop(naturalSize.width, naturalSize.height, cropAspect)
    ));
  }, [cropAspect, cropEnabled, naturalSize]);

  useEffect(() => {
    if (!sourceUrl || !naturalSize || !imageRef.current) return undefined;
    if (cropEnabled && !crop) return undefined;

    let cancelled = false;
    const timer = window.setTimeout(() => {
      setIsRendering(true);
      void renderResizedBlob(imageRef.current as HTMLImageElement, crop, targetWidth, targetHeight, mode, format, quality)
        .then((blob) => {
          if (cancelled) return;
          const nextUrl = URL.createObjectURL(blob);
          setResultBlob(blob);
          setResultUrl((current) => {
            if (current) URL.revokeObjectURL(current);
            return nextUrl;
          });
          setNotice(null);
        })
        .catch((error) => {
          if (!cancelled) setNotice({ tone: 'error', text: error instanceof Error ? error.message : 'Erro.' });
        })
        .finally(() => {
          if (!cancelled) setIsRendering(false);
        });
    }, 90);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [crop, cropEnabled, format, mode, naturalSize, quality, sourceUrl, targetHeight, targetWidth]);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || !naturalSize || !cropEnabled) return;
      setCrop(getDraggedCrop(drag, event.clientX, event.clientY, naturalSize.width, naturalSize.height, cropAspect));
    };

    const handlePointerUp = () => {
      dragRef.current = null;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [cropAspect, cropEnabled, naturalSize]);

  const cropStyle = useMemo(() => {
    if (!crop || !naturalSize) return {};
    return {
      left: `${(crop.x / naturalSize.width) * 100}%`,
      top: `${(crop.y / naturalSize.height) * 100}%`,
      width: `${(crop.width / naturalSize.width) * 100}%`,
      height: `${(crop.height / naturalSize.height) * 100}%`,
    };
  }, [crop, naturalSize]);

  const updateWidth = (next: string) => {
    if (keepRatio && Number(width) > 0 && Number(height) > 0) {
      const ratio = Number(height) / Number(width);
      setHeight(String(Math.max(1, Math.round(Number(next) * ratio))));
    }
    setWidth(next);
  };

  const updateHeight = (next: string) => {
    if (keepRatio && Number(width) > 0 && Number(height) > 0) {
      const ratio = Number(width) / Number(height);
      setWidth(String(Math.max(1, Math.round(Number(next) * ratio))));
    }
    setHeight(next);
  };

  const startCropDrag = (event: ReactPointerEvent<HTMLElement>, dragMode: CropDragMode) => {
    if (!crop || !naturalSize || !cropEnabled || !stageRef.current) return;
    event.preventDefault();
    const rect = stageRef.current.getBoundingClientRect();
    dragRef.current = {
      mode: dragMode,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startCrop: crop,
      stageWidth: rect.width,
      stageHeight: rect.height,
    };
  };

  const onImageLoad = () => {
    const image = imageRef.current;
    if (!image) return;
    const nextSize = { width: image.naturalWidth, height: image.naturalHeight };
    setNaturalSize(nextSize);
    setCrop(createCenteredCrop(nextSize.width, nextSize.height, cropAspect));
  };

  return (
    <Card className="space-y-5">
      <ToolHeader title={ui.title} intro={ui.intro} />
      <FileUploadDropzone locale={locale} label={ui.file} accept={imageAccept} multiple={false} selectedFiles={files} onFilesSelected={(next) => setFiles(next.slice(0, 1))} onRemoveFile={() => setFiles([])} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <label className="space-y-2"><span className="text-sm font-semibold text-slate-800">{ui.width}</span><Input type="number" value={width} onChange={(event) => updateWidth(event.target.value)} /></label>
        <label className="space-y-2"><span className="text-sm font-semibold text-slate-800">{ui.height}</span><Input type="number" value={mode === 'square' ? width : height} disabled={mode === 'square'} onChange={(event) => updateHeight(event.target.value)} /></label>
        <label className="space-y-2"><span className="text-sm font-semibold text-slate-800">{ui.mode}</span><Select value={mode} onChange={(event) => setMode(event.target.value as ResizeMode)}><option value="fit">{ui.fit}</option><option value="cover">{ui.cover}</option><option value="square">{ui.square}</option></Select></label>
        <label className="space-y-2"><span className="text-sm font-semibold text-slate-800">{ui.format}</span><Select value={format} onChange={(event) => setFormat(event.target.value as typeof format)}><option value="webp">WEBP</option><option value="jpeg">JPEG</option><option value="png">PNG</option></Select></label>
      </div>
      <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" checked={keepRatio} onChange={(event) => setKeepRatio(event.target.checked)} />{ui.keepRatio}</label>
      <label className="space-y-2 block"><span className="text-sm font-semibold text-slate-800">{ui.quality}: {quality}%</span><input className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-brand-600" type="range" min={10} max={100} value={quality} onChange={(event) => setQuality(Number(event.target.value))} /></label>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" disabled={!resultBlob} onClick={() => resultBlob && downloadBlob(resultBlob, `imagem-${targetWidth}x${targetHeight}.${format === 'jpeg' ? 'jpg' : format}`)}>{ui.download}</Button>
        <span className="text-xs text-slate-500">{ui.outputSize}: {targetWidth} x {targetHeight}px</span>
      </div>
      <NoticeBox notice={notice} />
      {sourceUrl ? (
        <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm font-semibold text-slate-900">{ui.sourcePreview}</h4>
              {cropEnabled ? <p className="text-xs text-slate-600">{ui.cropHint}</p> : null}
            </div>
            <div ref={stageRef} className="relative overflow-hidden rounded-xl border border-slate-200 bg-white">
              <img ref={imageRef} src={sourceUrl} alt={ui.sourcePreview} className="block w-full select-none" draggable={false} onLoad={onImageLoad} />
              {cropEnabled && crop && naturalSize ? (
                <div
                  className="absolute border-2 border-white shadow-[0_0_0_9999px_rgba(15,23,42,0.45)]"
                  style={cropStyle}
                  onPointerDown={(event) => startCropDrag(event, 'move')}
                >
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                    {Array.from({ length: 9 }).map((_, index) => (
                      <span key={index} className="border border-white/35" />
                    ))}
                  </div>
                  {(['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as CropDragMode[]).map((handle) => (
                    <button
                      key={handle}
                      type="button"
                      aria-label={`crop-${handle}`}
                      className={`absolute h-4 w-4 rounded-sm border border-white bg-brand-600 shadow ${
                        handle === 'nw' ? '-left-2 -top-2 cursor-nwse-resize' :
                          handle === 'n' ? 'left-1/2 -top-2 -translate-x-1/2 cursor-ns-resize' :
                            handle === 'ne' ? '-right-2 -top-2 cursor-nesw-resize' :
                              handle === 'e' ? '-right-2 top-1/2 -translate-y-1/2 cursor-ew-resize' :
                                handle === 'se' ? '-bottom-2 -right-2 cursor-nwse-resize' :
                                  handle === 's' ? '-bottom-2 left-1/2 -translate-x-1/2 cursor-ns-resize' :
                                    handle === 'sw' ? '-bottom-2 -left-2 cursor-nesw-resize' :
                                      '-left-2 top-1/2 -translate-y-1/2 cursor-ew-resize'
                      }`}
                      onPointerDown={(event) => {
                        event.stopPropagation();
                        startCropDrag(event, handle);
                      }}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm font-semibold text-slate-900">{ui.livePreview}</h4>
              {isRendering ? <span className="text-xs text-slate-500">{ui.rendering}</span> : null}
            </div>
            {resultUrl ? (
              <div className="flex min-h-[240px] items-center justify-center rounded-xl border border-slate-200 bg-white p-3">
                <img src={resultUrl} alt={ui.livePreview} className="max-h-[520px] max-w-full rounded-lg object-contain" />
              </div>
            ) : (
              <p className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">{ui.noImage}</p>
            )}
          </div>
        </section>
      ) : (
        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">{ui.noImage}</p>
      )}
    </Card>
  );
}

const pdfUi = {
  'pt-br': {
    title: 'Juntar, dividir e reordenar PDF',
    intro: 'Combine PDFs, reorganize ordem, suporte PDFs com senha, remova protecao quando souber a senha e exporte PDF final protegido.',
    files: 'Arquivos PDF',
    merge: 'Juntar PDFs',
    split: 'Dividir primeiro PDF em ZIP',
    inspect: 'Verificar seguranca',
    decrypt: 'Remover senha do primeiro PDF',
    protectFirst: 'Proteger primeiro PDF',
    clear: 'Limpar',
    zipPassword: 'Senha do ZIP das paginas (opcional)',
    inputPassword: 'Senha do PDF de entrada',
    inputPasswordHint: 'Use para abrir/remover protecao de PDF que ja veio com senha. A mesma senha sera usada em PDFs protegidos da fila.',
    outputPassword: 'Senha para proteger PDF final',
    ownerPassword: 'Senha do proprietario (opcional)',
    outputPasswordHint: 'Se preencher, o PDF unido ou o primeiro PDF sera exportado com senha de abertura.',
    security: 'Seguranca dos PDFs',
    encrypted: 'Protegido',
    notEncrypted: 'Sem senha',
    needsPassword: 'PDF protegido: informe a senha de entrada.',
    wrongPassword: 'Senha incorreta ou criptografia nao suportada.',
    moveUp: 'Subir',
    moveDown: 'Descer',
    remove: 'Remover',
    ready: 'Arquivo pronto.',
    decryptedReady: 'PDF sem senha gerado.',
    encryptedReady: 'PDF protegido com senha gerado.',
  },
  en: {
    title: 'Merge, split, and reorder PDF',
    intro: 'Combine PDFs, reorder files, support password-protected PDFs, remove protection when you know the password, and export a protected final PDF.',
    files: 'PDF files',
    merge: 'Merge PDFs',
    split: 'Split first PDF to ZIP',
    inspect: 'Check security',
    decrypt: 'Remove password from first PDF',
    protectFirst: 'Protect first PDF',
    clear: 'Clear',
    zipPassword: 'Page ZIP password (optional)',
    inputPassword: 'Input PDF password',
    inputPasswordHint: 'Use it to open/remove protection from a PDF that already has a password. The same password is used for protected files in the queue.',
    outputPassword: 'Password for final PDF',
    ownerPassword: 'Owner password (optional)',
    outputPasswordHint: 'If filled, the merged PDF or first PDF will be exported with an open password.',
    security: 'PDF security',
    encrypted: 'Protected',
    notEncrypted: 'No password',
    needsPassword: 'Protected PDF: enter the input password.',
    wrongPassword: 'Incorrect password or unsupported encryption.',
    moveUp: 'Move up',
    moveDown: 'Move down',
    remove: 'Remove',
    ready: 'File ready.',
    decryptedReady: 'Password-free PDF generated.',
    encryptedReady: 'Password-protected PDF generated.',
  },
  es: {
    title: 'Unir, dividir y reordenar PDF',
    intro: 'Combina PDFs, reorganiza archivos, soporta PDFs con contrasena, remueve proteccion si sabes la contrasena y exporta PDF final protegido.',
    files: 'Archivos PDF',
    merge: 'Unir PDFs',
    split: 'Dividir primer PDF en ZIP',
    inspect: 'Verificar seguridad',
    decrypt: 'Remover contrasena del primer PDF',
    protectFirst: 'Proteger primer PDF',
    clear: 'Limpiar',
    zipPassword: 'Contrasena del ZIP de paginas (opcional)',
    inputPassword: 'Contrasena del PDF de entrada',
    inputPasswordHint: 'Usala para abrir/remover proteccion de un PDF que ya vino con contrasena. La misma contrasena se usa en PDFs protegidos de la cola.',
    outputPassword: 'Contrasena para proteger PDF final',
    ownerPassword: 'Contrasena de propietario (opcional)',
    outputPasswordHint: 'Si completas este campo, el PDF unido o el primer PDF se exporta con contrasena de apertura.',
    security: 'Seguridad de PDFs',
    encrypted: 'Protegido',
    notEncrypted: 'Sin contrasena',
    needsPassword: 'PDF protegido: informa la contrasena de entrada.',
    wrongPassword: 'Contrasena incorrecta o cifrado no soportado.',
    moveUp: 'Subir',
    moveDown: 'Bajar',
    remove: 'Remover',
    ready: 'Archivo listo.',
    decryptedReady: 'PDF sin contrasena generado.',
    encryptedReady: 'PDF protegido con contrasena generado.',
  },
} satisfies Record<AppLocale, Record<string, string>>;

type PdfSecurityInfo = {
  fileKey: string;
  fileName: string;
  encrypted: boolean;
  algorithm?: string;
  keyLength?: number;
};

const getPdfFileKey = (file: File): string => `${file.name}-${file.size}-${file.lastModified}`;

const readPdfBytesForEditing = async (
  file: File,
  inputPassword: string,
  ui: Record<string, string>,
): Promise<{ bytes: Uint8Array; encrypted: boolean }> => {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { decryptPDF, isEncrypted } = await import('@pdfsmaller/pdf-decrypt');
  const info = await isEncrypted(bytes);

  if (!info.encrypted) {
    return { bytes, encrypted: false };
  }

  if (!inputPassword.trim()) {
    throw new Error(ui.needsPassword);
  }

  try {
    return { bytes: await decryptPDF(bytes, inputPassword), encrypted: true };
  } catch {
    throw new Error(ui.wrongPassword);
  }
};

const encryptPdfBytes = async (
  bytes: Uint8Array,
  outputPassword: string,
  ownerPassword: string,
): Promise<Uint8Array> => {
  if (!outputPassword.trim()) return bytes;
  const { encryptPDF } = await import('@pdfsmaller/pdf-encrypt-lite');
  return await encryptPDF(bytes, outputPassword, ownerPassword.trim() || undefined);
};

export function PdfOrganizerTool({ locale = 'pt-br' }: Readonly<{ locale?: AppLocale }>) {
  const ui = pdfUi[locale];
  const [files, setFiles] = useState<File[]>([]);
  const [zipPassword, setZipPassword] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [outputPassword, setOutputPassword] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [securityInfo, setSecurityInfo] = useState<PdfSecurityInfo[]>([]);
  const [notice, setNotice] = useState<Notice>(null);

  const move = (index: number, direction: -1 | 1) => {
    setFiles((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const merge = async () => {
    if (!files.length) return;
    try {
      const { PDFDocument } = await import('pdf-lib');
      const output = await PDFDocument.create();
      for (const file of files) {
        const { bytes } = await readPdfBytesForEditing(file, inputPassword, ui);
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = await output.copyPages(doc, doc.getPageIndices());
        pages.forEach((page) => output.addPage(page));
      }
      const bytes = await encryptPdfBytes(await output.save(), outputPassword, ownerPassword);
      downloadBlob(new Blob([bytes], { type: 'application/pdf' }), outputPassword ? 'pdf-combinado-protegido.pdf' : 'pdf-combinado.pdf');
      setNotice({ tone: 'success', text: outputPassword ? ui.encryptedReady : ui.ready });
    } catch (error) {
      setNotice({ tone: 'error', text: error instanceof Error ? error.message : 'Erro.' });
    }
  };

  const split = async () => {
    const file = files[0];
    if (!file) return;
    try {
      const { PDFDocument } = await import('pdf-lib');
      const { bytes } = await readPdfBytesForEditing(file, inputPassword, ui);
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const entries: Array<{ name: string; blob: Blob }> = [];
      for (const pageIndex of doc.getPageIndices()) {
        const output = await PDFDocument.create();
        const [page] = await output.copyPages(doc, [pageIndex]);
        output.addPage(page);
        const bytes = await output.save();
        entries.push({ name: `pagina-${pageIndex + 1}.pdf`, blob: new Blob([bytes], { type: 'application/pdf' }) });
      }
      await makeZip(entries, 'paginas-pdf.zip', zipPassword);
      setNotice({ tone: 'success', text: ui.ready });
    } catch (error) {
      setNotice({ tone: 'error', text: error instanceof Error ? error.message : 'Erro.' });
    }
  };

  const inspectSecurity = async () => {
    try {
      const { isEncrypted } = await import('@pdfsmaller/pdf-decrypt');
      const next = await Promise.all(files.map(async (file) => {
        const info = await isEncrypted(new Uint8Array(await file.arrayBuffer()));
        return {
          fileKey: getPdfFileKey(file),
          fileName: file.name,
          encrypted: info.encrypted,
          algorithm: info.algorithm,
          keyLength: info.keyLength,
        };
      }));
      setSecurityInfo(next);
      setNotice(null);
    } catch (error) {
      setNotice({ tone: 'error', text: error instanceof Error ? error.message : 'Erro.' });
    }
  };

  const decryptFirst = async () => {
    const file = files[0];
    if (!file) return;
    try {
      const { bytes } = await readPdfBytesForEditing(file, inputPassword, ui);
      downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `${file.name.replace(/\.pdf$/i, '')}-sem-senha.pdf`);
      setNotice({ tone: 'success', text: ui.decryptedReady });
    } catch (error) {
      setNotice({ tone: 'error', text: error instanceof Error ? error.message : 'Erro.' });
    }
  };

  const protectFirst = async () => {
    const file = files[0];
    if (!file || !outputPassword.trim()) return;
    try {
      const { bytes } = await readPdfBytesForEditing(file, inputPassword, ui);
      const encrypted = await encryptPdfBytes(bytes, outputPassword, ownerPassword);
      downloadBlob(new Blob([encrypted], { type: 'application/pdf' }), `${file.name.replace(/\.pdf$/i, '')}-protegido.pdf`);
      setNotice({ tone: 'success', text: ui.encryptedReady });
    } catch (error) {
      setNotice({ tone: 'error', text: error instanceof Error ? error.message : 'Erro.' });
    }
  };

  return (
    <Card className="space-y-5">
      <ToolHeader title={ui.title} intro={ui.intro} />
      <FileUploadDropzone locale={locale} label={ui.files} accept="application/pdf,.pdf" multiple selectedFiles={files} onFilesSelected={(next) => setFiles((current) => [...current, ...next])} onRemoveFile={(index) => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))} />
      <section className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 lg:grid-cols-3">
        <label className="space-y-2 block">
          <span className="text-sm font-semibold text-slate-800">{ui.inputPassword}</span>
          <Input type="password" value={inputPassword} onChange={(event) => setInputPassword(event.target.value)} />
          <span className="text-xs text-slate-500">{ui.inputPasswordHint}</span>
        </label>
        <label className="space-y-2 block">
          <span className="text-sm font-semibold text-slate-800">{ui.outputPassword}</span>
          <Input type="password" value={outputPassword} onChange={(event) => setOutputPassword(event.target.value)} />
          <span className="text-xs text-slate-500">{ui.outputPasswordHint}</span>
        </label>
        <label className="space-y-2 block">
          <span className="text-sm font-semibold text-slate-800">{ui.ownerPassword}</span>
          <Input type="password" value={ownerPassword} onChange={(event) => setOwnerPassword(event.target.value)} />
        </label>
      </section>
      <label className="space-y-2 block"><span className="text-sm font-semibold text-slate-800">{ui.zipPassword}</span><Input type="password" value={zipPassword} onChange={(event) => setZipPassword(event.target.value)} /></label>
      {files.length ? (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={`${file.name}-${file.lastModified}-${index}`} className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-900">{index + 1}. {file.name} <span className="font-normal text-slate-500">({formatBytes(file.size)})</span></span>
              <Button variant="ghost" onClick={() => move(index, -1)} disabled={index === 0}>{ui.moveUp}</Button>
              <Button variant="ghost" onClick={() => move(index, 1)} disabled={index === files.length - 1}>{ui.moveDown}</Button>
              <Button variant="ghost" onClick={() => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))}>{ui.remove}</Button>
            </div>
          ))}
        </div>
      ) : null}
      {securityInfo.length ? (
        <section className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
          <h4 className="text-sm font-semibold text-slate-900">{ui.security}</h4>
          <div className="grid gap-2">
            {securityInfo.map((item) => (
              <div key={item.fileKey} className={`rounded-lg border p-3 text-sm ${item.encrypted ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}>
                <span className="font-semibold">{item.fileName}</span>
                <span className="ml-2">{item.encrypted ? ui.encrypted : ui.notEncrypted}</span>
                {item.algorithm ? <span className="ml-2 text-xs opacity-80">{item.algorithm}{item.keyLength ? ` ${item.keyLength}-bit` : ''}</span> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" disabled={!files.length} onClick={() => void inspectSecurity()}>{ui.inspect}</Button>
        <Button variant="secondary" disabled={!files.length} onClick={() => void merge()}>{ui.merge}</Button>
        <Button variant="secondary" disabled={!files.length} onClick={() => void split()}>{ui.split}</Button>
        <Button variant="secondary" disabled={!files.length} onClick={() => void decryptFirst()}>{ui.decrypt}</Button>
        <Button variant="secondary" disabled={!files.length || !outputPassword.trim()} onClick={() => void protectFirst()}>{ui.protectFirst}</Button>
        <Button variant="ghost" onClick={() => setFiles([])}>{ui.clear}</Button>
      </div>
      <NoticeBox notice={notice} />
    </Card>
  );
}

const faviconUi = {
  'pt-br': {
    title: 'Gerador de favicon e manifest',
    intro: 'Gere pacote completo com favicon.ico, PNGs, Apple Touch Icon, maskable icons, manifest PWA e snippet HTML.',
    file: 'Imagem base',
    name: 'Nome do app/site',
    shortName: 'Nome curto',
    bg: 'Cor de fundo',
    theme: 'Cor do tema',
    startUrl: 'URL inicial',
    display: 'Display',
    padding: 'Padding seguro',
    rounded: 'Fundo arredondado nos maskable icons',
    standardBg: 'Fundo dos favicons comuns',
    transparent: 'Transparente',
    useBackground: 'Usar cor de fundo',
    useTheme: 'Usar cor do tema',
    invert: 'Inverter cor da imagem',
    autoGenerate: 'Atualizar automaticamente',
    previewTab: 'Previews',
    filesTab: 'Arquivos',
    codeTab: 'Codigos',
    sourcePreview: 'Imagem original',
    pwaPreview: 'PWA / Android',
    iosPreview: 'iOS Home Screen',
    browserPreview: 'Navegador',
    lightMode: 'Modo claro',
    darkMode: 'Modo escuro',
    htmlSnippet: 'HTML',
    reactSnippet: 'React',
    nextSnippet: 'Next.js Metadata',
    copyReact: 'Copiar React',
    copyNext: 'Copiar Next.js',
    generate: 'Gerar pacote',
    downloadZip: 'Baixar ZIP',
    copyHtml: 'Copiar HTML',
    copyManifest: 'Copiar manifest',
    preview: 'Arquivos gerados',
    filesReady: 'arquivos prontos',
    copied: 'Copiado.',
  },
  en: {
    title: 'Favicon and manifest generator',
    intro: 'Generate favicon.ico, PNG icons, Apple Touch Icon, maskable icons, PWA manifest, and HTML snippet.',
    file: 'Base image',
    name: 'App/site name',
    shortName: 'Short name',
    bg: 'Background color',
    theme: 'Theme color',
    startUrl: 'Start URL',
    display: 'Display',
    padding: 'Safe padding',
    rounded: 'Rounded background on maskable icons',
    standardBg: 'Regular favicon background',
    transparent: 'Transparent',
    useBackground: 'Use background color',
    useTheme: 'Use theme color',
    invert: 'Invert image colors',
    autoGenerate: 'Auto update',
    previewTab: 'Previews',
    filesTab: 'Files',
    codeTab: 'Code',
    sourcePreview: 'Original image',
    pwaPreview: 'PWA / Android',
    iosPreview: 'iOS Home Screen',
    browserPreview: 'Browser',
    lightMode: 'Light mode',
    darkMode: 'Dark mode',
    htmlSnippet: 'HTML',
    reactSnippet: 'React',
    nextSnippet: 'Next.js Metadata',
    copyReact: 'Copy React',
    copyNext: 'Copy Next.js',
    generate: 'Generate package',
    downloadZip: 'Download ZIP',
    copyHtml: 'Copy HTML',
    copyManifest: 'Copy manifest',
    preview: 'Generated files',
    filesReady: 'files ready',
    copied: 'Copied.',
  },
  es: {
    title: 'Generador de favicon y manifest',
    intro: 'Genera favicon.ico, PNGs, Apple Touch Icon, iconos maskable, manifest PWA y snippet HTML.',
    file: 'Imagen base',
    name: 'Nombre del app/site',
    shortName: 'Nombre corto',
    bg: 'Color de fondo',
    theme: 'Color del tema',
    startUrl: 'URL inicial',
    display: 'Display',
    padding: 'Padding seguro',
    rounded: 'Fondo redondeado en iconos maskable',
    standardBg: 'Fondo de favicons comunes',
    transparent: 'Transparente',
    useBackground: 'Usar color de fondo',
    useTheme: 'Usar color del tema',
    invert: 'Invertir color de imagen',
    autoGenerate: 'Actualizar automaticamente',
    previewTab: 'Previews',
    filesTab: 'Archivos',
    codeTab: 'Codigos',
    sourcePreview: 'Imagen original',
    pwaPreview: 'PWA / Android',
    iosPreview: 'iOS Home Screen',
    browserPreview: 'Navegador',
    lightMode: 'Modo claro',
    darkMode: 'Modo oscuro',
    htmlSnippet: 'HTML',
    reactSnippet: 'React',
    nextSnippet: 'Next.js Metadata',
    copyReact: 'Copiar React',
    copyNext: 'Copiar Next.js',
    generate: 'Generar paquete',
    downloadZip: 'Descargar ZIP',
    copyHtml: 'Copiar HTML',
    copyManifest: 'Copiar manifest',
    preview: 'Archivos generados',
    filesReady: 'archivos listos',
    copied: 'Copiado.',
  },
} satisfies Record<AppLocale, Record<string, string>>;

type FaviconTab = 'preview' | 'files' | 'code';
type FaviconStandardBackground = 'transparent' | 'background' | 'theme';

type FaviconAssetPreview = FaviconAsset & {
  url: string;
};

const findFaviconPreview = (assets: FaviconAssetPreview[], fileName: string): FaviconAssetPreview | undefined =>
  assets.find((asset) => asset.fileName === fileName);

const buildReactFaviconSnippet = (html: string): string =>
  [
    'export function FaviconLinks() {',
    '  return (',
    '    <>',
    ...html.split('\n').map((line) => `      ${line.replace(/>$/, ' />')}`),
    '    </>',
    '  );',
    '}',
  ].join('\n');

const buildNextFaviconSnippet = (themeColor: string, backgroundColor: string): string =>
  [
    'import type { Metadata } from "next";',
    '',
    'export const metadata: Metadata = {',
    '  manifest: "/site.webmanifest",',
    '  themeColor: [',
    `    { media: "(prefers-color-scheme: light)", color: "${themeColor}" },`,
    `    { media: "(prefers-color-scheme: dark)", color: "${backgroundColor}" },`,
    '  ],',
    '  icons: {',
    '    icon: [',
    '      { url: "/favicon.ico", sizes: "any" },',
    '      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },',
    '      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },',
    '    ],',
    '    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],',
    '  },',
    '};',
  ].join('\n');

export function FaviconManifestGeneratorTool({ locale = 'pt-br' }: Readonly<{ locale?: AppLocale }>) {
  const ui = faviconUi[locale];
  const [files, setFiles] = useState<File[]>([]);
  const [name, setName] = useState('Meu Site');
  const [shortName, setShortName] = useState('Site');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [themeColor, setThemeColor] = useState('#2563eb');
  const [startUrl, setStartUrl] = useState('/');
  const [display, setDisplay] = useState<'standalone' | 'minimal-ui' | 'browser' | 'fullscreen'>('standalone');
  const [padding, setPadding] = useState(8);
  const [rounded, setRounded] = useState(true);
  const [standardBackground, setStandardBackground] = useState<FaviconStandardBackground>('transparent');
  const [invertImage, setInvertImage] = useState(false);
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [activeTab, setActiveTab] = useState<FaviconTab>('preview');
  const [sourceUrl, setSourceUrl] = useState('');
  const [pkg, setPkg] = useState<FaviconPackage | null>(null);
  const [assetPreviews, setAssetPreviews] = useState<FaviconAssetPreview[]>([]);
  const [notice, setNotice] = useState<Notice>(null);
  const file = files[0];
  const appleIcon = findFaviconPreview(assetPreviews, 'apple-touch-icon.png');
  const androidIcon = findFaviconPreview(assetPreviews, 'web-app-manifest-192x192.png');
  const maskableIcon = findFaviconPreview(assetPreviews, 'maskable-icon-512x512.png');
  const favicon32 = findFaviconPreview(assetPreviews, 'favicon-32x32.png');
  const reactSnippet = pkg ? buildReactFaviconSnippet(pkg.html) : '';
  const nextSnippet = buildNextFaviconSnippet(themeColor, backgroundColor);

  useEffect(() => {
    if (!file) {
      setSourceUrl('');
      return undefined;
    }

    const nextUrl = URL.createObjectURL(file);
    setSourceUrl(nextUrl);
    return () => URL.revokeObjectURL(nextUrl);
  }, [file]);

  useEffect(() => () => {
    assetPreviews.forEach((asset) => URL.revokeObjectURL(asset.url));
  }, [assetPreviews]);

  const generate = async () => {
    if (!file) return;
    try {
      const next = await generateFaviconPackage(
        file,
        { name, shortName, backgroundColor, themeColor, startUrl, display },
        {
          paddingPercent: padding,
          roundedBackground: rounded,
          standardBackground,
          invertImage,
        },
      );
      setAssetPreviews((current) => {
        current.forEach((asset) => URL.revokeObjectURL(asset.url));
        return next.assets.map((asset) => ({ ...asset, url: URL.createObjectURL(asset.blob) }));
      });
      setPkg(next);
      setNotice({ tone: 'success', text: `${next.assets.length} ${ui.filesReady}` });
    } catch (error) {
      setNotice({ tone: 'error', text: error instanceof Error ? error.message : 'Erro.' });
    }
  };

  useEffect(() => {
    if (!file || !autoGenerate) return undefined;
    const timer = window.setTimeout(() => {
      void generate();
    }, 180);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoGenerate, backgroundColor, display, file, invertImage, name, padding, rounded, shortName, standardBackground, startUrl, themeColor]);

  return (
    <Card className="space-y-5">
      <ToolHeader title={ui.title} intro={ui.intro} />
      <FileUploadDropzone locale={locale} label={ui.file} accept={imageAccept} multiple={false} selectedFiles={files} onFilesSelected={(next) => setFiles(next.slice(0, 1))} onRemoveFile={() => setFiles([])} />
      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <section className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <label className="space-y-2"><span className="text-sm font-semibold text-slate-800">{ui.name}</span><Input value={name} onChange={(event) => setName(event.target.value)} /></label>
            <label className="space-y-2"><span className="text-sm font-semibold text-slate-800">{ui.shortName}</span><Input value={shortName} onChange={(event) => setShortName(event.target.value)} /></label>
            <label className="space-y-2"><span className="text-sm font-semibold text-slate-800">{ui.startUrl}</span><Input value={startUrl} onChange={(event) => setStartUrl(event.target.value)} /></label>
            <label className="space-y-2"><span className="text-sm font-semibold text-slate-800">{ui.bg}</span><Input type="color" value={backgroundColor} onChange={(event) => setBackgroundColor(event.target.value)} /></label>
            <label className="space-y-2"><span className="text-sm font-semibold text-slate-800">{ui.theme}</span><Input type="color" value={themeColor} onChange={(event) => setThemeColor(event.target.value)} /></label>
            <label className="space-y-2"><span className="text-sm font-semibold text-slate-800">{ui.display}</span><Select value={display} onChange={(event) => setDisplay(event.target.value as typeof display)}><option value="standalone">standalone</option><option value="minimal-ui">minimal-ui</option><option value="browser">browser</option><option value="fullscreen">fullscreen</option></Select></label>
            <label className="space-y-2 lg:col-span-2"><span className="text-sm font-semibold text-slate-800">{ui.standardBg}</span><Select value={standardBackground} onChange={(event) => setStandardBackground(event.target.value as FaviconStandardBackground)}><option value="transparent">{ui.transparent}</option><option value="background">{ui.useBackground}</option><option value="theme">{ui.useTheme}</option></Select></label>
          </div>
          <label className="space-y-2 block"><span className="text-sm font-semibold text-slate-800">{ui.padding}: {padding}%</span><input className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-brand-600" type="range" min={0} max={24} value={padding} onChange={(event) => setPadding(Number(event.target.value))} /></label>
          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" checked={rounded} onChange={(event) => setRounded(event.target.checked)} />{ui.rounded}</label>
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" checked={invertImage} onChange={(event) => setInvertImage(event.target.checked)} />{ui.invert}</label>
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" checked={autoGenerate} onChange={(event) => setAutoGenerate(event.target.checked)} />{ui.autoGenerate}</label>
          </div>
        </section>
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-semibold text-slate-900">{ui.sourcePreview}</h4>
          <div className="mt-3 flex aspect-square items-center justify-center rounded-xl border border-slate-200 bg-white p-6">
            {sourceUrl ? <img src={sourceUrl} alt={ui.sourcePreview} className="max-h-full max-w-full object-contain" /> : <span className="text-sm text-slate-500">{ui.file}</span>}
          </div>
        </section>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" disabled={!file} onClick={() => void generate()}>{ui.generate}</Button>
        <Button variant="secondary" disabled={!pkg} onClick={() => pkg && void makeZip(pkg.assets.map((asset) => ({ name: asset.fileName, blob: asset.blob })), 'favicon-package.zip')}>{ui.downloadZip}</Button>
        <Button variant="secondary" disabled={!pkg} onClick={() => pkg && void copyText(pkg.html, setNotice, ui.copied, 'Erro')}>{ui.copyHtml}</Button>
        <Button variant="secondary" disabled={!pkg} onClick={() => pkg && void copyText(pkg.manifest, setNotice, ui.copied, 'Erro')}>{ui.copyManifest}</Button>
        <Button variant="secondary" disabled={!pkg} onClick={() => void copyText(reactSnippet, setNotice, ui.copied, 'Erro')}>{ui.copyReact}</Button>
        <Button variant="secondary" onClick={() => void copyText(nextSnippet, setNotice, ui.copied, 'Erro')}>{ui.copyNext}</Button>
      </div>
      <NoticeBox notice={notice} />
      {pkg ? (
        <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap gap-2">
            {([
              ['preview', ui.previewTab],
              ['files', ui.filesTab],
              ['code', ui.codeTab],
            ] as Array<[FaviconTab, string]>).map(([tab, label]) => (
              <Button key={tab} variant={activeTab === tab ? 'primary' : 'secondary'} onClick={() => setActiveTab(tab)}>{label}</Button>
            ))}
          </div>

          {activeTab === 'preview' ? (
            <div className="grid gap-4 xl:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h4 className="text-sm font-semibold text-slate-900">{ui.browserPreview}</h4>
                <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2 bg-slate-100 px-3 py-2">
                    {favicon32 ? <img src={favicon32.url} alt="favicon" className="h-5 w-5" /> : null}
                    <span className="truncate text-xs font-semibold text-slate-700">{name}</span>
                  </div>
                  <div className="bg-white p-4 text-sm text-slate-600">/{startUrl.replace(/^\//, '')}</div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[ui.lightMode, ui.darkMode].map((modeLabel, index) => (
                    <div key={modeLabel} className={`rounded-lg border p-3 ${index === 0 ? 'border-slate-200 bg-white' : 'border-slate-700 bg-slate-950'}`}>
                      <p className={`text-xs font-semibold ${index === 0 ? 'text-slate-700' : 'text-slate-200'}`}>{modeLabel}</p>
                      {favicon32 ? <img src={favicon32.url} alt={modeLabel} className="mt-2 h-8 w-8" /> : null}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h4 className="text-sm font-semibold text-slate-900">{ui.iosPreview}</h4>
                <div className="mt-3 rounded-[28px] bg-slate-900 p-5">
                  <div className="grid grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <div key={index} className="aspect-square rounded-2xl bg-slate-700/80" />
                    ))}
                    <div className="text-center">
                      <div className="mx-auto aspect-square rounded-2xl bg-white shadow-lg">
                        {appleIcon ? <img src={appleIcon.url} alt="iOS" className="h-full w-full rounded-2xl object-contain p-1" /> : null}
                      </div>
                      <p className="mt-1 truncate text-[10px] text-white">{shortName}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h4 className="text-sm font-semibold text-slate-900">{ui.pwaPreview}</h4>
                <div className="mt-3 rounded-2xl border border-slate-200 p-4" style={{ backgroundColor }}>
                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[24px] bg-white/80 shadow-lg">
                    {(maskableIcon ?? androidIcon) ? <img src={(maskableIcon ?? androidIcon)?.url} alt="PWA" className="h-24 w-24 object-contain" /> : null}
                  </div>
                  <p className="mt-3 text-center text-sm font-semibold" style={{ color: themeColor }}>{name}</p>
                  <p className="text-center text-xs text-slate-600">{display}</p>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === 'files' ? (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {assetPreviews.map((asset) => (
                <button key={asset.fileName} type="button" onClick={() => downloadBlob(asset.blob, asset.fileName)} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 text-left text-sm hover:border-brand-300">
                  {asset.width ? <img src={asset.url} alt={asset.fileName} className="h-10 w-10 shrink-0 rounded-md border border-slate-100 object-contain" /> : <span className="h-10 w-10 rounded-md bg-slate-100" />}
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-slate-900">{asset.fileName}</span>
                    <span className="text-xs text-slate-500">{asset.width ? `${asset.width}x${asset.height} • ` : ''}{formatBytes(asset.blob.size)}</span>
                  </span>
                </button>
              ))}
            </div>
          ) : null}

          {activeTab === 'code' ? (
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="space-y-2"><h4 className="text-sm font-semibold text-slate-900">{ui.htmlSnippet}</h4><pre className="max-h-[360px] overflow-auto rounded-lg bg-white p-3 text-xs text-slate-800">{pkg.html}</pre></div>
              <div className="space-y-2"><h4 className="text-sm font-semibold text-slate-900">{ui.reactSnippet}</h4><pre className="max-h-[360px] overflow-auto rounded-lg bg-white p-3 text-xs text-slate-800">{reactSnippet}</pre></div>
              <div className="space-y-2"><h4 className="text-sm font-semibold text-slate-900">{ui.nextSnippet}</h4><pre className="max-h-[360px] overflow-auto rounded-lg bg-white p-3 text-xs text-slate-800">{nextSnippet}</pre></div>
            </div>
          ) : null}
        </section>
      ) : null}
    </Card>
  );
}
