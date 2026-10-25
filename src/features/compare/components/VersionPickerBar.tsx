import { format, formatDistanceToNow } from 'date-fns';
import { ArrowLeftRight, History, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { PromptVersion } from '@/features/prompts/types';
import { toSnapshot } from '../compare';

type Role = 'base' | 'target';

interface VersionPickerBarProps {
  versions: PromptVersion[];
  base: PromptVersion;
  target: PromptVersion;
  onBaseChange: (id: string) => void;
  onTargetChange: (id: string) => void;
  onSwap: () => void;
}

const roleStyle: Record<Role, { title: string; icon: LucideIcon; iconBox: string; pill: string }> = {
  base: {
    title: 'Base (Previous)',
    icon: History,
    iconBox: 'bg-red-500/15 text-red-500',
    pill: 'text-red-500',
  },
  target: {
    title: 'Target (Newer)',
    icon: ShieldCheck,
    iconBox: 'bg-primary/15 text-primary',
    pill: 'text-primary',
  },
};

function VersionCard({
  role,
  versions,
  selected,
  onChange,
}: {
  role: Role;
  versions: PromptVersion[];
  selected: PromptVersion;
  onChange: (id: string) => void;
}) {
  const style = roleStyle[role];
  const Icon = style.icon;
  const snap = toSnapshot(selected);
  const date = new Date(selected.createdAt);
  const selectId = `compare-${role}`;

  return (
    <div className="flex w-full flex-1 flex-col gap-3 rounded-xl bg-background/60 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${style.iconBox}`}>
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <label htmlFor={selectId} className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {style.title}
            </label>
            <span className={`rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-medium ${style.pill}`}>
              {snap.label}
            </span>
          </div>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
            <time dateTime={snap.createdAt} title={format(date, 'PPpp')}>
              Saved {formatDistanceToNow(date, { addSuffix: true })}
            </time>
            <span className="font-mono">#{snap.hash}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-end text-xs">
          <p className="text-muted-foreground">Token Count</p>
          <p className="font-mono font-semibold">
            {snap.tokens} tok{' '}
            <span className="font-normal text-muted-foreground">(${snap.costUsd.toFixed(4)})</span>
          </p>
        </div>
        <select
          id={selectId}
          value={selected.id}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 rounded-lg border border-border bg-card px-2 text-sm focus-visible:outline-2 focus-visible:outline-primary"
        >
          {[...versions].reverse().map((v) => (
            <option key={v.id} value={v.id}>
              {v.label} · {format(new Date(v.createdAt), 'MMM d')}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function VersionPickerBar({
  versions,
  base,
  target,
  onBaseChange,
  onTargetChange,
  onSwap,
}: VersionPickerBarProps) {
  return (
    <section
      data-enter
      aria-label="Choose versions to compare"
      className="flex flex-col items-stretch gap-3 rounded-2xl border border-border bg-card p-4 lg:flex-row lg:items-center"
    >
      <VersionCard role="base" versions={versions} selected={base} onChange={onBaseChange} />

      <button
        type="button"
        onClick={onSwap}
        aria-label="Swap base and target versions"
        className="group flex size-10 shrink-0 items-center justify-center self-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary/15 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
      >
        <ArrowLeftRight
          className="size-5 transition-[rotate] duration-300 group-hover:rotate-180"
          aria-hidden="true"
        />
      </button>

      <VersionCard role="target" versions={versions} selected={target} onChange={onTargetChange} />
    </section>
  );
}