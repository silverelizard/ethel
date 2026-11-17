import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { subCategoriesApi } from '@/api/subCategories'
import type { SubCategoryPayload } from '@/types/api'

const QUERY_KEY = ['subCategories']

export function useSubCategories() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: subCategoriesApi.list,
  })
}

export function useCreateSubCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: SubCategoryPayload) =>
      subCategoriesApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useUpdateSubCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: SubCategoryPayload
    }) => subCategoriesApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useDeleteSubCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => subCategoriesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
