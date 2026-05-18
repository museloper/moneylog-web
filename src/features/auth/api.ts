import { apiClient } from '@/shared/api/client'

export const loginApi = async (email: string, password: string): Promise<{ token: string }> => {
  const response = await apiClient.post('/auth/login', { email, password })
  return response.data
}

export const registerApi = async (email: string, password: string, name: string): Promise<{ token: string }> => {
  const response = await apiClient.post('/auth/register', { email, password, name })
  return response.data
}
