import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { studentApi } from '../../api/student'
import type { StudentSummaryResponse, RegisterStudentRequest } from '../../types'
import PageHeader from '../../components/common/PageHeader'
import Modal from '../../components/common/Modal'
import { FormField, Input } from '../../components/common/FormField'

export default function StudentListPage() {
  const navigate = useNavigate()
  const [students, setStudents] = useState<StudentSummaryResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ name: '', grade: '', classNum: '', studentNumber: '' })
  const [showRegister, setShowRegister] = useState(false)
  const [regForm, setRegForm] = useState<RegisterStudentRequest & { passwordInput: string }>({
    username: '', passwordInput: '', password: '', name: '', email: '',
    grade: 1, classNum: 1, studentNumber: 1, phone: '', address: '',
  })
  const [regError, setRegError] = useState('')
  const [regLoading, setRegLoading] = useState(false)

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const params = {
        name: filter.name || undefined,
        grade: filter.grade ? Number(filter.grade) : undefined,
        classNum: filter.classNum ? Number(filter.classNum) : undefined,
        studentNumber: filter.studentNumber ? Number(filter.studentNumber) : undefined,
      }
      const res = await studentApi.getStudents(params)
      setStudents(res.data.data)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStudents() }, [])

  const handleRegister = async () => {
    setRegError('')
    setRegLoading(true)
    try {
      await studentApi.registerStudent({
        ...regForm,
        password: regForm.passwordInput,
        phone: regForm.phone || undefined,
        address: regForm.address || undefined,
      })
      setShowRegister(false)
      setRegForm({ username: '', passwordInput: '', password: '', name: '', email: '', grade: 1, classNum: 1, studentNumber: 1, phone: '', address: '' })
      fetchStudents()
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? '등록 실패'
      setRegError(msg)
    } finally {
      setRegLoading(false)
    }
  }

  const setReg = (key: string, val: string | number) =>
    setRegForm((f) => ({ ...f, [key]: val }))

  return (
    <div className="p-8">
      <PageHeader
        title="학생 관리"
        subtitle="등록된 학생 목록을 조회하고 관리합니다."
        action={
          <button
            onClick={() => setShowRegister(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
            style={{ backgroundColor: '#0058BE', color: '#FFFFFF' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#004493' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0058BE' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            학생 등록
          </button>
        }
      />

      {/* 필터 영역 */}
      <div
        className="rounded-xl p-5 mb-6 flex gap-4 items-end flex-wrap"
        style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 8px rgba(9, 20, 38, 0.04)' }}
      >
        {/* CEW-52: 이름 검색 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#45474C', letterSpacing: '0.05em' }}>이름</label>
          <input
            type="text"
            value={filter.name}
            onChange={(e) => setFilter((f) => ({ ...f, name: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && fetchStudents()}
            placeholder="학생 이름"
            className="w-32 px-3 py-2.5 rounded text-sm outline-none transition-all"
            style={{ backgroundColor: '#F5F3F4', border: 'none', borderBottom: '2px solid transparent', color: '#1B1B1D' }}
            onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#0058BE'; e.currentTarget.style.backgroundColor = '#FFFFFF' }}
            onBlur={(e) => { e.currentTarget.style.borderBottomColor = 'transparent'; e.currentTarget.style.backgroundColor = '#F5F3F4' }}
          />
        </div>
        {/* CEW-53: 학년/반/번호 필터 */}
        {[
          { key: 'grade', label: '학년', placeholder: '예: 1' },
          { key: 'classNum', label: '반', placeholder: '예: 3' },
          { key: 'studentNumber', label: '번호', placeholder: '예: 12' },
        ].map(({ key, label, placeholder }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#45474C', letterSpacing: '0.05em' }}>{label}</label>
            <input
              type="number"
              value={filter[key as keyof typeof filter]}
              onChange={(e) => setFilter((f) => ({ ...f, [key]: e.target.value }))}
              placeholder={placeholder}
              min={1}
              className="w-24 px-3 py-2.5 rounded text-sm outline-none transition-all"
              style={{ backgroundColor: '#F5F3F4', border: 'none', borderBottom: '2px solid transparent', color: '#1B1B1D' }}
              onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#0058BE'; e.currentTarget.style.backgroundColor = '#FFFFFF' }}
              onBlur={(e) => { e.currentTarget.style.borderBottomColor = 'transparent'; e.currentTarget.style.backgroundColor = '#F5F3F4' }}
            />
          </div>
        ))}
        <div className="flex gap-2">
          <button
            onClick={fetchStudents}
            className="px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
            style={{ backgroundColor: '#091426', color: '#FFFFFF' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1E293B' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#091426' }}
          >
            검색
          </button>
          <button
            onClick={() => { setFilter({ name: '', grade: '', classNum: '', studentNumber: '' }); fetchStudents() }}
            className="px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
            style={{ backgroundColor: '#EAE7E9', color: '#45474C' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#DCD9DB' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#EAE7E9' }}
          >
            초기화
          </button>
        </div>
      </div>

      {/* 테이블 */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 12px rgba(9, 20, 38, 0.06)' }}
      >
        {loading ? (
          <div className="py-16 text-center">
            <div
              className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto"
              style={{ borderColor: '#0058BE', borderTopColor: 'transparent' }}
            />
          </div>
        ) : students.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm" style={{ color: '#45474C' }}>검색 결과가 없습니다.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#F5F3F4' }}>
                {['이름', '학년/반/번호', '아이디', '이메일', '연락처', ''].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: '#45474C', letterSpacing: '0.05em' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((s, idx) => (
                <tr
                  key={s.id}
                  className="transition-colors cursor-pointer"
                  style={{ borderTop: '1px solid #F0EDEF' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F5F3F4' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                  onClick={() => navigate(`/students/${s.id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ backgroundColor: '#D8E2FF', color: '#0058BE' }}
                      >
                        {s.name.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold" style={{ color: '#1B1B1D' }}>{s.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#45474C' }}>
                    {s.grade}학년 {s.classNum}반 {s.studentNumber}번
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#45474C' }}>{s.username}</td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#45474C' }}>{s.email}</td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#45474C' }}>{s.phone ?? '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/students/${s.id}`}
                      className="text-xs font-semibold transition-colors"
                      style={{ color: '#0058BE' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      상세 보기
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 학생 등록 모달 */}
      <Modal isOpen={showRegister} onClose={() => setShowRegister(false)} title="학생 등록">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="아이디" required>
              <Input value={regForm.username} onChange={(e) => setReg('username', e.target.value)} placeholder="아이디" />
            </FormField>
            <FormField label="비밀번호" required>
              <Input type="password" value={regForm.passwordInput} onChange={(e) => setReg('passwordInput', e.target.value)} placeholder="비밀번호" />
            </FormField>
            <FormField label="이름" required>
              <Input value={regForm.name} onChange={(e) => setReg('name', e.target.value)} placeholder="이름" />
            </FormField>
            <FormField label="이메일" required>
              <Input type="email" value={regForm.email} onChange={(e) => setReg('email', e.target.value)} placeholder="이메일" />
            </FormField>
            <FormField label="학년" required>
              <Input type="number" min={1} value={regForm.grade} onChange={(e) => setReg('grade', Number(e.target.value))} />
            </FormField>
            <FormField label="반" required>
              <Input type="number" min={1} value={regForm.classNum} onChange={(e) => setReg('classNum', Number(e.target.value))} />
            </FormField>
            <FormField label="번호" required>
              <Input type="number" min={1} value={regForm.studentNumber} onChange={(e) => setReg('studentNumber', Number(e.target.value))} />
            </FormField>
            <FormField label="연락처">
              <Input value={regForm.phone as string} onChange={(e) => setReg('phone', e.target.value)} placeholder="연락처" />
            </FormField>
          </div>
          <FormField label="주소">
            <Input value={regForm.address as string} onChange={(e) => setReg('address', e.target.value)} placeholder="주소" />
          </FormField>

          {regError && (
            <div className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: '#FFDAD6', color: '#BA1A1A' }}>
              {regError}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleRegister}
              disabled={regLoading}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={{ backgroundColor: regLoading ? '#ADC6FF' : '#0058BE', color: '#FFFFFF' }}
            >
              {regLoading ? '등록 중...' : '등록'}
            </button>
            <button
              onClick={() => setShowRegister(false)}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={{ backgroundColor: '#EAE7E9', color: '#45474C' }}
            >
              취소
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
