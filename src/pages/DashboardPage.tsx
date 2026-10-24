import { useMemo } from 'react'
import { WelcomeHero } from '@/features/dashboard/components/WelcomeHero'
import { StatsGrid } from '@/features/dashboard/components/StatsGrid'
import { RecentPrompts } from '@/features/dashboard/components/RecentPrompts'
import { TemplateLaunchers } from '@/features/dashboard/components/TemplateLaunchers'
import { VariablePlayground } from '@/features/dashboard/components/VariablePlayground'
import { ModelBenchmarks } from '@/features/dashboard/components/ModelBenchmarks'
import { buildDashboardStats, buildWelcomeSummary } from '@/features/dashboard/buildStats'
import { demoSavedTime, mockWelcome } from '@/data/dashboardStats'
import { quickTemplates, totalTemplates } from '@/data/dashboardContent'
import { modelBenchmarks, playgroundConfig } from '@/data/dashboardPlayground'
import { usePromptStore } from '@/stores/promptStore'

export default function DashboardPage() {
  // نختار البيانات الخام، ونحسب المشتقات بـ useMemo
  const prompts = usePromptStore((s) => s.prompts)
  const folders = usePromptStore((s) => s.folders)

  const welcome = useMemo(() => buildWelcomeSummary(prompts, mockWelcome), [prompts])
  const stats = useMemo(
    () => buildDashboardStats(prompts, folders, demoSavedTime),
    [prompts, folders],
  )

  return (
    <div className="flex w-full flex-col gap-space-lg">
      <WelcomeHero {...welcome} />
      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 items-start gap-space-lg lg:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-space-lg lg:col-span-8">
          <RecentPrompts />
          <TemplateLaunchers templates={quickTemplates} totalCount={totalTemplates} />
        </div>
        <div className="flex flex-col gap-space-lg lg:col-span-4">
          <VariablePlayground config={playgroundConfig} />
          <ModelBenchmarks items={modelBenchmarks} />
        </div>
      </div>
    </div>
  )
}