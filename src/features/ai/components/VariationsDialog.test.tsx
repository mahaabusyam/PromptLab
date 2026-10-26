// @vitest-environment jsdom
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithQuery } from '@/test/renderWithQuery'
import { AiError } from '../errors'
import { generateVariations } from '../services/aiClient'
import { VariationsDialog } from './VariationsDialog'

// النص صار مقسوم على عناصر (<bdi> لأسماء المتغيّرات)، فنطابق على textContent الكامل للفقرة
const paragraphWith = (pattern: RegExp) => (_content: string, element: Element | null) =>
  element?.tagName === 'P' && pattern.test(element.textContent ?? '')

vi.mock('../services/aiClient', () => ({
  improvePrompt: vi.fn(),
  runPrompt: vi.fn(),
  generateVariations: vi.fn(),
}))

const mockedGenerate = vi.mocked(generateVariations)
const ORIGINAL = 'Write a blog post about {{topic}}'

function setup() {
  const onUse = vi.fn()
  const onClose = vi.fn()
  renderWithQuery(<VariationsDialog prompt={ORIGINAL} onUse={onUse} onClose={onClose} />)
  return { onUse, onClose, user: userEvent.setup() }
}

beforeEach(() => {
  mockedGenerate.mockReset()
})

describe('VariationsDialog', () => {
  it('shows one card per variation', async () => {
    mockedGenerate.mockResolvedValue({
      variations: ['One {{topic}}', 'Two {{topic}}', 'Three {{topic}}'],
    })
    const { user } = setup()

    await user.click(screen.getByRole('button', { name: 'Generate variations' }))

    expect(await screen.findAllByRole('listitem')).toHaveLength(3)
    expect(screen.getByRole('button', { name: 'Use variation 2' })).toBeInTheDocument()
    expect(mockedGenerate.mock.calls[0][0]).toMatchObject({ prompt: ORIGINAL, task: 'general' })
  })

  it('returns the chosen variation through onUse', async () => {
    mockedGenerate.mockResolvedValue({ variations: ['One {{topic}}', 'Two {{topic}}'] })
    const { user, onUse } = setup()

    await user.click(screen.getByRole('button', { name: 'Generate variations' }))
    await user.click(await screen.findByRole('button', { name: 'Use variation 2' }))

    expect(onUse).toHaveBeenCalledWith('Two {{topic}}')
  })

  it('warns on a variation that dropped a variable', async () => {
    mockedGenerate.mockResolvedValue({ variations: ['Good {{topic}}', 'No variable here'] })
    const { user } = setup()

    await user.click(screen.getByRole('button', { name: 'Generate variations' }))

      expect(screen.getByText(paragraphWith(/Removed: \{\{topic\}\}/))).toBeInTheDocument()
  })

  it('shows a loading message while waiting', async () => {
    mockedGenerate.mockReturnValue(new Promise(() => {}))
    const { user } = setup()

    await user.click(screen.getByRole('button', { name: 'Generate variations' }))

    expect(await screen.findByText(/Writing 3 variations/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Generate variations' })).toBeDisabled()
  })

  it('shows an error and offers to generate again', async () => {
    mockedGenerate.mockRejectedValue(new AiError('timeout', 'x'))
    const { user } = setup()

    await user.click(screen.getByRole('button', { name: 'Generate variations' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('took too long')
    expect(screen.getByRole('button', { name: 'Generate again' })).toBeEnabled()
  })
})