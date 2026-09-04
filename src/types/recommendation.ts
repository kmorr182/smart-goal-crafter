export interface SupportingGoalIdea {
  title: string
  reason: string
}

/** Output of reviewing a goal: a cleaned-up sentence plus a couple of smaller supporting ideas. */
export interface GoalRecommendation {
  polishedSentence: string
  supportingGoals: SupportingGoalIdea[]
}
