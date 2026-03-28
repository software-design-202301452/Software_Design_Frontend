import { useState, useCallback } from 'react'
import { counselingApi } from '../../api/counseling'
import type { CounselingResponse } from '../../types'
import PageHeader from '../../components/common/PageHeader'
import Badge from '../../components/common/Badge'

// CEW-50/51: 공유 상담 검색/필터링
export default function SharedCounselingPage() {
  const [counselings, setCounselings] = useState<CounselingResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const [keyword, setKeyword] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const search = useCallback(async () => {
    setLoading(true)
    setSearched(true)
    try {
      const res = await counselingApi.searchCounselings({
        keyword: keyword || undefined,
        from: from || undefined,
        to: to || undefined,
      })
      setCounselings(res.data.data)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [keyword, from, to])

  const reset = () => {
    setKeyword('')
    setFrom('')
    setTo('')
    setCounselings([])
    setSearched(false)
  }

  const inputBase = {
    backgroundColor: '#F5F3F4',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: '#1B1B1D',
    outline: 'none',
  }

  return (
    <div className="p-8">
      <PageHeader
        title="공유 상담 검색"
        subtitle="키워드·날짜 기준으로 공유된 상담 내역을 검색합니다."
      />

      {/* CEW-50/51 검색 필터 패널 */}
      <div className="rounded-xl p-5 mb-6" style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 12px rgba(9,20,38,0.06)' }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {/* 키워드 */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#45474C', letterSpacing: '0.05em' }}>키워드</label>
            <div className="relative flex items-center">
              <svg className="absolute left-3 flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#75777D" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && search()}
                placeholder="상담 내용, 다음 계획..."
                className="w-full pl-8 pr-3 py-2.5 rounded-lg text-sm transition-all"
                style={inputBase}
                onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#0058BE'; e.currentTarget.style.backgroundColor = '#FFFFFF' }}
                onBlur={(e) => { e.currentTarget.style.borderBottomColor = 'transparent'; e.currentTarget.style.backgroundColor = '#F5F3F4' }}
              />
            </div>
          </div>

          {/* 시작일 */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#45474C', letterSpacing: '0.05em' }}>시작일</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm transition-all"
              style={inputBase}
              onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#0058BE'; e.currentTarget.style.backgroundColor = '#FFFFFF' }}
              onBlur={(e) => { e.currentTarget.style.borderBottomColor = 'transparent'; e.currentTarget.style.backgroundColor = '#F5F3F4' }}
            />
          </div>

          {/* 종료일 */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#45474C', letterSpacing: '0.05em' }}>종료일</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm transition-all"
              style={inputBase}
              onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#0058BE'; e.currentTarget.style.backgroundColor = '#FFFFFF' }}
              onBlur={(e) => { e.currentTarget.style.borderBottomColor = 'transparent'; e.currentTarget.style.backgroundColor = '#F5F3F4' }}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={search}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: '#0058BE', color: '#FFFFFF' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            검색
          </button>
          {searched && (
            <button
              onClick={reset}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold"
              style={{ backgroundColor: '#EAE7E9', color: '#45474C' }}
            >
              초기화
            </button>
          )}
        </div>
      </div>

      {/* 결과 */}
      {loading ? (
        <div className="py-16 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: '#0058BE', borderTopColor: 'transparent' }} />
        </div>
      ) : !searched ? (
        <div className="rounded-xl py-16 text-center" style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 8px rgba(9,20,38,0.04)' }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#F5F3F4' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#75777D" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <p className="text-sm" style={{ color: '#45474C' }}>키워드 또는 날짜를 입력하고 검색하세요.</p>
        </div>
      ) : counselings.length === 0 ? (
        <div className="rounded-xl py-16 text-center" style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 8px rgba(9,20,38,0.04)' }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#F5F3F4' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#75777D" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <p className="text-sm" style={{ color: '#45474C' }}>검색 결과가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs font-medium" style={{ color: '#45474C' }}>총 {counselings.length}건</p>
          {counselings.map((c) => (
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
