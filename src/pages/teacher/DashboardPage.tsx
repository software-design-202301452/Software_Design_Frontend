import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { dashboardApi, type TeacherDashboardResponse } from '../../api/dashboard'

const feedbackTypeLabel: Record<string, string> = {
  GRADE: '성적', BEHAVIOR: '행동', ATTENDANCE: '출결', ATTITUDE: '태도', GENERAL: '일반',
}
const gradeLevelColor: Record<string, string> = {
  A: '#1A6B3C', B: '#0058BE', C: '#8B6914', D: '#BA1A1A', E: '#45474C',
}
const gradeLevelBg: Record<string, string> = {
  A: '#D4EDDA', B: '#D8E2FF', C: '#FFF3CD', D: '#FFDAD6', E: '#EAE7E9',
}

// CEW-69: 교사 대시보드
export default function DashboardPage() {
  const { user } = useAuth()
  const [dashboard, setDashboard] = useState<TeacherDashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'counselings' | 'feedbacks' | 'grades'>('counselings')

  useEffect(() => {
    dashboardApi.getTeacherDashboard()
      .then((r) => setDashboard(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const stats = [
    {
      label: '전체 학생',
      value: dashboard?.totalStudents ?? '-',
      description: '등록된 학생 수',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: '성적 입력',
      value: dashboard?.totalGrades ?? '-',
      description: '총 성적 기록 수',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
    },
    {
      label: '미발행 피드백',
      value: dashboard?.unpublishedFeedbacks ?? '-',
      description: '학생에게 미공개',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      ),
    },
    {
      label: '최근 상담',
      value: dashboard?.recentCounselingsCount ?? '-',
      description: '최근 5건 현황',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
  ]

  const quickMenus = [
    { to: '/students', label: '학생 목록', description: '전체 학생 조회', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg> },
    { to: '/subjects', label: '과목 관리', description: '교과목 설정', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg> },
    { to: '/counselings/shared', label: '공유 상담 검색', description: '키워드/날짜 검색', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> },
    { to: '/profile', label: '내 정보', description: '프로필 관리', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /></svg> },
  ]

  return (
    <div className="p-8 max-w-6xl">
      {/* 헤더 */}
      <div className="mb-10">
        <p className="text-sm font-medium mb-1.5" style={{ color: '#0058BE' }}>대시보드</p>
        <h1 className="text-3xl font-bold font-display mb-2" style={{ color: '#1B1B1D' }}>
          안녕하세요, {user?.name} 선생님
        </h1>
        <p className="text-base" style={{ color: '#45474C' }}>학생 성적 및 상담 관리 시스템에 오신 것을 환영합니다.</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl p-5" style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 12px rgba(9,20,38,0.06)' }}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#D8E2FF', color: '#0058BE' }}>
                {s.icon}
              </div>
            </div>
            <p className="text-3xl font-bold font-display mb-1" style={{ color: '#091426' }}>{s.value}</p>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#45474C', letterSpacing: '0.05em' }}>{s.label}</p>
            <p className="text-xs mt-0.5" style={{ color: '#75777D' }}>{s.description}</p>
          </div>
        ))}
      </div>

      {/* 빠른 메뉴 */}
      <div className="mb-8">
        <h2 className="text-sm font-bold font-display mb-4" style={{ color: '#1B1B1D' }}>빠른 메뉴</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickMenus.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex flex-col gap-3 p-5 rounded-xl transition-all"
              style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 8px rgba(9,20,38,0.04)' }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0px 8px 24px rgba(9,20,38,0.10)' }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0px 2px 8px rgba(9,20,38,0.04)' }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F5F3F4', color: '#0058BE' }}>{item.icon}</div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#1B1B1D' }}>{item.label}</p>
                <p className="text-xs mt-0.5" style={{ color: '#45474C' }}>{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CEW-69: 최근 현황 탭 */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 12px rgba(9,20,38,0.06)' }}>
        <div className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor: '#F5F3F4' }}>
          <h2 className="text-sm font-bold font-display" style={{ color: '#1B1B1D' }}>최근 현황</h2>
          <div className="flex gap-0.5 rounded-lg p-0.5" style={{ backgroundColor: '#EAE7E9' }}>
            {([
              { key: 'counselings' as const, label: '상담' },
              { key: 'feedbacks' as const, label: '피드백' },
              { key: 'grades' as const, label: '성적' },
            ]).map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className="px-3 py-1 rounded text-xs font-semibold transition-all"
                style={activeTab === t.key
                  ? { backgroundColor: '#FFFFFF', color: '#091426', boxShadow: '0px 1px 4px rgba(9,20,38,0.1)' }
                  : { color: '#45474C' }
                }
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: '#0058BE', borderTopColor: 'transparent' }} />
          </div>
        ) : activeTab === 'counselings' ? (
          <div>
            {!dashboard?.recentCounselings?.length ? (
              <p className="py-10 text-center text-sm" style={{ color: '#45474C' }}>최근 상담 내역이 없습니다.</p>
            ) : dashboard.recentCounselings.map((c, idx) => (
              <div
                key={c.id}
                className="flex items-start gap-4 px-6 py-4 transition-colors"
                style={{ borderTop: idx > 0 ? '1px solid #F0EDEF' : 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F5F3F4' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ backgroundColor: '#D8E2FF', color: '#0058BE' }}>
                  {c.studentName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold" style={{ color: '#1B1B1D' }}>{c.studentName}</span>
                    <span className="text-xs" style={{ color: '#75777D' }}>{c.counselingDate}</span>
                  </div>
                  <p className="text-xs truncate" style={{ color: '#45474C' }}>{c.content}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#75777D' }}>담당: {c.teacherName}</p>
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === 'feedbacks' ? (
          <div>
            {!dashboard?.recentFeedbacks?.length ? (
              <p className="py-10 text-center text-sm" style={{ color: '#45474C' }}>최근 피드백이 없습니다.</p>
            ) : dashboard.recentFeedbacks.map((f, idx) => (
              <div
                key={f.id}
                className="flex items-start gap-4 px-6 py-4 transition-colors"
                style={{ borderTop: idx > 0 ? '1px solid #F0EDEF' : 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F5F3F4' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ backgroundColor: '#D8E2FF', color: '#0058BE' }}>
                  {f.studentName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold" style={{ color: '#1B1B1D' }}>{f.studentName}</span>
                    <span className="text-xs rounded-full px-2 py-0.5 font-semibold" style={{ backgroundColor: '#D8E2FF', color: '#0058BE' }}>
                      {feedbackTypeLabel[f.feedbackType] ?? f.feedbackType}
                    </span>
                    <span className="text-xs rounded-full px-2 py-0.5 font-semibold" style={f.published ? { backgroundColor: '#D4EDDA', color: '#1A6B3C' } : { backgroundColor: '#EAE7E9', color: '#45474C' }}>
                      {f.published ? '발행됨' : '미발행'}
                    </span>
                  </div>
                  <p className="text-xs truncate" style={{ color: '#45474C' }}>{f.content}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#75777D' }}>담당: {f.teacherName}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {!dashboard?.recentGrades?.length ? (
              <p className="py-10 text-center text-sm" style={{ color: '#45474C' }}>최근 성적 입력이 없습니다.</p>
            ) : dashboard.recentGrades.map((g, idx) => (
              <div
                key={g.id}
                className="flex items-center gap-4 px-6 py-4 transition-colors"
                style={{ borderTop: idx > 0 ? '1px solid #F0EDEF' : 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F5F3F4' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ backgroundColor: '#D8E2FF', color: '#0058BE' }}>
                  {g.studentName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold" style={{ color: '#1B1B1D' }}>{g.studentName}</span>
                    <span className="text-xs" style={{ color: '#45474C' }}>{g.subjectName}</span>
                    <span className="text-xs" style={{ color: '#75777D' }}>{g.year}년 {g.semester}학기</span>
                  </div>
                  <p className="text-xs" style={{ color: '#45474C' }}>점수: {g.score}점</p>
                </div>
                <span
                  className="text-xs font-bold rounded-full px-2.5 py-1"
                  style={{ backgroundColor: gradeLevelBg[g.gradeLevel] ?? '#EAE7E9', color: gradeLevelColor[g.gradeLevel] ?? '#45474C' }}
                >
                  {g.gradeLevel}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
