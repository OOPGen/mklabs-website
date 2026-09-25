import { useLayoutEffect, useRef, useState } from 'react'

/**
 * Fades content in as it scrolls into view.
 *
 * Every page is prerendered to HTML, so the first paint happens before any
 * JavaScript runs. Content therefore starts in its `enter` phase: a pure-CSS
 * entrance that plays from that first paint (and leaves the content visible
 * for crawlers and no-JS visitors). Once the app is running, anything still
 * below the fold is hidden again — before the browser paints — and faded in
 * when it is scrolled to.
 *
 * Under `prefers-reduced-motion` the CSS forces it fully visible,
 * so content is never trapped behind an animation.
 */
export default function Reveal({
  children,
  delay = 0,
  direction,
  as: Tag = 'div',
  className = '',
  ...rest
}) {
  const ref = useRef(null)
  const [phase, setPhase] = useState('enter') // enter | armed | is-visible

  useLayoutEffect(() => {
    const el = ref.current
    // no IntersectionObserver (very old browser) → leave it shown
    if (!el || typeof IntersectionObserver === 'undefined') return

    // already on screen: its entrance is playing (or has played) — leave it be
    const { top, bottom } = el.getBoundingClientRect()
    if (bottom > 0 && top < window.innerHeight) return

    // in a layout effect, so it is hidden before the browser paints
    setPhase('armed')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase('is-visible')
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      data-direction={direction}
      style={{ '--reveal-delay': `${delay}ms` }}
      className={`reveal ${phase} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}
