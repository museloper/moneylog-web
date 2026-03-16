import { useState, useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store'
import { getCoupleStatus } from '@/features/couple/api'

export default function RequireAuth() {
  const isLogin = useAuthStore((state) => state.isLogin)
  const location = useLocation()
  const [linked, setLinked] = useState<boolean | null>(null)

  useEffect(() => {
    if (!isLogin) return
    getCoupleStatus()
      .then(({ linked }) => setLinked(linked))
      .catch(() => setLinked(false))
  }, [isLogin])

  if (!isLogin) {
    return <Navigate to="/login" replace />
  }

  if (linked === null) return null

  // 커플 미연동 상태에서 /couple/setup 외의 경로 접근 차단
  if (!linked && location.pathname !== '/couple/setup') {
    return <Navigate to="/couple/setup" replace />
  }

  return <Outlet />
}
