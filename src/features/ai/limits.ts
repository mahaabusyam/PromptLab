const MIN_TOKENS = 256
const MAX_TOKENS = 4096

export function clampMaxTokens(value: number): number {
  if (!Number.isFinite(value)) return 1024
  return Math.min(MAX_TOKENS, Math.max(MIN_TOKENS, Math.round(value)))
}