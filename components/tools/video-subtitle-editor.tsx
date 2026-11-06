'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Download, Loader2, Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type AppLocale } from '@/lib/i18n/config';
import { formatClockTime } from '@/lib/transcription/timestamps';
import { buildCaptionSegments } from '@/lib/transcription/caption-segments';
import { ShareResultButton } from '@/components/tools/share-result-button';
import { TOOL_ID } from '@/lib/analytics';
import type { TranscriptSegment } from '@/lib/transcription/transcription-types';

type CaptionPosition = 'bottom' | 'center' | 'top';
type CaptionFont = 'sans-serif' | 'serif' | 'monospace';

type CaptionSettings = {
  position: CaptionPosition;
  fontSize: number;
  color: string;
  font: CaptionFont;
  background: boolean;
};

type VideoSubtitleEditorProps = Readonly<{
  file: File;
  mediaUrl: string;
  segments: TranscriptSegment[];
  locale: AppLocale;
  onDownload?: (format: 'webm' | 'mp4') => void;
}>;

type ExportResources = {
  video: HTMLVideoElement;
  sourceUrl: string;
  recorder: MediaRecorder | null;
  stream: MediaStream | null;
  frameId: number | null;
};

const uiByLocale: Record<
  AppLocale,
  {
    title: string;
    intro: string;
    previewTitle: string;
    outputTitle: string;
    captionsTitle: string;
    settingsTitle: string;
    position: string;
    positions: Record<CaptionPosition, string>;
    size: string;
    color: string;
    font: string;
    fonts: Record<CaptionFont, string>;
    background: string;
    generate: string;
    cancel: string;
    download: string;
    ready: string;
    unsupported: string;
    processing: string;
    processingHint: string;
    editCaption: (index: number) => string;
    error: string;
  }
> = {
  'pt-br': {
    title: 'Legendar vídeo',
    intro:
      'Revise os textos e ajuste a aparência. A prévia acompanha a reprodução; a exportação é feita neste aparelho em tempo real.',
    previewTitle: 'Prévia',
    outputTitle: 'Vídeo legendado pronto',
    captionsTitle: 'Legendas com timestamps',
    settingsTitle: 'Aparência da legenda',
    position: 'Posição',
    positions: { bottom: 'Embaixo', center: 'Centro', top: 'Em cima' },
    size: 'Tamanho',
    color: 'Cor do texto',
    font: 'Fonte',
    fonts: { 'sans-serif': 'Sem serifa', serif: 'Com serifa', monospace: 'Monoespaçada' },
    background: 'Adicionar fundo escuro',
    generate: 'Gerar vídeo legendado',
    cancel: 'Cancelar',
    download: 'Baixar vídeo legendado',
    ready: 'Mantenha esta aba aberta durante a exportação. Vídeos longos levam mais tempo para renderizar.',
    unsupported:
      'Este navegador não consegue exportar vídeo com legendas gravadas. Você ainda pode baixar o arquivo SRT ou VTT acima.',
    processing: 'Exportando vídeo',
    processingHint: 'Mantenha esta aba aberta até a exportação terminar.',
    editCaption: (index) => `Editar legenda ${index}`,
    error: 'Não foi possível gerar o vídeo neste navegador. Tente um arquivo menor ou baixe SRT/VTT.',
  },
  en: {
    title: 'Add subtitles to video',
    intro:
      'Review the captions and adjust their appearance. The preview follows playback; export runs on this device in real time.',
    previewTitle: 'Preview',
    outputTitle: 'Subtitled video is ready',
    captionsTitle: 'Captions with timestamps',
    settingsTitle: 'Subtitle appearance',
    position: 'Position',
    positions: { bottom: 'Bottom', center: 'Center', top: 'Top' },
    size: 'Size',
    color: 'Text color',
    font: 'Font',
    fonts: { 'sans-serif': 'Sans serif', serif: 'Serif', monospace: 'Monospace' },
    background: 'Add dark background',
    generate: 'Create subtitled video',
    cancel: 'Cancel',
    download: 'Download subtitled video',
    ready: 'Keep this tab open during export. Long videos take more time to render.',
    unsupported:
      'This browser cannot export video with burned-in subtitles. You can still download the SRT or VTT file above.',
    processing: 'Exporting video',
    processingHint: 'Keep this tab open until the export is finished.',
    editCaption: (index) => `Edit caption ${index}`,
    error: 'Could not create the video in this browser. Try a smaller file or download SRT/VTT.',
  },
  es: {
    title: 'Agregar subtítulos al video',
    intro:
      'Revisa los textos y ajusta su apariencia. La vista previa sigue la reproducción; la exportación se procesa en este dispositivo en tiempo real.',
    previewTitle: 'Vista previa',
    outputTitle: 'Video subtitulado listo',
    captionsTitle: 'Subtítulos con marcas de tiempo',
    settingsTitle: 'Apariencia de los subtítulos',
    position: 'Posición',
    positions: { bottom: 'Abajo', center: 'Centro', top: 'Arriba' },
    size: 'Tamaño',
    color: 'Color del texto',
    font: 'Fuente',
    fonts: { 'sans-serif': 'Sin serifa', serif: 'Con serifa', monospace: 'Monoespaciada' },
    background: 'Agregar fondo oscuro',
    generate: 'Crear video subtitulado',
    cancel: 'Cancelar',
    download: 'Descargar video subtitulado',
    ready: 'Mantén esta pestaña abierta durante la exportación. Los videos largos tardan más en procesarse.',
    unsupported:
      'Este navegador no puede exportar videos con subtítulos integrados. Aún puedes descargar el archivo SRT o VTT arriba.',
    processing: 'Exportando video',
    processingHint: 'Mantén esta pestaña abierta hasta que termine la exportación.',
    editCaption: (index) => `Editar subtítulo ${index}`,
    error: 'No se pudo crear el video en este navegador. Prueba un archivo más pequeño o descarga SRT/VTT.',
  },
  zh: {
    title: '为视频添加字幕',
    intro: '检查字幕并调整外观。视频会在此设备上实时处理；较长的视频可能需要几分钟。',
    previewTitle: '预览',
    outputTitle: '字幕视频已准备好',
    captionsTitle: '带时间戳的字幕',
    settingsTitle: '字幕外观',
    position: '位置',
    positions: { bottom: '底部', center: '中间', top: '顶部' },
    size: '大小',
    color: '文字颜色',
    font: '字体',
    fonts: { 'sans-serif': '无衬线', serif: '衬线', monospace: '等宽' },
    background: '添加深色背景',
    generate: '生成带字幕的视频',
    cancel: '取消',
    download: '下载带字幕的视频',
    ready: '预览已就绪。下载后，字幕会嵌入视频画面。',
    unsupported: '此浏览器无法导出嵌入字幕的视频。你仍可下载上方的 SRT 或 VTT 文件。',
    processing: '正在导出视频',
    processingHint: '请保持此标签页打开，直到导出完成。',
    editCaption: (index) => `编辑字幕 ${index}`,
    error: '此浏览器无法生成视频。请尝试较小的文件，或下载 SRT/VTT。',
  },
};

const positionClass: Record<CaptionPosition, string> = {
  bottom: 'bottom-[7%] left-1/2 -translate-x-1/2',
  center: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
  top: 'left-1/2 top-[7%] -translate-x-1/2',
};

const fontFamily: Record<CaptionFont, string> = {
  'sans-serif': 'Arial, Helvetica, sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  monospace: 'ui-monospace, SFMono-Regular, Menlo, monospace',
};

const canRecordVideo = (): boolean => {
  if (
    typeof window === 'undefined' ||
    typeof MediaRecorder === 'undefined' ||
    typeof MediaRecorder.isTypeSupported !== 'function' ||
    typeof HTMLCanvasElement.prototype.captureStream !== 'function'
  ) {
    return false;
  }

  const media = document.createElement('video') as HTMLVideoElement & {
    captureStream?: () => MediaStream;
    mozCaptureStream?: () => MediaStream;
  };

  return (
    (typeof media.captureStream === 'function' || typeof media.mozCaptureStream === 'function') &&
    (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus') ||
      MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus') ||
      MediaRecorder.isTypeSupported('video/webm') ||
      MediaRecorder.isTypeSupported('video/mp4'))
  );
};

const selectRecorderMimeType = (): string => {
  const candidates = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
    'video/mp4',
  ];

  return candidates.find((mimeType) => MediaRecorder.isTypeSupported(mimeType)) ?? '';
};

const wrapText = (context: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (current && context.measureText(next).width > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
};

const drawCaption = (
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  text: string,
  settings: CaptionSettings,
): void => {
  if (!text.trim()) {
    return;
  }

  let fontSize = settings.fontSize * Math.max(1, canvas.width / 360);
  const maxTextWidth = canvas.width * 0.86;
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  let lines: string[] = [];
  let padding = 0;
  let lineHeight = 0;
  let blockHeight = 0;

  for (let attempt = 0; attempt < 4; attempt += 1) {
    context.font = `600 ${fontSize}px ${fontFamily[settings.font]}`;
    padding = fontSize * 0.45;
    lineHeight = fontSize * 1.2;
    lines = wrapText(context, text, maxTextWidth - padding * 2);
    blockHeight = lineHeight * lines.length;

    const fittedFontSize = fontSize * Math.min(1, (canvas.height * 0.68) / Math.max(blockHeight, 1));
    if (fittedFontSize >= fontSize - 0.5) {
      break;
    }

    fontSize = Math.max(settings.fontSize * 0.55, fittedFontSize);
  }

  padding = fontSize * 0.45;
  lineHeight = fontSize * 1.2;
  context.font = `600 ${fontSize}px ${fontFamily[settings.font]}`;
  lines = wrapText(context, text, maxTextWidth - padding * 2);
  blockHeight = lineHeight * lines.length;
  const widestLine = Math.min(
    maxTextWidth,
    Math.max(...lines.map((line) => context.measureText(line).width)),
  );
  const blockWidth = widestLine + padding * 2;
  const x = canvas.width / 2;
  const y =
    settings.position === 'top'
      ? canvas.height * 0.08 + blockHeight / 2
      : settings.position === 'center'
        ? canvas.height / 2
        : canvas.height * 0.92 - blockHeight / 2;

  if (settings.background) {
    const left = x - blockWidth / 2;
    const top = y - blockHeight / 2 - padding * 0.45;
    const width = blockWidth;
    const height = blockHeight + padding * 0.9;
    context.fillStyle = 'rgba(0, 0, 0, 0.72)';
    context.beginPath();
    context.rect(left, top, width, height);
    context.fill();
  }

  context.shadowColor = 'rgba(0, 0, 0, 0.9)';
  context.shadowBlur = fontSize * 0.12;
  context.lineWidth = Math.max(2, fontSize * 0.1);
  context.strokeStyle = 'rgba(0, 0, 0, 0.88)';
  context.fillStyle = settings.color;
  lines.forEach((line, index) => {
    const lineY = y - blockHeight / 2 + lineHeight * (index + 0.5);
    context.strokeText(line, x, lineY, maxTextWidth);
    context.fillText(line, x, lineY, maxTextWidth);
  });
  context.shadowBlur = 0;
};

const getCaptionAtTime = (captions: TranscriptSegment[], time: number): string =>
  captions.find((caption) => time >= caption.start && time < caption.end)?.text ?? '';

const makeOutputName = (fileName: string, extension: string): string => {
  const baseName = fileName
    .replace(/\.[^./\\]+$/, '')
    .trim()
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .replaceAll(/[^a-zA-Z0-9-_]+/g, '-')
    .replaceAll(/-+/g, '-')
    .replaceAll(/^-+|-+$/g, '') || 'video';

  return `${baseName}-legendado.${extension}`;
};

export function VideoSubtitleEditor({ file, mediaUrl, segments, locale, onDownload }: VideoSubtitleEditorProps) {
  const ui = uiByLocale[locale];
  const initialCaptions = useMemo(() => buildCaptionSegments(segments), [segments]);
  const [captions, setCaptions] = useState(initialCaptions);
  const [settings, setSettings] = useState<CaptionSettings>({
    position: 'bottom',
    fontSize: 24,
    color: '#ffffff',
    font: 'sans-serif',
    background: true,
  });
  const [currentTime, setCurrentTime] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<{ url: string; name: string; file: File } | null>(null);
  const resourcesRef = useRef<ExportResources | null>(null);
  const cancelRequestedRef = useRef(false);

  useEffect(
    () => () => {
      cancelRequestedRef.current = true;
      const resources = resourcesRef.current;
      if (resources) {
        resources.video.pause();
        if (resources.recorder?.state === 'recording') {
          resources.recorder.stop();
        }
        resources.stream?.getTracks().forEach((track) => track.stop());
        URL.revokeObjectURL(resources.sourceUrl);
      }
    },
    [],
  );

  useEffect(() => {
    if (!output) {
      return;
    }

    return () => URL.revokeObjectURL(output.url);
  }, [output]);

  const activeCaption = getCaptionAtTime(captions, currentTime);

  const updateSettings = (patch: Partial<CaptionSettings>) => {
    setSettings((current) => ({ ...current, ...patch }));
    setOutput(null);
  };

  const updateCaption = (index: number, text: string) => {
    setCaptions((current) => current.map((caption, itemIndex) =>
      itemIndex === index ? { ...caption, text } : caption,
    ));
    setOutput(null);
  };

  const cancelExport = () => {
    cancelRequestedRef.current = true;
    const resources = resourcesRef.current;
    resources?.video.pause();
    if (resources?.recorder?.state === 'recording') {
      resources.recorder.stop();
    }
  };

  const generateVideo = async () => {
    if (!canRecordVideo()) {
      setError(ui.unsupported);
      return;
    }

    setError(null);
    setOutput(null);
    setProgress(0);
    setIsExporting(true);
    cancelRequestedRef.current = false;

    const sourceUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = sourceUrl;
    video.preload = 'auto';
    video.playsInline = true;
    video.controls = false;
    const resources: ExportResources = {
      video,
      sourceUrl,
      recorder: null,
      stream: null,
      frameId: null,
    };
    resourcesRef.current = resources;

    try {
      const initialPlayback = video.play();
      await initialPlayback;
      if (cancelRequestedRef.current) {
        throw new Error('cancelled');
      }

      const mimeType = selectRecorderMimeType();
      if (!mimeType) {
        throw new Error('unsupported');
      }

      video.pause();
      video.currentTime = 0;

      const canvas = document.createElement('canvas');
      const scale = Math.min(1, 1920 / video.videoWidth, 1080 / video.videoHeight);
      canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
      canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
      const context = canvas.getContext('2d');
      if (!context || typeof canvas.captureStream !== 'function') {
        throw new Error('unsupported');
      }

      const canvasStream = canvas.captureStream(30);
      const videoWithCapture = video as HTMLVideoElement & {
        captureStream?: () => MediaStream;
        mozCaptureStream?: () => MediaStream;
      };
      const sourceStream = videoWithCapture.captureStream?.() ?? videoWithCapture.mozCaptureStream?.();
      if (!sourceStream) {
        throw new Error('unsupported');
      }

      sourceStream.getAudioTracks().forEach((track) => canvasStream.addTrack(track));
      resources.stream = canvasStream;

      const recorder = new MediaRecorder(canvasStream, {
        mimeType,
        videoBitsPerSecond: canvas.width >= 1280 ? 5_000_000 : 2_500_000,
        audioBitsPerSecond: 128_000,
      });
      resources.recorder = recorder;
      const chunks: BlobPart[] = [];
      const blobPromise = new Promise<Blob>((resolve, reject) => {
        recorder.addEventListener('dataavailable', (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        });
        recorder.addEventListener('error', () => reject(new Error('recording')));
        recorder.addEventListener('stop', () => resolve(new Blob(chunks, { type: recorder.mimeType })));
      });

      const sourceTrack = sourceStream.getVideoTracks()[0];
      sourceTrack?.stop();
      sourceStream.getTracks().filter((track) => track.kind === 'video').forEach((track) => track.stop());

      let lastProgressUpdate = 0;
      const renderFrame = () => {
        if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          drawCaption(context, canvas, getCaptionAtTime(captions, video.currentTime), settings);
          const now = performance.now();
          if (now - lastProgressUpdate > 250) {
            const percent = video.duration > 0 ? Math.round((video.currentTime / video.duration) * 100) : 0;
            setProgress(Math.min(99, percent));
            setCurrentTime(video.currentTime);
            lastProgressUpdate = now;
          }
        }

        if (video.ended) {
          if (recorder.state === 'recording') {
            recorder.stop();
          }
          return;
        }

        if (recorder.state === 'recording') {
          resources.frameId = requestAnimationFrame(renderFrame);
        }
      };

      recorder.start(1000);
      await video.play();
      renderFrame();

      const blob = await blobPromise;
      if (cancelRequestedRef.current) {
        throw new Error('cancelled');
      }

      if (blob.size === 0) {
        throw new Error('empty');
      }

      const extension = recorder.mimeType.includes('mp4') ? 'mp4' : 'webm';
      const name = makeOutputName(file.name, extension);
      setOutput({ url: URL.createObjectURL(blob), name, file: new File([blob], name, { type: blob.type }) });
      setProgress(100);
    } catch (error_) {
      if (!cancelRequestedRef.current) {
        setError(error_ instanceof Error && error_.message === 'unsupported' ? ui.unsupported : ui.error);
      }
    } finally {
      const currentResources = resourcesRef.current;
      if (currentResources) {
        if (currentResources.frameId !== null) {
          cancelAnimationFrame(currentResources.frameId);
        }
        currentResources.video.pause();
        currentResources.stream?.getTracks().forEach((track) => track.stop());
        if (currentResources.recorder?.state === 'recording') {
          currentResources.recorder.stop();
        }
        URL.revokeObjectURL(currentResources.sourceUrl);
      }
      resourcesRef.current = null;
      setIsExporting(false);
      if (cancelRequestedRef.current) {
        cancelRequestedRef.current = false;
      }
    }
  };

  const downloadVideo = () => {
    if (!output) {
      return;
    }

    const anchor = document.createElement('a');
    anchor.href = output.url;
    anchor.download = output.name;
    anchor.click();
    onDownload?.(output.name.endsWith('.mp4') ? 'mp4' : 'webm');
  };

  return (
    <section className="space-y-4 border-t border-slate-200 pt-5" aria-labelledby="video-caption-editor-title">
      <div className="space-y-1">
        <h3 id="video-caption-editor-title" className="text-base font-semibold text-slate-900">
          {ui.title}
        </h3>
        <p className="text-base leading-7 text-slate-700">{ui.intro}</p>
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(19rem,0.85fr)]">
        <div className="min-w-0 space-y-2">
          <h4 className="text-sm font-semibold text-slate-800">{ui.previewTitle}</h4>
          <div className="relative min-w-0 overflow-hidden rounded-lg bg-black">
            <video
              src={mediaUrl}
              controls
              playsInline
              preload="metadata"
              onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
              className="block max-h-[60vh] w-full object-contain"
            />
            <p
              aria-live="polite"
              className={`pointer-events-none absolute max-w-[86%] whitespace-pre-wrap rounded px-2 py-1 text-center font-semibold leading-tight shadow-sm ${positionClass[settings.position]}`}
              style={{
                color: settings.color,
                fontFamily: fontFamily[settings.font],
                fontSize: `${settings.fontSize}px`,
                backgroundColor: settings.background ? 'rgba(0, 0, 0, 0.72)' : 'transparent',
                textShadow: '0 1px 3px rgba(0,0,0,.95), 1px 0 2px rgba(0,0,0,.9), -1px 0 2px rgba(0,0,0,.9)',
              }}
            >
              {activeCaption}
            </p>
          </div>
          <p className="text-xs leading-5 text-slate-600">{ui.ready}</p>
        </div>

        <div className="min-w-0 space-y-4">
          <fieldset className="min-w-0 space-y-2">
            <legend className="text-sm font-semibold text-slate-800">{ui.settingsTitle}</legend>
            <div className="grid grid-cols-3 gap-2" role="group" aria-label={ui.position}>
              {(Object.keys(ui.positions) as CaptionPosition[]).map((position) => (
                <Button
                  key={position}
                  type="button"
                  variant={settings.position === position ? 'primary' : 'secondary'}
                  aria-pressed={settings.position === position}
                  onClick={() => updateSettings({ position })}
                  className="min-w-0 min-h-11"
                >
                  {ui.positions[position]}
                </Button>
              ))}
            </div>
          </fieldset>

          <div className="grid min-w-0 grid-cols-2 gap-3">
            <label className="min-w-0 space-y-1.5">
              <span className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-700">
                <span>{ui.size}</span>
                <span className="font-normal tabular-nums">{settings.fontSize}px</span>
              </span>
              <input
                type="range"
                min="16"
                max="42"
                step="2"
                value={settings.fontSize}
                onChange={(event) => updateSettings({ fontSize: Number(event.target.value) })}
                className="h-11 w-full accent-brand-600"
                aria-label={ui.size}
              />
            </label>

            <label className="min-w-0 space-y-1.5">
              <span className="block text-xs font-semibold text-slate-700">{ui.color}</span>
              <input
                type="color"
                value={settings.color}
                onChange={(event) => updateSettings({ color: event.target.value })}
                className="h-11 w-full cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
                aria-label={ui.color}
              />
            </label>

            <label className="col-span-2 min-w-0 space-y-1.5">
              <span className="block text-xs font-semibold text-slate-700">{ui.font}</span>
              <select
                value={settings.font}
                onChange={(event) => updateSettings({ font: event.target.value as CaptionFont })}
                className="h-11 w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
              >
                {(Object.keys(ui.fonts) as CaptionFont[]).map((font) => (
                  <option key={font} value={font}>
                    {ui.fonts[font]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex min-h-11 items-center gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={settings.background}
              onChange={(event) => updateSettings({ background: event.target.checked })}
              className="h-4 w-4 shrink-0 accent-brand-600"
            />
            {ui.background}
          </label>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-800">{ui.captionsTitle}</h4>
            <ol className="max-h-64 min-w-0 space-y-2 overflow-y-auto pr-1">
              {captions.map((caption, index) => (
                <li key={`${caption.start}-${index}`} className="min-w-0 space-y-1">
                  <label className="block text-xs font-semibold text-slate-600" htmlFor={`caption-text-${index}`}>
                    {formatClockTime(caption.start)} – {formatClockTime(caption.end)}
                  </label>
                  <textarea
                    id={`caption-text-${index}`}
                    value={caption.text}
                    onChange={(event) => updateCaption(index, event.target.value)}
                    aria-label={ui.editCaption(index + 1)}
                    rows={2}
                    className="block min-h-16 w-full min-w-0 resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-base leading-6 text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {isExporting ? (
        <div className="space-y-2 rounded-lg border border-brand-200 bg-brand-50 p-3" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center text-sm font-semibold text-brand-900">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              {ui.processing} · {progress}%
            </p>
            <Button variant="secondary" onClick={cancelExport}>
              <X className="mr-1.5 h-4 w-4" aria-hidden="true" />
              {ui.cancel}
            </Button>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-brand-600 transition-[width]" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-slate-700">{ui.processingHint}</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => void generateVideo()} disabled={captions.length === 0}>
            <Play className="mr-1.5 h-4 w-4" aria-hidden="true" />
            {ui.generate}
          </Button>
          {output ? (
            <>
              <Button variant="secondary" onClick={downloadVideo}>
                <Download className="mr-1.5 h-4 w-4" aria-hidden="true" />
                {ui.download}
              </Button>
              <ShareResultButton file={output.file} locale={locale} tool={TOOL_ID.audioVideoTranscription} format={output.name.endsWith('.mp4') ? 'mp4' : 'webm'} />
            </>
          ) : null}
        </div>
      )}

      {output ? (
        <div className="max-w-2xl space-y-2" role="status">
          <h4 className="text-sm font-semibold text-emerald-800">
            <Check className="mr-1.5 inline h-4 w-4" aria-hidden="true" />
            {ui.outputTitle}
          </h4>
          <video
            src={output.url}
            controls
            playsInline
            preload="metadata"
            className="block max-h-[60vh] w-full rounded-lg border border-slate-200 bg-black object-contain"
          />
          <p className="break-all text-xs text-slate-600">{output.name}</p>
        </div>
      ) : null}

      {error ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
