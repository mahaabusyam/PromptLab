import { VARIABLE_SOURCE } from './promptVariables'

/** ينضّف النص: {{ topic }} ← {{topic}}، يشيل المسافات آخر الأسطر، ويقلّل الأسطر الفاضية */
export function formatPrompt(text: string): string {
  return text
    .replace(new RegExp(VARIABLE_SOURCE, 'g'), (_match: string, name: string) => `{{${name}}}`)
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}