import axios from 'axios'
import type { ZodType } from 'zod'
import { AiError, toAiError } from '../errors'
import { improveResponseSchema, runResponseSchema, variationsResponseSchema } from '../schemas'
import type {
  ImproveRequest,
  ImproveResponse,
  RunRequest,
  RunResponse,
  VariationsRequest,
  VariationsResponse,
} from '../types'

export const aiHttp = axios.create({
  baseURL: '/api',
  timeout: 25_000,
  headers: { 'Content-Type': 'application/json' },
})

const SLOW_REQUEST_TIMEOUT_MS = 55_000

async function post<T>(path: string, body: unknown, schema: ZodType<T>, timeout?: number): Promise<T> {
  try {
    const { data } = await aiHttp.post<unknown>(path, body, timeout ? { timeout } : undefined)
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

export function generateVariations(request: VariationsRequest): Promise<VariationsResponse> {
  return post('/variations', request, variationsResponseSchema, SLOW_REQUEST_TIMEOUT_MS)
}