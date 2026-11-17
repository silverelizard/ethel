import { apiFetch } from './client'
import type { Bottle, BottlePayload, RandomBottleFilters } from '@/types/api'

const realBottlesApi = {
  list: () => apiFetch<Bottle[]>('/bottles/'),

  random: (filters: RandomBottleFilters = {}) => {
    const params = new URLSearchParams()
    if (filters.categoryId != null) params.set('category_id', String(filters.categoryId))
    if (filters.subCategoryId != null) params.set('sub_category_id', String(filters.subCategoryId))
    const query = params.toString()
    return apiFetch<Bottle>(`/bottles/random${query ? `?${query}` : ''}`)
  },

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
