import { Navigate } from 'react-router-dom'

import { useAuthStore } from '@/store/authStore'

interface Props {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const isLogin = useAuthStore((state) => state.isLogin)

  if (!isLogin) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
