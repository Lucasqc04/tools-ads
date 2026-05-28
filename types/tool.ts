import type { ContentBlock, FaqItem } from '@/types/content';
import type { AppLocale } from '@/lib/i18n/config';

export type ToolCategory = 'crypto' | 'dev' | 'documents' | 'utility' | 'gaming';

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
  canonicalPathByLocale?: Partial<Record<AppLocale, string>>;
  faq: FaqItem[];
  contentBlocks: ContentBlock[];
  relatedToolIds: string[];
};
