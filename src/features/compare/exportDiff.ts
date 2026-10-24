import type { DiffLine } from '@/features/versions/diff';

const prefix: Record<DiffLine['type'], string> = { same: ' ', added: '+', removed: '-' };

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'prompt';
}

export function buildUnifiedDiffText(
  promptTitle: string,
  baseLabel: string,
  targetLabel: string,
  diff: DiffLine[],
): string {
  const oldCount = diff.filter((l) => l.type !== 'added').length;
  const newCount = diff.filter((l) => l.type !== 'removed').length;

  return [
    `--- ${promptTitle} (${baseLabel})`,
    `+++ ${promptTitle} (${targetLabel})`,
    `@@ -1,${oldCount} +1,${newCount} @@`,
    ...diff.map((l) => `${prefix[l.type]}${l.text}`),
  ].join('\n') + '\n';
}

export { downloadTextFile } from '@/utils/download'