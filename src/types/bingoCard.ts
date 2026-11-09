export interface BingoSquare {
  position: number
  label: string
  completed: boolean
}

export const FREE_POSITION = 12
export const BOARD_SIZE = 25

export interface BingoCard {
  id: string
  /** Whether position 12 renders as the fixed, always-completed FREE square or a normal one.
   * Toggling this never clears that square's own label/completed.
   * Toggling on/off flips it back and whatever was there returns. */
  hasFreeSpace: boolean
  squares: BingoSquare[]
  createdAt: string
}

export function emptySquares(): BingoSquare[] {
  return Array.from({ length: BOARD_SIZE }, (_, position) => ({
    position,
    label: '',
    completed: false,
  }))
}
