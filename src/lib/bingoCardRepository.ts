import type { BingoCard } from '../types/bingoCard'
import { FREE_POSITION, emptySquares } from '../types/bingoCard'
import type { CategoryKey } from '../types/goal'
import { fetchBingoCard, saveBingoCard } from './bingoCardApi'

function emptyCard(): BingoCard {
  return {
    id: crypto.randomUUID(),
    hasFreeSpace: true,
    squares: emptySquares(),
    createdAt: new Date().toISOString(),
  }
}

/**
 * Fetches the signed-in user's bingo card from the API, creating (and persisting) a fresh blank one
 * if none exists yet. Every mutation below takes the current card as a parameter rather than
 * re-fetching it itself.
 */
export async function getOrCreateCard(accessToken: string): Promise<BingoCard> {
  const existing = await fetchBingoCard(accessToken)
  if (existing) return existing
  return saveBingoCard(accessToken, emptyCard())
}

export async function updateSquare(
  accessToken: string,
  card: BingoCard,
  position: number,
  patch: { label?: string; categoryOverride?: CategoryKey | null },
): Promise<BingoCard> {
  if (card.hasFreeSpace && position === FREE_POSITION) return card
  return saveBingoCard(accessToken, {
    ...card,
    squares: card.squares.map((sq) => (sq.position === position ? { ...sq, ...patch } : sq)),
  })
}
/** No-ops on the FREE square while it's active. It's always completed, not toggleable. */
export async function toggleSquareCompleted(accessToken: string, card: BingoCard, position: number): Promise<BingoCard> {
  if (card.hasFreeSpace && position === FREE_POSITION) return card
  return saveBingoCard(accessToken, {
    ...card,
    squares: card.squares.map((sq) => (sq.position === position ? { ...sq, completed: !sq.completed } : sq)),
  })
}

export async function setHasFreeSpace(accessToken: string, card: BingoCard, hasFreeSpace: boolean): Promise<BingoCard> {
  return saveBingoCard(accessToken, { ...card, hasFreeSpace })
}