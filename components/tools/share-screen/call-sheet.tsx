'use client';

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import { X } from 'lucide-react';

type Props = {
  title: string;
  closeLabel: string;
  dragHint: string;
  onClose: () => void;
  children: ReactNode;
  /** Gives the content the full sheet height (chat) instead of sizing to its content. */
  fill?: boolean;
};

const CLOSE_DISTANCE = 110;
const CLOSE_VELOCITY = 0.55;
const MIN_FLING_DISTANCE = 40;
const CLOSE_ANIMATION_MS = 180;

const isDesktopLayout = () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches;

/**
 * Bottom sheet on phones, side panel from `md` up. On phones the handle and
 * title bar can be dragged down to dismiss the sheet; the sheet follows the
 * finger and also keeps clear of the on-screen keyboard.
 */
export function CallSheet({ title, closeLabel, dragHint, onClose, children, fill = false }: Props) {
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [keyboardInset, setKeyboardInset] = useState(0);
  const drag = useRef<{ pointerId: number; startY: number; lastY: number; lastAt: number; velocity: number } | null>(null);
  const closing = useRef(false);

  const dismiss = () => {
    if (closing.current) return;
    closing.current = true;
    setDragging(false);
    setOffset(Math.max(window.innerHeight, 600));
    window.setTimeout(onClose, CLOSE_ANIMATION_MS);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const update = () => setKeyboardInset(Math.max(0, Math.round(window.innerHeight - viewport.height - viewport.offsetTop)));
    update();
    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', update);
    return () => {
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', update);
    };
  }, []);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (isDesktopLayout() || (event.pointerType === 'mouse' && event.button !== 0)) return;
    if ((event.target as HTMLElement).closest('button')) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { pointerId: event.pointerId, startY: event.clientY, lastY: event.clientY, lastAt: event.timeStamp, velocity: 0 };
    setDragging(true);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state || state.pointerId !== event.pointerId) return;
    const elapsed = Math.max(1, event.timeStamp - state.lastAt);
    state.velocity = (event.clientY - state.lastY) / elapsed;
    state.lastY = event.clientY;
    state.lastAt = event.timeStamp;
    setOffset(Math.max(0, event.clientY - state.startY));
  };

  const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state || state.pointerId !== event.pointerId) return;
    drag.current = null;
    if (offset > CLOSE_DISTANCE || (offset > MIN_FLING_DISTANCE && state.velocity > CLOSE_VELOCITY)) dismiss();
    else { setDragging(false); setOffset(0); }
  };

  return (
    <>
      <div aria-hidden="true" onClick={dismiss} className="fixed inset-0 z-20 bg-black/60 md:hidden" style={{ opacity: offset ? Math.max(0.25, 1 - offset / 400) : 1 }} />
      <aside
        aria-label={title}
        className={`fixed inset-x-0 bottom-0 z-30 flex flex-col overflow-hidden rounded-t-3xl border border-b-0 border-ink-700 bg-ink-900 shadow-2xl md:static md:z-auto md:max-h-none md:w-80 md:shrink-0 md:rounded-2xl md:border-b md:shadow-none ${fill ? 'h-[78%]' : 'max-h-[85%]'}`}
        style={{
          bottom: keyboardInset || undefined,
          transform: offset ? `translateY(${offset}px)` : undefined,
          transition: dragging ? 'none' : `transform ${CLOSE_ANIMATION_MS}ms ease-out`,
        }}
      >
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
          className="shrink-0 cursor-grab touch-none select-none px-4 pb-2 pt-2.5 active:cursor-grabbing md:cursor-default md:pt-4"
        >
          <div className="mx-auto h-1.5 w-12 rounded-full bg-ink-600 md:hidden" title={dragHint} />
          <span className="sr-only md:hidden">{dragHint}</span>
          <div className="mt-2 flex items-center justify-between md:mt-0">
            <h2 className="text-base font-semibold text-white">{title}</h2>
            <button type="button" onClick={dismiss} aria-label={closeLabel} className="-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-400 transition hover:bg-ink-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"><X size={18} /></button>
          </div>
        </div>
        <div className={`flex min-h-0 flex-1 flex-col px-4 pb-4 ${fill ? 'overflow-hidden' : 'overflow-y-auto overscroll-contain'}`}>{children}</div>
      </aside>
    </>
  );
}
