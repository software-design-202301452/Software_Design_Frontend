import { useEffect, useState } from 'react'
import { userApi } from '../../api/user'
import { studentApi } from '../../api/student'
import type { MyInfoResponse, GradeResponse, FeedbackResponse, StudentRecordResponse } from '../../types'
import Badge from '../../components/common/Badge'
import GradeRadarChart from '../../components/charts/GradeRadarChart'
import PageHeader from '../../components/common/PageHeader'

const feedbackTypeLabel: Record<string, string> = {
  GRADE: '성적', BEHAVIOR: '행동', ATTENDANCE: '출결', ATTITUDE: '태도', GENERAL: '일반',
}
const gradeLevelColor: Record<string, 'green' | 'blue' | 'yellow' | 'red' | 'gray'> = {
  A: 'green', B: 'blue', C: 'yellow', D: 'red', E: 'gray',
}

export default function StudentDashboardPage() {
  const [info, setInfo] = useState<MyInfoResponse | null>(null)
  const [grades, setGrades] = useState<GradeResponse[]>([])
  const [feedbacks, setFeedbacks] = useState<FeedbackResponse[]>([])
  const [records, setRecords] = useState<StudentRecordResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'grades' | 'records' | 'feedbacks'>('grades')

  useEffect(() => {
    const load = async () => {
      try {
        const [res, g, f, r] = await Promise.all([
          userApi.getMyInfo(),
          studentApi.getMyGrades(),
          studentApi.getMyFeedbacks(),
          studentApi.getMyRecords(),
        ])
        setInfo(res.data.data)
        setGrades(g.data.data)
        setFeedbacks(f.data.data.filter((fb) => fb.published))
        setRecords(r.data.data)
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const attendanceSummary = {
    출석: records.reduce((sum, r) => sum + (r.attendanceDays ?? 0), 0),
    결석: records.reduce((sum, r) => sum + (r.absenceDays ?? 0), 0),
    지각: records.reduce((sum, r) => sum + (r.lateDays ?? 0), 0),
    조퇴: records.reduce((sum, r) => sum + (r.earlyLeaveDays ?? 0), 0),
    봉사: records.reduce((sum, r) => sum + (r.volunteerHours ?? 0), 0),
  }

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-64">
      <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: '#0058BE', borderTopColor: 'transparent' }} />
    </div>
  )
  if (!info) return (
    <div className="p-8 text-sm" style={{ color: '#45474C' }}>학생 정보를 불러올 수 없습니다.</div>
  )

  return (
    <div className="p-8">
      <PageHeader title="내 학습 현황" subtitle="내 성적, 출결, 피드백을 확인합니다." />

      {/* 학생 정보 카드 */}
      <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 12px rgba(9,20,38,0.06)' }}>
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold font-display"
            style={{ backgroundColor: '#D8E2FF', color: '#0058BE' }}
          >
            {info.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold font-display" style={{ color: '#1B1B1D' }}>{info.name}</h2>
            <p className="text-sm mt-0.5" style={{ color: '#45474C' }}>
              {info.grade}학년 {info.classNum}반 {info.studentNumber}번
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            ['이메일', info.email],
            ['연락처', info.phone ?? '-'],
            ['주소', info.address ?? '-'],
            ['총 출결', `${records.length}건`],
          ].map(([label, value]) => (
            <div key={label as string} className="rounded-lg p-3" style={{ backgroundColor: '#F5F3F4' }}>
              <p className="text-xs mb-1" style={{ color: '#45474C' }}>{label}</p>
              <p className="text-sm font-semibold truncate" style={{ color: '#1B1B1D' }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 성적 레이더 차트 */}
      {grades.length > 0 && (
        <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 12px rgba(9,20,38,0.06)' }}>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#45474C', letterSpacing: '0.08em' }}>과목별 성적 차트</h3>
          <GradeRadarChart grades={grades} />
        </div>
      )}

      {/* 탭 */}
      <div className="flex gap-0.5 rounded-xl p-1 mb-4 w-fit" style={{ backgroundColor: '#EAE7E9' }}>
        {[
          { key: 'grades' as const, label: '성적', count: grades.length },
          { key: 'records' as const, label: '출결', count: records.length },
          { key: 'feedbacks' as const, label: '피드백', count: feedbacks.length },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all"
            style={tab === t.key
              ? { backgroundColor: '#FFFFFF', color: '#091426', boxShadow: '0px 1px 4px rgba(9,20,38,0.1)' }
              : { color: '#45474C' }
            }
          >
            {t.label}
            <span
              className="text-xs rounded-full px-1.5 py-0.5 font-semibold"
              style={tab === t.key
                ? { backgroundColor: '#D8E2FF', color: '#0058BE' }
                : { backgroundColor: '#DCD9DB', color: '#45474C' }
              }
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* 성적 탭 */}
      {tab === 'grades' && (
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 12px rgba(9,20,38,0.06)' }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#F5F3F4' }}>
                {['과목', '년도/학기', '점수', '반 평균', '등급'].map((h) => (
                  <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#45474C', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grades.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-sm" style={{ color: '#45474C' }}>등록된 성적이 없습니다.</td></tr>
              ) : grades.map((g) => (
                <tr
                  key={g.id}
                  style={{ borderTop: '1px solid #F0EDEF' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F5F3F4' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  <td className="px-4 py-3.5 text-sm font-semibold" style={{ color: '#1B1B1D' }}>{g.subjectName}</td>
                  <td className="px-4 py-3.5 text-sm" style={{ color: '#45474C' }}>{g.year}년 {g.semester}학기</td>
                  <td className="px-4 py-3.5 text-sm font-semibold" style={{ color: '#1B1B1D' }}>{g.score} <span className="font-normal" style={{ color: '#75777D' }}>/ {g.totalScore}</span></td>
                  <td className="px-4 py-3.5 text-sm" style={{ color: '#45474C' }}>{g.average.toFixed(1)}</td>
                  <td className="px-4 py-3.5"><Badge variant={gradeLevelColor[g.gradeLevel]}>{g.gradeLevel}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 출결 탭 */}
      {tab === 'records' && (
        <div className="space-y-4">
          {/* 출결 요약 */}
          <div className="grid grid-cols-5 gap-3">
            {Object.entries(attendanceSummary).map(([label, count]) => (
              <div key={label} className="rounded-xl p-4 text-center" style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 8px rgba(9,20,38,0.04)' }}>
                <p className="text-2xl font-bold font-display" style={{ color: '#091426' }}>{count}</p>
                <p className="text-xs mt-1" style={{ color: '#45474C' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* 출결 목록 */}
          <div className="space-y-4">
            {records.length === 0 ? (
              <div className="rounded-xl py-12 text-center text-sm" style={{ backgroundColor: '#FFFFFF', color: '#45474C', boxShadow: '0px 2px 8px rgba(9,20,38,0.04)' }}>출결 기록이 없습니다.</div>
            ) : records.map((r) => (
              <div key={r.id} className="rounded-xl p-5" style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 8px rgba(9,20,38,0.04)' }}>
                <h4 className="text-sm font-bold font-display mb-3" style={{ color: '#1B1B1D' }}>{r.year}년 {r.semester}학기</h4>
                <div className="grid grid-cols-4 gap-3 text-sm text-center">
                  {[
                    ['출석', r.attendanceDays, '일'],
                    ['결석', r.absenceDays, '일'],
                    ['지각', r.lateDays, '회'],
                    ['조퇴', r.earlyLeaveDays, '회'],
                  ].map(([label, val, unit]) => (
                    <div key={label as string} className="rounded-lg p-3" style={{ backgroundColor: '#F5F3F4' }}>
                      <p className="text-xs" style={{ color: '#45474C' }}>{label}</p>
                      <p className="font-bold font-display mt-1 text-base" style={{ color: '#091426' }}>{val}<span className="text-xs font-normal ml-0.5" style={{ color: '#45474C' }}>{unit}</span></p>
                    </div>
                  ))}
                </div>
                {r.specialNote && <p className="mt-3 text-xs rounded-lg p-3" style={{ color: '#1B1B1D', backgroundColor: '#F5F3F4' }}>{r.specialNote}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 피드백 탭 */}
      {tab === 'feedbacks' && (
        <div className="space-y-4">
          {feedbacks.length === 0 ? (
            <div className="rounded-xl py-12 text-center text-sm" style={{ backgroundColor: '#FFFFFF', color: '#45474C', boxShadow: '0px 2px 8px rgba(9,20,38,0.04)' }}>
              공개된 피드백이 없습니다.
            </div>
          ) : feedbacks.map((f) => (
            <div key={f.id} className="rounded-xl p-5" style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 8px rgba(9,20,38,0.04)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="blue">{feedbackTypeLabel[f.feedbackType]}</Badge>
                <span className="text-xs" style={{ color: '#75777D' }}>{f.createdAt?.slice(0, 10)}</span>
              </div>
              <p className="text-sm whitespace-pre-wrap" style={{ color: '#1B1B1D' }}>{f.content}</p>
              <p className="mt-2 text-xs" style={{ color: '#75777D' }}>담당: {f.teacherName}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
