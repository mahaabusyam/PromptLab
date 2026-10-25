import { afterEach, describe, expect, it } from 'vitest'
import i18n from '@/i18n'
import { formatSavedAgo } from '@/utils/dates'
import { formatNumber } from './format'

afterEach(async () => {
  await i18n.changeLanguage('en')
})

describe('formatNumber', () => {
  it('uses commas in English', () => {
    expect(formatNumber(1234567)).toBe('1,234,567')
  })

  it('keeps Latin digits in Arabic', async () => {
    await i18n.changeLanguage('ar')
    expect(formatNumber(1234)).not.toMatch(/[\u0660-\u0669]/)
    expect(formatNumber(1234)).toContain('1')
  })
})

describe('formatSavedAgo', () => {
  it('says "just now" in both languages', async () => {
    expect(formatSavedAgo(1_000, 2_000)).toBe('just now')
    await i18n.changeLanguage('ar')
    expect(formatSavedAgo(1_000, 2_000)).toBe('الآن')
  })
})