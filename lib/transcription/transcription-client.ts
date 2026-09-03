import type {
  InferenceDevice,
  TranscriptionLanguageOption,
  TranscriptionQuality,
  TranscriptionTask,
  TranscriptResult,
} from './transcription-types';
import { TranscriptionError } from './transcription-types';
import type {
  TranscriptionProgressPhase,
  WorkerRequestMessage,
  WorkerResponseMessage,
} from './worker/worker-protocol';

export type TranscriptionClientCallbacks = {
  onProgress?: (
    phase: TranscriptionProgressPhase,
    percent: number | null,
    processedSeconds?: number,
    totalSeconds?: number,
  ) => void;
  onModelReady?: (fromCache: boolean) => void;
  onResult?: (result: TranscriptResult) => void;
  onCancelled?: () => void;
  onError?: (error: TranscriptionError) => void;
};

export type StartTranscriptionOptions = {
  audio: Float32Array;
  durationInSeconds: number;
  fileName: string;
  quality: TranscriptionQuality;
  device: InferenceDevice;
  language: TranscriptionLanguageOption;
  task: TranscriptionTask;
};

/**
 * Owns a single dedicated Worker for the lifetime of the tool. Every job
 * carries a `jobId`; responses for a stale job (already cancelled/replaced)
 * are dropped so a slow, cancelled job can never overwrite a newer result.
 */
export class TranscriptionClient {
  private worker: Worker | null = null;
  private activeJobId: string | null = null;
  private callbacks: TranscriptionClientCallbacks = {};

  private ensureWorker(): Worker {
    if (this.worker) {
      return this.worker;
    }

    const worker = new Worker(new URL('./worker/transcription.worker.ts', import.meta.url), {
      type: 'module',
    });

    worker.addEventListener('message', (event: MessageEvent<WorkerResponseMessage>) => {
      this.handleMessage(event.data);
    });

    worker.addEventListener('error', () => {
      if (this.activeJobId) {
        this.activeJobId = null;
        this.callbacks.onError?.(
          new TranscriptionError('worker_error', 'O processo de transcricao falhou inesperadamente.'),
        );
      }
    });

    worker.postMessage({ type: 'INIT' } satisfies WorkerRequestMessage);
    this.worker = worker;
    return worker;
  }

  private handleMessage(message: WorkerResponseMessage): void {
    if (message.type === 'READY' || message.type === 'DISPOSED') {
      return;
    }

    if (message.jobId !== this.activeJobId) {
      // Stale response from a job we already cancelled/replaced: ignore it.
      return;
    }

    switch (message.type) {
      case 'PROGRESS':
        this.callbacks.onProgress?.(
          message.phase,
          message.percent,
          message.processedSeconds,
          message.totalSeconds,
        );
        break;

      case 'MODEL_READY':
        this.callbacks.onModelReady?.(message.fromCache);
        break;

      case 'RESULT':
        this.activeJobId = null;
        this.callbacks.onResult?.(message.result);
        break;

      case 'CANCELLED':
        this.activeJobId = null;
        this.callbacks.onCancelled?.();
        break;

      case 'ERROR':
        this.activeJobId = null;
        this.callbacks.onError?.(new TranscriptionError(message.errorType, message.message));
        break;

      default:
        break;
    }
  }

  /** Registers callbacks and marks `jobId` as the only one whose responses will be delivered. */
  beginJob(jobId: string, callbacks: TranscriptionClientCallbacks): void {
    this.callbacks = callbacks;
    this.activeJobId = jobId;
    this.ensureWorker();
  }

  loadModel(jobId: string, quality: TranscriptionQuality, device: InferenceDevice): void {
    const worker = this.ensureWorker();
    worker.postMessage({ type: 'LOAD_MODEL', jobId, quality, device } satisfies WorkerRequestMessage);
  }

  transcribe(jobId: string, options: StartTranscriptionOptions): void {
    const worker = this.ensureWorker();

    const message: WorkerRequestMessage = {
      type: 'TRANSCRIBE',
      jobId,
      quality: options.quality,
      device: options.device,
      audio: options.audio,
      durationInSeconds: options.durationInSeconds,
      fileName: options.fileName,
      language: options.language,
      task: options.task,
    };

    worker.postMessage(message, [options.audio.buffer]);
  }

  cancel(jobId: string): void {
    this.worker?.postMessage({ type: 'CANCEL', jobId } satisfies WorkerRequestMessage);
  }

  dispose(): void {
    this.worker?.postMessage({ type: 'DISPOSE' } satisfies WorkerRequestMessage);
    this.worker?.terminate();
    this.worker = null;
    this.activeJobId = null;
    this.callbacks = {};
  }
}
