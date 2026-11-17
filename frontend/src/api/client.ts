export class ApiError extends Error {
  status: number
  details: string

  constructor(status: number, details: string) {
    super(details)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

const BASE_URL = '/api'

let onUnauthorized: (() => void) | null = null

/** Called whenever the API answers 401 (e.g. the session cookie expired). */
export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  // A failed login is also a 401, but that's the login form's error to show,
  // not a signal that an existing session ended.
  if (res.status === 401 && path !== '/auth/login') {
    onUnauthorized?.()
  }

  if (!res.ok) {
    let details = `Request failed with status ${res.status}`
    try {
      const body = await res.json()
      if (body.details) details = body.details
    } catch {
      // use default message
    }
    throw new ApiError(res.status, details)
  }

  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T
  }

  return res.json()
}
