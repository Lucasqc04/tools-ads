'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState, type MouseEvent } from 'react';

type ImageViewerProps = Readonly<{
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: () => void | Promise<void>;
}>;

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 5;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const buildImageUrl = (src: string): string => {
  if (!src) {
    return '';
  }

  if (src.startsWith('http') || src.startsWith('data:') || src.startsWith('blob:')) {
    return src;
  }

  return `data:image/jpeg;base64,${src}`;
};

export function ImageViewer({ src, alt, isOpen, onClose, onDownload }: ImageViewerProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setZoomLevel(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
    setIsDragging(false);
  }, [isOpen]);

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    globalThis.addEventListener('mouseup', handleMouseUp);

    return () => {
      globalThis.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    globalThis.addEventListener('keydown', handleEscape);

    return () => {
      globalThis.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || !isOpen) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      const delta = event.deltaY > 0 ? -0.2 : 0.2;
      const nextZoom = clamp(zoomLevel + delta, MIN_ZOOM, MAX_ZOOM);

      if (imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left) / rect.width;
        const mouseY = (event.clientY - rect.top) / rect.height;

        if (nextZoom > 1) {
          const nextPositionX = position.x - (mouseX - 0.5) * (nextZoom - zoomLevel) * rect.width;
          const nextPositionY = position.y - (mouseY - 0.5) * (nextZoom - zoomLevel) * rect.height;
          setPosition({ x: nextPositionX, y: nextPositionY });
        } else if (zoomLevel > 1 && nextZoom <= 1) {
          setPosition({ x: 0, y: 0 });
        }
      }

      setZoomLevel(nextZoom);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [isOpen, zoomLevel, position]);

  if (!isOpen) {
    return null;
  }

  const imageUrl = buildImageUrl(src);

  const handleDirectDownload = () => {
    if (!imageUrl) {
      return;
    }

    const link = document.createElement('a');
    const datePart = new Date().toISOString().split('T')[0];

    link.href = imageUrl;
    link.download = `imagem-${datePart}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleDownload = async () => {
    if (onDownload) {
      await onDownload();
      return;
    }

    handleDirectDownload();
  };

  const handleMouseDown = (event: MouseEvent) => {
    if (zoomLevel <= 1) {
      return;
    }

    event.preventDefault();

    setIsDragging(true);
    setDragStart({
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    });
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging) {
      return;
    }

    event.preventDefault();

    setPosition({
      x: event.clientX - dragStart.x,
      y: event.clientY - dragStart.y,
    });
  };

  let containerCursor = 'default';

  if (isDragging) {
    containerCursor = 'grabbing';
  } else if (zoomLevel > 1) {
    containerCursor = 'grab';
  }

  return (
    <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center">
      <button
        aria-label="Fechar visualizador"
        type="button"
        className="absolute inset-0 bg-black/90"
        onClick={onClose}
      />

      <div className="relative z-10 flex h-full w-full flex-col">
        <div className="flex w-full flex-wrap items-center justify-between gap-3 bg-black/80 px-3 py-3 sm:px-6 sm:py-4">
          <div className="max-w-[58%] truncate text-base font-medium text-white sm:text-xl">{alt}</div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 rounded-full bg-black/40 px-2 py-1.5 sm:gap-2 sm:px-3 sm:py-2">
              <button
                type="button"
                onClick={() => setZoomLevel((current) => clamp(current - 0.5, MIN_ZOOM, MAX_ZOOM))}
                className="rounded p-1 text-white transition-colors hover:bg-black/40"
                aria-label="Diminuir zoom"
              >
                -
              </button>
              <span className="min-w-[52px] text-center text-sm font-medium text-white sm:text-base">
                {(zoomLevel * 100).toFixed(0)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((current) => clamp(current + 0.5, MIN_ZOOM, MAX_ZOOM))}
                className="rounded p-1 text-white transition-colors hover:bg-black/40"
                aria-label="Aumentar zoom"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={() => setRotation((current) => (current + 90) % 360)}
              className="rounded-full p-2 text-white transition-colors hover:bg-black/40"
              aria-label="Rotacionar imagem"
            >
              Rot
            </button>
            <button
              type="button"
              onClick={() => {
                setZoomLevel(1);
                setRotation(0);
                setPosition({ x: 0, y: 0 });
              }}
              className="rounded-full p-2 text-white transition-colors hover:bg-black/40"
              aria-label="Resetar visualizacao"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => {
                void handleDownload();
              }}
              className="rounded-full p-2 text-white transition-colors hover:bg-black/40"
              aria-label="Baixar imagem"
            >
              Down
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-white transition-colors hover:bg-black/40"
              aria-label="Fechar visualizador"
            >
              X
            </button>
          </div>
        </div>

        <button
          type="button"
          ref={containerRef}
          className="flex w-full flex-1 items-center justify-center overflow-hidden"
          aria-label="Visualizador de imagem com zoom"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={() => setIsDragging(false)}
          style={{ cursor: containerCursor }}
        >
          <div
            className="rounded-lg bg-black/20 p-4"
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              maxWidth: '90%',
              maxHeight: '80vh',
            }}
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt={alt}
              className="max-h-[calc(80vh-120px)] max-w-full select-none object-contain shadow-xl"
              style={{
                transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                transformOrigin: 'center',
                transition: isDragging ? 'none' : 'transform 0.2s ease-out',
              }}
              draggable="false"
              onDragStart={(event) => event.preventDefault()}
            />
          </div>
        </button>

        <div className="w-full bg-black/80 px-3 py-3 text-center text-xs text-white sm:px-6 sm:py-4 sm:text-sm">
          Use roda do mouse para zoom. {zoomLevel > 1 ? 'Arraste para mover. ' : ''}
          Clique fora da imagem para fechar.
        </div>
      </div>
    </div>
  );
}
