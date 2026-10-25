import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from './Modal'

export type ConfirmTone = 'danger' | 'primary'

interface ConfirmDialogProps {
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
  /** danger = destructive action (delete, replace). primary = safe action (restore). Default: danger. */
  tone?: ConfirmTone
}

// Full literal class names so Tailwind can see them (never build class names dynamically)
const confirmStyles: Record<ConfirmTone, string> = {
  danger: 'bg-error text-on-error',
  primary: 'bg-primary text-primary-foreground',
}

export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
  tone = 'danger',
}: ConfirmDialogProps) {
  const { t } = useTranslation()
  const titleId = useId() // unique id, so two dialogs can never share the same aria-labelledby

  return (
    <Modal labelledBy={titleId} onClose={onCancel}>
      <div className="flex flex-col gap-space-sm p-space-md">
        <h2 id={titleId} className="text-title-md">
          {title}
        </h2>
        <p className="text-body-sm text-on-surface-variant">{description}</p>
        <div className="mt-space-sm flex justify-end gap-space-sm">
          <button
            type="button"
            autoFocus
            onClick={onCancel}
            className="rounded-xl bg-surface-container-highest px-3.5 py-2 text-label-md transition-colors hover:bg-surface-variant"
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl px-3.5 py-2 text-label-md transition-[filter] hover:brightness-110 ${confirmStyles[tone]}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}