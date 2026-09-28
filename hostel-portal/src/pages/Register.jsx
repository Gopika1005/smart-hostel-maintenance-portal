import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', hostel: 'Block A', room: '', phone: '' })
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) return setError('Passwords do not match.')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    try {
      register(form)
      navigate('/student')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-royal-500 to-accent-teal flex items-center justify-center font-display font-bold text-navy-950 text-xl shadow-glow">SH</div>
          <h1 className="font-display text-2xl font-bold text-white mt-4">Student Registration</h1>
          <p className="text-slate-400 text-sm mt-1">Create your account to register hostel maintenance complaints</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name</label>
            <input required className="input-field" value={form.name} onChange={update('name')} placeholder="Your full name" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
            <input required type="email" className="input-field" value={form.email} onChange={update('email')} placeholder="you@hostel.com" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Hostel / Block</label>
              <select className="input-field" value={form.hostel} onChange={update('hostel')}>
                <option>Block A</option>
                <option>Block B</option>
                <option>Block C</option>
                <option>Block D</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Room No.</label>
              <input required className="input-field" value={form.room} onChange={update('room')} placeholder="e.g. A-101" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Phone Number</label>
            <input required className="input-field" value={form.phone} onChange={update('phone')} placeholder="10-digit mobile number" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
              <input required type="password" className="input-field" value={form.password} onChange={update('password')} placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Confirm Password</label>
              <input required type="password" className="input-field" value={form.confirm} onChange={update('confirm')} placeholder="••••••••" />
            </div>
          </div>

          {error && <p className="text-rose-400 text-xs bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">{error}</p>}

          <button type="submit" className="btn-primary w-full">Create Account</button>
          <p className="text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-teal font-medium hover:text-teal-300">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
