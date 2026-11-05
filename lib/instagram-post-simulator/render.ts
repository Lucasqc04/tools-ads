import { applyFiltersToPixels } from '@/lib/instagram-post-simulator/filters';
import { toPixelRect, type FrameBox } from '@/lib/instagram-post-simulator/layout';
import type { SlideFilters } from '@/types/instagram-post-simulator';

/** Exportação feita no navegador com Canvas 2D, um canvas por slide (sem canvas gigante). */

export type ExportFormat = 'jpeg' | 'png';

export type ExportJob = {
  name: string;
  box: FrameBox;
  filters: SlideFilters;
};

export type ExportedFile = {
  name: string;
  blob: Blob;
  width: number;
  height: number;
};

const MIME: Record<ExportFormat, string> = {
  jpeg: 'image/jpeg',
  png: 'image/png',
};

export const formatExtension = (format: ExportFormat): string => (format === 'jpeg' ? 'jpg' : 'png');

const canvasToBlob = (canvas: HTMLCanvasElement, format: ExportFormat): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('export_failed'))),
      MIME[format],
      format === 'jpeg' ? 0.92 : undefined,
    );
  });

/**
 * Renderiza uma ou mais fatias a partir do mesmo arquivo. Decodifica a imagem uma única vez,
 * usa o mesmo layout da prévia e aplica os filtros pixel a pixel.
 */
export const exportImageJobs = async (
  file: File,
  jobs: ExportJob[],
  width: number,
  height: number,
  format: ExportFormat,
): Promise<ExportedFile[]> => {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  try {
    const results: ExportedFile[] = [];

    for (const job of jobs) {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('canvas_unavailable');

      // Letterbox preto para o modo ajustar e fundo sólido para o JPEG, que não tem transparência.
      context.fillStyle = '#000000';
      context.fillRect(0, 0, width, height);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';

      const rect = toPixelRect(job.box, width, height);
      context.drawImage(bitmap, rect.x, rect.y, rect.width, rect.height);

      const pixels = context.getImageData(0, 0, width, height);
      applyFiltersToPixels(pixels.data, job.filters);
      context.putImageData(pixels, 0, 0);

      const blob = await canvasToBlob(canvas, format);
      results.push({ name: `${job.name}.${formatExtension(format)}`, blob, width, height });
      canvas.width = 0;
      canvas.height = 0;
    }

    return results;
  } finally {
    bitmap.close();
  }
};

/** Gera um ZIP local com zip.js, carregado sob demanda para não pesar a página inicial. */
export const createZipBlob = async (entries: Array<{ name: string; blob: Blob }>): Promise<Blob> => {
  const zip = await import('@zip.js/zip.js');
  const writer = new zip.ZipWriter(new zip.BlobWriter('application/zip'), { bufferedWrite: true });
  for (const entry of entries) {
    await writer.add(entry.name, new zip.BlobReader(entry.blob));
  }
  return writer.close();
};

export const pad2 = (value: number): string => String(value).padStart(2, '0');
