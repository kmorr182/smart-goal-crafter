import { ToggleSwitch, useTheme } from 'serious-component-library'

/**
 * A light/dark switch. `resolvedTheme` (not `theme`) drives the checked state, since
 * ThemeProvider's default is 'system' — this shows whichever theme is actually on screen,
 * whether that came from an explicit choice or the OS preference. Flipping it always sets an
 * explicit 'light'/'dark', overriding 'system' from then on (persisted by ThemeProvider itself).
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <ToggleSwitch
      label={isDark ? 'Dark mode' : 'Light mode'}
      size="sm"
      showIcons={false}
      checked={isDark}
      onChange={(event) => setTheme(event.target.checked ? 'dark' : 'light')}
    />
  )
}
