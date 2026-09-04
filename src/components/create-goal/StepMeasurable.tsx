import { Input, Select, Button } from 'serious-component-library'
import { SmartStep } from './SmartStep'
import { UNIT_OPTIONS } from '../../data/categories'
import { EMPTY_QUANTITY_METRIC, EMPTY_MILESTONE_METRIC } from '../../types/goal'
import type { GoalMetric } from '../../types/goal'
import styles from './StepMeasurable.module.css'

export interface StepMeasurableProps {
  metric: GoalMetric
  onChange: (metric: GoalMetric) => void
  filled: boolean
}

export function StepMeasurable({ metric, onChange, filled }: StepMeasurableProps) {
  return (
    <SmartStep
      stepKey="m"
      title="Measurable"
      prompts={[
        "What number or outcome proves it's done?",
        'How will you track progress along the way, not just at the end?',
        "What would “good enough” look like versus your ideal outcome?",
      ]}
      filled={filled}
      delayMs={60}
    >
      <div className={styles.modeRow}>
        <Button
          size="sm"
          variant={metric.mode === 'quantity' ? 'primary' : 'outline'}
          onClick={() => onChange(EMPTY_QUANTITY_METRIC)}
        >
          Track a number
        </Button>
        <Button
          size="sm"
          variant={metric.mode === 'milestone' ? 'primary' : 'outline'}
          onClick={() => onChange(EMPTY_MILESTONE_METRIC)}
        >
          Single milestone
        </Button>
      </div>

      {metric.mode === 'quantity' ? (
        <div className={styles.row}>
          <Input
            label="Starting point"
            type="number"
            fullWidth
            maxLength={20}
            value={metric.start}
            onChange={(event) => onChange({ ...metric, start: event.target.value })}
          />
          <Input
            label="Target"
            type="number"
            fullWidth
            maxLength={20}
            placeholder="10"
            value={metric.target}
            onChange={(event) => onChange({ ...metric, target: event.target.value })}
          />
          <Select
            label="Unit"
            fullWidth
            placeholder="Choose…"
            value={metric.unit}
            onChange={(event) => onChange({ ...metric, unit: event.target.value })}
          >
            {UNIT_OPTIONS.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </Select>
        </div>
      ) : (
        <Input
          label="How will you know it's done?"
          fullWidth
          maxLength={200}
          placeholder="e.g. Certification exam passed"
          value={metric.criterion}
          onChange={(event) => onChange({ ...metric, criterion: event.target.value })}
        />
      )}
    </SmartStep>
  )
}
