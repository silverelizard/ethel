import { apiFetch } from './client'

const realAuthApi = {
  /** Resolves if the session cookie is valid; rejects with a 401 ApiError otherwise. */
  me: () => apiFetch<void>('/auth/me'),

  login: (password: string) =>
    apiFetch<void>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),

  logout: () => apiFetch<void>('/auth/logout', { method: 'POST' }),
}

// Mock mode has no backend, so it is always "logged in".
const mockAuthApi: typeof realAuthApi = {
  me: async () => {},
  login: async () => {},
  logout: async () => {},
}

export const authApi = import.meta.env.VITE_USE_MOCKS === 'true' ? mockAuthApi : realAuthApi
