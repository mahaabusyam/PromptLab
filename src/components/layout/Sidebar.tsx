import { useLayoutEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { ChevronsUpDown, PanelLeft, Sparkles } from 'lucide-react'
import { gsap } from '@/utils/gsap'
import { IconButton } from '@/components/common/IconButton'
import { navItems } from './nav'
import { useSettingsStore } from '@/stores/settingsStore'
import { usePromptStore } from '@/stores/promptStore'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const ref = useRef<HTMLElement>(null)

  const workspaceName = useSettingsStore((s) => s.settings.workspaceName)
  const promptCount = usePromptStore((s) => s.prompts.length)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-nav-item]',
        { opacity: 0, x: -16 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power3.out',
        },
      )
    }, ref)

    return () => ctx.revert()
  }, [])

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        ref={ref}
        className={`fixed left-0 top-0 z-50 flex h-full w-64 flex-col justify-between bg-surface-container-lowest/90 shadow-[0_1px_8px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col">
          <div className="flex h-16 items-center justify-between px-space-md">
            <div className="flex items-center gap-space-sm">
              <span className="grid size-8 place-items-center rounded-lg bg-surface-container-high text-primary">
                <Sparkles className="size-4" />
              </span>

              <span className="font-headline-sm text-headline-sm tracking-tight">
                PromptLab
              </span>

              <span className="rounded-full bg-secondary-container px-space-xs py-0.5 text-label-sm font-semibold uppercase tracking-wider text-on-secondary-container">
                Pro
              </span>
            </div>

            <IconButton aria-label="Collapse sidebar" onClick={onClose}>
              <PanelLeft className="size-[18px]" />
            </IconButton>
          </div>

          <div className="px-space-md pt-space-xs">
            <span className="px-space-xs text-label-sm uppercase tracking-wider text-outline">
              Platform
            </span>
          </div>

          <nav
            className="mt-space-xs flex flex-col gap-1 px-space-md"
            aria-label="Main"
          >
            {navItems.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                data-nav-item
                className={({ isActive }) =>
                  `group flex items-center gap-space-sm rounded-xl px-space-sm py-2 transition-colors ${
                    isActive
                      ? 'bg-secondary-container font-semibold text-on-secondary-container shadow-[0_0_16px_rgba(87,27,193,0.35)]'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`
                }
              >
                <Icon className="size-5 transition-colors group-hover:text-primary" />
                <span className="text-body-md">{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-space-md">
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-xl bg-surface-container-low p-space-sm text-left shadow-[0_1px_4px_rgba(0,0,0,0.1)] transition-colors hover:bg-surface-container"
          >
            <span className="flex min-w-0 items-center gap-space-sm">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-surface-container-high font-headline-sm text-headline-sm text-primary">
                {workspaceName.charAt(0).toUpperCase()}
              </span>

              <span className="flex min-w-0 flex-col">
                <span className="truncate text-body-sm font-semibold">
                  {workspaceName}
                </span>

                <span className="truncate text-label-sm text-on-surface-variant">
                  {`${promptCount} prompts`}
                </span>
              </span>
            </span>

            <ChevronsUpDown className="size-[18px] text-outline" />
          </button>
        </div>
      </aside>
    </>
  )
}