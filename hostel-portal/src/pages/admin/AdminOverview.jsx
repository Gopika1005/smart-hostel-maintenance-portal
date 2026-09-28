import { Link } from 'react-router-dom'
import { getComplaints, getStaffUsers } from '../../utils/storage'
import { StatusBadge, PriorityBadge } from '../../components/StatusBadge'

export default function AdminOverview() {
  const complaints = getComplaints()
  const staff = getStaffUsers()

  const total = complaints.length
  const pending = complaints.filter((c) => c.status === 'Submitted').length
  const high = complaints.filter((c) => c.priority === 'High').length
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length
  const completed = complaints.filter((c) => ['Work Completed', 'Closed'].includes(c.status)).length

  const cards = [
    { label: 'Total Complaints', value: total, color: 'from-royal-500 to-royal-400' },
    { label: 'Pending', value: pending, color: 'from-slate-500 to-slate-400' },
    { label: 'High Priority', value: high, color: 'from-rose-500 to-rose-400' },
    { label: 'In Progress', value: inProgress, color: 'from-amber-500 to-amber-400' },
    { label: 'Completed', value: completed, color: 'from-emerald-500 to-emerald-400' },
  ]

  const categories = ['Electrical', 'Plumbing', 'Furniture', 'Other']
  const categoryCounts = categories.map((cat) => ({
    cat,
    count: complaints.filter((c) => c.category === cat).length,
  }))
  const maxCount = Math.max(1, ...categoryCounts.map((c) => c.count))

  const recent = [...complaints].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Warden / Admin Overview</h1>
        <p className="text-slate-400 text-sm mt-1">Hostel-wide maintenance status at a glance</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="card p-4">
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${c.color} mb-3 opacity-80`} />
            <p className="text-2xl font-display font-bold text-white">{c.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="font-display font-semibold text-white mb-4">Complaints by Category</h2>
          <div className="space-y-3">
            {categoryCounts.map(({ cat, count }) => (
              <div key={cat}>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>{cat}</span><span>{count}</span>
                </div>
                <div className="h-2 bg-navy-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-royal-500 to-accent-teal rounded-full" style={{ width: `${(count / maxCount) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-display font-semibold text-white mb-4">Maintenance Staff</h2>
          <div className="space-y-2">
            {staff.map((s) => {
              const assigned = complaints.filter((c) => c.assignedStaff === s.id && !['Closed'].includes(c.status)).length
              return (
                <div key={s.id} className="flex items-center justify-between p-2.5 rounded-lg bg-navy-900/60">
                  <div>
                    <p className="text-sm text-slate-100">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.specialty}</p>
                  </div>
                  <span className="text-xs text-royal-300 font-medium">{assigned} active</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-white">Recent Complaints</h2>
          <Link to="/admin/complaints" className="text-xs text-accent-teal hover:text-teal-300">View all</Link>
        </div>
        <div className="space-y-3">
          {recent.map((c) => (
            <Link key={c.id} to={`/admin/complaint/${c.id}`} className="flex items-center justify-between p-3 rounded-lg bg-navy-900/60 hover:bg-navy-900 border border-royal-500/10 gap-3 flex-wrap">
              <div>
                <p className="text-sm font-medium text-slate-100">{c.title}</p>
                <p className="text-xs text-slate-500">{c.id} • {c.studentName} • {c.hostel}, {c.room}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <PriorityBadge priority={c.priority} />
                <StatusBadge status={c.status} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
