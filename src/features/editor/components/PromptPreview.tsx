import { splitTemplate } from '@/utils/promptVariables'

interface PromptPreviewProps {
  content: string
  values: Record<string, string>
}

export function PromptPreview({ content, values }: PromptPreviewProps) {
  if (!content.trim()) {
    return <p className="p-space-md text-body-sm text-outline">Nothing to preview yet.</p>
  }

  return (
    <div className="whitespace-pre-wrap break-words p-space-md font-code-md text-code-md leading-6 text-on-surface">
      {splitTemplate(content).map((segment, i) => {
        if (segment.kind === 'text') return <span key={i}>{segment.text}</span>
        const value = values[segment.name]?.trim()
        return value ? (
          <mark key={i} className="rounded bg-primary/15 px-1 text-on-surface">
            {value}
          </mark>
        ) : (
          // المتغير بدون قيمة بيضل chip، فبتعرفي شو لسا ناقص
          <span key={i} className="variable-chip" title="No value yet">{`{{${segment.name}}}`}</span>
        )
      })}
    </div>
  )
}