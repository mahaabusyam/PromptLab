export const aiTasks = ['general', 'marketing', 'coding', 'education', 'writing', 'analysis'] as const
export const aiTones = ['neutral', 'professional', 'friendly', 'creative'] as const
export const aiLengths = ['short', 'medium', 'long'] as const

export type AiTask = (typeof aiTasks)[number]
export type AiTone = (typeof aiTones)[number]
export type AiLength = (typeof aiLengths)[number]

/** Must match the limit enforced by api/improve.ts */
export const MAX_AI_PROMPT_CHARS = 8000

export interface ImproveRequest {
  prompt: string
  task: AiTask
  tone: AiTone
  length: AiLength
}

export interface ImproveResponse {
  improved: string
}

export interface RunRequest {
  prompt: string
  maxTokens: number
}

export interface RunResponse {
  output: string
  model: string
  latencyMs: number
  inputTokens?: number
  outputTokens?: number
}
export type AiOptions = Omit<ImproveRequest, 'prompt'>
export type VariationsRequest = ImproveRequest

export interface VariationsResponse {
  variations: string[]
}

export type AiErrorCode =
  | 'bad_request'
  | 'rate_limited'
  | 'unavailable'
  | 'upstream_error'
  | 'network'
  | 'timeout'
  | 'invalid_response'