import { useEffect, useMemo, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { Prec } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { useTranslation } from "react-i18next";
import {
  promptA11y,
  promptEditorTheme,
  variableHighlight,
} from "../codemirror/promptExtensions";

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
};

interface PromptCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  wrap: boolean;
  onReady: (view: EditorView) => void;
  onQuickRun: () => void;
}

export function PromptCodeEditor({
  value,
  onChange,
  wrap,
  onReady,
  onQuickRun,
}: PromptCodeEditorProps) {
  const { t } = useTranslation();
  const a11yLabel = t("editor.code.label");
  // ref بدل dependency، عشان الـ extensions ما تنبني من جديد كل ما تغيّرت الدالة
  const runRef = useRef(onQuickRun);
  useEffect(() => {
    runRef.current = onQuickRun;
  });

  const extensions = useMemo(
    () => [
      variableHighlight,
      promptEditorTheme,
      promptA11y(a11yLabel),
      // كل سطر بياخد اتجاهه من محتواه: سطر عربي من اليمين، وسطر إنجليزي من اليسار
      EditorView.perLineTextDirection.of(true),
      Prec.highest(
        // eslint-disable-next-line react-hooks/refs -- the ref is only read inside the key handler (on keypress), never during render
        keymap.of([
          {
            key: "Mod-Enter",
            run: () => {
              runRef.current();
              return true; // true = تم التعامل معه، فما يضيف سطر جديد
            },
          },
        ]),
      ),
      ...(wrap ? [EditorView.lineWrapping] : []),
    ],
    [wrap, a11yLabel],
  );

  return (
    // المحرر نفسه LTR (أرقام الأسطر عاليسار مثل كل المحررات)، واتجاه كل سطر تلقائي
    <div dir="ltr">
      <CodeMirror
        value={value}
        onChange={onChange}
        theme="none"
        basicSetup={BASIC_SETUP}
        extensions={extensions}
        onCreateEditor={onReady}
        minHeight="560px"
        placeholder={t("editor.code.placeholder", { example: "{{variables}}" })}
        className="text-on-surface"
      />
    </div>
  );
}
