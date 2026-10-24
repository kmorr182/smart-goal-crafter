import { useState } from 'react'
import type { ReactNode } from 'react'
import { Button } from 'serious-component-library'
import type { GoalDraft } from '../../types/goal'
import { buildGoalSentence } from '../../utils/sentence'
import styles from './ShareGoal.module.css'

export interface ShareGoalProps {
  draft: GoalDraft
  /** Disabled until the goal has enough content to be worth sharing (mirrors Save's gate). */
  disabled?: boolean
  /** Rendered at the end of the same button row, e.g. GoalPreviewPanel's "Save this goal." */
  children?: ReactNode
  /** The polished sentence from "Create recommendation", once the user has fetched one.
   * Shared in place of the plain assembled sentence when present. */
  polishedSentence?: string | null
}

const SHARE_TITLE = 'My SMART goal'
const SITE_URL = 'https://smartgoalcrafter.com'
// Frames sharing itself as the accomplishment ("I did this"), not just an announcement of
// intent — the invitation for the reader to do the same is left to the link + site name below
// rather than said outright here.
const LEAD_IN = "I'm challenging myself:"

/** Appended to whatever gets shared — the one thing that survives no matter which channel it
 * travels through (email body, tweet text, a plain paste), unlike an Open Graph tag or a
 * share-sheet title, neither of which apply here since there's no shareable URL per goal yet
 * (no backend to persist one against). */
function withAttribution(message: string): string {
  return `${message}\n\n— made with Smart Goal Crafter · ${SITE_URL}`
}

/** Lets the user send the finished goal via their own email client, X, or a plain copy — no account, no backend. */
export function ShareGoal({ draft, disabled = false, children, polishedSentence }: ShareGoalProps) {
  const [copied, setCopied] = useState(false)
  const sentence = polishedSentence ?? buildGoalSentence(draft)
  const message = `${LEAD_IN}\n\n${sentence}`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(withAttribution(message))
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard access denied — Email and Share on X below still work.
    }
  }

  function handleEmail() {
    const body = withAttribution(message)
    window.location.href = `mailto:?subject=${encodeURIComponent(SHARE_TITLE)}&body=${encodeURIComponent(body)}`
  }

  function handleTweet() {
    // The link alone, not the full withAttribution block — X's own intent UI already shows the
    // link as a rich card, so a second plain-text copy of it would be redundant and eats into
    // the 280-character limit the message itself may already be using a good chunk of.
    const text = `${message}\n\n${SITE_URL}`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.label}>Share this goal</div>
      <div className={styles.row}>
        <Button variant="outline" size="sm" disabled={disabled} onClick={handleEmail}>
          Share in email
        </Button>
        <Button variant="outline" size="sm" disabled={disabled} onClick={handleTweet}>
          Share on X
        </Button>
        <Button variant="outline" size="sm" disabled={disabled} onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy text'}
        </Button>
        {children}
      </div>
    </div>
  )
}
