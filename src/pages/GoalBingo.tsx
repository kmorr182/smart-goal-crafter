import { useState } from 'react'
import { ToggleSwitch } from 'serious-component-library'
import { BingoSquare } from '../components/bingo/BingoSquare'
import { SettingsButton } from '../components/SettingsButton'
import { CATEGORIES, detectCategory } from '../data/categories'
import { getOrCreateCard, setHasFreeSpace, setSquareLabel, toggleSquareCompleted } from '../lib/bingoCardRepository'
import { FREE_POSITION } from '../types/bingoCard'
import styles from './GoalBingo.module.css'

// Hardcoded, not the shared --step-*-rgb tokens in steps.css 
// This page is self-contained for now.
// Need to pull out hard coded colors into shared theme file
const LETTERS = [
  { char: 'B', color: 'rgb(176,95,158)' },
  { char: 'I', color: 'rgb(158,68,138)' },
  { char: 'N', color: 'rgb(140,48,118)' },
  { char: 'G', color: 'rgb(118,33,98)' },
  { char: 'O', color: 'rgb(92,20,78)' },
]

export function GoalBingo() {
  const [card, setCard] = useState(() => getOrCreateCard())
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null)
  const [isEditingLabel, setIsEditingLabel] = useState(false)
  const [draft, setDraft] = useState('')

  // Category is derived from the label, not stored, so it can never drift out of sync with
  // what's actually typed in the square. Uses the CATEGORIES/detectCategory
  // one category system for the whole app.
  const squares = card.squares.map((sq) => {
    const isFree = card.hasFreeSpace && sq.position === FREE_POSITION
    const label = isFree ? '' : sq.label
    const category = label ? detectCategory(label) : null
    return { ...sq, isFree, completed: isFree ? true : sq.completed, label, category }
  })
  const completedCount = squares.filter((sq) => sq.completed).length
  const emptyCount = squares.filter((sq) => !sq.isFree && !sq.label).length
  const selectedSquare = selectedPosition !== null ? squares.find((sq) => sq.position === selectedPosition) ?? null : null
  const isDirty = isEditingLabel && selectedSquare !== null && draft.trim() !== selectedSquare.label

  function commitDraft() {
    if (selectedPosition !== null) {
      setCard(setSquareLabel(selectedPosition, draft.trim()))
    }
  }

  // Native confirm is the explicit "ask before losing changes" step. No auto-save.
  function selectPosition(position: number | null) {
    if (isDirty && window.confirm('Save your changes to this square?')) {
      commitDraft()
    }
    setSelectedPosition(position)
    const sq = position !== null ? squares.find((s) => s.position === position) : null
    setDraft(sq ? sq.label : '')
    // An empty square has nothing to show read-only, so it opens straight into editing;
    // a square with a goal stays read-only until its label is clicked.
    setIsEditingLabel(sq ? sq.label === '' : false)
  }

  function handleSave() {
    commitDraft()
    setIsEditingLabel(false)
  }

  function handleMarkFinished() {
    if (selectedPosition !== null) {
      setCard(toggleSquareCompleted(selectedPosition))
    }
  }

  return (
    <>
      <SettingsButton />
      <main className={styles.page} style={selectedSquare ? { paddingBottom: 180 } : undefined}>
      <div className={styles.inner}>
        <p className={styles.kicker}>A different way to see your progress,</p>
        <h1 className={styles.heading}>Goal Bingo</h1>
        <p className={styles.subhead}>
          Every square is a goal. Fill one in, then mark it off the moment you finish it.
        </p>

        <div className={styles.controls}>
          <ToggleSwitch
            label="Include a free space"
            size="sm"
            showIcons={false}
            checked={card.hasFreeSpace}
            onChange={(event) => {
              setCard(setHasFreeSpace(event.target.checked))
              if (selectedPosition === FREE_POSITION) selectPosition(null)
            }}
          />
        </div>

        <div className={styles.letters}>
          {LETTERS.map((l) => (
            <div key={l.char} className={styles.letter} style={{ color: l.color }}>
              {l.char}
            </div>
          ))}
        </div>

        <div className={styles.grid}>
          {squares.map((sq) => (
            <BingoSquare
              key={sq.position}
              isFree={sq.isFree}
              label={sq.label}
              completed={sq.completed}
              isSelected={selectedPosition === sq.position}
              categoryColorVar={sq.category ? CATEGORIES[sq.category].colorVar : undefined}
              onSelect={() => selectPosition(selectedPosition === sq.position ? null : sq.position)}
            />
          ))}
        </div>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            {completedCount} of 25 completed · {emptyCount} empty squares left
          </p>
        </div>
      </div>

      {selectedSquare && (
        <div className={styles.actionBarWrap}>
          <div className={styles.actionBar}>
            <button type="button" className={styles.actionBarClose} aria-label="Close" onClick={() => selectPosition(null)}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1c3664" strokeWidth="2.5" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>

            {selectedSquare.category && (
              <p className={styles.actionBarCategory}>
                <span className={styles.categoryDot} style={{ background: CATEGORIES[selectedSquare.category].colorVar }} />
                {CATEGORIES[selectedSquare.category].label}
              </p>
            )}

            {isEditingLabel ? (
              <textarea
                className={styles.actionBarInput}
                value={draft}
                maxLength={280}
                placeholder="Type a goal…"
                autoFocus
                onChange={(event) => setDraft(event.target.value)}
              />
            ) : (
              <button type="button" className={styles.actionBarLabel} onClick={() => setIsEditingLabel(true)}>
                {selectedSquare.label}
              </button>
            )}

            <div className={styles.actionBarButtons}>
              {isEditingLabel && (
                <button type="button" onClick={handleSave} disabled={draft.trim() === selectedSquare.label}>
                  Save
                </button>
              )}
              {selectedSquare.label && (
                <button type="button" onClick={handleMarkFinished}>
                  {selectedSquare.completed ? 'Mark as not finished' : 'Mark as finished'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      </main>
    </>
  )
}
