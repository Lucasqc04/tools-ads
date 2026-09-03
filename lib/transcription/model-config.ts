import type { InferenceDevice, TranscriptionQuality } from './transcription-types';

/**
 * Multilingual Whisper checkpoints exported to ONNX for Transformers.js
 * (Xenova/* mirrors of openai/whisper-*, NOT the `.en` English-only variants).
 * Picked for a balance of download size / memory / quality:
 *  - fast     -> whisper-tiny  (~75MB total)
 *  - balanced -> whisper-base  (~135MB total) - default
 *  - high     -> whisper-small (~250-410MB total) - opt-in only
 * whisper-medium/large were left out: their multi-GB downloads and RAM use
 * are not realistic for a general-purpose browser tool.
 */
export const QUALITY_MODEL_ID: Record<TranscriptionQuality, string> = {
  fast: 'Xenova/whisper-tiny',
  balanced: 'Xenova/whisper-base',
  high: 'Xenova/whisper-small',
};

export type ModelDtypeConfig =
  | string
  | {
      encoder_model: string;
      decoder_model_merged: string;
    };

/**
 * Whisper's encoder is especially sensitive to quantization, so we keep it
 * at full/half precision and quantize mostly the auto-regressive decoder.
 * WASM uses a single 8-bit ("q8") dtype for both to keep CPU/download cost
 * down, since it's already the slow fallback path.
 */
export const getModelDtype = (
  quality: TranscriptionQuality,
  device: InferenceDevice,
): ModelDtypeConfig => {
  if (device === 'wasm') {
    return 'q8';
  }

  if (quality === 'high') {
    return { encoder_model: 'fp16', decoder_model_merged: 'q4' };
  }

  return { encoder_model: 'fp32', decoder_model_merged: 'q8' };
};

export const WHISPER_SAMPLE_RATE = 16_000;
export const WHISPER_CHUNK_LENGTH_S = 30;
export const WHISPER_STRIDE_LENGTH_S = 5;

/** Soft safety cap so a huge file fails fast with a friendly message instead of risking an OOM tab crash. */
export const MAX_TRANSCRIBABLE_DURATION_SECONDS = 4 * 60 * 60;
