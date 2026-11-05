'use client';

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CropEditor } from '@/components/tools/instagram-post-simulator/editor/crop-editor';
import { FilterControls } from '@/components/tools/instagram-post-simulator/editor/filter-controls';
import { Hint, Notice, RangeField, SectionCard } from '@/components/tools/instagram-post-simulator/editor/editor-ui';
import { GridTileMedia, SlideMedia } from '@/components/tools/instagram-post-simulator/phone/slide-media';
import type { PhoneSlide } from '@/components/tools/instagram-post-simulator/phone/phone-model';
import type { SimulatorCopy } from '@/data/i18n/instagram-post-simulator';
import { DEFAULT_FILTERS } from '@/lib/instagram-post-simulator/filters';
import { DEFAULT_CROP, GRID_RATIO, REEL_RATIO, getGridWindow, getImageLayout } from '@/lib/instagram-post-simulator/layout';
import type { CoverImage, MediaSlide, PanCrop, PostDraft, SlideFilters } from '@/types/instagram-post-simulator';

type ReelEditorProps = Readonly<{
  draft: PostDraft;
  reelSlide: MediaSlide | null;
  copy: SimulatorCopy;
  onCropChange: (crop: PanCrop) => void;
  onFitChange: (fit: MediaSlide['fit']) => void;
  onFiltersChange: (filters: SlideFilters) => void;
  onCaptureFrame: (time: number) => void;
  onImportCover: (file: File) => void;
  onClearCover: () => void;
  slideCount: number;
}>;

const FEED_RATIO = 0.8;

const coverSlide = (url: string, width: number, height: number, frameRatio: number): PhoneSlide => ({
  id: `cover-${frameRatio}`,
  kind: 'image',
  url,
  box: getImageLayout({ width, height }, frameRatio, DEFAULT_CROP, 'fill'),
  filters: DEFAULT_FILTERS,
  alt: '',
});

/** Editor do Reel: um vídeo vertical com enquadramento próprio e uma capa escolhida nele ou importada. */
export function ReelEditor({
  draft,
  reelSlide,
  copy,
  onCropChange,
  onFitChange,
  onFiltersChange,
  onCaptureFrame,
  onImportCover,
  onClearCover,
  slideCount,
}: ReelEditorProps) {
  const labels = copy;

  if (!reelSlide) {
    return (
      <SectionCard title={labels.reelTitle} hint={labels.reelHint}>
        <Notice tone="info">{slideCount > 1 ? labels.reelNeedsOneVideo : labels.reelHint}</Notice>
      </SectionCard>
    );
  }

  return (
    <div className="space-y-6">
      <SectionCard title={labels.editTitle} hint={labels.videoPreviewNote}>
        <CropEditor
          source={{ kind: 'video', url: reelSlide.url, posterUrl: reelSlide.thumbUrl, width: reelSlide.width, height: reelSlide.height }}
          frameRatio={REEL_RATIO}
          crop={reelSlide.crop}
          fit={reelSlide.fit}
          filters={reelSlide.filters}
          onChange={onCropChange}
          onFitChange={onFitChange}
          labels={{ panLabel: labels.panLabel, zoomLabel: labels.zoomLabel, resetCrop: labels.resetCrop, cutAreaHint: labels.cutAreaHint, fitLabel: labels.fitLabel, fill: labels.fill, fit: labels.fit }}
          ariaLabel={labels.reelTitle}
          maxFrameHeight={520}
        />
        <Hint>{labels.videoPreviewNote}</Hint>
      </SectionCard>

      <FilterControls filters={reelSlide.filters} onChange={onFiltersChange} labels={labels} />

      <ReelCoverCard
        draft={draft}
        reelSlide={reelSlide}
        copy={copy}
        onCaptureFrame={onCaptureFrame}
        onImportCover={onImportCover}
        onClearCover={onClearCover}
      />
    </div>
  );
}

type ReelCoverCardProps = Readonly<{
  draft: PostDraft;
  reelSlide: MediaSlide;
  copy: SimulatorCopy;
  onCaptureFrame: (time: number) => void;
  onImportCover: (file: File) => void;
  onClearCover: () => void;
}>;

function ReelCoverCard({ draft, reelSlide, copy, onCaptureFrame, onImportCover, onClearCover }: ReelCoverCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const duration = Number.isFinite(reelSlide.duration) && (reelSlide.duration ?? 0) > 0 ? (reelSlide.duration as number) : 0;
  const [time, setTime] = useState(0);
  const cover: CoverImage | null = draft.reelCover;
  const sourceUrl = cover?.url ?? reelSlide.thumbUrl ?? null;
  const sourceWidth = cover?.width ?? reelSlide.width;
  const sourceHeight = cover?.height ?? reelSlide.height;

  useEffect(() => {
    const video = videoRef.current;
    if (video && Math.abs(video.currentTime - time) > 0.05) {
      video.currentTime = time;
    }
  }, [time]);

  const feed = sourceUrl ? coverSlide(sourceUrl, sourceWidth, sourceHeight, FEED_RATIO) : null;
  const reel = sourceUrl ? coverSlide(sourceUrl, sourceWidth, sourceHeight, REEL_RATIO) : null;
  const gridWindow = getGridWindow(REEL_RATIO, draft.gridCrop);

  return (
    <SectionCard title={copy.reelTitle} hint={copy.reelHint}>
      <div className="grid gap-4 sm:grid-cols-[minmax(0,160px)_minmax(0,1fr)]">
        <div className="mx-auto w-full max-w-[160px] overflow-hidden rounded-lg bg-slate-900 ring-1 ring-slate-300" style={{ aspectRatio: String(REEL_RATIO) }}>
          <video
            ref={videoRef}
            src={reelSlide.url}
            muted
            playsInline
            preload="auto"
            aria-label={copy.reelScrub}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="space-y-4">
          <RangeField
            label={copy.reelScrub}
            min={0}
            max={duration || 1}
            step={0.1}
            value={Math.min(time, duration || 0)}
            disabled={duration === 0}
            format={(value) => `${value.toFixed(1)} s`}
            onChange={setTime}
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => onCaptureFrame(time)} disabled={duration === 0}>{copy.reelUseFrame}</Button>
            <label className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-100 focus-within:ring-2 focus-within:ring-brand-200">
              {copy.reelImportCover}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = '';
                  if (file) onImportCover(file);
                }}
              />
            </label>
            <Button variant="secondary" onClick={onClearCover} disabled={!cover}>{copy.reelRemoveCover}</Button>
          </div>
          <Hint>{cover ? copy.reelRemoveCover : copy.reelAutoCover}</Hint>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-900">{copy.reelCoverCompare}</h4>
        {feed && reel ? (
          <div className="flex flex-wrap items-end gap-4">
            <figure className="space-y-1">
              <div className="relative overflow-hidden rounded-md bg-slate-900" style={{ width: 120, aspectRatio: String(FEED_RATIO) }}>
                <SlideMedia slide={feed} showVideo={false} />
              </div>
              <figcaption className="text-xs text-slate-600">{copy.compareFeed}</figcaption>
            </figure>
            <figure className="space-y-1">
              <div className="relative overflow-hidden rounded-md bg-slate-900" style={{ width: 96, aspectRatio: String(GRID_RATIO) }}>
                <GridTileMedia slide={reel} window={gridWindow} />
              </div>
              <figcaption className="text-xs text-slate-600">{copy.compareGrid}</figcaption>
            </figure>
            <figure className="space-y-1">
              <div className="relative overflow-hidden rounded-md bg-slate-900" style={{ width: 90, aspectRatio: String(REEL_RATIO) }}>
                <SlideMedia slide={reel} showVideo={false} />
              </div>
              <figcaption className="text-xs text-slate-600">{copy.compareReel}</figcaption>
            </figure>
          </div>
        ) : (
          <Notice tone="info">{copy.reelHint}</Notice>
        )}
      </div>
    </SectionCard>
  );
}
