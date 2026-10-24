import type { PromptStatus } from '../types'

const styles: Record<PromptStatus, { label: string; badge: string; dot: string }> = {
  production: {
    label: 'Production',
    badge: 'bg-secondary-container/40 text-on-secondary-container',
    dot: 'bg-secondary',
  },
  testing: {
    label: 'Testing',
    badge: 'bg-surface-container-highest text-primary',
    dot: 'bg-primary animate-ping',
  },
  draft: {
    label: 'Draft',
    badge: 'bg-surface-container-highest text-outline',
    dot: 'bg-outline',
  },
}

export function StatusBadge({ status }: { status: PromptStatus }) {
  const s = styles[status]
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-label-sm font-semibold ${s.badge}`}
    >
      <span aria-hidden className={`size-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}