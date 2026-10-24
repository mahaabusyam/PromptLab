import '@testing-library/jest-dom/vitest' // adds matchers like toBeInTheDocument()
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Tests in the "node" environment have no usable localStorage, but zustand's `persist`
// needs one. Give them a tiny in-memory fake. jsdom tests (window exists) keep jsdom's real one.
if (typeof window === 'undefined') {
  const data = new Map<string, string>()
  vi.stubGlobal('localStorage', {
    get length() {
      return data.size
    },
    clear: () => data.clear(),
    getItem: (key: string) => data.get(key) ?? null,
    key: (index: number) => [...data.keys()][index] ?? null,
    removeItem: (key: string) => {
      data.delete(key)
    },
    setItem: (key: string, value: string) => {
      data.set(key, String(value))
    },
  } satisfies Storage)
}

// Remove rendered components after every test so tests can't affect each other
afterEach(() => {
  cleanup()
})