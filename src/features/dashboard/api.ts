import { apiClient } from '@/shared/api/client'

import type { Balance, Transaction } from '@/features/dashboard/types'

export const getBalanceApi = async (): Promise<Balance> => {
  const response = await apiClient.get('/dashboard/balance')

  return response.data
}

export const getTransactionsApi = async (): Promise<Transaction[]> => {
  const response = await apiClient.get('/dashboard/transactions')

  return response.data
}
