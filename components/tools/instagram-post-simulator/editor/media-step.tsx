'use client';

import type { Dispatch } from 'react';
import { FileUploadDropzone } from '@/components/shared/file-upload-dropzone';
import { Button } from '@/components/ui/button';
import { Notice, SectionCard } from '@/components/tools/instagram-post-simulator/editor/editor-ui';
import { SlideList } from '@/components/tools/instagram-post-simulator/editor/slide-list';
import type { EditorActions, EditorCopy } from '@/components/tools/instagram-post-simulator/editor/editor-types';
import { CAROUSEL_LIMIT } from '@/lib/instagram-post-simulator/layout';
import { MAX_VIDEO_BYTES } from '@/lib/instagram-post-simulator/media';
import type { DraftAction } from '@/lib/instagram-post-simulator/draft';
import type { AppLocale } from '@/lib/i18n/config';
import type { PostDraft } from '@/types/instagram-post-simulator';

export type MediaNotice = { tone: 'error' | 'info' | 'success'; text: string } | null;

type MediaStepProps = Readonly<{
  draft: PostDraft;
  dispatch: Dispatch<DraftAction>;
  copy: EditorCopy;
  locale: AppLocale;
  actions: EditorActions;
  processing: { done: number; total: number } | null;
  notice: MediaNotice;
}>;

const ACCEPTED_MEDIA = 'image/*,video/*,.heic,.heif,.mov,.mp4,.m4v,.webm';

/** Etapa de mídias: envio, exemplo local e lista ordenável dos itens do carrossel. */
export function MediaStep({ draft, dispatch, copy, locale, actions, processing, notice }: MediaStepProps) {
  const hasSlides = draft.slides.length > 0;
  const full = draft.slides.length >= CAROUSEL_LIMIT;

  return (
    <div className="space-y-6">
      <SectionCard title={copy.mediaTitle} hint={copy.mediaHint}>
        <FileUploadDropzone
          label={copy.dropzoneLabel}
          accept={ACCEPTED_MEDIA}
          maxSize={MAX_VIDEO_BYTES}
          multiple
          onFilesSelected={actions.addFiles}
          helperText={copy.dropzoneHint}
          locale={locale}
        />

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" onClick={actions.loadExample} disabled={full}>
            {copy.examples}
          </Button>
          <Button variant="ghost" onClick={actions.clearAll} disabled={!hasSlides}>
            {copy.clearAll}
          </Button>
          <span className="text-sm text-slate-600">{copy.slidesCount(draft.slides.length, CAROUSEL_LIMIT)}</span>
        </div>
        <p className="text-xs leading-5 text-slate-600">{copy.examplesHint}</p>

        {processing ? (
          <p role="status" className="text-sm font-medium text-brand-800">{copy.processing(processing.done, processing.total)}</p>
        ) : null}
        {notice ? <Notice tone={notice.tone}>{notice.text}</Notice> : null}
      </SectionCard>

      {hasSlides ? (
        <SectionCard title={copy.steps.media} hint={copy.dragHint}>
          <SlideList
            slides={draft.slides}
            activeId={null}
            onMove={(id, toIndex) => dispatch({ type: 'moveSlide', id, toIndex })}
            onRemove={actions.removeSlide}
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
      ) : null}
    </div>
  );
}
