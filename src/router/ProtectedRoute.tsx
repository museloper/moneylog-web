import { Navigate } from 'react-router-dom'

interface Props {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const isLogin = false

  if (!isLogin) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
