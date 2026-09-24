import Reveal from './Reveal.jsx'

export function Container({ children, className = '' }) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-10 ${className}`}>
      {children}
    </div>
  )
}

const tones = {
  light: 'bg-paper text-night dark:bg-ink dark:text-lavender',
  tint: 'bg-lavender/50 text-night dark:bg-ink-2 dark:text-lavender',
  dark: 'bg-night text-lavender',
  // the black of the logo's own tile
  void: 'bg-void text-lavender',
}

export default function Section({
  children,
  tone = 'light',
  className = '',
  ...rest
}) {
  return (
    <section className={`relative overflow-hidden py-16 sm:py-24 ${tones[tone]} ${className}`} {...rest}>
      {children}
    </section>
  )
}

/** Kicker + heading + optional lead, used at the top of most sections. */
export function SectionHead({ kicker, title, lead, center = false, tone = 'light' }) {
  const onDark = tone === 'dark' || tone === 'void'
  const muted = onDark ? 'text-lavender/70' : 'text-night/65 dark:text-lavender/70'

  return (
    <div className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      {kicker && (
        <Reveal
          as="span"
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide ${
            onDark
              ? 'border-white/15 bg-white/5 text-lilac'
              : 'border-purple/15 bg-purple/5 text-purple dark:border-white/15 dark:bg-white/5 dark:text-lilac'
          }`}
        >
          {kicker}
        </Reveal>
      )}

      <Reveal as="h2" delay={80} className="mt-5 text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-[44px]">
        {title}
      </Reveal>

      {lead && (
        <Reveal as="p" delay={160} className={`mt-4 text-base leading-relaxed sm:text-lg ${muted}`}>
          {lead}
        </Reveal>
      )}
    </div>
  )
}
