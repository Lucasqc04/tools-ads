export type QuizDifficulty = 'easy' | 'medium' | 'hard';

export type DifficultyRange = { min: number; max: number };

export const difficultyRanges: Record<QuizDifficulty, DifficultyRange> = {
  easy: { min: 1, max: 5 },
  medium: { min: 1, max: 10 },
  hard: { min: 1, max: 12 },
};

export const MAX_TABLE_NUMBER = 12;
export const TABLE_ROWS_COUNT = 12;
export const QUESTIONS_PER_ROUND = 10;

export type TableRow = {
  factor: number;
  multiplier: number;
  result: number;
};

export const buildMultiplicationTable = (
  factor: number,
  upTo: number = TABLE_ROWS_COUNT,
): TableRow[] =>
  Array.from({ length: upTo }, (_, index) => {
    const multiplier = index + 1;
    return { factor, multiplier, result: factor * multiplier };
  });

export type QuizQuestion = {
  a: number;
  b: number;
  answer: number;
};

const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const generateQuizQuestion = (
  difficulty: QuizDifficulty,
  fixedFactor?: number,
): QuizQuestion => {
  const range = difficultyRanges[difficulty];
  const a = fixedFactor ?? randomInt(range.min, range.max);
  const b = randomInt(range.min, range.max);

  return { a, b, answer: a * b };
};

export const generateQuizRound = (
  difficulty: QuizDifficulty,
  count: number = QUESTIONS_PER_ROUND,
  fixedFactor?: number,
): QuizQuestion[] => Array.from({ length: count }, () => generateQuizQuestion(difficulty, fixedFactor));

export type QuizAnswerRecord = {
  question: QuizQuestion;
  givenAnswer: number;
  isCorrect: boolean;
  elapsedMs: number;
};

export const computeAccuracy = (records: QuizAnswerRecord[]): number => {
  if (records.length === 0) {
    return 0;
  }

  const correctCount = records.filter((record) => record.isCorrect).length;
  return Math.round((correctCount / records.length) * 100);
};

export const formatDuration = (ms: number): string => {
  const totalSeconds = ms / 1000;
  if (totalSeconds < 60) {
    return `${totalSeconds.toFixed(1)}s`;
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return `${minutes}m ${seconds}s`;
};

export type BestScore = {
  accuracy: number;
  timeMs: number;
};

export const bestScoreKey = (difficulty: QuizDifficulty, tableNumber: number | null): string =>
  `${difficulty}:${tableNumber ?? 'mixed'}`;

export const isNewBestScore = (candidate: BestScore, current: BestScore | undefined): boolean => {
  if (!current) {
    return true;
  }

  if (candidate.accuracy > current.accuracy) {
    return true;
  }

  return candidate.accuracy === current.accuracy && candidate.timeMs < current.timeMs;
};

export type MistakeEntry = {
  a: number;
  b: number;
  correct: number;
  lastGiven: number;
  count: number;
};

const mistakeKey = (a: number, b: number): string => {
  const [min, max] = a <= b ? [a, b] : [b, a];
  return `${min}x${max}`;
};

const MAX_TRACKED_MISTAKES = 20;

export const recordMistake = (
  mistakes: MistakeEntry[],
  question: QuizQuestion,
  givenAnswer: number,
): MistakeEntry[] => {
  const key = mistakeKey(question.a, question.b);
  const existingIndex = mistakes.findIndex((entry) => mistakeKey(entry.a, entry.b) === key);

  if (existingIndex >= 0) {
    const updated = [...mistakes];
    const existing = updated[existingIndex];
    updated[existingIndex] = {
      ...existing,
      lastGiven: givenAnswer,
      count: existing.count + 1,
    };
    return updated.sort((a, b) => b.count - a.count).slice(0, MAX_TRACKED_MISTAKES);
  }

  const next: MistakeEntry[] = [
    ...mistakes,
    { a: question.a, b: question.b, correct: question.answer, lastGiven: givenAnswer, count: 1 },
  ];

  return next.sort((a, b) => b.count - a.count).slice(0, MAX_TRACKED_MISTAKES);
};

export const buildWorksheetRows = (factor: number, upTo: number = TABLE_ROWS_COUNT): TableRow[] =>
  buildMultiplicationTable(factor, upTo);
