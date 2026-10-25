import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useLenis } from '@/hooks/useLenis'
import { useApplyTheme } from '@/hooks/useApplyTheme';
import { useApplyLanguage } from '@/hooks/useApplyLanguage'

const queryClient = new QueryClient()

export function Providers({ children }: { children: ReactNode }) {
  useLenis()
  useApplyTheme()
  useApplyLanguage()
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}