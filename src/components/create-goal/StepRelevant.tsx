import { TextArea } from 'serious-component-library'
import { SmartStep } from './SmartStep'
import type { CategoryInfo } from '../../data/categories'

export interface StepRelevantProps {
  value: string
  onChange: (value: string) => void
  filled: boolean
  category: CategoryInfo
}

export function StepRelevant({ value, onChange, filled, category }: StepRelevantProps) {
  return (
    <SmartStep
      stepKey="r"
      title="Relevant"
      prompts={[
        'Why does this matter to you right now?',
        "What happens if you don't do this?",
        'How does this connect to something bigger you care about?',
      ]}
      filled={filled}
      delayMs={180}
    >
      <TextArea
        aria-label="Why does this matter to you right now? Completes the sentence In order to."
        placeholder={`e.g. In order to ${category.example.relevant}…`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={280}
        fullWidth
      />
    </SmartStep>
  )
}
