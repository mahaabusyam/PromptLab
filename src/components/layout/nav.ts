import {
  LayoutDashboard, FolderOpen, SquareTerminal, LayoutGrid,
  History, Star, Settings, type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Prompt Library', to: '/library', icon: FolderOpen },
  { label: 'Prompt Editor', to: '/editor', icon: SquareTerminal },
  { label: 'Templates', to: '/templates', icon: LayoutGrid },
  { label: 'History', to: '/history', icon: History },
  { label: 'Favorites', to: '/favorites', icon: Star },
  { label: 'Settings', to: '/settings', icon: Settings },
]