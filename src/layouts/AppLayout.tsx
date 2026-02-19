import { Outlet } from 'react-router-dom'
import Header from './Header'
import BottomTabBar from './BottomTabBar'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      {/* 모바일 프레임 */}
      <div className="w-full max-w-[480px] bg-white flex flex-col min-h-screen relative">
        {/* 상단 헤더 */}
        <Header />

        {/* 콘텐츠 영역 */}
        <main
          className="
            flex-1
            overflow-y-auto
            px-4 pt-4 pb-24
            bg-gray-50
          "
        >
          <Outlet />
        </main>

        {/* 하단 탭바 */}
        <div className="fixed bottom-0 w-full max-w-[480px]">
          <BottomTabBar />
        </div>
      </div>
    </div>
  )
}
