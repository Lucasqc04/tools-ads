export type ChatTextPart = { type: 'text' | 'link'; value: string };

/** http(s) only: other schemes are never turned into links, so message text cannot create a javascript: or data: href. */
const LINK_PATTERN = /(https?:\/\/[^\s<>"']+)/gi;
const TRAILING_PUNCTUATION = /[.,;:!?)\]}]+$/;

/**
 * Splits a message into plain text and link parts. Trailing punctuation stays
 * out of the link, so "veja https://a.com." links only the address.
 */
export const splitChatLinks = (text: string): ChatTextPart[] => {
  const parts: ChatTextPart[] = [];
  let cursor = 0;
  for (const match of text.matchAll(LINK_PATTERN)) {
    const start = match.index ?? 0;
    const raw = match[0];
    const url = raw.replace(TRAILING_PUNCTUATION, '');
    if (!url.replace(/^https?:\/\//i, '')) continue;
    if (start > cursor) parts.push({ type: 'text', value: text.slice(cursor, start) });
    parts.push({ type: 'link', value: url });
    cursor = start + url.length;
  }
  if (cursor < text.length) parts.push({ type: 'text', value: text.slice(cursor) });
  return parts;
};
