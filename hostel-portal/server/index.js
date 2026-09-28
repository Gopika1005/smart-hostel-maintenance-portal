const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const PLACEHOLDER_IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260"><rect width="100%" height="100%" fill="%23101c44"/><text x="50%" y="50%" fill="%237b93ec" font-family="sans-serif" font-size="16" text-anchor="middle" dy=".3em">No Photo Uploaded</text></svg>`
  );

const users = [
  { id: 'u-student-1', name: 'Arjun Mehta', email: 'student@hostel.com', password: 'student123', role: 'student', hostel: 'Block A', room: 'A-204', phone: '9876543210' },
  { id: 'u-staff-1', name: 'Ramesh Kumar', email: 'staff@hostel.com', password: 'staff123', role: 'staff', specialty: 'Electrical, Plumbing', phone: '9123456780' },
  { id: 'u-admin-1', name: 'Dr. S. Nair', email: 'admin@hostel.com', password: 'admin123', role: 'admin', phone: '9988776655' },
  { id: 'u-staff-2', name: 'Vikram Singh', email: 'vikram.staff@hostel.com', password: 'staff123', role: 'staff', specialty: 'Furniture, Other', phone: '9012345678' },
];

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
];

const notifications = [
  { id: 'n1', userId: 'u-student-1', message: 'Your complaint CMP-1001 has been assigned to Ramesh Kumar.', type: 'assigned', date: new Date(Date.now() - 86400000 * 2.5).toISOString(), read: false },
  { id: 'n2', userId: 'u-student-1', message: 'Work started on your complaint CMP-1001.', type: 'in-progress', date: new Date(Date.now() - 86400000 * 1).toISOString(), read: false },
  { id: 'n3', userId: 'u-student-1', message: 'Complaint CMP-1002 marked as completed. Please share feedback.', type: 'feedback', date: new Date(Date.now() - 86400000 * 4).toISOString(), read: false },
  { id: 'n4', userId: 'u-student-1', message: 'Complaint CMP-1004 registered successfully.', type: 'registered', date: new Date(Date.now() - 3600000 * 5).toISOString(), read: true },
  { id: 'n5', userId: 'u-staff-1', message: 'New complaint CMP-1001 assigned to you (High priority).', type: 'assigned', date: new Date(Date.now() - 86400000 * 2.5).toISOString(), read: false },
];

const STATUS_FLOW = ['Submitted', 'Assigned', 'In Progress', 'Work Completed', 'Closed'];

function nextComplaintId() {
  const nums = complaints.map((c) => parseInt(c.id.replace('CMP-', ''), 10)).filter((n) => !Number.isNaN(n));
  const max = nums.length ? Math.max(...nums) : 1000;
  return `CMP-${max + 1}`;
}

function getStaffUsers() {
  return users.filter((u) => u.role === 'staff');
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Hostel portal API is running' });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body || {};

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password and role are required.' });
  }

  const found = users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
  if (!found) {
    return res.status(404).json({ message: 'No account found with this email.' });
  }

  if (found.password !== password) {
    return res.status(401).json({ message: 'Incorrect password.' });
  }

  if (found.role !== role) {
    return res.status(403).json({ message: `This account is not registered as ${role}.` });
  }

  const safeUser = { ...found };
  delete safeUser.password;
  return res.json({ user: safeUser });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, hostel, room, phone } = req.body || {};

  if (!name || !email || !password || !hostel || !room || !phone) {
    return res.status(400).json({ message: 'All student fields are required.' });
  }

  if (users.some((u) => u.email.toLowerCase() === String(email).toLowerCase())) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  const newUser = {
    id: `u-${Date.now()}`,
    name,
    email,
    password,
    role: 'student',
    hostel,
    room,
    phone,
  };

  users.push(newUser);
  const safeUser = { ...newUser };
  delete safeUser.password;
  return res.status(201).json({ user: safeUser });
});

app.get('/api/users/staff', (req, res) => {
  res.json(getStaffUsers());
});

app.get('/api/complaints', (req, res) => {
  res.json(complaints);
});

app.get('/api/complaints/:id', (req, res) => {
  const complaint = complaints.find((c) => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ message: 'Complaint not found.' });
  return res.json(complaint);
});

app.get('/api/complaints/student/:studentId', (req, res) => {
  const items = complaints.filter((c) => c.studentId === req.params.studentId);
  res.json(items);
});

app.post('/api/complaints', (req, res) => {
  const payload = req.body || {};

  const complaint = {
    id: payload.id || nextComplaintId(),
    studentId: payload.studentId,
    studentName: payload.studentName,
    title: payload.title,
    description: payload.description,
    hostel: payload.hostel,
    room: payload.room,
    category: payload.category,
    priority: payload.priority,
    status: payload.status || 'Submitted',
    beforePhoto: payload.beforePhoto || PLACEHOLDER_IMG,
    afterPhoto: payload.afterPhoto || null,
    assignedStaff: payload.assignedStaff || null,
    assignedStaffName: payload.assignedStaffName || null,
    remarks: payload.remarks || '',
    createdAt: payload.createdAt || new Date().toISOString(),
    timeline: payload.timeline || [{ status: 'Submitted', date: new Date().toISOString() }],
    feedback: payload.feedback || null,
  };

  complaints.unshift(complaint);
  return res.status(201).json(complaint);
});

app.patch('/api/complaints/:id', (req, res) => {
  const index = complaints.findIndex((c) => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Complaint not found.' });

  const updated = { ...complaints[index], ...req.body };
  complaints[index] = updated;
  return res.json(updated);
});

app.post('/api/notifications', (req, res) => {
  const { userId, message, type } = req.body || {};
  if (!userId || !message || !type) {
    return res.status(400).json({ message: 'userId, message, and type are required.' });
  }

  const item = {
    id: `n-${Date.now()}`,
    userId,
    message,
    type,
    date: new Date().toISOString(),
    read: false,
  };

  notifications.unshift(item);
  return res.status(201).json(item);
});

app.get('/api/notifications/:userId', (req, res) => {
  const items = notifications
    .filter((n) => n.userId === req.params.userId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(items);
});

app.patch('/api/notifications/:id/read', (req, res) => {
  const item = notifications.find((n) => n.id === req.params.id);
  if (!item) return res.status(404).json({ message: 'Notification not found.' });
  item.read = true;
  return res.json(item);
});

app.patch('/api/complaints/:id/status', (req, res) => {
  const complaint = complaints.find((c) => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ message: 'Complaint not found.' });

  const nextStatus = req.body.status;
  if (!nextStatus || !STATUS_FLOW.includes(nextStatus)) {
    return res.status(400).json({ message: 'Valid status is required.' });
  }

  complaint.status = nextStatus;
  complaint.timeline.push({ status: nextStatus, date: new Date().toISOString() });
  return res.json(complaint);
});

app.listen(PORT, () => {
  console.log(`Hostel Portal API running on http://localhost:${PORT}`);
});
