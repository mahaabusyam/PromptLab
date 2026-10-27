import { useCallback, useEffect, useRef } from "react";
import { useBlocker } from "react-router-dom";

/**
 * Blocks in-app navigation (links, back button) and tab close/refresh while `isDirty`.
 * Needs a data router (createBrowserRouter), which this project uses.
 */
export function useUnsavedChangesGuard(isDirty: boolean) {
  const bypass = useRef(false);

  const blocker = useBlocker(
    useCallback(() => isDirty && !bypass.current, [isDirty]),
  );

  // Tab close / refresh: the browser shows its own generic confirmation
  useEffect(() => {
    if (!isDirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ""; // required by some browsers
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  /** Call right before an INTENTIONAL navigation (e.g. after saving) so it isn't blocked. */
  const allowNextNavigation = useCallback(() => {
    bypass.current = true;
  }, []);

  return { blocker, allowNextNavigation };
}
