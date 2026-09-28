import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getComplaintsByStudent } from '../../utils/storage'
import { StatusBadge, CategoryBadge } from '../../components/StatusBadge'

export default function ComplaintHistory() {
  const { user } = useAuth()
  const complaints = getComplaintsByStudent(user.id).filter((c) => ['Work Completed', 'Closed'].includes(c.status))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Complaint History</h1>
        <p className="text-slate-400 text-sm mt-1">All resolved complaints and their outcomes</p>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b border-royal-500/10">
              <th className="px-4 py-3">Complaint</th>
              <th className="px-4 py-3 hidden sm:table-cell">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 hidden md:table-cell">Resolved On</th>
              <th className="px-4 py-3 hidden md:table-cell">Feedback</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c.id} className="border-b border-royal-500/5 hover:bg-navy-900/40">
                <td className="px-4 py-3">
                  <Link to={`/student/track/${c.id}`} className="text-slate-100 font-medium hover:text-accent-teal">{c.title}</Link>
                  <p className="text-xs text-slate-500">{c.id}</p>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell"><CategoryBadge category={c.category} /></td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3 hidden md:table-cell text-slate-400 text-xs">{new Date(c.timeline[c.timeline.length - 1].date).toLocaleDateString()}</td>
                <td className="px-4 py-3 hidden md:table-cell text-xs">
                  {c.feedback ? <span className="text-accent-gold">{'★'.repeat(c.feedback.rating)}</span> : <span className="text-slate-500">Not rated</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {complaints.length === 0 && <p className="text-center text-slate-500 text-sm py-8">No resolved complaints yet.</p>}
      </div>
    </div>
  )
}
