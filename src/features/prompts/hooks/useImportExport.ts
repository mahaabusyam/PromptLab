import { useState } from 'react'
import { format } from 'date-fns'
import { usePromptStore } from '@/stores/promptStore'
import { buildExportFile, downloadJson, parseImportText } from '../services/importExport'

export interface TransferStatus {
  type: 'success' | 'error'
  message: string
}

export function useImportExport() {
  const prompts = usePromptStore((s) => s.prompts)
  const folders = usePromptStore((s) => s.folders)
  const importData = usePromptStore((s) => s.importData)
  const [status, setStatus] = useState<TransferStatus | null>(null)

  const exportAll = () => {
    const stamp = format(new Date(), 'yyyy-MM-dd')
    downloadJson(buildExportFile(prompts, folders), `promptlab-export-${stamp}.json`)
    setStatus({ type: 'success', message: `Exported ${prompts.length} prompts.` })
  }

  const importFile = async (file: File) => {
    const result = parseImportText(await file.text())
    if (!result.ok) {
      setStatus({ type: 'error', message: result.error })
      return
    }
    importData(result.data, 'merge') // دمج: ما بنمسح اللي موجود
    setStatus({ type: 'success', message: `Imported ${result.data.prompts.length} prompts.` })
  }

  return { status, clearStatus: () => setStatus(null), exportAll, importFile }
}