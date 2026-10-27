import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface CompareHeaderProps {
  promptId: string;
  promptTitle: string;
  options: { id: string; title: string }[];
  onPromptChange: (id: string) => void;
}

export function CompareHeader({ promptId, promptTitle, options, onPromptChange }: CompareHeaderProps) {
  const { t } = useTranslation();
  return (
    <header data-enter className="space-y-4">
      <nav
        aria-label={t('compare.header.breadcrumb')}
        className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"
      >
        <Link
          to={`/editor/${promptId}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2 py-1 font-medium transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
        >
          <ArrowLeft className="size-3.5 rtl:-scale-x-100" aria-hidden="true" />
          {t('compare.header.editor')}
        </Link>
        <span aria-hidden="true">/</span>
        <span dir="auto" className="max-w-60 truncate">{promptTitle}</span>
        <span aria-hidden="true">/</span>
        <span className="font-semibold text-primary" aria-current="page">{t('compare.header.current')}</span>
      </nav>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-3xl font-bold tracking-tight">{t('compare.header.title')}</h1>
            <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
              {t('compare.header.live')}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{t('compare.header.subtitle')}</p>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">{t('compare.header.prompt')}</span>
          <select
            value={promptId}
            onChange={(e) => onPromptChange(e.target.value)}
            className="h-10 max-w-64 rounded-lg border border-border bg-card px-3 text-sm focus-visible:outline-2 focus-visible:outline-primary"
          >
            {options.map((o) => (
              <option key={o.id} value={o.id}>{o.title}</option>
            ))}
          </select>
        </label>
      </div>
    </header>
  );
}