import { useEffect, useRef, useState } from 'react'

/**
 * True for one animation cycle whenever `filled` transitions from false to true — used to
 * trigger the "pop" a step's letter badge or meter dot plays the moment it's completed,
 * without replaying on every re-render while it stays filled (or when it becomes unfilled).
 */
export function usePulseOnComplete(filled: boolean, durationMs = 520): boolean {
  const [pulsing, setPulsing] = useState(false)
  const wasFilled = useRef(filled)

  useEffect(() => {
    if (filled && !wasFilled.current) {
      setPulsing(true)
      const timer = window.setTimeout(() => setPulsing(false), durationMs)
      wasFilled.current = filled
      return () => window.clearTimeout(timer)
    }
    wasFilled.current = filled
  }, [filled, durationMs])

  return pulsing
}
