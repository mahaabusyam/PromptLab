import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export const fieldClass =
  'w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-primary';

interface SettingsCardProps {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: ReactNode;
  children: ReactNode;
}

export function SettingsCard({ id, icon: Icon, title, description, badge, children }: SettingsCardProps) {
  return (
    <section
      id={id}
      data-enter
      aria-labelledby={`${id}-title`}
      className="scroll-mt-24 rounded-2xl border border-border bg-card p-6"
    >
      <header className="mb-5 flex items-start justify-between gap-3 border-b border-border pb-4">
        <div>
          <h2 id={`${id}-title`} className="flex items-center gap-2 font-heading text-lg font-semibold">
            <Icon className="size-5 text-primary" aria-hidden="true" />
            {title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        {badge}
      </header>
      {children}
    </section>
  );
}

interface SwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}

export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        checked ? 'bg-primary' : 'bg-muted'
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-[translate] ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}