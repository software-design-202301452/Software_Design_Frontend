import { useEffect, useState } from 'react'
import { subjectApi } from '../../api/subject'
import type { SubjectResponse } from '../../types'
import PageHeader from '../../components/common/PageHeader'
import Modal from '../../components/common/Modal'
import { FormField, Input, Textarea } from '../../components/common/FormField'

export default function SubjectPage() {
  const [subjects, setSubjects] = useState<SubjectResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await subjectApi.getAllSubjects()
      setSubjects(res.data.data)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleCreate = async () => {
    setError('')
    setSaving(true)
    try {
      await subjectApi.createSubject({ name: form.name, description: form.description || undefined })
      setShowModal(false)
      setForm({ name: '', description: '' })
      load()
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? '등록 실패')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8">
      <PageHeader
        title="과목 관리"
        subtitle="과목을 등록하고 관리합니다."
        action={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: '#0058BE', color: '#FFFFFF' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#004493' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0058BE' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            과목 등록
          </button>
        }
      />

      {loading ? (
        <div className="py-16 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#0058BE', borderTopColor: 'transparent' }} />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {subjects.length === 0 ? (
            <div className="col-span-3 rounded-xl py-16 text-center text-sm" style={{ backgroundColor: '#FFFFFF', color: '#45474C', boxShadow: '0px 2px 8px rgba(9,20,38,0.04)' }}>등록된 과목이 없습니다.</div>
          ) : subjects.map((s) => (
            <div key={s.id} className="rounded-xl p-5 transition-all" style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 2px 8px rgba(9,20,38,0.04)' }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0px 4px 16px rgba(9,20,38,0.08)' }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0px 2px 8px rgba(9,20,38,0.04)' }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#D8E2FF', color: '#0058BE' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                </div>
                <h3 className="text-sm font-bold font-display" style={{ color: '#1B1B1D' }}>{s.name}</h3>
              </div>
              {s.description && (
                <p className="text-sm mt-2" style={{ color: '#45474C' }}>{s.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="과목 등록" size="sm">
        <div className="space-y-4">
          <FormField label="과목명" required>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="과목명을 입력하세요"
            />
          </FormField>
          <FormField label="설명">
            <Textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="과목 설명 (선택)"
            />
          </FormField>
          {error && <div className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: '#FFDAD6', color: '#BA1A1A' }}>{error}</div>}
          <div className="flex gap-3 pt-2">
            <button onClick={handleCreate} disabled={saving} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={{ backgroundColor: saving ? '#ADC6FF' : '#0058BE', color: '#FFFFFF' }}>{saving ? '등록 중...' : '등록'}</button>
            <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={{ backgroundColor: '#EAE7E9', color: '#45474C' }}>취소</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
