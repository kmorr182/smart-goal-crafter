import { useEffect, useState } from 'react'
import { useAuth } from 'react-oidc-context'
import { Select, ToggleSwitch } from 'serious-component-library'
import { BingoSquare } from '../components/bingo/BingoSquare'
import { SettingsButton } from '../components/SettingsButton'
import { CATEGORIES, detectCategory } from '../data/categories'
import { getOrCreateCard, setHasFreeSpace, toggleSquareCompleted, updateSquare } from '../lib/bingoCardRepository'
import { FREE_POSITION, emptySquares } from '../types/bingoCard'
import type { BingoCard } from '../types/bingoCard'
import type { CategoryKey } from '../types/goal'
import styles from './GoalBingo.module.css'

const CATEGORY_KEYS = Object.keys(CATEGORIES) as CategoryKey[]

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

function localOnlyCard(): BingoCard {
  return { id: 'local', hasFreeSpace: true, squares: emptySquares(), createdAt: new Date().toISOString() }
}

export function GoalBingo() {
  const auth = useAuth()
  const [card, setCard] = useState<BingoCard | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null)
  const [isEditingLabel, setIsEditingLabel] = useState(false)
  const [draft, setDraft] = useState('')
  const [categoryDraft, setCategoryDraft] = useState<CategoryKey>('uncategorized')

  useEffect(() => {
    if (auth.isLoading) return

    if (!auth.isAuthenticated) {
      setCard(localOnlyCard())
      setLoadError(null)
      setIsLoading(false)
      return
    }

    const token = auth.user?.access_token
    if (!token) {
      setLoadError('Could not read your sign-in session.')
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)
    getOrCreateCard(token)
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
  }, [auth.isLoading, auth.isAuthenticated, auth.user])

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
            <p className={styles.statusText}>
              {loadError ?? 'Something went wrong loading your card.'} Please refresh the page to try again.
            </p>
          </div>
        </main>
      </>
    )
  }

  const squares = card.squares.map((sq) => {
    const isFree = card.hasFreeSpace && sq.position === FREE_POSITION
    const label = isFree ? '' : sq.label
    const category = sq.categoryOverride ?? (label ? detectCategory(label) : null)
    return { ...sq, isFree, completed: isFree ? true : sq.completed, label, category }
  })
  const completedCount = squares.filter((sq) => sq.completed).length
  const emptyCount = squares.filter((sq) => !sq.isFree && !sq.label).length
  const selectedSquare = selectedPosition !== null ? squares.find((sq) => sq.position === selectedPosition) ?? null : null
  const labelDirty = isEditingLabel && selectedSquare !== null && draft.trim() !== selectedSquare.label
  const categoryDirty = selectedSquare !== null && categoryDraft !== (selectedSquare.category ?? 'uncategorized')
  const isDirty = labelDirty || categoryDirty

  async function commitChanges(): Promise<boolean> {
    if (!card || selectedPosition === null) return true
    if (!auth.isAuthenticated) {
      auth.signinPopup()
      return false
    }
    const token = auth.user?.access_token
    if (!token) return false
    try {
      const updated = await updateSquare(token, card, selectedPosition, {
        label: draft.trim(),
        categoryOverride: categoryDraft,
      })
      setCard(updated)
      setSaveError(null)
      return true
    } catch (err) {
      setSaveError(errorMessage(err))
      return false
    }
  }

  async function selectPosition(position: number | null) {
    if (isDirty) {
      const shouldSave = window.confirm('Save your changes to this square?')
      if (shouldSave && !(await commitChanges())) return
    }
    setSelectedPosition(position)
    const sq = position !== null ? squares.find((s) => s.position === position) : null
    setDraft(sq ? sq.label : '')
    setCategoryDraft(sq ? sq.category ?? 'uncategorized' : 'uncategorized')
    setIsEditingLabel(sq ? sq.label === '' : false)
  }

  async function handleSave() {
    if (await commitChanges()) setIsEditingLabel(false)
  }

  async function handleMarkFinished() {
    if (!card || selectedPosition === null) return
    if (!auth.isAuthenticated) {
      auth.signinPopup()
      return
    }
    const token = auth.user?.access_token
    if (!token) return
    try {
      const updated = await toggleSquareCompleted(token, card, selectedPosition)
      setCard(updated)
      setSaveError(null)
    } catch (err) {
      setSaveError(errorMessage(err))
    }
  }

  function selectCategory(value: string) {
    setCategoryDraft(value as CategoryKey)
  }

  async function handleFreeSpaceChange(checked: boolean) {
    if (!card) return
    if (!auth.isAuthenticated) {
      auth.signinPopup()
      return
    }
    const token = auth.user?.access_token
    if (!token) return
    try {
      const updated = await setHasFreeSpace(token, card, checked)
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

            {!selectedSquare.isFree && (
              <div className={styles.actionBarCategory}>
                <span className={styles.categoryDot} style={{ background: CATEGORIES[categoryDraft].colorVar }} />
                <Select
                  size="sm"
                  aria-label="Category"
                  value={categoryDraft}
                  onChange={(event) => selectCategory(event.target.value)}
                >
                  {CATEGORY_KEYS.map((key) => (
                    <option key={key} value={key}>
                      {CATEGORIES[key].label}
                    </option>
                  ))}
                </Select>
              </div>
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
              {!auth.isAuthenticated ? (
                <button type="button" onClick={() => auth.signinPopup()}>
                  Sign in to save
                </button>
              ) : (
                <button type="button" onClick={() => void handleSave()} disabled={!isDirty}>
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