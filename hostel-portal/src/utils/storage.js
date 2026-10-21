// Central data layer for the Smart Hostel Maintenance Portal
const KEYS = {
  USERS: 'shmp_users',
  COMPLAINTS: 'shmp_complaints',
  NOTIFICATIONS: 'shmp_notifications',
  SESSION: 'shmp_session',
  SEEDED: 'shmp_seeded_v1',
}
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

const nowISO = () => new Date().toISOString()

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const write = (key, value) => localStorage.setItem(key, JSON.stringify(value))

const PLACEHOLDER_IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260"><rect width="100%" height="100%" fill="%23101c44"/><text x="50%" y="50%" fill="%237b93ec" font-family="sans-serif" font-size="16" text-anchor="middle" dy=".3em">No Photo Uploaded</text></svg>`
  )

async function apiRequest(path, options = {}) {
  if (!API_BASE_URL) throw new Error('API is not configured')

  const response = await fetch(`${API_BASE_URL}/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.message || 'Request failed')
  return payload
}

function seedIfNeeded() {
  if (read(KEYS.SEEDED, false)) return

  const users = [
    { id: 'u-student-1', name: 'Arjun Mehta', email: 'student@hostel.com', password: 'student123', role: 'student', hostel: 'Block A', room: 'A-204', phone: '9876543210' },
    { id: 'u-staff-1', name: 'Ramesh Kumar', email: 'staff@hostel.com', password: 'staff123', role: 'staff', specialty: 'Electrical, Plumbing', phone: '9123456780' },
    { id: 'u-admin-1', name: 'Dr. S. Nair', email: 'admin@hostel.com', password: 'admin123', role: 'admin', phone: '9988776655' },
    { id: 'u-staff-2', name: 'Vikram Singh', email: 'vikram.staff@hostel.com', password: 'staff123', role: 'staff', specialty: 'Furniture, Other', phone: '9012345678' },
  ]

  const complaints = [
    {
      id: 'CMP-1001',
      studentId: 'u-student-1',
      studentName: 'Arjun Mehta',
      title: 'Water leakage from bathroom pipe',
      description: 'There is continuous water leakage from the bathroom pipe near the wash basin, floor is flooding.',
      hostel: 'Block A',
      room: 'A-204',
      category: 'Plumbing',
      priority: 'High',
      status: 'In Progress',
      beforePhoto: PLACEHOLDER_IMG,
      afterPhoto: null,
      assignedStaff: 'u-staff-1',
      assignedStaffName: 'Ramesh Kumar',
      remarks: 'Pipe joint identified, replacement part ordered.',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      timeline: [
        { status: 'Submitted', date: new Date(Date.now() - 86400000 * 3).toISOString() },
        { status: 'Assigned', date: new Date(Date.now() - 86400000 * 2.5).toISOString() },
        { status: 'In Progress', date: new Date(Date.now() - 86400000 * 1).toISOString() },
      ],
      feedback: null,
    },
    {
      id: 'CMP-1002',
      studentId: 'u-student-1',
      studentName: 'Arjun Mehta',
      title: 'Broken chair in room',
      description: 'The study chair leg is broken and it wobbles, unsafe to sit.',
      hostel: 'Block A',
      room: 'A-204',
      category: 'Furniture',
      priority: 'Low',
      status: 'Work Completed',
      beforePhoto: PLACEHOLDER_IMG,
      afterPhoto: PLACEHOLDER_IMG,
      assignedStaff: 'u-staff-2',
      assignedStaffName: 'Vikram Singh',
      remarks: 'Chair leg replaced and reinforced.',
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
      timeline: [
        { status: 'Submitted', date: new Date(Date.now() - 86400000 * 6).toISOString() },
        { status: 'Assigned', date: new Date(Date.now() - 86400000 * 5.5).toISOString() },
        { status: 'In Progress', date: new Date(Date.now() - 86400000 * 5).toISOString() },
        { status: 'Work Completed', date: new Date(Date.now() - 86400000 * 4).toISOString() },
      ],
      feedback: null,
    },
    {
      id: 'CMP-1003',
      studentId: 'u-student-1',
      studentName: 'Arjun Mehta',
      title: 'Switchboard sparking near bed',
      description: 'The switchboard near my bed is sparking and making noise, urgent electrical fault, fire risk.',
      hostel: 'Block A',
      room: 'A-204',
      category: 'Electrical',
      priority: 'High',
      status: 'Closed',
      beforePhoto: PLACEHOLDER_IMG,
      afterPhoto: PLACEHOLDER_IMG,
      assignedStaff: 'u-staff-1',
      assignedStaffName: 'Ramesh Kumar',
      remarks: 'Faulty switchboard replaced, wiring checked and secured.',
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      timeline: [
        { status: 'Submitted', date: new Date(Date.now() - 86400000 * 10).toISOString() },
        { status: 'Assigned', date: new Date(Date.now() - 86400000 * 9.7).toISOString() },
        { status: 'In Progress', date: new Date(Date.now() - 86400000 * 9).toISOString() },
        { status: 'Work Completed', date: new Date(Date.now() - 86400000 * 8).toISOString() },
        { status: 'Closed', date: new Date(Date.now() - 86400000 * 7).toISOString() },
      ],
      feedback: { rating: 5, comment: 'Fixed quickly, thank you!' },
    },
    {
      id: 'CMP-1004',
      studentId: 'u-student-1',
      studentName: 'Arjun Mehta',
      title: 'Wi-Fi router not working in common room',
      description: 'The common room internet router is not working since yesterday.',
      hostel: 'Block A',
      room: 'Common Room',
      category: 'Other',
      priority: 'Medium',
      status: 'Submitted',
      beforePhoto: PLACEHOLDER_IMG,
      afterPhoto: null,
      assignedStaff: null,
      assignedStaffName: null,
      remarks: '',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      timeline: [{ status: 'Submitted', date: new Date(Date.now() - 3600000 * 5).toISOString() }],
      feedback: null,
    },
  ]

  const notifications = [
    { id: 'n1', userId: 'u-student-1', message: 'Your complaint CMP-1001 has been assigned to Ramesh Kumar.', type: 'assigned', date: new Date(Date.now() - 86400000 * 2.5).toISOString(), read: false },
    { id: 'n2', userId: 'u-student-1', message: 'Work started on your complaint CMP-1001.', type: 'in-progress', date: new Date(Date.now() - 86400000 * 1).toISOString(), read: false },
    { id: 'n3', userId: 'u-student-1', message: 'Complaint CMP-1002 marked as completed. Please share feedback.', type: 'feedback', date: new Date(Date.now() - 86400000 * 4).toISOString(), read: false },
    { id: 'n4', userId: 'u-student-1', message: 'Complaint CMP-1004 registered successfully.', type: 'registered', date: new Date(Date.now() - 3600000 * 5).toISOString(), read: true },
    { id: 'n5', userId: 'u-staff-1', message: 'New complaint CMP-1001 assigned to you (High priority).', type: 'assigned', date: new Date(Date.now() - 86400000 * 2.5).toISOString(), read: false },
  ]

  write(KEYS.USERS, users)
  write(KEYS.COMPLAINTS, complaints)
  write(KEYS.NOTIFICATIONS, notifications)
  write(KEYS.SEEDED, true)
}

seedIfNeeded()

export const getUsers = () => read(KEYS.USERS, [])
export const saveUsers = (users) => write(KEYS.USERS, users)
export const getStaffUsers = () => {
  return getUsers().filter((u) => u.role === 'staff')
}

export const findUserByEmail = (email) => getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase())
export const registerStudent = ({ name, email, password, hostel, room, phone }) => {
  const users = getUsers()
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('An account with this email already exists.')
  }
  const newUser = { id: 'u-' + Date.now(), name, email, password, role: 'student', hostel, room, phone }
  users.push(newUser)
  saveUsers(users)
  return newUser
}

export const getSession = () => read(KEYS.SESSION, null)
export const setSession = (user) => write(KEYS.SESSION, user)
export const clearSession = () => localStorage.removeItem(KEYS.SESSION)

export const getComplaints = () => {
  return read(KEYS.COMPLAINTS, [])
}

export const saveComplaints = (list) => write(KEYS.COMPLAINTS, list)
export const getComplaintById = async (id) => {
  try {
    return await apiRequest(`/complaints/${id}`)
  } catch {
    return read(KEYS.COMPLAINTS, []).find((c) => c.id === id) || null
  }
}

export const getComplaintsByStudent = (studentId) => {
  return read(KEYS.COMPLAINTS, []).filter((c) => c.studentId === studentId)
}

export const getComplaintsByStaff = (staffId) => {
  return read(KEYS.COMPLAINTS, []).filter((c) => c.assignedStaff === staffId)
}

export const addComplaint = async (complaint) => {
  try {
    const data = await apiRequest('/complaints', {
      method: 'POST',
      body: JSON.stringify(complaint),
    })
    return data
  } catch {
    const list = read(KEYS.COMPLAINTS, [])
    list.unshift(complaint)
    saveComplaints(list)
    return complaint
  }
}

export const updateComplaint = async (id, updates) => {
  try {
    return await apiRequest(`/complaints/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  } catch {
    const list = read(KEYS.COMPLAINTS, [])
    const idx = list.findIndex((c) => c.id === id)
    if (idx === -1) return null
    list[idx] = { ...list[idx], ...updates }
    saveComplaints(list)
    return list[idx]
  }
}

export const pushTimeline = async (id, status) => {
  try {
    return await apiRequest(`/complaints/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  } catch {
    const list = read(KEYS.COMPLAINTS, [])
    const idx = list.findIndex((c) => c.id === id)
    if (idx === -1) return null
    list[idx].timeline.push({ status, date: nowISO() })
    list[idx].status = status
    saveComplaints(list)
    return list[idx]
  }
}

export const nextComplaintId = () => {
  const list = read(KEYS.COMPLAINTS, [])
  const nums = list.map((c) => parseInt(c.id.replace('CMP-', ''), 10)).filter((n) => !isNaN(n))
  const max = nums.length ? Math.max(...nums) : 1000
  return 'CMP-' + (max + 1)
}

export const getNotifications = () => read(KEYS.NOTIFICATIONS, [])
export const saveNotifications = (list) => write(KEYS.NOTIFICATIONS, list)
export const getNotificationsForUser = (userId) => {
  return read(KEYS.NOTIFICATIONS, [])
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

export const addNotification = async ({ userId, message, type }) => {
  try {
    return await apiRequest('/notifications', {
      method: 'POST',
      body: JSON.stringify({ userId, message, type }),
    })
  } catch {
    const list = read(KEYS.NOTIFICATIONS, [])
    list.unshift({ id: 'n-' + Date.now() + Math.random().toString(16).slice(2), userId, message, type, date: nowISO(), read: false })
    saveNotifications(list)
    return null
  }
}

export const markNotificationRead = async (id) => {
  try {
    return await apiRequest(`/notifications/${id}/read`, { method: 'PATCH' })
  } catch {
    const list = read(KEYS.NOTIFICATIONS, [])
    const idx = list.findIndex((n) => n.id === id)
    if (idx !== -1) {
      list[idx].read = true
      saveNotifications(list)
    }
    return null
  }
}

export const markAllNotificationsRead = async (userId) => {
  try {
    const list = await getNotificationsForUser(userId)
    for (const item of list) {
      if (!item.read) await markNotificationRead(item.id)
    }
    return
  } catch {
    const list = read(KEYS.NOTIFICATIONS, []).map((n) => (n.userId === userId ? { ...n, read: true } : n))
    saveNotifications(list)
  }
}

export const PLACEHOLDER_PHOTO = PLACEHOLDER_IMG
