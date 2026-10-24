import { useMutation } from '@tanstack/react-query'
import type { AiError } from '../errors'
import { improvePrompt } from '../services/aiClient'
import type { ImproveRequest, ImproveResponse } from '../types'

export function useImprovePrompt() {
  return useMutation<ImproveResponse, AiError, ImproveRequest>({
    mutationFn: improvePrompt,
    retry: false, // don't silently re-send (it costs quota)
  })
}