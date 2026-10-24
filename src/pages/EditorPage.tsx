import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { EditorHeader } from '@/features/editor/components/EditorHeader'
import { ExecutionConsole } from '@/features/editor/components/ExecutionConsole'
import { ModelPanel } from '@/features/editor/components/ModelPanel'
import { PromptEditorPanel } from '@/features/editor/components/PromptEditorPanel'
import { SaveVersionDialog } from '@/features/editor/components/SaveVersionDialog'
import { VariablesPanel } from '@/features/editor/components/VariablesPanel'
import { isDraftDirty } from '@/features/editor/draftDirty'
import { useEditorDraft } from '@/features/editor/hooks/useEditorDraft'
import { useSimulatedRun } from '@/features/editor/hooks/useSimulatedRun'
import type { Prompt, PromptVersion } from '@/features/prompts/types'
import { getVersionLabel } from '@/features/prompts/utils'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useUnsavedChangesGuard } from '@/hooks/useUnsavedChangesGuard'
import { usePromptStore } from '@/stores/promptStore'
import { extractVariables , fillTemplate } from '@/utils/promptVariables'
import { ImprovePromptDialog } from '@/features/ai/components/ImprovePromptDialog'
import { useAiRun } from '@/features/ai/hooks/useAiRun'
import { clampMaxTokens } from '@/features/ai/limits'
import { AiRunCard } from '@/features/editor/components/AiRunCard'

// مصفوفة ثابتة للـ Prompt الجديد (بدل [] جديدة كل render)
const NO_VERSIONS: PromptVersion[] = []

function EditorWorkspace({ prompt }: { prompt?: Prompt }) {
  const navigate = useNavigate()
  const ref = useScrollReveal<HTMLDivElement>()
  const editor = useEditorDraft(prompt)
  const { status, result, run } = useSimulatedRun(editor.draft)
  const { draft, update } = editor
  const [saveOpen, setSaveOpen] = useState(false)
  const [improveOpen, setImproveOpen] = useState(false)

  // Snapshot of the draft when the page opened (useState initializer runs once)
  const [initialSnapshot] = useState(() => JSON.stringify(editor.draft))
  const isDirty = useMemo(
    () => isDraftDirty(editor.isNew, initialSnapshot, draft),
    [editor.isNew, initialSnapshot, draft],
  )
  const { blocker, allowNextNavigation } = useUnsavedChangesGuard(isDirty)

  const versions = prompt?.versions ?? NO_VERSIONS
  const latest = versions[versions.length - 1]
  const canSaveVersion = !editor.isNew && latest !== undefined && latest.content !== draft.content
  const variableNames = useMemo(() => extractVariables(draft.content), [draft.content])
    const aiRun = useAiRun()
  const unresolved = useMemo(
    () => variableNames.filter((name) => !draft.variableValues[name]?.trim()),
    [variableNames, draft.variableValues],
  )
  const runWithAi = () =>
    aiRun.mutate({
      prompt: fillTemplate(draft.content, draft.variableValues),
      maxTokens: clampMaxTokens(draft.settings.maxTokens),
    })

  // Ctrl/⌘ + Enter خارج المحرر. جوّا المحرر بيتعامل معه CodeMirror
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        run()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [run])

  const handleCreate = () => {
    const id = editor.createPrompt()
    if (id) {
      allowNextNavigation() // creating is intentional: don't ask "discard draft?"
      navigate(`/editor/${id}`, { replace: true })
    }
  }

  return (
    <div ref={ref} className="flex w-full flex-col gap-space-md">
      <EditorHeader
        draft={draft}
        onChange={update}
        isNew={editor.isNew}
        versionLabel={prompt ? getVersionLabel(prompt) : 'New'}
        saveState={editor.saveState}
        savedAt={editor.savedAt}
        onCreate={handleCreate}
        onRun={run}
        running={status === 'running'}
        onSaveVersion={() => setSaveOpen(true)}
        canSaveVersion={canSaveVersion}
        onImprove={() => setImproveOpen(true)}
        canImprove={draft.content.trim().length > 0}
      />

      <div className="grid grid-cols-1 gap-space-md lg:grid-cols-12">
        <PromptEditorPanel
          draft={draft}
          onChange={update}
          versions={versions}
          variableNames={variableNames}
          onRun={run}
        />

        <div className="flex min-w-0 flex-col gap-space-md lg:col-span-4">
          <VariablesPanel
            variableNames={variableNames}
            values={draft.variableValues}
            onChange={(variableValues) => update({ variableValues })}
          />
          <ModelPanel draft={draft} onChange={update} />
          <ExecutionConsole
            status={status}
            result={result}
            modelName={draft.model.name}
            temperature={draft.settings.temperature}
            maxTokens={draft.settings.maxTokens}
          />
          <AiRunCard
            hasContent={draft.content.trim().length > 0}
            unresolved={unresolved}
            isPending={aiRun.isPending}
            error={aiRun.error}
            data={aiRun.data}
            onRun={runWithAi}
          />
        </div>
      </div>

      {saveOpen && (
        <SaveVersionDialog
          versions={versions}
          content={draft.content}
          onCancel={() => setSaveOpen(false)}
          onSave={(values) => {
            editor.saveVersion(values)
            setSaveOpen(false)
          }}
        />
      )}

      {improveOpen && (
        <ImprovePromptDialog
          prompt={draft.content}
          onClose={() => setImproveOpen(false)}
          onApply={(improved) => {
            update({ content: improved })
            setImproveOpen(false)
          }}
        />
      )}

      {blocker.state === 'blocked' && (
        <ConfirmDialog
          title="Discard this draft?"
          description="This new prompt hasn't been created yet. If you leave now, what you wrote will be lost."
          confirmLabel="Discard and leave"
          onConfirm={() => blocker.proceed()}
          onCancel={() => blocker.reset()}
        />
      )}
    </div>
  )
}

function EditorNotFound() {
  return (
    <div role="status" className="flex flex-col items-center gap-space-sm rounded-2xl bg-surface-container-low/85 px-space-lg py-space-xl text-center">
      <h1 className="text-title-md text-on-surface">Prompt not found</h1>
      <p className="text-body-sm text-on-surface-variant">It may have been deleted or the link is wrong.</p>
      <Link to="/library" className="mt-1 rounded-xl bg-secondary-container px-4 py-2 text-label-md text-on-secondary-container">
        Back to library
      </Link>
    </div>
  )
}

export default function EditorPage() {
  const { promptId } = useParams<{ promptId: string }>()
  const prompt = usePromptStore((s) => (promptId ? s.prompts.find((p) => p.id === promptId) : undefined))

  if (promptId && !prompt) return <EditorNotFound />

  return <EditorWorkspace key={promptId ?? 'new'} prompt={prompt} />
}