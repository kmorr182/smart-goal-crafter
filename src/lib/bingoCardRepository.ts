import type { BingoCard } from '../types/bingoCard'
import { FREE_POSITION, emptySquares } from '../types/bingoCard'
import { readJson, writeJson } from './localStorageJson'

const STORAGE_KEY = 'sgc.bingoCard.v1'

function readCard(): BingoCard | null {
  return readJson<BingoCard | null>(STORAGE_KEY, null)
}

function writeCard(card: BingoCard): BingoCard {
  writeJson(STORAGE_KEY, card)
  return card
}

/** Selects one single card. 
 * This always returns the single active card. */
export function getOrCreateCard(): BingoCard {
  const existing = readCard()
  if (existing) return existing
  return writeCard({
    id: crypto.randomUUID(),
    hasFreeSpace: true,
    squares: emptySquares(),
    createdAt: new Date().toISOString(),
  })
}

/** No-ops on the FREE square while it's active. Free space label isn't user-editable in that state. */
export function setSquareLabel(position: number, label: string): BingoCard {
  const card = getOrCreateCard()
  if (card.hasFreeSpace && position === FREE_POSITION) return card
  return writeCard({
    ...card,
    squares: card.squares.map((sq) => (sq.position === position ? { ...sq, label } : sq)),
  })
}

/** No-ops on the FREE square while it's active. It's always completed, not toggleable. */
export function toggleSquareCompleted(position: number): BingoCard {
  const card = getOrCreateCard()
  if (card.hasFreeSpace && position === FREE_POSITION) return card
  return writeCard({
    ...card,
    squares: card.squares.map((sq) => (sq.position === position ? { ...sq, completed: !sq.completed } : sq)),
  })
}

/** Flips whether position 12 is the fixed FREE square. This never touches that square's own
 * stored label/completed, so switching it off and back on restores whatever was there. */
export function setHasFreeSpace(hasFreeSpace: boolean): BingoCard {
  const card = getOrCreateCard()
  return writeCard({ ...card, hasFreeSpace })
}
