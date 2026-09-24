import { useCallback, useState } from 'react'

const STORAGE_KEY = 'mklabs-theme'

/**
 * Dark/light theme. public/theme.js has already applied the right class
 * before first paint, so the starting state is read straight from <html>
 * rather than recomputed — recomputing is what used to cause the flash.
 */
export default function useTheme() {
  const [dark, setDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  )

  const toggle = useCallback(() => {
    setDark((previous) => {
      const next = !previous
      document.documentElement.classList.toggle('dark', next)
      try {
        localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light')
      } catch {
        /* storage blocked — the choice lasts for this visit only */
      }
      return next
    })
  }, [])

  return [dark, toggle]
}
