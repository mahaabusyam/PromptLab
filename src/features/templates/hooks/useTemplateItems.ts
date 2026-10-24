import { useMemo } from 'react';
import { templateCatalog } from '@/data/templates';
import { useTemplateStore } from '@/stores/templateStore';
import { toListItem } from '../filterTemplates';
import type { TemplateListItem } from '../types';

export function useTemplateItems(): TemplateListItem[] {
  const customTemplates = useTemplateStore((s) => s.customTemplates);
  return useMemo(() => [...templateCatalog, ...customTemplates].map(toListItem), [customTemplates]);
}