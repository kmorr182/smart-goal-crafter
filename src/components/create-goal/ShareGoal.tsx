import { useState } from 'react'
import { Button } from 'serious-component-library'
import type { GoalDraft } from '../../types/goal'
import { buildGoalSentence } from '../../utils/sentence'
import styles from './ShareGoal.module.css'

export interface ShareGoalProps {
  draft: GoalDraft
  /** Disabled until the goal has enough content to be worth sharing (mirrors Save's gate). */
  disabled?: boolean
}

const SHARE_TITLE = 'My SMART goal'

// Mostly mobile browsers today — where it's available it's the better option (the user's own
// OS share sheet: Messages, Mail, whatever social apps they actually have installed), so it
// takes over from the manual email/X/copy row below rather than sitting alongside it.
const canUseWebShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

/** Lets the user send the finished goal via their own email client, X, or a plain copy — no account, no backend. */
export function ShareGoal({ draft, disabled = false }: ShareGoalProps) {
  const [copied, setCopied] = useState(false)
  const sentence = buildGoalSentence(draft)

  async function handleNativeShare() {
    try {
      await navigator.share({ title: SHARE_TITLE, text: sentence })
    } catch {
      // The user backed out of the share sheet, or it's unsupported despite the feature
      // check above (e.g. blocked by a permissions policy) — either way, nothing to show.
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(sentence)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard access denied — Email and Share on X below still work.
    }
  }

  function handleEmail() {
    window.location.href = `mailto:?subject=${encodeURIComponent(SHARE_TITLE)}&body=${encodeURIComponent(sentence)}`
  }

  function handleTweet() {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(sentence)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.label}>Share this goal</div>
      {canUseWebShare ? (
        <Button variant="outline" fullWidth disabled={disabled} onClick={handleNativeShare}>
          Share
        </Button>
      ) : (
        <div className={styles.row}>
          <Button variant="outline" size="sm" disabled={disabled} onClick={handleEmail}>
            Email
          </Button>
          <Button variant="outline" size="sm" disabled={disabled} onClick={handleTweet}>
            Share on X
          </Button>
          <Button variant="outline" size="sm" disabled={disabled} onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy text'}
          </Button>
        </div>
      )}
    </div>
  )
}
