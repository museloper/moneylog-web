import { create } from 'zustand'

interface AuthState {
  token: string | null
  isLogin: boolean
  isLinked: boolean | null
  login: (token: string) => void
  logout: () => void
  setLinked: (linked: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  isLogin: !!localStorage.getItem('token'),
  isLinked: null,

  login: (token: string) => {
    localStorage.setItem('token', token)
    set({ token, isLogin: true })
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ token: null, isLogin: false, isLinked: null })
  },

  setLinked: (linked: boolean) => {
    set({ isLinked: linked })
  },
}))
