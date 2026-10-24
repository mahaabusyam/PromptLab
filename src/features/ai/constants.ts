import type { AiLength, AiTask, AiTone } from './types'

export const taskLabels: Record<AiTask, string> = {
  general: 'General',
  marketing: 'Marketing',
  coding: 'Coding',
  education: 'Education',
  writing: 'Writing',
  analysis: 'Data analysis',
}

export const toneLabels: Record<AiTone, string> = {
  neutral: 'Neutral',
  professional: 'Professional',
  friendly: 'Friendly',
  creative: 'Creative',
}

export const lengthLabels: Record<AiLength, string> = {
  short: 'Short',
  medium: 'Medium',
  long: 'Detailed',
}