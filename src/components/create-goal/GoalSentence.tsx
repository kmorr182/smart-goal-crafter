import type { ReactNode } from 'react'
import type { GoalDraft, GoalMetric, StepCompletion } from '../../types/goal'
import { formatDate } from '../../utils/date'
import styles from './GoalSentence.module.css'

/** The "measured by ..." clause of the live sentence — phrasing differs by metric mode. */
function measurableClause(metric: GoalMetric, partClass: string): ReactNode {
  if (metric.mode === 'quantity') {
    return (
      <>
        reaching{' '}
        <span className={partClass}>
          {metric.target} {metric.unit}
        </span>{' '}
        (from {metric.start || '0'})
      </>
    )
  }
  return <span className={partClass}>{metric.criterion}</span>
}

export interface GoalSentenceProps {
  draft: GoalDraft
  completion: StepCompletion
}

/** The live "In order to..., I will..., measured by..., by..." sentence, shared between the
 * sticky top bar (GoalSentenceBar) and the save panel's own goal-so-far summary. */
export function GoalSentence({ draft, completion }: GoalSentenceProps) {
  const dueDateLabel = formatDate(draft.dueDate)

  return (
    <span className={styles.sentence}>
      In order to{' '}
      {completion.r ? (
        <span className={styles.partR}>{draft.relevant}</span>
      ) : (
        <span className={styles.blank}>something that matters to you</span>
      )}
      , I will{' '}
      {completion.s ? (
        <span className={styles.partS}>{draft.specific}</span>
      ) : (
        <span className={styles.blank}>something specific</span>
      )}
      , measured by{' '}
      {completion.m ? (
        measurableClause(draft.metric, styles.partM)
      ) : (
        <span className={styles.blank}>a target number</span>
      )}
      , by{' '}
      {completion.t ? <span className={styles.partT}>{dueDateLabel}</span> : <span className={styles.blank}>a target date</span>}.
    </span>
  )
}
