import { createBrowserRouter } from 'react-router-dom'

import ProtectedRoute from './ProtectedRoute'

import HomePage from '@/pages/HomePage'

import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
])

export default router
