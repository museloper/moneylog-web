import { NavLink } from 'react-router-dom'
import { Home, Receipt, BarChart3, Settings, Plus } from 'lucide-react'

export default function BottomTabBar() {
  const baseClass =
    'flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors duration-200'

  return (
    <nav
      className="
        relative flex h-20 bg-white
        border-t border-gray-100
        pb-[env(safe-area-inset-bottom)]
      "
    >
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `${baseClass} flex-1 ${isActive ? 'text-brand-strong' : 'text-gray-400'}`
        }
      >
        <Home size={22} strokeWidth={2} />
        홈
      </NavLink>

      <NavLink
        to="/transactions"
        className={({ isActive }) =>
          `${baseClass} flex-1 ${isActive ? 'text-brand-strong' : 'text-gray-400'}`
        }
      >
        <Receipt size={22} strokeWidth={2} />
        내역
      </NavLink>

      {/* 중앙 플로팅 버튼 자리 */}
      <div className="flex-1" />

      <NavLink
        to="/stats"
        className={({ isActive }) =>
          `${baseClass} flex-1 ${isActive ? 'text-brand-strong' : 'text-gray-400'}`
        }
      >
        <BarChart3 size={22} strokeWidth={2} />
        통계
      </NavLink>

      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `${baseClass} flex-1 ${isActive ? 'text-brand-strong' : 'text-gray-400'}`
        }
      >
        <Settings size={22} strokeWidth={2} />
        설정
      </NavLink>

      <button
        type="button"
        aria-label="추가"
        className="
          absolute left-1/2 -translate-x-1/2 -top-6
          w-14 h-14 rounded-full
          bg-brand-strong
          text-white
          flex items-center justify-center
          shadow-[0_8px_20px_rgba(63,175,142,0.35)]
          active:scale-95
          transition-transform duration-150
          cursor-pointer
        "
      >
        <Plus size={26} strokeWidth={2.5} />
      </button>
    </nav>
  )
}
