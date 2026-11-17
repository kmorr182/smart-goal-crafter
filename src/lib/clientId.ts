import { readJson, writeJson } from './localStorageJson'

const CLIENT_ID_KEY = 'sgc.clientId.v1'

/**
 * A random id for this browser, not a signed-in person — the anonymous identity a real backend
 * can key data on before accounts exist. Created once and persisted; when real auth lands,
 * signing in can "claim" whatever this id already owns instead of starting over.
 */
export function getClientId(): string {
  const existing = readJson<string | null>(CLIENT_ID_KEY, null)
  if (existing) return existing

  const id = crypto.randomUUID()
  writeJson(CLIENT_ID_KEY, id)
  return id
}
