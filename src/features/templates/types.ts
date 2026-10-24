import type { z } from 'zod';
import type { modelProviderSchema, promptCategorySchema } from '@/features/prompts/schemas';
import type { Template, TemplateComplexity } from './schemas';

export type TemplateCategory = z.infer<typeof promptCategorySchema>;
export type TemplateProvider = z.infer<typeof modelProviderSchema>;
export type TemplateSort = 'featured' | 'name' | 'tokens' | 'variables';

export interface TemplateFilters {
  query: string;
  category: TemplateCategory | 'all';
  provider: TemplateProvider | 'all';
  complexity: TemplateComplexity | 'all';
  sort: TemplateSort;
}

/** A template plus the values we derive from its content (computed once, not on every render). */
export interface TemplateListItem {
  template: Template;
  variables: string[];
  tokens: number;
}