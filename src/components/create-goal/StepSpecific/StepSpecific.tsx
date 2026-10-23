import { TextArea, Button } from 'serious-component-library'
import { SmartStep } from '../SmartStep'
import type { CategoryInfo } from '../../../data/categories'

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
        'What specific thing will you need to do?',
        'Will you need anyone else\'s help?',
        'Where will you need to do this?',
      ]}
      filled={filled}
      delayMs={0}
    >
      <TextArea
        aria-label="What specific thing will you need to do?"
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
