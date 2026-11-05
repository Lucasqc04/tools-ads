import type { SimulatorCopy } from '@/data/i18n/instagram-post-simulator';

/** Ações que dependem de arquivos, URLs de objeto e analytics. Ficam no componente raiz. */
export type EditorActions = {
  addFiles: (files: File[]) => void;
  removeSlide: (id: string) => void;
  pickPanoramaImage: (file: File) => void;
  captureReelCover: (time: number) => void;
  importReelCover: (file: File) => void;
  clearReelCover: () => void;
  loadExample: () => void;
  clearAll: () => void;
};

export type EditorCopy = SimulatorCopy;
