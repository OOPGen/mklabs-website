import { useEffect, useState } from 'react'
import useReducedMotion from './useReducedMotion.js'

/**
 * Blurred office scenery behind dark sections.
 *
 * Real MKLabs client photography — glass-walled boardroom, lodge reception,
 * classroom, retail counter — pushed far out of focus so it reads as ambience
 * rather than a picture. Frosted glass panels then sit on top of it.
 *
 * `cycle` slowly crossfades between the four scenes. With Reduce Motion on it
 * holds the first frame, which still looks finished — nothing disappears.
 */

const scenes = [
  { src: '/client-financeflow-boardroom.webp', label: 'boardroom' },
  { src: '/client-lodgecloud-lodge.webp', label: 'lodge reception' },
  { src: '/client-learncloud-school.webp', label: 'classroom' },
  { src: '/client-pos-cashier.webp', label: 'retail counter' },
]

export default function AmbientOffice({
  cycle = false,
  interval = 7500,
  intensity = 'normal',
  src,
}) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)

  /* a still backdrop only needs one frame — don't fetch the other three */
  const frames = cycle ? scenes : [{ src: src || scenes[0].src, label: 'office' }]

  useEffect(() => {
    if (!cycle || reduced) return

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % scenes.length)
    }, interval)

    return () => clearInterval(timer)
  }, [cycle, reduced, interval])

  const scrim = intensity === 'strong' ? 'bg-night/74' : 'bg-night/52'

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* the scenery itself */}
      {frames.map((scene, position) => (
        <img
          key={scene.src}
          src={scene.src}
          alt=""
          loading={position === 0 ? 'eager' : 'lazy'}
          decoding="async"
          className="absolute inset-0 h-full w-full scale-110 object-cover transition-opacity duration-[2500ms] ease-in-out"
          style={{
            filter: 'blur(14px) saturate(125%)',
            opacity: position === index ? 0.9 : 0,
          }}
        />
      ))}

      {/* scrim — keeps every headline readable over a busy photo */}
      <div className={`absolute inset-0 ${scrim}`} />
      {/* anchors the top behind the nav and blends the bottom into the next section */}
      <div className="absolute inset-0 bg-gradient-to-b from-night/75 via-transparent to-night" />
      {/* extra shade on the left, where the copy sits */}
      <div className="absolute inset-0 bg-gradient-to-r from-night/80 via-night/10 to-transparent" />

      {/* a hint of brand colour, kept light so the room still reads through */}
      <div className="orb-a absolute -left-[10%] -top-[20%] h-[min(600px,90vw)] w-[min(600px,90vw)] rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(167,139,250,0.16),transparent_70%)] blur-3xl" />
      <div className="orb-b absolute -right-[12%] top-[26%] h-[min(520px,80vw)] w-[min(520px,80vw)] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(100,149,237,0.14),transparent_72%)] blur-3xl" />
    </div>
  )
}
