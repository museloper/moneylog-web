import { LogOut } from 'lucide-react'
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
    <header className="h-14 bg-white flex items-center justify-between px-4 border-b border-gray-100">
      <h1 className="text-base font-semibold tracking-tight text-gray-900">
        <span className="text-brand-strong">머니</span>로그
      </h1>
      <button
        type="button"
        onClick={handleLogout}
        className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 active:bg-gray-100 active:text-gray-600 transition cursor-pointer"
        aria-label="로그아웃"
      >
        <LogOut size={18} strokeWidth={2} />
      </button>
    </header>
  )
}
