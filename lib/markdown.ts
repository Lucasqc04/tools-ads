import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Document,
  ExternalHyperlink,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  type ParagraphChild,
} from 'docx';
import { downloadBlob } from '@/lib/image-conversion';

const MARKDOWN_READING_WORDS_PER_MINUTE = 220;
const DEFAULT_EXPORT_WIDTH = 1120;
const MIN_EXPORT_WIDTH = 640;
const MAX_EXPORT_WIDTH = 1600;
const MAX_EXPORT_HEIGHT = 12000;

const markdownExportStyles = `
:root {
  color-scheme: light;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

.markdown-export-root {
  width: 100%;
  min-height: 100%;
  padding: 30px;
  background: #ffffff;
  color: #0f172a;
  font-family: "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.markdown-export {
  width: 100%;
  font-size: 16px;
  line-height: 1.72;
  color: #1e293b;
  word-break: break-word;
  overflow-wrap: anywhere;
}

.markdown-export h1,
.markdown-export h2,
.markdown-export h3,
.markdown-export h4,
.markdown-export h5,
.markdown-export h6 {
  color: #0f172a;
  line-height: 1.28;
  margin: 1.45em 0 0.65em;
  font-weight: 700;
}

.markdown-export h1 {
  font-size: 2rem;
}

.markdown-export h2 {
  font-size: 1.62rem;
}

.markdown-export h3 {
  font-size: 1.34rem;
}

.markdown-export h4 {
  font-size: 1.16rem;
}

.markdown-export h5,
.markdown-export h6 {
  font-size: 1rem;
}

.markdown-export p {
  margin: 0.86em 0;
}

.markdown-export ul,
.markdown-export ol {
  margin: 1em 0;
  padding-left: 1.45rem;
}

.markdown-export li {
  margin: 0.35rem 0;
}

.markdown-export blockquote {
  margin: 1.2rem 0;
  padding: 0.9rem 1rem;
  border-left: 4px solid #3b82f6;
  background: #eff6ff;
  border-radius: 0.5rem;
}

.markdown-export hr {
  margin: 1.5rem 0;
  border: 0;
  border-top: 1px solid #cbd5e1;
}

.markdown-export code {
  font-family: "IBM Plex Mono", "SFMono-Regular", Menlo, Consolas, "Liberation Mono", monospace;
  background: #e2e8f0;
  color: #0f172a;
  border-radius: 0.32rem;
  padding: 0.12rem 0.36rem;
  font-size: 0.88em;
}

.markdown-export pre {
  margin: 1.2rem 0;
  overflow: auto;
  border: 1px solid #dbe4f0;
  border-radius: 0.75rem;
  padding: 0.95rem;
  background: #0f172a;
  color: #e2e8f0;
}

.markdown-export pre code {
  background: transparent;
  color: inherit;
  padding: 0;
  border-radius: 0;
  font-size: 0.9em;
}

.markdown-export a {
  color: #1d4ed8;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.markdown-export img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1rem 0;
  border-radius: 0.65rem;
  border: 1px solid #dbe4f0;
}

.markdown-export table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.2rem 0;
}

.markdown-export th,
.markdown-export td {
  border: 1px solid #dbe4f0;
  padding: 0.6rem 0.7rem;
  vertical-align: top;
}

.markdown-export th {
  background: #eff6ff;
  color: #0f172a;
  font-weight: 700;
}

.markdown-export .task-item {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  list-style: none;
  margin-left: -1rem;
}

.markdown-export .task-item input {
  margin-top: 0.22rem;
}

.markdown-export .markdown-export-image-fallback {
  margin: 1rem 0;
  padding: 0.7rem 0.9rem;
  border-radius: 0.55rem;
  border: 1px dashed #94a3b8;
  background: #f8fafc;
  color: #334155;
  font-size: 0.9rem;
}
`;

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const escapeAttribute = (value: string): string => escapeHtml(value);

const normalizeMarkdown = (input: string): string => input.replaceAll(/\r\n?/g, '\n');

const isHorizontalRule = (value: string): boolean => /^([-*_])(?:\s*\1){2,}$/.test(value.trim());

const isCodeFence = (value: string): boolean => value.trim().startsWith('```');

const isListLine = (value: string): boolean => /^(\s*)([-*+]|\d+\.)\s+/.test(value);

const isTableSeparatorLine = (value: string): boolean =>
  /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(value.trim());

const stripOuterPipes = (value: string): string => value.trim().replace(/^\|/, '').replace(/\|$/, '');

const splitTableLine = (value: string): string[] => stripOuterPipes(value).split('|').map((cell) => cell.trim());

const getTableAlignments = (separatorLine: string): Array<'left' | 'center' | 'right' | null> =>
  splitTableLine(separatorLine).map((cell) => {
    const trimmed = cell.trim();

    if (trimmed.startsWith(':') && trimmed.endsWith(':')) {
      return 'center';
    }

    if (trimmed.endsWith(':')) {
      return 'right';
    }

    if (trimmed.startsWith(':')) {
      return 'left';
    }

    return null;
  });

const hasUnsafeProtocol = (url: string): boolean => /^\s*(javascript|vbscript|data):/i.test(url);

const sanitizeUrl = (url: string, allowImageDataUrl = false): string | null => {
  const trimmed = url.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith('#') || trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('../')) {
    return trimmed;
  }

  if (allowImageDataUrl && /^data:image\/[a-z0-9.+-]+;base64,/i.test(trimmed)) {
    return trimmed;
  }

  if (hasUnsafeProtocol(trimmed)) {
    return null;
  }

  try {
    const parsed = new URL(trimmed, 'https://placeholder.local');
    const protocol = parsed.protocol.toLowerCase();

    if (['http:', 'https:', 'mailto:', 'tel:'].includes(protocol)) {
      return trimmed;
    }

    return null;
  } catch {
    return null;
  }
};

const tokenizeInlineCode = (input: string): { value: string; tokens: string[] } => {
  const tokens: string[] = [];

  const value = input.replace(/`([^`\n]+)`/g, (_match, code) => {
    const token = `@@CODE_BLOCK_${tokens.length}@@`;
    tokens.push(`<code>${code}</code>`);
    return token;
  });

  return { value, tokens };
};

const restoreInlineCodeTokens = (input: string, tokens: string[]): string => {
  let result = input;

  tokens.forEach((tokenMarkup, index) => {
    result = result.replaceAll(`@@CODE_BLOCK_${index}@@`, tokenMarkup);
  });

  return result;
};

const parseInlineMarkdown = (input: string): string => {
  const escaped = escapeHtml(input);
  const codeTokenized = tokenizeInlineCode(escaped);
  let output = codeTokenized.value;

  output = output.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, altText, target) => {
    const safeUrl = sanitizeUrl(String(target), true);

    if (!safeUrl) {
      return `![${altText}](${target})`;
    }

    return `<img src="${escapeAttribute(safeUrl)}" alt="${altText}" loading="lazy" />`;
  });

  output = output.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, target) => {
    const safeUrl = sanitizeUrl(String(target));

    if (!safeUrl) {
      return `${label} (${target})`;
    }

    const openInNewTab = safeUrl.startsWith('http://') || safeUrl.startsWith('https://');
    const rel = openInNewTab ? ' rel="noopener noreferrer" target="_blank"' : '';

    return `<a href="${escapeAttribute(safeUrl)}"${rel}>${label}</a>`;
  });

  output = output.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  output = output.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  output = output.replace(/~~([^~]+)~~/g, '<del>$1</del>');

  output = output.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>');
  output = output.replace(/(^|[^_])_([^_\n]+)_(?!_)/g, '$1<em>$2</em>');

  return restoreInlineCodeTokens(output, codeTokenized.tokens);
};

const renderTableHtml = (headerCells: string[], alignments: Array<'left' | 'center' | 'right' | null>, rows: string[][]): string => {
  const renderAlignStyle = (index: number): string => {
    const alignment = alignments[index];

    if (!alignment) {
      return '';
    }

    return ` style="text-align:${alignment}"`;
  };

  const thead = `<thead><tr>${headerCells
    .map((cell, index) => `<th${renderAlignStyle(index)}>${parseInlineMarkdown(cell)}</th>`)
    .join('')}</tr></thead>`;

  const tbody = `<tbody>${rows
    .map(
      (row) =>
        `<tr>${row
          .map((cell, index) => `<td${renderAlignStyle(index)}>${parseInlineMarkdown(cell)}</td>`)
          .join('')}</tr>`,
    )
    .join('')}</tbody>`;

  return `<table>${thead}${tbody}</table>`;
};

const isBlockBoundary = (line: string, nextLine?: string): boolean => {
  const trimmed = line.trim();

  if (!trimmed) {
    return true;
  }

  if (isCodeFence(line)) {
    return true;
  }

  if (/^#{1,6}\s+/.test(trimmed)) {
    return true;
  }

  if (isHorizontalRule(trimmed)) {
    return true;
  }

  if (trimmed.startsWith('>')) {
    return true;
  }

  if (isListLine(line)) {
    return true;
  }

  if (trimmed.includes('|') && nextLine && isTableSeparatorLine(nextLine)) {
    return true;
  }

  return false;
};

export const parseMarkdownToHtml = (rawInput: string): string => {
  const input = normalizeMarkdown(rawInput);

  if (!input.trim()) {
    return '';
  }

  const lines = input.split('\n');
  const output: string[] = [];

  let index = 0;

  while (index < lines.length) {
    const currentLine = lines[index] ?? '';
    const trimmedLine = currentLine.trim();

    if (!trimmedLine) {
      index += 1;
      continue;
    }

    if (isCodeFence(currentLine)) {
      const languageToken = trimmedLine.slice(3).trim().toLowerCase().replaceAll(/[^a-z0-9-]/g, '');
      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length && !isCodeFence(lines[index] ?? '')) {
        codeLines.push(lines[index] ?? '');
        index += 1;
      }

      if (index < lines.length && isCodeFence(lines[index] ?? '')) {
        index += 1;
      }

      const escapedCode = escapeHtml(codeLines.join('\n'));
      const classAttribute = languageToken ? ` class="language-${escapeAttribute(languageToken)}"` : '';

      output.push(`<pre><code${classAttribute}>${escapedCode}</code></pre>`);
      continue;
    }

    const nextLine = lines[index + 1]?.trim() ?? '';

    if (trimmedLine.includes('|') && isTableSeparatorLine(nextLine)) {
      const headers = splitTableLine(trimmedLine);
      const alignments = getTableAlignments(nextLine);
      const rows: string[][] = [];
      index += 2;

      while (index < lines.length) {
        const rowLine = lines[index] ?? '';
        const rowTrimmed = rowLine.trim();

        if (!rowTrimmed || !rowTrimmed.includes('|')) {
          break;
        }

        rows.push(splitTableLine(rowTrimmed));
        index += 1;
      }

      output.push(renderTableHtml(headers, alignments, rows));
      continue;
    }

    const headingMatch = /^(#{1,6})\s+(.+)$/.exec(trimmedLine);

    if (headingMatch) {
      const level = headingMatch[1].length;
      output.push(`<h${level}>${parseInlineMarkdown(headingMatch[2].trim())}</h${level}>`);
      index += 1;
      continue;
    }

    if (isHorizontalRule(trimmedLine)) {
      output.push('<hr />');
      index += 1;
      continue;
    }

    if (trimmedLine.startsWith('>')) {
      const quoteLines: string[] = [];

      while (index < lines.length) {
        const quoteCandidate = (lines[index] ?? '').trim();

        if (!quoteCandidate.startsWith('>')) {
          break;
        }

        quoteLines.push(quoteCandidate.replace(/^>\s?/, ''));
        index += 1;
      }

      output.push(`<blockquote>${parseMarkdownToHtml(quoteLines.join('\n'))}</blockquote>`);
      continue;
    }

    if (isListLine(currentLine)) {
      const ordered = /\d+\./.test(trimmedLine);
      const tag = ordered ? 'ol' : 'ul';
      const items: string[] = [];

      while (index < lines.length) {
        const listCandidate = lines[index] ?? '';
        const match = /^(\s*)([-*+]|\d+\.)\s+(.+)$/.exec(listCandidate);

        if (!match) {
          break;
        }

        const isOrderedItem = /\d+\./.test(match[2]);
        if (isOrderedItem !== ordered) {
          break;
        }

        const content = match[3] ?? '';
        const taskMatch = /^\[( |x|X)\]\s+(.+)$/.exec(content);

        if (taskMatch) {
          const checked = taskMatch[1].toLowerCase() === 'x';
          items.push(
            `<li class="task-item"><input type="checkbox" disabled${checked ? ' checked' : ''} /><span>${parseInlineMarkdown(
              taskMatch[2],
            )}</span></li>`,
          );
        } else {
          items.push(`<li>${parseInlineMarkdown(content)}</li>`);
        }

        index += 1;
      }

      output.push(`<${tag}>${items.join('')}</${tag}>`);
      continue;
    }

    const paragraphLines: string[] = [currentLine.trimEnd()];
    index += 1;

    while (index < lines.length) {
      const candidateLine = lines[index] ?? '';
      const candidateTrimmed = candidateLine.trim();

      if (!candidateTrimmed) {
        break;
      }

      const following = lines[index + 1]?.trim();

      if (isBlockBoundary(candidateLine, following)) {
        break;
      }

      paragraphLines.push(candidateLine.trimEnd());
      index += 1;
    }

    output.push(`<p>${parseInlineMarkdown(paragraphLines.join('\n')).replaceAll('\n', '<br />')}</p>`);
  }

  return output.join('\n');
};

export type MarkdownStats = {
  words: number;
  characters: number;
  nonWhitespaceCharacters: number;
  lines: number;
  readingMinutes: number;
};

export const getMarkdownStats = (rawInput: string): MarkdownStats => {
  const input = normalizeMarkdown(rawInput);
  const trimmed = input.trim();

  if (!trimmed) {
    return {
      words: 0,
      characters: 0,
      nonWhitespaceCharacters: 0,
      lines: 0,
      readingMinutes: 0,
    };
  }

  const words = (trimmed.match(/[\p{L}\p{N}][\p{L}\p{N}'-]*/gu) ?? []).length;

  return {
    words,
    characters: input.length,
    nonWhitespaceCharacters: input.replaceAll(/\s+/g, '').length,
    lines: input.split('\n').length,
    readingMinutes: Math.max(1, Math.ceil(words / MARKDOWN_READING_WORDS_PER_MINUTE)),
  };
};

export const sanitizeMarkdownFileBaseName = (rawName: string): string => {
  const withoutExtension = rawName.replace(/\.[^.]+$/, '');

  const normalized = withoutExtension
    .trim()
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .replaceAll(/[^a-zA-Z0-9-_]+/g, '-')
    .replaceAll(/-+/g, '-')
    .replaceAll(/^-+|-+$/g, '');

  return normalized || 'markdown-document';
};

export const buildMarkdownHtmlDocument = ({
  title,
  renderedHtml,
}: {
  title: string;
  renderedHtml: string;
}): string => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>${markdownExportStyles}</style>
  </head>
  <body>
    <main class="markdown-export-root">
      <article class="markdown-export">${renderedHtml}</article>
    </main>
  </body>
</html>`;

export const downloadTextFile = (
  content: string,
  filename: string,
  mimeType = 'text/plain;charset=utf-8',
): void => {
  downloadBlob(new Blob([content], { type: mimeType }), filename);
};

const blobToDataUrl = async (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('Falha ao converter imagem para Data URL.'));
    reader.readAsDataURL(blob);
  });

const isDataImageUrl = (value: string): boolean => /^data:image\/[a-z0-9.+-]+;base64,/i.test(value);

const resolveAbsoluteUrl = (value: string): string | null => {
  try {
    return new URL(value, window.location.href).toString();
  } catch {
    return null;
  }
};

const resolveImageSrcToDataUrl = async (src: string): Promise<string | null> => {
  if (isDataImageUrl(src)) {
    return src;
  }

  const absoluteUrl = resolveAbsoluteUrl(src);
  if (!absoluteUrl) {
    return null;
  }

  try {
    const response = await fetch(absoluteUrl, {
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.startsWith('image/')) {
      return null;
    }

    const blob = await response.blob();
    return await blobToDataUrl(blob);
  } catch {
    return null;
  }
};

type PreparedHtmlForCanvasExport = {
  html: string;
  omittedExternalImages: number;
};

const prepareRenderedHtmlForCanvasExport = async (
  renderedHtml: string,
): Promise<PreparedHtmlForCanvasExport> => {
  const parser = new DOMParser();
  const documentObject = parser.parseFromString(
    `<article class="markdown-export">${renderedHtml}</article>`,
    'text/html',
  );
  const article = documentObject.body.querySelector('article');

  if (!article) {
    return {
      html: renderedHtml,
      omittedExternalImages: 0,
    };
  }

  const images = Array.from(article.querySelectorAll('img'));
  let omittedExternalImages = 0;

  await Promise.all(
    images.map(async (image) => {
      const src = image.getAttribute('src')?.trim() ?? '';

      if (!src) {
        image.remove();
        omittedExternalImages += 1;
        return;
      }

      const resolvedDataUrl = await resolveImageSrcToDataUrl(src);

      if (resolvedDataUrl) {
        image.setAttribute('src', resolvedDataUrl);
        image.removeAttribute('srcset');
        image.removeAttribute('loading');
        return;
      }

      const fallback = documentObject.createElement('p');
      fallback.className = 'markdown-export-image-fallback';
      const altText = image.getAttribute('alt')?.trim();
      const label = altText
        ? `Imagem externa nao incorporada no export: ${altText}`
        : `Imagem externa nao incorporada no export: ${src}`;
      fallback.textContent = label;
      image.replaceWith(fallback);
      omittedExternalImages += 1;
    }),
  );

  return {
    html: article.innerHTML,
    omittedExternalImages,
  };
};

type MountedMarkdownExport = {
  mount: HTMLDivElement;
  root: HTMLDivElement;
};

const mountMarkdownExport = ({
  renderedHtml,
  width,
}: {
  renderedHtml: string;
  width: number;
}): MountedMarkdownExport => {
  const mount = document.createElement('div');

  mount.style.position = 'fixed';
  mount.style.left = '-100000px';
  mount.style.top = '0';
  mount.style.width = `${width}px`;
  mount.style.pointerEvents = 'none';
  mount.style.zIndex = '-1';
  mount.style.background = '#ffffff';

  mount.innerHTML = `<style>${markdownExportStyles}</style><div class="markdown-export-root"><article class="markdown-export">${renderedHtml}</article></div>`;

  document.body.appendChild(mount);

  const root = mount.querySelector<HTMLDivElement>('.markdown-export-root');
  if (!root) {
    document.body.removeChild(mount);
    throw new Error('Nao foi possivel montar o documento para exportacao.');
  }

  return {
    mount,
    root,
  };
};

const waitForImagesInside = async (container: HTMLElement): Promise<void> => {
  const images = Array.from(container.querySelectorAll('img'));

  await Promise.all(
    images.map(
      (image) =>
        new Promise<void>((resolve) => {
          if (image.complete) {
            resolve();
            return;
          }

          const done = () => resolve();

          image.addEventListener('load', done, { once: true });
          image.addEventListener('error', done, { once: true });

          window.setTimeout(done, 2500);
        }),
    ),
  );
};

const renderMarkdownToCanvas = async ({
  renderedHtml,
  width,
}: {
  renderedHtml: string;
  width: number;
}): Promise<{ canvas: HTMLCanvasElement; truncated: boolean; omittedExternalImages: number }> => {
  const prepared = await prepareRenderedHtmlForCanvasExport(renderedHtml);
  const exportWidth = Math.min(MAX_EXPORT_WIDTH, Math.max(MIN_EXPORT_WIDTH, width || DEFAULT_EXPORT_WIDTH));
  const mounted = mountMarkdownExport({
    renderedHtml: prepared.html,
    width: exportWidth,
  });

  try {
    await waitForImagesInside(mounted.root);

    const measuredHeight = Math.ceil(mounted.root.scrollHeight);
    const exportHeight = Math.min(Math.max(260, measuredHeight), MAX_EXPORT_HEIGHT);
    const truncated = measuredHeight > exportHeight;

    mounted.root.style.height = `${exportHeight}px`;
    mounted.root.style.overflow = 'hidden';

    const scale = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
    const canvas = await html2canvas(mounted.root, {
      backgroundColor: '#ffffff',
      scale,
      width: exportWidth,
      height: exportHeight,
      logging: false,
      useCORS: false,
      allowTaint: false,
      imageTimeout: 0,
    });

    return {
      canvas,
      truncated,
      omittedExternalImages: prepared.omittedExternalImages,
    };
  } finally {
    document.body.removeChild(mounted.mount);
  }
};

const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Falha ao gerar arquivo de imagem.'));
          return;
        }

        resolve(blob);
      },
      'image/png',
      0.96,
    );
  });

const getCanvasSliceDataUrl = (
  source: HTMLCanvasElement,
  startY: number,
  sliceHeight: number,
): string => {
  const slice = document.createElement('canvas');
  const context = slice.getContext('2d');

  if (!context) {
    throw new Error('Nao foi possivel montar paginas do PDF.');
  }

  slice.width = source.width;
  slice.height = sliceHeight;
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, slice.width, slice.height);
  context.drawImage(source, 0, startY, source.width, sliceHeight, 0, 0, source.width, sliceHeight);

  return slice.toDataURL('image/png', 0.96);
};

export const exportMarkdownPreviewAsPng = async ({
  renderedHtml,
  filename,
  width = DEFAULT_EXPORT_WIDTH,
}: {
  renderedHtml: string;
  filename: string;
  width?: number;
}): Promise<{ truncated: boolean; omittedExternalImages: number }> => {
  const rendered = await renderMarkdownToCanvas({ renderedHtml, width });
  const imageBlob = await canvasToBlob(rendered.canvas);

  downloadBlob(imageBlob, filename);

  return {
    truncated: rendered.truncated,
    omittedExternalImages: rendered.omittedExternalImages,
  };
};

export const exportMarkdownPreviewAsPdf = async ({
  renderedHtml,
  filename,
  width = DEFAULT_EXPORT_WIDTH,
}: {
  renderedHtml: string;
  filename: string;
  width?: number;
}): Promise<{ truncated: boolean; pages: number; omittedExternalImages: number }> => {
  const rendered = await renderMarkdownToCanvas({ renderedHtml, width });

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
    compress: true,
  });

  const margin = 26;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const printableWidth = pageWidth - margin * 2;
  const printableHeight = pageHeight - margin * 2;
  const pixelPerPt = rendered.canvas.width / printableWidth;
  const pageSliceHeightPx = Math.max(1, Math.floor(printableHeight * pixelPerPt));

  let cursor = 0;
  let page = 0;

  while (cursor < rendered.canvas.height) {
    const sliceHeight = Math.min(pageSliceHeightPx, rendered.canvas.height - cursor);
    const imageDataUrl = getCanvasSliceDataUrl(rendered.canvas, cursor, sliceHeight);
    const renderHeightPt = sliceHeight / pixelPerPt;

    if (page > 0) {
      pdf.addPage();
    }

    pdf.addImage(imageDataUrl, 'PNG', margin, margin, printableWidth, renderHeightPt, undefined, 'FAST');

    cursor += sliceHeight;
    page += 1;
  }

  pdf.save(filename);

  return {
    truncated: rendered.truncated,
    pages: page,
    omittedExternalImages: rendered.omittedExternalImages,
  };
};

type InlineTextStyle = {
  bold?: boolean;
  italics?: boolean;
  strike?: boolean;
  code?: boolean;
};

const textRunFromString = (text: string, style: InlineTextStyle): TextRun =>
  new TextRun({
    text,
    bold: style.bold,
    italics: style.italics,
    strike: style.strike,
    font: style.code ? 'Consolas' : undefined,
    size: style.code ? 21 : undefined,
  });

const lineRunsFromString = (text: string, style: InlineTextStyle): TextRun[] => {
  const chunks = text.split('\n');

  return chunks.flatMap((chunk, index) => {
    if (index === chunks.length - 1) {
      return [textRunFromString(chunk, style)];
    }

    return [
      textRunFromString(chunk, style),
      new TextRun({
        text: '',
        break: 1,
      }),
    ];
  });
};

const collectTextRuns = (node: ChildNode, style: InlineTextStyle = {}): TextRun[] => {
  if (node.nodeType === Node.TEXT_NODE) {
    const value = node.textContent ?? '';
    if (!value) {
      return [];
    }

    return lineRunsFromString(value, style);
  }

  if (!(node instanceof HTMLElement)) {
    return [];
  }

  const tag = node.tagName.toLowerCase();
  const nextStyle: InlineTextStyle = { ...style };

  if (tag === 'strong' || tag === 'b') {
    nextStyle.bold = true;
  } else if (tag === 'em' || tag === 'i') {
    nextStyle.italics = true;
  } else if (tag === 'del' || tag === 's') {
    nextStyle.strike = true;
  } else if (tag === 'code') {
    nextStyle.code = true;
  } else if (tag === 'br') {
    return [new TextRun({ text: '', break: 1 })];
  } else if (tag === 'img') {
    const alt = node.getAttribute('alt')?.trim();
    const src = node.getAttribute('src')?.trim();
    const fallbackText = alt
      ? `[Imagem: ${alt}]`
      : src
        ? `[Imagem: ${src}]`
        : '[Imagem]';
    return [textRunFromString(fallbackText, style)];
  }

  return Array.from(node.childNodes).flatMap((child) => collectTextRuns(child, nextStyle));
};

const collectParagraphChildren = (element: HTMLElement): ParagraphChild[] => {
  const children: ParagraphChild[] = [];

  Array.from(element.childNodes).forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      children.push(...collectTextRuns(node));
      return;
    }

    const tag = node.tagName.toLowerCase();

    if (tag === 'a') {
      const link = node.getAttribute('href')?.trim();
      const runs = Array.from(node.childNodes).flatMap((child) => collectTextRuns(child));

      if (link && (link.startsWith('http://') || link.startsWith('https://'))) {
        children.push(
          new ExternalHyperlink({
            link,
            children:
              runs.length > 0
                ? runs
                : [new TextRun({ text: link, style: 'Hyperlink' })],
          }),
        );
        return;
      }

      children.push(...runs);
      return;
    }

    children.push(...collectTextRuns(node));
  });

  return children;
};

const buildTableFromHtml = (tableElement: HTMLTableElement): Table => {
  const rowElements = Array.from(tableElement.querySelectorAll('tr'));

  const rows = rowElements.map((rowElement) => {
    const cellElements = Array.from(rowElement.querySelectorAll('th,td'));
    const cells = cellElements.map((cellElement) => {
      const children = collectParagraphChildren(cellElement as HTMLElement);

      return new TableCell({
        children: [
          new Paragraph({
            children: children.length ? children : [new TextRun('')],
          }),
        ],
      });
    });

    return new TableRow({
      children: cells,
    });
  });

  return new Table({
    rows,
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
  });
};

const paragraphFromElement = (element: HTMLElement): Paragraph[] => {
  const tag = element.tagName.toLowerCase();

  const buildSimpleParagraph = (options?: {
    heading?: (typeof HeadingLevel)[keyof typeof HeadingLevel];
    bulletPrefix?: string;
    keepMonospace?: boolean;
  }): Paragraph => {
    const children = collectParagraphChildren(element);
    const prefix = options?.bulletPrefix ? [new TextRun({ text: options.bulletPrefix, bold: true })] : [];

    return new Paragraph({
      heading: options?.heading,
      children: [...prefix, ...(children.length ? children : [new TextRun('')])],
    });
  };

  if (tag === 'h1') {
    return [buildSimpleParagraph({ heading: HeadingLevel.HEADING_1 })];
  }

  if (tag === 'h2') {
    return [buildSimpleParagraph({ heading: HeadingLevel.HEADING_2 })];
  }

  if (tag === 'h3') {
    return [buildSimpleParagraph({ heading: HeadingLevel.HEADING_3 })];
  }

  if (tag === 'h4') {
    return [buildSimpleParagraph({ heading: HeadingLevel.HEADING_4 })];
  }

  if (tag === 'h5') {
    return [buildSimpleParagraph({ heading: HeadingLevel.HEADING_5 })];
  }

  if (tag === 'h6') {
    return [buildSimpleParagraph({ heading: HeadingLevel.HEADING_6 })];
  }

  if (tag === 'pre') {
    const codeText = element.textContent ?? '';
    return [
      new Paragraph({
        children: lineRunsFromString(codeText, { code: true }),
      }),
    ];
  }

  if (tag === 'blockquote') {
    const children = collectParagraphChildren(element);
    return [
      new Paragraph({
        children: [new TextRun({ text: '“', bold: true }), ...children, new TextRun({ text: '”', bold: true })],
        indent: {
          left: 420,
        },
      }),
    ];
  }

  if (tag === 'ul') {
    const listItems = Array.from(element.querySelectorAll(':scope > li'));
    return listItems.map((item) => {
      const children = collectParagraphChildren(item as HTMLElement);

      return new Paragraph({
        children: [
          new TextRun({ text: '• ', bold: true }),
          ...(children.length ? children : [new TextRun('')]),
        ],
      });
    });
  }

  if (tag === 'ol') {
    const listItems = Array.from(element.querySelectorAll(':scope > li'));
    return listItems.map((item, index) => {
      const children = collectParagraphChildren(item as HTMLElement);

      return new Paragraph({
        children: [
          new TextRun({ text: `${index + 1}. `, bold: true }),
          ...(children.length ? children : [new TextRun('')]),
        ],
      });
    });
  }

  if (tag === 'hr') {
    return [
      new Paragraph({
        children: [new TextRun('────────────────────────────────────────────────────────')],
      }),
    ];
  }

  return [buildSimpleParagraph()];
};

const buildDocxChildrenFromRenderedHtml = (
  renderedHtml: string,
): Array<Paragraph | Table> => {
  const parser = new DOMParser();
  const documentObject = parser.parseFromString(
    `<article>${renderedHtml}</article>`,
    'text/html',
  );
  const article = documentObject.body.querySelector('article');

  if (!article) {
    return [new Paragraph('')];
  }

  const children: Array<Paragraph | Table> = [];

  Array.from(article.children).forEach((element) => {
    if (!(element instanceof HTMLElement)) {
      return;
    }

    if (element.tagName.toLowerCase() === 'table') {
      children.push(buildTableFromHtml(element as HTMLTableElement));
      children.push(new Paragraph(''));
      return;
    }

    const blockParagraphs = paragraphFromElement(element);
    children.push(...blockParagraphs);
    children.push(new Paragraph(''));
  });

  return children.length ? children : [new Paragraph('')];
};

export const exportMarkdownAsDocx = async ({
  markdownText,
  filename,
}: {
  markdownText: string;
  filename: string;
}): Promise<void> => {
  const renderedHtml = parseMarkdownToHtml(markdownText);
  const children = buildDocxChildrenFromRenderedHtml(renderedHtml);

  const documentObject = new Document({
    sections: [
      {
        children,
      },
    ],
  });

  const outputBlob = await Packer.toBlob(documentObject);
  downloadBlob(outputBlob, filename);
};
