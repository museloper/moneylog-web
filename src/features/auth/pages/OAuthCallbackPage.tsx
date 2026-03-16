import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useAuthStore } from '@/features/auth/store'

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      login(token)
      navigate('/dashboard', { replace: true })
    } else {
      navigate('/login', { replace: true })
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-500">로그인 처리 중...</p>
    </div>
  )
}
