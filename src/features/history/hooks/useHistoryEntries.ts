import { useMemo } from 'react';
import { usePromptStore } from '@/stores/promptStore';
import { buildHistoryEntries } from '../buildHistory';

export function useHistoryEntries() {
  const prompts = usePromptStore((s) => s.prompts);
  return useMemo(() => buildHistoryEntries(prompts), [prompts]);
}