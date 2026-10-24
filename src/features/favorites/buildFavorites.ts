import { modelCatalog } from '@/features/prompts/constants';
import type { Prompt } from '@/features/prompts/types';
import { getVersionLabel } from '@/features/prompts/utils';
import type { TemplateListItem } from '@/features/templates/types';
import { extractVariables } from '@/utils/promptVariables';
import { estimateTokens } from '@/utils/tokens';
import type { FavoriteEntry, FavoriteStats } from './types';

function fromPrompt(prompt: Prompt): FavoriteEntry {
  return {
    kind: 'prompt',
    key: `prompt:${prompt.id}`,
    id: prompt.id,
    title: prompt.title,
    description: prompt.description,
    category: prompt.category,
    provider: prompt.model.provider,
    modelName: prompt.model.name,
    tags: prompt.tags,
    variables: extractVariables(prompt.content),
    tokens: estimateTokens(prompt.content),
    updatedAt: prompt.updatedAt,
    versionLabel: getVersionLabel(prompt),
    prompt,
    status: prompt.status,
    folderId: prompt.folderId,
  };
}

function fromTemplate({ template, variables, tokens }: TemplateListItem): FavoriteEntry {
  return {
    kind: 'template',
    key: `template:${template.id}`,
    id: template.id,
    title: template.title,
    description: template.description,
    category: template.category,
    provider: template.provider,
    modelName: modelCatalog.find((m) => m.provider === template.provider)?.name ?? template.provider,
    tags: template.tags,
    variables,
    tokens,
    updatedAt: null,
    versionLabel: null,
    template,
  };
}

export function buildFavoriteEntries(
  prompts: Prompt[],
  templateItems: TemplateListItem[],
  favoriteTemplateIds: string[],
): FavoriteEntry[] {
  const favoriteSet = new Set(favoriteTemplateIds);
  return [
    // archived prompts are hidden everywhere else, so they are hidden here too
    ...prompts.filter((p) => p.isFavorite && !p.isArchived).map(fromPrompt),
    ...templateItems.filter((i) => favoriteSet.has(i.template.id)).map(fromTemplate),
  ];
}

export function buildFavoriteStats(entries: FavoriteEntry[]): FavoriteStats {
  const providerCounts = new Map<FavoriteEntry['provider'], number>();
  const variables = new Set<string>();
  let totalTokens = 0;
  let prompts = 0;

  for (const e of entries) {
    totalTokens += e.tokens;
    if (e.kind === 'prompt') prompts += 1;
    e.variables.forEach((v) => variables.add(v));
    providerCounts.set(e.provider, (providerCounts.get(e.provider) ?? 0) + 1);
  }

  const top = [...providerCounts.entries()].sort((a, b) => b[1] - a[1])[0];

  return {
    total: entries.length,
    prompts,
    templates: entries.length - prompts,
    totalTokens,
    distinctVariables: variables.size,
    primaryProvider: top ? { provider: top[0], percent: Math.round((top[1] / entries.length) * 100) } : null,
  };
}