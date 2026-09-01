import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';

export type MultiplicationTableQuizContent = {
  name: string;
  shortDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  intro: string;
  contentBlocks: ContentBlock[];
  faq: FaqItem[];
};

const contentByLocale: Record<AppLocale, MultiplicationTableQuizContent> = {
  'pt-br': {
    name: 'Tabuada com Quiz',
    shortDescription:
      'Consulte a tabuada de 1 a 12, treine com quiz de dificuldade ajustável, cronômetro, recorde salvo e folha de exercícios para imprimir.',
    primaryKeyword: 'tabuada com quiz',
    secondaryKeywords: [
      'tabuada online',
      'tabuada para treinar',
      'quiz de tabuada',
      'jogo de tabuada',
      'folha de exercicios de tabuada',
      'tabuada de multiplicar',
    ],
    searchIntent:
      'Estudantes, pais e professores que querem consultar a tabuada e treinar multiplicação com quiz cronometrado e acompanhamento de erros.',
    seoTitle: 'Tabuada com Quiz Online | Treino de Multiplicação Grátis',
    seoDescription:
      'Consulte a tabuada de 1 a 12 e treine com quiz cronometrado em 3 níveis de dificuldade. Veja recorde salvo, erros mais frequentes e imprima folha de exercícios.',
    h1: 'Tabuada com Quiz: Consulte e Treine a Multiplicação Online',
    intro:
      'Veja a tabuada completa de qualquer número, treine com um quiz cronometrado em 3 níveis e imprima uma folha de exercícios em branco.',
    contentBlocks: [
      {
        title: 'Como usar a tabuada e o quiz',
        paragraphs: [
          'Escolha um número de 1 a 12 para ver a tabuada completa, do 1x até o 12x, com o resultado de cada multiplicação. Para treinar, mude para o modo quiz, escolha a dificuldade (fácil: números até 5, médio: até 10, difícil: até 12) e responda 10 perguntas seguidas o mais rápido possível.',
          'Ao final do quiz você vê sua pontuação, o tempo total e, se quebrou seu recorde anterior para aquela dificuldade, isso fica salvo no navegador para a próxima visita. As perguntas que você errou ficam registradas em uma lista de "erros mais frequentes" para você saber exatamente onde focar o treino.',
        ],
      },
      {
        title: 'Por que treinar a tabuada com quiz cronometrado',
        paragraphs: [
          'Decorar a tabuada fica mais fácil quando existe repetição com feedback imediato: responder rápido e ver na hora se acertou ajuda a fixar o resultado de cada multiplicação. O cronômetro cria um empurrão saudável para treinar velocidade além de precisão, o que é exatamente o que provas e atividades escolares cronometradas cobram.',
        ],
        list: [
          'Comece pelo nível fácil (até 5x) antes de avançar.',
          'Repita o quiz do mesmo número algumas vezes seguidas.',
          'Use a lista de erros mais frequentes para revisar antes da próxima tentativa.',
          'Imprima a folha de exercícios para praticar sem tela.',
        ],
      },
      {
        title: 'Folha de exercícios para imprimir',
        paragraphs: [
          'Na visualização da tabuada de um número, use o botão de imprimir para gerar uma folha de exercícios em branco daquele número (por exemplo, 7 x 1 = ___, 7 x 2 = ___, até 7 x 12 = ___), pronta para o aluno preencher no papel. É uma forma simples de praticar longe da tela ou de reforçar o conteúdo em casa.',
        ],
      },
      {
        title: 'Processamento local e privacidade',
        paragraphs: [
          'O quiz, o cronômetro, o recorde salvo e a lista de erros mais frequentes funcionam inteiramente no seu navegador. Nenhuma resposta ou pontuação é enviada para um servidor.',
        ],
      },
    ],
    faq: [
      {
        question: 'A tabuada vai até qual número?',
        answer:
          'A ferramenta mostra a tabuada de 1 a 12 para qualquer número escolhido, cobrindo o conteúdo mais comum do ensino fundamental.',
      },
      {
        question: 'Como funciona a dificuldade do quiz?',
        answer:
          'Fácil sorteia números até 5, médio até 10 e difícil até 12. Cada rodada tem 10 perguntas cronometradas.',
      },
      {
        question: 'O recorde fica salvo?',
        answer:
          'Sim. O melhor resultado (maior acerto e menor tempo) de cada dificuldade fica salvo localmente no seu navegador.',
      },
      {
        question: 'Posso imprimir uma folha de exercícios?',
        answer:
          'Sim. Na visualização da tabuada de um número, use o botão de imprimir para gerar uma folha de exercícios em branco daquele número.',
      },
      {
        question: 'É gratuito e funciona no celular?',
        answer:
          'Sim. A ferramenta é gratuita, não exige cadastro e funciona normalmente em navegadores mobile.',
      },
    ],
  },
  en: {
    name: 'Multiplication Table Quiz',
    shortDescription:
      'Look up the times table from 1 to 12, practice with an adjustable-difficulty quiz, timer, saved best score, and a printable worksheet.',
    primaryKeyword: 'multiplication table quiz',
    secondaryKeywords: [
      'times table online',
      'times table practice',
      'multiplication quiz',
      'multiplication game',
      'multiplication worksheet printable',
      'times table chart',
    ],
    searchIntent:
      'Students, parents, and teachers who want to look up the times table and practice multiplication with a timed quiz and mistake tracking.',
    seoTitle: 'Multiplication Table Quiz Online | Free Times Table Practice',
    seoDescription:
      'Look up the times table from 1 to 12 and practice with a timed quiz across 3 difficulty levels. See your saved best score, most frequent mistakes, and print a worksheet.',
    h1: 'Multiplication Table Quiz: Look Up and Practice Times Tables Online',
    intro:
      'View the full times table for any number, practice with a timed quiz across 3 levels, and print a blank practice worksheet.',
    contentBlocks: [
      {
        title: 'How to use the times table and quiz',
        paragraphs: [
          'Pick a number from 1 to 12 to see its full times table, from 1x through 12x, with the result of each multiplication. To practice, switch to quiz mode, choose a difficulty (easy: numbers up to 5, medium: up to 10, hard: up to 12), and answer 10 questions in a row as fast as possible.',
          'At the end of the quiz you see your score, total time, and — if you beat your previous best for that difficulty — it gets saved in your browser for next time. Questions you got wrong are tracked in a "most frequent mistakes" list so you know exactly what to review.',
        ],
      },
      {
        title: 'Why practice with a timed quiz',
        paragraphs: [
          'Memorizing the times table gets easier with repetition and immediate feedback: answering quickly and seeing right away whether you got it right helps the result stick. The timer creates a healthy push to train speed as well as accuracy, which is exactly what timed school tests and worksheets require.',
        ],
        list: [
          'Start with the easy level (up to 5x) before moving up.',
          'Repeat the quiz for the same number a few times in a row.',
          'Use the most-frequent-mistakes list to review before your next attempt.',
          'Print the worksheet to practice away from a screen.',
        ],
      },
      {
        title: 'Printable practice worksheet',
        paragraphs: [
          'From a number\'s times table view, use the print button to generate a blank worksheet for that number (e.g. 7 x 1 = ___, 7 x 2 = ___, through 7 x 12 = ___), ready for a student to fill in on paper. It\'s a simple way to practice away from a screen or reinforce the material at home.',
        ],
      },
      {
        title: 'Local processing and privacy',
        paragraphs: [
          'The quiz, timer, saved best score, and mistakes list all run entirely in your browser. No answer or score is sent to a server.',
        ],
      },
    ],
    faq: [
      {
        question: 'How high does the times table go?',
        answer:
          'The tool shows the times table from 1 to 12 for any number you choose, covering the most common school curriculum range.',
      },
      {
        question: 'How does quiz difficulty work?',
        answer:
          'Easy draws numbers up to 5, medium up to 10, and hard up to 12. Each round has 10 timed questions.',
      },
      {
        question: 'Is my best score saved?',
        answer:
          'Yes. The best result (highest accuracy, then lowest time) for each difficulty is saved locally in your browser.',
      },
      {
        question: 'Can I print a practice worksheet?',
        answer:
          'Yes. From a number\'s times table view, use the print button to generate a blank worksheet for that number.',
      },
      {
        question: 'Is it free and does it work on mobile?',
        answer:
          'Yes. The tool is free, requires no sign-up, and works normally on mobile browsers.',
      },
    ],
  },
  es: {
    name: 'Tabla de Multiplicar con Quiz',
    shortDescription:
      'Consulta la tabla de multiplicar del 1 al 12, practica con un quiz de dificultad ajustable, cronómetro, récord guardado y hoja de ejercicios para imprimir.',
    primaryKeyword: 'tabla de multiplicar con quiz',
    secondaryKeywords: [
      'tabla de multiplicar online',
      'practicar tabla de multiplicar',
      'quiz de multiplicacion',
      'juego de tablas de multiplicar',
      'hoja de ejercicios de multiplicacion',
      'tabla de multiplicar para imprimir',
    ],
    searchIntent:
      'Estudiantes, padres y docentes que quieren consultar la tabla de multiplicar y practicar con un quiz cronometrado y seguimiento de errores.',
    seoTitle: 'Tabla de Multiplicar con Quiz Online | Práctica Gratis',
    seoDescription:
      'Consulta la tabla de multiplicar del 1 al 12 y practica con un quiz cronometrado en 3 niveles de dificultad. Mira tu récord guardado, errores frecuentes e imprime una hoja de ejercicios.',
    h1: 'Tabla de Multiplicar con Quiz: Consulta y Practica Online',
    intro:
      'Mira la tabla completa de cualquier número, practica con un quiz cronometrado en 3 niveles e imprime una hoja de ejercicios en blanco.',
    contentBlocks: [
      {
        title: 'Cómo usar la tabla y el quiz',
        paragraphs: [
          'Elige un número del 1 al 12 para ver su tabla completa, del 1x al 12x, con el resultado de cada multiplicación. Para practicar, cambia al modo quiz, elige la dificultad (fácil: números hasta 5, medio: hasta 10, difícil: hasta 12) y responde 10 preguntas seguidas lo más rápido posible.',
          'Al final del quiz ves tu puntaje, el tiempo total y, si superaste tu récord anterior para esa dificultad, queda guardado en tu navegador para la próxima vez. Las preguntas que fallaste quedan registradas en una lista de "errores más frecuentes" para que sepas exactamente qué repasar.',
        ],
      },
      {
        title: 'Por qué practicar con un quiz cronometrado',
        paragraphs: [
          'Memorizar la tabla de multiplicar es más fácil con repetición y feedback inmediato: responder rápido y ver al instante si acertaste ayuda a fijar el resultado de cada multiplicación. El cronómetro crea un empuje saludable para entrenar velocidad además de precisión, justo lo que piden las pruebas escolares cronometradas.',
        ],
        list: [
          'Empieza por el nivel fácil (hasta 5x) antes de avanzar.',
          'Repite el quiz del mismo número varias veces seguidas.',
          'Usa la lista de errores más frecuentes para repasar antes del próximo intento.',
          'Imprime la hoja de ejercicios para practicar sin pantalla.',
        ],
      },
      {
        title: 'Hoja de ejercicios para imprimir',
        paragraphs: [
          'Desde la vista de la tabla de un número, usa el botón de imprimir para generar una hoja de ejercicios en blanco de ese número (por ejemplo, 7 x 1 = ___, 7 x 2 = ___, hasta 7 x 12 = ___), lista para que el estudiante la complete en papel. Es una forma simple de practicar lejos de la pantalla o reforzar el contenido en casa.',
        ],
      },
      {
        title: 'Procesamiento local y privacidad',
        paragraphs: [
          'El quiz, el cronómetro, el récord guardado y la lista de errores funcionan completamente en tu navegador. Ninguna respuesta o puntaje se envía a un servidor.',
        ],
      },
    ],
    faq: [
      {
        question: '¿Hasta qué número llega la tabla?',
        answer:
          'La herramienta muestra la tabla de multiplicar del 1 al 12 para cualquier número elegido, cubriendo el rango más común del currículo escolar.',
      },
      {
        question: '¿Cómo funciona la dificultad del quiz?',
        answer:
          'Fácil sortea números hasta 5, medio hasta 10 y difícil hasta 12. Cada ronda tiene 10 preguntas cronometradas.',
      },
      {
        question: '¿Se guarda mi récord?',
        answer:
          'Sí. El mejor resultado (mayor acierto y menor tiempo) de cada dificultad se guarda localmente en tu navegador.',
      },
      {
        question: '¿Puedo imprimir una hoja de ejercicios?',
        answer:
          'Sí. Desde la vista de la tabla de un número, usa el botón de imprimir para generar una hoja de ejercicios en blanco de ese número.',
      },
      {
        question: '¿Es gratis y funciona en el celular?',
        answer:
          'Sí. La herramienta es gratuita, no requiere registro y funciona con normalidad en navegadores móviles.',
      },
    ],
  },
  zh: {
    name: 'Multiplication Table Quiz',
    shortDescription:
      'Look up the times table from 1 to 12, practice with an adjustable-difficulty quiz, timer, saved best score, and a printable worksheet.',
    primaryKeyword: 'multiplication table quiz',
    secondaryKeywords: [
      'times table online',
      'times table practice',
      'multiplication quiz',
      'multiplication game',
      'multiplication worksheet printable',
      'times table chart',
    ],
    searchIntent:
      'Students, parents, and teachers who want to look up the times table and practice multiplication with a timed quiz and mistake tracking.',
    seoTitle: 'Multiplication Table Quiz Online | Free Times Table Practice',
    seoDescription:
      'Look up the times table from 1 to 12 and practice with a timed quiz across 3 difficulty levels. See your saved best score, most frequent mistakes, and print a worksheet.',
    h1: 'Multiplication Table Quiz: Look Up and Practice Times Tables Online',
    intro:
      'View the full times table for any number, practice with a timed quiz across 3 levels, and print a blank practice worksheet.',
    contentBlocks: [
      {
        title: 'How to use the times table and quiz',
        paragraphs: [
          'Pick a number from 1 to 12 to see its full times table, from 1x through 12x, with the result of each multiplication. To practice, switch to quiz mode, choose a difficulty (easy: numbers up to 5, medium: up to 10, hard: up to 12), and answer 10 questions in a row as fast as possible.',
          'At the end of the quiz you see your score, total time, and — if you beat your previous best for that difficulty — it gets saved in your browser for next time. Questions you got wrong are tracked in a "most frequent mistakes" list so you know exactly what to review.',
        ],
      },
      {
        title: 'Why practice with a timed quiz',
        paragraphs: [
          'Memorizing the times table gets easier with repetition and immediate feedback: answering quickly and seeing right away whether you got it right helps the result stick. The timer creates a healthy push to train speed as well as accuracy, which is exactly what timed school tests and worksheets require.',
        ],
        list: [
          'Start with the easy level (up to 5x) before moving up.',
          'Repeat the quiz for the same number a few times in a row.',
          'Use the most-frequent-mistakes list to review before your next attempt.',
          'Print the worksheet to practice away from a screen.',
        ],
      },
      {
        title: 'Printable practice worksheet',
        paragraphs: [
          'From a number\'s times table view, use the print button to generate a blank worksheet for that number (e.g. 7 x 1 = ___, 7 x 2 = ___, through 7 x 12 = ___), ready for a student to fill in on paper. It\'s a simple way to practice away from a screen or reinforce the material at home.',
        ],
      },
      {
        title: 'Local processing and privacy',
        paragraphs: [
          'The quiz, timer, saved best score, and mistakes list all run entirely in your browser. No answer or score is sent to a server.',
        ],
      },
    ],
    faq: [
      {
        question: 'How high does the times table go?',
        answer:
          'The tool shows the times table from 1 to 12 for any number you choose, covering the most common school curriculum range.',
      },
      {
        question: 'How does quiz difficulty work?',
        answer:
          'Easy draws numbers up to 5, medium up to 10, and hard up to 12. Each round has 10 timed questions.',
      },
      {
        question: 'Is my best score saved?',
        answer:
          'Yes. The best result (highest accuracy, then lowest time) for each difficulty is saved locally in your browser.',
      },
      {
        question: 'Can I print a practice worksheet?',
        answer:
          'Yes. From a number\'s times table view, use the print button to generate a blank worksheet for that number.',
      },
      {
        question: 'Is it free and does it work on mobile?',
        answer:
          'Yes. The tool is free, requires no sign-up, and works normally on mobile browsers.',
      },
    ],
  },
};

export const getMultiplicationTableQuizContent = (
  locale: AppLocale,
): MultiplicationTableQuizContent => contentByLocale[locale];
