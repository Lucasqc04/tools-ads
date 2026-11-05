import { describe, expect, it } from 'vitest';
import {
  countCaptionCharacters,
  normalizeUsername,
  parseTags,
  splitCaptionForFeed,
  tokenizeCaption,
} from '@/lib/instagram-post-simulator/caption';
import { applyFiltersToPixels, DEFAULT_FILTERS, toCssFilter } from '@/lib/instagram-post-simulator/filters';
import {
  getGridCutPercent,
  getGridWindow,
  getImageLayout,
  getPanoramaSlideBox,
  panCropByPixels,
  toPixelRect,
  zoomFromPinch,
} from '@/lib/instagram-post-simulator/layout';
import {
  buildSlideViews,
  createInitialDraft,
  createMediaSlide,
  draftReducer,
  getReelSlide,
} from '@/lib/instagram-post-simulator/draft';
import type { SourceMedia } from '@/types/instagram-post-simulator';

const landscape = { width: 1600, height: 900 };
const portrait = { width: 900, height: 1600 };

describe('Instagram post simulator geometry', () => {
  it('covers a 4:5 frame with a landscape photo, cutting the sides', () => {
    const box = getImageLayout(landscape, 0.8, { x: 0.5, y: 0.5, zoom: 1 }, 'fill');

    expect(box.height).toBeCloseTo(1, 6);
    expect(box.width * 0.8).toBeCloseTo((1600 / 900) * 1, 6);
    expect(box.left).toBeLessThan(0);
    expect(box.top).toBeCloseTo(0, 6);
  });

  it('keeps the photo fully visible in fit mode and never stretches it', () => {
    const box = getImageLayout(landscape, 0.8, { x: 0, y: 0, zoom: 3 }, 'fit');
    const drawnRatio = (box.width * 0.8) / box.height;

    expect(drawnRatio).toBeCloseTo(landscape.width / landscape.height, 6);
    expect(box.width).toBeLessThanOrEqual(1);
    expect(box.height).toBeLessThanOrEqual(1);
  });

  it('applies zoom and clamps crop values to the allowed range', () => {
    const zoomed = getImageLayout(portrait, 0.8, { x: 0.5, y: 0.5, zoom: 2 }, 'fill');
    const clamped = getImageLayout(portrait, 0.8, { x: 9, y: -4, zoom: 50 }, 'fill');
    const limit = getImageLayout(portrait, 0.8, { x: 1, y: 0, zoom: 3 }, 'fill');

    expect(zoomed.width).toBeGreaterThan(1);
    expect(clamped).toEqual(limit);
  });

  it('produces identical pixel rectangles for preview and export at any resolution', () => {
    const box = getImageLayout(landscape, 0.8, { x: 0.25, y: 0.5, zoom: 1.5 }, 'fill');
    const small = toPixelRect(box, 402, 502.5);
    const large = toPixelRect(box, 1080, 1350);

    expect(large.x / 1080).toBeCloseTo(small.x / 402, 6);
    expect(large.width / 1080).toBeCloseTo(small.width / 402, 6);
    expect(large.height / 1350).toBeCloseTo(small.height / 502.5, 6);
  });

  it('drags the photo in the direction of the pointer', () => {
    const box = getImageLayout(landscape, 0.8, { x: 0.5, y: 0.5, zoom: 2 }, 'fill');
    const start = { x: 0.5, y: 0.5, zoom: 2 };
    const movedRight = panCropByPixels(start, box, 400, 500, 40, 0);

    // Arrastar para a direita revela a parte esquerda da imagem: x diminui.
    expect(movedRight.x).toBeLessThan(start.x);
    expect(movedRight.y).toBe(start.y);
  });

  it('does not pan when the image does not overflow the frame', () => {
    const box = getImageLayout(portrait, 0.8, { x: 0.5, y: 0.5, zoom: 1 }, 'fit');
    const unchanged = panCropByPixels({ x: 0.5, y: 0.5, zoom: 1 }, box, 400, 500, 80, 80);

    expect(unchanged.x).toBe(0.5);
  });

  it('converts pinch distance into a clamped zoom', () => {
    expect(zoomFromPinch(1, 100, 200)).toBe(2);
    expect(zoomFromPinch(1, 100, 1000)).toBe(3);
    expect(zoomFromPinch(1, 0, 200)).toBe(1);
  });

  it('keeps the panorama continuous: each slide is the same image shifted by one slide width', () => {
    const count = 3;
    const composite = getImageLayout(landscape, count * 0.8, { x: 0.3, y: 0.5, zoom: 1.4 }, 'fill');
    const slides = Array.from({ length: count }, (_, index) => getPanoramaSlideBox(composite, count, index));

    slides.forEach((slide, index) => {
      // Em unidades de slide, a imagem começa em (left composto × N) e mede (largura composta × N).
      expect(slide.left + index).toBeCloseTo(composite.left * count, 6);
      expect(slide.width).toBeCloseTo(composite.width * count, 6);
      expect(slide.top).toBeCloseTo(composite.top, 6);
      expect(slide.height).toBeCloseTo(composite.height, 6);
    });
  });

  it('places the 3:4 grid window inside a wider post frame', () => {
    const window = getGridWindow(0.8, { x: 0.5, y: 0.5, zoom: 1 });

    expect(window.height).toBe(1);
    expect(window.width).toBeCloseTo(0.75 / 0.8, 6);
    expect(window.left).toBeCloseTo((1 - window.width) / 2, 6);
  });

  it('reports how much of a 4:5 post is cut by the 3:4 grid', () => {
    expect(getGridCutPercent(0.75)).toBe(0);
    expect(getGridCutPercent(0.8)).toBe(6);
    expect(getGridCutPercent(1.91)).toBeGreaterThan(50);
  });
});

describe('Instagram post simulator filters', () => {
  it('uses the same neutral values for the preview and the export', () => {
    expect(toCssFilter(DEFAULT_FILTERS)).toBe('none');
    const pixels = new Uint8ClampedArray([10, 120, 240, 255]);
    applyFiltersToPixels(pixels, DEFAULT_FILTERS);
    expect(Array.from(pixels)).toEqual([10, 120, 240, 255]);
  });

  it('turns colors into gray when saturation is zero', () => {
    const pixels = new Uint8ClampedArray([255, 0, 0, 255]);
    applyFiltersToPixels(pixels, { brightness: 1, contrast: 1, saturation: 0 });

    expect(pixels[0]).toBe(pixels[1]);
    expect(pixels[1]).toBe(pixels[2]);
  });

  it('builds a CSS filter string in the same order as the pixel math', () => {
    expect(toCssFilter({ brightness: 1.1, contrast: 0.9, saturation: 1.3 })).toBe(
      'brightness(1.1) contrast(0.9) saturate(1.3)',
    );
  });
});

describe('Instagram post simulator captions and profile text', () => {
  it('counts characters by code point, not UTF-16 units', () => {
    expect(countCaptionCharacters('ação 👋')).toBe(6);
  });

  it('truncates the feed caption at the first line break or the preview limit', () => {
    expect(splitCaptionForFeed('curta')).toEqual({ visible: 'curta', hasMore: false });
    expect(splitCaptionForFeed('linha um\nlinha dois')).toEqual({ visible: 'linha um', hasMore: true });
    const long = 'a'.repeat(200);
    const truncated = splitCaptionForFeed(long);
    expect(truncated.hasMore).toBe(true);
    expect(truncated.visible).toHaveLength(125);
  });

  it('normalizes usernames to the Instagram format', () => {
    expect(normalizeUsername('@Meu Nome!!')).toBe('meunome');
    expect(normalizeUsername('   ')).toBe('seu.perfil');
  });

  it('parses and deduplicates tagged accounts', () => {
    expect(parseTags('@ana, bruno @ana  carla!')).toEqual(['ana', 'bruno', 'carla']);
  });

  it('tokenizes hashtags and mentions, and keeps markup as plain text', () => {
    const tokens = tokenizeCaption('oi #viagem @ana');
    expect(tokens.find((token) => token.value === '#viagem')?.type).toBe('hashtag');
    expect(tokens.find((token) => token.value === '@ana')?.type).toBe('mention');

    const markup = tokenizeCaption('<b>#x</b>');
    expect(markup.every((token) => token.type === 'text')).toBe(true);
  });
});

describe('Instagram post simulator draft state', () => {
  const defaults = { username: 'seu.perfil', displayName: 'Seu nome', bio: 'Bio' };
  const source = (id: string, kind: SourceMedia['kind'] = 'image'): SourceMedia => ({
    id,
    kind,
    file: new File(['x'], `${id}.jpg`, { type: 'image/jpeg' }),
    url: `blob:${id}`,
    width: 1600,
    height: 900,
  });

  it('limits the carousel to 20 items', () => {
    let draft = createInitialDraft(defaults);
    const slides = Array.from({ length: 25 }, (_, index) => createMediaSlide(source(`s${index}`)));
    draft = draftReducer(draft, { type: 'addSlides', slides });

    expect(draft.slides).toHaveLength(20);
  });

  it('reorders slides without losing their crop settings', () => {
    let draft = createInitialDraft(defaults);
    draft = draftReducer(draft, {
      type: 'addSlides',
      slides: [createMediaSlide(source('a')), createMediaSlide(source('b')), createMediaSlide(source('c'))],
    });
    draft = draftReducer(draft, { type: 'updateSlide', id: 'c', patch: { crop: { x: 0.1, y: 0.2, zoom: 2 } } });
    draft = draftReducer(draft, { type: 'moveSlide', id: 'c', toIndex: 0 });

    expect(draft.slides.map((slide) => slide.id)).toEqual(['c', 'a', 'b']);
    expect(draft.slides[0].crop).toEqual({ x: 0.1, y: 0.2, zoom: 2 });
  });

  it('builds one view per slide with a shared frame ratio for the carousel', () => {
    let draft = createInitialDraft(defaults);
    draft = draftReducer(draft, { type: 'setAspect', aspect: '3:4' });
    draft = draftReducer(draft, { type: 'addSlides', slides: [createMediaSlide(source('a')), createMediaSlide(source('b'))] });
    const views = buildSlideViews(draft);

    expect(views).toHaveLength(2);
    expect(views.every((view) => Math.abs(view.frameRatio - 0.75) < 1e-9)).toBe(true);
  });

  it('builds exactly as many panorama slides as selected', () => {
    let draft = createInitialDraft(defaults);
    draft = draftReducer(draft, { type: 'setPostType', postType: 'panorama' });
    draft = draftReducer(draft, { type: 'setPanoramaSource', source: source('pano') });
    draft = draftReducer(draft, { type: 'updatePanorama', patch: { count: 5 } });

    expect(buildSlideViews(draft)).toHaveLength(5);
  });

  it('treats only a single video as a Reel', () => {
    let draft = createInitialDraft(defaults);
    draft = draftReducer(draft, { type: 'addSlides', slides: [createMediaSlide(source('v', 'video'))] });
    expect(getReelSlide(draft)?.id).toBe('v');

    draft = draftReducer(draft, { type: 'addSlides', slides: [createMediaSlide(source('p'))] });
    expect(getReelSlide(draft)).toBeNull();
  });
});
