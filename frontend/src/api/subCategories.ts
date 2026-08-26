import { apiFetch } from './client'
import type { SubCategory, SubCategoryPayload } from '@/types/api'

const realSubCategoriesApi = {
  list: () => apiFetch<SubCategory[]>('/sub_categories/'),

  create: (payload: SubCategoryPayload) =>
    apiFetch<SubCategory>('/sub_categories/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id: number, payload: SubCategoryPayload) =>
    apiFetch<SubCategory>(`/sub_categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  delete: (id: number) =>
    apiFetch<void>(`/sub_categories/${id}`, {
      method: 'DELETE',
    }),
}

export const subCategoriesApi = import.meta.env.VITE_USE_MOCKS === 'true'
  ? (await import('@/mocks/subCategories')).subCategoriesApi
  : realSubCategoriesApi
