'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
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
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
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

export function QrCodeGeneratorTool() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);
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
  const [logoFileName, setLogoFileName] = useState<string | null>(null);
  const [logoScale, setLogoScale] = useState(0.32);
  const [logoMargin, setLogoMargin] = useState(8);
  const [status, setStatus] = useState<QrStatus | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
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
              ? `Falha ao carregar o motor do QR Code: ${error.message}`
              : 'Falha ao carregar o motor do QR Code.',
        });
      }
    };

    void setupQrEngine();

    return () => {
      cancelled = true;
    };
  }, [margin, size, trimmedContent]);

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
      throw new Error('Digite um conteúdo para gerar o QR Code.');
    }

    const raw = await qrRef.current.getRawData(format as FileExtension);

    if (!raw) {
      throw new Error('Não foi possível gerar o arquivo do QR Code.');
    }

    return normalizeRawDataToBlob(raw as QrRawData, getMimeForQrFormat(format));
  };

  const processLogoFile = async (file: File | null) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'error', message: 'Selecione uma imagem válida para o logo.' });
      return;
    }

    try {
      const dataUrl = await readImageFileAsDataUrl(file);
      setLogoDataUrl(dataUrl);
      setLogoFileName(file.name);
      setFeedback({ type: 'success', message: 'Logo aplicado ao QR Code.' });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Falha ao carregar logo.',
      });
    }
  };

  const handleLogoDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingLogo(true);
  };

  const handleLogoDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingLogo(false);
  };

  const handleLogoDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingLogo(false);
    const file = event.dataTransfer.files?.[0] ?? null;
    void processLogoFile(file);
  };

  const runAction = async (actionLabel: string, action: () => Promise<void>) => {
    try {
      setBusyAction(actionLabel);
      await action();
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Não foi possível concluir a ação.',
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
      setFeedback({ type: 'success', message: `Arquivo ${format.toUpperCase()} baixado.` });
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
      pdf.text('QR Code gerado localmente', x, 42);
      pdf.addImage(dataUrl, 'PNG', x, y, drawSize, drawSize);

      const baseName = buildQrFileBaseName(trimmedContent);
      pdf.save(`${baseName}.pdf`);
      setFeedback({ type: 'success', message: 'PDF baixado com sucesso.' });
    });
  };

  const handleCopyImage = async () => {
    await runAction('copy-image', async () => {
      const pngBlob = await getRawBlob('png');
      await copyImageBlobToClipboard(pngBlob);
      setFeedback({ type: 'success', message: 'Imagem copiada para a área de transferência.' });
    });
  };

  return (
    <Card className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="qr-content" className="text-sm font-semibold text-slate-800">
          Conteúdo do QR Code
        </label>
        <Textarea
          id="qr-content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className="min-h-[120px]"
          placeholder="Cole um texto, URL, payload PIX ou qualquer conteúdo"
        />
        <p className="text-xs text-slate-600">
          Ferramenta gratuita, sem cadastro e sem login. O QR é gerado localmente no navegador.
        </p>
      </div>

      <SectionCard title="Preview e exportação" description="Visualize o resultado e baixe no formato desejado.">
        <div className="flex min-h-[280px] items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-white p-4">
          {hasContent ? (
            <div className="w-full">
              <div ref={containerRef} className="qr-preview-render mx-auto max-w-full" />
            </div>
          ) : (
            <p className="text-sm text-slate-500">A prévia aparece automaticamente após inserir conteúdo.</p>
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
            Copiar imagem
          </Button>
        </div>

        {!hasContent ? (
          <p className="text-xs font-medium text-amber-700">Digite um conteúdo para gerar o QR Code.</p>
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
        title="Pré-estilos"
        description="Escolha um estilo pronto para começar e depois ajuste os detalhes finos."
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
                <p className="text-sm font-semibold text-slate-900">{preset.label}</p>
                <p className="mt-1 text-xs text-slate-600">{preset.description}</p>
              </button>
            );
          })}
        </div>

        {selectedPresetId === 'custom' ? (
          <p className="text-xs font-medium text-brand-700">
            Você está em modo personalizado.
          </p>
        ) : null}
      </SectionCard>

      <SectionCard
        title="Personalização do QR"
        description="Ajuste cor, formato dos módulos e parâmetros de leitura."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">Cor do QR</span>
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
            <span className="text-sm font-semibold text-slate-800">Cor de fundo</span>
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
            <span className="text-sm font-semibold text-slate-800">Estilo dos pontos</span>
            <Select
              value={dotType}
              onChange={(event) => {
                markCustomPreset();
                setDotType(event.target.value as DotType);
              }}
            >
              {DOT_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">Correção de erro</span>
            <Select
              value={errorLevel}
              onChange={(event) => {
                markCustomPreset();
                setErrorLevel(event.target.value as ErrorCorrectionLevel);
              }}
            >
              {ERROR_LEVEL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">Estilo do canto externo</span>
            <Select
              value={cornerSquareType}
              onChange={(event) => {
                markCustomPreset();
                setCornerSquareType(event.target.value as CornerSquareType);
              }}
            >
              {CORNER_SQUARE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">Estilo do ponto de canto</span>
            <Select
              value={cornerDotType}
              onChange={(event) => {
                markCustomPreset();
                setCornerDotType(event.target.value as CornerDotType);
              }}
            >
              {CORNER_DOT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">Tamanho: {size}px</span>
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
            <span className="text-sm font-semibold text-slate-800">Margem: {margin}px</span>
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
              Escala do logo: {(logoScale * 100).toFixed(0)}%
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
        title="Logo central (opcional)"
        description="Arraste e solte uma imagem ou selecione manualmente."
      >
        <input
          ref={logoInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => {
            void processLogoFile(event.target.files?.[0] ?? null);
          }}
        />

        <div
          onDragOver={handleLogoDragOver}
          onDragLeave={handleLogoDragLeave}
          onDrop={handleLogoDrop}
          className={`rounded-2xl border-2 border-dashed p-4 text-center transition ${
            isDraggingLogo
              ? 'border-brand-400 bg-brand-50'
              : 'border-slate-300 bg-white hover:border-slate-400'
          }`}
        >
          <p className="text-sm font-medium text-slate-800">
            Arraste sua imagem aqui ou clique para selecionar
          </p>
          <p className="mt-1 text-xs text-slate-600">PNG, JPG, SVG e WEBP são suportados.</p>
          <div className="mt-3">
            <Button variant="secondary" onClick={() => logoInputRef.current?.click()}>
              Escolher imagem
            </Button>
          </div>
        </div>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">
            Margem interna do logo: {logoMargin}px
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
              alt="Preview do logo"
              width={56}
              height={56}
              unoptimized
              className="h-14 w-14 rounded-lg border border-slate-200 bg-white object-contain"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">{logoFileName ?? 'Logo carregado'}</p>
              <p className="text-xs text-slate-600">Logo aplicado no centro do QR Code.</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => {
                setLogoDataUrl(null);
                setLogoFileName(null);
              }}
            >
              Remover logo
            </Button>
          </div>
        ) : null}
      </SectionCard>

    </Card>
  );
}
