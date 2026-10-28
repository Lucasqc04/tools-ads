import type { ExtractionErrorCode } from './types';

export class ExtractionError extends Error {
  readonly code: ExtractionErrorCode;

  constructor(code: ExtractionErrorCode, message?: string) {
    super(message ?? code);
    this.name = 'ExtractionError';
    this.code = code;
  }
}

export const httpStatusForError = (code: ExtractionErrorCode): number => {
  switch (code) {
    case 'invalid_url':
    case 'bad_request':
      return 400;
    case 'unsupported_platform':
      return 422;
    case 'media_unavailable':
    case 'no_video_found':
      return 404;
    case 'access_blocked':
      return 403;
    case 'rate_limited':
      return 429;
    case 'timeout':
      return 504;
    case 'upstream_error':
      return 502;
  }
};

/** Short, locale-neutral messages. The UI maps `code` to translated copy. */
export const defaultErrorMessage: Record<ExtractionErrorCode, string> = {
  invalid_url: 'The link is not a valid public URL.',
  unsupported_platform: 'This platform is not supported.',
  media_unavailable: 'The post is unavailable, private or was removed.',
  no_video_found: 'No downloadable video was found in this link.',
  rate_limited: 'Too many requests. Try again in a moment.',
  timeout: 'The platform took too long to respond.',
  access_blocked: 'The platform blocked access to this content.',
  upstream_error: 'The platform returned an unexpected response.',
  bad_request: 'Invalid request.',
};
