export type TranscriptSegment = {
  start: number;
  end: number;
  text: string;
};

export type TranscriptResult = {
  fileName: string;
  duration: number;
  language?: string;
  model: string;
  text: string;
  segments: TranscriptSegment[];
};

/** Internal quality tiers shown to the user as "Rapido / Equilibrado / Alta qualidade". */
export type TranscriptionQuality = 'fast' | 'balanced' | 'high';

export type TranscriptionTask = 'transcribe' | 'translate';

export type WhisperLanguageCode =
  | 'pt'
  | 'en'
  | 'es'
  | 'fr'
  | 'de'
  | 'it'
  | 'ja'
  | 'ko'
  | 'zh'
  | 'ru';

/** 'auto' means: let Whisper detect the spoken language. */
export type TranscriptionLanguageOption = 'auto' | WhisperLanguageCode;

export type InferenceDevice = 'webgpu' | 'wasm';

export type TranscriptionErrorType =
  | 'no_audio_track'
  | 'unsupported_format'
  | 'corrupted_file'
  | 'decode_failed'
  | 'empty_file'
  | 'zero_duration'
  | 'file_too_long'
  | 'webgpu_unavailable'
  | 'model_load_failed'
  | 'out_of_memory'
  | 'worker_error'
  | 'cancelled'
  | 'unknown';

export class TranscriptionError extends Error {
  readonly errorType: TranscriptionErrorType;

  constructor(errorType: TranscriptionErrorType, message: string) {
    super(message);
    this.name = 'TranscriptionError';
    this.errorType = errorType;
  }
}

export type DecodedAudio = {
  channelData: Float32Array;
  sampleRate: number;
  durationInSeconds: number;
};
