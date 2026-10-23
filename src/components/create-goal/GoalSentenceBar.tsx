import { useEffect, useRef } from 'react'
import type { GoalDraft, StepCompletion } from '../../types/goal'
import { GoalSentence } from './GoalSentence'
import styles from './GoalSentenceBar.module.css'

export interface GoalSentenceBarProps {
  draft: GoalDraft
  completion: StepCompletion
}

/**
 * The live "In order to..., I will..., measured by..., by..." sentence, pinned to the top of
 * the page as you scroll through the steps below — full-width, matching StepProgressBar's
 * treatment at the bottom, so the two bars read as one family bookending the page.
 */
export function GoalSentenceBar({ draft, completion }: GoalSentenceBarProps) {
  const barRef = useRef<HTMLDivElement>(null)

  // The sentence wraps to a different number of lines as it fills in, so the bar's height
  // isn't constant — mirror it onto a CSS variable so anything scrolled-to on the page (the
  // step list, a clicked step) can reserve exactly enough clearance instead of being covered
  // by this sticky bar.
  useEffect(() => {
    const el = barRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      document.documentElement.style.setProperty('--sentence-bar-height', `${entry.contentRect.height}px`)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className={styles.bar} ref={barRef}>
      <div className={styles.inner}>
        <GoalSentence draft={draft} completion={completion} />
      </div>
    </div>
  )
}
