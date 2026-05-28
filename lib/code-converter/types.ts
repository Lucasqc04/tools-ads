// ---------- AST Node Types ----------

export type Language = 'pascal' | 'c' | 'java' | 'pseudocode';

export type DataType = 'integer' | 'real' | 'char' | 'boolean' | 'string' | 'void' | 'unknown';

// ---------- AST Nodes ----------

export type ASTNode =
  | ProgramNode
  | VariableDeclaration
  | Assignment
  | IfNode
  | WhileNode
  | ForNode
  | RepeatUntilNode
  | DoWhileNode
  | FunctionNode
  | ProcedureNode
  | ReturnStatement
  | CallExpression
  | BinaryExpression
  | UnaryExpression
  | LiteralNode
  | IdentifierNode
  | ArrayAccessNode
  | ArrayDeclaration
  | ReadStatement
  | WriteStatement
  | SwitchNode
  | BreakStatement
  | CommentNode
  | RecordNode
  | BlockNode;

export interface ProgramNode {
  type: 'Program';
  name?: string;
  body: ASTNode[];
  functions: (FunctionNode | ProcedureNode)[];
  variables: VariableDeclaration[];
}

export interface VariableDeclaration {
  type: 'VariableDeclaration';
  name: string;
  dataType: DataType;
  rawType?: string;
  arraySize?: number;
  initialValue?: ASTNode;
}

export interface Assignment {
  type: 'Assignment';
  target: IdentifierNode | ArrayAccessNode;
  value: ASTNode;
}

export interface IfNode {
  type: 'If';
  condition: ASTNode;
  thenBody: ASTNode[];
  elseBody?: ASTNode[];
}

export interface WhileNode {
  type: 'While';
  condition: ASTNode;
  body: ASTNode[];
}

export interface ForNode {
  type: 'For';
  variable: string;
  start: ASTNode;
  end: ASTNode;
  step?: ASTNode;
  ascending: boolean;
  body: ASTNode[];
}

export interface RepeatUntilNode {
  type: 'RepeatUntil';
  condition: ASTNode;
  body: ASTNode[];
}

export interface DoWhileNode {
  type: 'DoWhile';
  condition: ASTNode;
  body: ASTNode[];
}

export interface FunctionNode {
  type: 'Function';
  name: string;
  params: ParameterDefinition[];
  returnType: DataType;
  body: ASTNode[];
  localVars: VariableDeclaration[];
}

export interface ProcedureNode {
  type: 'Procedure';
  name: string;
  params: ParameterDefinition[];
  body: ASTNode[];
  localVars: VariableDeclaration[];
}

export interface ParameterDefinition {
  name: string;
  dataType: DataType;
  rawType?: string;
  byRef?: boolean;
}

export interface ReturnStatement {
  type: 'Return';
  value?: ASTNode;
}

export interface CallExpression {
  type: 'Call';
  name: string;
  args: ASTNode[];
}

export interface BinaryExpression {
  type: 'Binary';
  operator: string;
  left: ASTNode;
  right: ASTNode;
}

export interface UnaryExpression {
  type: 'Unary';
  operator: string;
  operand: ASTNode;
}

export interface LiteralNode {
  type: 'Literal';
  value: string | number | boolean;
  dataType: DataType;
}

export interface IdentifierNode {
  type: 'Identifier';
  name: string;
}

export interface ArrayAccessNode {
  type: 'ArrayAccess';
  array: string;
  index: ASTNode;
}

export interface ArrayDeclaration {
  type: 'ArrayDeclaration';
  name: string;
  elementType: DataType;
  size: number;
}

export interface ReadStatement {
  type: 'Read';
  variables: string[];
}

export interface WriteStatement {
  type: 'Write';
  args: ASTNode[];
  newline: boolean;
}

export interface SwitchNode {
  type: 'Switch';
  expression: ASTNode;
  cases: { value: ASTNode; body: ASTNode[] }[];
  defaultBody?: ASTNode[];
}

export interface BreakStatement {
  type: 'Break';
}

export interface CommentNode {
  type: 'Comment';
  text: string;
}

export interface RecordNode {
  type: 'Record';
  name: string;
  fields: { name: string; dataType: DataType }[];
}

export interface BlockNode {
  type: 'Block';
  body: ASTNode[];
}

// ---------- Token Types ----------

export type TokenType =
  | 'keyword' | 'identifier' | 'number' | 'string' | 'operator'
  | 'punctuation' | 'comment' | 'whitespace' | 'newline' | 'eof' | 'unknown';

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  col: number;
}

// ---------- Conversion Result ----------

export interface ConversionExplanation {
  sourceLine: number;
  targetLine: number;
  sourceCode: string;
  targetCode: string;
  explanation: string;
}

export interface ConversionWarning {
  line: number;
  message: string;
  severity: 'info' | 'warning' | 'error';
}

export interface ConversionResult {
  success: boolean;
  output: string;
  explanations: ConversionExplanation[];
  warnings: ConversionWarning[];
  stats: CodeStats;
}

export interface CodeStats {
  lines: number;
  variables: number;
  loops: number;
  functions: number;
  conditionals: number;
  arrays: number;
  pointers: number;
  ioOperations: number;
  comments: number;
  userTypes: number;
  detectedLanguage: Language | null;
}

// ---------- Example ----------

export interface CodeExample {
  id: string;
  title: string;
  description: string;
  category: string;
  code: Record<Language, string>;
}
