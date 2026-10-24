import { Bell, ChevronDown, CircleHelp, Menu, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { IconButton } from '@/components/common/IconButton'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { CommandPalette } from '@/features/search/CommandPalette'

interface HeaderProps {
  sidebarOpen: boolean
  onMenuClick: () => void
}

const SHORTCUT_LABEL =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘K' : 'Ctrl K'

export function Header({ sidebarOpen, onMenuClick }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)

  // Global shortcut: Ctrl+K / ⌘K toggles the search palette from any page
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen((open) => !open)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between gap-space-sm bg-surface-dim/80 px-space-lg shadow-[0_1px_8px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-[left] duration-300 ${
          sidebarOpen ? 'lg:left-64' : ''
        }`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-space-sm">
          <IconButton
            aria-label="Open menu"
            onClick={onMenuClick}
            className={sidebarOpen ? 'lg:hidden' : ''}
          >
            <Menu className="size-5" />
          </IconButton>

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search prompts and templates"
            aria-keyshortcuts="Control+K Meta+K"
            className="relative flex w-full max-w-96 items-center rounded-lg bg-surface-container-lowest/80 py-2 pl-9 pr-16 text-left text-body-sm text-outline shadow-inner transition-colors hover:text-on-surface focus-visible:outline-2 focus-visible:outline-primary"
          >
            <Search
              className="pointer-events-none absolute left-space-sm top-1/2 size-5 -translate-y-1/2"
              aria-hidden="true"
            />
            <span className="truncate">Search prompts, templates...</span>
            <kbd className="pointer-events-none absolute right-space-xs top-1/2 -translate-y-1/2 rounded bg-surface-container px-1.5 py-0.5 font-code-md text-code-md text-on-surface-variant">
              {SHORTCUT_LABEL}
            </kbd>
          </button>
        </div>

        <div className="flex items-center gap-space-sm">
          <IconButton aria-label="Notifications">
            <Bell className="size-5" />
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-tertiary-container shadow-[0_0_8px_#f751a1]" />
          </IconButton>
          <ThemeToggle />
          <IconButton aria-label="Help">
            <CircleHelp className="size-5" />
          </IconButton>
          <div className="mx-space-xs hidden h-5 w-px bg-surface-variant sm:block" />
          <button type="button" className="group flex items-center gap-space-sm">
            <span className="grid size-8 place-items-center rounded-full bg-primary-container text-label-md text-on-primary-container">
              M
            </span>
            <span className="hidden flex-col text-left md:flex">
              <span className="text-body-sm font-semibold text-on-surface transition-colors group-hover:text-primary">
                Maha
              </span>
              <span className="text-label-sm text-outline">Lead Prompt Eng.</span>
            </span>
            <ChevronDown className="hidden size-[18px] text-outline sm:block" />
          </button>
        </div>
      </header>

      {/* Rendered only while open → fresh state (empty query) every time */}
      {searchOpen && <CommandPalette onClose={() => setSearchOpen(false)} />}
    </>
  )
}