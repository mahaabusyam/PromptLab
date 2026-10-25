import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { FREE_TIER_PROMPT_LIMIT } from '@/features/prompts/constants'
import { gsap } from '@/utils/gsap'

interface StorageCardProps {
  used: number
}

export function StorageCard({ used }: StorageCardProps) {
  const { t } = useTranslation()
  const barRef = useRef<HTMLDivElement>(null)
  const percent = Math.min(100, Math.round((used / FREE_TIER_PROMPT_LIMIT) * 100))

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      bar.style.width = `${percent}%`
      return
    }
    // الشريط يبدأ بـ w-0، و GSAP بيحرّكه لعرضه الحقيقي (وبيعيد التحريك لو تغير الرقم)
    const tween = gsap.to(bar, { width: `${percent}%`, duration: 0.9, ease: 'power3.out' })
    return () => {
      tween.kill()
    }
  }, [percent])

  return (
    <div className="rounded-xl bg-surface-container-lowest/60 p-space-sm">
      <div className="mb-2 flex items-center justify-between text-label-sm">
        <span className="font-semibold text-on-surface">{t('library.storage.title')}</span>
        <span className="font-code-md text-on-surface-variant">{percent}%</span>
      </div>
      <div
        role="progressbar"
        aria-label={t('library.storage.used')}
        aria-valuemin={0}
        aria-valuemax={FREE_TIER_PROMPT_LIMIT}
        aria-valuenow={used}
        className="h-1.5 overflow-hidden rounded-full bg-surface-container-high"
      >
        <div
          ref={barRef}
          className="h-full w-0 rounded-full bg-linear-to-r rtl:bg-linear-to-l from-secondary to-tertiary"
        />
      </div>
      <p className="mt-2 text-label-sm text-outline">
        {t('library.storage.summary', { used, limit: FREE_TIER_PROMPT_LIMIT })}
      </p>
    </div>
  )
}