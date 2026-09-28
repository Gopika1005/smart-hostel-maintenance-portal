import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getComplaintsByStaff } from '../../utils/storage'
import { StatusBadge, PriorityBadge, CategoryBadge } from '../../components/StatusBadge'

const FILTERS = ['All', 'Assigned', 'In Progress', 'Work Completed', 'Closed']

export default function StaffDashboard() {
  const { user } = useAuth()
  const [filter, setFilter] = useState('All')
  const all = getComplaintsByStaff(user.id)
  const complaints = all.filter((c) => filter === 'All' || c.status === filter)

  const stats = [
    { label: 'Assigned to Me', value: all.length },
    { label: 'High Priority', value: all.filter((c) => c.priority === 'High').length },
    { label: 'In Progress', value: all.filter((c) => c.status === 'In Progress').length },
    { label: 'Completed', value: all.filter((c) => ['Work Completed', 'Closed'].includes(c.status)).length },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Welcome, {user.name.split(' ')[0]}</h1>
        <p className="text-slate-400 text-sm mt-1">Specialty: {user.specialty}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-4">
            <p className="text-2xl font-display font-bold text-white">{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${
              filter === f ? 'bg-royal-500/25 border-royal-400/50 text-white' : 'border-royal-500/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {complaints.map((c) => (
          <Link key={c.id} to={`/staff/complaint/${c.id}`} className="card p-4 flex items-center justify-between gap-3 flex-wrap hover:border-royal-400/40 transition-colors">
            <div className="flex items-center gap-3">
              <img src={c.beforePhoto} className="w-14 h-14 rounded-lg object-cover border border-royal-500/20" alt="" />
              <div>
                <p className="text-sm font-medium text-slate-100">{c.title}</p>
                <p className="text-xs text-slate-500">{c.id} • {c.studentName} • {c.hostel}, Room {c.room}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <CategoryBadge category={c.category} />
              <PriorityBadge priority={c.priority} />
              <StatusBadge status={c.status} />
            </div>
          </Link>
        ))}
        {complaints.length === 0 && <div className="card p-8 text-center text-slate-500 text-sm">No complaints assigned in this filter.</div>}
      </div>
    </div>
  )
}
