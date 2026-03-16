import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store'

export default function Header() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header
      className="
        h-14
        bg-white
        flex items-center justify-center
        relative
        shadow-[0_1px_6px_rgba(0,0,0,0.04)]
      "
    >
      <h1 className="text-base font-semibold tracking-tight text-gray-900">
        <span className="text-brand-strong">머니</span>로그
      </h1>
      <button
        onClick={handleLogout}
        className="absolute right-4 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
      >
        로그아웃
      </button>
    </header>
  )
}
