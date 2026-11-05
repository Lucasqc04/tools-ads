'use client';

import { GridTileMedia, SlideMedia } from '@/components/tools/instagram-post-simulator/phone/slide-media';
import type { PhoneSlide } from '@/components/tools/instagram-post-simulator/phone/phone-model';
import { Notice, RangeField, SectionCard } from '@/components/tools/instagram-post-simulator/editor/editor-ui';
import { getGridCutPercent, getGridWindow, GRID_RATIO, clampCrop } from '@/lib/instagram-post-simulator/layout';
import type { PanCrop } from '@/types/instagram-post-simulator';

export type GridCoverLabels = {
  gridTitle: string;
  gridHint: string;
  gridCutWarning: (percent: number) => string;
  gridWindowLabel: string;
  gridPosX: string;
  gridPosY: string;
};

type GridCoverEditorProps = Readonly<{
  frameRatio: number;
  gridCrop: PanCrop;
  slide: PhoneSlide | null;
  onChange: (crop: PanCrop) => void;
  labels: GridCoverLabels;
}>;

/**
 * Mostra qual parte do post cai na grade 3:4 do perfil e permite reposicionar essa janela.
 * A área fora da janela é escurecida; o post original não é alterado.
 */
export function GridCoverEditor({ frameRatio, gridCrop, slide, onChange, labels }: GridCoverEditorProps) {
  const window = getGridWindow(frameRatio, gridCrop);
  const cutPercent = getGridCutPercent(frameRatio);
  const canMoveX = window.width < 1;
  const canMoveY = window.height < 1;
  const previewWidth = 180;

  return (
    <SectionCard title={labels.gridTitle} hint={labels.gridHint}>
      <div className="flex flex-wrap items-start gap-4">
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-700">{labels.gridWindowLabel}</p>
          <div
            className="relative overflow-hidden rounded-lg bg-slate-900 ring-1 ring-slate-300"
            style={{ width: previewWidth, aspectRatio: String(frameRatio) }}
          >
            {slide ? <SlideMedia slide={slide} showVideo={false} /> : null}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: `${window.left * 100}%`,
                top: `${window.top * 100}%`,
                width: `${window.width * 100}%`,
                height: `${window.height * 100}%`,
                border: '2px dashed #53a4ff',
                boxShadow: '0 0 0 999px rgba(15, 23, 42, 0.5)',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-700">{labels.gridTitle}</p>
          <div className="relative overflow-hidden rounded-md bg-slate-900 ring-1 ring-slate-300" style={{ width: 96, aspectRatio: String(GRID_RATIO) }}>
            {slide ? <GridTileMedia slide={slide} window={window} /> : null}
          </div>
        </div>
      </div>

      {cutPercent > 0 ? (
        <Notice tone="info">{labels.gridCutWarning(cutPercent)}</Notice>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <RangeField
          label={labels.gridPosX}
          min={0}
          max={1}
          step={0.01}
          value={gridCrop.x}
          disabled={!canMoveX}
          format={(value) => `${Math.round(value * 100)}%`}
          onChange={(x) => onChange(clampCrop({ ...gridCrop, x, zoom: 1 }))}
        />
        <RangeField
          label={labels.gridPosY}
          min={0}
          max={1}
          step={0.01}
          value={gridCrop.y}
          disabled={!canMoveY}
          format={(value) => `${Math.round(value * 100)}%`}
          onChange={(y) => onChange(clampCrop({ ...gridCrop, y, zoom: 1 }))}
        />
      </div>
    </SectionCard>
  );
}
