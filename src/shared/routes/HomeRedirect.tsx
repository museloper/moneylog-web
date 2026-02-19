// src/shared/routes/HomeRedirect.tsx

import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store'

export default function HomeRedirect() {
  const isLogin = useAuthStore((state) => state.isLogin)

  // 로그인 여부에 따라 대시보드 또는 로그인 페이지로 리다이렉트
  return isLogin ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
}
