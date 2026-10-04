'use client';
/* eslint-disable @next/next/no-img-element */

import { LoaderCircle, Move } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getZplDimensions, renderZplToSvg, type LabelStyle } from '@/lib/zpl';
import { cn } from '@/lib/cn';

type LabelPreviewProps = Readonly<{
  zpl: string;
  style: LabelStyle;
  imageUrl?: string | null;
  fallback: boolean;
  loading?: boolean;
  editablePosition?: boolean;
  loadingLabel?: string;
  dragLabel?: string;
  onPositionChange?: (position: { x: number; y: number }) => void;
  className?: string;
}>;

export function ZplLabelPreview({
  zpl,
  style,
  imageUrl,
  fallback,
  loading = false,
  editablePosition = false,
  loadingLabel = 'Gerando prévia…',
  dragLabel = 'Mover descrição',
  onPositionChange,
  className,
}: LabelPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const dragOriginRef = useRef<{ pointer: { x: number; y: number }; position: { x: number; y: number } } | null>(null);
  const draftPositionRef = useRef({ x: style.x, y: style.y });
  const [draftPosition, setDraftPosition] = useState(draftPositionRef.current);
  const [isDragging, setIsDragging] = useState(false);
  const dimensions = useMemo(() => getZplDimensions(zpl, style), [style, zpl]);
  const svg = useMemo(() => renderZplToSvg(zpl, style), [style, zpl]);

  useEffect(() => {
    if (isDragging) return;
    const next = { x: style.x, y: style.y };
    draftPositionRef.current = next;
    setDraftPosition(next);
  }, [isDragging, style.x, style.y]);

  const pointerToLabelPosition = (clientX: number, clientY: number) => {
    if (!previewRef.current) return null;
    const rect = previewRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    return {
      x: ((clientX - rect.left) / rect.width) * dimensions.widthDots,
      y: ((clientY - rect.top) / rect.height) * dimensions.heightDots,
    };
  };

  const clampPosition = (position: { x: number; y: number }) => ({
    x: Math.round(Math.max(0, Math.min(dimensions.widthDots - 8, position.x))),
    y: Math.round(Math.max(0, Math.min(dimensions.heightDots - 8, position.y))),
  });

  const updateDraftPosition = (position: { x: number; y: number }) => {
    const next = clampPosition(position);
    draftPositionRef.current = next;
    setDraftPosition(next);
  };

  return (
    <div
      ref={previewRef}
      className={cn(
        'relative mx-auto w-full max-w-full overflow-hidden rounded-md border border-slate-300 bg-white shadow-sm',
        className,
      )}
      style={{ aspectRatio: `${dimensions.widthDots} / ${dimensions.heightDots}` }}
    >
      {imageUrl && !fallback ? (
        <img src={imageUrl} alt="Label preview" className="h-full w-full object-contain" />
      ) : fallback ? (
        <div className="h-full w-full [&>svg]:block [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />
      ) : null}

      {editablePosition && !loading ? (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-10 min-h-7 rounded border border-dashed border-brand-500/80 bg-brand-100/10"
            style={{
              left: `${(draftPosition.x / dimensions.widthDots) * 100}%`,
              top: `${(draftPosition.y / dimensions.heightDots) * 100}%`,
              width: `${Math.min(95, (style.width / dimensions.widthDots) * 100)}%`,
              height: `${Math.max(4, Math.min(20, ((style.fontSize * Math.max(1, style.maxLines)) / dimensions.heightDots) * 100))}%`,
            }}
          />
          <button
            type="button"
            aria-label={dragLabel}
            className={cn(
              'absolute z-20 flex h-8 touch-none items-center gap-1 rounded-full border border-brand-500 bg-white px-2 text-[10px] font-bold text-brand-800 shadow-md',
              isDragging ? 'cursor-grabbing' : 'cursor-grab',
            )}
            style={{
              left: `${(draftPosition.x / dimensions.widthDots) * 100}%`,
              top: `${(draftPosition.y / dimensions.heightDots) * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onPointerDown={(event) => {
              const pointer = pointerToLabelPosition(event.clientX, event.clientY);
              if (!pointer) return;
              event.currentTarget.setPointerCapture(event.pointerId);
              dragOriginRef.current = { pointer, position: draftPositionRef.current };
              setIsDragging(true);
            }}
            onPointerMove={(event) => {
              if (!event.currentTarget.hasPointerCapture(event.pointerId) || !dragOriginRef.current) return;
              const pointer = pointerToLabelPosition(event.clientX, event.clientY);
              if (!pointer) return;
              updateDraftPosition({
                x: dragOriginRef.current.position.x + pointer.x - dragOriginRef.current.pointer.x,
                y: dragOriginRef.current.position.y + pointer.y - dragOriginRef.current.pointer.y,
              });
            }}
            onPointerUp={(event) => {
              if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
              event.currentTarget.releasePointerCapture(event.pointerId);
              dragOriginRef.current = null;
              setIsDragging(false);
              onPositionChange?.(draftPositionRef.current);
            }}
            onPointerCancel={() => {
              dragOriginRef.current = null;
              setIsDragging(false);
            }}
          >
            <Move className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="max-w-20 truncate">{dragLabel}</span>
          </button>
        </>
      ) : null}

      {loading ? (
        <div className="absolute inset-0 z-30 grid place-items-center bg-white/90 text-center text-xs font-semibold text-slate-700 backdrop-blur-[1px]" aria-live="polite">
          <span className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <LoaderCircle className="h-4 w-4 animate-spin text-brand-600" aria-hidden="true" />
            {loadingLabel}
          </span>
        </div>
      ) : null}
    </div>
  );
}

type LabelThumbnailProps = Readonly<{
  zpl: string;
  style: LabelStyle;
  label: string;
}>;

/** Small previews only render once visible, keeping review grids responsive. */
export function ZplLabelThumbnail({ zpl, style, label }: LabelThumbnailProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const svg = useMemo(() => renderZplToSvg(zpl, style), [style, zpl]);

  useEffect(() => {
    const target = ref.current;
    if (!target || !('IntersectionObserver' in window)) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '280px' },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="aspect-[2/3] overflow-hidden rounded border border-slate-200 bg-slate-100">
      {visible ? (
        <div className="h-full w-full [&>svg]:block [&>svg]:h-full [&>svg]:w-full" aria-label={label} dangerouslySetInnerHTML={{ __html: svg }} />
      ) : null}
    </div>
  );
}
