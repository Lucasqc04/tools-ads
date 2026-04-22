'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

type IframeNetworkAdProps = {
  adKey: string;
  width: number;
  height: number;
  className?: string;
  enabled?: boolean;
};

type AtOptions = {
  key: string;
  format: 'iframe';
  height: number;
  width: number;
  params: Record<string, string>;
};

let adInitializationQueue = Promise.resolve();

const enqueueAdInitialization = (task: () => Promise<void>) => {
  adInitializationQueue = adInitializationQueue
    .then(task)
    .catch(() => undefined);

  return adInitializationQueue;
};

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    const update = () => setMatches(mediaQuery.matches);

    update();

    mediaQuery.addEventListener('change', update);

    return () => {
      mediaQuery.removeEventListener('change', update);
    };
  }, [query]);

  return matches;
};

function IframeNetworkAd({
  adKey,
  width,
  height,
  className,
  enabled = true,
}: Readonly<IframeNetworkAdProps>) {
  const slotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const slot = slotRef.current;
    if (!slot) {
      return;
    }

    let canceled = false;

    void enqueueAdInitialization(async () => {
      if (canceled) {
        return;
      }

      slot.innerHTML = '';

      (window as Window & { atOptions?: AtOptions }).atOptions = {
        key: adKey,
        format: 'iframe',
        height,
        width,
        params: {},
      };

      await new Promise<void>((resolve) => {
        let settled = false;
        const finalize = () => {
          if (settled) {
            return;
          }

          settled = true;
          window.clearTimeout(timeoutId);
          resolve();
        };

        const timeoutId = window.setTimeout(finalize, 6000);
        const invokeScript = document.createElement('script');
        invokeScript.src = `https://www.highperformanceformat.com/${adKey}/invoke.js`;
        invokeScript.async = true;
        invokeScript.referrerPolicy = 'no-referrer-when-downgrade';
        invokeScript.onload = finalize;
        invokeScript.onerror = finalize;

        if (!canceled) {
          slot.appendChild(invokeScript);
        } else {
          finalize();
        }
      });
    });

    return () => {
      canceled = true;
      slot.innerHTML = '';
    };
  }, [adKey, enabled, height, width]);

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
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <IframeNetworkAd
      adKey="dd46f8b256832e570df5ec6122ccc877"
      width={728}
      height={90}
      className={className}
      enabled={isDesktop}
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
  const isMobile = useMediaQuery('(max-width: 767px)');

  return (
    <IframeNetworkAd
      adKey="7b014c0aa2c3dd0afe15aec233047b90"
      width={320}
      height={50}
      className={className}
      enabled={isMobile}
    />
  );
}
