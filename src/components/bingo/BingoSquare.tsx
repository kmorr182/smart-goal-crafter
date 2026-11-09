import type { CSSProperties } from 'react'
import styles from './BingoSquare.module.css'

export interface BingoSquareProps {
  isFree: boolean
  label: string
  completed: boolean
  isSelected: boolean
  /** CSS var string (e.g. 'var(--cat-health)') the filled tile tints its fill from. */
  categoryColorVar?: string
  onSelect: () => void
}

/** One square: the fixed FREE tile, an empty "+ Add a goal" placeholder, or a filled tile.
 * Clicking either placeholder/filled tile just selects it.
 * Editing and marking finished happen from the shared action bar below.
 **/
export function BingoSquare({ isFree, label, completed, isSelected, categoryColorVar, onSelect }: BingoSquareProps) {
  if (isFree) {
    return (
      <div className={styles.free} aria-label="Free square">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#f4c550" aria-hidden="true">
          <path d="M12 2l2.9 6.6L22 9.6l-5 4.9 1.2 7-6.2-3.6-6.2 3.6 1.2-7-5-4.9 7.1-1z" />
        </svg>
        <span className={styles.freeLabel}>FREE</span>
      </div>
    )
  }

  if (!label) {
    return (
      <button
        type="button"
        className={[styles.empty, isSelected ? styles.selected : ''].filter(Boolean).join(' ')}
        aria-pressed={isSelected}
        aria-label="Empty square"
        onClick={onSelect}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span>Add a goal</span>
      </button>
    )
  }

  // --tile-color feeds the CSS color-mix() tints in BingoSquare.module.css: a light pastel
  // fill while the goal is open, a darker shade of the same hue once it's completed, so the
  // category stays identifiable in both states instead of being replaced by a fixed color.
  return (
    <button
      type="button"
      className={[styles.filled, completed ? styles.completed : '', isSelected ? styles.selected : ''].filter(Boolean).join(' ')}
      style={categoryColorVar ? ({ '--tile-color': categoryColorVar } as CSSProperties) : undefined}
      aria-pressed={isSelected}
      aria-label={`${label}, ${completed ? 'completed' : 'not completed yet'}`}
      onClick={onSelect}
    >
      <span className={styles.label}>{label}</span>
      {completed && (
        <span className={styles.check} aria-hidden="true">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#1c3664" strokeWidth="3">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
      )}
    </button>
  )
}
