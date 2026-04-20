'use client';

import { type AppLocale } from '@/lib/i18n/config';
import { FileText, Image as ImageIcon, Upload, Video, X } from 'lucide-react';
import { useMemo } from 'react';
import { useDropzone, type Accept, type FileRejection } from 'react-dropzone';

type FileUploadDropzoneProps = Readonly<{
  label: string;
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  selectedFiles?: File[];
  onRemoveFile?: (index: number) => void;
  helperText?: string;
  acceptedDescription?: string;
  locale?: AppLocale;
}>;

type DropzoneUi = {
  dropFilesHere: (target: string) => string;
  dragFilesHere: (target: string) => string;
  tapToSelect: string;
  acceptedPrefix: string;
  selectedFilesTitle: (count: number) => string;
  rejectedFilesTitle: string;
  singleFile: string;
  multipleFiles: string;
  maxPrefix: string;
  anyFiles: string;
  images: string;
  videos: string;
  documents: string;
};

const uiByLocale: Record<AppLocale, DropzoneUi> = {
  'pt-br': {
    dropFilesHere: (target) => `Solte ${target} aqui...`,
    dragFilesHere: (target) => `Arraste e solte ${target} aqui`,
    tapToSelect: 'ou toque para selecionar arquivos',
    acceptedPrefix: 'Aceitos:',
    selectedFilesTitle: (count) => `Arquivos selecionados (${count})`,
    rejectedFilesTitle: 'Arquivos rejeitados:',
    singleFile: 'Um arquivo',
    multipleFiles: 'Multiplos arquivos',
    maxPrefix: 'Maximo',
    anyFiles: 'arquivos',
    images: 'imagens',
    videos: 'videos',
    documents: 'documentos',
  },
  en: {
    dropFilesHere: (target) => `Drop ${target} here...`,
    dragFilesHere: (target) => `Drag and drop ${target} here`,
    tapToSelect: 'or click to select files',
    acceptedPrefix: 'Accepted:',
    selectedFilesTitle: (count) => `Selected files (${count})`,
    rejectedFilesTitle: 'Rejected files:',
    singleFile: 'Single file',
    multipleFiles: 'Multiple files',
    maxPrefix: 'Max',
    anyFiles: 'files',
    images: 'images',
    videos: 'videos',
    documents: 'documents',
  },
  es: {
    dropFilesHere: (target) => `Suelta ${target} aqui...`,
    dragFilesHere: (target) => `Arrastra y suelta ${target} aqui`,
    tapToSelect: 'o haz clic para seleccionar archivos',
    acceptedPrefix: 'Aceptados:',
    selectedFilesTitle: (count) => `Archivos seleccionados (${count})`,
    rejectedFilesTitle: 'Archivos rechazados:',
    singleFile: 'Un archivo',
    multipleFiles: 'Multiples archivos',
    maxPrefix: 'Maximo',
    anyFiles: 'archivos',
    images: 'imagenes',
    videos: 'videos',
    documents: 'documentos',
  },
};

const DEFAULT_MAX_SIZE = 100 * 1024 * 1024;

const parseAcceptTokens = (accept: string | undefined): string[] => {
  if (!accept) {
    return [];
  }

  return accept
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
};

const buildDropzoneAccept = (accept: string | undefined): Accept | undefined => {
  const tokens = parseAcceptTokens(accept);

  if (!tokens.length) {
    return undefined;
  }

  const mapped: Accept = {};
  const extensionOnly: string[] = [];

  tokens.forEach((token) => {
    if (token.startsWith('.')) {
      extensionOnly.push(token);
      return;
    }

    if (token.includes('/')) {
      mapped[token] = mapped[token] ?? [];
    }
  });

  if (extensionOnly.length) {
    mapped['application/octet-stream'] = extensionOnly;
  }

  return Object.keys(mapped).length ? mapped : undefined;
};

const normalizeMimeSubtype = (value: string): string =>
  value
    .replace('x-', '')
    .replace('vnd.', '')
    .replace('application/', '')
    .toUpperCase();

const getAcceptedDescription = (
  accept: string | undefined,
  fallback: string,
  ui: DropzoneUi,
): string => {
  const tokens = parseAcceptTokens(accept);

  if (!tokens.length) {
    return fallback;
  }

  const labels = new Set<string>();

  tokens.forEach((token) => {
    if (token === 'image/*') {
      labels.add(ui.images);
      return;
    }

    if (token === 'video/*') {
      labels.add(ui.videos);
      return;
    }

    if (token === 'application/pdf') {
      labels.add('PDF');
      return;
    }

    if (token.endsWith('/*')) {
      labels.add(ui.documents);
      return;
    }

    if (token.startsWith('.')) {
      labels.add(token.toUpperCase());
      return;
    }

    if (token.includes('/')) {
      const subtype = token.split('/')[1] ?? token;
      labels.add(normalizeMimeSubtype(subtype));
    }
  });

  return labels.size ? Array.from(labels).join(', ') : fallback;
};

const formatMaxSize = (maxSize: number): string => {
  const megabytes = maxSize / (1024 * 1024);

  if (megabytes >= 100) {
    return '100MB';
  }

  if (megabytes >= 50) {
    return '50MB';
  }

  if (megabytes >= 1) {
    return `${Math.round(megabytes)}MB`;
  }

  return `${Math.round(maxSize / 1024)}KB`;
};

const formatFileSize = (size: number): string => {
  if (size >= 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(2)} MB`;
  }

  if (size >= 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${size} B`;
};

const getFileIcon = (file: File) => {
  if (file.type.startsWith('image/')) {
    return ImageIcon;
  }

  if (file.type.startsWith('video/')) {
    return Video;
  }

  return FileText;
};

const getRejectionReason = (rejection: FileRejection): string =>
  rejection.errors.map((error) => error.message).join(', ');

export function FileUploadDropzone({
  label,
  onFilesSelected,
  accept,
  multiple = false,
  maxSize = DEFAULT_MAX_SIZE,
  selectedFiles = [],
  onRemoveFile,
  helperText,
  acceptedDescription,
  locale = 'pt-br',
}: FileUploadDropzoneProps) {
  const ui = uiByLocale[locale];

  const acceptConfig = useMemo(() => buildDropzoneAccept(accept), [accept]);
  const acceptedText = useMemo(
    () =>
      acceptedDescription ?? getAcceptedDescription(accept, ui.anyFiles, ui),
    [accept, acceptedDescription, ui],
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    accept: acceptConfig,
    multiple,
    maxSize,
    onDrop: (acceptedFiles) => {
      onFilesSelected(acceptedFiles);
    },
  });

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {helperText ? <p className="text-xs text-slate-600">{helperText}</p> : null}
      </div>

      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all duration-200 ${
          isDragActive
            ? 'border-brand-500 bg-brand-50 scale-[1.01]'
            : 'border-slate-300 hover:border-brand-400 hover:bg-slate-50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-full bg-gradient-to-r from-brand-600 to-cyan-600 p-3">
            <Upload className="h-6 w-6 text-white" />
          </div>

          <div>
            <p className="text-base font-medium text-slate-700">
              {isDragActive
                ? ui.dropFilesHere(acceptedText)
                : ui.dragFilesHere(acceptedText)}
            </p>
            <p className="mt-1 text-sm text-slate-500">{ui.tapToSelect}</p>
          </div>

          <div className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
            {multiple ? ui.multipleFiles : ui.singleFile} • {ui.maxPrefix} {formatMaxSize(maxSize)}
          </div>

          <p className="text-xs text-slate-500">
            {ui.acceptedPrefix} {acceptedText}
          </p>
        </div>
      </div>

      {fileRejections.length ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm font-medium text-red-800">{ui.rejectedFilesTitle}</p>
          <div className="mt-1 space-y-1 text-xs text-red-700">
            {fileRejections.map((rejection) => (
              <p key={`${rejection.file.name}-${rejection.file.size}`}>
                {rejection.file.name}: {getRejectionReason(rejection)}
              </p>
            ))}
          </div>
        </div>
      ) : null}

      {selectedFiles.length ? (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-700">{ui.selectedFilesTitle(selectedFiles.length)}</p>
          <div className="grid gap-2">
            {selectedFiles.map((file, index) => {
              const FileIcon = getFileIcon(file);

              return (
                <div
                  key={`${file.name}-${file.size}-${index}`}
                  className="flex items-center justify-between rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <FileIcon className="h-4 w-4 shrink-0 text-slate-500" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-700">{file.name}</p>
                        <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                  </div>

                  {onRemoveFile ? (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onRemoveFile(index);
                      }}
                      className="ml-2 rounded-full p-1 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
