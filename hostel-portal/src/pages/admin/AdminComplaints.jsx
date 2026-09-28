import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getComplaints, getStaffUsers, updateComplaint, pushTimeline, addNotification } from '../../utils/storage'
import { StatusBadge, PriorityBadge, CategoryBadge } from '../../components/StatusBadge'

const STATUS_FILTERS = ['All', 'Submitted', 'Assigned', 'In Progress', 'Work Completed', 'Closed']

export default function AdminComplaints() {
  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [tick, setTick] = useState(0)
  const staffList = getStaffUsers()

  const complaints = getComplaints()
    .filter((c) => statusFilter === 'All' || c.status === statusFilter)
    .filter((c) => {
      const q = search.toLowerCase()
      return !q || c.title.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.studentName.toLowerCase().includes(q)
    })

  const quickAssign = (complaint, staffId) => {
    const staff = staffList.find((s) => s.id === staffId)
    updateComplaint(complaint.id, { assignedStaff: staffId, assignedStaffName: staff?.name || '' })
    if (complaint.status === 'Submitted') pushTimeline(complaint.id, 'Assigned')
    addNotification({ userId: complaint.studentId, message: `Complaint ${complaint.id} has been assigned to ${staff?.name}.`, type: 'assigned' })
    addNotification({ userId: staffId, message: `New complaint ${complaint.id} assigned to you (${complaint.priority} priority).`, type: 'assigned' })
    setTick((t) => t + 1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">All Complaints</h1>
        <p className="text-slate-400 text-sm mt-1">Manage, assign, and monitor every complaint hostel-wide</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input className="input-field sm:max-w-xs" placeholder="Search by title, ID, or student..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="flex gap-2 overflow-x-auto pb-1">
          {STATUS_FILTERS.map((f) => (
            <button key={f} onClick={() => setStatusFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${statusFilter === f ? 'bg-royal-500/25 border-royal-400/50 text-white' : 'border-royal-500/10 text-slate-400 hover:text-slate-200'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3" key={tick}>
        {complaints.map((c) => (
          <div key={c.id} className="card p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <Link to={`/admin/complaint/${c.id}`} className="flex items-center gap-3 min-w-0 flex-1">
              <img src={c.beforePhoto} className="w-14 h-14 rounded-lg object-cover border border-royal-500/20 flex-shrink-0" alt="" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-100 truncate">{c.title}</p>
                <p className="text-xs text-slate-500 truncate">{c.id} • {c.studentName} • {c.hostel}, {c.room}</p>
              </div>
            </Link>
            <div className="flex gap-2 flex-wrap items-center">
              <CategoryBadge category={c.category} />
              <PriorityBadge priority={c.priority} />
              <StatusBadge status={c.status} />
              <select
                className="input-field !py-1.5 !text-xs w-40"
                value={c.assignedStaff || ''}
                onChange={(e) => quickAssign(c, e.target.value)}
              >
                <option value="">Assign staff...</option>
                {staffList.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
        ))}
        {complaints.length === 0 && <div className="card p-8 text-center text-slate-500 text-sm">No complaints match your search/filter.</div>}
      </div>
    </div>
  )
}
