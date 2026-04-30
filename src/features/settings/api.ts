import { apiClient } from '@/shared/api/client'

export interface CategoryItem {
  id: number
  name: string
  emoji: string | null
  type: 'income' | 'expense'
}

export const getCategoriesApi = async (): Promise<CategoryItem[]> => {
  const response = await apiClient.get('/categories')
  return response.data
}

export const createCategoryApi = async (
  name: string,
  emoji: string,
  type: 'income' | 'expense',
): Promise<CategoryItem> => {
  const response = await apiClient.post('/categories', { name, emoji, type })
  return response.data
}

export const deleteCategoryApi = async (id: number): Promise<void> => {
  await apiClient.delete(`/categories/${id}`)
}
