import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

interface SidebarProps {
  unreadCount?: number
  onNotificationRead?: () => void
}

const teacherNav = [
  {
    to: '/',
    label: '대시보드',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    to: '/students',
    label: '학생 관리',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    to: '/subjects',
    label: '과목 관리',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    to: '/counselings/shared',
    label: '공유 상담',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
]

const studentNav = [
  {
    to: '/',
    label: '내 학습 현황',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    to: '/profile',
    label: '내 프로필',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" /><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      </svg>
    ),
  },
]

const parentNav = [
  {
    to: '/',
    label: '우리 아이 정보',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" /><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      </svg>
    ),
  },
]

const adminNav = [
  {
    to: '/',
    label: '계정 관리',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
      </svg>
    ),
  },
]

export default function Sidebar({ unreadCount = 0 }: SidebarProps) {
  const { user, logout } = useAuth()

  const nav =
    user?.role === 'TEACHER'
      ? teacherNav
      : user?.role === 'STUDENT'
      ? studentNav
      : user?.role === 'PARENT'
      ? parentNav
      : adminNav

  return (
    <aside
      className="w-64 flex flex-col min-h-screen"
      style={{ backgroundColor: '#091426' }}
    >
      {/* 로고 */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#1E293B' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#BCC7DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <div>
            <p className="text-white text-sm font-bold font-display leading-tight">학생 성적 &amp;</p>
            <p className="text-white text-sm font-bold font-display leading-tight">상담 관리 시스템</p>
          </div>
        </div>
      </div>

      {/* 사용자 정보 */}
      <div className="mx-4 mb-4 rounded-lg px-4 py-3" style={{ backgroundColor: '#1E293B' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
            style={{ backgroundColor: '#0058BE', color: '#FFFFFF' }}
          >
            {user?.name?.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
            <span
              className="inline-block text-xs px-2 py-0.5 rounded-full mt-0.5 font-medium"
              style={{ backgroundColor: '#0058BE20', color: '#ADC6FF' }}
            >
              {roleLabel(user?.role)}
            </span>
          </div>
        </div>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 px-3 space-y-0.5">
        <p
          className="px-3 py-2 text-xs font-semibold uppercase tracking-widest"
          style={{ color: '#45474C', letterSpacing: '0.08em' }}
        >
          메뉴
        </p>
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'text-white'
                  : 'text-[#8590A6] hover:text-white hover:bg-white/5'
              }`
            }
            style={({ isActive }) =>
              isActive ? { backgroundColor: '#0058BE' } : {}
            }
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* 하단 메뉴 */}
      <div className="px-3 pb-4 space-y-0.5">
        <div style={{ height: '1px', backgroundColor: '#1E293B', margin: '8px 12px' }} />

        {/* 알림 */}
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isActive ? 'text-white bg-[#0058BE]' : 'text-[#8590A6] hover:text-white hover:bg-white/5'
            }`
          }
        >
          <div className="relative flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 rounded-full text-[10px] font-bold flex items-center justify-center px-1"
                style={{ backgroundColor: '#BA1A1A', color: '#FFFFFF' }}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
          알림
          {unreadCount > 0 && (
            <span
              className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: '#BA1A1A', color: '#FFFFFF' }}
            >
              {unreadCount}
            </span>
          )}
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isActive ? 'text-white bg-[#0058BE]' : 'text-[#8590A6] hover:text-white hover:bg-white/5'
            }`
          }
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" /><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
          </svg>
          내 정보
        </NavLink>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-[#8590A6] hover:text-white hover:bg-white/5"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          로그아웃
        </button>
      </div>
    </aside>
  )
}

function roleLabel(role?: string) {
  switch (role) {
    case 'TEACHER': return '교사'
    case 'STUDENT': return '학생'
    case 'PARENT': return '학부모'
    case 'ADMIN': return '관리자'
    default: return ''
  }
}
