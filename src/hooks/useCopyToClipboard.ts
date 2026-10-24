import { useCallback, useEffect, useRef, useState } from 'react'

export function useCopyToClipboard(resetMs = 1500) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setCopied(false), resetMs)
      } catch {
        setCopied(false)
      }
    },
    [resetMs],
  )

  // نظّفي المؤقت لو انحذف الكرت قبل ما يخلص
  useEffect(() => () => window.clearTimeout(timer.current), [])

  return { copied, copy }
}