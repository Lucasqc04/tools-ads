export type EmailCodeSnippet = {
  code: string;
  language?: string;
};

const MAX_CODE_SNIPPETS = 6;
const MAX_CODE_SNIPPET_CHARS = 8_000;

const normalizeSnippet = (value: string): string =>
  value.replace(/\r\n/g, '\n').trim().slice(0, MAX_CODE_SNIPPET_CHARS);

const getLanguageFromClassName = (className: string): string | undefined => {
  const match = className.match(/(?:language|lang)-([a-z0-9+#.-]+)/i);
  return match?.[1]?.toLowerCase();
};

const stripHtml = (value: string): string =>
  value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

export const getTempEmailPreview = (text?: string, html?: string): string => {
  const source = text?.trim() || (html ? stripHtml(html) : '');
  return source.replace(/\s+/g, ' ').trim();
};

export const extractEmailCodeSnippets = ({
  text,
  html,
}: Readonly<{
  text?: string;
  html?: string;
}>): EmailCodeSnippet[] => {
  const snippets: EmailCodeSnippet[] = [];
  const seen = new Set<string>();

  const addSnippet = (value: string | null | undefined, language?: string) => {
    const code = normalizeSnippet(value ?? '');

    if (!code || seen.has(code) || snippets.length >= MAX_CODE_SNIPPETS) {
      return;
    }

    seen.add(code);
    snippets.push({ code, language });
  };

  const fencePattern = /```([^\n`]*)\n([\s\S]*?)```/g;
  let fencedMatch: RegExpExecArray | null;

  while ((fencedMatch = fencePattern.exec(text ?? '')) !== null) {
    addSnippet(fencedMatch[2], fencedMatch[1].trim() || undefined);
  }

  if (typeof DOMParser === 'undefined' || !html?.trim()) {
    return snippets;
  }

  const parsed = new DOMParser().parseFromString(html, 'text/html');

  parsed.querySelectorAll('pre').forEach((element) => {
    const nestedCode = element.querySelector('code');
    addSnippet(
      element.textContent,
      getLanguageFromClassName(nestedCode?.className || element.className),
    );
  });

  parsed.querySelectorAll('code').forEach((element) => {
    if (element.closest('pre')) {
      return;
    }

    addSnippet(element.textContent, getLanguageFromClassName(element.className));
  });

  return snippets;
};

export const buildTempEmailPreviewDocument = (
  sanitizedHtml: string,
  allowRemoteImages: boolean,
): string => {
  const imageSources = allowRemoteImages ? 'https: http: data:' : 'data:';

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'none'; connect-src 'none'; object-src 'none'; form-action 'none'; frame-src 'none'; media-src 'none'; style-src 'unsafe-inline'; font-src ${imageSources}; img-src ${imageSources};" />
    <base target="_blank" />
    <style>
      :root { color-scheme: light; }
      html { max-width: 100%; overflow-x: auto; }
      body {
        margin: 0;
        padding: 16px;
        min-width: 0;
        color: #0f172a;
        background: #ffffff;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 14px;
        line-height: 1.55;
        overflow-wrap: anywhere;
      }
      img { max-width: 100% !important; height: auto !important; }
      table { max-width: 100% !important; }
      pre { white-space: pre-wrap; overflow-wrap: anywhere; }
      @media (max-width: 480px) {
        body { padding: 12px; }
        table[width] { width: 100% !important; }
      }
    </style>
  </head>
  <body>${sanitizedHtml}</body>
</html>`;
};
