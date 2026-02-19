import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store'

export default function RedirectIfAuth() {
  const isLogin = useAuthStore((state) => state.isLogin)

  if (isLogin) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
