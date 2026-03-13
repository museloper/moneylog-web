import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuthStore } from '@/features/auth/store'
import { loginApi } from '@/features/auth/api'

import logo from '@/assets/images/logo.png'

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    // 임시 ID/PW 자동 입력
    setEmail('sample@sample.com')
    setPassword('sample')
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault() // 새로고침 방지

    if (!email || !password) {
      alert('이메일과 비밀번호를 입력하세요')
      return
    }

    try {
      const data = await loginApi(email, password)
      login(data.accessToken)
      navigate('/')
    } catch (error) {
      alert('로그인 실패')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-md">
        {/* 로고 + 타이틀 */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <img src={logo} alt="머니로그 로고" className="w-8 h-8" />
          <h1 className="text-2xl font-bold text-gray-800">머니로그</h1>
        </div>

        {/* 로그인 폼 */}
        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="이메일"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-strong"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <input
            type="password"
            placeholder="비밀번호"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-strong"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <button
            type="submit"
            className="w-full bg-brand-strong text-white py-2 rounded-lg font-semibold hover:opacity-90 transition cursor-pointer"
          >
            로그인
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="px-3 text-xs text-gray-400">또는</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="text-center text-sm mt-4">
          <span className="text-gray-500">계정이 없으신가요? </span>
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="text-brand-strong font-semibold cursor-pointer"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  )
}
