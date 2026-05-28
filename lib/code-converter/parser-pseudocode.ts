import type {
  ASTNode, Assignment, BinaryExpression, CallExpression, DataType,
  ForNode, FunctionNode, IdentifierNode, IfNode, LiteralNode,
  ProgramNode, ReadStatement, RepeatUntilNode, ReturnStatement,
  Token, VariableDeclaration, WhileNode, WriteStatement,
} from './types';
import { tokenizePseudocode } from './tokenizer';

export function parsePseudocode(source: string): ProgramNode {
  const tokens = tokenizePseudocode(source).filter(t => t.type !== 'whitespace' && t.type !== 'newline' && t.type !== 'comment');
  let pos = 0;

  const peek = (): Token => tokens[pos] ?? { type: 'eof', value: '', line: 0, col: 0 };
  const advance = (): Token => tokens[pos++] ?? { type: 'eof', value: '', line: 0, col: 0 };
  const match = (val: string): boolean => {
    if (peek().value.toLowerCase() === val.toLowerCase()) { advance(); return true; }
    return false;
  };
  const isAt = (val: string): boolean => peek().value.toLowerCase() === val.toLowerCase();

  function parseProgram(): ProgramNode {
    const prog: ProgramNode = { type: 'Program', body: [], functions: [], variables: [] };

    // Skip "algoritmo" header
    if (isAt('algoritmo')) { advance(); if (peek().type === 'string') advance(); }

    // Parse var block
    if (isAt('var') || isAt('declare')) {
      advance();
      while (peek().type === 'identifier' && !isAt('inicio') && !isAt('funcao') && !isAt('procedimento')) {
        const vars = parseVarBlock();
        prog.variables.push(...vars);
      }
    }

    // Functions
    while (isAt('funcao') || isAt('procedimento')) {
      if (isAt('funcao')) prog.functions.push(parseFunc());
      else prog.functions.push(parseProc());
    }

    // Main body
    if (isAt('inicio')) advance();
    prog.body = parseStatements();
    if (isAt('fim') || isAt('fimalgoritmo')) advance();

    return prog;
  }

  function parseVarBlock(): VariableDeclaration[] {
    const vars: VariableDeclaration[] = [];
    const names: string[] = [];

    names.push(advance().value);
    while (match(',')) names.push(advance().value);
    match(':');

    let dt: DataType = 'unknown';
    let rawType: string | undefined;
    let arraySize: number | undefined;

    if (isAt('vetor')) {
      advance(); // vetor
      rawType = 'array';

      let lowerBound: number | undefined;
      let upperBound: number | undefined;

      if (match('[')) {
        if (peek().type === 'number') lowerBound = parseInt(advance().value, 10);
        if (match('..') && peek().type === 'number') {
          upperBound = parseInt(advance().value, 10);
        }
        while (!isAt(']') && peek().type !== 'eof') advance();
        match(']');
      }

      if (match('de')) {
        if (['inteiro', 'real', 'caractere', 'literal', 'logico'].includes(peek().value.toLowerCase())) {
          dt = parsePseudoType();
        }
      } else if (['inteiro', 'real', 'caractere', 'literal', 'logico'].includes(peek().value.toLowerCase())) {
        dt = parsePseudoType();
      }

      if (lowerBound !== undefined && upperBound !== undefined && upperBound >= lowerBound) {
        arraySize = (upperBound - lowerBound) + 1;
      }

      while (peek().type !== 'eof') {
        const lower = peek().value.toLowerCase();
        if (lower === 'inicio' || lower === 'funcao' || lower === 'procedimento' || lower === 'fim') break;
        if (peek().type === 'identifier' && tokens[pos + 1]?.value === ':') break;
        if (lower === ';') { advance(); break; }
        if (['inteiro', 'real', 'caractere', 'literal', 'logico'].includes(lower)) { advance(); break; }
        if (lower === ')' || lower === ',') break;
        if (peek().value === '[' || peek().value === ']' || peek().value === '..') { advance(); continue; }
        break;
      }

      if (dt === 'unknown') dt = 'integer';
    } else {
      dt = parsePseudoType();
    }

    for (const name of names) {
      vars.push({ type: 'VariableDeclaration', name, dataType: dt, rawType, arraySize });
    }
    return vars;
  }

  function parsePseudoType(): DataType {
    const t = advance().value.toLowerCase();
    switch (t) {
      case 'inteiro': return 'integer';
      case 'real': return 'real';
      case 'caractere': case 'literal': return 'string';
      case 'logico': return 'boolean';
      default: return 'unknown';
    }
  }

  function parseFunc(): FunctionNode {
    advance(); // funcao
    const name = advance().value;
    const params = parseParams();
    match(':');
    const returnType = parsePseudoType();

    const localVars: VariableDeclaration[] = [];
    if (isAt('var')) {
      advance();
      while (peek().type === 'identifier' && !isAt('inicio')) {
        localVars.push(...parseVarBlock());
      }
    }
    if (isAt('inicio')) advance();
    const body = parseStatements();
    if (isAt('fimfuncao')) advance();

    return { type: 'Function', name, params, returnType, body, localVars };
  }

  function parseProc(): FunctionNode {
    advance(); // procedimento
    const name = advance().value;
    const params = parseParams();

    const localVars: VariableDeclaration[] = [];
    if (isAt('var')) {
      advance();
      while (peek().type === 'identifier' && !isAt('inicio')) {
        localVars.push(...parseVarBlock());
      }
    }
    if (isAt('inicio')) advance();
    const body = parseStatements();
    if (isAt('fimprocedimento')) advance();

    return { type: 'Function', name, params, returnType: 'void', body, localVars };
  }

  function parseParams(): { name: string; dataType: DataType; byRef?: boolean }[] {
    const params: { name: string; dataType: DataType; byRef?: boolean }[] = [];
    if (!match('(')) return params;
    if (isAt(')')) { advance(); return params; }

    while (!isAt(')') && peek().type !== 'eof') {
      let byRef = false;
      while (isAt('var') || isAt('const')) {
        byRef = byRef || isAt('var');
        advance();
      }

      const names: string[] = [];
      if (peek().type === 'identifier') names.push(advance().value);
      while (match(',')) {
        if (peek().type === 'identifier') names.push(advance().value);
      }

      let pType: DataType = 'unknown';
      if (match(':')) {
        pType = parsePseudoType();
      }

      for (const name of names) {
        params.push({ name, dataType: pType, byRef });
      }

      if (!match(';')) break;
    }

    match(')');
    return params;
  }

  function parseStatements(): ASTNode[] {
    const stmts: ASTNode[] = [];
    while (
      peek().type !== 'eof' &&
      !isAt('fim') && !isAt('fimalgoritmo') && !isAt('fimse') && !isAt('fimenquanto') &&
      !isAt('fimpara') && !isAt('fimfuncao') && !isAt('fimprocedimento') &&
      !isAt('até') && !isAt('ate') && !isAt('senão') && !isAt('senao') &&
      !isAt('outrocaso') && !isAt('fimescolha')
    ) {
      const stmt = parseStatement();
      if (stmt) stmts.push(stmt);
    }
    return stmts;
  }

  function parseStatement(): ASTNode | null {
    const t = peek();
    const val = t.value.toLowerCase();

    if (val === 'se') return parseIf();
    if (val === 'enquanto') return parseWhile();
    if (val === 'para') return parseFor();
    if (val === 'repita') return parseRepeat();
    if (val === 'escolha') return parseChoose();
    if (val === 'escreva' || val === 'escreval') return parseWrite();
    if (val === 'leia') return parseRead();
    if (val === 'retorne') return parseReturn();

    if (t.type === 'identifier') {
      const name = parseDesignatorName();
      if (!name) {
        advance();
        return null;
      }
      if (isAt('[')) {
        advance();
        const index = parseExpression();
        match(']');
        if (!(match('<-') || match(':='))) {
          return null;
        }
        const value = parseExpression();
        return { type: 'Assignment', target: { type: 'ArrayAccess', array: name, index }, value } as Assignment;
      }
      if (match('<-') || match(':=')) {
        const value = parseExpression();
        return { type: 'Assignment', target: { type: 'Identifier', name }, value } as Assignment;
      }
      if (isAt('(')) {
        advance();
        const args: ASTNode[] = [];
        if (!isAt(')')) { args.push(parseExpression()); while (match(',')) args.push(parseExpression()); }
        match(')');
        return { type: 'Call', name, args } as CallExpression;
      }
      return { type: 'Call', name, args: [] } as CallExpression;
    }

    advance();
    return null;
  }

  function parseIf(): IfNode {
    advance(); // se
    const condition = parseExpression();
    let thenInline = false;
    let entaoLine = peek().line;
    if (isAt('então') || isAt('entao')) {
      entaoLine = advance().line;
      thenInline = peek().line === entaoLine && peek().type !== 'eof';
    }

    const thenBody = thenInline
      ? (() => {
        const stmt = parseStatement();
        return stmt ? [stmt] : [];
      })()
      : parseStatements();

    let elseBody: ASTNode[] | undefined;
    if (isAt('senão') || isAt('senao')) {
      const senaoLine = advance().line;
      const elseInline = peek().line === senaoLine && peek().type !== 'eof';
      elseBody = elseInline
        ? (() => {
          const stmt = parseStatement();
          return stmt ? [stmt] : [];
        })()
        : parseStatements();
    }

    if (isAt('fimse')) match('fimse');
    return { type: 'If', condition, thenBody, elseBody };
  }

  function parseWhile(): WhileNode {
    advance(); // enquanto
    const condition = parseExpression();
    match('faça'); match('faca');
    const body = parseStatements();
    match('fimenquanto');
    return { type: 'While', condition, body };
  }

  function parseFor(): ForNode {
    advance(); // para
    const variable = advance().value;
    match('de');
    const start = parseExpression();
    match('ate'); match('até');
    const end = parseExpression();
    let step: ASTNode | undefined;
    if (isAt('passo')) { advance(); step = parseExpression(); }
    match('faça'); match('faca');
    const body = parseStatements();
    match('fimpara');
    return { type: 'For', variable, start, end, step, ascending: true, body };
  }

  function parseRepeat(): RepeatUntilNode {
    advance(); // repita
    const body = parseStatements();
    match('até'); match('ate');
    const condition = parseExpression();
    return { type: 'RepeatUntil', condition, body };
  }

  function parseChoose(): ASTNode {
    advance(); // escolha
    const expression = parseExpression();
    const cases: { value: ASTNode; body: ASTNode[] }[] = [];
    let defaultBody: ASTNode[] | undefined;

    while (!isAt('fimescolha') && peek().type !== 'eof') {
      if (isAt('caso')) {
        advance();
        const val = parseExpression();
        const body = parseStatements();
        cases.push({ value: val, body });
      } else if (isAt('outrocaso')) {
        advance();
        defaultBody = parseStatements();
      } else {
        advance();
      }
    }
    match('fimescolha');
    return { type: 'Switch', expression, cases, defaultBody };
  }

  function parseWrite(): WriteStatement {
    const isLn = peek().value.toLowerCase() === 'escreval';
    advance();
    match('(');
    const args: ASTNode[] = [];
    if (!isAt(')')) {
      args.push(parseExpression());
      while (match(',')) args.push(parseExpression());
    }
    match(')');
    return { type: 'Write', args, newline: isLn };
  }

  function parseRead(): ReadStatement {
    advance(); // leia
    match('(');
    const variables: string[] = [];

    const parseDesignator = () => {
      const name = parseDesignatorName();
      if (!name) return;
      if (isAt('[')) {
        advance();
        const index = parseExpression();
        match(']');
        variables.push(`${name}[${exprToText(index)}]`);
      } else {
        variables.push(name);
      }
    };

    parseDesignator();
    while (match(',')) parseDesignator();
    while (!isAt(')') && peek().type !== 'eof') advance();
    match(')');
    return { type: 'Read', variables };
  }

  function parseReturn(): ReturnStatement {
    advance(); // retorne
    if (
      peek().type === 'eof' ||
      isAt('fimfuncao') ||
      isAt('fimprocedimento') ||
      isAt('fimse') ||
      isAt('fimenquanto') ||
      isAt('fimpara') ||
      isAt('fimescolha') ||
      isAt('senão') ||
      isAt('senao') ||
      isAt('outrocaso') ||
      isAt('até') ||
      isAt('ate')
    ) {
      return { type: 'Return' };
    }
    const value = parseExpression();
    return { type: 'Return', value };
  }

  function parseExpression(): ASTNode { return parseOr(); }

  function parseDesignatorName(): string | null {
    if (peek().type !== 'identifier' && peek().type !== 'keyword') return null;
    let name = advance().value;
    while (isAt('.')) {
      advance();
      if (peek().type !== 'identifier' && peek().type !== 'keyword') break;
      name += `.${advance().value}`;
    }
    return name;
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
    while (isAt('ou')) { advance(); left = { type: 'Binary', operator: 'or', left, right: parseAnd() } as BinaryExpression; }
    return left;
  }

  function parseAnd(): ASTNode {
    let left = parseComparison();
    while (isAt('e')) { advance(); left = { type: 'Binary', operator: 'and', left, right: parseComparison() } as BinaryExpression; }
    return left;
  }

  function parseComparison(): ASTNode {
    let left = parseAddition();
    while (['=', '<>', '<', '>', '<=', '>='].includes(peek().value)) {
      const op = advance().value;
      left = { type: 'Binary', operator: op, left, right: parseAddition() } as BinaryExpression;
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
    while (['*', '/', 'mod', 'div'].includes(peek().value.toLowerCase())) {
      const op = advance().value.toLowerCase();
      left = { type: 'Binary', operator: op, left, right: parseUnary() } as BinaryExpression;
    }
    return left;
  }

  function parseUnary(): ASTNode {
    if (isAt('nao') || isAt('não')) { advance(); return { type: 'Unary', operator: 'not', operand: parseUnary() }; }
    if (peek().value === '-') { advance(); return { type: 'Unary', operator: '-', operand: parsePrimary() }; }
    return parsePrimary();
  }

  function parsePrimary(): ASTNode {
    const t = peek();
    if (t.type === 'number') { advance(); const isR = t.value.includes('.'); return { type: 'Literal', value: isR ? parseFloat(t.value) : parseInt(t.value), dataType: isR ? 'real' : 'integer' } as LiteralNode; }
    if (t.type === 'string') { advance(); return { type: 'Literal', value: t.value.slice(1, -1), dataType: 'string' } as LiteralNode; }
    if (t.value.toLowerCase() === 'verdadeiro') { advance(); return { type: 'Literal', value: true, dataType: 'boolean' } as LiteralNode; }
    if (t.value.toLowerCase() === 'falso') { advance(); return { type: 'Literal', value: false, dataType: 'boolean' } as LiteralNode; }
    if (t.value === '(') { advance(); const e = parseExpression(); match(')'); return e; }

    if (t.type === 'identifier' || t.type === 'keyword') {
      const name = parseDesignatorName();
      if (!name) {
        advance();
        return { type: 'Literal', value: 0, dataType: 'integer' } as LiteralNode;
      }
      if (isAt('(')) { advance(); const args: ASTNode[] = []; if (!isAt(')')) { args.push(parseExpression()); while (match(',')) args.push(parseExpression()); } match(')'); return { type: 'Call', name, args } as CallExpression; }
      if (isAt('[')) { advance(); const idx = parseExpression(); match(']'); return { type: 'ArrayAccess', array: name, index: idx }; }
      return { type: 'Identifier', name } as IdentifierNode;
    }

    advance();
    return { type: 'Literal', value: 0, dataType: 'integer' } as LiteralNode;
  }

  return parseProgram();
}
