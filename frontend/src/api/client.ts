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

const BASE_URL = ''

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

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
