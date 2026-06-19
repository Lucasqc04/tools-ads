export type JsonCodegenOutput = {
  typeScript: string;
  zod: string;
  jsonSchema: string;
  notes: string[];
};

type SchemaNode =
  | { kind: 'null' }
  | { kind: 'boolean' }
  | { kind: 'integer' }
  | { kind: 'number' }
  | { kind: 'string'; format?: string }
  | { kind: 'array'; item: SchemaNode }
  | { kind: 'object'; props: Record<string, SchemaNode>; required: Set<string> }
  | { kind: 'union'; variants: SchemaNode[] }
  | { kind: 'unknown' };

const IDENTIFIER_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

const toPascalCase = (value: string): string => {
  const cleaned = value
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .replaceAll(/[^a-zA-Z0-9]+/g, ' ')
    .trim();

  const pascal = cleaned
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join('');

  return /^[A-Za-z]/.test(pascal) ? pascal : `Generated${pascal || 'Type'}`;
};

const quoteKey = (key: string): string => (IDENTIFIER_RE.test(key) ? key : JSON.stringify(key));

const detectStringFormat = (value: string): string | undefined => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return 'date';
  }

  if (/^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return 'date-time';
  }

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return 'email';
  }

  if (/^https?:\/\//i.test(value)) {
    return 'uri';
  }

  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
    return 'uuid';
  }

  return undefined;
};

const normalizeUnion = (variants: SchemaNode[]): SchemaNode => {
  const flat = variants.flatMap((variant) => (variant.kind === 'union' ? variant.variants : [variant]));
  const deduped: SchemaNode[] = [];

  flat.forEach((variant) => {
    const signature = JSON.stringify(toJsonSchemaValue(variant));
    if (!deduped.some((item) => JSON.stringify(toJsonSchemaValue(item)) === signature)) {
      deduped.push(variant);
    }
  });

  if (deduped.length === 0) {
    return { kind: 'unknown' };
  }

  if (deduped.length === 1) {
    return deduped[0];
  }

  return { kind: 'union', variants: deduped };
};

const mergeNodes = (left: SchemaNode, right: SchemaNode): SchemaNode => {
  if (left.kind === right.kind) {
    if (left.kind === 'array' && right.kind === 'array') {
      return { kind: 'array', item: mergeNodes(left.item, right.item) };
    }

    if (left.kind === 'object' && right.kind === 'object') {
      const props: Record<string, SchemaNode> = { ...left.props };
      const allKeys = new Set([...Object.keys(left.props), ...Object.keys(right.props)]);

      allKeys.forEach((key) => {
        if (left.props[key] && right.props[key]) {
          props[key] = mergeNodes(left.props[key], right.props[key]);
        } else {
          props[key] = left.props[key] ?? right.props[key];
        }
      });

      const required = new Set<string>();
      left.required.forEach((key) => {
        if (right.required.has(key)) {
          required.add(key);
        }
      });

      return { kind: 'object', props, required };
    }

    if (left.kind === 'string' && right.kind === 'string') {
      return left.format === right.format ? left : { kind: 'string' };
    }

    return left;
  }

  if (
    (left.kind === 'integer' && right.kind === 'number') ||
    (left.kind === 'number' && right.kind === 'integer')
  ) {
    return { kind: 'number' };
  }

  return normalizeUnion([left, right]);
};

const inferNode = (value: unknown): SchemaNode => {
  if (value === null) {
    return { kind: 'null' };
  }

  if (Array.isArray(value)) {
    if (!value.length) {
      return { kind: 'array', item: { kind: 'unknown' } };
    }

    return { kind: 'array', item: value.map(inferNode).reduce((acc, item) => mergeNodes(acc, item)) };
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    return {
      kind: 'object',
      props: Object.fromEntries(entries.map(([key, item]) => [key, inferNode(item)])),
      required: new Set(entries.map(([key]) => key)),
    };
  }

  if (typeof value === 'string') {
    return { kind: 'string', format: detectStringFormat(value) };
  }

  if (typeof value === 'number') {
    return Number.isInteger(value) ? { kind: 'integer' } : { kind: 'number' };
  }

  if (typeof value === 'boolean') {
    return { kind: 'boolean' };
  }

  return { kind: 'unknown' };
};

const renderTsType = (node: SchemaNode, level = 0): string => {
  const indent = '  '.repeat(level);
  const childIndent = '  '.repeat(level + 1);

  if (node.kind === 'null') return 'null';
  if (node.kind === 'boolean') return 'boolean';
  if (node.kind === 'integer' || node.kind === 'number') return 'number';
  if (node.kind === 'string') return 'string';
  if (node.kind === 'unknown') return 'unknown';
  if (node.kind === 'array') return `${renderTsType(node.item, level)}[]`;
  if (node.kind === 'union') return node.variants.map((variant) => renderTsType(variant, level)).join(' | ');

  const lines = Object.entries(node.props).map(([key, value]) => {
    const optional = node.required.has(key) ? '' : '?';
    return `${childIndent}${quoteKey(key)}${optional}: ${renderTsType(value, level + 1)};`;
  });

  return ['{', ...lines, `${indent}}`].join('\n');
};

const renderZod = (node: SchemaNode, level = 0): string => {
  const indent = '  '.repeat(level);
  const childIndent = '  '.repeat(level + 1);

  if (node.kind === 'null') return 'z.null()';
  if (node.kind === 'boolean') return 'z.boolean()';
  if (node.kind === 'integer') return 'z.number().int()';
  if (node.kind === 'number') return 'z.number()';
  if (node.kind === 'string') {
    if (node.format === 'email') return 'z.string().email()';
    if (node.format === 'uri') return 'z.string().url()';
    if (node.format === 'uuid') return 'z.string().uuid()';
    if (node.format === 'date' || node.format === 'date-time') return 'z.string().datetime().or(z.string())';
    return 'z.string()';
  }
  if (node.kind === 'unknown') return 'z.unknown()';
  if (node.kind === 'array') return `z.array(${renderZod(node.item, level)})`;
  if (node.kind === 'union') return `z.union([${node.variants.map((variant) => renderZod(variant, level)).join(', ')}])`;

  const lines = Object.entries(node.props).map(([key, value]) => {
    const schema = renderZod(value, level + 1);
    return `${childIndent}${JSON.stringify(key)}: ${node.required.has(key) ? schema : `${schema}.optional()`},`;
  });

  return ['z.object({', ...lines, `${indent}})`].join('\n');
};

function toJsonSchemaValue(node: SchemaNode): Record<string, unknown> {
  if (node.kind === 'null') return { type: 'null' };
  if (node.kind === 'boolean') return { type: 'boolean' };
  if (node.kind === 'integer') return { type: 'integer' };
  if (node.kind === 'number') return { type: 'number' };
  if (node.kind === 'string') return node.format ? { type: 'string', format: node.format } : { type: 'string' };
  if (node.kind === 'unknown') return {};
  if (node.kind === 'array') return { type: 'array', items: toJsonSchemaValue(node.item) };
  if (node.kind === 'union') return { anyOf: node.variants.map(toJsonSchemaValue) };

  const properties = Object.fromEntries(
    Object.entries(node.props).map(([key, value]) => [key, toJsonSchemaValue(value)]),
  );
  return {
    type: 'object',
    properties,
    required: Array.from(node.required),
    additionalProperties: false,
  };
}

export const generateJsonCode = (rawJson: string, rootNameInput = 'GeneratedPayload'): JsonCodegenOutput => {
  const parsed = JSON.parse(rawJson) as unknown;
  const rootName = toPascalCase(rootNameInput);
  const inferred = inferNode(parsed);
  const notes: string[] = [];

  if (inferred.kind === 'array') {
    notes.push('A raiz do JSON e uma lista; o tipo principal representa o item e o alias exportado usa array.');
  }

  const rootNode = inferred.kind === 'array' ? inferred.item : inferred;
  const typeBody = renderTsType(rootNode);
  const typeScript =
    rootNode.kind === 'object'
      ? `export interface ${rootName} ${typeBody}\n\nexport type ${rootName}List = ${rootName}[];\n`
      : `export type ${rootName} = ${renderTsType(rootNode)};\n${inferred.kind === 'array' ? `export type ${rootName}List = ${rootName}[];\n` : ''}`;

  const zodSchema = renderZod(rootNode);
  const zod = [
    "import { z } from 'zod';",
    '',
    `export const ${rootName.charAt(0).toLowerCase()}${rootName.slice(1)}Schema = ${zodSchema};`,
    `export type ${rootName} = z.infer<typeof ${rootName.charAt(0).toLowerCase()}${rootName.slice(1)}Schema>;`,
  ].join('\n');

  const schema = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    title: rootName,
    ...(inferred.kind === 'array'
      ? { type: 'array', items: toJsonSchemaValue(rootNode) }
      : toJsonSchemaValue(rootNode)),
  };

  return {
    typeScript,
    zod,
    jsonSchema: JSON.stringify(schema, null, 2),
    notes,
  };
};

