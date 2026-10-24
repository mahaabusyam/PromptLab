import type { Prompt, PromptSettings } from '@/features/prompts/types'

/** نسخة مؤقتة قابلة للتعديل من الـ Prompt. الحقول اللي بيعدّلها المحرر بس */
export interface EditorDraft {
  title: string
  description: string
  content: string
  status: Prompt['status']
  category: Prompt['category']
  tags: string[]
  model: Prompt['model']
  settings: PromptSettings
  variableValues: Record<string, string>
}

export type SaveState = 'unsaved' | 'saving' | 'saved'
export type RunStatus = 'idle' | 'running' | 'done'