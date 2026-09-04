import { Input } from 'serious-component-library'
import { SmartStep } from './SmartStep'
import { daysFromToday, todayIso } from '../../utils/date'
import styles from './StepTimebound.module.css'

export interface StepTimeboundProps {
  value: string
  onChange: (value: string) => void
  filled: boolean
}

export function StepTimebound({ value, onChange, filled }: StepTimeboundProps) {
  const days = daysFromToday(value)

  return (
    <SmartStep
      stepKey="t"
      title="Time-bound"
      prompts={[
        "What's your target date?",
        'What would push you to pick a sooner date? A later one?',
        "What's one point along the way you'd want to check in?",
      ]}
      filled={filled}
      delayMs={240}
    >
      <div className={styles.row}>
        <Input
          aria-label="Target date"
          type="date"
          min={todayIso()}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          style={{ maxWidth: 200 }}
        />
        {days !== null && (
          <span className={styles.daysLeft}>{days >= 0 ? `${days} days from today` : 'in the past'}</span>
        )}
      </div>
    </SmartStep>
  )
}
