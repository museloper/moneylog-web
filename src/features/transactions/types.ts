import type { TransactionType } from '@/shared/utils/accent'

export interface Transaction {
  id: number
  title: string
  category: string
  amount: number
  type: TransactionType
  date: string
  userId: number
}
