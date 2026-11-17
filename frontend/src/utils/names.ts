/** Mirrors the server's uniqueness rule: trimmed and case-insensitive. */
export const normalizeName = (name: string) => name.trim().toLowerCase()
