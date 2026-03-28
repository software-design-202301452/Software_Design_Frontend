import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import Layout from './components/layout/Layout'
import LoginPage from './pages/auth/LoginPage'
import SignupTeacherPage from './pages/auth/SignupTeacherPage'
import SignupStudentPage from './pages/auth/SignupStudentPage'
import SignupParentPage from './pages/auth/SignupParentPage'

import DashboardPage from './pages/teacher/DashboardPage'
import StudentListPage from './pages/teacher/StudentListPage'
import StudentDetailPage from './pages/teacher/StudentDetailPage'
import SubjectPage from './pages/teacher/SubjectPage'
import SharedCounselingPage from './pages/teacher/SharedCounselingPage'

import ParentDashboardPage from './pages/parent/ParentDashboardPage'
import AdminPage from './pages/admin/AdminPage'
import ProfilePage from './pages/ProfilePage'

function RoleRoute({ roles, children }: { roles: string[]; children: React.ReactNode }) {
  const { user } = useAuth()
  if (!user || !roles.includes(user.role)) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup/teacher" element={<SignupTeacherPage />} />
      <Route path="/signup/student" element={<SignupStudentPage />} />
      <Route path="/signup/parent" element={<SignupParentPage />} />

      {/* Protected routes */}
      <Route element={<Layout />}>
        {/* Profile - all roles */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Teacher routes */}
        <Route
          path="/"
          element={
            <RoleDispatch
              teacher={<DashboardPage />}
              parent={<ParentDashboardPage />}
              admin={<AdminPage />}
            />
          }
        />
        <Route
          path="/students"
          element={
            <RoleRoute roles={['TEACHER']}>
              <StudentListPage />
            </RoleRoute>
          }
        />
        <Route
          path="/students/:studentId"
          element={
            <RoleRoute roles={['TEACHER']}>
              <StudentDetailPage />
            </RoleRoute>
          }
        />
        <Route
          path="/subjects"
          element={
            <RoleRoute roles={['TEACHER']}>
              <SubjectPage />
            </RoleRoute>
          }
        />
        <Route
          path="/counselings/shared"
          element={
            <RoleRoute roles={['TEACHER']}>
              <SharedCounselingPage />
            </RoleRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

function RoleDispatch({
  teacher,
  parent,
  admin,
}: {
  teacher: React.ReactNode
  parent: React.ReactNode
  admin: React.ReactNode
}) {
  const { user } = useAuth()
  if (user?.role === 'TEACHER') return <>{teacher}</>
  if (user?.role === 'PARENT') return <>{parent}</>
  if (user?.role === 'ADMIN') return <>{admin}</>
  return <Navigate to="/login" replace />
}
