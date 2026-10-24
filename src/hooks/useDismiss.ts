import { useEffect } from 'react'
import type { RefObject } from 'react'

export function useDismiss(
  open: boolean,
  onDismiss: (reason: 'outside' | 'escape') => void,
  containerRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) onDismiss('outside')
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss('escape')
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onDismiss, containerRef])
}