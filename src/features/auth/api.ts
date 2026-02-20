import { apiClient } from '@/shared/api/client'

export const loginApi = async (email: string, password: string) => {
  const response = await apiClient.post('/login', {
    email,
    password,
  })

  return response.data
}
