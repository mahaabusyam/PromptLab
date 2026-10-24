import type { Folder, Prompt } from '@/features/prompts/types'
import { collectFolderIds } from './filterPrompts'

export interface FolderNode {
  folder: Folder
  count: number
  children: FolderNode[]
}

export function buildFolderTree(folders: Folder[], prompts: Prompt[]): FolderNode[] {
  const active = prompts.filter((p) => !p.isArchived)

  const build = (parentId: string | null): FolderNode[] =>
    folders
      .filter((f) => f.parentId === parentId)
      .map((folder) => {
        // عدّاد المجلد الأب بيشمل Prompts المجلدات الفرعية
        const ids = collectFolderIds(folders, folder.id)
        return {
          folder,
          count: active.filter((p) => p.folderId !== null && ids.has(p.folderId)).length,
          children: build(folder.id),
        }
      })

  return build(null)
}