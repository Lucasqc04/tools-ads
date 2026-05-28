import type {
  ASTNode, Assignment, BinaryExpression, CallExpression, DataType,
  DoWhileNode, ForNode, FunctionNode, IdentifierNode, IfNode, LiteralNode,
  ProgramNode, ReadStatement, ReturnStatement, SwitchNode, Token,
  VariableDeclaration, WhileNode, WriteStatement,
} from './types';
import { tokenizeC } from './tokenizer';

export function parseC(source: string): ProgramNode {
  const tokens = tokenizeC(source).filter(t => t.type !== 'whitespace' && t.type !== 'newline' && t.type !== 'comment');
  let pos = 0;

  const peek = (): Token => tokens[pos] ?? { type: 'eof', value: '', line: 0, col: 0 };
  const advance = (): Token => tokens[pos++] ?? { type: 'eof', value: '', line: 0, col: 0 };
  const match = (val: string): boolean => {
    if (peek().value === val) { advance(); return true; }
    return false;
  };
  const expect = (val: string) => {
    if (peek().value === val) return advance();
    return { type: 'unknown', value: val, line: peek().line, col: peek().col } as Token;
  };
  const isAt = (val: string): boolean => peek().value === val;

  function nextValue(offset = 1): string {
    return tokens[pos + offset]?.value ?? '';
  }

  function isPrimitiveTypeToken(value: string): boolean {
    return ['int', 'float', 'double', 'char', 'void', 'long', 'short', 'unsigned', 'signed'].includes(value);
  }

  const isType = (): boolean => {
    const current = peek().value;
    if (isPrimitiveTypeToken(current)) return true;

    // Heuristic for custom types (typedef/struct aliases): MyType var; MyType *ptr;
    if (peek().type === 'identifier' && (nextValue() === '*' || tokens[pos + 1]?.type === 'identifier')) {
      return true;
    }
    return false;
  };

  function parseProgram(): ProgramNode {
    const prog: ProgramNode = { type: 'Program', body: [], functions: [], variables: [] };

    while (peek().type !== 'eof') {
      if (isAt('#')) { advance(); continue; } // skip remaining preprocessor

      if (!isType()) {
        advance();
        continue;
      }

      const { dataType, rawType } = parseCDataTypeInfo();

      let pointerDepth = 0;
      while (isAt('*')) {
        advance();
        pointerDepth++;
      }

      const nameToken = advance();
      const name = nameToken.value;
      if (!name || (nameToken.type !== 'identifier' && nameToken.type !== 'keyword')) {
        continue;
      }

      if (isAt('(') && pointerDepth === 0) {
        // Function definition
        const fn = parseFunctionDef(dataType, name);
        if (name === 'main') {
          prog.body = [...fn.localVars, ...fn.body];
        } else {
          prog.functions.push(fn);
        }
        continue;
      }

      const globals = parseVariableDeclarators(dataType, rawType, name, pointerDepth);
      prog.variables.push(...globals);
    }

    return prog;
  }

  function mapCTypeToken(token: string): DataType {
    const t = token.toLowerCase();
    switch (t) {
      case 'int': case 'long': case 'short': return 'integer';
      case 'float': case 'double': return 'real';
      case 'char': return 'char';
      case 'void': return 'void';
      default: return 'unknown';
    }
  }

  function parseCDataTypeInfo(): { dataType: DataType; rawType?: string } {
    const t = advance().value;
    return { dataType: mapCTypeToken(t), rawType: mapCTypeToken(t) === 'unknown' ? t : undefined };
  }

  function parseVariableDeclarators(
    dataType: DataType,
    rawType: string | undefined,
    firstName: string,
    firstPointerDepth = 0,
  ): VariableDeclaration[] {
    const vars: VariableDeclaration[] = [];

    const parseOne = (name: string, pointerDepth: number): VariableDeclaration => {
      let isArray = false;
      let arraySize: number | undefined;

      if (isAt('[')) {
        advance();
        if (peek().type === 'number') {
          arraySize = parseInt(advance().value, 10);
        } else {
          while (!isAt(']') && peek().type !== 'eof') advance();
        }
        expect(']');
        isArray = true;
      }

      const variable: VariableDeclaration = {
        type: 'VariableDeclaration',
        name,
        dataType,
      };

      if (isArray) {
        variable.arraySize = arraySize;
        variable.rawType = 'array';
      } else if (pointerDepth > 0) {
        variable.rawType = rawType ? `${rawType}*` : 'ptr';
      } else if (rawType) {
        variable.rawType = rawType;
      }

      if (match('=')) {
        variable.initialValue = parseExpression();
      }

      return variable;
    };

    vars.push(parseOne(firstName, firstPointerDepth));

    while (match(',')) {
      let pointerDepth = 0;
      while (isAt('*')) {
        advance();
        pointerDepth++;
      }

      const nameToken = advance();
      if (nameToken.type !== 'identifier' && nameToken.type !== 'keyword') break;
      vars.push(parseOne(nameToken.value, pointerDepth));
    }

    match(';');
    return vars;
  }

  function parseFunctionDef(returnType: DataType, name: string): FunctionNode {
    expect('(');
    const params: { name: string; dataType: DataType; rawType?: string; byRef?: boolean }[] = [];
    if (!isAt(')')) {
      do {
        if (!isType()) break;

        const pTypeInfo = parseCDataTypeInfo();
        let pointerDepth = 0;
        while (isAt('*')) {
          advance();
          pointerDepth++;
        }

        const pNameToken = advance();
        if (pNameToken.type !== 'identifier' && pNameToken.type !== 'keyword') break;
        const pName = pNameToken.value;

        if (isAt('[')) {
          advance();
          while (!isAt(']') && peek().type !== 'eof') advance();
          expect(']');
          params.push({ name: pName, dataType: pTypeInfo.dataType, rawType: 'array' });
        } else {
          params.push({
            name: pName,
            dataType: pTypeInfo.dataType,
            rawType: pointerDepth > 0 ? (pTypeInfo.rawType ? `${pTypeInfo.rawType}*` : 'ptr') : pTypeInfo.rawType,
            byRef: pointerDepth > 0,
          });
        }
      } while (match(','));
    }
    expect(')');

    const localVars: VariableDeclaration[] = [];
    const body = parseBlock(localVars);

    return { type: 'Function', name, params, returnType, body, localVars };
  }

  function parseBlock(localVars?: VariableDeclaration[]): ASTNode[] {
    expect('{');
    const stmts: ASTNode[] = [];
    while (!isAt('}') && peek().type !== 'eof') {
      if (!isType()) {
        const stmt = parseStatement();
        if (stmt) stmts.push(stmt);
        continue;
      }

      const { dataType, rawType } = parseCDataTypeInfo();
      let pointerDepth = 0;
      while (isAt('*')) {
        advance();
        pointerDepth++;
      }

      const nameToken = advance();
      if (nameToken.type !== 'identifier' && nameToken.type !== 'keyword') {
        continue;
      }

      const decls = parseVariableDeclarators(dataType, rawType, nameToken.value, pointerDepth);
      if (localVars) localVars.push(...decls);
      else stmts.push(...decls);
    }
    expect('}');
    return stmts;
  }

  function parseStatement(): ASTNode | null {
    const t = peek();

    if (t.value === 'if') return parseIf();
    if (t.value === 'while') return parseWhile();
    if (t.value === 'do') return parseDoWhile();
    if (t.value === 'for') return parseFor();
    if (t.value === 'switch') return parseSwitch();
    if (t.value === 'return') return parseReturn();
    if (t.value === 'break') { advance(); match(';'); return { type: 'Break' }; }
    if (t.value === '{') return { type: 'Block', body: parseBlock() };

    if (t.value === 'printf') return parsePrintf();
    if (t.value === 'scanf') return parseScanf();
    if (t.value === 'puts') return parsePuts();

    // Pointer assignment: *ptr = value;
    if (t.value === '*' && tokens[pos + 1]?.type === 'identifier') {
      advance(); // *
      const ptrName = advance().value;
      if (match('=')) {
        const value = parseExpression();
        match(';');
        return {
          type: 'Assignment',
          target: { type: 'Identifier', name: ptrName },
          value,
        } as Assignment;
      }
      match(';');
      return null;
    }

    if (t.type === 'identifier') {
      let name = advance().value;
      while ((isAt('->') || isAt('.')) && (tokens[pos + 1]?.type === 'identifier' || tokens[pos + 1]?.type === 'keyword')) {
        const op = advance().value;
        const field = advance().value;
        name += op === '->' ? `^.${field}` : `.${field}`;
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
        return { type: 'Call', name, args } as CallExpression;
      }
      if (isAt('[')) {
        advance();
        const index = parseExpression();
        expect(']');
        expect('=');
        const value = parseExpression();
        match(';');
        return { type: 'Assignment', target: { type: 'ArrayAccess', array: name, index }, value } as Assignment;
      }
      if (isAt('=')) {
        advance();
        const value = parseExpression();
        match(';');
        return { type: 'Assignment', target: { type: 'Identifier', name }, value } as Assignment;
      }
      if (isAt('++')) { advance(); match(';'); return { type: 'Assignment', target: { type: 'Identifier', name }, value: { type: 'Binary', operator: '+', left: { type: 'Identifier', name }, right: { type: 'Literal', value: 1, dataType: 'integer' } } } as Assignment; }
      if (isAt('--')) { advance(); match(';'); return { type: 'Assignment', target: { type: 'Identifier', name }, value: { type: 'Binary', operator: '-', left: { type: 'Identifier', name }, right: { type: 'Literal', value: 1, dataType: 'integer' } } } as Assignment; }
      if (isAt('+=') || isAt('-=') || isAt('*=') || isAt('/=')) {
        const op = advance().value[0];
        const value = parseExpression();
        match(';');
        return { type: 'Assignment', target: { type: 'Identifier', name }, value: { type: 'Binary', operator: op, left: { type: 'Identifier', name }, right: value } } as Assignment;
      }
      match(';');
      return { type: 'Call', name, args: [] } as CallExpression;
    }

    advance();
    return null;
  }

  function parseIf(): IfNode {
    advance(); // if
    expect('(');
    const condition = parseExpression();
    expect(')');

    let thenBody: ASTNode[];
    if (isAt('{')) {
      thenBody = parseBlock();
    } else {
      const stmt = parseStatement();
      thenBody = stmt ? [stmt] : [];
    }

    let elseBody: ASTNode[] | undefined;
    if (match('else')) {
      if (isAt('{')) {
        elseBody = parseBlock();
      } else {
        const stmt = parseStatement();
        elseBody = stmt ? [stmt] : [];
      }
    }

    return { type: 'If', condition, thenBody, elseBody };
  }

  function parseWhile(): WhileNode {
    advance(); // while
    expect('(');
    const condition = parseExpression();
    expect(')');

    let body: ASTNode[];
    if (isAt('{')) {
      body = parseBlock();
    } else {
      const stmt = parseStatement();
      body = stmt ? [stmt] : [];
    }

    return { type: 'While', condition, body };
  }

  function parseDoWhile(): DoWhileNode {
    advance(); // do
    const body = isAt('{') ? parseBlock() : (() => { const s = parseStatement(); return s ? [s] : []; })();
    expect('while');
    expect('(');
    const condition = parseExpression();
    expect(')');
    match(';');
    return { type: 'DoWhile', condition, body };
  }

  function parseFor(): ForNode {
    advance(); // for
    expect('(');

    // Init: variable = start
    let variable = '';
    if (isType()) {
      parseCDataTypeInfo();
      while (isAt('*')) advance();
    }
    variable = advance().value;
    expect('=');
    const start = parseExpression();
    expect(';');

    // Condition: variable < end (or <=, >, >=)
    advance(); // skip variable name in condition
    const compareOp = advance().value;
    const rawEnd = parseExpression();
    let end = rawEnd;
    if (compareOp === '<') {
      end = {
        type: 'Binary',
        operator: '-',
        left: rawEnd,
        right: { type: 'Literal', value: 1, dataType: 'integer' },
      } as BinaryExpression;
    } else if (compareOp === '>') {
      end = {
        type: 'Binary',
        operator: '+',
        left: rawEnd,
        right: { type: 'Literal', value: 1, dataType: 'integer' },
      } as BinaryExpression;
    }
    const ascending = compareOp === '<' || compareOp === '<=';
    expect(';');

    // Increment: skip
    while (!isAt(')') && peek().type !== 'eof') advance();
    expect(')');

    let body: ASTNode[];
    if (isAt('{')) {
      body = parseBlock();
    } else {
      const stmt = parseStatement();
      body = stmt ? [stmt] : [];
    }

    return { type: 'For', variable, start, end, ascending, body };
  }

  function parseSwitch(): SwitchNode {
    advance(); // switch
    expect('(');
    const expression = parseExpression();
    expect(')');
    expect('{');

    const cases: { value: ASTNode; body: ASTNode[] }[] = [];
    let defaultBody: ASTNode[] | undefined;

    while (!isAt('}') && peek().type !== 'eof') {
      if (match('case')) {
        const val = parseExpression();
        expect(':');
        const body: ASTNode[] = [];
        while (!isAt('case') && !isAt('default') && !isAt('}') && peek().type !== 'eof') {
          if (isAt('break')) { advance(); match(';'); break; }
          const stmt = parseStatement();
          if (stmt) body.push(stmt);
        }
        cases.push({ value: val, body });
      } else if (match('default')) {
        expect(':');
        defaultBody = [];
        while (!isAt('}') && peek().type !== 'eof') {
          if (isAt('break')) { advance(); match(';'); break; }
          const stmt = parseStatement();
          if (stmt) defaultBody.push(stmt);
        }
      } else {
        advance();
      }
    }
    expect('}');
    return { type: 'Switch', expression, cases, defaultBody };
  }

  function parseReturn(): ReturnStatement {
    advance(); // return
    if (isAt(';')) { advance(); return { type: 'Return' }; }
    const value = parseExpression();
    match(';');
    return { type: 'Return', value };
  }

  function parsePrintf(): WriteStatement {
    advance(); // printf
    expect('(');
    const args: ASTNode[] = [];
    if (!isAt(')')) {
      args.push(parseExpression());
      while (match(',')) args.push(parseExpression());
    }
    expect(')');
    match(';');

    // Detect newline in format string
    const firstArg = args[0];
    const hasNewline = firstArg?.type === 'Literal' && typeof firstArg.value === 'string' && firstArg.value.includes('\\n');
    if (firstArg?.type === 'Literal' && typeof firstArg.value === 'string' && firstArg.value.includes('%') && args.length > 1) {
      return { type: 'Write', args: args.slice(1), newline: hasNewline };
    }
    return { type: 'Write', args, newline: hasNewline };
  }

  function parseScanf(): ReadStatement {
    advance(); // scanf
    expect('(');
    const variables: string[] = [];
    // Skip format string
    if (peek().type === 'string') advance();
    while (match(',')) {
      if (isAt('&')) advance();
      if (peek().type === 'identifier') {
        const name = advance().value;
        if (isAt('[')) {
          advance();
          const index = parseExpression();
          expect(']');
          variables.push(`${name}[${exprToText(index)}]`);
        } else {
          variables.push(name);
        }
      }
    }
    expect(')');
    match(';');
    return { type: 'Read', variables };
  }

  function parsePuts(): WriteStatement {
    advance(); // puts
    expect('(');
    const args: ASTNode[] = [];
    if (!isAt(')')) args.push(parseExpression());
    expect(')');
    match(';');
    return { type: 'Write', args, newline: true };
  }

  function parseExpression(): ASTNode {
    return parseOr();
  }

  function exprToText(node: ASTNode): string {
    switch (node.type) {
      case 'Literal':
        return String(node.value);
      case 'Identifier':
        return node.name;
      case 'ArrayAccess':
        return `${node.array}[${exprToText(node.index)}]`;
      case 'Binary':
        return `${exprToText(node.left)} ${node.operator} ${exprToText(node.right)}`;
      case 'Unary':
        return `${node.operator}${exprToText(node.operand)}`;
      case 'Call':
        return `${node.name}(${node.args.map(exprToText).join(', ')})`;
      default:
        return '0';
    }
  }

  function parseOr(): ASTNode {
    let left = parseAnd();
    while (isAt('||')) {
      advance();
      left = { type: 'Binary', operator: 'or', left, right: parseAnd() } as BinaryExpression;
    }
    return left;
  }

  function parseAnd(): ASTNode {
    let left = parseComparison();
    while (isAt('&&')) {
      advance();
      left = { type: 'Binary', operator: 'and', left, right: parseComparison() } as BinaryExpression;
    }
    return left;
  }

  function parseComparison(): ASTNode {
    let left = parseAddition();
    while (['==', '!=', '<', '>', '<=', '>='].includes(peek().value)) {
      const op = advance().value;
      const mappedOp = op === '==' ? '=' : op === '!=' ? '<>' : op;
      left = { type: 'Binary', operator: mappedOp, left, right: parseAddition() } as BinaryExpression;
    }
    return left;
  }

  function parseAddition(): ASTNode {
    let left = parseMultiplication();
    while (['+', '-'].includes(peek().value)) {
      const op = advance().value;
      left = { type: 'Binary', operator: op, left, right: parseMultiplication() } as BinaryExpression;
    }
    return left;
  }

  function parseMultiplication(): ASTNode {
    let left = parseUnary();
    while (['*', '/', '%'].includes(peek().value)) {
      const rawOp = advance().value;
      const op = rawOp === '%' ? 'mod' : rawOp;
      left = { type: 'Binary', operator: op, left, right: parseUnary() } as BinaryExpression;
    }
    return left;
  }

  function parseUnary(): ASTNode {
    if (isAt('!')) { advance(); return { type: 'Unary', operator: 'not', operand: parseUnary() }; }
    if (isAt('++') || isAt('--')) {
      const op = advance().value;
      const operand = parseUnary();
      if (operand.type === 'Identifier') {
        return {
          type: 'Binary',
          operator: op === '++' ? '+' : '-',
          left: operand,
          right: { type: 'Literal', value: 1, dataType: 'integer' },
        } as BinaryExpression;
      }
      return operand;
    }
    if (isAt('&')) { advance(); return parseUnary(); }
    if (isAt('*')) {
      advance();
      return parseUnary();
    }
    if (isAt('-')) { advance(); return { type: 'Unary', operator: '-', operand: parsePrimary() }; }
    return parsePrimary();
  }

  function parsePrimary(): ASTNode {
    const t = peek();

    if (t.type === 'number') {
      advance();
      const isReal = t.value.includes('.');
      return { type: 'Literal', value: isReal ? parseFloat(t.value) : parseInt(t.value), dataType: isReal ? 'real' : 'integer' } as LiteralNode;
    }

    if (t.type === 'string') {
      advance();
      return { type: 'Literal', value: t.value.slice(1, -1), dataType: 'string' } as LiteralNode;
    }

    if (t.value === 'true' || t.value === 'false') {
      advance();
      return { type: 'Literal', value: t.value === 'true', dataType: 'boolean' } as LiteralNode;
    }

    if (t.value === '(') {
      // C-style cast: (Tipo*)expr
      if (
        (tokens[pos + 1]?.type === 'identifier' || tokens[pos + 1]?.type === 'keyword') &&
        (tokens[pos + 2]?.value === ')' || tokens[pos + 2]?.value === '*')
      ) {
        advance(); // (
        advance(); // type token
        while (isAt('*')) advance();
        match(')');
        return parsePrimary();
      }
      advance();
      const expr = parseExpression();
      expect(')');
      return expr;
    }

    if (t.type === 'identifier') {
      let name = advance().value;
      while ((isAt('->') || isAt('.')) && (tokens[pos + 1]?.type === 'identifier' || tokens[pos + 1]?.type === 'keyword')) {
        const op = advance().value;
        const field = advance().value;
        name += op === '->' ? `^.${field}` : `.${field}`;
      }
      if (isAt('(')) {
        advance();
        const args: ASTNode[] = [];
        if (!isAt(')')) {
          args.push(parseExpression());
          while (match(',')) args.push(parseExpression());
        }
        expect(')');
        return { type: 'Call', name, args } as CallExpression;
      }
      if (isAt('[')) {
        advance();
        const index = parseExpression();
        expect(']');
        if (isAt('++') || isAt('--')) advance();
        return { type: 'ArrayAccess', array: name, index };
      }
      if (isAt('++') || isAt('--')) advance();
      return { type: 'Identifier', name } as IdentifierNode;
    }

    advance();
    return { type: 'Literal', value: 0, dataType: 'integer' } as LiteralNode;
  }

  return parseProgram();
}
