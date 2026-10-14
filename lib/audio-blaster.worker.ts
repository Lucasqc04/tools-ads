import type { AudioDistortionMode } from './audio-blaster';

type Options = {
  mode: AudioDistortionMode;
  gainDb: number;
  drive: number;
  mix: number;
  bitDepth: number;
  sampleHold: number;
};

type Request = {
  type: 'process';
  channels: Float32Array[];
  sampleRate: number;
  options: Options;
};

type Response =
  | { type: 'progress'; progress: number }
  | { type: 'completed'; channels: Float32Array[] }
  | { type: 'failed' };

type WorkerScope = {
  onmessage: ((event: MessageEvent<Request>) => void) | null;
  postMessage: (message: Response, transfer?: Transferable[]) => void;
};

const scope = self as unknown as WorkerScope;
const CHUNK_SIZE = 262_144;

const foldback = (input: number): number => {
  const wrapped = ((input + 1) % 4 + 4) % 4;
  return wrapped <= 2 ? wrapped - 1 : 3 - wrapped;
};

const softClip = (input: number, drive: number): number =>
  Math.tanh(input * drive) / Math.tanh(drive);

const processAudio = (request: Request): void => {
  const { channels: sourceChannels, sampleRate, options } = request;
  const frameCount = sourceChannels[0]?.length ?? 0;
  const outputChannels = sourceChannels.map((channel) => new Float32Array(channel.length));
  const channelLowState = new Array(sourceChannels.length).fill(0) as number[];
  const channelRadioState = new Array(sourceChannels.length).fill(0) as number[];
  const gain = 10 ** (options.gainDb / 20);
  const mix = Math.max(0, Math.min(1, options.mix / 100));
  const quantizationSteps = Math.max(1, 2 ** (Math.max(2, Math.min(16, options.bitDepth)) - 1) - 1);
  const sampleHold = Math.max(1, Math.min(64, Math.round(options.sampleHold)));
  const holdValues = new Array(sourceChannels.length).fill(0) as number[];
  const lowAlpha = 1 - Math.exp((-2 * Math.PI * 250) / sampleRate);
  const radioAlpha = 1 - Math.exp((-2 * Math.PI * 3000) / sampleRate);

  for (let start = 0; start < frameCount; start += CHUNK_SIZE) {
    const end = Math.min(frameCount, start + CHUNK_SIZE);

    for (let channel = 0; channel < sourceChannels.length; channel += 1) {
      const source = sourceChannels[channel] as Float32Array;
      const output = outputChannels[channel] as Float32Array;

      for (let index = start; index < end; index += 1) {
        const raw = (source[index] ?? 0) * gain;
        const driven = raw * options.drive;
        let effected: number;

        if (options.mode === 'hard-clip') {
          effected = Math.max(-1, Math.min(1, driven));
        } else if (options.mode === 'soft-clip') {
          effected = softClip(raw, options.drive);
        } else if (options.mode === 'foldback') {
          effected = foldback(driven);
        } else if (options.mode === 'bitcrush') {
          if (index % sampleHold === 0) {
            holdValues[channel] = Math.round(Math.max(-1, Math.min(1, driven)) * quantizationSteps) / quantizationSteps;
          }
          effected = holdValues[channel] ?? 0;
        } else {
          const low = (channelLowState[channel] ?? 0) + lowAlpha * (raw - (channelLowState[channel] ?? 0));
          channelLowState[channel] = low;
          const highPassed = raw - low;
          const radio = (channelRadioState[channel] ?? 0) + radioAlpha * (highPassed - (channelRadioState[channel] ?? 0));
          channelRadioState[channel] = radio;
          effected = softClip(radio, options.drive * 1.5);
        }

        output[index] = Math.max(-1, Math.min(1, raw * (1 - mix) + effected * mix));
      }
    }

    scope.postMessage({ type: 'progress', progress: end / Math.max(1, frameCount) });
  }

  scope.postMessage({ type: 'completed', channels: outputChannels }, outputChannels.map((channel) => channel.buffer));
};

scope.onmessage = (event) => {
  if (event.data.type !== 'process') return;
  try {
    processAudio(event.data);
  } catch {
    scope.postMessage({ type: 'failed' });
  }
};
