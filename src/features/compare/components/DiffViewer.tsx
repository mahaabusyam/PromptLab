import { Check, Copy, MinusCircle, PlusCircle } from 'lucide-react';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import type { PromptVersion } from '@/features/prompts/types';
import { buildDiffRows, splitRowKind } from '../diffRows';
import type { CompareResult } from '../compare';
import type { DiffMode } from './DiffToolbar';
import { SplitBody, UnifiedBody } from './DiffBody';
import { DiffMinimap } from './DiffMinimap';

interface DiffViewerProps {
  base: PromptVersion;
  target: PromptVersion;
  result: CompareResult;
  mode: DiffMode;
  wrap: boolean;
}

function CopyRaw({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? 'Copied' : label}
      title={label}
      className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
    >
      {copied ? <Check className="size-4 text-emerald-500" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
    </button>
  );
}

export function DiffViewer({ base, target, result, mode, wrap }: DiffViewerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const rows = useMemo(() => buildDiffRows(result.diff), [result.diff]);
  const kinds = useMemo(
    () => (mode === 'split' ? rows.split.map(splitRowKind) : rows.unified.map((r) => r.cell.type)),
    [mode, rows],
  );

  // Soft fade when the compared pair changes
  const pairKey = `${base.id}:${target.id}:${mode}`;
  useLayoutEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tween = gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.3, clearProps: 'opacity' });
    return () => {
      tween.kill();
    };
  }, [pairKey]);

  const net = `${result.tokenDelta >= 0 ? '+' : ''}${result.tokenDelta}`;

  return (
    <section
      data-enter
      aria-label="Diff viewer"
      className="overflow-hidden rounded-2xl border border-border bg-card"
    >
      {/* Column headers */}
      {mode === 'split' ? (
        <div className="grid grid-cols-1 border-b border-border bg-muted/40 text-sm sm:grid-cols-2">
          <div className="flex items-center justify-between gap-2 px-4 py-2.5">
            <span className="flex items-center gap-2 font-semibold">
              <MinusCircle className="size-4 text-red-500" aria-hidden="true" />
              {base.label} (Base)
              <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-semibold text-red-500">
                −{result.removed} {result.removed === 1 ? 'line' : 'lines'}
              </span>
            </span>
            <CopyRaw text={base.content} label={`Copy raw ${base.label}`} />
          </div>
          <div className="flex items-center justify-between gap-2 px-4 py-2.5 sm:border-s sm:border-border">
            <span className="flex items-center gap-2 font-semibold">
              <PlusCircle className="size-4 text-primary" aria-hidden="true" />
              {target.label} (Target)
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
                +{result.added} {result.added === 1 ? 'line' : 'lines'}
              </span>
            </span>
            <CopyRaw text={target.content} label={`Copy raw ${target.label}`} />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5 text-sm font-semibold">
          <span>
            {base.label} → {target.label}
          </span>
          <CopyRaw text={target.content} label={`Copy raw ${target.label}`} />
        </div>
      )}

      {/* Body + minimap */}
      <div className="flex">
        <div
          ref={scrollRef}
          data-lenis-prevent
          tabIndex={0}
          role="region"
          aria-label="Diff content, scrollable"
          className="max-h-[34rem] min-w-0 flex-1 overflow-auto bg-background py-2 font-mono text-[13px] leading-[22px] focus-visible:outline-2 focus-visible:outline-primary"
        >
          <div ref={bodyRef} className={wrap ? 'w-full' : 'w-max min-w-full'}>
            {result.diff.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">Both versions are empty.</p>
            ) : mode === 'split' ? (
              <SplitBody rows={rows.split} wrap={wrap} />
            ) : (
              <UnifiedBody rows={rows.unified} wrap={wrap} />
            )}
          </div>
        </div>
        <DiffMinimap kinds={kinds} scrollRef={scrollRef} />
      </div>

      {/* Status bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
        <span>UTF-8 · Handlebars syntax</span>
        <span className="flex items-center gap-2 font-mono">
          <span className="font-medium text-primary">+{result.added} lines</span>
          <span aria-hidden="true">·</span>
          <span className="font-medium text-red-500">−{result.removed} lines</span>
          <span aria-hidden="true">·</span>
          <span className="text-foreground">Net {net} tokens</span>
        </span>
      </div>
    </section>
  );
}