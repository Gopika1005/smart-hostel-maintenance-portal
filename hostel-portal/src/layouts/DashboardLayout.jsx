import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { IconMenu } from '../components/Icons'

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-royal-500/10 bg-navy-900 sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)} className="text-slate-200"><IconMenu /></button>
          <span className="font-display font-semibold text-white text-sm">Smart Hostel Portal</span>
          <span className="w-6" />
        </header>
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
