'use client';

/* eslint-disable @next/next/no-img-element */

import type { CSSProperties, ReactNode } from 'react';
import { Clapperboard, Heart, House, Search, Send, ShoppingBag } from 'lucide-react';
import { NAV_BAR_HEIGHT, TAB_BAR_HEIGHT, type IosDevice, type IosPalette } from '@/components/tools/instagram-post-simulator/phone/ios-theme';
import type { PhoneView } from '@/types/instagram-post-simulator';

export type ChromeCopy = {
  navTitle: string;
  tabHome: string;
  tabSearch: string;
  tabReels: string;
  tabShop: string;
  tabProfile: string;
};

type NavBarProps = Readonly<{
  device: IosDevice;
  palette: IosPalette;
  title: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
}>;

/** Barra superior de 44 pt logo abaixo da área de segurança. */
export function PhoneNavBar({ device, palette, title, left, right }: NavBarProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: device.safeTop,
        left: 0,
        right: 0,
        height: NAV_BAR_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 14px',
        background: palette.bg,
        borderBottom: `0.5px solid ${palette.separator}`,
        color: palette.text,
        zIndex: 5,
      }}
    >
      <div style={{ minWidth: 60, display: 'flex', alignItems: 'center', gap: 8 }}>{left}</div>
      <div style={{ fontWeight: 700, fontSize: 20, letterSpacing: -0.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%', textAlign: 'center' }}>
        {title}
      </div>
      <div style={{ minWidth: 60, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16 }}>{right}</div>
    </div>
  );
}

export function DefaultNavRight({ palette, label }: Readonly<{ palette: IosPalette; label: string }>) {
  return (
    <>
      <Heart size={24} strokeWidth={1.8} color={palette.text} aria-label={label} aria-hidden="true" />
      <Send size={23} strokeWidth={1.8} color={palette.text} aria-hidden="true" />
    </>
  );
}

type TabBarProps = Readonly<{
  device: IosDevice;
  palette: IosPalette;
  active: PhoneView;
  avatarUrl: string;
  copy: ChromeCopy;
  onSelect: (view: PhoneView) => void;
  overlay?: boolean;
}>;

/** Barra inferior: início, pesquisa, Reels, loja e perfil. Pesquisa e loja são só visuais. */
export function PhoneTabBar({ device, palette, active, avatarUrl, copy, onSelect, overlay = false }: TabBarProps) {
  const color = overlay ? '#ffffff' : palette.text;
  const background = overlay ? 'transparent' : palette.bg;
  const iconStyle: CSSProperties = { border: 0, background: 'transparent', padding: 0, cursor: 'pointer', color, display: 'flex', alignItems: 'center', justifyContent: 'center', height: TAB_BAR_HEIGHT, flex: 1 };

  return (
    <nav
      aria-label={copy.navTitle}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: TAB_BAR_HEIGHT + device.safeBottom,
        paddingBottom: device.safeBottom,
        background,
        borderTop: overlay ? 'none' : `0.5px solid ${palette.separator}`,
        display: 'flex',
        alignItems: 'flex-start',
        zIndex: 6,
      }}
    >
      <button type="button" aria-label={copy.tabHome} aria-current={active === 'feed' ? 'page' : undefined} onClick={() => onSelect('feed')} style={iconStyle}>
        <House size={26} strokeWidth={active === 'feed' ? 2.4 : 1.8} fill={active === 'feed' ? color : 'none'} aria-hidden="true" />
      </button>
      <span aria-label={copy.tabSearch} role="img" style={{ ...iconStyle, cursor: 'default' }}>
        <Search size={24} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <button type="button" aria-label={copy.tabReels} aria-current={active === 'reels' ? 'page' : undefined} onClick={() => onSelect('reels')} style={iconStyle}>
        <Clapperboard size={25} strokeWidth={active === 'reels' ? 2.4 : 1.8} aria-hidden="true" />
      </button>
      <span aria-label={copy.tabShop} role="img" style={{ ...iconStyle, cursor: 'default' }}>
        <ShoppingBag size={24} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <button type="button" aria-label={copy.tabProfile} aria-current={active === 'profile' ? 'page' : undefined} onClick={() => onSelect('profile')} style={iconStyle}>
        <img
          src={avatarUrl}
          alt=""
          width={26}
          height={26}
          draggable={false}
          style={{ width: 26, height: 26, borderRadius: 13, objectFit: 'cover', outline: active === 'profile' ? `2px solid ${color}` : 'none', outlineOffset: 1 }}
        />
      </button>
    </nav>
  );
}

/** Área de conteúdo entre a barra de navegação e a barra inferior. */
export function PhoneContentArea({ device, children, scroll = true }: Readonly<{ device: IosDevice; children: ReactNode; scroll?: boolean }>) {
  return (
    <div
      style={{
        position: 'absolute',
        top: device.safeTop + NAV_BAR_HEIGHT,
        left: 0,
        right: 0,
        bottom: TAB_BAR_HEIGHT + device.safeBottom,
        overflowY: scroll ? 'auto' : 'hidden',
        overscrollBehavior: 'contain',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {children}
    </div>
  );
}
