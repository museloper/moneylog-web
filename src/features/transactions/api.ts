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

export const getTransactionsApi = async (): Promise<Transaction[]> => {
  const response = await apiClient.get('/dashboard/transactions')
  return response.data
}

export const deleteTransactionApi = async (id: number): Promise<void> => {
  await apiClient.delete(`/transactions/${id}`)
}
