import { useEffect, useState } from 'react'
import Button from './Button.jsx'
import Reveal from './Reveal.jsx'
import Section, { Container, SectionHead } from './Section.jsx'

/**
 * Live offers, managed from /admin.
 *
 * Renders nothing at all when there is nothing to show — no empty heading, no
 * skeleton, no layout gap. A site with no current promotion should look like a
 * site that was designed without one.
 */
export default function Promotions() {
  const [promotions, setPromotions] = useState([])

  useEffect(() => {
    let cancelled = false

    fetch('/api/promotions')
      .then((response) => (response.ok ? response.json() : { promotions: [] }))
      .then((data) => {
        if (!cancelled) setPromotions(Array.isArray(data.promotions) ? data.promotions : [])
      })
      .catch(() => {
        /* offline or endpoint missing — the section simply stays hidden */
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (promotions.length === 0) return null

  return (
    <Section tone="tint">
      <Container>
        <SectionHead
          center
          kicker="🎉 What's on now"
          title={promotions.length === 1 ? 'Current offer' : 'Current offers'}
          lead="Running right now at MKLabs. Talk to us before these close."
        />

        <div
          className={`mt-12 grid gap-5 ${
            promotions.length === 1 ? 'max-w-2xl mx-auto' : 'sm:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {promotions.map((promotion, index) => (
            <Reveal
              key={promotion.id}
              delay={index * 80}
              className="flex h-full flex-col rounded-2xl border border-iris/30 bg-white p-6 shadow-lg shadow-night/5 dark:border-iris/25 dark:bg-white/5"
            >
              {promotion.badge && (
                <span className="self-start rounded-full bg-gradient-to-r from-purple to-iris px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                  {promotion.badge}
                </span>
              )}

              <h3 className="mt-3 text-xl font-bold leading-snug">{promotion.title}</h3>

              {promotion.body && (
                <p className="mt-2 flex-1 whitespace-pre-line text-sm leading-relaxed text-night/65 dark:text-lavender/65">
                  {promotion.body}
                </p>
              )}

              {promotion.ctaLabel && promotion.ctaHref && (
                <div className="mt-5">
                  {promotion.ctaHref.startsWith('/') ? (
                    <Button to={promotion.ctaHref}>{promotion.ctaLabel}</Button>
                  ) : (
                    <Button href={promotion.ctaHref}>{promotion.ctaLabel}</Button>
                  )}
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
