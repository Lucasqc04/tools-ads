import type { SimulatorCopy } from '@/data/i18n/instagram-post-simulator';
import { DEMO_POST_SEEDS, createDemoArtDataUri, createInitialAvatarDataUri } from '@/lib/instagram-post-simulator/demo';
import { buildSlideViews, getPostFrameRatio } from '@/lib/instagram-post-simulator/draft';
import {
  FULL_BOX,
  REEL_RATIO,
  getImageLayout,
  type FrameBox,
} from '@/lib/instagram-post-simulator/layout';
import { DEFAULT_FILTERS } from '@/lib/instagram-post-simulator/filters';
import { normalizeUsername, parseTags } from '@/lib/instagram-post-simulator/caption';
import type { PostDraft, PostType, SlideFilters, SlideKind, SlideView } from '@/types/instagram-post-simulator';

/** Formato usado pela prévia. Não carrega `File`: a tela só precisa de URLs e geometria. */
export type PhoneSlide = {
  id: string;
  kind: SlideKind;
  url: string;
  posterUrl?: string;
  box: FrameBox;
  filters: SlideFilters;
  alt: string;
};

export type PhoneCover = {
  slide: PhoneSlide;
  /** Proporção do quadro onde a capa foi enquadrada (antes da janela 3:4 da grade). */
  frameRatio: number;
  gridCrop: { x: number; y: number; zoom: number };
};

export type PhonePost = {
  id: string;
  kind: PostType;
  isOwn: boolean;
  username: string;
  avatarUrl: string;
  location?: string;
  frameRatio: number;
  slides: PhoneSlide[];
  caption: string;
  likes: number;
  comments: number;
  hideLikes: boolean;
  time: string;
  commentsPreview: Array<{ user: string; text: string }>;
  tagsLine?: string;
  cover: PhoneCover | null;
};

export type PhoneProfile = {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
};

export type PhoneModel = {
  profile: PhoneProfile;
  posts: PhonePost[];
  reelSlide: PhoneSlide | null;
  reelCaption: string;
  reelLikes: number;
  reelComments: number;
  demoAvatars: Array<{ id: string; username: string; url: string }>;
};

const AVATAR_COLORS = ['#1d67d6', '#f97316', '#7c3aed', '#059669', '#db2777'];
/** Proporção do feed para Reels e vídeos: 4:5, como a prévia comum do feed. */
const FEED_REEL_RATIO = 0.8;

export const toPhoneSlide = (view: SlideView): PhoneSlide => ({
  id: view.id,
  kind: view.kind,
  url: view.source.url,
  posterUrl: view.source.thumbUrl,
  box: view.box,
  filters: view.filters,
  alt: view.altText,
});

const centerCrop = { x: 0.5, y: 0.5, zoom: 1 };

const buildOwnPost = (draft: PostDraft, copy: SimulatorCopy, avatarUrl: string): PhonePost | null => {
  if (draft.postType === 'reel') {
    // No feed, o Reel aparece em 4:5; a aba Reels usa o enquadramento 9:16 original.
    const feedSlides = buildSlideViews(draft, FEED_REEL_RATIO).slice(0, 1).map(toPhoneSlide);
    const frameSlide = buildSlideViews(draft)[0];
    if (feedSlides.length === 0 || !frameSlide) return null;

    const cover: PhoneCover = draft.reelCover
      ? {
          slide: {
            id: 'reel-cover',
            kind: 'image',
            url: draft.reelCover.url,
            box: getImageLayout(draft.reelCover, REEL_RATIO, centerCrop, 'fill'),
            filters: DEFAULT_FILTERS,
            alt: '',
          },
          frameRatio: REEL_RATIO,
          gridCrop: draft.gridCrop,
        }
      : { slide: toPhoneSlide(frameSlide), frameRatio: REEL_RATIO, gridCrop: draft.gridCrop };

    return buildPhonePost({
      id: 'own',
      kind: 'reel',
      isOwn: true,
      username: normalizeUsername(draft.profile.username),
      avatarUrl,
      location: draft.profile.location,
      frameRatio: FEED_REEL_RATIO,
      slides: feedSlides,
      draft,
      copy,
      cover,
    });
  }

  const views = buildSlideViews(draft);
  if (views.length === 0) return null;
  const frameRatio = getPostFrameRatio(draft);
  const slides = views.map(toPhoneSlide);

  return buildPhonePost({
    id: 'own',
    kind: draft.postType,
    isOwn: true,
    username: normalizeUsername(draft.profile.username),
    avatarUrl,
    location: draft.profile.location,
    frameRatio,
    slides,
    draft,
    copy,
    cover: {
      slide: slides[0],
      frameRatio,
      gridCrop: draft.gridCrop,
    },
  });
};

type BuildPostInput = {
  id: string;
  kind: PostType;
  isOwn: boolean;
  username: string;
  avatarUrl: string;
  location?: string;
  frameRatio: number;
  slides: PhoneSlide[];
  draft: PostDraft;
  copy: SimulatorCopy;
  cover: PhoneCover | null;
};

const buildPhonePost = ({ id, kind, isOwn, username, avatarUrl, location, frameRatio, slides, draft, copy, cover }: BuildPostInput): PhonePost => {
  const tags = parseTags(draft.profile.tags);
  return {
    id,
    kind,
    isOwn,
    username,
    avatarUrl,
    location: location?.trim() || undefined,
    frameRatio,
    slides,
    caption: draft.caption,
    likes: draft.likes,
    comments: draft.comments,
    hideLikes: draft.hideLikes,
    time: copy.phone.timeAgo,
    commentsPreview: [],
    tagsLine: tags.length > 0 ? copy.phone.tagsLine(tags.map((tag) => `@${tag}`).join(', ')) : undefined,
    cover,
  };
};

const buildDemoPosts = (copy: SimulatorCopy): PhonePost[] =>
  DEMO_POST_SEEDS.map((seed, index) => {
    const content = copy.demoPosts[seed.id];
    const slides: PhoneSlide[] = Array.from({ length: seed.slides }, (_, slideIndex) => ({
      id: `${seed.id}-${slideIndex}`,
      kind: 'image' as const,
      url: createDemoArtDataUri(seed, slideIndex),
      box: FULL_BOX,
      filters: DEFAULT_FILTERS,
      alt: '',
    }));

    return {
      id: seed.id,
      kind: 'post',
      isOwn: false,
      username: seed.username,
      avatarUrl: createInitialAvatarDataUri(seed.username, AVATAR_COLORS[index % AVATAR_COLORS.length]),
      location: seed.location,
      frameRatio: 0.8,
      slides,
      caption: content.caption,
      likes: seed.likes,
      comments: seed.comments,
      hideLikes: false,
      time: content.time,
      commentsPreview: content.comments,
      cover: { slide: slides[0], frameRatio: 0.8, gridCrop: centerCrop },
    };
  });

/**
 * Modelo completo da prévia: a publicação do usuário vem primeiro, seguida do feed de exemplo
 * (quando ativado). Sem publicação, o feed continua mostrando exemplos para não parecer vazio.
 */
export const buildPhoneModel = (draft: PostDraft, copy: SimulatorCopy, showContext: boolean): PhoneModel => {
  const username = normalizeUsername(draft.profile.username);
  const avatarUrl = draft.profile.avatarUrl ?? createInitialAvatarDataUri(username, '#1d67d6');
  const own = buildOwnPost(draft, copy, avatarUrl);
  const demo = buildDemoPosts(copy);
  const posts = [own, ...(showContext || !own ? demo : [])].filter((post): post is PhonePost => post !== null);

  const reelView = buildSlideViews(draft)[0];
  const reelSlide = draft.postType === 'reel' && reelView?.kind === 'video' ? toPhoneSlide(reelView) : null;

  return {
    profile: {
      username,
      displayName: draft.profile.displayName || copy.defaults.displayName,
      bio: draft.profile.bio,
      avatarUrl,
    },
    posts,
    reelSlide,
    reelCaption: draft.caption,
    reelLikes: draft.likes,
    reelComments: draft.comments,
    demoAvatars: demo.map((post) => ({ id: post.id, username: post.username, url: post.avatarUrl })),
  };
};

