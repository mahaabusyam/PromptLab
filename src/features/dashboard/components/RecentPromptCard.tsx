import { Check, Copy, Pencil, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ProviderIcon } from '@/features/prompts/components/ProviderIcon'
import { StatusBadge } from '@/features/prompts/components/StatusBadge'
import { getVersionLabel } from '@/features/prompts/utils'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import type { Prompt } from '@/features/prompts/types'

const actionBtn = 'inline-flex rounded p-1 transition-colors hover:bg-surface-container'

interface RecentPromptCardProps {
  prompt: Prompt
  onToggleFavorite: (id: string) => void
}

export function RecentPromptCard({ prompt, onToggleFavorite }: RecentPromptCardProps) {
  const { t } = useTranslation()
  const { copied, copy } = useCopyToClipboard()

  return (
    <article
      data-reveal
      className="group relative flex flex-col justify-between rounded-xl bg-surface-container p-space-md shadow-sm transition-colors hover:bg-surface-container-high"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <StatusBadge status={prompt.status} />
          <span className="font-code-md text-label-sm text-outline">{getVersionLabel(prompt)}</span>
        </div>

        <h3
          dir="auto"
          className="line-clamp-1 text-title-md text-on-surface transition-colors group-hover:text-primary"
        >
          {prompt.title}
        </h3>
        <p dir="auto" className="line-clamp-2 text-body-sm text-on-surface-variant">
          {prompt.description}
        </p>

        <div className="mt-1 flex flex-wrap gap-1">
          {prompt.tags.map((tag) => (
            <span
              key={tag}
              dir="auto"
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
            <span className="whitespace-nowrap">{t('promptCard.notRun')}</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={prompt.isFavorite ? t('promptCard.removeFavorite') : t('promptCard.addFavorite')}
            aria-pressed={prompt.isFavorite}
            onClick={() => onToggleFavorite(prompt.id)}
            className={`${actionBtn} ${prompt.isFavorite ? 'text-tertiary' : 'text-outline hover:text-tertiary'}`}
          >
            <Star className="size-[18px]" fill={prompt.isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button
            type="button"
            aria-label={t('promptCard.copy')}
            onClick={() => copy(prompt.content)}
            className={`${actionBtn} text-outline hover:text-on-surface`}
          >
            {copied ? <Check className="size-[18px] text-primary" /> : <Copy className="size-[18px]" />}
          </button>
          <Link
            to={`/editor/${prompt.id}`}
            aria-label={t('promptCard.edit', { title: prompt.title })}
            className={`${actionBtn} text-outline hover:text-on-surface`}
          >
            <Pencil className="size-[18px]" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}