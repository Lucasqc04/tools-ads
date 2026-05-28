import type { ASTNode, CodeExample, CodeStats, ConversionResult, ConversionWarning, Language, ProgramNode } from './types';
import { parsePascal } from './parser-pascal';
import { parseC } from './parser-c';
import { parseJava } from './parser-java';
import { parsePseudocode } from './parser-pseudocode';
import { generatePascal, generateC, generateJava, generatePseudocode } from './generators';

// ---------- Language Detection ----------

export function detectLanguage(source: string): Language | null {
  const lower = source.toLowerCase();
  const scores: Record<Language, number> = { pascal: 0, c: 0, java: 0, pseudocode: 0 };

  // Pascal signals
  if (/\bprogram\b/i.test(source)) scores.pascal += 3;
  if (/\bbegin\b/i.test(source) && /\bend\b/i.test(source)) scores.pascal += 3;
  if (/:=/.test(source)) scores.pascal += 4;
  if (/\bwriteln\b/i.test(source) || /\breadln\b/i.test(source)) scores.pascal += 3;
  if (/\bvar\b/i.test(source) && /:\s*(integer|real|boolean|string|char)\b/i.test(source)) scores.pascal += 3;
  if (/\bthen\b/i.test(source)) scores.pascal += 2;
  if (/\bprocedure\b/i.test(source) || /\bfunction\b.*:.*\binteger\b/i.test(source)) scores.pascal += 2;

  // C signals
  if (/\bprintf\b/.test(source) || /\bscanf\b/.test(source)) scores.c += 4;
  if (/#include/.test(source)) scores.c += 4;
  if (/\bint\s+main\s*\(/.test(source)) scores.c += 4;
  if (/\bstruct\b/.test(source) && !/\bclass\b/.test(source)) scores.c += 2;
  if (/\bvoid\b/.test(source) && !lower.includes('class')) scores.c += 1;

  // Java signals
  if (/\bSystem\s*\.\s*out\s*\./.test(source)) scores.java += 5;
  if (/\bpublic\s+(static\s+)?void\s+main\b/.test(source)) scores.java += 5;
  if (/\bclass\b/.test(source)) scores.java += 3;
  if (/\bScanner\b/.test(source)) scores.java += 3;
  if (/\bimport\s+java\./.test(source)) scores.java += 4;
  if (/\.println\b/.test(source)) scores.java += 2;

  // Pseudocode signals
  if (/\b(leia|escreva|escreval)\b/i.test(source)) scores.pseudocode += 4;
  if (/\b(fimse|fimenquanto|fimpara|fimalgoritmo)\b/i.test(source)) scores.pseudocode += 5;
  if (/<-/.test(source)) scores.pseudocode += 4;
  if (/\b(entao|então|senao|senão)\b/i.test(source)) scores.pseudocode += 3;
  if (/\b(inteiro|real|caractere|logico)\b/i.test(source)) scores.pseudocode += 3;
  if (/\balgoritmo\b/i.test(source)) scores.pseudocode += 3;

  const max = Math.max(...Object.values(scores));
  if (max === 0) return null;

  const winner = (Object.entries(scores) as [Language, number][]).find(([, v]) => v === max);
  return winner ? winner[0] : null;
}

// ---------- Code Stats ----------

export function analyzeCode(source: string): CodeStats {
  const lines = source.split('\n').length;
  const varPattern = /\b(var|int|float|double|char|boolean|String|inteiro|real|caractere|logico)\b/gi;
  const loopPattern = /\b(while|for|repeat|repita|enquanto|para|do)\b/gi;
  const funcPattern = /\b(function|procedure|funcao|procedimento|void\s+\w+\s*\(|static\s+\w+\s+\w+\s*\()/gi;
  const condPattern = /\b(if|se|switch|escolha|case)\b/gi;
  const arrayPattern = /\[[^\]]*\]|\barray\b|\bvetor\b|\[\]/gi;
  const pointerPattern = /->|\^|\*[\s]*[A-Za-z_][A-Za-z0-9_]*\b/g;
  const ioPattern = /\b(readln|read|scanf|printf|writeln|write|System\.out\.print|System\.out\.println|leia|escreva|escreval)\b/gi;
  const commentPattern = /\/\/[^\n]*|\/\*[\s\S]*?\*\/|\{[\s\S]*?\}|\(\*[\s\S]*?\*\)/g;
  const userTypePattern = /\b(record|struct|class|typedef|type)\b/gi;

  return {
    lines,
    variables: (source.match(varPattern) || []).length,
    loops: (source.match(loopPattern) || []).length,
    functions: (source.match(funcPattern) || []).length,
    conditionals: (source.match(condPattern) || []).length,
    arrays: (source.match(arrayPattern) || []).length,
    pointers: (source.match(pointerPattern) || []).length,
    ioOperations: (source.match(ioPattern) || []).length,
    comments: (source.match(commentPattern) || []).length,
    userTypes: (source.match(userTypePattern) || []).length,
    detectedLanguage: detectLanguage(source),
  };
}

// ---------- Main Conversion ----------

export function convertCode(source: string, from: Language, to: Language): ConversionResult {
  const warnings: ConversionWarning[] = [];

  if (!source.trim()) {
    return {
      success: false,
      output: '',
      explanations: [],
      warnings: [{ line: 0, message: 'Nenhum código fornecido.', severity: 'error' }],
      stats: {
        lines: 0,
        variables: 0,
        loops: 0,
        functions: 0,
        conditionals: 0,
        arrays: 0,
        pointers: 0,
        ioOperations: 0,
        comments: 0,
        userTypes: 0,
        detectedLanguage: null,
      },
    };
  }

  if (from === to) {
    const sameLangWarnings: ConversionWarning[] = [{ line: 0, message: 'Linguagens de origem e destino são iguais.', severity: 'info' }];
    sameLangWarnings.push(...generateContextualWarnings(source, source, from, to));
    return {
      success: true,
      output: source,
      explanations: generateExplanations(from, to, source, source),
      warnings: sameLangWarnings,
      stats: analyzeCode(source),
    };
  }

  let ast: ProgramNode;
  try {
    switch (from) {
      case 'pascal': ast = parsePascal(source); break;
      case 'c': ast = parseC(source); break;
      case 'java': ast = parseJava(source); break;
      case 'pseudocode': ast = parsePseudocode(source); break;
      default: throw new Error(`Linguagem '${from}' não suportada.`);
    }

    if (isAstEmpty(ast)) {
      const fallback = tryParseFallbackSnippet(source, from);
      if (fallback) {
        ast = fallback;
        warnings.push({
          line: 0,
          message: 'Trecho parcial detectado. Foi aplicado um contexto mínimo para interpretar o código.',
          severity: 'info',
        });
      }
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro ao fazer parse do código.';
    warnings.push({ line: 0, message: `Erro no parse: ${msg}`, severity: 'error' });
    return { success: false, output: '', explanations: [], warnings, stats: analyzeCode(source) };
  }

  let output: string;
  try {
    switch (to) {
      case 'pascal': output = generatePascal(ast); break;
      case 'c': output = generateC(ast); break;
      case 'java': output = generateJava(ast); break;
      case 'pseudocode': output = generatePseudocode(ast); break;
      default: throw new Error(`Linguagem '${to}' não suportada.`);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro ao gerar código.';
    warnings.push({ line: 0, message: `Erro na geração: ${msg}`, severity: 'error' });
    return { success: false, output: '', explanations: [], warnings, stats: analyzeCode(source) };
  }

  output = prependTranslatedComments(source, from, to, output);

  const contextualWarnings = generateContextualWarnings(source, output, from, to);
  warnings.push(...contextualWarnings);

  warnings.push({ line: 0, message: 'Conversão educacional. Revise o código manualmente antes de compilar.', severity: 'info' });

  return {
    success: true,
    output,
    explanations: generateExplanations(from, to, source, output),
    warnings,
    stats: analyzeCode(source),
  };
}

function isAstEmpty(ast: ProgramNode): boolean {
  return ast.body.length === 0 && ast.functions.length === 0 && ast.variables.length === 0;
}

function tryParseFallbackSnippet(source: string, from: Language): ProgramNode | null {
  try {
    switch (from) {
      case 'pascal':
        return parsePascal(`begin\n${source}\nend.`);
      case 'c':
        return parseC(`int main() {\n${source}\n}`);
      case 'java':
        return parseJava(`public class Snippet {\n  public static void main(String[] args) {\n${source}\n  }\n}`);
      case 'pseudocode':
        return parsePseudocode(`algoritmo \"Snippet\"\ninicio\n${source}\nfimalgoritmo`);
      default:
        return null;
    }
  } catch {
    return null;
  }
}

function prependTranslatedComments(source: string, from: Language, to: Language, output: string): string {
  const comments = extractComments(source, from)
    .map(comment => stripCommentDelimiters(comment, from))
    .map(comment => comment.trim())
    .filter(Boolean);

  if (comments.length === 0) return output;

  const rendered = comments
    .map(comment => renderCommentForLanguage(comment, to))
    .filter(Boolean)
    .join('\n');

  if (!rendered.trim()) return output;
  return `${rendered}\n\n${output}`;
}

function extractComments(source: string, lang: Language): string[] {
  const matches: string[] = [];
  const pattern = lang === 'pascal'
    ? /\/\/[^\n]*|\{[\s\S]*?\}|\(\*[\s\S]*?\*\)/g
    : lang === 'pseudocode'
      ? /\/\/[^\n]*|#[^\n]*/g
      : /\/\/[^\n]*|\/\*[\s\S]*?\*\//g;

  let match = pattern.exec(source);
  while (match) {
    if (match[0]) matches.push(match[0]);
    match = pattern.exec(source);
  }
  return matches;
}

function stripCommentDelimiters(comment: string, lang: Language): string {
  const trimmed = comment.trim();

  if (lang === 'pascal') {
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      return trimmed.slice(1, -1).trim();
    }
    if (trimmed.startsWith('(*') && trimmed.endsWith('*)')) {
      return trimmed.slice(2, -2).trim();
    }
    return trimmed;
  }

  if (lang === 'c' || lang === 'java') {
    if (trimmed.startsWith('//')) return trimmed.slice(2).trim();
    if (trimmed.startsWith('/*') && trimmed.endsWith('*/')) {
      return trimmed
        .slice(2, -2)
        .split('\n')
        .map(line => line.replace(/^\s*\*\s?/, '').trimEnd())
        .join('\n')
        .trim();
    }
    return trimmed;
  }

  if (trimmed.startsWith('//')) return trimmed.slice(2).trim();
  if (trimmed.startsWith('#')) return trimmed.slice(1).trim();
  return trimmed;
}

function renderCommentForLanguage(comment: string, lang: Language): string {
  const lines = comment
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return '';

  if (lang === 'pascal') {
    if (lines.length === 1) return `{ ${lines[0]} }`;
    return ['(*', ...lines.map(line => `  ${line}`), '*)'].join('\n');
  }

  if (lang === 'c' || lang === 'java' || lang === 'pseudocode') {
    return lines.map(line => `// ${line}`).join('\n');
  }

  return '';
}

// ---------- Explanations ----------

function generateExplanations(from: Language, to: Language, source: string, output: string) {
  const explanations: { sourceLine: number; targetLine: number; sourceCode: string; targetCode: string; explanation: string }[] = [];

  const syntaxDiffs: Record<string, { from: Record<Language, string>; to: Record<Language, string>; explanation: string }[]> = {
    default: [
      { from: { pascal: ':=', c: '=', java: '=', pseudocode: '<-' }, to: { pascal: ':=', c: '=', java: '=', pseudocode: '<-' }, explanation: 'Operador de atribuição varia entre linguagens.' },
      { from: { pascal: 'begin/end', c: '{ }', java: '{ }', pseudocode: 'inicio/fim' }, to: { pascal: 'begin/end', c: '{ }', java: '{ }', pseudocode: 'inicio/fim' }, explanation: 'Delimitadores de bloco.' },
      { from: { pascal: 'writeln()', c: 'printf()', java: 'System.out.println()', pseudocode: 'escreval()' }, to: { pascal: 'writeln()', c: 'printf()', java: 'System.out.println()', pseudocode: 'escreval()' }, explanation: 'Comando de saída/impressão.' },
      { from: { pascal: 'readln()', c: 'scanf()', java: 'scanner.nextInt()', pseudocode: 'leia()' }, to: { pascal: 'readln()', c: 'scanf()', java: 'scanner.nextInt()', pseudocode: 'leia()' }, explanation: 'Comando de entrada/leitura.' },
      { from: { pascal: 'integer', c: 'int', java: 'int', pseudocode: 'inteiro' }, to: { pascal: 'integer', c: 'int', java: 'int', pseudocode: 'inteiro' }, explanation: 'Tipo inteiro.' },
    ],
  };

  const diffs = syntaxDiffs.default;
  diffs.forEach((diff, idx) => {
    explanations.push({
      sourceLine: idx + 1,
      targetLine: idx + 1,
      sourceCode: diff.from[from],
      targetCode: diff.to[to],
      explanation: diff.explanation,
    });
  });

  let dynamicLine = diffs.length + 1;
  const hasForLoop = /\b(for|while|para|enquanto)\b/i.test(source) || /\b(for|while|para|enquanto)\b/i.test(output);
  const hasArray = /\[[^\]]+\]|\barray\b|\bvetor\b/i.test(source) || /\[[^\]]+\]|\barray\b|\bvetor\b/i.test(output);

  if (hasForLoop) {
    explanations.push({
      sourceLine: dynamicLine,
      targetLine: dynamicLine,
      sourceCode: from === 'pascal' ? 'for i := 1 to n do' : from === 'pseudocode' ? 'para i de 1 ate n faca' : 'for (i = 0; i < n; i++)',
      targetCode: to === 'pascal' ? 'for i := 1 to n do' : to === 'pseudocode' ? 'para i de 1 ate n faca' : 'for (i = 0; i < n; i++)',
      explanation: 'A sintaxe de laços muda entre linguagens. Confira início, condição e incremento/decremento.',
    });
    dynamicLine += 1;
  }

  if (hasArray) {
    explanations.push({
      sourceLine: dynamicLine,
      targetLine: dynamicLine,
      sourceCode: from === 'pascal' ? 'v[1]' : 'v[0]',
      targetCode: to === 'pascal' ? 'v[1]' : 'v[0]',
      explanation: 'Índices de vetor podem mudar por convenção: Pascal costuma usar 1..N, C/Java geralmente 0..N-1.',
    });
  }

  return explanations;
}

function generateContextualWarnings(source: string, output: string, from: Language, to: Language): ConversionWarning[] {
  const warnings: ConversionWarning[] = [];

  const pushWarning = (message: string, severity: ConversionWarning['severity']) => {
    if (warnings.some(w => w.message === message)) return;
    warnings.push({ line: 0, message, severity });
  };

  if ((from === 'pascal' && (to === 'c' || to === 'java')) && /\barray\s*\[\s*1\s*\.\./i.test(source)) {
    pushWarning('Diferença de índice detectada: vetor Pascal com base 1 pode exigir ajuste para base 0 em C/Java.', 'info');
  }

  if ((from === 'c' || from === 'java') && to === 'pascal' && /\[[^\]]+\]/.test(source)) {
    pushWarning('Revisão sugerida: confirme os limites de índice no Pascal (0..N-1 ou 1..N) conforme a declaração do vetor.', 'info');
  }

  if (to === 'java') {
    const javaWarnings = analyzeJavaLearningWarnings(output);
    for (const warning of javaWarnings) {
      pushWarning(warning.message, warning.severity);
    }

    const forHeaderPattern = /for\s*\(\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*([1-9][0-9]*)\s*;\s*\1\s*(?:<=|<)\s*[^;]+;\s*\1(?:\+\+|--)?/g;
    let forMatch = forHeaderPattern.exec(output);
    while (forMatch) {
      const loopVar = forMatch[1];
      const start = forMatch[2];
      const bodyPattern = new RegExp(`\\[[\\s]*${loopVar}[\\s]*\\]`);
      if (bodyPattern.test(output)) {
        pushWarning(`Laço Java iniciando em ${start} com acesso por índice '${loopVar}' detectado. Revise possível diferença de base (0..N-1).`, 'info');
        break;
      }
      forMatch = forHeaderPattern.exec(output);
    }
  }

  return warnings;
}

function analyzeJavaLearningWarnings(output: string): ConversionWarning[] {
  const warnings: ConversionWarning[] = [];
  const pushWarning = (message: string, severity: ConversionWarning['severity']) => {
    if (warnings.some(w => w.message === message)) return;
    warnings.push({ line: 0, message, severity });
  };

  let ast: ProgramNode;
  try {
    ast = parseJava(output);
  } catch {
    return warnings;
  }

  const declared = new Map<string, { isArray: boolean }>();
  const registerDecl = (name: string, isArray: boolean) => {
    if (!name) return;
    declared.set(name.toLowerCase(), { isArray });
  };

  const collectDeclarations = (nodes: ProgramNode['body']) => {
    for (const node of nodes) {
      if (node.type === 'VariableDeclaration') {
        const raw = node.rawType?.toLowerCase() ?? '';
        registerDecl(node.name, typeof node.arraySize === 'number' || raw.includes('array') || raw.includes('[]'));
      }
    }
  };

  collectDeclarations(ast.body);
  collectDeclarations(ast.variables);
  for (const fn of ast.functions) {
    for (const p of fn.params) {
      const raw = p.rawType?.toLowerCase() ?? '';
      registerDecl(p.name, raw.includes('array') || raw.includes('[]'));
    }
    collectDeclarations(fn.localVars);
  }

  const rootIdentifier = (value: string): string => {
    const trimmed = value.trim();
    const bracket = trimmed.indexOf('[');
    const dot = trimmed.indexOf('.');
    const end = [bracket, dot].filter(idx => idx >= 0).sort((a, b) => a - b)[0];
    return (end === undefined ? trimmed : trimmed.slice(0, end)).trim();
  };

  const nodeUsesArrayIndexVar = (node: ProgramNode['body'][number], loopVar: string): boolean => {
    const check = (n: ASTNode): boolean => {
      if (!n || typeof n !== 'object') return false;

      if (n.type === 'ArrayAccess') {
        return n.index?.type === 'Identifier' && String(n.index.name).toLowerCase() === loopVar.toLowerCase();
      }

      if (n.type === 'Assignment') {
        return check(n.target) || check(n.value);
      }

      if (n.type === 'If') {
        return check(n.condition) || (n.thenBody?.some(check) ?? false) || (n.elseBody?.some(check) ?? false);
      }

      if (n.type === 'While' || n.type === 'DoWhile' || n.type === 'RepeatUntil') {
        return check(n.condition) || (n.body?.some(check) ?? false);
      }

      if (n.type === 'Block') {
        return n.body?.some(check) ?? false;
      }

      if (n.type === 'For') {
        return check(n.start) || check(n.end) || (n.body?.some(check) ?? false);
      }

      if (n.type === 'Switch') {
        return check(n.expression)
          || (n.cases?.some(entry => check(entry.value) || (entry.body?.some(check) ?? false)) ?? false)
          || (n.defaultBody?.some(check) ?? false);
      }

      if (n.type === 'Write') return n.args?.some(check) ?? false;
      if (n.type === 'Call') return n.args?.some(check) ?? false;
      if (n.type === 'Return') return n.value ? check(n.value) : false;
      if (n.type === 'Binary') return check(n.left) || check(n.right);
      if (n.type === 'Unary') return check(n.operand);
      if (n.type === 'Read') {
        return n.variables?.some((variable: string) => variable.includes('[') && rootIdentifier(variable).toLowerCase() !== loopVar.toLowerCase() ? false : variable.includes(`[${loopVar}]`) || variable.includes(`[${loopVar.toLowerCase()}]`)) ?? false;
      }
      return false;
    };

    return check(node);
  };

  const walkNodes = (nodes: ProgramNode['body'], inFor: boolean) => {
    for (const node of nodes) {
      if (node.type === 'For') {
        const startValue = node.start.type === 'Literal' && typeof node.start.value === 'number' ? node.start.value : null;
        if (startValue !== null && startValue >= 1) {
          const usesLoopVarAsArrayIndex = node.body.some(bodyNode => nodeUsesArrayIndexVar(bodyNode, node.variable));
          if (usesLoopVarAsArrayIndex) {
            pushWarning(`Laço com índice iniciando em ${startValue} acessando vetor com '${node.variable}'. Em Java, revise se o vetor deveria começar em índice 0.`, 'info');
          }
        }
        walkNodes(node.body, true);
        continue;
      }

      if (node.type === 'If') {
        walkNodes(node.thenBody, inFor);
        if (node.elseBody) walkNodes(node.elseBody, inFor);
        continue;
      }

      if (node.type === 'While' || node.type === 'DoWhile' || node.type === 'RepeatUntil' || node.type === 'Block') {
        walkNodes(node.body, inFor);
        continue;
      }

      if (node.type === 'Switch') {
        for (const entry of node.cases) walkNodes(entry.body, inFor);
        if (node.defaultBody) walkNodes(node.defaultBody, inFor);
        continue;
      }

      if (node.type !== 'Read') continue;

      for (const variable of node.variables) {
        const root = rootIdentifier(variable);
        if (!root) continue;
        if (!declared.get(root.toLowerCase())) continue;
      }
    }
  };

  walkNodes(ast.body, false);
  for (const fn of ast.functions) {
    walkNodes(fn.body, false);
  }

  return warnings;
}

// ---------- Examples ----------

export const CODE_EXAMPLES: CodeExample[] = [
  {
    id: 'sum-two-numbers',
    title: 'Soma de dois números',
    description: 'Lê dois números e mostra a soma',
    category: 'basic',
    code: {
      pascal: `program SomaDois;\nvar\n  a, b, soma: integer;\nbegin\n  writeln('Digite dois numeros:');\n  readln(a);\n  readln(b);\n  soma := a + b;\n  writeln('Soma: ', soma);\nend.`,
      c: `#include <stdio.h>\n\nint main() {\n  int a, b, soma;\n  printf("Digite dois numeros:\\n");\n  scanf("%d", &a);\n  scanf("%d", &b);\n  soma = a + b;\n  printf("Soma: %d\\n", soma);\n  return 0;\n}`,
      java: `import java.util.Scanner;\n\npublic class SomaDois {\n  public static void main(String[] args) {\n    Scanner scanner = new Scanner(System.in);\n    System.out.println("Digite dois numeros:");\n    int a = scanner.nextInt();\n    int b = scanner.nextInt();\n    int soma = a + b;\n    System.out.println("Soma: " + soma);\n    scanner.close();\n  }\n}`,
      pseudocode: `algoritmo "SomaDois"\nvar\n  a, b, soma: inteiro\ninicio\n  escreval("Digite dois numeros:")\n  leia(a)\n  leia(b)\n  soma <- a + b\n  escreval("Soma: ", soma)\nfimalgoritmo`,
    },
  },
  {
    id: 'even-odd',
    title: 'Par ou ímpar',
    description: 'Verifica se um número é par ou ímpar',
    category: 'basic',
    code: {
      pascal: `program ParImpar;\nvar\n  n: integer;\nbegin\n  writeln('Digite um numero:');\n  readln(n);\n  if n mod 2 = 0 then\n    writeln('Par')\n  else\n    writeln('Impar');\nend.`,
      c: `#include <stdio.h>\n\nint main() {\n  int n;\n  printf("Digite um numero:\\n");\n  scanf("%d", &n);\n  if (n % 2 == 0) {\n    printf("Par\\n");\n  } else {\n    printf("Impar\\n");\n  }\n  return 0;\n}`,
      java: `import java.util.Scanner;\n\npublic class ParImpar {\n  public static void main(String[] args) {\n    Scanner scanner = new Scanner(System.in);\n    System.out.println("Digite um numero:");\n    int n = scanner.nextInt();\n    if (n % 2 == 0) {\n      System.out.println("Par");\n    } else {\n      System.out.println("Impar");\n    }\n    scanner.close();\n  }\n}`,
      pseudocode: `algoritmo "ParImpar"\nvar\n  n: inteiro\ninicio\n  escreval("Digite um numero:")\n  leia(n)\n  se n mod 2 = 0 entao\n    escreval("Par")\n  senao\n    escreval("Impar")\n  fimse\nfimalgoritmo`,
    },
  },
  {
    id: 'factorial',
    title: 'Fatorial',
    description: 'Calcula o fatorial de um número',
    category: 'basic',
    code: {
      pascal: `program Fatorial;\nvar\n  n, i, fat: integer;\nbegin\n  writeln('Digite um numero:');\n  readln(n);\n  fat := 1;\n  for i := 1 to n do\n    fat := fat * i;\n  writeln('Fatorial: ', fat);\nend.`,
      c: `#include <stdio.h>\n\nint main() {\n  int n, i, fat = 1;\n  printf("Digite um numero:\\n");\n  scanf("%d", &n);\n  for (int i = 1; i <= n; i++) {\n    fat = fat * i;\n  }\n  printf("Fatorial: %d\\n", fat);\n  return 0;\n}`,
      java: `import java.util.Scanner;\n\npublic class Fatorial {\n  public static void main(String[] args) {\n    Scanner scanner = new Scanner(System.in);\n    System.out.println("Digite um numero:");\n    int n = scanner.nextInt();\n    int fat = 1;\n    for (int i = 1; i <= n; i++) {\n      fat = fat * i;\n    }\n    System.out.println("Fatorial: " + fat);\n    scanner.close();\n  }\n}`,
      pseudocode: `algoritmo "Fatorial"\nvar\n  n, i, fat: inteiro\ninicio\n  escreval("Digite um numero:")\n  leia(n)\n  fat <- 1\n  para i de 1 ate n faca\n    fat <- fat * i\n  fimpara\n  escreval("Fatorial: ", fat)\nfimalgoritmo`,
    },
  },
  {
    id: 'fibonacci',
    title: 'Fibonacci',
    description: 'Mostra os N primeiros termos de Fibonacci',
    category: 'basic',
    code: {
      pascal: `program Fibonacci;\nvar\n  n, i, a, b, temp: integer;\nbegin\n  writeln('Quantos termos?');\n  readln(n);\n  a := 0;\n  b := 1;\n  for i := 1 to n do\n  begin\n    writeln(a);\n    temp := a + b;\n    a := b;\n    b := temp;\n  end;\nend.`,
      c: `#include <stdio.h>\n\nint main() {\n  int n, i, a = 0, b = 1, temp;\n  printf("Quantos termos?\\n");\n  scanf("%d", &n);\n  for (int i = 1; i <= n; i++) {\n    printf("%d\\n", a);\n    temp = a + b;\n    a = b;\n    b = temp;\n  }\n  return 0;\n}`,
      java: `import java.util.Scanner;\n\npublic class Fibonacci {\n  public static void main(String[] args) {\n    Scanner scanner = new Scanner(System.in);\n    System.out.println("Quantos termos?");\n    int n = scanner.nextInt();\n    int a = 0, b = 1, temp;\n    for (int i = 1; i <= n; i++) {\n      System.out.println(a);\n      temp = a + b;\n      a = b;\n      b = temp;\n    }\n    scanner.close();\n  }\n}`,
      pseudocode: `algoritmo "Fibonacci"\nvar\n  n, i, a, b, temp: inteiro\ninicio\n  escreval("Quantos termos?")\n  leia(n)\n  a <- 0\n  b <- 1\n  para i de 1 ate n faca\n    escreval(a)\n    temp <- a + b\n    a <- b\n    b <- temp\n  fimpara\nfimalgoritmo`,
    },
  },
  {
    id: 'bubble-sort',
    title: 'Bubble Sort',
    description: 'Ordena um vetor com Bubble Sort',
    category: 'algorithms',
    code: {
      pascal: `program BubbleSort;\nvar\n  v: array[1..5] of integer;\n  i, j, temp: integer;\nbegin\n  for i := 1 to 5 do\n    readln(v[i]);\n  for i := 1 to 4 do\n    for j := 1 to 5 - i do\n      if v[j] > v[j + 1] then\n      begin\n        temp := v[j];\n        v[j] := v[j + 1];\n        v[j + 1] := temp;\n      end;\n  for i := 1 to 5 do\n    writeln(v[i]);\nend.`,
      c: `#include <stdio.h>\n\nint main() {\n  int v[5], i, j, temp;\n  for (int i = 0; i < 5; i++) {\n    scanf("%d", &v[i]);\n  }\n  for (int i = 0; i < 4; i++) {\n    for (int j = 0; j < 5 - i - 1; j++) {\n      if (v[j] > v[j + 1]) {\n        temp = v[j];\n        v[j] = v[j + 1];\n        v[j + 1] = temp;\n      }\n    }\n  }\n  for (int i = 0; i < 5; i++) {\n    printf("%d\\n", v[i]);\n  }\n  return 0;\n}`,
      java: `import java.util.Scanner;\n\npublic class BubbleSort {\n  public static void main(String[] args) {\n    Scanner scanner = new Scanner(System.in);\n    int[] v = new int[5];\n    for (int i = 0; i < 5; i++) {\n      v[i] = scanner.nextInt();\n    }\n    for (int i = 0; i < 4; i++) {\n      for (int j = 0; j < 5 - i - 1; j++) {\n        if (v[j] > v[j + 1]) {\n          int temp = v[j];\n          v[j] = v[j + 1];\n          v[j + 1] = temp;\n        }\n      }\n    }\n    for (int i = 0; i < 5; i++) {\n      System.out.println(v[i]);\n    }\n    scanner.close();\n  }\n}`,
      pseudocode: `algoritmo "BubbleSort"\nvar\n  v: vetor[1..5] de inteiro\n  i, j, temp: inteiro\ninicio\n  para i de 1 ate 5 faca\n    leia(v[i])\n  fimpara\n  para i de 1 ate 4 faca\n    para j de 1 ate 5 - i faca\n      se v[j] > v[j + 1] entao\n        temp <- v[j]\n        v[j] <- v[j + 1]\n        v[j + 1] <- temp\n      fimse\n    fimpara\n  fimpara\n  para i de 1 ate 5 faca\n    escreval(v[i])\n  fimpara\nfimalgoritmo`,
    },
  },
  {
    id: 'function-max',
    title: 'Função Maior',
    description: 'Função que retorna o maior de dois números',
    category: 'structures',
    code: {
      pascal: `program FuncaoMaior;\nvar\n  a, b: integer;\n\nfunction maior(x, y: integer): integer;\nbegin\n  if x > y then\n    maior := x\n  else\n    maior := y;\nend;\n\nbegin\n  readln(a);\n  readln(b);\n  writeln('Maior: ', maior(a, b));\nend.`,
      c: `#include <stdio.h>\n\nint maior(int x, int y) {\n  if (x > y) {\n    return x;\n  } else {\n    return y;\n  }\n}\n\nint main() {\n  int a, b;\n  scanf("%d", &a);\n  scanf("%d", &b);\n  printf("Maior: %d\\n", maior(a, b));\n  return 0;\n}`,
      java: `import java.util.Scanner;\n\npublic class FuncaoMaior {\n  public static int maior(int x, int y) {\n    if (x > y) {\n      return x;\n    } else {\n      return y;\n    }\n  }\n\n  public static void main(String[] args) {\n    Scanner scanner = new Scanner(System.in);\n    int a = scanner.nextInt();\n    int b = scanner.nextInt();\n    System.out.println("Maior: " + maior(a, b));\n    scanner.close();\n  }\n}`,
      pseudocode: `algoritmo "FuncaoMaior"\nvar\n  a, b: inteiro\n\nfuncao maior(x, y: inteiro): inteiro\ninicio\n  se x > y entao\n    retorne x\n  senao\n    retorne y\n  fimse\nfimfuncao\n\ninicio\n  leia(a)\n  leia(b)\n  escreval("Maior: ", maior(a, b))\nfimalgoritmo`,
    },
  },
  {
    id: 'while-counter',
    title: 'Contador com While',
    description: 'Conta de 1 a 10 usando while',
    category: 'structures',
    code: {
      pascal: `program Contador;\nvar\n  i: integer;\nbegin\n  i := 1;\n  while i <= 10 do\n  begin\n    writeln(i);\n    i := i + 1;\n  end;\nend.`,
      c: `#include <stdio.h>\n\nint main() {\n  int i = 1;\n  while (i <= 10) {\n    printf("%d\\n", i);\n    i = i + 1;\n  }\n  return 0;\n}`,
      java: `public class Contador {\n  public static void main(String[] args) {\n    int i = 1;\n    while (i <= 10) {\n      System.out.println(i);\n      i = i + 1;\n    }\n  }\n}`,
      pseudocode: `algoritmo "Contador"\nvar\n  i: inteiro\ninicio\n  i <- 1\n  enquanto i <= 10 faca\n    escreval(i)\n    i <- i + 1\n  fimenquanto\nfimalgoritmo`,
    },
  },
];

export const CLASSIC_STUDY_TOPICS: { title: string; category: string }[] = [
  { title: 'Procedure de soma simples', category: 'basic' },
  { title: 'Procedure de troca (swap)', category: 'basic' },
  { title: 'Função de máximo entre dois números', category: 'basic' },
  { title: 'Função de mínimo entre dois números', category: 'basic' },
  { title: 'Validação de número par/ímpar', category: 'basic' },
  { title: 'Tabuada com laço', category: 'basic' },
  { title: 'Média aritmética de N notas', category: 'basic' },
  { title: 'Contador regressivo', category: 'basic' },
  { title: 'Somatório de 1 até N', category: 'basic' },
  { title: 'Potência por multiplicação sucessiva', category: 'basic' },
  { title: 'MDC (Euclides)', category: 'algorithms' },
  { title: 'MMC com MDC', category: 'algorithms' },
  { title: 'Número primo', category: 'algorithms' },
  { title: 'Crivo de Eratóstenes', category: 'algorithms' },
  { title: 'Conversão decimal para binário', category: 'algorithms' },
  { title: 'Conversão de base genérica', category: 'algorithms' },
  { title: 'Fatorial iterativo', category: 'algorithms' },
  { title: 'Fatorial recursivo', category: 'recursion' },
  { title: 'Fibonacci iterativo', category: 'algorithms' },
  { title: 'Fibonacci recursivo', category: 'recursion' },
  { title: 'Torre de Hanói', category: 'recursion' },
  { title: 'Mergesort', category: 'recursion' },
  { title: 'Quicksort', category: 'recursion' },
  { title: 'Busca linear em vetor', category: 'search' },
  { title: 'Busca binária em vetor ordenado', category: 'search' },
  { title: 'Busca por sentinela', category: 'search' },
  { title: 'Selection Sort', category: 'sorting' },
  { title: 'Insertion Sort', category: 'sorting' },
  { title: 'Bubble Sort otimizado', category: 'sorting' },
  { title: 'Shell Sort', category: 'sorting' },
  { title: 'Heap Sort', category: 'sorting' },
  { title: 'Counting Sort', category: 'sorting' },
  { title: 'Bucket Sort', category: 'sorting' },
  { title: 'Radix Sort', category: 'sorting' },
  { title: 'Manipulação de vetor 1D', category: 'structures' },
  { title: 'Manipulação de matriz 2D', category: 'structures' },
  { title: 'Soma de diagonal principal', category: 'structures' },
  { title: 'Transposta de matriz', category: 'structures' },
  { title: 'Multiplicação de matrizes', category: 'structures' },
  { title: 'Leitura e impressão de vetor', category: 'structures' },
  { title: 'Inverter vetor in-place', category: 'structures' },
  { title: 'Rotacionar vetor à direita', category: 'structures' },
  { title: 'Pilha estática (array)', category: 'data-structures' },
  { title: 'Fila estática (array circular)', category: 'data-structures' },
  { title: 'Deque em array', category: 'data-structures' },
  { title: 'Lista encadeada simples: inserir início', category: 'data-structures' },
  { title: 'Lista encadeada simples: inserir fim', category: 'data-structures' },
  { title: 'Lista encadeada simples: remover valor', category: 'data-structures' },
  { title: 'Lista duplamente encadeada: inserção', category: 'data-structures' },
  { title: 'Lista circular encadeada', category: 'data-structures' },
  { title: 'Conversão vetor para lista encadeada', category: 'data-structures' },
  { title: 'Pilha encadeada', category: 'data-structures' },
  { title: 'Fila encadeada', category: 'data-structures' },
  { title: 'Hash table com endereçamento aberto', category: 'data-structures' },
  { title: 'Hash table com encadeamento', category: 'data-structures' },
  { title: 'Árvore ABB: inserir', category: 'trees' },
  { title: 'Árvore ABB: buscar', category: 'trees' },
  { title: 'Árvore ABB: remover', category: 'trees' },
  { title: 'Percurso em-ordem (in-order)', category: 'trees' },
  { title: 'Percurso pré-ordem (pre-order)', category: 'trees' },
  { title: 'Percurso pós-ordem (post-order)', category: 'trees' },
  { title: 'Altura de árvore binária', category: 'trees' },
  { title: 'Contagem de folhas da árvore', category: 'trees' },
  { title: 'Verificar árvore balanceada', category: 'trees' },
  { title: 'AVL: rotação simples', category: 'trees' },
  { title: 'Heap mínimo (min-heap)', category: 'trees' },
  { title: 'Heap máximo (max-heap)', category: 'trees' },
  { title: 'BFS em grafo', category: 'algorithms' },
  { title: 'DFS em grafo', category: 'algorithms' },
  { title: 'Dijkstra caminho mínimo', category: 'algorithms' },
  { title: 'Floyd-Warshall', category: 'algorithms' },
  { title: 'Ordenação topológica', category: 'algorithms' },
  { title: 'Union-Find (Disjoint Set)', category: 'algorithms' },
  { title: 'Kruskal (árvore geradora mínima)', category: 'algorithms' },
  { title: 'Prim (árvore geradora mínima)', category: 'algorithms' },
  { title: 'Verificar palíndromo', category: 'algorithms' },
  { title: 'Contagem de vogais em string', category: 'algorithms' },
  { title: 'Anagrama entre duas strings', category: 'algorithms' },
  { title: 'Subsequência comum máxima (LCS)', category: 'algorithms' },
  { title: 'Mochila 0/1 (knapsack)', category: 'algorithms' },
  { title: 'Troco mínimo (coin change)', category: 'algorithms' },
  { title: 'Programação dinâmica de Fibonacci', category: 'algorithms' },
  { title: 'Backtracking de labirinto', category: 'algorithms' },
  { title: 'N-Queens', category: 'recursion' },
  { title: 'Geração de permutações', category: 'recursion' },
  { title: 'Geração de combinações', category: 'recursion' },
  { title: 'Parser simples de expressão', category: 'algorithms' },
  { title: 'Avaliação de expressão pós-fixa', category: 'data-structures' },
  { title: 'Conversão infixa para pós-fixa', category: 'data-structures' },
];

function normalizeTopicKey(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function toSafeIdentifier(value: string): string {
  const key = normalizeTopicKey(value);
  const parts = key.split('-').filter(Boolean);
  const pascal = parts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
  return pascal || 'Exemplo';
}

const CLASSIC_SPECIAL_EXAMPLES: Record<string, Record<Language, string>> = {
  'procedure-de-soma-simples': {
    pascal: `program ProcedureSoma;\nvar\n  a, b, r: integer;\n\nprocedure Soma(x, y: integer; var res: integer);\nbegin\n  res := x + y;\nend;\n\nbegin\n  a := 10;\n  b := 25;\n  Soma(a, b, r);\n  writeln('Soma = ', r);\nend.`,
    c: `#include <stdio.h>\n\nvoid Soma(int x, int y, int *res) {\n  *res = x + y;\n}\n\nint main() {\n  int a = 10, b = 25, r;\n  Soma(a, b, &r);\n  printf(\"Soma = %d\\n\", r);\n  return 0;\n}`,
    java: `public class ProcedureSoma {\n  public static int Soma(int x, int y) {\n    return x + y;\n  }\n\n  public static void main(String[] args) {\n    int a = 10, b = 25;\n    int r = Soma(a, b);\n    System.out.println(\"Soma = \" + r);\n  }\n}`,
    pseudocode: `algoritmo "ProcedureSoma"\nvar\n  a, b, r: inteiro\n\nprocedimento soma(x, y: inteiro; var res: inteiro)\ninicio\n  res <- x + y\nfimprocedimento\n\ninicio\n  a <- 10\n  b <- 25\n  soma(a, b, r)\n  escreval("Soma = ", r)\nfimalgoritmo`,
  },
  'procedure-de-troca-swap': {
    pascal: `program ProcedureSwap;\nvar\n  a, b: integer;\n\nprocedure Swap(var x, y: integer);\nvar\n  t: integer;\nbegin\n  t := x;\n  x := y;\n  y := t;\nend;\n\nbegin\n  a := 3;\n  b := 9;\n  Swap(a, b);\n  writeln(a, ' ', b);\nend.`,
    c: `#include <stdio.h>\n\nvoid Swap(int *x, int *y) {\n  int t = *x;\n  *x = *y;\n  *y = t;\n}\n\nint main() {\n  int a = 3, b = 9;\n  Swap(&a, &b);\n  printf(\"%d %d\\n\", a, b);\n  return 0;\n}`,
    java: `public class ProcedureSwap {\n  static class IntRef { int value; IntRef(int v) { value = v; } }\n\n  public static void Swap(IntRef x, IntRef y) {\n    int t = x.value;\n    x.value = y.value;\n    y.value = t;\n  }\n\n  public static void main(String[] args) {\n    IntRef a = new IntRef(3);\n    IntRef b = new IntRef(9);\n    Swap(a, b);\n    System.out.println(a.value + \" \" + b.value);\n  }\n}`,
    pseudocode: `algoritmo "ProcedureSwap"\nvar\n  a, b: inteiro\n\nprocedimento swap(var x, y: inteiro)\nvar\n  t: inteiro\ninicio\n  t <- x\n  x <- y\n  y <- t\nfimprocedimento\n\ninicio\n  a <- 3\n  b <- 9\n  swap(a, b)\n  escreval(a, " ", b)\nfimalgoritmo`,
  },
  'mdc-euclides': {
    pascal: `program MDC;\n\nfunction mdc(a, b: integer): integer;\nbegin\n  while b <> 0 do\n  begin\n    a := a mod b;\n    a := a + b;\n    b := a - b;\n    a := a - b;\n  end;\n  mdc := a;\nend;\n\nbegin\n  writeln(mdc(48, 18));\nend.`,
    c: `#include <stdio.h>\n\nint mdc(int a, int b) {\n  while (b != 0) {\n    int t = b;\n    b = a % b;\n    a = t;\n  }\n  return a;\n}\n\nint main() {\n  printf(\"%d\\n\", mdc(48, 18));\n  return 0;\n}`,
    java: `public class MDC {\n  public static int mdc(int a, int b) {\n    while (b != 0) {\n      int t = b;\n      b = a % b;\n      a = t;\n    }\n    return a;\n  }\n\n  public static void main(String[] args) {\n    System.out.println(mdc(48, 18));\n  }\n}`,
    pseudocode: `algoritmo "MDC"\n\nfuncao mdc(a, b: inteiro): inteiro\ninicio\n  enquanto b <> 0 faca\n    t <- b\n    b <- a mod b\n    a <- t\n  fimenquanto\n  retorne a\nfimfuncao\n\ninicio\n  escreval(mdc(48, 18))\nfimalgoritmo`,
  },
  'fatorial-recursivo': {
    pascal: `program FatorialRec;\n\nfunction fat(n: integer): integer;\nbegin\n  if n <= 1 then\n    fat := 1\n  else\n    fat := n * fat(n - 1);\nend;\n\nbegin\n  writeln(fat(6));\nend.`,
    c: `#include <stdio.h>\n\nint fat(int n) {\n  if (n <= 1) return 1;\n  return n * fat(n - 1);\n}\n\nint main() {\n  printf(\"%d\\n\", fat(6));\n  return 0;\n}`,
    java: `public class FatorialRec {\n  public static int fat(int n) {\n    if (n <= 1) return 1;\n    return n * fat(n - 1);\n  }\n\n  public static void main(String[] args) {\n    System.out.println(fat(6));\n  }\n}`,
    pseudocode: `algoritmo "FatorialRec"\n\nfuncao fat(n: inteiro): inteiro\ninicio\n  se n <= 1 entao\n    retorne 1\n  senao\n    retorne n * fat(n - 1)\n  fimse\nfimfuncao\n\ninicio\n  escreval(fat(6))\nfimalgoritmo`,
  },
  'fibonacci-recursivo': {
    pascal: `program FibonacciRec;\n\nfunction fib(n: integer): integer;\nbegin\n  if n <= 1 then\n    fib := n\n  else\n    fib := fib(n - 1) + fib(n - 2);\nend;\n\nbegin\n  writeln(fib(10));\nend.`,
    c: `#include <stdio.h>\n\nint fib(int n) {\n  if (n <= 1) return n;\n  return fib(n - 1) + fib(n - 2);\n}\n\nint main() {\n  printf(\"%d\\n\", fib(10));\n  return 0;\n}`,
    java: `public class FibonacciRec {\n  public static int fib(int n) {\n    if (n <= 1) return n;\n    return fib(n - 1) + fib(n - 2);\n  }\n\n  public static void main(String[] args) {\n    System.out.println(fib(10));\n  }\n}`,
    pseudocode: `algoritmo "FibonacciRec"\n\nfuncao fib(n: inteiro): inteiro\ninicio\n  se n <= 1 entao\n    retorne n\n  senao\n    retorne fib(n - 1) + fib(n - 2)\n  fimse\nfimfuncao\n\ninicio\n  escreval(fib(10))\nfimalgoritmo`,
  },
  'busca-binaria-em-vetor-ordenado': {
    pascal: `program BuscaBinaria;\nvar\n  v: array[1..5] of integer = (2, 4, 7, 9, 15);\n  x, l, r, m: integer;\nbegin\n  x := 9;\n  l := 1;\n  r := 5;\n  while l <= r do\n  begin\n    m := (l + r) div 2;\n    if v[m] = x then\n    begin\n      writeln('Encontrado em ', m);\n      l := r + 1;\n    end\n    else if v[m] < x then\n      l := m + 1\n    else\n      r := m - 1;\n  end;\nend.`,
    c: `#include <stdio.h>\n\nint main() {\n  int v[] = {2, 4, 7, 9, 15};\n  int x = 9, l = 0, r = 4;\n  while (l <= r) {\n    int m = (l + r) / 2;\n    if (v[m] == x) {\n      printf(\"Encontrado em %d\\n\", m);\n      return 0;\n    } else if (v[m] < x) {\n      l = m + 1;\n    } else {\n      r = m - 1;\n    }\n  }\n  printf(\"Nao encontrado\\n\");\n  return 0;\n}`,
    java: `public class BuscaBinaria {\n  public static void main(String[] args) {\n    int[] v = {2, 4, 7, 9, 15};\n    int x = 9, l = 0, r = v.length - 1;\n    while (l <= r) {\n      int m = (l + r) / 2;\n      if (v[m] == x) {\n        System.out.println(\"Encontrado em \" + m);\n        return;\n      } else if (v[m] < x) {\n        l = m + 1;\n      } else {\n        r = m - 1;\n      }\n    }\n    System.out.println(\"Nao encontrado\");\n  }\n}`,
    pseudocode: `algoritmo "BuscaBinaria"\nvar\n  v: vetor[1..5] de inteiro\n  x, l, r, m: inteiro\ninicio\n  v[1] <- 2; v[2] <- 4; v[3] <- 7; v[4] <- 9; v[5] <- 15\n  x <- 9\n  l <- 1\n  r <- 5\n  enquanto l <= r faca\n    m <- (l + r) div 2\n    se v[m] = x entao\n      escreval("Encontrado em ", m)\n      retorne\n    senao se v[m] < x entao\n      l <- m + 1\n    senao\n      r <- m - 1\n    fimse\n  fimenquanto\n  escreval("Nao encontrado")\nfimalgoritmo`,
  },
  'lista-encadeada-simples-inserir-fim': {
    pascal: `program ListaInserirFim;\ntype\n  PNo = ^No;\n  No = record\n    info: integer;\n    prox: PNo;\n  end;\n\nprocedure inserirFim(var head: PNo; valor: integer);\nvar\n  novo, aux: PNo;\nbegin\n  new(novo);\n  novo^.info := valor;\n  novo^.prox := nil;\n\n  if head = nil then\n    head := novo\n  else\n  begin\n    aux := head;\n    while aux^.prox <> nil do\n      aux := aux^.prox;\n    aux^.prox := novo;\n  end;\nend;\n\nbegin\nend.`,
    c: `#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct No {\n  int info;\n  struct No *prox;\n} No;\n\nvoid inserirFim(No **head, int valor) {\n  No *novo = (No*)malloc(sizeof(No));\n  novo->info = valor;\n  novo->prox = NULL;\n\n  if (*head == NULL) {\n    *head = novo;\n  } else {\n    No *aux = *head;\n    while (aux->prox != NULL) aux = aux->prox;\n    aux->prox = novo;\n  }\n}\n\nint main() {\n  return 0;\n}`,
    java: `public class ListaInserirFim {\n  static class No {\n    int info;\n    No prox;\n  }\n\n  public static No inserirFim(No head, int valor) {\n    No novo = new No();\n    novo.info = valor;\n\n    if (head == null) {\n      return novo;\n    }\n\n    No aux = head;\n    while (aux.prox != null) aux = aux.prox;\n    aux.prox = novo;\n    return head;\n  }\n\n  public static void main(String[] args) {\n  }\n}`,
    pseudocode: `algoritmo "ListaInserirFim"\n\nprocedimento inserirFim(var head, valor)\ninicio\n  // Estrutura de no simplificada\n  // novo.info <- valor\n  // novo.prox <- nulo\n  // se head = nulo entao head <- novo\n  // senao percorre ate o fim e liga novo\nfimprocedimento\n\ninicio\nfimalgoritmo`,
  },
  'arvore-abb-buscar': {
    pascal: `program ABBBuscar;\ntype\n  PNo = ^No;\n  No = record\n    chave: integer;\n    esq, dir: PNo;\n  end;\n\nfunction buscar(raiz: PNo; valor: integer): boolean;\nbegin\n  if raiz = nil then\n    buscar := false\n  else if raiz^.chave = valor then\n    buscar := true\n  else if valor < raiz^.chave then\n    buscar := buscar(raiz^.esq, valor)\n  else\n    buscar := buscar(raiz^.dir, valor);\nend;\n\nbegin\nend.`,
    c: `#include <stdio.h>\n\ntypedef struct No {\n  int chave;\n  struct No *esq;\n  struct No *dir;\n} No;\n\nint buscar(No *raiz, int valor) {\n  if (raiz == NULL) return 0;\n  if (raiz->chave == valor) return 1;\n  if (valor < raiz->chave) return buscar(raiz->esq, valor);\n  return buscar(raiz->dir, valor);\n}\n\nint main() {\n  return 0;\n}`,
    java: `public class ABBBuscar {\n  static class No {\n    int chave;\n    No esq, dir;\n  }\n\n  public static boolean buscar(No raiz, int valor) {\n    if (raiz == null) return false;\n    if (raiz.chave == valor) return true;\n    if (valor < raiz.chave) return buscar(raiz.esq, valor);\n    return buscar(raiz.dir, valor);\n  }\n\n  public static void main(String[] args) {\n  }\n}`,
    pseudocode: `algoritmo "ABBBuscar"\n\nfuncao buscar(raiz, valor): logico\ninicio\n  se raiz = nulo entao retorne falso\n  se raiz.chave = valor entao retorne verdadeiro\n  se valor < raiz.chave entao retorne buscar(raiz.esq, valor)\n  retorne buscar(raiz.dir, valor)\nfimfuncao\n\ninicio\nfimalgoritmo`,
  },
};

export type StudyExampleMode = 'structure' | 'complete';

function buildStructureClassicTemplate(title: string, category: string, lang: Language): string {
  const name = toSafeIdentifier(title);

  if (lang === 'pascal') {
    if (category === 'trees') {
      return `program ${name};\ntype\n  PNo = ^No;\n  No = record\n    chave: integer;\n    esq, dir: PNo;\n  end;\n\nfunction resolver(raiz: PNo): integer;\nbegin\n  { implemente a logica aqui }\n  resolver := 0;\nend;\n\nbegin\nend.`;
    }
    if (category === 'data-structures') {
      return `program ${name};\nvar\n  i: integer;\nbegin\n  { inicialize estrutura }\n  for i := 1 to 5 do\n    writeln(i);\nend.`;
    }
    if (category === 'recursion') {
      return `program ${name};\n\nfunction resolver(n: integer): integer;\nbegin\n  if n <= 1 then\n    resolver := 1\n  else\n    resolver := n * resolver(n - 1);\nend;\n\nbegin\n  writeln(resolver(5));\nend.`;
    }
    return `program ${name};\nvar\n  i: integer;\nbegin\n  i := 1;\n  while i <= 5 do\n  begin\n    writeln(i);\n    i := i + 1;\n  end;\nend.`;
  }

  if (lang === 'c') {
    if (category === 'trees') {
      return `#include <stdio.h>\n\ntypedef struct No {\n  int chave;\n  struct No *esq;\n  struct No *dir;\n} No;\n\nint resolver(No *raiz) {\n  return 0;\n}\n\nint main() {\n  return 0;\n}`;
    }
    if (category === 'data-structures') {
      return `#include <stdio.h>\n\nint main() {\n  int i;\n  for (i = 0; i < 5; i++) {\n    printf(\"%d\\\\n\", i);\n  }\n  return 0;\n}`;
    }
    if (category === 'recursion') {
      return `#include <stdio.h>\n\nint resolver(int n) {\n  if (n <= 1) return 1;\n  return n * resolver(n - 1);\n}\n\nint main() {\n  printf(\"%d\\\\n\", resolver(5));\n  return 0;\n}`;
    }
    return `#include <stdio.h>\n\nint main() {\n  int i = 1;\n  while (i <= 5) {\n    printf(\"%d\\\\n\", i);\n    i++;\n  }\n  return 0;\n}`;
  }

  if (lang === 'java') {
    if (category === 'trees') {
      return `public class ${name} {\n  static class No {\n    int chave;\n    No esq, dir;\n  }\n\n  public static int resolver(No raiz) {\n    return 0;\n  }\n\n  public static void main(String[] args) {\n  }\n}`;
    }
    if (category === 'data-structures') {
      return `public class ${name} {\n  public static void main(String[] args) {\n    for (int i = 0; i < 5; i++) {\n      System.out.println(i);\n    }\n  }\n}`;
    }
    if (category === 'recursion') {
      return `public class ${name} {\n  public static int resolver(int n) {\n    if (n <= 1) return 1;\n    return n * resolver(n - 1);\n  }\n\n  public static void main(String[] args) {\n    System.out.println(resolver(5));\n  }\n}`;
    }
    return `public class ${name} {\n  public static void main(String[] args) {\n    int i = 1;\n    while (i <= 5) {\n      System.out.println(i);\n      i++;\n    }\n  }\n}`;
  }

  if (category === 'trees') {
    return `algoritmo "${name}"\n\ninicio\n  // definir no e percurso\nfimalgoritmo`;
  }
  if (category === 'recursion') {
    return `algoritmo "${name}"\n\nfuncao resolver(n: inteiro): inteiro\ninicio\n  se n <= 1 entao\n    retorne 1\n  senao\n    retorne n * resolver(n - 1)\n  fimse\nfimfuncao\n\ninicio\n  escreval(resolver(5))\nfimalgoritmo`;
  }
  return `algoritmo "${name}"\n\ninicio\n  // estrutura base do algoritmo\nfimalgoritmo`;
}

function buildCompleteClassicTemplate(title: string, category: string, lang: Language): string {
  const name = toSafeIdentifier(title);
  const key = normalizeTopicKey(title);

  if (key.includes('pilha')) {
    if (lang === 'pascal') {
      return `program ${name};\nconst\n  MAX = 10;\nvar\n  topo, x: integer;\n  pilha: array[1..MAX] of integer;\n\nprocedure push(v: integer);\nbegin\n  if topo < MAX then\n  begin\n    topo := topo + 1;\n    pilha[topo] := v;\n  end;\nend;\n\nfunction pop: integer;\nbegin\n  if topo > 0 then\n  begin\n    pop := pilha[topo];\n    topo := topo - 1;\n  end\n  else\n    pop := -1;\nend;\n\nbegin\n  topo := 0;\n  push(10);\n  push(20);\n  x := pop;\n  writeln(x);\nend.`;
    }
    if (lang === 'c') {
      return `#include <stdio.h>\n#define MAX 10\n\nint pilha[MAX];\nint topo = -1;\n\nvoid push(int v) {\n  if (topo < MAX - 1) pilha[++topo] = v;\n}\n\nint pop() {\n  if (topo >= 0) return pilha[topo--];\n  return -1;\n}\n\nint main() {\n  push(10);\n  push(20);\n  printf(\"%d\\n\", pop());\n  return 0;\n}`;
    }
    if (lang === 'java') {
      return `public class ${name} {\n  static final int MAX = 10;\n  static int[] pilha = new int[MAX];\n  static int topo = -1;\n\n  static void push(int v) {\n    if (topo < MAX - 1) pilha[++topo] = v;\n  }\n\n  static int pop() {\n    if (topo >= 0) return pilha[topo--];\n    return -1;\n  }\n\n  public static void main(String[] args) {\n    push(10);\n    push(20);\n    System.out.println(pop());\n  }\n}`;
    }
    return `algoritmo "${name}"\nvar\n  topo: inteiro\n  pilha: vetor[1..10] de inteiro\n\ninicio\n  topo <- 0\n  topo <- topo + 1\n  pilha[topo] <- 10\n  topo <- topo + 1\n  pilha[topo] <- 20\n  escreval(pilha[topo])\n  topo <- topo - 1\nfimalgoritmo`;
  }

  if (key.includes('fila')) {
    if (lang === 'pascal') {
      return `program ${name};\nconst\n  MAX = 10;\nvar\n  fila: array[1..MAX] of integer;\n  ini, fim: integer;\n\nprocedure enqueue(v: integer);\nbegin\n  if fim < MAX then\n  begin\n    fim := fim + 1;\n    fila[fim] := v;\n  end;\nend;\n\nfunction dequeue: integer;\nbegin\n  if ini <= fim then\n  begin\n    dequeue := fila[ini];\n    ini := ini + 1;\n  end\n  else\n    dequeue := -1;\nend;\n\nbegin\n  ini := 1;\n  fim := 0;\n  enqueue(5);\n  enqueue(9);\n  writeln(dequeue);\nend.`;
    }
    if (lang === 'c') {
      return `#include <stdio.h>\n#define MAX 10\n\nint fila[MAX];\nint ini = 0, fim = 0;\n\nvoid enqueue(int v) {\n  if (fim < MAX) fila[fim++] = v;\n}\n\nint dequeue() {\n  if (ini < fim) return fila[ini++];\n  return -1;\n}\n\nint main() {\n  enqueue(5);\n  enqueue(9);\n  printf(\"%d\\n\", dequeue());\n  return 0;\n}`;
    }
    if (lang === 'java') {
      return `public class ${name} {\n  static final int MAX = 10;\n  static int[] fila = new int[MAX];\n  static int ini = 0, fim = 0;\n\n  static void enqueue(int v) {\n    if (fim < MAX) fila[fim++] = v;\n  }\n\n  static int dequeue() {\n    if (ini < fim) return fila[ini++];\n    return -1;\n  }\n\n  public static void main(String[] args) {\n    enqueue(5);\n    enqueue(9);\n    System.out.println(dequeue());\n  }\n}`;
    }
    return `algoritmo "${name}"\nvar\n  ini, fim: inteiro\n  fila: vetor[1..10] de inteiro\n\ninicio\n  ini <- 1\n  fim <- 0\n  fim <- fim + 1\n  fila[fim] <- 5\n  fim <- fim + 1\n  fila[fim] <- 9\n  escreval(fila[ini])\n  ini <- ini + 1\nfimalgoritmo`;
  }

  if (key.includes('arvore') || key.includes('abb') || category === 'trees') {
    if (lang === 'pascal') {
      return `program ${name};\ntype\n  PNo = ^No;\n  No = record\n    chave: integer;\n    esq, dir: PNo;\n  end;\n\nfunction buscar(raiz: PNo; valor: integer): boolean;\nbegin\n  if raiz = nil then\n    buscar := false\n  else if raiz^.chave = valor then\n    buscar := true\n  else if valor < raiz^.chave then\n    buscar := buscar(raiz^.esq, valor)\n  else\n    buscar := buscar(raiz^.dir, valor);\nend;\n\nbegin\nend.`;
    }
    if (lang === 'c') {
      return `#include <stdio.h>\n\ntypedef struct No {\n  int chave;\n  struct No *esq;\n  struct No *dir;\n} No;\n\nint buscar(No *raiz, int valor) {\n  if (raiz == NULL) return 0;\n  if (raiz->chave == valor) return 1;\n  if (valor < raiz->chave) return buscar(raiz->esq, valor);\n  return buscar(raiz->dir, valor);\n}\n\nint main() {\n  return 0;\n}`;
    }
    if (lang === 'java') {
      return `public class ${name} {\n  static class No {\n    int chave;\n    No esq, dir;\n  }\n\n  static boolean buscar(No raiz, int valor) {\n    if (raiz == null) return false;\n    if (raiz.chave == valor) return true;\n    if (valor < raiz.chave) return buscar(raiz.esq, valor);\n    return buscar(raiz.dir, valor);\n  }\n\n  public static void main(String[] args) {\n  }\n}`;
    }
    return `algoritmo "${name}"\n\nfuncao buscar(raiz, valor): logico\ninicio\n  se raiz = nulo entao retorne falso\n  se raiz.chave = valor entao retorne verdadeiro\n  se valor < raiz.chave entao retorne buscar(raiz.esq, valor)\n  retorne buscar(raiz.dir, valor)\nfimfuncao\n\ninicio\nfimalgoritmo`;
  }

  if (key.includes('busca') || category === 'search') {
    return CLASSIC_SPECIAL_EXAMPLES['busca-binaria-em-vetor-ordenado']?.[lang]
      ?? buildStructureClassicTemplate(title, category, lang);
  }

  if (key.includes('fatorial')) {
    if (key.includes('recurs')) {
      return CLASSIC_SPECIAL_EXAMPLES['fatorial-recursivo']?.[lang]
        ?? buildStructureClassicTemplate(title, category, lang);
    }
    if (lang === 'pascal') return `program ${name};\nvar\n  n, i, fat: integer;\nbegin\n  n := 6;\n  fat := 1;\n  for i := 1 to n do\n    fat := fat * i;\n  writeln(fat);\nend.`;
    if (lang === 'c') return `#include <stdio.h>\n\nint main() {\n  int n = 6, i, fat = 1;\n  for (i = 1; i <= n; i++) fat *= i;\n  printf(\"%d\\n\", fat);\n  return 0;\n}`;
    if (lang === 'java') return `public class ${name} {\n  public static void main(String[] args) {\n    int n = 6, fat = 1;\n    for (int i = 1; i <= n; i++) fat *= i;\n    System.out.println(fat);\n  }\n}`;
    return `algoritmo "${name}"\nvar\n  n, i, fat: inteiro\ninicio\n  n <- 6\n  fat <- 1\n  para i de 1 ate n faca\n    fat <- fat * i\n  fimpara\n  escreval(fat)\nfimalgoritmo`;
  }

  if (key.includes('fibonacci')) {
    if (key.includes('recurs')) {
      return CLASSIC_SPECIAL_EXAMPLES['fibonacci-recursivo']?.[lang]
        ?? buildStructureClassicTemplate(title, category, lang);
    }
    if (lang === 'pascal') return `program ${name};\nvar\n  i, n, a, b, t: integer;\nbegin\n  n := 10;\n  a := 0;\n  b := 1;\n  for i := 1 to n do\n  begin\n    writeln(a);\n    t := a + b;\n    a := b;\n    b := t;\n  end;\nend.`;
    if (lang === 'c') return `#include <stdio.h>\n\nint main() {\n  int i, n = 10, a = 0, b = 1, t;\n  for (i = 0; i < n; i++) {\n    printf(\"%d\\n\", a);\n    t = a + b;\n    a = b;\n    b = t;\n  }\n  return 0;\n}`;
    if (lang === 'java') return `public class ${name} {\n  public static void main(String[] args) {\n    int n = 10, a = 0, b = 1;\n    for (int i = 0; i < n; i++) {\n      System.out.println(a);\n      int t = a + b;\n      a = b;\n      b = t;\n    }\n  }\n}`;
    return `algoritmo "${name}"\nvar\n  i, n, a, b, t: inteiro\ninicio\n  n <- 10\n  a <- 0\n  b <- 1\n  para i de 1 ate n faca\n    escreval(a)\n    t <- a + b\n    a <- b\n    b <- t\n  fimpara\nfimalgoritmo`;
  }

  if (key.includes('mdc')) {
    return CLASSIC_SPECIAL_EXAMPLES['mdc-euclides']?.[lang]
      ?? buildStructureClassicTemplate(title, category, lang);
  }

  if (category === 'sorting') {
    return CODE_EXAMPLES.find(example => example.id === 'bubble-sort')?.code[lang]
      ?? buildStructureClassicTemplate(title, category, lang);
  }

  if (category === 'structures') {
    return CODE_EXAMPLES.find(example => example.id === 'while-counter')?.code[lang]
      ?? buildStructureClassicTemplate(title, category, lang);
  }

  if (category === 'basic') {
    return CODE_EXAMPLES.find(example => example.id === 'sum-two-numbers')?.code[lang]
      ?? buildStructureClassicTemplate(title, category, lang);
  }

  if (category === 'data-structures') {
    return CLASSIC_SPECIAL_EXAMPLES['lista-encadeada-simples-inserir-fim']?.[lang]
      ?? buildStructureClassicTemplate(title, category, lang);
  }

  if (category === 'algorithms') {
    return CODE_EXAMPLES.find(example => example.id === 'bubble-sort')?.code[lang]
      ?? buildStructureClassicTemplate(title, category, lang);
  }

  return buildStructureClassicTemplate(title, category, lang);
}

export function getClassicStudyExampleCode(
  title: string,
  category: string,
  lang: Language,
  mode: StudyExampleMode = 'complete',
): string {
  const key = normalizeTopicKey(title);
  if (mode === 'complete') {
    const special = CLASSIC_SPECIAL_EXAMPLES[key]?.[lang];
    if (special) return special;
    return buildCompleteClassicTemplate(title, category, lang);
  }
  return buildStructureClassicTemplate(title, category, lang);
}

// ---------- File Extensions ----------

export function getFileExtension(lang: Language): string {
  switch (lang) {
    case 'pascal': return '.pas';
    case 'c': return '.c';
    case 'java': return '.java';
    case 'pseudocode': return '.txt';
  }
}

export function getLanguageLabel(lang: Language): string {
  switch (lang) {
    case 'pascal': return 'Pascal';
    case 'c': return 'C';
    case 'java': return 'Java';
    case 'pseudocode': return 'Pseudocódigo';
  }
}

export const SUPPORTED_LANGUAGES: Language[] = ['pascal', 'c', 'java', 'pseudocode'];
