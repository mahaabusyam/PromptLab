import { z } from 'zod';
import { templateSchema } from './schemas';
import type { Template } from './schemas';

export const MAX_IMPORT_BYTES = 1_000_000;
export const CUSTOM_ID_PREFIX = 'custom-';

export type ImportResult = { ok: true; templates: Template[] } | { ok: false; error: string };

export function isCustomTemplate(template: Pick<Template, 'id'>): boolean {
  return template.id.startsWith(CUSTOM_ID_PREFIX);
}

export function parseTemplateImport(text: string): ImportResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: 'This file is not valid JSON.' };
  }

  // Accept both `[...]` and `{ "templates": [...] }`
  const candidate =
    typeof raw === 'object' && raw !== null && !Array.isArray(raw) && 'templates' in raw
      ? (raw as { templates: unknown }).templates
      : raw;

  const parsed = z.array(templateSchema).safeParse(candidate);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const where = issue && issue.path.length > 0 ? issue.path.join('.') : 'file';
    return { ok: false, error: `Invalid template data at "${where}": ${issue?.message ?? 'unknown error'}.` };
  }

  if (parsed.data.length === 0) return { ok: false, error: 'The file contains no templates.' };

  return {
    ok: true,
    templates: parsed.data.map((t) => ({
      ...t,
      id: `${CUSTOM_ID_PREFIX}${crypto.randomUUID()}`,
      featured: false, // only the built-in catalog can be featured
    })),
  };
}