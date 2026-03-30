import { useState, useEffect } from 'react'
import { notificationApi } from '../api/notification'
import type { NotificationResponse, NotificationType } from '../types'

const typeLabel: Record<NotificationType, string> = {
  GRADE_UPDATED: '성적',
  FEEDBACK_PUBLISHED: '피드백',
  COUNSELING_UPDATED: '상담',
  STUDENT_RECORD_UPDATED: '학생부',
  GENERAL: '알림',
}

const typeColor: Record<NotificationType, { bg: string; text: string }> = {
  GRADE_UPDATED: { bg: '#D8E2FF', text: '#0058BE' },
  FEEDBACK_PUBLISHED: { bg: '#D4EDDA', text: '#1A6B3C' },
  COUNSELING_UPDATED: { bg: '#FFF3CD', text: '#856404' },
  STUDENT_RECORD_UPDATED: { bg: '#E8DEF8', text: '#4B3276' },
  GENERAL: { bg: '#F0EDEF', text: '#45474C' },
}

function formatTime(isoString: string) {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60_000)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffMin < 1) return '방금 전'
  if (diffMin < 60) return `${diffMin}분 전`
  if (diffHour < 24) return `${diffHour}시간 전`
  if (diffDay < 7) return `${diffDay}일 전`
  return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [markingAll, setMarkingAll] = useState(false)

  const fetchNotifications = async () => {
    try {
      const res = await notificationApi.getMyNotifications()
      setNotifications(res.data.data)
    } catch (err) {
      console.error('알림 조회 실패:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationApi.markAsRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      )
    } catch (err) {
      console.error('읽음 처리 실패:', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    setMarkingAll(true)
    try {
      await notificationApi.markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    } catch (err) {
      console.error('전체 읽음 처리 실패:', err)
    } finally {
      setMarkingAll(false)
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64 p-8">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: '#0058BE', borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: '#091426' }}>
            알림
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#45474C' }}>
            {unreadCount > 0 ? `읽지 않은 알림 ${unreadCount}건` : '모든 알림을 읽었습니다.'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={markingAll}
            className="text-sm font-semibold px-4 py-2 rounded-lg transition-all"
            style={{
              backgroundColor: '#D8E2FF',
              color: '#0058BE',
              opacity: markingAll ? 0.6 : 1,
            }}
          >
            {markingAll ? '처리 중...' : '전체 읽음'}
          </button>
        )}
      </div>

      {/* 알림 목록 */}
      {notifications.length === 0 ? (
        <div
          className="rounded-2xl p-16 text-center"
          style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 1px 4px rgba(9,20,38,0.06)' }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: '#F5F3F4' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#75777D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <p className="font-semibold" style={{ color: '#091426' }}>알림이 없습니다</p>
          <p className="text-sm mt-1" style={{ color: '#75777D' }}>성적, 피드백, 상담 관련 알림이 여기에 표시됩니다.</p>
        </div>
      ) : (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 1px 4px rgba(9,20,38,0.06)' }}
        >
          {notifications.map((n, idx) => {
            const color = typeColor[n.notificationType]
            return (
              <div
                key={n.id}
                className="flex items-start gap-4 px-6 py-4 cursor-pointer transition-colors"
                style={{
                  backgroundColor: n.isRead ? '#FFFFFF' : '#F0F5FF',
                  borderTop: idx > 0 ? '1px solid #F0EDEF' : 'none',
                }}
                onClick={() => !n.isRead && handleMarkAsRead(n.id)}
              >
                {/* 타입 뱃지 */}
                <div
                  className="flex-shrink-0 px-2 py-1 rounded-lg text-xs font-bold mt-0.5"
                  style={{ backgroundColor: color.bg, color: color.text }}
                >
                  {typeLabel[n.notificationType]}
                </div>

                {/* 내용 */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: n.isRead ? '#45474C' : '#091426', fontWeight: n.isRead ? 400 : 500 }}
                  >
                    {n.message}
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#75777D' }}>
                    {formatTime(n.createdAt)}
                  </p>
                </div>

                {/* 미읽음 점 */}
                {!n.isRead && (
                  <div
                    className="flex-shrink-0 w-2 h-2 rounded-full mt-2"
                    style={{ backgroundColor: '#0058BE' }}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
