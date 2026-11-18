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
 * Fetches this client's card from the API, creating (and persisting) a fresh blank one if none
 * exists yet. Every mutation below takes the current card as a parameter rather than re-fetching
 * it itself. 
 */
export async function getOrCreateCard(clientId: string): Promise<BingoCard> {
  const existing = await fetchBingoCard(clientId)
  if (existing) return existing
  return saveBingoCard(clientId, emptyCard())
}

/** Commits any combination of label/categoryOverride for one square in a single save, so a
 * user staging both a new label and a new category only writes once, not once per field. Pass
 * only the fields that actually changed. No-ops on the FREE square while it's active, same as
 * the other per-square setters. */
export async function updateSquare(
  clientId: string,
  card: BingoCard,
  position: number,
  patch: { label?: string; categoryOverride?: CategoryKey | null },
): Promise<BingoCard> {
  if (card.hasFreeSpace && position === FREE_POSITION) return card
  return saveBingoCard(clientId, {
    ...card,
    squares: card.squares.map((sq) => (sq.position === position ? { ...sq, ...patch } : sq)),
  })
}

/** No-ops on the FREE square while it's active. It's always completed, not toggleable. */
export async function toggleSquareCompleted(clientId: string, card: BingoCard, position: number): Promise<BingoCard> {
  if (card.hasFreeSpace && position === FREE_POSITION) return card
  return saveBingoCard(clientId, {
    ...card,
    squares: card.squares.map((sq) => (sq.position === position ? { ...sq, completed: !sq.completed } : sq)),
  })
}

/** Flips whether position 12 is the fixed FREE square. This never touches that square's own
 * stored label/completed, so switching it off and back on restores whatever was there. */
export async function setHasFreeSpace(clientId: string, card: BingoCard, hasFreeSpace: boolean): Promise<BingoCard> {
  return saveBingoCard(clientId, { ...card, hasFreeSpace })
}
