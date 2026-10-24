import { ArrowUpRight, Check, Copy, ExternalLink, Eye, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Template } from '@/features/templates/schemas';
import { useCopyText } from '../hooks/useCopyText';
import type { FavoriteEntry } from '../types';

export type TemplateEntry = Extract<FavoriteEntry, { kind: 'template' }>;

export interface FavoriteHandlers {
  onToggle: (entry: FavoriteEntry) => void;
  onUse: (template: Template) => void;
  onPreview: (entry: TemplateEntry) => void;
}

export function FavoriteHeart({ entry, onToggle }: { entry: FavoriteEntry; onToggle: (e: FavoriteEntry) => void }) {
  return (
    <button
      type="button"
      aria-pressed
      aria-label={`Remove ${entry.title} from favorites`}
      onClick={() => onToggle(entry)}
      className="rounded-lg p-1 text-pink-500 transition-[scale] hover:scale-110 focus-visible:outline-2 focus-visible:outline-primary"
    >
      <Heart className="size-5 fill-pink-500" aria-hidden="true" />
    </button>
  );
}

export function KindBadge({ entry }: { entry: FavoriteEntry }) {
  const isTemplate = entry.kind === 'template';
  const featured = isTemplate && entry.template.featured;
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
        featured
          ? 'bg-primary text-primary-foreground'
          : isTemplate
            ? 'bg-muted text-violet-500'
            : 'bg-muted text-primary'
      }`}
    >
      {featured ? 'Featured template' : entry.kind}
    </span>
  );
}

const iconBtn =
  'rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary';

export function FavoriteActions({ entry, onUse, onPreview }: { entry: FavoriteEntry } & Pick<FavoriteHandlers, 'onUse' | 'onPreview'>) {
  const text = entry.kind === 'prompt' ? entry.prompt.content : entry.template.content;
  const { copied, copy } = useCopyText(text);

  if (entry.kind === 'prompt') {
    return (
      <div className="flex items-center gap-1">
        <button type="button" onClick={copy} className={iconBtn} aria-label={copied ? 'Copied' : `Copy ${entry.title}`} title="Copy prompt">
          {copied ? <Check className="size-[18px] text-emerald-500" aria-hidden="true" /> : <Copy className="size-[18px]" aria-hidden="true" />}
        </button>
        <Link to={`/editor/${entry.id}`} className={`${iconBtn} text-primary`} aria-label={`Open ${entry.title} in editor`} title="Open in Editor">
          <ExternalLink className="size-[18px]" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={() => onPreview(entry)} className={iconBtn} aria-label={`Preview ${entry.title}`} title="Quick preview">
        <Eye className="size-[18px]" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => onUse(entry.template)}
        className="inline-flex items-center gap-1 rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-primary"
      >
        Use Template
        <ArrowUpRight className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}