import { ArrowRight, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { providerLabels } from '@/features/prompts/constants';
import { complexityLabels } from '../constants';
import type { TemplateListItem } from '../types';

interface FeaturedTemplateProps {
  item: TemplateListItem;
  onUse: (item: TemplateListItem) => void;
}

export function FeaturedTemplate({ item, onUse }: FeaturedTemplateProps) {
  const { t } = useTranslation();
  const { template, variables, tokens } = item;

  const metrics = [
    { label: t('templates.featured.base'), value: t('templates.featured.tokensValue', { total: tokens }) },
    { label: t('templates.featured.variables'), value: String(variables.length) },
    { label: t('templates.featured.bestWith'), value: providerLabels[template.provider] },
    { label: t('templates.featured.complexity'), value: complexityLabels[template.complexity].split(' (')[0] ?? '' },
  ];

  return (
    <section
      data-enter
      aria-labelledby="featured-title"
      className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 lg:p-8"
    >
      <div className="pointer-events-none absolute -end-16 -top-24 size-80 rounded-full bg-primary/15 blur-[90px]" aria-hidden="true" />

      <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
            <Sparkles className="size-3.5" aria-hidden="true" />
            {t('templates.featured.badge')}
          </span>
          <div>
            <h2 id="featured-title" dir="auto" className="font-heading text-2xl font-bold tracking-tight">
              {template.title}
            </h2>
            <p dir="auto" className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{template.description}</p>
          </div>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {metrics.map((m) => (
              <div key={m.label} className="rounded-xl bg-background/60 p-3">
                <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{m.label}</dt>
                <dd className="mt-0.5 text-sm font-semibold">{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <button
          type="button"
          onClick={() => onUse(item)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {t('templates.featured.launch')}
          <ArrowRight className="rtl:-scale-x-100 size-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}