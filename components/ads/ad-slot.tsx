import { cn } from '@/lib/cn';
import { getAdSlotConfig } from '@/lib/ads-config';
import type { AdSlotKey } from '@/types/ads';

type AdSlotProps = {
  slotKey: AdSlotKey;
  className?: string;
};

export function AdSlot({ slotKey, className }: AdSlotProps) {
  const slot = getAdSlotConfig(slotKey);

  return (
    <div
      role="note"
      aria-label={`Espaço reservado para anúncio: ${slot.label}`}
      className={cn(
        'flex min-h-[96px] w-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-100 px-4 py-6 text-center',
        slot.className,
        className,
      )}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ad Placeholder</p>
        <p className="mt-1 text-sm font-medium text-slate-700">{slot.label}</p>
        <p className="mt-1 text-xs text-slate-500">Sugestão: {slot.sizeHint}</p>
        <p className="mt-1 text-[11px] text-slate-500">Slot ID: {slot.adSlotId}</p>
      </div>
    </div>
  );
}
