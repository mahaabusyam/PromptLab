import { useLayoutEffect, useRef } from 'react'
import { gsap } from '@/utils/gsap'

interface RevealOptions {
  y?: number
  duration?: number
  stagger?: number
  selector?: string
}

export function useScrollReveal<T extends HTMLElement>({
  y = 32,
  duration = 0.7,
  stagger = 0.08,
  selector = '[data-reveal]',
}: RevealOptions = {}) {
  const ref = useRef<T>(null)

  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    // احترام إعداد "تقليل الحركة" للمستخدم (إمكانية الوصول)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const items = root.querySelectorAll<HTMLElement>(selector)
    if (!items.length) return

    // context بيجمع كل الـ animations وبينظفها مرة وحدة
    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 85%', once: true },
        },
      )
    }, root)

    return () => ctx.revert()
  }, [y, duration, stagger, selector])

  return ref
}