// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { VariablesPanel } from './VariablesPanel'

// Renders the panel with sensible defaults; each test overrides only what it needs
function setup(props: Partial<ComponentProps<typeof VariablesPanel>> = {}) {
  const onChange = vi.fn()
  render(<VariablesPanel variableNames={[]} values={{}} onChange={onChange} {...props} />)
  return { onChange, user: userEvent.setup() }
}

describe('VariablesPanel', () => {
  it('shows an empty state and disables Auto-Fill when there are no variables', () => {
    setup()

    expect(screen.getByText('0 Dynamic Variables')).toBeInTheDocument()
    expect(screen.getByText(/No variables yet/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Auto-Fill' })).toBeDisabled()
    expect(screen.queryAllByRole('textbox')).toHaveLength(0)
  })

  it('uses the singular title for exactly one variable', () => {
    setup({ variableNames: ['topic'] })
    expect(screen.getByText('1 Dynamic Variable')).toBeInTheDocument()
  })

  it('renders one labelled field per variable with its current value', () => {
    setup({ variableNames: ['topic', 'tone'], values: { topic: 'AI' } })

    expect(screen.getByText('2 Dynamic Variables')).toBeInTheDocument()
    // getByLabelText also proves each textarea is correctly linked to its <label>
    expect(screen.getByLabelText(/^topic/)).toHaveValue('AI')
    expect(screen.getByLabelText(/^tone/)).toHaveValue('')
  })

  it('marks values as Filled or Empty, and treats blank text as empty', () => {
    setup({ variableNames: ['a', 'b', 'c'], values: { a: 'x', b: '   ' } })

    expect(screen.getAllByText('Filled')).toHaveLength(1)
    expect(screen.getAllByText('Empty')).toHaveLength(2)
  })

  it('reports typed text merged with the values that already exist', async () => {
    const { onChange, user } = setup({ variableNames: ['topic', 'tone'], values: { tone: 'formal' } })

    await user.type(screen.getByLabelText(/^topic/), 'x')

    expect(onChange).toHaveBeenCalledWith({ tone: 'formal', topic: 'x' })
  })

  it('Auto-Fill keeps filled values and fills the empty ones', async () => {
    const { onChange, user } = setup({ variableNames: ['topic', 'tone'], values: { topic: 'My topic' } })

    await user.click(screen.getByRole('button', { name: 'Auto-Fill' }))

    expect(onChange).toHaveBeenCalledTimes(1)
    const next = onChange.mock.calls[0][0] as Record<string, string>
    expect(next.topic).toBe('My topic')
    expect(next.tone.trim()).not.toBe('')
  })
})