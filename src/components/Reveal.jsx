import { useEffect, useRef, useState } from 'react'

/**
 * Fades content in as it scrolls into view.
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
  // no IntersectionObserver (very old browser) → just show it
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
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
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}
