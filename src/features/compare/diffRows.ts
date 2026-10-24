import { diffLines } from '@/features/versions/diff';
import type { DiffLine } from '@/features/versions/diff';

export interface Segment {
  text: string;
  changed: boolean;
}

export interface DiffCell {
  lineNo: number;
  text: string;
  type: 'same' | 'added' | 'removed';
  segments?: Segment[]; // word-level highlight, only for paired modified lines
}

export interface SplitRow {
  left: DiffCell | null;
  right: DiffCell | null;
}

export interface UnifiedRow {
  cell: DiffCell;
  oldNo: number | null;
  newNo: number | null;
}

export type RowKind = 'same' | 'added' | 'removed' | 'changed';

export interface DiffRows {
  split: SplitRow[];
  unified: UnifiedRow[];
}

/** Word-level diff: reuse diffLines by treating every word as a "line". */
export function wordSegments(before: string, after: string): { left: Segment[]; right: Segment[] } {
  const parts = diffLines(before.split(' ').join('\n'), after.split(' ').join('\n'));
  const left: Segment[] = [];
  const right: Segment[] = [];

  const push = (target: Segment[], token: string, changed: boolean): void => {
    const last = target[target.length - 1];
    if (last && last.changed === changed) last.text += `${token} `;
    else target.push({ text: `${token} `, changed });
  };

  for (const part of parts) {
    if (part.type !== 'added') push(left, part.text, part.type === 'removed');
    if (part.type !== 'removed') push(right, part.text, part.type === 'added');
  }
  return { left, right };
}

export function buildDiffRows(diff: DiffLine[]): DiffRows {
  const split: SplitRow[] = [];
  const unified: UnifiedRow[] = [];
  let oldNo = 1;
  let newNo = 1;
  let i = 0;

  while (i < diff.length) {
    const line = diff[i];
    if (!line) break;

    if (line.type === 'same') {
      const left: DiffCell = { lineNo: oldNo++, text: line.text, type: 'same' };
      const right: DiffCell = { lineNo: newNo++, text: line.text, type: 'same' };
      split.push({ left, right });
      unified.push({ cell: right, oldNo: left.lineNo, newNo: right.lineNo });
      i += 1;
      continue;
    }

    // Collect one whole "change block" (removed + added lines in any order)
    const removed: DiffLine[] = [];
    const added: DiffLine[] = [];
    while (i < diff.length) {
      const l = diff[i];
      if (!l || l.type === 'same') break;
      (l.type === 'removed' ? removed : added).push(l);
      i += 1;
    }

    const removedCells: DiffCell[] = removed.map((l) => ({ lineNo: oldNo++, text: l.text, type: 'removed' }));
    const addedCells: DiffCell[] = added.map((l) => ({ lineNo: newNo++, text: l.text, type: 'added' }));

    // Pair line k of the old block with line k of the new block -> "modified"
    const pairs = Math.min(removedCells.length, addedCells.length);
    for (let k = 0; k < pairs; k++) {
      const r = removedCells[k];
      const a = addedCells[k];
      if (!r || !a) continue;
      const seg = wordSegments(r.text, a.text);
      r.segments = seg.left;
      a.segments = seg.right;
    }

    const rowCount = Math.max(removedCells.length, addedCells.length);
    for (let k = 0; k < rowCount; k++) {
      split.push({ left: removedCells[k] ?? null, right: addedCells[k] ?? null });
    }
    for (const c of removedCells) unified.push({ cell: c, oldNo: c.lineNo, newNo: null });
    for (const c of addedCells) unified.push({ cell: c, oldNo: null, newNo: c.lineNo });
  }

  return { split, unified };
}

export function splitRowKind(row: SplitRow): RowKind {
  const removed = row.left?.type === 'removed';
  const added = row.right?.type === 'added';
  if (removed && added) return 'changed';
  if (removed) return 'removed';
  if (added) return 'added';
  return 'same';
}

export interface KindBlock {
  start: number;
  end: number; // exclusive
  kind: Exclude<RowKind, 'same'>;
}

/** Groups consecutive changed rows, used by the minimap. */
export function groupKinds(kinds: RowKind[]): KindBlock[] {
  const blocks: KindBlock[] = [];
  kinds.forEach((kind, index) => {
    if (kind === 'same') return;
    const last = blocks[blocks.length - 1];
    if (last && last.end === index) {
      last.end = index + 1;
      if (last.kind !== kind) last.kind = 'changed';
    } else {
      blocks.push({ start: index, end: index + 1, kind });
    }
  });
  return blocks;
}