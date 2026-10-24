import { describe, expect, it } from 'vitest'
import { clampMaxTokens } from './limits'

describe('clampMaxTokens', () => {
  it('keeps values inside the allowed range', () => {
    expect(clampMaxTokens(1024)).toBe(1024)
  })
  it('clamps values that are too small or too large', () => {
    expect(clampMaxTokens(10)).toBe(256)
    expect(clampMaxTokens(100_000)).toBe(4096)
  })
  it('falls back to a default for invalid numbers', () => {
    expect(clampMaxTokens(Number.NaN)).toBe(1024)
  })
})