import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

interface ModalProps {
  labelledBy: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ labelledBy, onClose, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (dialog && !dialog.open) dialog.showModal() // showModal: حبس الـ focus + Escape مجاناً
  }, [])

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onClose={onClose} // Escape
      onClick={(e) => e.target === e.currentTarget && onClose()} // الضغط على الخلفية
      className="m-auto w-[min(92vw,28rem)] rounded-2xl bg-surface-container-high p-0 text-on-surface shadow-2xl backdrop:bg-black/60"
    >
      {children}
    </dialog>
  )
}