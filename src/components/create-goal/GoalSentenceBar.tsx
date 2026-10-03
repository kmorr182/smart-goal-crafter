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
  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        <GoalSentence draft={draft} completion={completion} />
      </div>
    </div>
  )
}
