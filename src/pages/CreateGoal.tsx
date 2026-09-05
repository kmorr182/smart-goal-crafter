import { useRef, useState } from 'react'
import { IdeaPrompt } from '../components/create-goal/IdeaPrompt'
import { StepSpecific } from '../components/create-goal/StepSpecific'
import { StepDivider } from '../components/create-goal/StepDivider'
import { StepMeasurable } from '../components/create-goal/StepMeasurable'
import { StepAchievable } from '../components/create-goal/StepAchievable'
import { StepRelevant } from '../components/create-goal/StepRelevant'
import { StepTimebound } from '../components/create-goal/StepTimebound'
import { GoalPreviewPanel } from '../components/create-goal/GoalPreviewPanel'
import { CATEGORIES, detectCategory } from '../data/categories'
import { EMPTY_GOAL_DRAFT, computeCompletion } from '../types/goal'
import type { GoalDraft } from '../types/goal'
import styles from './CreateGoal.module.css'

export function CreateGoal() {
  const [idea, setIdea] = useState('')
  const [started, setStarted] = useState(false)
  const [draft, setDraft] = useState<GoalDraft>(EMPTY_GOAL_DRAFT)
  const [saved, setSaved] = useState(false)
  const builderRef = useRef<HTMLDivElement>(null)

  const completion = computeCompletion(draft)
  const category = CATEGORIES[draft.category]

  function handleContinue() {
    const detected = detectCategory(idea)
    setDraft((d) => ({ ...d, idea, category: detected }))
    setStarted(true)
    // Let the reveal animation start before scrolling, matching the prototype's feel.
    setTimeout(() => builderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
  }

  return (
    <main className={styles.page}>
      <IdeaPrompt value={idea} onChange={setIdea} onContinue={handleContinue} />

      {started && (
        <div className={styles.builder} ref={builderRef}>
          <div className={styles.builderGrid}>
            <div className={[styles.stepList, saved ? styles.dimmed : ''].filter(Boolean).join(' ')}>
              <StepSpecific
                value={draft.specific}
                onChange={(specific) => setDraft((d) => ({ ...d, specific }))}
                filled={completion.s}
                category={category}
              />
              <StepDivider from="s" to="m" />
              <StepMeasurable
                metric={draft.metric}
                onChange={(metric) => setDraft((d) => ({ ...d, metric }))}
                filled={completion.m}
              />
              <StepDivider from="m" to="a" />
              <StepAchievable
                confidence={draft.confidence}
                onConfidenceChange={(confidence) => setDraft((d) => ({ ...d, confidence }))}
                note={draft.achievableNote}
                onNoteChange={(achievableNote) => setDraft((d) => ({ ...d, achievableNote }))}
                filled={completion.a}
              />
              <StepDivider from="a" to="r" />
              <StepRelevant
                value={draft.relevant}
                onChange={(relevant) => setDraft((d) => ({ ...d, relevant }))}
                filled={completion.r}
                category={category}
              />
              <StepDivider from="r" to="t" />
              <StepTimebound
                value={draft.dueDate}
                onChange={(dueDate) => setDraft((d) => ({ ...d, dueDate }))}
                filled={completion.t}
              />
            </div>

            <GoalPreviewPanel
              draft={draft}
              completion={completion}
              saved={saved}
              onSave={() => setSaved(true)}
              onEdit={() => setSaved(false)}
            />
          </div>
        </div>
      )}
    </main>
  )
}
