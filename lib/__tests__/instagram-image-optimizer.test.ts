import { describe, expect, it } from 'vitest';
import {
  buildInstagramOutputName,
  calculateCropRectangle,
  calculateOutputDimensions,
  INSTAGRAM_PRESETS,
  isImageAlreadyWithinPreset,
} from '@/lib/instagram-image-optimizer';

describe('Instagram image preparation geometry', () => {
  it('centers and bounds a portrait crop for a 3:4 Feed image', () => {
    const crop = calculateCropRectangle(4000, 3000, 3 / 4, { x: 0.5, y: 0.5, zoom: 1 });

    expect(crop).toEqual({ x: 875, y: 0, width: 2250, height: 3000 });
    expect(crop.width / crop.height).toBeCloseTo(3 / 4, 3);
  });

  it('clamps zoom and crop positions to the source image bounds', () => {
    const crop = calculateCropRectangle(4000, 3000, 1, { x: 2, y: -1, zoom: 3 });

    expect(crop).toEqual({ x: 2500, y: 0, width: 1500, height: 1500 });
    expect(crop.x + crop.width).toBeLessThanOrEqual(4000);
    expect(crop.y + crop.height).toBeLessThanOrEqual(3000);
  });

  it('does not upscale a crop smaller than the preset reference', () => {
    const output = calculateOutputDimensions(
      { width: 600, height: 800 },
      INSTAGRAM_PRESETS['feed-34'],
    );

    expect(output).toEqual({ width: 600, height: 800 });
  });

  it('keeps a smaller source at its native size for a custom destination', () => {
    const target = { id: 'profile' as const, width: 900, height: 1125 };
    const crop = calculateCropRectangle(600, 750, target.width / target.height, {
      x: 0.5,
      y: 0.5,
      zoom: 1,
    });

    expect(calculateOutputDimensions(crop, target)).toEqual({ width: 600, height: 750 });
  });

  it('snaps rounding-level crop differences to the selected custom output size', () => {
    const crop = calculateCropRectangle(998, 998, 3 / 4, { x: 0.5, y: 0.5, zoom: 1 });
    const target = { id: 'profile' as const, width: 600, height: 800 };

    expect(calculateOutputDimensions(crop, target)).toEqual({ width: 600, height: 800 });
  });

  it('recognizes an image that already fits and keeps larger mismatched images transformable', () => {
    expect(isImageAlreadyWithinPreset(900, 1200, INSTAGRAM_PRESETS['feed-34'])).toBe(true);
    expect(isImageAlreadyWithinPreset(4000, 3000, INSTAGRAM_PRESETS['feed-34'])).toBe(false);
  });

  it('creates a safe output name with an Instagram suffix', () => {
    expect(buildInstagramOutputName('Minha foto (verão).jpeg', 'jpg')).toBe(
      'Minha-foto-verao-instagram.jpg',
    );
  });
});
