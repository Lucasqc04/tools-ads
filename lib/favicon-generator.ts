export type FaviconTheme = {
  name: string;
  shortName: string;
  backgroundColor: string;
  themeColor: string;
  startUrl: string;
  display: 'standalone' | 'minimal-ui' | 'browser' | 'fullscreen';
};

export type FaviconAsset = {
  fileName: string;
  blob: Blob;
  width?: number;
  height?: number;
  purpose?: 'any' | 'maskable' | 'monochrome';
};

export type FaviconPackage = {
  assets: FaviconAsset[];
  manifest: string;
  html: string;
};

type IconCanvasOptions = {
  size: number;
  paddingPercent: number;
  backgroundColor: string;
  rounded: boolean;
  invertImage?: boolean;
};

const canvasToBlob = (
  canvas: HTMLCanvasElement,
  mimeType = 'image/png',
  quality?: number,
): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Falha ao gerar imagem.'));
          return;
        }

        resolve(blob);
      },
      mimeType,
      quality,
    );
  });

export const loadImageBitmapFromFile = async (file: File): Promise<ImageBitmap> => {
  try {
    return await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    const url = URL.createObjectURL(file);
    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Falha ao carregar imagem.'));
        img.src = url;
      });
      return await createImageBitmap(image);
    } finally {
      URL.revokeObjectURL(url);
    }
  }
};

const drawRoundedRect = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
};

const renderIconCanvas = (
  image: ImageBitmap,
  { size, paddingPercent, backgroundColor, rounded, invertImage = false }: IconCanvasOptions,
): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Canvas indisponivel.');
  }

  canvas.width = size;
  canvas.height = size;

  if (backgroundColor !== 'transparent') {
    context.fillStyle = backgroundColor;
    if (rounded) {
      drawRoundedRect(context, 0, 0, size, size, size * 0.18);
      context.fill();
    } else {
      context.fillRect(0, 0, size, size);
    }
  }

  const padding = Math.round(size * (paddingPercent / 100));
  const available = size - padding * 2;
  const scale = Math.min(available / image.width, available / image.height);
  const drawWidth = Math.round(image.width * scale);
  const drawHeight = Math.round(image.height * scale);
  const drawX = Math.round((size - drawWidth) / 2);
  const drawY = Math.round((size - drawHeight) / 2);

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.filter = invertImage ? 'invert(1)' : 'none';
  context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  context.filter = 'none';

  return canvas;
};

const blobToBytes = async (blob: Blob): Promise<Uint8Array> => new Uint8Array(await blob.arrayBuffer());

const encodeIco = async (pngBlobs: Array<{ size: number; blob: Blob }>): Promise<Blob> => {
  const pngs = await Promise.all(
    pngBlobs.map(async (item) => ({
      size: item.size,
      bytes: await blobToBytes(item.blob),
    })),
  );

  const headerSize = 6;
  const entrySize = 16;
  const imageOffsetStart = headerSize + entrySize * pngs.length;
  const totalSize = imageOffsetStart + pngs.reduce((sum, item) => sum + item.bytes.length, 0);
  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, pngs.length, true);

  let imageOffset = imageOffsetStart;

  pngs.forEach((item, index) => {
    const entryOffset = headerSize + entrySize * index;
    view.setUint8(entryOffset, item.size >= 256 ? 0 : item.size);
    view.setUint8(entryOffset + 1, item.size >= 256 ? 0 : item.size);
    view.setUint8(entryOffset + 2, 0);
    view.setUint8(entryOffset + 3, 0);
    view.setUint16(entryOffset + 4, 1, true);
    view.setUint16(entryOffset + 6, 32, true);
    view.setUint32(entryOffset + 8, item.bytes.length, true);
    view.setUint32(entryOffset + 12, imageOffset, true);
    bytes.set(item.bytes, imageOffset);
    imageOffset += item.bytes.length;
  });

  return new Blob([buffer], { type: 'image/x-icon' });
};

const manifestIcon = (asset: FaviconAsset) => ({
  src: `/${asset.fileName}`,
  sizes: `${asset.width}x${asset.height}`,
  type: asset.blob.type || 'image/png',
  ...(asset.purpose ? { purpose: asset.purpose } : {}),
});

const buildManifest = (theme: FaviconTheme, assets: FaviconAsset[]): string => {
  const icons = assets
    .filter((asset) => asset.fileName.endsWith('.png') && asset.width && asset.height)
    .filter((asset) => [192, 512].includes(asset.width ?? 0) || asset.purpose === 'maskable')
    .map(manifestIcon);

  return JSON.stringify(
    {
      name: theme.name,
      short_name: theme.shortName,
      icons,
      theme_color: theme.themeColor,
      background_color: theme.backgroundColor,
      display: theme.display,
      start_url: theme.startUrl,
    },
    null,
    2,
  );
};

const buildHtml = (theme: FaviconTheme): string =>
  [
    '<link rel="icon" href="/favicon.ico" sizes="any">',
    '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">',
    '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">',
    '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">',
    '<link rel="manifest" href="/site.webmanifest">',
    `<meta name="theme-color" content="${theme.themeColor}">`,
  ].join('\n');

export const generateFaviconPackage = async (
  file: File,
  theme: FaviconTheme,
  options: {
    paddingPercent: number;
    roundedBackground: boolean;
    standardBackground?: 'transparent' | 'theme' | 'background';
    invertImage?: boolean;
  },
): Promise<FaviconPackage> => {
  const image = await loadImageBitmapFromFile(file);
  const standardSizes = [16, 32, 48, 96, 180, 192, 256, 512];
  const assets: FaviconAsset[] = [];
  const standardBackground =
    options.standardBackground === 'theme'
      ? theme.themeColor
      : options.standardBackground === 'background'
        ? theme.backgroundColor
        : 'transparent';

  for (const size of standardSizes) {
    const canvas = renderIconCanvas(image, {
      size,
      paddingPercent: options.paddingPercent,
      backgroundColor: standardBackground,
      rounded: standardBackground !== 'transparent' && options.roundedBackground,
      invertImage: options.invertImage,
    });
    const blob = await canvasToBlob(canvas);
    const fileName =
      size === 180
        ? 'apple-touch-icon.png'
        : size === 192 || size === 512
          ? `web-app-manifest-${size}x${size}.png`
          : `favicon-${size}x${size}.png`;
    assets.push({ fileName, blob, width: size, height: size, purpose: 'any' });
  }

  for (const size of [192, 512]) {
    const canvas = renderIconCanvas(image, {
      size,
      paddingPercent: Math.max(options.paddingPercent, 12),
      backgroundColor: theme.backgroundColor,
      rounded: options.roundedBackground,
      invertImage: options.invertImage,
    });
    const blob = await canvasToBlob(canvas);
    assets.push({
      fileName: `maskable-icon-${size}x${size}.png`,
      blob,
      width: size,
      height: size,
      purpose: 'maskable',
    });
  }

  const icoInputs = await Promise.all(
    [16, 32, 48].map(async (size) => {
      const asset = assets.find((item) => item.fileName === `favicon-${size}x${size}.png`);
      if (!asset) throw new Error('Asset de ICO nao encontrado.');
      return { size, blob: asset.blob };
    }),
  );
  assets.push({ fileName: 'favicon.ico', blob: await encodeIco(icoInputs) });

  const manifest = buildManifest(theme, assets);
  const html = buildHtml(theme);

  assets.push({ fileName: 'site.webmanifest', blob: new Blob([manifest], { type: 'application/manifest+json' }) });
  assets.push({ fileName: 'favicon-html-snippet.txt', blob: new Blob([html], { type: 'text/plain' }) });

  return { assets, manifest, html };
};
