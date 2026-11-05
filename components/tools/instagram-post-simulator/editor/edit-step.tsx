'use client';

import type { Dispatch } from 'react';
import { CropEditor } from '@/components/tools/instagram-post-simulator/editor/crop-editor';
import { FilterControls } from '@/components/tools/instagram-post-simulator/editor/filter-controls';
import { GridCoverEditor } from '@/components/tools/instagram-post-simulator/editor/grid-cover-editor';
import { PanoramaEditor } from '@/components/tools/instagram-post-simulator/editor/panorama-editor';
import { ReelEditor } from '@/components/tools/instagram-post-simulator/editor/reel-editor';
import { SlideList } from '@/components/tools/instagram-post-simulator/editor/slide-list';
import { ChoiceGroup, FieldLabel, Hint, Notice, SectionCard } from '@/components/tools/instagram-post-simulator/editor/editor-ui';
import type { EditorCopy } from '@/components/tools/instagram-post-simulator/editor/editor-types';
import type { PhoneSlide } from '@/components/tools/instagram-post-simulator/phone/phone-model';
import { Input } from '@/components/ui/input';
import { getPostFrameRatio, getReelSlide, type DraftAction } from '@/lib/instagram-post-simulator/draft';
import { CAROUSEL_LIMIT, FRAME_ASPECTS } from '@/lib/instagram-post-simulator/layout';
import type { FitMode, FrameAspectId, PanCrop, PostDraft, PostType, SlideFilters } from '@/types/instagram-post-simulator';

type EditStepProps = Readonly<{
  draft: PostDraft;
  dispatch: Dispatch<DraftAction>;
  copy: EditorCopy;
  activeSlideId: string | null;
  onActiveSlide: (id: string) => void;
  onRemoveSlide: (id: string) => void;
  onPickPanoramaImage: (file: File) => void;
  onCaptureReelCover: (time: number) => void;
  onImportReelCover: (file: File) => void;
  onClearReelCover: () => void;
  onTrackMode: (postType: PostType) => void;
  onTrackFormat: (aspect: FrameAspectId) => void;
  coverSlide: PhoneSlide | null;
}>;

const postTypes: PostType[] = ['post', 'panorama', 'reel'];
const aspectIds: FrameAspectId[] = ['1:1', '4:5', '3:4', '1.91:1'];

/** Etapa de formato e edição: escolhe o tipo de publicação e ajusta cada mídia. */
export function EditStep({
  draft,
  dispatch,
  copy,
  activeSlideId,
  onActiveSlide,
  onRemoveSlide,
  onPickPanoramaImage,
  onCaptureReelCover,
  onImportReelCover,
  onClearReelCover,
  onTrackMode,
  onTrackFormat,
  coverSlide,
}: EditStepProps) {
  const reelSlide = getReelSlide(draft);
  const activeSlide = draft.slides.find((slide) => slide.id === activeSlideId) ?? draft.slides[0] ?? null;
  const activeIndex = activeSlide ? draft.slides.findIndex((slide) => slide.id === activeSlide.id) : -1;
  const frameRatio = getPostFrameRatio(draft);

  return (
    <div className="space-y-6">
      <SectionCard title={copy.postTypeLabel} hint={copy.postTypeHints[draft.postType]}>
        <ChoiceGroup<PostType>
          legend={copy.postTypeLabel}
          value={draft.postType}
          onChange={(postType) => {
            dispatch({ type: 'setPostType', postType });
            onTrackMode(postType);
          }}
          options={postTypes.map((value) => ({ value, label: copy.postTypes[value] }))}
          columns="grid-cols-1 sm:grid-cols-3"
        />
      </SectionCard>

      {draft.postType === 'panorama' ? (
        <PanoramaEditor
          panorama={draft.panorama}
          copy={copy}
          onPickImage={onPickPanoramaImage}
          onChange={(patch) => dispatch({ type: 'updatePanorama', patch })}
        />
      ) : null}

      {draft.postType === 'reel' ? (
        <ReelEditor
          draft={draft}
          reelSlide={reelSlide}
          copy={copy}
          slideCount={draft.slides.length}
          onCropChange={(crop: PanCrop) => reelSlide && dispatch({ type: 'updateSlide', id: reelSlide.id, patch: { crop } })}
          onFitChange={(fit: FitMode) => reelSlide && dispatch({ type: 'updateSlide', id: reelSlide.id, patch: { fit } })}
          onFiltersChange={(filters: SlideFilters) => reelSlide && dispatch({ type: 'updateSlide', id: reelSlide.id, patch: { filters } })}
          onCaptureFrame={onCaptureReelCover}
          onImportCover={onImportReelCover}
          onClearCover={onClearReelCover}
        />
      ) : null}

      {draft.postType === 'post' ? (
        <>
          <SectionCard title={copy.aspectLabel} hint={copy.aspectHelp}>
            <ChoiceGroup<FrameAspectId>
              legend={copy.aspectLabel}
              value={draft.aspect}
              onChange={(aspect) => {
                dispatch({ type: 'setAspect', aspect });
                onTrackFormat(aspect);
              }}
              options={aspectIds.map((id) => ({ value: id, label: copy.aspectNames[id] }))}
            />
            <Hint>{`${FRAME_ASPECTS[draft.aspect].width} × ${FRAME_ASPECTS[draft.aspect].height} px`}</Hint>
          </SectionCard>

          {draft.slides.length === 0 ? (
            <Notice tone="info">{copy.mediaHint}</Notice>
          ) : (
            <>
              <SectionCard title={copy.slidesCount(draft.slides.length, CAROUSEL_LIMIT)} hint={copy.dragHint}>
                <SlideList
                  slides={draft.slides}
                  activeId={activeSlide?.id ?? null}
                  onSelect={onActiveSlide}
                  onMove={(id, toIndex) => dispatch({ type: 'moveSlide', id, toIndex })}
                  onRemove={onRemoveSlide}
                  labels={{
                    kindPhoto: copy.kindPhoto,
                    kindVideo: copy.kindVideo,
                    remove: copy.remove,
                    moveLeft: copy.moveLeft,
                    moveRight: copy.moveRight,
                    slideLabel: copy.slideLabel,
                    activeSlideLabel: copy.activeSlideLabel,
                    dragHint: copy.dragHint,
                  }}
                />
              </SectionCard>

              {activeSlide ? (
                <SectionCard title={`${copy.activeSlideLabel}: ${copy.slideLabel(activeIndex + 1)}`} hint={activeSlide.kind === 'video' ? copy.videoPreviewNote : undefined}>
                  <CropEditor
                    source={{ kind: activeSlide.kind, url: activeSlide.url, posterUrl: activeSlide.thumbUrl, width: activeSlide.width, height: activeSlide.height }}
                    frameRatio={frameRatio}
                    crop={activeSlide.crop}
                    fit={activeSlide.fit}
                    filters={activeSlide.filters}
                    onChange={(crop) => dispatch({ type: 'updateSlide', id: activeSlide.id, patch: { crop } })}
                    onFitChange={(fit) => dispatch({ type: 'updateSlide', id: activeSlide.id, patch: { fit } })}
                    labels={{ panLabel: copy.panLabel, zoomLabel: copy.zoomLabel, resetCrop: copy.resetCrop, cutAreaHint: copy.cutAreaHint, fitLabel: copy.fitLabel, fill: copy.fill, fit: copy.fit }}
                    ariaLabel={`${copy.activeSlideLabel}: ${copy.slideLabel(activeIndex + 1)}`}
                  />
                  <FilterControls
                    filters={activeSlide.filters}
                    onChange={(filters) => dispatch({ type: 'updateSlide', id: activeSlide.id, patch: { filters } })}
                    onApplyAll={() => dispatch({ type: 'applyFiltersToAll', filters: activeSlide.filters })}
                    labels={copy}
                  />
                  <FieldLabel label={copy.altTextLabel}>
                    <Input
                      value={activeSlide.altText}
                      maxLength={300}
                      onChange={(event) => dispatch({ type: 'updateSlide', id: activeSlide.id, patch: { altText: event.target.value } })}
                    />
                    <Hint>{copy.altTextHint}</Hint>
                  </FieldLabel>
                </SectionCard>
              ) : null}

              <GridCoverEditor
                frameRatio={frameRatio}
                gridCrop={draft.gridCrop}
                slide={coverSlide}
                onChange={(crop) => dispatch({ type: 'setGridCrop', crop })}
                labels={copy}
              />
            </>
          )}
        </>
      ) : null}
    </div>
  );
}
