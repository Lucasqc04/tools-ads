'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import {
  Archive,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  ImagePlus,
  LoaderCircle,
  Move,
  RotateCcw,
  Share2,
  X,
} from 'lucide-react';
import { FileUploadDropzone } from '@/components/shared/file-upload-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { trackEvent, TOOL_ID } from '@/lib/analytics';
import {
  buildInstagramOutputName,
  calculateCropRectangle,
  calculateOutputDimensions,
  INSTAGRAM_PRESETS,
  isImageAlreadyWithinPreset,
  type CropPosition,
  type InstagramPreset,
  type InstagramPresetId,
} from '@/lib/instagram-image-optimizer';
import { formatBytes } from '@/lib/file-size';
import { downloadBlob } from '@/lib/image-conversion';
import type { AppLocale } from '@/lib/i18n/config';

type InstagramImageOptimizerToolProps = Readonly<{
  locale?: AppLocale;
}>;

type OutputFormat = 'auto' | 'jpeg' | 'png' | 'webp';
type LabVariantId = 'A' | 'B' | 'C' | 'D' | 'E';
type LabVariant = {
  id: LabVariantId;
  file: File;
  url: string;
  width: number;
  height: number;
  unchanged: boolean;
};
type LabComparisonMode = 'slider' | 'toggle';
type ItemStatus = 'ready' | 'processing' | 'done' | 'error';
type PostType = 'feed' | 'carousel' | 'story';
type PreferredVariant = 'original' | 'prepared' | `lab-${LabVariantId}`;

type InstagramTestForm = {
  date: string;
  device: string;
  appVersion: string;
  postType: PostType;
  connection: 'wifi' | 'mobile';
  highQuality: boolean;
  usedFilter: boolean;
  addedExtras: boolean;
  preferred: PreferredVariant;
  notes: string;
};

type InstagramTestRecord = InstagramTestForm & {
  id: string;
  createdAt: number;
};

type OptimizerItem = {
  id: string;
  file: File;
  sourceUrl?: string;
  width: number;
  height: number;
  crop: CropPosition;
  status: ItemStatus;
  output?: File;
  outputUrl?: string;
  outputWidth?: number;
  outputHeight?: number;
  errorMessage?: string;
};

type DragOrigin = {
  x: number;
  y: number;
  cropX: number;
  cropY: number;
  overflowX: number;
  overflowY: number;
};

const MAX_FILES = 12;
const MAX_FILE_BYTES = 25 * 1024 * 1024;
const MAX_IMAGE_PIXELS = 40_000_000;
const EMPTY_FILES: File[] = [];
const TEST_HISTORY_KEY = 'adtools.instagram-image-optimizer.tests.v1';

const acceptedImageTypes = 'image/*,.heic,.heif';

const uiByLocale: Record<
  AppLocale,
  {
    uploadTitle: string;
    uploadHint: string;
    accepted: string;
    imagesLabel: (count: number) => string;
    clear: string;
    remove: string;
    moveEarlier: string;
    moveLater: string;
    destination: string;
    presets: Record<InstagramPresetId, string>;
    customWidth: string;
    customHeight: string;
    customSizeHint: string;
    cropWarning: string;
    prepare: string;
    preparing: (index: number, count: number) => string;
    cancel: string;
    cropSummary: string;
    cropHelp: string;
    zoom: string;
    resetCrop: string;
    advanced: string;
    outputFormat: string;
    formats: Record<OutputFormat, string>;
    quality: string;
    original: string;
    prepared: string;
    waiting: string;
    download: string;
    downloadZip: string;
    downloading: string;
    ready: string;
    processing: string;
    done: string;
    error: string;
    localNote: string;
    metadataNote: string;
    unsupportedFormat: string;
    fileTooLarge: string;
    imageTooLarge: string;
    decodeError: string;
    maxFiles: string;
    noImages: string;
    allFormatsUnsupported: string;
    processError: string;
    zipError: string;
    noDownload: string;
    resultNote: string;
    jpegTransparencyWarning: string;
    share: string;
    shareError: string;
    downloadOriginal: string;
    testSummary: string;
    testDescription: string;
    date: string;
    device: string;
    appVersion: string;
    postType: string;
    postTypes: Record<PostType, string>;
    connection: string;
    connections: Record<'wifi' | 'mobile', string>;
    highQuality: string;
    usedFilter: string;
    addedExtras: string;
    preferred: string;
    notes: string;
    saveTest: string;
    savedTests: string;
    clearTests: string;
    testSaved: string;
    testSaveError: string;
    noSavedTests: string;
    labSummary: string;
    labDescription: string;
    generateVariants: string;
    generatingVariants: string;
    variantNames: Record<LabVariantId, string>;
    variantDescriptions: Record<LabVariantId, string>;
    labWarning: string;
    compareMode: string;
    compareSlider: string;
    compareToggle: string;
    reveal: string;
    labZoom: string;
    panHint: string;
    noMetric: string;
    downloadVariant: string;
    downloadVariants: string;
    variantsReady: string;
    variantsError: string;
    generating: string;
    variant: string;
  }
> = {
  'pt-br': {
    uploadTitle: 'Fotos para preparar',
    uploadHint: 'Selecione várias imagens ou arraste para cá. Até 12 arquivos de 25 MB cada.',
    accepted: 'JPEG, PNG, WebP e HEIC/HEIF se o navegador conseguir abrir',
    imagesLabel: (count) => `${count} ${count === 1 ? 'foto' : 'fotos'}`,
    clear: 'Limpar',
    remove: 'Remover foto',
    moveEarlier: 'Mover foto para antes',
    moveLater: 'Mover foto para depois',
    destination: 'Destino',
    presets: {
      'feed-34': 'Feed / Carrossel · vertical 3:4',
      'feed-45': 'Feed · retrato 4:5',
      square: 'Feed · quadrado 1:1',
      landscape: 'Feed · horizontal 1,91:1',
      story: 'Story / capa de Reel · 9:16',
      profile: 'Perfil · quadrado 1:1',
      custom: 'Tamanho personalizado',
      original: 'Manter original',
    },
    customWidth: 'Largura (px)',
    customHeight: 'Altura (px)',
    customSizeHint: 'Use números de 1 a 8192. A ferramenta não amplia a foto.',
    cropWarning: 'Este destino muda o enquadramento. Confira o corte antes de preparar.',
    prepare: 'Preparar imagens',
    preparing: (index, count) => `Preparando ${index} de ${count}…`,
    cancel: 'Cancelar',
    cropSummary: 'Ajustar enquadramento',
    cropHelp: 'Arraste a foto ou use as setas do teclado. Cada imagem mantém seu próprio ajuste.',
    zoom: 'Zoom',
    resetCrop: 'Centralizar',
    advanced: 'Formato e qualidade',
    outputFormat: 'Formato de saída',
    formats: {
      auto: 'Automático · mantém PNG e usa JPEG em fotos',
      jpeg: 'JPEG · recomendado para fotos',
      png: 'PNG · sem perda, arquivos maiores',
      webp: 'WebP · depende do suporte do app',
    },
    quality: 'Qualidade JPEG',
    original: 'Original',
    prepared: 'Preparada',
    waiting: 'Ajuste o destino e prepare as fotos para comparar.',
    download: 'Baixar imagem',
    downloadZip: 'Baixar ZIP',
    downloading: 'Montando ZIP…',
    ready: 'Pronta',
    processing: 'Processando',
    done: 'Concluída',
    error: 'Erro',
    localNote: 'As imagens são processadas neste aparelho e não são enviadas para servidor.',
    metadataNote:
      'Ao transformar a imagem, o navegador pode remover metadados e alterar cor ou HDR. O original permanece intacto.',
    unsupportedFormat: 'Formato não compatível. Use JPEG, PNG ou WebP.',
    fileTooLarge: 'O arquivo excede o limite de 25 MB.',
    imageTooLarge: 'A imagem tem mais de 40 megapixels e pode consumir memória demais neste aparelho.',
    decodeError: 'Não foi possível abrir esta imagem. Se for HEIC, tente salvar uma cópia em JPEG.',
    maxFiles: 'O limite é de 12 imagens por lote.',
    noImages: 'Adicione ao menos uma imagem compatível.',
    allFormatsUnsupported: 'Este navegador não consegue exportar no formato escolhido.',
    processError: 'Não foi possível preparar esta imagem.',
    zipError: 'Não foi possível montar o arquivo ZIP. Baixe as imagens uma por vez.',
    noDownload: 'Prepare ao menos uma imagem antes de baixar.',
    resultNote: 'O Instagram pode recomprimir a imagem depois da publicação.',
    jpegTransparencyWarning: 'Se o PNG tiver áreas transparentes, JPEG as preenche com branco.',
    share: 'Compartilhar',
    shareError: 'Este navegador não conseguiu abrir o compartilhamento. Baixe a imagem para continuar.',
    downloadOriginal: 'Baixar original',
    testSummary: 'Registrar teste depois de publicar',
    testDescription: 'Publique o original e a preparada em condições parecidas e registre qual pareceu melhor. O histórico fica somente neste aparelho; nenhuma foto é salva.',
    date: 'Data do teste',
    device: 'Aparelho',
    appVersion: 'Versão do Instagram',
    postType: 'Publicação',
    postTypes: { feed: 'Feed', carousel: 'Carrossel', story: 'Story' },
    connection: 'Conexão',
    connections: { wifi: 'Wi-Fi', mobile: 'Dados móveis' },
    highQuality: 'Ativei “carregar na qualidade mais alta”',
    usedFilter: 'Usei filtro do Instagram',
    addedExtras: 'Adicionei texto, sticker ou música',
    preferred: 'Qual versão ficou melhor no Instagram?',
    notes: 'Observações sobre nitidez, cor ou artefatos',
    saveTest: 'Salvar teste',
    savedTests: 'Testes salvos neste aparelho',
    clearTests: 'Apagar histórico',
    testSaved: 'Teste salvo neste aparelho.',
    testSaveError: 'Não foi possível salvar o teste neste aparelho.',
    noSavedTests: 'Nenhum teste salvo ainda.',
    labSummary: 'Laboratório · comparar versões',
    labDescription: 'Gere opções com o mesmo enquadramento e compare os arquivos realmente exportados. A comparação mostra diferenças do nosso processamento, não prevê a recompressão do Instagram.',
    generateVariants: 'Gerar A–E',
    generatingVariants: 'Gerando versões…',
    variantNames: { A: 'Original', B: 'Fidelidade', C: 'Equilibrada', D: 'PNG', E: 'Referência 1440' },
    variantDescriptions: {
      A: 'Arquivo original sem alterações.',
      B: 'JPEG 98, no tamanho de destino.',
      C: 'JPEG 92, no tamanho de destino.',
      D: 'PNG com codificação sem perda; corte e redimensionamento ainda alteram pixels.',
      E: 'JPEG 92 com alvo de 1440 px; nunca amplia acima dos pixels disponíveis.',
    },
    labWarning: 'A qualidade após publicar pode variar. Não usamos métrica preditiva nem simulamos o algoritmo do Instagram.',
    compareMode: 'Ver',
    compareSlider: 'Slider',
    compareToggle: 'A/B',
    reveal: 'Mostrar versão preparada',
    labZoom: 'Zoom sincronizado',
    panHint: 'Com zoom, deslize a imagem para inspecionar a mesma área nas duas versões.',
    noMetric: 'Não calculamos uma nota de qualidade: tamanho e aparência devem ser avaliados no Instagram.',
    downloadVariant: 'Baixar versão',
    downloadVariants: 'ZIP',
    variantsReady: 'Versões prontas para comparar.',
    variantsError: 'Não foi possível gerar todas as versões neste aparelho. Tente com uma imagem menor.',
    generating: 'Gerando',
    variant: 'Versão',
  },
  en: {
    uploadTitle: 'Photos to prepare',
    uploadHint: 'Choose multiple images or drop them here. Up to 12 files, 25 MB each.',
    accepted: 'JPEG, PNG, WebP, and HEIC/HEIF when supported by your browser',
    imagesLabel: (count) => `${count} ${count === 1 ? 'photo' : 'photos'}`,
    clear: 'Clear',
    remove: 'Remove photo',
    moveEarlier: 'Move photo earlier',
    moveLater: 'Move photo later',
    destination: 'Destination',
    presets: {
      'feed-34': 'Feed / Carousel · portrait 3:4',
      'feed-45': 'Feed · portrait 4:5',
      square: 'Feed · square 1:1',
      landscape: 'Feed · landscape 1.91:1',
      story: 'Story / Reel cover · 9:16',
      profile: 'Profile · square 1:1',
      custom: 'Custom size',
      original: 'Keep original',
    },
    customWidth: 'Width (px)',
    customHeight: 'Height (px)',
    customSizeHint: 'Use values from 1 to 8192. The tool does not upscale the photo.',
    cropWarning: 'This destination changes the framing. Review the crop before preparing.',
    prepare: 'Prepare images',
    preparing: (index, count) => `Preparing ${index} of ${count}…`,
    cancel: 'Cancel',
    cropSummary: 'Adjust framing',
    cropHelp: 'Drag the photo or use the arrow keys. Each image keeps its own adjustment.',
    zoom: 'Zoom',
    resetCrop: 'Center',
    advanced: 'Format and quality',
    outputFormat: 'Output format',
    formats: {
      auto: 'Automatic · keep PNG and use JPEG for photos',
      jpeg: 'JPEG · recommended for photos',
      png: 'PNG · lossless, larger files',
      webp: 'WebP · app support may vary',
    },
    quality: 'JPEG quality',
    original: 'Original',
    prepared: 'Prepared',
    waiting: 'Choose a destination and prepare photos to compare.',
    download: 'Download image',
    downloadZip: 'Download ZIP',
    downloading: 'Building ZIP…',
    ready: 'Ready',
    processing: 'Processing',
    done: 'Done',
    error: 'Error',
    localNote: 'Images are processed on this device and are not uploaded to a server.',
    metadataNote:
      'When an image is transformed, the browser may remove metadata and change color or HDR. The original stays unchanged.',
    unsupportedFormat: 'Unsupported format. Use JPEG, PNG, or WebP.',
    fileTooLarge: 'The file exceeds the 25 MB limit.',
    imageTooLarge: 'This image is over 40 megapixels and may use too much memory on this device.',
    decodeError: 'Could not open this image. If it is HEIC, try saving a JPEG copy.',
    maxFiles: 'The limit is 12 images per batch.',
    noImages: 'Add at least one supported image.',
    allFormatsUnsupported: 'This browser cannot export the selected format.',
    processError: 'Could not prepare this image.',
    zipError: 'Could not build the ZIP file. Download the images one at a time.',
    noDownload: 'Prepare at least one image before downloading.',
    resultNote: 'Instagram may recompress the image after you publish it.',
    jpegTransparencyWarning: 'If the PNG has transparent areas, JPEG fills them with white.',
    share: 'Share',
    shareError: 'This browser could not open sharing. Download the image to continue.',
    downloadOriginal: 'Download original',
    testSummary: 'Record a test after publishing',
    testDescription: 'Publish the original and prepared versions under similar conditions, then record which looked better. History stays on this device; no photos are saved.',
    date: 'Test date',
    device: 'Device',
    appVersion: 'Instagram version',
    postType: 'Post type',
    postTypes: { feed: 'Feed', carousel: 'Carousel', story: 'Story' },
    connection: 'Connection',
    connections: { wifi: 'Wi-Fi', mobile: 'Mobile data' },
    highQuality: 'I enabled “upload at highest quality”',
    usedFilter: 'I used an Instagram filter',
    addedExtras: 'I added text, a sticker, or music',
    preferred: 'Which version looked better on Instagram?',
    notes: 'Notes about sharpness, color, or artifacts',
    saveTest: 'Save test',
    savedTests: 'Tests saved on this device',
    clearTests: 'Clear history',
    testSaved: 'Test saved on this device.',
    testSaveError: 'Could not save the test on this device.',
    noSavedTests: 'No saved tests yet.',
    labSummary: 'Lab · compare versions',
    labDescription: 'Generate options with the same framing and compare the actual exported files. This shows differences from our processing, not a prediction of Instagram recompression.',
    generateVariants: 'Generate A–E',
    generatingVariants: 'Generating versions…',
    variantNames: { A: 'Original', B: 'Fidelity', C: 'Balanced', D: 'PNG', E: '1440 reference' },
    variantDescriptions: {
      A: 'Original file, unchanged.',
      B: 'JPEG 98 at the selected output size.',
      C: 'JPEG 92 at the selected output size.',
      D: 'Lossless PNG encoding; crop and resizing can still change pixels.',
      E: 'JPEG 92 targeting 1440 px; never enlarges beyond available source pixels.',
    },
    labWarning: 'Quality after publishing can vary. We do not use a predictive score or simulate Instagram’s algorithm.',
    compareMode: 'View',
    compareSlider: 'Slider',
    compareToggle: 'A/B',
    reveal: 'Reveal prepared version',
    labZoom: 'Synchronized zoom',
    panHint: 'At higher zoom, pan the image to inspect the same area in both versions.',
    noMetric: 'We do not calculate a quality score; compare file size and appearance on Instagram.',
    downloadVariant: 'Download version',
    downloadVariants: 'ZIP',
    variantsReady: 'Versions are ready to compare.',
    variantsError: 'Could not generate all versions on this device. Try a smaller image.',
    generating: 'Generating',
    variant: 'Version',
  },
  es: {
    uploadTitle: 'Fotos para preparar',
    uploadHint: 'Selecciona varias imágenes o arrástralas aquí. Hasta 12 archivos de 25 MB cada uno.',
    accepted: 'JPEG, PNG, WebP y HEIC/HEIF si el navegador puede abrirlo',
    imagesLabel: (count) => `${count} ${count === 1 ? 'foto' : 'fotos'}`,
    clear: 'Limpiar',
    remove: 'Quitar foto',
    moveEarlier: 'Mover foto antes',
    moveLater: 'Mover foto después',
    destination: 'Destino',
    presets: {
      'feed-34': 'Feed / carrusel · vertical 3:4',
      'feed-45': 'Feed · retrato 4:5',
      square: 'Feed · cuadrado 1:1',
      landscape: 'Feed · horizontal 1,91:1',
      story: 'Story / portada de Reel · 9:16',
      profile: 'Perfil · cuadrado 1:1',
      custom: 'Tamaño personalizado',
      original: 'Conservar original',
    },
    customWidth: 'Ancho (px)',
    customHeight: 'Alto (px)',
    customSizeHint: 'Usa valores de 1 a 8192. La herramienta no amplía la foto.',
    cropWarning: 'Este destino cambia el encuadre. Revisa el recorte antes de preparar.',
    prepare: 'Preparar imágenes',
    preparing: (index, count) => `Preparando ${index} de ${count}…`,
    cancel: 'Cancelar',
    cropSummary: 'Ajustar encuadre',
    cropHelp: 'Arrastra la foto o usa las flechas del teclado. Cada imagen conserva su ajuste.',
    zoom: 'Zoom',
    resetCrop: 'Centrar',
    advanced: 'Formato y calidad',
    outputFormat: 'Formato de salida',
    formats: {
      auto: 'Automático · conserva PNG y usa JPEG para fotos',
      jpeg: 'JPEG · recomendado para fotos',
      png: 'PNG · sin pérdida, archivos más grandes',
      webp: 'WebP · el soporte puede variar',
    },
    quality: 'Calidad JPEG',
    original: 'Original',
    prepared: 'Preparada',
    waiting: 'Elige un destino y prepara las fotos para compararlas.',
    download: 'Descargar imagen',
    downloadZip: 'Descargar ZIP',
    downloading: 'Creando ZIP…',
    ready: 'Lista',
    processing: 'Procesando',
    done: 'Lista',
    error: 'Error',
    localNote: 'Las imágenes se procesan en este dispositivo y no se envían a un servidor.',
    metadataNote:
      'Al transformar la imagen, el navegador puede quitar metadatos y cambiar color o HDR. El original permanece intacto.',
    unsupportedFormat: 'Formato no compatible. Usa JPEG, PNG o WebP.',
    fileTooLarge: 'El archivo supera el límite de 25 MB.',
    imageTooLarge: 'La imagen supera los 40 megapíxeles y puede usar demasiada memoria.',
    decodeError: 'No se pudo abrir esta imagen. Si es HEIC, guarda una copia en JPEG.',
    maxFiles: 'El límite es de 12 imágenes por lote.',
    noImages: 'Añade al menos una imagen compatible.',
    allFormatsUnsupported: 'Este navegador no puede exportar el formato elegido.',
    processError: 'No se pudo preparar esta imagen.',
    zipError: 'No se pudo crear el archivo ZIP. Descarga las imágenes una por una.',
    noDownload: 'Prepara al menos una imagen antes de descargar.',
    resultNote: 'Instagram puede recomprimir la imagen después de publicarla.',
    jpegTransparencyWarning: 'Si el PNG tiene zonas transparentes, JPEG las rellena con blanco.',
    share: 'Compartir',
    shareError: 'Este navegador no pudo abrir el menú para compartir. Descarga la imagen para continuar.',
    downloadOriginal: 'Descargar original',
    testSummary: 'Registrar prueba después de publicar',
    testDescription: 'Publica el original y la preparada en condiciones similares y registra cuál se vio mejor. El historial queda en este dispositivo; no se guardan fotos.',
    date: 'Fecha de la prueba',
    device: 'Dispositivo',
    appVersion: 'Versión de Instagram',
    postType: 'Publicación',
    postTypes: { feed: 'Feed', carousel: 'Carrusel', story: 'Story' },
    connection: 'Conexión',
    connections: { wifi: 'Wi-Fi', mobile: 'Datos móviles' },
    highQuality: 'Activé “subir con la máxima calidad”',
    usedFilter: 'Usé un filtro de Instagram',
    addedExtras: 'Añadí texto, sticker o música',
    preferred: '¿Qué versión se vio mejor en Instagram?',
    notes: 'Notas sobre nitidez, color o artefactos',
    saveTest: 'Guardar prueba',
    savedTests: 'Pruebas guardadas en este dispositivo',
    clearTests: 'Borrar historial',
    testSaved: 'Prueba guardada en este dispositivo.',
    testSaveError: 'No se pudo guardar la prueba en este dispositivo.',
    noSavedTests: 'Todavía no hay pruebas guardadas.',
    labSummary: 'Laboratorio · comparar versiones',
    labDescription: 'Genera opciones con el mismo encuadre y compara los archivos exportados. La comparación muestra diferencias de nuestro proceso, no predice la recompresión de Instagram.',
    generateVariants: 'Generar A–E',
    generatingVariants: 'Generando versiones…',
    variantNames: { A: 'Original', B: 'Fidelidad', C: 'Equilibrada', D: 'PNG', E: 'Referencia 1440' },
    variantDescriptions: {
      A: 'Archivo original sin cambios.',
      B: 'JPEG 98 con el tamaño elegido.',
      C: 'JPEG 92 con el tamaño elegido.',
      D: 'Codificación PNG sin pérdida; el recorte y el cambio de tamaño pueden modificar píxeles.',
      E: 'JPEG 92 con objetivo de 1440 px; nunca amplía más allá de los píxeles disponibles.',
    },
    labWarning: 'La calidad después de publicar puede variar. No usamos una puntuación predictiva ni simulamos el algoritmo de Instagram.',
    compareMode: 'Ver',
    compareSlider: 'Deslizador',
    compareToggle: 'A/B',
    reveal: 'Mostrar versión preparada',
    labZoom: 'Zoom sincronizado',
    panHint: 'Con más zoom, desliza la imagen para revisar la misma zona en ambas versiones.',
    noMetric: 'No calculamos una puntuación: compara el tamaño y la apariencia en Instagram.',
    downloadVariant: 'Descargar versión',
    downloadVariants: 'ZIP',
    variantsReady: 'Versiones listas para comparar.',
    variantsError: 'No se pudieron generar todas las versiones en este dispositivo. Prueba con una imagen más pequeña.',
    generating: 'Generando',
    variant: 'Versión',
  },
  zh: {
    uploadTitle: '待处理图片',
    uploadHint: '选择多张图片或拖到这里。最多 12 个文件，每个不超过 25 MB。',
    accepted: 'JPEG、PNG、WebP，以及浏览器支持的 HEIC/HEIF',
    imagesLabel: (count) => `${count} 张图片`,
    clear: '清除',
    remove: '移除图片',
    moveEarlier: '向前移动',
    moveLater: '向后移动',
    destination: '发布位置',
    presets: {
      'feed-34': '动态 / 轮播 · 竖版 3:4',
      'feed-45': '动态 · 竖版 4:5',
      square: '动态 · 正方形 1:1',
      landscape: '动态 · 横版 1.91:1',
      story: '快拍 / Reels 封面 · 9:16',
      profile: '头像 · 正方形 1:1',
      custom: '自定义尺寸',
      original: '保留原图',
    },
    customWidth: '宽度（像素）',
    customHeight: '高度（像素）',
    customSizeHint: '请输入 1 至 8192。工具不会放大照片。',
    cropWarning: '此目标会改变构图。处理前请检查裁剪效果。',
    prepare: '处理图片',
    preparing: (index, count) => `正在处理 ${index}/${count}…`,
    cancel: '取消',
    cropSummary: '调整裁剪',
    cropHelp: '拖动图片或使用键盘方向键。每张图片可以单独设置。',
    zoom: '缩放',
    resetCrop: '居中',
    advanced: '格式和质量',
    outputFormat: '导出格式',
    formats: {
      auto: '自动 · 保留 PNG，照片使用 JPEG',
      jpeg: 'JPEG · 适合照片',
      png: 'PNG · 无损，文件较大',
      webp: 'WebP · 应用支持可能不同',
    },
    quality: 'JPEG 质量',
    original: '原图',
    prepared: '处理后',
    waiting: '选择发布位置并处理图片以进行比较。',
    download: '下载图片',
    downloadZip: '下载 ZIP',
    downloading: '正在打包 ZIP…',
    ready: '就绪',
    processing: '处理中',
    done: '完成',
    error: '错误',
    localNote: '图片在此设备的浏览器中处理，不会上传到服务器。',
    metadataNote: '转换图片时，浏览器可能会移除元数据并改变颜色或 HDR。原图保持不变。',
    unsupportedFormat: '格式不受支持。请使用 JPEG、PNG 或 WebP。',
    fileTooLarge: '文件超过 25 MB 限制。',
    imageTooLarge: '图片超过 4000 万像素，可能会占用过多内存。',
    decodeError: '无法打开图片。如果是 HEIC，请先另存为 JPEG。',
    maxFiles: '每批最多处理 12 张图片。',
    noImages: '请添加至少一张受支持的图片。',
    allFormatsUnsupported: '此浏览器无法导出所选格式。',
    processError: '无法处理此图片。',
    zipError: '无法创建 ZIP 文件。请逐张下载图片。',
    noDownload: '请先处理至少一张图片再下载。',
    resultNote: '发布后 Instagram 仍可能重新压缩图片。',
    jpegTransparencyWarning: '如果 PNG 包含透明区域，JPEG 会用白色填充。',
    share: '分享',
    shareError: '浏览器无法打开分享菜单。请下载图片后继续。',
    downloadOriginal: '下载原图',
    testSummary: '发布后记录测试结果',
    testDescription: '在相似条件下发布原图和处理后的图片，并记录哪张效果更好。记录只保存在此设备，不会保存照片。',
    date: '测试日期',
    device: '设备',
    appVersion: 'Instagram 版本',
    postType: '发布类型',
    postTypes: { feed: '动态', carousel: '轮播', story: '快拍' },
    connection: '网络连接',
    connections: { wifi: 'Wi-Fi', mobile: '移动数据' },
    highQuality: '已开启“以最高画质上传”',
    usedFilter: '使用了 Instagram 滤镜',
    addedExtras: '添加了文字、贴纸或音乐',
    preferred: '在 Instagram 上哪张效果更好？',
    notes: '清晰度、颜色或瑕疵记录',
    saveTest: '保存测试',
    savedTests: '保存在此设备的测试',
    clearTests: '清除历史',
    testSaved: '测试已保存在此设备。',
    testSaveError: '无法在此设备保存测试。',
    noSavedTests: '暂无已保存的测试。',
    labSummary: '实验室 · 比较版本',
    labDescription: '使用相同构图生成选项并比较实际导出的文件。此比较仅显示本工具处理造成的差异，不预测 Instagram 的压缩效果。',
    generateVariants: '生成 A–E',
    generatingVariants: '正在生成版本…',
    variantNames: { A: '原图', B: '高保真', C: '均衡', D: 'PNG', E: '1440 参考' },
    variantDescriptions: {
      A: '原始文件，不作更改。',
      B: 'JPEG 98，使用所选输出尺寸。',
      C: 'JPEG 92，使用所选输出尺寸。',
      D: '无损 PNG 编码；裁剪和缩放仍会改变像素。',
      E: 'JPEG 92，目标 1440 像素；不会放大到超出原图像素。',
    },
    labWarning: '发布后的效果可能不同。我们不会给出预测评分，也不会模拟 Instagram 算法。',
    compareMode: '视图',
    compareSlider: '滑块',
    compareToggle: 'A/B',
    reveal: '显示处理版本',
    labZoom: '同步缩放',
    panHint: '放大后拖动图片，可在两个版本中查看相同区域。',
    noMetric: '我们不计算质量分数；请在 Instagram 中比较文件大小和视觉效果。',
    downloadVariant: '下载版本',
    downloadVariants: 'ZIP',
    variantsReady: '版本已准备好比较。',
    variantsError: '此设备无法生成所有版本。请尝试较小的图片。',
    generating: '生成中',
    variant: '版本',
  },
};

const supportedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']);

const getItemKey = (file: File): string => `${file.name}-${file.size}-${file.lastModified}`;

const getExtensionForMime = (mimeType: string): string => {
  if (mimeType === 'image/jpeg') return 'jpg';
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/webp') return 'webp';
  return 'jpg';
};

const getOutputMimeType = (format: OutputFormat, inputType: string): string => {
  if (format === 'jpeg') return 'image/jpeg';
  if (format === 'png') return 'image/png';
  if (format === 'webp') return 'image/webp';
  if (inputType === 'image/png') return 'image/png';
  if (inputType === 'image/webp') return 'image/webp';
  return 'image/jpeg';
};

const getInputMimeType = (file: File): string => {
  const type = file.type.toLowerCase();
  if (supportedTypes.has(type)) return type;

  const lowerName = file.name.toLowerCase();
  if (/\.png$/.test(lowerName)) return 'image/png';
  if (/\.webp$/.test(lowerName)) return 'image/webp';
  if (/\.heic$/.test(lowerName)) return 'image/heic';
  if (/\.heif$/.test(lowerName)) return 'image/heif';
  return 'image/jpeg';
};

const getTarget = (presetId: InstagramPresetId, customTarget?: InstagramPreset) => {
  if (presetId === 'original') return undefined;
  if (presetId === 'custom') return customTarget;
  if (presetId === 'profile') return INSTAGRAM_PRESETS.profile;
  return INSTAGRAM_PRESETS[presetId];
};

const loadBitmap = async (file: File): Promise<ImageBitmap> => {
  if (typeof createImageBitmap !== 'function') {
    throw new Error('image_decode_failed');
  }

  return createImageBitmap(file, { imageOrientation: 'from-image' });
};

const exportCanvas = (canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('image_export_failed'));
        return;
      }

      if (blob.type !== mimeType) {
        reject(new Error('format_unsupported'));
        return;
      }

      resolve(blob);
    }, mimeType, quality);
  });

const renderImageVariant = async (
  item: OptimizerItem,
  bitmap: ImageBitmap,
  target: InstagramPreset,
  outputMimeType: string,
  quality: number,
): Promise<{ file: File; width: number; height: number }> => {
  const ratio = target.width / target.height;
  const crop = calculateCropRectangle(bitmap.width, bitmap.height, ratio, item.crop);
  const outputSize = calculateOutputDimensions(crop, target);
  const canvas = document.createElement('canvas');
  canvas.width = outputSize.width;
  canvas.height = outputSize.height;
  try {
    const context = canvas.getContext('2d', { alpha: outputMimeType !== 'image/jpeg' });
    if (!context) throw new Error('canvas_unavailable');

    if (outputMimeType === 'image/jpeg') {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(bitmap, crop.x, crop.y, crop.width, crop.height, 0, 0, outputSize.width, outputSize.height);

    const blob = await exportCanvas(canvas, outputMimeType, quality);
    const output = new File(
      [blob],
      buildInstagramOutputName(item.file.name, getExtensionForMime(outputMimeType)),
      { type: outputMimeType, lastModified: Date.now() },
    );
    return { file: output, width: outputSize.width, height: outputSize.height };
  } finally {
    canvas.width = 0;
    canvas.height = 0;
  }
};

const optimizeItem = async (
  item: OptimizerItem,
  presetId: InstagramPresetId,
  format: OutputFormat,
  quality: number,
  targetOverride?: InstagramPreset,
): Promise<{ file: File; width: number; height: number; unchanged: boolean }> => {
  const target = getTarget(presetId, targetOverride);
  if (!target) return { file: item.file, width: item.width, height: item.height, unchanged: true };

  const withinTarget = isImageAlreadyWithinPreset(item.width, item.height, target);
  const centered = item.crop.x === 0.5 && item.crop.y === 0.5 && item.crop.zoom === 1;
  if (format === 'auto' && withinTarget && centered) {
    return { file: item.file, width: item.width, height: item.height, unchanged: true };
  }

  const outputMimeType = getOutputMimeType(format, getInputMimeType(item.file));
  const bitmap = await loadBitmap(item.file);
  try {
    const result = await renderImageVariant(item, bitmap, target, outputMimeType, quality);
    return { ...result, unchanged: false };
  } finally {
    bitmap.close();
  }
};

const getStatusLabel = (
  ui: (typeof uiByLocale)[AppLocale],
  status: ItemStatus,
): string => {
  if (status === 'processing') return ui.processing;
  if (status === 'done') return ui.done;
  if (status === 'error') return ui.error;
  return ui.ready;
};

const getLocalDateString = (): string => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
};

export function InstagramImageOptimizerTool({
  locale = 'pt-br',
}: InstagramImageOptimizerToolProps) {
  const ui = uiByLocale[locale];
  const [items, setItems] = useState<OptimizerItem[]>([]);
  const itemsRef = useRef(items);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [presetId, setPresetId] = useState<InstagramPresetId>('feed-34');
  const [customWidth, setCustomWidth] = useState(1080);
  const [customHeight, setCustomHeight] = useState(1350);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('auto');
  const [jpegQuality, setJpegQuality] = useState(92);
  const [isReadingFiles, setIsReadingFiles] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCreatingZip, setIsCreatingZip] = useState(false);
  const [canShareFiles, setCanShareFiles] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [notice, setNotice] = useState<{ text: string; tone: 'error' | 'info' | 'success' } | null>(null);
  const [testRecords, setTestRecords] = useState<InstagramTestRecord[]>([]);
  const [labVariants, setLabVariants] = useState<LabVariant[]>([]);
  const [labImageId, setLabImageId] = useState<string | null>(null);
  const [selectedLabVariant, setSelectedLabVariant] = useState<LabVariantId>('C');
  const [labMode, setLabMode] = useState<LabComparisonMode>('slider');
  const [labReveal, setLabReveal] = useState(50);
  const [labZoom, setLabZoom] = useState(1);
  const [showLabOriginal, setShowLabOriginal] = useState(false);
  const [isGeneratingVariants, setIsGeneratingVariants] = useState(false);
  const [testForm, setTestForm] = useState<InstagramTestForm>({
    date: '',
    device: '',
    appVersion: '',
    postType: 'feed',
    connection: 'wifi',
    highQuality: false,
    usedFilter: false,
    addedExtras: false,
    preferred: 'prepared',
    notes: '',
  });
  const cancelRef = useRef(false);
  const cancelLabRef = useRef(false);
  const dragOriginRef = useRef<DragOrigin | null>(null);
  const fileInputLocked = isProcessing || isReadingFiles || isGeneratingVariants;
  const labVariantsRef = useRef(labVariants);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    labVariantsRef.current = labVariants;
  }, [labVariants]);

  useEffect(() => {
    setCanShareFiles(typeof navigator !== 'undefined' && typeof navigator.share === 'function' && typeof navigator.canShare === 'function');
  }, []);

  useEffect(() => {
    setTestForm((current) => ({ ...current, date: current.date || getLocalDateString() }));
    try {
      const saved = localStorage.getItem(TEST_HISTORY_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) setTestRecords(parsed.slice(0, 20) as InstagramTestRecord[]);
      }
    } catch {
      setTestRecords([]);
    }
  }, []);

  useEffect(
    () => () => {
      cancelLabRef.current = true;
      itemsRef.current.forEach((item) => {
        if (item.sourceUrl) URL.revokeObjectURL(item.sourceUrl);
        if (item.outputUrl && item.outputUrl !== item.sourceUrl) URL.revokeObjectURL(item.outputUrl);
      });
      labVariantsRef.current.forEach((variant) => {
        if (!variant.unchanged) URL.revokeObjectURL(variant.url);
      });
    }, [],
  );

  const activeItem = items.find((item) => item.id === activeId) ?? items[0];
  const processedItems = useMemo(() => items.filter((item) => item.output), [items]);
  const activeLabVariants = labImageId === activeItem?.id ? labVariants : [];
  const selectedLabVariantRecord = activeLabVariants.find((variant) => variant.id === selectedLabVariant);
  const customTarget: InstagramPreset = { id: 'profile', width: customWidth, height: customHeight };
  const activeTarget = activeItem ? getTarget(presetId, customTarget) : undefined;
  const cropRatio = activeTarget
    ? activeTarget.width / activeTarget.height
    : activeItem
      ? activeItem.width / activeItem.height
      : 1;

  const revokeOutput = (item: OptimizerItem) => {
    if (item.outputUrl && item.outputUrl !== item.sourceUrl) URL.revokeObjectURL(item.outputUrl);
  };

  const clearLabVariants = () => {
    cancelLabRef.current = true;
    labVariantsRef.current.forEach((variant) => {
      if (!variant.unchanged) URL.revokeObjectURL(variant.url);
    });
    labVariantsRef.current = [];
    setLabVariants([]);
    setLabImageId(null);
  };

  const invalidateResults = (id?: string) => {
    const targets = itemsRef.current.filter((item) => !id || item.id === id);
    targets.forEach(revokeOutput);
    setItems((current) =>
      current.map((item) => {
        if (id && item.id !== id) return item;
        return {
          ...item,
          status: item.errorMessage ? 'error' : 'ready',
          output: undefined,
          outputUrl: undefined,
          outputWidth: undefined,
          outputHeight: undefined,
        };
      }),
    );
  };

  const addFiles = async (files: File[]) => {
    if (!files.length || fileInputLocked) return;

    const knownKeys = new Set(itemsRef.current.map((item) => getItemKey(item.file)));
    const uniqueFiles = files.filter((file) => {
      const key = getItemKey(file);
      if (knownKeys.has(key)) return false;
      knownKeys.add(key);
      return true;
    });
    const capacity = Math.max(0, MAX_FILES - itemsRef.current.length);

    if (uniqueFiles.length > capacity) setNotice({ text: ui.maxFiles, tone: 'error' });
    const selectedFiles = uniqueFiles.slice(0, capacity);
    if (!selectedFiles.length) return;

    setIsReadingFiles(true);
    setNotice(null);
    trackEvent('file_uploaded', {
      tool: TOOL_ID.instagramImageOptimizer,
      locale,
      count: selectedFiles.length,
    });

    const newItems: OptimizerItem[] = [];
    for (const file of selectedFiles) {
      const id = `${getItemKey(file)}-${Math.random().toString(36).slice(2, 8)}`;
      const lowerName = file.name.toLowerCase();
      const supportedByName = /\.(jpe?g|png|webp|heic|heif)$/.test(lowerName);

      if (file.size > MAX_FILE_BYTES) {
        newItems.push({
          id,
          file,
          width: 0,
          height: 0,
          crop: { x: 0.5, y: 0.5, zoom: 1 },
          status: 'error',
          errorMessage: ui.fileTooLarge,
        });
        continue;
      }

      if (!supportedTypes.has(file.type.toLowerCase()) && !supportedByName) {
        newItems.push({
          id,
          file,
          width: 0,
          height: 0,
          crop: { x: 0.5, y: 0.5, zoom: 1 },
          status: 'error',
          errorMessage: ui.unsupportedFormat,
        });
        continue;
      }

      try {
        const bitmap = await loadBitmap(file);
        const width = bitmap.width;
        const height = bitmap.height;
        bitmap.close();

        if (width * height > MAX_IMAGE_PIXELS) {
          newItems.push({
            id,
            file,
            width,
            height,
            crop: { x: 0.5, y: 0.5, zoom: 1 },
            status: 'error',
            errorMessage: ui.imageTooLarge,
          });
          continue;
        }

        newItems.push({
          id,
          file,
          sourceUrl: URL.createObjectURL(file),
          width,
          height,
          crop: { x: 0.5, y: 0.5, zoom: 1 },
          status: 'ready',
        });
      } catch {
        newItems.push({
          id,
          file,
          width: 0,
          height: 0,
          crop: { x: 0.5, y: 0.5, zoom: 1 },
          status: 'error',
          errorMessage: ui.decodeError,
        });
      }
    }

    setItems((current) => [...current, ...newItems]);
    setActiveId((current) => current ?? newItems[0]?.id ?? null);
    setIsReadingFiles(false);
  };

  const removeItem = (id: string) => {
    const target = itemsRef.current.find((item) => item.id === id);
    if (target) {
      if (target.sourceUrl) URL.revokeObjectURL(target.sourceUrl);
      revokeOutput(target);
    }

    const nextItems = itemsRef.current.filter((item) => item.id !== id);
    if (labImageId === id) clearLabVariants();
    setItems(nextItems);
    if (activeId === id) setActiveId(nextItems[0]?.id ?? null);
  };

  const moveItem = (id: string, direction: -1 | 1) => {
    setItems((current) => {
      const index = current.findIndex((item) => item.id === id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  const changePreset = (nextPreset: InstagramPresetId) => {
    if (nextPreset === presetId) return;
    clearLabVariants();
    invalidateResults();
    setPresetId(nextPreset);
    setItems((current) =>
      current.map((item) => ({ ...item, crop: { x: 0.5, y: 0.5, zoom: 1 } })),
    );
  };

  const updateCrop = (id: string, nextCrop: CropPosition) => {
    if (labImageId === id) clearLabVariants();
    const target = itemsRef.current.find((item) => item.id === id);
    if (target) revokeOutput(target);
    setItems((current) =>
      current.map((item) => item.id === id
        ? {
            ...item,
            crop: nextCrop,
            status: item.errorMessage ? 'error' : 'ready',
            output: undefined,
            outputUrl: undefined,
            outputWidth: undefined,
            outputHeight: undefined,
          }
        : item),
    );
  };

  const runOptimization = async () => {
    const validItems = itemsRef.current.filter((item) => item.sourceUrl && !item.errorMessage);
    if (!validItems.length || isProcessing) {
      setNotice({ text: ui.noImages, tone: 'error' });
      return;
    }

    cancelRef.current = false;
    setIsProcessing(true);
    setNotice(null);
    setProgress({ current: 0, total: validItems.length });
    trackEvent('tool_started', {
      tool: TOOL_ID.instagramImageOptimizer,
      locale,
      mode: validItems.length > 1 ? 'batch' : 'single',
    });

    let completed = 0;
    let failed = 0;

    for (const [index, item] of validItems.entries()) {
      if (cancelRef.current) break;

      setProgress({ current: index + 1, total: validItems.length });
      setItems((current) =>
        current.map((currentItem) =>
          currentItem.id === item.id ? { ...currentItem, status: 'processing', errorMessage: undefined } : currentItem,
        ),
      );

      try {
        const result = await optimizeItem(item, presetId, outputFormat, jpegQuality / 100, customTarget);
        const outputUrl = result.unchanged ? item.sourceUrl : URL.createObjectURL(result.file);
        setItems((current) =>
          current.map((currentItem) =>
            currentItem.id === item.id
              ? {
                  ...currentItem,
                  status: 'done',
                  output: result.file,
                  outputUrl,
                  outputWidth: result.width,
                  outputHeight: result.height,
                  errorMessage: undefined,
                }
              : currentItem,
          ),
        );
        completed += 1;
      } catch (error) {
        const errorMessage = error instanceof Error && error.message === 'format_unsupported'
          ? ui.allFormatsUnsupported
          : ui.processError;
        setItems((current) =>
          current.map((currentItem) =>
            currentItem.id === item.id
              ? { ...currentItem, status: 'error', errorMessage, output: undefined, outputUrl: undefined }
              : currentItem,
          ),
        );
        failed += 1;
      }
    }

    setIsProcessing(false);
    if (completed) {
      trackEvent('tool_completed', {
        tool: TOOL_ID.instagramImageOptimizer,
        locale,
        count: completed,
        format: outputFormat,
      });
    }
    if (failed) {
      trackEvent('tool_error', {
        tool: TOOL_ID.instagramImageOptimizer,
        locale,
        error_type: 'processing_failed',
        count: failed,
      });
    }
  };

  const downloadItem = (item: OptimizerItem) => {
    if (!item.output) {
      setNotice({ text: ui.noDownload, tone: 'error' });
      return;
    }

    downloadBlob(item.output, item.output.name || item.file.name);
    trackEvent('result_downloaded', {
      tool: TOOL_ID.instagramImageOptimizer,
      locale,
      method: 'single',
      format: item.output.type.replace('image/', ''),
    });
  };

  const generateLabVariants = async () => {
    if (!activeItem?.sourceUrl || !activeItem.width || !activeItem.height || isGeneratingVariants) {
      setNotice({ text: ui.noImages, tone: 'error' });
      return;
    }

    clearLabVariants();
    cancelLabRef.current = false;
    setIsGeneratingVariants(true);
    setNotice(null);
    trackEvent('generation_started', { tool: TOOL_ID.instagramImageOptimizer, locale, mode: 'lab' });

    const baseTarget: InstagramPreset = getTarget(presetId, customTarget) ?? {
      id: 'profile',
      width: activeItem.width,
      height: activeItem.height,
    };
    const experimentalTarget: InstagramPreset = {
      ...baseTarget,
      width: Math.round(baseTarget.width * (4 / 3)),
      height: Math.round(baseTarget.height * (4 / 3)),
    };
    const bitmapVariants: Array<{
      id: Exclude<LabVariantId, 'A'>;
      target: InstagramPreset;
      mimeType: string;
      quality: number;
    }> = [
      { id: 'B', target: baseTarget, mimeType: 'image/jpeg', quality: 0.98 },
      { id: 'C', target: baseTarget, mimeType: 'image/jpeg', quality: 0.92 },
      { id: 'D', target: baseTarget, mimeType: 'image/png', quality: 1 },
      { id: 'E', target: experimentalTarget, mimeType: 'image/jpeg', quality: 0.92 },
    ];
    const created: LabVariant[] = [{
      id: 'A',
      file: activeItem.file,
      url: activeItem.sourceUrl,
      width: activeItem.width,
      height: activeItem.height,
      unchanged: true,
    }];

    try {
      const bitmap = await loadBitmap(activeItem.file);
      try {
        for (const candidate of bitmapVariants) {
          if (cancelLabRef.current) break;
          const result = await renderImageVariant(
            activeItem,
            bitmap,
            candidate.target,
            candidate.mimeType,
            candidate.quality,
          );
          const extension = getExtensionForMime(candidate.mimeType);
          const variantName = buildInstagramOutputName(activeItem.file.name, extension)
            .replace(/-instagram\./, `-lab-${candidate.id.toLowerCase()}.`);
          const namedFile = new File([result.file], variantName, {
            type: result.file.type,
            lastModified: result.file.lastModified,
          });
          created.push({
            id: candidate.id,
            file: namedFile,
            url: URL.createObjectURL(namedFile),
            width: result.width,
            height: result.height,
            unchanged: false,
          });
          await new Promise<void>((resolve) => window.setTimeout(resolve, 0));
        }
      } finally {
        bitmap.close();
      }

      if (cancelLabRef.current) {
        created.forEach((variant) => {
          if (!variant.unchanged) URL.revokeObjectURL(variant.url);
        });
        setNotice(null);
        return;
      }

      labVariantsRef.current = created;
      setLabVariants(created);
      setLabImageId(activeItem.id);
      setSelectedLabVariant('C');
      setShowLabOriginal(false);
      setLabMode('slider');
      setLabReveal(50);
      setLabZoom(1);
      setNotice({ text: ui.variantsReady, tone: 'success' });
      trackEvent('tool_completed', {
        tool: TOOL_ID.instagramImageOptimizer,
        locale,
        mode: 'lab',
        count: created.length - 1,
      });
    } catch {
      created.forEach((variant) => {
        if (!variant.unchanged) URL.revokeObjectURL(variant.url);
      });
      setNotice({ text: ui.variantsError, tone: 'error' });
      trackEvent('tool_error', {
        tool: TOOL_ID.instagramImageOptimizer,
        locale,
        error_type: 'processing_failed',
      });
    } finally {
      setIsGeneratingVariants(false);
    }
  };

  const downloadLabVariant = (variant: LabVariant) => {
    downloadBlob(variant.file, variant.file.name);
    trackEvent('result_downloaded', {
      tool: TOOL_ID.instagramImageOptimizer,
      locale,
      method: variant.id === 'A' ? 'original' : 'lab_variant',
      format: variant.file.type.replace('image/', ''),
    });
  };

  const shareLabVariant = async (variant: LabVariant) => {
    if (!navigator.share || !navigator.canShare?.({ files: [variant.file] })) return;
    setIsSharing(true);
    try {
      await navigator.share({ files: [variant.file], title: ui.variantNames[variant.id] });
      trackEvent('result_shared', {
        tool: TOOL_ID.instagramImageOptimizer,
        locale,
        method: 'web_share',
        format: variant.file.type.replace('image/', ''),
      });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        setNotice({ text: ui.shareError, tone: 'error' });
      }
    } finally {
      setIsSharing(false);
    }
  };

  const downloadLabZip = async () => {
    if (!labVariants.length || isCreatingZip) return;
    setIsCreatingZip(true);
    setNotice(null);
    try {
      const zip = await import('@zip.js/zip.js');
      const writer = new zip.ZipWriter(new zip.BlobWriter('application/zip'), { bufferedWrite: true });
      for (const variant of labVariants) {
        const originalExtension = variant.file.name.match(/\.([^.]+)$/)?.[1] ?? 'jpg';
        const extension = variant.id === 'A' ? originalExtension : getExtensionForMime(variant.file.type);
        const name = buildInstagramOutputName(variant.file.name, extension).replace(/-instagram(?=\.)/, '');
        await writer.add(`${variant.id}-${name}`, new zip.BlobReader(variant.file));
      }
      downloadBlob(await writer.close(), 'instagram-variantes-A-E.zip');
      trackEvent('result_downloaded', {
        tool: TOOL_ID.instagramImageOptimizer,
        locale,
        method: 'lab_zip',
        count: labVariants.length,
      });
    } catch {
      setNotice({ text: ui.zipError, tone: 'error' });
    } finally {
      setIsCreatingZip(false);
    }
  };

  const downloadOriginal = (item: OptimizerItem) => {
    downloadBlob(item.file, item.file.name);
    trackEvent('result_downloaded', {
      tool: TOOL_ID.instagramImageOptimizer,
      locale,
      method: 'original',
      format: getInputMimeType(item.file).replace('image/', ''),
    });
  };

  const saveTestRecord = () => {
    const record: InstagramTestRecord = {
      ...testForm,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
    };
    const nextRecords = [record, ...testRecords].slice(0, 20);

    try {
      localStorage.setItem(TEST_HISTORY_KEY, JSON.stringify(nextRecords));
      setTestRecords(nextRecords);
      setNotice({ text: ui.testSaved, tone: 'success' });
    } catch {
      setNotice({ text: ui.testSaveError, tone: 'error' });
    }
  };

  const clearTestHistory = () => {
    try {
      localStorage.removeItem(TEST_HISTORY_KEY);
      setTestRecords([]);
      setNotice(null);
    } catch {
      setNotice({ text: ui.testSaveError, tone: 'error' });
    }
  };

  const shareItem = async (item: OptimizerItem) => {
    if (!item.output || !navigator.canShare?.({ files: [item.output] }) || !navigator.share) return;
    setIsSharing(true);
    try {
      await navigator.share({ files: [item.output], title: ui.prepared });
      trackEvent('result_shared', {
        tool: TOOL_ID.instagramImageOptimizer,
        locale,
        method: 'web_share',
        format: item.output.type.replace('image/', ''),
      });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        setNotice({ text: ui.shareError, tone: 'error' });
      }
    } finally {
      setIsSharing(false);
    }
  };

  const downloadZip = async () => {
    const completedItems = itemsRef.current.filter((item) => item.output);
    if (!completedItems.length || isCreatingZip) {
      setNotice({ text: ui.noDownload, tone: 'error' });
      return;
    }

    setIsCreatingZip(true);
    setNotice(null);
    try {
      const zip = await import('@zip.js/zip.js');
      const writer = new zip.ZipWriter(new zip.BlobWriter('application/zip'), {
        bufferedWrite: true,
      });

      for (const item of completedItems) {
        if (item.output) {
          const baseName = item.output.name;
          const duplicateIndex = completedItems
            .slice(0, completedItems.indexOf(item))
            .filter((previous) => previous.output?.name === baseName).length;
          const zipName = duplicateIndex
            ? baseName.replace(/(\.[^.]+)$/, `-${duplicateIndex + 1}$1`)
            : baseName;
          await writer.add(zipName, new zip.BlobReader(item.output));
        }
      }

      const blob = await writer.close();
      downloadBlob(blob, 'instagram-images.zip');
      trackEvent('result_downloaded', {
        tool: TOOL_ID.instagramImageOptimizer,
        locale,
        method: 'zip',
        count: completedItems.length,
      });
    } catch {
      setNotice({ text: ui.zipError, tone: 'error' });
      trackEvent('tool_error', {
        tool: TOOL_ID.instagramImageOptimizer,
        locale,
        error_type: 'processing_failed',
      });
    } finally {
      setIsCreatingZip(false);
    }
  };

  const clearAll = () => {
    clearLabVariants();
    itemsRef.current.forEach((item) => {
      if (item.sourceUrl) URL.revokeObjectURL(item.sourceUrl);
      revokeOutput(item);
    });
    setItems([]);
    setActiveId(null);
    setNotice(null);
  };

  const handleCropPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!activeItem || presetId === 'original' || fileInputLocked) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const sourceRatio = activeItem.width / activeItem.height;
    const baseWidth = sourceRatio > cropRatio ? (sourceRatio / cropRatio) * 100 : 100;
    const baseHeight = sourceRatio > cropRatio ? 100 : (cropRatio / sourceRatio) * 100;
    const renderedWidth = bounds.width * baseWidth * activeItem.crop.zoom / 100;
    const renderedHeight = bounds.height * baseHeight * activeItem.crop.zoom / 100;

    dragOriginRef.current = {
      x: event.clientX,
      y: event.clientY,
      cropX: activeItem.crop.x,
      cropY: activeItem.crop.y,
      overflowX: Math.max(1, renderedWidth - bounds.width),
      overflowY: Math.max(1, renderedHeight - bounds.height),
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleCropPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const origin = dragOriginRef.current;
    if (!activeItem || !origin || fileInputLocked) return;
    const cropX = Math.max(0, Math.min(1, origin.cropX - (event.clientX - origin.x) / origin.overflowX));
    const cropY = Math.max(0, Math.min(1, origin.cropY - (event.clientY - origin.y) / origin.overflowY));
    updateCrop(activeItem.id, { ...activeItem.crop, x: cropX, y: cropY });
  };

  const stopCropDrag = () => {
    dragOriginRef.current = null;
  };

  const handleCropKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!activeItem || presetId === 'original' || fileInputLocked) return;
    const step = event.shiftKey ? 0.05 : 0.01;
    const changes: Partial<CropPosition> = {
      ArrowLeft: { x: Math.max(0, activeItem.crop.x - step) },
      ArrowRight: { x: Math.min(1, activeItem.crop.x + step) },
      ArrowUp: { y: Math.max(0, activeItem.crop.y - step) },
      ArrowDown: { y: Math.min(1, activeItem.crop.y + step) },
    }[event.key] ?? {};

    if (Object.keys(changes).length) {
      event.preventDefault();
      updateCrop(activeItem.id, { ...activeItem.crop, ...changes });
    }
  };

  const cropImageStyle = activeItem
    ? (() => {
        const sourceRatio = activeItem.width / activeItem.height;
        const baseWidth = sourceRatio > cropRatio ? (sourceRatio / cropRatio) * 100 : 100;
        const baseHeight = sourceRatio > cropRatio ? 100 : (cropRatio / sourceRatio) * 100;
        const width = baseWidth * activeItem.crop.zoom;
        const height = baseHeight * activeItem.crop.zoom;
        return {
          width: `${width}%`,
          height: `${height}%`,
          left: `${activeItem.crop.x * (100 - width)}%`,
          top: `${activeItem.crop.y * (100 - height)}%`,
        };
      })()
    : undefined;

  const frameWidth = `${Math.min(320, Math.max(132, cropRatio * 280))}px`;
  const getPreferredVariantLabel = (preferred: PreferredVariant): string => {
    if (preferred.startsWith('lab-')) {
      const variantId = preferred.slice(4) as LabVariantId;
      return ui.variantNames[variantId];
    }
    return preferred === 'prepared' ? ui.prepared : ui.original;
  };

  return (
    <Card className="space-y-4" padding="default">
      <FileUploadDropzone
        label={ui.uploadTitle}
        helperText={ui.uploadHint}
        acceptedDescription={ui.accepted}
        accept={acceptedImageTypes}
        multiple
        maxSize={MAX_FILE_BYTES}
        selectedFiles={EMPTY_FILES}
        onFilesSelected={addFiles}
        compact={false}
        locale={locale}
      />

      {isReadingFiles ? (
        <p className="flex items-center gap-2 text-sm text-slate-600" role="status">
          <LoaderCircle className="h-4 w-4 animate-spin text-brand-600" />
          {ui.processing}
        </p>
      ) : null}

      {items.length ? (
        <section aria-label={ui.imagesLabel(items.length)} className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-800">{ui.imagesLabel(items.length)}</p>
            <button
              type="button"
              className="text-sm font-medium text-slate-600 underline decoration-slate-300 underline-offset-4 hover:text-slate-900 disabled:opacity-50"
              onClick={clearAll}
              disabled={fileInputLocked}
            >
              {ui.clear}
            </button>
          </div>

          <div className="flex max-w-full gap-2 overflow-x-auto pb-1" role="tablist">
            {items.map((item, index) => (
              <div key={item.id} className="relative w-[4.5rem] shrink-0">
                <button
                  type="button"
                  role="tab"
                  aria-selected={item.id === activeItem?.id}
                  aria-label={`${item.file.name}, ${getStatusLabel(ui, item.status)}`}
                  onClick={() => setActiveId(item.id)}
                  className={`block w-full overflow-hidden rounded-lg border bg-white text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                    item.id === activeItem?.id ? 'border-brand-500 ring-2 ring-brand-100' : 'border-slate-200'
                  }`}
                >
                  <span className="block aspect-square bg-slate-100">
                    {item.sourceUrl ? (
                      <img src={item.sourceUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex h-full items-center justify-center text-red-600">
                        <X className="h-5 w-5" />
                      </span>
                    )}
                  </span>
                  <span className="block truncate px-1.5 py-1 text-[11px] text-slate-700">{item.file.name}</span>
                </button>
                {item.status === 'done' ? (
                  <span className="absolute -right-1 -top-1 rounded-full bg-emerald-600 p-0.5 text-white" aria-hidden="true">
                    <Check className="h-3 w-3" />
                  </span>
                ) : null}
                {!fileInputLocked ? (
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="absolute right-1 top-1 rounded-full bg-slate-950/75 p-1 text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    aria-label={ui.remove}
                  >
                    <X className="h-3 w-3" />
                  </button>
                ) : null}
                {item.id === activeItem?.id ? (
                  <span className="mt-1 flex items-center justify-center gap-1">
                    <button
                      type="button"
                      className="rounded p-1 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                      onClick={() => moveItem(item.id, -1)}
                      disabled={index === 0 || fileInputLocked}
                      aria-label={ui.moveEarlier}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="rounded p-1 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                      onClick={() => moveItem(item.id, 1)}
                      disabled={index === items.length - 1 || fileInputLocked}
                      aria-label={ui.moveLater}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </span>
                ) : null}
              </div>
            ))}
          </div>

          {activeItem?.errorMessage ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
              {activeItem.errorMessage}
            </p>
          ) : null}
        </section>
      ) : null}

      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-end gap-2 sm:gap-3">
        <label className="min-w-0 space-y-1.5">
          <span className="block text-sm font-semibold text-slate-800">{ui.destination}</span>
          <Select
            value={presetId}
            onChange={(event) => changePreset(event.target.value as InstagramPresetId)}
            disabled={fileInputLocked}
            aria-label={ui.destination}
          >
            {(Object.keys(ui.presets) as InstagramPresetId[]).map((id) => (
              <option key={id} value={id}>{ui.presets[id]}</option>
            ))}
          </Select>
        </label>
        {isProcessing ? (
          <Button variant="secondary" className="px-3" onClick={() => { cancelRef.current = true; }}>
            {ui.cancel}
          </Button>
        ) : isGeneratingVariants ? (
          <Button variant="secondary" className="px-3" onClick={() => { cancelLabRef.current = true; }}>
            {ui.cancel}
          </Button>
        ) : (
          <Button className="gap-2 px-3 sm:px-4" onClick={runOptimization} disabled={isReadingFiles || isGeneratingVariants || !items.length}>
            <ImagePlus className="h-4 w-4 shrink-0" />
            <span className="hidden min-[380px]:inline">{ui.prepare}</span>
            <span className="min-[380px]:hidden">{locale === 'pt-br' ? 'Preparar' : locale === 'es' ? 'Preparar' : 'Prepare'}</span>
          </Button>
        )}
      </div>

      {presetId === 'custom' ? (
        <div className="grid min-w-0 grid-cols-2 gap-2">
          <label className="min-w-0 space-y-1.5">
            <span className="block text-xs font-medium text-slate-700">{ui.customWidth}</span>
            <Input
              type="number"
              min={1}
              max={8192}
              value={customWidth}
              disabled={fileInputLocked}
              onChange={(event) => {
                const value = Number(event.target.value);
                setCustomWidth(Number.isFinite(value) ? Math.min(8192, Math.max(1, Math.round(value))) : 1080);
                invalidateResults();
                clearLabVariants();
              }}
            />
          </label>
          <label className="min-w-0 space-y-1.5">
            <span className="block text-xs font-medium text-slate-700">{ui.customHeight}</span>
            <Input
              type="number"
              min={1}
              max={8192}
              value={customHeight}
              disabled={fileInputLocked}
              onChange={(event) => {
                const value = Number(event.target.value);
                setCustomHeight(Number.isFinite(value) ? Math.min(8192, Math.max(1, Math.round(value))) : 1350);
                invalidateResults();
                clearLabVariants();
              }}
            />
          </label>
          <p className="col-span-2 text-[11px] leading-4 text-slate-500">{ui.customSizeHint}</p>
        </div>
      ) : null}

      {activeItem?.sourceUrl && activeTarget && (
        Math.abs(activeItem.width / activeItem.height - activeTarget.width / activeTarget.height) >= 0.001 ||
        activeItem.crop.zoom > 1 || activeItem.crop.x !== 0.5 || activeItem.crop.y !== 0.5
      ) ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900" role="status">
          {ui.cropWarning}
        </p>
      ) : null}

      {isProcessing ? (
        <div className="space-y-1" role="status" aria-live="polite">
          <div className="flex items-center justify-between gap-3 text-xs text-slate-600">
            <span>{ui.preparing(progress.current, progress.total)}</span>
            <span>{progress.total ? Math.round((progress.current / progress.total) * 100) : 0}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-brand-600 transition-[width] duration-200"
              style={{ width: `${progress.total ? (progress.current / progress.total) * 100 : 0}%` }}
            />
          </div>
        </div>
      ) : null}

      {activeItem?.sourceUrl && activeItem.width && activeItem.height ? (
        <details className="border-t border-slate-200 pt-3" onToggle={(event) => {
          if ((event.currentTarget as HTMLDetailsElement).open) setNotice(null);
        }}>
          <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800 marker:hidden">
            <span className="inline-flex items-center gap-2">
              <Move className="h-4 w-4 text-brand-600" />
              {ui.cropSummary}
              <span className="font-normal text-slate-500">· {ui.cropHelp}</span>
            </span>
          </summary>
          <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_14rem] sm:items-center">
            <div className="min-w-0">
              <div
                className="relative mx-auto max-w-full touch-none overflow-hidden rounded-lg bg-slate-900 select-none"
                style={{ width: `min(100%, ${frameWidth})`, aspectRatio: cropRatio }}
                onPointerDown={handleCropPointerDown}
                onPointerMove={handleCropPointerMove}
                onPointerUp={stopCropDrag}
                onPointerCancel={stopCropDrag}
                onKeyDown={handleCropKeyDown}
                tabIndex={presetId === 'original' ? -1 : 0}
                role="group"
                aria-label={ui.cropSummary}
                aria-describedby="instagram-crop-help"
              >
                <img
                  src={activeItem.sourceUrl}
                  alt=""
                  draggable={false}
                  className="pointer-events-none absolute max-w-none"
                  style={cropImageStyle}
                />
                <span className="pointer-events-none absolute inset-0 border border-white/70" aria-hidden="true" />
                {presetId === 'profile' ? (
                  <span className="pointer-events-none absolute inset-[5%] rounded-full border-2 border-dashed border-white/80" aria-hidden="true" />
                ) : null}
                {presetId === 'story' ? (
                  <span className="pointer-events-none absolute inset-x-0 top-[15%] bottom-[15%] border-y border-dashed border-white/80" aria-hidden="true" />
                ) : null}
                <span className="pointer-events-none absolute inset-y-0 left-1/3 border-l border-white/40" aria-hidden="true" />
                <span className="pointer-events-none absolute inset-y-0 left-2/3 border-l border-white/40" aria-hidden="true" />
                <span className="pointer-events-none absolute inset-x-0 top-1/3 border-t border-white/40" aria-hidden="true" />
                <span className="pointer-events-none absolute inset-x-0 top-2/3 border-t border-white/40" aria-hidden="true" />
              </div>
            </div>
            <div className="space-y-3">
              <p id="instagram-crop-help" className="text-xs leading-5 text-slate-600">{ui.cropHelp}</p>
              <label className="block space-y-2">
                <span className="flex items-center justify-between text-sm text-slate-700">
                  <span>{ui.zoom}</span>
                  <span>{activeItem.crop.zoom.toFixed(1)}×</span>
                </span>
                <input
                  type="range"
                  min="1"
                  max="2"
                  step="0.05"
                  value={activeItem.crop.zoom}
                  onChange={(event) => updateCrop(activeItem.id, {
                    ...activeItem.crop,
                    zoom: Number(event.target.value),
                  })}
                  disabled={fileInputLocked || presetId === 'original'}
                  className="h-2 w-full cursor-pointer accent-brand-600 disabled:cursor-not-allowed"
                  aria-label={ui.zoom}
                />
              </label>
              <Button
                variant="secondary"
                className="h-9 w-full gap-2 px-3"
                onClick={() => updateCrop(activeItem.id, { x: 0.5, y: 0.5, zoom: 1 })}
                disabled={fileInputLocked || presetId === 'original'}
              >
                <RotateCcw className="h-4 w-4" />
                {ui.resetCrop}
              </Button>
            </div>
          </div>
        </details>
      ) : null}

      <details className="border-t border-slate-200 pt-3">
        <summary className="cursor-pointer text-sm font-semibold text-slate-800">{ui.advanced}</summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="min-w-0 space-y-1.5">
            <span className="block text-sm font-medium text-slate-700">{ui.outputFormat}</span>
            <Select
              value={outputFormat}
              onChange={(event) => {
                invalidateResults();
                setOutputFormat(event.target.value as OutputFormat);
              }}
              disabled={fileInputLocked}
            >
              {(Object.keys(ui.formats) as OutputFormat[]).map((format) => (
                <option key={format} value={format}>{ui.formats[format]}</option>
              ))}
            </Select>
          </label>
          <label className="block space-y-1.5">
            <span className="flex items-center justify-between text-sm font-medium text-slate-700">
              <span>{ui.quality}</span>
              <span>{jpegQuality}%</span>
            </span>
            <input
              type="range"
              min="85"
              max="98"
              step="1"
              value={jpegQuality}
              onChange={(event) => {
                invalidateResults();
                setJpegQuality(Number(event.target.value));
              }}
              disabled={fileInputLocked}
              className="h-2 w-full cursor-pointer accent-brand-600 disabled:cursor-not-allowed"
              aria-label={ui.quality}
            />
          </label>
        </div>
      </details>

      {notice ? (
        <p
          className={`rounded-lg border px-3 py-2 text-sm ${
            notice.tone === 'error'
              ? 'border-red-200 bg-red-50 text-red-800'
              : notice.tone === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-slate-200 bg-slate-50 text-slate-700'
          }`}
          role={notice.tone === 'error' ? 'alert' : 'status'}
        >
          {notice.text}
        </p>
      ) : null}

      {activeItem?.output && activeItem.outputUrl ? (
        <section className="space-y-3 border-t border-slate-200 pt-4" aria-live="polite">
          <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3">
            <figure className="min-w-0">
              <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-slate-100 p-2">
                <img src={activeItem.sourceUrl} alt={ui.original} className="max-h-full max-w-full object-contain" />
              </div>
              <figcaption className="mt-1.5 min-w-0">
                <span className="block truncate text-xs font-semibold text-slate-800">{ui.original}</span>
                <span className="block truncate text-[11px] leading-4 text-slate-600">
                  {activeItem.width} × {activeItem.height} · {getInputMimeType(activeItem.file).replace('image/', '').toUpperCase()} · {formatBytes(activeItem.file.size)}
                </span>
                <button
                  type="button"
                  className="mt-0.5 text-[11px] font-medium text-brand-700 underline underline-offset-2 hover:text-brand-900"
                  onClick={() => downloadOriginal(activeItem)}
                >
                  {ui.downloadOriginal}
                </button>
              </figcaption>
            </figure>
            <figure className="min-w-0">
              <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-slate-100 p-2">
                <img src={activeItem.outputUrl} alt={ui.prepared} className="max-h-full max-w-full object-contain" />
              </div>
              <figcaption className="mt-1.5 min-w-0">
                <span className="block truncate text-xs font-semibold text-slate-800">{ui.prepared}</span>
                <span className="block truncate text-[11px] leading-4 text-slate-600">
                  {activeItem.outputWidth} × {activeItem.outputHeight} · {activeItem.output.type.replace('image/', '').toUpperCase()} · {formatBytes(activeItem.output.size)}
                </span>
              </figcaption>
            </figure>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button className="gap-2" onClick={() => downloadItem(activeItem)}>
              <Download className="h-4 w-4" />
              {ui.download}
            </Button>
            {canShareFiles && navigator.canShare?.({ files: [activeItem.output] }) ? (
              <Button
                variant="secondary"
                className="gap-2"
                onClick={() => shareItem(activeItem)}
                disabled={isSharing}
              >
                {isSharing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
                {ui.share}
              </Button>
            ) : null}
            {processedItems.length > 1 ? (
              <Button variant="secondary" className="gap-2" onClick={downloadZip} disabled={isCreatingZip}>
                {isCreatingZip ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Archive className="h-4 w-4" />}
                {isCreatingZip ? ui.downloading : ui.downloadZip}
              </Button>
            ) : null}
          </div>
            {outputFormat === 'jpeg' && activeItem.file.type === 'image/png' ? (
              <p className="text-xs leading-5 text-amber-800">{ui.jpegTransparencyWarning}</p>
            ) : null}
          <p className="text-xs leading-5 text-slate-600">{ui.resultNote}</p>
        </section>
      ) : activeItem?.sourceUrl ? (
        <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">{ui.waiting}</p>
      ) : null}

      {activeItem?.sourceUrl ? (
        <details className="border-t border-slate-200 pt-3">
          <summary className="cursor-pointer text-sm font-semibold text-slate-800">{ui.labSummary}</summary>
          <div className="mt-3 space-y-3">
            <p className="text-xs leading-5 text-slate-600">{ui.labDescription}</p>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                className="h-9 gap-2 px-3"
                onClick={generateLabVariants}
                disabled={fileInputLocked || isGeneratingVariants}
              >
                {isGeneratingVariants ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                {isGeneratingVariants ? ui.generatingVariants : ui.generateVariants}
              </Button>
              {activeLabVariants.length ? (
                <Button
                  variant="secondary"
                  className="h-9 gap-2 px-3"
                  onClick={downloadLabZip}
                  disabled={isCreatingZip}
                  aria-label={ui.downloadZip}
                >
                  {isCreatingZip ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Archive className="h-4 w-4" />}
                  {ui.downloadVariants}
                </Button>
              ) : null}
            </div>
            {isGeneratingVariants ? (
              <p className="flex items-center gap-2 text-xs text-slate-600" role="status" aria-live="polite">
                <LoaderCircle className="h-3.5 w-3.5 animate-spin text-brand-600" />
                {ui.generatingVariants}
              </p>
            ) : null}

            {activeLabVariants.length && selectedLabVariantRecord ? (
              <div className="space-y-3 border-t border-slate-200 pt-3">
                <div className="flex max-w-full gap-2 overflow-x-auto pb-1" role="group" aria-label={ui.variant}>
                  {activeLabVariants.map((variant) => (
                    <button
                      key={variant.id}
                      type="button"
                      aria-pressed={selectedLabVariant === variant.id}
                      onClick={() => {
                        setSelectedLabVariant(variant.id);
                        setShowLabOriginal(false);
                        setLabReveal(50);
                        setLabZoom(1);
                      }}
                      className={`min-w-[8.25rem] shrink-0 rounded-lg border p-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                        selectedLabVariant === variant.id
                          ? 'border-brand-300 bg-brand-50 text-brand-800'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center justify-between gap-2 text-xs font-semibold">
                        <span>{variant.id} · {ui.variantNames[variant.id]}</span>
                        {selectedLabVariant === variant.id ? <Check className="h-3.5 w-3.5 shrink-0" /> : null}
                      </span>
                      <span className="mt-1 block truncate text-[10px] leading-4 text-slate-600">
                        {variant.width} × {variant.height} · {formatBytes(variant.file.size)}
                      </span>
                    </button>
                  ))}
                </div>

                <p className="text-xs leading-5 text-slate-600">{ui.variantDescriptions[selectedLabVariantRecord.id]}</p>
                {activeItem.file.type === 'image/png' && ['B', 'C', 'E'].includes(selectedLabVariantRecord.id) ? (
                  <p className="text-xs leading-5 text-amber-800">{ui.jpegTransparencyWarning}</p>
                ) : null}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-slate-700">{ui.compareMode}:</span>
                  <Button
                    type="button"
                    variant={labMode === 'slider' ? 'primary' : 'secondary'}
                    className="h-8 px-3 text-xs"
                    onClick={() => setLabMode('slider')}
                  >
                    {ui.compareSlider}
                  </Button>
                  <Button
                    type="button"
                    variant={labMode === 'toggle' ? 'primary' : 'secondary'}
                    className="h-8 px-3 text-xs"
                    onClick={() => setLabMode('toggle')}
                  >
                    {ui.compareToggle}
                  </Button>
                  {labMode === 'toggle' && selectedLabVariantRecord.id !== 'A' ? (
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-8 px-2 text-xs"
                      onClick={() => setShowLabOriginal((current) => !current)}
                    >
                      {showLabOriginal ? ui.original : ui.variantNames[selectedLabVariantRecord.id]}
                    </Button>
                  ) : null}
                </div>

                <div
                  className="relative mx-auto aspect-[4/3] w-full max-w-2xl overflow-auto rounded-lg bg-slate-950"
                  aria-label={`${ui.original} / ${ui.variantNames[selectedLabVariantRecord.id]}`}
                >
                  <div className="relative aspect-[4/3]" style={{ width: `${labZoom * 100}%` }}>
                    {labMode === 'toggle' && (showLabOriginal || selectedLabVariantRecord.id === 'A') ? (
                      <img
                        src={activeItem.sourceUrl}
                        alt={ui.original}
                        className="absolute inset-0 h-full w-full object-contain"
                      />
                    ) : labMode === 'toggle' ? (
                      <img
                        src={selectedLabVariantRecord.url}
                        alt={ui.variantNames[selectedLabVariantRecord.id]}
                        className="absolute inset-0 h-full w-full object-contain"
                      />
                    ) : (
                      <>
                        <img
                          src={activeItem.sourceUrl}
                          alt={ui.original}
                          className="absolute inset-0 h-full w-full object-contain"
                        />
                        {selectedLabVariantRecord.id !== 'A' ? (
                          <img
                            src={selectedLabVariantRecord.url}
                            alt={ui.variantNames[selectedLabVariantRecord.id]}
                            className="absolute inset-0 h-full w-full object-contain"
                            style={{ clipPath: `inset(0 ${100 - labReveal}% 0 0)` }}
                          />
                        ) : null}
                      </>
                    )}
                    <span className="pointer-events-none absolute left-2 top-2 rounded bg-slate-950/75 px-2 py-1 text-[10px] font-medium text-white">
                      {labMode === 'toggle' && !showLabOriginal ? ui.variantNames[selectedLabVariantRecord.id] : ui.original}
                    </span>
                    {labMode === 'slider' && selectedLabVariantRecord.id !== 'A' ? (
                      <span className="pointer-events-none absolute right-2 top-2 rounded bg-slate-950/75 px-2 py-1 text-[10px] font-medium text-white">
                        {ui.variantNames[selectedLabVariantRecord.id]}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {labMode === 'slider' && selectedLabVariantRecord.id !== 'A' ? (
                    <label className="block space-y-1.5">
                      <span className="flex items-center justify-between text-xs text-slate-700">
                        <span>{ui.reveal}</span><span>{labReveal}%</span>
                      </span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={labReveal}
                        onChange={(event) => setLabReveal(Number(event.target.value))}
                        className="h-2 w-full cursor-pointer accent-brand-600"
                        aria-label={ui.reveal}
                      />
                    </label>
                  ) : null}
                  <label className="block space-y-1.5">
                    <span className="flex items-center justify-between text-xs text-slate-700">
                      <span>{ui.labZoom}</span><span>{labZoom.toFixed(2)}×</span>
                    </span>
                    <input
                      type="range"
                      min="1"
                      max="2"
                      step="0.25"
                      value={labZoom}
                      onChange={(event) => setLabZoom(Number(event.target.value))}
                      className="h-2 w-full cursor-pointer accent-brand-600"
                      aria-label={ui.labZoom}
                    />
                    <span className="block text-[11px] leading-4 text-slate-500">{ui.panHint}</span>
                  </label>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button className="h-9 gap-2 px-3" onClick={() => downloadLabVariant(selectedLabVariantRecord)}>
                    <Download className="h-4 w-4" />
                    {ui.downloadVariant} {selectedLabVariantRecord.id}
                  </Button>
                  {canShareFiles && navigator.canShare?.({ files: [selectedLabVariantRecord.file] }) ? (
                    <Button
                      variant="secondary"
                      className="h-9 gap-2 px-3"
                      onClick={() => shareLabVariant(selectedLabVariantRecord)}
                      disabled={isSharing}
                    >
                      {isSharing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
                      {ui.share}
                    </Button>
                  ) : null}
                  <span className="text-xs text-slate-600">{formatBytes(selectedLabVariantRecord.file.size)}</span>
                </div>
                <p className="text-xs leading-5 text-slate-600">{ui.noMetric} {ui.labWarning}</p>
              </div>
            ) : null}
          </div>
        </details>
      ) : null}

      {activeItem?.output || activeLabVariants.length ? (
        <details className="border-t border-slate-200 pt-3">
          <summary className="cursor-pointer text-sm font-semibold text-slate-800">{ui.testSummary}</summary>
          <div className="mt-3 space-y-3">
            <p className="text-xs leading-5 text-slate-600">{ui.testDescription}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1.5">
                <span className="block text-xs font-medium text-slate-700">{ui.date}</span>
                <Input
                  type="date"
                  value={testForm.date}
                  onChange={(event) => setTestForm((current) => ({ ...current, date: event.target.value }))}
                />
              </label>
              <label className="space-y-1.5">
                <span className="block text-xs font-medium text-slate-700">{ui.postType}</span>
                <Select
                  value={testForm.postType}
                  onChange={(event) => setTestForm((current) => ({ ...current, postType: event.target.value as PostType }))}
                >
                  {(Object.keys(ui.postTypes) as PostType[]).map((type) => (
                    <option key={type} value={type}>{ui.postTypes[type]}</option>
                  ))}
                </Select>
              </label>
              <label className="space-y-1.5">
                <span className="block text-xs font-medium text-slate-700">{ui.device}</span>
                <Input
                  value={testForm.device}
                  onChange={(event) => setTestForm((current) => ({ ...current, device: event.target.value }))}
                  maxLength={80}
                />
              </label>
              <label className="space-y-1.5">
                <span className="block text-xs font-medium text-slate-700">{ui.appVersion}</span>
                <Input
                  value={testForm.appVersion}
                  onChange={(event) => setTestForm((current) => ({ ...current, appVersion: event.target.value }))}
                  maxLength={40}
                />
              </label>
              <label className="space-y-1.5">
                <span className="block text-xs font-medium text-slate-700">{ui.connection}</span>
                <Select
                  value={testForm.connection}
                  onChange={(event) => setTestForm((current) => ({ ...current, connection: event.target.value as 'wifi' | 'mobile' }))}
                >
                  {(Object.keys(ui.connections) as Array<'wifi' | 'mobile'>).map((connection) => (
                    <option key={connection} value={connection}>{ui.connections[connection]}</option>
                  ))}
                </Select>
              </label>
              <label className="space-y-1.5">
                <span className="block text-xs font-medium text-slate-700">{ui.preferred}</span>
              <Select
                value={testForm.preferred}
                onChange={(event) => setTestForm((current) => ({ ...current, preferred: event.target.value as PreferredVariant }))}
              >
                <option value="original">{ui.original}</option>
                <option value="prepared">{ui.prepared}</option>
                {activeLabVariants.filter((variant) => variant.id !== 'A').map((variant) => (
                  <option key={variant.id} value={`lab-${variant.id}`}>
                    {variant.id} · {ui.variantNames[variant.id]}
                  </option>
                ))}
              </Select>
              </label>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {([
                ['highQuality', 'highQuality'],
                ['usedFilter', 'usedFilter'],
                ['addedExtras', 'addedExtras'],
              ] as const).map(([field, label]) => (
                <label key={field} className="flex min-w-0 items-start gap-2 text-xs leading-5 text-slate-700">
                  <input
                    type="checkbox"
                    className="mt-1 shrink-0 accent-brand-600"
                    checked={testForm[field]}
                    onChange={(event) => setTestForm((current) => ({ ...current, [field]: event.target.checked }))}
                  />
                  <span>{ui[label]}</span>
                </label>
              ))}
            </div>
            <label className="block space-y-1.5">
              <span className="block text-xs font-medium text-slate-700">{ui.notes}</span>
              <Textarea
                value={testForm.notes}
                onChange={(event) => setTestForm((current) => ({ ...current, notes: event.target.value }))}
                rows={2}
                maxLength={500}
              />
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <Button className="h-9 px-3" onClick={saveTestRecord}>{ui.saveTest}</Button>
              {testRecords.length ? (
                <Button variant="ghost" className="h-9 px-3" onClick={clearTestHistory}>{ui.clearTests}</Button>
              ) : null}
            </div>
            <section aria-label={ui.savedTests} className="space-y-2 border-t border-slate-200 pt-3">
              <h3 className="text-xs font-semibold text-slate-800">{ui.savedTests}</h3>
              {testRecords.length ? (
                <ul className="max-h-40 space-y-2 overflow-y-auto">
                  {testRecords.map((record) => (
                    <li key={record.id} className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700">
                      <p className="font-semibold">
                        {record.date} · {ui.postTypes[record.postType]} · {getPreferredVariantLabel(record.preferred)}
                      </p>
                      {record.notes ? <p className="mt-1 break-words">{record.notes}</p> : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-600">{ui.noSavedTests}</p>
              )}
            </section>
          </div>
        </details>
      ) : null}

      {items.length ? (
        <div className="space-y-1 border-t border-slate-200 pt-3 text-xs leading-5 text-slate-600">
          <p>{ui.localNote}</p>
          <p>{ui.metadataNote}</p>
        </div>
      ) : null}
    </Card>
  );
}
