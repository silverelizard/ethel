import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bottlesApi } from '@/api/bottles'
import type { BottlePayload, RandomBottleFilters } from '@/types/api'

const QUERY_KEY = ['bottles']

export function useBottles() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: bottlesApi.list,
  })
}

export function useCreateBottle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: BottlePayload) => bottlesApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useUpdateBottle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: BottlePayload }) =>
      bottlesApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useDeleteBottle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => bottlesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

/** Picks a random bottle on demand (a mutation, since each pick is a new result). */
export function useRandomBottle() {
  return useMutation({
    mutationFn: (filters: RandomBottleFilters) => bottlesApi.random(filters),
  })
}
