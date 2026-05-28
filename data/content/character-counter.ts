import type { AppLocale } from '@/lib/i18n/config';
import type { ContentBlock, FaqItem } from '@/types/content';
import type {
  CharacterCounterMode,
  CharacterCounterPreset,
  LimitStatus,
} from '@/lib/character-counter';

export type CharacterCounterLocaleContent = {
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

export type CharacterCounterUiCopy = {
  textInputLabel: string;
  textInputPlaceholder: string;
  modeLabel: string;
  presetLabel: string;
  targetLabel: string;
  targetPlaceholder: string;
  clearText: string;
  copyText: string;
  copiedText: string;
  saveDraft: string;
  draftSaved: string;
  loadDraft: string;
  exportTxt: string;
  exportJson: string;
  exportCsv: string;
  splitText: string;
  splitResultTitle: string;
  splitLimitLabel: string;
  splitNumberedLabel: string;
  metricsTitle: string;
  qualityTitle: string;
  topWordsTitle: string;
  repeatedWordsTitle: string;
  alertsTitle: string;
  transformsTitle: string;
  privacyTitle: string;
  privacyText: string;
  statusByLimit: Record<LimitStatus, string>;
  statusDetailIdeal: string;
  statusDetailOver: string;
  statusDetailShort: string;
  statusDetailNear: string;
  statusDetailOk: string;
};

const contentByLocale: Record<AppLocale, CharacterCounterLocaleContent> = {
  'pt-br': {
    name: 'Contador de Caracteres e Palavras Online',
    shortDescription:
      'Conte caracteres, palavras, linhas, frases, paragrafos, emojis e limites para SEO, redes sociais, redacao e programacao.',
    primaryKeyword: 'contador de caracteres e palavras online',
    secondaryKeywords: [
      'contador de caracteres',
      'contador de palavras',
      'contador de linhas',
      'contador para instagram',
      'contador para x twitter',
      'tempo de leitura texto',
      'contador de hashtags',
      'detector de caracteres invisiveis',
    ],
    searchIntent:
      'Usuarios que precisam analisar texto de forma completa para SEO, social media, estudos, redacao e tarefas tecnicas.',
    seoTitle:
      'Contador de Caracteres e Palavras Online | SEO, Instagram, X, YouTube e Redacao',
    seoDescription:
      'Ferramenta completa para contar caracteres, palavras, linhas, frases, emojis, hashtags e limites por plataforma com analise e exportacao.',
    h1: 'Contador de Caracteres e Palavras Online',
    intro:
      'Conte caracteres, palavras, linhas, frases, paragrafos, emojis, espacos e analise limites para SEO, Instagram, X, YouTube, redacao e programacao.',
    contentBlocks: [
      {
        title: 'Mais que contador: analise, limpeza e adaptacao por objetivo',
        paragraphs: [
          'Esta ferramenta foi criada para ir alem de um simples numero de caracteres. Ela mostra um painel completo com palavras, frases, paragrafos, links, hashtags, mencoes, emails, telefones, datas e tamanho em bytes UTF-8.',
          'Com presets por objetivo, voce pode validar texto para SEO, redes sociais, redacao e uso tecnico sem trocar de ferramenta. Isso reduz retrabalho e acelera revisao de conteudo.',
        ],
      },
      {
        title: 'Modos de uso para SEO, social, redacao e programacao',
        paragraphs: [
          'No modo SEO voce acompanha title, meta description e outros limites aproximados com alertas de faixa, sem depender de uma regra fixa unica. No modo social, os presets ajudam a validar texto para Instagram, X, YouTube, LinkedIn, WhatsApp e SMS.',
          'No modo redacao, a ferramenta destaca repeticoes, frases longas e paragrafos extensos. No modo programacao, exibe linhas vazias, linhas de comentario, tabs, trailing spaces e tamanho de payload.',
        ],
      },
      {
        title: 'Privacidade e performance no navegador',
        paragraphs: [
          'Toda analise e feita localmente no navegador. O texto digitado nao precisa ser enviado para servidor para gerar metricas, relatorios e exportacoes.',
          'Esse fluxo melhora privacidade, reduz latencia e facilita uso rapido em desktop e mobile.',
        ],
      },
    ],
    faq: [
      {
        question: 'Qual a diferenca entre caracteres com e sem espacos?',
        answer:
          'Com espacos conta todos os caracteres do texto. Sem espacos remove espacos, tabs e quebras de linha da contagem.',
      },
      {
        question: 'Essa ferramenta conta emojis e hashtags?',
        answer:
          'Sim. O painel avancado identifica emojis, hashtags, mencoes, links, emails e outras estruturas comuns de texto.',
      },
      {
        question: 'Posso usar para validar title e meta description?',
        answer:
          'Sim. Existem presets de SEO com alertas aproximados de faixa para ajudar na revisao de snippets.',
      },
      {
        question: 'O texto e enviado para servidor?',
        answer:
          'Nao por padrao. O processamento principal ocorre localmente no navegador para maior privacidade.',
      },
      {
        question: 'Posso exportar os resultados?',
        answer:
          'Sim. Voce pode exportar em TXT, JSON e CSV, alem de copiar o texto e salvar rascunho local.',
      },
    ],
  },
  en: {
    name: 'Online Character and Word Counter',
    shortDescription:
      'Count characters, words, lines, sentences, paragraphs, emojis, and limits for SEO, social media, writing, and coding.',
    primaryKeyword: 'online character and word counter',
    secondaryKeywords: [
      'character counter',
      'word counter',
      'line counter',
      'seo character counter',
      'twitter x character counter',
      'reading time calculator',
      'hashtag counter',
      'invisible character detector',
    ],
    searchIntent:
      'Users who need complete text analysis for SEO, social publishing, academic writing, and technical workflows.',
    seoTitle:
      'Online Character and Word Counter | SEO, Instagram, X, YouTube, Writing',
    seoDescription:
      'Complete text counter with words, lines, emojis, hashtags, limits by platform, quality alerts, and export options.',
    h1: 'Online Character and Word Counter',
    intro:
      'Count characters, words, lines, sentences, paragraphs, emojis, spaces, and validate limits for SEO, social media, writing, and coding.',
    contentBlocks: [
      {
        title: 'More than counting: analysis, cleanup, and adaptation',
        paragraphs: [
          'This tool goes beyond basic character counting. It includes words, sentences, paragraphs, links, hashtags, mentions, emails, phone numbers, dates, and UTF-8 byte size.',
          'With objective presets, you can validate copy for SEO, social media, writing, and technical usage without switching tools.',
        ],
      },
      {
        title: 'Modes for SEO, social, writing, and programming',
        paragraphs: [
          'SEO mode supports title and meta description checks with practical range alerts. Social mode helps validate content for Instagram, X, YouTube, LinkedIn, WhatsApp, and SMS.',
          'Writing mode highlights repeated words and long sentence patterns. Programming mode shows empty lines, comments, tabs, trailing spaces, and payload size.',
        ],
      },
      {
        title: 'Privacy-first local processing',
        paragraphs: [
          'Analysis is processed locally in your browser. You can inspect, transform, and export text without uploading it by default.',
          'This approach improves privacy and keeps the workflow fast on desktop and mobile.',
        ],
      },
    ],
    faq: [
      {
        question: 'What is the difference between characters with and without spaces?',
        answer:
          'With spaces counts all characters. Without spaces removes whitespace such as spaces, tabs, and line breaks.',
      },
      {
        question: 'Does it detect emojis and hashtags?',
        answer:
          'Yes. Advanced metrics include emojis, hashtags, mentions, URLs, emails, and more.',
      },
      {
        question: 'Can I use it for title and meta description checks?',
        answer:
          'Yes. SEO presets provide practical range guidance for snippet planning.',
      },
      {
        question: 'Is my text sent to a server?',
        answer:
          'No by default. Core processing runs locally in the browser.',
      },
      {
        question: 'Can I export results?',
        answer: 'Yes. You can export TXT, JSON, and CSV files.',
      },
    ],
  },
  es: {
    name: 'Contador de Caracteres y Palabras Online',
    shortDescription:
      'Cuenta caracteres, palabras, lineas, frases, parrafos, emojis y limites para SEO, redes sociales, redaccion y programacion.',
    primaryKeyword: 'contador de caracteres y palabras online',
    secondaryKeywords: [
      'contador de caracteres',
      'contador de palabras',
      'contador de lineas',
      'contador para instagram',
      'contador para x twitter',
      'tiempo de lectura texto',
      'contador de hashtags',
      'detector de caracteres invisibles',
    ],
    searchIntent:
      'Usuarios que necesitan analisis completo de texto para SEO, social media, redaccion y trabajo tecnico.',
    seoTitle:
      'Contador de Caracteres y Palabras Online | SEO, Instagram, X, YouTube y Redaccion',
    seoDescription:
      'Herramienta completa para contar caracteres, palabras, lineas, emojis, hashtags y limites por plataforma con exportacion.',
    h1: 'Contador de Caracteres y Palabras Online',
    intro:
      'Cuenta caracteres, palabras, lineas, frases, parrafos, emojis y valida limites para SEO, redes sociales, redaccion y programacion.',
    contentBlocks: [
      {
        title: 'Mas que un contador: analisis, limpieza y adaptacion',
        paragraphs: [
          'Esta herramienta va mas alla del numero de caracteres. Incluye palabras, frases, parrafos, links, hashtags, menciones, emails, telefonos, fechas y bytes UTF-8.',
          'Con presets por objetivo puedes validar textos para SEO, redes sociales, redaccion y uso tecnico sin cambiar de pagina.',
        ],
      },
      {
        title: 'Modos para SEO, social, redaccion y programacion',
        paragraphs: [
          'El modo SEO ayuda con title y meta description usando alertas de rango aproximadas. El modo social ofrece presets para Instagram, X, YouTube, LinkedIn, WhatsApp y SMS.',
          'El modo redaccion destaca repeticiones y frases largas. El modo programacion muestra lineas vacias, comentarios, tabs, trailing spaces y tamano de payload.',
        ],
      },
      {
        title: 'Privacidad con procesamiento local',
        paragraphs: [
          'El analisis ocurre localmente en tu navegador. No necesitas subir texto a un servidor para contar, transformar o exportar.',
          'Esto mejora privacidad y mantiene una experiencia rapida en movil y desktop.',
        ],
      },
    ],
    faq: [
      {
        question: 'Cual es la diferencia entre caracteres con y sin espacios?',
        answer:
          'Con espacios cuenta todo. Sin espacios elimina espacios, tabs y saltos de linea de la metrica.',
      },
      {
        question: 'Detecta emojis y hashtags?',
        answer:
          'Si. El panel avanzado detecta emojis, hashtags, menciones, links, emails y mas estructuras.',
      },
      {
        question: 'Sirve para validar title y meta description?',
        answer: 'Si. Incluye presets SEO con alertas de rango para facilitar revision de snippets.',
      },
      {
        question: 'Mi texto se envia al servidor?',
        answer: 'No por defecto. El procesamiento principal es local en el navegador.',
      },
      {
        question: 'Puedo exportar resultados?',
        answer: 'Si. Puedes exportar en TXT, JSON y CSV.',
      },
    ],
  },
};

const uiByLocale: Record<AppLocale, CharacterCounterUiCopy> = {
  'pt-br': {
    textInputLabel: 'Texto para analise',
    textInputPlaceholder: 'Cole ou digite seu texto aqui...',
    modeLabel: 'Modo',
    presetLabel: 'Preset de limite',
    targetLabel: 'Meta personalizada (max caracteres)',
    targetPlaceholder: 'Ex.: 280',
    clearText: 'Limpar texto',
    copyText: 'Copiar texto',
    copiedText: 'Texto copiado',
    saveDraft: 'Salvar rascunho',
    draftSaved: 'Rascunho salvo',
    loadDraft: 'Carregar rascunho',
    exportTxt: 'Exportar TXT',
    exportJson: 'Exportar JSON',
    exportCsv: 'Exportar CSV',
    splitText: 'Dividir texto',
    splitResultTitle: 'Texto dividido',
    splitLimitLabel: 'Limite por parte',
    splitNumberedLabel: 'Numerar partes automaticamente',
    metricsTitle: 'Dashboard de metricas',
    qualityTitle: 'Qualidade do texto',
    topWordsTitle: 'Top palavras',
    repeatedWordsTitle: 'Palavras repetidas',
    alertsTitle: 'Alertas inteligentes',
    transformsTitle: 'Acoes rapidas de transformacao',
    privacyTitle: 'Privacidade',
    privacyText: 'Seu texto e processado localmente no navegador. Nada e enviado para servidor por padrao.',
    statusByLimit: {
      'too-short': 'Muito curto',
      ideal: 'Faixa ideal',
      'near-limit': 'Perto do limite',
      'over-limit': 'Passou do limite',
      ok: 'OK',
    },
    statusDetailIdeal: 'Dentro da faixa recomendada para este preset.',
    statusDetailOver: 'Reduza o texto para evitar truncamento ou bloqueio de limite.',
    statusDetailShort: 'Texto curto para este objetivo. Pode perder contexto.',
    statusDetailNear: 'Proximo do limite maximo. Revise para evitar corte.',
    statusDetailOk: 'Sem alerta critico para o preset atual.',
  },
  en: {
    textInputLabel: 'Text to analyze',
    textInputPlaceholder: 'Paste or type your text here...',
    modeLabel: 'Mode',
    presetLabel: 'Limit preset',
    targetLabel: 'Custom target (max chars)',
    targetPlaceholder: 'e.g. 280',
    clearText: 'Clear text',
    copyText: 'Copy text',
    copiedText: 'Text copied',
    saveDraft: 'Save draft',
    draftSaved: 'Draft saved',
    loadDraft: 'Load draft',
    exportTxt: 'Export TXT',
    exportJson: 'Export JSON',
    exportCsv: 'Export CSV',
    splitText: 'Split text',
    splitResultTitle: 'Split result',
    splitLimitLabel: 'Chars per part',
    splitNumberedLabel: 'Auto number parts',
    metricsTitle: 'Metrics dashboard',
    qualityTitle: 'Text quality',
    topWordsTitle: 'Top words',
    repeatedWordsTitle: 'Repeated words',
    alertsTitle: 'Smart alerts',
    transformsTitle: 'Quick text actions',
    privacyTitle: 'Privacy',
    privacyText: 'Your text is processed locally in-browser. Nothing is sent to server by default.',
    statusByLimit: {
      'too-short': 'Too short',
      ideal: 'Ideal range',
      'near-limit': 'Near limit',
      'over-limit': 'Over limit',
      ok: 'OK',
    },
    statusDetailIdeal: 'Inside recommended range for this preset.',
    statusDetailOver: 'Reduce text to avoid truncation or hard limits.',
    statusDetailShort: 'Text may be too short for this objective.',
    statusDetailNear: 'Close to max limit. Review to avoid truncation.',
    statusDetailOk: 'No critical warning for current preset.',
  },
  es: {
    textInputLabel: 'Texto para analizar',
    textInputPlaceholder: 'Pega o escribe tu texto aqui...',
    modeLabel: 'Modo',
    presetLabel: 'Preset de limite',
    targetLabel: 'Meta personalizada (max caracteres)',
    targetPlaceholder: 'Ej.: 280',
    clearText: 'Limpiar texto',
    copyText: 'Copiar texto',
    copiedText: 'Texto copiado',
    saveDraft: 'Guardar borrador',
    draftSaved: 'Borrador guardado',
    loadDraft: 'Cargar borrador',
    exportTxt: 'Exportar TXT',
    exportJson: 'Exportar JSON',
    exportCsv: 'Exportar CSV',
    splitText: 'Dividir texto',
    splitResultTitle: 'Texto dividido',
    splitLimitLabel: 'Limite por parte',
    splitNumberedLabel: 'Numerar partes automaticamente',
    metricsTitle: 'Panel de metricas',
    qualityTitle: 'Calidad del texto',
    topWordsTitle: 'Top palabras',
    repeatedWordsTitle: 'Palabras repetidas',
    alertsTitle: 'Alertas inteligentes',
    transformsTitle: 'Acciones rapidas de texto',
    privacyTitle: 'Privacidad',
    privacyText: 'Tu texto se procesa localmente en el navegador. Nada se envia al servidor por defecto.',
    statusByLimit: {
      'too-short': 'Muy corto',
      ideal: 'Rango ideal',
      'near-limit': 'Cerca del limite',
      'over-limit': 'Supero el limite',
      ok: 'OK',
    },
    statusDetailIdeal: 'Dentro del rango recomendado para este preset.',
    statusDetailOver: 'Reduce texto para evitar truncamiento o limite estricto.',
    statusDetailShort: 'Texto corto para este objetivo.',
    statusDetailNear: 'Cerca del limite maximo. Revisa para evitar corte.',
    statusDetailOk: 'Sin alerta critica para el preset actual.',
  },
};

const presetsByLocale: Record<AppLocale, CharacterCounterPreset[]> = {
  'pt-br': [
    { id: 'general', mode: 'simple', label: 'Geral' },
    { id: 'seo-title', mode: 'seo', label: 'SEO - Title tag', idealMin: 40, idealMax: 60, max: 70 },
    {
      id: 'seo-meta-description',
      mode: 'seo',
      label: 'SEO - Meta description',
      idealMin: 120,
      idealMax: 155,
      max: 170,
      note: 'Faixa aproximada. Snippet pode variar por dispositivo e largura.',
    },
    { id: 'seo-h1', mode: 'seo', label: 'SEO - H1', idealMin: 20, idealMax: 70, max: 90 },
    { id: 'instagram-caption', mode: 'social', label: 'Instagram - Legenda', idealMin: 80, idealMax: 400, max: 2200 },
    { id: 'x-post', mode: 'social', label: 'X/Twitter - Post', idealMin: 40, idealMax: 240, max: 280 },
    { id: 'youtube-description', mode: 'social', label: 'YouTube - Descricao', idealMin: 200, idealMax: 1200, max: 5000 },
    { id: 'linkedin-post', mode: 'social', label: 'LinkedIn - Post', idealMin: 150, idealMax: 900, max: 3000 },
    { id: 'whatsapp-message', mode: 'social', label: 'WhatsApp - Mensagem', idealMin: 60, idealMax: 600, max: 4096 },
    { id: 'sms', mode: 'social', label: 'SMS', idealMin: 40, idealMax: 140, max: 160 },
  ],
  en: [
    { id: 'general', mode: 'simple', label: 'General' },
    { id: 'seo-title', mode: 'seo', label: 'SEO - Title tag', idealMin: 40, idealMax: 60, max: 70 },
    {
      id: 'seo-meta-description',
      mode: 'seo',
      label: 'SEO - Meta description',
      idealMin: 120,
      idealMax: 155,
      max: 170,
      note: 'Approximate range. Snippet can vary by device and width.',
    },
    { id: 'seo-h1', mode: 'seo', label: 'SEO - H1', idealMin: 20, idealMax: 70, max: 90 },
    { id: 'instagram-caption', mode: 'social', label: 'Instagram - Caption', idealMin: 80, idealMax: 400, max: 2200 },
    { id: 'x-post', mode: 'social', label: 'X/Twitter - Post', idealMin: 40, idealMax: 240, max: 280 },
    { id: 'youtube-description', mode: 'social', label: 'YouTube - Description', idealMin: 200, idealMax: 1200, max: 5000 },
    { id: 'linkedin-post', mode: 'social', label: 'LinkedIn - Post', idealMin: 150, idealMax: 900, max: 3000 },
    { id: 'whatsapp-message', mode: 'social', label: 'WhatsApp - Message', idealMin: 60, idealMax: 600, max: 4096 },
    { id: 'sms', mode: 'social', label: 'SMS', idealMin: 40, idealMax: 140, max: 160 },
  ],
  es: [
    { id: 'general', mode: 'simple', label: 'General' },
    { id: 'seo-title', mode: 'seo', label: 'SEO - Title tag', idealMin: 40, idealMax: 60, max: 70 },
    {
      id: 'seo-meta-description',
      mode: 'seo',
      label: 'SEO - Meta description',
      idealMin: 120,
      idealMax: 155,
      max: 170,
      note: 'Rango aproximado. El snippet puede variar por dispositivo y ancho.',
    },
    { id: 'seo-h1', mode: 'seo', label: 'SEO - H1', idealMin: 20, idealMax: 70, max: 90 },
    { id: 'instagram-caption', mode: 'social', label: 'Instagram - Leyenda', idealMin: 80, idealMax: 400, max: 2200 },
    { id: 'x-post', mode: 'social', label: 'X/Twitter - Post', idealMin: 40, idealMax: 240, max: 280 },
    { id: 'youtube-description', mode: 'social', label: 'YouTube - Descripcion', idealMin: 200, idealMax: 1200, max: 5000 },
    { id: 'linkedin-post', mode: 'social', label: 'LinkedIn - Post', idealMin: 150, idealMax: 900, max: 3000 },
    { id: 'whatsapp-message', mode: 'social', label: 'WhatsApp - Mensaje', idealMin: 60, idealMax: 600, max: 4096 },
    { id: 'sms', mode: 'social', label: 'SMS', idealMin: 40, idealMax: 140, max: 160 },
  ],
};

const modesByLocale: Record<AppLocale, Array<{ id: CharacterCounterMode; label: string }>> = {
  'pt-br': [
    { id: 'simple', label: 'Simples' },
    { id: 'advanced', label: 'Avancado' },
    { id: 'programming', label: 'Programacao' },
    { id: 'seo', label: 'SEO' },
    { id: 'social', label: 'Redes sociais' },
    { id: 'writing', label: 'Redacao' },
  ],
  en: [
    { id: 'simple', label: 'Simple' },
    { id: 'advanced', label: 'Advanced' },
    { id: 'programming', label: 'Programming' },
    { id: 'seo', label: 'SEO' },
    { id: 'social', label: 'Social media' },
    { id: 'writing', label: 'Writing' },
  ],
  es: [
    { id: 'simple', label: 'Simple' },
    { id: 'advanced', label: 'Avanzado' },
    { id: 'programming', label: 'Programacion' },
    { id: 'seo', label: 'SEO' },
    { id: 'social', label: 'Redes sociales' },
    { id: 'writing', label: 'Redaccion' },
  ],
};

export const getCharacterCounterContent = (locale: AppLocale): CharacterCounterLocaleContent =>
  contentByLocale[locale];

export const getCharacterCounterUiCopy = (locale: AppLocale): CharacterCounterUiCopy =>
  uiByLocale[locale];

export const getCharacterCounterPresets = (locale: AppLocale): CharacterCounterPreset[] =>
  presetsByLocale[locale];

export const getCharacterCounterModes = (locale: AppLocale): Array<{ id: CharacterCounterMode; label: string }> =>
  modesByLocale[locale];

export const characterCounterIntro = contentByLocale['pt-br'].intro;
export const characterCounterFaq = contentByLocale['pt-br'].faq;
export const characterCounterContentBlocks = contentByLocale['pt-br'].contentBlocks;
