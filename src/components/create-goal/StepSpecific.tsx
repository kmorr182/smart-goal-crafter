import { TextArea, Button } from 'serious-component-library'
import { SmartStep } from './SmartStep'
import type { CategoryInfo } from '../../data/categories'

export interface StepSpecificProps {
  value: string
  onChange: (value: string) => void
  filled: boolean
  category: CategoryInfo
}

export function StepSpecific({ value, onChange, filled, category }: StepSpecificProps) {
  return (
    <SmartStep
      stepKey="s"
      title="Specific"
      prompts={[
        'What exactly will you do — and where, or with whom?',
        'What would someone watching you succeed actually see?',
        'Is there a more specific version of this goal hiding underneath it?',
      ]}
      filled={filled}
      delayMs={0}
    >
      <TextArea
        aria-label="What exactly will you do — and where, or with whom?"
        placeholder={`e.g. ${category.example.specific}`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={280}
        fullWidth
      />
      <div style={{ marginTop: 8 }}>
        <Button variant="ghost" size="sm" onClick={() => onChange(category.example.specific)}>
          Use an example
        </Button>
      </div>
    </SmartStep>
  )
}
