import type { ModelProvider, Prompt, PromptCategory, PromptStatus } from '@/features/prompts/types';
import type { Template } from '@/features/templates/schemas';

interface FavoriteBase {
  key: string; // 'prompt:<id>' or 'template:<id>' (ids can't collide across kinds)
  id: string;
  title: string;
  description: string;
  category: PromptCategory;
  provider: ModelProvider;
  modelName: string;
  tags: string[];
  variables: string[];
  tokens: number;
  updatedAt: string | null; // templates have no date
  versionLabel: string | null;
}

export type FavoriteEntry =
  | (FavoriteBase & { kind: 'prompt'; prompt: Prompt; status: PromptStatus; folderId: string | null })
  | (FavoriteBase & { kind: 'template'; template: Template });

export type FavoriteTab = 'all' | 'prompt' | 'template';
export type FavoriteSort = 'updated' | 'name' | 'tokens';
export type FavoriteView = 'grid' | 'list';

export interface FavoriteFilters {
  query: string;
  tab: FavoriteTab;
  provider: ModelProvider | 'all';
  variable: string | null; // set by clicking a "Top Variable" chip (14C)
  folderId: string | null; // set by clicking a folder (14C)
  sort: FavoriteSort;
}

export interface FavoriteStats {
  total: number;
  prompts: number;
  templates: number;
  totalTokens: number;
  distinctVariables: number;
  primaryProvider: { provider: ModelProvider; percent: number } | null;
}