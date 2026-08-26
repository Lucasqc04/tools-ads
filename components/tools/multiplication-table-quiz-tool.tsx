'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Printer, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { trackEvent, TOOL_ID } from '@/lib/analytics';
import type { AppLocale } from '@/lib/i18n/config';
import { cn } from '@/lib/cn';
import {
  buildMultiplicationTable,
  bestScoreKey,
  buildWorksheetRows,
  computeAccuracy,
  formatDuration,
  generateQuizRound,
  isNewBestScore,
  MAX_TABLE_NUMBER,
  QUESTIONS_PER_ROUND,
  recordMistake,
  type BestScore,
  type MistakeEntry,
  type QuizAnswerRecord,
  type QuizDifficulty,
  type QuizQuestion,
} from '@/lib/multiplication-table-quiz';

type MultiplicationTableQuizToolProps = Readonly<{
  locale?: AppLocale;
  initialTableNumber?: number;
}>;

const BEST_KEY = 'multiplication-table-quiz-best-v1';
const MISTAKES_KEY = 'multiplication-table-quiz-mistakes-v1';

type ViewMode = 'table' | 'quiz';

type UiCopy = {
  tableTab: string;
  quizTab: string;
  selectNumber: string;
  print: string;
  worksheetTitle: (n: number) => string;
  difficulty: string;
  easy: string;
  medium: string;
  hard: string;
  restrictToTable: (n: number) => string;
  startQuiz: string;
  question: (index: number, total: number) => string;
  answerPlaceholder: string;
  submit: string;
  correct: string;
  incorrect: string;
  resultTitle: string;
  accuracyLabel: string;
  timeLabel: string;
  newBest: string;
  bestLabel: string;
  mistakesTitle: string;
  mistakesEmpty: string;
  tryAgain: string;
  privacy: string;
};

const uiByLocale: Record<AppLocale, UiCopy> = {
  'pt-br': {
    tableTab: 'Ver tabuada',
    quizTab: 'Quiz',
    selectNumber: 'Escolha o número',
    print: 'Imprimir folha de exercícios',
    worksheetTitle: (n) => `Folha de exercícios — Tabuada do ${n}`,
    difficulty: 'Dificuldade',
    easy: 'Fácil (até 5)',
    medium: 'Médio (até 10)',
    hard: 'Difícil (até 12)',
    restrictToTable: (n) => `Treinar apenas a tabuada do ${n}`,
    startQuiz: 'Começar quiz',
    question: (index, total) => `Pergunta ${index} de ${total}`,
    answerPlaceholder: 'Sua resposta',
    submit: 'Confirmar',
    correct: 'Certo!',
    incorrect: 'Errado',
    resultTitle: 'Resultado do quiz',
    accuracyLabel: 'Acertos',
    timeLabel: 'Tempo total',
    newBest: 'Novo recorde!',
    bestLabel: 'Seu recorde',
    mistakesTitle: 'Erros mais frequentes',
    mistakesEmpty: 'Nenhum erro registrado ainda. Bom trabalho!',
    tryAgain: 'Tentar de novo',
    privacy: '🔒 Tudo acontece localmente no seu navegador. Nada é enviado para um servidor.',
  },
  en: {
    tableTab: 'View table',
    quizTab: 'Quiz',
    selectNumber: 'Choose a number',
    print: 'Print worksheet',
    worksheetTitle: (n) => `Practice worksheet — Times table of ${n}`,
    difficulty: 'Difficulty',
    easy: 'Easy (up to 5)',
    medium: 'Medium (up to 10)',
    hard: 'Hard (up to 12)',
    restrictToTable: (n) => `Only practice the ${n} times table`,
    startQuiz: 'Start quiz',
    question: (index, total) => `Question ${index} of ${total}`,
    answerPlaceholder: 'Your answer',
    submit: 'Submit',
    correct: 'Correct!',
    incorrect: 'Incorrect',
    resultTitle: 'Quiz results',
    accuracyLabel: 'Accuracy',
    timeLabel: 'Total time',
    newBest: 'New best score!',
    bestLabel: 'Your best',
    mistakesTitle: 'Most frequent mistakes',
    mistakesEmpty: 'No mistakes recorded yet. Nice work!',
    tryAgain: 'Try again',
    privacy: '🔒 Everything runs locally in your browser. Nothing is sent to a server.',
  },
  es: {
    tableTab: 'Ver tabla',
    quizTab: 'Quiz',
    selectNumber: 'Elige un número',
    print: 'Imprimir hoja de ejercicios',
    worksheetTitle: (n) => `Hoja de ejercicios — Tabla del ${n}`,
    difficulty: 'Dificultad',
    easy: 'Fácil (hasta 5)',
    medium: 'Medio (hasta 10)',
    hard: 'Difícil (hasta 12)',
    restrictToTable: (n) => `Practicar solo la tabla del ${n}`,
    startQuiz: 'Comenzar quiz',
    question: (index, total) => `Pregunta ${index} de ${total}`,
    answerPlaceholder: 'Tu respuesta',
    submit: 'Confirmar',
    correct: '¡Correcto!',
    incorrect: 'Incorrecto',
    resultTitle: 'Resultado del quiz',
    accuracyLabel: 'Aciertos',
    timeLabel: 'Tiempo total',
    newBest: '¡Nuevo récord!',
    bestLabel: 'Tu récord',
    mistakesTitle: 'Errores más frecuentes',
    mistakesEmpty: 'Aún no hay errores registrados. ¡Buen trabajo!',
    tryAgain: 'Intentar de nuevo',
    privacy: '🔒 Todo ocurre localmente en tu navegador. Nada se envía a un servidor.',
  },
};

const readBestScores = (): Record<string, BestScore> => {
  try {
    const stored = localStorage.getItem(BEST_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const readMistakes = (): MistakeEntry[] => {
  try {
    const stored = localStorage.getItem(MISTAKES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export function MultiplicationTableQuizTool({
  locale = 'pt-br',
  initialTableNumber,
}: MultiplicationTableQuizToolProps) {
  const ui = uiByLocale[locale];
  const defaultNumber = initialTableNumber ?? 2;

  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedNumber, setSelectedNumber] = useState(defaultNumber);
  const [difficulty, setDifficulty] = useState<QuizDifficulty>('easy');
  const [restrictToTable, setRestrictToTable] = useState(Boolean(initialTableNumber));

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswerRecord[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [roundResult, setRoundResult] = useState<{ accuracy: number; timeMs: number } | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);
  const [bestScores, setBestScores] = useState<Record<string, BestScore>>({});
  const [mistakes, setMistakes] = useState<MistakeEntry[]>([]);

  const startTimeRef = useRef<number | null>(null);
  const questionStartRef = useRef<number>(0);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    setBestScores(readBestScores());
    setMistakes(readMistakes());
  }, []);

  const markStarted = useCallback(() => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      trackEvent('tool_started', { tool: TOOL_ID.multiplicationTableQuiz, locale });
    }
  }, [locale]);

  const tableRows = useMemo(
    () => buildMultiplicationTable(selectedNumber),
    [selectedNumber],
  );

  const worksheetRows = useMemo(
    () => buildWorksheetRows(selectedNumber),
    [selectedNumber],
  );

  const currentBestKey = bestScoreKey(difficulty, restrictToTable ? selectedNumber : null);
  const currentBest = bestScores[currentBestKey];

  const startQuiz = useCallback(() => {
    markStarted();
    trackEvent('generation_started', {
      tool: TOOL_ID.multiplicationTableQuiz,
      locale,
      mode: 'quiz',
      difficulty,
    });

    const round = generateQuizRound(
      difficulty,
      QUESTIONS_PER_ROUND,
      restrictToTable ? selectedNumber : undefined,
    );

    setQuestions(round);
    setCurrentIndex(0);
    setAnswers([]);
    setInputValue('');
    setFeedback(null);
    setRoundResult(null);
    setIsNewBest(false);
    startTimeRef.current = Date.now();
    questionStartRef.current = Date.now();
  }, [difficulty, locale, markStarted, restrictToTable, selectedNumber]);

  const persistMistake = useCallback((question: QuizQuestion, given: number) => {
    setMistakes((prev) => {
      const next = recordMistake(prev, question, given);
      try {
        localStorage.setItem(MISTAKES_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const finishRound = useCallback(
    (finalAnswers: QuizAnswerRecord[]) => {
      const accuracy = computeAccuracy(finalAnswers);
      const timeMs = Date.now() - (startTimeRef.current ?? Date.now());
      setRoundResult({ accuracy, timeMs });

      const candidate: BestScore = { accuracy, timeMs };
      const current = bestScores[currentBestKey];
      const beatBest = isNewBestScore(candidate, current);
      setIsNewBest(beatBest);

      if (beatBest) {
        setBestScores((prev) => {
          const next = { ...prev, [currentBestKey]: candidate };
          try {
            localStorage.setItem(BEST_KEY, JSON.stringify(next));
          } catch {
            // ignore
          }
          return next;
        });
      }

      trackEvent('tool_completed', {
        tool: TOOL_ID.multiplicationTableQuiz,
        locale,
        accuracy,
        difficulty,
      });
    },
    [bestScores, currentBestKey, difficulty, locale],
  );

  const submitAnswer = useCallback(() => {
    const question = questions[currentIndex];
    if (!question) {
      return;
    }

    const givenAnswer = Number(inputValue);
    const isCorrect = givenAnswer === question.answer;
    const elapsedMs = Date.now() - questionStartRef.current;

    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (!isCorrect) {
      persistMistake(question, Number.isFinite(givenAnswer) ? givenAnswer : 0);
    }

    const record: QuizAnswerRecord = { question, givenAnswer, isCorrect, elapsedMs };
    const nextAnswers = [...answers, record];
    setAnswers(nextAnswers);

    window.setTimeout(() => {
      setFeedback(null);
      setInputValue('');

      if (currentIndex + 1 >= questions.length) {
        finishRound(nextAnswers);
      } else {
        setCurrentIndex((prev) => prev + 1);
        questionStartRef.current = Date.now();
      }
    }, 600);
  }, [answers, currentIndex, finishRound, inputValue, persistMistake, questions]);

  const handlePrint = useCallback(() => {
    markStarted();
    trackEvent('result_downloaded', {
      tool: TOOL_ID.multiplicationTableQuiz,
      locale,
      format: 'print',
    });
    window.print();
  }, [locale, markStarted]);

  const currentQuestion = questions[currentIndex];

  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <div className="flex gap-2">
          <button
            type="button"
            aria-pressed={viewMode === 'table'}
            onClick={() => {
              markStarted();
              setViewMode('table');
            }}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition',
              viewMode === 'table' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
            )}
          >
            {ui.tableTab}
          </button>
          <button
            type="button"
            aria-pressed={viewMode === 'quiz'}
            onClick={() => {
              markStarted();
              setViewMode('quiz');
            }}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition',
              viewMode === 'quiz' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
            )}
          >
            {ui.quizTab}
          </button>
        </div>

        {viewMode === 'table' ? (
          <div className="mt-4 space-y-4">
            <Card className="p-4 md:p-6">
              <p className="mb-2 text-xs font-medium text-slate-500">{ui.selectNumber}</p>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: MAX_TABLE_NUMBER }, (_, index) => index + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={selectedNumber === n}
                    onClick={() => {
                      markStarted();
                      setSelectedNumber(n);
                    }}
                    className={cn(
                      'h-9 w-9 rounded-lg text-sm font-semibold transition',
                      selectedNumber === n
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3 md:grid-cols-4">
                {tableRows.map((row) => (
                  <p key={row.multiplier} className="font-mono text-sm text-slate-800">
                    {row.factor} x {row.multiplier} = <span className="font-semibold">{row.result}</span>
                  </p>
                ))}
              </div>

              <Button variant="secondary" className="mt-4 h-9 px-3 text-xs" onClick={handlePrint}>
                <Printer className="mr-1.5 h-3.5 w-3.5" /> {ui.print}
              </Button>
            </Card>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {!questions.length || roundResult ? (
              <Card className="space-y-4 p-4 md:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">{ui.difficulty}</span>
                  {(['easy', 'medium', 'hard'] as QuizDifficulty[]).map((level) => (
                    <button
                      key={level}
                      type="button"
                      aria-pressed={difficulty === level}
                      onClick={() => setDifficulty(level)}
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-semibold transition',
                        difficulty === level
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                      )}
                    >
                      {level === 'easy' ? ui.easy : level === 'medium' ? ui.medium : ui.hard}
                    </button>
                  ))}
                </div>

                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={restrictToTable}
                    onChange={(event) => setRestrictToTable(event.target.checked)}
                  />
                  {ui.restrictToTable(selectedNumber)}
                </label>

                {currentBest ? (
                  <p className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Trophy className="h-3.5 w-3.5 text-amber-500" />
                    {ui.bestLabel}: {currentBest.accuracy}% · {formatDuration(currentBest.timeMs)}
                  </p>
                ) : null}

                {roundResult ? (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-base font-semibold text-slate-900">{ui.resultTitle}</p>
                    <p className="mt-1 text-sm text-slate-700">
                      {ui.accuracyLabel}: {roundResult.accuracy}% · {ui.timeLabel}: {formatDuration(roundResult.timeMs)}
                    </p>
                    {isNewBest ? (
                      <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-amber-600">
                        <Trophy className="h-4 w-4" /> {ui.newBest}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                <Button variant="primary" onClick={startQuiz}>
                  {ui.startQuiz}
                </Button>
              </Card>
            ) : null}

            {questions.length > 0 && !roundResult && currentQuestion ? (
              <Card className="space-y-4 p-4 md:p-6 text-center">
                <p className="text-xs font-medium text-slate-500">
                  {ui.question(currentIndex + 1, questions.length)}
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {currentQuestion.a} x {currentQuestion.b} = ?
                </p>
                <form
                  className="flex items-center justify-center gap-2"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (inputValue.trim() !== '' && !feedback) {
                      submitAnswer();
                    }
                  }}
                >
                  <Input
                    type="number"
                    inputMode="numeric"
                    autoFocus
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    placeholder={ui.answerPlaceholder}
                    className="w-32 text-center text-lg"
                    disabled={Boolean(feedback)}
                  />
                  <Button type="submit" variant="primary" disabled={inputValue.trim() === '' || Boolean(feedback)}>
                    {ui.submit}
                  </Button>
                </form>
                {feedback ? (
                  <p
                    className={cn(
                      'text-sm font-semibold',
                      feedback === 'correct' ? 'text-emerald-600' : 'text-red-600',
                    )}
                  >
                    {feedback === 'correct' ? ui.correct : ui.incorrect}
                  </p>
                ) : null}
              </Card>
            ) : null}

            <Card className="p-4 md:p-6">
              <p className="mb-2 text-sm font-semibold text-slate-700">{ui.mistakesTitle}</p>
              {mistakes.length === 0 ? (
                <p className="text-xs text-slate-400">{ui.mistakesEmpty}</p>
              ) : (
                <ul className="space-y-1">
                  {mistakes.slice(0, 8).map((mistake) => (
                    <li key={`${mistake.a}x${mistake.b}`} className="font-mono text-sm text-slate-700">
                      {mistake.a} x {mistake.b} = {mistake.correct}{' '}
                      <span className="text-xs text-slate-400">
                        ({mistake.count}x, {locale === 'en' ? 'last try' : locale === 'es' ? 'último intento' : 'última tentativa'}: {mistake.lastGiven})
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        )}

        <p className="mt-4 text-xs text-slate-400">{ui.privacy}</p>
      </div>

      <div className="hidden print:block">
        <h2 className="mb-4 text-xl font-bold">{ui.worksheetTitle(selectedNumber)}</h2>
        <div className="grid grid-cols-2 gap-4">
          {worksheetRows.map((row) => (
            <p key={row.multiplier} className="text-lg">
              {row.factor} x {row.multiplier} = ______
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
