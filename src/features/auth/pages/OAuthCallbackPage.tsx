import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useAuthStore } from '@/features/auth/store'
import { getCoupleStatus } from '@/features/couple/api'

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    login(token)

    getCoupleStatus()
      .then(({ linked }) => {
        navigate(linked ? '/dashboard' : '/couple/setup', { replace: true })
      })
      .catch(() => {
        navigate('/login', { replace: true })
      })
  }, [])

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-gray-50 gap-3">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-brand-strong rounded-full animate-spin" />
      <p className="text-sm text-gray-500">로그인 처리 중</p>
    </div>
  )
}
