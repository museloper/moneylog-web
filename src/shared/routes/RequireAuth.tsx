import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store'
import { getCoupleStatus } from '@/features/couple/api'

export default function RequireAuth() {
  const isLogin = useAuthStore((state) => state.isLogin)
  const isLinked = useAuthStore((state) => state.isLinked)
  const setLinked = useAuthStore((state) => state.setLinked)
  const location = useLocation()

  useEffect(() => {
    if (!isLogin || isLinked !== null) return
    getCoupleStatus()
      .then(({ linked }) => setLinked(linked))
      .catch(() => setLinked(false))
  }, [isLogin, isLinked])

  if (!isLogin) return <Navigate to="/login" replace />
  if (isLinked === null) return null

  // 커플 미연동 상태에서 /couple/setup 외의 경로 접근 차단
  if (!isLinked && location.pathname !== '/couple/setup') {
    return <Navigate to="/couple/setup" replace />
  }

  return <Outlet />
}
