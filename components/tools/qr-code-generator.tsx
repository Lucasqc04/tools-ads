'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import Image from 'next/image';
import type {
  CornerDotType,
  CornerSquareType,
  DotType,
  ErrorCorrectionLevel,
  FileExtension,
} from 'qr-code-styling';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FileUploadDropzone } from '@/components/shared/file-upload-dropzone';
import { ImageViewer } from '@/components/shared/image-viewer';
import { type AppLocale } from '@/lib/i18n/config';
import {
  blobToDataUrl,
  buildQrFileBaseName,
  copyImageBlobToClipboard,
  downloadBlob,
  getMimeForQrFormat,
  normalizeRawDataToBlob,
  readImageFileAsDataUrl,
  type QrImageFormat,
} from '@/lib/qr-code';

const DOT_TYPE_OPTIONS: Array<{ value: DotType; label: string }> = [
  { value: 'square', label: 'Quadrado' },
  { value: 'rounded', label: 'Arredondado' },
  { value: 'dots', label: 'Pontos' },
  { value: 'classy', label: 'Elegante' },
  { value: 'classy-rounded', label: 'Elegante arredondado' },
  { value: 'extra-rounded', label: 'Extra arredondado' },
];

const CORNER_SQUARE_OPTIONS: Array<{ value: CornerSquareType; label: string }> = [
  { value: 'square', label: 'Quadrado' },
  { value: 'dot', label: 'Circular' },
  { value: 'extra-rounded', label: 'Extra arredondado' },
  { value: 'classy', label: 'Elegante' },
  { value: 'classy-rounded', label: 'Elegante arredondado' },
];

const CORNER_DOT_OPTIONS: Array<{ value: CornerDotType; label: string }> = [
  { value: 'square', label: 'Quadrado' },
  { value: 'dot', label: 'Ponto' },
  { value: 'rounded', label: 'Arredondado' },
  { value: 'classy', label: 'Elegante' },
];

const ERROR_LEVEL_OPTIONS: Array<{ value: ErrorCorrectionLevel; label: string }> = [
  { value: 'L', label: 'Baixa (L)' },
  { value: 'M', label: 'Média (M)' },
  { value: 'Q', label: 'Alta (Q)' },
  { value: 'H', label: 'Muito alta (H)' },
];

type StylePreset = {
  id: 'basico' | 'redondo' | 'quadrado' | 'contraste';
  label: string;
  description: string;
  dotType: DotType;
  cornerSquareType: CornerSquareType;
  cornerDotType: CornerDotType;
  errorLevel: ErrorCorrectionLevel;
  foregroundColor: string;
  backgroundColor: string;
  margin: number;
};

const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'basico',
    label: 'Básico',
    description: 'Visual limpo, neutro e seguro para uso geral.',
    dotType: 'dots',
    cornerSquareType: 'square',
    cornerDotType: 'square',
    errorLevel: 'M',
    foregroundColor: '#111827',
    backgroundColor: '#ffffff',
    margin: 8,
  },
  {
    id: 'redondo',
    label: 'Redondo',
    description: 'Curvas suaves, bom para branding moderno.',
    dotType: 'rounded',
    cornerSquareType: 'extra-rounded',
    cornerDotType: 'dot',
    errorLevel: 'Q',
    foregroundColor: '#0f172a',
    backgroundColor: '#ffffff',
    margin: 8,
  },
  {
    id: 'quadrado',
    label: 'Quadrado',
    description: 'Visual técnico e alto contraste para leitura rápida.',
    dotType: 'square',
    cornerSquareType: 'square',
    cornerDotType: 'square',
    errorLevel: 'H',
    foregroundColor: '#111827',
    backgroundColor: '#ffffff',
    margin: 6,
  },
  {
    id: 'contraste',
    label: 'Alto contraste',
    description: 'Prioriza escaneamento em telas e impressão.',
    dotType: 'square',
    cornerSquareType: 'dot',
    cornerDotType: 'dot',
    errorLevel: 'H',
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    margin: 10,
  },
];

const DEFAULT_PRESET = STYLE_PRESETS.find((preset) => preset.id === 'redondo') ?? STYLE_PRESETS[0];
const DEFAULT_TEXT = 'https://tools.lucasqc.com';

type QrStatus = {
  type: 'success' | 'error' | 'info';
  message: string;
};

type QrRawData = Blob | Buffer | ArrayBuffer | Uint8Array;

type QrCodeStylingInstance = {
  append: (container: HTMLElement) => void;
  update: (options: unknown) => void;
  getRawData: (format: FileExtension) => Promise<QrRawData | null | undefined>;
};

type QrCodeStylingConstructor = new (options: unknown) => QrCodeStylingInstance;

function SectionCard({
  title,
  description,
  children,
}: Readonly<{
  title: string;
  description?: string;
  children: ReactNode;
}>) {
  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 md:p-5">
      <header className="space-y-1">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {description ? <p className="text-sm text-slate-600">{description}</p> : null}
      </header>
      {children}
    </section>
  );
}

type QrCodeGeneratorToolProps = Readonly<{
  locale?: AppLocale;
}>;

const qrUi = {
  'pt-br': {
    loadEngineError: 'Falha ao carregar o motor do QR Code.',
    loadEngineWithReason: 'Falha ao carregar o motor do QR Code:',
    missingContent: 'Digite um conteúdo para gerar o QR Code.',
    generateFileError: 'Não foi possível gerar o arquivo do QR Code.',
    invalidLogo: 'Selecione uma imagem válida para o logo.',
    logoApplied: 'Logo aplicado ao QR Code.',
    logoLoadError: 'Falha ao carregar logo.',
    genericActionError: 'Não foi possível concluir a ação.',
    downloadSuccessPrefix: 'Arquivo',
    downloadSuccessSuffix: 'baixado.',
    pdfTitle: 'QR Code gerado localmente',
    pdfSuccess: 'PDF baixado com sucesso.',
    copySuccess: 'Imagem copiada para a área de transferência.',
    contentLabel: 'Conteúdo do QR Code',
    contentPlaceholder: 'Cole um texto, URL, payload PIX ou qualquer conteúdo',
    contentNote:
      'Ferramenta gratuita, sem cadastro e sem login. O QR é gerado localmente no navegador.',
    previewTitle: 'Preview e exportação',
    previewDescription: 'Visualize o resultado e baixe no formato desejado.',
    previewEmpty: 'A prévia aparece automaticamente após inserir conteúdo.',
    copyImageButton: 'Copiar imagem',
    emptyWarning: 'Digite um conteúdo para gerar o QR Code.',
    presetsTitle: 'Pré-estilos',
    presetsDescription:
      'Escolha um estilo pronto para começar e depois ajuste os detalhes finos.',
    customMode: 'Você está em modo personalizado.',
    customizationTitle: 'Personalização do QR',
    customizationDescription: 'Ajuste cor, formato dos módulos e parâmetros de leitura.',
    qrColor: 'Cor do QR',
    backgroundColor: 'Cor de fundo',
    dotStyle: 'Estilo dos pontos',
    errorCorrection: 'Correção de erro',
    outerCornerStyle: 'Estilo do canto externo',
    cornerDotStyle: 'Estilo do ponto de canto',
    sizeLabel: 'Tamanho',
    marginLabel: 'Margem',
    logoScaleLabel: 'Escala do logo',
    logoSectionTitle: 'Logo central (opcional)',
    logoSectionDescription: 'Arraste e solte uma imagem ou selecione manualmente.',
    dragHint: 'Arraste sua imagem aqui ou clique para selecionar',
    supportedFormats: 'PNG, JPG, SVG e WEBP são suportados.',
    chooseImage: 'Escolher imagem',
    logoMarginLabel: 'Margem interna do logo',
    logoPreviewAlt: 'Preview do logo',
    logoLoadedFallback: 'Logo carregado',
    logoAppliedCenter: 'Logo aplicado no centro do QR Code.',
    viewImage: 'Ver imagem',
    removeLogo: 'Remover logo',
  },
  en: {
    loadEngineError: 'Failed to load QR Code engine.',
    loadEngineWithReason: 'Failed to load QR Code engine:',
    missingContent: 'Enter content to generate the QR Code.',
    generateFileError: 'Could not generate the QR Code file.',
    invalidLogo: 'Select a valid image file for the logo.',
    logoApplied: 'Logo applied to the QR Code.',
    logoLoadError: 'Failed to load logo image.',
    genericActionError: 'Could not complete this action.',
    downloadSuccessPrefix: 'File',
    downloadSuccessSuffix: 'downloaded.',
    pdfTitle: 'QR Code generated locally',
    pdfSuccess: 'PDF downloaded successfully.',
    copySuccess: 'Image copied to clipboard.',
    contentLabel: 'QR Code content',
    contentPlaceholder: 'Paste text, URL, payment payload, or any content',
    contentNote:
      'Free tool with no sign-up. The QR is generated locally in your browser.',
    previewTitle: 'Preview and export',
    previewDescription: 'Preview the result and download in your preferred format.',
    previewEmpty: 'The preview appears automatically after you enter content.',
    copyImageButton: 'Copy image',
    emptyWarning: 'Enter content to generate the QR Code.',
    presetsTitle: 'Style presets',
    presetsDescription: 'Start with a preset style and fine-tune the details.',
    customMode: 'You are using custom mode.',
    customizationTitle: 'QR customization',
    customizationDescription: 'Adjust colors, module style, and scanning parameters.',
    qrColor: 'QR color',
    backgroundColor: 'Background color',
    dotStyle: 'Dot style',
    errorCorrection: 'Error correction',
    outerCornerStyle: 'Outer corner style',
    cornerDotStyle: 'Corner dot style',
    sizeLabel: 'Size',
    marginLabel: 'Margin',
    logoScaleLabel: 'Logo scale',
    logoSectionTitle: 'Center logo (optional)',
    logoSectionDescription: 'Drag and drop an image or select one manually.',
    dragHint: 'Drop your image here or click to choose one',
    supportedFormats: 'PNG, JPG, SVG, and WEBP are supported.',
    chooseImage: 'Choose image',
    logoMarginLabel: 'Logo inner margin',
    logoPreviewAlt: 'Logo preview',
    logoLoadedFallback: 'Logo loaded',
    logoAppliedCenter: 'Logo applied to QR center.',
    viewImage: 'View image',
    removeLogo: 'Remove logo',
  },
  es: {
    loadEngineError: 'No se pudo cargar el motor de QR.',
    loadEngineWithReason: 'No se pudo cargar el motor de QR:',
    missingContent: 'Ingresa contenido para generar el código QR.',
    generateFileError: 'No fue posible generar el archivo QR.',
    invalidLogo: 'Selecciona una imagen válida para el logo.',
    logoApplied: 'Logo aplicado al código QR.',
    logoLoadError: 'No se pudo cargar el logo.',
    genericActionError: 'No fue posible completar la acción.',
    downloadSuccessPrefix: 'Archivo',
    downloadSuccessSuffix: 'descargado.',
    pdfTitle: 'Código QR generado localmente',
    pdfSuccess: 'PDF descargado con éxito.',
    copySuccess: 'Imagen copiada al portapapeles.',
    contentLabel: 'Contenido del código QR',
    contentPlaceholder: 'Pega texto, URL, payload de pago o cualquier contenido',
    contentNote:
      'Herramienta gratuita y sin registro. El QR se genera localmente en tu navegador.',
    previewTitle: 'Vista previa y exportación',
    previewDescription: 'Visualiza el resultado y descárgalo en el formato deseado.',
    previewEmpty: 'La vista previa aparece automáticamente al ingresar contenido.',
    copyImageButton: 'Copiar imagen',
    emptyWarning: 'Ingresa contenido para generar el código QR.',
    presetsTitle: 'Preestilos',
    presetsDescription:
      'Elige un estilo inicial y después ajusta los detalles finos.',
    customMode: 'Estás en modo personalizado.',
    customizationTitle: 'Personalización del QR',
    customizationDescription: 'Ajusta color, forma de módulos y parámetros de lectura.',
    qrColor: 'Color del QR',
    backgroundColor: 'Color de fondo',
    dotStyle: 'Estilo de puntos',
    errorCorrection: 'Corrección de error',
    outerCornerStyle: 'Estilo de esquina externa',
    cornerDotStyle: 'Estilo del punto de esquina',
    sizeLabel: 'Tamaño',
    marginLabel: 'Margen',
    logoScaleLabel: 'Escala del logo',
    logoSectionTitle: 'Logo central (opcional)',
    logoSectionDescription: 'Arrastra una imagen o selecciónala manualmente.',
    dragHint: 'Arrastra tu imagen aquí o haz clic para seleccionarla',
    supportedFormats: 'Se admiten PNG, JPG, SVG y WEBP.',
    chooseImage: 'Elegir imagen',
    logoMarginLabel: 'Margen interno del logo',
    logoPreviewAlt: 'Vista previa del logo',
    logoLoadedFallback: 'Logo cargado',
    logoAppliedCenter: 'Logo aplicado en el centro del QR.',
    viewImage: 'Ver imagen',
    removeLogo: 'Quitar logo',
  },
} as const;

const presetLabelsByLocale = {
  'pt-br': {
    basico: { label: 'Básico', description: 'Visual limpo, neutro e seguro para uso geral.' },
    redondo: { label: 'Redondo', description: 'Curvas suaves, bom para branding moderno.' },
    quadrado: {
      label: 'Quadrado',
      description: 'Visual técnico e alto contraste para leitura rápida.',
    },
    contraste: {
      label: 'Alto contraste',
      description: 'Prioriza escaneamento em telas e impressão.',
    },
  },
  en: {
    basico: { label: 'Basic', description: 'Clean neutral look for broad usage.' },
    redondo: {
      label: 'Rounded',
      description: 'Smooth curves, useful for modern brand identity.',
    },
    quadrado: {
      label: 'Squared',
      description: 'Technical style with high contrast for fast scanning.',
    },
    contraste: {
      label: 'High contrast',
      description: 'Optimized for screens and print readability.',
    },
  },
  es: {
    basico: { label: 'Básico', description: 'Estilo limpio y neutro para uso general.' },
    redondo: {
      label: 'Redondeado',
      description: 'Curvas suaves, ideal para branding moderno.',
    },
    quadrado: {
      label: 'Cuadrado',
      description: 'Apariencia técnica con alto contraste para lectura rápida.',
    },
    contraste: {
      label: 'Alto contraste',
      description: 'Prioriza escaneo en pantalla y en impresión.',
    },
  },
} as const;

const dotTypeLabelsByLocale: Record<AppLocale, Record<DotType, string>> = {
  'pt-br': {
    square: 'Quadrado',
    rounded: 'Arredondado',
    dots: 'Pontos',
    classy: 'Elegante',
    'classy-rounded': 'Elegante arredondado',
    'extra-rounded': 'Extra arredondado',
  },
  en: {
    square: 'Square',
    rounded: 'Rounded',
    dots: 'Dots',
    classy: 'Classy',
    'classy-rounded': 'Classy rounded',
    'extra-rounded': 'Extra rounded',
  },
  es: {
    square: 'Cuadrado',
    rounded: 'Redondeado',
    dots: 'Puntos',
    classy: 'Elegante',
    'classy-rounded': 'Elegante redondeado',
    'extra-rounded': 'Extra redondeado',
  },
};

const cornerSquareLabelsByLocale: Record<
  AppLocale,
  Partial<Record<CornerSquareType, string>>
> = {
  'pt-br': {
    square: 'Quadrado',
    dot: 'Circular',
    'extra-rounded': 'Extra arredondado',
    classy: 'Elegante',
    'classy-rounded': 'Elegante arredondado',
  },
  en: {
    square: 'Square',
    dot: 'Circle',
    'extra-rounded': 'Extra rounded',
    classy: 'Classy',
    'classy-rounded': 'Classy rounded',
  },
  es: {
    square: 'Cuadrado',
    dot: 'Circular',
    'extra-rounded': 'Extra redondeado',
    classy: 'Elegante',
    'classy-rounded': 'Elegante redondeado',
  },
};

const cornerDotLabelsByLocale: Record<
  AppLocale,
  Partial<Record<CornerDotType, string>>
> = {
  'pt-br': {
    square: 'Quadrado',
    dot: 'Ponto',
    rounded: 'Arredondado',
    classy: 'Elegante',
  },
  en: {
    square: 'Square',
    dot: 'Dot',
    rounded: 'Rounded',
    classy: 'Classy',
  },
  es: {
    square: 'Cuadrado',
    dot: 'Punto',
    rounded: 'Redondeado',
    classy: 'Elegante',
  },
};

const errorCorrectionLabelsByLocale: Record<
  AppLocale,
  Record<ErrorCorrectionLevel, string>
> = {
  'pt-br': {
    L: 'Baixa (L)',
    M: 'Média (M)',
    Q: 'Alta (Q)',
    H: 'Muito alta (H)',
  },
  en: {
    L: 'Low (L)',
    M: 'Medium (M)',
    Q: 'High (Q)',
    H: 'Very high (H)',
  },
  es: {
    L: 'Baja (L)',
    M: 'Media (M)',
    Q: 'Alta (Q)',
    H: 'Muy alta (H)',
  },
};

export function QrCodeGeneratorTool({ locale = 'pt-br' }: QrCodeGeneratorToolProps) {
  const ui = qrUi[locale];
  const presetLabels = presetLabelsByLocale[locale];
  const dotTypeLabels = dotTypeLabelsByLocale[locale];
  const cornerSquareLabels = cornerSquareLabelsByLocale[locale];
  const cornerDotLabels = cornerDotLabelsByLocale[locale];
  const errorCorrectionLabels = errorCorrectionLabelsByLocale[locale];
  const containerRef = useRef<HTMLDivElement | null>(null);
  const qrRef = useRef<QrCodeStylingInstance | null>(null);
  const statusTimerRef = useRef<number | null>(null);

  const [content, setContent] = useState(DEFAULT_TEXT);
  const [size, setSize] = useState(280);
  const [margin, setMargin] = useState(DEFAULT_PRESET.margin);
  const [dotType, setDotType] = useState<DotType>(DEFAULT_PRESET.dotType);
  const [cornerSquareType, setCornerSquareType] =
    useState<CornerSquareType>(DEFAULT_PRESET.cornerSquareType);
  const [cornerDotType, setCornerDotType] = useState<CornerDotType>(DEFAULT_PRESET.cornerDotType);
  const [errorLevel, setErrorLevel] = useState<ErrorCorrectionLevel>(DEFAULT_PRESET.errorLevel);
  const [foregroundColor, setForegroundColor] = useState(DEFAULT_PRESET.foregroundColor);
  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_PRESET.backgroundColor);

  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoFileName, setLogoFileName] = useState<string | null>(null);
  const [logoScale, setLogoScale] = useState(0.32);
  const [logoMargin, setLogoMargin] = useState(8);
  const [status, setStatus] = useState<QrStatus | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [qrPreviewDataUrl, setQrPreviewDataUrl] = useState('');
  const [isQrViewerOpen, setIsQrViewerOpen] = useState(false);
  const [isLogoViewerOpen, setIsLogoViewerOpen] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<StylePreset['id'] | 'custom'>(
    DEFAULT_PRESET.id,
  );

  const trimmedContent = content.trim();
  const hasContent = Boolean(trimmedContent);

  const qrOptions = useMemo(
    () => ({
      width: size,
      height: size,
      margin,
      data: trimmedContent,
      image: logoDataUrl ?? undefined,
      qrOptions: {
        errorCorrectionLevel: errorLevel,
      },
      dotsOptions: {
        type: dotType,
        color: foregroundColor,
      },
      cornersSquareOptions: {
        type: cornerSquareType,
        color: foregroundColor,
      },
      cornersDotOptions: {
        type: cornerDotType,
        color: foregroundColor,
      },
      backgroundOptions: {
        color: backgroundColor,
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: logoScale,
        margin: logoMargin,
      },
    }),
    [
      backgroundColor,
      cornerDotType,
      cornerSquareType,
      dotType,
      errorLevel,
      foregroundColor,
      logoDataUrl,
      logoMargin,
      logoScale,
      margin,
      size,
      trimmedContent,
    ],
  );

  const setFeedback = (nextStatus: QrStatus) => {
    setStatus(nextStatus);

    if (statusTimerRef.current) {
      window.clearTimeout(statusTimerRef.current);
    }

    statusTimerRef.current = window.setTimeout(() => {
      setStatus(null);
    }, 2600);
  };

  const markCustomPreset = () => {
    setSelectedPresetId((current) => (current === 'custom' ? current : 'custom'));
  };

  const applyPreset = (preset: StylePreset) => {
    setSelectedPresetId(preset.id);
    setDotType(preset.dotType);
    setCornerSquareType(preset.cornerSquareType);
    setCornerDotType(preset.cornerDotType);
    setErrorLevel(preset.errorLevel);
    setForegroundColor(preset.foregroundColor);
    setBackgroundColor(preset.backgroundColor);
    setMargin(preset.margin);
  };

  useEffect(() => {
    let cancelled = false;

    const setupQrEngine = async () => {
      if (!containerRef.current || qrRef.current) {
        return;
      }

      try {
        const qrModule = await import('qr-code-styling');
        if (cancelled || !containerRef.current || qrRef.current) {
          return;
        }

        const QrCodeStylingClass = qrModule.default as unknown as QrCodeStylingConstructor;
        qrRef.current = new QrCodeStylingClass({
          width: size,
          height: size,
          margin,
          data: trimmedContent || ' ',
          qrOptions: { errorCorrectionLevel: 'Q' },
          dotsOptions: { type: 'rounded', color: '#0f172a' },
          cornersSquareOptions: { type: 'extra-rounded', color: '#0f172a' },
          cornersDotOptions: { type: 'dot', color: '#0f172a' },
          backgroundOptions: { color: '#ffffff' },
        });

        qrRef.current.append(containerRef.current);
      } catch (error) {
        setFeedback({
          type: 'error',
          message:
            error instanceof Error
              ? `${ui.loadEngineWithReason} ${error.message}`
              : ui.loadEngineError,
        });
      }
    };

    void setupQrEngine();

    return () => {
      cancelled = true;
    };
  }, [margin, size, trimmedContent, ui.loadEngineError, ui.loadEngineWithReason]);

  useEffect(() => {
    if (!containerRef.current || !qrRef.current) {
      return;
    }

    if (!hasContent) {
      containerRef.current.innerHTML = '';
      return;
    }

    qrRef.current.update(qrOptions);

    if (!containerRef.current.firstChild) {
      qrRef.current.append(containerRef.current);
    }
  }, [hasContent, qrOptions]);

  useEffect(() => {
    return () => {
      if (statusTimerRef.current) {
        window.clearTimeout(statusTimerRef.current);
      }
    };
  }, []);

  const getRawBlob = async (format: QrImageFormat): Promise<Blob> => {
    if (!qrRef.current || !hasContent) {
      throw new Error(ui.missingContent);
    }

    const raw = await qrRef.current.getRawData(format as FileExtension);

    if (!raw) {
      throw new Error(ui.generateFileError);
    }

    return normalizeRawDataToBlob(raw as QrRawData, getMimeForQrFormat(format));
  };

  const processLogoFile = async (file: File | null) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'error', message: ui.invalidLogo });
      return;
    }

    try {
      const dataUrl = await readImageFileAsDataUrl(file);
      setLogoDataUrl(dataUrl);
      setLogoFile(file);
      setLogoFileName(file.name);
      setFeedback({ type: 'success', message: ui.logoApplied });
    } catch {
      setLogoFile(null);
      setFeedback({
        type: 'error',
        message: ui.logoLoadError,
      });
    }
  };

  const runAction = async (actionLabel: string, action: () => Promise<void>) => {
    try {
      setBusyAction(actionLabel);
      await action();
    } catch {
      setFeedback({
        type: 'error',
        message: ui.genericActionError,
      });
    } finally {
      setBusyAction(null);
    }
  };

  const handleDownload = async (format: QrImageFormat) => {
    await runAction(`download-${format}`, async () => {
      const blob = await getRawBlob(format);
      const baseName = buildQrFileBaseName(trimmedContent);
      downloadBlob(blob, `${baseName}.${format}`);
      setFeedback({
        type: 'success',
        message: `${ui.downloadSuccessPrefix} ${format.toUpperCase()} ${ui.downloadSuccessSuffix}`,
      });
    });
  };

  const handleDownloadPdf = async () => {
    await runAction('download-pdf', async () => {
      const { jsPDF } = await import('jspdf');
      const pngBlob = await getRawBlob('png');
      const dataUrl = await blobToDataUrl(pngBlob);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const drawSize = Math.min(pageWidth - 80, pageHeight - 180);
      const x = (pageWidth - drawSize) / 2;
      const y = 72;

      pdf.setFontSize(14);
      pdf.text(ui.pdfTitle, x, 42);
      pdf.addImage(dataUrl, 'PNG', x, y, drawSize, drawSize);

      const baseName = buildQrFileBaseName(trimmedContent);
      pdf.save(`${baseName}.pdf`);
      setFeedback({ type: 'success', message: ui.pdfSuccess });
    });
  };

  const handleCopyImage = async () => {
    await runAction('copy-image', async () => {
      const pngBlob = await getRawBlob('png');
      await copyImageBlobToClipboard(pngBlob);
      setFeedback({ type: 'success', message: ui.copySuccess });
    });
  };

  const handleOpenQrViewer = async () => {
    await runAction('open-preview-viewer', async () => {
      const pngBlob = await getRawBlob('png');
      const dataUrl = await blobToDataUrl(pngBlob);
      setQrPreviewDataUrl(dataUrl);
      setIsQrViewerOpen(true);
    });
  };

  return (
    <Card className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="qr-content" className="text-sm font-semibold text-slate-800">
          {ui.contentLabel}
        </label>
        <Textarea
          id="qr-content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className="min-h-[120px]"
          placeholder={ui.contentPlaceholder}
        />
        <p className="text-xs text-slate-600">{ui.contentNote}</p>
      </div>

      <SectionCard title={ui.previewTitle} description={ui.previewDescription}>
        <div className="flex min-h-[280px] items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-white p-4">
          {hasContent ? (
            <div className="w-full">
              <div ref={containerRef} className="qr-preview-render mx-auto max-w-full" />
            </div>
          ) : (
            <p className="text-sm text-slate-500">{ui.previewEmpty}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" disabled={!hasContent || Boolean(busyAction)} onClick={() => handleDownload('png')}>
            PNG
          </Button>
          <Button variant="secondary" disabled={!hasContent || Boolean(busyAction)} onClick={() => handleDownload('jpeg')}>
            JPEG
          </Button>
          <Button variant="secondary" disabled={!hasContent || Boolean(busyAction)} onClick={() => handleDownload('webp')}>
            WEBP
          </Button>
          <Button variant="secondary" disabled={!hasContent || Boolean(busyAction)} onClick={() => handleDownload('svg')}>
            SVG
          </Button>
          <Button variant="secondary" disabled={!hasContent || Boolean(busyAction)} onClick={handleDownloadPdf}>
            PDF
          </Button>
          <Button variant="secondary" disabled={!hasContent || Boolean(busyAction)} onClick={handleCopyImage}>
            {ui.copyImageButton}
          </Button>
          <Button
            variant="secondary"
            disabled={!hasContent || Boolean(busyAction)}
            onClick={() => {
              void handleOpenQrViewer();
            }}
          >
            {ui.viewImage}
          </Button>
        </div>

        {!hasContent ? (
          <p className="text-xs font-medium text-amber-700">{ui.emptyWarning}</p>
        ) : null}

        {status ? (
          <p
            className={
              status.type === 'error'
                ? 'text-sm font-medium text-red-700'
                : status.type === 'success'
                  ? 'text-sm font-medium text-emerald-700'
                  : 'text-sm font-medium text-slate-700'
            }
          >
            {status.message}
          </p>
        ) : null}
      </SectionCard>

      <SectionCard
        title={ui.presetsTitle}
        description={ui.presetsDescription}
      >
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {STYLE_PRESETS.map((preset) => {
            const active = selectedPresetId === preset.id;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`rounded-xl border p-3 text-left transition ${
                  active
                    ? 'border-brand-400 bg-brand-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-100'
                }`}
                aria-pressed={active}
              >
                <p className="text-sm font-semibold text-slate-900">
                  {presetLabels[preset.id].label}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  {presetLabels[preset.id].description}
                </p>
              </button>
            );
          })}
        </div>

        {selectedPresetId === 'custom' ? (
          <p className="text-xs font-medium text-brand-700">{ui.customMode}</p>
        ) : null}
      </SectionCard>

      <SectionCard
        title={ui.customizationTitle}
        description={ui.customizationDescription}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.qrColor}</span>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2">
              <Input
                type="color"
                value={foregroundColor}
                onChange={(event) => {
                  markCustomPreset();
                  setForegroundColor(event.target.value);
                }}
                className="h-11 w-16 cursor-pointer p-1"
              />
              <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700">
                {foregroundColor.toUpperCase()}
              </span>
            </div>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.backgroundColor}</span>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2">
              <Input
                type="color"
                value={backgroundColor}
                onChange={(event) => {
                  markCustomPreset();
                  setBackgroundColor(event.target.value);
                }}
                className="h-11 w-16 cursor-pointer p-1"
              />
              <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700">
                {backgroundColor.toUpperCase()}
              </span>
            </div>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.dotStyle}</span>
            <Select
              value={dotType}
              onChange={(event) => {
                markCustomPreset();
                setDotType(event.target.value as DotType);
              }}
            >
              {DOT_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {dotTypeLabels[option.value]}
                </option>
              ))}
            </Select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.errorCorrection}</span>
            <Select
              value={errorLevel}
              onChange={(event) => {
                markCustomPreset();
                setErrorLevel(event.target.value as ErrorCorrectionLevel);
              }}
            >
              {ERROR_LEVEL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {errorCorrectionLabels[option.value]}
                </option>
              ))}
            </Select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.outerCornerStyle}</span>
            <Select
              value={cornerSquareType}
              onChange={(event) => {
                markCustomPreset();
                setCornerSquareType(event.target.value as CornerSquareType);
              }}
            >
              {CORNER_SQUARE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {cornerSquareLabels[option.value] ?? option.label}
                </option>
              ))}
            </Select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{ui.cornerDotStyle}</span>
            <Select
              value={cornerDotType}
              onChange={(event) => {
                markCustomPreset();
                setCornerDotType(event.target.value as CornerDotType);
              }}
            >
              {CORNER_DOT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {cornerDotLabels[option.value] ?? option.label}
                </option>
              ))}
            </Select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">
              {ui.sizeLabel}: {size}px
            </span>
            <input
              type="range"
              min={220}
              max={900}
              step={10}
              value={size}
              onChange={(event) => setSize(Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-brand-600"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">
              {ui.marginLabel}: {margin}px
            </span>
            <input
              type="range"
              min={0}
              max={40}
              step={1}
              value={margin}
              onChange={(event) => {
                markCustomPreset();
                setMargin(Number(event.target.value));
              }}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-brand-600"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">
              {ui.logoScaleLabel}: {(logoScale * 100).toFixed(0)}%
            </span>
            <input
              type="range"
              min={0.15}
              max={0.45}
              step={0.01}
              value={logoScale}
              onChange={(event) => setLogoScale(Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-brand-600"
            />
          </label>
        </div>
      </SectionCard>

      <SectionCard
        title={ui.logoSectionTitle}
        description={ui.logoSectionDescription}
      >
        <FileUploadDropzone
          locale={locale}
          label={ui.chooseImage}
          helperText={ui.dragHint}
          accept="image/*"
          acceptedDescription={ui.supportedFormats}
          multiple={false}
          onFilesSelected={(files) => {
            void processLogoFile(files[0] ?? null);
          }}
          selectedFiles={logoFile ? [logoFile] : []}
          onRemoveFile={() => {
            setLogoDataUrl(null);
            setLogoFile(null);
            setLogoFileName(null);
            setIsLogoViewerOpen(false);
          }}
        />

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">
            {ui.logoMarginLabel}: {logoMargin}px
          </span>
          <input
            type="range"
            min={0}
            max={20}
            step={1}
            value={logoMargin}
            onChange={(event) => setLogoMargin(Number(event.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-brand-600"
          />
        </label>

        {logoDataUrl ? (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
            <Image
              src={logoDataUrl}
              alt={ui.logoPreviewAlt}
              width={56}
              height={56}
              unoptimized
              className="h-14 w-14 rounded-lg border border-slate-200 bg-white object-contain"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">
                {logoFileName ?? ui.logoLoadedFallback}
              </p>
              <p className="text-xs text-slate-600">{ui.logoAppliedCenter}</p>
            </div>
            <Button
              variant="secondary"
              onClick={() => setIsLogoViewerOpen(true)}
            >
              {ui.viewImage}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setLogoDataUrl(null);
                setLogoFile(null);
                setLogoFileName(null);
                setIsLogoViewerOpen(false);
              }}
            >
              {ui.removeLogo}
            </Button>
          </div>
        ) : null}
      </SectionCard>

      <ImageViewer
        src={qrPreviewDataUrl}
        alt={ui.previewTitle}
        isOpen={isQrViewerOpen}
        onClose={() => setIsQrViewerOpen(false)}
        onDownload={() => {
          void handleDownload('png');
        }}
      />

      <ImageViewer
        src={logoDataUrl ?? ''}
        alt={ui.logoPreviewAlt}
        isOpen={isLogoViewerOpen}
        onClose={() => setIsLogoViewerOpen(false)}
      />

    </Card>
  );
}
