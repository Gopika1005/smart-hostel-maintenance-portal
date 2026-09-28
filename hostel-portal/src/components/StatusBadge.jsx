const STATUS_STYLES = {
  Submitted: 'bg-slate-500/20 text-slate-300 border border-slate-400/30',
  Assigned: 'bg-blue-500/20 text-blue-300 border border-blue-400/30',
  'In Progress': 'bg-amber-500/20 text-amber-300 border border-amber-400/30',
  'Work Completed': 'bg-teal-500/20 text-teal-300 border border-teal-400/30',
  Closed: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30',
}

const PRIORITY_STYLES = {
  High: 'bg-rose-500/20 text-rose-300 border border-rose-400/30',
  Medium: 'bg-amber-500/20 text-amber-300 border border-amber-400/30',
  Low: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30',
}

export function StatusBadge({ status }) {
  return <span className={`badge ${STATUS_STYLES[status] || STATUS_STYLES.Submitted}`}>{status}</span>
}

export function PriorityBadge({ priority }) {
  return <span className={`badge ${PRIORITY_STYLES[priority] || PRIORITY_STYLES.Low}`}>{priority} Priority</span>
}

export function CategoryBadge({ category }) {
  return (
    <span className="badge bg-royal-500/15 text-royal-300 border border-royal-400/30">{category}</span>
  )
}
