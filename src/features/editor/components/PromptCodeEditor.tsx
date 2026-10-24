import { useEffect, useMemo, useRef } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { Prec } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { promptA11y, promptEditorTheme, variableHighlight } from '../codemirror/promptExtensions'

const BASIC_SETUP = {
  lineNumbers: true,
  highlightActiveLine: true,
  highlightActiveLineGutter: true,
  history: true,
  foldGutter: false,
  autocompletion: false,
  closeBrackets: false,
  bracketMatching: false,
  indentOnInput: false,
  searchKeymap: false,
}

interface PromptCodeEditorProps {
  value: string
  onChange: (value: string) => void
  wrap: boolean
  onReady: (view: EditorView) => void
  onQuickRun: () => void
}

export function PromptCodeEditor({ value, onChange, wrap, onReady, onQuickRun }: PromptCodeEditorProps) {
  // ref بدل dependency، عشان الـ extensions ما تنبني من جديد كل ما تغيّرت الدالة
  const runRef = useRef(onQuickRun)
  useEffect(() => {
    runRef.current = onQuickRun
  })

  const extensions = useMemo(
    () => [
      variableHighlight,
      promptEditorTheme,
      promptA11y,
      Prec.highest(
        // eslint-disable-next-line react-hooks/refs -- the ref is only read inside the key handler (on keypress), never during render
        keymap.of([
          {
            key: 'Mod-Enter',
            run: () => {
              runRef.current()
              return true // true = تم التعامل معه، فما يضيف سطر جديد
            },
          },
        ]),
      ),
      ...(wrap ? [EditorView.lineWrapping] : []),
    ],
    [wrap],
  )

  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      theme="none"
      basicSetup={BASIC_SETUP}
      extensions={extensions}
      onCreateEditor={onReady}
      minHeight="560px"
      placeholder="Write your prompt here. Use {{variables}} for dynamic parts..."
      className="text-on-surface"
    />
  )
}