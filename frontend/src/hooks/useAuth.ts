import { useQuery, useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { authApi } from '@/api/auth'
import { ApiError } from '@/api/client'

export const AUTH_QUERY_KEY = ['auth', 'me']

/**
 * Switch the UI to the login page and drop cached inventory data.
 *
 * Order matters: update the session query in place first, then remove the
 * others. `queryClient.clear()` would also remove the session query that
 * App is observing, and a value set afterwards lands on a new query that
 * nothing is subscribed to, so the UI would stay "logged in".
 */
export function markLoggedOut(qc: QueryClient) {
  qc.setQueryData(AUTH_QUERY_KEY, false)
  qc.removeQueries({ predicate: (q) => q.queryKey[0] !== AUTH_QUERY_KEY[0] })
}

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
    onSettled: () => markLoggedOut(qc),
  })
}
