import { Link } from 'react-router-dom'
import { ProviderIcon } from '@/features/prompts/components/ProviderIcon'
import { StatusBadge } from '@/features/prompts/components/StatusBadge'
import type { Prompt } from '@/features/prompts/types'
import { getVersionLabel } from '@/features/prompts/utils'
import { formatUpdated } from '@/utils/dates'
import { extractVariables } from '@/utils/promptVariables'
import { FavoriteButton, PromptQuickActions } from './PromptActions'
import { PromptSnippet } from './PromptSnippet'

export function PromptCard({ prompt }: { prompt: Prompt }) {
  const variableCount = extractVariables(prompt.content).length

  return (
    <article
      data-result-item
      className="group relative flex flex-col justify-between rounded-2xl bg-surface-container-low/85 p-5 shadow-md transition-[translate,background-color] duration-300 hover:-translate-y-1 hover:bg-surface-container focus-within:z-10"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-surface-container-highest px-2 py-0.5 font-mono text-[11px] text-on-surface-variant">
                {getVersionLabel(prompt)}
              </span>
              <StatusBadge status={prompt.status} />
            </div>
            <h2 className="line-clamp-2 font-headline-sm text-headline-sm font-semibold text-on-surface transition-colors group-hover:text-primary">
              <Link to={`/editor/${prompt.id}`}>{prompt.title}</Link>
            </h2>
          </div>
          <FavoriteButton prompt={prompt} />
        </div>

        <PromptSnippet content={prompt.content} />

        <span className="inline-flex w-fit items-center gap-1.5 rounded-md bg-surface-container px-2 py-0.5 font-mono text-[11px] text-on-surface-variant">
          <span aria-hidden className="size-1.5 rounded-full bg-primary" />
          {variableCount} {variableCount === 1 ? 'Variable' : 'Variables'} Bound
        </span>

        <div className="flex flex-wrap gap-1.5">
          {prompt.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-surface-container-high px-2 py-0.5 text-[11px] font-medium text-outline"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-surface-variant/40 pt-3">
        <div className="flex min-w-0 items-center gap-2">
          <ProviderIcon provider={prompt.model.provider} className="size-[18px] shrink-0 text-primary" />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-body-sm font-medium text-on-surface">{prompt.model.name}</span>
            <span className="text-label-sm text-outline">Updated {formatUpdated(prompt.updatedAt)}</span>
          </div>
        </div>
        <PromptQuickActions prompt={prompt} />
      </div>
    </article>
  )
}