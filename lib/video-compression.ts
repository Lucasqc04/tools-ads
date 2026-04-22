import { FFmpeg, type LogEvent, type ProgressEvent } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export type VideoMetadata = {
  durationInSeconds: number;
  width: number;
  height: number;
};

export type VideoCompressionOptions = {
  compressionLevel: number;
  onLog?: (event: LogEvent) => void;
  onProgress?: (event: ProgressEvent) => void;
};

export type VideoCompressionProfile = {
  crf: number;
  videoBitrateFactor: number;
  audioBitrateKbps: number;
  downscaleFactor: number;
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const CORE_VERSION = '0.12.10';
const CORE_BASE_URL = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/esm`;

let ffmpegInstance: FFmpeg | null = null;
let ffmpegLoadPromise: Promise<FFmpeg> | null = null;

const getCompressionProfile = (compressionLevel: number): VideoCompressionProfile => {
  const normalized = clamp(compressionLevel / 100, 0, 1);

  return {
    crf: Math.round(20 + normalized * 17),
    videoBitrateFactor: clamp(0.98 - normalized * 0.72, 0.22, 0.98),
    audioBitrateKbps: normalized >= 0.75 ? 64 : normalized >= 0.45 ? 96 : 128,
    downscaleFactor:
      normalized >= 0.9
        ? 0.58
        : normalized >= 0.75
          ? 0.68
          : normalized >= 0.55
            ? 0.8
            : normalized >= 0.35
              ? 0.9
              : 1,
  };
};

const getSanitizedName = (fileName: string): string =>
  fileName
    .replace(/\.[^.]+$/, '')
    .trim()
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .replaceAll(/[^a-zA-Z0-9-_]+/g, '-')
    .replaceAll(/-+/g, '-')
    .replaceAll(/^-+|-+$/g, '') || 'video';

const getUniqueToken = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const toOutputName = (sourceName: string): string =>
  `${getSanitizedName(sourceName)}-compressed.mp4`;

const getScaleFilter = (downscaleFactor: number): string | undefined => {
  if (downscaleFactor >= 0.995) {
    return undefined;
  }

  return `scale=trunc(iw*${downscaleFactor}/2)*2:trunc(ih*${downscaleFactor}/2)*2`;
};

const ensureFfmpeg = async (): Promise<FFmpeg> => {
  if (ffmpegInstance?.loaded) {
    return ffmpegInstance;
  }

  if (!ffmpegLoadPromise) {
    ffmpegLoadPromise = (async () => {
      const ffmpeg = new FFmpeg();
      const coreURL = await toBlobURL(`${CORE_BASE_URL}/ffmpeg-core.js`, 'text/javascript');
      const wasmURL = await toBlobURL(`${CORE_BASE_URL}/ffmpeg-core.wasm`, 'application/wasm');
      const workerURL = await toBlobURL(
        `${CORE_BASE_URL}/ffmpeg-core.worker.js`,
        'text/javascript',
      );

      await ffmpeg.load({
        coreURL,
        wasmURL,
        workerURL,
      });

      ffmpegInstance = ffmpeg;
      return ffmpeg;
    })();
  }

  return ffmpegLoadPromise;
};

export const estimateCompressedVideoSize = (
  fileSize: number,
  durationInSeconds: number,
  compressionLevel: number,
): number => {
  const profile = getCompressionProfile(compressionLevel);

  if (durationInSeconds > 0) {
    const originalBitrateKbps = (fileSize * 8) / durationInSeconds / 1000;
    const targetVideoBitrateKbps = clamp(
      Math.round(originalBitrateKbps * profile.videoBitrateFactor),
      280,
      6000,
    );
    const combinedKbps = targetVideoBitrateKbps + profile.audioBitrateKbps;
    const estimated = Math.round((combinedKbps * 1000 * durationInSeconds) / 8);

    return Math.max(32 * 1024, estimated);
  }

  const fallback = Math.round(fileSize * profile.videoBitrateFactor);
  return Math.max(32 * 1024, fallback);
};

export const readVideoMetadata = async (file: File): Promise<VideoMetadata> => {
  if (typeof window === 'undefined') {
    return {
      durationInSeconds: 0,
      width: 0,
      height: 0,
    };
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    return await new Promise<VideoMetadata>((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        resolve({
          durationInSeconds: Number.isFinite(video.duration) ? video.duration : 0,
          width: video.videoWidth || 0,
          height: video.videoHeight || 0,
        });
      };

      video.onerror = () => reject(new Error('Nao foi possivel ler metadados do video.'));
      video.src = objectUrl;
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

export const compressVideoFile = async (
  file: File,
  options: VideoCompressionOptions,
): Promise<{
  file: File;
  metadata: VideoMetadata;
  estimatedSize: number;
  profile: VideoCompressionProfile;
}> => {
  const ffmpeg = await ensureFfmpeg();
  const metadata = await readVideoMetadata(file);
  const profile = getCompressionProfile(options.compressionLevel);
  const estimatedSize = estimateCompressedVideoSize(
    file.size,
    metadata.durationInSeconds,
    options.compressionLevel,
  );

  const inputName = `${getUniqueToken()}-input.${file.name.split('.').pop() || 'mp4'}`;
  const outputName = `${getUniqueToken()}-output.mp4`;
  const scaleFilter = getScaleFilter(profile.downscaleFactor);

  const logHandler = (event: LogEvent) => {
    options.onLog?.(event);
  };

  const progressHandler = (event: ProgressEvent) => {
    options.onProgress?.(event);
  };

  ffmpeg.on('log', logHandler);
  ffmpeg.on('progress', progressHandler);

  try {
    await ffmpeg.writeFile(inputName, await fetchFile(file));

    const args = [
      '-i',
      inputName,
      ...(scaleFilter ? ['-vf', scaleFilter] : []),
      '-c:v',
      'libx264',
      '-preset',
      'veryfast',
      '-crf',
      String(profile.crf),
      '-c:a',
      'aac',
      '-b:a',
      `${profile.audioBitrateKbps}k`,
      '-movflags',
      '+faststart',
      '-pix_fmt',
      'yuv420p',
      outputName,
    ];

    const exitCode = await ffmpeg.exec(args);

    if (exitCode !== 0) {
      throw new Error(`Falha na compressao de video (codigo ${exitCode}).`);
    }

    const outputData = await ffmpeg.readFile(outputName);
    const outputBytes =
      outputData instanceof Uint8Array ? outputData : new TextEncoder().encode(String(outputData));

    const outputBlob = new Blob([outputBytes], { type: 'video/mp4' });
    const outputFile = new File([outputBlob], toOutputName(file.name), {
      type: 'video/mp4',
      lastModified: Date.now(),
    });

    return {
      file: outputFile,
      metadata,
      estimatedSize,
      profile,
    };
  } finally {
    ffmpeg.off('log', logHandler);
    ffmpeg.off('progress', progressHandler);

    await ffmpeg.deleteFile(inputName).catch(() => undefined);
    await ffmpeg.deleteFile(outputName).catch(() => undefined);
  }
};
