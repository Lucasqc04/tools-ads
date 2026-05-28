import type {
  ASTNode, Assignment, BinaryExpression, CallExpression, DataType,
  ForNode, FunctionNode, IdentifierNode, IfNode, LiteralNode,
  ParameterDefinition, ProcedureNode, ProgramNode, ReadStatement, RepeatUntilNode,
  ReturnStatement, SwitchNode, Token, VariableDeclaration, WhileNode, WriteStatement,
} from './types';
import { tokenizePascal } from './tokenizer';

export function parsePascal(source: string): ProgramNode {
  const tokens = tokenizePascal(source).filter(t => t.type !== 'whitespace' && t.type !== 'newline' && t.type !== 'comment');
  let pos = 0;
  let currentFunctionName: string | null = null;

  const peek = (): Token => tokens[pos] ?? { type: 'eof', value: '', line: 0, col: 0 };
  const advance = (): Token => tokens[pos++] ?? { type: 'eof', value: '', line: 0, col: 0 };
  const expect = (val: string) => {
    const t = advance();
    if (t.value.toLowerCase() !== val.toLowerCase()) {
      throw new Error(`Expected '${val}' but got '${t.value}' at line ${t.line}`);
    }
    return t;
  };
  const match = (val: string): boolean => {
    if (peek().value.toLowerCase() === val.toLowerCase()) {
      advance();
      return true;
    }
    return false;
  };
  const isAt = (val: string): boolean => peek().value.toLowerCase() === val.toLowerCase();

  const topLevelStops = new Set(['begin', 'var', 'function', 'procedure', 'type', 'const', 'eof']);

  function expectIdentifier(context: string): string {
    const t = advance();
    if (t.type !== 'identifier' && t.type !== 'keyword') {
      throw new Error(`Expected ${context} but got '${t.value}' at line ${t.line}`);
    }
    return t.value;
  }

  function mapTypeToken(token: string): DataType {
    switch (token.toLowerCase()) {
      case 'integer': return 'integer';
      case 'real': return 'real';
      case 'char': return 'char';
      case 'boolean': return 'boolean';
      case 'string': return 'string';
      default: return 'unknown';
    }
  }

  function parseDataTypeInfo(stopTokens: string[] = [';']): { dataType: DataType; rawType?: string } {
    let detected: DataType = 'unknown';
    let rawType: string | undefined;
    let bracketDepth = 0;
    let parenDepth = 0;
    const parts: string[] = [];

    while (peek().type !== 'eof') {
      const lower = peek().value.toLowerCase();
      if (bracketDepth === 0 && parenDepth === 0 && stopTokens.includes(lower)) {
        break;
      }

      const tokenValue = advance().value;
      const t = tokenValue.toLowerCase();
      parts.push(tokenValue);
      if (t === '[') bracketDepth++;
      if (t === ']') bracketDepth = Math.max(0, bracketDepth - 1);
      if (t === '(') parenDepth++;
      if (t === ')') parenDepth = Math.max(0, parenDepth - 1);

      const mapped = mapTypeToken(t);
      if (mapped !== 'unknown') {
        detected = mapped;
      }

      if (!rawType && mapped === 'unknown' && /^[a-z_][a-z0-9_]*$/i.test(tokenValue)) {
        rawType = tokenValue;
      }
    }

    if (!rawType && parts.length > 0) {
      rawType = parts.join(' ');
    }

    return { dataType: detected, rawType };
  }

  function skipSectionUntilSemicolonOrTopLevel(): void {
    while (peek().type !== 'eof') {
      if (match(';')) return;
      if (topLevelStops.has(peek().value.toLowerCase())) return;
      advance();
    }
  }

  function skipTypeSection(): void {
    expect('type');
    while (peek().type !== 'eof') {
      const lower = peek().value.toLowerCase();
      if (['var', 'function', 'procedure', 'begin', 'const'].includes(lower)) return;
      if (peek().type === 'identifier' || peek().type === 'keyword') {
        advance();
        if (match('=')) {
          skipSectionUntilSemicolonOrTopLevel();
        }
        continue;
      }
      advance();
    }
  }

  function inferDataTypeFromValue(value: ASTNode): DataType {
    if (value.type === 'Literal') return value.dataType;
    if (value.type === 'Unary') return inferDataTypeFromValue(value.operand);
    if (value.type === 'Binary') {
      const leftType = inferDataTypeFromValue(value.left);
      const rightType = inferDataTypeFromValue(value.right);
      if (leftType === 'real' || rightType === 'real') return 'real';
      if (leftType === 'string' || rightType === 'string') return 'string';
      return 'integer';
    }
    return 'integer';
  }

  function parseConstSection(targetVars: VariableDeclaration[]): void {
    expect('const');
    while (peek().type !== 'eof') {
      const lower = peek().value.toLowerCase();
      if (['var', 'function', 'procedure', 'begin', 'type'].includes(lower)) return;
      if (peek().type === 'identifier' || peek().type === 'keyword') {
        const name = advance().value;
        if (match('=')) {
          const initialValue = parseExpression();
          targetVars.push({
            type: 'VariableDeclaration',
            name,
            dataType: inferDataTypeFromValue(initialValue),
            rawType: 'const',
            initialValue,
          });
          match(';');
        } else {
          skipSectionUntilSemicolonOrTopLevel();
        }
        continue;
      }
      advance();
    }
  }

  function parseProgram(): ProgramNode {
    const prog: ProgramNode = { type: 'Program', body: [], functions: [], variables: [] };

    if (isAt('program')) {
      advance();
      prog.name = expectIdentifier('program name');
      match(';');
    }

    while (peek().type !== 'eof') {
      if (isAt('var')) {
        advance();
        while (peek().type === 'identifier') {
          prog.variables.push(...parseVarBlock());
        }
        continue;
      }
      if (isAt('type')) {
        skipTypeSection();
        continue;
      }
      if (isAt('const')) {
        parseConstSection(prog.variables);
        continue;
      }
      if (isAt('function')) {
        prog.functions.push(parseFunction());
        continue;
      }
      if (isAt('procedure')) {
        prog.functions.push(parseProcedure());
        continue;
      }
      break;
    }

    if (isAt('begin')) {
      advance();
      prog.body = parseStatements(['end']);
      expect('end');
      match('.');
      return prog;
    }

    // Support loose Pascal snippets (e.g., only statements, only loops, etc.)
    if (peek().type !== 'eof') {
      prog.body = parseStatements(['end']);
      if (isAt('end')) {
        advance();
        match('.');
      }
    }

    return prog;
  }

  function parseVarBlock(): VariableDeclaration[] {
    const vars: VariableDeclaration[] = [];
    const names: string[] = [];

    names.push(expectIdentifier('variable name'));
    while (match(',')) {
      names.push(expectIdentifier('variable name'));
    }

    expect(':');
    const typeInfo = parseDataTypeInfo([';']);
    match(';');

    for (const name of names) {
      vars.push({ type: 'VariableDeclaration', name, dataType: typeInfo.dataType, rawType: typeInfo.rawType });
    }

    return vars;
  }

  function parseLocalVarBlocks(): VariableDeclaration[] {
    const localVars: VariableDeclaration[] = [];
    while (isAt('var')) {
      advance();
      while (peek().type === 'identifier') {
        localVars.push(...parseVarBlock());
      }
    }
    return localVars;
  }

  function parseFunction(): FunctionNode {
    expect('function');
    const name = expectIdentifier('function name');
    const params = parseParams();
    expect(':');
    const returnType = parseDataTypeInfo([';']).dataType;
    match(';');

    const localVars = parseLocalVarBlocks();

    let body: ASTNode[] = [];
    if (isAt('begin')) {
      advance();
      const previous = currentFunctionName;
      currentFunctionName = name;
      body = parseStatements(['end']);
      currentFunctionName = previous;
      expect('end');
      match(';');
    }

    return { type: 'Function', name, params, returnType, body, localVars };
  }

  function parseProcedure(): ProcedureNode {
    expect('procedure');
    const name = expectIdentifier('procedure name');
    const params = parseParams();
    match(';');

    const localVars = parseLocalVarBlocks();

    let body: ASTNode[] = [];
    if (isAt('begin')) {
      advance();
      body = parseStatements(['end']);
      expect('end');
      match(';');
    }

    return { type: 'Procedure', name, params, body, localVars };
  }

  function parseParams(): ParameterDefinition[] {
    const params: ParameterDefinition[] = [];
    if (!match('(')) return params;
    if (isAt(')')) {
      advance();
      return params;
    }

    while (!isAt(')') && peek().type !== 'eof') {
      let byRef = false;
      while (isAt('var') || isAt('const') || isAt('out')) {
        byRef = byRef || isAt('var') || isAt('out');
        advance();
      }

      const names: string[] = [expectIdentifier('parameter name')];
      while (match(',')) {
        names.push(expectIdentifier('parameter name'));
      }

      expect(':');
      const pType = parseDataTypeInfo([';', ')']);

      for (const pName of names) {
        params.push({
          name: pName,
          dataType: pType.dataType,
          rawType: pType.rawType,
          byRef,
        });
      }

      if (!match(';')) {
        break;
      }
    }

    expect(')');
    return params;
  }

  function parseStatements(endTokens: string[]): ASTNode[] {
    const stmts: ASTNode[] = [];
    while (peek().type !== 'eof' && !endTokens.includes(peek().value.toLowerCase())) {
      const stmt = parseStatement();
      if (stmt) {
        stmts.push(stmt);
      }
    }
    return stmts;
  }

  function inlineExpr(node: ASTNode): string {
    switch (node.type) {
      case 'Literal':
        if (node.dataType === 'string') return `'${node.value}'`;
        if (node.dataType === 'boolean') return node.value ? 'true' : 'false';
        return String(node.value);
      case 'Identifier':
        return node.name;
      case 'ArrayAccess':
        return `${node.array}[${inlineExpr(node.index)}]`;
      case 'Binary':
        return `${inlineExpr(node.left)} ${node.operator} ${inlineExpr(node.right)}`;
      case 'Unary':
        return `${node.operator}${inlineExpr(node.operand)}`;
      case 'Call':
        return `${node.name}(${node.args.map(a => inlineExpr(a)).join(', ')})`;
      default:
        return '';
    }
  }

  function parseDesignatorFrom(name: string): { target: IdentifierNode | { type: 'ArrayAccess'; array: string; index: ASTNode }; displayName: string } {
    let displayName = name;
    let target: IdentifierNode | { type: 'ArrayAccess'; array: string; index: ASTNode } = { type: 'Identifier', name };
    let hasComplexSuffix = false;

    while (true) {
      if (isAt('^')) {
        advance();
        displayName += '^';
        hasComplexSuffix = true;
        target = { type: 'Identifier', name: displayName };
        continue;
      }

      if (isAt('.')) {
        advance();
        const field = expectIdentifier('field name');
        displayName += `.${field}`;
        hasComplexSuffix = true;
        target = { type: 'Identifier', name: displayName };
        continue;
      }

      if (isAt('[')) {
        advance();
        const index = parseExpression();
        expect(']');

        if (!hasComplexSuffix && target.type === 'Identifier' && target.name === name) {
          target = { type: 'ArrayAccess', array: name, index };
        } else {
          displayName += `[${inlineExpr(index)}]`;
          target = { type: 'Identifier', name: displayName };
        }

        continue;
      }

      break;
    }

    return {
      target,
      displayName: target.type === 'Identifier' ? target.name : displayName,
    };
  }

  function parseStatement(): ASTNode | null {
    const t = peek();
    const lower = t.value.toLowerCase();

    if (lower === 'if') return parseIf();
    if (lower === 'while') return parseWhile();
    if (lower === 'for') return parseFor();
    if (lower === 'repeat') return parseRepeat();
    if (lower === 'case') return parseCase();
    if (lower === 'writeln' || lower === 'write') return parseWrite();
    if (lower === 'readln' || lower === 'read') return parseRead();

    if (lower === 'exit') {
      advance();
      let value: ASTNode | undefined;
      if (match('(')) {
        if (!isAt(')')) {
          value = parseExpression();
        }
        expect(')');
      }
      match(';');
      return { type: 'Return', value } as ReturnStatement;
    }

    if (lower === 'begin') {
      advance();
      const body = parseStatements(['end']);
      expect('end');
      match(';');
      return { type: 'Block', body };
    }

    if (t.type === 'identifier' || t.type === 'keyword') {
      const name = advance().value;
      const designator = parseDesignatorFrom(name);

      if (isAt(':=') || isAt('=')) {
        advance();
        const value = parseExpression();
        match(';');

        if (
          currentFunctionName &&
          designator.target.type === 'Identifier' &&
          designator.target.name.toLowerCase() === currentFunctionName.toLowerCase()
        ) {
          return { type: 'Return', value } as ReturnStatement;
        }

        return {
          type: 'Assignment',
          target: designator.target,
          value,
        } as Assignment;
      }

      if (isAt('(')) {
        advance();
        const args: ASTNode[] = [];
        if (!isAt(')')) {
          args.push(parseExpression());
          while (match(',')) args.push(parseExpression());
        }
        expect(')');
        match(';');
        return { type: 'Call', name: designator.displayName, args } as CallExpression;
      }

      match(';');
      return { type: 'Call', name: designator.displayName, args: [] } as CallExpression;
    }

    advance();
    return null;
  }

  function parseIf(): IfNode {
    expect('if');
    const condition = parseExpression();
    expect('then');

    let thenBody: ASTNode[];
    if (isAt('begin')) {
      advance();
      thenBody = parseStatements(['end']);
      expect('end');
      match(';');
    } else {
      const stmt = parseStatement();
      thenBody = stmt ? [stmt] : [];
    }

    let elseBody: ASTNode[] | undefined;
    if (isAt('else')) {
      advance();
      if (isAt('begin')) {
        advance();
        elseBody = parseStatements(['end']);
        expect('end');
        match(';');
      } else {
        const stmt = parseStatement();
        elseBody = stmt ? [stmt] : [];
      }
    }

    return { type: 'If', condition, thenBody, elseBody };
  }

  function parseWhile(): WhileNode {
    expect('while');
    const condition = parseExpression();
    expect('do');

    let body: ASTNode[];
    if (isAt('begin')) {
      advance();
      body = parseStatements(['end']);
      expect('end');
      match(';');
    } else {
      const stmt = parseStatement();
      body = stmt ? [stmt] : [];
    }

    return { type: 'While', condition, body };
  }

  function parseFor(): ForNode {
    expect('for');
    const variable = expectIdentifier('for variable');
    expect(':=');
    const start = parseExpression();

    let ascending = true;
    if (isAt('to')) {
      advance();
      ascending = true;
    } else if (isAt('downto')) {
      advance();
      ascending = false;
    }

    const end = parseExpression();
    expect('do');

    let body: ASTNode[];
    if (isAt('begin')) {
      advance();
      body = parseStatements(['end']);
      expect('end');
      match(';');
    } else {
      const stmt = parseStatement();
      body = stmt ? [stmt] : [];
    }

    return { type: 'For', variable, start, end, ascending, body };
  }

  function parseRepeat(): RepeatUntilNode {
    expect('repeat');
    const body = parseStatements(['until']);
    expect('until');
    const condition = parseExpression();
    match(';');
    return { type: 'RepeatUntil', condition, body };
  }

  function parseCase(): SwitchNode {
    expect('case');
    const expression = parseExpression();
    expect('of');
    const cases: { value: ASTNode; body: ASTNode[] }[] = [];
    let defaultBody: ASTNode[] | undefined;

    while (!isAt('end') && peek().type !== 'eof') {
      if (isAt('else')) {
        advance();
        defaultBody = parseStatements(['end']);
        break;
      }

      const val = parseExpression();
      expect(':');

      let body: ASTNode[];
      if (isAt('begin')) {
        advance();
        body = parseStatements(['end']);
        expect('end');
      } else {
        const stmt = parseStatement();
        body = stmt ? [stmt] : [];
      }

      match(';');
      cases.push({ value: val, body });
    }

    expect('end');
    match(';');

    return { type: 'Switch', expression, cases, defaultBody };
  }

  function parseWrite(): WriteStatement {
    const isLn = peek().value.toLowerCase() === 'writeln';
    advance();

    const args: ASTNode[] = [];
    if (match('(')) {
      if (!isAt(')')) {
        args.push(parseExpression());
        while (match(',')) args.push(parseExpression());
      }
      expect(')');
    }

    match(';');
    return { type: 'Write', args, newline: isLn };
  }

  function parseRead(): ReadStatement {
    advance();
    const variables: string[] = [];

    if (match('(')) {
      while (!isAt(')') && peek().type !== 'eof') {
        if (peek().type === 'identifier' || peek().type === 'keyword') {
          const base = advance().value;
          const designator = parseDesignatorFrom(base);
          variables.push(designator.displayName);
        } else {
          advance();
        }

        if (!match(',')) break;
      }
      expect(')');
    }

    match(';');
    return { type: 'Read', variables };
  }

  function parseExpression(): ASTNode {
    return parseOr();
  }

  function parseOr(): ASTNode {
    let left = parseAnd();
    while (isAt('or')) {
      advance();
      const right = parseAnd();
      left = { type: 'Binary', operator: 'or', left, right } as BinaryExpression;
    }
    return left;
  }

  function parseAnd(): ASTNode {
    let left = parseComparison();
    while (isAt('and')) {
      advance();
      const right = parseComparison();
      left = { type: 'Binary', operator: 'and', left, right } as BinaryExpression;
    }
    return left;
  }

  function parseComparison(): ASTNode {
    let left = parseAddition();
    while (['=', '<>', '<', '>', '<=', '>='].includes(peek().value)) {
      const op = advance().value;
      const right = parseAddition();
      left = { type: 'Binary', operator: op, left, right } as BinaryExpression;
    }
    return left;
  }

  function parseAddition(): ASTNode {
    let left = parseMultiplication();
    while (['+', '-'].includes(peek().value)) {
      const op = advance().value;
      const right = parseMultiplication();
      left = { type: 'Binary', operator: op, left, right } as BinaryExpression;
    }
    return left;
  }

  function parseMultiplication(): ASTNode {
    let left = parseUnary();
    while (['*', '/', 'mod', 'div'].includes(peek().value.toLowerCase())) {
      const op = advance().value.toLowerCase();
      const right = parseUnary();
      left = { type: 'Binary', operator: op, left, right } as BinaryExpression;
    }
    return left;
  }

  function parseUnary(): ASTNode {
    if (isAt('not') || isAt('-') || isAt('+')) {
      const op = advance().value;
      const operand = parseUnary();
      return { type: 'Unary', operator: op, operand };
    }
    return parsePrimary();
  }

  function parsePrimary(): ASTNode {
    const t = peek();

    if (t.type === 'number') {
      advance();
      const isReal = t.value.includes('.');
      return {
        type: 'Literal',
        value: isReal ? parseFloat(t.value) : parseInt(t.value, 10),
        dataType: isReal ? 'real' : 'integer',
      } as LiteralNode;
    }

    if (t.type === 'string') {
      advance();
      return { type: 'Literal', value: t.value.slice(1, -1), dataType: 'string' } as LiteralNode;
    }

    const lower = t.value.toLowerCase();
    if (lower === 'true' || lower === 'false') {
      advance();
      return { type: 'Literal', value: lower === 'true', dataType: 'boolean' } as LiteralNode;
    }

    if (lower === 'nil') {
      advance();
      return { type: 'Identifier', name: 'nil' } as IdentifierNode;
    }

    if (t.value === '(') {
      advance();
      const expr = parseExpression();
      expect(')');
      return expr;
    }

    if (t.type === 'identifier' || t.type === 'keyword') {
      const name = advance().value;
      const designator = parseDesignatorFrom(name);

      if (isAt('(')) {
        advance();
        const args: ASTNode[] = [];
        if (!isAt(')')) {
          args.push(parseExpression());
          while (match(',')) args.push(parseExpression());
        }
        expect(')');
        return { type: 'Call', name: designator.displayName, args } as CallExpression;
      }

      return designator.target as ASTNode;
    }

    advance();
    return { type: 'Literal', value: 0, dataType: 'integer' } as LiteralNode;
  }

  return parseProgram();
}
