import { describe, expect, it } from 'vitest'
import { makeFolder, makePrompt } from '@/test/factories'
import { buildExportFile, parseImportText } from './importExport'

const prompts = [makePrompt({ id: 'a', title: 'A' }), makePrompt({ id: 'b', title: 'B' })]
const folders = [makeFolder('f1')]

describe('buildExportFile', () => {
  it('wraps prompts and folders with app, version and timestamp', () => {
    const file = buildExportFile(prompts, folders)
    expect(file).toMatchObject({ app: 'promptlab', version: 1, prompts, folders })
    expect(new Date(file.exportedAt).toISOString()).toBe(file.exportedAt)
  })
})

describe('parseImportText', () => {
  it('accepts what buildExportFile produces (round trip)', () => {
    const result = parseImportText(JSON.stringify(buildExportFile(prompts, folders)))
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.prompts).toEqual(prompts)
      expect(result.data.folders).toEqual(folders)
    }
  })

  it('accepts an export with no prompts', () => {
    const empty = { app: 'promptlab', version: 1, exportedAt: 'x', prompts: [], folders: [] }
    expect(parseImportText(JSON.stringify(empty)).ok).toBe(true)
  })

  it('rejects text that is not JSON', () => {
    expect(parseImportText('{oops')).toEqual({ ok: false, error: 'This file is not valid JSON.' })
  })

  it('rejects a file from another app', () => {
    const result = parseImportText(JSON.stringify({ app: 'other', version: 1 }))
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toContain('Not a valid PromptLab export')
      expect(result.error).toContain('app')
    }
  })

  it('rejects a file with a missing field and names it', () => {
    const withoutPrompts = { app: 'promptlab', version: 1, exportedAt: 'x', folders }
    const result = parseImportText(JSON.stringify(withoutPrompts))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toContain('prompts')
  })

  it('rejects an invalid value inside a prompt and points to it', () => {
    const file = buildExportFile([makePrompt({ id: 'a' })], folders)
    const broken = JSON.parse(JSON.stringify(file)) as { prompts: { status: string }[] }
    broken.prompts[0].status = 'archived' // not one of draft | testing | production
    const result = parseImportText(JSON.stringify(broken))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toContain('prompts.0.status')
  })
})