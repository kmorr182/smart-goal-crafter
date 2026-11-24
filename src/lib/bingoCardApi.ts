import type { BingoCard } from '../types/bingoCard'

const API_URL = import.meta.env.VITE_API_URL ?? ''

export async function fetchBingoCard(accessToken: string): Promise<BingoCard | null> {
  const response = await fetch(`${API_URL}/api/bingo-card`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (response.status === 404) return null
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error || `Request failed (${response.status})`)
  }
  return response.json()
}

export async function saveBingoCard(accessToken: string, card: BingoCard): Promise<BingoCard> {
  const response = await fetch(`${API_URL}/api/bingo-card`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(card),
  })
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error || `Request failed (${response.status})`)
  }
  return response.json()
}