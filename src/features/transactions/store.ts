import { create } from 'zustand'
import type { Transaction } from '@/features/transactions/types'

interface TransactionStore {
  isFormOpen: boolean
  editTarget: Transaction | null
  lastCreatedAt: number
  openForm: () => void
  openEdit: (tx: Transaction) => void
  closeForm: () => void
  notifyCreated: () => void
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  isFormOpen: false,
  editTarget: null,
  lastCreatedAt: 0,
  openForm: () => set({ isFormOpen: true, editTarget: null }),
  openEdit: (tx) => set({ isFormOpen: true, editTarget: tx }),
  closeForm: () => set({ isFormOpen: false, editTarget: null }),
  notifyCreated: () => set({ lastCreatedAt: Date.now() }),
}))
