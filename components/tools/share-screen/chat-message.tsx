'use client';

import { Download, FileText, ImageIcon } from 'lucide-react';
import { formatBytes } from '@/lib/file-size';
import { fileTypeLabel, type CallChatMessage } from '@/lib/screenshare/chat-files';

export type ChatMessageCopy = {
  you: string;
  chatFileSending: string;
  chatFileReceiving: string;
  chatFileFailed: string;
  downloadFile: string;
  viewPhoto: string;
};

type Props = {
  message: CallChatMessage;
  mine: boolean;
  copy: ChatMessageCopy;
  onPreview: (message: CallChatMessage) => void;
  onDownload: (message: CallChatMessage) => void;
};

function ProgressBar({ value, mine }: { value: number; mine: boolean }) {
  return (
    <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value)} className={`h-1.5 overflow-hidden rounded-full ${mine ? 'bg-ink-950/20' : 'bg-ink-700'}`}>
      <div className={`h-full rounded-full transition-[width] duration-150 ${mine ? 'bg-ink-950' : 'bg-accent-500'}`} style={{ width: `${Math.max(3, Math.round(value))}%` }} />
    </div>
  );
}

export function ChatMessage({ message, mine, copy, onPreview, onDownload }: Props) {
  const attachment = message.attachment;
  const author = mine ? copy.you : message.displayName;
  const bubble = mine ? 'ml-auto rounded-br-md bg-accent-500 text-ink-950' : 'rounded-bl-md bg-ink-800 text-white';
  const authorColor = mine ? 'text-ink-800' : 'text-accent-400';
  const subtle = mine ? 'text-ink-800' : 'text-ink-400';

  if (!attachment) {
    return (
      <div className={`max-w-[88%] rounded-2xl px-3 py-2 ${bubble}`}>
        <p className={`mb-0.5 text-[11px] font-semibold ${authorColor}`}>{author}</p>
        <p className="whitespace-pre-wrap break-words text-sm leading-5">{message.text}</p>
      </div>
    );
  }

  const busy = attachment.status === 'sending' || attachment.status === 'receiving';
  const statusText = attachment.status === 'sending' ? copy.chatFileSending : attachment.status === 'receiving' ? copy.chatFileReceiving : attachment.status === 'failed' ? copy.chatFileFailed : '';

  // Photos are shown as a small thumbnail; tapping opens the full-size view.
  if (attachment.kind === 'image' && attachment.url && attachment.status !== 'failed') {
    return (
      <div className={`w-fit max-w-[75%] rounded-2xl p-1.5 ${bubble}`}>
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

  const Icon = attachment.kind === 'image' ? ImageIcon : FileText;
  return (
    <div className={`w-[min(88%,18rem)] rounded-2xl px-3 py-2 ${bubble}`}>
      <p className={`mb-1.5 text-[11px] font-semibold ${authorColor}`}>{author}</p>
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${mine ? 'bg-ink-950/15 text-ink-950' : 'bg-accent-500/15 text-accent-400'}`}><Icon size={22} /></span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium leading-5" title={attachment.name}>{attachment.name}</p>
          <p className={`text-xs leading-4 ${subtle}`}>{fileTypeLabel(attachment.name, attachment.mime)} · {formatBytes(attachment.size)}</p>
        </div>
        {attachment.status === 'ready' && attachment.blob ? (
          <button type="button" onClick={() => onDownload(message)} aria-label={`${copy.downloadFile}: ${attachment.name}`} title={copy.downloadFile} className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 ${mine ? 'bg-ink-950 text-white hover:bg-ink-800' : 'bg-accent-500 text-ink-950 hover:bg-accent-400'}`}><Download size={18} /></button>
        ) : null}
      </div>
      {busy ? <div className="mt-2 space-y-1"><ProgressBar value={attachment.progress} mine={mine} /><p className={`text-[11px] ${subtle}`}>{statusText} {Math.round(attachment.progress)}%</p></div> : null}
      {attachment.status === 'failed' ? <p role="alert" className={`mt-1.5 text-[11px] font-medium ${mine ? 'text-rose-900' : 'text-rose-400'}`}>{statusText}</p> : null}
    </div>
  );
}
