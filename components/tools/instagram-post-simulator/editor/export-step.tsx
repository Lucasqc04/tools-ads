'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChoiceGroup, Hint, Notice, SectionCard } from '@/components/tools/instagram-post-simulator/editor/editor-ui';
import type { EditorCopy } from '@/components/tools/instagram-post-simulator/editor/editor-types';
import { downloadBlob } from '@/lib/download';
import { getFileExtension, captureVideoFrame } from '@/lib/instagram-post-simulator/media';
import { createZipBlob, exportImageJobs, pad2, type ExportFormat, type ExportedFile } from '@/lib/instagram-post-simulator/render';
import { getPostFrameRatio, getReelSlide } from '@/lib/instagram-post-simulator/draft';
import { OUTPUT_WIDTH } from '@/lib/instagram-post-simulator/layout';
import type { PostDraft, SlideView } from '@/types/instagram-post-simulator';

export type ExportKind = 'jpeg' | 'png' | 'zip' | 'video_original' | 'cover';

type ExportStepProps = Readonly<{
  draft: PostDraft;
  views: SlideView[];
  copy: EditorCopy;
  onDownloaded: (kind: ExportKind) => void;
  onError: (message: string) => void;
}>;

/** Gera as imagens recortadas no navegador. Vídeos são entregues como arquivo original, sem transcodificação. */
export function ExportStep({ draft, views, copy, onDownloaded, onError }: ExportStepProps) {
  const [format, setFormat] = useState<ExportFormat>('jpeg');
  const [busy, setBusy] = useState(false);
  const reelSlide = getReelSlide(draft);
  const frameRatio = getPostFrameRatio(draft);
  const outputHeight = Math.round(OUTPUT_WIDTH / frameRatio);
  const imageViews = views.filter((view) => view.kind === 'image');
  const videoViews = views.filter((view) => view.kind === 'video');
  const isReel = draft.postType === 'reel';
  const hasContent = views.length > 0;
  const options: Array<{ value: ExportFormat; label: string }> = [
    { value: 'jpeg', label: copy.formatJpeg },
    { value: 'png', label: copy.formatPng },
  ];

  /** Agrupa por arquivo: no carrossel contínuo, todos os slides decodificam a mesma imagem uma única vez. */
  const renderImages = async (targets: SlideView[]): Promise<ExportedFile[]> => {
    const groups = new Map<string, SlideView[]>();
    targets.forEach((view) => {
      const group = groups.get(view.source.id) ?? [];
      group.push(view);
      groups.set(view.source.id, group);
    });

    const output: ExportedFile[] = [];
    for (const group of groups.values()) {
      const jobs = group.map((view) => ({
        name: `instagram-slide-${pad2(view.index + 1)}`,
        box: view.box,
        filters: view.filters,
      }));
      output.push(...(await exportImageJobs(group[0].source.file, jobs, OUTPUT_WIDTH, outputHeight, format)));
    }

    return output.sort((a, b) => a.name.localeCompare(b.name));
  };

  const downloadSingleImage = async (view: SlideView) => {
    setBusy(true);
    try {
      const [file] = await exportImageJobs(
        view.source.file,
        [{ name: `instagram-slide-${pad2(view.index + 1)}`, box: view.box, filters: view.filters }],
        OUTPUT_WIDTH,
        outputHeight,
        format,
      );
      downloadBlob(file.blob, `instagram-slide-${pad2(view.index + 1)}.${format === 'jpeg' ? 'jpg' : 'png'}`);
      onDownloaded(format);
    } catch {
      onError(copy.errors.export_failed);
    } finally {
      setBusy(false);
    }
  };

  const downloadOriginalVideo = (view: SlideView) => {
    const ext = getFileExtension(view.source.file, 'mp4');
    downloadBlob(view.source.file, `instagram-video-${pad2(view.index + 1)}-original.${ext}`);
    onDownloaded('video_original');
  };

  const downloadAll = async () => {
    setBusy(true);
    try {
      const images = await renderImages(imageViews);
      const entries: Array<{ name: string; blob: Blob }> = images.map((file) => ({ name: file.name, blob: file.blob }));
      for (const view of videoViews) {
        const ext = getFileExtension(view.source.file, 'mp4');
        entries.push({ name: `slide-${pad2(view.index + 1)}-original.${ext}`, blob: view.source.file });
      }
      const zip = await createZipBlob(entries);
      const name = draft.postType === 'panorama' ? 'instagram-carrossel-continuo.zip' : 'instagram-carrossel.zip';
      downloadBlob(zip, name);
      onDownloaded('zip');
    } catch {
      onError(copy.errors.export_failed);
    } finally {
      setBusy(false);
    }
  };

  const downloadCover = async () => {
    if (!reelSlide) return;
    setBusy(true);
    try {
      if (draft.reelCover) {
        downloadBlob(draft.reelCover.blob, 'instagram-capa-reel.jpg');
      } else {
        const frame = await captureVideoFrame(reelSlide.url, 0.1, OUTPUT_WIDTH);
        downloadBlob(frame.blob, 'instagram-capa-reel.jpg');
      }
      onDownloaded('cover');
    } catch {
      onError(copy.errors.export_failed);
    } finally {
      setBusy(false);
    }
  };

  if (!hasContent) {
    return (
      <SectionCard title={copy.exportTitle}>
        <Notice tone="info">{copy.exportEmpty}</Notice>
      </SectionCard>
    );
  }

  if (isReel) {
    return (
      <SectionCard title={copy.exportTitle} hint={copy.exportNote}>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => reelSlide && downloadOriginalVideo(views[0])} disabled={busy || !reelSlide}>
            {copy.downloadVideo}
          </Button>
          <Button onClick={downloadCover} disabled={busy || !reelSlide}>
            {copy.downloadCover}
          </Button>
        </div>
        {busy ? <p role="status" className="text-sm text-brand-800">{copy.exportPreparing}</p> : null}
      </SectionCard>
    );
  }

  return (
    <SectionCard title={copy.exportTitle} hint={copy.exportNote}>
      {imageViews.length > 0 ? (
        <>
          <ChoiceGroup<ExportFormat>
            legend={copy.exportFormat}
            value={format}
            onChange={setFormat}
            options={options}
            columns="grid-cols-2"
          />
          <Hint>{copy.exportSize(OUTPUT_WIDTH, outputHeight)}</Hint>
          <div className="flex flex-wrap gap-2">
            <Button onClick={downloadAll} disabled={busy}>{copy.downloadAll}</Button>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {imageViews.map((view) => (
              <li key={view.id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                <span className="font-medium text-slate-800">{copy.slideLabel(view.index + 1)}</span>
                <Button variant="ghost" onClick={() => downloadSingleImage(view)} disabled={busy}>{copy.downloadSlide}</Button>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {videoViews.length > 0 ? (
        <ul className="grid gap-2 sm:grid-cols-2">
          {videoViews.map((view) => (
            <li key={view.id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              <span className="font-medium text-slate-800">{copy.slideLabel(view.index + 1)} · {copy.kindVideo}</span>
              <Button variant="ghost" onClick={() => downloadOriginalVideo(view)} disabled={busy}>{copy.downloadVideo}</Button>
            </li>
          ))}
        </ul>
      ) : null}

      {busy ? <p role="status" className="text-sm text-brand-800">{copy.exportPreparing}</p> : null}
    </SectionCard>
  );
}
