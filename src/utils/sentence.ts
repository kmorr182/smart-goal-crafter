import type { GoalDraft, GoalMetric } from '../types/goal'
import { formatDate } from './date'

function measurablePhrase(metric: GoalMetric): string {
  if (metric.mode === 'quantity') {
    return `reaching ${metric.target} ${metric.unit}${metric.start && metric.start !== '0' ? ` from ${metric.start}` : ''}`
  }
  return metric.criterion
}

/**
 * Plain-text assembly of the "In order to ___, I will ___, measured by ___, by ___" sentence
 * the live preview renders — used anywhere the goal needs to leave the app as a single string
 * (the recommendation mock, sharing) rather than the colored-span JSX version in
 * GoalPreviewPanel.
 */
export function buildGoalSentence(draft: GoalDraft): string {
  const dueDateLabel = formatDate(draft.dueDate) ?? 'a target date'
  const raw = `In order to ${draft.relevant}, I will ${draft.specific}, measured by ${measurablePhrase(draft.metric)}, by ${dueDateLabel}.`
  const collapsed = raw.replace(/\s+/g, ' ').trim()
  return collapsed.charAt(0).toUpperCase() + collapsed.slice(1)
}
