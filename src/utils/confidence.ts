/** Qualitative label for a 1–10 confidence rating, shared by the Achievable step and the preview panel. */
export function confidenceLabel(value: number): string {
  if (value <= 3) return 'A real stretch'
  if (value <= 6) return 'Ambitious but doable'
  if (value <= 8) return 'Confident'
  return 'Very confident'
}

/**
 * A nudge at either end of the confidence range — too low suggests breaking the goal down,
 * too high suggests raising the bar. Null in the healthy middle, where no suggestion is needed.
 */
export function achievabilitySuggestion(value: number): string | null {
  if (value <= 3) {
    return "That's a big stretch. Consider breaking this into 2–3 smaller goals you can build momentum with first."
  }
  if (value >= 9) {
    return 'This sounds very achievable. Consider raising the bar — a bit more ambition could make it more rewarding.'
  }
  return null
}
