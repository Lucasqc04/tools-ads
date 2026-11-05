'use client';

/* eslint-disable @next/next/no-img-element */

import { useState, type DragEvent } from 'react';
import { ChevronLeft, ChevronRight, Film, ImageIcon, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { MediaSlide } from '@/types/instagram-post-simulator';

export type SlideListLabels = {
  kindPhoto: string;
  kindVideo: string;
  remove: string;
  moveLeft: string;
  moveRight: string;
  slideLabel: (index: number) => string;
  activeSlideLabel: string;
  dragHint: string;
};

type SlideListProps = Readonly<{
  slides: MediaSlide[];
  activeId: string | null;
  onSelect?: (id: string) => void;
  onMove: (id: string, toIndex: number) => void;
  onRemove: (id: string) => void;
  labels: SlideListLabels;
}>;

const DRAG_MIME = 'application/x-instagram-slide';

/**
 * Lista ordenável dos slides. A ordem é a do carrossel: o primeiro item é a capa.
 * Mouse arrasta os cartões; toque e teclado usam os botões de mover.
 */
export function SlideList({ slides, activeId, onSelect, onMove, onRemove, labels }: SlideListProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const handleDrop = (event: DragEvent<HTMLLIElement>, toIndex: number) => {
    event.preventDefault();
    const id = event.dataTransfer.getData(DRAG_MIME) || draggingId;
    setDraggingId(null);
    if (id) onMove(id, toIndex);
  };

  return (
    <div className="space-y-2">
      <ol className="grid grid-cols-3 gap-2 sm:grid-cols-4" aria-label={labels.dragHint}>
        {slides.map((slide, index) => {
          const active = slide.id === activeId;
          const isVideo = slide.kind === 'video';
          return (
            <li
              key={slide.id}
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData(DRAG_MIME, slide.id);
                event.dataTransfer.effectAllowed = 'move';
                setDraggingId(slide.id);
              }}
              onDragEnd={() => setDraggingId(null)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(event, index)}
              className={cn(
                'relative overflow-hidden rounded-lg border bg-white shadow-sm transition',
                active ? 'border-brand-300 ring-2 ring-brand-200' : 'border-slate-200',
                draggingId === slide.id ? 'opacity-60' : '',
              )}
            >
              <button
                type="button"
                onClick={() => onSelect?.(slide.id)}
                aria-current={active ? 'true' : undefined}
                aria-label={`${labels.slideLabel(index + 1)}: ${isVideo ? labels.kindVideo : labels.kindPhoto}${active ? `, ${labels.activeSlideLabel}` : ''}`}
                className="relative block aspect-square w-full bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500"
                disabled={!onSelect}
              >
                {slide.thumbUrl ? (
                  <img src={slide.thumbUrl} alt="" draggable={false} className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-slate-400">
                    {isVideo ? <Film size={22} aria-hidden="true" /> : <ImageIcon size={22} aria-hidden="true" />}
                  </span>
                )}
                <span className="absolute left-1.5 top-1.5 rounded-md bg-white/95 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-slate-800 shadow-sm">
                  {index + 1}
                </span>
                <span className="absolute bottom-1.5 left-1.5 rounded-md bg-slate-900/80 px-1.5 py-0.5 text-[11px] font-medium text-white">
                  {isVideo ? labels.kindVideo : labels.kindPhoto}
                </span>
              </button>
              <div className="flex items-center justify-between gap-1 border-t border-slate-200 bg-white px-1 py-1">
                <button
                  type="button"
                  onClick={() => onMove(slide.id, index - 1)}
                  disabled={index === 0}
                  aria-label={labels.moveLeft}
                  title={labels.moveLeft}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
                >
                  <ChevronLeft size={16} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onMove(slide.id, index + 1)}
                  disabled={index === slides.length - 1}
                  aria-label={labels.moveRight}
                  title={labels.moveRight}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
                >
                  <ChevronRight size={16} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(slide.id)}
                  aria-label={`${labels.remove} ${labels.slideLabel(index + 1)}`}
                  title={labels.remove}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-rose-700 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="text-xs leading-5 text-slate-600">{labels.dragHint}</p>
    </div>
  );
}
