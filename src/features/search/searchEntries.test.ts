import { describe, expect, it } from 'vitest';
import type { Prompt } from '@/features/prompts/types';
import type { Template } from '@/features/templates/schemas';
import { SEARCH_LIMIT, searchEntries } from './searchEntries';

function prompt(overrides: Partial<Prompt> & Pick<Prompt, 'id' | 'title'>): Prompt {
  return {
    description: '',
    content: '',
    status: 'draft',
    category: 'writing',
    tags: [],
    model: { name: 'GPT-4o', provider: 'openai' },
    folderId: null,
    isFavorite: false,
    isArchived: false,
    versions: [{ id: 'v1', label: 'v1.0', content: '', note: 'n', createdAt: '2026-01-01T00:00:00.000Z' }],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

const template: Template = {
  id: 't1',
  title: 'Blog Outline',
  description: 'Outline a blog post',
  category: 'writing',
  provider: 'google',
  complexity: 'zero-shot',
  tags: ['seo'],
  content: 'Write about {{topic}}',
};

const prompts = [
  prompt({ id: 'old', title: 'Email writer', updatedAt: '2026-01-01T00:00:00.000Z' }),
  prompt({ id: 'new', title: 'Email reply helper', updatedAt: '2026-03-01T00:00:00.000Z' }),
  prompt({ id: 'body', title: 'Summarizer', content: 'Summarize this email thread' }),
  prompt({ id: 'gone', title: 'Email archived', isArchived: true }),
];

const ids = (query: string) => searchEntries(prompts, [template], query).map((r) => r.key);

describe('searchEntries', () => {
  it('with no query returns recent non-archived prompts, newest first', () => {
    expect(ids('')).toEqual(['prompt:new', 'prompt:old', 'prompt:body']);
  });

  it('ranks title matches above content matches and skips archived prompts', () => {
    const result = ids('email');
    expect(result).toEqual(['prompt:new', 'prompt:old', 'prompt:body']); // equal title score → newer first; body last
    expect(result).not.toContain('prompt:gone');
  });

  it('ranks "starts with" above "contains"', () => {
    const keys = searchEntries([prompt({ id: 'a', title: 'My email' }), prompt({ id: 'b', title: 'Email tool' })], [], 'email').map((r) => r.key);
    expect(keys).toEqual(['prompt:b', 'prompt:a']);
  });

  it('finds templates by tag and pages by name', () => {
    expect(ids('seo')).toEqual(['template:t1']);
    expect(ids('settings')).toEqual(['page:/settings']);
  });

  it('respects the limit', () => {
    const many = Array.from({ length: 20 }, (_, i) => prompt({ id: `p${i}`, title: `Email ${i}` }));
    expect(searchEntries(many, [], 'email')).toHaveLength(SEARCH_LIMIT);
  });
});