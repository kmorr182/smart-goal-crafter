/** Reads a JSON value from localStorage, falling back on anything missing, corrupted, or
 * unreadable (private browsing, cleared site data) rather than throwing. */
export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

/** Writes a JSON value to localStorage. Swallows quota/availability errors, so losing a save to
 * a full or blocked store shouldn't crash the page. */
export function writeJson<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignored, see above.
  }
}
