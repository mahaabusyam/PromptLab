import type { AxiosResponse } from 'axios'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ImproveRequest } from '../types'
import { aiHttp, improvePrompt, runPrompt , generateVariations } from './aiClient'

const request: ImproveRequest = {
  prompt: 'Write about {{topic}}',
  task: 'writing',
  tone: 'friendly',
  length: 'medium',
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('improvePrompt', () => {
  it('returns the improved text on success', async () => {
    vi.spyOn(aiHttp, 'post').mockResolvedValue({ data: { improved: 'Better {{topic}}' } } as AxiosResponse)
    await expect(improvePrompt(request)).resolves.toEqual({ improved: 'Better {{topic}}' })
  })

  it('rejects with invalid_response when the server answers with the wrong shape', async () => {
    vi.spyOn(aiHttp, 'post').mockResolvedValue({ data: { nope: true } } as AxiosResponse)
    await expect(improvePrompt(request)).rejects.toMatchObject({ code: 'invalid_response' })
  })

  it('rejects with a typed AiError when the request fails', async () => {
    vi.spyOn(aiHttp, 'post').mockRejectedValue(new Error('boom'))
    await expect(improvePrompt(request)).rejects.toMatchObject({ name: 'AiError', code: 'upstream_error' })
  })
})
describe('runPrompt', () => {
  const runRequest = { prompt: 'Hello Maha', maxTokens: 512 }
  const okBody = { output: 'Hi!', model: 'gemini-test', latencyMs: 900, inputTokens: 3, outputTokens: 2 }

  it('returns the model answer on success', async () => {
    vi.spyOn(aiHttp, 'post').mockResolvedValue({ data: okBody } as AxiosResponse)
    await expect(runPrompt(runRequest)).resolves.toEqual(okBody)
  })

  it('rejects with invalid_response when the answer is missing', async () => {
    vi.spyOn(aiHttp, 'post').mockResolvedValue({ data: { model: 'x' } } as AxiosResponse)
    await expect(runPrompt(runRequest)).rejects.toMatchObject({ code: 'invalid_response' })
  })

  it('rejects with a typed AiError when the request fails', async () => {
    vi.spyOn(aiHttp, 'post').mockRejectedValue(new Error('boom'))
    await expect(runPrompt(runRequest)).rejects.toMatchObject({ name: 'AiError', code: 'upstream_error' })
  })
})
describe('generateVariations', () => {
  const variationsRequest = { prompt: 'Write about {{topic}}', task: 'writing', tone: 'friendly', length: 'medium' } as const

  it('returns the list of variations', async () => {
    vi.spyOn(aiHttp, 'post').mockResolvedValue({ data: { variations: ['A {{topic}}', 'B {{topic}}', 'C {{topic}}'] } } as AxiosResponse)
    const result = await generateVariations(variationsRequest)
    expect(result.variations).toHaveLength(3)
  })

  it('rejects when the list is empty', async () => {
    vi.spyOn(aiHttp, 'post').mockResolvedValue({ data: { variations: [] } } as AxiosResponse)
    await expect(generateVariations(variationsRequest)).rejects.toMatchObject({ code: 'invalid_response' })
  })

  it('uses a longer timeout than the other requests', async () => {
    const post = vi.spyOn(aiHttp, 'post').mockResolvedValue({ data: { variations: ['A'] } } as AxiosResponse)
    await generateVariations(variationsRequest)
    expect(post).toHaveBeenCalledWith('/variations', variationsRequest, { timeout: 55_000 })
  })
})