import type { CSSProperties } from 'react'
import { Button } from 'serious-component-library'
import type { GoalDraft, GoalMetric, StepCompletion, StepKey } from '../../types/goal'
import { STEP_ORDER } from '../../types/goal'
import { CATEGORIES } from '../../data/categories'
import { confidenceLabel } from '../../utils/confidence'
import { formatDate } from '../../utils/date'
import { usePulseOnComplete } from '../../hooks/usePulseOnComplete'
import { GoalSentence } from './GoalSentence'
import { RecommendationPanel } from './RecommendationPanel'
import { ShareGoal } from './ShareGoal'
import styles from './GoalPreviewPanel.module.css'

const STEP_RGB_VAR: Record<StepKey, string> = {
  s: 'var(--step-s-rgb)',
  m: 'var(--step-m-rgb)',
  a: 'var(--step-a-rgb)',
  r: 'var(--step-r-rgb)',
  t: 'var(--step-t-rgb)',
}

function MeterSegment({ stepKey, label, on }: { stepKey: StepKey; label: string; on: boolean }) {
  const pulsing = usePulseOnComplete(on)
  return (
    <div className={styles.meterSeg} style={{ '--step-rgb': STEP_RGB_VAR[stepKey] } as CSSProperties}>
      <div className={[styles.meterDot, on ? styles.on : '', pulsing ? styles.pulse : ''].filter(Boolean).join(' ')} />
      <span className={[styles.meterLabel, on ? styles.on : ''].filter(Boolean).join(' ')}>{label}</span>
    </div>
  )
}

/** The metric line on the saved goal card — differs by metric mode. */
function metricSummary(metric: GoalMetric): string {
  if (metric.mode === 'quantity') return `${metric.start || '0'} → ${metric.target} ${metric.unit}`
  return metric.criterion
}

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

export interface GoalPreviewPanelProps {
  draft: GoalDraft
  completion: StepCompletion
  saved: boolean
  onSave: () => void
  onEdit: () => void
}

export function GoalPreviewPanel({ draft, completion, saved, onSave, onEdit }: GoalPreviewPanelProps) {
  const category = CATEGORIES[draft.category]
  const canSave = completion.s && completion.m && completion.t
  const dueDateLabel = formatDate(draft.dueDate)

  if (saved) {
    return (
      <div className={styles.panel}>
        <div className={styles.successView}>
          <div className={styles.successCheck}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <h3>Saved</h3>
          <p>Your first SMART goal is set.</p>
          <div className={styles.goalCardFinal}>
            <div className={styles.goalCardFinalHead}>
              <span className={styles.goalCardFinalSwatch} style={{ background: category.colorVar }} />
              {category.label}
            </div>
            <div>{draft.specific}</div>
            <div className={styles.goalCardFinalMeta}>
              {metricSummary(draft.metric)} · due {dueDateLabel}
            </div>
          </div>
          <Button variant="outline" className={styles.editButton} onClick={onEdit}>
            Edit goal
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.panel}>
      <div className={styles.panelLabel}>Progress &amp; save</div>
      {draft.idea && (
        <span className={styles.categoryBadge} style={{ background: category.colorVar }}>
          {category.label}
        </span>
      )}
      <div className={styles.meter}>
        {STEP_ORDER.map(({ key, letter }) => (
          <MeterSegment key={key} stepKey={key} label={letter} on={completion[key]} />
        ))}
      </div>

      <div className={styles.sentenceBlock}>
        <GoalSentence draft={draft} completion={completion} />
      </div>

      <RecommendationPanel draft={draft} disabled={!canSave} />

      <div className={styles.rationale}>
        {completion.a && (
          <div className={styles.rationaleItem} style={{ '--step-rgb': STEP_RGB_VAR.a } as CSSProperties}>
            <CheckIcon />
            <span>
              <strong>Confidence:</strong> {draft.confidence}/10 — {confidenceLabel(draft.confidence)}
              {draft.achievableNote && ` — ${draft.achievableNote}`}
            </span>
          </div>
        )}
      </div>

      <ShareGoal draft={draft} disabled={!canSave} />

      <Button className={styles.saveButton} disabled={!canSave} onClick={onSave}>
        Save this goal
      </Button>
    </div>
  )
}
