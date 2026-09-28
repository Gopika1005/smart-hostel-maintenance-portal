import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  IconDashboard, IconPlus, IconTrack, IconHistory, IconBell, IconStar, IconUser, IconLogout,
  IconUsers, IconChart, IconList, IconShield, IconWrench, IconClose,
} from './Icons'

const STUDENT_LINKS = [
  { to: '/student', label: 'Dashboard', icon: IconDashboard, end: true },
  { to: '/student/register-complaint', label: 'Register Complaint', icon: IconPlus },
  { to: '/student/track', label: 'Track Complaints', icon: IconTrack },
  { to: '/student/history', label: 'Complaint History', icon: IconHistory },
  { to: '/student/notifications', label: 'Notifications', icon: IconBell },
  { to: '/student/feedback', label: 'Feedback', icon: IconStar },
  { to: '/student/profile', label: 'Profile', icon: IconUser },
]

const STAFF_LINKS = [
  { to: '/staff', label: 'Assigned Complaints', icon: IconDashboard, end: true },
  { to: '/staff/notifications', label: 'Notifications', icon: IconBell },
  { to: '/staff/profile', label: 'Profile', icon: IconUser },
]

const ADMIN_LINKS = [
  { to: '/admin', label: 'Overview', icon: IconDashboard, end: true },
  { to: '/admin/complaints', label: 'All Complaints', icon: IconList },
  { to: '/admin/reports', label: 'Analytics & Reports', icon: IconChart },
  { to: '/admin/staff', label: 'Staff Directory', icon: IconUsers },
  { to: '/admin/notifications', label: 'Notifications', icon: IconBell },
  { to: '/admin/profile', label: 'Profile', icon: IconUser },
]

const ROLE_META = {
  student: { title: 'Student Portal', icon: IconUser, links: STUDENT_LINKS },
  staff: { title: 'Maintenance Staff', icon: IconWrench, links: STAFF_LINKS },
  admin: { title: 'Warden / Admin', icon: IconShield, links: ADMIN_LINKS },
}

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const meta = ROLE_META[user?.role] || ROLE_META.student
  const RoleIcon = meta.icon

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed md:sticky top-0 z-50 h-screen w-72 flex-shrink-0 bg-navy-900 border-r border-royal-500/10 flex flex-col transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-royal-500/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-royal-500 to-accent-teal flex items-center justify-center font-display font-bold text-navy-950">SH</div>
            <div>
              <p className="font-display font-semibold text-sm text-white leading-tight">Smart Hostel</p>
              <p className="text-[11px] text-slate-400">Maintenance Portal</p>
            </div>
          </div>
          <button className="md:hidden text-slate-400" onClick={onClose}><IconClose /></button>
        </div>

        <div className="px-5 py-4 flex items-center gap-2 text-royal-300 border-b border-royal-500/10">
          <RoleIcon />
          <span className="text-xs font-semibold uppercase tracking-wide">{meta.title}</span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {meta.links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-royal-500/20 text-white border border-royal-400/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-navy-800'
                }`
              }
            >
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-royal-500/10">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-9 h-9 rounded-full bg-royal-500/20 flex items-center justify-center text-royal-300 font-semibold text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-slate-100 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-secondary w-full flex items-center justify-center gap-2">
            <IconLogout /> Logout
          </button>
        </div>
      </aside>
    </>
  )
}
