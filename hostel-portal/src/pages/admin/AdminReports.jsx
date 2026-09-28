import { getComplaints } from '../../utils/storage'

const COLORS = {
  Electrical: '#f0b429',
  Plumbing: '#3457d5',
  Furniture: '#2dd4bf',
  Other: '#94a3b8',
}

export default function AdminReports() {
  const complaints = getComplaints()
  const total = complaints.length || 1

  const categories = ['Electrical', 'Plumbing', 'Furniture', 'Other']
  const catData = categories.map((cat) => ({ cat, count: complaints.filter((c) => c.category === cat).length }))

  const statuses = ['Submitted', 'Assigned', 'In Progress', 'Work Completed', 'Closed']
  const statusData = statuses.map((s) => ({ status: s, count: complaints.filter((c) => c.status === s).length }))

  const avgResolutionDays = (() => {
    const closed = complaints.filter((c) => c.status === 'Closed')
    if (!closed.length) return '—'
    const total = closed.reduce((sum, c) => {
      const start = new Date(c.timeline[0].date)
      const end = new Date(c.timeline[c.timeline.length - 1].date)
      return sum + (end - start) / 86400000
    }, 0)
    return (total / closed.length).toFixed(1)
  })()

  const avgRating = (() => {
    const rated = complaints.filter((c) => c.feedback)
    if (!rated.length) return '—'
    return (rated.reduce((sum, c) => sum + c.feedback.rating, 0) / rated.length).toFixed(1)
  })()

  // donut chart calculation
  let cumulative = 0
  const donutSegments = catData.map(({ cat, count }) => {
    const pct = (count / total) * 100
    const seg = { cat, pct, offset: cumulative }
    cumulative += pct
    return seg
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Maintenance Analytics & Reports</h1>
        <p className="text-slate-400 text-sm mt-1">Insights into complaint trends and resolution performance</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4"><p className="text-2xl font-display font-bold text-white">{complaints.length}</p><p className="text-xs text-slate-400 mt-0.5">Total Complaints</p></div>
        <div className="card p-4"><p className="text-2xl font-display font-bold text-white">{avgResolutionDays}</p><p className="text-xs text-slate-400 mt-0.5">Avg. Resolution (days)</p></div>
        <div className="card p-4"><p className="text-2xl font-display font-bold text-white">{avgRating} <span className="text-accent-gold text-base">★</span></p><p className="text-xs text-slate-400 mt-0.5">Avg. Feedback Rating</p></div>
        <div className="card p-4"><p className="text-2xl font-display font-bold text-white">{complaints.filter((c) => c.status === 'Closed').length}</p><p className="text-xs text-slate-400 mt-0.5">Fully Resolved</p></div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6 flex flex-col items-center">
          <h2 className="font-display font-semibold text-white mb-4 self-start">Category Distribution</h2>
          <svg viewBox="0 0 42 42" className="w-44 h-44">
            <circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#101c44" strokeWidth="6" />
            {donutSegments.map(({ cat, pct, offset }) => (
              <circle
                key={cat}
                cx="21" cy="21" r="15.9" fill="transparent"
                stroke={COLORS[cat]} strokeWidth="6"
                strokeDasharray={`${pct} ${100 - pct}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 21 21)"
              />
            ))}
          </svg>
          <div className="grid grid-cols-2 gap-2 mt-4 w-full">
            {catData.map(({ cat, count }) => (
              <div key={cat} className="flex items-center gap-2 text-xs text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[cat] }} />
                {cat} — {count}
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-display font-semibold text-white mb-4">Status Breakdown</h2>
          <div className="space-y-3">
            {statusData.map(({ status, count }) => (
              <div key={status}>
                <div className="flex justify-between text-xs text-slate-400 mb-1"><span>{status}</span><span>{count}</span></div>
                <div className="h-2.5 bg-navy-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-royal-500 to-accent-teal rounded-full" style={{ width: `${(count / total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
