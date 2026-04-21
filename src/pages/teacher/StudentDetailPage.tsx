import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { studentApi } from '../../api/student'
import { gradeApi } from '../../api/grade'
import { studentRecordApi } from '../../api/studentRecord'
import { counselingApi } from '../../api/counseling'
import { feedbackApi } from '../../api/feedback'
import { subjectApi } from '../../api/subject'
import type {
  StudentDetailResponse,
  GradeResponse,
  StudentRecordResponse,
  CounselingResponse,
  FeedbackResponse,
  SubjectResponse,
  UpdateStudentRequest,
} from '../../types'
import Modal from '../../components/common/Modal'
import { FormField, Input, Select, Textarea } from '../../components/common/FormField'
import Badge from '../../components/common/Badge'
import GradeRadarChart from '../../components/charts/GradeRadarChart'

type Tab = 'info' | 'grades' | 'records' | 'counselings' | 'feedbacks'

const gradeLevelColor: Record<string, 'green' | 'blue' | 'yellow' | 'red' | 'gray'> = {
  A: 'green', B: 'blue', C: 'yellow', D: 'red', E: 'gray',
}
const feedbackTypeLabel: Record<string, string> = {
  GRADE: '성적', BEHAVIOR: '행동', ATTENDANCE: '출결', ATTITUDE: '태도', GENERAL: '일반',
}

// 공통 버튼 스타일 헬퍼
const btnPrimary: React.CSSProperties = { backgroundColor: '#0058BE', color: '#FFFFFF' }
const btnSecondary: React.CSSProperties = { backgroundColor: '#EAE7E9', color: '#45474C' }
const btnDanger: React.CSSProperties = { backgroundColor: '#FFDAD6', color: '#BA1A1A' }

export default function StudentDetailPage() {
  const { studentId } = useParams<{ studentId: string }>()
  const navigate = useNavigate()
  const id = Number(studentId)

  const [student, setStudent] = useState<StudentDetailResponse | null>(null)
  const [grades, setGrades] = useState<GradeResponse[]>([])
  const [records, setRecords] = useState<StudentRecordResponse[]>([])
  const [counselings, setCounselings] = useState<CounselingResponse[]>([])
  const [feedbacks, setFeedbacks] = useState<FeedbackResponse[]>([])
  const [subjects, setSubjects] = useState<SubjectResponse[]>([])
  const [tab, setTab] = useState<Tab>('info')
  const [loading, setLoading] = useState(true)

  const [editStudent, setEditStudent] = useState(false)
  const [editForm, setEditForm] = useState<UpdateStudentRequest>({ name: '', grade: 1, classNum: 1, studentNumber: 1 })

  const [gradeModal, setGradeModal] = useState(false)
  const [editGrade, setEditGrade] = useState<GradeResponse | null>(null)
  const [gradeForm, setGradeForm] = useState({ subjectId: '', year: new Date().getFullYear(), semester: 1, score: 0, totalScore: 100, note: '' })

  const [recordModal, setRecordModal] = useState(false)
  const [editRecord, setEditRecord] = useState<StudentRecordResponse | null>(null)
  const [recordForm, setRecordForm] = useState({ year: new Date().getFullYear(), semester: 1, recordDate: '', attendanceDays: 0, absenceDays: 0, lateDays: 0, earlyLeaveDays: 0, specialNote: '', volunteerHours: 0 })

  const [counselingModal, setCounselingModal] = useState(false)
  const [editCounseling, setEditCounseling] = useState<CounselingResponse | null>(null)
  const [counselingForm, setCounselingForm] = useState({ counselingDate: '', content: '', nextPlan: '', nextCounselingDate: '' })

  const [feedbackModal, setFeedbackModal] = useState(false)
  const [editFeedback, setEditFeedback] = useState<FeedbackResponse | null>(null)
  const [feedbackForm, setFeedbackForm] = useState({ feedbackType: 'GENERAL', content: '' })

  const [error, setError] = useState('')

  // 필터 상태
  const [gradeFilter, setGradeFilter] = useState<{ subjectId: string; year: string; semester: string }>({ subjectId: '', year: '', semester: '' })
  const [counselingFilter, setCounselingFilter] = useState<{ from: string; to: string }>({ from: '', to: '' })
  const [feedbackFilter, setFeedbackFilter] = useState<{ feedbackType: string; from: string; to: string }>({ feedbackType: '', from: '', to: '' })

  const loadGrades = useCallback(async (filter?: { subjectId: string; year: string; semester: string }) => {
    const f = filter ?? gradeFilter
    const params = {
      subjectId: f.subjectId ? Number(f.subjectId) : undefined,
      year: f.year ? Number(f.year) : undefined,
      semester: f.semester ? Number(f.semester) : undefined,
    }
    const hasFilter = params.subjectId || params.year || params.semester
    const res = hasFilter
      ? await gradeApi.getGradesByFilter(id, params)
      : await gradeApi.getGradesByStudent(id)
    setGrades(res.data.data)
  }, [id, gradeFilter])

  const loadCounselings = useCallback(async (filter?: { from: string; to: string }) => {
    const f = filter ?? counselingFilter
    const params = { from: f.from || undefined, to: f.to || undefined }
    const res = await counselingApi.getCounselingsByStudent(id, params)
    setCounselings(res.data.data)
  }, [id, counselingFilter])

  const loadFeedbacks = useCallback(async (filter?: { feedbackType: string; from: string; to: string }) => {
    const f = filter ?? feedbackFilter
    const res = await feedbackApi.getFeedbacks({
      studentId: id,
      feedbackType: f.feedbackType || undefined,
      from: f.from || undefined,
      to: f.to || undefined,
    })
    setFeedbacks(res.data.data)
  }, [id, feedbackFilter])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [s, g, r, c, f, sub] = await Promise.all([
        studentApi.getStudentDetail(id),
        gradeApi.getGradesByStudent(id),
        studentRecordApi.getStudentRecords(id),
        counselingApi.getCounselingsByStudent(id),
        feedbackApi.getFeedbacks({ studentId: id }),
        subjectApi.getAllSubjects(),
      ])
      setStudent(s.data.data)
      setGrades(g.data.data)
      setRecords(r.data.data)
      setCounselings(c.data.data)
      setFeedbacks(f.data.data)
      setSubjects(sub.data.data)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { load() }, [load])

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#0058BE', borderTopColor: 'transparent' }} />
          <p className="text-sm" style={{ color: '#45474C' }}>불러오는 중...</p>
        </div>
      </div>
    )
  }
  if (!student) {
    return <div className="p-8 text-sm" style={{ color: '#45474C' }}>학생 정보를 찾을 수 없습니다.</div>
  }

  const handleEditStudent = async () => {
    try {
      await studentApi.updateStudent(id, editForm)
      setEditStudent(false)
      load()
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? '수정 실패')
    }
  }

  const handleSaveGrade = async () => {
    setError('')
    try {
      if (editGrade) {
        await gradeApi.updateGrade(editGrade.id, { score: gradeForm.score, totalScore: gradeForm.totalScore, note: gradeForm.note || undefined })
      } else {
        await gradeApi.createGrade({ studentId: id, subjectId: Number(gradeForm.subjectId), year: gradeForm.year, semester: gradeForm.semester, score: gradeForm.score, totalScore: gradeForm.totalScore, note: gradeForm.note || undefined })
      }
      setGradeModal(false)
      setEditGrade(null)
      loadGrades()
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? '저장 실패')
    }
  }

  const handleDeleteGrade = async (gId: number) => {
    if (!confirm('성적을 삭제하시겠습니까?')) return
    await gradeApi.deleteGrade(gId)
    loadGrades()
  }

  const handleSaveRecord = async () => {
    setError('')
    try {
      if (editRecord) {
        await studentRecordApi.updateStudentRecord(editRecord.id, { attendanceDays: recordForm.attendanceDays, absenceDays: recordForm.absenceDays, lateDays: recordForm.lateDays, earlyLeaveDays: recordForm.earlyLeaveDays, specialNote: recordForm.specialNote || undefined, volunteerHours: recordForm.volunteerHours || undefined })
      } else {
        await studentRecordApi.createStudentRecord({ studentId: id, ...recordForm, specialNote: recordForm.specialNote || undefined, volunteerHours: recordForm.volunteerHours || undefined })
      }
      setRecordModal(false)
      setEditRecord(null)
      load()
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? '저장 실패')
    }
  }

  const handleSaveCounseling = async () => {
    setError('')
    try {
      if (editCounseling) {
        await counselingApi.updateCounseling(editCounseling.id, { content: counselingForm.content, nextPlan: counselingForm.nextPlan || undefined, nextCounselingDate: counselingForm.nextCounselingDate || undefined })
      } else {
        await counselingApi.createCounseling({ studentId: id, counselingDate: counselingForm.counselingDate, content: counselingForm.content, nextPlan: counselingForm.nextPlan || undefined, nextCounselingDate: counselingForm.nextCounselingDate || undefined })
      }
      setCounselingModal(false)
      setEditCounseling(null)
      loadCounselings()
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? '저장 실패')
    }
  }

  const handleDeleteCounseling = async (cId: number) => {
    if (!confirm('상담 내역을 삭제하시겠습니까?')) return
    await counselingApi.deleteCounseling(cId)
    loadCounselings()
  }

  const handleToggleShare = async (c: CounselingResponse) => {
    if (c.shared) await counselingApi.unshareCounseling(c.id)
    else await counselingApi.shareCounseling(c.id)
    loadCounselings()
  }

  const handleSaveFeedback = async () => {
    setError('')
    try {
      if (editFeedback) {
        await feedbackApi.updateFeedback(editFeedback.id, { feedbackType: feedbackForm.feedbackType as never, content: feedbackForm.content })
      } else {
        await feedbackApi.createFeedback({ studentId: id, feedbackType: feedbackForm.feedbackType as never, content: feedbackForm.content })
      }
      setFeedbackModal(false)
      setEditFeedback(null)
      loadFeedbacks()
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? '저장 실패')
    }
  }

  const handleDeleteFeedback = async (fId: number) => {
    if (!confirm('피드백을 삭제하시겠습니까?')) return
    await feedbackApi.deleteFeedback(fId)
    loadFeedbacks()
  }

  const handleTogglePublish = async (f: FeedbackResponse) => {
    if (f.published) await feedbackApi.unpublishFeedback(f.id)
    else await feedbackApi.publishFeedback(f.id)
    loadFeedbacks()
  }

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'info', label: '기본 정보' },
    { key: 'grades', label: '성적', count: grades.length },
    { key: 'records', label: '학생부', count: records.length },
    { key: 'counselings', label: '상담', count: counselings.length },
    { key: 'feedbacks', label: '피드백', count: feedbacks.length },
  ]

  return (
    <div className="p-8">
      {/* 헤더 */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/students')}
          className="flex items-center gap-1.5 text-sm font-medium mb-5 transition-colors"
          style={{ color: '#45474C' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#1B1B1D' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#45474C' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          학생 목록으로
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold font-display flex-shrink-0"
              style={{ backgroundColor: '#D8E2FF', color: '#0058BE' }}
            >
              {student.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display" style={{ color: '#1B1B1D' }}>{student.name}</h1>
              <p className="text-sm mt-0.5" style={{ color: '#45474C' }}>
                {student.grade}학년 {student.classNum}반 {student.studentNumber}번
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditForm({ name: student.name, grade: student.grade, classNum: student.classNum, studentNumber: student.studentNumber, phone: student.phone, address: student.address })
              setEditStudent(true)
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
            style={btnSecondary}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            정보 수정
          </button>
        </div>
      </div>

      {/* 탭 */}
      <div
        className="flex gap-0.5 rounded-xl p-1 mb-6 overflow-x-auto"
        style={{ backgroundColor: '#EAE7E9' }}
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all"
            style={
              tab === t.key
                ? { backgroundColor: '#FFFFFF', color: '#091426', boxShadow: '0px 1px 4px rgba(9,20,38,0.1)' }
                : { color: '#45474C' }
            }
          >
            {t.label}
            {t.count !== undefined && (
              <span
                className="text-xs rounded-full px-1.5 py-0.5 font-semibold"
                style={
                  tab === t.key
                    ? { backgroundColor: '#D8E2FF', color: '#0058BE' }
                    : { backgroundColor: '#DCD9DB', color: '#45474C' }
                }
              >
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      {tab === 'info' && (
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-xl p-6" style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 12px rgba(9,20,38,0.06)' }}>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#45474C', letterSpacing: '0.08em' }}>기본 정보</h3>
            <dl className="space-y-4">
              {[
                ['아이디', student.username],
                ['이메일', student.email],
                ['학년/반/번호', `${student.grade}학년 ${student.classNum}반 ${student.studentNumber}번`],
                ['연락처', student.phone ?? '-'],
                ['주소', student.address ?? '-'],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-4">
                  <dt className="w-28 text-xs font-medium flex-shrink-0 pt-0.5" style={{ color: '#45474C' }}>{label}</dt>
                  <dd className="text-sm font-semibold" style={{ color: '#1B1B1D' }}>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="rounded-xl p-6" style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 12px rgba(9,20,38,0.06)' }}>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#45474C', letterSpacing: '0.08em' }}>과목별 성적 차트</h3>
            <GradeRadarChart grades={grades} />
          </div>
        </div>
      )}

      {tab === 'grades' && (
        <div>
          {/* 성적 필터 */}
          <div className="rounded-xl p-4 mb-4 flex flex-wrap items-end gap-3" style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 8px rgba(9,20,38,0.04)' }}>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: '#45474C' }}>과목</label>
              <select
                className="rounded-lg px-3 py-2 text-sm border"
                style={{ borderColor: '#DCD9DB', color: '#1B1B1D', backgroundColor: '#FFFFFF' }}
                value={gradeFilter.subjectId}
                onChange={(e) => setGradeFilter((f) => ({ ...f, subjectId: e.target.value }))}
              >
                <option value="">전체 과목</option>
                {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: '#45474C' }}>년도</label>
              <input
                type="number"
                className="rounded-lg px-3 py-2 text-sm border w-24"
                style={{ borderColor: '#DCD9DB', color: '#1B1B1D' }}
                placeholder="예) 2025"
                value={gradeFilter.year}
                onChange={(e) => setGradeFilter((f) => ({ ...f, year: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: '#45474C' }}>학기</label>
              <select
                className="rounded-lg px-3 py-2 text-sm border"
                style={{ borderColor: '#DCD9DB', color: '#1B1B1D', backgroundColor: '#FFFFFF' }}
                value={gradeFilter.semester}
                onChange={(e) => setGradeFilter((f) => ({ ...f, semester: e.target.value }))}
              >
                <option value="">전체</option>
                <option value="1">1학기</option>
                <option value="2">2학기</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => loadGrades(gradeFilter)}
                className="px-4 py-2 rounded-lg text-sm font-semibold"
                style={btnPrimary}
              >검색</button>
              <button
                onClick={() => {
                  const reset = { subjectId: '', year: '', semester: '' }
                  setGradeFilter(reset)
                  loadGrades(reset)
                }}
                className="px-4 py-2 rounded-lg text-sm font-semibold"
                style={btnSecondary}
              >초기화</button>
            </div>
            <div className="flex justify-end flex-1">
              <button
                onClick={() => {
                  setEditGrade(null)
                  setGradeForm({ subjectId: String(subjects[0]?.id ?? ''), year: new Date().getFullYear(), semester: 1, score: 0, totalScore: 100, note: '' })
                  setGradeModal(true)
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold"
                style={btnPrimary}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                성적 등록
              </button>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 12px rgba(9,20,38,0.06)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#F5F3F4' }}>
                  {['과목', '년도/학기', '점수', '평균', '등급', '비고', ''].map((h) => (
                    <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#45474C', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grades.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-sm" style={{ color: '#45474C' }}>등록된 성적이 없습니다.</td></tr>
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
                    <td className="px-4 py-3.5 text-sm" style={{ color: '#45474C' }}>{g.note ?? '-'}</td>
                    <td className="px-4 py-3.5 text-right space-x-3">
                      <button onClick={() => { setEditGrade(g); setGradeForm({ subjectId: String(g.subjectId), year: g.year, semester: g.semester, score: g.score, totalScore: g.totalScore, note: g.note ?? '' }); setGradeModal(true) }} className="text-xs font-semibold" style={{ color: '#0058BE' }}>수정</button>
                      <button onClick={() => handleDeleteGrade(g.id)} className="text-xs font-semibold" style={{ color: '#BA1A1A' }}>삭제</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'records' && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => { setEditRecord(null); setRecordForm({ year: new Date().getFullYear(), semester: 1, recordDate: '', attendanceDays: 0, absenceDays: 0, lateDays: 0, earlyLeaveDays: 0, specialNote: '', volunteerHours: 0 }); setRecordModal(true) }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold"
              style={btnPrimary}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              학생부 등록
            </button>
          </div>
          <div className="space-y-4">
            {records.length === 0 ? (
              <div className="rounded-xl py-12 text-center text-sm" style={{ backgroundColor: '#FFFFFF', color: '#45474C', boxShadow: '0px 2px 8px rgba(9,20,38,0.04)' }}>등록된 학생부가 없습니다.</div>
            ) : records.map((r) => (
              <div key={r.id} className="rounded-xl p-5" style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 8px rgba(9,20,38,0.04)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold font-display" style={{ color: '#1B1B1D' }}>{r.year}년 {r.semester}학기</h4>
                  <button
                    onClick={() => { setEditRecord(r); setRecordForm({ year: r.year, semester: r.semester, recordDate: r.recordDate, attendanceDays: r.attendanceDays, absenceDays: r.absenceDays, lateDays: r.lateDays, earlyLeaveDays: r.earlyLeaveDays, specialNote: r.specialNote ?? '', volunteerHours: r.volunteerHours ?? 0 }); setRecordModal(true) }}
                    className="text-xs font-semibold" style={{ color: '#0058BE' }}
                  >수정</button>
                </div>
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
                {r.volunteerHours !== undefined && r.volunteerHours > 0 && (
                  <p className="mt-3 text-xs" style={{ color: '#45474C' }}>봉사시간: <span className="font-semibold" style={{ color: '#1B1B1D' }}>{r.volunteerHours}시간</span></p>
                )}
                {r.specialNote && (
                  <p className="mt-3 text-xs rounded-lg p-3" style={{ color: '#1B1B1D', backgroundColor: '#F5F3F4' }}>{r.specialNote}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'counselings' && (
        <div>
          {/* 상담 필터 */}
          <div className="rounded-xl p-4 mb-4 flex flex-wrap items-end gap-3" style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 8px rgba(9,20,38,0.04)' }}>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: '#45474C' }}>시작일</label>
              <input
                type="date"
                className="rounded-lg px-3 py-2 text-sm border"
                style={{ borderColor: '#DCD9DB', color: '#1B1B1D' }}
                value={counselingFilter.from}
                onChange={(e) => setCounselingFilter((f) => ({ ...f, from: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: '#45474C' }}>종료일</label>
              <input
                type="date"
                className="rounded-lg px-3 py-2 text-sm border"
                style={{ borderColor: '#DCD9DB', color: '#1B1B1D' }}
                value={counselingFilter.to}
                onChange={(e) => setCounselingFilter((f) => ({ ...f, to: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => loadCounselings(counselingFilter)}
                className="px-4 py-2 rounded-lg text-sm font-semibold"
                style={btnPrimary}
              >검색</button>
              <button
                onClick={() => {
                  const reset = { from: '', to: '' }
                  setCounselingFilter(reset)
                  loadCounselings(reset)
                }}
                className="px-4 py-2 rounded-lg text-sm font-semibold"
                style={btnSecondary}
              >초기화</button>
            </div>
            <div className="flex justify-end flex-1">
              <button
                onClick={() => { setEditCounseling(null); setCounselingForm({ counselingDate: '', content: '', nextPlan: '', nextCounselingDate: '' }); setCounselingModal(true) }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold"
                style={btnPrimary}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                상담 등록
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {counselings.length === 0 ? (
              <div className="rounded-xl py-12 text-center text-sm" style={{ backgroundColor: '#FFFFFF', color: '#45474C', boxShadow: '0px 2px 8px rgba(9,20,38,0.04)' }}>상담 내역이 없습니다.</div>
            ) : counselings.map((c) => (
              <div key={c.id} className="rounded-xl p-5" style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 8px rgba(9,20,38,0.04)' }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-bold font-display" style={{ color: '#1B1B1D' }}>{c.counselingDate}</span>
                      {c.shared && <Badge variant="green">공유됨</Badge>}
                    </div>
                    <p className="text-sm whitespace-pre-wrap" style={{ color: '#1B1B1D' }}>{c.content}</p>
                    {c.nextPlan && (
                      <p className="mt-3 text-xs rounded-lg p-3" style={{ color: '#0058BE', backgroundColor: '#D8E2FF20', border: '1px solid #D8E2FF' }}>다음 상담 계획: {c.nextPlan}</p>
                    )}
                    {c.nextCounselingDate && (
                      <p className="mt-2 text-xs" style={{ color: '#45474C' }}>다음 상담 일정: {c.nextCounselingDate}</p>
                    )}
                    <p className="mt-2 text-xs" style={{ color: '#75777D' }}>담당: {c.teacherName}</p>
                  </div>
                  <div className="flex gap-2 ml-4 flex-shrink-0">
                    <button
                      onClick={() => handleToggleShare(c)}
                      className="text-xs font-medium px-2.5 py-1 rounded-full transition-all"
                      style={c.shared
                        ? { backgroundColor: '#D4EDDA', color: '#1A6B3C' }
                        : { backgroundColor: '#EAE7E9', color: '#45474C' }
                      }
                    >
                      {c.shared ? '공유 해제' : '공유'}
                    </button>
                    <button onClick={() => { setEditCounseling(c); setCounselingForm({ counselingDate: c.counselingDate, content: c.content, nextPlan: c.nextPlan ?? '', nextCounselingDate: c.nextCounselingDate ?? '' }); setCounselingModal(true) }} className="text-xs font-semibold" style={{ color: '#0058BE' }}>수정</button>
                    <button onClick={() => handleDeleteCounseling(c.id)} className="text-xs font-semibold" style={{ color: '#BA1A1A' }}>삭제</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'feedbacks' && (
        <div>
          {/* 피드백 필터 */}
          <div className="rounded-xl p-4 mb-4 flex flex-wrap items-end gap-3" style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 8px rgba(9,20,38,0.04)' }}>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: '#45474C' }}>유형</label>
              <select
                className="rounded-lg px-3 py-2 text-sm border"
                style={{ borderColor: '#DCD9DB', color: '#1B1B1D', backgroundColor: '#FFFFFF' }}
                value={feedbackFilter.feedbackType}
                onChange={(e) => setFeedbackFilter((f) => ({ ...f, feedbackType: e.target.value }))}
              >
                <option value="">전체 유형</option>
                {Object.entries(feedbackTypeLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: '#45474C' }}>시작일</label>
              <input
                type="date"
                className="rounded-lg px-3 py-2 text-sm border"
                style={{ borderColor: '#DCD9DB', color: '#1B1B1D' }}
                value={feedbackFilter.from}
                onChange={(e) => setFeedbackFilter((f) => ({ ...f, from: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: '#45474C' }}>종료일</label>
              <input
                type="date"
                className="rounded-lg px-3 py-2 text-sm border"
                style={{ borderColor: '#DCD9DB', color: '#1B1B1D' }}
                value={feedbackFilter.to}
                onChange={(e) => setFeedbackFilter((f) => ({ ...f, to: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => loadFeedbacks(feedbackFilter)}
                className="px-4 py-2 rounded-lg text-sm font-semibold"
                style={btnPrimary}
              >검색</button>
              <button
                onClick={() => {
                  const reset = { feedbackType: '', from: '', to: '' }
                  setFeedbackFilter(reset)
                  loadFeedbacks(reset)
                }}
                className="px-4 py-2 rounded-lg text-sm font-semibold"
                style={btnSecondary}
              >초기화</button>
            </div>
            <div className="flex justify-end flex-1">
              <button
                onClick={() => { setEditFeedback(null); setFeedbackForm({ feedbackType: 'GENERAL', content: '' }); setFeedbackModal(true) }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold"
                style={btnPrimary}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                피드백 작성
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {feedbacks.length === 0 ? (
              <div className="rounded-xl py-12 text-center text-sm" style={{ backgroundColor: '#FFFFFF', color: '#45474C', boxShadow: '0px 2px 8px rgba(9,20,38,0.04)' }}>작성된 피드백이 없습니다.</div>
            ) : feedbacks.map((f) => (
              <div key={f.id} className="rounded-xl p-5" style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 8px rgba(9,20,38,0.04)' }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="blue">{feedbackTypeLabel[f.feedbackType]}</Badge>
                      {f.published ? <Badge variant="green">공개</Badge> : <Badge variant="gray">비공개</Badge>}
                    </div>
                    <p className="text-sm whitespace-pre-wrap" style={{ color: '#1B1B1D' }}>{f.content}</p>
                    <p className="mt-2 text-xs" style={{ color: '#75777D' }}>담당: {f.teacherName} · {f.createdAt?.slice(0, 10)}</p>
                  </div>
                  <div className="flex gap-2 ml-4 flex-shrink-0">
                    <button
                      onClick={() => handleTogglePublish(f)}
                      className="text-xs font-medium px-2.5 py-1 rounded-full transition-all"
                      style={f.published
                        ? { backgroundColor: '#D4EDDA', color: '#1A6B3C' }
                        : { backgroundColor: '#EAE7E9', color: '#45474C' }
                      }
                    >
                      {f.published ? '비공개' : '공개'}
                    </button>
                    <button onClick={() => { setEditFeedback(f); setFeedbackForm({ feedbackType: f.feedbackType, content: f.content }); setFeedbackModal(true) }} className="text-xs font-semibold" style={{ color: '#0058BE' }}>수정</button>
                    <button onClick={() => handleDeleteFeedback(f.id)} className="text-xs font-semibold" style={{ color: '#BA1A1A' }}>삭제</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 모달: 학생 정보 수정 */}
      <Modal isOpen={editStudent} onClose={() => setEditStudent(false)} title="학생 정보 수정">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="이름" required><Input value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} /></FormField>
            <FormField label="학년" required><Input type="number" min={1} value={editForm.grade} onChange={(e) => setEditForm((f) => ({ ...f, grade: Number(e.target.value) }))} /></FormField>
            <FormField label="반" required><Input type="number" min={1} value={editForm.classNum} onChange={(e) => setEditForm((f) => ({ ...f, classNum: Number(e.target.value) }))} /></FormField>
            <FormField label="번호" required><Input type="number" min={1} value={editForm.studentNumber} onChange={(e) => setEditForm((f) => ({ ...f, studentNumber: Number(e.target.value) }))} /></FormField>
            <FormField label="연락처"><Input value={editForm.phone ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))} /></FormField>
            <FormField label="주소"><Input value={editForm.address ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))} /></FormField>
          </div>
          {error && <div className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: '#FFDAD6', color: '#BA1A1A' }}>{error}</div>}
          <div className="flex gap-3 pt-2">
            <button onClick={handleEditStudent} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={btnPrimary}>저장</button>
            <button onClick={() => setEditStudent(false)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={btnSecondary}>취소</button>
          </div>
        </div>
      </Modal>

      {/* 모달: 성적 */}
      <Modal isOpen={gradeModal} onClose={() => setGradeModal(false)} title={editGrade ? '성적 수정' : '성적 등록'}>
        <div className="space-y-4">
          {!editGrade && (
            <FormField label="과목" required>
              <Select value={gradeForm.subjectId} onChange={(e) => setGradeForm((f) => ({ ...f, subjectId: e.target.value }))}>
                <option value="">과목 선택</option>
                {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </Select>
            </FormField>
          )}
          <div className="grid grid-cols-2 gap-4">
            {!editGrade && <>
              <FormField label="년도" required><Input type="number" value={gradeForm.year} onChange={(e) => setGradeForm((f) => ({ ...f, year: Number(e.target.value) }))} /></FormField>
              <FormField label="학기" required>
                <Select value={gradeForm.semester} onChange={(e) => setGradeForm((f) => ({ ...f, semester: Number(e.target.value) }))}>
                  <option value={1}>1학기</option><option value={2}>2학기</option>
                </Select>
              </FormField>
            </>}
            <FormField label="점수" required><Input type="number" min={0} value={gradeForm.score} onChange={(e) => setGradeForm((f) => ({ ...f, score: Number(e.target.value) }))} /></FormField>
            <FormField label="총점" required><Input type="number" min={1} value={gradeForm.totalScore} onChange={(e) => setGradeForm((f) => ({ ...f, totalScore: Number(e.target.value) }))} /></FormField>
          </div>
          <FormField label="비고"><Input value={gradeForm.note} onChange={(e) => setGradeForm((f) => ({ ...f, note: e.target.value }))} /></FormField>
          {error && <div className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: '#FFDAD6', color: '#BA1A1A' }}>{error}</div>}
          <div className="flex gap-3 pt-2">
            <button onClick={handleSaveGrade} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={btnPrimary}>저장</button>
            <button onClick={() => setGradeModal(false)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={btnSecondary}>취소</button>
          </div>
        </div>
      </Modal>

      {/* 모달: 학생부 */}
      <Modal isOpen={recordModal} onClose={() => setRecordModal(false)} title={editRecord ? '학생부 수정' : '학생부 등록'}>
        <div className="space-y-4">
          {!editRecord && (
            <div className="grid grid-cols-3 gap-4">
              <FormField label="년도" required><Input type="number" value={recordForm.year} onChange={(e) => setRecordForm((f) => ({ ...f, year: Number(e.target.value) }))} /></FormField>
              <FormField label="학기" required>
                <Select value={recordForm.semester} onChange={(e) => setRecordForm((f) => ({ ...f, semester: Number(e.target.value) }))}>
                  <option value={1}>1학기</option><option value={2}>2학기</option>
                </Select>
              </FormField>
              <FormField label="작성일" required><Input type="date" value={recordForm.recordDate} onChange={(e) => setRecordForm((f) => ({ ...f, recordDate: e.target.value }))} /></FormField>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="출석일수"><Input type="number" min={0} value={recordForm.attendanceDays} onChange={(e) => setRecordForm((f) => ({ ...f, attendanceDays: Number(e.target.value) }))} /></FormField>
            <FormField label="결석일수"><Input type="number" min={0} value={recordForm.absenceDays} onChange={(e) => setRecordForm((f) => ({ ...f, absenceDays: Number(e.target.value) }))} /></FormField>
            <FormField label="지각횟수"><Input type="number" min={0} value={recordForm.lateDays} onChange={(e) => setRecordForm((f) => ({ ...f, lateDays: Number(e.target.value) }))} /></FormField>
            <FormField label="조퇴횟수"><Input type="number" min={0} value={recordForm.earlyLeaveDays} onChange={(e) => setRecordForm((f) => ({ ...f, earlyLeaveDays: Number(e.target.value) }))} /></FormField>
            <FormField label="봉사시간"><Input type="number" min={0} value={recordForm.volunteerHours} onChange={(e) => setRecordForm((f) => ({ ...f, volunteerHours: Number(e.target.value) }))} /></FormField>
          </div>
          <FormField label="특기사항"><Textarea rows={3} value={recordForm.specialNote} onChange={(e) => setRecordForm((f) => ({ ...f, specialNote: e.target.value }))} /></FormField>
          {error && <div className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: '#FFDAD6', color: '#BA1A1A' }}>{error}</div>}
          <div className="flex gap-3 pt-2">
            <button onClick={handleSaveRecord} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={btnPrimary}>저장</button>
            <button onClick={() => setRecordModal(false)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={btnSecondary}>취소</button>
          </div>
        </div>
      </Modal>

      {/* 모달: 상담 */}
      <Modal isOpen={counselingModal} onClose={() => setCounselingModal(false)} title={editCounseling ? '상담 수정' : '상담 등록'}>
        <div className="space-y-4">
          {!editCounseling && (
            <FormField label="상담 날짜" required><Input type="date" value={counselingForm.counselingDate} onChange={(e) => setCounselingForm((f) => ({ ...f, counselingDate: e.target.value }))} /></FormField>
          )}
          <FormField label="상담 내용" required>
            <Textarea rows={4} value={counselingForm.content} onChange={(e) => setCounselingForm((f) => ({ ...f, content: e.target.value }))} placeholder="상담 내용을 입력하세요" />
          </FormField>
          <FormField label="다음 상담 계획">
            <Textarea rows={2} value={counselingForm.nextPlan} onChange={(e) => setCounselingForm((f) => ({ ...f, nextPlan: e.target.value }))} />
          </FormField>
          <FormField label="다음 상담 날짜">
            <Input type="date" value={counselingForm.nextCounselingDate} onChange={(e) => setCounselingForm((f) => ({ ...f, nextCounselingDate: e.target.value }))} />
          </FormField>
          {error && <div className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: '#FFDAD6', color: '#BA1A1A' }}>{error}</div>}
          <div className="flex gap-3 pt-2">
            <button onClick={handleSaveCounseling} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={btnPrimary}>저장</button>
            <button onClick={() => setCounselingModal(false)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={btnSecondary}>취소</button>
          </div>
        </div>
      </Modal>

      {/* 모달: 피드백 */}
      <Modal isOpen={feedbackModal} onClose={() => setFeedbackModal(false)} title={editFeedback ? '피드백 수정' : '피드백 작성'}>
        <div className="space-y-4">
          <FormField label="피드백 유형" required>
            <Select value={feedbackForm.feedbackType} onChange={(e) => setFeedbackForm((f) => ({ ...f, feedbackType: e.target.value }))}>
              {Object.entries(feedbackTypeLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </Select>
          </FormField>
          <FormField label="내용" required>
            <Textarea rows={5} value={feedbackForm.content} onChange={(e) => setFeedbackForm((f) => ({ ...f, content: e.target.value }))} placeholder="피드백 내용을 입력하세요" />
          </FormField>
          {error && <div className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: '#FFDAD6', color: '#BA1A1A' }}>{error}</div>}
          <div className="flex gap-3 pt-2">
            <button onClick={handleSaveFeedback} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={btnPrimary}>저장</button>
            <button onClick={() => setFeedbackModal(false)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={btnSecondary}>취소</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
