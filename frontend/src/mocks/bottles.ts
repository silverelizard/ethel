import type { BottlePayload } from '@/types/api'
import { delay, bottleStore } from './store'

export const bottlesApi = {
  list: async () => {
    await delay()
    return bottleStore.list()
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
