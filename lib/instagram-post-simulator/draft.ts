import {
  CAROUSEL_LIMIT,
  DEFAULT_CROP,
  REEL_RATIO,
  frameRatioOf,
  getImageLayout,
  getPanoramaSlideBox,
  clampPanoramaCount,
} from '@/lib/instagram-post-simulator/layout';
import { DEFAULT_FILTERS } from '@/lib/instagram-post-simulator/filters';
import type {
  CoverImage,
  FrameAspectId,
  MediaSlide,
  PanCrop,
  PanoramaSettings,
  PostDraft,
  PostType,
  ProfileSettings,
  SlideView,
  SourceMedia,
} from '@/types/instagram-post-simulator';

export type DraftDefaults = {
  username: string;
  displayName: string;
  bio: string;
};

export const createInitialDraft = (defaults: DraftDefaults): PostDraft => ({
  postType: 'post',
  aspect: '4:5',
  slides: [],
  gridCrop: { x: 0.5, y: 0.5, zoom: 1 },
  reelCover: null,
  panorama: {
    count: 3,
    aspect: '4:5',
    source: null,
    crop: DEFAULT_CROP,
    fit: 'fill',
    filters: DEFAULT_FILTERS,
  },
  profile: {
    username: defaults.username,
    displayName: defaults.displayName,
    bio: defaults.bio,
    location: '',
    tags: '',
    avatarUrl: null,
    avatarFile: null,
  },
  caption: '',
  hideLikes: false,
  likes: 128,
  comments: 12,
});

export const createMediaSlide = (source: SourceMedia, altText = ''): MediaSlide => ({
  ...source,
  crop: DEFAULT_CROP,
  fit: 'fill',
  filters: DEFAULT_FILTERS,
  altText,
});

export type SlideEditPatch = Partial<Pick<MediaSlide, 'crop' | 'fit' | 'filters' | 'altText'>>;

export type DraftAction =
  | { type: 'addSlides'; slides: MediaSlide[] }
  | { type: 'removeSlide'; id: string }
  | { type: 'moveSlide'; id: string; toIndex: number }
  | { type: 'updateSlide'; id: string; patch: SlideEditPatch }
  | { type: 'applyFiltersToAll'; filters: MediaSlide['filters'] }
  | { type: 'setPostType'; postType: PostType }
  | { type: 'setAspect'; aspect: FrameAspectId }
  | { type: 'setGridCrop'; crop: PanCrop }
  | { type: 'setReelCover'; cover: CoverImage | null }
  | { type: 'updatePanorama'; patch: Partial<Omit<PanoramaSettings, 'source'>> }
  | { type: 'setPanoramaSource'; source: SourceMedia | null }
  | { type: 'updateProfile'; patch: Partial<ProfileSettings> }
  | { type: 'setCaption'; caption: string }
  | { type: 'setHideLikes'; value: boolean }
  | { type: 'setCounts'; likes?: number; comments?: number };

export const draftReducer = (state: PostDraft, action: DraftAction): PostDraft => {
  switch (action.type) {
    case 'addSlides':
      return { ...state, slides: [...state.slides, ...action.slides].slice(0, CAROUSEL_LIMIT) };
    case 'removeSlide':
      return { ...state, slides: state.slides.filter((slide) => slide.id !== action.id) };
    case 'moveSlide': {
      const from = state.slides.findIndex((slide) => slide.id === action.id);
      if (from < 0) return state;
      const to = Math.min(Math.max(action.toIndex, 0), state.slides.length - 1);
      if (from === to) return state;
      const next = [...state.slides];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return { ...state, slides: next };
    }
    case 'updateSlide':
      return {
        ...state,
        slides: state.slides.map((slide) => (slide.id === action.id ? { ...slide, ...action.patch } : slide)),
      };
    case 'applyFiltersToAll':
      return {
        ...state,
        slides: state.slides.map((slide) => ({ ...slide, filters: action.filters })),
      };
    case 'setPostType':
      return { ...state, postType: action.postType };
    case 'setAspect':
      return { ...state, aspect: action.aspect };
    case 'setGridCrop':
      return { ...state, gridCrop: action.crop };
    case 'setReelCover':
      return { ...state, reelCover: action.cover };
    case 'updatePanorama':
      return {
        ...state,
        panorama: {
          ...state.panorama,
          ...action.patch,
          count: action.patch.count === undefined ? state.panorama.count : clampPanoramaCount(action.patch.count),
        },
      };
    case 'setPanoramaSource':
      return { ...state, panorama: { ...state.panorama, source: action.source, crop: DEFAULT_CROP } };
    case 'updateProfile':
      return { ...state, profile: { ...state.profile, ...action.patch } };
    case 'setCaption':
      return { ...state, caption: action.caption };
    case 'setHideLikes':
      return { ...state, hideLikes: action.value };
    case 'setCounts':
      return {
        ...state,
        likes: action.likes ?? state.likes,
        comments: action.comments ?? state.comments,
      };
    default:
      return state;
  }
};

/** Mídias de um vídeo único são usadas pelo Reel; em outros formatos, todos os slides entram no carrossel. */
export const getReelSlide = (draft: PostDraft): MediaSlide | null => {
  const first = draft.slides[0];
  return draft.slides.length === 1 && first?.kind === 'video' ? first : null;
};

/**
 * Fatias prontas para prévia e exportação. Para o carrossel contínuo, cada slide é um recorte
 * do mesmo quadro composto, com limites exatos entre eles.
 */
export const buildSlideViews = (draft: PostDraft, reelFrameRatio = REEL_RATIO): SlideView[] => {
  if (draft.postType === 'panorama') {
    const source = draft.panorama.source;
    if (!source || source.kind !== 'image') return [];

    const count = draft.panorama.count;
    const slideRatio = frameRatioOf(draft.panorama.aspect);
    const composite = getImageLayout(source, count * slideRatio, draft.panorama.crop, draft.panorama.fit);

    return Array.from({ length: count }, (_, index) => ({
      id: `${source.id}-slide-${index}`,
      index,
      kind: 'image' as const,
      source,
      box: getPanoramaSlideBox(composite, count, index),
      filters: draft.panorama.filters,
      altText: '',
      frameRatio: slideRatio,
    }));
  }

  const isReel = draft.postType === 'reel';
  const frameRatio = isReel ? reelFrameRatio : frameRatioOf(draft.aspect);
  const items = isReel ? draft.slides.slice(0, 1) : draft.slides;

  return items.map((slide, index) => ({
    id: slide.id,
    index,
    kind: slide.kind,
    source: slide,
    box: getImageLayout(slide, frameRatio, slide.crop, slide.fit),
    filters: slide.filters,
    altText: slide.altText,
    frameRatio,
  }));
};

export const getPostFrameRatio = (draft: PostDraft): number => {
  if (draft.postType === 'reel') return REEL_RATIO;
  if (draft.postType === 'panorama') return frameRatioOf(draft.panorama.aspect);
  return frameRatioOf(draft.aspect);
};
