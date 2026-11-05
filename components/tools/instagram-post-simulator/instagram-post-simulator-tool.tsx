'use client';

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Notice } from '@/components/tools/instagram-post-simulator/editor/editor-ui';
import { DetailsStep } from '@/components/tools/instagram-post-simulator/editor/details-step';
import { EditStep } from '@/components/tools/instagram-post-simulator/editor/edit-step';
import type { EditorActions } from '@/components/tools/instagram-post-simulator/editor/editor-types';
import { ExportStep, type ExportKind } from '@/components/tools/instagram-post-simulator/editor/export-step';
import { MediaStep, type MediaNotice } from '@/components/tools/instagram-post-simulator/editor/media-step';
import { PreviewPanel } from '@/components/tools/instagram-post-simulator/preview-panel';
import { buildPhoneModel, toPhoneSlide } from '@/components/tools/instagram-post-simulator/phone/phone-model';
import { getSimulatorCopy, type SimulatorCopy } from '@/data/i18n/instagram-post-simulator';
import { TOOL_ID, trackEvent } from '@/lib/analytics';
import { CAROUSEL_LIMIT, OUTPUT_WIDTH } from '@/lib/instagram-post-simulator/layout';
import {
  buildSlideViews,
  createInitialDraft,
  createMediaSlide,
  draftReducer,
  getReelSlide,
} from '@/lib/instagram-post-simulator/draft';
import { createExampleFiles } from '@/lib/instagram-post-simulator/demo';
import {
  captureVideoFrame,
  classifyFile,
  getMediaErrorCode,
  ingestFile,
  releaseSource,
  type MediaErrorCode,
} from '@/lib/instagram-post-simulator/media';
import type { AppLocale } from '@/lib/i18n/config';
import type { FrameAspectId, MediaSlide, PhoneModelId, PhoneTheme, PhoneView, PostDraft, PostType, SourceMedia } from '@/types/instagram-post-simulator';

type InstagramPostSimulatorToolProps = Readonly<{
  locale?: AppLocale;
}>;

type StepId = 'media' | 'edit' | 'details' | 'export';
type MobilePanel = 'editor' | 'preview';

const STEPS: StepId[] = ['media', 'edit', 'details', 'export'];
const AVATAR_MAX_BYTES = 5 * 1024 * 1024;

const normalizeErrorType = (code: MediaErrorCode): string => {
  if (code === 'unsupported_format') return 'unsupported_format';
  if (code === 'file_too_large' || code === 'too_many_pixels') return 'file_too_large';
  return 'processing_failed';
};

const releaseDraftUrls = (draft: PostDraft) => {
  draft.slides.forEach((slide) => releaseSource(slide));
  releaseSource(draft.panorama.source);
  if (draft.reelCover) URL.revokeObjectURL(draft.reelCover.url);
  if (draft.profile.avatarUrl) URL.revokeObjectURL(draft.profile.avatarUrl);
};

/**
 * Simulador de publicações do Instagram. Tudo acontece no navegador: arquivos são lidos localmente,
 * a prévia é desenhada em um iPhone simulado e a exportação gera os arquivos sem enviá-los a lugar nenhum.
 */
export function InstagramPostSimulatorTool({ locale = 'pt-br' }: InstagramPostSimulatorToolProps) {
  const copy: SimulatorCopy = getSimulatorCopy(locale);
  const [draft, dispatch] = useReducer(draftReducer, copy.defaults, (defaults) =>
    createInitialDraft({ username: defaults.username, displayName: defaults.displayName, bio: defaults.bio }),
  );
  const draftRef = useRef(draft);
  draftRef.current = draft;
  const mountedRef = useRef(false);
  const startedRef = useRef(false);

  const [step, setStep] = useState<StepId>('media');
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('editor');
  const [activeSlideId, setActiveSlideId] = useState<string | null>(null);
  const [phoneView, setPhoneView] = useState<PhoneView>('feed');
  const [theme, setTheme] = useState<PhoneTheme>('light');
  const [device, setDevice] = useState<PhoneModelId>('iphone-17-pro');
  const [showFrame, setShowFrame] = useState(true);
  const [showContext, setShowContext] = useState(true);
  const [showGuides, setShowGuides] = useState(false);
  const [statusTime, setStatusTime] = useState('09:41');
  const [focusRequest, setFocusRequest] = useState(0);
  const [processing, setProcessing] = useState<{ done: number; total: number } | null>(null);
  const [notice, setNotice] = useState<MediaNotice>(null);

  // Libera as URLs de objeto ao sair da página. Em modo estrito, o React desmonta e remonta: o adiamento evita revogar URLs ainda em uso.
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      const snapshot = draftRef.current;
      window.setTimeout(() => {
        if (!mountedRef.current) releaseDraftUrls(snapshot);
      }, 0);
    };
  }, []);

  const views = useMemo(() => buildSlideViews(draft), [draft]);
  const reelSlide = getReelSlide(draft);
  const model = useMemo(() => buildPhoneModel(draft, copy, showContext), [draft, copy, showContext]);
  const coverSlide = draft.postType !== 'reel' && views[0] ? toPhoneSlide(views[0]) : null;
  const activeSlide = activeSlideId ?? draft.slides[0]?.id ?? null;
  const stepIndex = STEPS.indexOf(step);

  const track = useCallback((event: string, params: Record<string, string | number | boolean | undefined> = {}) => {
    trackEvent(event, { tool: TOOL_ID.instagramPostSimulator, locale, ...params });
  }, [locale]);

  const reportError = useCallback((code: MediaErrorCode | 'export_failed') => {
    setNotice({ tone: 'error', text: code === 'export_failed' ? copy.errors.export_failed : copy.errors[code] });
    track('tool_error', { error_type: code === 'export_failed' ? 'processing_failed' : normalizeErrorType(code) });
  }, [copy.errors, track]);

  const addFiles = useCallback(async (files: File[]) => {
    const room = CAROUSEL_LIMIT - draftRef.current.slides.length;
    if (room <= 0) {
      setNotice({ tone: 'error', text: copy.limitReached(CAROUSEL_LIMIT) });
      return;
    }

    const batch = files.slice(0, room);
    setNotice(files.length > room ? { tone: 'info', text: copy.limitReached(CAROUSEL_LIMIT) } : null);
    setProcessing({ done: 0, total: batch.length });

    const created: MediaSlide[] = [];
    const failures: MediaErrorCode[] = [];
    for (const [index, file] of batch.entries()) {
      try {
        const source: SourceMedia = await ingestFile(file);
        created.push(createMediaSlide(source));
      } catch (error) {
        failures.push(getMediaErrorCode(error));
      }
      setProcessing({ done: index + 1, total: batch.length });
    }
    setProcessing(null);

    if (created.length > 0) {
      dispatch({ type: 'addSlides', slides: created });
      if (!startedRef.current) {
        startedRef.current = true;
        track('tool_started');
      }
      track('file_uploaded', { count: created.length, mode: draftRef.current.postType });
      setActiveSlideId((current) => current ?? created[0].id);
    }

    if (failures.length > 0) {
      setNotice({ tone: 'error', text: `${copy.rejectedFiles(failures.length)} ${copy.errors[failures[0]]}` });
      track('tool_error', { error_type: normalizeErrorType(failures[0]) });
    }
  }, [copy, track]);

  const removeSlide = useCallback((id: string) => {
    const slide = draftRef.current.slides.find((item) => item.id === id);
    if (slide) releaseSource(slide);
    dispatch({ type: 'removeSlide', id });
    setActiveSlideId((current) => (current === id ? null : current));
  }, []);

  const clearAll = useCallback(() => {
    const current = draftRef.current;
    current.slides.forEach((slide) => releaseSource(slide));
    current.slides.forEach((slide) => dispatch({ type: 'removeSlide', id: slide.id }));
    if (current.panorama.source) {
      releaseSource(current.panorama.source);
      dispatch({ type: 'setPanoramaSource', source: null });
    }
    if (current.reelCover) {
      URL.revokeObjectURL(current.reelCover.url);
      dispatch({ type: 'setReelCover', cover: null });
    }
    setActiveSlideId(null);
    setNotice(null);
  }, []);

  const loadExample = useCallback(async () => {
    try {
      const files = await createExampleFiles();
      await addFiles(files);
    } catch {
      reportError('decode_failed');
    }
  }, [addFiles, reportError]);

  const pickPanoramaImage = useCallback(async (file: File) => {
    if (classifyFile(file) !== 'image') {
      reportError('unsupported_format');
      return;
    }
    try {
      const source = await ingestFile(file);
      releaseSource(draftRef.current.panorama.source);
      dispatch({ type: 'setPanoramaSource', source });
      track('file_uploaded', { count: 1, mode: 'panorama' });
      if (!startedRef.current) {
        startedRef.current = true;
        track('tool_started');
      }
    } catch (error) {
      reportError(getMediaErrorCode(error));
    }
  }, [reportError, track]);

  const captureReelCover = useCallback(async (time: number) => {
    const reel = getReelSlide(draftRef.current);
    if (!reel) return;
    try {
      const frame = await captureVideoFrame(reel.url, time, OUTPUT_WIDTH);
      const previous = draftRef.current.reelCover;
      if (previous) URL.revokeObjectURL(previous.url);
      dispatch({
        type: 'setReelCover',
        cover: { url: URL.createObjectURL(frame.blob), blob: frame.blob, width: frame.width, height: frame.height },
      });
    } catch (error) {
      reportError(getMediaErrorCode(error));
    }
  }, [reportError]);

  const importReelCover = useCallback(async (file: File) => {
    try {
      const source = await ingestFile(file);
      if (source.kind !== 'image') {
        releaseSource(source);
        reportError('unsupported_format');
        return;
      }
      if (source.thumbUrl) URL.revokeObjectURL(source.thumbUrl);
      const previous = draftRef.current.reelCover;
      if (previous) URL.revokeObjectURL(previous.url);
      dispatch({ type: 'setReelCover', cover: { url: source.url, blob: file, width: source.width, height: source.height } });
    } catch (error) {
      reportError(getMediaErrorCode(error));
    }
  }, [reportError]);

  const clearReelCover = useCallback(() => {
    const previous = draftRef.current.reelCover;
    if (previous) URL.revokeObjectURL(previous.url);
    dispatch({ type: 'setReelCover', cover: null });
  }, []);

  const actions: EditorActions = {
    addFiles: (files) => { void addFiles(files); },
    removeSlide,
    pickPanoramaImage: (file) => { void pickPanoramaImage(file); },
    captureReelCover: (time) => { void captureReelCover(time); },
    importReelCover: (file) => { void importReelCover(file); },
    clearReelCover,
    loadExample: () => { void loadExample(); },
    clearAll,
  };

  const onAvatarFile = (file: File) => {
    if (!file.type.startsWith('image/') || file.size > AVATAR_MAX_BYTES) {
      reportError('file_too_large');
      return;
    }
    const previous = draftRef.current.profile.avatarUrl;
    if (previous) URL.revokeObjectURL(previous);
    dispatch({ type: 'updateProfile', patch: { avatarUrl: URL.createObjectURL(file), avatarFile: file } });
  };

  const onRemoveAvatar = () => {
    const previous = draftRef.current.profile.avatarUrl;
    if (previous) URL.revokeObjectURL(previous);
    dispatch({ type: 'updateProfile', patch: { avatarUrl: null, avatarFile: null } });
  };

  const finalize = () => {
    if (views.length === 0) {
      setNotice({ tone: 'info', text: copy.exportEmpty });
      return;
    }
    setNotice(null);
    setPhoneView('feed');
    setFocusRequest((value) => value + 1);
    setMobilePanel('preview');
    track('tool_completed', { mode: draft.postType, count: views.length });
  };

  const goToStep = (next: StepId) => {
    setStep(next);
    setNotice(null);
  };

  const onTrackMode = (postType: PostType) => track('mode_selected', { mode: postType });
  const onTrackFormat = (aspect: FrameAspectId) => track('format_selected', { format: aspect });
  const onDownloaded = (kind: ExportKind) => track('result_downloaded', { format: kind });
  const onExportError = (message: string) => setNotice({ tone: 'error', text: message });

  const stepLabels: Record<StepId, string> = {
    media: copy.steps.media,
    edit: copy.steps.edit,
    details: copy.steps.details,
    export: copy.steps.exportStep,
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 lg:hidden" role="group" aria-label={copy.previewTitle}>
        <button
          type="button"
          aria-pressed={mobilePanel === 'editor'}
          onClick={() => setMobilePanel('editor')}
          className={mobilePanel === 'editor' ? 'flex-1 rounded-lg border border-brand-300 bg-brand-50 px-3 py-2.5 text-sm font-semibold text-brand-800' : 'flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700'}
        >
          {copy.showEditorMobile}
        </button>
        <button
          type="button"
          aria-pressed={mobilePanel === 'preview'}
          onClick={() => setMobilePanel('preview')}
          className={mobilePanel === 'preview' ? 'flex-1 rounded-lg border border-brand-300 bg-brand-50 px-3 py-2.5 text-sm font-semibold text-brand-800' : 'flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700'}
        >
          {copy.showPreviewMobile}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:items-start">
        <section className={mobilePanel === 'preview' ? 'hidden min-w-0 space-y-6 lg:block' : 'min-w-0 space-y-6'} aria-label={copy.steps.edit}>
          <nav aria-label={copy.steps.media}>
            <ol className="grid grid-cols-4 gap-1 rounded-xl border border-slate-200 bg-white p-1 text-xs font-semibold sm:text-sm">
              {STEPS.map((id, index) => {
                const current = id === step;
                return (
                  <li key={id} className="min-w-0">
                    <button
                      type="button"
                      aria-current={current ? 'step' : undefined}
                      onClick={() => goToStep(id)}
                      className={current ? 'flex min-h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-1 py-1.5 text-center leading-tight text-white' : 'flex min-h-10 w-full items-center justify-center gap-1.5 rounded-lg px-1 py-1.5 text-slate-700 hover:bg-slate-100'}
                    >
                      <span className="tabular-nums">{index + 1}</span>
                      <span className={current ? '' : 'hidden sm:inline'}>{stepLabels[id]}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          {step === 'media' ? (
            <MediaStep
              draft={draft}
              dispatch={dispatch}
              copy={copy}
              locale={locale}
              actions={actions}
              processing={processing}
              notice={notice}
            />
          ) : null}

          {step === 'edit' ? (
            <EditStep
              draft={draft}
              dispatch={dispatch}
              copy={copy}
              activeSlideId={activeSlide}
              onActiveSlide={setActiveSlideId}
              onRemoveSlide={removeSlide}
              onPickPanoramaImage={actions.pickPanoramaImage}
              onCaptureReelCover={actions.captureReelCover}
              onImportReelCover={actions.importReelCover}
              onClearReelCover={clearReelCover}
              onTrackMode={onTrackMode}
              onTrackFormat={onTrackFormat}
              coverSlide={coverSlide}
            />
          ) : null}

          {step === 'details' ? (
            <DetailsStep
              draft={draft}
              dispatch={dispatch}
              copy={copy}
              onAvatarFile={onAvatarFile}
              onRemoveAvatar={onRemoveAvatar}
              onFinalize={finalize}
            />
          ) : null}

          {step === 'export' ? (
            <ExportStep
              draft={draft}
              views={views}
              copy={copy}
              onDownloaded={onDownloaded}
              onError={onExportError}
            />
          ) : null}

          {notice && step !== 'media' ? <Notice tone={notice.tone}>{notice.text}</Notice> : null}

          <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
            <Button variant="secondary" onClick={() => goToStep(STEPS[Math.max(0, stepIndex - 1)])} disabled={stepIndex === 0}>
              <ChevronLeft size={16} className="mr-1" aria-hidden="true" />
              {copy.back}
            </Button>
            <Button onClick={() => goToStep(STEPS[Math.min(STEPS.length - 1, stepIndex + 1)])} disabled={stepIndex === STEPS.length - 1}>
              {copy.next}
              <ChevronRight size={16} className="ml-1" aria-hidden="true" />
            </Button>
          </div>
        </section>

        <aside className={mobilePanel === 'editor' ? 'hidden lg:sticky lg:top-6 lg:block' : 'lg:sticky lg:top-6'} aria-label={copy.previewTitle}>
          <PreviewPanel
            copy={copy}
            model={model}
            view={phoneView}
            onViewChange={setPhoneView}
            theme={theme}
            onThemeChange={setTheme}
            device={device}
            onDeviceChange={setDevice}
            showFrame={showFrame}
            onShowFrameChange={setShowFrame}
            showContext={showContext}
            onShowContextChange={setShowContext}
            showGuides={showGuides}
            onShowGuidesChange={setShowGuides}
            statusTime={statusTime}
            onStatusTimeChange={setStatusTime}
            onEdit={() => {
              setMobilePanel('editor');
              setStep('edit');
            }}
            focusRequest={focusRequest}
            reelAvailable={Boolean(reelSlide) || draft.postType === 'reel'}
          />
        </aside>
      </div>
    </div>
  );
}
