import { apiFetch } from './client'
import type { Storage, StoragePayload } from '@/types/api'

const realStorageApi = {
  list: () => apiFetch<Storage[]>('/storage/'),

  create: (payload: StoragePayload) =>
    apiFetch<Storage>('/storage/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id: number, payload: StoragePayload) =>
    apiFetch<Storage>(`/storage/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  delete: (id: number) =>
    apiFetch<void>(`/storage/${id}`, {
      method: 'DELETE',
    }),
}

export const storageApi = import.meta.env.VITE_USE_MOCKS === 'true'
  ? (await import('@/mocks/storage')).storageApi
  : realStorageApi
