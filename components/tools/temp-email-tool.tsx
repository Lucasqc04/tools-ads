'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { type AppLocale } from '@/lib/i18n/config';
import type {
  TempEmailInboxPayload,
  TempEmailMessage,
  TempEmailMessagesPayload,
} from '@/types/temp-email';

type TempEmailToolProps = Readonly<{
  locale?: AppLocale;
}>;

type TempEmailUi = {
  title: string;
  intro: string;
  generate: string;
  generateNew: string;
  generating: string;
  copy: string;
  copied: string;
  refresh: string;
  refreshing: string;
  deleteEmail: string;
  deleting: string;
  inboxTitle: string;
  expiresIn: string;
  expiredBadge: string;
  emptyInbox: string;
  messagesTitle: string;
  from: string;
  subject: string;
  receivedAt: string;
  preview: string;
  readMore: string;
  textContent: string;
  htmlContent: string;
  noTextContent: string;
  noHtmlContent: string;
  createdSuccess: string;
  deletedSuccess: string;
  expiredMessage: string;
  loadingInitial: string;
  privacyTitle: string;
  privacyNote: string;
  restoreInfo: string;
  fetchError: string;
  createError: string;
  copyError: string;
};

type InboxSession = {
  token: string;
  address: string;
  expiresAt: string;
};

const localStorageKeys = {
  token: 'temp_email_token',
  address: 'temp_email_address',
  expiresAt: 'temp_email_expires_at',
} as const;

const localeTagByLocale: Record<AppLocale, string> = {
  'pt-br': 'pt-BR',
  en: 'en-US',
  es: 'es-ES',
};

const uiByLocale: Record<AppLocale, TempEmailUi> = {
  'pt-br': {
    title: 'E-mail Temporario Gratis',
    intro:
      'Gere um e-mail descartavel para cadastros, testes e protecao de privacidade, com expiracao automatica.',
    generate: 'Gerar e-mail temporario',
    generateNew: 'Gerar novo e-mail',
    generating: 'Gerando...',
    copy: 'Copiar',
    copied: 'Copiado',
    refresh: 'Atualizar inbox',
    refreshing: 'Atualizando...',
    deleteEmail: 'Apagar e-mail',
    deleting: 'Apagando...',
    inboxTitle: 'Endereco temporario ativo',
    expiresIn: 'Expira em',
    expiredBadge: 'Expirado',
    emptyInbox: 'Nenhuma mensagem recebida ainda',
    messagesTitle: 'Mensagens recebidas',
    from: 'Remetente',
    subject: 'Assunto',
    receivedAt: 'Recebido em',
    preview: 'Preview',
    readMore: 'Ler mensagem completa',
    textContent: 'Conteudo em texto',
    htmlContent: 'Conteudo em HTML',
    noTextContent: 'Mensagem sem conteudo em texto.',
    noHtmlContent: 'Mensagem sem conteudo HTML.',
    createdSuccess: 'Inbox temporaria criada com sucesso.',
    deletedSuccess: 'Inbox apagada com sucesso.',
    expiredMessage: 'Esta inbox expirou. Gere um novo e-mail temporario.',
    loadingInitial: 'Carregando inbox salva...',
    privacyTitle: 'Aviso de privacidade',
    privacyNote:
      'As mensagens sao temporarias e apagadas automaticamente apos o prazo. Nao use e-mail temporario para contas importantes, bancos, corretoras ou recuperacao de senha.',
    restoreInfo: 'Inbox recuperada do navegador enquanto ainda esta valida.',
    fetchError: 'Nao foi possivel atualizar a inbox agora.',
    createError: 'Nao foi possivel gerar e-mail temporario agora.',
    copyError: 'Nao foi possivel copiar agora. Tente novamente.',
  },
  en: {
    title: 'Free Temporary Email',
    intro:
      'Generate a disposable email for sign-ups, tests, and privacy protection with automatic expiration.',
    generate: 'Generate temporary email',
    generateNew: 'Generate new email',
    generating: 'Generating...',
    copy: 'Copy',
    copied: 'Copied',
    refresh: 'Refresh inbox',
    refreshing: 'Refreshing...',
    deleteEmail: 'Delete email',
    deleting: 'Deleting...',
    inboxTitle: 'Active temporary address',
    expiresIn: 'Expires in',
    expiredBadge: 'Expired',
    emptyInbox: 'No messages received yet',
    messagesTitle: 'Received messages',
    from: 'From',
    subject: 'Subject',
    receivedAt: 'Received at',
    preview: 'Preview',
    readMore: 'Read full message',
    textContent: 'Text content',
    htmlContent: 'HTML content',
    noTextContent: 'Message has no text body.',
    noHtmlContent: 'Message has no HTML body.',
    createdSuccess: 'Temporary inbox created successfully.',
    deletedSuccess: 'Inbox deleted successfully.',
    expiredMessage: 'This inbox expired. Generate a new temporary email.',
    loadingInitial: 'Loading saved inbox...',
    privacyTitle: 'Privacy notice',
    privacyNote:
      'Messages are temporary and deleted automatically after expiration. Do not use temporary email for important accounts, banking, exchanges, or password recovery.',
    restoreInfo: 'Inbox restored from your browser while still valid.',
    fetchError: 'Could not refresh inbox right now.',
    createError: 'Could not generate temporary email right now.',
    copyError: 'Could not copy right now. Please try again.',
  },
  es: {
    title: 'Correo Temporal Gratis',
    intro:
      'Genera un correo desechable para registros, pruebas y privacidad, con expiracion automatica.',
    generate: 'Generar correo temporal',
    generateNew: 'Generar nuevo correo',
    generating: 'Generando...',
    copy: 'Copiar',
    copied: 'Copiado',
    refresh: 'Actualizar inbox',
    refreshing: 'Actualizando...',
    deleteEmail: 'Eliminar correo',
    deleting: 'Eliminando...',
    inboxTitle: 'Direccion temporal activa',
    expiresIn: 'Expira en',
    expiredBadge: 'Expirado',
    emptyInbox: 'No hay mensajes recibidos aun',
    messagesTitle: 'Mensajes recibidos',
    from: 'Remitente',
    subject: 'Asunto',
    receivedAt: 'Recibido en',
    preview: 'Vista previa',
    readMore: 'Leer mensaje completo',
    textContent: 'Contenido en texto',
    htmlContent: 'Contenido en HTML',
    noTextContent: 'El mensaje no tiene cuerpo en texto.',
    noHtmlContent: 'El mensaje no tiene cuerpo HTML.',
    createdSuccess: 'Inbox temporal creada correctamente.',
    deletedSuccess: 'Inbox eliminada correctamente.',
    expiredMessage: 'Esta inbox expiro. Genera un nuevo correo temporal.',
    loadingInitial: 'Cargando inbox guardada...',
    privacyTitle: 'Aviso de privacidad',
    privacyNote:
      'Los mensajes son temporales y se eliminan automaticamente al expirar. No uses correo temporal para cuentas importantes, bancos, exchanges ni recuperacion de contrasena.',
    restoreInfo: 'Inbox recuperada desde tu navegador mientras siga vigente.',
    fetchError: 'No fue posible actualizar la inbox ahora.',
    createError: 'No fue posible generar un correo temporal ahora.',
    copyError: 'No fue posible copiar ahora. Intentalo nuevamente.',
  },
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const toErrorMessage = (value: unknown, fallback: string): string => {
  if (isPlainObject(value) && typeof value.error === 'string' && value.error.trim()) {
    return value.error;
  }

  return fallback;
};

const parseInboxPayload = (value: unknown): TempEmailInboxPayload | null => {
  if (!isPlainObject(value)) {
    return null;
  }

  if (
    typeof value.address !== 'string' ||
    typeof value.token !== 'string' ||
    typeof value.expiresAt !== 'string' ||
    typeof value.ttlSeconds !== 'number'
  ) {
    return null;
  }

  return {
    address: value.address,
    token: value.token,
    expiresAt: value.expiresAt,
    ttlSeconds: value.ttlSeconds,
  };
};

const parseMessagesPayload = (value: unknown): TempEmailMessagesPayload | null => {
  if (!isPlainObject(value)) {
    return null;
  }

  if (
    typeof value.address !== 'string' ||
    typeof value.expiresAt !== 'string' ||
    !Array.isArray(value.messages)
  ) {
    return null;
  }

  const parsedMessages = value.messages.filter((item): item is TempEmailMessage => {
    if (!isPlainObject(item)) {
      return false;
    }

    return (
      typeof item.id === 'string' &&
      typeof item.from === 'string' &&
      typeof item.to === 'string' &&
      typeof item.subject === 'string' &&
      typeof item.receivedAt === 'string'
    );
  });

  return {
    address: value.address,
    expiresAt: value.expiresAt,
    messages: parsedMessages,
  };
};

const isExpiredPayload = (value: unknown): boolean =>
  isPlainObject(value) && value.expired === true;

const getRemainingSeconds = (expiresAt: string, nowMs: number): number => {
  const expiresAtMs = Date.parse(expiresAt);

  if (!Number.isFinite(expiresAtMs)) {
    return 0;
  }

  return Math.max(0, Math.floor((expiresAtMs - nowMs) / 1000));
};

const formatRemaining = (seconds: number): string => {
  if (seconds <= 0) {
    return '0m 00s';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, '0')}m`;
  }

  return `${minutes}m ${String(secs).padStart(2, '0')}s`;
};

const buildSafeHtmlDocument = (sanitizedHtml: string): string => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'none'; connect-src 'none'; img-src data:; media-src 'none'; frame-src 'none'; style-src 'unsafe-inline'; font-src 'none';" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body {
        margin: 0;
        padding: 12px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 14px;
        line-height: 1.6;
        color: #0f172a;
        background: #ffffff;
        word-break: break-word;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        border: 1px solid #e2e8f0;
        padding: 6px;
        vertical-align: top;
      }
      pre {
        white-space: pre-wrap;
      }
      img {
        display: none;
      }
    </style>
  </head>
  <body>
    ${sanitizedHtml}
  </body>
</html>`;

const stripHtml = (value: string): string => value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const formatReceivedAt = (value: string, locale: AppLocale): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(localeTagByLocale[locale], {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
};

export function TempEmailTool({ locale = 'pt-br' }: TempEmailToolProps) {
  const ui = uiByLocale[locale];

  const [inbox, setInbox] = useState<InboxSession | null>(null);
  const [messages, setMessages] = useState<TempEmailMessage[]>([]);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [isHydrated, setIsHydrated] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const clearStoredInbox = useCallback(() => {
    globalThis.localStorage.removeItem(localStorageKeys.token);
    globalThis.localStorage.removeItem(localStorageKeys.address);
    globalThis.localStorage.removeItem(localStorageKeys.expiresAt);
  }, []);

  const persistInbox = useCallback((session: InboxSession) => {
    globalThis.localStorage.setItem(localStorageKeys.token, session.token);
    globalThis.localStorage.setItem(localStorageKeys.address, session.address);
    globalThis.localStorage.setItem(localStorageKeys.expiresAt, session.expiresAt);
  }, []);

  const fetchMessages = useCallback(
    async (token: string, options?: { silent?: boolean }) => {
      const silent = options?.silent === true;

      if (!silent) {
        setIsRefreshing(true);
      }

      try {
        const response = await fetch(
          `/api/tools/temp-email/messages?token=${encodeURIComponent(token)}`,
          {
            method: 'GET',
            cache: 'no-store',
          },
        );

        let payload: unknown = null;

        try {
          payload = await response.json();
        } catch {
          payload = null;
        }

        if (!response.ok) {
          throw new Error(toErrorMessage(payload, ui.fetchError));
        }

        if (isExpiredPayload(payload)) {
          clearStoredInbox();
          setInbox(null);
          setMessages([]);
          setErrorMessage(ui.expiredMessage);
          setCopied(false);
          return;
        }

        const parsed = parseMessagesPayload(payload);

        if (!parsed) {
          throw new Error(ui.fetchError);
        }

        setMessages(parsed.messages);
        setErrorMessage('');

        setInbox((current) => {
          if (!current || current.token !== token) {
            return current;
          }

          const updatedSession: InboxSession = {
            token: current.token,
            address: parsed.address,
            expiresAt: parsed.expiresAt,
          };

          persistInbox(updatedSession);
          return updatedSession;
        });
      } catch (error: unknown) {
        if (!silent) {
          setErrorMessage(error instanceof Error ? error.message : ui.fetchError);
        }
      } finally {
        if (!silent) {
          setIsRefreshing(false);
        }
      }
    },
    [clearStoredInbox, persistInbox, ui.fetchError, ui.expiredMessage],
  );

  useEffect(() => {
    const timerId = globalThis.setInterval(() => setNowMs(Date.now()), 1000);
    return () => globalThis.clearInterval(timerId);
  }, []);

  useEffect(() => {
    setIsHydrated(true);

    try {
      const token = globalThis.localStorage.getItem(localStorageKeys.token)?.trim().toLowerCase();
      const address = globalThis.localStorage.getItem(localStorageKeys.address)?.trim().toLowerCase();
      const expiresAt = globalThis.localStorage.getItem(localStorageKeys.expiresAt)?.trim();

      if (!token || !address || !expiresAt) {
        return;
      }

      if (!/^[a-f0-9]{64}$/.test(token)) {
        clearStoredInbox();
        return;
      }

      if (getRemainingSeconds(expiresAt, Date.now()) <= 0) {
        clearStoredInbox();
        return;
      }

      const restoredInbox: InboxSession = {
        token,
        address,
        expiresAt,
      };

      setInbox(restoredInbox);
      setStatusMessage(ui.restoreInfo);
      void fetchMessages(token, { silent: true });
    } catch {
      clearStoredInbox();
    }
  }, [clearStoredInbox, fetchMessages, ui.restoreInfo]);

  useEffect(() => {
    if (!inbox?.token) {
      return;
    }

    const intervalId = globalThis.setInterval(() => {
      if (globalThis.document.visibilityState !== 'visible') {
        return;
      }

      void fetchMessages(inbox.token, { silent: true });
    }, 5000);

    return () => globalThis.clearInterval(intervalId);
  }, [fetchMessages, inbox?.token]);

  useEffect(() => {
    if (!inbox) {
      return;
    }

    if (getRemainingSeconds(inbox.expiresAt, nowMs) > 0) {
      return;
    }

    clearStoredInbox();
    setInbox(null);
    setMessages([]);
    setCopied(false);
    setErrorMessage(ui.expiredMessage);
  }, [clearStoredInbox, inbox, nowMs, ui.expiredMessage]);

  const remainingSeconds = useMemo(
    () => (inbox ? getRemainingSeconds(inbox.expiresAt, nowMs) : 0),
    [inbox, nowMs],
  );

  const handleCreateInbox = async () => {
    setIsCreating(true);
    setErrorMessage('');
    setStatusMessage('');
    setCopied(false);

    try {
      const response = await fetch('/api/tools/temp-email/create', {
        method: 'POST',
        cache: 'no-store',
      });

      let payload: unknown = null;

      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (!response.ok) {
        throw new Error(toErrorMessage(payload, ui.createError));
      }

      const parsed = parseInboxPayload(payload);

      if (!parsed) {
        throw new Error(ui.createError);
      }

      const nextInbox: InboxSession = {
        token: parsed.token,
        address: parsed.address,
        expiresAt: parsed.expiresAt,
      };

      persistInbox(nextInbox);
      setInbox(nextInbox);
      setMessages([]);
      setStatusMessage(ui.createdSuccess);
      await fetchMessages(nextInbox.token, { silent: true });
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : ui.createError);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRefresh = async () => {
    if (!inbox?.token) {
      return;
    }

    setStatusMessage('');
    await fetchMessages(inbox.token);
  };

  const handleCopyAddress = async () => {
    if (!inbox?.address) {
      return;
    }

    try {
      await navigator.clipboard.writeText(inbox.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setErrorMessage(ui.copyError);
    }
  };

  const handleDeleteInbox = async () => {
    if (!inbox?.token) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/tools/temp-email/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: inbox.token }),
      });

      let payload: unknown = null;

      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (!response.ok) {
        throw new Error(toErrorMessage(payload, ui.fetchError));
      }

      clearStoredInbox();
      setInbox(null);
      setMessages([]);
      setCopied(false);
      setStatusMessage(ui.deletedSuccess);
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : ui.fetchError);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="space-y-5">
      <header className="rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 to-indigo-50 p-4">
        <h3 className="text-lg font-semibold text-slate-900">{ui.title}</h3>
        <p className="mt-1 text-sm text-slate-700">{ui.intro}</p>
      </header>

      {!inbox ? (
        <div className="space-y-3">
          <Button onClick={handleCreateInbox} disabled={isCreating}>
            {isCreating ? ui.generating : ui.generate}
          </Button>
          {!isHydrated ? <p className="text-sm text-slate-600">{ui.loadingInitial}</p> : null}
        </div>
      ) : (
        <div className="space-y-4">
          <section className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm font-semibold text-slate-800">{ui.inboxTitle}</h4>
              <span className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                {remainingSeconds > 0
                  ? `${ui.expiresIn} ${formatRemaining(remainingSeconds)}`
                  : ui.expiredBadge}
              </span>
            </div>
            <p className="break-all rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-900">
              {inbox.address}
            </p>

            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={handleCopyAddress}>
                {copied ? ui.copied : ui.copy}
              </Button>
              <Button variant="secondary" onClick={handleRefresh} disabled={isRefreshing}>
                {isRefreshing ? ui.refreshing : ui.refresh}
              </Button>
              <Button variant="secondary" onClick={handleCreateInbox} disabled={isCreating}>
                {isCreating ? ui.generating : ui.generateNew}
              </Button>
              <Button variant="ghost" onClick={handleDeleteInbox} disabled={isDeleting}>
                {isDeleting ? ui.deleting : ui.deleteEmail}
              </Button>
            </div>
          </section>

          <section className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-800">{ui.messagesTitle}</h4>

            {messages.length === 0 ? (
              <p className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-600">
                {ui.emptyInbox}
              </p>
            ) : (
              <div className="space-y-3">
                {messages.map((message) => {
                  const previewText = message.text?.trim()
                    ? message.text
                    : message.html
                      ? stripHtml(message.html)
                      : '';

                  return (
                    <details
                      key={message.id}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                    >
                      <summary className="cursor-pointer list-none space-y-1 pr-6">
                        <p className="text-sm font-semibold text-slate-900">{message.subject || '(sem assunto)'}</p>
                        <p className="text-xs text-slate-600">
                          {ui.from}: {message.from}
                        </p>
                        <p className="text-xs text-slate-500">
                          {ui.receivedAt}: {formatReceivedAt(message.receivedAt, locale)}
                        </p>
                        <p className="line-clamp-2 text-xs text-slate-600">
                          {ui.preview}: {previewText || '-'}
                        </p>
                        <p className="text-xs font-semibold text-brand-700">{ui.readMore}</p>
                      </summary>

                      <div className="mt-3 space-y-3 border-t border-slate-100 pt-3">
                        <div className="space-y-2">
                          <h5 className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                            {ui.textContent}
                          </h5>
                          <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800">
                            {message.text?.trim() ? message.text : ui.noTextContent}
                          </pre>
                        </div>

                        <div className="space-y-2">
                          <h5 className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                            {ui.htmlContent}
                          </h5>
                          {message.html?.trim() ? (
                            <iframe
                              title={`${ui.htmlContent} - ${message.id}`}
                              sandbox=""
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              srcDoc={buildSafeHtmlDocument(message.html)}
                              className="h-64 w-full rounded-lg border border-slate-200 bg-white"
                            />
                          ) : (
                            <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                              {ui.noHtmlContent}
                            </p>
                          )}
                        </div>
                      </div>
                    </details>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}

      {errorMessage ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      {statusMessage ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {statusMessage}
        </p>
      ) : null}

      <section className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <h4 className="text-sm font-semibold text-amber-900">{ui.privacyTitle}</h4>
        <p className="mt-1 text-xs leading-6 text-amber-900">{ui.privacyNote}</p>
      </section>
    </Card>
  );
}
