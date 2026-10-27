/** A NEW prompt is "dirty" once its draft differs from how it looked when the page opened. */
export function isDraftDirty(
  isNew: boolean,
  initialSnapshot: string,
  draft: unknown,
): boolean {
  return isNew && JSON.stringify(draft) !== initialSnapshot;
}
