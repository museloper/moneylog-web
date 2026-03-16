import { apiClient } from '@/shared/api/client'

export const getCoupleStatus = async (): Promise<{ linked: boolean; inviteCode: string | null }> => {
  const response = await apiClient.get('/couple/status')
  return response.data
}

export const createCouple = async (): Promise<{ inviteCode: string }> => {
  const response = await apiClient.post('/couple/create')
  return response.data
}

export const joinCouple = async (inviteCode: string): Promise<void> => {
  await apiClient.post(`/couple/join/${inviteCode}`)
}
