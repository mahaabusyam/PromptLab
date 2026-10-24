import type { PromptVersion } from '@/features/prompts/types'
import type { SaveVersionValues } from './schemas'

export type VersionBump = SaveVersionValues['bump']

/** v1.4 + minor → v1.5، و v1.4 + major → v2.0 */
export function nextVersionLabel(versions: Pick<PromptVersion, 'label'>[], bump: VersionBump): string {
  const last = versions[versions.length - 1]?.label
  const match = last ? /^v(\d+)\.(\d+)$/.exec(last) : null
  if (!match) return `v${versions.length + 1}.0` // تسمية غير معتادة؟ نكمّل بترقيم بسيط
  const major = Number(match[1])
  const minor = Number(match[2])
  return bump === 'major' ? `v${major + 1}.0` : `v${major}.${minor + 1}`
}