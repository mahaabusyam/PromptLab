import { estimateCostUsd, estimateTokens } from '@/utils/tokens'
import { extractVariables, fillTemplate } from '@/utils/promptVariables'
import type { EditorDraft } from './types'

export interface RunResult {
  output: string // النص النهائي بعد حقن القيم
  unresolved: string[] // متغيرات بدون قيمة
  latencyMs: number
  costUsd: number
  inputTokens: number
  outputTokens: number
}

/** محاكاة: ما بتتصل بأي موديل. بتحسب النص النهائي وأرقام تقديرية */
export function simulateRun(draft: EditorDraft): RunResult {
  const output = fillTemplate(draft.content, draft.variableValues)
  const unresolved = extractVariables(draft.content).filter((name) => !draft.variableValues[name]?.trim())
  const inputTokens = estimateTokens(output)
  const outputTokens = Math.min(draft.settings.maxTokens, Math.round(inputTokens * 0.5))

  return {
    output,
    unresolved,
    latencyMs: Math.min(1800, 350 + Math.round(inputTokens * 1.5)),
    costUsd: estimateCostUsd(inputTokens + outputTokens),
    inputTokens,
    outputTokens,
  }
}