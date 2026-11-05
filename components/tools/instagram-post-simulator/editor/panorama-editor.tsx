'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { CropEditor } from '@/components/tools/instagram-post-simulator/editor/crop-editor';
import { FilterControls } from '@/components/tools/instagram-post-simulator/editor/filter-controls';
import { ChoiceGroup, Hint, Notice, RangeField, SectionCard } from '@/components/tools/instagram-post-simulator/editor/editor-ui';
import type { SimulatorCopy } from '@/data/i18n/instagram-post-simulator';
import { MAX_PANORAMA_SLIDES, MIN_PANORAMA_SLIDES, getPanoramaCompositeRatio } from '@/lib/instagram-post-simulator/layout';
import type { PanoramaAspectId, PanoramaSettings, FitMode, PanCrop } from '@/types/instagram-post-simulator';

type PanoramaEditorProps = Readonly<{
  panorama: PanoramaSettings;
  copy: SimulatorCopy;
  onPickImage: (file: File) => void;
  onChange: (patch: Partial<Omit<PanoramaSettings, 'source'>>) => void;
}>;

const aspectOptions: Array<{ value: PanoramaAspectId; label: string }> = [
  { value: '4:5', label: '4:5' },
  { value: '3:4', label: '3:4' },
];

/** Divisões entre slides desenhadas sobre o quadro composto; ficam exatamente nas fronteiras. */
function SlideDividers({ count, slideLabel }: Readonly<{ count: number; slideLabel: (index: number) => string }>) {
  return (
    <>
      {Array.from({ length: count - 1 }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          style={{ position: 'absolute', top: 0, bottom: 0, left: `${((index + 1) / count) * 100}%`, width: 0, borderLeft: '2px solid rgba(255,255,255,0.9)', pointerEvents: 'none', boxShadow: '0 0 0 1px rgba(15,23,42,0.35)' }}
        />
      ))}
      {Array.from({ length: count }, (_, index) => (
        <span
          key={`label-${index}`}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2 rounded-md bg-slate-900/75 px-1.5 py-0.5 text-[11px] font-semibold text-white"
          style={{ left: `calc(${(index / count) * 100}% + 8px)` }}
        >
          {slideLabel(index + 1)}
        </span>
      ))}
    </>
  );
}

/** Carrossel contínuo: uma imagem larga atravessa de 2 a 20 slides, exportados com largura exata. */
export function PanoramaEditor({ panorama, copy, onPickImage, onChange }: PanoramaEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const source = panorama.source;
  const compositeRatio = getPanoramaCompositeRatio(panorama.count, panorama.aspect);

  return (
    <div className="space-y-6">
      <SectionCard title={copy.panoramaTitle} hint={copy.panoramaHint}>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" onClick={() => inputRef.current?.click()}>
            {copy.panoramaChooseImage}
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = '';
              if (file) onPickImage(file);
            }}
          />
        </div>

        {!source ? (
          <Notice tone="info">{copy.panoramaNeedsImage}</Notice>
        ) : (
          <>
            <RangeField
              label={copy.panoramaCount}
              min={MIN_PANORAMA_SLIDES}
              max={MAX_PANORAMA_SLIDES}
              step={1}
              value={panorama.count}
              format={(value) => String(Math.round(value))}
              onChange={(value) => onChange({ count: Math.round(value) })}
            />
            <Hint>{copy.panoramaSlidesNote(panorama.count)}</Hint>
            <ChoiceGroup<PanoramaAspectId>
              legend={copy.aspectLabel}
              value={panorama.aspect}
              onChange={(aspect) => onChange({ aspect })}
              options={aspectOptions}
              columns="grid-cols-2"
            />
          </>
        )}
      </SectionCard>

      {source ? (
        <SectionCard title={copy.fitLabel} hint={copy.panLabel}>
          <CropEditor
            source={{ kind: 'image', url: source.url, width: source.width, height: source.height }}
            frameRatio={compositeRatio}
            crop={panorama.crop}
            fit={panorama.fit}
            filters={panorama.filters}
            onChange={(crop: PanCrop) => onChange({ crop })}
            onFitChange={(fit: FitMode) => onChange({ fit })}
            labels={{ panLabel: copy.panLabel, zoomLabel: copy.zoomLabel, resetCrop: copy.resetCrop, cutAreaHint: copy.cutAreaHint, fitLabel: copy.fitLabel, fill: copy.fill, fit: copy.fit }}
            ariaLabel={copy.panoramaTitle}
            maxFrameHeight={360}
            overlay={<SlideDividers count={panorama.count} slideLabel={copy.slideLabel} />}
          />
        </SectionCard>
      ) : null}

      {source ? (
        <FilterControls
          filters={panorama.filters}
          onChange={(filters) => onChange({ filters })}
          labels={copy}
        />
      ) : null}
    </div>
  );
}
