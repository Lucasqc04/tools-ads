'use client';

import { type AppLocale } from '@/lib/i18n/config';
import { FileAudio, FileText, Image as ImageIcon, Upload, Video, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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
  compact?: boolean;
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
  compactOpenLabel: string;
  compactCloseLabel: string;
  compactHint: string;
  addMoreHint: string;
  dropMoreHere: string;
  removeFile: (name: string) => string;
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
    compactOpenLabel: 'Mostrar upload completo',
    compactCloseLabel: 'Ocultar upload completo',
    compactHint: 'Clique para abrir a area de arrastar e soltar',
    addMoreHint: 'Clique ou arraste para adicionar mais',
    dropMoreHere: 'Solte para adicionar',
    removeFile: (name) => `Remover ${name}`,
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
    compactOpenLabel: 'Show full upload area',
    compactCloseLabel: 'Hide full upload area',
    compactHint: 'Click to expand drag-and-drop upload',
    addMoreHint: 'Click or drag to add more',
    dropMoreHere: 'Drop to add',
    removeFile: (name) => `Remove ${name}`,
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
    compactOpenLabel: 'Mostrar carga completa',
    compactCloseLabel: 'Ocultar carga completa',
    compactHint: 'Haz clic para abrir el area de arrastrar y soltar',
    addMoreHint: 'Haz clic o arrastra para agregar mas',
    dropMoreHere: 'Suelta para agregar',
    removeFile: (name) => `Quitar ${name}`,
  },
  zh: {
    dropFilesHere: (target) => `将${target}拖放到这里...`,
    dragFilesHere: (target) => `将${target}拖放到这里`,
    tapToSelect: '或点击选择文件',
    acceptedPrefix: '支持格式:',
    selectedFilesTitle: (count) => `已选择的文件(${count})`,
    rejectedFilesTitle: '被拒绝的文件:',
    singleFile: '单个文件',
    multipleFiles: '多个文件',
    maxPrefix: '最大',
    anyFiles: '个文件',
    images: '图片',
    videos: '视频',
    documents: '文档',
    compactOpenLabel: '展开完整上传区域',
    compactCloseLabel: '收起完整上传区域',
    compactHint: '点击展开拖放上传区域',
    addMoreHint: '点击或拖拽以添加更多文件',
    dropMoreHere: '拖放以添加',
    removeFile: (name) => `移除 ${name}`,
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

  if (file.type.startsWith('audio/')) {
    return FileAudio;
  }

  return FileText;
};

const getPreviewFileKey = (file: File, index: number): string =>
  `${file.name}-${file.size}-${file.lastModified}-${index}`;

const getPreviewKind = (file: File): 'image' | 'video' | 'audio' | 'file' => {
  if (file.type.startsWith('image/')) {
    return 'image';
  }

  if (file.type.startsWith('video/')) {
    return 'video';
  }

  if (file.type.startsWith('audio/')) {
    return 'audio';
  }

  return 'file';
};

const needsObjectUrlPreview = (file: File): boolean => {
  const kind = getPreviewKind(file);
  return kind === 'image' || kind === 'video' || kind === 'audio';
};

const getRejectionReason = (rejection: FileRejection): string =>
  rejection.errors.map((error) => error.message).join(', ');

export function FileUploadDropzone({
  label,
  onFilesSelected,
  accept,
  multiple = false,
  maxSize = DEFAULT_MAX_SIZE,
  selectedFiles,
  onRemoveFile,
  helperText,
  acceptedDescription,
  compact = false,
  locale = 'pt-br',
}: FileUploadDropzoneProps) {
  const ui = uiByLocale[locale];
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [recentFiles, setRecentFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});

  const acceptConfig = useMemo(() => buildDropzoneAccept(accept), [accept]);
  const acceptedText = useMemo(
    () =>
      acceptedDescription ?? getAcceptedDescription(accept, ui.anyFiles, ui),
    [accept, acceptedDescription, ui],
  );
  const previewFiles = selectedFiles ?? recentFiles;
  const previewGridClass =
    'grid w-full grid-cols-[repeat(auto-fill,minmax(7.25rem,8.5rem))] justify-center gap-2 sm:justify-start';

  useEffect(() => {
    const nextPreviewUrls: Record<string, string> = {};

    previewFiles.forEach((file, index) => {
      if (needsObjectUrlPreview(file)) {
        nextPreviewUrls[getPreviewFileKey(file, index)] = URL.createObjectURL(file);
      }
    });

    setPreviewUrls(nextPreviewUrls);

    return () => {
      Object.values(nextPreviewUrls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewFiles]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    accept: acceptConfig,
    multiple,
    maxSize,
    onDrop: (acceptedFiles) => {
      setRecentFiles(acceptedFiles);
      onFilesSelected(acceptedFiles);
    },
  });

  const keepExpandedBecauseOfFiles = previewFiles.length > 0 || fileRejections.length > 0;
  const showExpanded = !compact || isExpanded || keepExpandedBecauseOfFiles;
  const handleRemovePreviewFile = (index: number) => {
    if (onRemoveFile) {
      onRemoveFile(index);
      return;
    }

    setRecentFiles((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {helperText ? <p className="text-xs text-slate-600">{helperText}</p> : null}
      </div>

      {compact && !showExpanded ? (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="flex w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-4 py-3 text-left transition hover:border-brand-400 hover:bg-slate-50"
        >
          <span className="min-w-0">
            <span className="block text-sm font-medium text-slate-700">{ui.compactOpenLabel}</span>
            <span className="mt-0.5 block truncate text-xs text-slate-500">
              {ui.acceptedPrefix} {acceptedText} • {ui.maxPrefix} {formatMaxSize(maxSize)}
            </span>
            <span className="mt-0.5 block text-xs text-slate-500">{ui.compactHint}</span>
          </span>
          <Upload className="h-5 w-5 shrink-0 text-brand-600" />
        </button>
      ) : null}

      {showExpanded ? (
        <>
          {compact && !keepExpandedBecauseOfFiles ? (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-xs font-medium text-slate-500 transition hover:text-slate-700"
              >
                {ui.compactCloseLabel}
              </button>
            </div>
          ) : null}

          <div
            {...getRootProps()}
            className={`cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 ${
              isDragActive
                ? 'border-brand-500 bg-brand-50 scale-[1.01]'
                : 'border-slate-300 hover:border-brand-400 hover:bg-slate-50'
            } ${previewFiles.length ? 'p-4' : 'p-6 text-center'}`}
          >
            <input {...getInputProps()} />
            {previewFiles.length ? (
              <div className="w-full max-w-full">
                <div className="mb-3 flex flex-col gap-1 text-left sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-semibold text-slate-800">
                    {ui.selectedFilesTitle(previewFiles.length)}
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    {isDragActive ? ui.dropMoreHere : ui.addMoreHint}
                  </p>
                </div>
                <div className={previewGridClass}>
                  {previewFiles.map((file, index) => {
                    const FileIcon = getFileIcon(file);
                    const previewKey = getPreviewFileKey(file, index);
                    const previewUrl = previewUrls[previewKey];
                    const previewKind = getPreviewKind(file);

                    return (
                      <div
                        key={previewKey}
                        className="group relative aspect-square min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-900 text-left shadow-sm"
                      >
                        {previewKind === 'image' && previewUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={previewUrl}
                            alt={file.name}
                            className="h-full w-full object-cover"
                          />
                        ) : previewKind === 'video' && previewUrl ? (
                          <video
                            src={previewUrl}
                            muted
                            playsInline
                            preload="metadata"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-500">
                            <FileIcon className="h-8 w-8" />
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleRemovePreviewFile(index);
                          }}
                          className="absolute right-1.5 top-1.5 rounded-full bg-slate-950/75 p-1 text-white opacity-100 shadow-sm transition hover:bg-red-600 sm:opacity-0 sm:group-hover:opacity-100"
                          aria-label={ui.removeFile(file.name)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>

                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 via-slate-950/75 to-transparent p-2 pt-8 text-white">
                          <div className="flex min-w-0 items-center gap-1.5">
                            <FileIcon className="h-3.5 w-3.5 shrink-0 opacity-90" />
                            <p className="truncate text-xs font-semibold leading-4">
                              {file.name}
                            </p>
                          </div>
                          <p className="mt-0.5 text-[11px] leading-4 text-slate-300">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
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
                  {multiple ? ui.multipleFiles : ui.singleFile} • {ui.maxPrefix}{' '}
                  {formatMaxSize(maxSize)}
                </div>

                <p className="text-xs text-slate-500">
                  {ui.acceptedPrefix} {acceptedText}
                </p>
              </div>
            )}
          </div>
        </>
      ) : null}

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

    </div>
  );
}
