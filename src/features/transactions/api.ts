import { apiClient } from '@/shared/api/client'
import type { Transaction } from '@/features/dashboard/types'

export interface CreateTransactionPayload {
  type: 'income' | 'expense'
  amount: number
  title: string
  category: string
  date: string
}

export const createTransaction = async (payload: CreateTransactionPayload): Promise<Transaction> => {
  const response = await apiClient.post('/transactions', payload)
  return response.data
}
