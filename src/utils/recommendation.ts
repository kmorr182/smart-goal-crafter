import type { GoalDraft } from '../types/goal'
import type { GoalRecommendation } from '../types/recommendation'


// What you write in recommendation.ts:
const API_URL = import.meta.env.VITE_API_URL ?? ''

/**
 * Reviews a goal draft and returns a polished sentence plus supporting goal ideas, via the
 * smart-goal-crafter-api service (a separate repo — see its README for the Claude call itself).
 * `/api` is proxied to that service's dev server by vite.config.ts in local dev; production
 * will need an equivalent rewrite once the API has a deployed home.
 */
export async function requestGoalRecommendation(draft: GoalDraft): Promise<GoalRecommendation> {
  const response = await fetch(`${API_URL}/api/recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(draft),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error || `Request failed (${response.status})`)
  }

  return response.json()
}
