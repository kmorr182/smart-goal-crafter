export type CategoryKey = 'health' | 'career' | 'finance' | 'learning' | 'relationships' | 'personal'

/**
 * The Measurable piece of a SMART goal — either a running number ('quantity': a target, a
 * unit, and where it starts from) or a single yes/no completion criterion ('milestone'), for
 * goals that aren't naturally a count (a promotion, a certification, a finished draft).
 */
export type GoalMetric =
  | { mode: 'quantity'; target: string; unit: string; start: string }
  | { mode: 'milestone'; criterion: string }

export const EMPTY_QUANTITY_METRIC: GoalMetric = { mode: 'quantity', target: '', unit: '', start: '0' }
export const EMPTY_MILESTONE_METRIC: GoalMetric = { mode: 'milestone', criterion: '' }

/**
 * A goal in progress, one field per SMART letter (plus the category it was detected under).
 * Mirrors the shape validated in the smart-goal-creator.html prototype's `recompute()`.
 */
export interface GoalDraft {
  /** The rough idea the user started from, before it became a SMART goal. */
  idea: string
  category: CategoryKey
  /** Specific */
  specific: string
  /** Measurable */
  metric: GoalMetric
  /** Achievable */
  confidence: number
  achievableNote: string
  /** Relevant */
  relevant: string
  /** Time-bound */
  dueDate: string
}

export const EMPTY_GOAL_DRAFT: GoalDraft = {
  idea: '',
  category: 'personal',
  specific: '',
  metric: EMPTY_QUANTITY_METRIC,
  confidence: 5,
  achievableNote: '',
  relevant: '',
  dueDate: '',
}

export type StepKey = 's' | 'm' | 'a' | 'r' | 't'

/** Letter + full name for each step, in order. The single source of truth other places (the
 * meter, the letter badges, the bottom progress bar) build their own step lists from. */
export const STEP_ORDER: { key: StepKey; letter: string; label: string }[] = [
  { key: 's', letter: 'S', label: 'Specific' },
  { key: 'm', letter: 'M', label: 'Measurable' },
  { key: 'a', letter: 'A', label: 'Achievable' },
  { key: 'r', letter: 'R', label: 'Relevant' },
  { key: 't', letter: 'T', label: 'Time-bound' },
]

/** DOM id for a step's section. Shared between SmartStep (which sets it) and anything that
 * needs to scroll to or observe a step (the bottom progress bar's scroll-spy and click-to-jump). */
export function stepElementId(key: StepKey): string {
  return `smart-step-${key}`
}

/** Which SMART letters are meaningfully filled in, computed from a draft. */
export interface StepCompletion {
  s: boolean
  m: boolean
  a: boolean
  r: boolean
  t: boolean
}

export function computeCompletion(draft: GoalDraft): StepCompletion {
  return {
    s: draft.specific.trim().length > 4,
    m:
      draft.metric.mode === 'quantity'
        ? Boolean(draft.metric.target) && Boolean(draft.metric.unit)
        : draft.metric.criterion.trim().length > 4,
    a: draft.achievableNote.trim().length > 4,
    r: draft.relevant.trim().length > 4,
    t: Boolean(draft.dueDate),
  }
}
