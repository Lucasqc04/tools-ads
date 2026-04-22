'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';

type IframeNetworkAdProps = {
  adKey: string;
  width: number;
  height: number;
  className?: string;
};

function IframeNetworkAd({
  adKey,
  width,
  height,
  className,
}: Readonly<IframeNetworkAdProps>) {
  const slotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot) {
      return;
    }

    slot.innerHTML = '';

    const configScript = document.createElement('script');
    configScript.text = `atOptions = {'key':'${adKey}','format':'iframe','height':${height},'width':${width},'params':{}};`;

    const invokeScript = document.createElement('script');
    invokeScript.src = `https://www.highperformanceformat.com/${adKey}/invoke.js`;
    invokeScript.async = false;

    slot.appendChild(configScript);
    slot.appendChild(invokeScript);

    return () => {
      slot.innerHTML = '';
    };
  }, [adKey, height, width]);

  return (
    <div
      className={cn('overflow-hidden', className)}
      style={{ width, height }}
      aria-label="Advertisement"
      role="complementary"
    >
      <div ref={slotRef} style={{ width, height }} />
    </div>
  );
}

export function DesktopLeaderboardAd({ className }: Readonly<{ className?: string }>) {
  return (
    <IframeNetworkAd
      adKey="dd46f8b256832e570df5ec6122ccc877"
      width={728}
      height={90}
      className={className}
    />
  );
}

export function MediumRectangleAd({ className }: Readonly<{ className?: string }>) {
  return (
    <IframeNetworkAd
      adKey="0fc3545b709ae9d95ae95fc635bb6248"
      width={300}
      height={250}
      className={className}
    />
  );
}

export function MobileBottomAd({ className }: Readonly<{ className?: string }>) {
  return (
    <IframeNetworkAd
      adKey="7b014c0aa2c3dd0afe15aec233047b90"
      width={320}
      height={50}
      className={className}
    />
  );
}
