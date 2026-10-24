import { z } from 'zod'

export const improveResponseSchema = z.object({
  improved: z.string().min(1),
})

export const errorBodySchema = z.object({
  error: z.object({ code: z.string(), message: z.string() }),
})