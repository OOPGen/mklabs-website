import { services } from '../data/services.js'
import { contact, founder, site, waLink } from '../data/site.js'

import Button from '../components/Button.jsx'
import Logo from '../components/Logo.jsx'
import AmbientOffice from '../components/AmbientOffice.jsx'
import Orbs from '../components/Orbs.jsx'
import Reveal from '../components/Reveal.jsx'
import Section, { Container, SectionHead } from '../components/Section.jsx'
import usePageTitle from '../components/usePageTitle.js'

export default function About() {
  usePageTitle(
    'About MKLabs — Software company in Bulawayo',
    'MKLabs builds practical software for businesses, schools and lodges in Bulawayo, Zimbabwe. Meet founder Michael Junior Jere.'
  )

  return (
    <>
      <header className="relative overflow-hidden bg-night px-5 py-16 text-lavender sm:px-8 sm:py-24">
        <AmbientOffice intensity="strong" />
        <Container className="relative">
          <SectionHead
            tone="dark"
            kicker="About MKLabs"
            title="We build technology with purpose."
            lead={`MKLabs is a software development and technology company creating practical digital solutions for businesses, schools, lodges and organisations in ${site.city}, ${site.country}.`}
          />
        </Container>
      </header>

      {/* ------------------------------------------------------- FOUNDER */}
      <Section>
        <Container>
          <Reveal
            direction="zoom"
            className="overflow-hidden rounded-3xl border border-night/10 bg-white dark:border-white/10 dark:bg-white/5"
          >
            <div className="grid lg:grid-cols-2">
              <div className="relative min-h-[300px] bg-ink">
                <img
                  src={founder.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />

                <div className="absolute left-5 top-5 flex items-center gap-3 rounded-full border border-white/15 bg-ink/70 px-3.5 py-2 backdrop-blur-md">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-purple to-midnight text-[11px] font-bold text-white">
                    {founder.initials}
                  </span>
                  <span>
                    <span className="block text-xs font-bold text-white">{founder.name}</span>
                    <span className="block text-[10px] text-white/60">Founder · MKLabs</span>
                  </span>
                </div>

                <div className="absolute inset-x-5 bottom-5 text-white">
                  <div className="text-xl font-bold leading-tight">{site.tagline}</div>
                </div>
              </div>

              <div className="p-6 sm:p-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-purple/15 bg-purple/5 px-4 py-1.5 text-xs font-semibold text-purple dark:border-white/15 dark:bg-white/5 dark:text-lilac">
                  👋 Meet the founder
                </span>

                <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">{founder.name}</h2>
                <div className="mt-1.5 text-sm font-semibold text-purple dark:text-iris">
                  {founder.role} · MKLabs · {site.city}
                </div>

                <p className="mt-6 text-base leading-relaxed">
                  <strong>I started MKLabs with a simple belief:</strong> {founder.belief}
                </p>

                {founder.bio.map((paragraph) => (
                  <p key={paragraph} className="mt-4 text-[15px] leading-relaxed text-night/65 dark:text-lavender/65">
                    {paragraph}
                  </p>
                ))}

                <div className="mt-6 rounded-2xl border border-iris/25 bg-iris/8 p-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-purple dark:text-iris">
                    Why work with MKLabs?
                  </div>
                  <p className="mt-1.5 text-sm">{founder.why}</p>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Button href={waLink(`Hello Michael! I saw your story on the MKLabs site.`)} variant="whatsapp">
                    💬 WhatsApp Michael
                  </Button>
                  <Button href={`mailto:${contact.emails[0].address}`} variant="ghost">
                    ✉️ Email
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ------------------------------------------------------ SERVICES */}
      <Section tone="tint">
        <Container>
          <SectionHead
            center
            kicker="Services"
            title="Technology built around your needs."
            lead={`Whatever you need built, secured, connected or hosted — we handle it end to end, from ${site.city}.`}
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Reveal
                key={service.id}
                delay={index * 70}
                className="rounded-2xl border border-night/10 bg-white p-5 dark:border-white/10 dark:bg-white/5"
              >
                <Logo src={service.logo} size="sm" tone={service.dark ? 'dark' : 'light'} />
                <h3 className="mt-4 text-[15px] font-bold">{service.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-night/60 dark:text-lavender/60">{service.blurb}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ----------------------------------------------------------- CTA */}
      <Section tone="dark">
        <Orbs />
        <Container className="relative text-center">
          <Reveal as="h2" className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Let's talk about what you need.
          </Reveal>
          <Reveal as="p" delay={100} className="mx-auto mt-4 max-w-md text-base text-lavender/70">
            {site.hours} · {site.city}, {site.country}
          </Reveal>
          <Reveal delay={180} className="mt-8 flex flex-wrap justify-center gap-3">
            <Button to="/contact" variant="white">
              Send an enquiry
            </Button>
            <Button href={waLink('Hello MKLabs!')} variant="whatsapp">
              💬 {contact.phones[0].label}
            </Button>
          </Reveal>
        </Container>
      </Section>
    </>
  )
}
