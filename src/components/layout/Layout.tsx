import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Sidebar from './Sidebar'

export default function Layout() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FBF8FA' }}>
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: '#0058BE', borderTopColor: 'transparent' }}
          />
          <p className="text-sm font-medium" style={{ color: '#45474C' }}>불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#FBF8FA' }}>
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
