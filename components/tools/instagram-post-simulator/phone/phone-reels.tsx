'use client';

/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import { Heart, MessageCircle, Music2, MoreHorizontal, Send, Volume2, VolumeX } from 'lucide-react';
import { SlideMedia } from '@/components/tools/instagram-post-simulator/phone/slide-media';
import { IOS_FONT, TAB_BAR_HEIGHT, type IosDevice, type IosPalette } from '@/components/tools/instagram-post-simulator/phone/ios-theme';
import { PhoneTabBar } from '@/components/tools/instagram-post-simulator/phone/phone-chrome';
import type { PhoneModel, PhoneSlide } from '@/components/tools/instagram-post-simulator/phone/phone-model';
import type { SimulatorCopy } from '@/data/i18n/instagram-post-simulator';
import type { PhoneView } from '@/types/instagram-post-simulator';
import { REEL_RATIO } from '@/lib/instagram-post-simulator/layout';

export type ReelsCopy = SimulatorCopy['phone'];

type PhoneReelsProps = Readonly<{
  model: PhoneModel;
  device: IosDevice;
  copy: ReelsCopy;
  reelSlide: PhoneSlide | null;
  liked: boolean;
  onToggleLike: () => void;
  showGuides: boolean;
  emptyText: string;
  onSelect: (view: PhoneView) => void;
  tabPalette: IosPalette;
}>;

const actionButton = {
  border: 0,
  background: 'transparent',
  padding: 0,
  color: '#ffffff',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  gap: 2,
  fontFamily: IOS_FONT,
  fontSize: 12,
  fontWeight: 600,
};

/**
 * Reels em tela cheia: vídeo 9:16 preenchendo a altura do aparelho (cover), com recorte lateral
 * igual ao do editor. Autoplay só é usado porque o vídeo começa mudo.
 */
export function PhoneReels({ model, device, copy, reelSlide, liked, onToggleLike, showGuides, emptyText, onSelect, tabPalette }: PhoneReelsProps) {
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const videoWidth = device.height * REEL_RATIO;
  const videoLeft = (device.width - videoWidth) / 2;
  const bottomSpace = TAB_BAR_HEIGHT + device.safeBottom + 12;
  const likes = model.reelLikes + (liked ? 1 : 0);

  const togglePlay = () => {
    if (!videoElement) return;
    if (videoElement.paused) {
      void videoElement.play().catch(() => setPlaying(false));
      setPlaying(true);
    } else {
      videoElement.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    setMuted((current) => {
      if (videoElement) videoElement.muted = !current;
      return !current;
    });
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#000000', color: '#ffffff', overflow: 'hidden', fontFamily: IOS_FONT }}>
      {reelSlide ? (
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: videoLeft, width: videoWidth, overflow: 'hidden' }}>
          <SlideMedia
            slide={reelSlide}
            showVideo
            muted={muted}
            loop
            autoPlay
            videoRef={setVideoElement}
            onVideoClick={togglePlay}
          />
        </div>
      ) : (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center', color: '#d4d4d4', fontSize: 15, lineHeight: 1.4 }}>
          {emptyText}
        </div>
      )}

      <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 320, background: 'linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0))', pointerEvents: 'none' }} />

      {reelSlide ? (
        <>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? copy.unmute : copy.mute}
            style={{ position: 'absolute', top: device.safeTop - 4, right: 14, width: 34, height: 34, borderRadius: 17, border: 0, background: 'rgba(0,0,0,0.45)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 4 }}
          >
            {muted ? <VolumeX size={17} aria-hidden="true" /> : <Volume2 size={17} aria-hidden="true" />}
          </button>

          {!playing ? (
            <button
              type="button"
              onClick={togglePlay}
              aria-label={copy.playVideo}
              style={{ position: 'absolute', left: '50%', top: '50%', width: 60, height: 60, marginLeft: -30, marginTop: -30, borderRadius: 30, border: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 4 }}
            >
              <span aria-hidden="true" style={{ width: 0, height: 0, borderLeft: '16px solid #ffffff', borderTop: '10px solid transparent', borderBottom: '10px solid transparent', marginLeft: 4 }} />
            </button>
          ) : null}

          <div style={{ position: 'absolute', right: 10, bottom: bottomSpace + 84, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, zIndex: 4 }}>
            <button type="button" onClick={onToggleLike} aria-label={liked ? copy.unlikeLabel : copy.likeLabel} aria-pressed={liked} style={actionButton}>
              <Heart size={28} strokeWidth={1.8} color={liked ? '#ff3040' : '#ffffff'} fill={liked ? '#ff3040' : 'none'} aria-hidden="true" />
              <span>{likes.toLocaleString('pt-BR')}</span>
            </button>
            <span style={actionButton} aria-hidden="true">
              <MessageCircle size={28} strokeWidth={1.8} aria-hidden="true" />
              <span>{model.reelComments.toLocaleString('pt-BR')}</span>
            </span>
            <span style={actionButton} aria-hidden="true">
              <Send size={26} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <span style={actionButton} aria-hidden="true">
              <MoreHorizontal size={26} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <span aria-hidden="true" style={{ width: 32, height: 32, borderRadius: 16, border: '6px solid #262626', background: '#444444', marginTop: 4 }} />
          </div>

          <div style={{ position: 'absolute', left: 14, right: 80, bottom: bottomSpace, zIndex: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600 }}>
              <img src={model.profile.avatarUrl} alt="" width={30} height={30} draggable={false} style={{ width: 30, height: 30, borderRadius: 15, objectFit: 'cover', border: '1px solid #ffffff' }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>{model.profile.username}</span>
              <span style={{ border: '1px solid #ffffff', borderRadius: 7, padding: '3px 9px', fontSize: 12, fontWeight: 600 }}>{copy.follow}</span>
            </div>
            <p style={{ margin: '8px 0 0', fontSize: 14, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {model.reelCaption}
            </p>
            <p style={{ margin: '6px 0 0', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <Music2 size={14} aria-hidden="true" />
              {copy.audio}
            </p>
          </div>
        </>
      ) : null}

      {showGuides ? (
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: device.safeTop, border: '1px dashed rgba(255,255,255,0.7)', borderWidth: '0 0 1px 0' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: TAB_BAR_HEIGHT + device.safeBottom, height: 1, borderTop: '1px dashed rgba(255,255,255,0.7)' }} />
          <div style={{ position: 'absolute', top: device.safeTop, bottom: TAB_BAR_HEIGHT + device.safeBottom, right: 0, width: 64, borderLeft: '1px dashed rgba(255,255,255,0.7)' }} />
        </div>
      ) : null}

      <PhoneTabBar device={device} palette={tabPalette} active="reels" avatarUrl={model.profile.avatarUrl} copy={copy} onSelect={onSelect} overlay />
    </div>
  );
}
