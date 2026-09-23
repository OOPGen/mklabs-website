import { getProduct } from '../data/products.js'
import { contact, site, waLink } from '../data/site.js'

import AmbientOffice from '../components/AmbientOffice.jsx'
import Button from '../components/Button.jsx'
import ContactForm from '../components/ContactForm.jsx'
import DashboardPreview from '../components/DashboardPreview.jsx'
import Logo from '../components/Logo.jsx'
import Promotions from '../components/Promotions.jsx'
import Reveal from '../components/Reveal.jsx'
import Section, { Container, SectionHead } from '../components/Section.jsx'
import SocialRail from '../components/SocialRail.jsx'

const demoLink = waLink('Hello MKLabs! I would like a demo of MKLabs POS for my shop.')

/**
 * The three promises the hero closes on — dark, brand and light in turn, so the
 * band reads as one object rather than three repeated cards.
 */
const promises = [
  {
    title: 'Offline first',
    body: 'The till keeps selling when the line drops, and syncs itself the moment it returns.',
    tone: 'glass-dark text-lavender',
    rule: 'bg-lilac/40',
    muted: 'text-lavender/65',
  },
  {
    title: 'Stock that tracks itself',
    body: 'Every sale updates your stock, with a warning before a fast mover runs out.',
    tone: 'bg-purple text-white ring-1 ring-iris/30',
    rule: 'bg-white/40',
    muted: 'text-white/75',
  },
  {
    title: 'Running the same day',
    body: 'Installed on your counter and your staff trained, here in Bulawayo.',
    tone: 'bg-lavender text-night',
    rule: 'bg-purple/30',
    muted: 'text-night/65',
  },
]

/** The three objections that actually stop a Bulawayo retailer from buying. */
const objections = [
  {
    icon: '⚡',
    worry: '"What happens when the power or network goes?"',
    answer:
      'Nothing. Sales are written to the device and sync the moment you are back online. The queue keeps moving through a load-shedding block.',
  },
  {
    icon: '🧾',
    worry: '"My staff are not computer people."',
    answer:
      'Tap a category, tap a product, take payment. Most cashiers are serving customers unsupervised inside an afternoon, and we train your team on site.',
  },
  {
    icon: '📦',
    worry: '"I never know what stock I actually have."',
    answer:
      'Every sale updates stock instantly, and you get a low-stock warning before a fast mover runs out — not after a customer asks for it.',
  },
]

export default function PosLanding() {
  const pos = getProduct('pos')

  return (
    <>
      {/* ---------------------------------------------------------- HERO */}
      <header
        id="top"
        className="hero-compact relative flex min-h-svh flex-col overflow-hidden bg-night px-5 pb-10 pt-28 text-lavender sm:px-8 sm:pb-14 sm:pt-32"
      >
        <AmbientOffice src={pos.clientImage} />
        <SocialRail />

        <Container className="relative flex flex-1 flex-col justify-center">
          {/* my-auto: on a tall screen the spare height goes above and below the
              copy, which parks the band on the bottom edge of the hero. On a
              phone there is no spare height and it resolves to nothing. */}
          <div className="mx-auto my-auto max-w-3xl text-center">
            <Reveal className="flex justify-center">
              <span className="hero-badge glass-dark inline-flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4">
                <Logo src={pos.logo} alt="" size="xs" className="hero-badge-mark" />
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-lilac">
                  Point of sale
                </span>
              </span>
            </Reveal>

            <Reveal
              as="h1"
              delay={80}
              className="mt-7 text-[40px] font-bold leading-[1.02] tracking-tight sm:text-6xl xl:text-7xl"
            >
              Sell fast.
              <br />
              <span className="brand-gradient">Even offline.</span>
            </Reveal>

            {/* the letter-spaced line that names what the system actually holds */}
            <Reveal
              delay={150}
              className="hero-tag mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[11px] font-bold uppercase tracking-[0.34em] text-lavender/55 sm:text-xs"
            >
              <span>Sales</span>
              <span className="text-lilac/50" aria-hidden="true">
                ·
              </span>
              <span>Stock</span>
              <span className="text-lilac/50" aria-hidden="true">
                ·
              </span>
              <span>Profit</span>
            </Reveal>

            <Reveal as="p" delay={220} className="hero-lead mx-auto mt-6 max-w-xl text-base leading-relaxed text-lavender/70 sm:text-lg">
              A point-of-sale and stock system built for how shops in {site.city} actually trade —
              through load shedding, patchy lines and a queue that will not wait.
            </Reveal>

            <Reveal delay={300} className="hero-actions mt-9 flex justify-center">
              <div className="relative inline-flex flex-wrap items-center justify-center gap-3">
                <Button href={demoLink} variant="whatsapp">
                  💬 Book a free demo
                </Button>
                <Button href="#features" variant="ghost" className="!border-white/25 !text-lavender">
                  See how it works
                </Button>

                {/* the hand-lettered aside that overlaps the buttons */}
                <span
                  className="hero-sticker pointer-events-none absolute -right-7 -top-6 hidden -rotate-12 rounded-full bg-lilac px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-night shadow-lg shadow-night/40 sm:block"
                  aria-hidden="true"
                >
                  Free demo…!
                </span>
              </div>
            </Reveal>
          </div>

          {/* ---- the closing band: dark, brand, light ---- */}
          <div className="hero-band mt-14 grid gap-3 sm:mt-16 sm:grid-cols-3">
            {promises.map((promise, index) => (
              <Reveal
                key={promise.title}
                delay={380 + index * 90}
                className={`rounded-2xl p-5 ${promise.tone}`}
              >
                <span className={`block h-0.5 w-8 rounded-full ${promise.rule}`} aria-hidden="true" />
                <h2 className="mt-4 text-[11px] font-bold uppercase tracking-[0.22em]">{promise.title}</h2>
                <p className={`mt-2 text-sm leading-relaxed ${promise.muted}`}>{promise.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </header>

      <Promotions />

      {/* ---------------------------------------------------- OBJECTIONS */}
      <Section>
        <Container>
          <SectionHead
            center
            kicker="THE HONEST ANSWERS"
            title="What shop owners ask us first."
            lead="Three questions come up in almost every demo. Here is the straight answer to each."
          />

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {objections.map((item, index) => (
              <Reveal
                key={item.worry}
                delay={index * 90}
                className="rounded-2xl border border-night/10 bg-white p-6 dark:border-white/10 dark:bg-white/5"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-purple/10 text-xl dark:bg-iris/15">
                  {item.icon}
                </div>
                <h3 className="mt-4 text-[15px] font-bold italic text-purple dark:text-iris">{item.worry}</h3>
                <p className="mt-2 text-sm leading-relaxed text-night/65 dark:text-lavender/65">{item.answer}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------ FEATURES */}
      <Section tone="tint" id="features">
        <Container>
          <SectionHead
            center
            kicker="WHAT YOU GET"
            title="Everything the shop needs, in one system."
            lead="No modules to buy separately and no per-till licence. This is the whole thing."
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pos.features.map((feature, index) => (
              <Reveal
                key={feature.title}
                delay={index * 70}
                className="rounded-2xl border border-night/10 bg-white p-5 dark:border-white/10 dark:bg-white/5"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple/10 text-lg text-purple dark:bg-iris/15 dark:text-iris">
                  🛒
                </div>
                <h3 className="mt-4 text-[15px] font-bold">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-night/60 dark:text-lavender/60">{feature.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ----------------------------------------------------- THE SCREEN */}
      <Section tone="dark">
        <AmbientOffice src={pos.clientImage} />
        <Container className="relative">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal direction="left">
              <SectionHead
                tone="dark"
                kicker="YOUR DAY, ONE SCREEN"
                title="Open the till and the numbers are already there."
                lead="Takings, transactions and anything running low — per branch and per cashier, without exporting a thing."
              />

              <div className="mt-8 flex flex-wrap gap-3">
                <Button href={demoLink} variant="whatsapp">
                  💬 Book a free demo
                </Button>
              </div>
            </Reveal>

            <Reveal direction="zoom" delay={120}>
              <DashboardPreview dashboard={pos.dashboard} logo={pos.logo} />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* --------------------------------------------------------- PROOF */}
      <Section id="why">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal direction="left">
              <img
                src={pos.clientImage}
                alt={pos.clientCaption}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full rounded-3xl border border-night/10 object-cover shadow-2xl shadow-night/15 dark:border-white/10"
              />
              <p className="mt-3 text-sm text-night/55 dark:text-lavender/55">{pos.clientCaption}</p>
            </Reveal>

            <Reveal direction="right" delay={120}>
              <SectionHead kicker="WHO IT IS FOR" title="Built for the counter, not the boardroom." />

              <ul className="mt-7 grid gap-3">
                {pos.audience.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-night/10 bg-white px-4 py-3.5 text-[15px] font-semibold dark:border-white/10 dark:bg-white/5"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-purple/10 text-sm text-purple dark:bg-iris/15 dark:text-iris">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button href={demoLink} variant="whatsapp">
                  💬 Book a free demo
                </Button>
                <Button href={`tel:${contact.phones[0].tel}`} variant="ghost">
                  📞 {contact.phones[0].label}
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------- ENQUIRE */}
      <Section tone="dark" id="demo">
        <AmbientOffice src={pos.clientImage} intensity="strong" />
        <Container className="relative">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <SectionHead
                tone="dark"
                kicker="GET STARTED"
                title="See it running in your shop."
                lead="Tell us what you sell and we will show you the till set up for your products — free, no obligation."
              />

              <div className="mt-8 grid gap-3">
                <a
                  href={demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-dark flex min-h-[60px] items-center gap-3 rounded-2xl px-5 text-[15px] font-semibold"
                >
                  💬 WhatsApp {contact.phones[0].label}
                </a>
                <a
                  href={`tel:${contact.phones[1].tel}`}
                  className="glass-dark flex min-h-[60px] items-center gap-3 rounded-2xl px-5 text-[15px] font-semibold"
                >
                  📞 Call {contact.phones[1].label}
                </a>
                <a
                  href={`mailto:${contact.emails[0].address}`}
                  className="glass-dark flex min-h-[60px] items-center gap-3 rounded-2xl px-5 text-[15px] font-semibold"
                >
                  ✉️ {contact.emails[0].address}
                </a>
              </div>

              <p className="mt-6 text-sm text-lavender/60">{site.hours}</p>
            </div>

            <Reveal direction="right" delay={120}>
              <ContactForm />
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  )
}
