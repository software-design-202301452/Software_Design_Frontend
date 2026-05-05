import { useState, useRef } from 'react'
import { studentApi } from '../../api/student'
import { reportApi } from '../../api/report'
import type {
  StudentSummaryResponse,
  GradeReportResponse,
  CounselingReportResponse,
  FeedbackReportResponse,
} from '../../types'

type ReportType = 'grade' | 'counseling' | 'feedback'

export default function ReportPage() {
  const [students, setStudents] = useState<StudentSummaryResponse[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null)
  const [reportType, setReportType] = useState<ReportType>('grade')
  const [gradeReport, setGradeReport] = useState<GradeReportResponse | null>(null)
  const [counselingReport, setCounselingReport] = useState<CounselingReportResponse | null>(null)
  const [feedbackReport, setFeedbackReport] = useState<FeedbackReportResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [studentsLoaded, setStudentsLoaded] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  const loadStudents = async () => {
    if (studentsLoaded) return
    try {
      const res = await studentApi.getStudents()
      setStudents(res.data.data)
      setStudentsLoaded(true)
    } catch {
      alert('학생 목록 조회에 실패했습니다.')
    }
  }

  const fetchReport = async () => {
    if (!selectedStudentId) {
      alert('학생을 선택해주세요.')
      return
    }
    setLoading(true)
    setGradeReport(null)
    setCounselingReport(null)
    setFeedbackReport(null)
    try {
      if (reportType === 'grade') {
        const res = await reportApi.getGradeReport(selectedStudentId)
        setGradeReport(res.data.data)
      } else if (reportType === 'counseling') {
        const res = await reportApi.getCounselingReport(selectedStudentId)
        setCounselingReport(res.data.data)
      } else {
        const res = await reportApi.getFeedbackReport(selectedStudentId)
        setFeedbackReport(res.data.data)
      }
    } catch {
      alert('보고서 조회에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const exportPdf = async () => {
    if (!reportRef.current) return
    const html2canvas = (await import('html2canvas')).default
    const { default: jsPDF } = await import('jspdf')

    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#1E293B',
    })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageW = pdf.internal.pageSize.getWidth()
    const pageH = pdf.internal.pageSize.getHeight()
    const imgW = pageW
    const imgH = (canvas.height * imgW) / canvas.width

    let posY = 0
    while (posY < imgH) {
      if (posY > 0) pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, -posY, imgW, imgH)
      posY += pageH
    }

    const studentName = gradeReport?.studentName ?? counselingReport?.studentName ?? feedbackReport?.studentName ?? ''
    const prefix = gradeReport ? '성적보고서' : counselingReport ? '상담보고서' : '피드백보고서'
    pdf.save(`${prefix}_${studentName}.pdf`)
  }

  const exportGradeExcel = async () => {
    if (!gradeReport) return
    const XLSX = await import('xlsx')
    const ws = XLSX.utils.json_to_sheet(
      gradeReport.grades.map(g => ({
        과목: g.subjectName,
        년도: g.year,
        학기: g.semester,
        점수: g.score,
        총점: g.totalScore,
        평균: g.average,
        등급: g.gradeLevel,
      }))
    )
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '성적')
    XLSX.writeFile(wb, `성적보고서_${gradeReport.studentName}.xlsx`)
  }


  const exportCounselingExcel = async () => {
    if (!counselingReport) return
    const XLSX = await import('xlsx')
    const ws = XLSX.utils.json_to_sheet(
      counselingReport.counselings.map(c => ({
        상담일: c.counselingDate,
        교사: c.teacherName,
        내용: c.content,
        다음계획: c.nextPlan ?? '',
        다음상담일: c.nextCounselingDate ?? '',
      }))
    )
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '상담기록')
    XLSX.writeFile(wb, `상담보고서_${counselingReport.studentName}.xlsx`)
  }


  const exportFeedbackExcel = async () => {
    if (!feedbackReport) return
    const XLSX = await import('xlsx')
    const ws = XLSX.utils.json_to_sheet(
      feedbackReport.feedbacks.map(f => ({
        유형: f.feedbackType,
        교사: f.teacherName,
        내용: f.content,
        공개여부: f.published ? '공개' : '비공개',
        작성일: f.createdAt.substring(0, 10),
      }))
    )
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '피드백')
    XLSX.writeFile(wb, `피드백보고서_${feedbackReport.studentName}.xlsx`)
  }

  const currentReport = gradeReport || counselingReport || feedbackReport

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">보고서 생성</h1>

      {/* 설정 패널 */}
      <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: '#1E293B' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 학생 선택 */}
          <div>
            <label className="block text-sm font-medium text-[#BCC7DE] mb-2">학생 선택</label>
            <select
              className="w-full rounded-lg px-3 py-2 text-sm text-white border border-[#334155] focus:outline-none focus:border-[#0058BE]"
              style={{ backgroundColor: '#0F172A' }}
              value={selectedStudentId ?? ''}
              onFocus={loadStudents}
              onChange={e => setSelectedStudentId(Number(e.target.value) || null)}
            >
              <option value="">학생을 선택하세요</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.grade}학년 {s.classNum}반 {s.studentNumber}번 {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* 보고서 유형 */}
          <div>
            <label className="block text-sm font-medium text-[#BCC7DE] mb-2">보고서 유형</label>
            <select
              className="w-full rounded-lg px-3 py-2 text-sm text-white border border-[#334155] focus:outline-none focus:border-[#0058BE]"
              style={{ backgroundColor: '#0F172A' }}
              value={reportType}
              onChange={e => setReportType(e.target.value as ReportType)}
            >
              <option value="grade">성적 분석</option>
              <option value="counseling">상담 기록</option>
              <option value="feedback">피드백 요약</option>
            </select>
          </div>

          {/* 조회 버튼 */}
          <div className="flex items-end">
            <button
              onClick={fetchReport}
              disabled={loading}
              className="w-full py-2 px-4 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-50"
              style={{ backgroundColor: '#0058BE' }}
            >
              {loading ? '조회 중...' : '보고서 조회'}
            </button>
          </div>
        </div>
      </div>

      {/* 보고서 결과 */}
      {currentReport && (
        <div ref={reportRef} className="rounded-xl p-6" style={{ backgroundColor: '#1E293B' }}>
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">
                {gradeReport && '성적 분석 보고서'}
                {counselingReport && '상담 기록 보고서'}
                {feedbackReport && '피드백 요약 보고서'}
              </h2>
              <p className="text-sm text-[#8590A6] mt-1">
                {gradeReport && `${gradeReport.studentName} · 생성일: ${gradeReport.generatedAt} · 전체 평균: ${gradeReport.overallAverage.toFixed(1)}점`}
                {counselingReport && `${counselingReport.studentName} · 생성일: ${counselingReport.generatedAt} · 총 ${counselingReport.totalCount}건`}
                {feedbackReport && `${feedbackReport.studentName} · 생성일: ${feedbackReport.generatedAt} · 총 ${feedbackReport.totalCount}건`}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportPdf}
                className="flex items-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium text-white transition-all"
                style={{ backgroundColor: '#DC2626' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                PDF
              </button>
              <button
                onClick={gradeReport ? exportGradeExcel : counselingReport ? exportCounselingExcel : exportFeedbackExcel}
                className="flex items-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium text-white transition-all"
                style={{ backgroundColor: '#16A34A' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
                Excel
              </button>
            </div>
          </div>

          {/* 성적 보고서 테이블 */}
          {gradeReport && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid #334155' }}>
                    {['과목', '년도', '학기', '점수', '총점', '평균', '등급'].map(h => (
                      <th key={h} className="text-left py-3 px-3 text-[#8590A6] font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {gradeReport.grades.map((g, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #1E293B' }} className="hover:bg-white/5">
                      <td className="py-3 px-3 text-white">{g.subjectName}</td>
                      <td className="py-3 px-3 text-[#BCC7DE]">{g.year}</td>
                      <td className="py-3 px-3 text-[#BCC7DE]">{g.semester}학기</td>
                      <td className="py-3 px-3 text-[#BCC7DE]">{g.score}</td>
                      <td className="py-3 px-3 text-[#BCC7DE]">{g.totalScore}</td>
                      <td className="py-3 px-3 text-[#BCC7DE]">{g.average.toFixed(1)}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          g.gradeLevel === 'A' ? 'bg-green-900 text-green-300' :
                          g.gradeLevel === 'B' ? 'bg-blue-900 text-blue-300' :
                          g.gradeLevel === 'C' ? 'bg-yellow-900 text-yellow-300' :
                          g.gradeLevel === 'D' ? 'bg-orange-900 text-orange-300' :
                          'bg-red-900 text-red-300'
                        }`}>{g.gradeLevel}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {gradeReport.grades.length === 0 && (
                <p className="text-center text-[#8590A6] py-8">성적 데이터가 없습니다.</p>
              )}
            </div>
          )}

          {/* 상담 보고서 테이블 */}
          {counselingReport && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid #334155' }}>
                    {['상담일', '담당 교사', '내용', '다음 계획', '다음 상담일'].map(h => (
                      <th key={h} className="text-left py-3 px-3 text-[#8590A6] font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {counselingReport.counselings.map((c, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #1E293B' }} className="hover:bg-white/5">
                      <td className="py-3 px-3 text-[#BCC7DE] whitespace-nowrap">{c.counselingDate}</td>
                      <td className="py-3 px-3 text-white whitespace-nowrap">{c.teacherName}</td>
                      <td className="py-3 px-3 text-[#BCC7DE] max-w-xs truncate">{c.content}</td>
                      <td className="py-3 px-3 text-[#BCC7DE] max-w-xs truncate">{c.nextPlan ?? '-'}</td>
                      <td className="py-3 px-3 text-[#BCC7DE] whitespace-nowrap">{c.nextCounselingDate ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {counselingReport.counselings.length === 0 && (
                <p className="text-center text-[#8590A6] py-8">상담 기록이 없습니다.</p>
              )}
            </div>
          )}

          {/* 피드백 보고서 */}
          {feedbackReport && (
            <div>
              {/* 타입별 요약 */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                {Object.entries(feedbackReport.typeCountMap).map(([type, count]) => (
                  <div key={type} className="rounded-lg p-3 text-center" style={{ backgroundColor: '#0F172A' }}>
                    <p className="text-xs text-[#8590A6] mb-1">{type}</p>
                    <p className="text-xl font-bold text-white">{count}</p>
                  </div>
                ))}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #334155' }}>
                      {['유형', '교사', '내용', '공개여부', '작성일'].map(h => (
                        <th key={h} className="text-left py-3 px-3 text-[#8590A6] font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {feedbackReport.feedbacks.map((f, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #1E293B' }} className="hover:bg-white/5">
                        <td className="py-3 px-3 text-[#BCC7DE] whitespace-nowrap">{f.feedbackType}</td>
                        <td className="py-3 px-3 text-white whitespace-nowrap">{f.teacherName}</td>
                        <td className="py-3 px-3 text-[#BCC7DE] max-w-xs truncate">{f.content}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            f.published ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'
                          }`}>
                            {f.published ? '공개' : '비공개'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-[#BCC7DE] whitespace-nowrap">{f.createdAt.substring(0, 10)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {feedbackReport.feedbacks.length === 0 && (
                  <p className="text-center text-[#8590A6] py-8">피드백 데이터가 없습니다.</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
