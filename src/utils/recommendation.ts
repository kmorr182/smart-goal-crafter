import type { GoalDraft } from '../types/goal'
import type { GoalRecommendation } from '../types/recommendation'
import { CATEGORIES } from '../data/categories'
import { buildGoalSentence } from './sentence'

/**
 * Reviews a goal draft and returns a polished sentence plus a couple of supporting goal ideas.
 * This is a placeholder — it does not call a real model. Swap the body of this function for an
 * actual API request (with a server-held key; see the architecture note in the plan) once
 * that's ready. The call signature (`GoalDraft` in, `Promise<GoalRecommendation>` out) is
 * designed to stay the same either way, so nothing calling this needs to change.
 */
export async function requestGoalRecommendation(draft: GoalDraft): Promise<GoalRecommendation> {
  // Simulated network latency so the loading state in the UI is exercised honestly.
  await new Promise((resolve) => setTimeout(resolve, 900 + Math.random() * 500))

  const category = CATEGORIES[draft.category]

  return {
    // A real model would take this same plain-text sentence as input and hand back something
    // better; the mock just reuses it verbatim so the flow has something honest to show.
    polishedSentence: buildGoalSentence(draft),
    supportingGoals: category.supportingGoalIdeas,
  }
}
