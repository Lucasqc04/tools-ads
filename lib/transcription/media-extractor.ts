import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { WHISPER_SAMPLE_RATE } from './model-config';

// Mirrors the CORE_SOURCES/ensureFfmpeg pattern already used by
// lib/audio-editor.ts and lib/video-compression.ts: ffmpeg.wasm is only
// loaded lazily, as a fallback, when the native Web Audio API cannot
// decode a file directly (e.g. MKV/AVI containers or uncommon codecs).
const CORE_VERSION = '0.12.10';
const CORE_FILES = { core: 'ffmpeg-core.js', wasm: 'ffmpeg-core.wasm' } as const;
const CORE_SOURCES = [
  {
    label: 'api-local',
    getAssetUrl: (fileName: string) => `/api/ffmpeg?asset=${encodeURIComponent(fileName)}`,
  },
  {
    label: 'unpkg',
    getAssetUrl: (fileName: string) =>
      `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/umd/${fileName}`,
  },
  {
    label: 'jsdelivr',
    getAssetUrl: (fileName: string) =>
      `https://cdn.jsdelivr.net/npm/@ffmpeg/core@${CORE_VERSION}/dist/umd/${fileName}`,
  },
] as const;

let ffmpegInstance: FFmpeg | null = null;
let ffmpegLoadPromise: Promise<FFmpeg> | null = null;

const getUniqueToken = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const getSourceExtension = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase().replaceAll(/[^a-z0-9]/g, '');
  return extension || 'bin';
};

const toLoadErrorMessage = (error: unknown): string => {
  const message = error instanceof Error ? error.message : String(error);
  return message.replaceAll(/\s+/g, ' ').slice(0, 180);
};

const ensureFfmpeg = async (): Promise<FFmpeg> => {
  if (ffmpegInstance?.loaded) {
    return ffmpegInstance;
  }

  if (!ffmpegLoadPromise) {
    ffmpegLoadPromise = (async () => {
      const loadFailures: string[] = [];

      for (const source of CORE_SOURCES) {
        try {
          const ffmpeg = new FFmpeg();
          await ffmpeg.load({
            coreURL: source.getAssetUrl(CORE_FILES.core),
            wasmURL: source.getAssetUrl(CORE_FILES.wasm),
          });

          ffmpegInstance = ffmpeg;
          return ffmpeg;
        } catch (error) {
          loadFailures.push(`${source.label}: ${toLoadErrorMessage(error)}`);
        }
      }

      throw new Error(
        `Nao foi possivel iniciar o mecanismo de extracao de audio (${loadFailures.join(' | ')}).`,
      );
    })().catch((error) => {
      ffmpegLoadPromise = null;
      throw error;
    });
  }

  return ffmpegLoadPromise;
};

/**
 * Transcodes any file ffmpeg.wasm can demux/decode into a mono, 16kHz WAV
 * file. Used only as a fallback when the native Web Audio API fails to
 * decode a file directly.
 */
export const extractAudioAsWav = async (file: File): Promise<File> => {
  const ffmpeg = await ensureFfmpeg();
  const inputName = `${getUniqueToken()}-input.${getSourceExtension(file.name)}`;
  const outputName = `${getUniqueToken()}-output.wav`;

  try {
    await ffmpeg.writeFile(inputName, await fetchFile(file));

    const exitCode = await ffmpeg.exec([
      '-i',
      inputName,
      '-vn',
      '-ac',
      '1',
      '-ar',
      String(WHISPER_SAMPLE_RATE),
      '-c:a',
      'pcm_s16le',
      outputName,
    ]);

    if (exitCode !== 0) {
      throw new Error('Falha ao extrair audio deste arquivo.');
    }

    const outputData = await ffmpeg.readFile(outputName);
    const bytes =
      outputData instanceof Uint8Array ? outputData : new TextEncoder().encode(String(outputData));

    return new File([new Blob([bytes], { type: 'audio/wav' })], 'extracted-audio.wav', {
      type: 'audio/wav',
      lastModified: Date.now(),
    });
  } finally {
    await ffmpeg.deleteFile(inputName).catch(() => undefined);
    await ffmpeg.deleteFile(outputName).catch(() => undefined);
  }
};
