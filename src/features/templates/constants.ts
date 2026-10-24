import type { TemplateComplexity } from './schemas';
import type { TemplateSort } from './types';

export const complexityLabels: Record<TemplateComplexity, string> = {
  'zero-shot': 'Plug & Play (Zero-shot)',
  'few-shot': 'Intermediate (Few-shot)',
  'multi-agent': 'Advanced Multi-Agent',
};

export const sortLabels: Record<TemplateSort, string> = {
  featured: 'Featured first',
  name: 'Name (A–Z)',
  tokens: 'Shortest (tokens)',
  variables: 'Most variables',
};

export const TEMPLATES_PAGE_SIZE = 8;