import { describe, expect, it } from 'vitest'
import { estimateCostUsd, estimateTokens } from './tokens'

describe('estimateTokens', () => {
  it('estimates one token per 4 characters, rounded up', () => {
    expect(estimateTokens('')).toBe(0)
    expect(estimateTokens('abcd')).toBe(1)
    expect(estimateTokens('abcde')).toBe(2)
    expect(estimateTokens('a'.repeat(400))).toBe(100)
  })
})

describe('estimateCostUsd', () => {
  it('uses a flat rate per 1,000 tokens', () => {
    expect(estimateCostUsd(0)).toBe(0)
    expect(estimateCostUsd(1000)).toBeCloseTo(0.004, 10)
    expect(estimateCostUsd(2500)).toBeCloseTo(0.01, 10)
  })
})