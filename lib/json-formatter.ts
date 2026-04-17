export type JsonFormatMode = 'pretty' | 'minify';

export type JsonFormatResult =
  | { ok: true; value: string }
  | { ok: false; error: string };

export const formatJsonText = (
  input: string,
  mode: JsonFormatMode,
): JsonFormatResult => {
  const trimmed = input.trim();

  if (!trimmed) {
    return {
      ok: false,
      error: 'Cole um JSON válido antes de formatar.',
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
        error: `JSON inválido: ${error.message}`,
      };
    }

    return {
      ok: false,
      error: 'JSON inválido. Revise a sintaxe e tente novamente.',
    };
  }
};
