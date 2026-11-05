'use client';

import { Select } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { PhoneScreen } from '@/components/tools/instagram-post-simulator/phone/phone-screen';
import { IOS_DEVICES } from '@/components/tools/instagram-post-simulator/phone/ios-theme';
import type { PhoneModel } from '@/components/tools/instagram-post-simulator/phone/phone-model';
import { Notice } from '@/components/tools/instagram-post-simulator/editor/editor-ui';
import type { SimulatorCopy } from '@/data/i18n/instagram-post-simulator';
import { cn } from '@/lib/cn';
import type { PhoneModelId, PhoneTheme, PhoneView } from '@/types/instagram-post-simulator';

type PreviewPanelProps = Readonly<{
  copy: SimulatorCopy;
  model: PhoneModel;
  view: PhoneView;
  onViewChange: (view: PhoneView) => void;
  theme: PhoneTheme;
  onThemeChange: (theme: PhoneTheme) => void;
  device: PhoneModelId;
  onDeviceChange: (device: PhoneModelId) => void;
  showFrame: boolean;
  onShowFrameChange: (value: boolean) => void;
  showContext: boolean;
  onShowContextChange: (value: boolean) => void;
  showGuides: boolean;
  onShowGuidesChange: (value: boolean) => void;
  statusTime: string;
  onStatusTimeChange: (value: string) => void;
  onEdit: () => void;
  focusRequest: number;
  reelAvailable: boolean;
}>;

const views: PhoneView[] = ['feed', 'profile', 'reels'];

const segment = (selected: boolean) =>
  cn(
    'inline-flex min-h-10 flex-1 items-center justify-center rounded-lg border px-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300',
    selected ? 'border-brand-300 bg-brand-50 text-brand-800' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
  );

/** Painel de prévia: iPhone interativo e os controles de visualização, fora da moldura. */
export function PreviewPanel({
  copy,
  model,
  view,
  onViewChange,
  theme,
  onThemeChange,
  device,
  onDeviceChange,
  showFrame,
  onShowFrameChange,
  showContext,
  onShowContextChange,
  showGuides,
  onShowGuidesChange,
  statusTime,
  onStatusTimeChange,
  onEdit,
  focusRequest,
  reelAvailable,
}: PreviewPanelProps) {
  const viewLabel: Record<PhoneView, string> = { feed: copy.viewFeed, profile: copy.viewProfile, reels: copy.viewReels };
  const themeLabel: Record<PhoneTheme, string> = { light: copy.themeLight, dark: copy.themeDark };

  return (
    <Card className="space-y-4 p-4 md:p-5">
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-slate-900">{copy.previewTitle}</h3>
        <Notice tone="info">{copy.simulationNotice}</Notice>
      </div>

      <div className="grid gap-2" role="group" aria-label={copy.previewTitle}>
        <div className="flex gap-2">
          {views.map((value) => (
            <button key={value} type="button" aria-pressed={view === value} onClick={() => onViewChange(value)} className={segment(view === value)}>
              {viewLabel[value]}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {(['light', 'dark'] as PhoneTheme[]).map((value) => (
            <button key={value} type="button" aria-pressed={theme === value} onClick={() => onThemeChange(value)} className={segment(theme === value)}>
              {copy.themeLabel}: {themeLabel[value]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-700">{copy.deviceLabel}</span>
          <Select value={device} onChange={(event) => onDeviceChange(event.target.value as PhoneModelId)}>
            {(Object.keys(IOS_DEVICES) as PhoneModelId[]).map((id) => (
              <option key={id} value={id}>{IOS_DEVICES[id].label}</option>
            ))}
          </Select>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-700">{copy.statusTimeLabel}</span>
          <input
            type="time"
            value={statusTime}
            onChange={(event) => onStatusTimeChange(event.target.value || '09:41')}
            className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-800">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={showFrame} onChange={(event) => onShowFrameChange(event.target.checked)} className="h-4 w-4 accent-brand-600" />
          {copy.frameToggle}
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={showContext} onChange={(event) => onShowContextChange(event.target.checked)} className="h-4 w-4 accent-brand-600" />
          {copy.contextToggle}
        </label>
        <label className={cn('flex items-center gap-2', !reelAvailable && 'opacity-60')}>
          <input
            type="checkbox"
            checked={showGuides}
            disabled={!reelAvailable}
            onChange={(event) => onShowGuidesChange(event.target.checked)}
            className="h-4 w-4 accent-brand-600"
          />
          {copy.guidesToggle}
        </label>
      </div>

      <div className="flex justify-center">
        <div className="w-full">
          <PhoneScreen
            model={model}
            view={view}
            onViewChange={onViewChange}
            onEdit={onEdit}
            theme={theme}
            device={IOS_DEVICES[device]}
            showFrame={showFrame}
            statusTime={statusTime}
            showGuides={showGuides}
            copy={copy}
            label={copy.previewTitle}
            focusRequest={focusRequest}
          />
        </div>
      </div>
    </Card>
  );
}
