import type { Folder, ModelProvider, Prompt } from '@/features/prompts/types'
import type { DashboardStats, ModelShare, ModelTone, WelcomeSummary } from './types'

const DAY_MS = 86_400_000
const TREND_WEEKS = 8

const providerMeta: Record<ModelProvider, { label: string; tone: ModelTone }> = {
  anthropic: { label: 'Claude', tone: 'secondary' },
  openai: { label: 'GPT', tone: 'primary' },
  google: { label: 'Gemini', tone: 'tertiary' },
}

const percent = (part: number, total: number) => (total ? Math.round((part / total) * 100) : 0)

/** عدد الـ Prompts الموجودة بنهاية كل أسبوع من آخر 8 أسابيع (للـ Sparkline) */
function cumulativeWeeklyTrend(prompts: Prompt[], now: number): number[] {
  return Array.from({ length: TREND_WEEKS }, (_, i) => {
    const pointInTime = now - (TREND_WEEKS - 1 - i) * 7 * DAY_MS
    return prompts.filter((p) => new Date(p.createdAt).getTime() <= pointInTime).length
  })
}

export function buildDashboardStats(
  prompts: Prompt[],
  folders: Folder[],
  savedTimeDemo: DashboardStats['savedTime'],
): DashboardStats {
  const now = Date.now()
  const active = prompts.filter((p) => !p.isArchived)
  const favorites = active.filter((p) => p.isFavorite)
  const rootFolders = folders.filter((f) => f.parentId === null)

  const countByProvider = new Map<ModelProvider, number>()
  active.forEach((p) => {
    countByProvider.set(p.model.provider, (countByProvider.get(p.model.provider) ?? 0) + 1)
  })
  const modelSplit: ModelShare[] = [...countByProvider.entries()].map(([provider, count]) => ({
    label: providerMeta[provider].label,
    tone: providerMeta[provider].tone,
    percent: percent(count, active.length),
  }))

  return {
    totalPrompts: {
      value: active.length,
      newThisMonth: active.filter((p) => new Date(p.createdAt).getTime() >= now - 30 * DAY_MS)
        .length,
      trend: cumulativeWeeklyTrend(active, now),
    },
    favorites: {
      value: favorites.length,
      shareOfLibraryPercent: percent(favorites.length, active.length),
      productionReadyPercent: percent(
        favorites.filter((p) => p.status === 'production').length,
        favorites.length,
      ),
    },
    projects: {
      value: rootFolders.length,
      subfolderCount: folders.length - rootFolders.length,
      modelSplit,
    },
    savedTime: savedTimeDemo,
  }
}

export function buildWelcomeSummary(prompts: Prompt[], base: WelcomeSummary): WelcomeSummary {
  const active = prompts.filter((p) => !p.isArchived)
  return {
    ...base,
    activeTests: active.filter((p) => p.status === 'testing').length,
    modelCount: new Set(active.map((p) => p.model.provider)).size,
  }
}