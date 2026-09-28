import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getComplaintsByStudent, getNotificationsForUser } from '../../utils/storage'
import { StatusBadge, PriorityBadge } from '../../components/StatusBadge'
import { IconPlus, IconTrack, IconStar, IconBell } from '../../components/Icons'

export default function StudentDashboard() {
  const { user } = useAuth()
  const complaints = getComplaintsByStudent(user.id)
  const notifications = getNotificationsForUser(user.id)
  const unread = notifications.filter((n) => !n.read).length

  const stats = [
    { label: 'Total Complaints', value: complaints.length, color: 'from-royal-500 to-royal-400' },
    { label: 'Active', value: complaints.filter((c) => !['Closed'].includes(c.status)).length, color: 'from-amber-500 to-amber-400' },
    { label: 'Completed', value: complaints.filter((c) => ['Work Completed', 'Closed'].includes(c.status)).length, color: 'from-emerald-500 to-emerald-400' },
    { label: 'Unread Alerts', value: unread, color: 'from-accent-teal to-teal-400' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Welcome back, {user.name.split(' ')[0]}</h1>
        <p className="text-slate-400 text-sm mt-1">{user.hostel} • Room {user.room}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-4">
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${s.color} mb-3 opacity-80`} />
            <p className="text-2xl font-display font-bold text-white">{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Link to="/student/register-complaint" className="card p-5 hover:border-royal-400/50 transition-colors flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-royal-500/20 flex items-center justify-center text-royal-300"><IconPlus /></div>
          <div><p className="font-medium text-slate-100 text-sm">Register Complaint</p><p className="text-xs text-slate-500">Report a new issue</p></div>
        </Link>
        <Link to="/student/track" className="card p-5 hover:border-royal-400/50 transition-colors flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-teal/20 flex items-center justify-center text-accent-teal"><IconTrack /></div>
          <div><p className="font-medium text-slate-100 text-sm">Track Complaints</p><p className="text-xs text-slate-500">See live status</p></div>
        </Link>
        <Link to="/student/feedback" className="card p-5 hover:border-royal-400/50 transition-colors flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-gold/20 flex items-center justify-center text-accent-gold"><IconStar /></div>
          <div><p className="font-medium text-slate-100 text-sm">Give Feedback</p><p className="text-xs text-slate-500">Rate completed work</p></div>
        </Link>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-white">Recent Complaints</h2>
          <Link to="/student/track" className="text-xs text-accent-teal hover:text-teal-300">View all</Link>
        </div>
        <div className="space-y-3">
          {complaints.slice(0, 4).map((c) => (
            <Link key={c.id} to={`/student/track/${c.id}`} className="flex items-center justify-between p-3 rounded-lg bg-navy-900/60 hover:bg-navy-900 border border-royal-500/10 gap-3 flex-wrap">
              <div>
                <p className="text-sm font-medium text-slate-100">{c.title}</p>
                <p className="text-xs text-slate-500">{c.id} • {new Date(c.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <PriorityBadge priority={c.priority} />
                <StatusBadge status={c.status} />
              </div>
            </Link>
          ))}
          {complaints.length === 0 && <p className="text-sm text-slate-500 text-center py-6">No complaints yet. Register your first complaint!</p>}
        </div>
      </div>
    </div>
  )
}
