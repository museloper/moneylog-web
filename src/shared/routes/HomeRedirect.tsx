import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store'
import { getCoupleStatus } from '@/features/couple/api'

export default function HomeRedirect() {
  const isLogin = useAuthStore((state) => state.isLogin)
  const [destination, setDestination] = useState<string | null>(null)

  useEffect(() => {
    if (!isLogin) {
      setDestination('/login')
      return
    }
    getCoupleStatus()
      .then(({ linked }) => setDestination(linked ? '/dashboard' : '/couple/setup'))
      .catch(() => setDestination('/login'))
  }, [isLogin])

  if (!destination) return null

  return <Navigate to={destination} replace />
}
