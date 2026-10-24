import { useEffect, useRef } from 'react'
import type { MouseEvent } from 'react'
import { gsap } from '@/utils/gsap'

export function useModalDialog() {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog || dialog.open) return
    dialog.showModal()
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo(
        dialog,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out', clearProps: 'transform,opacity' },
      )
    }
  }, [])

  const close = () => ref.current?.close()

  const onBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === ref.current) close()
  }

  return { ref, close, onBackdropClick }
}