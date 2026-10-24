import { describe, expect, it } from 'vitest'
import { extractVariables, fillTemplate, splitTemplate, truncateTemplate } from './promptVariables'

describe('extractVariables', () => {
  it('returns names in order without duplicates', () => {
    expect(extractVariables('{{a}} {{b}} {{a}}')).toEqual(['a', 'b'])
  })

  it('allows spaces inside the braces', () => {
    expect(extractVariables('Hi {{ topic }} and {{tone}}')).toEqual(['topic', 'tone'])
  })

  it('ignores invalid names and malformed braces', () => {
    // names must start with a letter or underscore and contain only letters/digits/_
    expect(extractVariables('{{1abc}} {{a-b}} {{}} {x} {{ok_1}}')).toEqual(['ok_1'])
  })

  it('accepts a leading underscore', () => {
    expect(extractVariables('{{_x}}')).toEqual(['_x'])
  })

  it('returns an empty list when there are no variables', () => {
    expect(extractVariables('no variables here')).toEqual([])
  })
})

describe('fillTemplate', () => {
  it('replaces every occurrence of a variable', () => {
    expect(fillTemplate('Hi {{name}}, {{name}}!', { name: 'Sam' })).toBe('Hi Sam, Sam!')
  })

  it('replaces variables written with inner spaces', () => {
    expect(fillTemplate('Hi {{ name }}', { name: 'Sam' })).toBe('Hi Sam')
  })

  it.each([
    ['an empty value', { name: '' }],
    ['a whitespace-only value', { name: '   ' }],
    ['a missing value', {}],
  ])('keeps the placeholder for %s', (_label, values) => {
    expect(fillTemplate('Hi {{name}}', values)).toBe('Hi {{name}}')
  })

  it('inserts special replacement patterns literally', () => {
    // "$&" and "$1" mean something in String.replace(string, ...) but not here
    expect(fillTemplate('Cost {{x}}', { x: '$& and $1' })).toBe('Cost $& and $1')
  })

  it('does not trim a value that has content', () => {
    expect(fillTemplate('{{a}}', { a: ' padded ' })).toBe(' padded ')
  })
})

describe('splitTemplate', () => {
  it('splits text and variables in order', () => {
    expect(splitTemplate('Hello {{name}}, welcome to {{place}}')).toEqual([
      { kind: 'text', text: 'Hello ' },
      { kind: 'variable', name: 'name' },
      { kind: 'text', text: ', welcome to ' },
      { kind: 'variable', name: 'place' },
    ])
  })

  it('handles adjacent variables', () => {
    expect(splitTemplate('{{a}}{{b}}')).toEqual([
      { kind: 'variable', name: 'a' },
      { kind: 'variable', name: 'b' },
    ])
  })

  it('keeps trailing text and plain text', () => {
    expect(splitTemplate('x {{a}} y')).toEqual([
      { kind: 'text', text: 'x ' },
      { kind: 'variable', name: 'a' },
      { kind: 'text', text: ' y' },
    ])
    expect(splitTemplate('plain')).toEqual([{ kind: 'text', text: 'plain' }])
  })

  it('returns an empty list for an empty string', () => {
    expect(splitTemplate('')).toEqual([])
  })
})

describe('truncateTemplate', () => {
  it('returns short content unchanged (including exactly maxChars)', () => {
    expect(truncateTemplate('short', 10)).toBe('short')
    expect(truncateTemplate('1234567890', 10)).toBe('1234567890')
  })

  it('cuts long text and adds an ellipsis', () => {
    expect(truncateTemplate('abcdefghij klm', 11)).toBe('abcdefghij…')
  })

  it('never leaves a half-cut {{variable}}', () => {
    // the cut lands inside "{{name}}" → go back to before "{{"
    expect(truncateTemplate('Hello {{name}} world', 10)).toBe('Hello…')
  })

  it('keeps a variable that was cut after it closed', () => {
    expect(truncateTemplate('Hello {{name}} world', 16)).toBe('Hello {{name}} w…')
  })
})