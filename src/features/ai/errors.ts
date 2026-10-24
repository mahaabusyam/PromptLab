import { isAxiosError } from 'axios'
import { errorBodySchema } from './schemas'
import type { AiErrorCode } from './types'

export class AiError extends Error {
  readonly code: AiErrorCode
  readonly retryAfterSeconds?: number

  constructor(code: AiErrorCode, message: string, retryAfterSeconds?: number) {
    super(message)
    this.name = 'AiError'
    this.code = code
    this.retryAfterSeconds = retryAfterSeconds
  }
}

function readRetryAfter(value: unknown): number | undefined {
  const seconds = Number.parseInt(String(value ?? ''), 10)
  return Number.isFinite(seconds) && seconds > 0 ? seconds : undefined
}

function codeFromStatus(status: number): AiErrorCode {
  if (status === 429) return 'rate_limited'
  if (status === 400 || status === 422) return 'bad_request'
  if (status === 404 || status === 503) return 'unavailable'
  return 'upstream_error'
}

/** Turns anything thrown by the request into one predictable error type. */
export function toAiError(error: unknown): AiError {
  if (error instanceof AiError) return error

  if (isAxiosError(error)) {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return new AiError('timeout', 'The request took too long.')
    }
    if (!error.response) {
      return new AiError('network', 'Could not reach the AI service.')
    }

    const { status, data, headers } = error.response
    const body = errorBodySchema.safeParse(data)
    const message = body.success ? body.data.error.message : `Request failed (${status}).`
    return new AiError(codeFromStatus(status), message, readRetryAfter(headers['retry-after']))
  }

  return new AiError('upstream_error', 'Something went wrong.')
}

/** Friendly text for the UI (the app is English). */
export function getAiErrorMessage(error: AiError): string {
  switch (error.code) {
    case 'rate_limited':
      return error.retryAfterSeconds
        ? `Too many requests. Try again in ${error.retryAfterSeconds} seconds.`
        : 'Too many requests. Please wait a moment and try again.'
    case 'bad_request':
      return 'This prompt can’t be sent. Make sure it isn’t empty and is under 8,000 characters.'
    case 'unavailable':
      return 'AI features aren’t available right now. Your prompts still work offline.'
    case 'timeout':
      return 'The AI took too long to answer. Please try again.'
    case 'network':
      return 'Can’t reach the AI service. Check your connection.'
    case 'invalid_response':
      return 'The AI service sent an unexpected answer. Please try again.'
    case 'upstream_error':
      return 'The AI provider had a problem. Please try again shortly.'
  }
}