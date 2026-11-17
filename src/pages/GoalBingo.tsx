import { useEffect, useState } from 'react'
import { ToggleSwitch } from 'serious-component-library'
import { BingoSquare } from '../components/bingo/BingoSquare'
import { SettingsButton } from '../components/SettingsButton'
import { CATEGORIES, detectCategory } from '../data/categories'
import { getClientId } from '../lib/clientId'
import { getOrCreateCard, setHasFreeSpace, setSquareLabel, toggleSquareCompleted } from '../lib/bingoCardRepository'
import { FREE_POSITION } from '../types/bingoCard'
import type { BingoCard } from '../types/bingoCard'
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

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Something went wrong'
}

export function GoalBingo() {
  const [clientId] = useState(() => getClientId())
  const [card, setCard] = useState<BingoCard | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null)
  const [isEditingLabel, setIsEditingLabel] = useState(false)
  const [draft, setDraft] = useState('')

  useEffect(() => {
    let cancelled = false
    getOrCreateCard(clientId)
      .then((loaded) => {
        if (!cancelled) setCard(loaded)
      })
      .catch((err) => {
        if (!cancelled) setLoadError(errorMessage(err))
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [clientId])

  if (isLoading) {
    return (
      <>
        <SettingsButton />
        <main className={styles.page}>
          <div className={styles.inner}>
            <p className={styles.statusText}>Loading your card…</p>
          </div>
        </main>
      </>
    )
  }

  if (loadError || !card) {
    return (
      <>
        <SettingsButton />
        <main className={styles.page}>
          <div className={styles.inner}>
            <p className={styles.statusText}>{loadError ?? 'Something went wrong loading your card.'}</p>
          </div>
        </main>
      </>
    )
  }

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

  // Returns whether the commit actually succeeded (or there was nothing to commit), so callers
  // can tell a real failure apart from success instead of barreling ahead either way — a failed
  // save here used to get silently treated the same as a successful one.
  async function commitDraft(): Promise<boolean> {
    if (!card || selectedPosition === null) return true
    try {
      const updated = await setSquareLabel(clientId, card, selectedPosition, draft.trim())
      setCard(updated)
      setSaveError(null)
      return true
    } catch (err) {
      setSaveError(errorMessage(err))
      return false
    }
  }

  // Native confirm is the explicit "ask before losing changes" step. No auto-save. If the save
  // itself fails, stay put instead of switching away — otherwise the unsaved text would be
  // silently discarded along with the failed save, with only a page-level error banner as a clue.
  async function selectPosition(position: number | null) {
    if (isDirty) {
      const shouldSave = window.confirm('Save your changes to this square?')
      if (shouldSave && !(await commitDraft())) return
    }
    setSelectedPosition(position)
    const sq = position !== null ? squares.find((s) => s.position === position) : null
    setDraft(sq ? sq.label : '')
    // An empty square has nothing to show read-only, so it opens straight into editing;
    // a square with a goal stays read-only until its label is clicked.
    setIsEditingLabel(sq ? sq.label === '' : false)
  }

  // Only leave edit mode on an actual successful save — otherwise a failed save would show the
  // stale label as if nothing were wrong, with the draft hidden behind one more click to retry.
  async function handleSave() {
    if (await commitDraft()) setIsEditingLabel(false)
  }

  async function handleMarkFinished() {
    if (!card || selectedPosition === null) return
    try {
      const updated = await toggleSquareCompleted(clientId, card, selectedPosition)
      setCard(updated)
      setSaveError(null)
    } catch (err) {
      setSaveError(errorMessage(err))
    }
  }

  async function handleFreeSpaceChange(checked: boolean) {
    if (!card) return
    try {
      const updated = await setHasFreeSpace(clientId, card, checked)
      setCard(updated)
      setSaveError(null)
    } catch (err) {
      setSaveError(errorMessage(err))
    }
    if (selectedPosition === FREE_POSITION) await selectPosition(null)
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

        {saveError && <p className={styles.saveError}>{saveError}</p>}

        <div className={styles.controls}>
          <ToggleSwitch
            label="Include a free space"
            size="sm"
            showIcons={false}
            checked={card.hasFreeSpace}
            onChange={(event) => {
              void handleFreeSpaceChange(event.target.checked)
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
              onSelect={() => {
                void selectPosition(selectedPosition === sq.position ? null : sq.position)
              }}
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
            <button
              type="button"
              className={styles.actionBarClose}
              aria-label="Close"
              onClick={() => {
                void selectPosition(null)
              }}
            >
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
                <button type="button" onClick={() => void handleSave()} disabled={draft.trim() === selectedSquare.label}>
                  Save
                </button>
              )}
              {selectedSquare.label && (
                <button type="button" onClick={() => void handleMarkFinished()}>
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
