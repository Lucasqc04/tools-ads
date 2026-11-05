'use client';

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef } from 'react';
import { FeedPost, type FeedPostCopy } from '@/components/tools/instagram-post-simulator/phone/feed-post';
import type { IosDevice, IosPalette } from '@/components/tools/instagram-post-simulator/phone/ios-theme';
import { DefaultNavRight, PhoneContentArea, PhoneNavBar } from '@/components/tools/instagram-post-simulator/phone/phone-chrome';
import type { PhoneModel } from '@/components/tools/instagram-post-simulator/phone/phone-model';

export type FeedCopy = FeedPostCopy & { navTitle: string; stories: string; yourStory: string };

type PhoneFeedProps = Readonly<{
  model: PhoneModel;
  device: IosDevice;
  palette: IosPalette;
  copy: FeedCopy;
  likedIds: Set<string>;
  savedIds: Set<string>;
  focus: { id: string; token: number } | null;
  onToggleLike: (id: string) => void;
  onToggleSave: (id: string) => void;
  onEdit: () => void;
  onShare: () => void;
}>;

function StoriesTray({ model, palette, copy }: Readonly<{ model: PhoneModel; palette: IosPalette; copy: FeedCopy }>) {
  const items = [
    { id: 'own', label: copy.yourStory, url: model.profile.avatarUrl, own: true },
    ...model.demoAvatars.map((avatar) => ({ id: avatar.id, label: avatar.username, url: avatar.url, own: false })),
  ];

  return (
    <div
      role="list"
      aria-label={copy.stories}
      style={{ display: 'flex', gap: 12, padding: '10px 12px 8px', overflowX: 'auto', scrollbarWidth: 'none', borderBottom: `0.5px solid ${palette.separator}` }}
    >
      {items.map((item) => (
        <div key={item.id} role="listitem" style={{ width: 68, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span
            style={{
              width: 66,
              height: 66,
              borderRadius: 33,
              padding: 2,
              background: item.own ? palette.separator : 'linear-gradient(45deg, #f09433, #dc2743 55%, #bc1888)',
              display: 'flex',
            }}
          >
            <img
              src={item.url}
              alt=""
              draggable={false}
              style={{ width: '100%', height: '100%', borderRadius: 31, border: `2px solid ${palette.bg}`, objectFit: 'cover', display: 'block' }}
            />
          </span>
          <span style={{ fontSize: 11, color: palette.text, maxWidth: 68, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export function PhoneFeed({ model, device, palette, copy, likedIds, savedIds, focus, onToggleLike, onToggleSave, onEdit, onShare }: PhoneFeedProps) {
  const focusRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (focus && focusRef.current && typeof focusRef.current.scrollIntoView === 'function') {
      focusRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }, [focus]);

  return (
    <>
      <PhoneNavBar
        device={device}
        palette={palette}
        title={copy.navTitle}
        right={<DefaultNavRight palette={palette} label={copy.navTitle} />}
      />
      <PhoneContentArea device={device}>
        <StoriesTray model={model} palette={palette} copy={copy} />
        {model.posts.map((post) => (
          <div key={post.id} ref={post.id === focus?.id ? focusRef : undefined}>
            <FeedPost
              post={post}
              palette={palette}
              copy={copy}
              liked={likedIds.has(post.id)}
              saved={savedIds.has(post.id)}
              onToggleLike={() => onToggleLike(post.id)}
              onToggleSave={() => onToggleSave(post.id)}
              onEdit={onEdit}
              onShare={onShare}
              highlighted={post.id === focus?.id}
            />
            <div aria-hidden="true" style={{ height: 8, background: palette.surfaceAlt, opacity: 0.6 }} />
          </div>
        ))}
        <div style={{ height: 24 }} />
      </PhoneContentArea>
    </>
  );
}
