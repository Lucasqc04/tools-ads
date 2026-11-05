'use client';

/* eslint-disable @next/next/no-img-element */

import type { CSSProperties } from 'react';
import type { PhoneSlide } from '@/components/tools/instagram-post-simulator/phone/phone-model';
import type { FrameBox } from '@/lib/instagram-post-simulator/layout';
import { toCssFilter } from '@/lib/instagram-post-simulator/filters';

export const percent = (value: number): string => `${(value * 100).toFixed(4)}%`;

export const boxStyle = (box: FrameBox): CSSProperties => ({
  position: 'absolute',
  left: percent(box.left),
  top: percent(box.top),
  width: percent(box.width),
  height: percent(box.height),
});

type SlideMediaProps = Readonly<{
  slide: PhoneSlide;
  /** Só o slide ativo monta o elemento <video>; os demais mostram o quadro inicial. */
  showVideo: boolean;
  muted?: boolean;
  loop?: boolean;
  videoRef?: (element: HTMLVideoElement | null) => void;
  onVideoClick?: () => void;
  /** Só usado no Reel: começa mudo, o que os navegadores permitem sem gesto do usuário. */
  autoPlay?: boolean;
}>;

/**
 * Renderiza um slide usando o mesmo layout geométrico do exportador.
 * O container externo deve ter a proporção do quadro (aspect-ratio).
 */
export function SlideMedia({ slide, showVideo, muted = true, loop = false, autoPlay = false, videoRef, onVideoClick }: SlideMediaProps) {
  const filter = toCssFilter(slide.filters);
  const mediaStyle: CSSProperties = { display: 'block', width: '100%', height: '100%', objectFit: 'fill', pointerEvents: 'none', userSelect: 'none' };

  const renderContent = () => {
    if (slide.kind === 'image') {
      return <img src={slide.url} alt={slide.alt} draggable={false} loading="lazy" decoding="async" style={mediaStyle} />;
    }

    if (showVideo) {
      return (
        <video
          ref={videoRef}
          src={slide.url}
          poster={slide.posterUrl}
          muted={muted}
          loop={loop}
          autoPlay={autoPlay}
          playsInline
          preload="metadata"
          aria-label={slide.alt || undefined}
          onClick={onVideoClick}
          style={{ ...mediaStyle, pointerEvents: onVideoClick ? 'auto' : 'none' }}
        />
      );
    }

    if (slide.posterUrl) {
      return <img src={slide.posterUrl} alt={slide.alt} draggable={false} loading="lazy" decoding="async" style={mediaStyle} />;
    }

    return <div style={{ ...mediaStyle, background: '#1f2937' }} aria-hidden="true" />;
  };

  return <div style={{ ...boxStyle(slide.box), filter }}>{renderContent()}</div>;
}

type GridTileProps = Readonly<{
  slide: PhoneSlide;
  window: FrameBox;
}>;

/**
 * Miniatura 3:4 da grade do perfil: mostra apenas a janela calculada sobre o quadro do post.
 */
export function GridTileMedia({ slide, window }: GridTileProps) {
  const inner: CSSProperties = {
    position: 'absolute',
    width: percent(1 / window.width),
    height: percent(1 / window.height),
    left: percent(-window.left / window.width),
    top: percent(-window.top / window.height),
  };

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#111827' }}>
      <div style={inner}>
        <SlideMedia slide={slide} showVideo={false} />
      </div>
    </div>
  );
}
