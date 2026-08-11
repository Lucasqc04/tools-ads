'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AtSign,
  Check,
  ChevronLeft,
  Code2,
  Copy,
  Eye,
  EyeOff,
  FileCode2,
  Inbox,
  Info,
  LoaderCircle,
  Mail,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  buildTempEmailPreviewDocument,
  extractEmailCodeSnippets,
  getTempEmailPreview,
} from '@/lib/temp-email-content';
import { cn } from '@/lib/cn';
import { type AppLocale } from '@/lib/i18n/config';
import type {
  TempEmailInboxPayload,
  TempEmailMessage,
  TempEmailMessagesPayload,
} from '@/types/temp-email';

type TempEmailToolProps = Readonly<{
  locale?: AppLocale;
  domain?: string;
}>;

type TempEmailUi = {
  title: string;
  intro: string;
  createTitle: string;
  createDescription: string;
  customLabel: string;
  customHint: string;
  customPlaceholder: string;
  randomPreview: string;
  customInvalid: string;
  customUnavailable: string;
  generate: string;
  createCustom: string;
  generateNew: string;
  generating: string;
  loadingInitial: string;
  inboxTitle: string;
  live: string;
  autoRefresh: string;
  expiresIn: string;
  expiredBadge: string;
  copy: string;
  copied: string;
  copyAddress: string;
  refresh: string;
  refreshing: string;
  deleteEmail: string;
  deleting: string;
  deleteConfirm: string;
  messagesTitle: string;
  message: string;
  messagesCount: string;
  emptyInbox: string;
  emptyInboxHint: string;
  from: string;
  to: string;
  replyTo: string;
  messageId: string;
  receivedAt: string;
  preview: string;
  textContent: string;
  sourceContent: string;
  metadata: string;
  stylesProtected: string;
  javascriptBlocked: string;
  loadImages: string;
  hideImages: string;
  remoteImagesHint: string;
  noTextContent: string;
  noHtmlContent: string;
  codeSnippets: string;
  detectedCode: string;
  backToInbox: string;
  selectedEmpty: string;
  receivedSuccess: string;
  createdSuccess: string;
  deletedSuccess: string;
  expiredMessage: string;
  restoreInfo: string;
  privacyTitle: string;
  privacyNote: string;
  fetchError: string;
  createError: string;
  copyError: string;
};

type InboxSession = {
  token: string;
  address: string;
  expiresAt: string;
};

type MessageView = 'preview' | 'text' | 'source';

const localStorageKeys = {
  token: 'temp_email_token',
  address: 'temp_email_address',
  expiresAt: 'temp_email_expires_at',
} as const;

const customLocalPartPattern = /^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$/;

const localeTagByLocale: Record<AppLocale, string> = {
  'pt-br': 'pt-BR',
  en: 'en-US',
  es: 'es-ES',
};

const uiByLocale: Record<AppLocale, TempEmailUi> = {
  'pt-br': {
    title: 'Inbox temporaria',
    intro: 'Receba mensagens em um endereco descartavel, com expiracao automatica e leitura isolada.',
    createTitle: 'Crie uma inbox em segundos',
    createDescription: 'Use um nome aleatorio ou escolha o prefixo que aparece antes do @.',
    customLabel: 'Prefixo do e-mail',
    customHint: 'Opcional. Use 3 a 40 caracteres: letras, numeros, ponto, hifen ou _.',
    customPlaceholder: 'meu-teste',
    randomPreview: 'aleatorio',
    customInvalid: 'Use de 3 a 40 caracteres, sem espacos ou separadores repetidos.',
    customUnavailable: 'Esse endereco ja esta em uso. Tente outro prefixo.',
    generate: 'Gerar endereco aleatorio',
    createCustom: 'Criar este endereco',
    generateNew: 'Novo endereco',
    generating: 'Criando...',
    loadingInitial: 'Recuperando sua inbox salva...',
    inboxTitle: 'Inbox ativa',
    live: 'Ativa',
    autoRefresh: 'Atualiza automaticamente',
    expiresIn: 'Expira em',
    expiredBadge: 'Expirada',
    copy: 'Copiar',
    copied: 'Copiado',
    copyAddress: 'Copiar endereco',
    refresh: 'Atualizar',
    refreshing: 'Atualizando...',
    deleteEmail: 'Apagar inbox',
    deleting: 'Apagando...',
    deleteConfirm: 'Apagar esta inbox e todas as mensagens agora?',
    messagesTitle: 'Mensagens',
    message: 'mensagem',
    messagesCount: 'mensagens',
    emptyInbox: 'Sua inbox esta aguardando a primeira mensagem.',
    emptyInboxHint: 'O endereco ja esta pronto para receber. Esta tela atualiza automaticamente.',
    from: 'De',
    to: 'Para',
    replyTo: 'Responder para',
    messageId: 'ID da mensagem',
    receivedAt: 'Recebido',
    preview: 'Visual',
    textContent: 'Texto',
    sourceContent: 'HTML',
    metadata: 'Detalhes da mensagem',
    stylesProtected: 'Estilos do e-mail preservados em uma visualizacao isolada.',
    javascriptBlocked: 'JavaScript e formularios permanecem bloqueados por seguranca.',
    loadImages: 'Carregar imagens',
    hideImages: 'Bloquear imagens',
    remoteImagesHint: 'Imagens externas podem avisar o remetente de que a mensagem foi aberta.',
    noTextContent: 'Esta mensagem nao possui versao em texto.',
    noHtmlContent: 'Esta mensagem nao possui versao HTML.',
    codeSnippets: 'Codigo detectado',
    detectedCode: 'Trechos encontrados no e-mail',
    backToInbox: 'Voltar para mensagens',
    selectedEmpty: 'Selecione uma mensagem para ler os detalhes.',
    receivedSuccess: 'Inbox atualizada.',
    createdSuccess: 'Nova inbox criada com sucesso.',
    deletedSuccess: 'Inbox apagada com sucesso.',
    expiredMessage: 'Esta inbox expirou. Gere um novo e-mail temporario.',
    restoreInfo: 'Inbox recuperada neste navegador.',
    privacyTitle: 'Privacidade e seguranca',
    privacyNote: 'As mensagens expiram automaticamente. Nao use esta inbox para bancos, contas importantes ou recuperacao de senha. Imagens externas ficam bloqueadas ate voce decidir carrega-las.',
    fetchError: 'Nao foi possivel atualizar a inbox agora.',
    createError: 'Nao foi possivel gerar um e-mail temporario agora.',
    copyError: 'Nao foi possivel copiar agora. Tente novamente.',
  },
  en: {
    title: 'Temporary inbox',
    intro: 'Receive messages in a disposable address with automatic expiration and isolated reading.',
    createTitle: 'Create an inbox in seconds',
    createDescription: 'Use a random name or choose the prefix before the @ sign.',
    customLabel: 'Email prefix',
    customHint: 'Optional. Use 3 to 40 letters, numbers, dots, hyphens, or underscores.',
    customPlaceholder: 'my-test',
    randomPreview: 'random',
    customInvalid: 'Use 3 to 40 characters, with no spaces or repeated separators.',
    customUnavailable: 'This address is already in use. Try another prefix.',
    generate: 'Generate random address',
    createCustom: 'Create this address',
    generateNew: 'New address',
    generating: 'Creating...',
    loadingInitial: 'Restoring your saved inbox...',
    inboxTitle: 'Active inbox',
    live: 'Active',
    autoRefresh: 'Refreshes automatically',
    expiresIn: 'Expires in',
    expiredBadge: 'Expired',
    copy: 'Copy',
    copied: 'Copied',
    copyAddress: 'Copy address',
    refresh: 'Refresh',
    refreshing: 'Refreshing...',
    deleteEmail: 'Delete inbox',
    deleting: 'Deleting...',
    deleteConfirm: 'Delete this inbox and all messages now?',
    messagesTitle: 'Messages',
    message: 'message',
    messagesCount: 'messages',
    emptyInbox: 'Your inbox is waiting for its first message.',
    emptyInboxHint: 'The address is ready to receive. This screen refreshes automatically.',
    from: 'From',
    to: 'To',
    replyTo: 'Reply to',
    messageId: 'Message ID',
    receivedAt: 'Received',
    preview: 'Preview',
    textContent: 'Text',
    sourceContent: 'HTML',
    metadata: 'Message details',
    stylesProtected: 'Email styles are preserved in an isolated preview.',
    javascriptBlocked: 'JavaScript and forms stay blocked for safety.',
    loadImages: 'Load images',
    hideImages: 'Block images',
    remoteImagesHint: 'External images can notify the sender that the message was opened.',
    noTextContent: 'This message has no text version.',
    noHtmlContent: 'This message has no HTML version.',
    codeSnippets: 'Detected code',
    detectedCode: 'Snippets found in this email',
    backToInbox: 'Back to messages',
    selectedEmpty: 'Select a message to read its details.',
    receivedSuccess: 'Inbox refreshed.',
    createdSuccess: 'New inbox created successfully.',
    deletedSuccess: 'Inbox deleted successfully.',
    expiredMessage: 'This inbox expired. Generate a new temporary email.',
    restoreInfo: 'Inbox restored in this browser.',
    privacyTitle: 'Privacy and safety',
    privacyNote: 'Messages expire automatically. Do not use this inbox for banking, important accounts, or password recovery. External images stay blocked until you choose to load them.',
    fetchError: 'Could not refresh the inbox right now.',
    createError: 'Could not generate a temporary email right now.',
    copyError: 'Could not copy right now. Please try again.',
  },
  es: {
    title: 'Inbox temporal',
    intro: 'Recibe mensajes en una direccion desechable con expiracion automatica y lectura aislada.',
    createTitle: 'Crea una inbox en segundos',
    createDescription: 'Usa un nombre aleatorio o elige el prefijo antes de la @.',
    customLabel: 'Prefijo del correo',
    customHint: 'Opcional. Usa de 3 a 40 letras, numeros, puntos, guiones o _.',
    customPlaceholder: 'mi-prueba',
    randomPreview: 'aleatorio',
    customInvalid: 'Usa de 3 a 40 caracteres, sin espacios ni separadores repetidos.',
    customUnavailable: 'Esta direccion ya esta en uso. Prueba otro prefijo.',
    generate: 'Generar direccion aleatoria',
    createCustom: 'Crear esta direccion',
    generateNew: 'Nueva direccion',
    generating: 'Creando...',
    loadingInitial: 'Recuperando tu inbox guardada...',
    inboxTitle: 'Inbox activa',
    live: 'Activa',
    autoRefresh: 'Se actualiza automaticamente',
    expiresIn: 'Expira en',
    expiredBadge: 'Expirada',
    copy: 'Copiar',
    copied: 'Copiado',
    copyAddress: 'Copiar direccion',
    refresh: 'Actualizar',
    refreshing: 'Actualizando...',
    deleteEmail: 'Eliminar inbox',
    deleting: 'Eliminando...',
    deleteConfirm: 'Eliminar esta inbox y todos los mensajes ahora?',
    messagesTitle: 'Mensajes',
    message: 'mensaje',
    messagesCount: 'mensajes',
    emptyInbox: 'Tu inbox esta esperando el primer mensaje.',
    emptyInboxHint: 'La direccion ya puede recibir. Esta pantalla se actualiza automaticamente.',
    from: 'De',
    to: 'Para',
    replyTo: 'Responder a',
    messageId: 'ID del mensaje',
    receivedAt: 'Recibido',
    preview: 'Vista',
    textContent: 'Texto',
    sourceContent: 'HTML',
    metadata: 'Detalles del mensaje',
    stylesProtected: 'Los estilos del correo se conservan en una vista aislada.',
    javascriptBlocked: 'JavaScript y formularios permanecen bloqueados por seguridad.',
    loadImages: 'Cargar imagenes',
    hideImages: 'Bloquear imagenes',
    remoteImagesHint: 'Las imagenes externas pueden avisar al remitente de que abriste el mensaje.',
    noTextContent: 'Este mensaje no tiene version de texto.',
    noHtmlContent: 'Este mensaje no tiene version HTML.',
    codeSnippets: 'Codigo detectado',
    detectedCode: 'Fragmentos encontrados en este correo',
    backToInbox: 'Volver a mensajes',
    selectedEmpty: 'Selecciona un mensaje para leer sus detalles.',
    receivedSuccess: 'Inbox actualizada.',
    createdSuccess: 'Nueva inbox creada correctamente.',
    deletedSuccess: 'Inbox eliminada correctamente.',
    expiredMessage: 'Esta inbox expiro. Genera un nuevo correo temporal.',
    restoreInfo: 'Inbox recuperada en este navegador.',
    privacyTitle: 'Privacidad y seguridad',
    privacyNote: 'Los mensajes expiran automaticamente. No uses esta inbox para bancos, cuentas importantes ni recuperacion de contrasena. Las imagenes externas quedan bloqueadas hasta que decidas cargarlas.',
    fetchError: 'No fue posible actualizar la inbox ahora.',
    createError: 'No fue posible generar un correo temporal ahora.',
    copyError: 'No fue posible copiar ahora. Intentalo nuevamente.',
  },
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const getApiError = (value: unknown): string | null =>
  isPlainObject(value) && typeof value.error === 'string' && value.error.trim()
    ? value.error
    : null;

const toErrorMessage = (value: unknown, fallback: string, ui: TempEmailUi): string => {
  const error = getApiError(value);

  if (error === 'custom_prefix_invalid') {
    return ui.customInvalid;
  }

  if (error === 'custom_address_unavailable') {
    return ui.customUnavailable;
  }

  return error ?? fallback;
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
  if (
    !isPlainObject(value) ||
    typeof value.address !== 'string' ||
    typeof value.expiresAt !== 'string' ||
    !Array.isArray(value.messages)
  ) {
    return null;
  }

  const messages = value.messages.flatMap((item): TempEmailMessage[] => {
    if (
      !isPlainObject(item) ||
      typeof item.id !== 'string' ||
      typeof item.from !== 'string' ||
      typeof item.to !== 'string' ||
      typeof item.subject !== 'string' ||
      typeof item.receivedAt !== 'string'
    ) {
      return [];
    }

    return [
      {
        id: item.id,
        from: item.from,
        to: item.to,
        subject: item.subject,
        replyTo: typeof item.replyTo === 'string' ? item.replyTo : undefined,
        messageId: typeof item.messageId === 'string' ? item.messageId : undefined,
        text: typeof item.text === 'string' ? item.text : undefined,
        html: typeof item.html === 'string' ? item.html : undefined,
        receivedAt: item.receivedAt,
      },
    ];
  });

  return {
    address: value.address,
    expiresAt: value.expiresAt,
    messages,
  };
};

const isExpiredPayload = (value: unknown): boolean =>
  isPlainObject(value) && value.expired === true;

const getRemainingSeconds = (expiresAt: string, nowMs: number): number => {
  const expiresAtMs = Date.parse(expiresAt);
  return Number.isFinite(expiresAtMs) ? Math.max(0, Math.floor((expiresAtMs - nowMs) / 1000)) : 0;
};

const formatRemaining = (seconds: number): string => {
  if (seconds <= 0) {
    return '0m 00s';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return hours > 0
    ? `${hours}h ${String(minutes).padStart(2, '0')}m`
    : `${minutes}m ${String(secs).padStart(2, '0')}s`;
};

const formatReceivedAt = (value: string, locale: AppLocale): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(localeTagByLocale[locale], {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

const getAddressFromHeader = (value: string): string => value.match(/<([^>]+)>/)?.[1] ?? value;

const isValidCustomLocalPart = (value: string): boolean =>
  value.length >= 3 &&
  value.length <= 40 &&
  customLocalPartPattern.test(value) &&
  !/[._-]{2,}/.test(value);

export function TempEmailTool({ locale = 'pt-br', domain = 'mail.lucasqc.com' }: TempEmailToolProps) {
  const ui = uiByLocale[locale];
  const normalizedDomain = domain.trim().toLowerCase() || 'mail.lucasqc.com';

  const [inbox, setInbox] = useState<InboxSession | null>(null);
  const [messages, setMessages] = useState<TempEmailMessage[]>([]);
  const [customLocalPart, setCustomLocalPart] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [messageView, setMessageView] = useState<MessageView>('preview');
  const [remoteImagesEnabled, setRemoteImagesEnabled] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [isHydrated, setIsHydrated] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedTarget, setCopiedTarget] = useState<string | null>(null);
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
    async (token: string, options?: Readonly<{ silent?: boolean }>) => {
      const silent = options?.silent === true;

      if (!silent) {
        setIsRefreshing(true);
      }

      try {
        const response = await fetch(
          `/api/tools/temp-email/messages?token=${encodeURIComponent(token)}`,
          { method: 'GET', cache: 'no-store' },
        );
        let payload: unknown = null;

        try {
          payload = await response.json();
        } catch {
          payload = null;
        }

        if (!response.ok) {
          throw new Error(toErrorMessage(payload, ui.fetchError, ui));
        }

        if (isExpiredPayload(payload)) {
          clearStoredInbox();
          setInbox(null);
          setMessages([]);
          setSelectedMessageId(null);
          setErrorMessage(ui.expiredMessage);
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

          const next = { token: current.token, address: parsed.address, expiresAt: parsed.expiresAt };
          persistInbox(next);
          return next;
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
    [clearStoredInbox, persistInbox, ui],
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

      if (!/^[a-f0-9]{64}$/.test(token) || getRemainingSeconds(expiresAt, Date.now()) <= 0) {
        clearStoredInbox();
        return;
      }

      const restoredInbox = { token, address, expiresAt };
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
      if (globalThis.document.visibilityState === 'visible') {
        void fetchMessages(inbox.token, { silent: true });
      }
    }, 10_000);

    return () => globalThis.clearInterval(intervalId);
  }, [fetchMessages, inbox?.token]);

  useEffect(() => {
    if (!inbox || getRemainingSeconds(inbox.expiresAt, nowMs) > 0) {
      return;
    }

    clearStoredInbox();
    setInbox(null);
    setMessages([]);
    setSelectedMessageId(null);
    setErrorMessage(ui.expiredMessage);
  }, [clearStoredInbox, inbox, nowMs, ui.expiredMessage]);

  useEffect(() => {
    setSelectedMessageId((current) =>
      current && messages.some((message) => message.id === current)
        ? current
        : (messages[0]?.id ?? null),
    );
  }, [messages]);

  const remainingSeconds = useMemo(
    () => (inbox ? getRemainingSeconds(inbox.expiresAt, nowMs) : 0),
    [inbox, nowMs],
  );
  const selectedMessage = useMemo(
    () => messages.find((message) => message.id === selectedMessageId) ?? null,
    [messages, selectedMessageId],
  );
  const selectedCodeSnippets = useMemo(
    () =>
      isHydrated && selectedMessage
        ? extractEmailCodeSnippets({ text: selectedMessage.text, html: selectedMessage.html })
        : [],
    [isHydrated, selectedMessage],
  );
  const requestedLocalPart = customLocalPart.trim().toLowerCase();
  const addressPreview = `${requestedLocalPart || ui.randomPreview}@${normalizedDomain}`;

  const handleCreateInbox = async (requestedPrefix = requestedLocalPart) => {
    if (requestedPrefix && !isValidCustomLocalPart(requestedPrefix)) {
      setErrorMessage(ui.customInvalid);
      return;
    }

    setIsCreating(true);
    setErrorMessage('');
    setStatusMessage('');

    try {
      const response = await fetch('/api/tools/temp-email/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify(requestedPrefix ? { localPart: requestedPrefix } : {}),
      });
      let payload: unknown = null;

      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (!response.ok) {
        throw new Error(toErrorMessage(payload, ui.createError, ui));
      }

      const parsed = parseInboxPayload(payload);

      if (!parsed) {
        throw new Error(ui.createError);
      }

      const nextInbox = { token: parsed.token, address: parsed.address, expiresAt: parsed.expiresAt };
      persistInbox(nextInbox);
      setInbox(nextInbox);
      setMessages([]);
      setSelectedMessageId(null);
      setRemoteImagesEnabled(false);
      setStatusMessage(ui.createdSuccess);
      await fetchMessages(nextInbox.token, { silent: true });
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : ui.createError);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = async (value: string, target: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedTarget(target);
      globalThis.setTimeout(() => setCopiedTarget((current) => (current === target ? null : current)), 1_600);
    } catch {
      setErrorMessage(ui.copyError);
    }
  };

  const handleRefresh = async () => {
    if (!inbox?.token) {
      return;
    }

    setStatusMessage('');
    await fetchMessages(inbox.token);
  };

  const handleDeleteInbox = async () => {
    if (!inbox?.token || !globalThis.confirm(ui.deleteConfirm)) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/tools/temp-email/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: inbox.token }),
      });
      let payload: unknown = null;

      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (!response.ok) {
        throw new Error(toErrorMessage(payload, ui.fetchError, ui));
      }

      clearStoredInbox();
      setInbox(null);
      setMessages([]);
      setSelectedMessageId(null);
      setStatusMessage(ui.deletedSuccess);
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : ui.fetchError);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectMessage = (message: TempEmailMessage) => {
    setSelectedMessageId(message.id);
    setMessageView(message.html?.trim() ? 'preview' : 'text');
    setRemoteImagesEnabled(false);
  };

  const messageCountLabel = `${messages.length} ${messages.length === 1 ? ui.message : ui.messagesCount}`;

  return (
    <section className="temp-email-enter overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <header className="border-b border-slate-800 bg-slate-950 px-4 py-5 text-white sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
              <Mail className="h-4 w-4" aria-hidden="true" />
              {ui.title}
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{ui.intro}</p>
          </div>
          {inbox ? (
            <div className="flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-200">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" aria-hidden="true" />
              {ui.live}
            </div>
          ) : null}
        </div>
      </header>

      {!inbox ? (
        <div className="grid lg:grid-cols-[minmax(0,1fr)_260px]">
          <form
            className="space-y-5 p-4 sm:p-6"
            onSubmit={(event) => {
              event.preventDefault();
              void handleCreateInbox();
            }}
          >
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">{ui.createTitle}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">{ui.createDescription}</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="temp-email-custom-prefix" className="text-sm font-semibold text-slate-800">
                {ui.customLabel}
              </label>
              <div className="flex min-w-0 overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm transition focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
                <span className="flex items-center border-r border-slate-200 px-3 text-slate-400" aria-hidden="true">
                  <AtSign className="h-4 w-4" />
                </span>
                <input
                  id="temp-email-custom-prefix"
                  value={customLocalPart}
                  onChange={(event) => setCustomLocalPart(event.target.value.toLowerCase())}
                  maxLength={40}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder={ui.customPlaceholder}
                  className="min-w-0 flex-1 bg-transparent px-3 py-3 font-mono text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
                <span className="hidden max-w-[45%] truncate border-l border-slate-200 bg-slate-50 px-3 py-3 font-mono text-xs text-slate-500 sm:block">
                  @{normalizedDomain}
                </span>
              </div>
              <p className="text-xs leading-5 text-slate-500">{ui.customHint}</p>
              <p className="truncate rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs text-slate-600" title={addressPreview}>
                {addressPreview}
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="submit" disabled={isCreating} className="gap-2">
                {isCreating ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Sparkles className="h-4 w-4" aria-hidden="true" />}
                {isCreating ? ui.generating : requestedLocalPart ? ui.createCustom : ui.generate}
              </Button>
              {requestedLocalPart ? (
                <Button type="button" variant="secondary" disabled={isCreating} onClick={() => void handleCreateInbox('')} className="gap-2">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  {ui.generate}
                </Button>
              ) : null}
            </div>

            {!isHydrated ? <p className="text-sm text-slate-500">{ui.loadingInitial}</p> : null}
          </form>

          <aside className="border-t border-slate-200 bg-slate-50 p-4 sm:p-6 lg:border-l lg:border-t-0">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <ShieldCheck className="h-4 w-4 text-brand-600" aria-hidden="true" />
              {ui.privacyTitle}
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{ui.privacyNote}</p>
          </aside>
        </div>
      ) : (
        <div>
          <section className="border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h2 className="text-sm font-semibold text-slate-800">{ui.inboxTitle}</h2>
                  <span className="text-xs text-slate-500">{ui.autoRefresh}</span>
                </div>
                <div className="mt-2 flex min-w-0 items-center gap-2">
                  <p className="min-w-0 truncate font-mono text-base font-semibold text-slate-950" title={inbox.address}>
                    {inbox.address}
                  </p>
                  <button
                    type="button"
                    onClick={() => void handleCopy(inbox.address, 'address')}
                    className="inline-flex h-8 shrink-0 items-center gap-1 rounded-md border border-slate-300 bg-white px-2 text-xs font-semibold text-slate-700 transition hover:border-brand-400 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    aria-label={ui.copyAddress}
                  >
                    {copiedTarget === 'address' ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
                    {copiedTarget === 'address' ? ui.copied : ui.copy}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
                  {remainingSeconds > 0 ? `${ui.expiresIn} ${formatRemaining(remainingSeconds)}` : ui.expiredBadge}
                </span>
                <Button variant="secondary" onClick={handleRefresh} disabled={isRefreshing} className="gap-2">
                  <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} aria-hidden="true" />
                  {isRefreshing ? ui.refreshing : ui.refresh}
                </Button>
                <Button variant="secondary" onClick={() => void handleCreateInbox('')} disabled={isCreating} className="gap-2">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  {ui.generateNew}
                </Button>
                <Button variant="ghost" onClick={() => void handleDeleteInbox()} disabled={isDeleting} className="gap-2 text-red-700 hover:bg-red-50 hover:text-red-800">
                  {isDeleting ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
                  {isDeleting ? ui.deleting : ui.deleteEmail}
                </Button>
              </div>
            </div>
          </section>

          <div className="grid min-h-[620px] lg:grid-cols-[310px_minmax(0,1fr)]">
            <aside className={cn('min-w-0 border-r border-slate-200 bg-slate-50/70 lg:block', selectedMessage ? 'hidden lg:block' : 'block')}>
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
                <div className="flex items-center gap-2">
                  <Inbox className="h-4 w-4 text-slate-500" aria-hidden="true" />
                  <h3 className="text-sm font-semibold text-slate-900">{ui.messagesTitle}</h3>
                </div>
                <span className="text-xs font-medium text-slate-500">{messageCountLabel}</span>
              </div>

              {messages.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <Mail className="mx-auto h-6 w-6 text-slate-300" aria-hidden="true" />
                  <p className="mt-3 text-sm font-medium text-slate-700">{ui.emptyInbox}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{ui.emptyInboxHint}</p>
                </div>
              ) : (
                <div className="max-h-[560px] overflow-y-auto lg:max-h-[680px]">
                  {messages.map((message) => {
                    const isSelected = message.id === selectedMessageId;
                    const previewText = getTempEmailPreview(message.text, message.html);

                    return (
                      <button
                        key={message.id}
                        type="button"
                        onClick={() => handleSelectMessage(message)}
                        className={cn(
                          'group block w-full border-b border-slate-200 px-4 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500',
                          isSelected ? 'bg-white shadow-[inset_3px_0_0_0_#2563eb]' : 'hover:bg-white',
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="min-w-0 truncate text-xs font-semibold text-slate-700">{message.from}</p>
                          <time className="shrink-0 text-[11px] text-slate-400">{formatReceivedAt(message.receivedAt, locale)}</time>
                        </div>
                        <p className="mt-1 truncate text-sm font-semibold text-slate-950">{message.subject || '(sem assunto)'}</p>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{previewText || '-'}</p>
                      </button>
                    );
                  })}
                </div>
              )}
            </aside>

            <article className={cn('min-w-0 bg-white lg:block', selectedMessage ? 'block' : 'hidden lg:block')}>
              {selectedMessage ? (
                <div className="temp-email-preview-enter flex min-h-full flex-col" key={selectedMessage.id}>
                  <header className="border-b border-slate-200 px-4 py-4 sm:px-6">
                    <button
                      type="button"
                      onClick={() => setSelectedMessageId(null)}
                      className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800 lg:hidden"
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                      {ui.backToInbox}
                    </button>
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0">
                        <h3 className="break-words text-xl font-semibold tracking-tight text-slate-950">
                          {selectedMessage.subject || '(sem assunto)'}
                        </h3>
                        <p className="mt-2 break-all text-sm text-slate-600">
                          <span className="font-medium text-slate-800">{ui.from}:</span> {selectedMessage.from}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleCopy(selectedMessage.from, `from-${selectedMessage.id}`)}
                        className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-3 text-xs font-semibold text-slate-700 transition hover:border-brand-400 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                      >
                        {copiedTarget === `from-${selectedMessage.id}` ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
                        {copiedTarget === `from-${selectedMessage.id}` ? ui.copied : ui.copy}
                      </button>
                    </div>
                  </header>

                  <section className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6" aria-labelledby="temp-email-message-meta">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-slate-500" aria-hidden="true" />
                      <h4 id="temp-email-message-meta" className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {ui.metadata}
                      </h4>
                    </div>
                    <dl className="mt-3 grid gap-x-6 gap-y-3 text-xs sm:grid-cols-2 xl:grid-cols-4">
                      <div className="min-w-0">
                        <dt className="font-medium text-slate-500">{ui.to}</dt>
                        <dd className="mt-1 break-all text-slate-800">{selectedMessage.to}</dd>
                      </div>
                      <div className="min-w-0">
                        <dt className="font-medium text-slate-500">{ui.receivedAt}</dt>
                        <dd className="mt-1 text-slate-800">{formatReceivedAt(selectedMessage.receivedAt, locale)}</dd>
                      </div>
                      <div className="min-w-0">
                        <dt className="font-medium text-slate-500">{ui.replyTo}</dt>
                        <dd className="mt-1 break-all text-slate-800">{selectedMessage.replyTo || getAddressFromHeader(selectedMessage.from)}</dd>
                      </div>
                      <div className="min-w-0">
                        <dt className="font-medium text-slate-500">{ui.messageId}</dt>
                        <dd className="mt-1 break-all text-slate-800">{selectedMessage.messageId || '-'}</dd>
                      </div>
                    </dl>
                  </section>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-6">
                    <div className="inline-flex max-w-full overflow-x-auto rounded-lg bg-slate-100 p-1">
                      {(['preview', 'text', 'source'] as const).map((view) => {
                        const labels: Record<MessageView, string> = {
                          preview: ui.preview,
                          text: ui.textContent,
                          source: ui.sourceContent,
                        };

                        return (
                          <button
                            key={view}
                            type="button"
                            onClick={() => setMessageView(view)}
                            className={cn(
                              'rounded-md px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                              messageView === view ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800',
                            )}
                          >
                            {labels[view]}
                          </button>
                        );
                      })}
                    </div>

                    {messageView === 'preview' && selectedMessage.html?.trim() ? (
                      <button
                        type="button"
                        onClick={() => setRemoteImagesEnabled((current) => !current)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                      >
                        {remoteImagesEnabled ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                        {remoteImagesEnabled ? ui.hideImages : ui.loadImages}
                      </button>
                    ) : null}
                  </div>

                  <div className="flex-1 p-4 sm:p-6">
                    {messageView === 'preview' ? (
                      selectedMessage.html?.trim() ? (
                        <div className="space-y-3">
                          <div className="flex flex-col gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                            <span>{ui.stylesProtected}</span>
                            <span className="font-medium text-slate-700">{ui.javascriptBlocked}</span>
                          </div>
                          {!remoteImagesEnabled ? <p className="text-xs text-slate-500">{ui.remoteImagesHint}</p> : null}
                          <iframe
                            title={`${ui.preview} - ${selectedMessage.id}`}
                            sandbox="allow-popups"
                            referrerPolicy="no-referrer"
                            srcDoc={buildTempEmailPreviewDocument(selectedMessage.html, remoteImagesEnabled)}
                            className="h-[480px] w-full rounded-xl border border-slate-200 bg-white sm:h-[580px]"
                          />
                        </div>
                      ) : (
                        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">{ui.noHtmlContent}</p>
                      )
                    ) : null}

                    {messageView === 'text' ? (
                      <pre className="max-h-[580px] overflow-auto whitespace-pre-wrap break-words rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-6 text-slate-800">
                        {selectedMessage.text?.trim() || ui.noTextContent}
                      </pre>
                    ) : null}

                    {messageView === 'source' ? (
                      <pre className="max-h-[580px] overflow-auto whitespace-pre-wrap break-words rounded-xl border border-slate-200 bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-100">
                        {selectedMessage.html?.trim() || ui.noHtmlContent}
                      </pre>
                    ) : null}

                    {selectedCodeSnippets.length > 0 ? (
                      <section className="mt-6 border-t border-slate-200 pt-5" aria-labelledby="temp-email-code-snippets">
                        <div className="flex items-center gap-2">
                          <Code2 className="h-4 w-4 text-brand-600" aria-hidden="true" />
                          <div>
                            <h4 id="temp-email-code-snippets" className="text-sm font-semibold text-slate-900">{ui.codeSnippets}</h4>
                            <p className="text-xs text-slate-500">{ui.detectedCode}</p>
                          </div>
                        </div>
                        <div className="mt-3 space-y-3">
                          {selectedCodeSnippets.map((snippet, index) => {
                            const target = `code-${selectedMessage.id}-${index}`;

                            return (
                              <div key={`${snippet.code.slice(0, 40)}-${index}`} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-950">
                                <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
                                  <span className="font-mono text-[11px] font-medium uppercase tracking-wide text-slate-300">{snippet.language || 'text'}</span>
                                  <button
                                    type="button"
                                    onClick={() => void handleCopy(snippet.code, target)}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-white transition hover:text-brand-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
                                  >
                                    {copiedTarget === target ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
                                    {copiedTarget === target ? ui.copied : ui.copy}
                                  </button>
                                </div>
                                <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words p-3 font-mono text-xs leading-6 text-slate-100">{snippet.code}</pre>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
                  <FileCode2 className="h-8 w-8 text-slate-300" aria-hidden="true" />
                  <p className="mt-3 text-sm text-slate-500">{ui.selectedEmpty}</p>
                </div>
              )}
            </article>
          </div>
        </div>
      )}

      {errorMessage ? <p className="border-t border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:px-6">{errorMessage}</p> : null}
      {statusMessage ? <p className="border-t border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 sm:px-6">{statusMessage}</p> : null}

      <style jsx>{`
        @keyframes temp-email-enter {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes temp-email-preview-enter {
          from { opacity: 0; transform: translateX(8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .temp-email-enter { animation: temp-email-enter 360ms ease-out both; }
        .temp-email-preview-enter { animation: temp-email-preview-enter 220ms ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .temp-email-enter, .temp-email-preview-enter { animation: none; }
        }
      `}</style>
    </section>
  );
}
