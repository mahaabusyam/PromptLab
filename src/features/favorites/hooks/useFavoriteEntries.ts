import { useMemo } from 'react';
import { useTemplateItems } from '@/features/templates/hooks/useTemplateItems';
import { usePromptStore } from '@/stores/promptStore';
import { useTemplateStore } from '@/stores/templateStore';
import { buildFavoriteEntries } from '../buildFavorites';

export function useFavoriteEntries() {
  const prompts = usePromptStore((s) => s.prompts);
  const favoriteTemplateIds = useTemplateStore((s) => s.favoriteIds);
  const templateItems = useTemplateItems();

  return useMemo(
    () => buildFavoriteEntries(prompts, templateItems, favoriteTemplateIds),
    [prompts, templateItems, favoriteTemplateIds],
  );
}