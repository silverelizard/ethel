import { apiFetch } from './client'
import type { Category, CategoryPayload } from '@/types/api'

const realCategoriesApi = {
  list: () => apiFetch<Category[]>('/categories/'),

  create: (payload: CategoryPayload) =>
    apiFetch<Category>('/categories/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id: number, payload: CategoryPayload) =>
    apiFetch<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  delete: (id: number) =>
    apiFetch<void>(`/categories/${id}`, {
      method: 'DELETE',
    }),
}

export const categoriesApi = import.meta.env.VITE_USE_MOCKS === 'true'
  ? (await import('@/mocks/categories')).categoriesApi
  : realCategoriesApi
