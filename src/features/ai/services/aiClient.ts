import axios from 'axios'
import type { ZodType } from 'zod'
import { AiError, toAiError } from '../errors'
import { improveResponseSchema, runResponseSchema } from '../schemas'
import type { ImproveRequest, ImproveResponse, RunRequest, RunResponse } from '../types'

export const aiHttp = axios.create({
  baseURL: '/api',
  timeout: 25_000,
  headers: { 'Content-Type': 'application/json' },
})

async function post<T>(path: string, body: unknown, schema: ZodType<T>): Promise<T> {
  try {
    const { data } = await aiHttp.post<unknown>(path, body)
    const parsed = schema.safeParse(data)
    if (!parsed.success) {
      throw new AiError('invalid_response', 'Unexpected response shape.')
    }
    return parsed.data
  } catch (error) {
    throw toAiError(error)
  }
}

export function improvePrompt(request: ImproveRequest): Promise<ImproveResponse> {
  return post('/improve', request, improveResponseSchema)
}

export function runPrompt(request: RunRequest): Promise<RunResponse> {
  return post('/run', request, runResponseSchema)
}