import { createBrowserRouter } from 'react-router-dom'

import HomeRedirect from '@/shared/routes/HomeRedirect'
import RequireAuth from '@/shared/routes/RequireAuth'
import RedirectIfAuth from '@/shared/routes/RedirectIfAuth'

import AppLayout from '@/layouts/AppLayout'

import LoginPage from '@/features/auth/pages/LoginPage'
import SignupPage from '@/features/auth/pages/SignupPage'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'
import ComingSoonPage from '@/shared/pages/ComingSoonPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeRedirect />,
  },
  {
    // 인증된 사용자는 로그인 및 회원가입 페이지에 접근할 수 없도록 설정
    element: <RedirectIfAuth />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/signup',
        element: <SignupPage />,
      },
    ],
  },
  {
    // 인증된 사용자만 접근할 수 있도록 설정
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />, // 인증된 사용자에게 공통 레이아웃 제공
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/transactions',
            element: <ComingSoonPage title="거래 내역" />,
          },
          {
            path: '/stats',
            element: <ComingSoonPage title="통계" />,
          },
          {
            path: '/settings',
            element: <ComingSoonPage title="설정" />,
          },
        ],
      },
    ],
  },
])

export default router
