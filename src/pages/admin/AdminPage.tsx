import { useEffect, useState } from 'react'
import { adminApi } from '../../api/admin'
import type { AccountListResponse } from '../../types'
import PageHeader from '../../components/common/PageHeader'
import Modal from '../../components/common/Modal'
import { FormField, Input } from '../../components/common/FormField'
import Badge from '../../components/common/Badge'

type CreateType = 'teacher' | 'student' | 'parent'

export default function AdminPage() {
  const [accounts, setAccounts] = useState<AccountListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'teacher' | 'student' | 'parent' | 'admin'>('teacher')
  const [createType, setCreateType] = useState<CreateType | null>(null)
  const [form, setForm] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await adminApi.getAllAccounts()
      setAccounts(res.data.data)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openCreate = (type: CreateType) => {
    setCreateType(type)
    setForm({})
    setError('')
  }

  const handleCreate = async () => {
    setError('')
    setSaving(true)
    try {
      if (createType === 'teacher') {
        await adminApi.createTeacher({
          username: form.username, password: form.password,
          name: form.name, email: form.email,
          department: form.department || undefined, phone: form.phone || undefined,
        })
      } else if (createType === 'student') {
        await adminApi.createStudent({
          username: form.username, password: form.password,
          name: form.name, email: form.email,
          grade: Number(form.grade), classNum: Number(form.classNum),
          studentNumber: Number(form.studentNumber),
          phone: form.phone || undefined, address: form.address || undefined,
        })
      } else if (createType === 'parent') {
        await adminApi.createParent({
          username: form.username, password: form.password,
          name: form.name, email: form.email,
          studentLinkCode: form.studentLinkCode,
          phone: form.phone || undefined,
        })
      }
      setCreateType(null)
      load()
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? '생성 실패')
    } finally {
      setSaving(false)
    }
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const roleColor: Record<string, 'blue' | 'green' | 'purple' | 'red'> = {
    TEACHER: 'blue', STUDENT: 'green', PARENT: 'purple', ADMIN: 'red',
  }
  const roleLabel: Record<string, string> = {
    TEACHER: '교사', STUDENT: '학생', PARENT: '학부모', ADMIN: '관리자',
  }

  const currentList =
    accounts
      ? tab === 'teacher'
        ? accounts.teachers
        : tab === 'student'
        ? accounts.students
        : tab === 'parent'
        ? accounts.parents
        : accounts.admins
      : []

  const tabs = [
    { key: 'teacher' as const, label: '교사', count: accounts?.teachers.length ?? 0 },
    { key: 'student' as const, label: '학생', count: accounts?.students.length ?? 0 },
    { key: 'parent' as const, label: '학부모', count: accounts?.parents.length ?? 0 },
    { key: 'admin' as const, label: '관리자', count: accounts?.admins.length ?? 0 },
  ]

  return (
    <div className="p-8">
      <PageHeader
        title="계정 관리"
        subtitle="시스템의 모든 계정을 관리합니다."
        action={
          <div className="flex gap-2">
            {(['teacher', 'student', 'parent'] as CreateType[]).map((t) => (
              <button
                key={t}
                onClick={() => openCreate(t)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={{ backgroundColor: '#0058BE', color: '#FFFFFF' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#004493' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0058BE' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                {roleLabel[t.toUpperCase()]}
              </button>
            ))}
          </div>
        }
      />

      {/* 탭 */}
      <div className="flex gap-0.5 rounded-xl p-1 mb-6 w-fit" style={{ backgroundColor: '#EAE7E9' }}>
        {tabs.map((t) => (
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

      {loading ? (
        <div className="py-16 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#0058BE', borderTopColor: 'transparent' }} />
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 12px rgba(9,20,38,0.06)' }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#F5F3F4' }}>
                {['이름', '아이디', '이메일', '역할', '추가 정보'].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#45474C', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm" style={{ color: '#45474C' }}>계정이 없습니다.</td>
                </tr>
              ) : currentList.map((a) => (
                <tr
                  key={a.id}
                  style={{ borderTop: '1px solid #F0EDEF' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F5F3F4' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold font-display flex-shrink-0"
                        style={{ backgroundColor: '#D8E2FF', color: '#0058BE' }}
                      >
                        {a.name.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold" style={{ color: '#1B1B1D' }}>{a.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#45474C' }}>{a.username}</td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#45474C' }}>{a.email}</td>
                  <td className="px-6 py-4">
                    <Badge variant={roleColor[a.role]}>{roleLabel[a.role]}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#75777D' }}>{a.extra ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 계정 생성 모달 */}
      <Modal
        isOpen={!!createType}
        onClose={() => setCreateType(null)}
        title={`${createType ? roleLabel[createType.toUpperCase()] : ''} 계정 생성`}
        size="sm"
      >
        <div className="space-y-3">
          {[
            { key: 'username', label: '아이디', required: true },
            { key: 'password', label: '비밀번호', type: 'password', required: true },
            { key: 'name', label: '이름', required: true },
            { key: 'email', label: '이메일', type: 'email', required: true },
            ...(createType === 'teacher' ? [
              { key: 'department', label: '담당 교과' },
              { key: 'phone', label: '연락처' },
            ] : []),
            ...(createType === 'student' ? [
              { key: 'grade', label: '학년', type: 'number', required: true },
              { key: 'classNum', label: '반', type: 'number', required: true },
              { key: 'studentNumber', label: '번호', type: 'number', required: true },
              { key: 'phone', label: '연락처' },
              { key: 'address', label: '주소' },
            ] : []),
            ...(createType === 'parent' ? [
              { key: 'studentLinkCode', label: '학생 링크 코드', required: true },
              { key: 'phone', label: '연락처' },
            ] : []),
          ].map(({ key, label, type = 'text', required }) => (
            <FormField key={key} label={label} required={required}>
              <Input
                type={type}
                value={form[key] ?? ''}
                onChange={set(key)}
                required={required}
                min={type === 'number' ? 1 : undefined}
              />
            </FormField>
          ))}

          {error && (
            <div className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: '#FFDAD6', color: '#BA1A1A' }}>{error}</div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleCreate}
              disabled={saving}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
              style={{ backgroundColor: saving ? '#ADC6FF' : '#0058BE', color: '#FFFFFF' }}
            >
              {saving ? '생성 중...' : '생성'}
            </button>
            <button
              onClick={() => setCreateType(null)}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
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
