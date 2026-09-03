import { extractAudioAsWav } from './media-extractor';
import { MAX_TRANSCRIBABLE_DURATION_SECONDS, WHISPER_SAMPLE_RATE } from './model-config';
import { TranscriptionError, type DecodedAudio } from './transcription-types';

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

const getAudioContextCtor = (): typeof AudioContext => {
  const ctor = window.AudioContext || window.webkitAudioContext;

  if (!ctor) {
    throw new TranscriptionError('decode_failed', 'Este navegador nao suporta Web Audio API.');
  }

  return ctor;
};

/** Cheap duration probe via a hidden <audio>/<video> element, before committing to a full decode. */
export const readMediaDuration = async (file: File): Promise<number> => {
  const objectUrl = URL.createObjectURL(file);
  const isVideo = file.type.startsWith('video/');

  try {
    return await new Promise<number>((resolve, reject) => {
      const element = document.createElement(isVideo ? 'video' : 'audio');
      element.preload = 'metadata';

      element.onloadedmetadata = () => {
        resolve(Number.isFinite(element.duration) ? element.duration : 0);
      };

      element.onerror = () => reject(new TranscriptionError('corrupted_file', 'Nao foi possivel ler o arquivo.'));
      element.src = objectUrl;
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

/** Downmixes to mono and resamples to 16kHz using an OfflineAudioContext (native, no re-encode). */
const resampleToWhisperFormat = async (audioBuffer: AudioBuffer): Promise<DecodedAudio> => {
  const targetLength = Math.max(1, Math.ceil(audioBuffer.duration * WHISPER_SAMPLE_RATE));
  const offlineContext = new OfflineAudioContext(1, targetLength, WHISPER_SAMPLE_RATE);
  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(offlineContext.destination);
  source.start(0);

  const rendered = await offlineContext.startRendering();

  return {
    channelData: rendered.getChannelData(0),
    sampleRate: WHISPER_SAMPLE_RATE,
    durationInSeconds: rendered.duration,
  };
};

const decodeArrayBufferNatively = async (arrayBuffer: ArrayBuffer): Promise<AudioBuffer> => {
  const AudioContextCtor = getAudioContextCtor();
  const audioContext = new AudioContextCtor();

  try {
    return await audioContext.decodeAudioData(arrayBuffer.slice(0));
  } finally {
    await audioContext.close().catch(() => undefined);
  }
};

export type DecodeProgressCallback = (phase: 'decoding' | 'extracting-fallback') => void;

/**
 * Extracts a mono, 16kHz Float32Array PCM buffer out of an audio or video
 * file, ready to feed into Whisper. Tries the native Web Audio API first
 * (works for most audio files and for video containers whose audio codec
 * the browser can decode directly, e.g. AAC in MP4, Opus/Vorbis in WEBM).
 * Falls back to ffmpeg.wasm (transcoding to WAV) only when native decoding
 * fails, e.g. MKV/AVI containers or less common codecs.
 */
export const decodeMediaFileToPcm = async (
  file: File,
  onProgress?: DecodeProgressCallback,
): Promise<DecodedAudio> => {
  if (file.size === 0) {
    throw new TranscriptionError('empty_file', 'O arquivo esta vazio.');
  }

  const quickDuration = await readMediaDuration(file).catch(() => 0);

  if (quickDuration > MAX_TRANSCRIBABLE_DURATION_SECONDS) {
    throw new TranscriptionError(
      'file_too_long',
      'Este arquivo e muito longo para processar localmente no navegador.',
    );
  }

  onProgress?.('decoding');

  try {
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await decodeArrayBufferNatively(arrayBuffer);

    if (audioBuffer.duration <= 0) {
      throw new TranscriptionError('zero_duration', 'O arquivo nao possui audio com duracao valida.');
    }

    return await resampleToWhisperFormat(audioBuffer);
  } catch (error) {
    if (error instanceof TranscriptionError) {
      throw error;
    }

    onProgress?.('extracting-fallback');
    const wavFile = await extractAudioAsWav(file).catch(() => {
      throw new TranscriptionError(
        'no_audio_track',
        'Nao foi possivel encontrar ou decodificar uma faixa de audio neste arquivo.',
      );
    });

    const wavArrayBuffer = await wavFile.arrayBuffer();
    const audioBuffer = await decodeArrayBufferNatively(wavArrayBuffer);

    if (audioBuffer.duration <= 0) {
      throw new TranscriptionError('zero_duration', 'O arquivo nao possui audio com duracao valida.');
    }

    return await resampleToWhisperFormat(audioBuffer);
  }
};
