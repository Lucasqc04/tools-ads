export type JsonFormatMode = 'pretty' | 'minify';

export type JsonFormatResult =
  | { ok: true; value: string }
  | { ok: false; error: string };

export type JsonFormatterMessages = {
  emptyInput: string;
  invalidPrefix: string;
  invalidFallback: string;
};

const DEFAULT_JSON_FORMATTER_MESSAGES: JsonFormatterMessages = {
  emptyInput: 'Cole um JSON válido antes de formatar.',
  invalidPrefix: 'JSON inválido:',
  invalidFallback: 'JSON inválido. Revise a sintaxe e tente novamente.',
};

const formatParsedJson = (parsed: unknown, mode: JsonFormatMode): string => {
  if (mode === 'minify') {
    return JSON.stringify(parsed);
  }

  return JSON.stringify(parsed, null, 2);
};

const applyIndentToMultiline = (value: string, indent: string): string => {
  if (!indent || !value.includes('\n')) {
    return value;
  }

  return value.replace(/\n/g, `\n${indent}`);
};

const findJsonCandidateEnd = (value: string, startIndex: number): number => {
  const opening = value[startIndex];
  const expectedClosing = opening === '{' ? '}' : opening === '[' ? ']' : undefined;

  if (!expectedClosing) {
    return -1;
  }

  const stack: Array<'}' | ']'> = [expectedClosing];
  let inString = false;
  let escaped = false;

  for (let idx = startIndex + 1; idx < value.length; idx += 1) {
    const char = value[idx];

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === '\\') {
        escaped = true;
        continue;
      }

      if (char === '"') {
        inString = false;
      }

      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === '{') {
      stack.push('}');
      continue;
    }

    if (char === '[') {
      stack.push(']');
      continue;
    }

    if (char === '}' || char === ']') {
      const expected = stack.pop();

      if (char !== expected) {
        return -1;
      }

      if (stack.length === 0) {
        return idx;
      }
    }
  }

  return -1;
};

const getLinePrefix = (
  input: string,
  jsonStart: number,
): { rawPrefix: string; isWhitespaceOnly: boolean } => {
  const lastLineBreak = input.lastIndexOf('\n', jsonStart - 1);
  const lineStart = lastLineBreak === -1 ? 0 : lastLineBreak + 1;
  const rawPrefix = input.slice(lineStart, jsonStart);

  return {
    rawPrefix,
    isWhitespaceOnly: rawPrefix.trim().length === 0,
  };
};

const formatInnerJsonBlocks = (
  input: string,
  mode: JsonFormatMode,
): { hasFormattedBlock: boolean; output: string } => {
  let cursor = 0;
  let lastEmitted = 0;
  let hasFormattedBlock = false;
  let output = '';

  while (cursor < input.length) {
    const char = input[cursor];
    const isJsonStart = char === '{' || char === '[';

    if (!isJsonStart) {
      cursor += 1;
      continue;
    }

    const endIndex = findJsonCandidateEnd(input, cursor);
    if (endIndex === -1) {
      cursor += 1;
      continue;
    }

    const candidate = input.slice(cursor, endIndex + 1);

    try {
      const parsed = JSON.parse(candidate);
      const formatted = formatParsedJson(parsed, mode);
      const { rawPrefix, isWhitespaceOnly } = getLinePrefix(input, cursor);
      const formattedWithIndent = isWhitespaceOnly
        ? applyIndentToMultiline(formatted, rawPrefix)
        : formatted;

      output += input.slice(lastEmitted, cursor);
      output += formattedWithIndent;

      hasFormattedBlock = true;
      cursor = endIndex + 1;
      lastEmitted = cursor;
    } catch {
      cursor += 1;
    }
  }

  output += input.slice(lastEmitted);

  return {
    hasFormattedBlock,
    output,
  };
};

export const formatJsonText = (
  input: string,
  mode: JsonFormatMode,
  messages: JsonFormatterMessages = DEFAULT_JSON_FORMATTER_MESSAGES,
): JsonFormatResult => {
  const trimmed = input.trim();

  if (!trimmed) {
    return {
      ok: false,
      error: messages.emptyInput,
    };
  }

  try {
    const parsed = JSON.parse(trimmed);

    return {
      ok: true,
      value: formatParsedJson(parsed, mode),
    };
  } catch (error) {
    const mixedJsonResult = formatInnerJsonBlocks(input, mode);

    if (mixedJsonResult.hasFormattedBlock) {
      return {
        ok: true,
        value: mixedJsonResult.output,
      };
    }

    if (error instanceof Error) {
      return {
        ok: false,
        error: `${messages.invalidPrefix} ${error.message}`,
      };
    }

    return {
      ok: false,
      error: messages.invalidFallback,
    };
  }
};
