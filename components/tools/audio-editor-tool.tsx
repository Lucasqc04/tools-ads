'use client';

import {
  Download,
  FileAudio,
  Film,
  Link2,
  Loader2,
  Pause,
  Play,
  Scissors,
  Split,
  Trash2,
  Wand2,
} from 'lucide-react';
import {
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FileUploadDropzone } from '@/components/shared/file-upload-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  audioExportFormats,
  buildAudioOutputName,
  createAudioWaveform,
  exportAudioSegment,
  extractAudioTracksFromMedia,
  readAudioMetadata,
  sanitizeAudioFileBaseName,
  type AudioExportFormat,
  type AudioWaveformData,
} from '@/lib/audio-editor';
import { formatBytes } from '@/lib/file-size';
import { downloadBlob } from '@/lib/image-conversion';
import { type AppLocale } from '@/lib/i18n/config';
import { trackEvent, TOOL_ID } from '@/lib/analytics';

type AudioEditorToolProps = Readonly<{
  locale?: AppLocale;
}>;

type MediaQueueStatus = 'pending' | 'extracting' | 'done' | 'error';
type SegmentStatus = 'idle' | 'exporting' | 'done' | 'error';

type PendingMediaItem = {
  id: string;
  file: File;
  status: MediaQueueStatus;
  progressPercent: number;
  logs: string[];
  errorMessage?: string;
};

type AudioSegment = {
  id: string;
  name: string;
  start: number;
  end: number;
  color: string;
  status: SegmentStatus;
  progressPercent: number;
  resultFile?: File;
  resultUrl?: string;
  errorMessage?: string;
};

type AudioTrack = {
  id: string;
  name: string;
  sourceName: string;
  file: File;
  objectUrl: string;
  duration: number;
  waveform?: AudioWaveformData;
  waveformError?: string;
  selectionStart: number;
  selectionEnd: number;
  selectedSegmentId?: string;
  segments: AudioSegment[];
};

type WaveformDragState =
  | {
      mode: 'new-selection';
      anchorTime: number;
    }
  | {
      mode: 'move-segment' | 'resize-start' | 'resize-end';
      anchorTime: number;
      segmentId: string;
      originalStart: number;
      originalEnd: number;
    };

type AudioEditorUi = {
  title: string;
  intro: string;
  uploadLabel: string;
  uploadHint: string;
  acceptedDescription: string;
  remoteUrlLabel: string;
  remoteUrlPlaceholder: string;
  remoteUrlButton: string;
  remoteUrlHint: string;
  remoteUrlLoading: string;
  remoteUrlInvalid: string;
  remoteUrlUnsupported: string;
  remoteUrlFetchError: string;
  remoteUrlMediaTypeError: string;
  remoteUrlTooLarge: string;
  outputFormat: string;
  bitrate: string;
  splitStreams: string;
  splitStreamsHint: string;
  importBusy: string;
  extractAll: string;
  extractAudio: string;
  extracting: string;
  queueTitle: string;
  trackListTitle: string;
  noTracks: string;
  noQueue: string;
  sourceLabel: string;
  sizeLabel: string;
  durationLabel: string;
  waveformTitle: string;
  selectionTitle: string;
  start: string;
  end: string;
  cursor: string;
  playSelection: string;
  playSegment: string;
  pause: string;
  loop: string;
  addCut: string;
  applyCut: string;
  splitAtCursor: string;
  exportSelected: string;
  exportAll: string;
  downloadReady: string;
  downloadTrack: string;
  segmentsTitle: string;
  renamePlaceholder: string;
  statusIdle: string;
  statusExporting: string;
  statusDone: string;
  statusError: string;
  trackName: string;
  removeTrack: string;
  selectTrack: string;
  loadSegment: string;
  removeSegment: string;
  privacyNote: string;
  ffmpegNote: string;
  waveformFallback: string;
  genericImportError: string;
  genericExportError: string;
  createdFromVideo: (count: number) => string;
  segmentName: (count: number) => string;
  splitPartName: (baseName: string, part: number) => string;
};

const uiByLocale: Record<AppLocale, AudioEditorUi> = {
  'pt-br': {
    title: 'Editor de audio e extrator de audio de video',
    intro:
      'Extraia audio de videos, importe arquivos de audio, marque cortes na onda sonora e baixe cada trecho separado.',
    uploadLabel: 'Videos ou audios para editar',
    uploadHint:
      'Aceita videos comuns, WebM, MKV, MOV, GIF/WebP animado quando o FFmpeg conseguir ler, e audios como MP3, WAV, M4A, OGG e FLAC.',
    acceptedDescription: 'audio, video, webp, gif, mp3, wav, m4a, ogg, flac',
    remoteUrlLabel: 'Importar por URL direta',
    remoteUrlPlaceholder: 'https://exemplo.com/audio.mp3 ou video.mp4',
    remoteUrlButton: 'Importar URL',
    remoteUrlHint:
      'Use links diretos de arquivos de audio ou video. YouTube, X/Twitter e Facebook devem ser importados como arquivo local autorizado.',
    remoteUrlLoading: 'Importando URL...',
    remoteUrlInvalid: 'Informe uma URL http ou https valida.',
    remoteUrlUnsupported:
      'Esta ferramenta nao baixa videos diretamente de YouTube, X/Twitter ou Facebook. Baixe/obtenha o arquivo com permissao e importe aqui.',
    remoteUrlFetchError:
      'Nao foi possivel acessar essa URL. O servidor pode bloquear CORS, exigir login ou nao permitir download direto.',
    remoteUrlMediaTypeError: 'A URL nao parece apontar para um arquivo direto de audio ou video.',
    remoteUrlTooLarge: 'O arquivo remoto e grande demais para importar pelo navegador.',
    outputFormat: 'Formato de saida',
    bitrate: 'Qualidade',
    splitStreams: 'Tentar separar faixas internas de audio',
    splitStreamsHint:
      'Use quando o video pode ter narracao, microfone, jogo ou trilha em streams diferentes.',
    importBusy: 'Analisando audio...',
    extractAll: 'Extrair todos os videos',
    extractAudio: 'Extrair audio',
    extracting: 'Extraindo...',
    queueTitle: 'Fila de videos e midias',
    trackListTitle: 'Faixas de audio',
    noTracks: 'Importe audio direto ou extraia audio de um video para abrir o editor.',
    noQueue: 'Nenhum video aguardando extracao.',
    sourceLabel: 'Origem',
    sizeLabel: 'Tamanho',
    durationLabel: 'Duracao',
    waveformTitle: 'Waveform e selecao',
    selectionTitle: 'Selecao atual',
    start: 'Inicio',
    end: 'Fim',
    cursor: 'Cursor',
    playSelection: 'Ouvir selecao',
    playSegment: 'Ouvir trecho',
    pause: 'Pausar',
    loop: 'Loop',
    addCut: 'Criar corte',
    applyCut: 'Aplicar selecao',
    splitAtCursor: 'Dividir no cursor',
    exportSelected: 'Exportar corte selecionado',
    exportAll: 'Exportar todos os cortes',
    downloadReady: 'Baixar prontos',
    downloadTrack: 'Baixar faixa inteira',
    segmentsTitle: 'Cortes separados',
    renamePlaceholder: 'nome-do-audio',
    statusIdle: 'Nao exportado',
    statusExporting: 'Exportando',
    statusDone: 'Pronto',
    statusError: 'Erro',
    trackName: 'Nome da faixa',
    removeTrack: 'Remover faixa',
    selectTrack: 'Editar faixa',
    loadSegment: 'Selecionar',
    removeSegment: 'Remover',
    privacyNote:
      'O corte, preview e exportacao rodam no navegador. Seus arquivos nao sao enviados automaticamente para servidor por esta ferramenta.',
    ffmpegNote:
      'No primeiro uso, o FFmpeg pode demorar mais para carregar. Arquivos muito grandes exigem mais memoria do navegador.',
    waveformFallback:
      'Nao foi possivel decodificar a onda deste arquivo, mas voce ainda pode usar os tempos e exportar com FFmpeg.',
    genericImportError: 'Nao foi possivel carregar este audio.',
    genericExportError: 'Nao foi possivel exportar este trecho.',
    createdFromVideo: (count) =>
      count === 1 ? '1 faixa de audio criada.' : `${count} faixas de audio criadas.`,
    segmentName: (count) => `corte-${count}`,
    splitPartName: (baseName, part) => `${baseName}-parte-${part}`,
  },
  en: {
    title: 'Audio editor and video audio extractor',
    intro:
      'Extract audio from videos, import audio files, mark cuts on the waveform, and download each clip separately.',
    uploadLabel: 'Videos or audio files to edit',
    uploadHint:
      'Supports common videos, WebM, MKV, MOV, animated GIF/WebP when FFmpeg can read it, and audio such as MP3, WAV, M4A, OGG, and FLAC.',
    acceptedDescription: 'audio, video, webp, gif, mp3, wav, m4a, ogg, flac',
    remoteUrlLabel: 'Import from direct URL',
    remoteUrlPlaceholder: 'https://example.com/audio.mp3 or video.mp4',
    remoteUrlButton: 'Import URL',
    remoteUrlHint:
      'Use direct audio or video file links. YouTube, X/Twitter, and Facebook should be imported as an authorized local file.',
    remoteUrlLoading: 'Importing URL...',
    remoteUrlInvalid: 'Enter a valid http or https URL.',
    remoteUrlUnsupported:
      'This tool does not download videos directly from YouTube, X/Twitter, or Facebook. Get the file with permission and import it here.',
    remoteUrlFetchError:
      'Could not access this URL. The server may block CORS, require login, or disallow direct downloads.',
    remoteUrlMediaTypeError: 'The URL does not look like a direct audio or video file.',
    remoteUrlTooLarge: 'The remote file is too large to import in the browser.',
    outputFormat: 'Output format',
    bitrate: 'Quality',
    splitStreams: 'Try to split internal audio streams',
    splitStreamsHint:
      'Use this when the video may contain voice, microphone, game audio, or soundtrack in separate streams.',
    importBusy: 'Analyzing audio...',
    extractAll: 'Extract all videos',
    extractAudio: 'Extract audio',
    extracting: 'Extracting...',
    queueTitle: 'Video and media queue',
    trackListTitle: 'Audio tracks',
    noTracks: 'Import audio directly or extract audio from a video to open the editor.',
    noQueue: 'No video waiting for extraction.',
    sourceLabel: 'Source',
    sizeLabel: 'Size',
    durationLabel: 'Duration',
    waveformTitle: 'Waveform and selection',
    selectionTitle: 'Current selection',
    start: 'Start',
    end: 'End',
    cursor: 'Cursor',
    playSelection: 'Play selection',
    playSegment: 'Play clip',
    pause: 'Pause',
    loop: 'Loop',
    addCut: 'Create cut',
    applyCut: 'Apply selection',
    splitAtCursor: 'Split at cursor',
    exportSelected: 'Export selected cut',
    exportAll: 'Export all cuts',
    downloadReady: 'Download ready',
    downloadTrack: 'Download full track',
    segmentsTitle: 'Separated cuts',
    renamePlaceholder: 'audio-name',
    statusIdle: 'Not exported',
    statusExporting: 'Exporting',
    statusDone: 'Ready',
    statusError: 'Error',
    trackName: 'Track name',
    removeTrack: 'Remove track',
    selectTrack: 'Edit track',
    loadSegment: 'Select',
    removeSegment: 'Remove',
    privacyNote:
      'Cutting, preview, and export run in the browser. Your files are not automatically uploaded to a server by this tool.',
    ffmpegNote:
      'On first use, FFmpeg may take longer to load. Very large files need more browser memory.',
    waveformFallback:
      'The waveform could not be decoded for this file, but you can still use times and export with FFmpeg.',
    genericImportError: 'Could not load this audio.',
    genericExportError: 'Could not export this clip.',
    createdFromVideo: (count) =>
      count === 1 ? '1 audio track created.' : `${count} audio tracks created.`,
    segmentName: (count) => `clip-${count}`,
    splitPartName: (baseName, part) => `${baseName}-part-${part}`,
  },
  es: {
    title: 'Editor de audio y extractor de audio de video',
    intro:
      'Extrae audio de videos, importa archivos de audio, marca cortes en la onda y descarga cada clip por separado.',
    uploadLabel: 'Videos o audios para editar',
    uploadHint:
      'Acepta videos comunes, WebM, MKV, MOV, GIF/WebP animado cuando FFmpeg pueda leerlo, y audios como MP3, WAV, M4A, OGG y FLAC.',
    acceptedDescription: 'audio, video, webp, gif, mp3, wav, m4a, ogg, flac',
    remoteUrlLabel: 'Importar desde URL directa',
    remoteUrlPlaceholder: 'https://ejemplo.com/audio.mp3 o video.mp4',
    remoteUrlButton: 'Importar URL',
    remoteUrlHint:
      'Usa enlaces directos a archivos de audio o video. YouTube, X/Twitter y Facebook deben importarse como archivo local autorizado.',
    remoteUrlLoading: 'Importando URL...',
    remoteUrlInvalid: 'Ingresa una URL http o https valida.',
    remoteUrlUnsupported:
      'Esta herramienta no descarga videos directamente de YouTube, X/Twitter o Facebook. Obten el archivo con permiso e importalo aqui.',
    remoteUrlFetchError:
      'No fue posible acceder a esa URL. El servidor puede bloquear CORS, exigir login o no permitir descarga directa.',
    remoteUrlMediaTypeError: 'La URL no parece apuntar a un archivo directo de audio o video.',
    remoteUrlTooLarge: 'El archivo remoto es demasiado grande para importarlo en el navegador.',
    outputFormat: 'Formato de salida',
    bitrate: 'Calidad',
    splitStreams: 'Intentar separar pistas internas de audio',
    splitStreamsHint:
      'Usalo cuando el video puede tener voz, microfono, juego o musica en streams separadas.',
    importBusy: 'Analizando audio...',
    extractAll: 'Extraer todos los videos',
    extractAudio: 'Extraer audio',
    extracting: 'Extrayendo...',
    queueTitle: 'Cola de videos y medios',
    trackListTitle: 'Pistas de audio',
    noTracks: 'Importa audio directo o extrae audio de un video para abrir el editor.',
    noQueue: 'No hay video esperando extraccion.',
    sourceLabel: 'Origen',
    sizeLabel: 'Tamano',
    durationLabel: 'Duracion',
    waveformTitle: 'Onda y seleccion',
    selectionTitle: 'Seleccion actual',
    start: 'Inicio',
    end: 'Fin',
    cursor: 'Cursor',
    playSelection: 'Escuchar seleccion',
    playSegment: 'Escuchar clip',
    pause: 'Pausar',
    loop: 'Loop',
    addCut: 'Crear corte',
    applyCut: 'Aplicar seleccion',
    splitAtCursor: 'Dividir en cursor',
    exportSelected: 'Exportar corte seleccionado',
    exportAll: 'Exportar todos los cortes',
    downloadReady: 'Descargar listos',
    downloadTrack: 'Descargar pista completa',
    segmentsTitle: 'Cortes separados',
    renamePlaceholder: 'nombre-del-audio',
    statusIdle: 'No exportado',
    statusExporting: 'Exportando',
    statusDone: 'Listo',
    statusError: 'Error',
    trackName: 'Nombre de la pista',
    removeTrack: 'Quitar pista',
    selectTrack: 'Editar pista',
    loadSegment: 'Seleccionar',
    removeSegment: 'Quitar',
    privacyNote:
      'El corte, preview y exportacion corren en el navegador. Tus archivos no se suben automaticamente a servidor por esta herramienta.',
    ffmpegNote:
      'En el primer uso, FFmpeg puede tardar mas en cargar. Los archivos muy grandes necesitan mas memoria del navegador.',
    waveformFallback:
      'No fue posible decodificar la onda de este archivo, pero aun puedes usar los tiempos y exportar con FFmpeg.',
    genericImportError: 'No fue posible cargar este audio.',
    genericExportError: 'No fue posible exportar este clip.',
    createdFromVideo: (count) =>
      count === 1 ? '1 pista de audio creada.' : `${count} pistas de audio creadas.`,
    segmentName: (count) => `corte-${count}`,
    splitPartName: (baseName, part) => `${baseName}-parte-${part}`,
  },
};

const acceptedMediaTypes = [
  'audio/*',
  'video/*',
  'image/webp',
  'image/gif',
  '.mp4',
  '.mov',
  '.m4v',
  '.webm',
  '.mkv',
  '.avi',
  '.wmv',
  '.flv',
  '.mpeg',
  '.mpg',
  '.3gp',
  '.ogv',
  '.ts',
  '.webp',
  '.gif',
  '.mp3',
  '.wav',
  '.m4a',
  '.aac',
  '.ogg',
  '.opus',
  '.flac',
  '.aiff',
  '.aif',
  '.wma',
].join(',');

const audioExtensions = new Set([
  'mp3',
  'wav',
  'm4a',
  'aac',
  'ogg',
  'opus',
  'flac',
  'aiff',
  'aif',
  'wma',
]);

const remoteMediaExtensions = new Set([
  ...audioExtensions,
  'mp4',
  'mov',
  'm4v',
  'webm',
  'mkv',
  'avi',
  'wmv',
  'flv',
  'mpeg',
  'mpg',
  '3gp',
  'ogv',
  'ts',
  'webp',
  'gif',
]);

const blockedRemoteUrlHosts = [
  'youtube.com',
  'youtu.be',
  'twitter.com',
  'x.com',
  'facebook.com',
  'fb.watch',
];

const remoteImportMaxBytes = 100 * 1024 * 1024;

const fileExtensionByMime = new Map([
  ['audio/mpeg', 'mp3'],
  ['audio/mp3', 'mp3'],
  ['audio/wav', 'wav'],
  ['audio/x-wav', 'wav'],
  ['audio/mp4', 'm4a'],
  ['audio/aac', 'aac'],
  ['audio/ogg', 'ogg'],
  ['audio/opus', 'opus'],
  ['audio/flac', 'flac'],
  ['video/mp4', 'mp4'],
  ['video/quicktime', 'mov'],
  ['video/webm', 'webm'],
  ['video/x-matroska', 'mkv'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
]);

const segmentColors = ['#2563eb', '#0f766e', '#c2410c', '#7c3aed', '#be123c', '#047857'];
const MIN_SEGMENT_SECONDS = 0.005;
const CLICK_SEEK_THRESHOLD_SECONDS = 0.01;
const NEW_SELECTION_CLICK_THRESHOLD_SECONDS = 0.015;
const HANDLE_HIT_WIDTH = 14;

const buildId = (prefix: string): string =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const getFileExtension = (fileName: string): string =>
  fileName.split('.').pop()?.toLowerCase() ?? '';

const isLikelyAudioFile = (file: File): boolean =>
  file.type.startsWith('audio/') || audioExtensions.has(getFileExtension(file.name));

const hasKnownRemoteMediaExtension = (url: URL): boolean =>
  remoteMediaExtensions.has(getFileExtension(url.pathname));

const isAllowedRemoteMediaType = (contentType: string): boolean => {
  const normalizedType = contentType.split(';')[0]?.trim().toLowerCase() ?? '';
  return (
    normalizedType.startsWith('audio/') ||
    normalizedType.startsWith('video/') ||
    normalizedType === 'image/webp' ||
    normalizedType === 'image/gif' ||
    normalizedType === 'application/octet-stream'
  );
};

const isBlockedRemoteUrl = (url: URL): boolean => {
  const host = url.hostname.toLowerCase().replace(/^www\./, '').replace(/^m\./, '');
  return blockedRemoteUrlHosts.some((blockedHost) => host === blockedHost || host.endsWith(`.${blockedHost}`));
};

const sanitizeRemoteFileName = (value: string): string =>
  value
    .trim()
    .replaceAll(/[^\w.-]+/g, '-')
    .replaceAll(/-+/g, '-')
    .replaceAll(/^-|-$/g, '')
    .slice(0, 90);

const buildRemoteFileName = (url: URL, contentType: string): string => {
  const pathName = decodeURIComponent(url.pathname.split('/').filter(Boolean).pop() ?? '');
  const normalizedType = contentType.split(';')[0]?.trim().toLowerCase() ?? '';
  const fallbackExtension = fileExtensionByMime.get(normalizedType) ?? 'bin';
  const sanitizedPathName = sanitizeRemoteFileName(pathName);

  if (sanitizedPathName && /\.[a-z0-9]{2,6}$/i.test(sanitizedPathName)) {
    return sanitizedPathName;
  }

  const baseName = sanitizedPathName || 'midia-remota';
  return `${baseName}.${fallbackExtension}`;
};

const getFileKey = (file: File): string => `${file.name}-${file.size}-${file.lastModified}`;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const formatDuration = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return '0:00';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  const millis = Math.round((seconds % 1) * 1000)
    .toString()
    .padStart(3, '0');

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${rest}.${millis}`;
  }

  return `${minutes}:${rest}.${millis}`;
};

const normalizeRange = (
  start: number,
  end: number,
  duration: number,
): { start: number; end: number } => {
  const safeDuration = Math.max(0, duration);
  const normalizedStart = clamp(Math.min(start, end), 0, safeDuration);
  const normalizedEnd = clamp(Math.max(start, end), 0, safeDuration);
  const minRange = Math.min(MIN_SEGMENT_SECONDS, safeDuration);

  if (safeDuration <= 0 || normalizedEnd - normalizedStart >= minRange) {
    return { start: normalizedStart, end: normalizedEnd };
  }

  if (normalizedStart + minRange <= safeDuration) {
    return {
      start: normalizedStart,
      end: normalizedStart + minRange,
    };
  }

  return {
    start: Math.max(0, safeDuration - minRange),
    end: safeDuration,
  };
};

const getSegmentStatusLabel = (ui: AudioEditorUi, status: SegmentStatus): string => {
  if (status === 'done') {
    return ui.statusDone;
  }

  if (status === 'error') {
    return ui.statusError;
  }

  if (status === 'exporting') {
    return ui.statusExporting;
  }

  return ui.statusIdle;
};

const getSegmentStatusClass = (status: SegmentStatus): string => {
  if (status === 'done') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  }

  if (status === 'error') {
    return 'border-red-200 bg-red-50 text-red-700';
  }

  if (status === 'exporting') {
    return 'border-amber-200 bg-amber-50 text-amber-700';
  }

  return 'border-slate-200 bg-slate-100 text-slate-700';
};

function WaveformCanvas({
  track,
  cursorTime,
  selectedSegmentId,
  onSelectRange,
  onSeek,
  onSelectSegment,
  onChangeSegmentRange,
}: {
  track: AudioTrack;
  cursorTime: number;
  selectedSegmentId?: string;
  onSelectRange: (start: number, end: number) => void;
  onSeek: (time: number) => void;
  onSelectSegment: (segmentId: string) => void;
  onChangeSegmentRange: (segmentId: string, start: number, end: number) => void;
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dragStateRef = useRef<WaveformDragState | null>(null);
  const [size, setSize] = useState({ width: 1, height: 220 });

  useEffect(() => {
    const target = wrapperRef.current;
    if (!target) {
      return undefined;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }

      setSize({
        width: Math.max(1, Math.floor(entry.contentRect.width)),
        height: 220,
      });
    });

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(size.width * ratio);
    canvas.height = Math.floor(size.height * ratio);
    canvas.style.width = '100%';
    canvas.style.height = `${size.height}px`;

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, size.width, size.height);

    const gradient = context.createLinearGradient(0, 0, size.width, size.height);
    gradient.addColorStop(0, '#f8fafc');
    gradient.addColorStop(1, '#eef2ff');
    context.fillStyle = gradient;
    context.fillRect(0, 0, size.width, size.height);

    const duration = Math.max(track.duration, 0.001);
    const centerY = size.height / 2;
    const usableHeight = size.height - 54;
    const peaks = track.waveform?.peaks ?? [];

    track.segments.forEach((segment) => {
      const x = (segment.start / duration) * size.width;
      const width = Math.max(1, ((segment.end - segment.start) / duration) * size.width);
      const isSelected = segment.id === selectedSegmentId;

      context.fillStyle = isSelected ? `${segment.color}2e` : `${segment.color}18`;
      context.fillRect(x, 0, width, size.height);
      context.fillStyle = segment.color;
      context.fillRect(x, 0, Math.max(2, Math.min(4, width)), size.height);
      context.fillRect(x + width - Math.max(2, Math.min(4, width)), 0, Math.max(2, Math.min(4, width)), size.height);

      if (isSelected) {
        context.strokeStyle = segment.color;
        context.lineWidth = 2;
        context.strokeRect(x + 1, 2, Math.max(1, width - 2), size.height - 4);

        const handleWidth = 8;
        context.fillStyle = '#ffffff';
        context.strokeStyle = segment.color;
        context.lineWidth = 2;
        context.beginPath();
        context.roundRect(x - handleWidth / 2, centerY - 26, handleWidth, 52, 4);
        context.roundRect(x + width - handleWidth / 2, centerY - 26, handleWidth, 52, 4);
        context.fill();
        context.stroke();
      }
    });

    const selectionX = (track.selectionStart / duration) * size.width;
    const selectionWidth = Math.max(
      1,
      ((track.selectionEnd - track.selectionStart) / duration) * size.width,
    );
    context.fillStyle = 'rgba(37, 99, 235, 0.16)';
    context.fillRect(selectionX, 0, selectionWidth, size.height);
    context.strokeStyle = 'rgba(37, 99, 235, 0.72)';
    context.lineWidth = 2;
    context.strokeRect(selectionX, 1, selectionWidth, size.height - 2);

    context.strokeStyle = '#cbd5e1';
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(0, centerY);
    context.lineTo(size.width, centerY);
    context.stroke();

    if (peaks.length) {
      const barWidth = Math.max(1, size.width / peaks.length);
      context.fillStyle = '#0f172a';

      peaks.forEach((peak, index) => {
        const barHeight = Math.max(1, peak * usableHeight);
        const x = index * barWidth;
        const y = centerY - barHeight / 2;
        context.fillRect(x, y, Math.max(1, barWidth * 0.72), barHeight);
      });
    } else {
      context.strokeStyle = '#64748b';
      context.setLineDash([6, 6]);
      context.beginPath();
      context.moveTo(16, centerY - 28);
      context.lineTo(size.width - 16, centerY + 28);
      context.stroke();
      context.setLineDash([]);
    }

    const cursorX = (clamp(cursorTime, 0, duration) / duration) * size.width;
    context.strokeStyle = '#dc2626';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(cursorX, 0);
    context.lineTo(cursorX, size.height);
    context.stroke();

    context.fillStyle = '#334155';
    context.font = '12px sans-serif';
    context.fillText(formatDuration(track.selectionStart), Math.max(8, selectionX + 6), 18);
    context.fillText(
      formatDuration(track.selectionEnd),
      Math.min(size.width - 82, selectionX + selectionWidth - 78),
      size.height - 10,
    );
  }, [cursorTime, selectedSegmentId, size.height, size.width, track]);

  const getPointerPosition = (
    event: ReactPointerEvent<HTMLCanvasElement>,
  ): { x: number; time: number } => {
    const canvas = canvasRef.current;
    if (!canvas || track.duration <= 0) {
      return { x: 0, time: 0 };
    }

    const rect = canvas.getBoundingClientRect();
    const ratio = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    return {
      x: ratio * size.width,
      time: ratio * track.duration,
    };
  };

  const getSegmentHit = (
    x: number,
    time: number,
  ):
    | {
        mode: 'move-segment' | 'resize-start' | 'resize-end';
        segment: AudioSegment;
      }
    | null => {
    const duration = Math.max(track.duration, 0.001);
    const selectedSegment = track.segments.find((segment) => segment.id === selectedSegmentId);

    if (selectedSegment) {
      const startX = (selectedSegment.start / duration) * size.width;
      const endX = (selectedSegment.end / duration) * size.width;
      const startDistance = Math.abs(x - startX);
      const endDistance = Math.abs(x - endX);

      if (startDistance <= HANDLE_HIT_WIDTH && endDistance <= HANDLE_HIT_WIDTH) {
        return {
          mode: endDistance < startDistance ? 'resize-end' : 'resize-start',
          segment: selectedSegment,
        };
      }

      if (startDistance <= HANDLE_HIT_WIDTH) {
        return { mode: 'resize-start', segment: selectedSegment };
      }

      if (endDistance <= HANDLE_HIT_WIDTH) {
        return { mode: 'resize-end', segment: selectedSegment };
      }
    }

    const hitSegment = track.segments
      .slice()
      .reverse()
      .find((segment) => time >= segment.start && time <= segment.end);

    return hitSegment ? { mode: 'move-segment', segment: hitSegment } : null;
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const { x, time } = getPointerPosition(event);
    const hit = getSegmentHit(x, time);

    if (hit) {
      onSelectSegment(hit.segment.id);
      dragStateRef.current = {
        mode: hit.mode,
        anchorTime: time,
        segmentId: hit.segment.id,
        originalStart: hit.segment.start,
        originalEnd: hit.segment.end,
      };
    } else {
      dragStateRef.current = {
        mode: 'new-selection',
        anchorTime: time,
      };
    }

    onSeek(time);
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Synthetic pointer events in tests may not have an active pointer capture target.
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState) {
      return;
    }

    const { time } = getPointerPosition(event);

    if (dragState.mode === 'new-selection') {
      const range = normalizeRange(dragState.anchorTime, time, track.duration);
      onSelectRange(range.start, range.end);
      return;
    }

    if (dragState.mode === 'move-segment') {
      const length = dragState.originalEnd - dragState.originalStart;
      const start = clamp(
        dragState.originalStart + (time - dragState.anchorTime),
        0,
        Math.max(0, track.duration - length),
      );
      onChangeSegmentRange(dragState.segmentId, start, start + length);
      return;
    }

    if (dragState.mode === 'resize-start') {
      const start = clamp(time, 0, dragState.originalEnd - MIN_SEGMENT_SECONDS);
      onChangeSegmentRange(dragState.segmentId, start, dragState.originalEnd);
      return;
    }

    const end = clamp(time, dragState.originalStart + MIN_SEGMENT_SECONDS, track.duration);
    onChangeSegmentRange(dragState.segmentId, dragState.originalStart, end);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState) {
      return;
    }

    const { time } = getPointerPosition(event);
    const diff = Math.abs(time - dragState.anchorTime);

    if (dragState.mode === 'new-selection') {
      if (diff < NEW_SELECTION_CLICK_THRESHOLD_SECONDS) {
        onSeek(time);
      } else {
        const range = normalizeRange(dragState.anchorTime, time, track.duration);
        onSelectRange(range.start, range.end);
      }
    } else if (dragState.mode === 'move-segment' && diff < CLICK_SEEK_THRESHOLD_SECONDS) {
      onSeek(time);
    } else if (dragState.mode === 'move-segment') {
      const length = dragState.originalEnd - dragState.originalStart;
      const start = clamp(
        dragState.originalStart + (time - dragState.anchorTime),
        0,
        Math.max(0, track.duration - length),
      );
      onChangeSegmentRange(dragState.segmentId, start, start + length);
    } else if (dragState.mode === 'resize-start') {
      const start = clamp(time, 0, dragState.originalEnd - MIN_SEGMENT_SECONDS);
      onSelectRange(start, dragState.originalEnd);
      onChangeSegmentRange(dragState.segmentId, start, dragState.originalEnd);
    } else {
      const end = clamp(time, dragState.originalStart + MIN_SEGMENT_SECONDS, track.duration);
      onSelectRange(dragState.originalStart, end);
      onChangeSegmentRange(dragState.segmentId, dragState.originalStart, end);
    }

    dragStateRef.current = null;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // Synthetic pointer events in tests may not have an active pointer capture target.
    }
  };

  return (
    <div ref={wrapperRef} className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Audio waveform"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          dragStateRef.current = null;
        }}
        className="block w-full cursor-ew-resize touch-none"
      />
    </div>
  );
}

export function AudioEditorTool({ locale = 'pt-br' }: AudioEditorToolProps) {
  const ui = uiByLocale[locale];
  const [selectedUploadFiles, setSelectedUploadFiles] = useState<File[]>([]);
  const [pendingMedia, setPendingMedia] = useState<PendingMediaItem[]>([]);
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<AudioExportFormat>('mp3');
  const [bitrateKbps, setBitrateKbps] = useState(192);
  const [splitStreams, setSplitStreams] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [remoteUrl, setRemoteUrl] = useState('');
  const [remoteUrlError, setRemoteUrlError] = useState<string | null>(null);
  const [isImportingRemoteUrl, setIsImportingRemoteUrl] = useState(false);
  const [isBatchExtracting, setIsBatchExtracting] = useState(false);
  const [isBatchExporting, setIsBatchExporting] = useState(false);
  const [cursorTime, setCursorTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopSelection, setLoopSelection] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tracksRef = useRef<AudioTrack[]>([]);
  const stopAtRef = useRef<number | null>(null);

  useEffect(() => {
    tracksRef.current = tracks;
  }, [tracks]);

  useEffect(
    () => () => {
      tracksRef.current.forEach((track) => {
        URL.revokeObjectURL(track.objectUrl);
        track.segments.forEach((segment) => {
          if (segment.resultUrl) {
            URL.revokeObjectURL(segment.resultUrl);
          }
        });
      });
    },
    [],
  );

  const activeTrack = useMemo(
    () => tracks.find((track) => track.id === activeTrackId) ?? tracks[0],
    [activeTrackId, tracks],
  );

  const selectedSegment = useMemo(
    () => activeTrack?.segments.find((segment) => segment.id === activeTrack.selectedSegmentId),
    [activeTrack],
  );

  useEffect(() => {
    if (!activeTrack && activeTrackId) {
      setActiveTrackId(null);
    }
  }, [activeTrack, activeTrackId]);

  useEffect(() => {
    setCursorTime(0);
    stopAtRef.current = null;
  }, [activeTrack?.id]);

  const updatePendingMedia = (
    id: string,
    updater: (item: PendingMediaItem) => PendingMediaItem,
  ) => {
    setPendingMedia((current) =>
      current.map((item) => (item.id === id ? updater(item) : item)),
    );
  };

  const updateTrack = (trackId: string, updater: (track: AudioTrack) => AudioTrack) => {
    setTracks((current) =>
      current.map((track) => (track.id === trackId ? updater(track) : track)),
    );
  };

  const addAudioTrackFromFile = async (
    file: File,
    options?: {
      name?: string;
      sourceName?: string;
    },
  ): Promise<AudioTrack> => {
    const objectUrl = URL.createObjectURL(file);
    const baseName = sanitizeAudioFileBaseName(options?.name ?? file.name);

    let duration = 0;
    let waveform: AudioWaveformData | undefined;
    let waveformError: string | undefined;

    try {
      const metadata = await readAudioMetadata(file).catch(() => ({ durationInSeconds: 0 }));
      waveform = await createAudioWaveform(file).catch((error) => {
        waveformError = error instanceof Error ? error.message : ui.waveformFallback;
        return undefined;
      });
      duration = waveform?.durationInSeconds || metadata.durationInSeconds || 0;
    } catch (error) {
      URL.revokeObjectURL(objectUrl);
      throw new Error(error instanceof Error ? error.message : ui.genericImportError);
    }

    if (!Number.isFinite(duration) || duration <= 0) {
      duration = 1;
    }

    const segment: AudioSegment = {
      id: buildId('segment'),
      name: ui.segmentName(1),
      start: 0,
      end: duration,
      color: segmentColors[0],
      status: 'idle',
      progressPercent: 0,
    };

    const track: AudioTrack = {
      id: buildId('track'),
      name: baseName,
      sourceName: options?.sourceName ?? file.name,
      file,
      objectUrl,
      duration,
      waveform,
      waveformError,
      selectionStart: 0,
      selectionEnd: Math.min(duration, Math.max(0.5, duration)),
      selectedSegmentId: segment.id,
      segments: [segment],
    };

    setTracks((current) => [...current, track]);
    setActiveTrackId((current) => current ?? track.id);

    return track;
  };

  const handleFilesSelected = (files: File[]) => {
    if (files.length) {
      trackEvent('tool_started', { tool: TOOL_ID.audioExtractor, locale, mode: 'upload' });
      trackEvent('file_uploaded', {
        tool: TOOL_ID.audioExtractor,
        locale,
        file_type: files.some((file) => !isLikelyAudioFile(file)) ? 'media' : 'audio',
      });
    }
    const knownFiles = new Set([
      ...selectedUploadFiles.map((file) => getFileKey(file)),
      ...pendingMedia.map((item) => getFileKey(item.file)),
      ...tracks.map((track) => getFileKey(track.file)),
    ]);

    setSelectedUploadFiles((current) => {
      const currentKeys = new Set(current.map((file) => getFileKey(file)));
      const nextFiles = files.filter((file) => !currentKeys.has(getFileKey(file)));
      return nextFiles.length ? [...current, ...nextFiles] : current;
    });

    const nextAudioFiles = files.filter((file) => isLikelyAudioFile(file));
    const nextMediaFiles = files.filter((file) => !isLikelyAudioFile(file));

    if (nextMediaFiles.length) {
      setPendingMedia((current) => [
        ...current,
        ...nextMediaFiles
          .filter((file) => !knownFiles.has(getFileKey(file)))
          .map<PendingMediaItem>((file) => ({
            id: buildId('media'),
            file,
            status: 'pending',
            progressPercent: 0,
            logs: [],
          })),
      ]);
    }

    if (nextAudioFiles.length) {
      setIsImporting(true);
      void (async () => {
        try {
          for (const file of nextAudioFiles) {
            if (knownFiles.has(getFileKey(file))) {
              continue;
            }

            await addAudioTrackFromFile(file);
          }
          if (nextAudioFiles.length) {
            trackEvent('tool_completed', { tool: TOOL_ID.audioExtractor, locale, mode: 'upload' });
          }
        } catch {
          trackEvent('tool_error', { tool: TOOL_ID.audioExtractor, locale, error_type: 'processing_failed' });
        } finally {
          setIsImporting(false);
        }
      })();
    }
  };

  const handleImportRemoteUrl = async () => {
    trackEvent('tool_started', { tool: TOOL_ID.audioExtractor, locale, mode: 'remote_url' });
    const value = remoteUrl.trim();
    setRemoteUrlError(null);

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(value);
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        throw new Error(ui.remoteUrlInvalid);
      }
    } catch {
      setRemoteUrlError(ui.remoteUrlInvalid);
      return;
    }

    if (isBlockedRemoteUrl(parsedUrl)) {
      setRemoteUrlError(ui.remoteUrlUnsupported);
      return;
    }

    setIsImportingRemoteUrl(true);
    try {
      const response = await fetch(parsedUrl.toString());
      if (!response.ok) {
        throw new Error(ui.remoteUrlFetchError);
      }

      const contentType = response.headers.get('content-type') ?? '';
      const contentLength = Number(response.headers.get('content-length') ?? 0);
      const knownExtension = hasKnownRemoteMediaExtension(parsedUrl);

      if (contentLength > remoteImportMaxBytes) {
        throw new Error(ui.remoteUrlTooLarge);
      }

      if (contentType && !isAllowedRemoteMediaType(contentType) && !knownExtension) {
        throw new Error(ui.remoteUrlMediaTypeError);
      }

      if (!contentType && !knownExtension) {
        throw new Error(ui.remoteUrlMediaTypeError);
      }

      const blob = await response.blob();
      if (blob.size > remoteImportMaxBytes) {
        throw new Error(ui.remoteUrlTooLarge);
      }

      const fileType = blob.type || contentType.split(';')[0]?.trim() || 'application/octet-stream';
      const file = new File([blob], buildRemoteFileName(parsedUrl, fileType), {
        type: fileType,
        lastModified: Date.now(),
      });

      if (isLikelyAudioFile(file)) {
        await addAudioTrackFromFile(file, {
          name: file.name,
          sourceName: parsedUrl.toString(),
        });
      } else {
        setPendingMedia((current) => [
          ...current,
          {
            id: buildId('media'),
            file,
            status: 'pending',
            progressPercent: 0,
            logs: [],
          },
        ]);
      }

      setRemoteUrl('');
      trackEvent('tool_completed', { tool: TOOL_ID.audioExtractor, locale, mode: 'remote_url' });
    } catch (error) {
      setRemoteUrlError(error instanceof Error ? error.message : ui.remoteUrlFetchError);
      trackEvent('tool_error', { tool: TOOL_ID.audioExtractor, locale, error_type: 'network_error' });
    } finally {
      setIsImportingRemoteUrl(false);
    }
  };

  const handleExtractMedia = async (item: PendingMediaItem) => {
    trackEvent('tool_started', { tool: TOOL_ID.audioExtractor, locale, mode: 'extract_audio' });
    updatePendingMedia(item.id, (current) => ({
      ...current,
      status: 'extracting',
      progressPercent: 0,
      errorMessage: undefined,
      logs: [],
    }));

    try {
      const results = await extractAudioTracksFromMedia(item.file, {
        outputFormat,
        bitrateKbps,
        maxAudioStreams: splitStreams ? 4 : 1,
        onProgress: (event) => {
          const percent = Math.round(clamp(event.progress * 100, 0, 100));
          updatePendingMedia(item.id, (current) => ({
            ...current,
            progressPercent: Number.isFinite(percent) ? percent : current.progressPercent,
          }));
        },
        onLog: (event) => {
          if (!event.message) {
            return;
          }

          updatePendingMedia(item.id, (current) => ({
            ...current,
            logs: [...current.logs, event.message].slice(-8),
          }));
        },
      });

      for (const result of results) {
        await addAudioTrackFromFile(result.file, {
          name: `${sanitizeAudioFileBaseName(item.file.name)}-${result.label.toLowerCase().replaceAll(/\s+/g, '-')}`,
          sourceName: item.file.name,
        });
      }

      updatePendingMedia(item.id, (current) => ({
        ...current,
        status: 'done',
        progressPercent: 100,
        logs: [...current.logs, ui.createdFromVideo(results.length)].slice(-8),
      }));
      trackEvent('tool_completed', { tool: TOOL_ID.audioExtractor, locale, mode: 'extract_audio' });
    } catch (error) {
      updatePendingMedia(item.id, (current) => ({
        ...current,
        status: 'error',
        progressPercent: 0,
        errorMessage: error instanceof Error ? error.message : ui.genericImportError,
        logs: [
          ...current.logs,
          error instanceof Error ? error.message : String(error),
        ].slice(-8),
      }));
      trackEvent('tool_error', { tool: TOOL_ID.audioExtractor, locale, error_type: 'processing_failed' });
    }
  };

  const handleExtractAll = async () => {
    if (isBatchExtracting) {
      return;
    }

    setIsBatchExtracting(true);
    try {
      const snapshot = pendingMedia.filter((item) => item.status === 'pending' || item.status === 'error');
      for (const item of snapshot) {
        await handleExtractMedia(item);
      }
    } finally {
      setIsBatchExtracting(false);
    }
  };

  const handleRemoveTrack = (trackId: string) => {
    setTracks((current) => {
      const target = current.find((track) => track.id === trackId);
      if (target) {
        URL.revokeObjectURL(target.objectUrl);
        target.segments.forEach((segment) => {
          if (segment.resultUrl) {
            URL.revokeObjectURL(segment.resultUrl);
          }
        });
      }

      const next = current.filter((track) => track.id !== trackId);
      if (activeTrackId === trackId) {
        setActiveTrackId(next[0]?.id ?? null);
      }

      return next;
    });
  };

  const handleRemoveUploadedFile = (index: number) => {
    const target = selectedUploadFiles[index];
    if (!target) {
      return;
    }

    const targetKey = getFileKey(target);
    setSelectedUploadFiles((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setPendingMedia((current) => current.filter((item) => getFileKey(item.file) !== targetKey));
    setTracks((current) => {
      const removedTracks = current.filter((track) => getFileKey(track.file) === targetKey);
      removedTracks.forEach((track) => {
        URL.revokeObjectURL(track.objectUrl);
        track.segments.forEach((segment) => {
          if (segment.resultUrl) {
            URL.revokeObjectURL(segment.resultUrl);
          }
        });
      });

      const next = current.filter((track) => getFileKey(track.file) !== targetKey);
      if (activeTrackId && removedTracks.some((track) => track.id === activeTrackId)) {
        setActiveTrackId(next[0]?.id ?? null);
      }

      return next;
    });
  };

  const handleSelectRange = (start: number, end: number) => {
    if (!activeTrack) {
      return;
    }

    const range = normalizeRange(start, end, activeTrack.duration);
    updateTrack(activeTrack.id, (track) => ({
      ...track,
      selectionStart: range.start,
      selectionEnd: range.end,
    }));
  };

  const handleSeek = (time: number) => {
    if (!audioRef.current || !activeTrack) {
      return;
    }

    const safeTime = clamp(time, 0, activeTrack.duration);
    audioRef.current.currentTime = safeTime;
    setCursorTime(safeTime);
  };

  const playRange = async (start: number, end: number) => {
    if (!audioRef.current || !activeTrack) {
      return;
    }

    const range = normalizeRange(start, end, activeTrack.duration);
    audioRef.current.currentTime = range.start;
    stopAtRef.current = range.end;
    await audioRef.current.play();
    setIsPlaying(true);
  };

  const pauseAudio = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    setCursorTime(audio.currentTime);

    const stopAt = stopAtRef.current;
    if (stopAt !== null && audio.currentTime >= stopAt) {
      if (loopSelection && activeTrack) {
        audio.currentTime = activeTrack.selectionStart;
        void audio.play();
        return;
      }

      audio.pause();
      stopAtRef.current = null;
      setIsPlaying(false);
    }
  };

  const handleAddSegment = () => {
    if (!activeTrack) {
      return;
    }

    const range = normalizeRange(
      activeTrack.selectionStart,
      activeTrack.selectionEnd,
      activeTrack.duration,
    );
    const segmentIndex = activeTrack.segments.length + 1;
    const segment: AudioSegment = {
      id: buildId('segment'),
      name: ui.segmentName(segmentIndex),
      start: range.start,
      end: range.end,
      color: segmentColors[(segmentIndex - 1) % segmentColors.length] ?? segmentColors[0],
      status: 'idle',
      progressPercent: 0,
    };

    updateTrack(activeTrack.id, (track) => ({
      ...track,
      selectedSegmentId: segment.id,
      segments: [...track.segments, segment],
    }));
  };

  const handleApplySelectionToSelectedSegment = () => {
    if (!activeTrack?.selectedSegmentId) {
      return;
    }

    const range = normalizeRange(
      activeTrack.selectionStart,
      activeTrack.selectionEnd,
      activeTrack.duration,
    );

    updateTrack(activeTrack.id, (track) => ({
      ...track,
      segments: track.segments.map((segment) =>
        segment.id === track.selectedSegmentId
          ? {
              ...segment,
              start: range.start,
              end: range.end,
              status: 'idle',
              progressPercent: 0,
              resultFile: undefined,
              resultUrl: undefined,
              errorMessage: undefined,
            }
          : segment,
      ),
    }));
  };

  const handleSelectSegmentForEdit = (segmentId: string) => {
    if (!activeTrack) {
      return;
    }

    const segment = activeTrack.segments.find((item) => item.id === segmentId);
    if (!segment) {
      return;
    }

    updateTrack(activeTrack.id, (track) => ({
      ...track,
      selectedSegmentId: segment.id,
      selectionStart: segment.start,
      selectionEnd: segment.end,
    }));
  };

  const handleChangeSegmentRange = (segmentId: string, start: number, end: number) => {
    if (!activeTrack) {
      return;
    }

    const range = normalizeRange(start, end, activeTrack.duration);

    updateTrack(activeTrack.id, (track) => ({
      ...track,
      selectedSegmentId: segmentId,
      selectionStart: range.start,
      selectionEnd: range.end,
      segments: track.segments.map((segment) => {
        if (segment.id !== segmentId) {
          return segment;
        }

        if (segment.resultUrl) {
          URL.revokeObjectURL(segment.resultUrl);
        }

        return {
          ...segment,
          start: range.start,
          end: range.end,
          status: 'idle',
          progressPercent: 0,
          resultFile: undefined,
          resultUrl: undefined,
          errorMessage: undefined,
        };
      }),
    }));
  };

  const handleSelectSegment = (segment: AudioSegment) => {
    if (!activeTrack) {
      return;
    }

    updateTrack(activeTrack.id, (track) => ({
      ...track,
      selectedSegmentId: segment.id,
      selectionStart: segment.start,
      selectionEnd: segment.end,
    }));
    void playRange(segment.start, segment.end);
  };

  const handleRenameSegment = (segmentId: string, name: string) => {
    if (!activeTrack) {
      return;
    }

    updateTrack(activeTrack.id, (track) => ({
      ...track,
      segments: track.segments.map((segment) =>
        segment.id === segmentId ? { ...segment, name } : segment,
      ),
    }));
  };

  const handleRemoveSegment = (segmentId: string) => {
    if (!activeTrack) {
      return;
    }

    updateTrack(activeTrack.id, (track) => {
      const target = track.segments.find((segment) => segment.id === segmentId);
      if (target?.resultUrl) {
        URL.revokeObjectURL(target.resultUrl);
      }

      const nextSegments = track.segments.filter((segment) => segment.id !== segmentId);

      return {
        ...track,
        selectedSegmentId:
          track.selectedSegmentId === segmentId
            ? nextSegments[0]?.id
            : track.selectedSegmentId,
        segments: nextSegments,
      };
    });
  };

  const handleSplitAtCursor = () => {
    if (!activeTrack?.selectedSegmentId) {
      return;
    }

    const splitTime = cursorTime;
    const selected = activeTrack.segments.find(
      (segment) => segment.id === activeTrack.selectedSegmentId,
    );

    if (
      !selected ||
      splitTime <= selected.start + MIN_SEGMENT_SECONDS ||
      splitTime >= selected.end - MIN_SEGMENT_SECONDS
    ) {
      return;
    }

    const first: AudioSegment = {
      ...selected,
      id: buildId('segment'),
      name: ui.splitPartName(selected.name, 1),
      end: splitTime,
      status: 'idle',
      progressPercent: 0,
      resultFile: undefined,
      resultUrl: undefined,
      errorMessage: undefined,
    };
    const second: AudioSegment = {
      ...selected,
      id: buildId('segment'),
      name: ui.splitPartName(selected.name, 2),
      start: splitTime,
      status: 'idle',
      progressPercent: 0,
      resultFile: undefined,
      resultUrl: undefined,
      errorMessage: undefined,
    };

    updateTrack(activeTrack.id, (track) => ({
      ...track,
      selectedSegmentId: first.id,
      segments: track.segments.flatMap((segment) =>
        segment.id === selected.id ? [first, second] : [segment],
      ),
      selectionStart: first.start,
      selectionEnd: first.end,
    }));
  };

  const updateSegmentForTrack = (
    trackId: string,
    segmentId: string,
    updater: (segment: AudioSegment) => AudioSegment,
  ) => {
    updateTrack(trackId, (track) => ({
      ...track,
      segments: track.segments.map((segment) =>
        segment.id === segmentId ? updater(segment) : segment,
      ),
    }));
  };

  const exportSegmentForTrack = async (track: AudioTrack, segment: AudioSegment) => {
    trackEvent('tool_started', { tool: TOOL_ID.audioExtractor, locale, mode: 'export_segment' });
    if (segment.resultUrl) {
      URL.revokeObjectURL(segment.resultUrl);
    }

    updateSegmentForTrack(track.id, segment.id, (current) => ({
      ...current,
      status: 'exporting',
      progressPercent: 0,
      resultFile: undefined,
      resultUrl: undefined,
      errorMessage: undefined,
    }));

    try {
      const outputName = buildAudioOutputName(
        segment.name || `${track.name}-${segment.id}`,
        outputFormat,
      );
      const file = await exportAudioSegment(track.file, {
        outputFormat,
        bitrateKbps,
        startInSeconds: segment.start,
        endInSeconds: segment.end,
        outputName,
        onProgress: (event) => {
          const percent = Math.round(clamp(event.progress * 100, 0, 100));
          updateSegmentForTrack(track.id, segment.id, (current) => ({
            ...current,
            progressPercent: Number.isFinite(percent) ? percent : current.progressPercent,
          }));
        },
      });
      const resultUrl = URL.createObjectURL(file);

      updateSegmentForTrack(track.id, segment.id, (current) => ({
        ...current,
        status: 'done',
        progressPercent: 100,
        resultFile: file,
        resultUrl,
        errorMessage: undefined,
      }));
      trackEvent('tool_completed', { tool: TOOL_ID.audioExtractor, locale, mode: 'export_segment' });

      return file;
    } catch (error) {
      updateSegmentForTrack(track.id, segment.id, (current) => ({
        ...current,
        status: 'error',
        progressPercent: 0,
        errorMessage: error instanceof Error ? error.message : ui.genericExportError,
      }));
      trackEvent('tool_error', { tool: TOOL_ID.audioExtractor, locale, error_type: 'processing_failed' });
      return null;
    }
  };

  const handleExportSelectedSegment = async () => {
    if (!activeTrack || !selectedSegment) {
      return;
    }

    const file = await exportSegmentForTrack(activeTrack, selectedSegment);
    if (file) {
      downloadBlob(file, file.name);
      trackEvent('result_downloaded', { tool: TOOL_ID.audioExtractor, locale, format: outputFormat });
    }
  };

  const handleExportSegmentAndDownload = async (track: AudioTrack, segment: AudioSegment) => {
    const file = await exportSegmentForTrack(track, segment);
    if (file) {
      downloadBlob(file, file.name);
      trackEvent('result_downloaded', { tool: TOOL_ID.audioExtractor, locale, format: outputFormat });
    }
  };

  const handleExportAllSegments = async () => {
    if (!activeTrack || isBatchExporting) {
      return;
    }

    setIsBatchExporting(true);
    try {
      const snapshot = [...activeTrack.segments];
      for (const segment of snapshot) {
        await exportSegmentForTrack(activeTrack, segment);
      }
    } finally {
      setIsBatchExporting(false);
    }
  };

  const handleDownloadReadySegments = () => {
    if (!activeTrack) {
      return;
    }

    activeTrack.segments
      .filter((segment) => segment.resultFile)
      .forEach((segment, index) => {
        const resultFile = segment.resultFile;
        if (!resultFile) {
          return;
        }

        window.setTimeout(() => downloadBlob(resultFile, resultFile.name), index * 120);
        trackEvent('result_downloaded', { tool: TOOL_ID.audioExtractor, locale, format: outputFormat });
      });
  };

  const readySegmentCount = activeTrack?.segments.filter((segment) => segment.resultFile).length ?? 0;
  const pendingExtractCount = pendingMedia.filter(
    (item) => item.status === 'pending' || item.status === 'error',
  ).length;

  return (
    <Card className="space-y-5">
      <header className="rounded-xl border border-slate-200 bg-slate-950 p-4 text-white">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-lg font-semibold">{ui.title}</h3>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">{ui.intro}</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-xs text-slate-200">
            <FileAudio className="h-4 w-4" />
            {outputFormat.toUpperCase()} / {bitrateKbps}kbps
          </div>
        </div>
      </header>

      <FileUploadDropzone
        locale={locale}
        label={ui.uploadLabel}
        helperText={ui.uploadHint}
        acceptedDescription={ui.acceptedDescription}
        accept={acceptedMediaTypes}
        multiple
        maxSize={1024 * 1024 * 1024}
        selectedFiles={selectedUploadFiles}
        onRemoveFile={handleRemoveUploadedFile}
        onFilesSelected={handleFilesSelected}
      />

      <section className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
        <label htmlFor="audio-editor-remote-url" className="text-sm font-semibold text-slate-800">
          {ui.remoteUrlLabel}
        </label>
        <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto]">
          <Input
            id="audio-editor-remote-url"
            type="url"
            inputMode="url"
            value={remoteUrl}
            placeholder={ui.remoteUrlPlaceholder}
            onChange={(event) => {
              setRemoteUrl(event.target.value);
              setRemoteUrlError(null);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                void handleImportRemoteUrl();
              }
            }}
          />
          <Button
            onClick={() => {
              void handleImportRemoteUrl();
            }}
            disabled={!remoteUrl.trim() || isImportingRemoteUrl}
            className="w-full md:w-auto"
          >
            {isImportingRemoteUrl ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Link2 className="mr-2 h-4 w-4" />
            )}
            {isImportingRemoteUrl ? ui.remoteUrlLoading : ui.remoteUrlButton}
          </Button>
        </div>
        <p className="text-xs leading-5 text-slate-600">{ui.remoteUrlHint}</p>
        {remoteUrlError ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            {remoteUrlError}
          </p>
        ) : null}
      </section>

      <section className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <label className="space-y-1">
          <span className="text-sm font-semibold text-slate-800">{ui.outputFormat}</span>
          <Select
            value={outputFormat}
            onChange={(event) => setOutputFormat(event.target.value as AudioExportFormat)}
          >
            {audioExportFormats.map((format) => (
              <option key={format.id} value={format.id}>
                {format.label}
              </option>
            ))}
          </Select>
        </label>

        <label className="space-y-1">
          <span className="text-sm font-semibold text-slate-800">{ui.bitrate}</span>
          <Select
            value={bitrateKbps}
            onChange={(event) => setBitrateKbps(Number(event.target.value))}
            disabled={outputFormat === 'wav'}
          >
            <option value={128}>128 kbps</option>
            <option value={160}>160 kbps</option>
            <option value={192}>192 kbps</option>
            <option value={256}>256 kbps</option>
            <option value={320}>320 kbps</option>
          </Select>
        </label>

        <label className="flex min-w-0 items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 text-sm">
          <input
            type="checkbox"
            checked={splitStreams}
            onChange={(event) => setSplitStreams(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 accent-brand-600"
          />
          <span className="min-w-0">
            <span className="block font-semibold text-slate-800">{ui.splitStreams}</span>
            <span className="mt-0.5 block text-xs leading-5 text-slate-600">
              {ui.splitStreamsHint}
            </span>
          </span>
        </label>
      </section>

      {isImporting ? (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          <Loader2 className="h-4 w-4 animate-spin" />
          {ui.importBusy}
        </div>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="min-w-0 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h4 className="text-sm font-semibold text-slate-900">{ui.queueTitle}</h4>
              <Button
                variant="secondary"
                onClick={() => {
                  void handleExtractAll();
                }}
                disabled={!pendingExtractCount || isBatchExtracting}
                className="h-9 w-full sm:w-auto"
              >
                {isBatchExtracting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                {ui.extractAll}
              </Button>
            </div>

            <div className="mt-3 space-y-3">
              {pendingMedia.length ? (
                pendingMedia.map((item) => (
                  <article key={item.id} className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-start gap-3">
                      <Film className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">{item.file.name}</p>
                        <p className="text-xs text-slate-500">
                          {ui.sizeLabel}: {formatBytes(item.file.size)}
                        </p>
                      </div>
                    </div>

                    {item.status === 'extracting' ? (
                      <div className="space-y-1">
                        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-brand-600 transition-all"
                            style={{ width: `${item.progressPercent}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-600">
                          {ui.extracting} {item.progressPercent}%
                        </p>
                      </div>
                    ) : null}

                    {item.errorMessage ? (
                      <p className="rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700">
                        {item.errorMessage}
                      </p>
                    ) : null}

                    {item.logs.length ? (
                      <div className="max-h-24 overflow-auto rounded-md bg-white p-2 text-xs text-slate-500">
                        {item.logs.map((log, index) => (
                          <p key={`${item.id}-log-${index}`} className="break-words">
                            {log}
                          </p>
                        ))}
                      </div>
                    ) : null}

                    <Button
                      variant="secondary"
                      onClick={() => {
                        void handleExtractMedia(item);
                      }}
                      disabled={item.status === 'extracting' || isBatchExtracting}
                      className="h-9 w-full"
                    >
                      {item.status === 'extracting' ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Wand2 className="mr-2 h-4 w-4" />
                      )}
                      {item.status === 'extracting' ? ui.extracting : ui.extractAudio}
                    </Button>
                  </article>
                ))
              ) : (
                <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-600">
                  {ui.noQueue}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h4 className="text-sm font-semibold text-slate-900">{ui.trackListTitle}</h4>
            <div className="mt-3 space-y-2">
              {tracks.length ? (
                tracks.map((track) => (
                  <article
                    key={track.id}
                    className={`rounded-lg border p-3 ${
                      track.id === activeTrack?.id
                        ? 'border-brand-300 bg-brand-50'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <FileAudio className="mt-1 h-4 w-4 shrink-0 text-brand-700" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">{track.name}</p>
                        <p className="text-xs leading-5 text-slate-600">
                          {ui.durationLabel}: {formatDuration(track.duration)} • {ui.sizeLabel}:{' '}
                          {formatBytes(track.file.size)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        variant="secondary"
                        className="h-8 px-3"
                        onClick={() => setActiveTrackId(track.id)}
                      >
                        {ui.selectTrack}
                      </Button>
                      <Button
                        variant="ghost"
                        className="h-8 px-3 text-red-700 hover:bg-red-50"
                        onClick={() => handleRemoveTrack(track.id)}
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        {ui.removeTrack}
                      </Button>
                    </div>
                  </article>
                ))
              ) : (
                <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-600">
                  {ui.noTracks}
                </p>
              )}
            </div>
          </div>
        </div>

        {activeTrack ? (
          <div className="min-w-0 space-y-4">
            <section className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                <label className="space-y-1">
                  <span className="text-sm font-semibold text-slate-800">{ui.trackName}</span>
                  <Input
                    value={activeTrack.name}
                    onChange={(event) =>
                      updateTrack(activeTrack.id, (track) => ({
                        ...track,
                        name: event.target.value,
                      }))
                    }
                  />
                </label>
                <Button
                  variant="secondary"
                  onClick={() => downloadBlob(activeTrack.file, activeTrack.file.name)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {ui.downloadTrack}
                </Button>
              </div>

              <p className="mt-2 text-xs leading-5 text-slate-600">
                {ui.sourceLabel}: {activeTrack.sourceName} • {ui.durationLabel}:{' '}
                {formatDuration(activeTrack.duration)}
              </p>

              <audio
                ref={audioRef}
                src={activeTrack.objectUrl}
                controls
                preload="metadata"
                onTimeUpdate={handleTimeUpdate}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                className="mt-3 w-full"
              />
            </section>

            <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">{ui.waveformTitle}</h4>
                  <p className="text-xs text-slate-600">
                    {ui.cursor}: {formatDuration(cursorTime)}
                  </p>
                </div>
                <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={loopSelection}
                    onChange={(event) => setLoopSelection(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 accent-brand-600"
                  />
                  {ui.loop}
                </label>
              </div>

              <WaveformCanvas
                track={activeTrack}
                cursorTime={cursorTime}
                selectedSegmentId={activeTrack.selectedSegmentId}
                onSelectRange={handleSelectRange}
                onSeek={handleSeek}
                onSelectSegment={handleSelectSegmentForEdit}
                onChangeSegmentRange={handleChangeSegmentRange}
              />

              {activeTrack.waveformError ? (
                <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                  {ui.waveformFallback}
                </p>
              ) : null}

              <div className="grid gap-3 md:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-xs font-semibold text-slate-700">{ui.start}</span>
                  <Input
                    type="number"
                    min={0}
                    max={activeTrack.duration}
                    step={0.001}
                    value={activeTrack.selectionStart.toFixed(3)}
                    onChange={(event) =>
                      handleSelectRange(Number(event.target.value), activeTrack.selectionEnd)
                    }
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-semibold text-slate-700">{ui.end}</span>
                  <Input
                    type="number"
                    min={0}
                    max={activeTrack.duration}
                    step={0.001}
                    value={activeTrack.selectionEnd.toFixed(3)}
                    onChange={(event) =>
                      handleSelectRange(activeTrack.selectionStart, Number(event.target.value))
                    }
                  />
                </label>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (isPlaying) {
                      pauseAudio();
                    } else {
                      void playRange(activeTrack.selectionStart, activeTrack.selectionEnd);
                    }
                  }}
                >
                  {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                  {isPlaying ? ui.pause : ui.playSelection}
                </Button>
                <Button variant="secondary" onClick={handleAddSegment}>
                  <Scissors className="mr-2 h-4 w-4" />
                  {ui.addCut}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleApplySelectionToSelectedSegment}
                  disabled={!selectedSegment}
                >
                  {ui.applyCut}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleSplitAtCursor}
                  disabled={!selectedSegment}
                >
                  <Split className="mr-2 h-4 w-4" />
                  {ui.splitAtCursor}
                </Button>
              </div>
            </section>

            <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h4 className="text-sm font-semibold text-slate-900">{ui.segmentsTitle}</h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      void handleExportSelectedSegment();
                    }}
                    disabled={!selectedSegment || selectedSegment.status === 'exporting'}
                  >
                    {selectedSegment?.status === 'exporting' ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    {ui.exportSelected}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      void handleExportAllSegments();
                    }}
                    disabled={!activeTrack.segments.length || isBatchExporting}
                  >
                    {isBatchExporting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    {ui.exportAll}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleDownloadReadySegments}
                    disabled={!readySegmentCount}
                  >
                    {ui.downloadReady}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {activeTrack.segments.map((segment) => (
                  <article
                    key={segment.id}
                    className={`space-y-3 rounded-xl border p-3 ${
                      segment.id === activeTrack.selectedSegmentId
                        ? 'border-brand-300 bg-brand-50/60'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                      <label className="min-w-0 space-y-1">
                        <span className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: segment.color }}
                          />
                          {ui.renamePlaceholder}
                        </span>
                        <Input
                          value={segment.name}
                          onChange={(event) => handleRenameSegment(segment.id, event.target.value)}
                        />
                      </label>
                      <span
                        className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${getSegmentStatusClass(segment.status)}`}
                      >
                        {getSegmentStatusLabel(ui, segment.status)}
                      </span>
                    </div>

                    <div className="grid gap-2 text-xs text-slate-600 md:grid-cols-3">
                      <span>
                        {ui.start}: <strong>{formatDuration(segment.start)}</strong>
                      </span>
                      <span>
                        {ui.end}: <strong>{formatDuration(segment.end)}</strong>
                      </span>
                      <span>
                        {ui.durationLabel}:{' '}
                        <strong>{formatDuration(segment.end - segment.start)}</strong>
                      </span>
                    </div>

                    {segment.status === 'exporting' ? (
                      <div className="space-y-1">
                        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-brand-600 transition-all"
                            style={{ width: `${segment.progressPercent}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-600">
                          {ui.statusExporting} {segment.progressPercent}%
                        </p>
                      </div>
                    ) : null}

                    {segment.errorMessage ? (
                      <p className="rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700">
                        {segment.errorMessage}
                      </p>
                    ) : null}

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="secondary"
                        className="h-9"
                        onClick={() => handleSelectSegment(segment)}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        {ui.playSegment}
                      </Button>
                      <Button
                        variant="secondary"
                        className="h-9"
                        onClick={() => handleSelectSegment(segment)}
                      >
                        {ui.loadSegment}
                      </Button>
                      <Button
                        variant="secondary"
                        className="h-9"
                        onClick={() => {
                          void handleExportSegmentAndDownload(activeTrack, segment);
                        }}
                        disabled={segment.status === 'exporting'}
                      >
                        {segment.status === 'exporting' ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="mr-2 h-4 w-4" />
                        )}
                        {ui.exportSelected}
                      </Button>
                      <Button
                        variant="secondary"
                        className="h-9"
                        disabled={!segment.resultFile}
                        onClick={() => {
                          if (segment.resultFile) {
                            downloadBlob(segment.resultFile, segment.resultFile.name);
                          }
                        }}
                      >
                        {ui.downloadReady}
                      </Button>
                      <Button
                        variant="ghost"
                        className="h-9 text-red-700 hover:bg-red-50"
                        onClick={() => handleRemoveSegment(segment.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {ui.removeSegment}
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
            {ui.noTracks}
          </div>
        )}
      </section>

      <div className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-600 md:grid-cols-2">
        <p>{ui.privacyNote}</p>
        <p>{ui.ffmpegNote}</p>
      </div>
    </Card>
  );
}
