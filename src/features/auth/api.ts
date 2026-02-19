import axios from 'axios'

export const loginApi = async (email: string, password: string) => {
  const response = await axios.post('/api/login', {
    email,
    password,
  })

  return response.data
}
