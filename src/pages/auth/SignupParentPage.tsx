import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '../../api/auth'

const inputStyle = {
  backgroundColor: '#F5F3F4',
  border: 'none',
  borderBottom: '2px solid transparent',
  color: '#1B1B1D',
}

export default function SignupParentPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '', password: '', name: '', email: '',
    studentLinkCode: '', phone: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authApi.signupParent({
        ...form,
        phone: form.phone || undefined,
      })
      alert('학부모 회원가입이 완료되었습니다.')
      navigate('/login')
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? '회원가입에 실패했습니다.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { key: 'username', label: '아이디', type: 'text', required: true },
    { key: 'password', label: '비밀번호', type: 'password', required: true },
    { key: 'name', label: '이름', type: 'text', required: true },
    { key: 'email', label: '이메일', type: 'email', required: true },
    { key: 'studentLinkCode', label: '자녀 링크 코드', type: 'text', required: true, placeholder: '자녀에게 받은 코드 입력' },
    { key: 'phone', label: '연락처', type: 'text', required: false },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#FBF8FA' }}>
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
            style={{ background: 'linear-gradient(135deg, #091426, #1E293B)' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#BCC7DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold font-display" style={{ color: '#091426' }}>학부모 회원가입</h1>
          <p className="text-sm mt-1" style={{ color: '#45474C' }}>자녀의 링크 코드가 필요합니다</p>
        </div>

        {/* 폼 카드 */}
        <div className="rounded-2xl p-8" style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 8px 32px rgba(9,20,38,0.08)' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ key, label, type, required, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#45474C', letterSpacing: '0.05em' }}>
                  {label}{required && <span className="ml-1" style={{ color: '#BA1A1A' }}>*</span>}
                </label>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={set(key)}
                  required={required}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={(e) => {
                    e.currentTarget.style.borderBottomColor = '#0058BE'
                    e.currentTarget.style.backgroundColor = '#FFFFFF'
                    e.currentTarget.style.boxShadow = '0px 0px 0px 1px #EAE7E9'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderBottomColor = 'transparent'
                    e.currentTarget.style.backgroundColor = '#F5F3F4'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>
            ))}

            {error && (
              <div className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: '#FFDAD6', color: '#BA1A1A' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-bold transition-all mt-2"
              style={{
                background: loading ? '#ADC6FF' : 'linear-gradient(135deg, #0058BE, #2170E4)',
                color: '#FFFFFF',
                boxShadow: loading ? 'none' : '0px 4px 12px rgba(0,88,190,0.3)',
              }}
            >
              {loading ? '처리 중...' : '회원가입'}
            </button>
          </form>

          <div
            className="mt-6 pt-6 text-center text-sm"
            style={{ borderTop: '1px solid #F0EDEF', color: '#45474C' }}
          >
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="font-semibold hover:underline" style={{ color: '#0058BE' }}>
              로그인
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
