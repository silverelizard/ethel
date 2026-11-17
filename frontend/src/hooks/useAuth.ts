import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/api/auth'
import { ApiError } from '@/api/client'

export const AUTH_QUERY_KEY = ['auth', 'me']

/** `isAuthenticated` is undefined while the first check is in flight. */
export function useSession() {
  const query = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      try {
        await authApi.me()
        return true
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) return false
        throw e
      }
    },
    retry: false,
    staleTime: Infinity,
  })
  return { isAuthenticated: query.data, isLoading: query.isLoading, error: query.error }
}

export function useLogin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (password: string) => authApi.login(password),
    onSuccess: () => qc.setQueryData(AUTH_QUERY_KEY, true),
  })
}

export function useLogout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      // Drop all cached inventory data, then show the login screen.
      qc.clear()
      qc.setQueryData(AUTH_QUERY_KEY, false)
    },
  })
}
