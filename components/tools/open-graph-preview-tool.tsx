'use client';

import { useMemo, useState } from 'react';
import { FileUploadDropzone } from '@/components/shared/file-upload-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { AppLocale } from '@/lib/i18n/config';

type OpenGraphPreviewToolProps = {
  locale?: AppLocale;
};

type OpenGraphState = {
  url: string;
  title: string;
  description: string;
  image: string;
  siteName: string;
  type: string;
  locale: string;
  twitterCard: string;
  canonical: string;
  favicon: string;
};

type FetchResponse = {
  ok: boolean;
  fetchedUrl: string;
  data: OpenGraphState;
  error?: string;
};

const defaultState: OpenGraphState = {
  url: '',
  title: '',
  description: '',
  image: '',
  siteName: '',
  type: 'website',
  locale: 'pt_BR',
  twitterCard: 'summary_large_image',
  canonical: '',
  favicon: '',
};

const getDomain = (url: string): string => {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
};

const clip = (value: string, max: number): string => {
  if (value.length <= max) {
    return value;
  }

  return `${value.slice(0, max - 1)}...`;
};

const buildMetaHtml = (state: OpenGraphState): string => [
  `<meta property=\"og:title\" content=\"${state.title}\" />`,
  `<meta property=\"og:description\" content=\"${state.description}\" />`,
  `<meta property=\"og:image\" content=\"${state.image}\" />`,
  `<meta property=\"og:url\" content=\"${state.url}\" />`,
  `<meta property=\"og:type\" content=\"${state.type || 'website'}\" />`,
  `<meta property=\"og:site_name\" content=\"${state.siteName}\" />`,
  `<meta property=\"og:locale\" content=\"${state.locale}\" />`,
  `<meta name=\"twitter:card\" content=\"${state.twitterCard || 'summary_large_image'}\" />`,
  `<meta name=\"twitter:title\" content=\"${state.title}\" />`,
  `<meta name=\"twitter:description\" content=\"${state.description}\" />`,
  `<meta name=\"twitter:image\" content=\"${state.image}\" />`,
  state.canonical ? `<link rel=\"canonical\" href=\"${state.canonical}\" />` : '',
].filter(Boolean).join('\n');

const buildNextMetadata = (state: OpenGraphState): string => `export const metadata = {\n  title: ${JSON.stringify(state.title)},\n  description: ${JSON.stringify(state.description)},\n  alternates: { canonical: ${JSON.stringify(state.canonical || state.url)} },\n  openGraph: {\n    title: ${JSON.stringify(state.title)},\n    description: ${JSON.stringify(state.description)},\n    url: ${JSON.stringify(state.url)},\n    siteName: ${JSON.stringify(state.siteName)},\n    locale: ${JSON.stringify(state.locale)},\n    type: ${JSON.stringify(state.type || 'website')},\n    images: [{ url: ${JSON.stringify(state.image)} }],\n  },\n  twitter: {\n    card: ${JSON.stringify(state.twitterCard || 'summary_large_image')},\n    title: ${JSON.stringify(state.title)},\n    description: ${JSON.stringify(state.description)},\n    images: [${JSON.stringify(state.image)}],\n  },\n};`;

const getChecklist = (state: OpenGraphState) => [
  { label: 'og:title', ok: Boolean(state.title.trim()) },
  { label: 'og:description', ok: Boolean(state.description.trim()) },
  { label: 'og:image', ok: Boolean(state.image.trim()) },
  { label: 'og:url', ok: Boolean(state.url.trim()) },
  { label: 'twitter:card', ok: Boolean(state.twitterCard.trim()) },
  { label: 'canonical', ok: Boolean((state.canonical || state.url).trim()) },
  { label: 'imagem https', ok: state.image.startsWith('https://') || state.image.startsWith('blob:') },
  { label: 'titulo <= 70', ok: state.title.length > 0 && state.title.length <= 70 },
  { label: 'descricao <= 200', ok: state.description.length > 0 && state.description.length <= 200 },
];

const copyToClipboard = async (value: string): Promise<boolean> => {
  if (!value.trim()) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
};

const Ui = {
  intro:
    'Teste Open Graph em modo manual 100% local ou busque tags reais de uma URL via rota BFF para contornar limitacoes de CORS no navegador.',
  mode: 'Modo',
  manual: 'Manual (frontend)',
  fetch: 'Buscar por URL (BFF)',
  targetUrl: 'URL para buscar tags',
  fetchAction: 'Buscar preview',
  loadExample: 'Carregar exemplo',
  clear: 'Limpar',
  copyMeta: 'Copiar meta tags',
  copyNext: 'Copiar metadata Next.js',
  copied: 'Copiado',
  diagnostics: 'Diagnostico',
  previews: 'Previews por plataforma',
};

export function OpenGraphPreviewTool({ locale = 'pt-br' }: OpenGraphPreviewToolProps) {
  const [mode, setMode] = useState<'manual' | 'fetch'>('manual');
  const [state, setState] = useState<OpenGraphState>(defaultState);
  const [targetUrl, setTargetUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedKey, setCopiedKey] = useState('');

  const checklist = useMemo(() => getChecklist(state), [state]);
  const domain = useMemo(() => getDomain(state.url || state.canonical), [state.canonical, state.url]);

  const update = (key: keyof OpenGraphState, value: string) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const copyGenerated = async (key: string, value: string) => {
    const ok = await copyToClipboard(value);
    if (!ok) {
      return;
    }

    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 1200);
  };

  const handleFetch = async () => {
    if (!targetUrl.trim()) {
      setError('Informe uma URL valida.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/tools/open-graph-preview?url=${encodeURIComponent(targetUrl)}`);
      const payload = (await response.json()) as FetchResponse;

      if (!response.ok || !payload.ok) {
        setError(payload.error ?? 'Nao foi possivel buscar tags dessa URL.');
        return;
      }

      setState(payload.data);
      setMode('manual');
    } catch {
      setError('Falha ao buscar a URL agora.');
    } finally {
      setLoading(false);
    }
  };

  const metaHtml = buildMetaHtml(state);
  const nextMetadata = buildNextMetadata(state);

  return (
    <Card className="space-y-5">
      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        {Ui.intro}
      </section>

      <div className="flex flex-wrap gap-2">
        <Button variant={mode === 'manual' ? 'secondary' : 'ghost'} onClick={() => setMode('manual')}>
          {Ui.manual}
        </Button>
        <Button variant={mode === 'fetch' ? 'secondary' : 'ghost'} onClick={() => setMode('fetch')}>
          {Ui.fetch}
        </Button>
      </div>

      {mode === 'fetch' ? (
        <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{Ui.targetUrl}</span>
            <Input value={targetUrl} onChange={(event) => setTargetUrl(event.target.value)} placeholder="https://example.com/produto" />
          </label>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={handleFetch} disabled={loading}>
              {loading ? 'Buscando...' : Ui.fetchAction}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setTargetUrl('https://example.com');
                setError('');
              }}
            >
              {Ui.loadExample}
            </Button>
          </div>
        </section>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">URL</span>
          <Input value={state.url} onChange={(event) => update('url', event.target.value)} placeholder="https://example.com" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">Canonical</span>
          <Input value={state.canonical} onChange={(event) => update('canonical', event.target.value)} placeholder="https://example.com/produto" />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-slate-800">Titulo</span>
          <Input value={state.title} onChange={(event) => update('title', event.target.value)} />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-slate-800">Descricao</span>
          <Input value={state.description} onChange={(event) => update('description', event.target.value)} />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-slate-800">Imagem</span>
          <Input value={state.image} onChange={(event) => update('image', event.target.value)} placeholder="https://cdn.site.com/og-image.jpg" />
        </label>

        <FileUploadDropzone
          label="Upload local de imagem (modo manual)"
          helperText="A imagem fica local, usada apenas no preview visual."
          onFilesSelected={(files) => {
            const file = files[0];
            if (!file) return;
            update('image', URL.createObjectURL(file));
          }}
          accept="image/*"
          multiple={false}
          compact
          locale={locale}
        />

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">Site name</span>
          <Input value={state.siteName} onChange={(event) => update('siteName', event.target.value)} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">og:type</span>
          <Input value={state.type} onChange={(event) => update('type', event.target.value)} placeholder="website" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">og:locale</span>
          <Input value={state.locale} onChange={(event) => update('locale', event.target.value)} placeholder="pt_BR" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">twitter:card</span>
          <Input value={state.twitterCard} onChange={(event) => update('twitterCard', event.target.value)} placeholder="summary_large_image" />
        </label>
      </div>

      {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => copyGenerated('meta', metaHtml)}>
          {copiedKey === 'meta' ? Ui.copied : Ui.copyMeta}
        </Button>
        <Button variant="secondary" onClick={() => copyGenerated('next', nextMetadata)}>
          {copiedKey === 'next' ? Ui.copied : Ui.copyNext}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setState(defaultState);
            setTargetUrl('');
            setError('');
            setCopiedKey('');
          }}
        >
          {Ui.clear}
        </Button>
      </div>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-semibold text-slate-800">{Ui.diagnostics}</h3>
        <div className="grid gap-2 md:grid-cols-3">
          {checklist.map((item) => (
            <p key={item.label} className={`rounded-md border px-2 py-1 text-xs ${item.ok ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-amber-200 bg-amber-50 text-amber-800'}`}>
              {item.ok ? 'OK' : 'Ajustar'}: {item.label}
            </p>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-800">{Ui.previews}</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {['Facebook', 'LinkedIn', 'WhatsApp', 'X/Twitter', 'Discord', 'Google'].map((platform) => (
            <article key={platform} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <header className="border-b border-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">{platform}</header>
              {state.image ? (
                <div
                  className="h-36 w-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${state.image}')` }}
                />
              ) : (
                <div className="h-36 w-full bg-slate-100" />
              )}
              <div className="space-y-1 p-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">{domain || state.siteName || 'domain.com'}</p>
                <p className="text-sm font-semibold text-slate-900">{clip(state.title || 'Titulo do preview', 80)}</p>
                <p className="text-xs text-slate-600">{clip(state.description || 'Descricao do preview do link compartilhado.', 180)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <article className="space-y-2 rounded-xl border border-slate-200 bg-white p-3">
          <h4 className="text-sm font-semibold text-slate-800">Meta tags HTML</h4>
          <pre className="max-h-[280px] overflow-auto whitespace-pre-wrap break-all rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs text-slate-700">{metaHtml}</pre>
        </article>
        <article className="space-y-2 rounded-xl border border-slate-200 bg-white p-3">
          <h4 className="text-sm font-semibold text-slate-800">Next.js metadata</h4>
          <pre className="max-h-[280px] overflow-auto whitespace-pre-wrap break-all rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs text-slate-700">{nextMetadata}</pre>
        </article>
      </section>
    </Card>
  );
}
