'use client';

import { useRef, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { SlideMedia } from '@/components/tools/instagram-post-simulator/phone/slide-media';
import { ChoiceGroup, Hint, RangeField } from '@/components/tools/instagram-post-simulator/editor/editor-ui';
import { DEFAULT_FILTERS } from '@/lib/instagram-post-simulator/filters';
import {
  DEFAULT_CROP,
  MAX_ZOOM,
  MIN_ZOOM,
  clampCrop,
  getImageLayout,
  panCropByPixels,
  zoomFromPinch,
} from '@/lib/instagram-post-simulator/layout';
import type { FitMode, PanCrop, SlideFilters, SlideKind } from '@/types/instagram-post-simulator';

export type CropEditorLabels = {
  panLabel: string;
  zoomLabel: string;
  resetCrop: string;
  cutAreaHint: string;
  fitLabel: string;
  fill: string;
  fit: string;
};

export type CropSource = {
  kind: SlideKind;
  url: string;
  posterUrl?: string;
  width: number;
  height: number;
};

type CropEditorProps = Readonly<{
  source: CropSource;
  frameRatio: number;
  crop: PanCrop;
  fit: FitMode;
  filters: SlideFilters;
  onChange: (crop: PanCrop) => void;
  onFitChange: (fit: FitMode) => void;
  labels: CropEditorLabels;
  ariaLabel: string;
  /** Elementos extras sobre o quadro (divisões do carrossel, janela da grade). */
  overlay?: ReactNode;
  /** Quadro mais alto que largo fica limitado em altura para caber na tela. */
  maxFrameHeight?: number;
}>;

type Gesture =
  | { mode: 'pan'; startCrop: PanCrop; startX: number; startY: number }
  | { mode: 'pinch'; startCrop: PanCrop; startDistance: number };

const KEY_STEP = 0.05;
const ZOOM_STEP = 0.1;

const distanceBetween = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);

/**
 * Enquadramento de um slide: arraste para reposicionar, pinça ou slider para zoom.
 * O fundo mostra a imagem inteira em opacidade baixa para indicar o que será cortado.
 */
export function CropEditor({ source, frameRatio, crop, fit, filters, onChange, onFitChange, labels, ariaLabel, overlay, maxFrameHeight = 460 }: CropEditorProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<Gesture | null>(null);
  const cropRef = useRef(crop);
  cropRef.current = crop;
  const interactive = fit === 'fill';

  const fullLayout = getImageLayout(source, frameRatio, DEFAULT_CROP, 'fit');
  const cropLayout = getImageLayout(source, frameRatio, crop, fit);
  const frameWidth = `min(100%, ${Math.round(maxFrameHeight * frameRatio)}px)`;
  const elementId = { id: 'editor', kind: source.kind, url: source.url, posterUrl: source.posterUrl, alt: '', filters: DEFAULT_FILTERS };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    event.currentTarget.setPointerCapture?.(event.pointerId);

    if (pointers.current.size === 1) {
      gesture.current = { mode: 'pan', startCrop: cropRef.current, startX: event.clientX, startY: event.clientY };
    } else if (pointers.current.size === 2) {
      const [first, second] = Array.from(pointers.current.values());
      gesture.current = { mode: 'pinch', startCrop: cropRef.current, startDistance: distanceBetween(first, second) };
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId) || !gesture.current) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const active = gesture.current;

    if (active.mode === 'pinch' && pointers.current.size >= 2) {
      const [first, second] = Array.from(pointers.current.values());
      const zoom = zoomFromPinch(active.startCrop.zoom, active.startDistance, distanceBetween(first, second));
      onChange(clampCrop({ ...active.startCrop, zoom }));
      return;
    }

    if (active.mode === 'pan') {
      const rect = frameRef.current?.getBoundingClientRect();
      if (!rect) return;
      const box = getImageLayout(source, frameRatio, active.startCrop, fit);
      const next = panCropByPixels(
        active.startCrop,
        box,
        rect.width,
        rect.height,
        event.clientX - active.startX,
        event.clientY - active.startY,
      );
      onChange(next);
    }
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size === 1) {
      const [remaining] = Array.from(pointers.current.values());
      gesture.current = { mode: 'pan', startCrop: cropRef.current, startX: remaining.x, startY: remaining.y };
    } else if (pointers.current.size === 0) {
      gesture.current = null;
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const current = cropRef.current;
    const moves: Record<string, Partial<PanCrop>> = {
      ArrowLeft: { x: current.x + KEY_STEP },
      ArrowRight: { x: current.x - KEY_STEP },
      ArrowUp: { y: current.y + KEY_STEP },
      ArrowDown: { y: current.y - KEY_STEP },
    };

    if (moves[event.key]) {
      event.preventDefault();
      onChange(clampCrop({ ...current, ...moves[event.key] }));
    } else if (event.key === '+' || event.key === '=') {
      event.preventDefault();
      onChange(clampCrop({ ...current, zoom: current.zoom + ZOOM_STEP }));
    } else if (event.key === '-') {
      event.preventDefault();
      onChange(clampCrop({ ...current, zoom: current.zoom - ZOOM_STEP }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div
          ref={frameRef}
          role="group"
          aria-label={ariaLabel}
          aria-describedby="crop-editor-hint"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          className="relative w-full overflow-hidden rounded-xl bg-slate-900 shadow-sm ring-1 ring-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          style={{ width: frameWidth, aspectRatio: String(frameRatio), touchAction: interactive ? 'none' : 'auto', cursor: interactive ? 'grab' : 'default' }}
        >
          <div style={{ position: 'absolute', inset: 0, opacity: 0.32 }} aria-hidden="true">
            <SlideMedia slide={{ ...elementId, box: fullLayout }} showVideo={false} />
          </div>
          <div style={{ position: 'absolute', inset: 0 }}>
            <SlideMedia slide={{ ...elementId, box: cropLayout, filters }} showVideo={source.kind === 'video'} muted />
          </div>
          {overlay}
        </div>
      </div>

      <Hint id="crop-editor-hint">
        {interactive ? labels.panLabel : labels.cutAreaHint}
      </Hint>

      <ChoiceGroup<FitMode>
        legend={labels.fitLabel}
        value={fit}
        onChange={onFitChange}
        options={[
          { value: 'fill', label: labels.fill },
          { value: 'fit', label: labels.fit },
        ]}
        columns="grid-cols-2"
      />

      <RangeField
        label={labels.zoomLabel}
        min={MIN_ZOOM}
        max={MAX_ZOOM}
        step={0.01}
        value={crop.zoom}
        disabled={!interactive}
        format={(value) => `${value.toFixed(2)}×`}
        onChange={(zoom) => onChange(clampCrop({ ...crop, zoom }))}
      />

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => onChange(DEFAULT_CROP)} disabled={!interactive}>
          {labels.resetCrop}
        </Button>
      </div>
    </div>
  );
}
