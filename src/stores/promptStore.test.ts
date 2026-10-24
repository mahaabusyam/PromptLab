// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { seedFolders, seedPrompts } from '@/data/seedPrompts'
import type { Prompt } from '@/features/prompts/types'
import { makeFolder, makePrompt } from '@/test/factories'
import { usePromptStore } from './promptStore'

const state = () => usePromptStore.getState()

function byId(id: string): Prompt {
  const found = state().prompts.find((p) => p.id === id)
  if (!found) throw new Error(`Prompt "${id}" not found`)
  return found
}

beforeEach(() => {
  localStorage.clear()
  usePromptStore.setState({
    prompts: [makePrompt({ id: 'a' }), makePrompt({ id: 'b' })],
    folders: [makeFolder('f1')],
  })
})

afterEach(() => {
  vi.useRealTimers()
})

describe('addPrompt', () => {
  it('creates a draft with a first version and puts it at the top', () => {
    const created = state().addPrompt({ title: 'New', content: 'Hi {{x}}' })

    expect(state().prompts).toHaveLength(3)
    expect(state().prompts[0]).toEqual(created)
    expect(created).toMatchObject({
      title: 'New',
      content: 'Hi {{x}}',
      status: 'draft',
      isFavorite: false,
      isArchived: false,
      folderId: null,
      tags: [],
    })
    expect(created.versions).toHaveLength(1)
    expect(created.versions[0]).toMatchObject({ label: 'v1.0', content: 'Hi {{x}}', note: 'Initial version' })
    expect(created.createdAt).toBe(created.updatedAt)
  })

  it('lets the input override the defaults', () => {
    const created = state().addPrompt({ title: 'T', content: 'C', category: 'coding', isFavorite: true })
    expect(created).toMatchObject({ category: 'coding', isFavorite: true })
  })

  it('gives every prompt its own id', () => {
    const first = state().addPrompt({ title: '1', content: 'x' })
    const second = state().addPrompt({ title: '2', content: 'x' })
    expect(first.id).not.toBe(second.id)
  })
})

describe('updatePrompt', () => {
  it('changes only the given fields and refreshes updatedAt', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-02-01T00:00:00.000Z'))

    state().updatePrompt('a', { title: 'Renamed' })

    expect(byId('a').title).toBe('Renamed')
    expect(byId('a').content).toBe('Hello {{name}}')
    expect(byId('a').updatedAt).toBe('2026-02-01T00:00:00.000Z')
    expect(byId('b').updatedAt).toBe('2026-01-01T00:00:00.000Z') // untouched
  })

  it('ignores an unknown id', () => {
    const before = state().prompts
    state().updatePrompt('missing', { title: 'x' })
    expect(state().prompts).toEqual(before)
  })
})

describe('deletePrompt', () => {
  it('removes only that prompt', () => {
    state().deletePrompt('a')
    expect(state().prompts.map((p) => p.id)).toEqual(['b'])
  })

  it('ignores an unknown id', () => {
    state().deletePrompt('missing')
    expect(state().prompts).toHaveLength(2)
  })
})

describe('toggles', () => {
  it('flips favorite on and off for one prompt', () => {
    state().toggleFavorite('a')
    expect(byId('a').isFavorite).toBe(true)
    expect(byId('b').isFavorite).toBe(false)
    state().toggleFavorite('a')
    expect(byId('a').isFavorite).toBe(false)
  })

  it('flips archive on and off for one prompt', () => {
    state().toggleArchive('a')
    expect(byId('a').isArchived).toBe(true)
    expect(byId('b').isArchived).toBe(false)
    state().toggleArchive('a')
    expect(byId('a').isArchived).toBe(false)
  })
})

describe('addFolder', () => {
  it('trims the name, defaults to the root and appends', () => {
    const folder = state().addFolder('  Docs  ')
    expect(folder).toMatchObject({ name: 'Docs', parentId: null })
    expect(state().folders.map((f) => f.id)).toEqual(['f1', folder.id])
  })

  it('can create a sub-folder', () => {
    expect(state().addFolder('Child', 'f1').parentId).toBe('f1')
  })
})

describe('addVersion', () => {
  it('adds the next minor version and updates the working content', () => {
    const version = state().addVersion('a', { note: 'Tighten', content: 'New text', bump: 'minor' })

    expect(version).toMatchObject({ label: 'v1.1', content: 'New text', note: 'Tighten' })
    expect(byId('a').content).toBe('New text')
    expect(byId('a').versions).toHaveLength(2)
    expect(byId('a').versions[1]).toEqual(version)
    expect(byId('a').updatedAt).toBe(version?.createdAt)
  })

  it('supports a major bump', () => {
    expect(state().addVersion('a', { note: 'Rewrite', content: 'x', bump: 'major' })?.label).toBe('v2.0')
  })

  it('returns null for an unknown prompt', () => {
    expect(state().addVersion('missing', { note: 'n', content: 'x', bump: 'minor' })).toBeNull()
  })
})

describe('restoreVersion', () => {
  // prompt "h": v1.0 ("v1 text") then v1.1 ("v2 text")
  beforeEach(() => {
    usePromptStore.setState({ prompts: [makePrompt({ id: 'h', content: 'v1 text' })] })
    state().addVersion('h', { note: 'Second', content: 'v2 text', bump: 'minor' })
  })

  it('creates a NEW version with the old content instead of rewriting history', () => {
    const restored = state().restoreVersion('h', 'h-v1')

    expect(restored).toMatchObject({
      label: 'v1.2',
      content: 'v1 text',
      note: 'Restored from v1.0',
      restoredFrom: 'v1.0',
    })
    expect(byId('h').content).toBe('v1 text')
    expect(byId('h').versions).toHaveLength(3)
    expect(byId('h').versions.map((v) => v.label)).toEqual(['v1.0', 'v1.1', 'v1.2'])
    expect(byId('h').versions[2]).toEqual(restored)
  })

  it('returns null for an unknown version or prompt and changes nothing', () => {
    expect(state().restoreVersion('h', 'missing')).toBeNull()
    expect(state().restoreVersion('missing', 'h-v1')).toBeNull()
    expect(byId('h').versions).toHaveLength(2)
  })
})

describe('deleteVersion', () => {
  beforeEach(() => {
    usePromptStore.setState({ prompts: [makePrompt({ id: 'h', content: 'v1 text' })] })
    state().addVersion('h', { note: 'Second', content: 'v2 text', bump: 'minor' })
  })

  it('deletes an older version', () => {
    expect(state().deleteVersion('h', 'h-v1')).toBe(true)
    expect(byId('h').versions.map((v) => v.label)).toEqual(['v1.1'])
  })

  it('refuses to delete the current (last) version', () => {
    const current = byId('h').versions[1]
    expect(state().deleteVersion('h', current.id)).toBe(false)
    expect(byId('h').versions).toHaveLength(2)
  })

  it('returns false for unknown ids', () => {
    expect(state().deleteVersion('h', 'missing')).toBe(false)
    expect(state().deleteVersion('missing', 'h-v1')).toBe(false)
  })
})

describe('importData', () => {
  const incoming = {
    prompts: [makePrompt({ id: 'b', title: 'Updated B' }), makePrompt({ id: 'c' })],
    folders: [makeFolder('f2')],
  }

  it('merge: adds new items and lets the imported one replace the same id', () => {
    state().importData(incoming, 'merge')
    expect(state().prompts.map((p) => p.id)).toEqual(['a', 'b', 'c'])
    expect(byId('b').title).toBe('Updated B')
    expect(state().folders.map((f) => f.id)).toEqual(['f1', 'f2'])
  })

  it('replace: keeps only what was imported', () => {
    state().importData(incoming, 'replace')
    expect(state().prompts.map((p) => p.id)).toEqual(['b', 'c'])
    expect(state().folders.map((f) => f.id)).toEqual(['f2'])
  })
})

describe('resetToSeed', () => {
  it('restores the demo prompts and folders', () => {
    state().resetToSeed()
    expect(state().prompts).toBe(seedPrompts)
    expect(state().folders).toBe(seedFolders)
  })
})

describe('persistence', () => {
  it('saves changes to localStorage so they survive a page refresh', () => {
    const created = state().addPrompt({ title: 'Persist me', content: 'x' })

    const raw = localStorage.getItem('promptlab-prompts')
    expect(raw).not.toBeNull()

    const saved = JSON.parse(raw ?? '{}') as { state: { prompts: Prompt[] } }
    expect(saved.state.prompts[0].id).toBe(created.id)
  })
})