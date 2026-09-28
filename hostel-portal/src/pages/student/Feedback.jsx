import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getComplaintsByStudent, updateComplaint } from '../../utils/storage'
import { IconStar } from '../../components/Icons'

export default function Feedback() {
  const { user } = useAuth()
  const [refreshKey, setRefreshKey] = useState(0)
  const complaints = getComplaintsByStudent(user.id).filter((c) => c.status === 'Work Completed' && !c.feedback)
  const rated = getComplaintsByStudent(user.id).filter((c) => c.feedback)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Feedback</h1>
        <p className="text-slate-400 text-sm mt-1">Rate the maintenance work completed for your complaints</p>
      </div>

      <div className="space-y-4" key={refreshKey}>
        {complaints.map((c) => (
          <FeedbackCard key={c.id} complaint={c} onDone={() => setRefreshKey((k) => k + 1)} />
        ))}
        {complaints.length === 0 && (
          <div className="card p-6 text-center text-slate-500 text-sm">No pending feedback. All completed complaints have been rated, or none are complete yet.</div>
        )}
      </div>

      {rated.length > 0 && (
        <div>
          <h2 className="font-display font-semibold text-white mb-3">Your Past Feedback</h2>
          <div className="space-y-2">
            {rated.map((c) => (
              <div key={c.id} className="card p-4 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-sm text-slate-100">{c.title}</p>
                  <p className="text-xs text-slate-500">{c.id}</p>
                </div>
                <div className="text-accent-gold text-sm">{'★'.repeat(c.feedback.rating)}{'☆'.repeat(5 - c.feedback.rating)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function FeedbackCard({ complaint, onDone }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [hover, setHover] = useState(0)

  const submit = () => {
    if (rating === 0) return
    updateComplaint(complaint.id, { feedback: { rating, comment } })
    onDone()
  }

  return (
    <div className="card p-5">
      <p className="text-sm font-medium text-slate-100">{complaint.title}</p>
      <p className="text-xs text-slate-500 mb-3">{complaint.id} • Completed by {complaint.assignedStaffName}</p>
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)} onClick={() => setRating(star)} className={`${(hover || rating) >= star ? 'text-accent-gold' : 'text-slate-600'}`}>
            <IconStar />
          </button>
        ))}
      </div>
      <textarea className="input-field mb-3" rows={2} placeholder="Add a comment (optional)" value={comment} onChange={(e) => setComment(e.target.value)} />
      <button className="btn-primary" disabled={rating === 0} onClick={submit}>Submit Feedback</button>
    </div>
  )
}
