import { extractVariables } from '@/utils/promptVariables'

export interface VariableCheck {
  missing: string[] // in the original, gone from the suggestion
  added: string[] // new in the suggestion
}

export function compareVariables(original: string, improved: string): VariableCheck {
  const before = new Set(extractVariables(original))
  const after = new Set(extractVariables(improved))
  return {
    missing: [...before].filter((name) => !after.has(name)),
    added: [...after].filter((name) => !before.has(name)),
  }
}