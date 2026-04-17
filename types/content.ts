export type FaqItem = {
  question: string;
  answer: string;
};

export type ContentBlock = {
  title: string;
  paragraphs: string[];
  list?: string[];
};
