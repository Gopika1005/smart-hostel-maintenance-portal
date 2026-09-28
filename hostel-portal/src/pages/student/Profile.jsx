import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getUsers, saveUsers, setSession } from '../../utils/storage'

export default function Profile() {
  const { user } = useAuth()
  const [form, setForm] = useState({ name: user.name, phone: user.phone || '', hostel: user.hostel, room: user.room })
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
        <p className="text-slate-400 text-sm mt-1">Manage your personal information</p>
      </div>

      <div className="card p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-royal-500/20 flex items-center justify-center text-royal-300 font-display font-bold text-2xl">
          {user.name[0].toUpperCase()}
        </div>
        <div>
          <p className="font-display font-semibold text-white">{user.name}</p>
          <p className="text-sm text-slate-400">{user.email}</p>
          <span className="badge bg-royal-500/15 text-royal-300 border border-royal-400/30 mt-1">Student</span>
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
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Hostel / Block</label>
            <select className="input-field" value={form.hostel} onChange={update('hostel')}>
              <option>Block A</option><option>Block B</option><option>Block C</option><option>Block D</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Room Number</label>
            <input className="input-field" value={form.room} onChange={update('room')} />
          </div>
        </div>
        <button className="btn-primary w-full" type="submit">Save Changes</button>
        {saved && <p className="text-emerald-400 text-xs text-center">Profile updated successfully.</p>}
      </form>
    </div>
  )
}
