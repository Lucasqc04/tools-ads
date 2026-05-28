import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';

import {
  CLASSIC_STUDY_TOPICS,
  SUPPORTED_LANGUAGES,
  convertCode,
  getClassicStudyExampleCode,
  type StudyExampleMode,
} from '../lib/code-converter/index';
import type { Language } from '../lib/code-converter/types';

type CompileResult = { ok: boolean; message?: string };

type RoundTripStats = {
  total: number;
  ok: number;
  maxLineRatio: number;
};

type SuiteFailure = {
  suite: string;
  category: string;
  topic: string;
  sourceLang: Language;
  targetLang: Language;
  stage: 'convert' | 'compile-c' | 'compile-java' | 'compile-pascal' | 'snapshot' | 'quality' | 'roundtrip';
  message: string;
};

type SnapshotRecord = Record<string, string>;

type CategoryTotals = {
  conversions: number;
  conversionsOk: number;
  qualityTotal: number;
  qualityOk: number;
  cCompileTotal: number;
  cCompileOk: number;
  javaCompileTotal: number;
  javaCompileOk: number;
  pasCompileTotal: number;
  pasCompileOk: number;
};

type TargetTotals = {
  outputs: number;
  qualityTotal: number;
  qualityOk: number;
  compileTotal: number;
  compileOk: number;
};

type SuiteSource = {
  suite: string;
  category: string;
  topic: string;
  lang: Language;
  code: string;
};

const args = new Set(process.argv.slice(2));
const shouldUpdateSnapshots = args.has('--update');
const shouldCompileJava = args.has('--compile-java') || process.env.CODE_CONVERTER_COMPILE_JAVA === '1';
const workdir = fs.mkdtempSync(path.join(os.tmpdir(), 'code-converter-college-suite-'));
const snapshotFile = path.join(process.cwd(), 'lib/code-converter/__snapshots__/college-suite.complete.json');
const mode: StudyExampleMode = 'complete';

function hasCmd(cmd: string): boolean {
  try {
    execSync(`command -v ${cmd}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function slug(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'sample';
}

function normalizeOutput(code: string): string {
  return code.replace(/\r\n/g, '\n').trimEnd();
}

function digest(code: string): string {
  return crypto.createHash('sha256').update(normalizeOutput(code), 'utf8').digest('hex');
}

function runCmd(command: string, cwd: string): CompileResult {
  try {
    execSync(command, { cwd, stdio: 'pipe', maxBuffer: 1024 * 1024 * 8, timeout: 15_000 });
    return { ok: true };
  } catch (error: any) {
    const stderr = (error?.stderr ? String(error.stderr) : '').trim();
    const stdout = (error?.stdout ? String(error.stdout) : '').trim();
    return { ok: false, message: (stderr || stdout || String(error?.message || 'unknown error')).slice(0, 700) };
  }
}

function compileC(code: string, name: string): CompileResult {
  const dir = path.join(workdir, 'c', slug(name));
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${slug(name)}.c`);
  fs.writeFileSync(file, code, 'utf8');
  return runCmd(`gcc -fsyntax-only "${file}"`, dir);
}

function compilePascal(code: string, name: string): CompileResult {
  const dir = path.join(workdir, 'pascal', slug(name));
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${slug(name)}.pas`);
  fs.writeFileSync(file, code, 'utf8');
  return runCmd(`fpc -vw -S2 -Mobjfpc -FE"${dir}" -FU"${dir}" "${file}"`, dir);
}

function compileJava(code: string, name: string): CompileResult {
  const dir = path.join(workdir, 'java', slug(name));
  fs.mkdirSync(dir, { recursive: true });
  const classMatch = code.match(/public\s+class\s+([A-Za-z_][A-Za-z0-9_]*)/);
  const className = classMatch?.[1] ?? 'Programa';
  const file = path.join(dir, `${className}.java`);
  fs.writeFileSync(file, code, 'utf8');
  return runCmd(`javac -Xlint:none "${file}"`, dir);
}

const hasGcc = hasCmd('gcc');
const hasJavac = hasCmd('javac');
const canCompileJava = shouldCompileJava && hasJavac;
const hasFpc = hasCmd('fpc');
const previousSnapshots: SnapshotRecord = fs.existsSync(snapshotFile)
  ? JSON.parse(fs.readFileSync(snapshotFile, 'utf8')) as SnapshotRecord
  : {};
const nextSnapshots: SnapshotRecord = {};

const failures: SuiteFailure[] = [];
const perCategory = new Map<string, CategoryTotals>();
const perTarget = new Map<Language, TargetTotals>();
const qualityIssueBreakdown = new Map<string, number>();
const roundTripStats: RoundTripStats = { total: 0, ok: 0, maxLineRatio: 0 };

function categoryTotals(category: string): CategoryTotals {
  const existing = perCategory.get(category);
  if (existing) return existing;
  const created: CategoryTotals = {
    conversions: 0,
    conversionsOk: 0,
    qualityTotal: 0,
    qualityOk: 0,
    cCompileTotal: 0,
    cCompileOk: 0,
    javaCompileTotal: 0,
    javaCompileOk: 0,
    pasCompileTotal: 0,
    pasCompileOk: 0,
  };
  perCategory.set(category, created);
  return created;
}

function targetTotals(target: Language): TargetTotals {
  const existing = perTarget.get(target);
  if (existing) return existing;
  const created: TargetTotals = {
    outputs: 0,
    qualityTotal: 0,
    qualityOk: 0,
    compileTotal: 0,
    compileOk: 0,
  };
  perTarget.set(target, created);
  return created;
}

function normalizeSnippet(code: string): string {
  return code.trim().replace(/\r\n/g, '\n');
}

const EXTRA_W3SCHOOL_SOURCES: SuiteSource[] = [
  {
    suite: 'w3schools-extra',
    category: 'w3schools',
    topic: 'C If Else',
    lang: 'c',
    code: normalizeSnippet(`
#include <stdio.h>

int main() {
  int time = 20;
  if (time < 18) {
    printf("Good day.\\n");
  } else {
    printf("Good evening.\\n");
  }
  return 0;
}`),
  },
  {
    suite: 'w3schools-extra',
    category: 'w3schools',
    topic: 'C Switch Case',
    lang: 'c',
    code: normalizeSnippet(`
#include <stdio.h>

int main() {
  int day = 4;
  switch (day) {
    case 1: printf("Monday\\n"); break;
    case 2: printf("Tuesday\\n"); break;
    case 3: printf("Wednesday\\n"); break;
    default: printf("Other day\\n"); break;
  }
  return 0;
}`),
  },
  {
    suite: 'w3schools-extra',
    category: 'w3schools',
    topic: 'C While Loop',
    lang: 'c',
    code: normalizeSnippet(`
#include <stdio.h>

int main() {
  int i = 1;
  while (i <= 5) {
    printf("%d\\n", i);
    i++;
  }
  return 0;
}`),
  },
  {
    suite: 'w3schools-extra',
    category: 'w3schools',
    topic: 'C For Sum Array',
    lang: 'c',
    code: normalizeSnippet(`
#include <stdio.h>

int main() {
  int nums[5];
  int i;
  int sum = 0;
  nums[0] = 10; nums[1] = 20; nums[2] = 30; nums[3] = 40; nums[4] = 50;
  for (i = 0; i < 5; i++) {
    sum += nums[i];
  }
  printf("%d\\n", sum);
  return 0;
}`),
  },
  {
    suite: 'w3schools-extra',
    category: 'w3schools',
    topic: 'C Function Max',
    lang: 'c',
    code: normalizeSnippet(`
#include <stdio.h>

int max(int a, int b) {
  if (a > b) return a;
  return b;
}

int main() {
  printf("%d\\n", max(9, 4));
  return 0;
}`),
  },
  {
    suite: 'w3schools-extra',
    category: 'w3schools',
    topic: 'C Recursion Sum',
    lang: 'c',
    code: normalizeSnippet(`
#include <stdio.h>

int sumTo(int n) {
  if (n <= 1) return 1;
  return n + sumTo(n - 1);
}

int main() {
  printf("%d\\n", sumTo(5));
  return 0;
}`),
  },
  {
    suite: 'w3schools-extra',
    category: 'w3schools',
    topic: 'Java If Else',
    lang: 'java',
    code: normalizeSnippet(`
public class W3IfElse {
  public static void main(String[] args) {
    int time = 20;
    if (time < 18) {
      System.out.println("Good day.");
    } else {
      System.out.println("Good evening.");
    }
  }
}`),
  },
  {
    suite: 'w3schools-extra',
    category: 'w3schools',
    topic: 'Java While Loop',
    lang: 'java',
    code: normalizeSnippet(`
public class W3While {
  public static void main(String[] args) {
    int i = 1;
    while (i <= 5) {
      System.out.println(i);
      i++;
    }
  }
}`),
  },
  {
    suite: 'w3schools-extra',
    category: 'w3schools',
    topic: 'Java For Array Sum',
    lang: 'java',
    code: normalizeSnippet(`
public class W3ArraySum {
  public static void main(String[] args) {
    int[] nums = {10, 20, 30, 40, 50};
    int sum = 0;
    for (int i = 0; i < nums.length; i++) {
      sum += nums[i];
    }
    System.out.println(sum);
  }
}`),
  },
  {
    suite: 'w3schools-extra',
    category: 'w3schools',
    topic: 'C Do While',
    lang: 'c',
    code: normalizeSnippet(`
#include <stdio.h>

int main() {
  int i = 0;
  do {
    printf("%d\\n", i);
    i++;
  } while (i < 3);
  return 0;
}`),
  },
  {
    suite: 'w3schools-extra',
    category: 'w3schools',
    topic: 'C For Break',
    lang: 'c',
    code: normalizeSnippet(`
#include <stdio.h>

int main() {
  int i;
  for (i = 0; i < 10; i++) {
    if (i == 4) {
      break;
    }
    printf("%d\\n", i);
  }
  return 0;
}`),
  },
  {
    suite: 'w3schools-extra',
    category: 'w3schools',
    topic: 'Java Switch Case',
    lang: 'java',
    code: normalizeSnippet(`
public class W3Switch {
  public static void main(String[] args) {
    int day = 2;
    switch (day) {
      case 1:
        System.out.println("Monday");
        break;
      case 2:
        System.out.println("Tuesday");
        break;
      default:
        System.out.println("Other day");
        break;
    }
  }
}`),
  },
  {
    suite: 'w3schools-extra',
    category: 'w3schools',
    topic: 'Java Method Max',
    lang: 'java',
    code: normalizeSnippet(`
public class W3MethodMax {
  public static int max(int a, int b) {
    if (a > b) {
      return a;
    }
    return b;
  }

  public static void main(String[] args) {
    System.out.println(max(9, 4));
  }
}`),
  },
  {
    suite: 'w3schools-extra',
    category: 'w3schools',
    topic: 'Java Recursion Factorial',
    lang: 'java',
    code: normalizeSnippet(`
public class W3RecFactorial {
  public static int factorial(int n) {
    if (n <= 1) {
      return 1;
    }
    return n * factorial(n - 1);
  }

  public static void main(String[] args) {
    System.out.println(factorial(5));
  }
}`),
  },
  {
    suite: 'w3schools-extra',
    category: 'w3schools',
    topic: 'Java Do While',
    lang: 'java',
    code: normalizeSnippet(`
public class W3DoWhile {
  public static void main(String[] args) {
    int i = 0;
    do {
      System.out.println(i);
      i++;
    } while (i < 3);
  }
}`),
  },
];

const EXTRA_FACULTY_SOURCES: SuiteSource[] = [
  {
    suite: 'faculty-extra',
    category: 'faculty-extra',
    topic: 'Matriz 2x2 Soma',
    lang: 'c',
    code: normalizeSnippet(`
#include <stdio.h>

int main() {
  int a[4], b[4], c[4], i;
  a[0]=1; a[1]=2; a[2]=3; a[3]=4;
  b[0]=5; b[1]=6; b[2]=7; b[3]=8;
  for (i = 0; i < 4; i++) {
    c[i] = a[i] + b[i];
  }
  printf("%d\\n", c[3]);
  return 0;
}`),
  },
  {
    suite: 'faculty-extra',
    category: 'faculty-extra',
    topic: 'Busca Binaria Iterativa',
    lang: 'c',
    code: normalizeSnippet(`
#include <stdio.h>

int main() {
  int v[6], l = 0, r = 5, x = 9;
  v[0]=1; v[1]=3; v[2]=5; v[3]=7; v[4]=9; v[5]=11;
  while (l <= r) {
    int m = (l + r) / 2;
    if (v[m] == x) {
      printf("%d\\n", m);
      return 0;
    }
    if (v[m] < x) l = m + 1;
    else r = m - 1;
  }
  printf("-1\\n");
  return 0;
}`),
  },
  {
    suite: 'faculty-extra',
    category: 'faculty-extra',
    topic: 'Pilha Estatica Simples',
    lang: 'c',
    code: normalizeSnippet(`
#include <stdio.h>

int main() {
  int stack[5], top = -1;
  stack[++top] = 10;
  stack[++top] = 20;
  printf("%d\\n", stack[top--]);
  return 0;
}`),
  },
  {
    suite: 'faculty-extra',
    category: 'faculty-extra',
    topic: 'Fila Circular Simples',
    lang: 'c',
    code: normalizeSnippet(`
#include <stdio.h>

int main() {
  int q[5], front = 0, rear = 0;
  q[rear] = 10; rear = (rear + 1) % 5;
  q[rear] = 20; rear = (rear + 1) % 5;
  printf("%d\\n", q[front]);
  front = (front + 1) % 5;
  return 0;
}`),
  },
  {
    suite: 'faculty-extra',
    category: 'faculty-extra',
    topic: 'Lista Encadeada Percurso',
    lang: 'c',
    code: normalizeSnippet(`
#include <stdio.h>
#include <stdlib.h>

typedef struct No {
  int info;
  struct No *prox;
} No;

int main() {
  No *a = (No*)malloc(sizeof(No));
  No *b = (No*)malloc(sizeof(No));
  a->info = 1; b->info = 2;
  a->prox = b; b->prox = NULL;
  while (a != NULL) {
    printf("%d\\n", a->info);
    a = a->prox;
  }
  return 0;
}`),
  },
  {
    suite: 'faculty-extra',
    category: 'faculty-extra',
    topic: 'MDC Recursivo',
    lang: 'pascal',
    code: normalizeSnippet(`
program MDCRec;

function mdc(a, b: integer): integer;
begin
  if b = 0 then
    mdc := a
  else
    mdc := mdc(b, a mod b);
end;

begin
  writeln(mdc(48, 18));
end.`),
  },
  {
    suite: 'faculty-extra',
    category: 'faculty-extra',
    topic: 'ABB Buscar Simples',
    lang: 'pascal',
    code: normalizeSnippet(`
program ABBBusca;
type
  PNo = ^No;
  No = record
    chave: integer;
    esq, dir: PNo;
  end;

function buscar(raiz: PNo; valor: integer): boolean;
begin
  if raiz = nil then
    buscar := false
  else if raiz^.chave = valor then
    buscar := true
  else if valor < raiz^.chave then
    buscar := buscar(raiz^.esq, valor)
  else
    buscar := buscar(raiz^.dir, valor);
end;

begin
end.`),
  },
  {
    suite: 'faculty-extra',
    category: 'faculty-extra',
    topic: 'Lista Inserir Inicio',
    lang: 'pascal',
    code: normalizeSnippet(`
program ListaInserirInicio;
type
  PNo = ^No;
  No = record
    info: integer;
    prox: PNo;
  end;

procedure inserirInicio(var head: PNo; valor: integer);
var
  novo: PNo;
begin
  new(novo);
  novo^.info := valor;
  novo^.prox := head;
  head := novo;
end;

begin
end.`),
  },
  {
    suite: 'faculty-extra',
    category: 'faculty-extra',
    topic: 'Pilha Array Java',
    lang: 'java',
    code: normalizeSnippet(`
public class PilhaArray {
  public static void main(String[] args) {
    int[] pilha = new int[5];
    int topo = -1;
    pilha[++topo] = 10;
    pilha[++topo] = 20;
    System.out.println(pilha[topo--]);
  }
}`),
  },
  {
    suite: 'faculty-extra',
    category: 'faculty-extra',
    topic: 'Busca Binaria Java',
    lang: 'java',
    code: normalizeSnippet(`
public class BuscaBinariaJava {
  public static int buscar(int[] v, int x) {
    int l = 0;
    int r = v.length - 1;
    while (l <= r) {
      int m = (l + r) / 2;
      if (v[m] == x) {
        return m;
      }
      if (v[m] < x) {
        l = m + 1;
      } else {
        r = m - 1;
      }
    }
    return -1;
  }

  public static void main(String[] args) {
    int[] v = {1, 3, 5, 7, 9, 11};
    System.out.println(buscar(v, 7));
  }
}`),
  },
  {
    suite: 'faculty-extra',
    category: 'faculty-extra',
    topic: 'Fila Circular Funcoes C',
    lang: 'c',
    code: normalizeSnippet(`
#include <stdio.h>

int enfileira(int q[], int rear, int value, int size) {
  q[rear] = value;
  return (rear + 1) % size;
}

int desenfileira(int q[], int front, int size) {
  printf("%d\\n", q[front]);
  return (front + 1) % size;
}

int main() {
  int q[5], front = 0, rear = 0;
  rear = enfileira(q, rear, 10, 5);
  rear = enfileira(q, rear, 20, 5);
  front = desenfileira(q, front, 5);
  return 0;
}`),
  },
  {
    suite: 'faculty-extra',
    category: 'faculty-extra',
    topic: 'Arvore Altura Recursiva C',
    lang: 'c',
    code: normalizeSnippet(`
#include <stdio.h>

typedef struct No {
  int info;
  struct No *esq;
  struct No *dir;
} No;

int max(int a, int b) {
  if (a > b) {
    return a;
  }
  return b;
}

int altura(No *raiz) {
  if (raiz == NULL) {
    return 0;
  }
  return 1 + max(altura(raiz->esq), altura(raiz->dir));
}

int main() {
  return 0;
}`),
  },
];


function countNonEmptyLines(code: string): number {
  return normalizeOutput(code).split('\n').filter(line => line.trim().length > 0).length;
}

function assertPascalRoundTripQuality(source: SuiteSource): void {
  if (source.lang !== 'pascal') return;

  roundTripStats.total += 1;
  const originalLines = Math.max(1, countNonEmptyLines(source.code));
  let currentCode = source.code;
  let currentLang: Language = 'pascal';
  const chain: Language[] = ['c', 'java', 'pascal'];

  for (const nextLang of chain) {
    const converted = convertCode(currentCode, currentLang, nextLang);
    if (!converted.success) {
      failures.push({
        suite: source.suite,
        category: source.category,
        topic: source.topic,
        sourceLang: currentLang,
        targetLang: nextLang,
        stage: 'roundtrip',
        message: converted.warnings.map(w => w.message).join(' | ') || 'roundtrip conversion failed',
      });
      return;
    }
    currentCode = converted.output;
    currentLang = nextLang;
  }

  const finalPascal = normalizeOutput(currentCode);
  const finalLines = countNonEmptyLines(finalPascal);
  const ratio = finalLines / originalLines;
  roundTripStats.maxLineRatio = Math.max(roundTripStats.maxLineRatio, Number(ratio.toFixed(2)));
  const issues = runQualityChecks(finalPascal, 'pascal', source.category);
  if (ratio > 1.9) issues.push(`Roundtrip Pascal ficou grande demais (${finalLines}/${originalLines} linhas).`);
  if (!/\bprocedure\s+|\bfunction\s+/i.test(finalPascal) && /\bprocedure\s+|\bfunction\s+/i.test(source.code)) {
    issues.push('Roundtrip Pascal perdeu procedures/functions do exemplo original.');
  }

  if (issues.length > 0) {
    for (const issue of issues) {
      qualityIssueBreakdown.set(`roundtrip: ${issue}`, (qualityIssueBreakdown.get(`roundtrip: ${issue}`) ?? 0) + 1);
      failures.push({
        suite: source.suite,
        category: source.category,
        topic: source.topic,
        sourceLang: 'pascal',
        targetLang: 'pascal',
        stage: 'roundtrip',
        message: issue,
      });
    }
    return;
  }

  roundTripStats.ok += 1;
}

function buildSources(): SuiteSource[] {
  const sources: SuiteSource[] = [];

  for (const topic of CLASSIC_STUDY_TOPICS) {
    for (const sourceLang of SUPPORTED_LANGUAGES) {
      sources.push({
        suite: 'classic-complete',
        category: topic.category,
        topic: topic.title,
        lang: sourceLang,
        code: getClassicStudyExampleCode(topic.title, topic.category, sourceLang, mode),
      });
    }
  }

  sources.push(...EXTRA_W3SCHOOL_SOURCES);
  sources.push(...EXTRA_FACULTY_SOURCES);
  return sources;
}

function runQualityChecks(output: string, targetLang: Language, category: string): string[] {
  const issues: string[] = [];
  const check = (condition: boolean, message: string) => {
    if (condition) issues.push(message);
  };

  if (targetLang === 'c' || targetLang === 'java') {
    check(/\bif\s*\(\s*\(/.test(output), 'Condicional com parênteses duplos desnecessários.');
    check(/\bwhile\s*\(\s*\(/.test(output), 'While com parênteses duplos desnecessários.');
    check(/\breturn\s+\([A-Za-z_][A-Za-z0-9_.]*(?:->\w+)?\)\s*;/.test(output), 'Return com parênteses redundantes.');
    check(/=\s*\([A-Za-z_][A-Za-z0-9_.]*(?:->\w+)?\)\s*;/.test(output), 'Atribuição com parênteses redundantes.');
  }

  if (targetLang === 'pascal') {
    check(/\bif\s+\(/i.test(output), 'If Pascal com parênteses desnecessários.');
    check(/\bwhile\s+\(/i.test(output), 'While Pascal com parênteses desnecessários.');
    check(/:=\s*\([A-Za-z_][A-Za-z0-9_.^]*(?:\^\.\w+)?\)\s*;/i.test(output), 'Atribuição Pascal com parênteses redundantes.');
    check(/\b([A-Za-z_][A-Za-z0-9_]*)\s*:=\s*nil;\s*\n\s*\1\^\./i.test(output), 'Ponteiro Pascal inicializado com nil antes de acessar campos; use new(nome).');
    check(/begin\s*\n\s*exit;\s*\nend\./i.test(output), 'Programa Pascal com exit final desnecessário vindo de return 0.');
  }

  if (targetLang === 'c') {
    check(/#include <stdio\.h>/.test(output) && !/\bprintf\s*\(|\bscanf\s*\(/.test(output), 'include <stdio.h> sem uso.');
    check(/#include <stdlib\.h>/.test(output) && !/\bmalloc\s*\(|\bfree\s*\(|\bNULL\b/.test(output), 'include <stdlib.h> sem uso.');
    check(/#include <stddef\.h>/.test(output) && !/\bNULL\b/.test(output), 'include <stddef.h> sem uso.');
    check(/\*\*\s+[A-Za-z_]/.test(output), 'Ponteiro duplo com espaço desnecessário (use **head).');
    check(/\b(?:int|float|double|char)\s+([A-Za-z_][A-Za-z0-9_]*)\[[^\]]+\];[\s\S]*scanf\("%d",\s*&\1\);/.test(output), 'scanf em vetor perdeu o índice (esperado &v[i]).');
    check(/\bint\s+([A-Za-z_][A-Za-z0-9_]*)\s*;[\s\S]*\bfor\s*\(\s*int\s+\1\s*=/.test(output), 'Variável de controle declarada e redeclarada no for.');
  }

  if (category === 'basic') {
    if (targetLang === 'c') check(/\btypedef\s+struct\b/.test(output), 'Exemplo básico gerou struct desnecessária.');
    if (targetLang === 'java') check(/\bstatic class\b/.test(output), 'Exemplo básico gerou classe interna desnecessária.');
    if (targetLang === 'pascal') check(/\brecord\b/i.test(output), 'Exemplo básico gerou record desnecessário.');
  }

  if (targetLang === 'java') {
    check(/public\s+static\s+void\s+main[\s\S]*\breturn\s+\d+\s*;/.test(output), 'main Java com return numérico (inválido para void).');
    check(/import\s+java\.util\.Scanner;/.test(output) && !/\bSCANNER\.next/.test(output), 'Import Scanner sem uso.');
    check(/\bSCANNER\.close\(\);/.test(output) && !/\bSCANNER\.next/.test(output), 'SCANNER.close() sem leitura de entrada.');
  }

  return issues;
}

const sources = buildSources();

for (const source of sources) assertPascalRoundTripQuality(source);

for (const source of sources) {
  for (const targetLang of SUPPORTED_LANGUAGES) {
    if (targetLang === source.lang) continue;

    const totals = categoryTotals(source.category);
    totals.conversions += 1;

    const converted = convertCode(source.code, source.lang, targetLang);
    if (!converted.success) {
      failures.push({
        suite: source.suite,
        category: source.category,
        topic: source.topic,
        sourceLang: source.lang,
        targetLang,
        stage: 'convert',
        message: converted.warnings.map(w => w.message).join(' | ') || 'conversion failed without warnings',
      });
      continue;
    }

    totals.conversionsOk += 1;
    const perTargetTotals = targetTotals(targetLang);
    perTargetTotals.outputs += 1;
    const normalizedOutput = normalizeOutput(converted.output);
    const snapshotKey = `${source.suite}::${source.category}::${slug(source.topic)}::${source.lang}->${targetLang}`;
    const hash = digest(normalizedOutput);
    nextSnapshots[snapshotKey] = hash;

    if (!shouldUpdateSnapshots && previousSnapshots[snapshotKey] && previousSnapshots[snapshotKey] !== hash) {
      failures.push({
        suite: source.suite,
        category: source.category,
        topic: source.topic,
        sourceLang: source.lang,
        targetLang,
        stage: 'snapshot',
        message: `snapshot mismatch (${previousSnapshots[snapshotKey]} -> ${hash})`,
      });
    }

    totals.qualityTotal += 1;
    perTargetTotals.qualityTotal += 1;
    const qualityIssues = runQualityChecks(normalizedOutput, targetLang, source.category);
    if (qualityIssues.length === 0) {
      totals.qualityOk += 1;
      perTargetTotals.qualityOk += 1;
    } else {
      for (const issue of qualityIssues) {
        qualityIssueBreakdown.set(issue, (qualityIssueBreakdown.get(issue) ?? 0) + 1);
        failures.push({
          suite: source.suite,
          category: source.category,
          topic: source.topic,
          sourceLang: source.lang,
          targetLang,
          stage: 'quality',
          message: issue,
        });
      }
    }

    if (targetLang === 'c' && hasGcc) {
      totals.cCompileTotal += 1;
      perTargetTotals.compileTotal += 1;
      const compiled = compileC(normalizedOutput, `${source.topic}-${source.lang}-to-c`);
      if (compiled.ok) {
        totals.cCompileOk += 1;
        perTargetTotals.compileOk += 1;
      }
      else {
        failures.push({
          suite: source.suite,
          category: source.category,
          topic: source.topic,
          sourceLang: source.lang,
          targetLang,
          stage: 'compile-c',
          message: compiled.message || 'compile c failed',
        });
      }
    }

    if (targetLang === 'java' && canCompileJava) {
      totals.javaCompileTotal += 1;
      perTargetTotals.compileTotal += 1;
      const compiled = compileJava(normalizedOutput, `${source.topic}-${source.lang}-to-java`);
      if (compiled.ok) {
        totals.javaCompileOk += 1;
        perTargetTotals.compileOk += 1;
      }
      else {
        failures.push({
          suite: source.suite,
          category: source.category,
          topic: source.topic,
          sourceLang: source.lang,
          targetLang,
          stage: 'compile-java',
          message: compiled.message || 'compile java failed',
        });
      }
    }

    if (targetLang === 'pascal' && hasFpc) {
      totals.pasCompileTotal += 1;
      perTargetTotals.compileTotal += 1;
      const compiled = compilePascal(normalizedOutput, `${source.topic}-${source.lang}-to-pascal`);
      if (compiled.ok) {
        totals.pasCompileOk += 1;
        perTargetTotals.compileOk += 1;
      }
      else {
        failures.push({
          suite: source.suite,
          category: source.category,
          topic: source.topic,
          sourceLang: source.lang,
          targetLang,
          stage: 'compile-pascal',
          message: compiled.message || 'compile pascal failed',
        });
      }
    }
  }
}

if (shouldUpdateSnapshots || !fs.existsSync(snapshotFile)) {
  fs.mkdirSync(path.dirname(snapshotFile), { recursive: true });
  fs.writeFileSync(snapshotFile, `${JSON.stringify(nextSnapshots, null, 2)}\n`, 'utf8');
}

const categoryReport = Object.fromEntries(
  Array.from(perCategory.entries()).map(([category, totals]) => [category, {
    ...totals,
    conversionsFail: totals.conversions - totals.conversionsOk,
    qualityFail: totals.qualityTotal - totals.qualityOk,
    cCompileFail: totals.cCompileTotal - totals.cCompileOk,
    javaCompileFail: totals.javaCompileTotal - totals.javaCompileOk,
    pasCompileFail: totals.pasCompileTotal - totals.pasCompileOk,
  }]),
);

const targetReport = Object.fromEntries(
  Array.from(perTarget.entries()).map(([target, totals]) => [target, {
    ...totals,
    qualityFail: totals.qualityTotal - totals.qualityOk,
    compileFail: totals.compileTotal - totals.compileOk,
  }]),
);

const qualityIssueReport = Object.fromEntries(
  Array.from(qualityIssueBreakdown.entries())
    .sort(([a], [b]) => a.localeCompare(b)),
);

const report = {
  mode,
  sourceCount: sources.length,
  workdir,
  compilerAvailability: { gcc: hasGcc, javac: hasJavac, fpc: hasFpc },
  enabledCompilers: { c: hasGcc, java: canCompileJava, pascal: hasFpc },
  snapshotFile,
  snapshotEntries: Object.keys(nextSnapshots).length,
  snapshotsUpdated: shouldUpdateSnapshots || !fs.existsSync(snapshotFile),
  categoryReport,
  targetReport,
  qualityIssueReport,
  roundTripReport: {
    ...roundTripStats,
    fail: roundTripStats.total - roundTripStats.ok,
  },
  failureCount: failures.length,
  failures,
};

console.log(JSON.stringify(report, null, 2));
if (failures.length > 0) {
  process.exitCode = 1;
}
