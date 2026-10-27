import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TemplatesHeaderProps {
  total: number;
  query: string;
  onQueryChange: (query: string) => void;
}

export function TemplatesHeader({
  total,
  query,
  onQueryChange,
}: TemplatesHeaderProps) {
  const { t } = useTranslation();
  return (
    <header
      data-enter
      className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between"
    >
      <div className="max-w-3xl space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            {t("templates.header.title")}
          </h1>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
            <span
              className="size-1.5 animate-pulse rounded-full bg-primary"
              aria-hidden="true"
            />
            {t("templates.header.ready", { total })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {t("templates.header.subtitle")}
        </p>
      </div>

      <div className="relative w-full xl:w-80">
        <Search
          className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={t("templates.header.searchPlaceholder")}
          aria-label={t("templates.header.searchLabel")}
          className="h-10 w-full rounded-xl border border-border bg-card ps-9 pe-3 text-sm placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-primary"
        />
      </div>
    </header>
  );
}
