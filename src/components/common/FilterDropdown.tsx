import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { useDismiss } from '@/hooks/useDismiss'

export interface DropdownOption<T extends string> {
  value: T
  label: string
}

interface FilterDropdownProps<T extends string> {
  ariaLabel: string
  prefix?: string
  icon?: ReactNode
  value: T
  options: DropdownOption<T>[]
  onChange: (value: T) => void
}

export function FilterDropdown<T extends string>({
  ariaLabel,
  prefix,
  icon,
  value,
  options,
  onChange,
}: FilterDropdownProps<T>) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useDismiss(
  open,
  (reason) => {
    setOpen(false)
    if (reason === 'escape') triggerRef.current?.focus()
  },
  rootRef,
)

  const selected = options.find((o) => o.value === value)

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-xl bg-surface-container-high/90 px-3 py-2 text-body-sm text-on-surface transition-colors hover:bg-surface-container-highest"
      >
        {icon}
        {prefix && <span className="text-outline">{prefix}</span>}
        <span className="font-medium">{selected?.label}</span>
        <ChevronDown
          className={`size-4 text-outline transition-[rotate] ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={ariaLabel}
          className="absolute left-0 top-full z-30 mt-1 flex max-h-64 min-w-48 flex-col overflow-y-auto rounded-xl bg-surface-container-high p-1 shadow-lg"
        >
          {options.map((option) => {
            const isSelected = option.value === value
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                  triggerRef.current?.focus()
                }}
                className={`flex items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-left text-body-sm transition-colors hover:bg-surface-container-highest ${
                  isSelected ? 'text-primary' : 'text-on-surface'
                }`}
              >
                {option.label}
                {isSelected && <Check className="size-4" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}