import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  getComplaintById, updateComplaint, pushTimeline, addNotification, getStaffUsers,
} from '../utils/storage'
import { StatusBadge, PriorityBadge, CategoryBadge } from '../components/StatusBadge'
import Timeline from '../components/Timeline'
import { IconCamera } from '../components/Icons'

const STATUS_FLOW = ['Submitted', 'Assigned', 'In Progress', 'Work Completed', 'Closed']

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function ComplaintDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [complaint, setComplaint] = useState(() => getComplaintById(id))
  const [remarks, setRemarks] = useState(complaint?.remarks || '')
  const staffList = getStaffUsers()

  if (!complaint) {
    return (
      <div className="card p-8 text-center text-slate-400">
        Complaint not found.
        <div className="mt-4"><Link to={`/${user.role}`} className="text-accent-teal">Back to dashboard</Link></div>
      </div>
    )
  }

  const refresh = () => setComplaint(getComplaintById(id))

  const backLink = user.role === 'student' ? '/student/track' : `/${user.role}`

  const nextStatus = () => {
    const idx = STATUS_FLOW.indexOf(complaint.status)
    return STATUS_FLOW[idx + 1]
  }

  const handleAdvanceStatus = () => {
    const ns = nextStatus()
    if (!ns) return
    pushTimeline(complaint.id, ns)
    updateComplaint(complaint.id, { remarks })
    addNotification({
      userId: complaint.studentId,
      message: `Your complaint ${complaint.id} status updated to "${ns}".`,
      type: ns === 'Work Completed' ? 'feedback' : 'in-progress',
    })
    if (ns === 'Work Completed') {
      addNotification({ userId: complaint.studentId, message: `Feedback requested for complaint ${complaint.id}.`, type: 'feedback' })
    }
    refresh()
  }

  const handleAssignStaff = (staffId) => {
    const staff = staffList.find((s) => s.id === staffId)
    updateComplaint(complaint.id, { assignedStaff: staffId, assignedStaffName: staff?.name || '' })
    if (complaint.status === 'Submitted') pushTimeline(complaint.id, 'Assigned')
    addNotification({ userId: complaint.studentId, message: `Complaint ${complaint.id} has been assigned to ${staff?.name}.`, type: 'assigned' })
    addNotification({ userId: staffId, message: `New complaint ${complaint.id} assigned to you (${complaint.priority} priority).`, type: 'assigned' })
    refresh()
  }

  const handleAfterPhoto = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const b64 = await fileToBase64(file)
    updateComplaint(complaint.id, { afterPhoto: b64 })
    refresh()
  }

  const handleSaveRemarks = () => {
    updateComplaint(complaint.id, { remarks })
    refresh()
  }

  const handleForceStatus = (status) => {
    pushTimeline(complaint.id, status)
    addNotification({ userId: complaint.studentId, message: `Your complaint ${complaint.id} status updated to "${status}".`, type: 'in-progress' })
    refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Link to={backLink} className="text-xs text-accent-teal hover:text-teal-300">&larr; Back</Link>
          <h1 className="font-display text-xl md:text-2xl font-bold text-white mt-1">{complaint.title}</h1>
          <p className="text-sm text-slate-400">{complaint.id} • {complaint.hostel}, Room {complaint.room}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <StatusBadge status={complaint.status} />
          <PriorityBadge priority={complaint.priority} />
          <CategoryBadge category={complaint.category} />
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-sm font-semibold text-slate-300 mb-4">Progress Timeline</h2>
        <Timeline timeline={complaint.timeline} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-5 space-y-3">
          <h2 className="text-sm font-semibold text-slate-300">Complaint Details</h2>
          <p className="text-sm text-slate-400 leading-relaxed">{complaint.description}</p>
          <div className="grid grid-cols-2 gap-3 text-xs pt-2">
            <div><p className="text-slate-500">Submitted by</p><p className="text-slate-200 font-medium">{complaint.studentName}</p></div>
            <div><p className="text-slate-500">Date</p><p className="text-slate-200 font-medium">{new Date(complaint.createdAt).toLocaleString()}</p></div>
            <div><p className="text-slate-500">Assigned Staff</p><p className="text-slate-200 font-medium">{complaint.assignedStaffName || 'Not yet assigned'}</p></div>
            <div><p className="text-slate-500">Category (AI Predicted)</p><p className="text-slate-200 font-medium">{complaint.category}</p></div>
          </div>
          {complaint.remarks && (
            <div className="pt-2">
              <p className="text-slate-500 text-xs">Staff Remarks</p>
              <p className="text-sm text-slate-300">{complaint.remarks}</p>
            </div>
          )}
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-semibold text-slate-300 mb-3">Before / After Photo Evidence</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-slate-500 mb-1.5">Before</p>
              <img src={complaint.beforePhoto} alt="before" className="rounded-lg border border-royal-500/20 w-full h-32 object-cover" />
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1.5">After</p>
              {complaint.afterPhoto ? (
                <img src={complaint.afterPhoto} alt="after" className="rounded-lg border border-royal-500/20 w-full h-32 object-cover" />
              ) : (
                <div className="rounded-lg border border-dashed border-royal-500/30 w-full h-32 flex items-center justify-center text-slate-500 text-xs">Pending</div>
              )}
            </div>
          </div>
          {user.role === 'staff' && complaint.assignedStaff === user.id && (
            <label className="btn-secondary w-full flex items-center justify-center gap-2 mt-4 cursor-pointer">
              <IconCamera /> Upload After Photo
              <input type="file" accept="image/*" className="hidden" onChange={handleAfterPhoto} />
            </label>
          )}
        </div>
      </div>

      {user.role === 'staff' && complaint.assignedStaff === user.id && (
        <div className="card p-5 space-y-3">
          <h2 className="text-sm font-semibold text-slate-300">Update Complaint (Staff Actions)</h2>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Add Remarks</label>
            <textarea className="input-field" rows={2} value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Describe work done or notes..." />
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={handleSaveRemarks}>Save Remarks</button>
            {nextStatus() && (
              <button className="btn-primary" onClick={handleAdvanceStatus}>
                Mark as "{nextStatus()}"
              </button>
            )}
            {!nextStatus() && <span className="text-xs text-emerald-400 self-center">Complaint closed.</span>}
          </div>
        </div>
      )}

      {(user.role === 'admin') && (
        <div className="card p-5 space-y-3">
          <h2 className="text-sm font-semibold text-slate-300">Admin Actions</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Assign Maintenance Staff</label>
              <select className="input-field" value={complaint.assignedStaff || ''} onChange={(e) => handleAssignStaff(e.target.value)}>
                <option value="">-- Select Staff --</option>
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.specialty})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Change Status</label>
              <select className="input-field" value={complaint.status} onChange={(e) => handleForceStatus(e.target.value)}>
                {STATUS_FLOW.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {complaint.feedback && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-slate-300 mb-2">Student Feedback</h2>
          <div className="flex items-center gap-1 text-accent-gold mb-1">
            {'★'.repeat(complaint.feedback.rating)}{'☆'.repeat(5 - complaint.feedback.rating)}
          </div>
          <p className="text-sm text-slate-400">{complaint.feedback.comment}</p>
        </div>
      )}
    </div>
  )
}
