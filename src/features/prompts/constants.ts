import type { ModelProvider, PromptCategory , PromptSettings , PromptStatus } from './types'

export const categoryLabels: Record<PromptCategory, string> = {
  marketing: 'Marketing',
  coding: 'Coding',
  education: 'Education',
  writing: 'Writing',
  'data-analysis': 'Data Analysis',
}

export const categoryOrder = Object.keys(categoryLabels) as PromptCategory[]

export const providerLabels: Record<ModelProvider, string> = {
  anthropic: 'Claude',
  openai: 'GPT',
  google: 'Gemini',
}
export const statusLabels: Record<PromptStatus, string> = {
  draft: 'Draft',
  testing: 'Testing',
  production: 'Production',
}

export const defaultPromptSettings: PromptSettings = {
  temperature: 0.7,
  maxTokens: 2048,
  topP: 0.95,
  strictSchema: true,
}
export const FREE_TIER_PROMPT_LIMIT = 200
export const MAX_OUTPUT_TOKENS = 8192

export const modelCatalog: { name: string; provider: ModelProvider; context: string }[] = [
  { name: 'Claude 3.5 Sonnet', provider: 'anthropic', context: '200k' },
  { name: 'GPT-4o', provider: 'openai', context: '128k' },
  { name: 'Gemini 1.5 Pro', provider: 'google', context: '1M' },
]