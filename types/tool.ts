import type { ContentBlock, FaqItem } from '@/types/content';

export type ToolCategory = 'crypto' | 'dev' | 'documents' | 'utility';

export type ToolDefinition = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  category: ToolCategory;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  intro: string;
  canonicalPath: string;
  faq: FaqItem[];
  contentBlocks: ContentBlock[];
  relatedToolIds: string[];
};
