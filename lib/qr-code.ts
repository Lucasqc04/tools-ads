export type QrImageFormat = 'png' | 'jpeg' | 'webp' | 'svg';

const formatMimeMap: Record<QrImageFormat, string> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  svg: 'image/svg+xml',
};

export const getMimeForQrFormat = (format: QrImageFormat): string =>
  formatMimeMap[format];

export const normalizeRawDataToBlob = (
  raw: Blob | Buffer | ArrayBuffer | Uint8Array,
  mimeType: string,
): Blob => {
  if (raw instanceof Blob) {
    return raw;
  }

  return new Blob([raw], { type: mimeType });
};

export const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('Não foi possível converter o blob para data URL.'));
    };

    reader.onerror = () => {
      reject(new Error('Falha ao ler blob para data URL.'));
    };

    reader.readAsDataURL(blob);
  });

export const downloadBlob = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

export const readImageFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('Falha ao ler arquivo de imagem.'));
    };

    reader.onerror = () => reject(new Error('Falha ao processar o arquivo selecionado.'));

    reader.readAsDataURL(file);
  });

export const copyImageBlobToClipboard = async (blob: Blob): Promise<void> => {
  if (!('clipboard' in navigator) || !navigator.clipboard.write) {
    throw new Error('Seu navegador não suporta cópia de imagem para a área de transferência.');
  }

  if (typeof ClipboardItem === 'undefined') {
    throw new Error('ClipboardItem não está disponível neste navegador.');
  }

  await navigator.clipboard.write([
    new ClipboardItem({
      [blob.type]: blob,
    }),
  ]);
};

export const buildQrFileBaseName = (text: string): string => {
  const trimmed = text.trim();

  if (!trimmed) {
    return 'qr-code';
  }

  const candidate = trimmed
    .toLowerCase()
    .slice(0, 50)
    .replace(/https?:\/\//g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return candidate || 'qr-code';
};
