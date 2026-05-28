import type {
  ASTNode, Assignment, BinaryExpression, CallExpression, DataType,
  DoWhileNode, ForNode, FunctionNode, IdentifierNode, IfNode, LiteralNode,
  ProgramNode, ReadStatement, ReturnStatement, SwitchNode, Token,
  VariableDeclaration, WhileNode, WriteStatement,
} from './types';
import { tokenizeJava } from './tokenizer';

export function parseJava(source: string): ProgramNode {
  const tokens = tokenizeJava(source).filter(t => t.type !== 'whitespace' && t.type !== 'newline' && t.type !== 'comment');
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
  const isBuiltinType = (value: string): boolean => ['int', 'float', 'double', 'char', 'boolean', 'void', 'long', 'short', 'byte', 'String', 'Scanner'].includes(value);
  const isType = (): boolean => {
    if (isBuiltinType(peek().value)) return true;
    // Heuristic for custom class types: ClasseNome var; ClasseNome[] arr;
    if (peek().type === 'identifier' && tokens[pos + 1]?.type === 'identifier') return true;
    if (
      peek().type === 'identifier' &&
      tokens[pos + 1]?.value === '[' &&
      tokens[pos + 2]?.value === ']' &&
      (tokens[pos + 3]?.type === 'identifier' || tokens[pos + 3]?.type === 'keyword')
    ) return true;
    return false;
  };
  const isModifier = (): boolean => ['public', 'private', 'protected', 'static', 'final', 'abstract'].includes(peek().value);

  function skipBalancedBlock(): void {
    if (!isAt('{')) return;
    let depth = 0;
    while (peek().type !== 'eof') {
      if (isAt('{')) {
        advance();
        depth++;
        continue;
      }
      if (isAt('}')) {
        advance();
        depth--;
        if (depth <= 0) break;
        continue;
      }
      advance();
    }
  }

  function consumeBraceInitializer(): void {
    if (!isAt('{')) return;
    let depth = 0;
    while (peek().type !== 'eof') {
      if (isAt('{')) {
        advance();
        depth++;
        continue;
      }
      if (isAt('}')) {
        advance();
        depth--;
        if (depth <= 0) break;
        continue;
      }
      advance();
    }
  }

  function parseProgram(): ProgramNode {
    const prog: ProgramNode = { type: 'Program', body: [], functions: [], variables: [] };

    // Skip imports/package
    while (isAt('import') || isAt('package')) {
      while (!isAt(';') && peek().type !== 'eof') advance();
      match(';');
    }

    // Skip class declaration
    while (isModifier()) advance();
    if (isAt('class')) {
      advance(); // class
      advance(); // ClassName
      if (isAt('extends')) { advance(); advance(); }
      if (isAt('implements')) { advance(); advance(); }
      expect('{');

      // Parse class body
      while (!isAt('}') && peek().type !== 'eof') {
        while (isModifier()) advance();

        if (isAt('class')) {
          advance();
          if (peek().type === 'identifier' || peek().type === 'keyword') advance();
          if (isAt('extends')) { advance(); advance(); }
          if (isAt('implements')) {
            advance();
            while (!isAt('{') && peek().type !== 'eof') advance();
          }
          skipBalancedBlock();
          continue;
        }

        if (isType()) {
          const dtInfo = parseJavaDataType();
          const dt = dtInfo.dataType;
          const name = advance().value;

          if (isAt('(')) {
            // Method
            const fn = parseMethodDef(dt, name);
            if (name === 'main') {
              prog.body = [...fn.localVars, ...fn.body];
            } else {
              prog.functions.push(fn);
            }
          } else {
            // Field(s)
            const decls: VariableDeclaration[] = [];
            const parseOneFieldDecl = (fieldName: string) => {
              const varDecl: VariableDeclaration = { type: 'VariableDeclaration', name: fieldName, dataType: dt, rawType: dtInfo.isArray ? 'array' : dtInfo.rawType };
              if (isAt('[')) {
                advance();
                if (peek().type === 'number') varDecl.arraySize = parseInt(advance().value, 10);
                while (!isAt(']') && peek().type !== 'eof') advance();
                match(']');
                varDecl.rawType = 'array';
              }
              if (match('=')) {
                if (isAt('{')) {
                  consumeBraceInitializer();
                } else {
                  varDecl.initialValue = parseExpression();
                }
              }
              if (dtInfo.rawType !== 'Scanner') decls.push(varDecl);
            };

            parseOneFieldDecl(name);
            while (match(',')) {
              if (peek().type === 'identifier' || peek().type === 'keyword') {
                parseOneFieldDecl(advance().value);
              }
            }
            match(';');
            prog.variables.push(...decls);
          }
        } else {
          advance();
        }
      }
      match('}');
    }

    return prog;
  }

  function parseJavaDataType(): { dataType: DataType; isArray: boolean; rawType?: string } {
    const t = advance().value;
    let isArray = false;
    // Skip [] for arrays
    if (isAt('[')) { advance(); match(']'); isArray = true; }
    switch (t) {
      case 'int': case 'long': case 'short': case 'byte': return { dataType: 'integer', isArray, rawType: t };
      case 'float': case 'double': return { dataType: 'real', isArray, rawType: t };
      case 'char': return { dataType: 'char', isArray, rawType: t };
      case 'boolean': return { dataType: 'boolean', isArray, rawType: t };
      case 'String': return { dataType: 'string', isArray, rawType: t };
      case 'Scanner': return { dataType: 'unknown', isArray, rawType: t };
      case 'void': return { dataType: 'void', isArray, rawType: t };
      default: return { dataType: 'unknown', isArray, rawType: t };
    }
  }

  function parseMethodDef(returnType: DataType, name: string): FunctionNode {
    expect('(');
    const params: { name: string; dataType: DataType; rawType?: string; byRef?: boolean }[] = [];
    if (!isAt(')')) {
      do {
        // Skip String[] args for main
        if (peek().value === 'String' && tokens[pos + 1]?.value === '[') {
          advance(); advance(); advance(); // String[]
          const pName = advance().value; // args
          params.push({ name: pName, dataType: 'string' });
        } else if (isType()) {
          const pType = parseJavaDataType();
          const pName = advance().value;
          const isNodeRefArray = pType.isArray && pType.rawType && !['int', 'long', 'short', 'byte', 'float', 'double', 'char', 'boolean', 'String'].includes(pType.rawType);
          const isRefWrapper = !!pType.rawType && /Ref$/i.test(pType.rawType);
          params.push({
            name: pName,
            dataType: isRefWrapper ? 'integer' : pType.dataType,
            rawType: pType.isArray ? (isNodeRefArray ? pType.rawType : 'array') : pType.rawType,
            byRef: isNodeRefArray || isRefWrapper,
          });
        } else break;
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
      if (isType()) {
        const dtInfo = parseJavaDataType();
        const dt = dtInfo.dataType;
        const decls: VariableDeclaration[] = [];

        const parseOneDecl = (name: string) => {
          const varDecl: VariableDeclaration = { type: 'VariableDeclaration', name, dataType: dt, rawType: dtInfo.isArray ? 'array' : dtInfo.rawType };
          if (isAt('[')) {
            advance();
            if (peek().type === 'number') varDecl.arraySize = parseInt(advance().value, 10);
            while (!isAt(']') && peek().type !== 'eof') advance();
            match(']');
            varDecl.rawType = 'array';
          }
          if (match('=')) {
            if (isAt('{')) {
              consumeBraceInitializer();
            } else {
              varDecl.initialValue = parseExpression();
            }
          }
          if (dtInfo.rawType !== 'Scanner') decls.push(varDecl);
        };

        if (peek().type === 'identifier' || peek().type === 'keyword') {
          parseOneDecl(advance().value);
        }

        while (match(',')) {
          if (peek().type === 'identifier' || peek().type === 'keyword') {
            parseOneDecl(advance().value);
          }
        }

        match(';');

        if (localVars) localVars.push(...decls);
        else stmts.push(...decls);
      } else {
        const stmt = parseStatement();
        if (stmt) stmts.push(stmt);
      }
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

    // System.out.println / System.out.print
    if (t.value === 'System') {
      return parseSystemOut();
    }

    // Scanner input
    if (t.type === 'identifier' && tokens[pos + 1]?.value === '.') {
      const scannerName = peek().value;
      // Check if it's scanner.nextXxx()
      if (tokens[pos + 1]?.value === '.' && ['nextInt', 'nextDouble', 'nextLine', 'next'].includes(tokens[pos + 2]?.value ?? '')) {
        // This is likely an assignment target — handled below
      }
    }

    if (t.type === 'identifier') {
      const name = advance().value;

      // Scanner assignment: var = scanner.nextInt()
      if (isAt('=')) {
        advance();
        const value = parseExpression();
        match(';');

        // Detect scanner read
        if (value.type === 'Call' && ['nextInt', 'nextDouble', 'nextLine', 'next'].includes(value.name)) {
          return { type: 'Read', variables: [name] } as ReadStatement;
        }
        return { type: 'Assignment', target: { type: 'Identifier', name }, value } as Assignment;
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

      if (isAt('++')) { advance(); match(';'); return { type: 'Assignment', target: { type: 'Identifier', name }, value: { type: 'Binary', operator: '+', left: { type: 'Identifier', name }, right: { type: 'Literal', value: 1, dataType: 'integer' } } } as Assignment; }
      if (isAt('--')) { advance(); match(';'); return { type: 'Assignment', target: { type: 'Identifier', name }, value: { type: 'Binary', operator: '-', left: { type: 'Identifier', name }, right: { type: 'Literal', value: 1, dataType: 'integer' } } } as Assignment; }
      if (isAt('+=') || isAt('-=') || isAt('*=') || isAt('/=')) {
        const op = advance().value[0];
        const value = parseExpression();
        match(';');
        return { type: 'Assignment', target: { type: 'Identifier', name }, value: { type: 'Binary', operator: op, left: { type: 'Identifier', name }, right: value } } as Assignment;
      }

      // Field assignment or method call with dot notation
      if (isAt('.')) {
        advance();
        const memberName = advance().value;
        const qualifiedName = `${name}.${memberName}`;
        if (isAt('=')) {
          advance();
          const value = parseExpression();
          match(';');
          return { type: 'Assignment', target: { type: 'Identifier', name: qualifiedName }, value } as Assignment;
        }
        if (isAt('++')) {
          advance();
          match(';');
          return { type: 'Assignment', target: { type: 'Identifier', name: qualifiedName }, value: { type: 'Binary', operator: '+', left: { type: 'Identifier', name: qualifiedName }, right: { type: 'Literal', value: 1, dataType: 'integer' } } } as Assignment;
        }
        if (isAt('--')) {
          advance();
          match(';');
          return { type: 'Assignment', target: { type: 'Identifier', name: qualifiedName }, value: { type: 'Binary', operator: '-', left: { type: 'Identifier', name: qualifiedName }, right: { type: 'Literal', value: 1, dataType: 'integer' } } } as Assignment;
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
          if (memberName === 'close') return null;
          if (memberName.toLowerCase().startsWith('next')) return null;
          return { type: 'Call', name: qualifiedName, args } as CallExpression;
        }
      }

      match(';');
      return null;
    }

    advance();
    return null;
  }

  function parseSystemOut(): WriteStatement {
    advance(); // System
    expect('.'); // .
    advance(); // out
    expect('.'); // .
    const method = advance().value; // println or print
    expect('(');
    const args: ASTNode[] = [];
    if (!isAt(')')) {
      args.push(parseExpression());
      while (match(',')) args.push(parseExpression());
    }
    expect(')');
    match(';');
    return { type: 'Write', args, newline: method === 'println' };
  }

  function parseIf(): IfNode {
    advance(); // if
    expect('(');
    const condition = parseExpression();
    expect(')');
    let thenBody: ASTNode[];
    if (isAt('{')) { thenBody = parseBlock(); }
    else { const s = parseStatement(); thenBody = s ? [s] : []; }
    let elseBody: ASTNode[] | undefined;
    if (match('else')) {
      if (isAt('{')) { elseBody = parseBlock(); }
      else { const s = parseStatement(); elseBody = s ? [s] : []; }
    }
    return { type: 'If', condition, thenBody, elseBody };
  }

  function parseWhile(): WhileNode {
    advance();
    expect('(');
    const condition = parseExpression();
    expect(')');
    let body: ASTNode[];
    if (isAt('{')) { body = parseBlock(); }
    else { const s = parseStatement(); body = s ? [s] : []; }
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
    if (isType()) parseCDataTypeSkip();
    const variable = advance().value;
    expect('=');
    const start = parseExpression();
    expect(';');
    advance(); // skip var in condition
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
    while (!isAt(')') && peek().type !== 'eof') advance();
    expect(')');
    let body: ASTNode[];
    if (isAt('{')) { body = parseBlock(); }
    else { const s = parseStatement(); body = s ? [s] : []; }
    return { type: 'For', variable, start, end, ascending, body };
  }

  function parseCDataTypeSkip(): void {
    advance(); // type
    if (isAt('[')) { advance(); match(']'); }
  }

  function parseSwitch(): SwitchNode {
    advance();
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
      } else { advance(); }
    }
    expect('}');
    return { type: 'Switch', expression, cases, defaultBody };
  }

  function parseReturn(): ReturnStatement {
    advance();
    if (isAt(';')) { advance(); return { type: 'Return' }; }
    const value = parseExpression();
    match(';');
    return { type: 'Return', value };
  }

  function parseExpression(): ASTNode {
    return parseOr();
  }

  function parseOr(): ASTNode {
    let left = parseAnd();
    while (isAt('||')) { advance(); left = { type: 'Binary', operator: 'or', left, right: parseAnd() } as BinaryExpression; }
    return left;
  }

  function parseAnd(): ASTNode {
    let left = parseComparison();
    while (isAt('&&')) { advance(); left = { type: 'Binary', operator: 'and', left, right: parseComparison() } as BinaryExpression; }
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
      const op = advance().value;
      left = { type: 'Binary', operator: op === '%' ? 'mod' : op, left, right: parseUnary() } as BinaryExpression;
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
    if (isAt('-')) { advance(); return { type: 'Unary', operator: '-', operand: parsePrimary() }; }
    return parsePrimary();
  }

  function parsePrimary(): ASTNode {
    const t = peek();

    if (t.type === 'number') { advance(); const isR = t.value.includes('.'); return { type: 'Literal', value: isR ? parseFloat(t.value) : parseInt(t.value), dataType: isR ? 'real' : 'integer' } as LiteralNode; }
    if (t.type === 'string') { advance(); return { type: 'Literal', value: t.value.slice(1, -1), dataType: 'string' } as LiteralNode; }
    if (t.value === 'true' || t.value === 'false') { advance(); return { type: 'Literal', value: t.value === 'true', dataType: 'boolean' } as LiteralNode; }
    if (t.value === '(') { advance(); const e = parseExpression(); expect(')'); return e; }

    if (t.value === 'null') {
      advance();
      return { type: 'Identifier', name: 'nil' } as IdentifierNode;
    }

    if (t.value === 'new') {
      advance();
      const typeName = (peek().type === 'identifier' || peek().type === 'keyword') ? advance().value : 'Object';
      if (isAt('[')) {
        advance();
        if (!isAt(']')) parseExpression();
        expect(']');
        return { type: 'Literal', value: 0, dataType: 'integer' } as LiteralNode;
      }
      const args: ASTNode[] = [{ type: 'Identifier', name: typeName } as IdentifierNode];
      const constructorArgs: ASTNode[] = [];
      if (isAt('(')) {
        advance();
        if (!isAt(')')) {
          constructorArgs.push(parseExpression());
          while (match(',')) constructorArgs.push(parseExpression());
        }
        expect(')');
      }
      if (/Ref$/i.test(typeName) && constructorArgs.length > 0) return constructorArgs[0];
      return { type: 'Call', name: 'new', args } as CallExpression;
    }

    const tokenCanBehaveAsIdentifier = t.type === 'identifier' || (t.type === 'keyword' && ['System', 'out', 'in', 'Scanner', 'this', 'super', 'nextInt', 'nextDouble', 'nextLine', 'next'].includes(t.value));
    if (tokenCanBehaveAsIdentifier) {
      const name = advance().value;
      if (isAt('.')) {
        advance();
        const method = advance().value;
        if (method === 'length' && !isAt('(')) {
          return { type: 'Call', name: 'length', args: [{ type: 'Identifier', name } as IdentifierNode] } as CallExpression;
        }
        if (isAt('(')) {
          advance();
          const args: ASTNode[] = [];
          if (!isAt(')')) { args.push(parseExpression()); while (match(',')) args.push(parseExpression()); }
          expect(')');
          return { type: 'Call', name: method, args } as CallExpression;
        }
        return { type: 'Identifier', name: `${name}.${method}` } as IdentifierNode;
      }
      if (isAt('(')) {
        advance();
        const args: ASTNode[] = [];
        if (!isAt(')')) { args.push(parseExpression()); while (match(',')) args.push(parseExpression()); }
        expect(')');
        return { type: 'Call', name, args } as CallExpression;
      }
      if (isAt('[')) {
        advance();
        const idx = parseExpression();
        expect(']');
        if (isAt('++') || isAt('--')) advance();
        return { type: 'ArrayAccess', array: name, index: idx };
      }
      if (isAt('++') || isAt('--')) advance();
      return { type: 'Identifier', name } as IdentifierNode;
    }

    advance();
    return { type: 'Literal', value: 0, dataType: 'integer' } as LiteralNode;
  }

  return parseProgram();
}
