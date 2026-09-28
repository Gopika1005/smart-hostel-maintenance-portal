import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getUsers, saveUsers, setSession } from '../../utils/storage'

export default function StaffProfile() {
  const { user } = useAuth()
  const [form, setForm] = useState({ name: user.name, phone: user.phone || '', specialty: user.specialty || '' })
  const [saved, setSaved] = useState(false)

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSave = (e) => {
    e.preventDefault()
    const users = getUsers()
    const idx = users.findIndex((u) => u.id === user.id)
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...form }
      saveUsers(users)
      setSession(users[idx])
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">My Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your staff account details</p>
      </div>

      <div className="card p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-accent-teal/20 flex items-center justify-center text-accent-teal font-display font-bold text-2xl">
          {user.name[0].toUpperCase()}
        </div>
        <div>
          <p className="font-display font-semibold text-white">{user.name}</p>
          <p className="text-sm text-slate-400">{user.email}</p>
          <span className="badge bg-accent-teal/15 text-accent-teal border border-accent-teal/30 mt-1">Maintenance Staff</span>
        </div>
      </div>

      <form onSubmit={handleSave} className="card p-6 space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name</label>
          <input className="input-field" value={form.name} onChange={update('name')} />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Phone</label>
          <input className="input-field" value={form.phone} onChange={update('phone')} />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Specialty</label>
          <input className="input-field" value={form.specialty} onChange={update('specialty')} placeholder="e.g. Electrical, Plumbing" />
        </div>
        <button className="btn-primary w-full" type="submit">Save Changes</button>
        {saved && <p className="text-emerald-400 text-xs text-center">Profile updated successfully.</p>}
      </form>
    </div>
  )
}
