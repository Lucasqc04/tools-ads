export type AdSlotKey = 'top' | 'inContent' | 'sidebar' | 'footer';

export type AdSlotConfig = {
  key: AdSlotKey;
  label: string;
  sizeHint: string;
  className?: string;
  adSlotId?: string;
};
