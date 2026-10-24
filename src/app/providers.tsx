import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useLenis } from '@/hooks/useLenis'
import { useApplyTheme } from '@/hooks/useApplyTheme';

const queryClient = new QueryClient()

export function Providers({ children }: { children: ReactNode }) {
  useLenis()
  useApplyTheme()
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}