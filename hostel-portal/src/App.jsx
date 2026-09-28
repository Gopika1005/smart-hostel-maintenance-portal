import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import DashboardLayout from './layouts/DashboardLayout'
import ComplaintDetails from './pages/ComplaintDetails'

import StudentDashboard from './pages/student/StudentDashboard'
import RegisterComplaint from './pages/student/RegisterComplaint'
import TrackComplaints from './pages/student/TrackComplaints'
import ComplaintHistory from './pages/student/ComplaintHistory'
import StudentNotifications from './pages/student/Notifications'
import Feedback from './pages/student/Feedback'
import Profile from './pages/student/Profile'

import StaffDashboard from './pages/staff/StaffDashboard'
import StaffNotifications from './pages/staff/StaffNotifications'
import StaffProfile from './pages/staff/StaffProfile'

import AdminOverview from './pages/admin/AdminOverview'
import AdminComplaints from './pages/admin/AdminComplaints'
import AdminReports from './pages/admin/AdminReports'
import AdminStaff from './pages/admin/AdminStaff'
import AdminNotifications from './pages/admin/AdminNotifications'
import AdminProfile from './pages/admin/AdminProfile'

function ProtectedRoute({ role, children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to={`/${user.role}`} replace />
  return children
}

export default function App() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? `/${user.role}` : '/login'} replace />} />
      <Route path="/login" element={user ? <Navigate to={`/${user.role}`} replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={`/${user.role}`} replace /> : <Register />} />

      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="register-complaint" element={<RegisterComplaint />} />
        <Route path="track" element={<TrackComplaints />} />
        <Route path="track/:id" element={<ComplaintDetails />} />
        <Route path="history" element={<ComplaintHistory />} />
        <Route path="notifications" element={<StudentNotifications />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route
        path="/staff"
        element={
          <ProtectedRoute role="staff">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StaffDashboard />} />
        <Route path="complaint/:id" element={<ComplaintDetails />} />
        <Route path="notifications" element={<StaffNotifications />} />
        <Route path="profile" element={<StaffProfile />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="complaints" element={<AdminComplaints />} />
        <Route path="complaint/:id" element={<ComplaintDetails />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="staff" element={<AdminStaff />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      <Route path="*" element={<Navigate to={user ? `/${user.role}` : '/login'} replace />} />
    </Routes>
  )
}
