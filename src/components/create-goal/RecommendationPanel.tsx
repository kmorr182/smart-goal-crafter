import { useState } from 'react'
import { Button } from 'serious-component-library'
import type { GoalDraft } from '../../types/goal'
import type { GoalRecommendation } from '../../types/recommendation'
import { requestGoalRecommendation } from '../../utils/recommendation'
import styles from './RecommendationPanel.module.css'

export interface RecommendationPanelProps {
  draft: GoalDraft
  /** Disabled until the goal has enough content for the API's validation to accept it. */
  disabled: boolean
  /** Fired with the polished sentence whenever a new recommendation comes back, so Share can
   * offer it instead of the plain assembled sentence. */
  onRecommendation?: (result: GoalRecommendation) => void
}

/**
 * "Create recommendation": sends the assembled goal to smart-goal-crafter-api and shows back a
 * polished sentence plus a couple of smaller supporting goals.
 */
export function RecommendationPanel({ draft, disabled, onRecommendation }: RecommendationPanelProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GoalRecommendation | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setLoading(true)
    setError(null)
    try {
      const recommendation = await requestGoalRecommendation(draft)
      setResult(recommendation)
      onRecommendation?.(recommendation)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not get a recommendation right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrap}>
      <Button fullWidth loading={loading} disabled={disabled} onClick={handleClick}>
        {result ? 'Review again' : 'Create recommendation'}
      </Button>

      {error && <p className={styles.error}>{error}</p>}

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
