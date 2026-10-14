'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Download, FastForward, Film, Gauge, Loader2, Scissors, Trash2, Video } from 'lucide-react';
import { FileUploadDropzone } from '@/components/shared/file-upload-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { trackEvent, TOOL_ID } from '@/lib/analytics';
import {
  createTimelapseVideo,
  MAX_TIMELAPSE_FILE_SIZE_BYTES,
  readTimelapseMetadata,
  removeTimelapseOutput,
  TimelapseProcessingError,
  type TimelapseFormat,
  type TimelapseMetadata,
  type TimelapseQuality,
  type TimelapseSegment,
} from '@/lib/timelapse';
import { formatBytes } from '@/lib/file-size';
import { downloadBlob } from '@/lib/download';
import type { AppLocale } from '@/lib/i18n/config';

type TimelapseCreatorToolProps = Readonly<{ locale?: AppLocale }>;
type ExportState = 'idle' | 'processing' | 'done' | 'error';

const copy = {
  'pt-br': {
    title: 'Criador de timelapse',
    intro: 'Acelere o vídeo inteiro ou ajuste a velocidade por trecho. O arquivo fica no seu aparelho.',
    upload: 'Escolher vídeo',
    uploadHint: 'MP4, MOV, WebM e outros formatos comuns. Até 10 GB.',
    editor: 'Linha do tempo',
    split: 'Dividir no marcador',
    playhead: 'Posição do vídeo',
    segments: 'Trechos e velocidade',
    segment: 'Trecho',
    included: 'Incluir no vídeo final',
    removed: 'Trecho removido da saída',
    speed: 'Velocidade',
    allFast: 'Acelerar tudo 8×',
    output: 'Exportação',
    fps: 'Quadros por segundo',
    quality: 'Qualidade',
    format: 'Formato',
    high: 'Alta',
    medium: 'Equilibrada',
    low: 'Leve',
    muted: 'O timelapse será exportado sem áudio.',
    export: 'Criar timelapse',
    exporting: 'Renderizando vídeo…',
    download: 'Baixar vídeo',
    ready: 'Prévia do resultado',
    original: 'Vídeo original',
    empty: 'Adicione um vídeo para montar o timelapse.',
    duration: 'Duração final estimada',
    sourceDuration: 'Duração original',
    size: 'Tamanho',
    resolution: 'Resolução',
    local: 'Decodificação, edição e exportação acontecem neste navegador. O vídeo não é enviado ao site.',
    warmup: 'O navegador precisa oferecer WebCodecs e armazenamento local para exportar vídeos grandes.',
    unsupported: 'Este navegador não oferece os codecs necessários. Tente uma versão atual do Chrome ou Edge em um computador.',
    invalid: 'Revise os trechos: mantenha intervalos válidos e pelo menos um trecho incluído.',
    storage: 'O armazenamento temporário do navegador não está disponível ou ficou sem espaço.',
    genericError: 'Não foi possível criar o timelapse com este arquivo.',
    readError: 'Não foi possível ler os metadados deste vídeo.',
    progress: (value: number) => `Renderização ${Math.round(value * 100)}%`,
    splitHint: 'Pause o vídeo no ponto desejado e divida o trecho selecionado para aplicar outra velocidade.',
    removeFile: 'Trocar vídeo',
  },
  en: {
    title: 'Timelapse creator',
    intro: 'Speed up the whole video or set a different pace for each section. Your file stays on your device.',
    upload: 'Choose a video',
    uploadHint: 'MP4, MOV, WebM, and other common formats. Up to 10 GB.',
    editor: 'Timeline',
    split: 'Split at playhead',
    playhead: 'Video position',
    segments: 'Sections and speed',
    segment: 'Section',
    included: 'Keep in final video',
    removed: 'Section removed from output',
    speed: 'Speed',
    allFast: 'Speed everything up 8×',
    output: 'Export settings',
    fps: 'Frames per second',
    quality: 'Quality',
    format: 'Format',
    high: 'High',
    medium: 'Balanced',
    low: 'Smaller file',
    muted: 'The timelapse will be exported without audio.',
    export: 'Create timelapse',
    exporting: 'Rendering video…',
    download: 'Download video',
    ready: 'Result preview',
    original: 'Original video',
    empty: 'Add a video to start building a timelapse.',
    duration: 'Estimated final duration',
    sourceDuration: 'Original duration',
    size: 'File size',
    resolution: 'Resolution',
    local: 'Decoding, editing, and export run in this browser. Your video is not uploaded to the site.',
    warmup: 'Your browser needs WebCodecs and local storage to export large videos.',
    unsupported: 'This browser does not provide the required codecs. Try an up-to-date Chrome or Edge on a computer.',
    invalid: 'Review the sections: use valid ranges and keep at least one section included.',
    storage: 'Browser temporary storage is unavailable or out of space.',
    genericError: 'Could not create a timelapse from this file.',
    readError: 'Could not read this video’s metadata.',
    progress: (value: number) => `Rendering ${Math.round(value * 100)}%`,
    splitHint: 'Pause at the point you want, then split the selected section to set a different speed.',
    removeFile: 'Replace video',
  },
  es: {
    title: 'Creador de timelapse',
    intro: 'Acelera todo el video o ajusta la velocidad de cada tramo. El archivo permanece en tu dispositivo.',
    upload: 'Elegir video',
    uploadHint: 'MP4, MOV, WebM y otros formatos comunes. Hasta 10 GB.',
    editor: 'Línea de tiempo',
    split: 'Dividir en el marcador',
    playhead: 'Posición del video',
    segments: 'Tramos y velocidad',
    segment: 'Tramo',
    included: 'Incluir en el video final',
    removed: 'Tramo eliminado del resultado',
    speed: 'Velocidad',
    allFast: 'Acelerar todo 8×',
    output: 'Exportación',
    fps: 'Cuadros por segundo',
    quality: 'Calidad',
    format: 'Formato',
    high: 'Alta',
    medium: 'Equilibrada',
    low: 'Archivo ligero',
    muted: 'El timelapse se exportará sin audio.',
    export: 'Crear timelapse',
    exporting: 'Procesando video…',
    download: 'Descargar video',
    ready: 'Vista previa del resultado',
    original: 'Video original',
    empty: 'Añade un video para empezar a crear el timelapse.',
    duration: 'Duración final estimada',
    sourceDuration: 'Duración original',
    size: 'Tamaño',
    resolution: 'Resolución',
    local: 'La lectura, edición y exportación ocurren en este navegador. El video no se envía al sitio.',
    warmup: 'El navegador necesita WebCodecs y almacenamiento local para exportar videos grandes.',
    unsupported: 'Este navegador no ofrece los códecs necesarios. Prueba una versión actual de Chrome o Edge en un ordenador.',
    invalid: 'Revisa los tramos: usa intervalos válidos e incluye al menos uno.',
    storage: 'El almacenamiento temporal del navegador no está disponible o no tiene espacio.',
    genericError: 'No se pudo crear el timelapse con este archivo.',
    readError: 'No se pudieron leer los metadatos del video.',
    progress: (value: number) => `Procesando ${Math.round(value * 100)}%`,
    splitHint: 'Pausa en el punto deseado y divide el tramo seleccionado para cambiar su velocidad.',
    removeFile: 'Cambiar video',
  },
  zh: {
    title: '延时视频制作工具',
    intro: '加速整个视频，或为不同片段设置不同速度。文件保留在你的设备上。',
    upload: '选择视频',
    uploadHint: '支持 MP4、MOV、WebM 等常见格式，最大 10 GB。',
    editor: '时间线',
    split: '在播放位置分割',
    playhead: '视频位置',
    segments: '片段与速度',
    segment: '片段',
    included: '保留在最终视频中',
    removed: '已从输出中移除此片段',
    speed: '速度',
    allFast: '全部加速 8×',
    output: '导出设置',
    fps: '每秒帧数',
    quality: '画质',
    format: '格式',
    high: '高',
    medium: '均衡',
    low: '较小文件',
    muted: '导出的延时视频不含音频。',
    export: '创建延时视频',
    exporting: '正在渲染视频…',
    download: '下载视频',
    ready: '结果预览',
    original: '原视频',
    empty: '添加视频以开始制作延时视频。',
    duration: '预计成片时长',
    sourceDuration: '原始时长',
    size: '文件大小',
    resolution: '分辨率',
    local: '视频在此浏览器中解码、编辑和导出，不会上传到网站。',
    warmup: '导出大型视频需要浏览器支持 WebCodecs 和本地存储。',
    unsupported: '此浏览器不支持所需编解码器。请在电脑上使用最新版 Chrome 或 Edge。',
    invalid: '请检查片段范围，并至少保留一个片段。',
    storage: '浏览器临时存储不可用或空间不足。',
    genericError: '无法使用此文件创建延时视频。',
    readError: '无法读取视频元数据。',
    progress: (value: number) => `渲染中 ${Math.round(value * 100)}%`,
    splitHint: '暂停到所需位置，然后分割选中片段以设置不同速度。',
    removeFile: '更换视频',
  },
} satisfies Record<AppLocale, Record<string, string | ((value: number) => string)>>;

const speedOptions = [0.25, 0.5, 1, 2, 4, 8, 16];

const formatDuration = (seconds: number): string => {
  if (!Number.isFinite(seconds)) return '—';
  const wholeSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(wholeSeconds / 3600);
  const minutes = Math.floor((wholeSeconds % 3600) / 60);
  const remainder = wholeSeconds % 60;
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
    : `${minutes}:${String(remainder).padStart(2, '0')}`;
};

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function TimelapseCreatorTool({ locale = 'pt-br' }: TimelapseCreatorToolProps) {
  const ui = copy[locale];
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<TimelapseMetadata | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [storageFileName, setStorageFileName] = useState<string | null>(null);
  const [segments, setSegments] = useState<TimelapseSegment[]>([]);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const [playhead, setPlayhead] = useState(0);
  const [format, setFormat] = useState<TimelapseFormat>('mp4');
  const [quality, setQuality] = useState<TimelapseQuality>('high');
  const [frameRate, setFrameRate] = useState<24 | 30 | 60>(30);
  const [exportState, setExportState] = useState<ExportState>('idle');
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [supportsExport, setSupportsExport] = useState(true);

  useEffect(() => {
    setSupportsExport(
      typeof window !== 'undefined' &&
        'VideoEncoder' in window &&
        'VideoDecoder' in window &&
        Boolean(navigator.storage?.getDirectory),
    );
  }, []);

  useEffect(() => () => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
  }, [sourceUrl, resultUrl]);

  useEffect(() => () => {
    if (storageFileName) void removeTimelapseOutput(storageFileName);
  }, [storageFileName]);

  const finalDuration = useMemo(
    () => segments.filter((segment) => segment.include).reduce(
      (total, segment) => total + (segment.end - segment.start) / segment.speed,
      0,
    ),
    [segments],
  );

  const handleFiles = async (files: File[]) => {
    const nextFile = files[0];
    if (!nextFile) return;
    if (nextFile.size > MAX_TIMELAPSE_FILE_SIZE_BYTES) {
      setErrorMessage(ui.genericError);
      return;
    }

    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    if (storageFileName) void removeTimelapseOutput(storageFileName);
    const nextUrl = URL.createObjectURL(nextFile);
    setFile(nextFile);
    setMetadata(null);
    setSourceUrl(nextUrl);
    setResultUrl(null);
    setResultFile(null);
    setStorageFileName(null);
    setSegments([]);
    setSelectedSegmentId(null);
    setExportState('idle');
    setProgress(0);
    setErrorMessage('');
    trackEvent('tool_started', { tool: TOOL_ID.timelapseCreator, locale });
    trackEvent('file_uploaded', { tool: TOOL_ID.timelapseCreator, locale, file_type: 'video' });

    try {
      const details = await readTimelapseMetadata(nextFile);
      setMetadata(details);
      const initial = { id: makeId(), start: 0, end: details.durationInSeconds, speed: 4, include: true };
      setSegments([initial]);
      setSelectedSegmentId(initial.id);
    } catch {
      setErrorMessage(ui.readError);
      trackEvent('tool_error', { tool: TOOL_ID.timelapseCreator, locale, error_type: 'unsupported_format' });
    }
  };

  const splitAtPlayhead = () => {
    const selected = segments.find((segment) => segment.id === selectedSegmentId);
    if (!selected || playhead <= selected.start + 0.1 || playhead >= selected.end - 0.1) return;
    const left: TimelapseSegment = { ...selected, id: makeId(), end: playhead };
    const right: TimelapseSegment = { ...selected, id: makeId(), start: playhead };
    setSegments((current) => current.flatMap((segment) => segment.id === selected.id ? [left, right] : [segment]));
    setSelectedSegmentId(right.id);
  };

  const updateSegment = (id: string, patch: Partial<TimelapseSegment>) => {
    setSegments((current) => current.map((segment) => segment.id === id ? { ...segment, ...patch } : segment));
  };

  const speedUpAll = () => setSegments((current) => current.map((segment) => ({ ...segment, speed: 8 })));

  const runExport = async () => {
    if (!file || !metadata || !segments.length || exportState === 'processing') return;
    setExportState('processing');
    setProgress(0);
    setErrorMessage('');
    try {
      const result = await createTimelapseVideo(file, {
        segments,
        frameRate,
        quality,
        format,
        onProgress: setProgress,
        onLog: setStatusMessage,
      });
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultFile(result.file);
      setResultUrl(URL.createObjectURL(result.file));
      setStorageFileName(result.storageFileName);
      setExportState('done');
      trackEvent('tool_completed', { tool: TOOL_ID.timelapseCreator, locale, format });
    } catch (error) {
      const code = error instanceof TimelapseProcessingError ? error.code : 'processing_failed';
      setExportState('error');
      setErrorMessage(
        code === 'unsupported_codec' || code === 'webcodecs_unsupported'
          ? ui.unsupported
          : code === 'invalid_timeline'
            ? ui.invalid
            : code === 'storage_unavailable' || code === 'storage_quota'
              ? ui.storage
              : ui.genericError,
      );
      trackEvent('tool_error', {
        tool: TOOL_ID.timelapseCreator,
        locale,
        error_type: code === 'unsupported_codec' ? 'unsupported_format' : code === 'storage_quota' ? 'file_too_large' : 'processing_failed',
      });
    }
  };

  const downloadResult = () => {
    if (!resultFile) return;
    downloadBlob(resultFile, resultFile.name);
    trackEvent('result_downloaded', { tool: TOOL_ID.timelapseCreator, locale, format });
  };

  const clearFile = () => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    if (storageFileName) void removeTimelapseOutput(storageFileName);
    setFile(null);
    setMetadata(null);
    setSourceUrl(null);
    setResultUrl(null);
    setResultFile(null);
    setStorageFileName(null);
    setSegments([]);
    setExportState('idle');
    setErrorMessage('');
  };

  const activeSegment = segments.find((segment) => segment.id === selectedSegmentId);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-slate-800 bg-slate-950 p-0 text-white shadow-none">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-4 md:px-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-300 text-slate-950"><FastForward size={20} /></span>
            <div>
              <h3 className="font-semibold">{ui.title}</h3>
              <p className="text-sm text-slate-400">{ui.intro}</p>
            </div>
          </div>
          {file ? <Button variant="ghost" className="text-slate-300 hover:bg-white/10 hover:text-white" onClick={clearFile}><Trash2 size={16} className="mr-2" />{ui.removeFile}</Button> : null}
        </div>

        <div className="grid gap-6 p-5 md:grid-cols-[minmax(0,1.5fr)_minmax(260px,0.8fr)] md:p-7">
          <div className="min-w-0 space-y-4">
            {sourceUrl ? (
              <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
                <video
                  ref={videoRef}
                  src={sourceUrl}
                  controls
                  playsInline
                  className="aspect-video max-h-[480px] w-full object-contain"
                  onTimeUpdate={(event) => setPlayhead(event.currentTarget.currentTime)}
                  onLoadedMetadata={(event) => setPlayhead(event.currentTarget.currentTime)}
                />
              </div>
            ) : (
              <FileUploadDropzone
                label={ui.upload}
                helperText={ui.uploadHint}
                acceptedDescription="MP4, MOV, WebM, MKV"
                accept="video/*,.mp4,.mov,.m4v,.webm,.mkv"
                maxSize={MAX_TIMELAPSE_FILE_SIZE_BYTES}
                onFilesSelected={(selected) => void handleFiles(selected)}
                locale={locale}
              />
            )}

            {file && metadata ? (
              <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <div className="border-l-2 border-lime-300 pl-3"><div className="text-xs text-slate-400">{ui.sourceDuration}</div><div className="mt-1 font-medium">{formatDuration(metadata.durationInSeconds)}</div></div>
                <div className="border-l-2 border-sky-400 pl-3"><div className="text-xs text-slate-400">{ui.duration}</div><div className="mt-1 font-medium">{formatDuration(finalDuration)}</div></div>
                <div className="border-l-2 border-white/30 pl-3"><div className="text-xs text-slate-400">{ui.size}</div><div className="mt-1 font-medium">{formatBytes(file.size)}</div></div>
                <div className="border-l-2 border-white/30 pl-3"><div className="text-xs text-slate-400">{ui.resolution}</div><div className="mt-1 font-medium">{metadata.width}×{metadata.height}</div></div>
              </div>
            ) : null}

            {metadata && file ? (
              <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 md:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-semibold"><Film size={16} className="text-lime-300" />{ui.editor}</div>
                  <Button variant="secondary" className="h-9 border-white/15 bg-white/10 text-white hover:bg-white/15" onClick={splitAtPlayhead} disabled={!activeSegment || playhead <= (activeSegment?.start ?? 0) + 0.1 || playhead >= (activeSegment?.end ?? 0) - 0.1}><Scissors size={15} className="mr-2" />{ui.split}</Button>
                </div>
                <p className="text-xs leading-5 text-slate-400">{ui.splitHint}</p>

                <label className="block space-y-2 text-xs text-slate-400">
                  <span className="flex items-center justify-between"><span>{ui.playhead}</span><span className="font-mono text-white">{formatDuration(playhead)} / {formatDuration(metadata.durationInSeconds)}</span></span>
                  <input
                    type="range"
                    min={0}
                    max={metadata.durationInSeconds}
                    step={0.01}
                    value={Math.min(playhead, metadata.durationInSeconds)}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      setPlayhead(value);
                      if (videoRef.current) videoRef.current.currentTime = value;
                    }}
                    className="h-2 w-full cursor-pointer accent-lime-300"
                  />
                </label>

                <div className="flex h-10 w-full overflow-hidden rounded-lg border border-white/10 bg-slate-900" aria-label={ui.segments}>
                  {segments.map((segment, index) => (
                    <button
                      key={segment.id}
                      onClick={() => setSelectedSegmentId(segment.id)}
                      title={`${ui.segment} ${index + 1}: ${formatDuration(segment.start)}–${formatDuration(segment.end)} (${segment.speed}×)`}
                      className={`min-w-[12px] border-r border-slate-950/80 transition-colors ${segment.include ? 'bg-lime-300/90 hover:bg-lime-200' : 'bg-slate-700 hover:bg-slate-600'} ${selectedSegmentId === segment.id ? 'ring-2 ring-inset ring-white' : ''}`}
                      style={{ flexGrow: Math.max(0.01, segment.end - segment.start), flexBasis: 0 }}
                      aria-label={`${ui.segment} ${index + 1}`}
                    />
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold">{ui.segments}</h4>
                    <button onClick={speedUpAll} className="text-xs font-semibold text-lime-200 underline-offset-4 hover:underline"><FastForward size={13} className="mr-1 inline" />{ui.allFast}</button>
                  </div>
                  <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                    {segments.map((segment, index) => (
                      <div key={segment.id} onClick={() => setSelectedSegmentId(segment.id)} className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border p-3 transition-colors ${selectedSegmentId === segment.id ? 'border-lime-300/50 bg-lime-300/[0.07]' : 'border-white/10 bg-black/10'}`}>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-sm font-medium"><span className="text-xs text-slate-400">{ui.segment} {index + 1}</span><span className="font-mono text-xs text-slate-300">{formatDuration(segment.start)}–{formatDuration(segment.end)}</span></div>
                          <label className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                            <input type="checkbox" checked={segment.include} onChange={(event) => updateSegment(segment.id, { include: event.target.checked })} className="accent-lime-300" />
                            {segment.include ? ui.included : ui.removed}
                          </label>
                        </div>
                        <label className="space-y-1 text-xs text-slate-400">
                          <span>{ui.speed}</span>
                          <Select className="h-9 min-w-[94px] border-white/15 bg-slate-900 text-white" value={String(segment.speed)} onChange={(event) => updateSegment(segment.id, { speed: Number(event.target.value) })}>
                            {speedOptions.map((value) => <option key={value} value={value}>{value}×</option>)}
                          </Select>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {resultUrl && resultFile ? (
              <div className="space-y-3 border-t border-white/10 pt-5">
                <h4 className="flex items-center gap-2 text-sm font-semibold"><Video size={16} className="text-lime-300" />{ui.ready}</h4>
                <video src={resultUrl} controls playsInline className="aspect-video max-h-[420px] w-full rounded-xl bg-black object-contain" />
                <Button className="w-full bg-lime-300 text-slate-950 hover:bg-lime-200" onClick={downloadResult}><Download size={16} className="mr-2" />{ui.download}</Button>
              </div>
            ) : null}
          </div>

          <aside className="space-y-5 border-t border-white/10 pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 text-sm font-semibold"><Gauge size={16} className="text-lime-300" />{ui.output}</h4>
              <label className="block space-y-1.5 text-xs text-slate-400"><span>{ui.fps}</span><Select className="border-white/15 bg-slate-900 text-white" value={frameRate} onChange={(event) => setFrameRate(Number(event.target.value) as 24 | 30 | 60)}><option value={24}>24 fps</option><option value={30}>30 fps</option><option value={60}>60 fps</option></Select></label>
              <label className="block space-y-1.5 text-xs text-slate-400"><span>{ui.quality}</span><Select className="border-white/15 bg-slate-900 text-white" value={quality} onChange={(event) => setQuality(event.target.value as TimelapseQuality)}><option value="high">{ui.high}</option><option value="medium">{ui.medium}</option><option value="low">{ui.low}</option></Select></label>
              <label className="block space-y-1.5 text-xs text-slate-400"><span>{ui.format}</span><Select className="border-white/15 bg-slate-900 text-white" value={format} onChange={(event) => setFormat(event.target.value as TimelapseFormat)}><option value="mp4">MP4</option><option value="webm">WebM</option></Select></label>
              <p className="text-xs leading-5 text-slate-400">{ui.muted}</p>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-xs leading-5 text-slate-300"><p>{ui.local}</p><p className="mt-2 text-slate-500">{ui.warmup}</p></div>
            {!supportsExport ? <p role="status" className="text-xs leading-5 text-amber-200">{ui.warmup}</p> : null}
            {errorMessage ? <p role="alert" className="text-sm leading-5 text-rose-300">{errorMessage}</p> : null}

            {file && metadata ? (
              <div className="space-y-3">
                <Button className="w-full bg-lime-300 text-slate-950 hover:bg-lime-200" onClick={() => void runExport()} disabled={exportState === 'processing' || !supportsExport || !segments.some((segment) => segment.include)}>
                  {exportState === 'processing' ? <Loader2 size={16} className="mr-2 animate-spin" /> : <FastForward size={16} className="mr-2" />}
                  {exportState === 'processing' ? ui.exporting : ui.export}
                </Button>
                {exportState === 'processing' ? <div className="space-y-2"><div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-lime-300 transition-[width]" style={{ width: `${Math.max(2, progress * 100)}%` }} /></div><div className="flex justify-between gap-2 text-xs text-slate-400"><span>{ui.progress(progress)}</span><span>{statusMessage}</span></div></div> : null}
              </div>
            ) : <p className="flex min-h-20 items-center gap-3 text-sm leading-6 text-slate-400"><Film size={22} className="shrink-0 text-slate-600" />{ui.empty}</p>}
          </aside>
        </div>
      </Card>
    </div>
  );
}
