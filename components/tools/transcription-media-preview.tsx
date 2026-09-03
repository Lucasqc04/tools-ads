'use client';

import { forwardRef } from 'react';
import type { MediaKind } from '@/hooks/use-transcription';

type TranscriptionMediaPreviewProps = Readonly<{
  mediaUrl: string;
  mediaKind: MediaKind;
  onTimeUpdate?: (currentTime: number) => void;
}>;

export const TranscriptionMediaPreview = forwardRef<
  HTMLVideoElement | HTMLAudioElement,
  TranscriptionMediaPreviewProps
>(function TranscriptionMediaPreview({ mediaUrl, mediaKind, onTimeUpdate }, ref) {
  const handleTimeUpdate = (event: React.SyntheticEvent<HTMLMediaElement>) => {
    onTimeUpdate?.(event.currentTarget.currentTime);
  };

  if (mediaKind === 'video') {
    return (
      <video
        ref={ref as React.Ref<HTMLVideoElement>}
        src={mediaUrl}
        controls
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        className="w-full rounded-lg border border-slate-200 bg-black/90"
      />
    );
  }

  return (
    <audio
      ref={ref as React.Ref<HTMLAudioElement>}
      src={mediaUrl}
      controls
      preload="metadata"
      onTimeUpdate={handleTimeUpdate}
      className="w-full"
    />
  );
});
