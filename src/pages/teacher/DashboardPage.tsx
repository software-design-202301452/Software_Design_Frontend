import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { studentApi } from '../../api/student'
import { counselingApi } from '../../api/counseling'
import type { StudentSummaryResponse, CounselingResponse } from '../../types'

export default function DashboardPage() {
  const { user } = useAuth()
  const [students, setStudents] = useState<StudentSummaryResponse[]>([])
  const [sharedCounselings, setSharedCounselings] = useState<CounselingResponse[]>([])

  useEffect(() => {
    studentApi.getStudents().then((r) => setStudents(r.data.data)).catch(() => {})
    counselingApi.getSharedCounselings().then((r) => setSharedCounselings(r.data.data)).catch(() => {})
  }, [])

  const stats = [
    {
      label: '전체 학생',
      value: students.length,
      description: '등록된 학생 수',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: '공유 상담',
      value: sharedCounselings.length,
      description: '공유된 상담 내역',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
  ]

  const quickMenus = [
    {
      to: '/students',
      label: '학생 목록',
      description: '전체 학생 조회',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      to: '/subjects',
      label: '과목 관리',
      description: '교과목 설정',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
    },
    {
      to: '/counselings/shared',
      label: '공유 상담',
      description: '상담 내역 공유',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      to: '/profile',
      label: '내 정보',
      description: '프로필 관리',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" /><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
        </svg>
      ),
    },
  ]

  return (
    <div className="p-8 max-w-6xl">
      {/* 헤더 */}
      <div className="mb-10">
        <p className="text-sm font-medium mb-1.5" style={{ color: '#0058BE' }}>대시보드</p>
        <h1 className="text-3xl font-bold font-display mb-2" style={{ color: '#1B1B1D' }}>
          안녕하세요, {user?.name} 선생님
        </h1>
        <p className="text-base" style={{ color: '#45474C' }}>
          학생 성적 및 상담 관리 시스템에 오신 것을 환영합니다.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-6"
            style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 12px rgba(9, 20, 38, 0.06)' }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#45474C', letterSpacing: '0.08em' }}>
                  {s.label}
                </p>
                <p className="text-4xl font-bold font-display" style={{ color: '#091426' }}>
                  {s.value}
                </p>
                <p className="text-sm mt-1.5" style={{ color: '#45474C' }}>{s.description}</p>
              </div>
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: '#D8E2FF', color: '#0058BE' }}
              >
                {s.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 빠른 메뉴 */}
      <div className="mb-8">
        <h2 className="text-base font-bold font-display mb-4" style={{ color: '#1B1B1D' }}>빠른 메뉴</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickMenus.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex flex-col gap-3 p-5 rounded-xl transition-all group"
              style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 8px rgba(9, 20, 38, 0.04)' }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0px 8px 24px rgba(9, 20, 38, 0.1)' }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0px 2px 8px rgba(9, 20, 38, 0.04)' }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                style={{ backgroundColor: '#F5F3F4', color: '#0058BE' }}
              >
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#1B1B1D' }}>{item.label}</p>
                <p className="text-xs mt-0.5" style={{ color: '#45474C' }}>{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 최근 학생 목록 */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 12px rgba(9, 20, 38, 0.06)' }}>
        <div className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor: '#F5F3F4' }}>
          <h2 className="text-sm font-bold font-display" style={{ color: '#1B1B1D' }}>최근 학생 목록</h2>
          <Link
            to="/students"
            className="text-xs font-semibold transition-colors"
            style={{ color: '#0058BE' }}
          >
            전체 보기 →
          </Link>
        </div>

        {students.length === 0 ? (
          <div className="py-16 text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: '#F5F3F4' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#75777D" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
              </svg>
            </div>
            <p className="text-sm" style={{ color: '#45474C' }}>등록된 학생이 없습니다.</p>
          </div>
        ) : (
          <div>
            {students.slice(0, 5).map((s, idx) => (
              <Link
                key={s.id}
                to={`/students/${s.id}`}
                className="flex items-center justify-between px-6 py-4 transition-colors"
                style={{
                  borderTop: idx > 0 ? '1px solid #F0EDEF' : 'none',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F5F3F4' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: '#D8E2FF', color: '#0058BE' }}
                  >
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#1B1B1D' }}>{s.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#45474C' }}>
                      {s.grade}학년 {s.classNum}반 {s.studentNumber}번
                    </p>
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#75777D" strokeWidth="2" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
