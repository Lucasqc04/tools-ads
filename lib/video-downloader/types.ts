export type VideoPlatformId = 'twitter' | 'pinterest';

/**
 * progressive: single file with a plain HTTP URL (downloadable with fetch/Range).
 * hls: playlist (.m3u8); listed so callers know it exists, never downloaded as a single file.
 */
export type VideoFormatKind = 'progressive' | 'hls';

export type VideoFormat = {
  id: string;
  kind: VideoFormatKind;
  /** Human label such as "720p". Only present when it was read from the source. */
  quality?: string;
  container: 'mp4' | 'm3u8';
  mimeType: string;
  width?: number;
  height?: number;
  bitrateKbps?: number;
  hasVideo: boolean;
  /** null = the source does not say whether an audio track exists. */
  hasAudio: boolean | null;
  url: string;
};

/**
 * Whether the browser may read the media bytes with fetch() (CORS) and save them
 * as a Blob, or whether we can only point the user at the file.
 */
export type BrowserDownloadSupport = 'fetch' | 'open';

export type ExtractionSuccess = {
  success: true;
  platform: VideoPlatformId;
  sourceUrl: string;
  title: string;
  author?: string;
  thumbnail?: string;
  durationSeconds?: number;
  formats: VideoFormat[];
  browserDownload: BrowserDownloadSupport;
  /** Limitations the UI should surface for this particular result. */
  notes: ExtractionNote[];
};

export type ExtractionNote = 'multiple_media_only_first' | 'no_cors_open_only' | 'gif_without_audio';

export type ExtractionErrorCode =
  | 'invalid_url'
  | 'unsupported_platform'
  | 'media_unavailable'
  | 'no_video_found'
  | 'rate_limited'
  | 'timeout'
  | 'access_blocked'
  | 'upstream_error'
  | 'bad_request';

export type ExtractionFailure = {
  success: false;
  error: {
    code: ExtractionErrorCode;
    message: string;
  };
};

export type ExtractionResponse = ExtractionSuccess | ExtractionFailure;

/** What a provider returns; the orchestrator adds `success`, `platform` and validates URLs. */
export type ProviderExtraction = Omit<ExtractionSuccess, 'success' | 'platform'>;

export interface VideoExtractor {
  id: VideoPlatformId;
  name: string;
  /** Exact hostnames (without "www.") whose links this extractor understands. */
  matchesHost(hostname: string): boolean;
  /**
   * Hostnames the media/thumbnail URLs returned by this extractor must belong to.
   * Anything else is dropped before reaching the browser.
   */
  isAllowedMediaHost(hostname: string): boolean;
  browserDownload: BrowserDownloadSupport;
  /** Returns the canonical public URL, or throws ExtractionError('invalid_url'). */
  normalize(url: URL): Promise<URL> | URL;
  extract(normalized: URL, signal: AbortSignal): Promise<ProviderExtraction>;
}
