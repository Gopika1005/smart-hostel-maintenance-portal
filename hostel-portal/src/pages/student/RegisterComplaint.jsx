import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { addComplaint, nextComplaintId, addNotification, PLACEHOLDER_PHOTO } from '../../utils/storage'
import { classifyComplaint } from '../../utils/aiClassifier'
import { IconCamera, IconSparkle } from '../../components/Icons'

const CATEGORIES = ['Auto-detect', 'Electrical', 'Plumbing', 'Furniture', 'Other']

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function RegisterComplaint() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', description: '', hostel: user.hostel || 'Block A', room: user.room || '', category: 'Auto-detect',
  })
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState(null)
  const [prediction, setPrediction] = useState(null)
  const [submitted, setSubmitted] = useState(null)

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhoto(file)
    setPreview(URL.createObjectURL(file))
  }

  const handlePreviewAI = () => {
    if (!form.description.trim()) return
    setPrediction(classifyComplaint(form.description, form.category))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = classifyComplaint(form.description, form.category)
    const id = nextComplaintId()
    const beforePhoto = photo ? await fileToBase64(photo) : PLACEHOLDER_PHOTO

    const complaint = {
      id,
      studentId: user.id,
      studentName: user.name,
      title: form.title,
      description: form.description,
      hostel: form.hostel,
      room: form.room,
      category: result.category,
      priority: result.priority,
      status: 'Submitted',
      beforePhoto,
      afterPhoto: null,
      assignedStaff: null,
      assignedStaffName: null,
      remarks: '',
      createdAt: new Date().toISOString(),
      timeline: [{ status: 'Submitted', date: new Date().toISOString() }],
      feedback: null,
    }
    addComplaint(complaint)
    addNotification({ userId: user.id, message: `Complaint ${id} registered successfully.`, type: 'registered' })
    setSubmitted(complaint)
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto card p-8 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-2xl">✓</div>
        <h2 className="font-display text-xl font-bold text-white">Complaint Submitted!</h2>
        <p className="text-sm text-slate-400">Your complaint <span className="text-slate-200 font-medium">{submitted.id}</span> has been registered.</p>
        <div className="bg-navy-900/60 rounded-lg p-4 text-left text-sm space-y-1 border border-royal-500/10">
          <p><span className="text-slate-500">AI Predicted Category:</span> <span className="text-slate-200">{submitted.category}</span></p>
          <p><span className="text-slate-500">AI Predicted Priority:</span> <span className="text-slate-200">{submitted.priority}</span></p>
          <p><span className="text-slate-500">Status:</span> <span className="text-slate-200">{submitted.status}</span></p>
        </div>
        <div className="flex gap-3 justify-center">
          <button className="btn-secondary" onClick={() => { setSubmitted(null); setForm({ title: '', description: '', hostel: user.hostel, room: user.room, category: 'Auto-detect' }); setPhoto(null); setPreview(null); setPrediction(null) }}>Submit Another</button>
          <button className="btn-primary" onClick={() => navigate(`/student/track/${submitted.id}`)}>Track Complaint</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Register a Complaint</h1>
        <p className="text-slate-400 text-sm mt-1">Describe the issue in detail — our AI will help predict category and priority.</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Complaint Title</label>
          <input required className="input-field" value={form.title} onChange={update('title')} placeholder="e.g. Water leakage in bathroom" />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
          <textarea required rows={4} className="input-field" value={form.description} onChange={update('description')} placeholder="Describe the issue in detail..." />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Hostel / Block</label>
            <select className="input-field" value={form.hostel} onChange={update('hostel')}>
              <option>Block A</option><option>Block B</option><option>Block C</option><option>Block D</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Room Number</label>
            <input required className="input-field" value={form.room} onChange={update('room')} placeholder="e.g. A-204" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Category</label>
          <select className="input-field" value={form.category} onChange={update('category')}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Upload Before Photo</label>
          <label className="btn-secondary w-full flex items-center justify-center gap-2 cursor-pointer">
            <IconCamera /> {photo ? photo.name : 'Choose a photo'}
            <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </label>
          {preview && <img src={preview} alt="preview" className="mt-3 rounded-lg w-full h-40 object-cover border border-royal-500/20" />}
        </div>

        <button type="button" onClick={handlePreviewAI} className="flex items-center gap-1.5 text-xs text-accent-teal hover:text-teal-300">
          <IconSparkle /> Preview AI Prediction
        </button>

        {prediction && (
          <div className="bg-royal-500/10 border border-royal-400/30 rounded-lg p-3 text-xs text-slate-300 flex items-center gap-2">
            <IconSparkle /> <span><strong>AI-based Prediction:</strong> Category — {prediction.category}, Priority — {prediction.priority}</span>
          </div>
        )}

        <button type="submit" className="btn-primary w-full">Submit Complaint</button>
      </form>
    </div>
  )
}
