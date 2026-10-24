import type { CSSProperties, ReactNode } from 'react'
import type { StepKey } from '../../types/goal'
import { STEP_ORDER, stepElementId } from '../../types/goal'
import { usePulseOnComplete } from '../../hooks/usePulseOnComplete'
import styles from './SmartStep.module.css'

const STEP_RGB_VAR: Record<StepKey, string> = {
  s: 'var(--step-s-rgb)',
  m: 'var(--step-m-rgb)',
  a: 'var(--step-a-rgb)',
  r: 'var(--step-r-rgb)',
  t: 'var(--step-t-rgb)',
}

const STEP_LETTER: Record<StepKey, string> = Object.fromEntries(
  STEP_ORDER.map(({ key, letter }) => [key, letter]),
) as Record<StepKey, string>

/** Short, letter-flavored flourish for the pinned note. Not a restatement of the field's
 * actual value (which is already visible in the input itself). */
const STEP_NOTE: Record<StepKey, string> = {
  s: 'crisp!',
  m: 'countable!',
  a: 'doable!',
  r: 'it matters!',
  t: 'locked in!',
}

export interface SmartStepProps {
  stepKey: StepKey
  title: string
  /**
   * Guiding question(s) for this step. The first is the primary ask, shown prominently;
   * any more are supporting angles meant to surface ideas a single question wouldn't —
   * shown as a shorter, quieter list underneath.
   */
  prompts: [string, ...string[]]
  /** Whether this step has meaningful content yet — drives the badge fill and pop animation. */
  filled: boolean
  /** Rendered next to the title, e.g. a "Suggest phrasing" action. */
  actions?: ReactNode
  /** Overrides the pinned note's default per-step text (see STEP_NOTE). For a step whose
   * content can make one phrasing wrong, like Achievable's over/under-confidence nudge. */
  noteText?: string
  /** Staggers this step's entrance animation behind the ones before it. */
  delayMs?: number
  children: ReactNode
}

/** The shell for one SMART step: letter badge, title, guiding question(s), and its field(s). */
export function SmartStep({ stepKey, title, prompts, filled, actions, noteText, delayMs = 0, children }: SmartStepProps) {
  const pulsing = usePulseOnComplete(filled)
  const [primaryPrompt, ...supportingPrompts] = prompts

  return (
    <div
      id={stepElementId(stepKey)}
      className={styles.step}
      style={{ '--step-rgb': STEP_RGB_VAR[stepKey], animationDelay: `${delayMs}ms` } as CSSProperties}
    >
      <div className={styles.head}>
        <div className={styles.badgeWrap}>
          <div
            className={[styles.letter, filled ? styles.filled : '', pulsing ? styles.pulse : '']
              .filter(Boolean)
              .join(' ')}
          >
            {STEP_LETTER[stepKey]}
          </div>
          {filled && (
            <div className={styles.pin} aria-hidden="true">
              <div className={styles.tape} />
              <div className={styles.note}>{noteText ?? STEP_NOTE[stepKey]}</div>
            </div>
          )}
        </div>
        <div className={styles.titleRow}>
          <div className={styles.title}>{title}</div>
          {actions}
        </div>
      </div>
      <div className={styles.prompt}>{primaryPrompt}</div>
      {supportingPrompts.length > 0 && (
        <ul className={styles.subPrompts}>
          {supportingPrompts.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}
      <div className={styles.body}>{children}</div>
    </div>
  )
}
