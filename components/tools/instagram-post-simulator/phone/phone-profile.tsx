'use client';

/* eslint-disable @next/next/no-img-element */

import { useState, type CSSProperties } from 'react';
import { ChevronDown, Clapperboard, Layers, LayoutGrid, Lock, Plus, Play, SquareUser, Menu } from 'lucide-react';
import { GridTileMedia } from '@/components/tools/instagram-post-simulator/phone/slide-media';
import { IOS_FONT, type IosDevice, type IosPalette } from '@/components/tools/instagram-post-simulator/phone/ios-theme';
import { PhoneContentArea, PhoneNavBar } from '@/components/tools/instagram-post-simulator/phone/phone-chrome';
import type { PhoneModel, PhonePost } from '@/components/tools/instagram-post-simulator/phone/phone-model';
import { getGridWindow } from '@/lib/instagram-post-simulator/layout';
import type { SimulatorCopy } from '@/data/i18n/instagram-post-simulator';

export type ProfileCopy = SimulatorCopy['phone'];

type PhoneProfileProps = Readonly<{
  model: PhoneModel;
  device: IosDevice;
  palette: IosPalette;
  copy: ProfileCopy;
  emptyText: string;
  onOpenPost: (id: string) => void;
}>;

const tile = (post: PhonePost, palette: IosPalette, copy: ProfileCopy, onOpen: () => void) => {
  const cover = post.cover;
  const isCarousel = post.slides.length > 1;
  const isReel = post.kind === 'reel';
  const iconStyle: CSSProperties = { position: 'absolute', top: 6, right: 6, zIndex: 2, color: '#ffffff', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' };

  return (
    <button
      key={post.id}
      type="button"
      onClick={onOpen}
      aria-label={`${copy.yourPost}: ${post.username}`}
      style={{ position: 'relative', display: 'block', width: '100%', aspectRatio: '3 / 4', padding: 0, border: 0, overflow: 'hidden', background: palette.surfaceAlt, cursor: 'pointer' }}
    >
      {cover ? (
        <GridTileMedia slide={cover.slide} window={getGridWindow(cover.frameRatio, cover.gridCrop)} />
      ) : null}
      {isCarousel ? <Layers size={16} aria-label={copy.carouselIcon} style={iconStyle} /> : null}
      {isReel && !isCarousel ? <Clapperboard size={16} aria-label={copy.reelIcon} style={iconStyle} /> : null}
      {!isCarousel && !isReel && cover?.slide.kind === 'video' ? <Play size={16} fill="#ffffff" aria-label={copy.videoIcon} style={iconStyle} /> : null}
    </button>
  );
};

export function PhoneProfile({ model, device, palette, copy, emptyText, onOpenPost }: PhoneProfileProps) {
  const [tab, setTab] = useState<'grid' | 'reels' | 'tagged'>('grid');
  const { profile, posts } = model;
  const postsCount = posts.length;
  const followers = 1204 + postsCount * 3;
  const following = 318;
  const tabColor = (active: boolean) => (active ? palette.text : palette.muted);
  const tabLine = (active: boolean): CSSProperties => ({ flex: 1, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 0, background: 'transparent', borderBottom: `1px solid ${active ? palette.text : 'transparent'}`, color: tabColor(active), cursor: 'pointer', padding: 0 });

  return (
    <>
      <PhoneNavBar
        device={device}
        palette={palette}
        title={(
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Lock size={13} aria-hidden="true" />
            {profile.username}
            <ChevronDown size={16} aria-hidden="true" />
          </span>
        )}
        right={(
          <>
            <Plus size={24} strokeWidth={1.8} color={palette.text} aria-hidden="true" />
            <Menu size={24} strokeWidth={1.8} color={palette.text} aria-hidden="true" />
          </>
        )}
      />
      <PhoneContentArea device={device}>
        <section style={{ padding: '14px 16px 8px', color: palette.text, fontFamily: IOS_FONT, fontSize: 14, lineHeight: 1.35 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <img
              src={profile.avatarUrl}
              alt=""
              width={86}
              height={86}
              draggable={false}
              style={{ width: 86, height: 86, borderRadius: 43, objectFit: 'cover', flexShrink: 0, display: 'block', boxShadow: `0 0 0 1px ${palette.separator}` }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', flex: 1, textAlign: 'center', gap: 4 }}>
              {[
                { value: postsCount, label: copy.postsCount },
                { value: followers.toLocaleString('pt-BR'), label: copy.followers },
                { value: following.toLocaleString('pt-BR'), label: copy.following },
              ].map((stat) => (
                <div key={stat.label} style={{ minWidth: 0 }}>
                  <span style={{ display: 'block', fontWeight: 700, fontSize: 16 }}>{stat.value}</span>
                  <span style={{ display: 'block', fontSize: 12 }}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 10 }}>
            <p style={{ margin: 0, fontWeight: 600 }}>{profile.displayName}</p>
            {profile.bio ? <p style={{ margin: '2px 0 0', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{profile.bio}</p> : null}
          </div>

          <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
            {[copy.editProfile, copy.shareProfile].map((label) => (
              <span
                key={label}
                aria-hidden="true"
                style={{ flex: 1, height: 32, borderRadius: 8, background: palette.surfaceAlt, color: palette.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 13 }}
              >
                {label}
              </span>
            ))}
            <span aria-hidden="true" style={{ width: 32, height: 32, borderRadius: 8, background: palette.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={16} color={palette.text} />
            </span>
          </div>
        </section>

        <div role="tablist" aria-label={copy.gridTab} style={{ display: 'flex', borderTop: `0.5px solid ${palette.separator}`, borderBottom: `0.5px solid ${palette.separator}` }}>
          <button type="button" role="tab" aria-selected={tab === 'grid'} aria-label={copy.gridTab} onClick={() => setTab('grid')} style={tabLine(tab === 'grid')}>
            <LayoutGrid size={22} strokeWidth={tab === 'grid' ? 2.2 : 1.6} aria-hidden="true" />
          </button>
          <button type="button" role="tab" aria-selected={tab === 'reels'} aria-label={copy.reelsTab} onClick={() => setTab('reels')} style={tabLine(tab === 'reels')}>
            <Clapperboard size={22} strokeWidth={tab === 'reels' ? 2.2 : 1.6} aria-hidden="true" />
          </button>
          <button type="button" role="tab" aria-selected={tab === 'tagged'} aria-label={copy.taggedTab} onClick={() => setTab('tagged')} style={tabLine(tab === 'tagged')}>
            <SquareUser size={22} strokeWidth={tab === 'tagged' ? 2.2 : 1.6} aria-hidden="true" />
          </button>
        </div>

        {tab !== 'grid' ? (
          <p style={{ margin: 0, padding: '40px 24px', textAlign: 'center', color: palette.muted, fontSize: 14, fontFamily: IOS_FONT }}>{copy.reelLocked}</p>
        ) : posts.length === 0 ? (
          <p style={{ margin: 0, padding: '40px 24px', textAlign: 'center', color: palette.muted, fontSize: 14, fontFamily: IOS_FONT }}>{emptyText}</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 1 }}>
            {posts.map((post) => tile(post, palette, copy, () => onOpenPost(post.id)))}
          </div>
        )}
        <div style={{ height: 24 }} />
      </PhoneContentArea>
    </>
  );
}
