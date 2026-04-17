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

    if (mode === 'minify') {
      return {
        ok: true,
        value: JSON.stringify(parsed),
      };
    }

    return {
      ok: true,
      value: JSON.stringify(parsed, null, 2),
    };
  } catch (error) {
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
