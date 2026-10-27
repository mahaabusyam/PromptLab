import { z } from "zod";

export const promptStatusSchema = z.enum(["draft", "testing", "production"]);
export const modelProviderSchema = z.enum(["anthropic", "openai", "google"]);
export const promptCategorySchema = z.enum([
  "marketing",
  "coding",
  "education",
  "writing",
  "data-analysis",
]);

export const promptVersionSchema = z.object({
  id: z.string(),
  label: z.string(),
  content: z.string(),
  note: z.string(),
  createdAt: z.string(),
  restoredFrom: z.string().optional(), // label of the version this one was restored from
});

// إعدادات الموديل (Temperature وغيرها) اللي بيعدّلها المحرر
export const promptSettingsSchema = z.object({
  temperature: z.number().min(0).max(1),
  maxTokens: z.number().int().min(1).max(8192),
  topP: z.number().min(0).max(1),
  strictSchema: z.boolean(),
});

export const promptSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  content: z.string(),
  status: promptStatusSchema,
  category: promptCategorySchema,
  tags: z.array(z.string()),
  model: z.object({ name: z.string(), provider: modelProviderSchema }),
  folderId: z.string().nullable(),
  isFavorite: z.boolean(),
  isArchived: z.boolean(),
  lastRun: z.object({ latencyMs: z.number(), costUsd: z.number() }).optional(),
  // اختيارية (optional) عشان الـ Prompts القديمة المحفوظة بالـ localStorage تضل صالحة
  settings: promptSettingsSchema.optional(),
  variableValues: z.record(z.string(), z.string()).optional(),
  versions: z.array(promptVersionSchema).min(1),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const folderSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  parentId: z.string().nullable(),
});

// شكل ملف التصدير/الاستيراد JSON
export const exportFileSchema = z.object({
  app: z.literal("promptlab"),
  version: z.literal(1),
  exportedAt: z.string(),
  prompts: z.array(promptSchema),
  folders: z.array(folderSchema),
});
