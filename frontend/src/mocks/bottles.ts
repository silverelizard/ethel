import type { BottlePayload, RandomBottleFilters } from '@/types/api'
import { ApiError } from '@/api/client'
import { delay, bottleStore } from './store'

export const bottlesApi = {
  list: async () => {
    await delay()
    return bottleStore.list()
  },

  random: async ({ categoryId, subCategoryId }: RandomBottleFilters = {}) => {
    await delay()
    const matches = bottleStore
      .list()
      .filter((b) => categoryId == null || b.category_id === categoryId)
      .filter((b) => subCategoryId == null || (b.sub_category_ids ?? []).includes(subCategoryId))
    if (matches.length === 0) throw new ApiError(404, 'No bottles match those filters')
    return matches[Math.floor(Math.random() * matches.length)]
  },

  create: async (payload: BottlePayload) => {
    await delay()
    return bottleStore.create(payload)
  },

  update: async (id: number, payload: BottlePayload) => {
    await delay()
    return bottleStore.update(id, payload)
  },

  delete: async (id: number) => {
    await delay()
    bottleStore.delete(id)
  },
}
