import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '@/stores/themeStore'
import { IconButton } from './IconButton'

export function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <IconButton aria-label="Toggle theme" onClick={() => setTheme(isDark ? 'light' : 'dark')}>
      {isDark ? <Moon className="size-5" /> : <Sun className="size-5" />}
    </IconButton>
  )
}