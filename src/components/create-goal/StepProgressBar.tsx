import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { Popover } from 'serious-component-library'
import type { StepCompletion, StepKey } from '../../types/goal'
import { STEP_ORDER, stepElementId } from '../../types/goal'
import styles from './StepProgressBar.module.css'

const STEP_RGB_VAR: Record<StepKey, string> = {
  s: 'var(--step-s-rgb)',
  m: 'var(--step-m-rgb)',
  a: 'var(--step-a-rgb)',
  r: 'var(--step-r-rgb)',
  t: 'var(--step-t-rgb)',
}

const SMART_REFERENCE: { letter: string; word: string; blurb: string }[] = [
  { letter: 'S', word: 'Specific', blurb: 'What exactly will you do — and where, or with whom?' },
  { letter: 'M', word: 'Measurable', blurb: "What number or evidence proves it's done?" },
  { letter: 'A', word: 'Achievable', blurb: 'Realistic, given your time and resources?' },
  { letter: 'R', word: 'Relevant', blurb: 'Why does this matter to you right now?' },
  { letter: 'T', word: 'Time-bound', blurb: "What's your target date?" },
]

export interface StepProgressBarProps {
  completion: StepCompletion
}

/**
 * Sticky bottom nav for the five SMART steps. Doubles as scroll-spy (highlights whichever
 * step is currently in view) and click-to-jump navigation.
 */
export function StepProgressBar({ completion }: StepProgressBarProps) {
  const [activeStep, setActiveStep] = useState<StepKey>('s')

  useEffect(() => {
    const elements = STEP_ORDER.map(({ key }) => document.getElementById(stepElementId(key))).filter(
      (el): el is HTMLElement => el !== null,
    )
    if (elements.length === 0) return

    // A step counts as "active" once it crosses a band roughly a third of the way down the
    // viewport, not merely whenever any part of it is on screen, otherwise two adjacent
    // steps both being partially visible would fight over which one lights up.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length === 0) return
        const topMost = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b))
        const key = topMost.target.id.replace('smart-step-', '') as StepKey
        setActiveStep(key)
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  function handleJump(key: StepKey) {
    document.getElementById(stepElementId(key))?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <nav className={styles.bar} aria-label="SMART step progress">
      <div className={styles.track}>
        {STEP_ORDER.map(({ key, letter, label }) => {
          const isActive = key === activeStep
          return (
            <button
              key={key}
              type="button"
              className={[styles.step, isActive ? styles.active : ''].filter(Boolean).join(' ')}
              style={{ '--step-rgb': STEP_RGB_VAR[key] } as CSSProperties}
              onClick={() => handleJump(key)}
              aria-current={isActive ? 'step' : undefined}
            >
              <span className={[styles.dot, completion[key] ? styles.filled : ''].filter(Boolean).join(' ')}>
                {letter}
              </span>
              <span className={styles.label}>{label}</span>
            </button>
          )
        })}
      </div>

      <Popover
        trigger={
          <button type="button" className={styles.help} aria-label="What does SMART mean?">
            ?
          </button>
        }
      >
        <div className={styles.helpContent}>
          <div className={styles.helpTitle}>SMART, quickly</div>
          {SMART_REFERENCE.map((item) => (
            <div key={item.letter} className={styles.helpItem}>
              <strong>
                {item.letter} — {item.word}.
              </strong>{' '}
              {item.blurb}
            </div>
          ))}
        </div>
      </Popover>
    </nav>
  )
}
