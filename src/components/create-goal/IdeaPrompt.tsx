import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { CATEGORIES, IDEA_CHIPS, IDEA_PLACEHOLDERS, detectCategory } from '../../data/categories'
import styles from './IdeaPrompt.module.css'
import { Button } from 'serious-component-library'

export interface IdeaPromptProps {
  value: string
  onChange: (value: string) => void
  onContinue: () => void
  /** Before the flow starts, the hero fills the screen (clearing exactly the footer's height,
   * via .page's flex layout) for a full-page first impression. Once the step list appears
   * below it, it drops to its natural height instead of leaving a screen-tall gap above them. */
  started: boolean
}

/**
 * The hero: a ruled-paper "journal entry" framing for the idea input, instead of the generic
 * kicker/heading/search-bar pattern. Idea examples are styled as sticky notes in the margin;
 * each one picks up its real category color (via detectCategory) so the tint isn't arbitrary.
 * The input and "Begin" stamp are plain native elements rather than the component library's
 * Input/Button — this is a deliberately bespoke, one-off typographic treatment (underline-only,
 * handwritten voice) that the library's boxed form controls aren't meant to produce.
 */
export function IdeaPrompt({ value, onChange, onContinue, started }: IdeaPromptProps) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const focused = useRef(false)

  useEffect(() => {
    const id = window.setInterval(() => {
      if (focused.current || value) return
      setPlaceholderIndex((i) => (i + 1) % IDEA_PLACEHOLDERS.length)
    }, 2600)
    return () => window.clearInterval(id)
  }, [value])

  const canContinue = value.trim().length >= 3

  return (
    <section className={[styles.hero, !started && styles.fullScreen].filter(Boolean).join(' ')}>
      <div className={styles.content}>
        <p className={styles.kicker}>Dear future me,</p>
        <h2 className={styles.heading}>What are we wanting to accomplish at this point in our life?</h2>
        <form
          className={styles.row}
          onSubmit={(event) => {
            event.preventDefault()
            if (canContinue) onContinue()
          }}
        >
          <span className={styles.lead}>I want to</span>
          {/* Grouped so the two wrap together. Without this, narrow screens could wrap just
              the button onto its own line, where it reads like one of the idea chips below
              rather than the submit action for the sentence above it. */}
          <div className={styles.inputRow}>
            <label htmlFor="idea-input" className={styles.srOnly}>
              Your rough idea
            </label>
            <input
              id="idea-input"
              type="text"
              className={styles.input}
              placeholder={IDEA_PLACEHOLDERS[placeholderIndex]}
              value={value}
              maxLength={120}
              required
              onChange={(event) => onChange(event.target.value)}
              onFocus={() => {
                focused.current = true
              }}
              onBlur={() => {
                focused.current = false
              }}
            />
            <Button type="submit" disabled={!canContinue}>
              Begin
            </Button>
          </div>
        </form>

        <div className={styles.notes}>
          {IDEA_CHIPS.map((chip) => {
            const color = CATEGORIES[detectCategory(chip)].colorVar
            return (
              <button
                key={chip}
                type="button"
                className={styles.note}
                style={{ '--note-color': color } as CSSProperties}
                onClick={() => onChange(chip.toLowerCase())}
              >
                {chip}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
