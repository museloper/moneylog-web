import { apiClient } from '@/shared/api/client'

export interface UserProfile {
  id: number
  email: string
  name: string | null
  profileImage: string | null
}

export const getMeApi = async (): Promise<UserProfile> => {
  const response = await apiClient.get('/users/me')
  return response.data
}

export const updateProfileApi = async (name: string): Promise<UserProfile> => {
  const response = await apiClient.patch('/users/me', { name })
  return response.data
}

export const getCoupleMembersApi = async (): Promise<UserProfile[]> => {
  const response = await apiClient.get('/couple/members')
  return response.data
}
