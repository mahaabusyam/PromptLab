import { z } from 'zod'

export const improveResponseSchema = z.object({
  improved: z.string().min(1),
})

export const errorBodySchema = z.object({
  error: z.object({ code: z.string(), message: z.string() }),
})

export const runResponseSchema = z.object({
  output: z.string().min(1),
  model: z.string(),
  latencyMs: z.number(),
  inputTokens: z.number().optional(),
  outputTokens: z.number().optional(),
})
export const variationsResponseSchema = z.object({
  variations: z.array(z.string().min(1)).min(1).max(5),
})