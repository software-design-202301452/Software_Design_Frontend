import { useState, useEffect } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Sidebar from './Sidebar'
import { notificationApi } from '../../api/notification'

export default function Layout() {
  const { user, isLoading } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user) return

    const fetchUnreadCount = async () => {
      try {
        const res = await notificationApi.getUnreadCount()
        setUnreadCount(res.data.data.count)
      } catch {
        // 폴링 오류는 무시 (네트워크 일시 오류 등)
      }
    }

    fetchUnreadCount()
    // 30초마다 미읽음 수 폴링
    const interval = setInterval(fetchUnreadCount, 30_000)
    return () => clearInterval(interval)
  }, [user])

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
      <Sidebar unreadCount={unreadCount} onNotificationRead={() => setUnreadCount(0)} />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
