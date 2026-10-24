import { Check, Copy, Pencil, Star } from 'lucide-react'
import { useNavigate , Link } from 'react-router-dom'
import { ProviderIcon } from '@/features/prompts/components/ProviderIcon'
import { getVersionLabel } from '@/features/prompts/utils'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import type { Prompt } from '@/features/prompts/types'
import { StatusBadge } from '@/features/prompts/components/StatusBadge'



const actionBtn = 'rounded p-1 transition-colors hover:bg-surface-container'

interface RecentPromptCardProps {
  prompt: Prompt
  onToggleFavorite: (id: string) => void
}

export function RecentPromptCard({ prompt, onToggleFavorite }: RecentPromptCardProps) {
  const navigate = useNavigate()
  const { copied, copy } = useCopyToClipboard()
  
  return (
    <article
      data-reveal
      className="group relative flex flex-col justify-between rounded-xl bg-surface-container p-space-md shadow-sm transition-colors hover:bg-surface-container-high"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
  <StatusBadge status={prompt.status} />
  <span className="font-code-md text-label-sm text-outline">
    {getVersionLabel(prompt)}
  </span>
</div>

        <h3 className="line-clamp-1 text-title-md text-on-surface transition-colors group-hover:text-primary">
          {prompt.title}
        </h3>
        <p className="line-clamp-2 text-body-sm text-on-surface-variant">{prompt.description}</p>

        <div className="mt-1 flex flex-wrap gap-1">
          {prompt.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-surface-container-lowest px-2 py-0.5 text-label-sm text-primary"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="-mx-space-md -mb-space-md mt-space-md flex items-center justify-between gap-2 rounded-b-xl bg-surface-container-lowest/40 px-space-md py-2">
        <div className="flex min-w-0 items-center gap-3 font-code-md text-label-sm text-outline">
          <span className="flex min-w-0 items-center gap-1 text-on-surface">
            <ProviderIcon provider={prompt.model.provider} className="size-3.5 shrink-0" />
            <span className="truncate">{prompt.model.name}</span>
          </span>
          {prompt.lastRun ? (
            <>
              <span>{prompt.lastRun.latencyMs}ms</span>
              <span>${prompt.lastRun.costUsd.toFixed(3)}</span>
            </>
          ) : (
            <span className="whitespace-nowrap">Not run yet</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={prompt.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={prompt.isFavorite}
            onClick={() => onToggleFavorite(prompt.id)}
            className={`${actionBtn} ${prompt.isFavorite ? 'text-tertiary' : 'text-outline hover:text-tertiary'}`}
          >
            <Star className="size-[18px]" fill={prompt.isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button
            type="button"
            aria-label="Copy prompt"
            onClick={() => copy(prompt.content)}
            className={`${actionBtn} text-outline hover:text-on-surface`}
          >
            {copied ? <Check className="size-[18px] text-primary" /> : <Copy className="size-[18px]" />}
          </button>
          <button
            type="button"
            aria-label="Edit prompt"
            onClick={() => navigate(`/editor/${prompt.id}`)}
            className={`${actionBtn} text-outline hover:text-on-surface`}
          >
            <Link to={`/editor/${prompt.id}`} aria-label={`Edit ${prompt.title}`}>
  <Pencil className="size-4" aria-hidden="true" />
</Link>
          </button>
        </div>
      </div>
    </article>
  )
}