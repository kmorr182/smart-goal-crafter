import type { CSSProperties } from 'react'
import type { StepKey } from '../../types/goal'
import styles from './StepDivider.module.css'

const STEP_RGB_VAR: Record<StepKey, string> = {
  s: 'var(--step-s-rgb)',
  m: 'var(--step-m-rgb)',
  a: 'var(--step-a-rgb)',
  r: 'var(--step-r-rgb)',
  t: 'var(--step-t-rgb)',
}

export interface StepDividerProps {
  /** The step this divider follows and the one it leads into — the gradient blends between them. */
  from: StepKey
  to: StepKey
}

/** A thin gradient rule between two steps, blending the color above into the color below. */
export function StepDivider({ from, to }: StepDividerProps) {
  return (
    <hr
      className={styles.divider}
      style={{ '--from-rgb': STEP_RGB_VAR[from], '--to-rgb': STEP_RGB_VAR[to] } as CSSProperties}
    />
  )
}
