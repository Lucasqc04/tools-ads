'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { trackEvent, TOOL_ID } from '@/lib/analytics';
import { cn } from '@/lib/cn';
import type { AppLocale } from '@/lib/i18n/config';
import { downloadBlob } from '@/lib/download';
import { formatBytes } from '@/lib/file-size';
import {
  AnalyzeError,
  analyzeVideoUrl,
  buildDownloadFileName,
  downloadableFormats,
  DownloadError,
  downloadMedia,
  estimateSizeBytes,
  formatDuration,
} from '@/lib/video-downloader/client';
import { guessPlatformFromText, platformDisplayNames } from '@/lib/video-downloader/platforms';
import type { ExtractionNote, ExtractionSuccess, VideoFormat, VideoPlatformId } from '@/lib/video-downloader/types';

type VideoDownloaderToolProps = Readonly<{
  locale?: AppLocale;
  /** Child pages pass their platform so the field shows a matching example. */
  platform?: VideoPlatformId;
  placeholder?: string;
  hint?: string;
}>;

type Status = 'idle' | 'analyzing' | 'ready' | 'downloading' | 'converting' | 'done' | 'error';

type Ui = {
  inputLabel: string;
  defaultPlaceholder: string;
  paste: string;
  analyze: string;
  analyzing: string;
  clear: string;
  detected: (name: string) => string;
  unsupportedHint: string;
  qualityLabel: string;
  noAudio: string;
  estimate: (size: string) => string;
  download: (quality: string) => string;
  downloadAudio: string;
  openVideo: string;
  openHint: string;
  downloading: string;
  converting: string;
  cancel: string;
  cancelled: string;
  saved: string;
  by: string;
  duration: string;
  corsBlocked: string;
  openFallback: string;
  tooLarge: string;
  downloadFailed: string;
  noAudioTrack: string;
  notes: Record<ExtractionNote, string>;
  errors: Record<string, string>;
};

const en: Ui = {
  inputLabel: 'Video link',
  defaultPlaceholder: 'Paste a link from X (Twitter) or Pinterest',
  paste: 'Paste',
  analyze: 'Analyze link',
  analyzing: 'Analyzing...',
  clear: 'Clear',
  detected: (name) => `Detected: ${name}`,
  unsupportedHint: 'This link does not look like a supported platform (X or Pinterest).',
  qualityLabel: 'Quality',
  noAudio: 'no audio',
  estimate: (size) => `≈ ${size}`,
  download: (quality) => (quality ? `Download MP4 (${quality})` : 'Download MP4'),
  downloadAudio: 'Extract audio (MP3)',
  openVideo: 'Open video',
  openHint: 'This platform does not allow in-page downloads. The file opens in a new tab: save it from the player menu or with a right click.',
  downloading: 'Downloading',
  converting: 'Converting audio on your device',
  cancel: 'Cancel',
  cancelled: 'Cancelled. Nothing was saved.',
  saved: 'Done. The file was saved to your device.',
  by: 'by',
  duration: 'Duration',
  corsBlocked: 'The platform did not allow the browser to download this file directly. We do not route videos through our server.',
  openFallback: 'Open the file in a new tab',
  tooLarge: 'This file is too large to download inside the browser.',
  downloadFailed: 'The platform refused the download. The video may have been removed.',
  noAudioTrack: 'No audio track was found in this video.',
  notes: {
    multiple_media_only_first: 'This post has more than one video. Only the first one is listed.',
    no_cors_open_only: 'Opens the original file in a new tab.',
    gif_without_audio: 'Animated GIFs have no sound.',
  },
  errors: {
    invalid_url: 'Paste a valid link to a public post.',
    unsupported_platform: 'This platform is not supported yet. Supported: X (Twitter) and Pinterest.',
    media_unavailable: 'The post is unavailable. It may be private, deleted or require login.',
    no_video_found: 'No downloadable video was found in this link.',
    rate_limited: 'Too many requests. Wait a few seconds and try again.',
    timeout: 'The platform took too long to respond. Try again.',
    access_blocked: 'The platform blocked access to this content.',
    upstream_error: 'The platform returned an unexpected response. Try again later.',
    bad_request: 'Invalid request. Reload the page and try again.',
    network: 'Connection problem. Check your internet and try again.',
  },
};

const ptBr: Ui = {
  inputLabel: 'Link do vídeo',
  defaultPlaceholder: 'Cole um link do X (Twitter) ou do Pinterest',
  paste: 'Colar',
  analyze: 'Analisar link',
  analyzing: 'Analisando...',
  clear: 'Limpar',
  detected: (name) => `Detectado: ${name}`,
  unsupportedHint: 'Este link não parece ser de uma plataforma aceita (X ou Pinterest).',
  qualityLabel: 'Qualidade',
  noAudio: 'sem áudio',
  estimate: (size) => `≈ ${size}`,
  download: (quality) => (quality ? `Baixar MP4 (${quality})` : 'Baixar MP4'),
  downloadAudio: 'Extrair áudio (MP3)',
  openVideo: 'Abrir vídeo',
  openHint: 'Esta plataforma não permite baixar dentro da página. O arquivo abre em uma nova aba: salve pelo menu do player ou com o botão direito.',
  downloading: 'Baixando',
  converting: 'Convertendo o áudio no seu aparelho',
  cancel: 'Cancelar',
  cancelled: 'Cancelado. Nada foi salvo.',
  saved: 'Pronto. O arquivo foi salvo no seu aparelho.',
  by: 'por',
  duration: 'Duração',
  corsBlocked: 'A plataforma não permitiu que o navegador baixasse este arquivo diretamente. Não passamos vídeos pelo nosso servidor.',
  openFallback: 'Abrir o arquivo em uma nova aba',
  tooLarge: 'Este arquivo é grande demais para baixar dentro do navegador.',
  downloadFailed: 'A plataforma recusou o download. O vídeo pode ter sido removido.',
  noAudioTrack: 'Não foi encontrada faixa de áudio neste vídeo.',
  notes: {
    multiple_media_only_first: 'Este post tem mais de um vídeo. Só o primeiro aparece na lista.',
    no_cors_open_only: 'Abre o arquivo original em uma nova aba.',
    gif_without_audio: 'GIFs animados não têm som.',
  },
  errors: {
    invalid_url: 'Cole um link válido de um post público.',
    unsupported_platform: 'Esta plataforma ainda não é aceita. Disponíveis: X (Twitter) e Pinterest.',
    media_unavailable: 'O post não está disponível. Pode ser privado, ter sido apagado ou exigir login.',
    no_video_found: 'Nenhum vídeo para baixar foi encontrado neste link.',
    rate_limited: 'Muitas requisições. Aguarde alguns segundos e tente de novo.',
    timeout: 'A plataforma demorou demais para responder. Tente novamente.',
    access_blocked: 'A plataforma bloqueou o acesso a este conteúdo.',
    upstream_error: 'A plataforma retornou uma resposta inesperada. Tente mais tarde.',
    bad_request: 'Requisição inválida. Recarregue a página e tente de novo.',
    network: 'Problema de conexão. Verifique a internet e tente novamente.',
  },
};

const es: Ui = {
  inputLabel: 'Enlace del video',
  defaultPlaceholder: 'Pega un enlace de X (Twitter) o Pinterest',
  paste: 'Pegar',
  analyze: 'Analizar enlace',
  analyzing: 'Analizando...',
  clear: 'Limpiar',
  detected: (name) => `Detectado: ${name}`,
  unsupportedHint: 'Este enlace no parece ser de una plataforma compatible (X o Pinterest).',
  qualityLabel: 'Calidad',
  noAudio: 'sin audio',
  estimate: (size) => `≈ ${size}`,
  download: (quality) => (quality ? `Descargar MP4 (${quality})` : 'Descargar MP4'),
  downloadAudio: 'Extraer audio (MP3)',
  openVideo: 'Abrir video',
  openHint: 'Esta plataforma no permite descargar dentro de la página. El archivo se abre en una pestaña nueva: guárdalo desde el menú del reproductor o con clic derecho.',
  downloading: 'Descargando',
  converting: 'Convirtiendo el audio en tu dispositivo',
  cancel: 'Cancelar',
  cancelled: 'Cancelado. No se guardó nada.',
  saved: 'Listo. El archivo se guardó en tu dispositivo.',
  by: 'por',
  duration: 'Duración',
  corsBlocked: 'La plataforma no permitió que el navegador descargara este archivo directamente. No pasamos videos por nuestro servidor.',
  openFallback: 'Abrir el archivo en una pestaña nueva',
  tooLarge: 'Este archivo es demasiado grande para descargarlo dentro del navegador.',
  downloadFailed: 'La plataforma rechazó la descarga. Puede que el video se haya eliminado.',
  noAudioTrack: 'No se encontró pista de audio en este video.',
  notes: {
    multiple_media_only_first: 'Esta publicación tiene más de un video. Solo se lista el primero.',
    no_cors_open_only: 'Abre el archivo original en una pestaña nueva.',
    gif_without_audio: 'Los GIF animados no tienen sonido.',
  },
  errors: {
    invalid_url: 'Pega un enlace válido de una publicación pública.',
    unsupported_platform: 'Esta plataforma aún no es compatible. Disponibles: X (Twitter) y Pinterest.',
    media_unavailable: 'La publicación no está disponible. Puede ser privada, borrada o exigir inicio de sesión.',
    no_video_found: 'No se encontró ningún video descargable en este enlace.',
    rate_limited: 'Demasiadas solicitudes. Espera unos segundos e inténtalo de nuevo.',
    timeout: 'La plataforma tardó demasiado en responder. Inténtalo de nuevo.',
    access_blocked: 'La plataforma bloqueó el acceso a este contenido.',
    upstream_error: 'La plataforma devolvió una respuesta inesperada. Inténtalo más tarde.',
    bad_request: 'Solicitud no válida. Recarga la página e inténtalo de nuevo.',
    network: 'Problema de conexión. Revisa tu internet e inténtalo de nuevo.',
  },
};

const uiByLocale: Record<AppLocale, Ui> = { 'pt-br': ptBr, en, es, zh: en };

const ANALYZE_TIMEOUT_MS = 20_000;

export function VideoDownloaderTool({ locale = 'pt-br', platform, placeholder, hint }: VideoDownloaderToolProps) {
  const ui = uiByLocale[locale];
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<ExtractionSuccess | null>(null);
  const [selectedId, setSelectedId] = useState('');
  const [progress, setProgress] = useState<{ received: number; total: number | null } | null>(null);
  const [audioPercent, setAudioPercent] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [fallbackUrl, setFallbackUrl] = useState('');

  const abortRef = useRef<AbortController | null>(null);
  const runIdRef = useRef(0);
  const startedTrackedRef = useRef(false);

  const detected = useMemo(() => guessPlatformFromText(input), [input]);
  const formats = useMemo(() => (result ? downloadableFormats(result) : []), [result]);
  const selected: VideoFormat | undefined = formats.find((format) => format.id === selectedId) ?? formats[0];

  useEffect(
    () => () => {
      abortRef.current?.abort();
    },
    [],
  );

  const fail = useCallback(
    (key: string, text: string) => {
      setStatus('error');
      setMessage(text);
      trackEvent('tool_error', { tool: TOOL_ID.videoDownloader, locale, error_type: key });
    },
    [locale],
  );

  const analyze = useCallback(async () => {
    const value = input.trim();
    if (!value) {
      fail('invalid_url', ui.errors.invalid_url);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const runId = ++runIdRef.current;
    const timer = window.setTimeout(() => controller.abort(), ANALYZE_TIMEOUT_MS);

    setStatus('analyzing');
    setMessage('');
    setFallbackUrl('');
    setResult(null);
    setProgress(null);

    if (!startedTrackedRef.current) {
      startedTrackedRef.current = true;
      trackEvent('tool_started', { tool: TOOL_ID.videoDownloader, locale, platform: guessPlatformFromText(value) ?? 'unknown' });
    }

    try {
      const extraction = await analyzeVideoUrl(value, controller.signal);
      if (runId !== runIdRef.current) return;
      setResult(extraction);
      setSelectedId(downloadableFormats(extraction)[0]?.id ?? '');
      setStatus('ready');
    } catch (error) {
      if (runId !== runIdRef.current) return;
      const code = error instanceof AnalyzeError ? error.code : 'upstream_error';
      fail(code, ui.errors[code] ?? ui.errors.upstream_error);
    } finally {
      window.clearTimeout(timer);
    }
  }, [fail, input, locale, ui]);

  const pasteFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setInput(text.trim());
    } catch {
      // Clipboard access can be denied; the user can still paste manually.
    }
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    runIdRef.current += 1;
    setInput('');
    setResult(null);
    setStatus('idle');
    setMessage('');
    setFallbackUrl('');
    setProgress(null);
    setAudioPercent(null);
  }, []);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setStatus('ready');
    setProgress(null);
    setAudioPercent(null);
    setMessage(ui.cancelled);
  }, [ui.cancelled]);

  const startDownload = useCallback(
    async (audioOnly: boolean) => {
      if (!result || !selected) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setStatus('downloading');
      setMessage('');
      setFallbackUrl('');
      setProgress({ received: 0, total: null });
      setAudioPercent(null);
      const platformId = result.platform;
      const nameParts = { platform: platformId, title: result.title, quality: selected.quality };

      try {
        const blob = await downloadMedia(selected, {
          signal: controller.signal,
          onProgress: (value) => setProgress({ received: value.receivedBytes, total: value.totalBytes }),
        });

        if (audioOnly) {
          setStatus('converting');
          setAudioPercent(0);
          const { extractAudioTracksFromMedia } = await import('@/lib/audio-editor');
          const outputs = await extractAudioTracksFromMedia(new File([blob], 'video.mp4', { type: blob.type }), {
            outputFormat: 'mp3',
            maxAudioStreams: 1,
            onProgress: (event) => setAudioPercent(Math.round(event.progress * 100)),
          });
          if (controller.signal.aborted) return;
          downloadBlob(outputs[0].file, buildDownloadFileName({ ...nameParts, quality: undefined }, 'mp3'));
        } else {
          downloadBlob(blob, buildDownloadFileName(nameParts, 'mp4'));
        }

        setStatus('done');
        setProgress(null);
        setAudioPercent(null);
        setMessage(ui.saved);
        trackEvent('result_downloaded', { tool: TOOL_ID.videoDownloader, locale, platform: platformId, format: audioOnly ? 'mp3' : 'mp4' });
        trackEvent('tool_completed', { tool: TOOL_ID.videoDownloader, locale, platform: platformId, mode: audioOnly ? 'audio' : 'video' });
      } catch (error) {
        if (controller.signal.aborted) return;
        setProgress(null);
        setAudioPercent(null);

        if (error instanceof DownloadError) {
          if (error.kind === 'blocked') {
            setFallbackUrl(selected.url);
            fail('cors_blocked', ui.corsBlocked);
          } else if (error.kind === 'too_large') {
            fail('file_too_large', ui.tooLarge);
          } else {
            fail('download_failed', ui.downloadFailed);
          }
          return;
        }

        const noAudio = error instanceof Error && /audio/i.test(error.message);
        fail(noAudio ? 'no_audio_track' : 'processing_failed', noAudio ? ui.noAudioTrack : ui.downloadFailed);
      }
    },
    [fail, locale, result, selected, ui],
  );

  const busy = status === 'analyzing' || status === 'downloading' || status === 'converting';
  const percent = progress?.total ? Math.min(100, Math.round((progress.received / progress.total) * 100)) : null;
  const shownPercent = status === 'converting' ? audioPercent : percent;
  const canFetch = result?.browserDownload === 'fetch';
  const openOnly = result?.browserDownload === 'open';
  const platformName = platform ? platformDisplayNames[platform] : '';

  return (
    <div className="space-y-4" data-testid="video-downloader">
      <Card className="space-y-3">
        <label htmlFor="video-link" className="block text-sm font-semibold text-slate-900">
          {ui.inputLabel}
          {platformName ? <span className="ml-2 font-normal text-slate-500">{platformName}</span> : null}
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            id="video-link"
            type="url"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            value={input}
            disabled={busy && status !== 'analyzing'}
            placeholder={placeholder ?? ui.defaultPlaceholder}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !busy) void analyze();
            }}
            className="sm:flex-1"
          />
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => void pasteFromClipboard()} disabled={busy} className="flex-1 sm:flex-none">
              {ui.paste}
            </Button>
            <Button onClick={() => void analyze()} disabled={busy || !input.trim()} className="flex-1 sm:flex-none">
              {status === 'analyzing' ? ui.analyzing : ui.analyze}
            </Button>
          </div>
        </div>

        <div className="min-h-5 text-xs text-slate-600" aria-live="polite">
          {input.trim() && detected ? (
            <span className="inline-flex items-center rounded-full border border-brand-300 bg-brand-50 px-2 py-0.5 font-medium text-brand-800">
              {ui.detected(platformDisplayNames[detected])}
            </span>
          ) : input.trim() ? (
            <span>{ui.unsupportedHint}</span>
          ) : hint ? (
            <span>{hint}</span>
          ) : null}
        </div>

        {status === 'error' && message ? (
          <div role="alert" className="space-y-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
            <p>{message}</p>
            {fallbackUrl ? (
              <a href={fallbackUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                {ui.openFallback}
              </a>
            ) : null}
          </div>
        ) : null}
      </Card>

      {status === 'analyzing' ? (
        <Card className="flex items-center gap-3" aria-busy="true">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" aria-hidden="true" />
          <span className="text-sm text-slate-700">{ui.analyzing}</span>
        </Card>
      ) : null}

      {result ? (
        <Card className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
            <div className="aspect-video w-full max-w-full overflow-hidden rounded-lg bg-slate-100">
              {result.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={result.thumbnail}
                  alt=""
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <div className="min-w-0 space-y-1">
              <p className="break-words text-base font-semibold text-slate-900">{result.title}</p>
              <p className="text-sm text-slate-600">
                {platformDisplayNames[result.platform]}
                {result.author ? ` · ${ui.by} ${result.author}` : ''}
                {result.durationSeconds ? ` · ${ui.duration} ${formatDuration(result.durationSeconds)}` : ''}
              </p>
              {result.notes.length ? (
                <ul className="list-disc space-y-0.5 pl-5 text-xs text-slate-600">
                  {result.notes.map((note) => (
                    <li key={note}>{ui.notes[note]}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>

          <fieldset className="space-y-2" disabled={busy}>
            <legend className="text-sm font-semibold text-slate-900">{ui.qualityLabel}</legend>
            <div role="radiogroup" aria-label={ui.qualityLabel} className="flex flex-wrap gap-2">
              {formats.map((format) => {
                const size = estimateSizeBytes(format, result.durationSeconds);
                const active = format.id === selected?.id;
                return (
                  <button
                    key={format.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setSelectedId(format.id)}
                    className={cn(
                      'rounded-lg border px-3 py-2 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed',
                      active ? 'border-brand-300 bg-brand-50 text-brand-800' : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50',
                    )}
                  >
                    <span className="font-semibold">{format.quality ?? 'MP4'}</span>
                    <span className="ml-2 text-xs">
                      MP4
                      {size ? ` · ${ui.estimate(formatBytes(size))}` : ''}
                      {format.hasAudio === false ? ` · ${ui.noAudio}` : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {busy && status !== 'analyzing' ? (
            <div className="space-y-2" aria-live="polite">
              <div className="flex items-center justify-between gap-2 text-sm text-slate-700">
                <span>
                  {status === 'converting' ? ui.converting : ui.downloading}
                  {shownPercent !== null ? ` · ${shownPercent}%` : progress ? ` · ${formatBytes(progress.received)}` : ''}
                </span>
                <Button variant="secondary" onClick={cancel} className="h-9">
                  {ui.cancel}
                </Button>
              </div>
              <div
                className="h-2 w-full overflow-hidden rounded-full bg-slate-200"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={shownPercent ?? undefined}
              >
                <div
                  className={cn('h-full bg-brand-600 transition-[width]', shownPercent === null && 'w-1/3 animate-pulse')}
                  style={shownPercent === null ? undefined : { width: `${shownPercent}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex flex-col gap-2 sm:flex-row">
                {canFetch ? (
                  <>
                    <Button onClick={() => void startDownload(false)} disabled={!selected} className="sm:flex-none">
                      {ui.download(selected?.quality ?? '')}
                    </Button>
                    <Button variant="secondary" onClick={() => void startDownload(true)} disabled={!selected} className="sm:flex-none">
                      {ui.downloadAudio}
                    </Button>
                  </>
                ) : null}
                {openOnly && selected ? (
                  <a
                    href={selected.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                  >
                    {ui.openVideo}
                  </a>
                ) : null}
                <Button variant="ghost" onClick={reset}>
                  {ui.clear}
                </Button>
              </div>
              {openOnly ? <p className="text-xs text-slate-600">{ui.openHint}</p> : null}
              {status === 'done' || (status === 'ready' && message) ? (
                <p role="status" className="text-sm font-medium text-slate-800">
                  {message}
                </p>
              ) : null}
            </div>
          )}
        </Card>
      ) : null}
    </div>
  );
}
