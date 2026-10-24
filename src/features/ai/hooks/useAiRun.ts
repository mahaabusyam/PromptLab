import { useMutation } from '@tanstack/react-query'
import type { AiError } from '../errors'
import { runPrompt } from '../services/aiClient'
import type { RunRequest, RunResponse } from '../types'

export function useAiRun() {
  return useMutation<RunResponse, AiError, RunRequest>({
    mutationFn: runPrompt,
    retry: false,
  })
}