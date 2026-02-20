import { apiClient } from '@/shared/api/client'

import type { DashboardSummary } from '@/features/dashboard/types'

export const getDashboardSummaryApi = async (): Promise<DashboardSummary> => {
  const response = await apiClient.get('/dashboard/summary')

  return response.data
}
