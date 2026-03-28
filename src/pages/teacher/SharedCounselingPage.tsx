import { useEffect, useState } from 'react'
import { counselingApi } from '../../api/counseling'
import type { CounselingResponse } from '../../types'
import PageHeader from '../../components/common/PageHeader'
import Badge from '../../components/common/Badge'

export default function SharedCounselingPage() {
  const [counselings, setCounselings] = useState<CounselingResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await counselingApi.getSharedCounselings()
      setCounselings(res.data.data)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = counselings.filter(
    (c) =>
      c.studentName.includes(search) ||
      c.teacherName.includes(search) ||
      c.content.includes(search)
  )

  return (
    <div className="p-8">
      <PageHeader
        title="공유 상담 내역"
        subtitle="다른 교사들과 공유된 상담 내역을 조회합니다."
      />

      {/* 검색 */}
      <div
        className="rounded-xl p-4 mb-6 flex items-center gap-3"
        style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 8px rgba(9,20,38,0.04)' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#75777D" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="학생명, 교사명, 내용으로 검색"
          className="flex-1 text-sm outline-none"
          style={{ backgroundColor: 'transparent', color: '#1B1B1D' }}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{ color: '#75777D' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-16 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#0058BE', borderTopColor: 'transparent' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl py-16 text-center" style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 8px rgba(9,20,38,0.04)' }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#F5F3F4' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#75777D" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <p className="text-sm" style={{ color: '#45474C' }}>공유된 상담 내역이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 결과 수 */}
          <p className="text-xs font-medium" style={{ color: '#45474C' }}>총 {filtered.length}건</p>
          {filtered.map((c) => (
            <div
              key={c.id}
              className="rounded-xl p-5 transition-all"
              style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 8px rgba(9,20,38,0.04)' }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0px 4px 16px rgba(9,20,38,0.08)' }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0px 2px 8px rgba(9,20,38,0.04)' }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold font-display flex-shrink-0"
                  style={{ backgroundColor: '#D8E2FF', color: '#0058BE' }}
                >
                  {c.studentName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-sm font-bold font-display" style={{ color: '#1B1B1D' }}>{c.studentName}</span>
                    <Badge variant="green">공유됨</Badge>
                    <span className="text-xs" style={{ color: '#75777D' }}>{c.counselingDate}</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap mb-3" style={{ color: '#1B1B1D' }}>{c.content}</p>
                  {c.nextPlan && (
                    <div className="rounded-lg p-3 text-xs mb-2" style={{ backgroundColor: '#F5F3F4', color: '#0058BE' }}>
                      <span className="font-semibold">다음 상담 계획: </span>{c.nextPlan}
                    </div>
                  )}
                  <p className="text-xs" style={{ color: '#75777D' }}>담당 교사: <span className="font-medium" style={{ color: '#45474C' }}>{c.teacherName}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
