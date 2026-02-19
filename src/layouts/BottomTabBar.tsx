import { NavLink } from 'react-router-dom'
import { Home, Receipt, BarChart3, Settings, Plus } from 'lucide-react'

export default function BottomTabBar() {
  const baseClass =
    'flex flex-col items-center justify-center text-[11px] transition-all duration-200'

  return (
    <nav
      className="
        relative flex h-20 bg-white
        shadow-[0_-6px_20px_rgba(0,0,0,0.04)]
        pb-[env(safe-area-inset-bottom)]
      "
    >
      {/* 홈 */}
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `flex-1 flex flex-col items-center justify-center text-[11px] transition-all duration-200 ${
            isActive ? 'text-brand-strong' : 'text-gray-400'
          }`
        }
      >
        <Home size={22} strokeWidth={2.3} />홈
      </NavLink>

      {/* 내역 */}
      <NavLink
        to="/transactions"
        className={({ isActive }) =>
          `${baseClass} flex-1 ${isActive ? 'text-brand-strong' : 'text-gray-400'}`
        }
      >
        <Receipt size={22} strokeWidth={2} />
        내역
      </NavLink>

      {/* 가운데 공간 */}
      <div className="flex-1" />

      {/* 통계 */}
      <NavLink
        to="/stats"
        className={({ isActive }) =>
          `${baseClass} flex-1 ${isActive ? 'text-brand-strong' : 'text-gray-400'}`
        }
      >
        <BarChart3 size={22} strokeWidth={2} />
        통계
      </NavLink>

      {/* 설정 */}
      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `${baseClass} flex-1 ${isActive ? 'text-brand-strong' : 'text-gray-400'}`
        }
      >
        <Settings size={22} strokeWidth={2} />
        설정
      </NavLink>

      {/* 중앙 플로팅 버튼 */}
      <button
        className="
          absolute left-1/2 -translate-x-1/2 -top-6
          w-14 h-14 rounded-full
          bg-brand-strong
          text-white
          flex items-center justify-center
          shadow-[0_10px_25px_rgba(107,191,160,0.35)]
          active:scale-95
          transition-transform duration-150
        "
      >
        <Plus size={26} strokeWidth={2.5} />
      </button>
    </nav>
  )
}
