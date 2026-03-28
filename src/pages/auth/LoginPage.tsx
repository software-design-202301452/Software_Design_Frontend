import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/', { replace: true })
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? '로그인에 실패했습니다.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#FBF8FA' }}
    >
      <div className="w-full max-w-md">
        {/* 로고/헤더 */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
            style={{ background: 'linear-gradient(135deg, #091426, #1E293B)' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#BCC7DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold font-display" style={{ color: '#091426' }}>학생 관리 시스템</h1>
          <p className="text-sm mt-2" style={{ color: '#45474C' }}>계정에 로그인하세요</p>
        </div>

        {/* 로그인 카드 */}
        <div className="rounded-2xl p-8" style={{ backgroundColor: '#FFFFFF', boxShadow: '0px 8px 32px rgba(9,20,38,0.08)' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#45474C', letterSpacing: '0.05em' }}>아이디</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="아이디를 입력하세요"
                required
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                style={{ backgroundColor: '#F5F3F4', border: 'none', borderBottom: '2px solid transparent', color: '#1B1B1D' }}
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
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#45474C', letterSpacing: '0.05em' }}>비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                required
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                style={{ backgroundColor: '#F5F3F4', border: 'none', borderBottom: '2px solid transparent', color: '#1B1B1D' }}
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
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {/* 회원가입 링크 */}
          <div
            className="mt-6 pt-6 space-y-2 text-center text-sm"
            style={{ borderTop: '1px solid #F0EDEF', color: '#45474C' }}
          >
            <p>
              교사 회원가입{' '}
              <Link to="/signup/teacher" className="font-semibold hover:underline" style={{ color: '#0058BE' }}>
                여기서 가입
              </Link>
            </p>
            <p>
              학생 회원가입{' '}
              <Link to="/signup/student" className="font-semibold hover:underline" style={{ color: '#0058BE' }}>
                여기서 가입
              </Link>
            </p>
            <p>
              학부모 회원가입{' '}
              <Link to="/signup/parent" className="font-semibold hover:underline" style={{ color: '#0058BE' }}>
                여기서 가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
