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
import StudentDashboardPage from './pages/student/StudentDashboardPage'
import AdminPage from './pages/admin/AdminPage'
import ProfilePage from './pages/ProfilePage'
import NotificationsPage from './pages/NotificationsPage'

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
        {/* 공통 라우트 - 모든 역할 */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />

        {/* Teacher routes */}
        <Route
          path="/"
          element={
            <RoleDispatch
              teacher={<DashboardPage />}
              student={<StudentDashboardPage />}
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
  student,
  parent,
  admin,
}: {
  teacher: React.ReactNode
  student: React.ReactNode
  parent: React.ReactNode
  admin: React.ReactNode
}) {
  const { user } = useAuth()
  if (user?.role === 'TEACHER') return <>{teacher}</>
  if (user?.role === 'STUDENT') return <>{student}</>
  if (user?.role === 'PARENT') return <>{parent}</>
  if (user?.role === 'ADMIN') return <>{admin}</>
  return <Navigate to="/login" replace />
}
