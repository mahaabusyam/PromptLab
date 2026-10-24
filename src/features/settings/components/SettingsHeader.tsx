import { Check } from 'lucide-react';

interface SettingsHeaderProps {
  isDirty: boolean;
  saved: boolean;
  onDiscard: () => void;
}

export function SettingsHeader({ isDirty, saved, onDiscard }: SettingsHeaderProps) {
  return (
    <header
      data-enter
      className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-6 md:flex-row md:items-center"
    >
      <div>
        <h1 className="font-heading text-headline-lg">Settings &amp; Preferences</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Configure your workspace, appearance, and back up or restore your local data.
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span role="status" className="text-xs text-muted-foreground">
          {isDirty ? 'Unsaved changes' : saved ? (
            <span className="inline-flex items-center gap-1 text-primary">
              <Check className="size-3.5" aria-hidden="true" /> Saved
            </span>
          ) : null}
        </span>
        <button
          type="button"
          onClick={onDiscard}
          disabled={!isDirty}
          className="rounded-xl bg-muted px-4 py-2 text-sm font-semibold transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50"
        >
          Discard Changes
        </button>
        <button
          type="submit"
          form="general-form"
          disabled={!isDirty}
          className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
        >
          Save Changes
        </button>
      </div>
    </header>
  );
}