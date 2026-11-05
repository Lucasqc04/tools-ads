'use client';

import { useEffect, useRef, useState } from 'react';
import type { SimulatorCopy } from '@/data/i18n/instagram-post-simulator';
import { IosDeviceFrame } from '@/components/tools/instagram-post-simulator/phone/ios-device-frame';
import { IOS_PALETTES, type IosDevice } from '@/components/tools/instagram-post-simulator/phone/ios-theme';
import { PhoneFeed } from '@/components/tools/instagram-post-simulator/phone/phone-feed';
import { PhoneProfile } from '@/components/tools/instagram-post-simulator/phone/phone-profile';
import { PhoneReels } from '@/components/tools/instagram-post-simulator/phone/phone-reels';
import { PhoneTabBar } from '@/components/tools/instagram-post-simulator/phone/phone-chrome';
import type { PhoneModel } from '@/components/tools/instagram-post-simulator/phone/phone-model';
import type { PhoneTheme, PhoneView } from '@/types/instagram-post-simulator';

const NOTICE_MS = 2800;
const OWN_POST_ID = 'own';

type FocusRequest = { id: string; token: number };

type PhoneScreenProps = Readonly<{
  model: PhoneModel;
  view: PhoneView;
  onViewChange: (view: PhoneView) => void;
  onEdit: () => void;
  theme: PhoneTheme;
  device: IosDevice;
  showFrame: boolean;
  statusTime: string;
  showGuides: boolean;
  copy: SimulatorCopy;
  label: string;
  /** Pedido de foco no post (ex.: ao finalizar a simulação). Muda sempre que o pedido for repetido. */
  focusRequest: number;
}>;

const toggleInSet = (current: Set<string>, id: string): Set<string> => {
  const next = new Set(current);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
};

/** Tela do iPhone: alterna feed, perfil e Reels e guarda curtidas, salvos e avisos da simulação. */
export function PhoneScreen({ model, view, onViewChange, onEdit, theme, device, showFrame, statusTime, showGuides, copy, label, focusRequest }: PhoneScreenProps) {
  const palette = IOS_PALETTES[theme];
  const phone = copy.phone;
  const [likedIds, setLikedIds] = useState<Set<string>>(() => new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set());
  const [focus, setFocus] = useState<FocusRequest | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number | null>(null);

  useEffect(() => {
    if (focusRequest > 0) setFocus({ id: OWN_POST_ID, token: focusRequest });
  }, [focusRequest]);

  useEffect(() => () => {
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
  }, []);

  const showNotice = (text: string) => {
    setNotice(text);
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), NOTICE_MS);
  };

  const select = (next: PhoneView) => {
    setFocus(null);
    onViewChange(next);
  };

  const openPost = (id: string) => {
    setFocus({ id, token: Date.now() });
    onViewChange('feed');
  };

  const reelSlide = model.reelSlide;

  return (
    <IosDeviceFrame device={device} theme={theme} showFrame={showFrame} statusTime={statusTime} statusOverMedia={view === 'reels'} label={label}>
      {view === 'feed' ? (
        <PhoneFeed
          model={model}
          device={device}
          palette={palette}
          copy={phone}
          likedIds={likedIds}
          savedIds={savedIds}
          focus={focus}
          onToggleLike={(id) => setLikedIds((current) => toggleInSet(current, id))}
          onToggleSave={(id) => setSavedIds((current) => toggleInSet(current, id))}
          onEdit={onEdit}
          onShare={() => showNotice(phone.sharedNote)}
        />
      ) : null}

      {view === 'profile' ? (
        <PhoneProfile
          model={model}
          device={device}
          palette={palette}
          copy={phone}
          emptyText={copy.profileEmpty}
          onOpenPost={openPost}
        />
      ) : null}

      {view === 'reels' ? (
        <PhoneReels
          model={model}
          device={device}
          copy={phone}
          reelSlide={reelSlide}
          liked={likedIds.has(OWN_POST_ID)}
          onToggleLike={() => setLikedIds((current) => toggleInSet(current, OWN_POST_ID))}
          showGuides={showGuides}
          emptyText={copy.reelEmpty}
          onSelect={select}
          tabPalette={palette}
        />
      ) : null}

      {view !== 'reels' ? (
        <PhoneTabBar
          device={device}
          palette={palette}
          active={view}
          avatarUrl={model.profile.avatarUrl}
          copy={phone}
          onSelect={select}
        />
      ) : null}

      {notice ? (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'absolute',
            left: '50%',
            bottom: device.safeBottom + 64,
            transform: 'translateX(-50%)',
            maxWidth: '82%',
            padding: '9px 14px',
            borderRadius: 14,
            background: 'rgba(38, 38, 38, 0.94)',
            color: '#ffffff',
            fontSize: 13,
            lineHeight: 1.35,
            textAlign: 'center',
            zIndex: 45,
            boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
          }}
        >
          {notice}
        </div>
      ) : null}
    </IosDeviceFrame>
  );
}
