import { FFmpeg, type LogEvent, type ProgressEvent } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

export type AudioExportFormat = 'mp3' | 'wav' | 'm4a' | 'ogg' | 'webm';

export type AudioFileMetadata = {
  durationInSeconds: number;
};

export type AudioWaveformData = {
  durationInSeconds: number;
  sampleRate: number;
  channels: number;
  peaks: number[];
};

export type AudioExtractionResult = {
  file: File;
  streamIndex: number;
  label: string;
};

export type AudioProcessingOptions = {
  outputFormat: AudioExportFormat;
  bitrateKbps?: number;
  maxAudioStreams?: number;
  onLog?: (event: LogEvent) => void;
  onProgress?: (event: ProgressEvent) => void;
};

export type AudioSegmentExportOptions = AudioProcessingOptions & {
  startInSeconds: number;
  endInSeconds: number;
  outputName: string;
};

export type AudioExportFormatConfig = {
  id: AudioExportFormat;
  extension: string;
  mimeType: string;
  label: string;
};

export const audioExportFormats: AudioExportFormatConfig[] = [
  { id: 'mp3', extension: 'mp3', mimeType: 'audio/mpeg', label: 'MP3' },
  { id: 'wav', extension: 'wav', mimeType: 'audio/wav', label: 'WAV' },
  { id: 'm4a', extension: 'm4a', mimeType: 'audio/mp4', label: 'M4A' },
  { id: 'ogg', extension: 'ogg', mimeType: 'audio/ogg', label: 'OGG' },
  { id: 'webm', extension: 'webm', mimeType: 'audio/webm', label: 'WEBM' },
];

const formatConfigById = new Map(audioExportFormats.map((format) => [format.id, format]));

const CORE_VERSION = '0.12.10';
const MIN_AUDIO_SEGMENT_EXPORT_SECONDS = 0.005;
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

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const getUniqueToken = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const sanitizeAudioFileBaseName = (rawName: string): string => {
  const withoutExtension = rawName.replace(/\.[^.]+$/, '');
  const normalized = withoutExtension
    .trim()
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .replaceAll(/[^a-zA-Z0-9-_]+/g, '-')
    .replaceAll(/-+/g, '-')
    .replaceAll(/^-+|-+$/g, '');

  return normalized || 'audio';
};

const getSourceExtension = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase().replaceAll(/[^a-z0-9]/g, '');
  return extension || 'bin';
};

const getFormatConfig = (format: AudioExportFormat): AudioExportFormatConfig => {
  const config = formatConfigById.get(format);
  if (!config) {
    throw new Error(`Formato de audio nao suportado: ${format}`);
  }

  return config;
};

const toLoadErrorMessage = (error: unknown): string => {
  const message = error instanceof Error ? error.message : String(error);
  return message.replaceAll(/\s+/g, ' ').slice(0, 180);
};

const buildFfmpegLoadError = (failures: string[]): Error =>
  new Error(
    `Nao foi possivel iniciar o mecanismo de audio (${failures.join(
      ' | ',
    )}). Verifique a conexao, extensoes de bloqueio e tente novamente.`,
  );

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

          await ffmpeg.load({ coreURL, wasmURL });

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

const getAudioCodecArgs = (
  format: AudioExportFormat,
  bitrateKbps: number,
): string[] => {
  if (format === 'wav') {
    return ['-c:a', 'pcm_s16le'];
  }

  if (format === 'm4a') {
    return ['-c:a', 'aac', '-b:a', `${bitrateKbps}k`, '-movflags', '+faststart'];
  }

  if (format === 'ogg') {
    return ['-c:a', 'libvorbis', '-b:a', `${bitrateKbps}k`];
  }

  if (format === 'webm') {
    return ['-c:a', 'libopus', '-b:a', `${bitrateKbps}k`];
  }

  return ['-c:a', 'libmp3lame', '-b:a', `${bitrateKbps}k`];
};

const dataToFile = (
  data: Awaited<ReturnType<FFmpeg['readFile']>>,
  fileName: string,
  format: AudioExportFormat,
): File => {
  const config = getFormatConfig(format);
  const bytes = data instanceof Uint8Array ? data : new TextEncoder().encode(String(data));
  const blob = new Blob([bytes], { type: config.mimeType });

  return new File([blob], fileName, {
    type: config.mimeType,
    lastModified: Date.now(),
  });
};

const emitProgress = (options: AudioProcessingOptions, progress: number): void => {
  options.onProgress?.({
    progress: clamp(progress, 0, 1),
    time: 0,
  });
};

export const buildAudioOutputName = (
  baseName: string,
  format: AudioExportFormat,
  suffix?: string,
): string => {
  const config = getFormatConfig(format);
  const cleanBase = sanitizeAudioFileBaseName(baseName);
  const cleanSuffix = suffix ? `-${sanitizeAudioFileBaseName(suffix)}` : '';

  return `${cleanBase}${cleanSuffix}.${config.extension}`;
};

export const readAudioMetadata = async (file: File): Promise<AudioFileMetadata> => {
  if (typeof window === 'undefined') {
    return { durationInSeconds: 0 };
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    return await new Promise<AudioFileMetadata>((resolve, reject) => {
      const audio = document.createElement('audio');
      audio.preload = 'metadata';

      audio.onloadedmetadata = () => {
        resolve({
          durationInSeconds: Number.isFinite(audio.duration) ? audio.duration : 0,
        });
      };

      audio.onerror = () => reject(new Error('Nao foi possivel ler os metadados do audio.'));
      audio.src = objectUrl;
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

export const createAudioWaveform = async (
  file: File,
  peakCount = 1200,
): Promise<AudioWaveformData> => {
  if (typeof window === 'undefined') {
    return {
      durationInSeconds: 0,
      sampleRate: 0,
      channels: 0,
      peaks: [],
    };
  }

  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContextCtor();

  try {
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0));
    const channels = audioBuffer.numberOfChannels;
    const sampleCount = audioBuffer.length;
    const safePeakCount = clamp(Math.round(peakCount), 160, 4000);
    const blockSize = Math.max(1, Math.floor(sampleCount / safePeakCount));
    const peaks: number[] = [];

    for (let offset = 0; offset < sampleCount; offset += blockSize) {
      let max = 0;
      const end = Math.min(offset + blockSize, sampleCount);

      for (let channel = 0; channel < channels; channel += 1) {
        const data = audioBuffer.getChannelData(channel);

        for (let index = offset; index < end; index += 1) {
          const value = Math.abs(data[index] ?? 0);
          if (value > max) {
            max = value;
          }
        }
      }

      peaks.push(clamp(max, 0, 1));
    }

    return {
      durationInSeconds: audioBuffer.duration,
      sampleRate: audioBuffer.sampleRate,
      channels,
      peaks,
    };
  } finally {
    await audioContext.close().catch(() => undefined);
  }
};

export const extractAudioTracksFromMedia = async (
  file: File,
  options: AudioProcessingOptions,
): Promise<AudioExtractionResult[]> => {
  const ffmpeg = await ensureFfmpeg();
  const format = options.outputFormat;
  const config = getFormatConfig(format);
  const bitrateKbps = clamp(options.bitrateKbps ?? 192, 64, 320);
  const maxAudioStreams = clamp(options.maxAudioStreams ?? 4, 1, 8);
  const inputName = `${getUniqueToken()}-input.${getSourceExtension(file.name)}`;
  const outputNames: string[] = [];
  const results: AudioExtractionResult[] = [];
  let currentStream = 0;

  const logHandler = (event: LogEvent) => {
    options.onLog?.(event);
  };

  const progressHandler = (event: ProgressEvent) => {
    const streamProgress = clamp(event.progress, 0, 1);
    options.onProgress?.({
      ...event,
      progress: clamp((currentStream + streamProgress) / maxAudioStreams, 0, 0.98),
    });
  };

  ffmpeg.on('log', logHandler);
  ffmpeg.on('progress', progressHandler);

  try {
    emitProgress(options, 0.02);
    await ffmpeg.writeFile(inputName, await fetchFile(file));
    emitProgress(options, 0.05);

    for (let streamIndex = 0; streamIndex < maxAudioStreams; streamIndex += 1) {
      currentStream = streamIndex;
      const outputName = `${getUniqueToken()}-audio-${streamIndex}.${config.extension}`;
      outputNames.push(outputName);

      const args = [
        '-i',
        inputName,
        '-map',
        `0:a:${streamIndex}`,
        '-vn',
        '-ac',
        '2',
        '-ar',
        '44100',
        ...getAudioCodecArgs(format, bitrateKbps),
        outputName,
      ];

      try {
        const exitCode = await ffmpeg.exec(args);
        if (exitCode !== 0) {
          continue;
        }

        const outputData = await ffmpeg.readFile(outputName);
        const fileName = buildAudioOutputName(
          file.name,
          format,
          streamIndex === 0 ? 'faixa-1' : `faixa-${streamIndex + 1}`,
        );

        results.push({
          file: dataToFile(outputData, fileName, format),
          streamIndex,
          label: `Audio ${streamIndex + 1}`,
        });
      } catch {
        // Missing streams are expected for most files. Keep trying the next possible track.
      }
    }

    if (!results.length) {
      const outputName = `${getUniqueToken()}-audio-default.${config.extension}`;
      outputNames.push(outputName);
      currentStream = 0;

      const exitCode = await ffmpeg.exec([
        '-i',
        inputName,
        '-vn',
        '-ac',
        '2',
        '-ar',
        '44100',
        ...getAudioCodecArgs(format, bitrateKbps),
        outputName,
      ]);

      if (exitCode !== 0) {
        throw new Error(
          'Este arquivo nao tem uma faixa de audio detectavel. O video foi lido, mas nao existe stream de audio para extrair.',
        );
      }

      const outputData = await ffmpeg.readFile(outputName);
      results.push({
        file: dataToFile(outputData, buildAudioOutputName(file.name, format, 'audio'), format),
        streamIndex: 0,
        label: 'Audio',
      });
    }

    emitProgress(options, 1);
    return results;
  } finally {
    ffmpeg.off('log', logHandler);
    ffmpeg.off('progress', progressHandler);
    await ffmpeg.deleteFile(inputName).catch(() => undefined);
    await Promise.all(
      outputNames.map((outputName) => ffmpeg.deleteFile(outputName).catch(() => undefined)),
    );
  }
};

export const exportAudioSegment = async (
  file: File,
  options: AudioSegmentExportOptions,
): Promise<File> => {
  const ffmpeg = await ensureFfmpeg();
  const format = options.outputFormat;
  const bitrateKbps = clamp(options.bitrateKbps ?? 192, 64, 320);
  const safeStart = Math.max(0, options.startInSeconds);
  const safeEnd = Math.max(safeStart + MIN_AUDIO_SEGMENT_EXPORT_SECONDS, options.endInSeconds);
  const duration = safeEnd - safeStart;
  const config = getFormatConfig(format);
  const inputName = `${getUniqueToken()}-segment-input.${getSourceExtension(file.name)}`;
  const outputName = `${getUniqueToken()}-segment-output.${config.extension}`;

  const logHandler = (event: LogEvent) => {
    options.onLog?.(event);
  };

  const progressHandler = (event: ProgressEvent) => {
    options.onProgress?.({
      ...event,
      progress: clamp(event.progress, 0, 1),
    });
  };

  ffmpeg.on('log', logHandler);
  ffmpeg.on('progress', progressHandler);

  try {
    emitProgress(options, 0.04);
    await ffmpeg.writeFile(inputName, await fetchFile(file));
    emitProgress(options, 0.08);

    const exitCode = await ffmpeg.exec([
      '-ss',
      safeStart.toFixed(3),
      '-t',
      duration.toFixed(3),
      '-i',
      inputName,
      '-vn',
      '-ac',
      '2',
      '-ar',
      '44100',
      ...getAudioCodecArgs(format, bitrateKbps),
      outputName,
    ]);

    if (exitCode !== 0) {
      throw new Error('Nao foi possivel exportar este trecho de audio.');
    }

    const outputData = await ffmpeg.readFile(outputName);
    emitProgress(options, 1);

    return dataToFile(outputData, options.outputName, format);
  } finally {
    ffmpeg.off('log', logHandler);
    ffmpeg.off('progress', progressHandler);
    await ffmpeg.deleteFile(inputName).catch(() => undefined);
    await ffmpeg.deleteFile(outputName).catch(() => undefined);
  }
};

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
