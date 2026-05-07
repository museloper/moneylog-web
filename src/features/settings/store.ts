import { create } from 'zustand'
import type { CategoryItem } from './api'
import { getCategoriesApi, createCategoryApi, updateCategoryApi, deleteCategoryApi } from './api'

interface CategoryStore {
  categories: CategoryItem[]
  loaded: boolean
  load: () => Promise<void>
  add: (name: string, emoji: string, type: 'income' | 'expense') => Promise<void>
  update: (id: number, name: string, emoji: string) => Promise<void>
  remove: (id: number) => Promise<void>
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  loaded: false,

  load: async () => {
    if (get().loaded) return
    const data = await getCategoriesApi()
    set({ categories: data, loaded: true })
  },

  add: async (name, emoji, type) => {
    const item = await createCategoryApi(name, emoji, type)
    set((s) => ({ categories: [...s.categories, item] }))
  },

  update: async (id, name, emoji) => {
    const item = await updateCategoryApi(id, name, emoji)
    set((s) => ({ categories: s.categories.map((c) => (c.id === id ? item : c)) }))
  },

  remove: async (id) => {
    await deleteCategoryApi(id)
    set((s) => ({ categories: s.categories.filter((c) => c.id !== id) }))
  },
}))
