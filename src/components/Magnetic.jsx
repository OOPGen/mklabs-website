import { useEffect, useRef } from 'react'

const SPRING = 'transform 600ms cubic-bezier(0.175, 0.885, 0.32, 1.275)'
const FOLLOW = 'transform 150ms ease-out'

const stillDevice = () =>
  typeof window === 'undefined' ||
  !window.matchMedia ||
  window.matchMedia('(prefers-reduced-motion: reduce), (hover: none)').matches

/**
 * Wrap any button or icon and it leans gently toward the mouse while the
 * pointer is over it, then springs back to where it was when the pointer leaves.
 *   - A wrapper moves, not the child, so the child keeps its own transforms
 *     (Button's active:scale, hover lifts...).
 *   - The position is written straight to the element's style inside
 *     requestAnimationFrame — no React state, so a mouse move never re-renders
 *     anything — and only `transform: translate3d` changes, which the browser
 *     composites on the GPU without redoing layout.
 *   - The pull is measured from an outer box that never moves, so it can't
 *     feed back into itself mid-animation.
 *   - Touch screens (no hover) and visitors asking for reduced motion get the
 *     plain, still element.
 *
 * `strength` is how far toward the cursor it moves, as a share of the cursor's
 * distance from the centre.
 */
export default function Magnetic({ children, strength = 0.35, disabled = false, className, style }) {
  const outer = useRef(null)
  const inner = useRef(null)
  const frame = useRef(0)

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  const moveTo = (x, y, transition) => {
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const el = inner.current
      if (!el) return
      el.style.transition = transition
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
    })
  }

  const onMouseMove = (e) => {
    const el = outer.current
    if (!el || disabled || stillDevice()) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    moveTo((e.clientX - cx) * strength, (e.clientY - cy) * strength, FOLLOW)
  }

  const onMouseLeave = () => moveTo(0, 0, SPRING)

  return (
    <span
      ref={outer}
      className={className}
      style={{ display: 'inline-block', ...style }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <span ref={inner} style={{ display: 'inline-block', willChange: 'transform' }}>
        {children}
      </span>
    </span>
  )
}
