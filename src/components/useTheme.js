import { useCallback, useSyncExternalStore } from 'react'

const STORAGE_KEY = 'mklabs-theme'

/* public/theme.js has already applied the right class before first paint, so
   <html> is the single source of truth — read from it, never recomputed.
   A store rather than state: the prerendered HTML is built without a theme,
   and this lets React hydrate against that, then switch to the real one. */
const listeners = new Set()
const subscribe = (onChange) => {
  listeners.add(onChange)
  return () => listeners.delete(onChange)
}
const getSnapshot = () => document.documentElement.classList.contains('dark')
const getServerSnapshot = () => false

/** Dark/light theme: [isDark, toggle]. */
export default function useTheme() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const toggle = useCallback(() => {
    const next = !getSnapshot()
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light')
    } catch {
      /* storage blocked — the choice lasts for this visit only */
    }
    listeners.forEach((listener) => listener())
  }, [])

  return [dark, toggle]
}
