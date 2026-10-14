export type AudioDistortionMode = 'hard-clip' | 'soft-clip' | 'foldback' | 'bitcrush' | 'radio';

export type AudioBlasterOptions = {
  mode: AudioDistortionMode;
  gainDb: number;
  drive: number;
  mix: number;
  bitDepth: number;
  sampleHold: number;
  onProgress?: (progress: number) => void;
};

export type ProcessedAudio = {
  channels: Float32Array[];
  sampleRate: number;
  durationInSeconds: number;
};

export type AudioBlasterErrorCode = 'unsupported_format' | 'file_too_large' | 'duration_too_long' | 'processing_failed';

export class AudioBlasterError extends Error {
  constructor(readonly code: AudioBlasterErrorCode) {
    super(code);
    this.name = 'AudioBlasterError';
  }
}

export const MAX_AUDIO_BLASTER_FILE_SIZE_BYTES = 100 * 1024 * 1024;
export const MAX_AUDIO_BLASTER_DURATION_SECONDS = 240;

type WorkerResponse =
  | { type: 'progress'; progress: number }
  | { type: 'completed'; channels: Float32Array[] }
  | { type: 'failed' };

export const processAudioForDistortion = async (
  file: File,
  options: AudioBlasterOptions,
): Promise<ProcessedAudio> => {
  if (file.size > MAX_AUDIO_BLASTER_FILE_SIZE_BYTES) {
    throw new AudioBlasterError('file_too_large');
  }

  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) throw new AudioBlasterError('unsupported_format');
  const audioContext = new AudioContextConstructor();
  let decoded: AudioBuffer;

  try {
    decoded = await audioContext.decodeAudioData(await file.arrayBuffer());
  } catch {
    throw new AudioBlasterError('unsupported_format');
  } finally {
    await audioContext.close().catch(() => undefined);
  }

  if (decoded.duration > MAX_AUDIO_BLASTER_DURATION_SECONDS) {
    throw new AudioBlasterError('duration_too_long');
  }

  const channels = Array.from({ length: decoded.numberOfChannels }, (_, index) =>
    decoded.getChannelData(index).slice(),
  );
  const worker = new Worker(new URL('./audio-blaster.worker.ts', import.meta.url), { type: 'module' });

  return new Promise<ProcessedAudio>((resolve, reject) => {
    const finish = () => worker.terminate();
    worker.onerror = () => {
      finish();
      reject(new AudioBlasterError('processing_failed'));
    };
    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const message = event.data;
      if (message.type === 'progress') {
        options.onProgress?.(message.progress);
        return;
      }
      finish();
      if (message.type === 'failed') {
        reject(new AudioBlasterError('processing_failed'));
        return;
      }
      options.onProgress?.(1);
      resolve({ channels: message.channels, sampleRate: decoded.sampleRate, durationInSeconds: decoded.duration });
    };

    try {
      worker.postMessage(
        {
          type: 'process',
          channels,
          sampleRate: decoded.sampleRate,
          options: {
            mode: options.mode,
            gainDb: options.gainDb,
            drive: options.drive,
            mix: options.mix,
            bitDepth: options.bitDepth,
            sampleHold: options.sampleHold,
          },
        },
        channels.map((channel) => channel.buffer),
      );
    } catch {
      finish();
      reject(new AudioBlasterError('processing_failed'));
    }
  });
};

export const encodeProcessedAudioAsWav = (
  audio: ProcessedAudio,
  fileName: string,
): File => {
  const channelCount = audio.channels.length;
  const frameCount = audio.channels[0]?.length ?? 0;
  const bytesPerSample = 2;
  const blockAlign = channelCount * bytesPerSample;
  const dataBytes = frameCount * blockAlign;
  const buffer = new ArrayBuffer(44 + dataBytes);
  const view = new DataView(buffer);
  const writeText = (offset: number, value: string) => {
    for (let index = 0; index < value.length; index += 1) {
      view.setUint8(offset + index, value.charCodeAt(index));
    }
  };

  writeText(0, 'RIFF');
  view.setUint32(4, 36 + dataBytes, true);
  writeText(8, 'WAVE');
  writeText(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channelCount, true);
  view.setUint32(24, audio.sampleRate, true);
  view.setUint32(28, audio.sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bytesPerSample * 8, true);
  writeText(36, 'data');
  view.setUint32(40, dataBytes, true);

  let offset = 44;
  for (let frame = 0; frame < frameCount; frame += 1) {
    for (let channel = 0; channel < channelCount; channel += 1) {
      const value = Math.max(-1, Math.min(1, audio.channels[channel]?.[frame] ?? 0));
      view.setInt16(offset, value < 0 ? Math.round(value * 32768) : Math.round(value * 32767), true);
      offset += bytesPerSample;
    }
  }

  return new File([buffer], fileName.replace(/\.[^.]+$/, '') + '-estourado.wav', {
    type: 'audio/wav',
    lastModified: Date.now(),
  });
};

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
