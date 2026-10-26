import { describe, expect, it } from 'vitest';
import { CUSTOM_ID_PREFIX, isCustomTemplate, parseTemplateImport } from './importTemplates';

const valid = {
  id: 'x',
  title: 'T',
  description: 'D',
  category: 'writing',
  provider: 'anthropic',
  complexity: 'zero-shot',
  tags: [],
  featured: true,
  content: 'Hello {{name}}',
};

describe('parseTemplateImport', () => {
  it('accepts a plain array', () => {
    const result = parseTemplateImport(JSON.stringify([valid]));
    expect(result.ok).toBe(true);
  });

  it('accepts { templates: [...] }', () => {
    const result = parseTemplateImport(JSON.stringify({ templates: [valid] }));
    expect(result.ok).toBe(true);
  });

  it('generates fresh custom ids and removes the featured flag', () => {
    const result = parseTemplateImport(JSON.stringify([valid, valid]));
    if (!result.ok) throw new Error('expected ok');
    const [first, second] = result.templates;
    expect(first?.id.startsWith(CUSTOM_ID_PREFIX)).toBe(true);
    expect(first?.id).not.toBe(second?.id);
    expect(first?.featured).toBe(false);
    expect(first && isCustomTemplate(first)).toBe(true);
  });

  it('rejects text that is not JSON', () => {
    const result = parseTemplateImport('not json');
    expect(result).toEqual({ ok: false, code: 'invalid_json', error: 'This file is not valid JSON.' });
  });

  it('rejects an unknown category and points to the field', () => {
    const result = parseTemplateImport(JSON.stringify([{ ...valid, category: 'cooking' }]));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain('0.category');
  });

  it('rejects an empty list', () => {
    const result = parseTemplateImport('[]');
    expect(result).toEqual({ ok: false, code: 'empty', error: 'The file contains no templates.' });
  });
  it('reports the failing field for invalid template data', () => {
  const result = parseTemplateImport('[{"title": 5}]');
  expect(result).toMatchObject({ ok: false, code: 'invalid_data' });
});
});