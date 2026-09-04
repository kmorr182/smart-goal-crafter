import { useState } from 'react'
import { Button } from 'serious-component-library'
import type { GoalDraft } from '../../types/goal'
import type { GoalRecommendation } from '../../types/recommendation'
import { requestGoalRecommendation } from '../../utils/recommendation'
import styles from './RecommendationPanel.module.css'

export interface RecommendationPanelProps {
  draft: GoalDraft
  /** Disabled until the goal has enough content to be worth reviewing (mirrors Save's gate). */
  disabled: boolean
}

/**
 * "Create recommendation": reviews the assembled goal sentence and suggests a couple of
 * smaller supporting goals. Currently backed by a mock (src/utils/recommendation.ts) rather
 * than a real model — see that file's comment for what swapping in a live API involves.
 *
 * The button itself is force-disabled below, ahead of that model actually being wired up —
 * `disabled` from the caller (the usual S/M/T completeness gate) is intentionally unused for
 * now. Once the feature is ready, drop the hardcoded `disabled` on the Button below and
 * destructure `disabled` here again.
 */
export function RecommendationPanel({ draft }: RecommendationPanelProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GoalRecommendation | null>(null)

  async function handleClick() {
    setLoading(true)
    try {
      setResult(await requestGoalRecommendation(draft))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrap}>
      <div title="Feature coming soon">
        <Button variant="outline" fullWidth loading={loading} disabled onClick={handleClick}>
          {result ? 'Review again' : 'Create recommendation'}
        </Button>
      </div>

      {result && (
        <div className={styles.result}>
          <div className={styles.resultHead}>
            <span className={styles.resultLabel}>Recommendation</span>
            <span className={styles.previewBadge}>Preview</span>
          </div>
          <p className={styles.polished}>{result.polishedSentence}</p>
          <div className={styles.supportingLabel}>Consider setting these alongside it:</div>
          <ul className={styles.supportingList}>
            {result.supportingGoals.map((idea) => (
              <li key={idea.title}>
                <strong>{idea.title}</strong>
                <span>{idea.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
