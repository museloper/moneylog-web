import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SignupPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password || !confirmPassword) {
      alert('모든 항목을 입력해주세요.')
      return
    }

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }

    console.log('회원가입 시도:', { email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">회원가입</h1>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="이메일"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-strong"
          />

          <input
            type="password"
            placeholder="비밀번호"
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-strong"
          />

          <input
            type="password"
            placeholder="비밀번호 확인"
            autoComplete="off"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-strong"
          />

          <button
            type="submit"
            className="w-full bg-brand-strong text-white py-2 rounded-lg font-semibold hover:opacity-90 transition cursor-pointer"
          >
            회원가입
          </button>
        </form>

        {/* 로그인 이동 */}
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-500">이미 계정이 있으신가요? </span>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-brand-strong font-semibold hover:underline cursor-pointer"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  )
}
