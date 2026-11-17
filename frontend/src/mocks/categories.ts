import type { CategoryPayload } from '@/types/api'
import { delay, categoryStore } from './store'

export const categoriesApi = {
  list: async () => {
    await delay()
    return categoryStore.list()
  },

  create: async (payload: CategoryPayload) => {
    await delay()
    return categoryStore.create(payload)
  },

  update: async (id: number, payload: CategoryPayload) => {
    await delay()
    return categoryStore.update(id, payload)
  },

  delete: async (id: number) => {
    await delay()
    categoryStore.delete(id)
  },
}
