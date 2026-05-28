'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { AppLocale } from '@/lib/i18n/config';
import { generateMessageLinks } from '@/lib/message-link-generator';

type WhatsAppTelegramLinkGeneratorToolProps = Readonly<{ locale?: AppLocale }>;

type ToolUiCopy = {
  localNote: string;
  targetLabel: string;
  targetPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  generate: string;
  clear: string;
  copied: string;
  copy: string;
  open: string;
  whatsappTitle: string;
  telegramTitle: string;
  resultEmpty: string;
  invalidTarget: string;
  whatsappNeedsPhone: string;
  parsedAsPhone: string;
  parsedAsUsername: string;
};

const uiByLocale: Record<AppLocale, ToolUiCopy> = {
  'pt-br': {
    localNote: 'Geracao local no navegador. Sem cadastro e sem envio obrigatorio para servidor.',
    targetLabel: 'Numero ou @nick',
    targetPlaceholder: 'Ex.: 5511999998888 ou @meuperfil',
    messageLabel: 'Mensagem pronta',
    messagePlaceholder: 'Ola! Quero saber mais sobre... ',
    generate: 'Gerar links',
    clear: 'Limpar',
    copied: 'Copiado',
    copy: 'Copiar',
    open: 'Abrir link',
    whatsappTitle: 'Link do WhatsApp',
    telegramTitle: 'Link do Telegram',
    resultEmpty: 'Preencha os campos e clique em gerar.',
    invalidTarget: 'Informe um numero valido ou @nick com pelo menos 3 caracteres.',
    whatsappNeedsPhone: 'Para WhatsApp use numero com codigo do pais. @nick funciona apenas no Telegram.',
    parsedAsPhone: 'Detectado como numero internacional.',
    parsedAsUsername: 'Detectado como @nick/usuario.',
  },
  en: {
    localNote: 'Local in-browser generation. No sign-up and no mandatory backend upload.',
    targetLabel: 'Phone number or @username',
    targetPlaceholder: 'Ex.: 15551234567 or @myprofile',
    messageLabel: 'Prefilled message',
    messagePlaceholder: 'Hi! I would like to know more about... ',
    generate: 'Generate links',
    clear: 'Clear',
    copied: 'Copied',
    copy: 'Copy',
    open: 'Open link',
    whatsappTitle: 'WhatsApp link',
    telegramTitle: 'Telegram link',
    resultEmpty: 'Fill the fields and click generate.',
    invalidTarget: 'Enter a valid phone number or @username with at least 3 chars.',
    whatsappNeedsPhone: 'WhatsApp requires phone number with country code. @username works only on Telegram.',
    parsedAsPhone: 'Detected as international phone number.',
    parsedAsUsername: 'Detected as @username.',
  },
  es: {
    localNote: 'Generacion local en el navegador. Sin registro y sin envio obligatorio al servidor.',
    targetLabel: 'Numero o @usuario',
    targetPlaceholder: 'Ej.: 5491112345678 o @miperfil',
    messageLabel: 'Mensaje listo',
    messagePlaceholder: 'Hola! Quiero saber mas sobre... ',
    generate: 'Generar enlaces',
    clear: 'Limpiar',
    copied: 'Copiado',
    copy: 'Copiar',
    open: 'Abrir enlace',
    whatsappTitle: 'Enlace de WhatsApp',
    telegramTitle: 'Enlace de Telegram',
    resultEmpty: 'Completa los campos y haz clic en generar.',
    invalidTarget: 'Ingresa un numero valido o @usuario con al menos 3 caracteres.',
    whatsappNeedsPhone: 'WhatsApp requiere numero con codigo de pais. @usuario solo funciona en Telegram.',
    parsedAsPhone: 'Detectado como numero internacional.',
    parsedAsUsername: 'Detectado como @usuario.',
  },
};

type LinkResultCardProps = {
  title: string;
  link: string | null;
  openLabel: string;
  copyLabel: string;
  onCopy: (value: string) => Promise<void>;
};

function LinkResultCard({ title, link, openLabel, copyLabel, onCopy }: LinkResultCardProps) {
  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <Textarea readOnly value={link ?? ''} className="min-h-[100px]" placeholder="-" />
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          disabled={!link}
          onClick={() => {
            if (!link) return;
            window.open(link, '_blank', 'noopener,noreferrer');
          }}
        >
          {openLabel}
        </Button>
        <Button
          variant="secondary"
          disabled={!link}
          onClick={() => {
            if (!link) return;
            void onCopy(link);
          }}
        >
          {copyLabel}
        </Button>
      </div>
    </section>
  );
}

export function WhatsAppTelegramLinkGeneratorTool({ locale = 'pt-br' }: WhatsAppTelegramLinkGeneratorToolProps) {
  const ui = uiByLocale[locale];

  const [target, setTarget] = useState('');
  const [message, setMessage] = useState('');
  const [generated, setGenerated] = useState<ReturnType<typeof generateMessageLinks> | null>(null);
  const [copyKey, setCopyKey] = useState<'whatsapp' | 'telegram' | null>(null);

  const parsedTargetHint = useMemo(() => {
    if (!generated?.target) {
      return '';
    }

    return generated.target.kind === 'phone' ? ui.parsedAsPhone : ui.parsedAsUsername;
  }, [generated?.target, ui.parsedAsPhone, ui.parsedAsUsername]);

  const alerts = useMemo(() => {
    if (!generated) {
      return [];
    }

    return generated.errors.map((errorCode) => {
      if (errorCode === 'invalid-target') {
        return ui.invalidTarget;
      }

      if (errorCode === 'whatsapp-requires-phone') {
        return ui.whatsappNeedsPhone;
      }

      return errorCode;
    });
  }, [generated, ui.invalidTarget, ui.whatsappNeedsPhone]);

  const generate = () => {
    setCopyKey(null);
    setGenerated(generateMessageLinks(target, message));
  };

  const clear = () => {
    setTarget('');
    setMessage('');
    setGenerated(null);
    setCopyKey(null);
  };

  const copyLink = async (key: 'whatsapp' | 'telegram', value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopyKey(key);
      setTimeout(() => setCopyKey(null), 1200);
    } catch {
      setCopyKey(null);
    }
  };

  const whatsappCopyLabel = copyKey === 'whatsapp' ? ui.copied : ui.copy;
  const telegramCopyLabel = copyKey === 'telegram' ? ui.copied : ui.copy;

  return (
    <Card className="space-y-5">
      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        {ui.localNote}
      </section>

      <label className="space-y-2">
        <span className="text-sm font-semibold text-slate-800">{ui.targetLabel}</span>
        <Input value={target} onChange={(event) => setTarget(event.target.value)} placeholder={ui.targetPlaceholder} />
      </label>

      <label className="space-y-2">
        <span className="text-sm font-semibold text-slate-800">{ui.messageLabel}</span>
        <Textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={ui.messagePlaceholder}
          className="min-h-[140px]"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={generate}>{ui.generate}</Button>
        <Button variant="ghost" onClick={clear}>{ui.clear}</Button>
      </div>

      {generated ? (
        <section className="space-y-2">
          {parsedTargetHint ? (
            <p className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800">{parsedTargetHint}</p>
          ) : null}

          {alerts.map((alert) => (
            <p key={alert} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              {alert}
            </p>
          ))}
        </section>
      ) : (
        <p className="text-sm text-slate-600">{ui.resultEmpty}</p>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <LinkResultCard
          title={ui.whatsappTitle}
          link={generated?.whatsappLink ?? null}
          openLabel={ui.open}
          copyLabel={whatsappCopyLabel}
          onCopy={(value) => copyLink('whatsapp', value)}
        />
        <LinkResultCard
          title={ui.telegramTitle}
          link={generated?.telegramLink ?? null}
          openLabel={ui.open}
          copyLabel={telegramCopyLabel}
          onCopy={(value) => copyLink('telegram', value)}
        />
      </div>
    </Card>
  );
}
