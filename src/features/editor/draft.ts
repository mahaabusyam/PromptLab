import { defaultPromptSettings } from '@/features/prompts/constants'
import type { Prompt } from '@/features/prompts/types'
import type { EditorDraft } from './types'

export function blankDraft(): EditorDraft {
  return {
    title: '',
    description: '',
    content: '',
    status: 'draft',
    category: 'writing',
    tags: [],
    model: { name: 'Claude 3.5 Sonnet', provider: 'anthropic' },
    settings: defaultPromptSettings,
    variableValues: {},
  }
}

export function toDraft(prompt: Prompt): EditorDraft {
  return {
    title: prompt.title,
    description: prompt.description,
    content: prompt.content,
    status: prompt.status,
    category: prompt.category,
    tags: prompt.tags,
    model: prompt.model,
    settings: prompt.settings ?? defaultPromptSettings,
    variableValues: prompt.variableValues ?? {},
  }
}

/** قبل الحفظ: ما منسمح بعنوان فاضي */
export function normalizeDraft(draft: EditorDraft): EditorDraft {
  return { ...draft, title: draft.title.trim() || 'Untitled prompt' }
}