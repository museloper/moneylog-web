import { create } from 'zustand'

interface AuthState {
  token: string | null
  isLogin: boolean
  login: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  isLogin: !!localStorage.getItem('token'),

  login: (token: string) => {
    localStorage.setItem('token', token)

    set({
      token,
      isLogin: true,
    })
  },

  logout: () => {
    localStorage.removeItem('token')

    set({
      token: null,
      isLogin: false,
    })
  },
}))
