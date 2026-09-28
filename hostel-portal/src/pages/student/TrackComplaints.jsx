import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getComplaintsByStudent } from '../../utils/storage'
import { StatusBadge, PriorityBadge, CategoryBadge } from '../../components/StatusBadge'

const FILTERS = ['All', 'Submitted', 'Assigned', 'In Progress', 'Work Completed', 'Closed']

export default function TrackComplaints() {
  const { user } = useAuth()
  const [filter, setFilter] = useState('All')
  const complaints = getComplaintsByStudent(user.id).filter((c) => filter === 'All' || c.status === filter)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Track Complaints</h1>
        <p className="text-slate-400 text-sm mt-1">Live status of all your registered complaints</p>
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
          <Link key={c.id} to={`/student/track/${c.id}`} className="card p-4 flex items-center justify-between gap-3 flex-wrap hover:border-royal-400/40 transition-colors">
            <div className="flex items-center gap-3">
              <img src={c.beforePhoto} className="w-14 h-14 rounded-lg object-cover border border-royal-500/20" alt="" />
              <div>
                <p className="text-sm font-medium text-slate-100">{c.title}</p>
                <p className="text-xs text-slate-500">{c.id} • {c.hostel}, {c.room} • {new Date(c.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <CategoryBadge category={c.category} />
              <PriorityBadge priority={c.priority} />
              <StatusBadge status={c.status} />
            </div>
          </Link>
        ))}
        {complaints.length === 0 && <div className="card p-8 text-center text-slate-500 text-sm">No complaints match this filter.</div>}
      </div>
    </div>
  )
}
