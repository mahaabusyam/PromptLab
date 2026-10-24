import type { z } from 'zod'
import type {
  exportFileSchema,
  folderSchema,
  modelProviderSchema,
  promptCategorySchema,
  promptSchema,
  promptStatusSchema,
  promptVersionSchema,
  promptSettingsSchema,
} from './schemas'
export type PromptSettings = z.infer<typeof promptSettingsSchema>

export type PromptStatus = z.infer<typeof promptStatusSchema>
export type ModelProvider = z.infer<typeof modelProviderSchema>
export type PromptCategory = z.infer<typeof promptCategorySchema>
export type PromptVersion = z.infer<typeof promptVersionSchema>
export type Prompt = z.infer<typeof promptSchema>
export type Folder = z.infer<typeof folderSchema>
export type ExportFile = z.infer<typeof exportFileSchema>