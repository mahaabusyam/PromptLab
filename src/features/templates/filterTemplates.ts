import { extractVariables } from '@/utils/promptVariables';
import { estimateTokens } from '@/utils/tokens';
import type { Template } from './schemas';
import type { TemplateFilters, TemplateListItem, TemplateSort } from './types';

export const DEFAULT_TEMPLATE_FILTERS: TemplateFilters = {
  query: '',
  category: 'all',
  provider: 'all',
  complexity: 'all',
  sort: 'featured',
};

export function toListItem(template: Template): TemplateListItem {
  return {
    template,
    variables: extractVariables(template.content),
    tokens: estimateTokens(template.content),
  };
}

function matchesQuery(item: TemplateListItem, rawQuery: string): boolean {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return true;
  const { template, variables } = item;
  return [template.title, template.description, template.category, template.provider, ...template.tags, ...variables]
    .some((field) => field.toLowerCase().includes(q));
}

const comparers: Record<TemplateSort, (a: TemplateListItem, b: TemplateListItem) => number> = {
  featured: (a, b) =>
    Number(Boolean(b.template.featured)) - Number(Boolean(a.template.featured)) ||
    a.template.title.localeCompare(b.template.title),
  name: (a, b) => a.template.title.localeCompare(b.template.title),
  tokens: (a, b) => a.tokens - b.tokens,
  variables: (a, b) => b.variables.length - a.variables.length,
};

export function filterTemplates(items: TemplateListItem[], filters: TemplateFilters): TemplateListItem[] {
  return items
    .filter(
      ({ template }) =>
        (filters.category === 'all' || template.category === filters.category) &&
        (filters.provider === 'all' || template.provider === filters.provider) &&
        (filters.complexity === 'all' || template.complexity === filters.complexity),
    )
    .filter((item) => matchesQuery(item, filters.query))
    .sort(comparers[filters.sort]);
}

/** Counts per category after every OTHER filter, so the pills never lie. */
export function countByCategory(
  items: TemplateListItem[],
  filters: TemplateFilters,
): Record<string, number> {
  const pool = filterTemplates(items, { ...filters, category: 'all' });
  const counts: Record<string, number> = { all: pool.length };
  for (const { template } of pool) {
    counts[template.category] = (counts[template.category] ?? 0) + 1;
  }
  return counts;
}

export function hasActiveTemplateFilters(filters: TemplateFilters): boolean {
  return (
    filters.query.trim() !== '' ||
    filters.category !== DEFAULT_TEMPLATE_FILTERS.category ||
    filters.provider !== DEFAULT_TEMPLATE_FILTERS.provider ||
    filters.complexity !== DEFAULT_TEMPLATE_FILTERS.complexity
  );
}