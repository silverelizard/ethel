import type { StoragePayload } from '@/types/api'
import { delay, storageStore } from './store'

export const storageApi = {
  list: async () => {
    await delay()
    return storageStore.list()
  },

  create: async (payload: StoragePayload) => {
    await delay()
    return storageStore.create(payload)
  },

  update: async (id: number, payload: StoragePayload) => {
    await delay()
    return storageStore.update(id, payload)
  },

  delete: async (id: number) => {
    await delay()
    storageStore.delete(id)
  },
}
