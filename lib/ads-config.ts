import type { AdSlotConfig, AdSlotKey } from '@/types/ads';

export const adSlotsRegistry: Record<AdSlotKey, AdSlotConfig> = {
  top: {
    key: 'top',
    label: 'Topo da página',
    sizeHint: 'Responsivo 970x90 / 320x100',
    adSlotId: 'REPLACE_TOP_SLOT_ID',
  },
  inContent: {
    key: 'inContent',
    label: 'Entre ferramenta e conteúdo',
    sizeHint: 'Responsivo 728x90 / 336x280',
    adSlotId: 'REPLACE_IN_CONTENT_SLOT_ID',
  },
  sidebar: {
    key: 'sidebar',
    label: 'Lateral desktop',
    sizeHint: '300x250 ou 300x600',
    className: 'sticky top-20 min-h-[250px]',
    adSlotId: 'REPLACE_SIDEBAR_SLOT_ID',
  },
  footer: {
    key: 'footer',
    label: 'Final da página',
    sizeHint: 'Responsivo 728x90 / 320x100',
    adSlotId: 'REPLACE_FOOTER_SLOT_ID',
  },
};

export const getAdSlotConfig = (key: AdSlotKey): AdSlotConfig => adSlotsRegistry[key];
