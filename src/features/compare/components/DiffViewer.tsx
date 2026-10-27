import { Check, Copy, MinusCircle, PlusCircle } from 'lucide-react';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      aria-label={copied ? t('templates.preview.copied') : label}
      title={label}
      className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
    >
      {copied ? <Check className="size-4 text-emerald-500" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
    </button>
  );
}

export function DiffViewer({ base, target, result, mode, wrap }: DiffViewerProps) {
  const { t } = useTranslation();
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
      aria-label={t('compare.viewer.label')}
      className="overflow-hidden rounded-2xl border border-border bg-card"
    >
      {/* Column headers: LTR like the code below, so Base stays on the left */}
      {mode === 'split' ? (
        <div dir="ltr" className="grid grid-cols-1 border-b border-border bg-muted/40 text-sm sm:grid-cols-2">
          <div className="flex items-center justify-between gap-2 px-4 py-2.5">
            <span className="flex flex-wrap items-center gap-2 font-semibold">
              <MinusCircle className="size-4 text-red-500" aria-hidden="true" />
              <bdi>{t('compare.viewer.base', { label: base.label })}</bdi>
              <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-semibold text-red-500">
                {t('history.card.linesRemoved', { total: result.removed })}
              </span>
            </span>
            <CopyRaw text={base.content} label={t('compare.viewer.copyRaw', { label: base.label })} />
          </div>
          <div className="flex items-center justify-between gap-2 px-4 py-2.5 sm:border-s sm:border-border">
            <span className="flex flex-wrap items-center gap-2 font-semibold">
              <PlusCircle className="size-4 text-primary" aria-hidden="true" />
              <bdi>{t('compare.viewer.target', { label: target.label })}</bdi>
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
                {t('history.card.linesAdded', { total: result.added })}
              </span>
            </span>
            <CopyRaw text={target.content} label={t('compare.viewer.copyRaw', { label: target.label })} />
          </div>
        </div>
      ) : (
        <div
          dir="ltr"
          className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5 text-sm font-semibold"
        >
          <span>
            {base.label} → {target.label}
          </span>
          <CopyRaw text={target.content} label={t('compare.viewer.copyRaw', { label: target.label })} />
        </div>
      )}

      {/* Body + minimap (always LTR: it is code) */}
      <div dir="ltr" className="flex">
        <div
          ref={scrollRef}
          data-lenis-prevent
          tabIndex={0}
          role="region"
          aria-label={t('compare.viewer.region')}
          className="max-h-[34rem] min-w-0 flex-1 overflow-auto bg-background py-2 font-mono text-[13px] leading-[22px] focus-visible:outline-2 focus-visible:outline-primary"
        >
          <div ref={bodyRef} className={wrap ? 'w-full' : 'w-max min-w-full'}>
            {result.diff.length === 0 ? (
              <p dir="auto" className="p-4 text-sm text-muted-foreground">{t('compare.viewer.empty')}</p>
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
        <span dir="ltr">UTF-8 · Handlebars syntax</span>
        <span className="flex flex-wrap items-center gap-2 font-mono">
          <span className="font-medium text-primary">{t('history.card.linesAdded', { total: result.added })}</span>
          <span aria-hidden="true">·</span>
          <span className="font-medium text-red-500">{t('history.card.linesRemoved', { total: result.removed })}</span>
          <span aria-hidden="true">·</span>
          <span className="text-foreground">{t('compare.viewer.net', { net })}</span>
        </span>
      </div>
    </section>
  );
}