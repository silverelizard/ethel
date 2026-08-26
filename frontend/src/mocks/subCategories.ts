import type { SubCategoryPayload } from '@/types/api'
import { delay, subCategoryStore } from './store'

export const subCategoriesApi = {
  list: async () => {
    await delay()
    return subCategoryStore.list()
  },

  create: async (payload: SubCategoryPayload) => {
    await delay()
    return subCategoryStore.create(payload)
  },

  update: async (id: number, payload: SubCategoryPayload) => {
    await delay()
    return subCategoryStore.update(id, payload)
  },

  delete: async (id: number) => {
    await delay()
    subCategoryStore.delete(id)
  },
}
