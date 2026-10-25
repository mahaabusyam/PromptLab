import { Database, KeyRound, SlidersHorizontal, Palette, type LucideIcon } from 'lucide-react';
import { useActiveSection } from '../hooks/useActiveSection';
import { useStorageUsage } from '../hooks/useStorageUsage';
import { formatBytes, STORAGE_QUOTA_BYTES } from '../storage';

const sections: { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'general', label: 'General', icon: SlidersHorizontal },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'data', label: 'Data Management', icon: Database },
  { id: 'api', label: 'API & Security', icon: KeyRound },
];
const SECTION_IDS = sections.map((s) => s.id);

function scrollToSection(id: string): void {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

export function SettingsNav() {
  const active = useActiveSection(SECTION_IDS);
  const usage = useStorageUsage();

  return (
    <aside data-enter className="flex flex-col gap-4 lg:sticky lg:top-20 lg:col-span-3">
      <nav aria-label="Settings sections" className="rounded-2xl border border-border bg-card p-2">
        <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Configuration
        </p>
        <ul className="space-y-1">
          {sections.map(({ id, label, icon: Icon }) => {
            const isActive = active === id;
            return (
              <li key={id}>
                <button
                  type="button"
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => scrollToSection(id)}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-start text-sm transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
                    isActive
                      ? 'bg-primary/15 font-semibold text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="size-5" aria-hidden="true" />
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-sm font-semibold">Local Storage</h2>
          <span className="text-xs font-semibold text-primary">{usage.percent}% used</span>
        </div>
        <div
          role="progressbar"
          aria-label="Local storage used"
          aria-valuenow={usage.percent}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-3 h-2 overflow-hidden rounded-full bg-muted"
        >
          <div className="h-full rounded-full bg-primary" style={{ width: `${usage.percent}%` }} />
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>{formatBytes(usage.bytes)} used</span>
          <span>~{formatBytes(STORAGE_QUOTA_BYTES)} browser limit</span>
        </div>
      </div>
    </aside>
  );
}