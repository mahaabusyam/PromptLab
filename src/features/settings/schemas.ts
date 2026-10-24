import { z } from 'zod';
import { modelCatalog } from '@/features/prompts/constants';

export const accentIds = ['violet', 'cyan', 'emerald', 'pink'] as const;
export const accentSchema = z.enum(accentIds);
export type Accent = z.infer<typeof accentSchema>;

export const settingsSchema = z.object({
  workspaceName: z.string().trim().min(1, 'Workspace title is required').max(40, 'Max 40 characters'),
  defaultModel: z.string().min(1),
  accent: accentSchema,
  highContrast: z.boolean(),
});
export type Settings = z.infer<typeof settingsSchema>;

export const DEFAULT_SETTINGS: Settings = {
  workspaceName: 'My Workspace',
  defaultModel: modelCatalog[0]?.name ?? 'GPT-4o',
  accent: 'violet',
  highContrast: false,
};

/** Merges unknown stored/imported data over the defaults; falls back to defaults if invalid. */
export function coerceSettings(value: unknown): Settings {
  const base = typeof value === 'object' && value !== null ? value : {};
  const parsed = settingsSchema.safeParse({ ...DEFAULT_SETTINGS, ...base });
  return parsed.success ? parsed.data : DEFAULT_SETTINGS;
}
export const generalSchema = settingsSchema.pick({ workspaceName: true, defaultModel: true });
export type GeneralValues = z.infer<typeof generalSchema>;