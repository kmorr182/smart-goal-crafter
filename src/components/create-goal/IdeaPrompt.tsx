import { useEffect, useRef, useState } from 'react'
import { Input, Button } from 'serious-component-library'
import { IDEA_CHIPS, IDEA_PLACEHOLDERS } from '../../data/categories'
import styles from './IdeaPrompt.module.css'

export interface IdeaPromptProps {
  value: string
  onChange: (value: string) => void
  onContinue: () => void
}

/** The hero: idea input with a cycling placeholder, quick-pick example chips, and Continue. */
export function IdeaPrompt({ value, onChange, onContinue }: IdeaPromptProps) {
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
    <section className={styles.hero}>
      <div className={styles.kicker}>Start with a rough idea</div>
      <h1 className={styles.heading}>What do you want to work on?</h1>
      <p className={styles.lede}>
        Type it however it comes to mind — vague is fine. You'll shape it into a real, specific goal below.
      </p>
      <div className={styles.row}>
        <Input
          size="lg"
          fullWidth
          aria-label="Your rough idea"
          placeholder={`e.g. ${IDEA_PLACEHOLDERS[placeholderIndex]}`}
          value={value}
          maxLength={120}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => {
            focused.current = true
          }}
          onBlur={() => {
            focused.current = false
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && canContinue) onContinue()
          }}
        />
        <Button size="lg" disabled={!canContinue} onClick={onContinue}>
          Continue
        </Button>
      </div>
      <div className={styles.chipRow}>
        {IDEA_CHIPS.map((chip) => (
          <button key={chip} type="button" className={styles.chip} onClick={() => onChange(chip.toLowerCase())}>
            {chip}
          </button>
        ))}
      </div>
    </section>
  )
}
