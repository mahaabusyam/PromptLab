import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  Archive,
  ChevronRight,
  Folder as FolderIcon,
  FolderOpen,
  FolderPlus,
  Star,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { usePromptStore } from '@/stores/promptStore'
import { useLibraryStore } from '@/stores/libraryStore'
import { buildFolderTree } from '../folderTree'
import type { FolderNode } from '../folderTree'
import type { LibraryScope } from '../types'
import { StorageCard } from './StorageCard'

const rowActive = 'bg-secondary-container font-medium text-on-secondary-container shadow-md'
const rowIdle = 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'

function sameScope(a: LibraryScope, b: LibraryScope): boolean {
  if (a.kind !== 'folder' || b.kind !== 'folder') return a.kind === b.kind
  return a.folderId === b.folderId
}

interface ScopeRowProps {
  icon: LucideIcon
  label: string
  count: number
  active: boolean
  onClick: () => void
}

function ScopeRow({ icon: Icon, label, count, active, onClick }: ScopeRowProps) {
  return (
    <button
      type="button"
      aria-current={active ? 'true' : undefined}
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-start text-body-sm transition-colors ${active ? rowActive : rowIdle}`}
    >
      <span className="flex min-w-0 items-center gap-2">
        <Icon className={`size-[18px] shrink-0 ${active ? 'text-primary' : 'text-outline'}`} />
        <span className="truncate">{label}</span>
      </span>
      <span className="font-code-md text-label-sm">{count}</span>
    </button>
  )
}

interface FolderBranchProps {
  node: FolderNode
  scope: LibraryScope
  expanded: Set<string>
  onToggle: (id: string) => void
  onSelect: (id: string) => void
}

// المكوّن بيستدعي نفسه لعرض المجلدات الفرعية (Recursion)
function FolderBranch({ node, scope, expanded, onToggle, onSelect }: FolderBranchProps) {
  const { folder, count, children } = node
  const hasChildren = children.length > 0
  const isOpen = expanded.has(folder.id)
  const active = sameScope(scope, { kind: 'folder', folderId: folder.id })
  const Icon = hasChildren && isOpen ? FolderOpen : FolderIcon

  return (
    <div className="flex flex-col">
      <div className={`flex items-center rounded-xl transition-colors ${active ? rowActive : rowIdle}`}>
        {hasChildren ? (
          <button
            type="button"
            aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${folder.name}`}
            aria-expanded={isOpen}
            onClick={() => onToggle(folder.id)}
            className="grid size-7 shrink-0 place-items-center text-outline"
          >
            <ChevronRight className={`size-4 transition-[rotate] ${isOpen ? 'rotate-90' : ''}`} />
          </button>
        ) : (
          <span aria-hidden className="size-7 shrink-0" />
        )}
        <button
          type="button"
          aria-current={active ? 'true' : undefined}
          onClick={() => onSelect(folder.id)}
          className="flex min-w-0 flex-1 items-center justify-between gap-2 py-2 pe-2.5 text-start text-body-sm"
        >
          <span className="flex min-w-0 items-center gap-2">
            <Icon className={`size-[18px] shrink-0 ${active ? 'text-primary' : 'text-outline'}`} />
            <span className="truncate">{folder.name}</span>
          </span>
          <span className="font-code-md text-label-sm">{count}</span>
        </button>
      </div>

      {hasChildren && isOpen && (
        <div className="ms-4 mt-0.5 flex flex-col gap-0.5 border-s border-surface-variant ps-1.5">
          {children.map((child) => (
            <FolderBranch
              key={child.folder.id}
              node={child}
              scope={scope}
              expanded={expanded}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function FolderTree() {
  const prompts = usePromptStore((s) => s.prompts)
  const folders = usePromptStore((s) => s.folders)
  const addFolder = usePromptStore((s) => s.addFolder)
  const scope = useLibraryStore((s) => s.scope)
  const setScope = useLibraryStore((s) => s.setScope)

  // المجلدات الرئيسية اللي إلها أولاد بتبدأ مفتوحة
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(folders.filter((f) => f.parentId === null).map((f) => f.id)),
  )
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')

  const tree = useMemo(() => buildFolderTree(folders, prompts), [folders, prompts])
  const counts = useMemo(
    () => ({
      all: prompts.filter((p) => !p.isArchived).length,
      starred: prompts.filter((p) => !p.isArchived && p.isFavorite).length,
      archived: prompts.filter((p) => p.isArchived).length,
    }),
    [prompts],
  )

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev) // نسخة جديدة، ما منعدّل الـ state القديم مباشرة
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    addFolder(name)
    setName('')
    setCreating(false)
  }

  return (
    <aside
      data-reveal
      className="flex w-full shrink-0 flex-col gap-space-sm rounded-2xl bg-surface-container-low/95 p-space-sm shadow-lg lg:w-60"
    >
      <div className="flex items-center justify-between px-2 pt-1">
        <h2 className="text-label-sm font-semibold uppercase tracking-wider text-outline">
          Collections &amp; Folders
        </h2>
        <button
          type="button"
          aria-label="Create folder"
          title="New folder"
          onClick={() => setCreating(true)}
          className="rounded-lg p-1 text-outline transition-colors hover:bg-surface-container-high hover:text-on-surface"
        >
          <FolderPlus className="size-[18px]" />
        </button>
      </div>

      {creating && (
        <form onSubmit={submit} className="px-1">
          <input
            autoFocus
            value={name}
            maxLength={40}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => {
              setCreating(false)
              setName('')
            }}
            onKeyDown={(e) => e.key === 'Escape' && setCreating(false)}
            aria-label="New folder name"
            placeholder="Folder name, then Enter"
            className="w-full rounded-lg bg-surface-container-lowest px-2.5 py-1.5 text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </form>
      )}

      <nav aria-label="Folders" className="flex flex-col gap-0.5">
        <ScopeRow
          icon={FolderOpen}
          label="All Prompts"
          count={counts.all}
          active={scope.kind === 'all'}
          onClick={() => setScope({ kind: 'all' })}
        />
        {tree.map((node) => (
          <FolderBranch
            key={node.folder.id}
            node={node}
            scope={scope}
            expanded={expanded}
            onToggle={toggle}
            onSelect={(folderId) => setScope({ kind: 'folder', folderId })}
          />
        ))}
      </nav>

      <div className="flex flex-col gap-0.5 pt-space-xs">
        <ScopeRow
          icon={Star}
          label="Pinned & Starred"
          count={counts.starred}
          active={scope.kind === 'starred'}
          onClick={() => setScope({ kind: 'starred' })}
        />
        <ScopeRow
          icon={Archive}
          label="Archive"
          count={counts.archived}
          active={scope.kind === 'archive'}
          onClick={() => setScope({ kind: 'archive' })}
        />
      </div>

      <StorageCard used={prompts.length} />
    </aside>
  )
}