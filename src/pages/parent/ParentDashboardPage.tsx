import { useEffect, useState } from 'react'
import { parentApi } from '../../api/parent'
import type { MyStudentResponse, GradeResponse, FeedbackResponse } from '../../types'
import Badge from '../../components/common/Badge'
import GradeRadarChart from '../../components/charts/GradeRadarChart'
import PageHeader from '../../components/common/PageHeader'

const feedbackTypeLabel: Record<string, string> = {
  GRADE: '성적', BEHAVIOR: '행동', ATTENDANCE: '출결', ATTITUDE: '태도', GENERAL: '일반',
}
const gradeLevelColor: Record<string, 'green' | 'blue' | 'yellow' | 'red' | 'gray'> = {
  A: 'green', B: 'blue', C: 'yellow', D: 'red', E: 'gray',
}

export default function ParentDashboardPage() {
  const [student, setStudent] = useState<MyStudentResponse | null>(null)
  const [grades, setGrades] = useState<GradeResponse[]>([])
  const [feedbacks, setFeedbacks] = useState<FeedbackResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'grades' | 'feedbacks'>('grades')

  useEffect(() => {
    const load = async () => {
      try {
        const [s, g, f] = await Promise.all([
          parentApi.getMyStudent(),
          parentApi.getStudentGrades(),
          parentApi.getStudentFeedbacks(),
        ])
        setStudent(s.data.data)
        setGrades(g.data.data)
        setFeedbacks(f.data.data)
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-64">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#0058BE', borderTopColor: 'transparent' }} />
    </div>
  )
  if (!student) return <div className="p-8 text-sm" style={{ color: '#45474C' }}>연동된 학생 정보를 찾을 수 없습니다.</div>

  return (
    <div className="p-8">
      <PageHeader title="우리 아이 정보" />

      {/* 학생 정보 카드 */}
      <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 12px rgba(9,20,38,0.06)' }}>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold font-display" style={{ backgroundColor: '#D8E2FF', color: '#0058BE' }}>
            {student.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold font-display" style={{ color: '#1B1B1D' }}>{student.name}</h2>
            <p className="text-sm mt-0.5" style={{ color: '#45474C' }}>{student.grade}학년 {student.classNum}반 {student.studentNumber}번</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            ['이메일', student.email],
            ['연락처', student.phone ?? '-'],
            ['주소', student.address ?? '-'],
          ].map(([label, value]) => (
            <div key={label as string} className="rounded-lg p-3" style={{ backgroundColor: '#F5F3F4' }}>
              <p className="text-xs mb-1" style={{ color: '#45474C' }}>{label}</p>
              <p className="text-sm font-semibold" style={{ color: '#1B1B1D' }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 성적 차트 */}
      <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 12px rgba(9,20,38,0.06)' }}>
        <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#45474C', letterSpacing: '0.08em' }}>과목별 성적 차트</h3>
        <GradeRadarChart grades={grades} />
      </div>

      {/* 탭 */}
      <div className="flex gap-0.5 rounded-xl p-1 mb-4 w-fit" style={{ backgroundColor: '#EAE7E9' }}>
        {[
          { key: 'grades' as const, label: '성적', count: grades.length },
          { key: 'feedbacks' as const, label: '피드백', count: feedbacks.length },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all"
            style={tab === t.key ? { backgroundColor: '#FFFFFF', color: '#091426', boxShadow: '0px 1px 4px rgba(9,20,38,0.1)' } : { color: '#45474C' }}
          >
            {t.label}
            <span className="text-xs rounded-full px-1.5 py-0.5 font-semibold" style={tab === t.key ? { backgroundColor: '#D8E2FF', color: '#0058BE' } : { backgroundColor: '#DCD9DB', color: '#45474C' }}>{t.count}</span>
          </button>
        ))}
      </div>

      {tab === 'grades' && (
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 12px rgba(9,20,38,0.06)' }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#F5F3F4' }}>
                {['과목', '년도/학기', '점수', '평균', '등급'].map((h) => (
                  <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#45474C', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grades.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-sm" style={{ color: '#45474C' }}>성적 정보가 없습니다.</td></tr>
              ) : grades.map((g) => (
                <tr key={g.id} style={{ borderTop: '1px solid #F0EDEF' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F5F3F4' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  <td className="px-4 py-3.5 text-sm font-semibold" style={{ color: '#1B1B1D' }}>{g.subjectName}</td>
                  <td className="px-4 py-3.5 text-sm" style={{ color: '#45474C' }}>{g.year}년 {g.semester}학기</td>
                  <td className="px-4 py-3.5 text-sm" style={{ color: '#45474C' }}>{g.score}/{g.totalScore}</td>
                  <td className="px-4 py-3.5 text-sm" style={{ color: '#45474C' }}>{g.average.toFixed(1)}</td>
                  <td className="px-4 py-3.5"><Badge variant={gradeLevelColor[g.gradeLevel]}>{g.gradeLevel}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'feedbacks' && (
        <div className="space-y-4">
          {feedbacks.length === 0 ? (
            <div className="rounded-xl py-12 text-center text-sm" style={{ backgroundColor: '#FFFFFF', color: '#45474C', boxShadow: '0px 2px 8px rgba(9,20,38,0.04)' }}>공개된 피드백이 없습니다.</div>
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
