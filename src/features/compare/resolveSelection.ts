import type { Prompt, PromptVersion } from "@/features/prompts/types";

export interface CompareSelection {
  prompt: Prompt;
  base: PromptVersion;
  target: PromptVersion;
}

function neighbor(
  versions: PromptVersion[],
  version: PromptVersion,
): PromptVersion | undefined {
  const i = versions.indexOf(version);
  return versions[i - 1] ?? versions[i + 1];
}

/**
 * Turns (possibly missing / stale) ids from the URL into a valid selection.
 * Always falls back to something sensible instead of crashing.
 */
export function resolveSelection(
  comparable: Prompt[],
  promptId: string | null,
  baseId: string | null,
  targetId: string | null,
): CompareSelection | null {
  const prompt = comparable.find((p) => p.id === promptId) ?? comparable[0];
  if (!prompt) return null;

  const { versions } = prompt;
  const target =
    versions.find((v) => v.id === targetId) ?? versions[versions.length - 1];
  if (!target) return null;

  const requestedBase = versions.find((v) => v.id === baseId);
  const base =
    requestedBase && requestedBase.id !== target.id
      ? requestedBase
      : neighbor(versions, target);
  if (!base) return null;

  return { prompt, base, target };
}
