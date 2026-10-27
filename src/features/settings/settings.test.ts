import { describe, expect, it } from 'vitest';
import type { Prompt } from '@/features/prompts/types';
import { buildBackup, mergeById, parseBackup, summarizeBackup, type BackupData } from './backup';
import { DEFAULT_SETTINGS, coerceSettings } from './schemas';
import { formatBytes, measureStorage } from './storage';

const prompt: Prompt = {
  id: 'p1',
  title: 'Hello',
  description: 'd',
  content: 'Hi {{name}}',
  status: 'draft',
  category: 'writing',
  tags: [],
  model: { name: 'GPT-4o', provider: 'openai' },
  folderId: null,
  isFavorite: false,
  isArchived: false,
  versions: [{ id: 'v1', label: 'v1.0', content: 'Hi', note: 'init', createdAt: '2026-01-01T00:00:00.000Z' }],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const data: BackupData = {
  prompts: [prompt],
  folders: [{ id: 'f1', name: 'Work', parentId: null }],
  customTemplates: [],
  favoriteTemplateIds: ['t1'],
  settings: DEFAULT_SETTINGS,
};

describe('backup', () => {
  it('round-trips through JSON text', async () => {
    const file = await buildBackup(data, new Date('2026-05-01T00:00:00.000Z'));
    const result = await parseBackup(JSON.stringify(file, null, 2));
    expect(result.ok).toBe(true);
    if (result.ok) expect(summarizeBackup(result.file.data)).toEqual({ prompts: 1, versions: 1, folders: 1, templates: 0 });
  });

  it('rejects a tampered file (checksum mismatch)', async () => {
    const file = await buildBackup(data);
    const text = JSON.stringify(file).replace('"Hello"', '"Hacked"');
    const result = await parseBackup(text);
    expect(result).toEqual({
  ok: false,
  code: 'checksum',
  error: 'Checksum mismatch: the file was modified or corrupted.',
});
  });

  it('rejects invalid JSON and wrong shape', async () => {
    expect((await parseBackup('{oops')).ok).toBe(false);
    expect((await parseBackup('{"app":"other"}')).ok).toBe(false);
  });
});

describe('mergeById', () => {
  it('adds new ids and lets incoming replace existing ones', () => {
    const result = mergeById([{ id: 'a', v: 1 }, { id: 'b', v: 1 }], [{ id: 'b', v: 2 }, { id: 'c', v: 2 }]);
    expect(result.items).toEqual([{ id: 'a', v: 1 }, { id: 'b', v: 2 }, { id: 'c', v: 2 }]);
    expect(result).toMatchObject({ added: 1, updated: 1 });
  });
});

describe('settings', () => {
  it('falls back to defaults for invalid stored values', () => {
    expect(coerceSettings({ accent: 'purple' })).toEqual(DEFAULT_SETTINGS);
    expect(coerceSettings({ workspaceName: 'Acme' }).workspaceName).toBe('Acme');
  });
});

describe('storage', () => {
  it('counts only promptlab-* keys', () => {
    const fake = { promptlab: 'x', 'promptlab-a': '1234', other: 'zzzz' } as Record<string, string>;
    const keys = Object.keys(fake);
    const usage = measureStorage({
      length: keys.length,
      key: (i) => keys[i] ?? null,
      getItem: (k) => fake[k] ?? null,
    });
    expect(usage.keys).toBe(1);
    expect(usage.bytes).toBe(('promptlab-a'.length + 4) * 2);
  });

  it('formats bytes', () => {
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(2048)).toBe('2.0 KB');
  });
});