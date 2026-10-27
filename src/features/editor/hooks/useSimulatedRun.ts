import { useCallback, useEffect, useRef, useState } from "react";
import { simulateRun } from "../simulateRun";
import type { RunResult } from "../simulateRun";
import type { EditorDraft, RunStatus } from "../types";

export function useSimulatedRun(draft: EditorDraft) {
  const [status, setStatus] = useState<RunStatus>("idle");
  const [result, setResult] = useState<RunResult | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // run بتقرأ آخر draft من ref، فتضل دالة ثابتة (ما بتتغير مع كل حرف)
  const latest = useRef(draft);
  useEffect(() => {
    latest.current = draft;
  });

  const run = useCallback(() => {
    if (!latest.current.content.trim()) return;
    if (timer.current) clearTimeout(timer.current);
    const next = simulateRun(latest.current);
    setStatus("running");
    // ننتظر نفس الـ latency المحسوبة، عشان تحسّي بتجربة تشغيل حقيقية
    timer.current = setTimeout(() => {
      setResult(next);
      setStatus("done");
    }, next.latencyMs);
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return { status, result, run };
}
