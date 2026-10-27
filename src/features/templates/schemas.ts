import { z } from "zod";
import {
  modelProviderSchema,
  promptCategorySchema,
} from "@/features/prompts/schemas";

export const templateComplexitySchema = z.enum([
  "zero-shot",
  "few-shot",
  "multi-agent",
]);

export const templateSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  category: promptCategorySchema,
  provider: modelProviderSchema, // recommended model family
  complexity: templateComplexitySchema,
  tags: z.array(z.string()),
  featured: z.boolean().optional(),
  content: z.string().min(1),
});

export type Template = z.infer<typeof templateSchema>;
export type TemplateComplexity = z.infer<typeof templateComplexitySchema>;
