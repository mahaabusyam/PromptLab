import { Download, RotateCcw } from 'lucide-react';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import { buildCompare } from '@/features/compare/compare';
import { CompareHeader } from '@/features/compare/components/CompareHeader';
import { CompareSummaryCards } from '@/features/compare/components/CompareSummaryCards';
import { DiffToolbar } from '@/features/compare/components/DiffToolbar';
import type { DiffMode } from '@/features/compare/components/DiffToolbar';
import { DiffViewer } from '@/features/compare/components/DiffViewer';
import { VersionPickerBar } from '@/features/compare/components/VersionPickerBar';
import { buildUnifiedDiffText, downloadTextFile, slugify } from '@/features/compare/exportDiff';
import { useCompareSelection } from '@/features/compare/hooks/useCompareSelection';
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { usePromptStore } from '@/stores/promptStore';

export default function ComparePage() {
  const { selection, comparable, setPrompt, setBase, setTarget, swap } = useCompareSelection();
  const restoreVersion = usePromptStore((s) => s.restoreVersion);
  const rootRef = useRef<HTMLDivElement>(null);

  // Phones get the unified layout first: two code columns don't fit
  const [mode, setMode] = useState<DiffMode>(() =>
    window.matchMedia('(min-width: 1024px)').matches ? 'split' : 'unified',
  );
  const [wrap, setWrap] = useState(true);
  const [confirmRestore, setConfirmRestore] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const result = useMemo(
    () => (selection ? buildCompare(selection.base, selection.target) : null),
    [selection],
  );

  const promptOptions = useMemo(
    () => comparable.map((p) => ({ id: p.id, title: p.title })),
    [comparable],
  );

  const hasSelection = selection !== null;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !hasSelection) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-enter]',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out', clearProps: 'transform,opacity' },
      );
    }, root);
    return () => ctx.revert();
  }, [hasSelection]);

  const handleExport = useCallback(() => {
    if (!selection || !result) return;
    const { prompt, base, target } = selection;
    const text = buildUnifiedDiffText(prompt.title, base.label, target.label, result.diff);
    downloadTextFile(`${slugify(prompt.title)}-${base.label}-vs-${target.label}.diff`, text);
  }, [selection, result]);

  if (!selection || !result) {
    return (
      <div className="rounded-xl border border-dashed border-border p-10 text-center">
        <h1 className="font-heading text-xl font-semibold">Nothing to compare yet</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A prompt needs at least two saved versions. Save a version from the editor, then come back.
        </p>
        <Link
          to="/library"
          className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-2 focus-visible:outline-primary"
        >
          Go to Library
        </Link>
      </div>
    );
  }

  const { prompt, base, target } = selection;
  // The newest version is what the editor already shows: restoring it is a no-op.
  const baseIsCurrent = prompt.versions[prompt.versions.length - 1]?.id === base.id;

  function handleConfirmRestore(): void {
    const created = restoreVersion(prompt.id, base.id);
    setNotice(
      created
        ? `Restored ${base.label} as new version ${created.label}. Open the editor to continue from it.`
        : 'Could not restore this version.',
    );
    setConfirmRestore(false);
  }

  return (
    <div ref={rootRef} className="space-y-6">
      <CompareHeader
        promptId={prompt.id}
        promptTitle={prompt.title}
        options={promptOptions}
        onPromptChange={setPrompt}
      />

      <VersionPickerBar
        versions={prompt.versions}
        base={base}
        target={target}
        onBaseChange={setBase}
        onTargetChange={setTarget}
        onSwap={swap}
      />

      <DiffToolbar mode={mode} onModeChange={setMode} wrap={wrap} onWrapChange={setWrap}>
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Download className="size-4" aria-hidden="true" />
          Export Diff
        </button>
        <button
          type="button"
          onClick={() => setConfirmRestore(true)}
          disabled={baseIsCurrent}
          title={baseIsCurrent ? `${base.label} is already the current version` : undefined}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Restore Version {base.label}
        </button>
      </DiffToolbar>

      {notice && (
        <p role="status" className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
          {notice}
        </p>
      )}

      <DiffViewer base={base} target={target} result={result} mode={mode} wrap={wrap} />

      <CompareSummaryCards base={base} target={target} result={result} />

      {confirmRestore && (
        <ConfirmDialog
          tone="primary"
          title={`Restore ${base.label}?`}
          description={`"${prompt.title}" will get a new version with the content of ${base.label}. Your existing history is kept, nothing is overwritten.`}
          confirmLabel="Restore version"
          onConfirm={handleConfirmRestore}
          onCancel={() => setConfirmRestore(false)}
        />
      )}
    </div>
  );
}