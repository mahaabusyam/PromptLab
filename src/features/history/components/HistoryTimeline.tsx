import { useLayoutEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { groupByDay } from '../groupByDay';
import type { HistoryEntry } from '../types';
import { HistoryLogCard } from './HistoryLogCard';

interface HistoryTimelineProps {
  entries: HistoryEntry[];
  onRestore: (entry: HistoryEntry) => void;
  onDelete: (entry: HistoryEntry) => void;
}

export function HistoryTimeline({ entries, onRestore, onDelete }: HistoryTimelineProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const groups = useMemo(() => groupByDay(entries), [entries]);
  // Re-run the animation only when the set of visible entries changes
  const idsKey = useMemo(() => entries.map((e) => e.id).join('|'), [entries]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-log]',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          stagger: { each: 0.05, amount: 0.6 },
          ease: 'power2.out',
          clearProps: 'transform,opacity',
        },
      );
    }, root);

    return () => ctx.revert();
  }, [idsKey]);

  return (
    <div ref={rootRef} className="space-y-10">
      {groups.map((group) => (
        <section key={group.key} aria-labelledby={`day-${group.key}`}>
          <div className="mb-4 flex items-baseline gap-3">
            <h2 id={`day-${group.key}`} className="font-heading text-lg font-semibold">
              {group.label}
            </h2>
            <span className="text-xs text-muted-foreground">
              {group.entries.length} {group.entries.length === 1 ? 'commit' : 'commits'} recorded
            </span>
          </div>

          <ol className="relative space-y-4 ps-8 before:absolute before:bottom-2 before:start-[11px] before:top-2 before:w-px before:bg-linear-to-b before:from-primary/60 before:to-transparent">
            {group.entries.map((entry) => (
              <li key={entry.id} data-log className="relative">
                <span
                  aria-hidden="true"
                  className={`absolute top-6 -start-[26px] size-3 rounded-full border-2 border-background ${
                    entry.isRollback ? 'bg-red-500' : 'bg-primary'
                  }`}
                />
                <HistoryLogCard entry={entry} onRestore={onRestore} onDelete={onDelete} />
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}