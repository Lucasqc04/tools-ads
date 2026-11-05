'use client';

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { SlideMedia } from '@/components/tools/instagram-post-simulator/phone/slide-media';
import type { IosPalette } from '@/components/tools/instagram-post-simulator/phone/ios-theme';
import type { PhoneSlide } from '@/components/tools/instagram-post-simulator/phone/phone-model';

export type CarouselCopy = {
  prevSlide: string;
  nextSlide: string;
  playVideo: string;
  pauseVideo: string;
  mute: string;
  unmute: string;
  carouselCounter: (index: number, total: number) => string;
};

type PostCarouselProps = Readonly<{
  slides: PhoneSlide[];
  frameRatio: number;
  palette: IosPalette;
  copy: CarouselCopy;
  ariaLabel: string;
  onDoubleTap?: () => void;
}>;

const SWIPE_THRESHOLD_RATIO = 0.15;
const DRAG_START_PX = 6;

/**
 * Carrossel do feed: arraste com mouse ou toque, use as setas (desktop) ou o teclado.
 * O vídeo ativo só toca quando o usuário pede; não há reprodução automática com som.
 */
export function PostCarousel({ slides, frameRatio, palette, copy, ariaLabel, onDoubleTap }: PostCarouselProps) {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const gesture = useRef<{ startX: number; startY: number; active: boolean } | null>(null);
  const count = slides.length;
  const safeIndex = Math.min(index, Math.max(0, count - 1));
  const active = slides[safeIndex];
  const isVideo = active?.kind === 'video';

  useEffect(() => {
    setPlaying(false);
  }, [safeIndex]);

  const go = (next: number) => {
    setIndex(Math.min(Math.max(next, 0), count - 1));
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (count < 2 || event.button > 0) return;
    gesture.current = { startX: event.clientX, startY: event.clientY, active: false };
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const current = gesture.current;
    if (!current) return;
    const dx = event.clientX - current.startX;
    const dy = event.clientY - current.startY;

    if (!current.active) {
      if (Math.abs(dx) < DRAG_START_PX && Math.abs(dy) < DRAG_START_PX) return;
      // Gesto mais vertical é rolagem da página, não troca de slide.
      if (Math.abs(dy) > Math.abs(dx)) {
        gesture.current = null;
        return;
      }
      current.active = true;
      frameRef.current?.setPointerCapture?.(event.pointerId);
    }

    setDragX(dx);
  };

  const finishGesture = () => {
    const current = gesture.current;
    gesture.current = null;
    if (!current?.active) {
      setDragX(0);
      return;
    }
    const width = frameRef.current?.getBoundingClientRect().width ?? 0;
    const threshold = width * SWIPE_THRESHOLD_RATIO;
    if (dragX < -threshold) go(safeIndex + 1);
    else if (dragX > threshold) go(safeIndex - 1);
    setDragX(0);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(safeIndex + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(safeIndex - 1);
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play().catch(() => setPlaying(false));
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  if (!active) return null;

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={frameRef}
        role="group"
        aria-roledescription="carrossel"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishGesture}
        onPointerCancel={finishGesture}
        onPointerLeave={() => { if (gesture.current?.active) finishGesture(); }}
        onDoubleClick={onDoubleTap}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: String(frameRatio),
          overflow: 'hidden',
          background: '#000000',
          touchAction: 'pan-y',
          userSelect: 'none',
          outlineOffset: -2,
        }}
      >
        {slides.map((slide, slideIndex) => {
          const offset = (slideIndex - safeIndex) * 100;
          const hidden = Math.abs(slideIndex - safeIndex) > 1;
          return (
            <div
              key={slide.id}
              aria-hidden={slideIndex !== safeIndex}
              style={{
                position: 'absolute',
                inset: 0,
                transform: `translate3d(calc(${offset}% + ${dragX}px), 0, 0)`,
                transition: gesture.current?.active ? 'none' : 'transform 280ms ease',
                visibility: hidden ? 'hidden' : 'visible',
              }}
            >
              <SlideMedia
                slide={slide}
                showVideo={isVideo && slideIndex === safeIndex}
                muted={muted}
                videoRef={slideIndex === safeIndex ? (element) => { videoRef.current = element; } : undefined}
                onVideoClick={slideIndex === safeIndex && slide.kind === 'video' ? togglePlay : undefined}
              />
            </div>
          );
        })}

        {count > 1 ? (
          <div
            aria-live="polite"
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              padding: '3px 9px',
              borderRadius: 12,
              background: 'rgba(0, 0, 0, 0.62)',
              color: '#ffffff',
              fontSize: 12,
              fontWeight: 600,
              fontVariantNumeric: 'tabular-nums',
              zIndex: 2,
            }}
          >
            {copy.carouselCounter(safeIndex + 1, count)}
          </div>
        ) : null}

        {count > 1 && hovered && safeIndex > 0 ? (
          <CarouselArrow side="left" label={copy.prevSlide} onClick={() => go(safeIndex - 1)} />
        ) : null}
        {count > 1 && hovered && safeIndex < count - 1 ? (
          <CarouselArrow side="right" label={copy.nextSlide} onClick={() => go(safeIndex + 1)} />
        ) : null}

        {isVideo ? (
          <>
            {!playing ? (
              <button
                type="button"
                aria-label={copy.playVideo}
                onClick={togglePlay}
                style={{ ...centerButton, zIndex: 3 }}
              >
                <Play size={22} fill="#ffffff" color="#ffffff" aria-hidden="true" />
              </button>
            ) : null}
            <button
              type="button"
              aria-label={muted ? copy.unmute : copy.mute}
              onClick={() => {
                setMuted((current) => !current);
                if (videoRef.current) videoRef.current.muted = !muted;
              }}
              style={{ ...mediaButton, zIndex: 3 }}
            >
              {muted ? <VolumeX size={16} color="#ffffff" aria-hidden="true" /> : <Volume2 size={16} color="#ffffff" aria-hidden="true" />}
            </button>
            {playing ? (
              <button
                type="button"
                aria-label={copy.pauseVideo}
                onClick={togglePlay}
                style={{ ...mediaButton, left: 12, right: 'auto', zIndex: 3 }}
              >
                <Pause size={14} color="#ffffff" aria-hidden="true" />
              </button>
            ) : null}
          </>
        ) : null}
      </div>

      {count > 1 ? (
        <div aria-hidden="true" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 5, padding: '10px 0 2px' }}>
          {dotWindow(count, safeIndex).map((dotIndex) => (
            <span
              key={dotIndex}
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                background: dotIndex === safeIndex ? palette.accent : palette.dot,
                transform: dotIndex === safeIndex ? 'scale(1)' : 'scale(0.85)',
                transition: 'background 200ms ease, transform 200ms ease',
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

const DOT_WINDOW = 5;

/** Mostra até cinco pontos centrados no slide ativo, como a barra do aplicativo. */
const dotWindow = (count: number, active: number): number[] => {
  const size = Math.min(DOT_WINDOW, count);
  const start = Math.min(Math.max(active - Math.floor(size / 2), 0), count - size);
  return Array.from({ length: size }, (_, offset) => start + offset);
};

const centerButton: CSSProperties = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  width: 56,
  height: 56,
  marginLeft: -28,
  marginTop: -28,
  borderRadius: 28,
  border: 0,
  padding: 0,
  background: 'rgba(0, 0, 0, 0.55)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

const mediaButton: CSSProperties = {
  position: 'absolute',
  right: 12,
  bottom: 12,
  width: 30,
  height: 30,
  borderRadius: 15,
  border: 0,
  padding: 0,
  background: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

function CarouselArrow({ side, label, onClick }: Readonly<{ side: 'left' | 'right'; label: string; onClick: () => void }>) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      onPointerDown={(event) => event.stopPropagation()}
      style={{
        position: 'absolute',
        top: '50%',
        [side]: 10,
        width: 28,
        height: 28,
        marginTop: -14,
        borderRadius: 14,
        border: 0,
        padding: 0,
        background: '#ffffff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 3,
      }}
    >
      <Icon size={18} color="#262626" aria-hidden="true" />
    </button>
  );
}
