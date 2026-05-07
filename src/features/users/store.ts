import { create } from 'zustand'
import type { UserProfile } from './api'
import { getMeApi, updateProfileApi, getCoupleMembersApi } from './api'

interface UserStore {
  me: UserProfile | null
  members: UserProfile[]
  loaded: boolean
  load: () => Promise<void>
  reload: () => Promise<void>
  updateProfile: (name: string) => Promise<void>
}

const fetchAll = async (): Promise<{ me: UserProfile; members: UserProfile[] }> => {
  const [me, members] = await Promise.all([getMeApi(), getCoupleMembersApi()])
  return { me, members }
}

export const useUserStore = create<UserStore>((set, get) => ({
  me: null,
  members: [],
  loaded: false,

  load: async () => {
    if (get().loaded) return
    const { me, members } = await fetchAll()
    set({ me, members, loaded: true })
  },

  reload: async () => {
    const { me, members } = await fetchAll()
    set({ me, members, loaded: true })
  },

  updateProfile: async (name) => {
    const updated = await updateProfileApi(name)
    set((s) => ({
      me: updated,
      members: s.members.map((m) => (m.id === updated.id ? updated : m)),
    }))
  },
}))
