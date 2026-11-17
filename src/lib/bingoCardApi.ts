import type { BingoCard } from '../types/bingoCard'

const API_URL = import.meta.env.VITE_API_URL ?? ''

/**
 * Fetches the card for this client via smart-goal-crafter-api 
 * proxied to that service's dev server by vite.config.ts in local dev.
 * 
 * Returns null when none exists yet, rather than throwing an error
 * a fresh client with no card is an expected, normal case, not a failure.
 */
export async function fetchBingoCard(clientId: string): Promise<BingoCard | null> {
  const response = await fetch(`${API_URL}/api/bingo-card?clientId=${encodeURIComponent(clientId)}`)
  if (response.status === 404) return null
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error || `Request failed (${response.status})`)
  }
  return response.json()
}

/** Saves (creates or overwrites) the whole card for this client. */
export async function saveBingoCard(clientId: string, card: BingoCard): Promise<BingoCard> {
  const response = await fetch(`${API_URL}/api/bingo-card?clientId=${encodeURIComponent(clientId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(card),
  })
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error || `Request failed (${response.status})`)
  }
  return response.json()
}
