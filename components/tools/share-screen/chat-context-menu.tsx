'use client';

import { useEffect, useRef, useState } from 'react';
import { Copy, Reply } from 'lucide-react';

type Props = {
  x: number;
  y: number;
  copyLabel: string;
  replyLabel: string;
  onCopy: () => void;
  onReply: () => void;
  onClose: () => void;
};

const MENU_WIDTH = 176;
const MENU_HEIGHT = 96;

/** Small action menu for a chat message. It stays inside the viewport and closes on Escape or an outside press. */
export function ChatContextMenu({ x, y, copyLabel, replyLabel, onCopy, onReply, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: x, top: y });

  useEffect(() => {
    const left = Math.max(8, Math.min(x, window.innerWidth - MENU_WIDTH - 8));
    const top = Math.max(8, Math.min(y, window.innerHeight - MENU_HEIGHT - 8));
    setPosition({ left, top });
  }, [x, y]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    const onPointerDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [onClose]);

  const item = 'flex h-11 w-full items-center gap-3 px-3 text-left text-sm font-medium text-white transition hover:bg-ink-800 focus-visible:bg-ink-800 focus-visible:outline-none';
  return (
    <div ref={ref} role="menu" style={position} className="fixed z-[130] w-44 overflow-hidden rounded-xl border border-ink-700 bg-ink-900 py-1 shadow-2xl">
      <button type="button" role="menuitem" onClick={onCopy} className={item}><Copy size={16} className="text-accent-400" />{copyLabel}</button>
      <button type="button" role="menuitem" onClick={onReply} className={item}><Reply size={16} className="text-accent-400" />{replyLabel}</button>
    </div>
  );
}
