import { FFmpeg, type LogEvent, type ProgressEvent } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

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

type CompressionAttempt = {
  label: string;
  buildArgs: (outputName: string) => string[];
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const CORE_VERSION = '0.12.10';
const CORE_FILES = {
  core: 'ffmpeg-core.js',
  wasm: 'ffmpeg-core.wasm',
} as const;
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

const toLoadErrorMessage = (error: unknown): string => {
  const message = error instanceof Error ? error.message : String(error);
  return message.replaceAll(/\s+/g, ' ').slice(0, 180);
};

const buildFfmpegLoadError = (failures: string[]): Error =>
  new Error(
    `Nao foi possivel iniciar o mecanismo de compressao de video (${failures.join(
      ' | ',
    )}). Verifique sua conexao, extensoes de bloqueio e tente novamente.`,
  );

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

const getTargetVideoBitrateKbps = (
  fileSize: number,
  durationInSeconds: number,
  videoBitrateFactor: number,
): number => {
  if (durationInSeconds > 0) {
    const originalBitrateKbps = (fileSize * 8) / durationInSeconds / 1000;
    return clamp(Math.round(originalBitrateKbps * videoBitrateFactor), 280, 6000);
  }

  return 1400;
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
          const coreURL = source.getAssetUrl(CORE_FILES.core);
          const wasmURL = source.getAssetUrl(CORE_FILES.wasm);

          await ffmpeg.load({
            coreURL,
            wasmURL,
          });

          ffmpegInstance = ffmpeg;
          return ffmpeg;
        } catch (error) {
          loadFailures.push(`${source.label}: ${toLoadErrorMessage(error)}`);
        }
      }

      throw buildFfmpegLoadError(loadFailures);
    })().catch((error) => {
      ffmpegLoadPromise = null;
      throw error;
    });
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
  options.onLog?.({ message: `Inicializando compressão para ${file.name}...` } as any);

  let ffmpeg: FFmpeg;
  try {
    ffmpeg = await ensureFfmpeg();
    options.onLog?.({ message: 'FFmpeg carregado com sucesso.' } as any);
  } catch (err) {
    options.onLog?.({ message: `Falha ao carregar FFmpeg: ${err instanceof Error ? err.message : String(err)}` } as any);
    throw err;
  }
  const metadata = await readVideoMetadata(file);
  const profile = getCompressionProfile(options.compressionLevel);
  const estimatedSize = estimateCompressedVideoSize(
    file.size,
    metadata.durationInSeconds,
    options.compressionLevel,
  );
  const targetVideoBitrateKbps = getTargetVideoBitrateKbps(
    file.size,
    metadata.durationInSeconds,
    profile.videoBitrateFactor,
  );

  const inputName = `${getUniqueToken()}-input.${file.name.split('.').pop() || 'mp4'}`;
  const scaleFilter = getScaleFilter(profile.downscaleFactor);
  const outputNames: string[] = [];
  const logTail: string[] = [];

  const logHandler = (event: LogEvent) => {
    if (event.message) {
      logTail.push(event.message);
      if (logTail.length > 6) {
        logTail.shift();
      }
    }

    options.onLog?.(event);
  };

  const progressHandler = (event: ProgressEvent) => {
    options.onProgress?.(event);
  };

  ffmpeg.on('log', logHandler);
  ffmpeg.on('progress', progressHandler);

  try {
    options.onLog?.({ message: `Escrevendo arquivo de entrada (${inputName})...` } as any);
    await ffmpeg.writeFile(inputName, await fetchFile(file));
    options.onLog?.({ message: 'Arquivo de entrada escrito no FS.' } as any);

    const attempts: CompressionAttempt[] = [
      {
        label: 'h264-com-audio',
        buildArgs: (outputName) => [
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
        ],
      },
      {
        label: 'mpeg4-com-audio',
        buildArgs: (outputName) => [
          '-i',
          inputName,
          ...(scaleFilter ? ['-vf', scaleFilter] : []),
          '-c:v',
          'mpeg4',
          '-b:v',
          `${targetVideoBitrateKbps}k`,
          '-c:a',
          'aac',
          '-b:a',
          `${profile.audioBitrateKbps}k`,
          '-movflags',
          '+faststart',
          '-pix_fmt',
          'yuv420p',
          outputName,
        ],
      },
      {
        label: 'mpeg4-sem-audio',
        buildArgs: (outputName) => [
          '-i',
          inputName,
          ...(scaleFilter ? ['-vf', scaleFilter] : []),
          '-c:v',
          'mpeg4',
          '-b:v',
          `${targetVideoBitrateKbps}k`,
          '-an',
          '-movflags',
          '+faststart',
          '-pix_fmt',
          'yuv420p',
          outputName,
        ],
      },
    ];

    const attemptFailures: string[] = [];
    let successfulOutputName: string | null = null;

    options.onLog?.({ message: `Iniciando tentativas de compressão (${attempts.length} estratégias).` } as any);

    for (const attempt of attempts) {
      const attemptOutputName = `${getUniqueToken()}-output.mp4`;
      outputNames.push(attemptOutputName);

      try {
        options.onLog?.({ message: `Tentativa: ${attempt.label} — executando ffmpeg...` } as any);
        const exitCode = await ffmpeg.exec(attempt.buildArgs(attemptOutputName));
        options.onLog?.({ message: `Tentativa ${attempt.label} terminou com codigo ${exitCode}.` } as any);

        if (exitCode === 0) {
          successfulOutputName = attemptOutputName;
          break;
        }

        attemptFailures.push(`${attempt.label} (codigo ${exitCode})`);
      } catch (error) {
        const reason = error instanceof Error ? error.message : 'erro inesperado';
        options.onLog?.({ message: `Tentativa ${attempt.label} falhou: ${reason}` } as any);
        attemptFailures.push(`${attempt.label} (${reason})`);
      }
    }

    if (!successfulOutputName) {
      const details =
        logTail.length > 0 ? ` Detalhes: ${logTail.slice(-2).join(' | ')}` : '';
      throw new Error(
        `Falha na compressao de video apos tentativas automaticas (${attemptFailures.join(', ')}).${details}`,
      );
    }

    const outputData = await ffmpeg.readFile(successfulOutputName);
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

    options.onLog?.({ message: 'Limpando arquivos temporarios do FFmpeg.' } as any);
    await ffmpeg.deleteFile(inputName).catch(() => undefined);
    await Promise.all(outputNames.map((outputName) => ffmpeg.deleteFile(outputName).catch(() => undefined)));
  }
};
