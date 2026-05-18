import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'

import logo from '@/assets/images/logo.png'
import { registerApi } from '@/features/auth/api'
import { useAuthStore } from '@/features/auth/store'

export default function RegisterPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const setLinked = useAuthStore((state) => state.setLinked)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password || !name.trim()) return
    if (password.length < 6) {
      toast.error('비밀번호는 6자 이상이어야 합니다')
      return
    }

    setLoading(true)
    try {
      const { token } = await registerApi(email.trim(), password, name.trim())
      login(token)
      setLinked(false)
      navigate('/couple/setup', { replace: true })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '회원가입에 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <img src={logo} alt="머니로그 로고" className="w-20 h-20 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">회원가입</h1>
          <p className="text-sm text-gray-500 mt-2">머니로그를 시작해보세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-strong transition-colors"
          />
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-strong transition-colors"
          />
          <input
            type="password"
            placeholder="비밀번호 (6자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-strong transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-strong text-white rounded-xl py-3 text-sm font-semibold active:opacity-90 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="font-semibold text-brand-strong">
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}
