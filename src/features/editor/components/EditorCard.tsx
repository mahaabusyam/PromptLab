import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface EditorCardProps {
  icon: LucideIcon
  title: string
  action?: ReactNode
  children: ReactNode
}

export function EditorCard({ icon: Icon, title, action, children }: EditorCardProps) {
  return (
    <section
      data-reveal
      className="flex flex-col gap-space-sm rounded-xl bg-surface-container-low/90 p-space-md shadow-xl backdrop-blur-xl"
    >
      <div className="flex items-center justify-between gap-2 pb-1">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-secondary-container">
            <Icon aria-hidden className="size-4 text-primary" />
          </div>
          <h2 className="truncate font-headline-sm text-headline-sm text-on-surface">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}