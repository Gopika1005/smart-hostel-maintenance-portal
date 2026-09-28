import { useAuth } from '../context/AuthContext'
import { getNotificationsForUser, markNotificationRead, markAllNotificationsRead } from '../utils/storage'
import { IconBell, IconPlus, IconUsers, IconWrench, IconStar } from './Icons'

const TYPE_ICON = {
  registered: IconPlus,
  assigned: IconUsers,
  'in-progress': IconWrench,
  feedback: IconStar,
  default: IconBell,
}

export default function NotificationList() {
  const { user } = useAuth()
  const notifications = getNotificationsForUser(user.id)

  const handleRead = (id) => {
    markNotificationRead(id)
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Notifications</h1>
          <p className="text-slate-400 text-sm mt-1">Updates about your complaints and activity</p>
        </div>
        {notifications.some((n) => !n.read) && (
          <button className="btn-secondary text-xs" onClick={() => { markAllNotificationsRead(user.id); window.location.reload() }}>
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map((n) => {
          const Icon = TYPE_ICON[n.type] || TYPE_ICON.default
          return (
            <div
              key={n.id}
              onClick={() => handleRead(n.id)}
              className={`card p-4 flex items-start gap-3 cursor-pointer transition-colors ${!n.read ? 'border-royal-400/40' : 'opacity-70'}`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${!n.read ? 'bg-royal-500/20 text-royal-300' : 'bg-navy-900 text-slate-500'}`}>
                <Icon />
              </div>
              <div className="flex-1">
                <p className={`text-sm ${!n.read ? 'text-slate-100 font-medium' : 'text-slate-400'}`}>{n.message}</p>
                <p className="text-xs text-slate-500 mt-1">{new Date(n.date).toLocaleString()}</p>
              </div>
              {!n.read && <span className="w-2 h-2 rounded-full bg-accent-teal mt-1.5 flex-shrink-0" />}
            </div>
          )
        })}
        {notifications.length === 0 && <div className="card p-8 text-center text-slate-500 text-sm">No notifications yet.</div>}
      </div>
    </div>
  )
}
