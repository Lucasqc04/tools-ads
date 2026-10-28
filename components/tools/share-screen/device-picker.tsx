'use client';

import { SwitchCamera } from 'lucide-react';
import type { DetectedFacing, FacingMode, MediaDeviceOption } from '@/lib/screenshare/devices';

export type DevicePickerCopy = {
  cameraSource: string;
  microphoneSource: string;
  speakerSource: string;
  defaultDevice: string;
  cameraSide: string;
  frontCamera: string;
  rearCamera: string;
  switchCamera: string;
  mirrorSelf: string;
  speakerUnsupported: string;
};

type Props = {
  theme: 'light' | 'dark';
  copy: DevicePickerCopy;
  cameras: MediaDeviceOption[];
  microphones: MediaDeviceOption[];
  speakers: MediaDeviceOption[];
  cameraId: string;
  microphoneId: string;
  speakerId: string;
  facing: DetectedFacing;
  showFacing: boolean;
  outputSupported: boolean;
  mirror: boolean;
  onCamera: (deviceId: string) => void;
  onMicrophone: (deviceId: string) => void;
  onSpeaker: (deviceId: string) => void;
  onFacing: (facing: FacingMode) => void;
  onMirror: (mirror: boolean) => void;
};

const themes = {
  light: {
    label: 'text-slate-800',
    select: 'border-slate-300 bg-white text-slate-900 focus:border-brand-400 focus:ring-brand-500/30',
    segment: 'border-slate-300 bg-white text-slate-700',
    segmentActive: 'border-brand-300 bg-brand-50 text-brand-800',
    muted: 'text-slate-500',
    check: 'text-slate-700 accent-brand-600',
  },
  dark: {
    label: 'text-ink-300',
    select: 'border-ink-700 bg-ink-950 text-white focus:border-accent-500 focus:ring-accent-500/30',
    segment: 'border-ink-700 bg-ink-950 text-ink-300',
    segmentActive: 'border-accent-500 bg-accent-500 text-ink-950',
    muted: 'text-ink-400',
    check: 'text-ink-300 accent-accent-500',
  },
} as const;

export function DevicePicker({
  theme, copy, cameras, microphones, speakers, cameraId, microphoneId, speakerId, facing, showFacing, outputSupported, mirror,
  onCamera, onMicrophone, onSpeaker, onFacing, onMirror,
}: Props) {
  const t = themes[theme];
  // 16px on phones: iOS Safari zooms the whole page when a smaller field gets focus.
  const selectClass = `mt-1.5 h-11 w-full min-w-0 rounded-lg border px-3 text-base focus:outline-none focus:ring-2 sm:text-sm ${t.select}`;
  const select = (label: string, value: string, options: MediaDeviceOption[], onChange: (id: string) => void) => (
    <label className={`block min-w-0 text-sm font-medium ${t.label}`}>
      <span>{label}</span>
      <select value={options.some((option) => option.id === value) ? value : ''} onChange={(event) => onChange(event.target.value)} className={selectClass} disabled={!options.length}>
        <option value="">{copy.defaultDevice}</option>
        {options.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
      </select>
    </label>
  );

  return (
    <div className="min-w-0 space-y-3">
      {showFacing ? (
        <fieldset className="min-w-0">
          <legend className={`mb-1.5 text-sm font-medium ${t.label}`}>{copy.cameraSide}</legend>
          <div className="grid grid-cols-2 gap-2">
            {([['user', copy.frontCamera], ['environment', copy.rearCamera]] as const).map(([value, label]) => (
              <button key={value} type="button" aria-pressed={facing === value} onClick={() => onFacing(value)} className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg border text-sm font-medium transition ${facing === value ? t.segmentActive : t.segment}`}>
                <SwitchCamera size={16} aria-hidden="true" />{label}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}
      {select(copy.cameraSource, cameraId, cameras, onCamera)}
      {select(copy.microphoneSource, microphoneId, microphones, onMicrophone)}
      {outputSupported ? select(copy.speakerSource, speakerId, speakers, onSpeaker) : <p className={`text-xs leading-5 ${t.muted}`}>{copy.speakerUnsupported}</p>}
      <label className={`flex items-center gap-2 text-sm ${t.check}`}><input type="checkbox" checked={mirror} onChange={(event) => onMirror(event.target.checked)} />{copy.mirrorSelf}</label>
    </div>
  );
}
