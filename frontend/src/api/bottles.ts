import { apiFetch } from './client'
import type { Bottle, BottlePayload } from '@/types/api'

const realBottlesApi = {
  list: () => apiFetch<Bottle[]>('/bottles/'),

  create: (payload: BottlePayload) =>
    apiFetch<Bottle>('/bottles/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id: number, payload: BottlePayload) =>
    apiFetch<Bottle>(`/bottles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  delete: (id: number) =>
    apiFetch<void>(`/bottles/${id}`, {
      method: 'DELETE',
    }),
}

export const bottlesApi = import.meta.env.VITE_USE_MOCKS === 'true'
  ? (await import('@/mocks/bottles')).bottlesApi
  : realBottlesApi
