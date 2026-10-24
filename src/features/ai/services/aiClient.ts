import axios from 'axios'
import { AiError, toAiError } from '../errors'
import { improveResponseSchema } from '../schemas'
import type { ImproveRequest, ImproveResponse } from '../types'

export const aiHttp = axios.create({
  baseURL: '/api',
  timeout: 25_000,
  headers: { 'Content-Type': 'application/json' },
})

export async function improvePrompt(request: ImproveRequest): Promise<ImproveResponse> {
  try {
    const { data } = await aiHttp.post<unknown>('/improve', request)
    const parsed = improveResponseSchema.safeParse(data)
    if (!parsed.success) {
      throw new AiError('invalid_response', 'Unexpected response shape.')
    }
    return parsed.data
  } catch (error) {
    throw toAiError(error)
  }
}