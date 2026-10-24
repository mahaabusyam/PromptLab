import { Decoration, EditorView, MatchDecorator, ViewPlugin } from '@codemirror/view'
import type { DecorationSet, ViewUpdate } from '@codemirror/view'
import { VARIABLE_SOURCE } from '@/utils/promptVariables'

const chip = Decoration.mark({ class: 'variable-chip' })
const matcher = new MatchDecorator({
  regexp: new RegExp(VARIABLE_SOURCE, 'g'),
  decoration: () => chip,
})

/** بيلوّن كل {{variable}} بالنص. وبيحدّث التلوين لحاله عند كل تعديل */
export const variableHighlight = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet
    constructor(view: EditorView) {
      this.decorations = matcher.createDeco(view)
    }
    update(update: ViewUpdate) {
      this.decorations = matcher.updateDeco(update, this.decorations)
    }
  },
  { decorations: (plugin) => plugin.decorations },
)

// color: inherit ← بياخد لون الـ Tailwind من العنصر الأب، فبيتبدّل مع الثيم تلقائياً
export const promptEditorTheme = EditorView.theme({
  '&': { backgroundColor: 'transparent', color: 'inherit', fontSize: 'inherit' },
  '&.cm-focused': { outline: 'none' },
  '.cm-scroller': { fontFamily: 'inherit', lineHeight: '1.5rem' },
  '.cm-content': { padding: '1rem 0', caretColor: 'currentColor' },
  '.cm-line': { padding: '0 1rem 0 0.5rem' },
  '.cm-cursor': { borderLeftColor: 'currentColor' },
  '.cm-gutters': {
    backgroundColor: 'transparent',
    color: 'inherit',
    border: 'none',
    opacity: '0.45',
  },
  '.cm-activeLine': { backgroundColor: 'color-mix(in srgb, currentColor 6%, transparent)' },
  '.cm-activeLineGutter': { backgroundColor: 'transparent' },
  '.cm-selectionBackground, &.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground':
    { backgroundColor: 'color-mix(in srgb, currentColor 22%, transparent)' },
})

// قارئ الشاشة بيقرأ "Prompt content" بدل "text field"
export const promptA11y = EditorView.contentAttributes.of({ 'aria-label': 'Prompt content' })