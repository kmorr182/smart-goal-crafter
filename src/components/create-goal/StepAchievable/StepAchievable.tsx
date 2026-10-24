import { Slider, TextArea } from 'serious-component-library'
import { SmartStep } from '../SmartStep'
import { achievabilitySuggestion, confidenceLabel } from '../../../utils/confidence'
import styles from './StepAchievable.module.css'

export interface StepAchievableProps {
  confidence: number
  onConfidenceChange: (value: number) => void
  note: string
  onNoteChange: (value: string) => void
  filled: boolean
}

export function StepAchievable({ confidence, onConfidenceChange, note, onNoteChange, filled }: StepAchievableProps) {
  const suggestion = achievabilitySuggestion(confidence)
  // Mirrors the suggestion Alert's own thresholds. The note should never celebrate "doable!"
  // whenever the Alert underneath it is suggesting the opposite.
  const noteText = confidence <= 3 ? 'big stretch!' : confidence >= 9 ? 'raise the bar?' : undefined

  return (
    <SmartStep
      stepKey="a"
      title="Achievable"
      prompts={[
        'On a scale of 1-10, how confident are you, given your time and resources?',
        'What do you already have going for you, skills, support, past experience?',
        "What's the most likely obstacle, and how would you handle it?",
      ]}
      filled={filled}
      noteText={noteText}
      delayMs={120}
    >
      <Slider
        min={1}
        max={10}
        step={1}
        value={confidence}
        onChange={onConfidenceChange}
        formatValue={(v) => `${v}/10 · ${confidenceLabel(v)}`}
        fullWidth
      />
      {suggestion && <div className={styles.suggestion}>{suggestion}</div>}
      <div style={{ marginTop: 12 }}>
        <TextArea
          aria-label="What will make this realistic — time, support, resources?"
          placeholder="What will make this realistic — time, support, resources?"
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          maxLength={280}
          fullWidth
        />
      </div>
    </SmartStep>
  )
}
