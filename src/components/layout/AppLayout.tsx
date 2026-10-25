import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(isDesktop)
  const { pathname } = useLocation()

    const [prevPathname, setPrevPathname] = useState(pathname)

  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    if (!isDesktop()) setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen text-on-surface">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={`transition-[padding] duration-300 ${sidebarOpen ? 'lg:ps-64' : ''}`}>
        <Header sidebarOpen={sidebarOpen} onMenuClick={() => setSidebarOpen(true)} />
        <main className="relative px-space-lg pt-16">
          {/* الوهج البنفسجي بالخلفية (من التصميم) */}
          <div className="pointer-events-none fixed end-0 top-0 -z-10 h-[350px] w-[500px] bg-secondary-container/15 blur-[120px]" />
          <div className="py-space-lg">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}