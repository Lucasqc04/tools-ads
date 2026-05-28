import type { ASTNode, DataType, FunctionNode, ParameterDefinition, ProcedureNode, ProgramNode, VariableDeclaration } from './types';

// ---------- Shared Helpers ----------

function mapOp(op: string, target: 'pascal' | 'c' | 'java' | 'pseudocode'): string {
  if (target === 'pascal') {
    switch (op) {
      case '=': return '=';
      case '<>': return '<>';
      case 'and': return 'and';
      case 'or': return 'or';
      case 'not': return 'not';
      case 'mod': return 'mod';
      default: return op;
    }
  }
  if (target === 'c' || target === 'java') {
    switch (op) {
      case '=': return '==';
      case '<>': return '!=';
      case 'and': return '&&';
      case 'or': return '||';
      case 'not': return '!';
      case 'mod': return '%';
      case 'div': return '/';
      default: return op;
    }
  }
  if (target === 'pseudocode') {
    switch (op) {
      case '=': return '=';
      case '<>': return '<>';
      case 'and': return 'e';
      case 'or': return 'ou';
      case 'not': return 'nao';
      case 'mod': return 'mod';
      default: return op;
    }
  }
  return op;
}

function mapType(dt: DataType, target: 'pascal' | 'c' | 'java' | 'pseudocode'): string {
  if (target === 'pascal') {
    switch (dt) {
      case 'integer': return 'integer';
      case 'real': return 'real';
      case 'char': return 'char';
      case 'boolean': return 'boolean';
      case 'string': return 'string';
      case 'void': return '';
      default: return 'integer';
    }
  }
  if (target === 'c') {
    switch (dt) {
      case 'integer': return 'int';
      case 'real': return 'float';
      case 'char': return 'char';
      case 'boolean': return 'int';
      case 'string': return 'char*';
      case 'void': return 'void';
      default: return 'int';
    }
  }
  if (target === 'java') {
    switch (dt) {
      case 'integer': return 'int';
      case 'real': return 'double';
      case 'char': return 'char';
      case 'boolean': return 'boolean';
      case 'string': return 'String';
      case 'void': return 'void';
      default: return 'int';
    }
  }
  // pseudocode
  switch (dt) {
    case 'integer': return 'inteiro';
    case 'real': return 'real';
    case 'char': case 'string': return 'caractere';
    case 'boolean': return 'logico';
    case 'void': return '';
    default: return 'inteiro';
  }
}

function indent(level: number): string {
  return '  '.repeat(level);
}

function mapIdentifierName(name: string, target: 'pascal' | 'c' | 'java' | 'pseudocode'): string {
  const lower = name.toLowerCase();

  if (target === 'pascal') {
    return lower === 'null' || lower === 'nulo' ? 'nil' : name;
  }

  if (target === 'c') {
    if (lower === 'nil' || lower === 'nulo') return 'NULL';
    return name
      .replace(/\^\./g, '->')
      .replace(/\^/g, '');
  }

  if (target === 'java') {
    if (lower === 'nil' || lower === 'nulo') return 'null';
    return name.replace(/\^/g, '');
  }

  // pseudocode
  if (lower === 'nil' || lower === 'null') return 'nulo';
  return name.replace(/\^/g, '');
}

type ValueShape = 'scalar' | 'array' | 'node';

interface SymbolMeta {
  name: string;
  dataType: DataType;
  rawType?: string;
  byRef?: boolean;
  shape: ValueShape;
  fields: Set<string>;
  structName?: string;
}

interface TypeContext {
  symbols: Map<string, SymbolMeta>;
  structFields: Map<string, Set<string>>;
}

function toKey(name: string): string {
  return name.toLowerCase();
}

function baseIdentifier(name: string): string {
  const match = name.match(/^([A-Za-z_][A-Za-z0-9_]*)/);
  return match?.[1] ?? name;
}

function toPascalCase(value: string): string {
  const parts = value
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return 'Node';
  return parts.map(part => part[0].toUpperCase() + part.slice(1).toLowerCase()).join('');
}

function guessShapeFromRawType(rawType?: string): ValueShape | null {
  if (!rawType) return null;
  const lower = rawType.toLowerCase();
  if (lower.includes('array') || lower.includes('vetor') || lower.includes('[]')) return 'array';
  if (lower.startsWith('end') || lower.includes('ptr') || lower.includes('ponteiro') || lower.includes('record')) return 'node';
  return null;
}

function deriveStructName(symbol: SymbolMeta): string {
  if (symbol.structName) return symbol.structName;

  let raw = symbol.rawType ?? symbol.name;
  raw = raw.replace(/[^a-zA-Z0-9_]/g, ' ');
  const firstToken = raw.trim().split(/\s+/)[0] ?? symbol.name;
  let normalized = firstToken.replace(/^end/i, '');
  if (!normalized) normalized = `${symbol.name}Node`;
  const pascal = toPascalCase(normalized);
  const reserved = new Set(['Int', 'Integer', 'Real', 'Double', 'Float', 'Char', 'String', 'Boolean', 'Void', 'Array', 'Vetor']);
  symbol.structName = reserved.has(pascal) ? `${toPascalCase(symbol.name)}Node` : pascal;
  return symbol.structName;
}

function buildTypeContext(ast: ProgramNode): TypeContext {
  const symbols = new Map<string, SymbolMeta>();

  const ensureSymbol = (name: string, dataType: DataType = 'unknown', rawType?: string, byRef?: boolean): SymbolMeta => {
    const key = toKey(name);
    const existing = symbols.get(key);
    if (existing) {
      if (existing.dataType === 'unknown' && dataType !== 'unknown') existing.dataType = dataType;
      if (!existing.rawType && rawType) existing.rawType = rawType;
      if (!existing.byRef && byRef) existing.byRef = true;
      const guessed = guessShapeFromRawType(rawType);
      if (existing.shape === 'scalar' && guessed) existing.shape = guessed;
      return existing;
    }

    const shape = guessShapeFromRawType(rawType) ?? 'scalar';
    const symbol: SymbolMeta = { name, dataType, rawType, byRef, shape, fields: new Set() };
    symbols.set(key, symbol);
    return symbol;
  };

  const markArray = (name: string) => {
    if (!name) return;
    const symbol = ensureSymbol(name);
    symbol.shape = 'array';
  };

  const markNode = (name: string, fields: string[] = []) => {
    if (!name) return;
    const symbol = ensureSymbol(name);
    symbol.shape = 'node';
    for (const field of fields) {
      symbol.fields.add(field);
    }
  };

  const collectFromName = (name: string) => {
    const root = baseIdentifier(name);
    if (!root) return;
    if (root.toLowerCase() === 'nil' || root.toLowerCase() === 'null') return;

    if (name.includes('[')) markArray(root);

    const fieldMatches = Array.from(name.matchAll(/(?:\^\.|->|\.)([A-Za-z_][A-Za-z0-9_]*)/g)).map(match => match[1]);
    if (name.includes('^') || name.includes('->')) {
      markNode(root, fieldMatches);
    } else if (fieldMatches.length > 0 && symbols.get(toKey(root))?.shape === 'node') {
      markNode(root, fieldMatches);
    }
  };

  const collectFromNode = (node: ASTNode) => {
    switch (node.type) {
      case 'Assignment':
        collectFromNode(node.target);
        collectFromNode(node.value);
        return;
      case 'If':
        collectFromNode(node.condition);
        node.thenBody.forEach(collectFromNode);
        node.elseBody?.forEach(collectFromNode);
        return;
      case 'While':
      case 'DoWhile':
      case 'RepeatUntil':
        collectFromNode(node.condition);
        node.body.forEach(collectFromNode);
        return;
      case 'For':
        ensureSymbol(node.variable, 'integer');
        collectFromNode(node.start);
        collectFromNode(node.end);
        node.body.forEach(collectFromNode);
        return;
      case 'Switch':
        collectFromNode(node.expression);
        node.cases.forEach(item => {
          collectFromNode(item.value);
          item.body.forEach(collectFromNode);
        });
        node.defaultBody?.forEach(collectFromNode);
        return;
      case 'Write':
        node.args.forEach(collectFromNode);
        return;
      case 'Read':
        node.variables.forEach(name => collectFromName(name));
        return;
      case 'Call':
        if (node.name.toLowerCase() === 'new' && node.args.length > 0) {
          const first = node.args[0];
          if (first.type === 'Identifier') {
            markNode(baseIdentifier(first.name));
          }
        }
        node.args.forEach(collectFromNode);
        return;
      case 'Return':
        if (node.value) collectFromNode(node.value);
        return;
      case 'Binary':
        collectFromNode(node.left);
        collectFromNode(node.right);
        if ((node.operator === '=' || node.operator === '<>')) {
          const leftNil = node.left.type === 'Identifier' && ['nil', 'null'].includes(node.left.name.toLowerCase());
          const rightNil = node.right.type === 'Identifier' && ['nil', 'null'].includes(node.right.name.toLowerCase());
          if (leftNil && node.right.type === 'Identifier') markNode(baseIdentifier(node.right.name));
          if (rightNil && node.left.type === 'Identifier') markNode(baseIdentifier(node.left.name));
        }
        return;
      case 'Unary':
        collectFromNode(node.operand);
        return;
      case 'Identifier':
        collectFromName(node.name);
        return;
      case 'ArrayAccess':
        markArray(node.array);
        collectFromNode(node.index);
        return;
      case 'Block':
        node.body.forEach(collectFromNode);
        return;
      default:
        return;
    }
  };

  const registerVars = (vars: VariableDeclaration[]) => {
    for (const v of vars) {
      ensureSymbol(v.name, v.dataType, v.rawType);
    }
  };

  const registerParams = (params: ParameterDefinition[]) => {
    for (const p of params) {
      const symbol = ensureSymbol(p.name, p.dataType, p.rawType, p.byRef);
      if (p.byRef && symbol.shape === 'scalar' && symbol.dataType === 'unknown') {
        symbol.shape = 'node';
      }
    }
  };

  registerVars(ast.variables);

  for (const fn of ast.functions) {
    registerParams(fn.params);
    registerVars(fn.localVars);
    fn.body.forEach(collectFromNode);
  }

  ast.body.forEach(collectFromNode);

  const structFields = new Map<string, Set<string>>();
  for (const symbol of symbols.values()) {
    if (symbol.shape !== 'node') continue;
    const structName = deriveStructName(symbol);
    const fieldSet = structFields.get(structName) ?? new Set<string>();
    symbol.fields.forEach(field => fieldSet.add(field));
    structFields.set(structName, fieldSet);
  }

  return { symbols, structFields };
}

function getSymbolMeta(ctx: TypeContext, name: string): SymbolMeta | undefined {
  return ctx.symbols.get(toKey(name));
}

function cPrimitiveType(dt: DataType): string {
  return mapType(dt === 'unknown' ? 'integer' : dt, 'c');
}

function javaPrimitiveType(dt: DataType): string {
  return mapType(dt === 'unknown' ? 'integer' : dt, 'java');
}

function isArrayDeclarationVar(v: VariableDeclaration): boolean {
  const raw = v.rawType?.toLowerCase() ?? '';
  return typeof v.arraySize === 'number' || raw.includes('array') || raw.includes('vetor');
}

function cVarDeclaration(v: VariableDeclaration, ctx: TypeContext, withIndent = ''): string {
  const base = cPrimitiveType(v.dataType === 'unknown' ? 'integer' : v.dataType);
  if (isArrayDeclarationVar(v)) {
    const size = v.arraySize && v.arraySize > 0 ? v.arraySize : 100;
    return `${withIndent}${base} ${v.name}[${size}];`;
  }
  const symbol = getSymbolMeta(ctx, v.name);
  if (symbol) return `${withIndent}${cTypeForSymbol(symbol, false)} ${v.name};`;
  return `${withIndent}${base} ${v.name};`;
}

function javaVarDeclaration(v: VariableDeclaration, ctx: TypeContext, withIndent = ''): string {
  const base = javaPrimitiveType(v.dataType === 'unknown' ? 'integer' : v.dataType);
  if (isArrayDeclarationVar(v)) {
    const size = v.arraySize && v.arraySize > 0 ? v.arraySize : 100;
    return `${withIndent}${base}[] ${v.name} = new ${base}[${size}];`;
  }
  const symbol = getSymbolMeta(ctx, v.name);
  if (symbol) return `${withIndent}${javaTypeForSymbol(symbol)} ${v.name};`;
  return `${withIndent}${base} ${v.name};`;
}

function cTypeForSymbol(symbol: SymbolMeta, asParam: boolean): string {
  if (symbol.shape === 'node') {
    const structName = deriveStructName(symbol);
    if (asParam && symbol.byRef) return `${structName} **`;
    return `${structName} *`;
  }

  if (symbol.shape === 'array') {
    const base = cPrimitiveType(symbol.dataType);
    return asParam ? `${base}[]` : `${base}*`;
  }

  const primitive = cPrimitiveType(symbol.dataType);
  if (asParam && symbol.byRef) return `${primitive} *`;
  return primitive;
}

function javaTypeForSymbol(symbol: SymbolMeta): string {
  if (symbol.shape === 'node') {
    return deriveStructName(symbol);
  }

  if (symbol.shape === 'array') {
    const base = javaPrimitiveType(symbol.dataType);
    return `${base}[]`;
  }

  return javaPrimitiveType(symbol.dataType);
}

// ---------- Pascal Generator ----------

export function generatePascal(ast: ProgramNode): string {
  const typeLabel = (dt: DataType, rawType?: string): string => {
    if (dt !== 'unknown') return mapType(dt, 'pascal');
    if (!rawType) return 'integer';
    const lower = rawType.toLowerCase();
    if (lower.includes('*') || lower === 'ptr' || lower.includes('struct') || lower.includes('scanner')) return 'integer';
    if (lower.includes('array') || lower.includes('vetor') || lower.includes('[')) return 'integer';
    return 'integer';
  };

  const lines: string[] = [];

  const inlineMainDecls = collectInlineVariableDeclarations(ast.body);
  const mainLoopVars = collectForVariables(ast.body);
  const mainAssignedVars = collectAssignedIdentifierVariables(ast.body);
  const globalNames = new Set(ast.variables.map(v => v.name.toLowerCase()));
  for (const decl of inlineMainDecls) {
    if (!globalNames.has(decl.name.toLowerCase())) {
      ast.variables.push({ ...decl });
      globalNames.add(decl.name.toLowerCase());
    }
  }
  for (const loopVar of mainLoopVars) {
    if (!globalNames.has(loopVar.toLowerCase())) {
      ast.variables.push({ type: 'VariableDeclaration', name: loopVar, dataType: 'integer' });
      globalNames.add(loopVar.toLowerCase());
    }
  }
  for (const assignedVar of mainAssignedVars) {
    const normalized = assignedVar.toLowerCase();
    if (normalized === 'nil' || normalized === 'null') continue;
    if (!globalNames.has(normalized)) {
      ast.variables.push({ type: 'VariableDeclaration', name: assignedVar, dataType: 'integer' });
      globalNames.add(normalized);
    }
  }
  ast.variables = dedupeVariableDeclarations(ast.variables);

  lines.push(`program ${ast.name || 'Programa'};`);
  lines.push('');

  // Variables
  if (ast.variables.length > 0) {
    lines.push('var');
    for (const v of ast.variables) {
      if (isArrayDeclarationVar(v)) {
        const size = v.arraySize && v.arraySize > 0 ? v.arraySize : 100;
        lines.push(`  ${v.name}: array[0..${size - 1}] of ${mapType(v.dataType === 'unknown' ? 'integer' : v.dataType, 'pascal')};`);
      } else {
        lines.push(`  ${v.name}: ${typeLabel(v.dataType, v.rawType)};`);
      }
    }
    lines.push('');
  }

  // Functions
  for (const fn of ast.functions) {
    const inlineDecls = collectInlineVariableDeclarations(fn.body);
    const loopVars = collectForVariables(fn.body);
    const assignedVars = collectAssignedIdentifierVariables(fn.body);
    const localVarNames = new Set(fn.localVars.map(v => v.name.toLowerCase()));
    for (const decl of inlineDecls) {
      if (!localVarNames.has(decl.name.toLowerCase()) && !fn.params.some(p => p.name.toLowerCase() === decl.name.toLowerCase())) {
        fn.localVars.push({ ...decl });
        localVarNames.add(decl.name.toLowerCase());
      }
    }
    for (const loopVar of loopVars) {
      if (!localVarNames.has(loopVar.toLowerCase()) && !fn.params.some(p => p.name.toLowerCase() === loopVar.toLowerCase())) {
        fn.localVars.push({ type: 'VariableDeclaration', name: loopVar, dataType: 'integer' });
        localVarNames.add(loopVar.toLowerCase());
      }
    }
    for (const assignedVar of assignedVars) {
      const normalized = assignedVar.toLowerCase();
      if (normalized === 'nil' || normalized === 'null') continue;
      if (!localVarNames.has(normalized) && !globalNames.has(normalized) && !fn.params.some(p => p.name.toLowerCase() === normalized)) {
        fn.localVars.push({ type: 'VariableDeclaration', name: assignedVar, dataType: 'integer' });
        localVarNames.add(normalized);
      }
    }
    fn.localVars = dedupeVariableDeclarations(fn.localVars);

    const isPascalFunction = fn.type === 'Function' && fn.returnType !== 'void';
    if (isPascalFunction) {
      const params = fn.params
        .map(p => `${p.byRef ? 'var ' : ''}${p.name}: ${typeLabel(p.dataType, p.rawType)}`)
        .join('; ');
      lines.push(`function ${fn.name}(${params}): ${mapType(fn.returnType, 'pascal')};`);
    } else {
      const params = fn.params
        .map(p => `${p.byRef ? 'var ' : ''}${p.name}: ${typeLabel(p.dataType, p.rawType)}`)
        .join('; ');
      lines.push(`procedure ${fn.name}(${params});`);
    }
    if (fn.localVars.length > 0) {
      lines.push('var');
      for (const v of fn.localVars) {
        if (isArrayDeclarationVar(v)) {
          const size = v.arraySize && v.arraySize > 0 ? v.arraySize : 100;
          lines.push(`  ${v.name}: array[0..${size - 1}] of ${mapType(v.dataType === 'unknown' ? 'integer' : v.dataType, 'pascal')};`);
        } else {
          lines.push(`  ${v.name}: ${typeLabel(v.dataType, v.rawType)};`);
        }
      }
    }
    lines.push('begin');
    for (const v of fn.localVars) {
      if (v.initialValue && !isArrayDeclarationVar(v)) {
        lines.push(`${indent(1)}${v.name} := ${genPascalExpr(v.initialValue)};`);
      }
    }
    for (const stmt of fn.body) lines.push(genPascalStmt(stmt, 1, isPascalFunction ? fn.name : undefined));
    lines.push('end;');
    lines.push('');
  }

  // Main body
  lines.push('begin');
  for (const stmt of ast.body) lines.push(genPascalStmt(stmt, 1));
  lines.push('end.');

  return lines.join('\n');
}

function collectForVariables(nodes: ASTNode[]): string[] {
  const out = new Set<string>();

  const visit = (node: ASTNode) => {
    if (node.type === 'For') {
      out.add(node.variable);
      node.body.forEach(visit);
      return;
    }
    if (node.type === 'If') {
      node.thenBody.forEach(visit);
      node.elseBody?.forEach(visit);
      return;
    }
    if (node.type === 'While' || node.type === 'DoWhile' || node.type === 'RepeatUntil' || node.type === 'Block') {
      node.body.forEach(visit);
      return;
    }
    if (node.type === 'Switch') {
      node.cases.forEach(entry => entry.body.forEach(visit));
      node.defaultBody?.forEach(visit);
    }
  };

  nodes.forEach(visit);
  return Array.from(out);
}

function collectInlineVariableDeclarations(nodes: ASTNode[]): VariableDeclaration[] {
  const out: VariableDeclaration[] = [];

  const visit = (node: ASTNode) => {
    if (node.type === 'VariableDeclaration') {
      out.push(node);
      return;
    }
    if (node.type === 'For') {
      node.body.forEach(visit);
      return;
    }
    if (node.type === 'If') {
      node.thenBody.forEach(visit);
      node.elseBody?.forEach(visit);
      return;
    }
    if (node.type === 'While' || node.type === 'DoWhile' || node.type === 'RepeatUntil' || node.type === 'Block') {
      node.body.forEach(visit);
      return;
    }
    if (node.type === 'Switch') {
      node.cases.forEach(entry => entry.body.forEach(visit));
      node.defaultBody?.forEach(visit);
    }
  };

  nodes.forEach(visit);
  return out;
}

function dedupeVariableDeclarations(vars: VariableDeclaration[]): VariableDeclaration[] {
  const seen = new Set<string>();
  const out: VariableDeclaration[] = [];
  for (const v of vars) {
    const key = v.name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(v);
  }
  return out;
}

function collectAssignedIdentifierVariables(nodes: ASTNode[]): string[] {
  const out = new Set<string>();

  const visit = (node: ASTNode) => {
    switch (node.type) {
      case 'Assignment':
        if (node.target.type === 'Identifier') {
          out.add(baseIdentifier(node.target.name));
        } else if (node.target.type === 'ArrayAccess') {
          out.add(baseIdentifier(node.target.array));
        }
        visit(node.value);
        return;
      case 'If':
        visit(node.condition);
        node.thenBody.forEach(visit);
        node.elseBody?.forEach(visit);
        return;
      case 'While':
      case 'DoWhile':
      case 'RepeatUntil':
        visit(node.condition);
        node.body.forEach(visit);
        return;
      case 'Block':
        node.body.forEach(visit);
        return;
      case 'For':
        out.add(baseIdentifier(node.variable));
        visit(node.start);
        visit(node.end);
        node.body.forEach(visit);
        return;
      case 'Switch':
        visit(node.expression);
        node.cases.forEach(entry => {
          visit(entry.value);
          entry.body.forEach(visit);
        });
        node.defaultBody?.forEach(visit);
        return;
      case 'Write':
        node.args.forEach(visit);
        return;
      case 'Call':
        node.args.forEach(visit);
        return;
      case 'Return':
        if (node.value) visit(node.value);
        return;
      case 'Binary':
        visit(node.left);
        visit(node.right);
        return;
      case 'Unary':
        visit(node.operand);
        return;
      case 'ArrayAccess':
        out.add(baseIdentifier(node.array));
        visit(node.index);
        return;
      default:
        return;
    }
  };

  nodes.forEach(visit);
  return Array.from(out);
}

function flattenConcatArg(node: ASTNode): ASTNode[] | null {
  if (node.type !== 'Binary' || node.operator !== '+') return null;
  const left = flattenConcatArg(node.left) ?? [node.left];
  const right = flattenConcatArg(node.right) ?? [node.right];
  return [...left, ...right];
}

function expandConcatenatedWriteArgs(args: ASTNode[]): ASTNode[] {
  const expanded: ASTNode[] = [];
  for (const arg of args) {
    const flattened = flattenConcatArg(arg);
    if (flattened) expanded.push(...flattened);
    else expanded.push(arg);
  }
  return expanded;
}

function genPascalStmt(node: ASTNode, lvl: number, currentFunctionName?: string): string {
  switch (node.type) {
    case 'Assignment':
      return `${indent(lvl)}${genPascalExpr(node.target)} := ${genPascalExpr(node.value)};`;
    case 'VariableDeclaration':
      if (node.initialValue && !isArrayDeclarationVar(node)) return `${indent(lvl)}${node.name} := ${genPascalExpr(node.initialValue)};`;
      return '';
    case 'If': {
      let s = `${indent(lvl)}if ${genPascalExpr(node.condition)} then\n`;
      s += `${indent(lvl)}begin\n`;
      for (const st of node.thenBody) s += genPascalStmt(st, lvl + 1, currentFunctionName) + '\n';
      s += `${indent(lvl)}end`;
      if (node.elseBody && node.elseBody.length > 0) {
        s += `\n${indent(lvl)}else\n`;
        s += `${indent(lvl)}begin\n`;
        for (const st of node.elseBody) s += genPascalStmt(st, lvl + 1, currentFunctionName) + '\n';
        s += `${indent(lvl)}end`;
      }
      return `${s};`;
    }
    case 'While': {
      let s = `${indent(lvl)}while ${genPascalExpr(node.condition)} do\n`;
      s += `${indent(lvl)}begin\n`;
      for (const st of node.body) s += genPascalStmt(st, lvl + 1, currentFunctionName) + '\n';
      s += `${indent(lvl)}end;`;
      return s;
    }
    case 'For': {
      const dir = node.ascending ? 'to' : 'downto';
      let s = `${indent(lvl)}for ${node.variable} := ${genPascalExpr(node.start)} ${dir} ${genPascalExpr(node.end)} do\n`;
      s += `${indent(lvl)}begin\n`;
      for (const st of node.body) s += genPascalStmt(st, lvl + 1, currentFunctionName) + '\n';
      s += `${indent(lvl)}end;`;
      return s;
    }
    case 'RepeatUntil': {
      let s = `${indent(lvl)}repeat\n`;
      for (const st of node.body) s += genPascalStmt(st, lvl + 1, currentFunctionName) + '\n';
      s += `${indent(lvl)}until ${genPascalExpr(node.condition)};`;
      return s;
    }
    case 'DoWhile': {
      let s = `${indent(lvl)}repeat\n`;
      for (const st of node.body) s += genPascalStmt(st, lvl + 1, currentFunctionName) + '\n';
      s += `${indent(lvl)}until not (${genPascalExpr(node.condition)});`;
      return s;
    }
    case 'Write': {
      const fn = node.newline ? 'writeln' : 'write';
      const args = expandConcatenatedWriteArgs(node.args).map(a => genPascalExpr(a)).join(', ');
      return `${indent(lvl)}${fn}(${args});`;
    }
    case 'Read':
      return `${indent(lvl)}readln(${node.variables.join(', ')});`;
    case 'Call':
      if (node.name.toLowerCase().startsWith('next')) return '';
      if (node.name.includes('.')) {
        const method = node.name.split('.').pop() ?? node.name;
        if (method.toLowerCase() === 'close') return '';
        if (method.toLowerCase().startsWith('next')) return '';
        return node.args.length > 0
          ? `${indent(lvl)}${method}(${node.args.map(a => genPascalExpr(a)).join(', ')});`
          : `${indent(lvl)}${method};`;
      }
      return node.args.length > 0
        ? `${indent(lvl)}${node.name}(${node.args.map(a => genPascalExpr(a)).join(', ')});`
        : `${indent(lvl)}${node.name};`;
    case 'Return':
      if (!node.value) return `${indent(lvl)}exit;`;
      if (currentFunctionName) {
        return `${indent(lvl)}${currentFunctionName} := ${genPascalExpr(node.value)};\n${indent(lvl)}exit;`;
      }
      return `${indent(lvl)}exit;`;
    case 'Switch': {
      let s = `${indent(lvl)}case ${genPascalExpr(node.expression)} of\n`;
      for (const c of node.cases) {
        s += `${indent(lvl + 1)}${genPascalExpr(c.value)}:\n`;
        s += `${indent(lvl + 1)}begin\n`;
        for (const st of c.body) s += genPascalStmt(st, lvl + 2, currentFunctionName) + '\n';
        s += `${indent(lvl + 1)}end;\n`;
      }
      if (node.defaultBody) {
        s += `${indent(lvl)}else\n`;
        for (const st of node.defaultBody) s += genPascalStmt(st, lvl + 1, currentFunctionName) + '\n';
      }
      s += `${indent(lvl)}end;`;
      return s;
    }
    case 'Block': {
      let s = `${indent(lvl)}begin\n`;
      for (const st of node.body) s += genPascalStmt(st, lvl + 1, currentFunctionName) + '\n';
      s += `${indent(lvl)}end;`;
      return s;
    }
    default:
      return '';
  }
}

function genPascalExpr(node: ASTNode): string {
  switch (node.type) {
    case 'Literal':
      if (node.dataType === 'string') return `'${node.value}'`;
      if (node.dataType === 'boolean') return node.value ? 'true' : 'false';
      return String(node.value);
    case 'Identifier': return mapIdentifierName(node.name, 'pascal');
    case 'ArrayAccess': return `${node.array}[${genPascalExpr(node.index)}]`;
    case 'Binary': return `(${genPascalExpr(node.left)} ${mapOp(node.operator, 'pascal')} ${genPascalExpr(node.right)})`;
    case 'Unary': return `${mapOp(node.operator, 'pascal')} ${genPascalExpr(node.operand)}`;
    case 'Call': {
      if (node.name.toLowerCase().startsWith('next')) return '0';
      if (node.name.includes('.')) {
        const method = node.name.split('.').pop() ?? node.name;
        if (method.toLowerCase().startsWith('next') || method.toLowerCase() === 'close') return '0';
        return node.args.length > 0 ? `${method}(${node.args.map(a => genPascalExpr(a)).join(', ')})` : method;
      }
      return node.args.length > 0 ? `${node.name}(${node.args.map(a => genPascalExpr(a)).join(', ')})` : node.name;
    }
    default: return '';
  }
}

// ---------- C Generator ----------

export function generateC(ast: ProgramNode): string {
  const mainAssignedVars = collectAssignedIdentifierVariables(ast.body);
  const globalNames = new Set(ast.variables.map(v => v.name.toLowerCase()));
  for (const name of mainAssignedVars) {
    const normalized = name.toLowerCase();
    if (normalized === 'nil' || normalized === 'null') continue;
    if (!globalNames.has(normalized)) {
      ast.variables.push({ type: 'VariableDeclaration', name, dataType: 'integer' });
      globalNames.add(normalized);
    }
  }
  ast.variables = dedupeVariableDeclarations(ast.variables);

  for (const fn of ast.functions) {
    const localVarNames = new Set(fn.localVars.map(v => v.name.toLowerCase()));
    const assignedVars = collectAssignedIdentifierVariables(fn.body);
    for (const name of assignedVars) {
      const normalized = name.toLowerCase();
      if (normalized === 'nil' || normalized === 'null') continue;
      if (!localVarNames.has(normalized) && !globalNames.has(normalized) && !fn.params.some(p => p.name.toLowerCase() === normalized)) {
        fn.localVars.push({ type: 'VariableDeclaration', name, dataType: 'integer' });
        localVarNames.add(normalized);
      }
    }
    fn.localVars = dedupeVariableDeclarations(fn.localVars);
  }

  const ctx = buildTypeContext(ast);
  const lines: string[] = [];

  lines.push('#include <stdio.h>');
  lines.push('#include <stdlib.h>');
  lines.push('');

  for (const [structName, fields] of ctx.structFields.entries()) {
    lines.push(`typedef struct ${structName} {`);
    if (fields.size === 0) {
      lines.push('  int value;');
    } else {
      for (const field of fields) {
        const lower = field.toLowerCase();
        if (['info', 'valor', 'value', 'dado', 'chave', 'key', 'num', 'numero', 'id'].includes(lower)) {
          lines.push(`  int ${field};`);
        } else {
          lines.push(`  struct ${structName} *${field};`);
        }
      }
    }
    lines.push(`} ${structName};`);
    lines.push('');
  }

  if (ast.variables.length > 0) {
    for (const v of ast.variables) {
      const decl = cVarDeclaration(v, ctx);
      if (v.initialValue && !isArrayDeclarationVar(v) && v.initialValue.type === 'Literal') {
        lines.push(`${decl.slice(0, -1)} = ${genCExpr(v.initialValue, ctx)};`);
      } else {
        lines.push(decl);
      }
    }
    lines.push('');
  }

  // Functions
  for (const fn of ast.functions) {
    const params = fn.params.map(p => {
      const symbol = getSymbolMeta(ctx, p.name);
      if (!symbol) return `${cPrimitiveType(p.dataType)} ${p.name}`;
      if (symbol.shape === 'array') {
        return `${cPrimitiveType(symbol.dataType)} ${p.name}[]`;
      }
      return `${cTypeForSymbol(symbol, true)} ${p.name}`;
    }).join(', ');

    const retType = fn.type === 'Function'
      ? mapType(fn.returnType === 'unknown' ? 'integer' : fn.returnType, 'c')
      : 'void';

    lines.push(`${retType} ${fn.name}(${params}) {`);
    for (const v of fn.localVars) {
      lines.push(cVarDeclaration(v, ctx, '  '));
    }
    for (const v of fn.localVars) {
      if (v.initialValue && !isArrayDeclarationVar(v)) {
        lines.push(`  ${v.name} = ${genCExpr(v.initialValue, ctx)};`);
      }
    }
    for (const stmt of fn.body) lines.push(genCStmt(stmt, 1, ctx));
    lines.push('}');
    lines.push('');
  }

  // Main
  lines.push('int main() {');
  for (const stmt of ast.body) lines.push(genCStmt(stmt, 1, ctx));
  lines.push('  return 0;');
  lines.push('}');

  return lines.join('\n');
}

function genCStmt(node: ASTNode, lvl: number, ctx: TypeContext): string {
  switch (node.type) {
    case 'Assignment':
      return `${indent(lvl)}${genCExpr(node.target, ctx)} = ${genCExpr(node.value, ctx)};`;
    case 'VariableDeclaration': {
      const decl = cVarDeclaration(node, ctx, indent(lvl));
      if (!node.initialValue || isArrayDeclarationVar(node)) return decl;
      return `${decl}\n${indent(lvl)}${node.name} = ${genCExpr(node.initialValue, ctx)};`;
    }
    case 'If': {
      let s = `${indent(lvl)}if (${genCExpr(node.condition, ctx)}) {\n`;
      for (const st of node.thenBody) s += genCStmt(st, lvl + 1, ctx) + '\n';
      s += `${indent(lvl)}}`;
      if (node.elseBody && node.elseBody.length > 0) {
        s += ` else {\n`;
        for (const st of node.elseBody) s += genCStmt(st, lvl + 1, ctx) + '\n';
        s += `${indent(lvl)}}`;
      }
      return s;
    }
    case 'While': {
      let s = `${indent(lvl)}while (${genCExpr(node.condition, ctx)}) {\n`;
      for (const st of node.body) s += genCStmt(st, lvl + 1, ctx) + '\n';
      s += `${indent(lvl)}}`;
      return s;
    }
    case 'For': {
      const cmp = node.ascending ? '<=' : '>=';
      const inc = node.ascending ? '++' : '--';
      let s = `${indent(lvl)}for (int ${node.variable} = ${genCExpr(node.start, ctx)}; ${node.variable} ${cmp} ${genCExpr(node.end, ctx)}; ${node.variable}${inc}) {\n`;
      for (const st of node.body) s += genCStmt(st, lvl + 1, ctx) + '\n';
      s += `${indent(lvl)}}`;
      return s;
    }
    case 'RepeatUntil': {
      let s = `${indent(lvl)}do {\n`;
      for (const st of node.body) s += genCStmt(st, lvl + 1, ctx) + '\n';
      s += `${indent(lvl)}} while (!(${genCExpr(node.condition, ctx)}));`;
      return s;
    }
    case 'DoWhile': {
      let s = `${indent(lvl)}do {\n`;
      for (const st of node.body) s += genCStmt(st, lvl + 1, ctx) + '\n';
      s += `${indent(lvl)}} while (${genCExpr(node.condition, ctx)});`;
      return s;
    }
    case 'Write': {
      const args = expandConcatenatedWriteArgs(node.args);
      if (args.length === 0) return `${indent(lvl)}printf("${node.newline ? '\\n' : ''}");`;
      const formatParts: string[] = [];
      const valueParts: string[] = [];
      for (const arg of args) {
        if (arg.type === 'Literal' && arg.dataType === 'string') {
          formatParts.push(String(arg.value));
        } else {
          formatParts.push('%d'); // simplified: use %d
          valueParts.push(genCExpr(arg, ctx));
        }
      }
      let fmt = formatParts.join('');
      if (node.newline) fmt += '\\n';
      const valStr = valueParts.length > 0 ? ', ' + valueParts.join(', ') : '';
      return `${indent(lvl)}printf("${fmt}"${valStr});`;
    }
    case 'Read': {
      const stmts = node.variables.map(v => `${indent(lvl)}scanf("%d", &${v});`);
      return stmts.join('\n');
    }
    case 'Call':
      if (node.name.toLowerCase().startsWith('next')) return '';
      if (node.name.includes('.')) {
        const parts = node.name.split('.');
        const method = parts[parts.length - 1];
        if (method === 'close') return '';
        if (method.toLowerCase().startsWith('next')) return '';
        return node.args.length > 0
          ? `${indent(lvl)}${method}(${node.args.map(a => genCExpr(a, ctx)).join(', ')});`
          : `${indent(lvl)}${method}();`;
      }
      if (node.name.toLowerCase() === 'new' && node.args.length > 0) {
        const arg = node.args[0];
        if (arg.type === 'Identifier') {
          const varName = baseIdentifier(arg.name);
          const symbol = getSymbolMeta(ctx, varName);
          const structName = symbol && symbol.shape === 'node' ? deriveStructName(symbol) : 'int';
          const target = mapCIdentifierWithContext(varName, ctx);
          return `${indent(lvl)}${target} = (${structName}*)malloc(sizeof(${structName}));`;
        }
      }
      if (node.name.toLowerCase() === 'dispose' && node.args.length > 0) {
        const arg = node.args[0];
        if (arg.type === 'Identifier') {
          const varName = baseIdentifier(arg.name);
          const target = mapCIdentifierWithContext(varName, ctx);
          return `${indent(lvl)}free(${target});`;
        }
      }
      return node.args.length > 0
        ? `${indent(lvl)}${node.name}(${node.args.map(a => genCExpr(a, ctx)).join(', ')});`
        : `${indent(lvl)}${node.name}();`;
    case 'Return':
      return node.value ? `${indent(lvl)}return ${genCExpr(node.value, ctx)};` : `${indent(lvl)}return;`;
    case 'Switch': {
      let s = `${indent(lvl)}switch (${genCExpr(node.expression, ctx)}) {\n`;
      for (const c of node.cases) {
        s += `${indent(lvl + 1)}case ${genCExpr(c.value, ctx)}:\n`;
        for (const st of c.body) s += genCStmt(st, lvl + 2, ctx) + '\n';
        s += `${indent(lvl + 2)}break;\n`;
      }
      if (node.defaultBody) {
        s += `${indent(lvl + 1)}default:\n`;
        for (const st of node.defaultBody) s += genCStmt(st, lvl + 2, ctx) + '\n';
      }
      s += `${indent(lvl)}}`;
      return s;
    }
    case 'Break': return `${indent(lvl)}break;`;
    case 'Block': {
      let s = `${indent(lvl)}{\n`;
      for (const st of node.body) s += genCStmt(st, lvl + 1, ctx) + '\n';
      s += `${indent(lvl)}}`;
      return s;
    }
    default: return '';
  }
}

function mapCIdentifierWithContext(name: string, ctx: TypeContext): string {
  const lower = name.toLowerCase();
  if (lower === 'nil' || lower === 'null' || lower === 'nulo') return 'NULL';

  let mapped = name
    .replace(/\^\./g, '->')
    .replace(/\^/g, '');

  const root = baseIdentifier(name);
  const meta = getSymbolMeta(ctx, root);
  if (!meta || !meta.byRef) return mapped;

  if (meta.shape === 'node') {
    mapped = mapped.replace(new RegExp(`^${root}(?=->|\\.|\\[|$)`), `(*${root})`);
    return mapped;
  }

  mapped = mapped.replace(new RegExp(`^${root}(?=\\b|\\[)`), `(*${root})`);
  return mapped;
}

function genCExpr(node: ASTNode, ctx: TypeContext): string {
  switch (node.type) {
    case 'Literal':
      if (node.dataType === 'string') return `"${node.value}"`;
      if (node.dataType === 'boolean') return node.value ? '1' : '0';
      return String(node.value);
    case 'Identifier': return mapCIdentifierWithContext(node.name, ctx);
    case 'ArrayAccess': return `${mapCIdentifierWithContext(node.array, ctx)}[${genCExpr(node.index, ctx)}]`;
    case 'Binary': return `(${genCExpr(node.left, ctx)} ${mapOp(node.operator, 'c')} ${genCExpr(node.right, ctx)})`;
    case 'Unary': return `${mapOp(node.operator, 'c')}(${genCExpr(node.operand, ctx)})`;
    case 'Call': {
      if (node.name.toLowerCase().startsWith('next')) return '0';
      if (node.name.includes('.')) {
        const method = node.name.split('.').pop() ?? node.name;
        if (method.toLowerCase().startsWith('next') || method.toLowerCase() === 'close') return '0';
        return `${method}(${node.args.map(a => genCExpr(a, ctx)).join(', ')})`;
      }
      return `${node.name}(${node.args.map(a => genCExpr(a, ctx)).join(', ')})`;
    }
    default: return '';
  }
}

// ---------- Java Generator ----------

export function generateJava(ast: ProgramNode): string {
  const mainAssignedVars = collectAssignedIdentifierVariables(ast.body);
  const globalNames = new Set(ast.variables.map(v => v.name.toLowerCase()));
  for (const name of mainAssignedVars) {
    const normalized = name.toLowerCase();
    if (normalized === 'nil' || normalized === 'null') continue;
    if (!globalNames.has(normalized)) {
      ast.variables.push({ type: 'VariableDeclaration', name, dataType: 'integer' });
      globalNames.add(normalized);
    }
  }
  ast.variables = dedupeVariableDeclarations(ast.variables);

  for (const fn of ast.functions) {
    const localVarNames = new Set(fn.localVars.map(v => v.name.toLowerCase()));
    const assignedVars = collectAssignedIdentifierVariables(fn.body);
    for (const name of assignedVars) {
      const normalized = name.toLowerCase();
      if (normalized === 'nil' || normalized === 'null') continue;
      if (!localVarNames.has(normalized) && !globalNames.has(normalized) && !fn.params.some(p => p.name.toLowerCase() === normalized)) {
        fn.localVars.push({ type: 'VariableDeclaration', name, dataType: 'integer' });
        localVarNames.add(normalized);
      }
    }
    fn.localVars = dedupeVariableDeclarations(fn.localVars);
  }

  const ctx = buildTypeContext(ast);
  const lines: string[] = [];
  const className = ast.name || 'Programa';

  lines.push(`import java.util.Scanner;`);
  lines.push('');
  lines.push(`public class ${className} {`);

  for (const [structName, fields] of ctx.structFields.entries()) {
    lines.push(`  static class ${structName} {`);
    if (fields.size === 0) {
      lines.push('    int value;');
    } else {
      for (const field of fields) {
        const lower = field.toLowerCase();
        if (['info', 'valor', 'value', 'dado', 'chave', 'key', 'num', 'numero', 'id'].includes(lower)) {
          lines.push(`    int ${field};`);
        } else {
          lines.push(`    ${structName} ${field};`);
        }
      }
    }
    lines.push('  }');
    lines.push('');
  }

  // Functions as static methods
  for (const fn of ast.functions) {
    const params = fn.params.map(p => {
      const symbol = getSymbolMeta(ctx, p.name);
      if (!symbol) return `${javaPrimitiveType(p.dataType)} ${p.name}`;
      return `${javaTypeForSymbol(symbol)} ${p.name}`;
    }).join(', ');

    const firstByRef = fn.type === 'Procedure' ? fn.params.find(param => param.byRef) : undefined;
    const byRefSymbol = firstByRef ? getSymbolMeta(ctx, firstByRef.name) : undefined;
    const retType = fn.type === 'Function'
      ? mapType(fn.returnType === 'unknown' ? 'integer' : fn.returnType, 'java')
      : byRefSymbol ? javaTypeForSymbol(byRefSymbol) : 'void';

    lines.push(`  public static ${retType} ${fn.name}(${params}) {`);
    for (const v of fn.localVars) {
      lines.push(javaVarDeclaration(v, ctx, '    '));
    }
    for (const v of fn.localVars) {
      if (v.initialValue && !isArrayDeclarationVar(v)) {
        lines.push(`    ${v.name} = ${genJavaExpr(v.initialValue, ctx)};`);
      }
    }
    for (const stmt of fn.body) lines.push(genJavaStmt(stmt, 2, ctx));
    if (fn.type === 'Procedure' && byRefSymbol && firstByRef) {
      lines.push(`    return ${firstByRef.name};`);
    }
    lines.push('  }');
    lines.push('');
  }

  // Main method
  lines.push('  public static void main(String[] args) {');
  lines.push('    Scanner scanner = new Scanner(System.in);');
  for (const v of ast.variables) {
    lines.push(javaVarDeclaration(v, ctx, '    '));
  }
  for (const v of ast.variables) {
    if (v.initialValue && !isArrayDeclarationVar(v)) {
      lines.push(`    ${v.name} = ${genJavaExpr(v.initialValue, ctx)};`);
    }
  }
  if (ast.variables.length > 0) lines.push('');
  for (const stmt of ast.body) lines.push(genJavaStmt(stmt, 2, ctx));
  lines.push('    scanner.close();');
  lines.push('  }');
  lines.push('}');

  return lines.join('\n');
}

function genJavaStmt(node: ASTNode, lvl: number, ctx: TypeContext): string {
  switch (node.type) {
    case 'Assignment':
      return `${indent(lvl)}${genJavaExpr(node.target, ctx)} = ${genJavaExpr(node.value, ctx)};`;
    case 'VariableDeclaration': {
      const decl = javaVarDeclaration(node, ctx, indent(lvl));
      if (!node.initialValue || isArrayDeclarationVar(node)) return decl;
      return `${decl}\n${indent(lvl)}${node.name} = ${genJavaExpr(node.initialValue, ctx)};`;
    }
    case 'If': {
      let s = `${indent(lvl)}if (${genJavaExpr(node.condition, ctx)}) {\n`;
      for (const st of node.thenBody) s += genJavaStmt(st, lvl + 1, ctx) + '\n';
      s += `${indent(lvl)}}`;
      if (node.elseBody && node.elseBody.length > 0) {
        s += ` else {\n`;
        for (const st of node.elseBody) s += genJavaStmt(st, lvl + 1, ctx) + '\n';
        s += `${indent(lvl)}}`;
      }
      return s;
    }
    case 'While': {
      let s = `${indent(lvl)}while (${genJavaExpr(node.condition, ctx)}) {\n`;
      for (const st of node.body) s += genJavaStmt(st, lvl + 1, ctx) + '\n';
      s += `${indent(lvl)}}`;
      return s;
    }
    case 'For': {
      const cmp = node.ascending ? '<=' : '>=';
      const inc = node.ascending ? '++' : '--';
      let s = `${indent(lvl)}for (${node.variable} = ${genJavaExpr(node.start, ctx)}; ${node.variable} ${cmp} ${genJavaExpr(node.end, ctx)}; ${node.variable}${inc}) {\n`;
      for (const st of node.body) s += genJavaStmt(st, lvl + 1, ctx) + '\n';
      s += `${indent(lvl)}}`;
      return s;
    }
    case 'RepeatUntil': {
      let s = `${indent(lvl)}do {\n`;
      for (const st of node.body) s += genJavaStmt(st, lvl + 1, ctx) + '\n';
      s += `${indent(lvl)}} while (!(${genJavaExpr(node.condition, ctx)}));`;
      return s;
    }
    case 'DoWhile': {
      let s = `${indent(lvl)}do {\n`;
      for (const st of node.body) s += genJavaStmt(st, lvl + 1, ctx) + '\n';
      s += `${indent(lvl)}} while (${genJavaExpr(node.condition, ctx)});`;
      return s;
    }
    case 'Write': {
      const method = node.newline ? 'System.out.println' : 'System.out.print';
      const args = node.args.map(a => genJavaExpr(a, ctx)).join(' + ');
      return `${indent(lvl)}${method}(${args || '""'});`;
    }
    case 'Read':
      return node.variables.map(v => `${indent(lvl)}${v} = scanner.nextInt();`).join('\n');
    case 'Call':
      if (node.name.toLowerCase().startsWith('next')) return '';
      if (node.name.includes('.')) {
        const method = node.name.split('.').pop() ?? node.name;
        if (method.toLowerCase() === 'close') return '';
        if (method.toLowerCase().startsWith('next')) return '';
      }
      if (node.name.toLowerCase() === 'new' && node.args.length > 0) {
        const arg = node.args[0];
        if (arg.type === 'Identifier') {
          const varName = baseIdentifier(arg.name);
          const symbol = getSymbolMeta(ctx, varName);
          const classType = symbol && symbol.shape === 'node' ? deriveStructName(symbol) : 'Object';
          return `${indent(lvl)}${varName} = new ${classType}();`;
        }
      }
      if (node.name.toLowerCase() === 'dispose' && node.args.length > 0) {
        const arg = node.args[0];
        if (arg.type === 'Identifier') {
          return `${indent(lvl)}${baseIdentifier(arg.name)} = null;`;
        }
      }
      return node.args.length > 0
        ? `${indent(lvl)}${node.name}(${node.args.map(a => genJavaExpr(a, ctx)).join(', ')});`
        : `${indent(lvl)}${node.name}();`;
    case 'Return':
      return node.value ? `${indent(lvl)}return ${genJavaExpr(node.value, ctx)};` : `${indent(lvl)}return;`;
    case 'Switch': {
      let s = `${indent(lvl)}switch (${genJavaExpr(node.expression, ctx)}) {\n`;
      for (const c of node.cases) {
        s += `${indent(lvl + 1)}case ${genJavaExpr(c.value, ctx)}:\n`;
        for (const st of c.body) s += genJavaStmt(st, lvl + 2, ctx) + '\n';
        s += `${indent(lvl + 2)}break;\n`;
      }
      if (node.defaultBody) {
        s += `${indent(lvl + 1)}default:\n`;
        for (const st of node.defaultBody) s += genJavaStmt(st, lvl + 2, ctx) + '\n';
      }
      s += `${indent(lvl)}}`;
      return s;
    }
    case 'Break': return `${indent(lvl)}break;`;
    case 'Block': {
      let s = `${indent(lvl)}{\n`;
      for (const st of node.body) s += genJavaStmt(st, lvl + 1, ctx) + '\n';
      s += `${indent(lvl)}}`;
      return s;
    }
    default: return '';
  }
}

function genJavaExpr(node: ASTNode, ctx: TypeContext): string {
  switch (node.type) {
    case 'Literal':
      if (node.dataType === 'string') return `"${node.value}"`;
      if (node.dataType === 'boolean') return node.value ? 'true' : 'false';
      return String(node.value);
    case 'Identifier': return mapIdentifierName(node.name, 'java');
    case 'ArrayAccess': return `${mapIdentifierName(node.array, 'java')}[${genJavaExpr(node.index, ctx)}]`;
    case 'Binary': return `(${genJavaExpr(node.left, ctx)} ${mapOp(node.operator, 'java')} ${genJavaExpr(node.right, ctx)})`;
    case 'Unary': return `${mapOp(node.operator, 'java')}(${genJavaExpr(node.operand, ctx)})`;
    case 'Call': {
      if (node.name.toLowerCase().startsWith('next')) return '0';
      if (node.name.includes('.')) {
        const method = node.name.split('.').pop() ?? node.name;
        if (method.toLowerCase().startsWith('next') || method.toLowerCase() === 'close') return '0';
      }
      return `${node.name}(${node.args.map(a => genJavaExpr(a, ctx)).join(', ')})`;
    }
    default: return '';
  }
}

// ---------- Pseudocode Generator ----------

export function generatePseudocode(ast: ProgramNode): string {
  const typeLabel = (dt: DataType, rawType?: string): string => {
    if (dt !== 'unknown') return mapType(dt, 'pseudocode');
    if (!rawType) return 'inteiro';
    const lower = rawType.toLowerCase();
    if (lower.includes('vetor') || lower.includes('array')) return 'vetor';
    return rawType;
  };

  const lines: string[] = [];

  lines.push(`algoritmo "${ast.name || 'Programa'}"`);
  lines.push('');

  if (ast.variables.length > 0) {
    lines.push('var');
    for (const v of ast.variables) {
      lines.push(`  ${v.name}: ${typeLabel(v.dataType, v.rawType)}`);
    }
    lines.push('');
  }

  for (const fn of ast.functions) {
    const params = fn.params.map(p => `${p.name}: ${typeLabel(p.dataType, p.rawType)}`).join(', ');
    if (fn.type === 'Function') {
      lines.push(`funcao ${fn.name}(${params}): ${mapType(fn.returnType, 'pseudocode')}`);
    } else {
      lines.push(`procedimento ${fn.name}(${params})`);
    }
    if (fn.localVars.length > 0) {
      lines.push('var');
      for (const v of fn.localVars) lines.push(`  ${v.name}: ${typeLabel(v.dataType, v.rawType)}`);
    }
    lines.push('inicio');
    for (const stmt of fn.body) lines.push(genPseudoStmt(stmt, 1));
    lines.push(fn.type === 'Function' ? 'fimfuncao' : 'fimprocedimento');
    lines.push('');
  }

  lines.push('inicio');
  for (const stmt of ast.body) lines.push(genPseudoStmt(stmt, 1));
  lines.push('fimalgoritmo');

  return lines.join('\n');
}

function genPseudoStmt(node: ASTNode, lvl: number): string {
  switch (node.type) {
    case 'Assignment':
      return `${indent(lvl)}${genPseudoExpr(node.target)} <- ${genPseudoExpr(node.value)}`;
    case 'VariableDeclaration':
      return node.initialValue
        ? `${indent(lvl)}${node.name} <- ${genPseudoExpr(node.initialValue)}`
        : '';
    case 'If': {
      let s = `${indent(lvl)}se ${genPseudoExpr(node.condition)} entao\n`;
      for (const st of node.thenBody) s += genPseudoStmt(st, lvl + 1) + '\n';
      if (node.elseBody && node.elseBody.length > 0) {
        s += `${indent(lvl)}senao\n`;
        for (const st of node.elseBody) s += genPseudoStmt(st, lvl + 1) + '\n';
      }
      s += `${indent(lvl)}fimse`;
      return s;
    }
    case 'While': {
      let s = `${indent(lvl)}enquanto ${genPseudoExpr(node.condition)} faca\n`;
      for (const st of node.body) s += genPseudoStmt(st, lvl + 1) + '\n';
      s += `${indent(lvl)}fimenquanto`;
      return s;
    }
    case 'For': {
      let s = `${indent(lvl)}para ${node.variable} de ${genPseudoExpr(node.start)} ate ${genPseudoExpr(node.end)} faca\n`;
      for (const st of node.body) s += genPseudoStmt(st, lvl + 1) + '\n';
      s += `${indent(lvl)}fimpara`;
      return s;
    }
    case 'RepeatUntil': {
      let s = `${indent(lvl)}repita\n`;
      for (const st of node.body) s += genPseudoStmt(st, lvl + 1) + '\n';
      s += `${indent(lvl)}ate ${genPseudoExpr(node.condition)}`;
      return s;
    }
    case 'DoWhile': {
      let s = `${indent(lvl)}repita\n`;
      for (const st of node.body) s += genPseudoStmt(st, lvl + 1) + '\n';
      s += `${indent(lvl)}ate nao (${genPseudoExpr(node.condition)})`;
      return s;
    }
    case 'Write': {
      const fn = node.newline ? 'escreval' : 'escreva';
      const args = node.args.map(a => genPseudoExpr(a)).join(', ');
      return `${indent(lvl)}${fn}(${args})`;
    }
    case 'Read':
      return `${indent(lvl)}leia(${node.variables.join(', ')})`;
    case 'Call':
      return node.args.length > 0
        ? `${indent(lvl)}${node.name}(${node.args.map(a => genPseudoExpr(a)).join(', ')})`
        : `${indent(lvl)}${node.name}()`;
    case 'Return':
      return node.value ? `${indent(lvl)}retorne ${genPseudoExpr(node.value)}` : `${indent(lvl)}retorne`;
    case 'Switch': {
      let s = `${indent(lvl)}escolha ${genPseudoExpr(node.expression)}\n`;
      for (const c of node.cases) {
        s += `${indent(lvl + 1)}caso ${genPseudoExpr(c.value)}\n`;
        for (const st of c.body) s += genPseudoStmt(st, lvl + 2) + '\n';
      }
      if (node.defaultBody) {
        s += `${indent(lvl + 1)}outrocaso\n`;
        for (const st of node.defaultBody) s += genPseudoStmt(st, lvl + 2) + '\n';
      }
      s += `${indent(lvl)}fimescolha`;
      return s;
    }
    default: return '';
  }
}

function genPseudoExpr(node: ASTNode): string {
  switch (node.type) {
    case 'Literal':
      if (node.dataType === 'string') return `"${node.value}"`;
      if (node.dataType === 'boolean') return node.value ? 'verdadeiro' : 'falso';
      return String(node.value);
    case 'Identifier': return mapIdentifierName(node.name, 'pseudocode');
    case 'ArrayAccess': return `${node.array}[${genPseudoExpr(node.index)}]`;
    case 'Binary': return `(${genPseudoExpr(node.left)} ${mapOp(node.operator, 'pseudocode')} ${genPseudoExpr(node.right)})`;
    case 'Unary': return `${mapOp(node.operator, 'pseudocode')} ${genPseudoExpr(node.operand)}`;
    case 'Call': return `${node.name}(${node.args.map(a => genPseudoExpr(a)).join(', ')})`;
    default: return '';
  }
}
