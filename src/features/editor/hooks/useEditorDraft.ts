import { useCallback, useEffect, useRef, useState } from 'react'
import type { Prompt } from '@/features/prompts/types'
import { usePromptStore } from '@/stores/promptStore'
import { blankDraft, normalizeDraft, toDraft } from '../draft'
import type { EditorDraft, SaveState } from '../types'
import type { SaveVersionValues } from '@/features/versions/schemas'

const AUTOSAVE_DELAY_MS = 800

export function useEditorDraft(prompt: Prompt | undefined) {
  const addPrompt = usePromptStore((s) => s.addPrompt)
  const updatePrompt = usePromptStore((s) => s.updatePrompt)
  const addVersion = usePromptStore((s) => s.addVersion)
  const promptId = prompt?.id

  // القيمة الأولية بتنقرأ مرة وحدة. بعدها الـ draft هو مصدر الحقيقة داخل المحرر
  const [draft, setDraft] = useState<EditorDraft>(() => (prompt ? toDraft(prompt) : blankDraft()))
  const [dirty, setDirty] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(() =>
    prompt ? new Date(prompt.updatedAt).getTime() : null,
  )

  const update = useCallback((patch: Partial<EditorDraft>) => {
    setDraft((current) => ({ ...current, ...patch }))
    setDirty(true)
  }, [])

  // حفظ تلقائي (Debounce): كل ضغطة مفتاح بتلغي المؤقت القديم وبتبدأ جديد
  useEffect(() => {
    if (!dirty || !promptId) return
    const timer = setTimeout(() => {
      updatePrompt(promptId, normalizeDraft(draft))
      setDirty(false)
      setSavedAt(Date.now())
    }, AUTOSAVE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [dirty, draft, promptId, updatePrompt])

  // لو طلعتي من الصفحة قبل ما ينتهي المؤقت، نحفظ آخر تعديل بدل ما يضيع
  const latest = useRef({ draft, dirty })
  useEffect(() => {
    latest.current = { draft, dirty }
  })
  useEffect(
    () => () => {
      if (promptId && latest.current.dirty) {
        updatePrompt(promptId, normalizeDraft(latest.current.draft))
      }
    },
    [promptId, updatePrompt],
  )

  /** يحوّل الـ draft لـ Prompt حقيقي بالـ store. بيرجّع الـ id الجديد */
  const createPrompt = useCallback((): string | null => {
    if (!draft.content.trim()) return null
    const clean = normalizeDraft(draft)
    const created = addPrompt({
      title: clean.title,
      description: clean.description,
      content: clean.content,
      status: clean.status,
      category: clean.category,
      tags: clean.tags,
      model: clean.model,
    })
    updatePrompt(created.id, { settings: clean.settings, variableValues: clean.variableValues })
    return created.id
  }, [draft, addPrompt, updatePrompt])

  const saveState: SaveState = !promptId ? 'unsaved' : dirty ? 'saving' : 'saved'
  /** يحفظ لقطة مسمّاة (v1.5...) من النص الحالي، مع باقي تعديلات الـ draft */
const saveVersion = useCallback(
  (values: SaveVersionValues) => {
    if (!promptId) return null
    const clean = normalizeDraft(draft)
    updatePrompt(promptId, clean) // العنوان والتاجات والإعدادات
    const version = addVersion(promptId, { note: values.note, bump: values.bump, content: clean.content })
    setDirty(false)
    setSavedAt(Date.now())
    return version
  },
  [promptId, draft, updatePrompt, addVersion],
)

return { draft, update, isNew: !promptId, saveState, savedAt, createPrompt, saveVersion }
}