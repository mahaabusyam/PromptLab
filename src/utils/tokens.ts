const CHARS_PER_TOKEN = 4
const COST_PER_1K_TOKENS_USD = 0.004

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN)
}

export function estimateCostUsd(tokens: number): number {
  return (tokens / 1000) * COST_PER_1K_TOKENS_USD
}