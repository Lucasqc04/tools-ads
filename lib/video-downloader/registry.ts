import { ExtractionError } from './errors';
import { pinterestExtractor } from './providers/pinterest';
import { twitterExtractor } from './providers/twitter';
import type { VideoExtractor, VideoPlatformId } from './types';
import { hostWithoutWww } from './validate-url';

/**
 * Adding a platform = writing a provider and listing it here. Nothing else in the
 * extraction pipeline needs to change.
 */
export const videoExtractors: readonly VideoExtractor[] = [twitterExtractor, pinterestExtractor];

export const getExtractorById = (id: string): VideoExtractor | undefined =>
  videoExtractors.find((extractor) => extractor.id === id);

export const supportedPlatformIds = (): VideoPlatformId[] =>
  videoExtractors.map((extractor) => extractor.id);

/** Matches the URL's host against each extractor's own allowlist. */
export const detectPlatform = (url: URL): VideoExtractor => {
  const extractor = videoExtractors.find((candidate) =>
    candidate.matchesHost(hostWithoutWww(url.hostname)),
  );

  if (!extractor) {
    throw new ExtractionError('unsupported_platform');
  }

  return extractor;
};
