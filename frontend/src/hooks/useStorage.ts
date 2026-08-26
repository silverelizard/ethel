import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { storageApi } from '@/api/storage'
import type { StoragePayload } from '@/types/api'

const QUERY_KEY = ['storage']

export function useStorage() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: storageApi.list,
  })
}

export function useCreateStorage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: StoragePayload) => storageApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useUpdateStorage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: StoragePayload }) =>
      storageApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useDeleteStorage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => storageApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
