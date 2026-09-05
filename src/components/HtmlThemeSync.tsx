import { useEffect } from 'react'
import { useTheme } from 'serious-component-library'

/**
 * ThemeProvider applies `data-ruk-theme` to a wrapper <div> nested inside <body> — that's
 * correct for it (lets themes nest inside a subtree), but it means <body>'s own background
 * (set from --ruk-color-bg in index.css) sits *outside* that div. CSS custom properties only
 * cascade to descendants, so body — an ancestor of the themed div, not a descendant — never
 * sees the dark-mode override and stays stuck on the light-mode default.
 *
 * Mirrors the resolved theme onto <html> too, so page-chrome styles (body, and anything else
 * outside the app's own subtree) resolve the right token values. Renders nothing.
 */
export function HtmlThemeSync() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    document.documentElement.setAttribute('data-ruk-theme', resolvedTheme)
  }, [resolvedTheme])

  return null
}
