import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePromptStore } from '@/stores/promptStore';
import { resolveSelection } from '../resolveSelection';

type Patch = Partial<Record<'prompt' | 'base' | 'target', string>>;

export function useCompareSelection() {
  const prompts = usePromptStore((s) => s.prompts);
  const [params, setParams] = useSearchParams();

  const comparable = useMemo(() => prompts.filter((p) => p.versions.length >= 2), [prompts]);

  const promptId = params.get('prompt');
  const baseId = params.get('base');
  const targetId = params.get('target');

  const selection = useMemo(
    () => resolveSelection(comparable, promptId, baseId, targetId),
    [comparable, promptId, baseId, targetId],
  );

  const update = useCallback(
    (patch: Patch) => {
      if (!selection) return;
      setParams(
        {
          prompt: selection.prompt.id,
          base: selection.base.id,
          target: selection.target.id,
          ...patch,
        },
        { replace: true },
      );
    },
    [selection, setParams],
  );

  return {
    selection,
    comparable,
    setPrompt: (id: string) => update({ prompt: id }), // base/target of the old prompt fall back automatically
    setBase: (id: string) => update({ base: id }),
    setTarget: (id: string) => update({ target: id }),
    swap: () => {
      if (selection) update({ base: selection.target.id, target: selection.base.id });
    },
  };
}