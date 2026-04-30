import { create } from 'zustand'

interface TransactionStore {
  isFormOpen: boolean
  lastCreatedAt: number
  openForm: () => void
  closeForm: () => void
  notifyCreated: () => void
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  isFormOpen: false,
  lastCreatedAt: 0,
  openForm: () => set({ isFormOpen: true }),
  closeForm: () => set({ isFormOpen: false }),
  notifyCreated: () => set({ lastCreatedAt: Date.now() }),
}))
