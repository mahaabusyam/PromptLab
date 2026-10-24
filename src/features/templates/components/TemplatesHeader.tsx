import { Search } from 'lucide-react';

interface TemplatesHeaderProps {
  total: number;
  query: string;
  onQueryChange: (query: string) => void;
}

export function TemplatesHeader({ total, query, onQueryChange }: TemplatesHeaderProps) {
  return (
    <header data-enter className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div className="max-w-3xl space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-3xl font-bold tracking-tight">Templates Gallery</h1>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
            <span className="size-1.5 animate-pulse rounded-full bg-primary" aria-hidden="true" />
            {total} Ready to use
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Start from a battle-tested prompt for marketing, coding, education, writing or data analysis.
          Pick one, fill the variables and make it yours.
        </p>
      </div>

      <div className="relative w-full xl:w-80">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search templates, tags, variables..."
          aria-label="Search templates"
          className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-primary"
        />
      </div>
    </header>
  );
}