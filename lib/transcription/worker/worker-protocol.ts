import type {
  InferenceDevice,
  TranscriptionErrorType,
  TranscriptionLanguageOption,
  TranscriptionQuality,
  TranscriptionTask,
  TranscriptResult,
} from '../transcription-types';

export type WorkerRequestMessage =
  | { type: 'INIT' }
  | { type: 'LOAD_MODEL'; jobId: string; quality: TranscriptionQuality; device: InferenceDevice }
  | {
      type: 'TRANSCRIBE';
      jobId: string;
      quality: TranscriptionQuality;
      device: InferenceDevice;
      audio: Float32Array;
      durationInSeconds: number;
      fileName: string;
      language: TranscriptionLanguageOption;
      task: TranscriptionTask;
    }
  | { type: 'CANCEL'; jobId: string }
  | { type: 'DISPOSE' };

export type TranscriptionProgressPhase = 'preparing-model' | 'downloading-model' | 'transcribing';

export type WorkerResponseMessage =
  | { type: 'READY' }
  | {
      type: 'PROGRESS';
      jobId: string;
      phase: TranscriptionProgressPhase;
      /** 0-100, or null when we don't have a real number to report (never simulated). */
      percent: number | null;
      processedSeconds?: number;
      totalSeconds?: number;
    }
  | { type: 'MODEL_READY'; jobId: string; fromCache: boolean }
  | { type: 'RESULT'; jobId: string; result: TranscriptResult }
  | { type: 'CANCELLED'; jobId: string }
  | { type: 'ERROR'; jobId: string | null; errorType: TranscriptionErrorType; message: string }
  | { type: 'DISPOSED' };
