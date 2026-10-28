'use client';

import { Download, FileText, ImageIcon } from 'lucide-react';
import { formatBytes } from '@/lib/file-size';
import { CHAT_FILE_LARGE_BYTES, fileTypeLabel, type CallChatMessage } from '@/lib/screenshare/chat-files';
import { useRef, type PointerEvent as ReactPointerEvent, type MouseEvent as ReactMouseEvent } from 'react';
import { splitChatLinks } from '@/lib/screenshare/chat-links';

export type ChatMessageCopy = {
  you: string;
  chatFileSending: string;
  chatFileReceiving: string;
  chatFileFailed: string;
  downloadFile: string;
  viewPhoto: string;
  chatLargeReceiverBody: string;
  chatSaveToDisk: string;
  chatSavedToDisk: string;
};

type Props = {
  message: CallChatMessage;
  mine: boolean;
  copy: ChatMessageCopy;
  onPreview: (message: CallChatMessage) => void;
  onDownload: (message: CallChatMessage) => void;
  /** Right click or long press on the message: the parent shows the copy/reply menu at this point. */
  onOpenMenu: (message: CallChatMessage, x: number, y: number) => void;
  replyLabel: string;
  /** Offered for large incoming files when the browser can write straight to disk. */
  canSaveToDisk: boolean;
  onSaveToDisk: (message: CallChatMessage) => void;
};

const LONG_PRESS_MS = 480;

function MessageText({ text, mine }: { text: string; mine: boolean }) {
  return (
    <p className="whitespace-pre-wrap break-words text-sm leading-5">
      {splitChatLinks(text).map((part, index) => part.type === 'link'
        ? <a key={index} href={part.value} target="_blank" rel="noopener noreferrer nofollow" className={`break-all underline underline-offset-2 ${mine ? 'font-medium text-ink-950' : 'text-accent-300 hover:text-accent-200'}`}>{part.value}</a>
        : <span key={index}>{part.value}</span>)}
    </p>
  );
}

function ProgressBar({ value, mine }: { value: number; mine: boolean }) {
  return (
    <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value)} className={`h-1.5 overflow-hidden rounded-full ${mine ? 'bg-ink-950/20' : 'bg-ink-700'}`}>
      <div className={`h-full rounded-full transition-[width] duration-150 ${mine ? 'bg-ink-950' : 'bg-accent-500'}`} style={{ width: `${Math.max(3, Math.round(value))}%` }} />
    </div>
  );
}

function ReplyQuote({ reply, mine, label }: { reply: NonNullable<CallChatMessage['replyTo']>; mine: boolean; label: string }) {
  return (
    <div className={`mb-1.5 rounded-lg border-l-2 px-2 py-1 text-xs ${mine ? 'border-ink-950/50 bg-ink-950/10 text-ink-900' : 'border-accent-500 bg-black/25 text-ink-300'}`}>
      <p className="truncate font-semibold">{label} {reply.displayName}</p>
      <p className="line-clamp-2 break-words">{reply.text}</p>
    </div>
  );
}

export function ChatMessage({ message, mine, copy, onPreview, onDownload, onOpenMenu, replyLabel, canSaveToDisk, onSaveToDisk }: Props) {
  const attachment = message.attachment;
  const pressTimer = useRef<number | null>(null);
  const clearPress = () => { if (pressTimer.current) window.clearTimeout(pressTimer.current); pressTimer.current = null; };
  const openAt = (x: number, y: number) => onOpenMenu(message, x, y);
  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') return;
    const { clientX, clientY } = event;
    clearPress();
    pressTimer.current = window.setTimeout(() => { pressTimer.current = null; openAt(clientX, clientY); }, LONG_PRESS_MS);
  };
  const onContextMenu = (event: ReactMouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    clearPress();
    openAt(event.clientX, event.clientY);
  };
  const interaction = { onPointerDown, onPointerUp: clearPress, onPointerLeave: clearPress, onPointerCancel: clearPress, onPointerMove: clearPress, onContextMenu };
  const author = mine ? copy.you : message.displayName;
  const bubble = mine ? 'ml-auto rounded-br-md bg-accent-500 text-ink-950' : 'rounded-bl-md bg-ink-800 text-white';
  const authorColor = mine ? 'text-ink-800' : 'text-accent-400';
  const subtle = mine ? 'text-ink-800' : 'text-ink-400';

  if (!attachment) {
    return (
      <div {...interaction} className={`max-w-[88%] select-text rounded-2xl px-3 py-2 ${bubble}`}>
        <p className={`mb-0.5 text-[11px] font-semibold ${authorColor}`}>{author}</p>
        {message.replyTo ? <ReplyQuote reply={message.replyTo} mine={mine} label={replyLabel} /> : null}
        <MessageText text={message.text} mine={mine} />
      </div>
    );
  }

  const busy = attachment.status === 'sending' || attachment.status === 'receiving';
  const statusText = attachment.status === 'sending' ? copy.chatFileSending : attachment.status === 'receiving' ? copy.chatFileReceiving : attachment.status === 'failed' ? copy.chatFileFailed : '';

  // Photos are shown as a small thumbnail; tapping opens the full-size view.
  if (attachment.kind === 'image' && attachment.url && attachment.status !== 'failed') {
    return (
      <div {...interaction} className={`w-fit max-w-[75%] rounded-2xl p-1.5 ${bubble}`}>
        <p className={`mb-1 px-1.5 pt-0.5 text-[11px] font-semibold ${authorColor}`}>{author}</p>
        <button type="button" onClick={() => onPreview(message)} aria-label={`${copy.viewPhoto}: ${attachment.name}`} className="relative block overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400">
          {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview, not optimizable */}
          <img src={attachment.url} alt={attachment.name} loading="lazy" decoding="async" className="block max-h-44 w-auto max-w-full object-cover" />
          {busy ? <span className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1.5 text-[11px] text-white">{statusText}</span> : null}
        </button>
        {busy ? <div className="mt-1.5 px-1"><ProgressBar value={attachment.progress} mine={mine} /></div> : null}
      </div>
    );
  }

  const label = fileTypeLabel(attachment.name, attachment.mime);
  const Icon = attachment.kind === 'image' ? ImageIcon : FileText;
  return (
    <div {...interaction} className={`w-[min(88%,18rem)] rounded-2xl px-3 py-2.5 ${bubble}`}>
      <p className={`mb-2 text-[11px] font-semibold ${authorColor}`}>{author}</p>
      <div className="flex items-center gap-3">
        {/* The type badge is the file's identity at a glance: PDF, ZIP, PNG... */}
        <span aria-hidden="true" className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl ${mine ? 'bg-ink-950 text-accent-400' : 'bg-accent-500/15 text-accent-400'}`}>
          <Icon size={15} />
          <span className="max-w-full truncate px-1 text-[9px] font-bold uppercase leading-none tracking-wider">{label}</span>
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold leading-5" title={attachment.name}>{attachment.name}</p>
          <p className={`text-xs leading-4 ${subtle}`}>{formatBytes(attachment.size)}</p>
        </div>
        {attachment.status === 'ready' && attachment.blob ? (
          <button type="button" onClick={() => onDownload(message)} aria-label={`${copy.downloadFile}: ${attachment.name}`} title={copy.downloadFile} className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 ${mine ? 'bg-ink-950 text-white hover:bg-ink-800' : 'bg-accent-500 text-ink-950 hover:bg-accent-400'}`}><Download size={18} /></button>
        ) : null}
      </div>
      {attachment.status === 'receiving' && attachment.size > CHAT_FILE_LARGE_BYTES && !attachment.onDisk ? <div className="mt-2.5 space-y-2">
        <p className="text-xs leading-5 text-amber-200">{copy.chatLargeReceiverBody.replace('{size}', formatBytes(attachment.size))}</p>
        {canSaveToDisk ? <button type="button" onClick={() => onSaveToDisk(message)} className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-accent-500 text-xs font-semibold text-ink-950 transition hover:bg-accent-400">{copy.chatSaveToDisk}</button> : null}
      </div> : null}
      {attachment.onDisk && attachment.status !== 'failed' ? <p className={`mt-2 text-[11px] font-medium ${mine ? 'text-ink-800' : 'text-emerald-300'}`}>{copy.chatSavedToDisk}</p> : null}
      {busy ? <div className="mt-2.5 space-y-1"><ProgressBar value={attachment.progress} mine={mine} /><p className={`text-[11px] ${subtle}`}>{statusText} {Math.round(attachment.progress)}%</p></div> : null}
      {attachment.status === 'failed' ? <p role="alert" className={`mt-2 text-[11px] font-medium ${mine ? 'text-rose-900' : 'text-rose-400'}`}>{statusText}</p> : null}
    </div>
  );
}
