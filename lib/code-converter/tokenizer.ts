import type { Token, TokenType } from './types';

// ---------- Base Tokenizer ----------

type TokenizerOptions = {
  pascalComments?: boolean;
};

export function tokenize(
  source: string,
  keywords: Set<string>,
  operators: string[],
  options: TokenizerOptions = {},
): Token[] {
  const tokens: Token[] = [];
  let pos = 0;
  let line = 1;
  let col = 1;

  const sortedOps = [...operators].sort((a, b) => b.length - a.length);

  while (pos < source.length) {
    // Newline
    if (source[pos] === '\n') {
      tokens.push({ type: 'newline', value: '\n', line, col });
      pos++;
      line++;
      col = 1;
      continue;
    }

    // Whitespace
    if (/\s/.test(source[pos])) {
      let ws = '';
      const startCol = col;
      while (pos < source.length && source[pos] !== '\n' && /\s/.test(source[pos])) {
        ws += source[pos];
        pos++;
        col++;
      }
      tokens.push({ type: 'whitespace', value: ws, line, col: startCol });
      continue;
    }

    // Single-line comment //
    if (source[pos] === '/' && source[pos + 1] === '/') {
      let comment = '';
      const startCol = col;
      while (pos < source.length && source[pos] !== '\n') {
        comment += source[pos];
        pos++;
        col++;
      }
      tokens.push({ type: 'comment', value: comment, line, col: startCol });
      continue;
    }

    // Multi-line comment /* */
    if (source[pos] === '/' && source[pos + 1] === '*') {
      let comment = '';
      const startCol = col;
      while (pos < source.length && !(source[pos] === '*' && source[pos + 1] === '/')) {
        if (source[pos] === '\n') { line++; col = 1; } else { col++; }
        comment += source[pos];
        pos++;
      }
      if (pos < source.length) { comment += '*/'; pos += 2; col += 2; }
      tokens.push({ type: 'comment', value: comment, line, col: startCol });
      continue;
    }

    // Pascal comment { }
    if (options.pascalComments && source[pos] === '{') {
      let comment = '';
      const startCol = col;
      while (pos < source.length && source[pos] !== '}') {
        if (source[pos] === '\n') { line++; col = 1; } else { col++; }
        comment += source[pos];
        pos++;
      }
      if (pos < source.length) { comment += '}'; pos++; col++; }
      tokens.push({ type: 'comment', value: comment, line, col: startCol });
      continue;
    }

    // Pascal comment (* *)
    if (options.pascalComments && source[pos] === '(' && source[pos + 1] === '*') {
      let comment = '';
      const startCol = col;
      while (pos < source.length && !(source[pos] === '*' && source[pos + 1] === ')')) {
        if (source[pos] === '\n') { line++; col = 1; } else { col++; }
        comment += source[pos];
        pos++;
      }
      if (pos < source.length) { comment += '*)'; pos += 2; col += 2; }
      tokens.push({ type: 'comment', value: comment, line, col: startCol });
      continue;
    }

    // String literal
    if (source[pos] === '"' || source[pos] === '\'') {
      const quote = source[pos];
      let str = quote;
      const startCol = col;
      pos++;
      col++;
      while (pos < source.length && source[pos] !== quote) {
        if (source[pos] === '\\') { str += source[pos]; pos++; col++; }
        str += source[pos];
        pos++;
        col++;
      }
      if (pos < source.length) { str += source[pos]; pos++; col++; }
      tokens.push({ type: 'string', value: str, line, col: startCol });
      continue;
    }

    // Number
    if (/\d/.test(source[pos])) {
      let num = '';
      const startCol = col;
      while (pos < source.length && /[\d.]/.test(source[pos])) {
        num += source[pos];
        pos++;
        col++;
      }
      tokens.push({ type: 'number', value: num, line, col: startCol });
      continue;
    }

    // Identifier/keyword
    if (/[a-zA-Z_àáâãéêíóôõúçÀÁÂÃÉÊÍÓÔÕÚÇ]/.test(source[pos])) {
      let id = '';
      const startCol = col;
      while (pos < source.length && /[a-zA-Z0-9_àáâãéêíóôõúçÀÁÂÃÉÊÍÓÔÕÚÇ]/.test(source[pos])) {
        id += source[pos];
        pos++;
        col++;
      }
      const tokenType: TokenType = keywords.has(id.toLowerCase()) ? 'keyword' : 'identifier';
      tokens.push({ type: tokenType, value: id, line, col: startCol });
      continue;
    }

    // Operators (multi-char first)
    let matched = false;
    for (const op of sortedOps) {
      if (source.substring(pos, pos + op.length) === op) {
        tokens.push({ type: 'operator', value: op, line, col });
        pos += op.length;
        col += op.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // Punctuation
    if (/[()[\]{};,.]/.test(source[pos])) {
      tokens.push({ type: 'punctuation', value: source[pos], line, col });
      pos++;
      col++;
      continue;
    }

    // Unknown
    tokens.push({ type: 'unknown', value: source[pos], line, col });
    pos++;
    col++;
  }

  tokens.push({ type: 'eof', value: '', line, col });
  return tokens;
}

// ---------- Pascal Tokenizer ----------

const PASCAL_KEYWORDS = new Set([
  'program', 'begin', 'end', 'var', 'const', 'type', 'array', 'of',
  'integer', 'real', 'char', 'boolean', 'string',
  'if', 'then', 'else', 'while', 'do', 'for', 'to', 'downto',
  'repeat', 'until', 'case', 'function', 'procedure', 'record',
  'writeln', 'write', 'readln', 'read', 'true', 'false',
  'and', 'or', 'not', 'mod', 'div', 'nil', 'new', 'dispose', 'exit', 'out',
]);

const PASCAL_OPERATORS = [':=', '<=', '>=', '<>', '..', '^', '+', '-', '*', '/', '=', '<', '>', ':', ';', ',', '.'];

export function tokenizePascal(source: string): Token[] {
  return tokenize(source, PASCAL_KEYWORDS, PASCAL_OPERATORS, { pascalComments: true });
}

// ---------- C Tokenizer ----------

const C_KEYWORDS = new Set([
  'int', 'float', 'double', 'char', 'void', 'long', 'short', 'unsigned',
  'if', 'else', 'while', 'do', 'for', 'switch', 'case', 'default', 'break', 'continue', 'return',
  'struct', 'typedef', 'enum', 'const', 'static',
  'printf', 'scanf', 'puts', 'gets',
  'true', 'false', 'NULL',
  'include', 'define', 'stdio', 'stdlib', 'string', 'math',
]);

const C_OPERATORS = ['==', '!=', '<=', '>=', '&&', '||', '++', '--', '+=', '-=', '*=', '/=', '%=', '->', '<<', '>>', '+', '-', '*', '/', '%', '=', '<', '>', '!', '&', '|', '~', '^', '?', ':', ';', ',', '.', '#'];

export function tokenizeC(source: string): Token[] {
  return tokenize(source, C_KEYWORDS, C_OPERATORS);
}

// ---------- Java Tokenizer ----------

const JAVA_KEYWORDS = new Set([
  'public', 'private', 'protected', 'static', 'void', 'class', 'interface',
  'extends', 'implements', 'new', 'this', 'super', 'final', 'abstract',
  'int', 'float', 'double', 'char', 'boolean', 'long', 'short', 'byte',
  'String', 'System', 'out', 'println', 'print', 'Scanner', 'nextInt', 'nextLine', 'nextDouble',
  'if', 'else', 'while', 'do', 'for', 'switch', 'case', 'default', 'break', 'continue', 'return',
  'true', 'false', 'null', 'import', 'package',
]);

const JAVA_OPERATORS = ['==', '!=', '<=', '>=', '&&', '||', '++', '--', '+=', '-=', '*=', '/=', '%=', '+', '-', '*', '/', '%', '=', '<', '>', '!', '&', '|', '~', '^', '?', ':', ';', ',', '.'];

export function tokenizeJava(source: string): Token[] {
  return tokenize(source, JAVA_KEYWORDS, JAVA_OPERATORS);
}

// ---------- Pseudocode Tokenizer ----------

const PSEUDO_KEYWORDS = new Set([
  'algoritmo', 'inicio', 'fim', 'fimalgoritmo', 'var', 'declare',
  'inteiro', 'real', 'caractere', 'logico', 'literal', 'vetor',
  'se', 'então', 'entao', 'senão', 'senao', 'fimse',
  'enquanto', 'faça', 'faca', 'fimenquanto',
  'para', 'de', 'ate', 'passo', 'fimpara',
  'repita', 'até', 'escolha', 'caso', 'outrocaso', 'fimescolha',
  'funcao', 'procedimento', 'retorne', 'fimfuncao', 'fimprocedimento',
  'leia', 'escreva', 'escreval',
  'e', 'ou', 'nao', 'não',
  'verdadeiro', 'falso',
  'mod',
]);

const PSEUDO_OPERATORS = ['<-', '<=', '>=', '<>', '+', '-', '*', '/', '=', '<', '>', ':', ';', ',', '.'];

export function tokenizePseudocode(source: string): Token[] {
  return tokenize(source, PSEUDO_KEYWORDS, PSEUDO_OPERATORS);
}
