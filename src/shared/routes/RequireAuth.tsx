import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store'

export default function RequireAuth() {
  const isLogin = useAuthStore((state) => state.isLogin)

  if (!isLogin) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
