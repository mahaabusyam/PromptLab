import { z } from 'zod';
import { folderSchema, promptSchema } from '@/features/prompts/schemas';
import { templateSchema } from '@/features/templates/schemas';
import { settingsSchema } from './schemas';

export const MAX_BACKUP_BYTES = 5 * 1024 * 1024; // localStorage can't hold more anyway

const backupDataSchema = z.object({
  prompts: z.array(promptSchema),
  folders: z.array(folderSchema),
  customTemplates: z.array(templateSchema),
  favoriteTemplateIds: z.array(z.string()),
  settings: settingsSchema,
});
export type BackupData = z.infer<typeof backupDataSchema>;

const backupFileSchema = z.object({
  app: z.literal('promptlab'),
  type: z.literal('backup'),
  version: z.literal(1),
  exportedAt: z.string(),
  checksum: z.string(),
  data: backupDataSchema,
});
export type BackupFile = z.infer<typeof backupFileSchema>;

export async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function buildBackup(data: BackupData, now: Date = new Date()): Promise<BackupFile> {
  return {
    app: 'promptlab',
    type: 'backup',
    version: 1,
    exportedAt: now.toISOString(),
    checksum: await sha256Hex(JSON.stringify(data)),
    data,
  };
}

export type ParseBackupResult = { ok: true; file: BackupFile } | { ok: false; error: string };

const fail = (error: string): ParseBackupResult => ({ ok: false, error });

export async function parseBackup(text: string): Promise<ParseBackupResult> {
  if (text.length > MAX_BACKUP_BYTES) return fail('The file is larger than 5 MB.');

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return fail('The file is not valid JSON.');
  }

  const parsed = backupFileSchema.safeParse(json);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const where = issue && issue.path.length > 0 ? `${issue.path.join('.')}: ` : '';
    return fail(`Not a valid PromptLab backup. ${where}${issue?.message ?? ''}`.trim());
  }

  // Checksum is computed over the RAW data (not Zod's output, which can reorder keys)
  const rawData = typeof json === 'object' && json !== null && 'data' in json ? json.data : undefined;
  const actual = await sha256Hex(JSON.stringify(rawData));
  if (actual !== parsed.data.checksum) {
    return fail('Checksum mismatch: the file was modified or corrupted.');
  }
  return { ok: true, file: parsed.data };
}

export function summarizeBackup(data: BackupData) {
  return {
    prompts: data.prompts.length,
    versions: data.prompts.reduce((sum, p) => sum + p.versions.length, 0),
    folders: data.folders.length,
    templates: data.customTemplates.length,
  };
}


export function mergeById<T extends { id: string }>(current: T[], incoming: T[]) {
  const known = new Set(current.map((x) => x.id));
  const added = incoming.filter((x) => !known.has(x.id)).length;
  const byId = new Map(current.map((x) => [x.id, x]));
  incoming.forEach((x) => byId.set(x.id, x));
  return { items: [...byId.values()], added, updated: incoming.length - added };
}