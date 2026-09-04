import type { CategoryKey } from '../types/goal'

export interface CategoryInfo {
  label: string
  /** CSS var, e.g. 'var(--cat-health)' — see src/styles/steps.css. */
  colorVar: string
  /** Keywords checked against the user's rough idea (case-insensitive substring match). */
  keywords: string[]
  /**
   * Example content used to seed the "Use an example" chips and placeholders. `relevant` is
   * phrased to complete "In order to ___" (see the live goal sentence), not as a standalone
   * sentence.
   */
  example: {
    specific: string
    target: number
    unit: string
    relevant: string
  }
  /** Smaller goals that tend to support this category's goals — used by the recommendation panel. */
  supportingGoalIdeas: { title: string; reason: string }[]
}

export const CATEGORIES: Record<CategoryKey, CategoryInfo> = {
  health: {
    label: 'Health & Fitness',
    colorVar: 'var(--cat-health)',
    keywords: ['health', 'fit', 'run', 'gym', 'weight', 'exercise', 'sleep', 'diet', 'workout', 'shape'],
    example: {
      specific: 'Run a 5K race without stopping',
      target: 5,
      unit: 'km',
      relevant: 'have more energy for the people I love',
    },
    supportingGoalIdeas: [
      { title: 'Track your sleep for one week', reason: 'Energy and consistency often start with rest — this shows your real baseline.' },
      { title: 'Find a workout partner or class', reason: 'Goals with built-in accountability are far more likely to stick.' },
    ],
  },
  career: {
    label: 'Career',
    colorVar: 'var(--cat-career)',
    keywords: ['job', 'career', 'promot', 'work', 'resume', 'interview', 'skill', 'certif'],
    example: {
      specific: 'Get promoted to senior designer',
      target: 1,
      unit: 'sessions',
      relevant: "reflect the work I've put in this year",
    },
    supportingGoalIdeas: [
      { title: 'Ask a mentor for quarterly feedback', reason: 'Regular outside perspective catches blind spots before a review does.' },
      { title: 'Document one win each week', reason: "Makes the case for you obvious when it's time to make it." },
    ],
  },
  finance: {
    label: 'Finance',
    colorVar: 'var(--cat-finance)',
    keywords: ['money', 'save', 'saving', 'debt', 'budget', 'invest', 'financ', 'house', 'pay off'],
    example: {
      specific: 'Save $5,000 toward a house down payment',
      target: 5000,
      unit: '$',
      relevant: 'have stability going into the next chapter',
    },
    supportingGoalIdeas: [
      { title: 'Automate a weekly transfer to savings', reason: 'Removes the willpower requirement — the goal happens by default.' },
      { title: 'Track spending for one month first', reason: 'Knowing where the money actually goes makes the target realistic.' },
    ],
  },
  learning: {
    label: 'Learning',
    colorVar: 'var(--cat-learning)',
    keywords: ['learn', 'study', 'course', 'language', 'spanish', 'read', 'book', 'degree'],
    example: {
      specific: 'Hold a 10-minute conversation in Spanish',
      target: 20,
      unit: 'lessons',
      relevant: 'talk with family in their first language',
    },
    supportingGoalIdeas: [
      { title: 'Practice 10 minutes daily instead of long sessions', reason: 'Frequency beats duration for building a new skill.' },
      { title: 'Find a conversation partner or tutor', reason: 'Real feedback accelerates progress far more than solo study.' },
    ],
  },
  relationships: {
    label: 'Relationships',
    colorVar: 'var(--cat-relationships)',
    keywords: ['relationship', 'family', 'friend', 'partner', 'marriage', 'connect'],
    example: {
      specific: 'Have a weekly no-phones dinner with my partner',
      target: 12,
      unit: 'sessions',
      relevant: 'make more room for real conversation, without screens',
    },
    supportingGoalIdeas: [
      { title: 'Put a recurring reminder on the calendar', reason: "Good intentions fade; a standing plan doesn't." },
      { title: 'Ask what would make it feel special to them too', reason: "It's their time to enjoy as much as yours to keep." },
    ],
  },
  personal: {
    label: 'Personal',
    colorVar: 'var(--cat-personal)',
    keywords: [],
    example: {
      specific: 'Read 12 books this year',
      target: 12,
      unit: 'books',
      relevant: 'spend more time on the things that matter to me',
    },
    supportingGoalIdeas: [
      { title: 'Keep the book (or activity) visible and ready', reason: 'Removing friction is often the real key to consistency.' },
      { title: 'Set a small weekly check-in with yourself', reason: 'A short regular reflection keeps the goal from quietly slipping.' },
    ],
  },
}

/** Idea → category, by keyword match. Falls back to 'personal' when nothing matches. */
export function detectCategory(idea: string): CategoryKey {
  const text = idea.toLowerCase()
  for (const key of Object.keys(CATEGORIES) as CategoryKey[]) {
    if (key === 'personal') continue
    if (CATEGORIES[key].keywords.some((kw) => text.includes(kw))) return key
  }
  return 'personal'
}

export const IDEA_CHIPS = ['Get in shape', 'Save for a house', 'Learn Spanish', 'Get a promotion', 'Read more books']

export const IDEA_PLACEHOLDERS = [
  'get healthier',
  'save for a house',
  'learn spanish',
  'get a promotion',
  'read more books',
  'run a 5k',
]

export const UNIT_OPTIONS = ['km', 'miles', 'kg', 'lbs', '$', 'sessions', 'books', 'lessons', 'pages', '%', 'days']
