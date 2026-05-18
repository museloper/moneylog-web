import { createBrowserRouter } from 'react-router-dom'

import HomeRedirect from '@/shared/routes/HomeRedirect'
import RequireAuth from '@/shared/routes/RequireAuth'
import RedirectIfAuth from '@/shared/routes/RedirectIfAuth'

import AppLayout from '@/layouts/AppLayout'

import LoginPage from '@/features/auth/pages/LoginPage'
import RegisterPage from '@/features/auth/pages/RegisterPage'
import CouplePage from '@/features/couple/pages/CouplePage'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'
import SettingsPage from '@/features/settings/pages/SettingsPage'
import TransactionsPage from '@/features/transactions/pages/TransactionsPage'
import StatsPage from '@/features/stats/pages/StatsPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeRedirect />,
  },
  {
    element: <RedirectIfAuth />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: '/couple/setup',
        element: <CouplePage />,
      },
      {
        element: <AppLayout />,
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/transactions',
            element: <TransactionsPage />,
          },
          {
            path: '/stats',
            element: <StatsPage />,
          },
          {
            path: '/settings',
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },
])

export default router
