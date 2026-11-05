'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import {
  DYNAMIC_ISLAND,
  HOME_INDICATOR,
  IOS_FONT,
  IOS_PALETTES,
  type IosDevice,
} from '@/components/tools/instagram-post-simulator/phone/ios-theme';
import type { PhoneTheme } from '@/types/instagram-post-simulator';

type IosDeviceFrameProps = Readonly<{
  device: IosDevice;
  theme: PhoneTheme;
  showFrame: boolean;
  statusTime: string;
  /** Telas em tela cheia (Reels) usam a barra de status sobre a mídia. */
  statusOverMedia?: boolean;
  label: string;
  children: ReactNode;
}>;

const MAX_SCALE = 1.15;
const MIN_SCALE = 0.45;

/** Mede a largura disponível e reduz a moldura para caber sem mudar as proporções internas. */
const useFitScale = (outerWidth: number, outerHeight: number) => {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const update = () => {
      const available = element.clientWidth;
      const viewportHeight = window.innerHeight;
      const heightLimit = Math.max(320, viewportHeight - 210);
      const next = Math.min(available / outerWidth, heightLimit / outerHeight, MAX_SCALE);
      setScale(Math.max(MIN_SCALE, Number.isFinite(next) ? next : 1));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    window.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [outerWidth, outerHeight]);

  return { ref, scale };
};

function SignalIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true" focusable="false">
      <rect x="0" y="8" width="3" height="4" rx="0.8" fill={color} />
      <rect x="5" y="5.5" width="3" height="6.5" rx="0.8" fill={color} />
      <rect x="10" y="3" width="3" height="9" rx="0.8" fill={color} />
      <rect x="15" y="0" width="3" height="12" rx="0.8" fill={color} />
    </svg>
  );
}

function WifiIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true" focusable="false">
      <path d="M8 11.2 5.9 9a3 3 0 0 1 4.2 0L8 11.2Z" fill={color} />
      <path d="M3.4 6.9a6.6 6.6 0 0 1 9.2 0" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
      <path d="M1 4.2a10 10 0 0 1 14 0" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function BatteryIcon({ color }: { color: string }) {
  return (
    <svg width="27" height="13" viewBox="0 0 27 13" aria-hidden="true" focusable="false">
      <rect x="0.5" y="0.5" width="23" height="12" rx="3.6" fill="none" stroke={color} strokeOpacity="0.4" />
      <rect x="2" y="2" width="20" height="9" rx="2.2" fill={color} />
      <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill={color} fillOpacity="0.45" />
    </svg>
  );
}

export function IosDeviceFrame({ device, theme, showFrame, statusTime, statusOverMedia = false, label, children }: IosDeviceFrameProps) {
  const palette = IOS_PALETTES[theme];
  const bezel = showFrame ? device.bezel : 0;
  const outerWidth = device.width + bezel * 2;
  const outerHeight = device.height + bezel * 2;
  const { ref, scale } = useFitScale(outerWidth, outerHeight);
  const statusColor = statusOverMedia ? '#ffffff' : palette.text;

  return (
    <div
      ref={ref}
      role="region"
      aria-label={label}
      data-ios-device={device.label}
      style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
    >
      <div style={{ position: 'relative', width: outerWidth * scale, height: outerHeight * scale, flexShrink: 0 }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: outerWidth,
            height: outerHeight,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: device.radius + bezel,
              background: showFrame ? palette.frame : 'transparent',
              boxShadow: showFrame ? '0 22px 48px rgba(10, 38, 71, 0.22), inset 0 0 0 2px rgba(255,255,255,0.08)' : 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: bezel,
              top: bezel,
              width: device.width,
              height: device.height,
              borderRadius: device.radius,
              overflow: 'hidden',
              background: palette.bg,
              color: palette.text,
              fontFamily: IOS_FONT,
              fontSize: 14,
              lineHeight: 1.3,
              WebkitFontSmoothing: 'antialiased',
              isolation: 'isolate',
              textAlign: 'left',
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '50%',
                top: DYNAMIC_ISLAND.top,
                width: DYNAMIC_ISLAND.width,
                height: DYNAMIC_ISLAND.height,
                marginLeft: -DYNAMIC_ISLAND.width / 2,
                borderRadius: DYNAMIC_ISLAND.height / 2,
                background: '#000000',
                zIndex: 30,
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height: device.safeTop - 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 30px 0 44px',
                zIndex: 29,
                color: statusColor,
                pointerEvents: 'none',
              }}
            >
              <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: -0.2, fontVariantNumeric: 'tabular-nums' }}>{statusTime}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <SignalIcon color={statusColor} />
                <WifiIcon color={statusColor} />
                <BatteryIcon color={statusColor} />
              </span>
            </div>
            {children}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '50%',
                bottom: HOME_INDICATOR.bottom,
                width: HOME_INDICATOR.width,
                height: HOME_INDICATOR.height,
                marginLeft: -HOME_INDICATOR.width / 2,
                borderRadius: HOME_INDICATOR.height,
                background: statusOverMedia ? '#ffffff' : palette.text,
                zIndex: 31,
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
