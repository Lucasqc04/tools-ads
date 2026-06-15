'use client';
/* eslint-disable @next/next/no-img-element */

import {
  Circle,
  Crop,
  Download,
  Eye,
  RefreshCw,
  SlidersHorizontal,
  Square,
  Trash2,
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { FileUploadDropzone } from '@/components/shared/file-upload-dropzone';
import { ImageViewer } from '@/components/shared/image-viewer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  applyCropToImageData,
  buildChromaOptionConfigs,
  buildRemovedBackgroundFileName,
  DEFAULT_CHROMA_SOFTNESS,
  DEFAULT_CHROMA_THRESHOLD,
  DEFAULT_CROP_SETTINGS,
  getChromaColor,
  imageDataToPngBlob,
  loadImageDataFromFile,
  PREVIEW_MAX_DIMENSION,
  removeChromaFromImageData,
  resolveCropRect,
  rgbToHex,
  type ChromaOptionConfig,
  type ChromaOptionId,
  type ChromaPresetId,
  type ChromaRemovalStats,
  type ChromaRgb,
  type CropSettings,
  type CropShape,
  type LoadedImageData,
} from '@/lib/chroma-background-remover';
import { formatBytes } from '@/lib/file-size';
import { type AppLocale } from '@/lib/i18n/config';
import { downloadBlob } from '@/lib/image-conversion';
import { cn } from '@/lib/cn';

type ChromaBackgroundRemoverToolProps = Readonly<{
  locale?: AppLocale;
}>;

type SourceImageState = {
  file: File;
  sourceUrl: string;
  previewData: LoadedImageData;
  originalWidth: number;
  originalHeight: number;
};

type OptionPreview = ChromaOptionConfig & {
  url: string;
  blob: Blob;
  stats: ChromaRemovalStats;
  chromaRgb: ChromaRgb;
  chromaHex: string;
  despill: boolean;
  cropSettings: CropSettings;
};

type ViewerState = {
  src: string;
  alt: string;
  onDownload?: () => void | Promise<void>;
};

type CropHandle = 'move' | 'nw' | 'ne' | 'sw' | 'se';

type CropRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type CropPointerState = {
  handle: CropHandle;
  startClientX: number;
  startClientY: number;
  startRect: CropRect;
  frameWidth: number;
  frameHeight: number;
  imageWidth: number;
  imageHeight: number;
  pointerId: number;
};

type ChromaToolUi = {
  title: string;
  intro: string;
  uploadLabel: string;
  uploadHint: string;
  acceptedDescription: string;
  colorMode: string;
  manualColor: string;
  threshold: string;
  thresholdHint: string;
  softness: string;
  softnessHint: string;
  despill: string;
  despillHint: string;
  generate: string;
  generating: string;
  download: string;
  downloading: string;
  clear: string;
  viewPreview: string;
  sourcePreview: string;
  resultPreview: string;
  noFile: string;
  noPreview: string;
  cropTitle: string;
  cropIntro: string;
  cropMode: string;
  cropNone: string;
  cropFree: string;
  cropSquare: string;
  cropCircle: string;
  cropSize: string;
  cropWidth: string;
  cropHeight: string;
  cropHorizontal: string;
  cropVertical: string;
  cropReset: string;
  cropSourceTitle: string;
  cropOutputTitle: string;
  cropPending: string;
  cropDragHint: string;
  settingsPending: string;
  selectedFile: string;
  originalSize: string;
  previewSize: string;
  cropSizeInfo: string;
  currentChroma: string;
  transparentPixels: (value: number) => string;
  outputNote: string;
  localNote: string;
  loadedOk: string;
  previewOk: string;
  downloadOk: (fileName: string) => string;
  genericError: string;
  optionLabels: Record<ChromaOptionId, string>;
  optionDescriptions: Record<ChromaOptionId, string>;
  presetLabels: Record<ChromaPresetId, string>;
};

const uiByLocale: Record<AppLocale, ChromaToolUi> = {
  'pt-br': {
    title: 'Removedor de fundo por chroma key',
    intro:
      'Remova fundo magenta, verde, branco ou uma cor manual e baixe um PNG transparente gerado no tamanho original.',
    uploadLabel: 'Imagem com fundo chroma',
    uploadHint:
      'Use PNG, JPG, JPEG, WEBP ou BMP. O processamento fica local no navegador.',
    acceptedDescription: 'PNG, JPG, JPEG, WEBP, BMP',
    colorMode: 'Cor do fundo',
    manualColor: 'Cor manual',
    threshold: 'Threshold',
    thresholdHint:
      'Aumente para remover mais fundo parecido com a cor escolhida.',
    softness: 'Softness',
    softnessHint:
      'Aumente para suavizar a borda; diminua para um corte mais seco.',
    despill: 'Despill / suavizar borda',
    despillHint:
      'Reduz vazamento da cor chroma nas bordas semi-transparentes.',
    generate: 'Gerar 3 opcoes',
    generating: 'Gerando...',
    download: 'Baixar PNG transparente',
    downloading: 'Processando original...',
    clear: 'Limpar',
    viewPreview: 'Ver preview',
    sourcePreview: 'Original',
    resultPreview: 'Resultado escolhido',
    noFile: 'Selecione uma imagem para iniciar.',
    noPreview:
      'Ajuste a cor e gere as opcoes para comparar leve, equilibrada e forte.',
    cropTitle: 'Recorte antes de remover o fundo',
    cropIntro:
      'Escolha livre, quadrado ou redondo, ajuste pelos cantos e mova o enquadramento antes do chroma key.',
    cropMode: 'Formato do recorte',
    cropNone: 'Sem recorte',
    cropFree: 'Livre',
    cropSquare: 'Quadrado',
    cropCircle: 'Redondo',
    cropSize: 'Tamanho',
    cropWidth: 'Largura',
    cropHeight: 'Altura',
    cropHorizontal: 'Horizontal',
    cropVertical: 'Vertical',
    cropReset: 'Centralizar',
    cropSourceTitle: 'Enquadramento',
    cropOutputTitle: 'Recorte atual',
    cropPending: 'Recorte ajustado. Gere as 3 opcoes para aplicar no chroma.',
    cropDragHint: 'Arraste a area para mover. Use os cantos para redimensionar.',
    settingsPending: 'Ajuste alterado. Gere as 3 opcoes antes de baixar.',
    selectedFile: 'Arquivo selecionado',
    originalSize: 'Tamanho original',
    previewSize: 'Preview',
    cropSizeInfo: 'Recorte',
    currentChroma: 'Chroma usado',
    transparentPixels: (value) => `${value}% transparente no preview`,
    outputNote:
      'O preview e reduzido para ficar rapido. O download refaz o recorte e o chroma no arquivo original, salvando PNG sem recompressao JPEG.',
    localNote:
      'Nenhuma imagem e enviada para servidor por padrao. Todo o recorte acontece no seu navegador.',
    loadedOk: 'Imagem carregada. As 3 opcoes iniciais foram geradas.',
    previewOk: 'Previews atualizados. Escolha a opcao que preserva melhor os detalhes.',
    downloadOk: (fileName) => `${fileName} gerado para download.`,
    genericError: 'Nao foi possivel processar esta imagem.',
    optionLabels: {
      light: 'Leve',
      balanced: 'Equilibrada',
      strong: 'Forte',
    },
    optionDescriptions: {
      light: 'Preserva cabelo, textura e detalhes finos.',
      balanced: 'Melhor ponto de partida para a maioria das imagens.',
      strong: 'Remove mais halo e sobra de fundo nas bordas.',
    },
    presetLabels: {
      magenta: 'Magenta #FF00FF',
      green: 'Verde #00FF00',
      white: 'Branco #FFFFFF',
      auto: 'Auto pelos cantos',
      manual: 'Cor manual',
    },
  },
  en: {
    title: 'Chroma key background remover',
    intro:
      'Remove magenta, green, white, or custom-color backgrounds and download a transparent PNG at original size.',
    uploadLabel: 'Image with chroma background',
    uploadHint:
      'Use PNG, JPG, JPEG, WEBP, or BMP. Processing stays local in the browser.',
    acceptedDescription: 'PNG, JPG, JPEG, WEBP, BMP',
    colorMode: 'Background color',
    manualColor: 'Custom color',
    threshold: 'Threshold',
    thresholdHint:
      'Increase it to remove more background pixels similar to the selected color.',
    softness: 'Softness',
    softnessHint:
      'Increase it for smoother edges; reduce it for a sharper cut.',
    despill: 'Despill / smooth edge',
    despillHint:
      'Reduces chroma color spill on semi-transparent edges.',
    generate: 'Generate 3 options',
    generating: 'Generating...',
    download: 'Download transparent PNG',
    downloading: 'Processing original...',
    clear: 'Clear',
    viewPreview: 'View preview',
    sourcePreview: 'Original',
    resultPreview: 'Selected result',
    noFile: 'Select an image to start.',
    noPreview:
      'Adjust the color and generate options to compare light, balanced, and strong.',
    cropTitle: 'Crop before removing the background',
    cropIntro:
      'Choose free, square, or round crop, resize it from the corners, and move the frame before chroma key.',
    cropMode: 'Crop shape',
    cropNone: 'No crop',
    cropFree: 'Free',
    cropSquare: 'Square',
    cropCircle: 'Round',
    cropSize: 'Size',
    cropWidth: 'Width',
    cropHeight: 'Height',
    cropHorizontal: 'Horizontal',
    cropVertical: 'Vertical',
    cropReset: 'Center',
    cropSourceTitle: 'Framing',
    cropOutputTitle: 'Current crop',
    cropPending: 'Crop adjusted. Generate the 3 options to apply it to chroma.',
    cropDragHint: 'Drag the area to move it. Use the corners to resize.',
    settingsPending: 'Settings changed. Generate the 3 options before downloading.',
    selectedFile: 'Selected file',
    originalSize: 'Original size',
    previewSize: 'Preview',
    cropSizeInfo: 'Crop',
    currentChroma: 'Chroma used',
    transparentPixels: (value) => `${value}% transparent in preview`,
    outputNote:
      'Preview is scaled down for speed. Download runs crop and chroma again on the original file and saves PNG without JPEG recompression.',
    localNote:
      'No image is uploaded to a server by default. The background cut runs in your browser.',
    loadedOk: 'Image loaded. The first 3 options were generated.',
    previewOk: 'Previews updated. Choose the option that preserves details best.',
    downloadOk: (fileName) => `${fileName} generated for download.`,
    genericError: 'Could not process this image.',
    optionLabels: {
      light: 'Light',
      balanced: 'Balanced',
      strong: 'Strong',
    },
    optionDescriptions: {
      light: 'Preserves hair, texture, and fine details.',
      balanced: 'Best starting point for most images.',
      strong: 'Removes more edge halo and leftover background.',
    },
    presetLabels: {
      magenta: 'Magenta #FF00FF',
      green: 'Green #00FF00',
      white: 'White #FFFFFF',
      auto: 'Auto from corners',
      manual: 'Custom color',
    },
  },
  es: {
    title: 'Removedor de fondo por chroma key',
    intro:
      'Quita fondos magenta, verde, blanco o de color manual y descarga un PNG transparente en tamano original.',
    uploadLabel: 'Imagen con fondo chroma',
    uploadHint:
      'Usa PNG, JPG, JPEG, WEBP o BMP. El procesamiento queda local en el navegador.',
    acceptedDescription: 'PNG, JPG, JPEG, WEBP, BMP',
    colorMode: 'Color del fondo',
    manualColor: 'Color manual',
    threshold: 'Threshold',
    thresholdHint:
      'Aumentalo para quitar mas fondo parecido al color elegido.',
    softness: 'Softness',
    softnessHint:
      'Aumentalo para bordes mas suaves; reducelo para un corte mas seco.',
    despill: 'Despill / suavizar borde',
    despillHint:
      'Reduce el derrame del color chroma en bordes semi-transparentes.',
    generate: 'Generar 3 opciones',
    generating: 'Generando...',
    download: 'Descargar PNG transparente',
    downloading: 'Procesando original...',
    clear: 'Limpiar',
    viewPreview: 'Ver preview',
    sourcePreview: 'Original',
    resultPreview: 'Resultado elegido',
    noFile: 'Selecciona una imagen para empezar.',
    noPreview:
      'Ajusta el color y genera opciones para comparar ligera, equilibrada y fuerte.',
    cropTitle: 'Recortar antes de quitar el fondo',
    cropIntro:
      'Elige recorte libre, cuadrado o redondo, ajusta por las esquinas y mueve el encuadre antes del chroma key.',
    cropMode: 'Formato del recorte',
    cropNone: 'Sin recorte',
    cropFree: 'Libre',
    cropSquare: 'Cuadrado',
    cropCircle: 'Redondo',
    cropSize: 'Tamano',
    cropWidth: 'Ancho',
    cropHeight: 'Alto',
    cropHorizontal: 'Horizontal',
    cropVertical: 'Vertical',
    cropReset: 'Centrar',
    cropSourceTitle: 'Encuadre',
    cropOutputTitle: 'Recorte actual',
    cropPending: 'Recorte ajustado. Genera las 3 opciones para aplicarlo al chroma.',
    cropDragHint: 'Arrastra el area para moverla. Usa las esquinas para redimensionar.',
    settingsPending: 'Ajuste modificado. Genera las 3 opciones antes de descargar.',
    selectedFile: 'Archivo seleccionado',
    originalSize: 'Tamano original',
    previewSize: 'Preview',
    cropSizeInfo: 'Recorte',
    currentChroma: 'Chroma usado',
    transparentPixels: (value) => `${value}% transparente en preview`,
    outputNote:
      'El preview se reduce para ir rapido. La descarga repite recorte y chroma sobre el archivo original y guarda PNG sin recompresion JPEG.',
    localNote:
      'Ninguna imagen se sube al servidor por defecto. El recorte ocurre en tu navegador.',
    loadedOk: 'Imagen cargada. Las 3 opciones iniciales fueron generadas.',
    previewOk: 'Previews actualizados. Elige la opcion que conserve mejor los detalles.',
    downloadOk: (fileName) => `${fileName} generado para descarga.`,
    genericError: 'No fue posible procesar esta imagen.',
    optionLabels: {
      light: 'Ligera',
      balanced: 'Equilibrada',
      strong: 'Fuerte',
    },
    optionDescriptions: {
      light: 'Conserva cabello, textura y detalles finos.',
      balanced: 'Mejor punto inicial para la mayoria de imagenes.',
      strong: 'Quita mas halo y restos de fondo en bordes.',
    },
    presetLabels: {
      magenta: 'Magenta #FF00FF',
      green: 'Verde #00FF00',
      white: 'Blanco #FFFFFF',
      auto: 'Auto por esquinas',
      manual: 'Color manual',
    },
  },
};

const acceptedImageTypes =
  'image/png,image/jpeg,image/jpg,image/webp,image/bmp,.png,.jpg,.jpeg,.webp,.bmp';

const checkerboardStyle: CSSProperties = {
  backgroundColor: '#f8fafc',
  backgroundImage:
    'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)',
  backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
  backgroundSize: '16px 16px',
};

const presetManualColorById: Partial<Record<ChromaPresetId, string>> = {
  magenta: '#FF00FF',
  green: '#00FF00',
  white: '#FFFFFF',
};

const cropShapes: CropShape[] = ['none', 'free', 'square', 'circle'];

const cropHandles: Array<Exclude<CropHandle, 'move'>> = ['nw', 'ne', 'sw', 'se'];

const cropHandleClassName: Record<Exclude<CropHandle, 'move'>, string> = {
  nw: '-left-4 -top-4 cursor-nwse-resize',
  ne: '-right-4 -top-4 cursor-nesw-resize',
  sw: '-bottom-4 -left-4 cursor-nesw-resize',
  se: '-bottom-4 -right-4 cursor-nwse-resize',
};

const MIN_CROP_SIZE_PX = 24;

const clampNumber = (value: number, minimum: number, maximum: number): number =>
  Math.min(maximum, Math.max(minimum, value));

const formatDimensions = (width: number, height: number): string =>
  `${width} x ${height}px`;

const getTransparentPercent = (stats: ChromaRemovalStats): number =>
  Math.round(stats.transparentRatio * 100);

const revokePreviewUrls = (items: OptionPreview[]) => {
  items.forEach((item) => URL.revokeObjectURL(item.url));
};

const cloneCropSettings = (cropSettings: CropSettings): CropSettings => ({
  ...cropSettings,
});

const getCropShapeIcon = (shape: CropShape) => {
  if (shape === 'free') {
    return Crop;
  }

  if (shape === 'square') {
    return Square;
  }

  if (shape === 'circle') {
    return Circle;
  }

  return Crop;
};

const getCropLabel = (ui: ChromaToolUi, shape: CropShape): string => {
  if (shape === 'free') {
    return ui.cropFree;
  }

  if (shape === 'square') {
    return ui.cropSquare;
  }

  if (shape === 'circle') {
    return ui.cropCircle;
  }

  return ui.cropNone;
};

const buildCropSettingsFromRect = (
  shape: CropShape,
  rect: CropRect,
  imageWidth: number,
  imageHeight: number,
  previous: CropSettings,
): CropSettings => {
  const widthPercent = clampNumber((rect.width / imageWidth) * 100, 5, 100);
  const heightPercent = clampNumber((rect.height / imageHeight) * 100, 5, 100);
  const sizePercent = clampNumber(
    (Math.min(rect.width, rect.height) / Math.min(imageWidth, imageHeight)) * 100,
    5,
    100,
  );

  return {
    ...previous,
    shape,
    sizePercent: shape === 'free' ? previous.sizePercent : Math.round(sizePercent),
    widthPercent: Math.round(widthPercent),
    heightPercent: Math.round(heightPercent),
    xPercent: Math.round(((rect.left + rect.width / 2) / imageWidth) * 100),
    yPercent: Math.round(((rect.top + rect.height / 2) / imageHeight) * 100),
  };
};

const clampFreeRect = (rect: CropRect, imageWidth: number, imageHeight: number): CropRect => {
  const width = clampNumber(rect.width, MIN_CROP_SIZE_PX, imageWidth);
  const height = clampNumber(rect.height, MIN_CROP_SIZE_PX, imageHeight);
  const left = clampNumber(rect.left, 0, imageWidth - width);
  const top = clampNumber(rect.top, 0, imageHeight - height);

  return {
    left,
    top,
    width,
    height,
  };
};

const buildMovedCropRect = (
  startRect: CropRect,
  deltaX: number,
  deltaY: number,
  imageWidth: number,
  imageHeight: number,
): CropRect =>
  clampFreeRect(
    {
      ...startRect,
      left: startRect.left + deltaX,
      top: startRect.top + deltaY,
    },
    imageWidth,
    imageHeight,
  );

const buildFreeResizedCropRect = (
  handle: Exclude<CropHandle, 'move'>,
  startRect: CropRect,
  deltaX: number,
  deltaY: number,
  imageWidth: number,
  imageHeight: number,
): CropRect => {
  const right = startRect.left + startRect.width;
  const bottom = startRect.top + startRect.height;

  if (handle === 'nw') {
    const left = clampNumber(startRect.left + deltaX, 0, right - MIN_CROP_SIZE_PX);
    const top = clampNumber(startRect.top + deltaY, 0, bottom - MIN_CROP_SIZE_PX);
    return clampFreeRect({ left, top, width: right - left, height: bottom - top }, imageWidth, imageHeight);
  }

  if (handle === 'ne') {
    const nextRight = clampNumber(right + deltaX, startRect.left + MIN_CROP_SIZE_PX, imageWidth);
    const top = clampNumber(startRect.top + deltaY, 0, bottom - MIN_CROP_SIZE_PX);
    return clampFreeRect(
      { left: startRect.left, top, width: nextRight - startRect.left, height: bottom - top },
      imageWidth,
      imageHeight,
    );
  }

  if (handle === 'sw') {
    const left = clampNumber(startRect.left + deltaX, 0, right - MIN_CROP_SIZE_PX);
    const nextBottom = clampNumber(bottom + deltaY, startRect.top + MIN_CROP_SIZE_PX, imageHeight);
    return clampFreeRect(
      { left, top: startRect.top, width: right - left, height: nextBottom - startRect.top },
      imageWidth,
      imageHeight,
    );
  }

  const nextRight = clampNumber(right + deltaX, startRect.left + MIN_CROP_SIZE_PX, imageWidth);
  const nextBottom = clampNumber(bottom + deltaY, startRect.top + MIN_CROP_SIZE_PX, imageHeight);
  return clampFreeRect(
    {
      left: startRect.left,
      top: startRect.top,
      width: nextRight - startRect.left,
      height: nextBottom - startRect.top,
    },
    imageWidth,
    imageHeight,
  );
};

const buildSquareResizedCropRect = (
  handle: Exclude<CropHandle, 'move'>,
  startRect: CropRect,
  deltaX: number,
  deltaY: number,
  imageWidth: number,
  imageHeight: number,
): CropRect => {
  const right = startRect.left + startRect.width;
  const bottom = startRect.top + startRect.height;
  let side = startRect.width;

  if (handle === 'nw') {
    side = Math.max(startRect.width - deltaX, startRect.height - deltaY, MIN_CROP_SIZE_PX);
    side = clampNumber(side, MIN_CROP_SIZE_PX, Math.min(right, bottom));
    return { left: right - side, top: bottom - side, width: side, height: side };
  }

  if (handle === 'ne') {
    side = Math.max(startRect.width + deltaX, startRect.height - deltaY, MIN_CROP_SIZE_PX);
    side = clampNumber(side, MIN_CROP_SIZE_PX, Math.min(imageWidth - startRect.left, bottom));
    return { left: startRect.left, top: bottom - side, width: side, height: side };
  }

  if (handle === 'sw') {
    side = Math.max(startRect.width - deltaX, startRect.height + deltaY, MIN_CROP_SIZE_PX);
    side = clampNumber(side, MIN_CROP_SIZE_PX, Math.min(right, imageHeight - startRect.top));
    return { left: right - side, top: startRect.top, width: side, height: side };
  }

  side = Math.max(startRect.width + deltaX, startRect.height + deltaY, MIN_CROP_SIZE_PX);
  side = clampNumber(side, MIN_CROP_SIZE_PX, Math.min(imageWidth - startRect.left, imageHeight - startRect.top));
  return { left: startRect.left, top: startRect.top, width: side, height: side };
};

export function ChromaBackgroundRemoverTool({
  locale = 'pt-br',
}: ChromaBackgroundRemoverToolProps) {
  const ui = uiByLocale[locale];
  const [source, setSource] = useState<SourceImageState | null>(null);
  const [previews, setPreviews] = useState<OptionPreview[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<ChromaOptionId>('balanced');
  const [preset, setPreset] = useState<ChromaPresetId>('magenta');
  const [manualHex, setManualHex] = useState('#FF00FF');
  const [threshold, setThreshold] = useState(DEFAULT_CHROMA_THRESHOLD);
  const [softness, setSoftness] = useState(DEFAULT_CHROMA_SOFTNESS);
  const [despill, setDespill] = useState(true);
  const [cropSettings, setCropSettings] = useState<CropSettings>(DEFAULT_CROP_SETTINGS);
  const [cropPreviewUrl, setCropPreviewUrl] = useState<string | null>(null);
  const [isPreviewStale, setIsPreviewStale] = useState(false);
  const [status, setStatus] = useState(ui.noFile);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [viewerState, setViewerState] = useState<ViewerState | null>(null);

  const sourceRef = useRef<SourceImageState | null>(null);
  const previewsRef = useRef<OptionPreview[]>([]);
  const cropPreviewUrlRef = useRef<string | null>(null);
  const cropFrameRef = useRef<HTMLDivElement>(null);
  const cropPointerStateRef = useRef<CropPointerState | null>(null);

  useEffect(() => {
    sourceRef.current = source;
  }, [source]);

  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);

  useEffect(() => {
    cropPreviewUrlRef.current = cropPreviewUrl;
  }, [cropPreviewUrl]);

  useEffect(
    () => () => {
      if (sourceRef.current) {
        URL.revokeObjectURL(sourceRef.current.sourceUrl);
      }

      if (cropPreviewUrlRef.current) {
        URL.revokeObjectURL(cropPreviewUrlRef.current);
      }

      revokePreviewUrls(previewsRef.current);
    },
    [],
  );

  useEffect(() => {
    if (!source || cropSettings.shape === 'none') {
      setCropPreviewUrl((current) => {
        if (current) {
          URL.revokeObjectURL(current);
        }

        return null;
      });
      return;
    }

    let isActive = true;

    const updateCropPreview = async () => {
      try {
        const croppedImageData = applyCropToImageData(source.previewData.imageData, cropSettings);
        const blob = await imageDataToPngBlob(croppedImageData);
        const nextUrl = URL.createObjectURL(blob);

        if (!isActive) {
          URL.revokeObjectURL(nextUrl);
          return;
        }

        setCropPreviewUrl((current) => {
          if (current) {
            URL.revokeObjectURL(current);
          }

          return nextUrl;
        });
      } catch {
        if (!isActive) {
          return;
        }

        setCropPreviewUrl((current) => {
          if (current) {
            URL.revokeObjectURL(current);
          }

          return null;
        });
      }
    };

    void updateCropPreview();

    return () => {
      isActive = false;
    };
  }, [cropSettings, source]);

  const selectedPreview = useMemo(
    () =>
      previews.find((preview) => preview.id === selectedOptionId) ??
      previews.find((preview) => preview.id === 'balanced') ??
      previews[0],
    [previews, selectedOptionId],
  );

  const markPreviewStale = (message = ui.settingsPending) => {
    if (!source || !previews.length) {
      return;
    }

    setIsPreviewStale(true);
    setErrorMessage(null);
    setStatus(message);
  };

  const replacePreviews = (nextPreviews: OptionPreview[]) => {
    setPreviews((current) => {
      revokePreviewUrls(current);
      return nextPreviews;
    });
  };

  const buildPreviewItems = useCallback(
    async (
      loaded: LoadedImageData,
      overrideCropSettings?: CropSettings,
    ): Promise<OptionPreview[]> => {
      const activeCropSettings = overrideCropSettings ?? cropSettings;
      const croppedImageData = applyCropToImageData(loaded.imageData, activeCropSettings);
      const chromaRgb = getChromaColor(preset, manualHex, croppedImageData);
      const chromaHex = rgbToHex(chromaRgb);
      const configs = buildChromaOptionConfigs(threshold, softness);
      const nextPreviews: OptionPreview[] = [];

      try {
        for (const config of configs) {
          const result = removeChromaFromImageData(croppedImageData, {
            chromaRgb,
            threshold: config.threshold,
            softness: config.softness,
            despill,
          });
          const blob = await imageDataToPngBlob(result.imageData);

          nextPreviews.push({
            ...config,
            blob,
            url: URL.createObjectURL(blob),
            stats: result.stats,
            chromaRgb,
            chromaHex,
            despill,
            cropSettings: cloneCropSettings(activeCropSettings),
          });
        }
      } catch (error) {
        revokePreviewUrls(nextPreviews);
        throw error;
      }

      return nextPreviews;
    },
    [cropSettings, despill, manualHex, preset, softness, threshold],
  );

  const clearTool = () => {
    cropPointerStateRef.current = null;
    setViewerState(null);
    setErrorMessage(null);
    setStatus(ui.noFile);
    setCropSettings(DEFAULT_CROP_SETTINGS);
    setIsPreviewStale(false);

    setSource((current) => {
      if (current) {
        URL.revokeObjectURL(current.sourceUrl);
      }

      return null;
    });

    replacePreviews([]);
  };

  const handleFilesSelected = async (files: File[]) => {
    const file = files[0];

    if (!file || isLoadingFile || isGenerating || isDownloading) {
      return;
    }

    setIsLoadingFile(true);
    setErrorMessage(null);
    setViewerState(null);

    const sourceUrl = URL.createObjectURL(file);

    try {
      const previewData = await loadImageDataFromFile(file, PREVIEW_MAX_DIMENSION);
      const originalWidth = Math.round(previewData.width / previewData.scale);
      const originalHeight = Math.round(previewData.height / previewData.scale);
      const nextSource: SourceImageState = {
        file,
        sourceUrl,
        previewData,
        originalWidth,
        originalHeight,
      };
      setCropSettings(DEFAULT_CROP_SETTINGS);
      const nextPreviews = await buildPreviewItems(previewData, DEFAULT_CROP_SETTINGS);

      setSource((current) => {
        if (current) {
          URL.revokeObjectURL(current.sourceUrl);
        }

        return nextSource;
      });
      replacePreviews(nextPreviews);
      setSelectedOptionId('balanced');
      setIsPreviewStale(false);
      setStatus(ui.loadedOk);
    } catch (error) {
      URL.revokeObjectURL(sourceUrl);
      setErrorMessage(error instanceof Error ? error.message : ui.genericError);
      setStatus(ui.noFile);
    } finally {
      setIsLoadingFile(false);
    }
  };

  const handleGeneratePreviews = async () => {
    if (!source || isGenerating || isDownloading) {
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setViewerState(null);

    try {
      const nextPreviews = await buildPreviewItems(source.previewData);
      replacePreviews(nextPreviews);
      setSelectedOptionId('balanced');
      setIsPreviewStale(false);
      setStatus(ui.previewOk);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : ui.genericError);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!source || !selectedPreview || isDownloading || isPreviewStale) {
      return;
    }

    setIsDownloading(true);
    setErrorMessage(null);

    try {
      const fullImage = await loadImageDataFromFile(source.file);
      const croppedFullImage = applyCropToImageData(fullImage.imageData, selectedPreview.cropSettings);
      const result = removeChromaFromImageData(croppedFullImage, {
        chromaRgb: selectedPreview.chromaRgb,
        threshold: selectedPreview.threshold,
        softness: selectedPreview.softness,
        despill: selectedPreview.despill,
      });
      const blob = await imageDataToPngBlob(result.imageData);
      const fileName = buildRemovedBackgroundFileName(source.file.name, selectedPreview.id);

      downloadBlob(blob, fileName);
      setStatus(ui.downloadOk(fileName));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : ui.genericError);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePresetChange = (nextPreset: ChromaPresetId) => {
    setPreset(nextPreset);
    markPreviewStale();

    const nextManualColor = presetManualColorById[nextPreset];
    if (nextManualColor) {
      setManualHex(nextManualColor);
    }
  };

  const updateCropSettings = (updater: (current: CropSettings) => CropSettings) => {
    setCropSettings((current) => updater(current));
    markPreviewStale(ui.cropPending);
  };

  const handleCropShapeChange = (shape: CropShape) => {
    updateCropSettings((current) => ({
      ...current,
      shape,
      widthPercent:
        shape === 'free' ? current.widthPercent || current.sizePercent : current.widthPercent,
      heightPercent:
        shape === 'free' ? current.heightPercent || current.sizePercent : current.heightPercent,
    }));
  };

  const resetCropPosition = () => {
    updateCropSettings((current) => ({
      ...current,
      sizePercent: DEFAULT_CROP_SETTINGS.sizePercent,
      widthPercent: DEFAULT_CROP_SETTINGS.widthPercent,
      heightPercent: DEFAULT_CROP_SETTINGS.heightPercent,
      xPercent: DEFAULT_CROP_SETTINGS.xPercent,
      yPercent: DEFAULT_CROP_SETTINGS.yPercent,
    }));
  };

  const cropRect =
    source && cropSettings.shape !== 'none'
      ? resolveCropRect(source.previewData.width, source.previewData.height, cropSettings)
      : null;
  const cropBoxStyle: CSSProperties | undefined =
    source && cropRect
      ? {
          left: `${(cropRect.left / source.previewData.width) * 100}%`,
          top: `${(cropRect.top / source.previewData.height) * 100}%`,
          width: `${(cropRect.width / source.previewData.width) * 100}%`,
          height: `${(cropRect.height / source.previewData.height) * 100}%`,
          borderRadius: cropSettings.shape === 'circle' ? '9999px' : '12px',
          boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.55)',
        }
      : undefined;
  const cropPreviewDimensions = cropRect
    ? formatDimensions(cropRect.width, cropRect.height)
    : source
      ? formatDimensions(source.previewData.width, source.previewData.height)
      : '';
  const cropFrameStyle: CSSProperties | undefined = source
    ? {
        aspectRatio: `${source.previewData.width} / ${source.previewData.height}`,
        width:
          source.previewData.height > source.previewData.width
            ? `${Math.round(420 * (source.previewData.width / source.previewData.height))}px`
            : '100%',
      }
    : undefined;
  const hasSource = Boolean(source);
  const isBusy = isLoadingFile || isGenerating || isDownloading;

  const handleCropPointerDown = (
    handle: CropHandle,
    event: ReactPointerEvent<HTMLElement>,
  ) => {
    if (!source || !cropRect || cropSettings.shape === 'none' || isBusy) {
      return;
    }

    const frame = cropFrameRef.current;

    if (!frame) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const frameRect = frame.getBoundingClientRect();
    cropPointerStateRef.current = {
      handle,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startRect: cropRect,
      frameWidth: frameRect.width,
      frameHeight: frameRect.height,
      imageWidth: source.previewData.width,
      imageHeight: source.previewData.height,
      pointerId: event.pointerId,
    };
    frame.setPointerCapture(event.pointerId);
  };

  const handleCropPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const pointerState = cropPointerStateRef.current;

    if (!pointerState || !source) {
      return;
    }

    event.preventDefault();

    const deltaX =
      ((event.clientX - pointerState.startClientX) / pointerState.frameWidth) *
      pointerState.imageWidth;
    const deltaY =
      ((event.clientY - pointerState.startClientY) / pointerState.frameHeight) *
      pointerState.imageHeight;
    const handle = pointerState.handle;

    updateCropSettings((current) => {
      if (current.shape === 'none') {
        return current;
      }

      const nextRect =
        handle === 'move'
          ? buildMovedCropRect(
              pointerState.startRect,
              deltaX,
              deltaY,
              pointerState.imageWidth,
              pointerState.imageHeight,
            )
          : current.shape === 'free'
            ? buildFreeResizedCropRect(
                handle,
                pointerState.startRect,
                deltaX,
                deltaY,
                pointerState.imageWidth,
                pointerState.imageHeight,
              )
            : buildSquareResizedCropRect(
                handle,
                pointerState.startRect,
                deltaX,
                deltaY,
                pointerState.imageWidth,
                pointerState.imageHeight,
              );

      return buildCropSettingsFromRect(
        current.shape,
        nextRect,
        pointerState.imageWidth,
        pointerState.imageHeight,
        current,
      );
    });
  };

  const handleCropPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const pointerState = cropPointerStateRef.current;

    if (!pointerState) {
      return;
    }

    cropPointerStateRef.current = null;

    if (event.currentTarget.hasPointerCapture(pointerState.pointerId)) {
      event.currentTarget.releasePointerCapture(pointerState.pointerId);
    }
  };

  return (
    <Card className="space-y-5">
      <header className="rounded-lg border border-brand-200 bg-gradient-to-r from-brand-50 to-cyan-50 p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-white p-2 text-brand-700 shadow-sm">
            <SlidersHorizontal className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{ui.title}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-700">{ui.intro}</p>
          </div>
        </div>
      </header>

      <FileUploadDropzone
        locale={locale}
        label={ui.uploadLabel}
        helperText={ui.uploadHint}
        acceptedDescription={ui.acceptedDescription}
        accept={acceptedImageTypes}
        multiple={false}
        selectedFiles={source ? [source.file] : []}
        onFilesSelected={(files) => {
          void handleFilesSelected(files);
        }}
        onRemoveFile={clearTool}
      />

      {source ? (
        <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h4 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                <Crop className="h-4 w-4 text-brand-700" />
                {ui.cropTitle}
              </h4>
              <p className="mt-1 text-sm leading-6 text-slate-600">{ui.cropIntro}</p>
            </div>
            <Button variant="ghost" onClick={resetCropPosition} disabled={isBusy}>
              {ui.cropReset}
            </Button>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.cropMode}</span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {cropShapes.map((shape) => {
                const ShapeIcon = getCropShapeIcon(shape);
                const isSelected = cropSettings.shape === shape;
                const label = getCropLabel(ui, shape);

                return (
                  <button
                    key={shape}
                    type="button"
                    onClick={() => handleCropShapeChange(shape)}
                    disabled={isBusy}
                    className={cn(
                      'flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-200 disabled:cursor-not-allowed disabled:opacity-50',
                      isSelected
                        ? 'border-brand-400 bg-white text-brand-700 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300',
                    )}
                  >
                    <ShapeIcon className="h-4 w-4" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h5 className="text-sm font-semibold text-slate-800">{ui.cropSourceTitle}</h5>
                <span className="text-xs text-slate-500">{cropPreviewDimensions}</span>
              </div>
              <div
                ref={cropFrameRef}
                className="relative mx-auto w-full max-w-2xl touch-none select-none overflow-hidden rounded-lg border border-slate-200 bg-white"
                style={cropFrameStyle}
                onPointerMove={handleCropPointerMove}
                onPointerUp={handleCropPointerUp}
                onPointerCancel={handleCropPointerUp}
              >
                <img
                  src={source.sourceUrl}
                  alt={source.file.name}
                  className="absolute inset-0 h-full w-full object-fill"
                />
                {cropBoxStyle ? (
                  <div
                    className="absolute cursor-move touch-none border-2 border-white outline outline-2 outline-brand-500"
                    style={cropBoxStyle}
                    onPointerDown={(event) => handleCropPointerDown('move', event)}
                  >
                    <span className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow" />
                    <span className="pointer-events-none absolute inset-x-0 top-1/2 border-t border-white/70" />
                    <span className="pointer-events-none absolute inset-y-0 left-1/2 border-l border-white/70" />
                    {cropHandles.map((handle) => (
                      <button
                        key={handle}
                        type="button"
                        aria-label={`${ui.cropMode} ${handle}`}
                        disabled={isBusy}
                        onPointerDown={(event) => handleCropPointerDown(handle, event)}
                        className={cn(
                          'absolute h-8 w-8 rounded-full border-2 border-white bg-brand-600 shadow-lg ring-2 ring-brand-100 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-300 disabled:cursor-not-allowed disabled:opacity-60',
                          cropHandleClassName[handle],
                        )}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
              {cropSettings.shape !== 'none' ? (
                <p className="text-xs leading-5 text-slate-500">{ui.cropDragHint}</p>
              ) : null}
            </div>

            <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-3">
              <div className="space-y-2">
                <h5 className="text-sm font-semibold text-slate-800">{ui.cropOutputTitle}</h5>
                <div
                  className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-slate-200"
                  style={checkerboardStyle}
                >
                  <img
                    src={cropSettings.shape === 'none' ? source.sourceUrl : cropPreviewUrl ?? source.sourceUrl}
                    alt={ui.cropOutputTitle}
                    className={cn(
                      'h-full w-full object-contain',
                      cropSettings.shape === 'none' ? 'bg-white' : '',
                    )}
                  />
                </div>
              </div>

              {cropSettings.shape !== 'none' ? (
                <div className="space-y-4">
                  {cropSettings.shape === 'free' ? (
                    <>
                      <label className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-slate-800">
                            {ui.cropWidth}
                          </span>
                          <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                            {cropSettings.widthPercent}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min={12}
                          max={100}
                          value={cropSettings.widthPercent}
                          onChange={(event) =>
                            updateCropSettings((current) => ({
                              ...current,
                              widthPercent: Number(event.target.value),
                            }))
                          }
                          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-brand-600"
                        />
                      </label>

                      <label className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-slate-800">
                            {ui.cropHeight}
                          </span>
                          <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                            {cropSettings.heightPercent}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min={12}
                          max={100}
                          value={cropSettings.heightPercent}
                          onChange={(event) =>
                            updateCropSettings((current) => ({
                              ...current,
                              heightPercent: Number(event.target.value),
                            }))
                          }
                          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-brand-600"
                        />
                      </label>
                    </>
                  ) : (
                    <label className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-slate-800">{ui.cropSize}</span>
                        <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                          {cropSettings.sizePercent}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={12}
                        max={100}
                        value={cropSettings.sizePercent}
                        onChange={(event) =>
                          updateCropSettings((current) => {
                            const sizePercent = Number(event.target.value);

                            return {
                              ...current,
                              sizePercent,
                              widthPercent: sizePercent,
                              heightPercent: sizePercent,
                            };
                          })
                        }
                        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-brand-600"
                      />
                    </label>
                  )}

                  <label className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-800">{ui.cropHorizontal}</span>
                      <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                        {cropSettings.xPercent}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={cropSettings.xPercent}
                      onChange={(event) =>
                        updateCropSettings((current) => ({
                          ...current,
                          xPercent: Number(event.target.value),
                        }))
                      }
                      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-brand-600"
                    />
                  </label>

                  <label className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-800">{ui.cropVertical}</span>
                      <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                        {cropSettings.yPercent}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={cropSettings.yPercent}
                      onChange={(event) =>
                        updateCropSettings((current) => ({
                          ...current,
                          yPercent: Number(event.target.value),
                        }))
                      }
                      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-brand-600"
                    />
                  </label>
                </div>
              ) : (
                <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                  {ui.cropNone}
                </p>
              )}
            </div>
          </div>
        </section>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{ui.colorMode}</span>
          <Select
            value={preset}
            onChange={(event) => handlePresetChange(event.target.value as ChromaPresetId)}
          >
            <option value="magenta">{ui.presetLabels.magenta}</option>
            <option value="green">{ui.presetLabels.green}</option>
            <option value="white">{ui.presetLabels.white}</option>
            <option value="auto">{ui.presetLabels.auto}</option>
            <option value="manual">{ui.presetLabels.manual}</option>
          </Select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{ui.manualColor}</span>
          <div className="flex gap-2">
            <span
              className="h-11 w-12 shrink-0 rounded-lg border border-slate-300"
              style={{ backgroundColor: manualHex }}
              aria-hidden="true"
            />
            <Input
              value={manualHex}
              onChange={(event) => {
                setManualHex(event.target.value);
                markPreviewStale();
              }}
              onFocus={() => handlePresetChange('manual')}
              placeholder="#FF00FF"
              inputMode="text"
            />
          </div>
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-slate-800">{ui.threshold}</span>
            <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
              {threshold}
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={150}
            value={threshold}
            onChange={(event) => {
              setThreshold(Number(event.target.value));
              markPreviewStale();
            }}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-brand-600"
          />
          <span className="text-xs text-slate-500">{ui.thresholdHint}</span>
        </label>

        <label className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-slate-800">{ui.softness}</span>
            <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
              {softness}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={120}
            value={softness}
            onChange={(event) => {
              setSoftness(Number(event.target.value));
              markPreviewStale();
            }}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-brand-600"
          />
          <span className="text-xs text-slate-500">{ui.softnessHint}</span>
        </label>
      </div>

      <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <input
          type="checkbox"
          checked={despill}
          onChange={(event) => {
            setDespill(event.target.checked);
            markPreviewStale();
          }}
          className="mt-1 h-4 w-4 rounded border-slate-300 accent-brand-600"
        />
        <span>
          <span className="block text-sm font-semibold text-slate-800">{ui.despill}</span>
          <span className="mt-1 block text-xs leading-5 text-slate-600">{ui.despillHint}</span>
        </span>
      </label>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          onClick={() => {
            void handleGeneratePreviews();
          }}
          disabled={!hasSource || isBusy}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {isGenerating || isLoadingFile ? ui.generating : ui.generate}
        </Button>
        <Button
          onClick={() => {
            void handleDownload();
          }}
          disabled={!selectedPreview || isBusy || isPreviewStale}
        >
          <Download className="mr-2 h-4 w-4" />
          {isDownloading ? ui.downloading : ui.download}
        </Button>
        <Button variant="ghost" onClick={clearTool} disabled={!hasSource || isBusy}>
          <Trash2 className="mr-2 h-4 w-4" />
          {ui.clear}
        </Button>
      </div>

      <div
        className={cn(
          'rounded-lg border p-3 text-sm',
          errorMessage
            ? 'border-red-200 bg-red-50 text-red-700'
            : 'border-slate-200 bg-slate-50 text-slate-700',
        )}
      >
        {errorMessage ?? status}
      </div>

      {source ? (
        <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700 md:grid-cols-4">
          <p>
            <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              {ui.selectedFile}
            </span>
            <span className="mt-1 block truncate font-medium text-slate-900">{source.file.name}</span>
            <span className="text-xs text-slate-500">{formatBytes(source.file.size)}</span>
          </p>
          <p>
            <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              {ui.originalSize}
            </span>
            <span className="mt-1 block font-medium text-slate-900">
              {formatDimensions(source.originalWidth, source.originalHeight)}
            </span>
          </p>
          <p>
            <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              {ui.previewSize}
            </span>
            <span className="mt-1 block font-medium text-slate-900">
              {formatDimensions(source.previewData.width, source.previewData.height)}
            </span>
          </p>
          <p>
            <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              {ui.cropSizeInfo}
            </span>
            <span className="mt-1 block font-medium text-slate-900">{cropPreviewDimensions}</span>
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
        <section className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-800">{ui.sourcePreview}</h4>
              {source ? (
                <button
                  type="button"
                  className="h-72 w-full cursor-zoom-in overflow-hidden rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-200"
                  onClick={() =>
                    setViewerState({
                      src: source.sourceUrl,
                      alt: source.file.name,
                      onDownload: () => downloadBlob(source.file, source.file.name),
                    })
                  }
                >
                  <img
                    src={source.sourceUrl}
                    alt={source.file.name}
                    className="h-full w-full object-contain"
                  />
                </button>
              ) : (
                <div className="flex h-72 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-500">
                  {ui.noFile}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-800">{ui.resultPreview}</h4>
              {selectedPreview ? (
                <button
                  type="button"
                  className="h-72 w-full cursor-zoom-in overflow-hidden rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-200"
                  style={checkerboardStyle}
                  onClick={() =>
                    setViewerState({
                      src: selectedPreview.url,
                      alt: `${ui.optionLabels[selectedPreview.id]} - ${source?.file.name ?? ''}`,
                      onDownload: () =>
                        downloadBlob(
                          selectedPreview.blob,
                          buildRemovedBackgroundFileName(
                            source?.file.name ?? 'preview.png',
                            selectedPreview.id,
                          ),
                        ),
                    })
                  }
                >
                  <img
                    src={selectedPreview.url}
                    alt={ui.resultPreview}
                    className="h-full w-full object-contain"
                  />
                </button>
              ) : (
                <div className="flex h-72 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-500">
                  {ui.noPreview}
                </div>
              )}
            </div>
          </div>

          {selectedPreview ? (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              <span>
                {ui.currentChroma}:{' '}
                <strong className="text-slate-900">{selectedPreview.chromaHex}</strong>
              </span>
              <span>
                {ui.threshold}:{' '}
                <strong className="text-slate-900">{selectedPreview.threshold}</strong>
              </span>
              <span>
                {ui.softness}:{' '}
                <strong className="text-slate-900">{selectedPreview.softness}</strong>
              </span>
              <span>{ui.transparentPixels(getTransparentPercent(selectedPreview.stats))}</span>
            </div>
          ) : null}
        </section>

        <section className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-800">3 opcoes</h4>
          {previews.length ? (
            <div className="grid gap-3">
              {previews.map((preview) => {
                const isSelected = preview.id === selectedPreview?.id;

                return (
                  <button
                    key={preview.id}
                    type="button"
                    onClick={() => setSelectedOptionId(preview.id)}
                    className={cn(
                      'grid grid-cols-[96px_minmax(0,1fr)] gap-3 rounded-lg border p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-brand-200',
                      isSelected
                        ? 'border-brand-400 bg-brand-50'
                        : 'border-slate-200 bg-white hover:border-brand-300',
                    )}
                  >
                    <span
                      className="block h-24 overflow-hidden rounded-md border border-slate-200"
                      style={checkerboardStyle}
                    >
                      <img
                        src={preview.url}
                        alt={ui.optionLabels[preview.id]}
                        className="h-full w-full object-contain"
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-slate-900">
                        {ui.optionLabels[preview.id]}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate-600">
                        {ui.optionDescriptions[preview.id]}
                      </span>
                      <span className="mt-2 block text-xs font-medium text-slate-700">
                        {ui.threshold}: {preview.threshold} | {ui.softness}: {preview.softness}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
              {ui.noPreview}
            </p>
          )}

          {selectedPreview ? (
            <Button
              variant="secondary"
              className="w-full"
              onClick={() =>
                setViewerState({
                  src: selectedPreview.url,
                  alt: ui.optionLabels[selectedPreview.id],
                })
              }
            >
              <Eye className="mr-2 h-4 w-4" />
              {ui.viewPreview}
            </Button>
          ) : null}
        </section>
      </div>

      <div className="grid gap-3 text-xs leading-5 text-slate-600 md:grid-cols-2">
        <p className="rounded-lg border border-slate-200 bg-slate-50 p-3">{ui.outputNote}</p>
        <p className="rounded-lg border border-slate-200 bg-slate-50 p-3">{ui.localNote}</p>
      </div>

      <ImageViewer
        src={viewerState?.src ?? ''}
        alt={viewerState?.alt ?? ui.resultPreview}
        isOpen={Boolean(viewerState)}
        onClose={() => setViewerState(null)}
        onDownload={viewerState?.onDownload}
      />
    </Card>
  );
}
