import { lazy, Suspense } from 'react'
import type { ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import NotFoundPage from '@/pages/NotFoundPage'
import RouteErrorPage from '@/pages/RouteErrorPage'

const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const LibraryPage = lazy(() => import('@/pages/LibraryPage'))
const SettingsPage = lazy(() => import('@/pages/SettingsPage'))
const EditorPage = lazy(() => import('@/pages/EditorPage'))
const TemplatesPage = lazy(() => import('@/pages/TemplatesPage'))
const ComparePage = lazy(() => import('@/pages/ComparePage'))
const HistoryPage = lazy(() => import('@/pages/HistoryPage'))
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'))

function PageLoader() {
  return (
    <div className="flex min-h-64 items-center justify-center">
      <div
        className="size-8 animate-spin rounded-full border-2 border-current border-t-transparent"
        role="status"
        aria-label="Loading page"
      />
    </div>
  )
}

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        errorElement: <RouteErrorPage />,
        children: [
          { index: true, element: withSuspense(<DashboardPage />) },
          { path: 'library', element: withSuspense(<LibraryPage />) },
          { path: 'editor', element: withSuspense(<EditorPage />) },
          { path: 'editor/:promptId', element: withSuspense(<EditorPage />) },
          { path: 'templates', element: withSuspense(<TemplatesPage />) },
          { path: 'compare', element: withSuspense(<ComparePage />) },
          { path: 'history', element: withSuspense(<HistoryPage />) },
          { path: 'favorites', element: withSuspense(<FavoritesPage />) },
          { path: 'settings', element: withSuspense(<SettingsPage />) },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])