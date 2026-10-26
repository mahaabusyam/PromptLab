import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, Braces, Code, Database, Eye, GraduationCap, Megaphone, PenLine, Sparkles, Star, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { categoryLabels, providerLabels } from '@/features/prompts/constants';
import { isCustomTemplate } from '../importTemplates';
import type { TemplateListItem } from '../types';

interface TemplateCardProps {
  item: TemplateListItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onUse: (item: TemplateListItem) => void;
  onPreview: (item: TemplateListItem) => void;
  onDelete: (item: TemplateListItem) => void;
}
// Keyed by string on purpose: unknown categories fall back to Sparkles instead of crashing.
const categoryIcons: Partial<Record<string, LucideIcon>> = {
  marketing: Megaphone,
  coding: Code,
  education: GraduationCap,
  writing: PenLine,
  'data-analysis': Database,
};

export function TemplateCard({ item, isFavorite, onToggleFavorite, onUse, onPreview, onDelete }: TemplateCardProps) {
  const { t } = useTranslation();
  const { template, variables, tokens } = item;
  const Icon = categoryIcons[template.category] ?? Sparkles;
  const shownVars = variables.slice(0, 3).map((v) => `{{${v}}}`).join(', ');
  const extraVars = variables.length - 3;

  return (
    <article
      data-card
      className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-muted/40 focus-within:border-primary/40"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-muted text-primary transition-[scale] group-hover:scale-105">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
              {categoryLabels[template.category]}
            </span>
          </div>

          <button
            type="button"
            aria-pressed={isFavorite}
            aria-label={
              isFavorite
                ? t('templates.card.favoriteRemove', { title: template.title })
                : t('templates.card.favoriteAdd', { title: template.title })
            }
            onClick={() => onToggleFavorite(template.id)}
            className="rounded-lg p-1 text-muted-foreground transition-colors hover:text-pink-500 focus-visible:outline-2 focus-visible:outline-primary"
          >
            <Star
              className={`size-5 ${isFavorite ? 'fill-pink-500 text-pink-500' : ''}`}
              aria-hidden="true"
            />
          </button>
        </div>

        <div>
          <h3 dir="auto" className="font-heading text-base font-semibold">{template.title}</h3>
          <p dir="auto" className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {template.description}
          </p>
        </div>

        <div className="space-y-2">
          <p className="inline-flex max-w-full items-center gap-1.5 rounded-md bg-muted px-2 py-1 font-mono text-xs text-primary">
            <Braces className="size-3.5 shrink-0" aria-hidden="true" />
            <span dir={shownVars ? 'ltr' : undefined} className="truncate">
              {shownVars || t('templates.card.noVariables')}
            </span>
            {extraVars > 0 && (
              <span dir="ltr" className="shrink-0 text-muted-foreground">+{extraVars}</span>
            )}
          </p>
          <p className="flex items-center justify-between font-mono text-xs text-muted-foreground">
            <span>{t('templates.card.tokens', { total: tokens })}</span>
            <span className="font-semibold text-foreground">{providerLabels[template.provider]}</span>
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onUse(item)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-muted py-2 text-sm font-semibold transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-primary"
        >
          {t('templates.card.use')}
          <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onPreview(item)}
          aria-label={t('templates.card.preview', { title: template.title })}
          className="rounded-xl bg-muted p-2 text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Eye className="size-[18px]" aria-hidden="true" />
        </button>
        {isCustomTemplate(template) && (
          <>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
              {t('templates.card.imported')}
            </span>

            <button
              type="button"
              onClick={() => onDelete(item)}
              aria-label={t('templates.card.delete', { title: template.title })}
              className="rounded-xl bg-muted p-2 text-red-500 transition-colors hover:bg-red-500/10 focus-visible:outline-2 focus-visible:outline-primary"
            >
              <Trash2 className="size-[18px]" aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </article>
  );
}