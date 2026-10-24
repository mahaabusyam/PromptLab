import type { AxiosResponse } from 'axios'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ImproveRequest } from '../types'
import { aiHttp, improvePrompt } from './aiClient'

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