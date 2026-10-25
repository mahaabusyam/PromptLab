import type { RefObject } from 'react';
import { groupKinds } from '../diffRows';
import type { KindBlock, RowKind } from '../diffRows';

interface DiffMinimapProps {
  kinds: RowKind[];
  scrollRef: RefObject<HTMLDivElement | null>;
}

const blockTone: Record<KindBlock['kind'], string> = {
  added: 'bg-primary',
  removed: 'bg-red-500',
  changed: 'bg-amber-500',
};

const blockLabel: Record<KindBlock['kind'], string> = {
  added: 'added',
  removed: 'removed',
  changed: 'modified',
};

export function DiffMinimap({ kinds, scrollRef }: DiffMinimapProps) {
  const total = Math.max(kinds.length, 1);
  const blocks = groupKinds(kinds);

  function jumpTo(block: KindBlock): void {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: (block.start / total) * el.scrollHeight - 24, behavior: 'smooth' });
  }

  return (
    <div className="relative hidden w-4 shrink-0 border-s border-border bg-muted/30 md:block">
      {blocks.map((block) => (
        <button
          key={`${block.start}-${block.end}`}
          type="button"
          onClick={() => jumpTo(block)}
          title={`Lines ${block.start + 1}–${block.end} (${blockLabel[block.kind]})`}
          aria-label={`Jump to ${blockLabel[block.kind]} lines ${block.start + 1} to ${block.end}`}
          style={{
            top: `${(block.start / total) * 100}%`,
            height: `max(${((block.end - block.start) / total) * 100}%, 4px)`,
          }}
          className={`absolute start-0.5 w-3 rounded-sm opacity-80 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-primary ${blockTone[block.kind]}`}
        />
      ))}
    </div>
  );
}