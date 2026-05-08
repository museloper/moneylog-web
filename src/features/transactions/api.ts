import { apiClient } from '@/shared/api/client'
import type { Transaction } from '@/features/transactions/types'
import type { TransactionType } from '@/shared/utils/accent'

export interface CreateTransactionPayload {
  type: TransactionType
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

export const updateTransactionApi = async (id: number, payload: CreateTransactionPayload): Promise<Transaction> => {
  const response = await apiClient.patch(`/transactions/${id}`, payload)
  return response.data
}

export const deleteTransactionApi = async (id: number): Promise<void> => {
  await apiClient.delete(`/transactions/${id}`)
}
