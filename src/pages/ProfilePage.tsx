import { useEffect, useState } from 'react'
import { userApi } from '../api/user'
import type { MyInfoResponse } from '../types'
import PageHeader from '../components/common/PageHeader'
import Modal from '../components/common/Modal'
import { FormField, Input } from '../components/common/FormField'

const roleLabel: Record<string, string> = {
  TEACHER: '교사', STUDENT: '학생', PARENT: '학부모', ADMIN: '관리자',
}

export default function ProfilePage() {
  const [info, setInfo] = useState<MyInfoResponse | null>(null)
  const [editModal, setEditModal] = useState(false)
  const [pwModal, setPwModal] = useState(false)
  const [editForm, setEditForm] = useState({ department: '', phone: '', address: '' })
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    userApi.getMyInfo().then((r) => {
      setInfo(r.data.data)
      setEditForm({ department: r.data.data.department ?? '', phone: r.data.data.phone ?? '', address: r.data.data.address ?? '' })
    })
  }, [])

  const handleUpdate = async () => {
    setError('')
    try {
      await userApi.updateMyInfo({ department: editForm.department || undefined, phone: editForm.phone || undefined, address: editForm.address || undefined })
      setSuccess('정보가 업데이트되었습니다.')
      setEditModal(false)
      userApi.getMyInfo().then((r) => setInfo(r.data.data))
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? '수정 실패')
    }
  }

  const handlePwChange = async () => {
    setError('')
    try {
      await userApi.updatePassword(pwForm)
      setSuccess('비밀번호가 변경되었습니다.')
      setPwModal(false)
      setPwForm({ currentPassword: '', newPassword: '' })
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? '변경 실패')
    }
  }

  if (!info) return (
    <div className="p-8 flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#0058BE', borderTopColor: 'transparent' }} />
    </div>
  )

  return (
    <div className="p-8">
      <PageHeader title="내 정보" />

      {success && (
        <div className="mb-4 rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: '#D4EDDA', color: '#1A6B3C' }}>
          {success}
        </div>
      )}

      <div className="rounded-xl p-6 max-w-lg" style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 12px rgba(9,20,38,0.06)' }}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold font-display" style={{ backgroundColor: '#D8E2FF', color: '#0058BE' }}>
            {info.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold font-display" style={{ color: '#1B1B1D' }}>{info.name}</h2>
            <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1" style={{ backgroundColor: '#D8E2FF', color: '#0058BE' }}>{roleLabel[info.role]}</span>
          </div>
        </div>

        <dl className="space-y-3.5 mb-6">
          {[
            ['아이디', info.username],
            ['이메일', info.email],
            ...(info.role === 'TEACHER' ? [
              ['담당 교과', info.department ?? '-'],
              ['연락처', info.phone ?? '-'],
            ] : []),
            ...(info.role === 'STUDENT' ? [
              ['학년/반/번호', `${info.grade}학년 ${info.classNum}반 ${info.studentNumber}번`],
              ['연락처', info.phone ?? '-'],
              ['주소', info.address ?? '-'],
            ] : []),
            ...(info.role === 'PARENT' ? [
              ['자녀 이름', info.studentName ?? '-'],
              ['자녀 학년/반', `${info.studentGrade}학년 ${info.studentClassNum}반`],
              ['연락처', info.phone ?? '-'],
            ] : []),
          ].map(([label, value]) => (
            <div key={label as string} className="flex gap-4">
              <dt className="w-28 text-xs font-medium flex-shrink-0 pt-0.5" style={{ color: '#45474C' }}>{label}</dt>
              <dd className="text-sm font-semibold" style={{ color: '#1B1B1D' }}>{value}</dd>
            </div>
          ))}
        </dl>

        <div className="flex gap-3">
          <button onClick={() => setEditModal(true)} className="px-4 py-2.5 rounded-lg text-sm font-semibold transition-all" style={{ backgroundColor: '#0058BE', color: '#FFFFFF' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#004493' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0058BE' }}
          >정보 수정</button>
          <button onClick={() => setPwModal(true)} className="px-4 py-2.5 rounded-lg text-sm font-semibold transition-all" style={{ backgroundColor: '#EAE7E9', color: '#45474C' }}>비밀번호 변경</button>
        </div>
      </div>

      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="정보 수정" size="sm">
        <div className="space-y-4">
          {info.role === 'TEACHER' && (
            <FormField label="담당 교과"><Input value={editForm.department} onChange={(e) => setEditForm((f) => ({ ...f, department: e.target.value }))} placeholder="담당 교과" /></FormField>
          )}
          <FormField label="연락처"><Input value={editForm.phone} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))} placeholder="연락처" /></FormField>
          {(info.role === 'STUDENT' || info.role === 'PARENT') && (
            <FormField label="주소"><Input value={editForm.address} onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))} placeholder="주소" /></FormField>
          )}
          {error && <div className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: '#FFDAD6', color: '#BA1A1A' }}>{error}</div>}
          <div className="flex gap-3 pt-2">
            <button onClick={handleUpdate} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={{ backgroundColor: '#0058BE', color: '#FFFFFF' }}>저장</button>
            <button onClick={() => setEditModal(false)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={{ backgroundColor: '#EAE7E9', color: '#45474C' }}>취소</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={pwModal} onClose={() => setPwModal(false)} title="비밀번호 변경" size="sm">
        <div className="space-y-4">
          <FormField label="현재 비밀번호" required><Input type="password" value={pwForm.currentPassword} onChange={(e) => setPwForm((f) => ({ ...f, currentPassword: e.target.value }))} /></FormField>
          <FormField label="새 비밀번호" required><Input type="password" value={pwForm.newPassword} onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))} /></FormField>
          {error && <div className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: '#FFDAD6', color: '#BA1A1A' }}>{error}</div>}
          <div className="flex gap-3 pt-2">
            <button onClick={handlePwChange} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={{ backgroundColor: '#0058BE', color: '#FFFFFF' }}>변경</button>
            <button onClick={() => setPwModal(false)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={{ backgroundColor: '#EAE7E9', color: '#45474C' }}>취소</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
