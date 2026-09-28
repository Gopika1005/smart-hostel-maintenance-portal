import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IconShield, IconUser, IconWrench, IconSparkle } from '../components/Icons'

const ROLES = [
  { id: 'student', label: 'Student', icon: IconUser },
  { id: 'staff', label: 'Maintenance Staff', icon: IconWrench },
  { id: 'admin', label: 'Warden / Admin', icon: IconShield },
]

const DEMO = {
  student: { email: 'student@hostel.com', password: 'student123' },
  staff: { email: 'staff@hostel.com', password: 'staff123' },
  admin: { email: 'admin@hostel.com', password: 'admin123' },
}

export default function Login() {
  const [role, setRole] = useState('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showForgot, setShowForgot] = useState(false)
  const [forgotSent, setForgotSent] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const user = await login(email, password, role)
      navigate(`/${user.role}`)
    } catch (err) {
      setError(err.message)
    }
  }

  const fillDemo = () => {
    setEmail(DEMO[role].email)
    setPassword(DEMO[role].password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 px-4 py-10 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-royal-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent-teal/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-royal-500 to-accent-teal flex items-center justify-center font-display font-bold text-navy-950 text-xl shadow-glow">SH</div>
          <h1 className="font-display text-2xl font-bold text-white mt-4">Smart Hostel Maintenance</h1>
          <p className="text-slate-400 text-sm mt-1">AI-assisted complaint tracking for hostel facilities</p>
        </div>

        <div className="card p-6 md:p-8">
          <div className="grid grid-cols-3 gap-2 mb-6">
            {ROLES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setRole(id)}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-colors ${
                  role === id
                    ? 'bg-royal-500/20 border-royal-400/50 text-white'
                    : 'bg-navy-900/50 border-royal-500/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon />
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Email / Username</label>
              <input type="text" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="you@hostel.com" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="••••••••" />
            </div>

            {error && <p className="text-rose-400 text-xs bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">{error}</p>}

            <div className="flex items-center justify-between text-xs">
              <button type="button" onClick={fillDemo} className="flex items-center gap-1 text-accent-teal hover:text-teal-300">
                <IconSparkle /> Autofill demo login
              </button>
              <button type="button" onClick={() => setShowForgot(true)} className="text-slate-400 hover:text-slate-200">
                Forgot password?
              </button>
            </div>

            <button type="submit" className="btn-primary w-full">Login</button>
          </form>

          {role === 'student' && (
            <p className="text-center text-xs text-slate-400 mt-5">
              New student?{' '}
              <Link to="/register" className="text-accent-teal font-medium hover:text-teal-300">Register here</Link>
            </p>
          )}

          <div className="mt-6 pt-5 border-t border-royal-500/10 text-[11px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-400">Demo accounts:</p>
            <p>Student — student@hostel.com / student123</p>
            <p>Staff — staff@hostel.com / staff123</p>
            <p>Admin — admin@hostel.com / admin123</p>
          </div>
        </div>
      </div>

      {showForgot && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={() => setShowForgot(false)}>
          <div className="card p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            {!forgotSent ? (
              <>
                <h3 className="font-display font-semibold text-white mb-2">Reset your password</h3>
                <p className="text-sm text-slate-400 mb-4">Enter your registered email and we'll send a reset link.</p>
                <input type="email" className="input-field mb-4" placeholder="you@hostel.com" />
                <div className="flex gap-2">
                  <button className="btn-secondary flex-1" onClick={() => setShowForgot(false)}>Cancel</button>
                  <button className="btn-primary flex-1" onClick={() => setForgotSent(true)}>Send Link</button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-display font-semibold text-white mb-2">Check your email</h3>
                <p className="text-sm text-slate-400 mb-4">If an account exists, a password reset link has been sent. (Demo simulation — no email is actually sent.)</p>
                <button className="btn-primary w-full" onClick={() => { setShowForgot(false); setForgotSent(false) }}>Close</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
