export type LargeVideoCompressionErrorCode =
  | 'webcodecs_unsupported'
  | 'storage_unavailable'
  | 'unsupported_codec'
  | 'storage_quota'
  | 'processing_failed';

export type VideoCompressionWorkerRequest = {
  type: 'compress';
  file: File;
  compressionLevel: number;
  storageFileName: string;
};

export type VideoCompressionWorkerResponse =
  | { type: 'log'; message: string }
  | { type: 'progress'; progress: number }
  | { type: 'completed'; storageFileName: string }
  | { type: 'failed'; code: LargeVideoCompressionErrorCode };
