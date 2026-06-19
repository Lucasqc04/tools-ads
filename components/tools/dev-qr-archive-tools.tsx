'use client';

import { useEffect, useRef, useState } from 'react';
import { FileUploadDropzone } from '@/components/shared/file-upload-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { generateJsonCode } from '@/lib/json-codegen';
import { formatBytes } from '@/lib/file-size';
import { downloadBlob } from '@/lib/image-conversion';
import type { AppLocale } from '@/lib/i18n/config';

type Notice = { tone: 'info' | 'success' | 'error'; text: string } | null;
type QrCodeStylingInstance = {
  update: (options: unknown) => void;
  append: (element: HTMLElement) => void;
  getRawData: (format: string) => Promise<Blob | ArrayBuffer | null>;
};

const noticeClass = {
  info: 'border-slate-200 bg-slate-50 text-slate-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  error: 'border-red-200 bg-red-50 text-red-700',
};

const copyText = async (value: string, setNotice: (notice: Notice) => void, success: string, error = 'Erro') => {
  try {
    await navigator.clipboard.writeText(value);
    setNotice({ tone: 'success', text: success });
  } catch {
    setNotice({ tone: 'error', text: error });
  }
};

const downloadText = (content: string, fileName: string, type = 'text/plain') =>
  downloadBlob(new Blob([content], { type }), fileName);

const makeZip = async (
  entries: Array<{ name: string; blob: Blob }>,
  fileName: string,
  password?: string,
) => {
  const zip = await import('@zip.js/zip.js');
  const writer = new zip.ZipWriter(new zip.BlobWriter('application/zip'), {
    bufferedWrite: true,
    password: password || undefined,
    encryptionStrength: password ? 3 : undefined,
  });

  for (const entry of entries) {
    await writer.add(entry.name, new zip.BlobReader(entry.blob));
  }

  const blob = await writer.close();
  downloadBlob(blob, fileName);
};

function ToolHeader({ title, intro }: Readonly<{ title: string; intro: string }>) {
  return (
    <header className="rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 to-indigo-50 p-4">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-700">{intro}</p>
    </header>
  );
}

function NoticeBox({ notice }: Readonly<{ notice: Notice }>) {
  if (!notice) return null;
  return <p className={`rounded-lg border px-3 py-2 text-sm ${noticeClass[notice.tone]}`}>{notice.text}</p>;
}

const scannerUi = {
  'pt-br': {
    title: 'QR Code scanner e decoder',
    intro: 'Leia QR Code pela camera ou por imagem, copie o conteudo e exporte o resultado.',
    image: 'Imagem com QR Code',
    startCamera: 'Abrir camera',
    stopCamera: 'Parar camera',
    scanImage: 'Ler imagem',
    copy: 'Copiar resultado',
    exportTxt: 'TXT',
    exportJson: 'JSON',
    result: 'Resultado',
    empty: 'O conteudo decodificado aparece aqui.',
    copied: 'Copiado.',
  },
  en: {
    title: 'QR Code scanner and decoder',
    intro: 'Read QR Codes from camera or image, copy content, and export the result.',
    image: 'Image with QR Code',
    startCamera: 'Open camera',
    stopCamera: 'Stop camera',
    scanImage: 'Scan image',
    copy: 'Copy result',
    exportTxt: 'TXT',
    exportJson: 'JSON',
    result: 'Result',
    empty: 'Decoded content appears here.',
    copied: 'Copied.',
  },
  es: {
    title: 'Scanner y decoder de QR Code',
    intro: 'Lee QR Code desde camara o imagen, copia contenido y exporta el resultado.',
    image: 'Imagen con QR Code',
    startCamera: 'Abrir camara',
    stopCamera: 'Parar camara',
    scanImage: 'Leer imagen',
    copy: 'Copiar resultado',
    exportTxt: 'TXT',
    exportJson: 'JSON',
    result: 'Resultado',
    empty: 'El contenido decodificado aparece aqui.',
    copied: 'Copiado.',
  },
} satisfies Record<AppLocale, Record<string, string>>;

export function QrCodeScannerDecoderTool({ locale = 'pt-br' }: Readonly<{ locale?: AppLocale }>) {
  const ui = scannerUi[locale];
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState('');
  const [notice, setNotice] = useState<Notice>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const file = files[0];

  useEffect(() => () => controlsRef.current?.stop(), []);

  const scanImage = async () => {
    if (!file) return;
    const { BrowserQRCodeReader } = await import('@zxing/browser');
    const reader = new BrowserQRCodeReader();
    const url = URL.createObjectURL(file);
    try {
      const decoded = await reader.decodeFromImageUrl(url);
      setResult(decoded.getText());
      setNotice({ tone: 'success', text: ui.result });
    } catch (error) {
      setNotice({ tone: 'error', text: error instanceof Error ? error.message : 'QR nao encontrado.' });
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const startCamera = async () => {
    if (!videoRef.current) return;
    const { BrowserQRCodeReader } = await import('@zxing/browser');
    const reader = new BrowserQRCodeReader();
    try {
      controlsRef.current = await reader.decodeFromVideoDevice(undefined, videoRef.current, (decoded) => {
        if (decoded) setResult(decoded.getText());
      });
      setIsCameraActive(true);
    } catch (error) {
      setNotice({ tone: 'error', text: error instanceof Error ? error.message : 'Falha ao abrir camera.' });
    }
  };

  const stopCamera = () => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    setIsCameraActive(false);
  };

  return (
    <Card className="space-y-5">
      <ToolHeader title={ui.title} intro={ui.intro} />
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="space-y-3">
          <FileUploadDropzone locale={locale} label={ui.image} accept="image/*" multiple={false} selectedFiles={files} onFilesSelected={(next) => setFiles(next.slice(0, 1))} onRemoveFile={() => setFiles([])} />
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" disabled={!file} onClick={() => void scanImage()}>{ui.scanImage}</Button>
            <Button variant="secondary" onClick={() => (isCameraActive ? stopCamera() : void startCamera())}>{isCameraActive ? ui.stopCamera : ui.startCamera}</Button>
          </div>
          <video ref={videoRef} className="aspect-video w-full rounded-xl border border-slate-200 bg-slate-950 object-cover" muted playsInline />
        </section>
        <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-semibold text-slate-900">{ui.result}</h4>
          <pre className="min-h-[180px] overflow-auto whitespace-pre-wrap break-all rounded-lg bg-white p-3 text-sm text-slate-800">{result || ui.empty}</pre>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" disabled={!result} onClick={() => void copyText(result, setNotice, ui.copied)}>{ui.copy}</Button>
            <Button variant="secondary" disabled={!result} onClick={() => downloadText(result, 'qr-code.txt')}>{ui.exportTxt}</Button>
            <Button variant="secondary" disabled={!result} onClick={() => downloadText(JSON.stringify({ value: result }, null, 2), 'qr-code.json', 'application/json')}>{ui.exportJson}</Button>
          </div>
        </section>
      </div>
      <NoticeBox notice={notice} />
    </Card>
  );
}

const payloadUi = {
  'pt-br': {
    title: 'Gerador de QR Wi-Fi, vCard e Evento',
    intro: 'Monte payloads padronizados para QR Code de Wi-Fi, contato vCard e calendario ICS.',
    mode: 'Tipo',
    wifi: 'Wi-Fi',
    vcard: 'vCard',
    event: 'Evento',
    ssid: 'Nome da rede (SSID)',
    password: 'Senha',
    noPassword: 'Sem senha',
    hiddenSsid: 'Rede oculta',
    name: 'Nome',
    company: 'Empresa',
    phone: 'Telefone',
    email: 'Email',
    url: 'URL',
    summary: 'Titulo',
    location: 'Local',
    generate: 'Gerar QR',
    copyPayload: 'Copiar payload',
    downloadPng: 'PNG',
    downloadSvg: 'SVG',
    payload: 'Payload',
    qrCustomizerTip: 'Dica: para personalizar o QR Code com logo, cores, cantos e formatos, copie o payload e abra o Gerador de QR Code.',
    openQrCustomizer: 'Abrir Gerador de QR Code',
    copied: 'Copiado.',
  },
  en: {
    title: 'Wi-Fi, vCard, and event QR generator',
    intro: 'Build standard QR payloads for Wi-Fi, vCard contacts, and ICS calendar events.',
    mode: 'Type',
    wifi: 'Wi-Fi',
    vcard: 'vCard',
    event: 'Event',
    ssid: 'Network name (SSID)',
    password: 'Password',
    noPassword: 'No password',
    hiddenSsid: 'Hidden SSID',
    name: 'Name',
    company: 'Company',
    phone: 'Phone',
    email: 'Email',
    url: 'URL',
    summary: 'Title',
    location: 'Location',
    generate: 'Generate QR',
    copyPayload: 'Copy payload',
    downloadPng: 'PNG',
    downloadSvg: 'SVG',
    payload: 'Payload',
    qrCustomizerTip: 'Tip: to customize the QR Code with logo, colors, corners, and formats, copy the payload and open the QR Code Generator.',
    openQrCustomizer: 'Open QR Code Generator',
    copied: 'Copied.',
  },
  es: {
    title: 'Generador de QR Wi-Fi, vCard y Evento',
    intro: 'Crea payloads estandar para QR de Wi-Fi, contacto vCard y calendario ICS.',
    mode: 'Tipo',
    wifi: 'Wi-Fi',
    vcard: 'vCard',
    event: 'Evento',
    ssid: 'Nombre de red (SSID)',
    password: 'Contrasena',
    noPassword: 'Sin contrasena',
    hiddenSsid: 'Red oculta',
    name: 'Nombre',
    company: 'Empresa',
    phone: 'Telefono',
    email: 'Email',
    url: 'URL',
    summary: 'Titulo',
    location: 'Local',
    generate: 'Generar QR',
    copyPayload: 'Copiar payload',
    downloadPng: 'PNG',
    downloadSvg: 'SVG',
    payload: 'Payload',
    qrCustomizerTip: 'Consejo: para personalizar el QR Code con logo, colores, esquinas y formatos, copia el payload y abre el Generador de QR Code.',
    openQrCustomizer: 'Abrir Generador de QR Code',
    copied: 'Copiado.',
  },
} satisfies Record<AppLocale, Record<string, string>>;

type QrPayloadMode = 'wifi' | 'vcard' | 'event';

const escapeWifi = (value: string): string => value.replaceAll(/([\\;,:"])/g, '\\$1');
const toIcsDate = (value: string): string => value.replaceAll(/[-:]/g, '').replace('.000', '');

export function QrPayloadGeneratorTool({ locale = 'pt-br' }: Readonly<{ locale?: AppLocale }>) {
  const ui = payloadUi[locale];
  const [mode, setMode] = useState<QrPayloadMode>('wifi');
  const [ssid, setSsid] = useState('Minha Rede');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiType, setWifiType] = useState('WPA');
  const [hidden, setHidden] = useState(false);
  const [name, setName] = useState('Lucas Silva');
  const [phone, setPhone] = useState('+55 11 99999-9999');
  const [email, setEmail] = useState('contato@example.com');
  const [company, setCompany] = useState('Empresa');
  const [url, setUrl] = useState('https://example.com');
  const [summary, setSummary] = useState('Reuniao');
  const [location, setLocation] = useState('Online');
  const [startsAt, setStartsAt] = useState('2026-06-18T09:00');
  const [endsAt, setEndsAt] = useState('2026-06-18T10:00');
  const [payload, setPayload] = useState('');
  const [notice, setNotice] = useState<Notice>(null);
  const qrContainerRef = useRef<HTMLDivElement | null>(null);
  const qrRef = useRef<QrCodeStylingInstance | null>(null);

  const buildPayload = () => {
    if (mode === 'wifi') {
      return `WIFI:T:${wifiType};S:${escapeWifi(ssid)};P:${escapeWifi(wifiPassword)};H:${hidden ? 'true' : 'false'};;`;
    }

    if (mode === 'vcard') {
      return ['BEGIN:VCARD', 'VERSION:3.0', `FN:${name}`, `ORG:${company}`, `TEL:${phone}`, `EMAIL:${email}`, `URL:${url}`, 'END:VCARD'].join('\n');
    }

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `SUMMARY:${summary}`,
      `LOCATION:${location}`,
      `DTSTART:${toIcsDate(new Date(startsAt).toISOString())}`,
      `DTEND:${toIcsDate(new Date(endsAt).toISOString())}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\n');
  };

  const generate = async () => {
    const nextPayload = buildPayload();
    setPayload(nextPayload);
    const { default: QRCodeStyling } = await import('qr-code-styling');
    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling({
        width: 260,
        height: 260,
        data: nextPayload,
        dotsOptions: { color: '#0f172a', type: 'rounded' },
        cornersSquareOptions: { type: 'extra-rounded' },
        backgroundOptions: { color: '#ffffff' },
        qrOptions: { errorCorrectionLevel: 'Q' },
      }) as unknown as QrCodeStylingInstance;
      if (qrContainerRef.current) qrRef.current?.append(qrContainerRef.current);
    } else {
      qrRef.current.update({ data: nextPayload });
    }
  };

  const downloadQr = async (format: 'png' | 'svg') => {
    if (!qrRef.current) return;
    const raw = await qrRef.current.getRawData(format);
    if (!raw) return;
    const blob = raw instanceof Blob ? raw : new Blob([raw], { type: format === 'png' ? 'image/png' : 'image/svg+xml' });
    downloadBlob(blob, `qr-${mode}.${format}`);
  };

  return (
    <Card className="space-y-5">
      <ToolHeader title={ui.title} intro={ui.intro} />
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <section className="space-y-4">
          <label className="space-y-2 block"><span className="text-sm font-semibold text-slate-800">{ui.mode}</span><Select value={mode} onChange={(event) => setMode(event.target.value as QrPayloadMode)}><option value="wifi">{ui.wifi}</option><option value="vcard">{ui.vcard}</option><option value="event">{ui.event}</option></Select></label>
          {mode === 'wifi' ? (
            <div className="grid gap-3 md:grid-cols-2">
              <Input value={ssid} onChange={(event) => setSsid(event.target.value)} placeholder={ui.ssid} />
              <Input value={wifiPassword} onChange={(event) => setWifiPassword(event.target.value)} placeholder={ui.password} />
              <Select value={wifiType} onChange={(event) => setWifiType(event.target.value)}><option value="WPA">WPA/WPA2</option><option value="WEP">WEP</option><option value="nopass">{ui.noPassword}</option></Select>
              <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={hidden} onChange={(event) => setHidden(event.target.checked)} />{ui.hiddenSsid}</label>
            </div>
          ) : mode === 'vcard' ? (
            <div className="grid gap-3 md:grid-cols-2">
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder={ui.name} />
              <Input value={company} onChange={(event) => setCompany(event.target.value)} placeholder={ui.company} />
              <Input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder={ui.phone} />
              <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder={ui.email} />
              <Input value={url} onChange={(event) => setUrl(event.target.value)} placeholder={ui.url} className="md:col-span-2" />
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              <Input value={summary} onChange={(event) => setSummary(event.target.value)} placeholder={ui.summary} />
              <Input value={location} onChange={(event) => setLocation(event.target.value)} placeholder={ui.location} />
              <Input type="datetime-local" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} />
              <Input type="datetime-local" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} />
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => void generate()}>{ui.generate}</Button>
            <Button variant="secondary" disabled={!payload} onClick={() => void copyText(payload, setNotice, ui.copied)}>{ui.copyPayload}</Button>
            <Button variant="secondary" disabled={!payload} onClick={() => void downloadQr('png')}>{ui.downloadPng}</Button>
            <Button variant="secondary" disabled={!payload} onClick={() => void downloadQr('svg')}>{ui.downloadSvg}</Button>
          </div>
        </section>
        <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div ref={qrContainerRef} className="flex min-h-[280px] items-center justify-center rounded-lg bg-white p-3" />
          <h4 className="text-sm font-semibold text-slate-900">{ui.payload}</h4>
          <pre className="max-h-[220px] overflow-auto whitespace-pre-wrap break-all rounded-lg bg-white p-3 text-xs text-slate-800">{payload || buildPayload()}</pre>
          <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-3 text-sm text-cyan-900">
            <p>{ui.qrCustomizerTip}</p>
            <a className="mt-2 inline-flex font-semibold text-cyan-800 underline" href={`/${locale}/tools/qr-code-generator`}>
              {ui.openQrCustomizer}
            </a>
          </div>
        </section>
      </div>
      <NoticeBox notice={notice} />
    </Card>
  );
}

const jsonUi = {
  'pt-br': {
    title: 'JSON para TypeScript, Zod e JSON Schema',
    intro: 'Cole um JSON real e gere tipos TypeScript, schema Zod e JSON Schema exportaveis.',
    root: 'Nome raiz',
    generate: 'Gerar codigo',
    copy: 'Copiar aba',
    exportAll: 'Exportar ZIP',
    copied: 'Copiado.',
    invalid: 'JSON invalido.',
  },
  en: {
    title: 'JSON to TypeScript, Zod, and JSON Schema',
    intro: 'Paste real JSON and generate TypeScript types, Zod schema, and JSON Schema exports.',
    root: 'Root name',
    generate: 'Generate code',
    copy: 'Copy tab',
    exportAll: 'Export ZIP',
    copied: 'Copied.',
    invalid: 'Invalid JSON.',
  },
  es: {
    title: 'JSON a TypeScript, Zod y JSON Schema',
    intro: 'Pega JSON real y genera tipos TypeScript, schema Zod y JSON Schema exportables.',
    root: 'Nombre raiz',
    generate: 'Generar codigo',
    copy: 'Copiar aba',
    exportAll: 'Exportar ZIP',
    copied: 'Copiado.',
    invalid: 'JSON invalido.',
  },
} satisfies Record<AppLocale, Record<string, string>>;

export function JsonTypeSchemaGeneratorTool({ locale = 'pt-br' }: Readonly<{ locale?: AppLocale }>) {
  const ui = jsonUi[locale];
  const [input, setInput] = useState('{"id":1,"name":"Lucas","active":true,"tags":["dev"]}');
  const [rootName, setRootName] = useState('UserPayload');
  const [tab, setTab] = useState<'typeScript' | 'zod' | 'jsonSchema'>('typeScript');
  const [output, setOutput] = useState<ReturnType<typeof generateJsonCode> | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const activeOutput = output?.[tab] ?? '';

  const generate = () => {
    try {
      setOutput(generateJsonCode(input, rootName));
      setNotice(null);
    } catch {
      setNotice({ tone: 'error', text: ui.invalid });
    }
  };

  const exportZip = async () => {
    if (!output) return;
    const entries = [
      { name: `${rootName}.ts`, blob: new Blob([output.typeScript], { type: 'text/typescript' }) },
      { name: `${rootName}.zod.ts`, blob: new Blob([output.zod], { type: 'text/typescript' }) },
      { name: `${rootName}.schema.json`, blob: new Blob([output.jsonSchema], { type: 'application/json' }) },
    ];
    await makeZip(entries, 'json-codegen.zip');
  };

  return (
    <Card className="space-y-5">
      <ToolHeader title={ui.title} intro={ui.intro} />
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="space-y-3">
          <label className="space-y-2 block"><span className="text-sm font-semibold text-slate-800">{ui.root}</span><Input value={rootName} onChange={(event) => setRootName(event.target.value)} /></label>
          <Textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-[360px] font-mono text-xs" />
        </section>
        <section className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {(['typeScript', 'zod', 'jsonSchema'] as const).map((item) => <Button key={item} variant={tab === item ? 'primary' : 'secondary'} onClick={() => setTab(item)}>{item}</Button>)}
          </div>
          <pre className="min-h-[360px] overflow-auto rounded-xl border border-slate-200 bg-slate-950 p-4 text-xs text-slate-50">{activeOutput || '...'}</pre>
        </section>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={generate}>{ui.generate}</Button>
        <Button variant="secondary" disabled={!activeOutput} onClick={() => void copyText(activeOutput, setNotice, ui.copied)}>{ui.copy}</Button>
        <Button variant="secondary" disabled={!output} onClick={() => void exportZip()}>{ui.exportAll}</Button>
      </div>
      <NoticeBox notice={notice} />
    </Card>
  );
}

const cronUi = {
  'pt-br': {
    title: 'Gerador e explicador de Cron',
    intro: 'Monte expressoes cron, leia a descricao humana e veja proximas execucoes com timezone.',
    expression: 'Expressao',
    timezone: 'Timezone',
    explain: 'Explicar',
    copy: 'Copiar',
    next: 'Proximas execucoes',
    localized: 'Traducao em portugues',
    copied: 'Copiado.',
  },
  en: {
    title: 'Cron generator and explainer',
    intro: 'Build cron expressions, read a human explanation, and preview next runs with timezone.',
    expression: 'Expression',
    timezone: 'Timezone',
    explain: 'Explain',
    copy: 'Copy',
    next: 'Next runs',
    localized: 'Localized explanation',
    copied: 'Copied.',
  },
  es: {
    title: 'Generador y explicador de Cron',
    intro: 'Crea expresiones cron, lee una descripcion humana y ve proximas ejecuciones con timezone.',
    expression: 'Expresion',
    timezone: 'Timezone',
    explain: 'Explicar',
    copy: 'Copiar',
    next: 'Proximas ejecuciones',
    localized: 'Traduccion en espanol',
    copied: 'Copiado.',
  },
} satisfies Record<AppLocale, Record<string, string>>;

const cronPresets = ['*/5 * * * *', '0 9 * * 1-5', '0 0 1 * *', '0 3 * * 0', '30 8 15 * *'];

export function CronGeneratorExplainerTool({ locale = 'pt-br' }: Readonly<{ locale?: AppLocale }>) {
  const ui = cronUi[locale];
  const [expression, setExpression] = useState('*/5 * * * *');
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
  const [description, setDescription] = useState('');
  const [localizedDescription, setLocalizedDescription] = useState('');
  const [runs, setRuns] = useState<string[]>([]);
  const [notice, setNotice] = useState<Notice>(null);

  const explain = async () => {
    try {
      const cronstrue = (await import('cronstrue/i18n')).default;
      const parser = await import('cron-parser');
      setDescription(cronstrue.toString(expression, { throwExceptionOnParseError: true }));
      setLocalizedDescription(
        cronstrue.toString(expression, {
          throwExceptionOnParseError: true,
          locale: locale === 'pt-br' ? 'pt_BR' : locale,
        }),
      );
      const parsed = parser.CronExpressionParser.parse(expression, { currentDate: new Date(), tz: timezone });
      const nextRuns: string[] = [];
      for (let index = 0; index < 8; index += 1) nextRuns.push(parsed.next().toDate().toLocaleString());
      setRuns(nextRuns);
      setNotice(null);
    } catch (error) {
      setNotice({ tone: 'error', text: error instanceof Error ? error.message : 'Cron invalido.' });
    }
  };

  useEffect(() => {
    void explain();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="space-y-5">
      <ToolHeader title={ui.title} intro={ui.intro} />
      <div className="grid gap-4 md:grid-cols-[1fr_260px]">
        <label className="space-y-2"><span className="text-sm font-semibold text-slate-800">{ui.expression}</span><Input value={expression} onChange={(event) => setExpression(event.target.value)} className="font-mono" /></label>
        <label className="space-y-2"><span className="text-sm font-semibold text-slate-800">{ui.timezone}</span><Input value={timezone} onChange={(event) => setTimezone(event.target.value)} /></label>
      </div>
      <div className="flex flex-wrap gap-2">{cronPresets.map((preset) => <Button key={preset} variant="secondary" onClick={() => setExpression(preset)}>{preset}</Button>)}</div>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => void explain()}>{ui.explain}</Button>
        <Button variant="secondary" onClick={() => void copyText(expression, setNotice, ui.copied)}>{ui.copy}</Button>
      </div>
      <NoticeBox notice={notice} />
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">{description || '-'}</p>
          {localizedDescription && localizedDescription !== description ? (
            <div className="rounded-lg border border-brand-200 bg-white p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{ui.localized}</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{localizedDescription}</p>
            </div>
          ) : null}
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><h4 className="text-sm font-semibold text-slate-900">{ui.next}</h4><ol className="mt-2 space-y-1 text-sm text-slate-700">{runs.map((run) => <li key={run}>{run}</li>)}</ol></div>
      </section>
    </Card>
  );
}

const archiveUi = {
  'pt-br': {
    title: 'Gzip, Deflate e ZIP com senha',
    intro: 'Comprima/descomprima arquivo com gzip/deflate e empacote varios arquivos ou pastas em ZIP opcionalmente criptografado.',
    files: 'Arquivos',
    password: 'Senha ZIP (opcional)',
    gzip: 'Gzip',
    gunzip: 'Descompactar gzip',
    deflate: 'Deflate',
    inflate: 'Inflate',
    zip: 'Criar ZIP',
    unzip: 'Extrair ZIP',
    directory: 'Selecionar pasta',
    selectedFiles: 'arquivos selecionados',
    ready: 'Operacao concluida.',
  },
  en: {
    title: 'Gzip, Deflate, and password ZIP',
    intro: 'Compress/decompress files with gzip/deflate and package files or folders into optionally encrypted ZIP.',
    files: 'Files',
    password: 'ZIP password (optional)',
    gzip: 'Gzip',
    gunzip: 'Decompress gzip',
    deflate: 'Deflate',
    inflate: 'Inflate',
    zip: 'Create ZIP',
    unzip: 'Extract ZIP',
    directory: 'Select folder',
    selectedFiles: 'selected files',
    ready: 'Operation finished.',
  },
  es: {
    title: 'Gzip, Deflate y ZIP con contrasena',
    intro: 'Comprime/descomprime archivo con gzip/deflate y empaqueta archivos o carpetas en ZIP opcionalmente cifrado.',
    files: 'Archivos',
    password: 'Contrasena ZIP (opcional)',
    gzip: 'Gzip',
    gunzip: 'Descomprimir gzip',
    deflate: 'Deflate',
    inflate: 'Inflate',
    zip: 'Crear ZIP',
    unzip: 'Extraer ZIP',
    directory: 'Seleccionar carpeta',
    selectedFiles: 'archivos seleccionados',
    ready: 'Operacion concluida.',
  },
} satisfies Record<AppLocale, Record<string, string>>;

const streamTransform = async (file: File, mode: 'gzip' | 'deflate' | 'gunzip' | 'inflate') => {
  const isCompress = mode === 'gzip' || mode === 'deflate';
  const format = mode === 'gzip' || mode === 'gunzip' ? 'gzip' : 'deflate';
  const StreamCtor = isCompress ? CompressionStream : DecompressionStream;
  const stream = file.stream().pipeThrough(new StreamCtor(format));
  return await new Response(stream).blob();
};

export function GzipDeflateZipTool({ locale = 'pt-br' }: Readonly<{ locale?: AppLocale }>) {
  const ui = archiveUi[locale];
  const [files, setFiles] = useState<File[]>([]);
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState<Notice>(null);
  const directoryInputRef = useRef<HTMLInputElement | null>(null);
  const file = files[0];

  const transform = async (mode: 'gzip' | 'deflate' | 'gunzip' | 'inflate') => {
    if (!file) return;
    try {
      const blob = await streamTransform(file, mode);
      const outputName =
        mode === 'gzip'
          ? `${file.name}.gz`
          : mode === 'deflate'
            ? `${file.name}.deflate`
            : file.name.replace(/\.(gz|gzip|deflate)$/i, '') || 'arquivo';
      downloadBlob(blob, outputName);
      setNotice({ tone: 'success', text: ui.ready });
    } catch (error) {
      setNotice({ tone: 'error', text: error instanceof Error ? error.message : 'Erro.' });
    }
  };

  const zipFiles = async () => {
    if (!files.length) return;
    await makeZip(
      files.map((item) => ({
        name: (item as File & { webkitRelativePath?: string }).webkitRelativePath || item.name,
        blob: item,
      })),
      'arquivos.zip',
      password,
    );
    setNotice({ tone: 'success', text: ui.ready });
  };

  const unzipFile = async () => {
    if (!file) return;
    try {
      const zip = await import('@zip.js/zip.js');
      const reader = new zip.ZipReader(new zip.BlobReader(file), { password: password || undefined });
      const entries = await reader.getEntries();
      const extracted: Array<{ name: string; blob: Blob }> = [];
      for (const entry of entries) {
        if (entry.directory || !entry.getData) continue;
        const blob = await entry.getData(new zip.BlobWriter());
        extracted.push({ name: entry.filename, blob });
      }
      await reader.close();
      await makeZip(extracted, 'zip-extraido.zip');
      setNotice({ tone: 'success', text: ui.ready });
    } catch (error) {
      setNotice({ tone: 'error', text: error instanceof Error ? error.message : 'Erro.' });
    }
  };

  return (
    <Card className="space-y-5">
      <ToolHeader title={ui.title} intro={ui.intro} />
      <FileUploadDropzone locale={locale} label={ui.files} multiple selectedFiles={files} onFilesSelected={(next) => setFiles((current) => [...current, ...next])} onRemoveFile={(index) => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))} />
      <input ref={directoryInputRef} type="file" multiple className="hidden" onChange={(event) => setFiles(Array.from(event.target.files ?? []))} {...({ webkitdirectory: '', directory: '' } as Record<string, string>)} />
      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <label className="space-y-2"><span className="text-sm font-semibold text-slate-800">{ui.password}</span><Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        <Button variant="secondary" className="self-end" onClick={() => directoryInputRef.current?.click()}>{ui.directory}</Button>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">{files.length} {ui.selectedFiles} - {formatBytes(files.reduce((sum, item) => sum + item.size, 0))}</div>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" disabled={!file} onClick={() => void transform('gzip')}>{ui.gzip}</Button>
        <Button variant="secondary" disabled={!file} onClick={() => void transform('gunzip')}>{ui.gunzip}</Button>
        <Button variant="secondary" disabled={!file} onClick={() => void transform('deflate')}>{ui.deflate}</Button>
        <Button variant="secondary" disabled={!file} onClick={() => void transform('inflate')}>{ui.inflate}</Button>
        <Button variant="secondary" disabled={!files.length} onClick={() => void zipFiles()}>{ui.zip}</Button>
        <Button variant="secondary" disabled={!file} onClick={() => void unzipFile()}>{ui.unzip}</Button>
      </div>
      <NoticeBox notice={notice} />
    </Card>
  );
}

const sqlUi = {
  'pt-br': {
    title: 'SQL Formatter e Minifier',
    intro: 'Formate SQL por dialeto, padronize keywords, minifique e exporte consultas.',
    format: 'Formatar SQL',
    minify: 'Minificar',
    copy: 'Copiar resultado',
    exportSql: 'Exportar .sql',
    dialect: 'Dialeto',
    keywordCase: 'Keywords',
    copied: 'Copiado.',
  },
  en: {
    title: 'SQL Formatter and Minifier',
    intro: 'Format SQL by dialect, normalize keyword case, minify, and export queries.',
    format: 'Format SQL',
    minify: 'Minify',
    copy: 'Copy output',
    exportSql: 'Export .sql',
    dialect: 'Dialect',
    keywordCase: 'Keywords',
    copied: 'Copied.',
  },
  es: {
    title: 'SQL Formatter y Minifier',
    intro: 'Formatea SQL por dialecto, normaliza keywords, minifica y exporta consultas.',
    format: 'Formatear SQL',
    minify: 'Minificar',
    copy: 'Copiar resultado',
    exportSql: 'Exportar .sql',
    dialect: 'Dialecto',
    keywordCase: 'Keywords',
    copied: 'Copiado.',
  },
} satisfies Record<AppLocale, Record<string, string>>;

export function SqlFormatterTool({ locale = 'pt-br' }: Readonly<{ locale?: AppLocale }>) {
  const ui = sqlUi[locale];
  const [input, setInput] = useState('select id,name,email from users where active=true order by created_at desc limit 20;');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('postgresql');
  const [keywordCase, setKeywordCase] = useState('upper');
  const [notice, setNotice] = useState<Notice>(null);

  const formatSql = async () => {
    try {
      const mod = await import('sql-formatter');
      setOutput(mod.format(input, { language: language as never, keywordCase: keywordCase as never, tabWidth: 2 }));
      setNotice(null);
    } catch (error) {
      setNotice({ tone: 'error', text: error instanceof Error ? error.message : 'Erro.' });
    }
  };

  const minify = () => setOutput(input.replaceAll(/--.*$/gm, '').replaceAll(/\s+/g, ' ').trim());
  const valueToUse = output || input;

  return (
    <Card className="space-y-5">
      <ToolHeader title={ui.title} intro={ui.intro} />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2"><span className="text-sm font-semibold text-slate-800">{ui.dialect}</span><Select value={language} onChange={(event) => setLanguage(event.target.value)}><option value="sql">SQL</option><option value="postgresql">PostgreSQL</option><option value="mysql">MySQL</option><option value="mariadb">MariaDB</option><option value="sqlite">SQLite</option><option value="bigquery">BigQuery</option><option value="transactsql">T-SQL</option><option value="plsql">PL/SQL</option></Select></label>
        <label className="space-y-2"><span className="text-sm font-semibold text-slate-800">{ui.keywordCase}</span><Select value={keywordCase} onChange={(event) => setKeywordCase(event.target.value)}><option value="upper">UPPER</option><option value="lower">lower</option><option value="preserve">preserve</option></Select></label>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-[360px] font-mono text-xs" />
        <pre className="min-h-[360px] overflow-auto whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-950 p-4 text-xs text-slate-50">{valueToUse}</pre>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => void formatSql()}>{ui.format}</Button>
        <Button variant="secondary" onClick={minify}>{ui.minify}</Button>
        <Button variant="secondary" onClick={() => void copyText(valueToUse, setNotice, ui.copied)}>{ui.copy}</Button>
        <Button variant="secondary" onClick={() => downloadText(valueToUse, 'query.sql', 'application/sql')}>{ui.exportSql}</Button>
      </div>
      <NoticeBox notice={notice} />
    </Card>
  );
}
