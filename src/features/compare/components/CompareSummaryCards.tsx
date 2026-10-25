import { formatDistanceToNow } from 'date-fns';
import { BarChart3, FileText, Variable } from 'lucide-react';
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import type { PromptVersion } from '@/features/prompts/types';
import { toSnapshot } from '../compare';
import type { CompareResult } from '../compare';

interface CompareSummaryCardsProps {
  base: PromptVersion;
  target: PromptVersion;
  result: CompareResult;
}

const cardClass = 'flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-5';
const titleClass = 'flex items-center gap-2 text-xs font-semibold uppercase tracking-wider';

function formatUsd(value: number): string {
  return `${value >= 0 ? '+' : '−'}$${Math.abs(value).toFixed(4)}`;
}

export function CompareSummaryCards({ base, target, result }: CompareSummaryCardsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const baseSnap = toSnapshot(base);
  const targetSnap = toSnapshot(target);

  const total = result.added + result.removed + result.unchanged;
  const pct = (n: number): string => `${total === 0 ? 0 : (n / total) * 100}%`;
  const costDelta = targetSnap.costUsd - baseSnap.costUsd;
  const sizeText =
    result.sizePercent === null
      ? null
      : `${result.sizePercent >= 0 ? '+' : ''}${result.sizePercent}% size`;

  // Grow the delta bar segments whenever the compared pair changes
  const pairKey = `${base.id}:${target.id}`;
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-bar]',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.6, ease: 'power2.out', transformOrigin: 'left center', clearProps: 'transform' },
      );
    }, root);
    return () => ctx.revert();
  }, [pairKey]);

  return (
    <div ref={rootRef} data-enter className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* 1) Changelog */}
      <section className={cardClass} aria-labelledby="cmp-changelog">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 id="cmp-changelog" className={`${titleClass} text-foreground`}>
              <FileText className="size-4 text-primary" aria-hidden="true" />
              Changelog for {target.label}
            </h2>
            {target.restoredFrom && (
              <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[11px] font-semibold text-red-500">
                Restored from {target.restoredFrom}
              </span>
            )}
          </div>
          <p className="rounded-xl bg-muted/60 p-3 text-sm italic text-muted-foreground">
            {target.note ? `“${target.note}”` : 'No description was saved with this version.'}
          </p>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary" aria-hidden="true">
              M
            </span>
            Maha
          </span>
          <time dateTime={target.createdAt}>
            {formatDistanceToNow(new Date(target.createdAt), { addSuffix: true })}
          </time>
        </div>
      </section>

      {/* 2) Line & token delta */}
      <section className={cardClass} aria-labelledby="cmp-delta">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 id="cmp-delta" className={`${titleClass} text-foreground`}>
              <BarChart3 className="size-4 text-primary" aria-hidden="true" />
              Line &amp; Token Delta
            </h2>
            {sizeText && <span className="font-mono text-xs font-medium text-primary">{sizeText}</span>}
          </div>

          <div
            className="flex h-2 w-full overflow-hidden rounded-full bg-muted"
            role="img"
            aria-label={`${result.added} lines added, ${result.removed} removed, ${result.unchanged} unchanged`}
          >
            <div data-bar className="h-full bg-primary" style={{ width: pct(result.added) }} />
            <div data-bar className="h-full bg-red-500" style={{ width: pct(result.removed) }} />
            <div data-bar className="h-full bg-muted-foreground/30" style={{ width: pct(result.unchanged) }} />
          </div>

          <ul className="flex flex-wrap justify-between gap-2 text-xs">
            <li className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" aria-hidden="true" />{result.added} added</li>
            <li className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-red-500" aria-hidden="true" />{result.removed} removed</li>
            <li className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-muted-foreground/40" aria-hidden="true" />{result.unchanged} unchanged</li>
          </ul>
        </div>

        <dl className="flex items-end justify-between text-xs">
          <div>
            <dt className="text-muted-foreground">Tokens</dt>
            <dd className="font-mono font-semibold">
              {baseSnap.tokens} → {targetSnap.tokens}{' '}
              <span className="text-primary">({result.tokenDelta >= 0 ? '+' : ''}{result.tokenDelta})</span>
            </dd>
          </div>
          <div className="text-end">
            <dt className="text-muted-foreground">Est. cost / run</dt>
            <dd className="font-mono font-semibold">{formatUsd(costDelta)}</dd>
          </div>
        </dl>
      </section>

      {/* 3) Variables changed (replaces the design's benchmark card) */}
      <section className={cardClass} aria-labelledby="cmp-vars">
        <div className="space-y-3">
          <h2 id="cmp-vars" className={`${titleClass} text-foreground`}>
            <Variable className="size-4 text-primary" aria-hidden="true" />
            Variables changed
          </h2>

          {result.variablesAdded.length === 0 && result.variablesRemoved.length === 0 ? (
            <p className="rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">
              No variables were added or removed between these versions.
            </p>
          ) : (
            <ul className="flex flex-wrap gap-2 font-mono text-xs">
              {result.variablesAdded.map((name) => (
                <li key={`a-${name}`} className="rounded-md bg-primary/10 px-2 py-1 font-semibold text-primary">
                  <span className="sr-only">Added: </span>+ {`{{${name}}}`}
                </li>
              ))}
              {result.variablesRemoved.map((name) => (
                <li key={`r-${name}`} className="rounded-md bg-red-500/10 px-2 py-1 font-semibold text-red-500 line-through">
                  <span className="sr-only">Removed: </span>− {`{{${name}}}`}
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {result.variablesAdded.length} added · {result.variablesRemoved.length} removed
        </p>
      </section>
    </div>
  );
}