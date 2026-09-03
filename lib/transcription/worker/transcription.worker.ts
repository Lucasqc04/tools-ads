/// <reference lib="webworker" />
import {
  InterruptableStoppingCriteria,
  StoppingCriteriaList,
  WhisperTextStreamer,
  env,
  pipeline,
  type AutomaticSpeechRecognitionConfig,
  type AutomaticSpeechRecognitionOutput,
  type AutomaticSpeechRecognitionPipeline,
  type DataType,
  type WhisperTokenizer,
} from '@huggingface/transformers';
import { WHISPER_LANGUAGE_NAME } from '../languages';
import {
  QUALITY_MODEL_ID,
  WHISPER_CHUNK_LENGTH_S,
  WHISPER_STRIDE_LENGTH_S,
  getModelDtype,
} from '../model-config';
import type { InferenceDevice, TranscriptionErrorType, TranscriptResult, TranscriptSegment } from '../transcription-types';
import type { WorkerRequestMessage, WorkerResponseMessage } from './worker-protocol';

/**
 * The ASR pipeline's own call-options type only declares the documented
 * `AutomaticSpeechRecognitionSpecificParams`. `streamer` and
 * `stopping_criteria` are generate()-only parameters that the pipeline
 * forwards through at runtime (see the reference xenova/whisper-web
 * implementation) but that aren't part of that declared type.
 */
type TranscribeCallOptions = Partial<AutomaticSpeechRecognitionConfig> & {
  streamer?: WhisperTextStreamer;
  stopping_criteria?: StoppingCriteriaList;
};

const ctx = self as unknown as DedicatedWorkerGlobalScope;

env.allowLocalModels = false;

let currentPipeline: AutomaticSpeechRecognitionPipeline | null = null;
let currentPipelineKey: string | null = null;
let activeStoppingCriteria: InterruptableStoppingCriteria | null = null;
const cancelledJobIds = new Set<string>();

/** Thrown to unwind out of model loading/transcription as soon as a CANCEL is seen for `jobId`. */
class TranscriptionCancelledError extends Error {}

const throwIfCancelled = (jobId: string): void => {
  if (cancelledJobIds.has(jobId)) {
    throw new TranscriptionCancelledError();
  }
};

const post = (message: WorkerResponseMessage): void => {
  ctx.postMessage(message);
};

const toUserMessage = (error: unknown): string => {
  const message = error instanceof Error ? error.message : String(error);
  return message.replaceAll(/\s+/g, ' ').slice(0, 220);
};

const classifyError = (error: unknown, fallback: TranscriptionErrorType): TranscriptionErrorType => {
  const message = (error instanceof Error ? error.message : String(error)).toLowerCase();

  if (message.includes('out of memory') || message.includes('oom') || message.includes('allocation')) {
    return 'out_of_memory';
  }

  if (message.includes('webgpu')) {
    return 'webgpu_unavailable';
  }

  return fallback;
};

const disposeCurrentPipeline = async (): Promise<void> => {
  if (currentPipeline) {
    await currentPipeline.dispose().catch(() => undefined);
  }

  currentPipeline = null;
  currentPipelineKey = null;
};

const ensurePipeline = async (
  jobId: string,
  quality: keyof typeof QUALITY_MODEL_ID,
  device: InferenceDevice,
): Promise<AutomaticSpeechRecognitionPipeline> => {
  throwIfCancelled(jobId);

  const modelId = QUALITY_MODEL_ID[quality];
  const dtype = getModelDtype(quality, device);
  const key = `${modelId}::${device}::${JSON.stringify(dtype)}`;

  if (currentPipeline && currentPipelineKey === key) {
    return currentPipeline;
  }

  await disposeCurrentPipeline();

  const loadedBytesByFile = new Map<string, number>();
  const totalBytesByFile = new Map<string, number>();
  let sawRealDownload = false;

  const sumValues = (map: Map<string, number>): number =>
    Array.from(map.values()).reduce((total, value) => total + value, 0);

  const loadWithDevice = (targetDevice: InferenceDevice) =>
    pipeline('automatic-speech-recognition', modelId, {
      device: targetDevice,
      dtype: (targetDevice === device ? dtype : 'q8') as DataType | Record<string, DataType>,
      progress_callback: (info: { status: string; file?: string; loaded?: number; total?: number }) => {
        if (cancelledJobIds.has(jobId)) {
          return;
        }

        if (info.status === 'initiate') {
          post({ type: 'PROGRESS', jobId, phase: 'preparing-model', percent: null });
          return;
        }

        if (info.status === 'progress' && info.file) {
          sawRealDownload = true;
          loadedBytesByFile.set(info.file, info.loaded ?? 0);
          totalBytesByFile.set(info.file, info.total ?? 0);

          const loaded = sumValues(loadedBytesByFile);
          const total = sumValues(totalBytesByFile);

          post({
            type: 'PROGRESS',
            jobId,
            phase: 'downloading-model',
            percent: total > 0 ? Math.min(100, Math.round((loaded / total) * 100)) : null,
          });
        }
      },
    });

  try {
    currentPipeline = await loadWithDevice(device);
  } catch (error) {
    if (device !== 'webgpu') {
      throw error;
    }

    // WebGPU looked available on the main thread but failed to initialize
    // here; gracefully retry on WASM instead of breaking the tool.
    currentPipeline = await loadWithDevice('wasm');
  }

  currentPipelineKey = key;
  throwIfCancelled(jobId);
  post({ type: 'MODEL_READY', jobId, fromCache: !sawRealDownload });

  return currentPipeline;
};

const toTranscriptSegments = (
  output: AutomaticSpeechRecognitionOutput,
  durationInSeconds: number,
): TranscriptSegment[] => {
  const chunks = output.chunks ?? [];

  return chunks
    .map((chunk) => {
      const [start, end] = chunk.timestamp;
      return {
        start: start ?? 0,
        end: end ?? durationInSeconds,
        text: chunk.text.trim(),
      };
    })
    .filter((segment) => segment.text.length > 0);
};

type TranscribeMessage = Extract<WorkerRequestMessage, { type: 'TRANSCRIBE' }>;

const handleTranscribe = async (message: TranscribeMessage): Promise<void> => {
  const { jobId, quality, device, audio, durationInSeconds, fileName, language, task } = message;

  if (cancelledJobIds.has(jobId)) {
    cancelledJobIds.delete(jobId);
    post({ type: 'CANCELLED', jobId });
    return;
  }

  const stoppingCriteria = new InterruptableStoppingCriteria();
  activeStoppingCriteria = stoppingCriteria;
  const stoppingCriteriaList = new StoppingCriteriaList();
  stoppingCriteriaList.push(stoppingCriteria);

  try {
    const transcriber = await ensurePipeline(jobId, quality, device);

    // The generated pipeline types don't narrow `config` to Whisper's own
    // shape; these fields exist at runtime for every Whisper checkpoint.
    const featureExtractorConfig = transcriber.processor.feature_extractor?.config as
      | { chunk_length?: number }
      | undefined;
    const whisperModelConfig = transcriber.model.config as { max_source_positions?: number };
    const timePrecision =
      featureExtractorConfig?.chunk_length && whisperModelConfig.max_source_positions
        ? featureExtractorConfig.chunk_length / whisperModelConfig.max_source_positions
        : 0.02;

    let chunkCount = 0;
    let processedSeconds = 0;

    const reportTranscribeProgress = () => {
      post({
        type: 'PROGRESS',
        jobId,
        phase: 'transcribing',
        percent:
          durationInSeconds > 0
            ? Math.min(99, Math.round((processedSeconds / durationInSeconds) * 100))
            : null,
        processedSeconds,
        totalSeconds: durationInSeconds,
      });
    };

    const streamer = new WhisperTextStreamer(transcriber.tokenizer as unknown as WhisperTokenizer, {
      time_precision: timePrecision,
      callback_function: () => {
        if (!cancelledJobIds.has(jobId)) {
          reportTranscribeProgress();
        }
      },
      on_chunk_end: (x: number) => {
        const offset = (WHISPER_CHUNK_LENGTH_S - WHISPER_STRIDE_LENGTH_S) * chunkCount;
        processedSeconds = Math.min(durationInSeconds, offset + x);
      },
      on_finalize: () => {
        chunkCount += 1;
      },
    });

    const languageOption = language === 'auto' ? undefined : WHISPER_LANGUAGE_NAME[language];

    // Declared as a variable (not an inline literal) so the extra
    // `streamer`/`stopping_criteria` generate()-only fields - which the
    // pipeline forwards through at runtime but the ASR pipeline's own
    // options type doesn't declare - don't trigger an excess-property error.
    const transcribeOptions: TranscribeCallOptions = {
      top_k: 0,
      do_sample: false,
      chunk_length_s: WHISPER_CHUNK_LENGTH_S,
      stride_length_s: WHISPER_STRIDE_LENGTH_S,
      language: languageOption,
      task,
      return_timestamps: true,
      force_full_sequences: false,
      streamer,
      stopping_criteria: stoppingCriteriaList,
    };

    const rawOutput = await transcriber(audio, transcribeOptions);

    if (cancelledJobIds.has(jobId) || stoppingCriteria.interrupted) {
      cancelledJobIds.delete(jobId);
      post({ type: 'CANCELLED', jobId });
      return;
    }

    const output = (Array.isArray(rawOutput) ? rawOutput[0] : rawOutput) as
      | AutomaticSpeechRecognitionOutput
      | undefined;
    const segments = output ? toTranscriptSegments(output, durationInSeconds) : [];
    const text = output ? output.text.trim() : '';

    const result: TranscriptResult = {
      fileName,
      duration: durationInSeconds,
      language: language === 'auto' ? undefined : language,
      model: QUALITY_MODEL_ID[quality],
      text,
      segments,
    };

    post({ type: 'RESULT', jobId, result });
  } catch (error) {
    if (cancelledJobIds.has(jobId)) {
      cancelledJobIds.delete(jobId);
      post({ type: 'CANCELLED', jobId });
      return;
    }

    throw error;
  } finally {
    activeStoppingCriteria = null;
  }
};

ctx.addEventListener('message', async (event: MessageEvent<WorkerRequestMessage>) => {
  const message = event.data;

  try {
    switch (message.type) {
      case 'INIT': {
        post({ type: 'READY' });
        break;
      }

      case 'LOAD_MODEL': {
        await ensurePipeline(message.jobId, message.quality, message.device);
        break;
      }

      case 'TRANSCRIBE': {
        await handleTranscribe(message);
        break;
      }

      case 'CANCEL': {
        cancelledJobIds.add(message.jobId);
        activeStoppingCriteria?.interrupt();
        break;
      }

      case 'DISPOSE': {
        await disposeCurrentPipeline();
        post({ type: 'DISPOSED' });
        break;
      }

      default:
        break;
    }
  } catch (error) {
    const jobId = 'jobId' in message ? message.jobId : null;

    if (error instanceof TranscriptionCancelledError) {
      if (jobId) {
        cancelledJobIds.delete(jobId);
        post({ type: 'CANCELLED', jobId });
      }
      return;
    }

    const fallbackType: TranscriptionErrorType =
      message.type === 'LOAD_MODEL' ? 'model_load_failed' : 'worker_error';

    post({
      type: 'ERROR',
      jobId,
      errorType: classifyError(error, fallbackType),
      message: toUserMessage(error),
    });
  }
});
