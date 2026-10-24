import { Columns2, Rows3, WrapText } from 'lucide-react';
import type { ReactNode } from 'react';

export type DiffMode = 'split' | 'unified';

interface DiffToolbarProps {
  mode: DiffMode;
  onModeChange: (mode: DiffMode) => void;
  wrap: boolean;
  onWrapChange: (wrap: boolean) => void;
  children?: ReactNode;
}

const modes = [
  { value: 'split' as const, label: 'Split', icon: Columns2 },
  { value: 'unified' as const, label: 'Unified', icon: Rows3 },
];

export function DiffToolbar({ mode, onModeChange, wrap, onWrapChange, children }: DiffToolbarProps) {
  return (
    <div data-enter className="flex flex-wrap items-center gap-3">
      <div className="inline-flex rounded-xl border border-border bg-card p-1" role="group" aria-label="Diff layout">
        {modes.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            aria-pressed={mode === value}
            onClick={() => onModeChange(value)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
              mode === value ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={wrap}
        onClick={() => onWrapChange(!wrap)}
        className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary"
      >
        <WrapText className="size-4" aria-hidden="true" />
        Word wrap: {wrap ? 'ON' : 'OFF'}
      </button>

      <div className="ml-auto flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}