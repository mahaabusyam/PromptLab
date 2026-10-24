import { useRef, useState } from 'react'
import { Archive, ArchiveRestore, MoreVertical, Trash2 } from 'lucide-react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { useDismiss } from '@/hooks/useDismiss'
import type { Prompt } from '@/features/prompts/types'
import { usePromptStore } from '@/stores/promptStore'

const itemClass =
  'flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-body-sm transition-colors hover:bg-surface-container-highest'

export function PromptActionsMenu({ prompt }: { prompt: Prompt }) {
  const [open, setOpen] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const toggleArchive = usePromptStore((s) => s.toggleArchive)
  const deletePrompt = usePromptStore((s) => s.deletePrompt)

  useDismiss(
    open,
    (reason) => {
      setOpen(false)
      if (reason === 'escape') triggerRef.current?.focus()
    },
    rootRef,
  )

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label="More options"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg p-1.5 text-outline transition-colors hover:bg-surface-container-high hover:text-on-surface"
      >
        <MoreVertical className="size-[18px]" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-30 mt-1 min-w-40 rounded-xl bg-surface-container-high p-1 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              toggleArchive(prompt.id)
              setOpen(false)
            }}
            className={`${itemClass} text-on-surface`}
          >
            {prompt.isArchived ? <ArchiveRestore className="size-4" /> : <Archive className="size-4" />}
            {prompt.isArchived ? 'Restore' : 'Archive'}
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              setConfirming(true)
            }}
            className={`${itemClass} text-error`}
          >
            <Trash2 className="size-4" />
            Delete
          </button>
        </div>
      )}

      {confirming && (
        <ConfirmDialog
          title={`Delete "${prompt.title}"?`}
          description="This permanently removes the prompt and all of its versions. This can't be undone."
          confirmLabel="Delete"
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            setConfirming(false)
            deletePrompt(prompt.id)
          }}
        />
      )}
    </div>
  )
}